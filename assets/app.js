
const API = "api/voco.php";
const GROUP_A = "SRT526";
const GROUP_B = "LOG26";

const $ = (s) => document.querySelector(s);
const state = {
  date: null,
  weekStart: null,
  group: "SRT526",
  groups: []
};

function ymd(d){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function parseYmd(s){ return new Date(`${s}T12:00:00`); }
function addDays(s, n){ const d=parseYmd(s); d.setDate(d.getDate()+n); return ymd(d); }
function startOfWeek(s){
  const d=parseYmd(s), day=(d.getDay()+6)%7;
  d.setDate(d.getDate()-day);
  return ymd(d);
}
function estDate(s){
  return new Intl.DateTimeFormat("et-EE",{weekday:"long",day:"numeric",month:"long"}).format(parseYmd(s));
}
function mins(t){ if(!t)return null; const [h,m]=t.split(":").map(Number); return h*60+m; }
function hm(n){ return `${String(Math.floor(n/60)).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`; }
function fmtMin(n){
  if(!n) return "0 min";
  const h=Math.floor(n/60),m=n%60;
  if(h&&m)return `${h} h ${m} min`;
  if(h)return `${h} h`;
  return `${m} min`;
}

async function api(params){
  const url = new URL(API, location.href);
  Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,v));
  const r = await fetch(url,{cache:"no-store"});
  const data = await r.json();
  if(!r.ok || data.ok===false) throw new Error(data.error || "Andmete laadimine ebaõnnestus");
  return data;
}

function getNextSchoolDate(){
  const now = new Date();
  let d = new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);
  // "järgmine päev": homme; nädalavahetusel liigume esmaspäevale
  d.setDate(d.getDate()+1);
  while(d.getDay()===0 || d.getDay()===6) d.setDate(d.getDate()+1);
  return ymd(d);
}

async function loadCompare(){
  $("#loading").hidden=false; $("#errorBox").hidden=true; $("#carContent").hidden=true;
  try{
    const data = await api({action:"compare",date:state.date,a:GROUP_A,b:GROUP_B});
    renderCompare(data);
    $("#carContent").hidden=false;
  }catch(e){
    $("#errorBox").textContent=e.message;
    $("#errorBox").hidden=false;
  }finally{
    $("#loading").hidden=true;
  }
}

