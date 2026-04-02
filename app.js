let balanceChart;

function formatMoney(value) {
  const num = Number(value || 0);
  return "$" + num.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("et-EE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "Värskendus puudub";

  return date.toLocaleString("et-EE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function findNextMilestone(milestones) {
  return milestones.find(item => !item.reached);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderMilestones(milestones) {
  const wrap = document.getElementById("milestones");
  wrap.innerHTML = "";

  milestones.forEach(item => {
    const chip = document.createElement("div");
    chip.className = "milestone" + (item.reached ? " reached" : "");
    chip.textContent = `${item.reached ? "✅" : "•"} ${formatMoney(item.value)}`;
    wrap.appendChild(chip);
  });
}

function renderWarnings(warnings) {
  const wrap = document.getElementById("warnings");
  wrap.innerHTML = "";

  if (!warnings || !warnings.length) {
    const ok = document.createElement("div");
    ok.className = "warning ok";
    ok.textContent = "✅ Hetkel ühtegi suurt hoiatust ei ole. Grind läheb normilt.";
    wrap.appendChild(ok);
    return;
  }

  warnings.forEach(item => {
    const div = document.createElement("div");
    div.className = "warning";
    div.textContent = "⚠ " + item;
    wrap.appendChild(div);
  });
}

function renderEntries(entries) {
  const body = document.getElementById("entriesBody");
  body.innerHTML = "";

  [...entries].reverse().forEach(entry => {
    const tr = document.createElement("tr");
    const changeClass = Number(entry.change) >= 0 ? "positive" : "negative";

    tr.innerHTML = `
      <td>${formatDate(entry.date)}</td>
      <td>${formatMoney(entry.balance)}</td>
      <td class="${changeClass}">${formatMoney(entry.change)}</td>
      <td>${entry.source || "-"}</td>
      <td>${entry.note || "-"}</td>
    `;

    body.appendChild(tr);
  });
}

function renderChart(entries) {
  const ctx = document.getElementById("balanceChart");
  const labels = entries.map(item => formatDate(item.date));
  const balances = entries.map(item => Number(item.balance || 0));

  if (balanceChart) balanceChart.destroy();

  balanceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Balance",
        data: balances,
        borderColor: "#67d3ff",
        backgroundColor: "rgba(103, 211, 255, 0.18)",
        borderWidth: 3,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: "#b9c3d6" },
          grid: { color: "rgba(255,255,255,0.05)" }
        },
        y: {
          ticks: {
            color: "#b9c3d6",
            callback: (value) => "$" + Number(value).toLocaleString("en-US")
          },
          grid: { color: "rgba(255,255,255,0.05)" }
        }
      }
    }
  });
}

async function loadDashboard() {
  if (!CONFIG.apiUrl || CONFIG.apiUrl.includes("PASTE_YOUR_APPS_SCRIPT")) {
    setText("updatedAt", "Pane config.js faili oma Apps Script URL");
    return;
  }

  try {
    const response = await fetch(CONFIG.apiUrl + "?t=" + Date.now(), { cache: "no-store" });
    const data = await response.json();

    setText("updatedAt", "Uuendatud: " + formatDateTime(data.updatedAt));
    setText("goalAmount", formatMoney(data.goal));
    setText("currentBalance", formatMoney(data.currentBalance));
    setText("remaining", formatMoney(data.remaining));

    const lastChange = data.entries?.length ? Number(data.entries[data.entries.length - 1].change || 0) : 0;
    setText("todayChangeText", "Täna muutus: " + formatMoney(lastChange));

    const progress = Math.min(Math.max(Number(data.progressPct || 0) * 100, 0), 100);
    const progressText = progress.toFixed(1) + "%";
    setText("progressText", progressText);
    setText("progressInline", progressText);
    document.getElementById("progressBar").style.width = progress + "%";

    const nextMilestone = findNextMilestone(data.milestones || []);
    setText("milestoneText", nextMilestone ? `Järgmine milestone: ${formatMoney(nextMilestone.value)}` : "Kõik milestone'id tehtud");

    if (data.projectedDate) {
      setText("projectedDate", formatDate(data.projectedDate));
      setText("projectedDays", `${data.projectedDays} päeva tempoga`);
    } else {
      setText("projectedDate", "-");
      setText("projectedDays", "Tempo puudub");
    }

    setText("avgGrowth", formatMoney(data.avgDailyGrowth));
    setText("streak", String(data.streak));
    setText("streakMini", `${data.streak} päeva`);

    if (data.bestDay) {
      setText("bestDay", `${formatDate(data.bestDay.date)} (${formatMoney(data.bestDay.change)})`);
    } else {
      setText("bestDay", "-");
    }

    if (data.worstDay) {
      setText("worstDay", `${formatDate(data.worstDay.date)} (${formatMoney(data.worstDay.change)})`);
    } else {
      setText("worstDay", "-");
    }

    renderMilestones(data.milestones || []);
    renderWarnings(data.warnings || []);
    renderEntries(data.entries || []);
    renderChart(data.entries || []);
  } catch (error) {
    console.error(error);
    setText("updatedAt", "Andmete laadimine ebaõnnestus");
    const warnings = document.getElementById("warnings");
    warnings.innerHTML = '<div class="warning">⚠ Kontrolli, et Apps Script URL oleks õige ja deploy oleks Anyone with the link.</div>';
  }
}

document.getElementById("refreshBtn").addEventListener("click", loadDashboard);
loadDashboard();
setInterval(loadDashboard, 60000);
