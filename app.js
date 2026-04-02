let charts = {};

const randomEventPool = [
  { title: 'Lucky Flip', text: 'Sa said ootamatu hea diili. Kujutletav kasu: +$24,000', type: 'good' },
  { title: 'Police Fine', text: 'RP maailmas tuli trahv kaela. Kujutletav kahju: -$18,000', type: 'bad' },
  { title: 'Business Pop-Off', text: 'Täna läks hustle eriti hästi. Kujutletav kasu: +$63,000', type: 'good' },
  { title: 'Quiet Day', text: 'Rahulik päev. Midagi ulmet ei juhtunud, aga grind jätkub.', type: 'neutral' },
  { title: 'High Roller Client', text: 'Keegi maksis premium hinda. Kujutletav kasu: +$41,000', type: 'good' },
  { title: 'Unexpected Repair', text: 'Midagi läks katki ja raha lendas. Kujutletav kahju: -$11,500', type: 'bad' }
];

function money(n) {
  return '$' + Number(n || 0).toLocaleString('en-US');
}

function shortDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('et-EE');
}

function longDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('et-EE', { year: 'numeric', month: 'long', day: 'numeric' });
}

function changeClass(value) {
  if (value > 0) return 'change-positive';
  if (value < 0) return 'change-negative';
  return 'change-neutral';
}