function renderCompare(data){
  $("#dateBox").innerHTML=`<div>${estDate(data.date)}</div>`;
  const a=data.groups[GROUP_A]||[], b=data.groups[GROUP_B]||[];
  const first=a.length?mins(a[0].start):null, firstB=b.length?mins(b[0].start):null;
  const last=a.length?mins(a[a.length-1].end):null, lastB=b.length?mins(b[b.length-1].end):null;
  const morning=(first!==null&&firstB!==null)?Math.abs(first-firstB):0;
  const evening=(last!==null&&lastB!==null)?Math.abs(last-lastB):0;
  const morningWho=(first===null||firstB===null)?"—":(first>firstB?"SRT":(firstB>first?"LOG":"—"));
  const eveningWho=(last===null||lastB===null)?"—":(last<lastB?"SRT":lastB<last?"LOG":"—");
  const earliest=[first,firstB].filter(v=>v!==null).sort((x,y)=>x-y)[0] ?? null;
  const total=morning+evening;
  let score=Math.max(0,100-Math.round(total/3));
  if(first===null||firstB===null) score=70;

  $("#depart").textContent=earliest===null?"—":hm(Math.max(0,earliest-25));
  $("#departText").textContent=earliest===null?"Sellel päeval pole sõitu vaja planeerida.":`Näidisena 25 min enne kõige varasemat tundi (${hm(earliest)}).`;
  $("#morningWho").textContent=morningWho;
  $("#morningWait").textContent=fmtMin(morning);
  $("#eveningWho").textContent=eveningWho;
  $("#eveningWait").textContent=fmtMin(evening);
  $("#scoreBig").textContent=score+"%";
  $("#aiScore").textContent=score+"/100";
  $("#aiDay").textContent=estDate(data.date);

  let scoreText,statusText,statusClass,aiTitle,aiText,aiTip;
  if(first===null && firstB===null){
    scoreText="Mõlemal on vaba."; statusText="väga lihtne"; statusClass="good";
    aiTitle="Täna pole kummalgi tunde"; aiText="Autoga pole midagi kokku sobitada."; aiTip="Pole midagi planeerida.";
  } else if(first===null || firstB===null){
    scoreText="Ainult ühel on tunnid."; statusText="lihtne"; statusClass="good";
    aiTitle="Ainult ühel on kool"; aiText="Ühist aega pole vaja kokku sobitada."; aiTip="Auto läheb selle järgi, kellel tunnid on.";
  } else if(morning<=20 && evening<=30){
    scoreText="Ajad sobivad hästi."; statusText="hea päev"; statusClass="good";
    aiTitle="Täna sobib hästi koos minna"; aiText="Mõlema grupi koolipäev algab ja lõpeb üsna samal ajal."; aiTip="Minge koos ja tulge koos tagasi.";
  } else {
    scoreText=total>120?"Ootamist tuleb päris palju.":"Natuke ootamist tuleb.";
    statusText=total>120?"palju ootamist":"täitsa tehtav"; statusClass=total>120?"bad":"warn";
    aiTitle=morning>60?"Hommikul peab üks liiga vara tulema":"Hommikul on ajad veidi erinevad";
    aiText=`Hommikul on tundide alguse vahe ${fmtMin(morning)}. Pärast kooli on lõpuaja vahe ${fmtMin(evening)}.`;
    aiTip=morning>90?"Kui võimalik, võiks varasema algusega inimene hommikul eraldi minna. Pärast kooli saab koos tagasi tulla.":"Kui ootamine ei sega, võib koos minna. Kui segab, tasub ainult üks ots eraldi teha.";
  }
  $("#scoreText").textContent=scoreText;
  $("#statusPill").textContent=statusText;
  $("#statusPill").className="status "+statusClass;
  $("#aiTitle").textContent=aiTitle; $("#aiText").textContent=aiText; $("#aiTip").textContent=aiTip;

  renderTimeline(a,b,{morning,morningWho,first,firstB});
  $("#sourceNote").textContent = data.source==="live" ? "Andmed tulevad VOCO-st." : "Praegu kasutatakse demoandmeid, kuni VOCO päringu aadress on seadistatud.";
}

function renderTimeline(a,b,m){
  const host=$("#timeline"); host.innerHTML="";
  const all=[...a,...b];
  const minStart = Math.min(8*60, ...(all.map(x=>mins(x.start)).filter(Number.isFinite)));
  const maxEnd = Math.max(16*60, ...(all.map(x=>mins(x.end)).filter(Number.isFinite)));
  const start=Math.floor(minStart/60)*60, end=Math.ceil(maxEnd/60)*60, total=end-start;
  const H=390, y=x=>((x-start)/total)*H;

  for(let h=start/60;h<=end/60;h+=2){
    const pos=y(h*60);
    const t=document.createElement("div");t.className="hour";t.style.top=(pos-5)+"px";t.textContent=String(h).padStart(2,"0")+":00";
    const l=document.createElement("div");l.className="line";l.style.top=pos+"px";
    host.append(t,l);
  }
  const add=(arr,cls)=>{
    arr.forEach(e=>{
      const el=document.createElement("div"); el.className="lesson "+cls;
      el.style.top=Math.max(0,y(mins(e.start)))+"px";
      el.style.height=Math.max(42,y(mins(e.end))-y(mins(e.start)))+"px";
      el.innerHTML=`<div class="time">${e.start}–${e.end}</div><div class="name">${e.title||"Tund"}</div><div class="room">${e.room||""}</div>`;
      host.appendChild(el);
    });
  };
  add(a,"srt"); add(b,"log");

  if(m.morning>30 && m.first!==null && m.firstB!==null){
    const x=Math.min(m.first,m.firstB), z=Math.max(m.first,m.firstB);
    const w=document.createElement("div");w.className="wait";w.style.top=y(x)+"px";w.style.height=Math.max(26,y(z)-y(x))+"px";
    w.innerHTML=`<span>${m.morningWho} ootab ${fmtMin(m.morning)}</span>`;host.appendChild(w);
  }
}

async function loadGroups(){
  try{
    const data=await api({action:"groups"});
    state.groups=data.groups||[];
    renderGroupResults("");
  }catch(e){
    state.groups=[{code:"SRT526",name:"Mootorsõidukite remonditehnoloogia"},{code:"LOG26",name:"Logistika"}];
  }
}
function renderGroupResults(q){
  const up=q.trim().toUpperCase();
  const list=state.groups.filter(g=>!up || g.code.toUpperCase().includes(up) || (g.name||"").toUpperCase().includes(up));
  $("#results").innerHTML=list.length ? list.map(g=>`<button class="result" type="button" data-group="${g.code}"><span class="result-code">${g.code}</span><span class="result-name">${g.name||""}</span></button>`).join("") : `<div class="result-name" style="padding:14px;text-align:left">Sellist gruppi ei leidnud.</div>`;
  $("#results").querySelectorAll("[data-group]").forEach(btn=>btn.addEventListener("click",()=>chooseGroup(btn.dataset.group)));
}
function chooseGroup(code){
  state.group=code;
  const g=state.groups.find(x=>x.code===code);
  $("#groupSearch").value=g?`${g.code} ${g.name||""}`:code;
  $("#searchWrap").classList.remove("open");
  loadWeek();
}

async function loadWeek(){
  try{
    const data=await api({action:"schedule",group:state.group,week:state.weekStart});
    renderWeek(data);
  }catch(e){
    $("#weekGrid").innerHTML=`<div style="padding:16px;grid-column:1/-1">${e.message}</div>`;
  }
}
function renderWeek(data){
  $("#groupTitle").textContent=data.group;
  const start=parseYmd(data.week_start), end=new Date(start); end.setDate(end.getDate()+6);
  $("#weekLabel").innerHTML=`<div>${start.getDate()}. ${start.toLocaleString("et-EE",{month:"short"})} – ${end.getDate()}. ${end.toLocaleString("et-EE",{month:"short"})}<span>${start.getFullYear()}</span></div>`;
  const days=["Esmaspäev","Teisipäev","Kolmapäev","Neljapäev","Reede"];
  const keys=(data.days||[]).slice(0,5);
  const slots=[
    ["08:30","10:00"],["10:15","11:45"],["11:55","14:00"],["14:10","15:40"],["15:50","17:20"]
  ];
  let html=`<div class="cell head">Kell</div>${days.map(d=>`<div class="cell head">${d}</div>`).join("")}`;
  slots.forEach(slot=>{
    html+=`<div class="cell timecell">${slot[0]}<br>–<br>${slot[1]}</div>`;
    keys.forEach(day=>{
      const events=(day.lessons||[]).filter(e=>mins(e.start)<mins(slot[1]) && mins(e.end)>mins(slot[0]));
      html+=`<div class="cell">${events.length?events.map(e=>`<div class="event">${e.title||"Tund"}<small>${e.start}–${e.end}${e.room?` · ${e.room}`:""}${e.teacher?` · ${e.teacher}`:""}</small></div>`).join(""):`<span class="empty-cell"></span>`}</div>`;
    });
  });
  $("#weekGrid").innerHTML=html;
  $("#sourceNote").textContent=data.source==="live"?"Andmed tulevad VOCO-st.":"Demoandmed. Live-ühendus lülitatakse sisse api/config.php failis.";
}

$("#prevDay").addEventListener("click",()=>{state.date=addDays(state.date,-1);loadCompare()});
$("#nextDay").addEventListener("click",()=>{state.date=addDays(state.date,1);loadCompare()});
$("#prevWeek").addEventListener("click",()=>{state.weekStart=addDays(state.weekStart,-7);loadWeek()});
$("#nextWeek").addEventListener("click",()=>{state.weekStart=addDays(state.weekStart,7);loadWeek()});
$("#groupSearch").addEventListener("focus",()=>{$("#searchWrap").classList.add("open");renderGroupResults($("#groupSearch").value)});
$("#groupSearch").addEventListener("input",e=>{$("#searchWrap").classList.add("open");renderGroupResults(e.target.value)});
$("#openGroup").addEventListener("click",()=>{$("#searchWrap").classList.add("open");$("#groupSearch").focus()});
document.addEventListener("click",e=>{if(!e.target.closest("#searchWrap")&&!e.target.closest("#openGroup"))$("#searchWrap").classList.remove("open")});

state.date=getNextSchoolDate();
state.weekStart=startOfWeek(state.date);
loadGroups().then(()=>loadWeek());
loadCompare();