function animateNumber(el, target, prefix = '$', suffix = '') {
  if (!el) return;
  const duration = 900;
  const start = performance.now();
  const from = 0;
  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(from + (target - from) * eased);
    el.textContent = prefix + value.toLocaleString('en-US') + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function getGrindStatus(data) {
  if (!data.entries?.length) return { label: 'NO DATA', desc: 'Pole veel piisavalt andmeid.' };
  const last3 = data.entries.slice(-3).map(e => Number(e.change || 0));
  const avg3 = last3.length ? last3.reduce((a,b)=>a+b,0) / last3.length : 0;
  if (avg3 >= 20000) return { label: 'ON FIRE', desc: 'Viimased päevad on väga tugevad.' };
  if (avg3 > 0) return { label: 'STEADY', desc: 'Tempo on stabiilne ja liigub üles.' };
  if (avg3 === 0) return { label: 'IDLE', desc: 'Liikumine on paigal.' };
  return { label: 'STRUGGLING', desc: 'Viimased päevad on olnud rasked.' };
}

function getWealthLevel(balance) {
  if (balance >= 1000000) return ['MILLIONAIRE', 'Sa oled kohale jõudnud.'];
  if (balance >= 750000) return ['HIGH ROLLER', 'Lõpp on juba lähedal.'];
  if (balance >= 500000) return ['BOSS MODE', 'Pool milli on koos.'];
  if (balance >= 250000) return ['BUSINESSMAN', 'Tugev bankroll on käes.'];
  if (balance >= 100000) return ['HUSTLER', 'Esimene suurem tase käes.'];
  return ['STARTER', 'Esimesed sammud suure eesmärgi suunas.'];
}

function getDailyMission(data) {
  const current = Number(data.currentBalance || 0);
  const avg = Number(data.avgDailyGrowth || 0);
  const options = [
    `Tee täna vähemalt ${money(Math.max(5000, Math.round(avg || 10000)))} kasvu.`,
    `Hoia bankroll üle ${money(Math.ceil(current / 10000) * 10000)}.`,
    `Ära lase tänast muutust miinusesse.`,
    `Suru järgmise milestone'ini: ${nextMilestone(data)}.`
  ];
  const key = new Date().toISOString().slice(0,10);
  const index = Array.from(key).reduce((a, c) => a + c.charCodeAt(0), 0) % options.length;
  return options[index];
}

function nextMilestone(data) {
  const steps = [100000, 250000, 500000, 750000, 1000000];
  const next = steps.find(v => data.currentBalance < v);
  return next ? money(next) : 'All milestones cleared';
}

function buildSessionSummary(data) {
  const last = data.entries?.[data.entries.length - 1];
  if (!last) return 'Pole veel piisavalt kirjeid, et summaryt teha.';
  const status = getGrindStatus(data);
  const tone = last.change > 0
    ? `Viimane päev lõpetas plussis ${money(last.change)}.`
    : last.change < 0
      ? `Viimane päev sai löögi ${money(Math.abs(last.change))}.`
      : 'Viimane päev jäi nulli.';
  return `${tone} Praegune bankroll on ${money(data.currentBalance)} ja staatus on ${status.label}. Kui sama tempo jätkub, on järgmine suur checkpoint ${nextMilestone(data)}.`;
}

function getAchievements(data) {
  const entries = data.entries || [];
  const balance = Number(data.currentBalance || 0);
  const streak = Number(data.streak || 0);
  const positiveDays = entries.filter(e => (e.change || 0) > 0).length;
  const best = entries.reduce((max, e) => Math.max(max, Number(e.change || 0)), 0);
  const worst = entries.reduce((min, e) => Math.min(min, Number(e.change || 0)), 0);

  return [
    { icon: '💵', title: 'First 100k', desc: 'Saavuta vähemalt $100,000.', unlocked: balance >= 100000 },
    { icon: '🏦', title: 'Quarter Mil', desc: 'Saavuta vähemalt $250,000.', unlocked: balance >= 250000 },
    { icon: '👑', title: 'Half Mil Club', desc: 'Saavuta vähemalt $500,000.', unlocked: balance >= 500000 },
    { icon: '🔥', title: 'Hot Streak', desc: '3 päeva järjest positiivne muutus.', unlocked: streak >= 3 },
    { icon: '📈', title: 'Momentum', desc: 'Vähemalt 5 positiivset päeva.', unlocked: positiveDays >= 5 },
    { icon: '🚀', title: 'Big Score', desc: 'Ühel päeval vähemalt +$50,000.', unlocked: best >= 50000 },
    { icon: '🛡️', title: 'Survivor', desc: 'Ela üle vähemalt -$50,000 päev.', unlocked: worst <= -50000 },
    { icon: '💎', title: 'Million Mission', desc: 'Jõua $1,000,000-ni.', unlocked: balance >= 1000000 }
  ];
}

async function fetchData() {
  const response = await fetch(CONFIG.apiUrl + '?t=' + Date.now());
  if (!response.ok) throw new Error('API request failed');
  return response.json();
}

function setUpdated(data) {
  document.querySelectorAll('#updatedAt').forEach(el => {
    el.textContent = new Date(data.updatedAt).toLocaleString('et-EE');
  });
}

function setSidebarCommon(data) {
  const [level, desc] = getWealthLevel(data.currentBalance);
  const wealthLevel = document.getElementById('wealthLevel');
  const wealthDescription = document.getElementById('wealthDescription');
  if (wealthLevel) wealthLevel.textContent = level;
  if (wealthDescription) wealthDescription.textContent = desc;

  const mission = getDailyMission(data);
  const dailyMission = document.getElementById('dailyMission');
  const dailyMissionLarge = document.getElementById('dailyMissionLarge');
  if (dailyMission) dailyMission.textContent = mission;
  if (dailyMissionLarge) dailyMissionLarge.textContent = mission;

  const status = getGrindStatus(data);
  document.querySelectorAll('#grindStatusBadge').forEach(el => {
    el.textContent = status.label;
  });
}

function renderDashboard(data) {
  animateNumber(document.getElementById('currentBalance'), Number(data.currentBalance || 0));
  animateNumber(document.getElementById('remaining'), Number(data.remaining || 0));
  const progressEl = document.getElementById('progressText');
  if (progressEl) progressEl.textContent = ((data.progressPct || 0) * 100).toFixed(1) + '%';
  const bar = document.getElementById('progressBar');
  if (bar) bar.style.width = Math.min((data.progressPct || 0) * 100, 100) + '%';
  const projectedDate = document.getElementById('projectedDate');
  if (projectedDate) projectedDate.textContent = data.projectedDate ? longDate(data.projectedDate) : '—';
  const paceText = document.getElementById('paceText');
  if (paceText) paceText.textContent = data.projectedDays ? `${data.projectedDays} päeva veel praeguse tempoga.` : 'Tempo vajab rohkem positiivseid päevi.';

  const avgGrowth = document.getElementById('avgGrowth');
  if (avgGrowth) animateNumber(avgGrowth, Number(data.avgDailyGrowth || 0));
  const streak = document.getElementById('streak');
  if (streak) streak.textContent = data.streak || 0;
  const bestDay = document.getElementById('bestDay');
  if (bestDay) bestDay.textContent = data.bestDay ? `${shortDate(data.bestDay.date)} · ${money(data.bestDay.change)}` : '—';
  const worstDay = document.getElementById('worstDay');
  if (worstDay) worstDay.textContent = data.worstDay ? `${shortDate(data.worstDay.date)} · ${money(data.worstDay.change)}` : '—';

  const milestones = document.getElementById('milestones');
  if (milestones) {
    milestones.innerHTML = '';
    (data.milestones || []).forEach(m => {
      const div = document.createElement('div');
      div.className = 'milestone' + (m.reached ? ' reached' : '');
      div.textContent = money(m.value);
      milestones.appendChild(div);
    });
  }

  const warningsBox = document.getElementById('warnings');
  if (warningsBox) {
    warningsBox.innerHTML = '';
    if (!data.warnings?.length) {
      const ok = document.createElement('div');
      ok.className = 'warning ok';
      ok.textContent = 'No warnings. Grind looks clean right now.';
      warningsBox.appendChild(ok);
    } else {
      data.warnings.forEach(w => {
        const div = document.createElement('div');
        div.className = 'warning';
        div.textContent = '⚠ ' + w;
        warningsBox.appendChild(div);
      });
    }
  }

  const summary = document.getElementById('sessionSummary');
  if (summary) summary.textContent = buildSessionSummary(data);

  const entriesBody = document.getElementById('entriesBody');
  if (entriesBody) {
    entriesBody.innerHTML = '';
    [...(data.entries || [])].reverse().slice(0, 8).forEach(entry => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${shortDate(entry.date)}</td>
        <td>${money(entry.balance)}</td>
        <td class="${changeClass(entry.change)}">${money(entry.change)}</td>
        <td>${entry.source || '-'}</td>
        <td>${entry.note || '-'}</td>
      `;
      entriesBody.appendChild(tr);
    });
  }

  renderLineChart('balanceChart', data.entries || [], e => e.balance, 'Balance History');
}

function renderStats(data) {
  const entries = data.entries || [];
  const positive = entries.filter(e => (e.change || 0) > 0);
  const negative = entries.filter(e => (e.change || 0) < 0);
  const hitRate = entries.length ? (positive.length / entries.length) * 100 : 0;
  const biggestJump = positive.reduce((m,e)=>Math.max(m, e.change || 0), 0);

  document.getElementById('positiveDays').textContent = positive.length;
  document.getElementById('negativeDays').textContent = negative.length;
  document.getElementById('hitRate').textContent = hitRate.toFixed(1) + '%';
  document.getElementById('biggestJump').textContent = money(biggestJump);

  renderBarChart('changeChart', {
    labels: ['Positive', 'Negative', 'Neutral'],
    values: [positive.length, negative.length, entries.length - positive.length - negative.length]
  }, 'Day Type');

  const sourceTotals = {};
  entries.forEach(e => {
    const key = e.source && e.source !== '-' ? e.source : 'Määramata';
    sourceTotals[key] = (sourceTotals[key] || 0) + Math.max(0, Number(e.change || 0));
  });
  renderDoughnutChart('sourceChart', sourceTotals, 'Sources');

  const bestRuns = [...entries].sort((a,b)=>(b.change||0)-(a.change||0)).slice(0,5);
  const worstRuns = [...entries].sort((a,b)=>(a.change||0)-(b.change||0)).slice(0,5);
  renderMiniList('bestRuns', bestRuns.map(e => `<strong>${shortDate(e.date)}</strong> · <span class="change-positive">${money(e.change)}</span>`));
  renderMiniList('worstRuns', worstRuns.map(e => `<strong>${shortDate(e.date)}</strong> · <span class="change-negative">${money(e.change)}</span>`));
}

function renderAchievementsPage(data) {
  const achievements = getAchievements(data);
  const grid = document.getElementById('achievementsGrid');
  if (grid) {
    grid.innerHTML = '';
    achievements.forEach(a => {
      const card = document.createElement('div');
      card.className = 'achievement-card ' + (a.unlocked ? 'unlocked' : 'locked');
      card.innerHTML = `
        <div class="achievement-icon">${a.icon}</div>
        <h4>${a.title}</h4>
        <p class="muted">${a.desc}</p>
        <div class="achievement-status">${a.unlocked ? 'Unlocked' : 'Locked'}</div>
      `;
      grid.appendChild(card);
    });
  }
  const count = achievements.filter(a => a.unlocked).length;
  const countEl = document.getElementById('achievementCount');
  if (countEl) countEl.textContent = count;

  const locked = achievements.filter(a => !a.unlocked).slice(0, 3);
  renderMiniList('nextTargets', locked.map(a => `<strong>${a.icon} ${a.title}</strong><br><span class="muted">${a.desc}</span>`));
  renderMiniList('milestoneTimeline', (data.milestones || []).map(m => `${m.reached ? '✅' : '⬜'} ${money(m.value)}`));
}

function renderEventsPage(data) {
  const rpJournal = document.getElementById('rpJournal');
  if (rpJournal) rpJournal.textContent = buildRPJournal(data);
  const missionTips = document.getElementById('missionTips');
  if (missionTips) missionTips.textContent = buildMissionTips(data);
  const cityStatus = document.getElementById('cityStatus');
  if (cityStatus) {
    renderMiniList('cityStatus', [
      `<strong>Grind status:</strong> ${getGrindStatus(data).label}`,
      `<strong>Wealth level:</strong> ${getWealthLevel(data.currentBalance)[0]}`,
      `<strong>Next milestone:</strong> ${nextMilestone(data)}`,
      `<strong>Session summary:</strong> ${buildSessionSummary(data)}`
    ]);
  }

  const button = document.getElementById('eventButton');
  if (button) {
    button.addEventListener('click', () => {
      const event = randomEventPool[Math.floor(Math.random() * randomEventPool.length)];
      localStorage.setItem('freezy-random-event', JSON.stringify(event));
      renderSavedEvent();
    });
  }
  renderSavedEvent();
}

function renderSavedEvent() {
  const box = document.getElementById('randomEventBox');
  if (!box) return;
  const saved = localStorage.getItem('freezy-random-event');
  if (!saved) return;
  const event = JSON.parse(saved);
  box.innerHTML = `<strong>${event.title}</strong><br>${event.text}`;
}

function buildRPJournal(data) {
  const last = data.entries?.[data.entries.length - 1];
  if (!last) return 'No RP journal yet.';
  const status = getGrindStatus(data).label;
  const level = getWealthLevel(data.currentBalance)[0];
  return `Täna lõpetasid sessiooni summaga ${money(data.currentBalance)}. Viimane muutus oli ${money(last.change)} ja overall vibe on ${status}. Su karakteri rahaline staatus on praegu ${level}. Kui sama grind jätkub, siis järgmine suur peatus on ${nextMilestone(data)}.`;
}

function buildMissionTips(data) {
  return `Tänane mission: ${getDailyMission(data)} Väldi suuri miinuspäevi, sest need löövad projected 1M kuupäeva kohe kaugemale. Hoia vähemalt üks positiivne muutus sees, et streak elus püsiks.`;
}

function renderMiniList(id, items) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = '';
  items.forEach(html => {
    const item = document.createElement('div');
    item.className = 'mini-item';
    item.innerHTML = html;
    el.appendChild(item);
  });
}

function renderLineChart(id, entries, valueGetter, label) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const labels = entries.map(e => shortDate(e.date));
  const values = entries.map(valueGetter);
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart(canvas, {
    type: 'line',
    data: { labels, datasets: [{ label, data: values, tension: 0.35, fill: true }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#edf2ff' } } },
      scales: {
        x: { ticks: { color: '#9db0d9' }, grid: { color: 'rgba(255,255,255,.05)' } },
        y: { ticks: { color: '#9db0d9' }, grid: { color: 'rgba(255,255,255,.05)' } }
      }
    }
  });
}

function renderBarChart(id, payload, label) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart(canvas, {
    type: 'bar',
    data: { labels: payload.labels, datasets: [{ label, data: payload.values }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#edf2ff' } } },
      scales: {
        x: { ticks: { color: '#9db0d9' }, grid: { color: 'rgba(255,255,255,.05)' } },
        y: { ticks: { color: '#9db0d9' }, grid: { color: 'rgba(255,255,255,.05)' } }
      }
    }
  });
}

function renderDoughnutChart(id, sourceTotals, label) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const labels = Object.keys(sourceTotals);
  const values = Object.values(sourceTotals);
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart(canvas, {
    type: 'doughnut',
    data: { labels, datasets: [{ label, data: values }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#edf2ff' } }
      }
    }
  });
}

function showError(error) {
  document.body.insertAdjacentHTML('afterbegin', `<div style="position:fixed;top:14px;right:14px;z-index:9999;padding:12px 14px;border-radius:14px;background:#3b1420;border:1px solid rgba(255,124,144,.4);color:#fff;max-width:360px;">API error: ${error.message}</div>`);
}

async function init() {
  try {
    const data = await fetchData();
    setUpdated(data);
    setSidebarCommon(data);
    const page = document.body.dataset.page;
    if (page === 'dashboard') renderDashboard(data);
    if (page === 'stats') renderStats(data);
    if (page === 'achievements') renderAchievementsPage(data);
    if (page === 'events') renderEventsPage(data);
  } catch (error) {
    showError(error);
    console.error(error);
  }
}

init();
setInterval(init, 60000);
