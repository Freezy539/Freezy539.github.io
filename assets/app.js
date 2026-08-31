const API_BASE = "https://tunniplaan.worker391.workers.dev";
const GROUPS = {
  SRT526: { id: 2182, name: "Sõidukite remonditehnoloogia" },
  LOG26: { id: 2134, name: "Logistika" },
  INSA26: { id: 2167, name: "INSA26" }
};
const GROUP_A = "SRT526";
const GROUP_B = "LOG26";
const SNAPSHOT_KEY = "kooskooli.scheduleSnapshots.v2";
const CHANGE_KEY = "kooskooli.changeHistory.v2";
const THEME_KEY = "kooskooli.theme";
const DATA_CACHE_KEY = "kooskooli.weekData.v1";
const DEVICE_TOKEN_KEY = "kooskooli.deviceToken.v1";
const inflightWeeks = new Map();

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const state = {
  date: null,
  weekStart: null,
  group: GROUP_A,
  selectedGroups: [GROUP_A],
  weekCache: new Map(),
  currentCompare: null,
  menuWeek: null,
  weekLoadId: 0,
  compareLoadId: 0
};

function ymd(d){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function parseYmd(s){ return new Date(`${s}T12:00:00`); }
function addDays(s,n){ const d=parseYmd(s); d.setDate(d.getDate()+n); return ymd(d); }
function startOfWeek(s){ const d=parseYmd(s); const day=(d.getDay()+6)%7; d.setDate(d.getDate()-day); return ymd(d); }
function estDate(s, withYear=false){ return new Intl.DateTimeFormat("et-EE",{weekday:"long",day:"numeric",month:"long",...(withYear?{year:"numeric"}:{})}).format(parseYmd(s)); }
function shortDay(s){ return new Intl.DateTimeFormat("et-EE",{weekday:"short",day:"numeric",month:"numeric"}).format(parseYmd(s)); }
function cap(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : s; }
function mins(t){ if(!t) return null; const m=String(t).match(/(\d{1,2}):(\d{2})/); return m ? Number(m[1])*60+Number(m[2]) : null; }
function hm(n){ return Number.isFinite(n) ? `${String(Math.floor(n/60)).padStart(2,"0")}:${String(n%60).padStart(2,"0")}` : "—"; }
function fmtMin(n){ n=Math.max(0,Math.round(n||0)); const h=Math.floor(n/60),m=n%60; if(h&&m)return `${h} h ${m} min`; if(h)return `${h} h`; return `${m} min`; }
function schoolMove(s,dir){ let d=parseYmd(s); do{ d.setDate(d.getDate()+dir); }while(d.getDay()===0||d.getDay()===6); return ymd(d); }
function nextSchoolDate(from=new Date()){ let d=new Date(from.getFullYear(),from.getMonth(),from.getDate(),12); d.setDate(d.getDate()+1); while(d.getDay()===0||d.getDay()===6)d.setDate(d.getDate()+1); return ymd(d); }
function escapeHtml(v){ return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c])); }

function readJson(key,fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch{return fallback;} }
function writeJson(key,value){ try{ localStorage.setItem(key,JSON.stringify(value)); }catch{} }

function readWeekDisk(group,week){
  const all=readJson(DATA_CACHE_KEY,{});
  const hit=all[`${group}|${week}`];
  if(!hit || !Array.isArray(hit.lessons)) return null;
  return {group,week,lessons:hit.lessons,raw:null,stale:true,savedAt:hit.savedAt||0};
}
function writeWeekDisk(data){
  const all=readJson(DATA_CACHE_KEY,{});
  all[`${data.group}|${data.week}`]={lessons:data.lessons.map(snapshotLesson),savedAt:Date.now()};
  const entries=Object.entries(all).sort((a,b)=>(b[1]?.savedAt||0)-(a[1]?.savedAt||0)).slice(0,24);
  writeJson(DATA_CACHE_KEY,Object.fromEntries(entries));
}
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

function getDeviceToken(){
  try{ return localStorage.getItem(DEVICE_TOKEN_KEY) || ""; }catch{ return ""; }
}
function setDeviceToken(token){
  try{ localStorage.setItem(DEVICE_TOKEN_KEY, token); }catch{}
}
function clearDeviceToken(){
  try{ localStorage.removeItem(DEVICE_TOKEN_KEY); }catch{}
}
function authHeaders(extra={}){
  const token=getDeviceToken();
  return token ? {...extra, Authorization:`Bearer ${token}`} : extra;
}
async function checkDeviceAuth(){
  const token=getDeviceToken();
  if(!token) return null;
  try{
    const r=await fetch(`${API_BASE}/auth/check`,{headers:{Authorization:`Bearer ${token}`},cache:"no-store"});
    if(!r.ok){ if(r.status===401) clearDeviceToken(); return null; }
    const data=await r.json();
    return data?.authenticated ? data.device : null;
  }catch{
    return {id:null,name:"Salvestatud seade",offline:true};
  }
}
async function activateDevice(name,adminKey){
  const r=await fetch(`${API_BASE}/auth/activate`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name,adminKey})
  });
  let data={};
  try{ data=await r.json(); }catch{}
  if(!r.ok) throw new Error(data?.error || `Seadme lubamine ebaõnnestus (${r.status}).`);
  if(!data?.token) throw new Error("Server ei tagastanud seadme võtit.");
  setDeviceToken(data.token);
  return data;
}
function showAuthGate(message=""){
  const gate=$("#authGate");
  gate.hidden=false;
  $("#authError").hidden=!message;
  $("#authError").textContent=message;
  document.body.classList.add("auth-locked");
  setTimeout(()=>$("#deviceName")?.focus(),50);
}
function hideAuthGate(){
  $("#authGate").hidden=true;
  document.body.classList.remove("auth-locked");
}

async function fetchWeekFresh(group,week){
  const url=new URL(`${API_BASE}/api/tunniplaan`);
  url.searchParams.set("grupp",group);
  url.searchParams.set("nadal",week);
  let lastError;
  for(let attempt=0;attempt<2;attempt++){
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),7000);
    try{
      const r=await fetch(url,{cache:"no-store",signal:controller.signal,headers:authHeaders()});
      const text=await r.text();
      let raw;
      try{ raw=JSON.parse(text); }catch{ throw new Error("VOCO vastus ei olnud loetav JSON."); }
      if(!r.ok) throw new Error(raw?.error||`Tunniplaani laadimine ebaõnnestus (${r.status}).`);
      const lessons=normalizePayload(raw,group).sort(sortLessons);
      const data={group,week,lessons,raw,stale:false};
      state.weekCache.set(`${group}|${week}`,data);
      writeWeekDisk(data);
      detectChanges(group,week,lessons);
      return data;
    }catch(e){
      lastError=e?.name==="AbortError"?new Error("VOCO vastus võttis liiga kaua aega."):e;
      if(attempt===0) await sleep(450);
    }finally{ clearTimeout(timeout); }
  }
  throw lastError||new Error("Tunniplaani laadimine ebaõnnestus.");
}

async function apiWeek(group,week,{force=false}={}){
  const key=`${group}|${week}`;
  if(!force && state.weekCache.has(key)) return state.weekCache.get(key);
  if(!force){
    const disk=readWeekDisk(group,week);
    if(disk){ state.weekCache.set(key,disk); return disk; }
  }
  if(inflightWeeks.has(key)) return inflightWeeks.get(key);
  const job=fetchWeekFresh(group,week).finally(()=>inflightWeeks.delete(key));
  inflightWeeks.set(key,job);
  try{ return await job; }
  catch(e){
    const fallback=readWeekDisk(group,week);
    if(fallback){ state.weekCache.set(key,fallback); return fallback; }
    throw e;
  }
}

async function refreshWeekInBackground(group,week){
  try{ await fetchWeekFresh(group,week); }catch{}
}

function sortLessons(a,b){ return a.date.localeCompare(b.date) || (mins(a.start)||0)-(mins(b.start)||0) || a.title.localeCompare(b.title); }
function normalizeKey(k){ return String(k).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,""); }
function pick(obj,names){
  const entries=Object.entries(obj||{});
  for(const wanted of names){
    const n=normalizeKey(wanted);
    const hit=entries.find(([k])=>normalizeKey(k)===n);
    if(hit && hit[1]!==null && hit[1]!==undefined && hit[1]!=="") return hit[1];
  }
  return "";
}
function normalizeDate(v){
  if(!v) return "";
  const s=String(v).trim();
  let m=s.match(/(20\d{2})[-./](\d{1,2})[-./](\d{1,2})/);
  if(m) return `${m[1]}-${String(m[2]).padStart(2,"0")}-${String(m[3]).padStart(2,"0")}`;
  m=s.match(/(\d{1,2})[./](\d{1,2})[./](20\d{2})/);
  if(m) return `${m[3]}-${String(m[2]).padStart(2,"0")}-${String(m[1]).padStart(2,"0")}`;
  return "";
}
function normalizeTime(v){
  if(!v) return "";
  const m=String(v).match(/(\d{1,2})[:.](\d{2})/);
  return m ? `${String(m[1]).padStart(2,"0")}:${m[2]}` : "";
}
function normalizeRecord(obj,group,contextDate=""){
  if(!obj || typeof obj!=="object" || Array.isArray(obj)) return null;
  const date=normalizeDate(pick(obj,["kuupaev","kuupäev","date","paev","päev","kp"])) || normalizeDate(contextDate);
  const start=normalizeTime(pick(obj,["algus","start","algusaeg","kellaaegalgus","from"]));
  const end=normalizeTime(pick(obj,["lopp","lõpp","end","lopuaeg","lõpuaeg","kellaaaeglopp","to"]));
  if(!date || !start) return null;
  const title=String(pick(obj,["nimetus","aine","title","oppeaine","õppeaine","teema","moodul","sisu","tund"])||"Tund").trim();
  const room=String(pick(obj,["ruum","room","klass","koht"])||"").trim();
  const teacher=String(pick(obj,["opetaja","õpetaja","teacher","opetajad","õpetajad"])||"").trim();
  const recGroup=String(pick(obj,["grupp","group"])||group).trim();
  return {date,start,end,title,room,teacher,group:recGroup||group};
}
function normalizePayload(raw,group){
  const out=[];
  const seen=new Set();
  const walk=(node,contextDate="")=>{
    if(Array.isArray(node)){ node.forEach(x=>walk(x,contextDate)); return; }
    if(!node || typeof node!=="object") return;
    const rec=normalizeRecord(node,group,contextDate);
    if(rec){
      const key=[rec.date,rec.start,rec.end,rec.title,rec.room,rec.teacher].join("|");
      if(!seen.has(key)){ seen.add(key); out.push(rec); }
    }
    for(const [k,v] of Object.entries(node)){
      const date=normalizeDate(k)||contextDate;
      if(v && typeof v==="object") walk(v,date);
    }
  };
  walk(raw);
  return out;
}

function snapshotLesson(l){ return {date:l.date,start:l.start,end:l.end,title:l.title,room:l.room,teacher:l.teacher}; }
function exactKey(l){ return [l.date,l.start,l.end,l.title,l.room,l.teacher].join("|"); }
function similarity(a,b){
  if(a.date!==b.date) return -1;
  let s=0;
  if(a.title===b.title) s+=5;
  if(a.start===b.start) s+=3;
  if(a.end===b.end) s+=2;
  if(a.room===b.room) s+=1;
  if(a.teacher===b.teacher) s+=1;
  return s;
}
function detectChanges(group,week,lessons){
  const all=readJson(SNAPSHOT_KEY,{}); const k=`${group}|${week}`; const fresh=lessons.map(snapshotLesson); const old=all[k];
  if(Array.isArray(old)){
    const oldLeft=[...old], newLeft=[...fresh];
    for(let i=newLeft.length-1;i>=0;i--){
      const j=oldLeft.findIndex(o=>exactKey(o)===exactKey(newLeft[i]));
      if(j>=0){ oldLeft.splice(j,1); newLeft.splice(i,1); }
    }
    const changes=[];
    while(oldLeft.length && newLeft.length){
      let best={score:-1,oi:-1,ni:-1};
      oldLeft.forEach((o,oi)=>newLeft.forEach((n,ni)=>{const score=similarity(o,n);if(score>best.score)best={score,oi,ni};}));
      if(best.score<3) break;
      const before=oldLeft.splice(best.oi,1)[0], after=newLeft.splice(best.ni,1)[0];
      changes.push({type:"changed",group,week,before,after,at:Date.now()});
    }
    oldLeft.forEach(before=>changes.push({type:"removed",group,week,before,after:null,at:Date.now()}));
    newLeft.forEach(after=>changes.push({type:"added",group,week,before:null,after,at:Date.now()}));
    if(changes.length) addChanges(changes);
  }
  all[k]=fresh; writeJson(SNAPSHOT_KEY,all);
}
function addChanges(changes){
  const history=readJson(CHANGE_KEY,[]);
  const sig=x=>JSON.stringify([x.type,x.group,x.before,x.after]);
  const existing=new Set(history.map(sig));
  const unique=changes.filter(x=>!existing.has(sig(x)));
  if(unique.length){ writeJson(CHANGE_KEY,[...unique,...history].slice(0,100)); renderChanges(); showToast(`${unique.length} tunniplaani muudatus${unique.length===1?"":"t"}`); }
}
function describeDiff(c){
  if(c.type==="added") return `<b>Lisati:</b> ${lessonLabel(c.after)}`;
  if(c.type==="removed") return `<b>Eemaldati:</b> ${lessonLabel(c.before)}`;
  const parts=[]; const names={start:"algus",end:"lõpp",title:"aine",room:"ruum",teacher:"õpetaja",date:"kuupäev"};
  for(const key of ["date","start","end","title","room","teacher"]){
    if((c.before?.[key]||"")!==(c.after?.[key]||"")) parts.push(`<span><em>${names[key]}:</em> ${escapeHtml(c.before?.[key]||"—")} → <strong>${escapeHtml(c.after?.[key]||"—")}</strong></span>`);
  }
  return parts.join("");
}
function lessonLabel(l){ return `${cap(estDate(l.date))}, ${escapeHtml(l.start)}${l.end?`–${escapeHtml(l.end)}`:""} · ${escapeHtml(l.title)}${l.room?` · ${escapeHtml(l.room)}`:""}`; }
function renderChanges(){
  const list=readJson(CHANGE_KEY,[]); const host=$("#changesList"); const badge=$("#changeBadge");
  badge.hidden=!list.length; badge.textContent=Math.min(99,list.length);
  if(!list.length){ host.innerHTML=`<div class="empty-state"><span>✓</span><b>Praegu pole muudatusi</b><p>Kui VOCO tunniplaan pärast sinu eelmist vaatamist muutub, ilmub võrdlus siia.</p></div>`; return; }
  host.innerHTML=list.map(c=>`<article class="change-item ${c.type}"><div class="change-top"><span class="group-tag">${escapeHtml(c.group)}</span><time>${new Date(c.at).toLocaleString("et-EE",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</time></div><div class="change-title">${c.type==="changed"?`${cap(estDate(c.after?.date||c.before?.date))} · ${escapeHtml(c.after?.title||c.before?.title)}`:c.type==="added"?"Uus tund":"Tund eemaldati"}</div><div class="change-diff">${describeDiff(c)}</div></article>`).join("");
}

async function loadCompare(){
  const loadId=++state.compareLoadId;
  $("#loading").hidden=false; $("#errorBox").hidden=true;
  try{
    const week=startOfWeek(state.date);
    const [aWeek,bWeek]=await Promise.all([apiWeek(GROUP_A,week),apiWeek(GROUP_B,week)]);
    if(loadId!==state.compareLoadId) return;
    const a=aWeek.lessons.filter(x=>x.date===state.date), b=bWeek.lessons.filter(x=>x.date===state.date);
    state.currentCompare={date:state.date,a,b}; renderCompare(state.currentCompare); $("#carContent").hidden=false;
    state.menuWeek={week,a:aWeek.lessons,b:bWeek.lessons}; renderMenuStats();
    refreshWeekInBackground(GROUP_A,week); refreshWeekInBackground(GROUP_B,week);
  }catch(e){
    if(loadId!==state.compareLoadId) return;
    $("#errorBox").textContent=e.message; $("#errorBox").hidden=false;
  }finally{ if(loadId===state.compareLoadId) $("#loading").hidden=true; }
}

function renderCompare(data){
  $("#dateBox").innerHTML=`<div>${cap(estDate(data.date))}<span>${data.date}</span></div>`;
  $("#datePicker").value=data.date;
  const a=data.a,b=data.b;
  const first=a.length?Math.min(...a.map(x=>mins(x.start)).filter(Number.isFinite)):null;
  const firstB=b.length?Math.min(...b.map(x=>mins(x.start)).filter(Number.isFinite)):null;
  const last=a.length?Math.max(...a.map(x=>mins(x.end||x.start)).filter(Number.isFinite)):null;
  const lastB=b.length?Math.max(...b.map(x=>mins(x.end||x.start)).filter(Number.isFinite)):null;
  const morning=(first!==null&&firstB!==null)?Math.abs(first-firstB):0, evening=(last!==null&&lastB!==null)?Math.abs(last-lastB):0;
  const morningWho=(first===null||firstB===null)?"—":(first>firstB?GROUP_A:(firstB>first?GROUP_B:"—"));
  const eveningWho=(last===null||lastB===null)?"—":(last<lastB?GROUP_A:(lastB<last?GROUP_B:"—"));
  const earliest=[first,firstB].filter(Number.isFinite).sort((x,y)=>x-y)[0] ?? null;
  const total=morning+evening; let score=Math.max(0,100-Math.round(total/3)); if(first===null||firstB===null)score=70;
  $("#depart").textContent=earliest===null?"—":hm(Math.max(0,earliest-25));
  $("#departText").textContent=earliest===null?"Sõitu pole vaja planeerida.":`25 min enne kõige varasemat tundi (${hm(earliest)}).`;
  $("#morningWho").textContent=morningWho; $("#morningWait").textContent=first===null||firstB===null?"—":fmtMin(morning);
  $("#eveningWho").textContent=eveningWho; $("#eveningWait").textContent=last===null||lastB===null?"—":fmtMin(evening);
  $("#scoreBig").textContent=score+"%"; $("#aiScore").textContent=score+"/100"; $("#aiDay").textContent=cap(estDate(data.date));
  let scoreText,statusText,statusClass,aiTitle,aiText,aiTip;
  if(first===null&&firstB===null){ scoreText="Mõlemal on vaba.";statusText="vaba päev";statusClass="good";aiTitle="Mõlemal on vaba";aiText="Selleks päevaks VOCO tunniplaanis tunde ei ole.";aiTip="Autoga pole midagi kokku sobitada."; }
  else if(first===null||firstB===null){ const who=first===null?GROUP_B:GROUP_A;scoreText="Ainult ühel on tunnid.";statusText="lihtne";statusClass="good";aiTitle=`Ainult ${who} on koolis`;aiText="Ühist mineku- ja tulekuaega pole vaja sobitada.";aiTip=`Sõit saab käia ${who} päeva järgi.`; }
  else if(morning<=20&&evening<=30){ scoreText="Ajad sobivad hästi.";statusText="hea päev";statusClass="good";aiTitle="Koos minna on hea variant";aiText="Mõlema grupi koolipäev algab ja lõpeb üsna samal ajal.";aiTip="Minge koos ja tulge koos tagasi."; }
  else { scoreText=total>120?"Ootamist tuleb päris palju.":"Natuke ootamist tuleb.";statusText=total>120?"palju ootamist":"täitsa tehtav";statusClass=total>120?"bad":"warn";aiTitle=morning>60?"Hommikul on ajad üsna erinevad":"Päevad ei lähe päris kokku";aiText=`Hommikul on alguse vahe ${fmtMin(morning)} ja pärast kooli lõpu vahe ${fmtMin(evening)}.`;aiTip=morning>90?"Varasema algusega grupp võiks hommikul eraldi minna. Tagasisõitu saab veel eraldi vaadata.":"Kui ootamine ei sega, võib koos minna. Muidu tasub üks ots eraldi teha."; }
  $("#scoreText").textContent=scoreText; $("#statusPill").textContent=statusText; $("#statusPill").className="status "+statusClass;
  $("#aiTitle").textContent=aiTitle; $("#aiText").textContent=aiText; $("#aiTip").textContent=aiTip;
  renderTimeline(a,b,{morning,morningWho,first,firstB});
}

function renderTimeline(a,b,m){
  const host=$("#timeline"); host.innerHTML=""; const all=[...a,...b];
  if(!all.length){ host.style.height="300px"; host.innerHTML=`<div class="timeline-empty"><b>Vaba päev</b><span>Tunde ei ole.</span></div>`; return; }

  const starts=all.map(x=>mins(x.start)).filter(Number.isFinite);
  const ends=all.map(x=>mins(x.end||x.start)+(!x.end?45:0)).filter(Number.isFinite);
  const rawStart=Math.min(...starts), rawEnd=Math.max(...ends);
  const start=Math.floor((rawStart-30)/30)*30;
  const end=Math.ceil((rawEnd+30)/30)*30;
  const pxPerMinute=0.95;
  const H=Math.max(300,Math.round((end-start)*pxPerMinute));
  const y=x=>((x-start)/(end-start))*H;
  host.style.height=`${H}px`;

  for(let t=start;t<=end;t+=30){
    const pos=y(t);
    const isHour=t%60===0;
    const h=document.createElement("div");
    h.className="time-axis-label"+(isHour?" major":" minor");
    h.style.top=(pos-7)+"px";
    h.textContent=hm(t);
    const l=document.createElement("div");
    l.className="time-axis-line"+(isHour?" major":" minor");
    l.style.top=pos+"px";
    host.append(h,l);
  }

  const add=(arr,cls)=>arr.forEach(e=>{
    const st=mins(e.start), en=mins(e.end||e.start)+(!e.end?45:0);
    const el=document.createElement("div");
    el.className="lesson "+cls;
    el.style.top=Math.max(0,y(st))+"px";
    el.style.height=Math.max(44,y(en)-y(st))+"px";
    el.innerHTML=`<div class="time">${escapeHtml(e.start)}${e.end?`–${escapeHtml(e.end)}`:""}</div><div class="name">${escapeHtml(e.title)}</div><div class="room">${escapeHtml(e.room||e.teacher||"")}</div>`;
    host.appendChild(el);
  });
  add(a,"srt"); add(b,"log");

  if(m.morning>30&&m.first!==null&&m.firstB!==null){
    const x=Math.min(m.first,m.firstB),z=Math.max(m.first,m.firstB);
    const w=document.createElement("div");
    w.className="wait";
    w.style.top=y(x)+"px";
    w.style.height=Math.max(26,y(z)-y(x))+"px";
    w.innerHTML=`<span>${escapeHtml(m.morningWho)} ootab ${fmtMin(m.morning)}</span>`;
    host.appendChild(w);
  }
}

function groupMeta(code){ return GROUPS[code] || {name:code}; }
function ensureSelected(code){
  const set=new Set(state.selectedGroups);
  if(set.has(code)){
    if(set.size>1) set.delete(code);
  }else set.add(code);
  state.selectedGroups=[...set];
  state.group=state.selectedGroups[0]||GROUP_A;
  renderComparePicker();
  loadWeek();
}
function renderComparePicker(){
  const host=$("#comparePicker");
  if(!host) return;
  host.innerHTML=Object.keys(GROUPS).map(code=>`<label class="compare-choice ${state.selectedGroups.includes(code)?"selected":""}"><input type="checkbox" value="${code}" ${state.selectedGroups.includes(code)?"checked":""}><span class="compare-check">✓</span><span><b>${code}</b><small>${escapeHtml(groupMeta(code).name||"")}</small></span></label>`).join("");
  host.querySelectorAll('input[type="checkbox"]').forEach(inp=>inp.addEventListener("change",()=>ensureSelected(inp.value)));
}
function renderGroupResults(q=""){
  const up=q.trim().toUpperCase();
  const groups=Object.entries(GROUPS).map(([code,x])=>({code,...x})).filter(g=>!up||g.code.includes(up)||(g.name||"").toUpperCase().includes(up));
  $("#results").innerHTML=groups.length?groups.map(g=>`<button class="result" type="button" data-group="${g.code}"><span class="result-left"><span class="result-toggle ${state.selectedGroups.includes(g.code)?"on":""}">${state.selectedGroups.includes(g.code)?"✓":"+"}</span><span class="result-code">${g.code}</span></span><span class="result-name">${escapeHtml(g.name)}</span></button>`).join(""):`<div class="no-result">Sellist gruppi ei leidnud.</div>`;
  $$("#results [data-group]").forEach(btn=>btn.addEventListener("click",()=>{ensureSelected(btn.dataset.group);$("#groupSearch").value="";$("#searchWrap").classList.remove("open");}));
}
async function loadWeek(){
  const loadId=++state.weekLoadId;
  const groups=state.selectedGroups.length?state.selectedGroups:[GROUP_A];
  const cached=groups.map(g=>state.weekCache.get(`${g}|${state.weekStart}`)||readWeekDisk(g,state.weekStart));
  const hasAllCached=cached.every(Boolean);
  if(hasAllCached){
    cached.forEach(d=>state.weekCache.set(`${d.group}|${d.week}`,d));
    renderWeek(cached);
  }else{
    $("#weekGrid").innerHTML=`<div class="week-loading">Laen tunniplaane…</div>`;
    $("#mobileWeekList").innerHTML=`<div class="week-loading">Laen tunniplaane…</div>`;
  }
  try{
    const datasets=await Promise.all(groups.map(g=>fetchWeekFresh(g,state.weekStart).catch(()=>apiWeek(g,state.weekStart))));
    if(loadId!==state.weekLoadId) return;
    renderWeek(datasets);
  }catch(e){
    if(loadId!==state.weekLoadId) return;
    if(hasAllCached){
      $("#sourceNote").textContent="Näitan viimati salvestatud tunniplaani. VOCO värskendus ebaõnnestus ajutiselt.";
      return;
    }
    const msg=`<div class="week-loading error-text">${escapeHtml(e.message)}</div>`;
    $("#weekGrid").innerHTML=msg; $("#mobileWeekList").innerHTML=msg;
  }
}
function renderWeek(datasets){
  const groups=datasets.map(d=>d.group);
  const lessons=datasets.flatMap(d=>d.lessons.map(l=>({...l,group:d.group})));
  $("#groupTitle").textContent=groups.join(" + ");
  $("#compareHint").textContent=groups.length>1?`${groups.length} gruppi on samas vaates — värvid näitavad, kelle tund on kelle oma.`:"Vali veel üks grupp, kui tahad tunniplaane kõrvutada.";
  const start=parseYmd(state.weekStart),end=parseYmd(addDays(state.weekStart,6));
  $("#weekLabel").innerHTML=`<div>${start.getDate()}. ${start.toLocaleString("et-EE",{month:"short"})} – ${end.getDate()}. ${end.toLocaleString("et-EE",{month:"short"})}<span>${start.getFullYear()}</span></div>`;
  const days=[0,1,2,3,4].map(i=>addDays(state.weekStart,i));
  const slots=[];
  for(const l of lessons){ if(!slots.some(s=>s[0]===l.start&&s[1]===l.end))slots.push([l.start,l.end]); }
  slots.sort((a,b)=>mins(a[0])-mins(b[0]));
  const fallback=[["08:30","10:00"],["10:15","11:45"],["11:55","14:00"],["14:10","15:40"],["15:50","17:20"]];
  const rows=slots.length?slots:fallback;
  let html=`<div class="cell head">Kell</div>${days.map(d=>`<div class="cell head">${cap(new Intl.DateTimeFormat("et-EE",{weekday:"long"}).format(parseYmd(d)))}<small>${parseYmd(d).getDate()}.${parseYmd(d).getMonth()+1}</small></div>`).join("")}`;
  rows.forEach(slot=>{
    html+=`<div class="cell timecell"><b>${escapeHtml(slot[0])}</b><span>${escapeHtml(slot[1]||"")}</span></div>`;
    days.forEach(day=>{
      const events=lessons.filter(e=>e.date===day&&e.start===slot[0]).sort((a,b)=>groups.indexOf(a.group)-groups.indexOf(b.group));
      html+=`<div class="cell compare-cell">${events.map(e=>eventHtml(e,groups.length>1)).join("")}</div>`;
    });
  });
  $("#weekGrid").innerHTML=html;
  $("#mobileWeekList").innerHTML=days.map(day=>{
    const events=lessons.filter(e=>e.date===day).sort((a,b)=>(mins(a.start)-mins(b.start))||groups.indexOf(a.group)-groups.indexOf(b.group));
    return `<section class="mobile-day"><div class="mobile-day-head"><b>${cap(new Intl.DateTimeFormat("et-EE",{weekday:"long"}).format(parseYmd(day)))}</b><span>${parseYmd(day).getDate()}.${parseYmd(day).getMonth()+1}</span></div>${events.length?events.map(e=>`<div class="mobile-event group-${e.group.toLowerCase()}"><time>${escapeHtml(e.start)}${e.end?`–${escapeHtml(e.end)}`:""}</time><div><span class="mobile-group">${escapeHtml(e.group)}</span><b>${escapeHtml(e.title)}</b><span>${[e.room,e.teacher].filter(Boolean).map(escapeHtml).join(" · ")}</span></div></div>`).join(""):`<div class="mobile-free">Vaba</div>`}</section>`;
  }).join("");
  $("#sourceNote").textContent="Andmed tulevad VOCO-st Cloudflare Workeri kaudu.";
}
function eventHtml(e,showGroup=false){
  return `<div class="event group-${e.group.toLowerCase()}">${showGroup?`<span class="event-group">${escapeHtml(e.group)}</span>`:""}<b>${escapeHtml(e.title)}</b><small>${e.start}${e.end?`–${e.end}`:""}${e.room?` · ${escapeHtml(e.room)}`:""}${e.teacher?` · ${escapeHtml(e.teacher)}`:""}</small></div>`;
}

function dayMetrics(date,aAll,bAll){
  const a=aAll.filter(x=>x.date===date),b=bAll.filter(x=>x.date===date),all=[...a,...b];
  if(!all.length)return {date,score:0,load:0,a,b,text:"Mõlemal vaba"};
  const starts=all.map(x=>mins(x.start)).filter(Number.isFinite),ends=all.map(x=>mins(x.end||x.start)).filter(Number.isFinite);
  const earliest=Math.min(...starts),latest=Math.max(...ends),span=Math.max(0,latest-earliest);
  const classMin=all.reduce((s,x)=>s+Math.max(45,(mins(x.end||x.start)+(!x.end?45:0))-mins(x.start)),0);
  const fa=a.length?Math.min(...a.map(x=>mins(x.start))):null,fb=b.length?Math.min(...b.map(x=>mins(x.start))):null,la=a.length?Math.max(...a.map(x=>mins(x.end||x.start))):null,lb=b.length?Math.max(...b.map(x=>mins(x.end||x.start))):null;
  const mismatch=(fa!==null&&fb!==null?Math.abs(fa-fb):30)+(la!==null&&lb!==null?Math.abs(la-lb):30);
  let load=(Math.max(0,9*60-earliest)/60)*1.3 + span/90 + classMin/240 + mismatch/120; load=Math.min(10,Math.max(0,load));
  return {date,score:Math.round(load*10)/10,load,a,b,earliest,latest,span,classMin,mismatch,text:`${hm(earliest)}–${hm(latest)} · ${all.length} tundi/plokki`};
}
function renderMenuStats(){
  if(!state.menuWeek)return; const {week,a,b}=state.menuWeek; const days=[0,1,2,3,4].map(i=>dayMetrics(addDays(week,i),a,b)); const school=days.filter(x=>x.a.length||x.b.length);
  if(school.length){ const best=[...school].sort((x,y)=>x.score-y.score)[0],worst=[...school].sort((x,y)=>y.score-x.score)[0];$("#bestDay").textContent=cap(estDate(best.date));$("#bestText").textContent=`${best.score}/10 · ${best.text}`;$("#worstDay").textContent=cap(estDate(worst.date));$("#worstText").textContent=`${worst.score}/10 · ${worst.text}`; }
  else {$("#bestDay").textContent="Vaba nädal";$("#bestText").textContent="Tunde ei ole.";$("#worstDay").textContent="Vaba nädal";$("#worstText").textContent="Tunde ei ole.";}
  $("#weekRanking").innerHTML=days.map(d=>`<div class="rank-row"><span>${cap(new Intl.DateTimeFormat("et-EE",{weekday:"long"}).format(parseYmd(d.date)))}</span><div class="rank-bar"><i style="width:${d.score*10}%"></i></div><b>${d.score}/10</b></div>`).join("");
  renderTomorrow();
}
async function renderTomorrow(){
  const target=nextSchoolDate(); const week=startOfWeek(target);
  try{
    let a,b;
    if(state.menuWeek?.week===week){a=state.menuWeek.a;b=state.menuWeek.b;}else{const [aw,bw]=await Promise.all([apiWeek(GROUP_A,week),apiWeek(GROUP_B,week)]);a=aw.lessons;b=bw.lessons;}
    const d=dayMetrics(target,a,b); const score=Math.round(d.score); $("#tomorrowScore").textContent=`${score}/10`;$("#tomorrowMeter").style.width=`${score*10}%`;
    let label,text;if(score<=2){label="väga rahulik";text="Homne päev tundub üsna kerge.";}else if(score<=4){label="täitsa normaalne";text="Midagi hullu ei paista. Päev on üsna mõistlik.";}else if(score<=6){label="keskmine";text="Natuke planeerimist ja ootamist võib tulla, aga täiesti tehtav.";}else if(score<=8){label="päris karm";text="Pikk päev või kehvasti kokku jooksvad ajad teevad homse veidi tüütuks.";}else{label="väga karm";text="Varajane/pikk päev ja ajavahed annavad üsna tugeva kombo.";}
    $("#tomorrowLabel").textContent=`${cap(estDate(target))} · ${label}`;$("#tomorrowText").textContent=text;
    $("#tomorrowGroups").innerHTML=[GROUP_A,GROUP_B].map(g=>{const arr=(g===GROUP_A?d.a:d.b);if(!arr.length)return `<div><span>${g}</span><b>Vaba</b><small>Tunde pole</small></div>`;const st=Math.min(...arr.map(x=>mins(x.start))),en=Math.max(...arr.map(x=>mins(x.end||x.start)));return `<div><span>${g}</span><b>${hm(st)}–${hm(en)}</b><small>${arr.length} tundi/plokki</small></div>`;}).join("");
  }catch(e){ $("#tomorrowLabel").textContent="Ei saanud laadida";$("#tomorrowText").textContent=e.message; }
}

function openMenu(panel="changes"){$("#menuBackdrop").hidden=false;requestAnimationFrame(()=>{$("#menuBackdrop").classList.add("open");$("#menuPanel").classList.add("open");});$("#menuPanel").setAttribute("aria-hidden","false");$("#menuBtn").setAttribute("aria-expanded","true");document.body.classList.add("menu-open");switchMenu(panel);renderChanges();if(panel!=="appearance")renderMenuStats();}
function closeMenu(){$("#menuBackdrop").classList.remove("open");$("#menuPanel").classList.remove("open");$("#menuPanel").setAttribute("aria-hidden","true");$("#menuBtn").setAttribute("aria-expanded","false");document.body.classList.remove("menu-open");setTimeout(()=>{$("#menuBackdrop").hidden=true;},220);}
function switchMenu(panel){ $$(".menu-tab").forEach(x=>x.classList.toggle("active",x.dataset.panel===panel)); $$(".menu-section").forEach(x=>x.classList.toggle("active",x.dataset.section===panel)); if(panel==="tomorrow")renderTomorrow(); if(panel==="bestworst")renderMenuStats(); }
function applyTheme(value){ const actual=value==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):value;document.documentElement.dataset.theme=actual;$$('[data-theme-value]').forEach(x=>x.classList.toggle("selected",x.dataset.themeValue===value));const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=actual==="dark"?"#0e1013":"#f4f6f8"; }
function setTheme(value){localStorage.setItem(THEME_KEY,value);applyTheme(value);}
function showToast(text){const t=$("#toast");t.textContent=text;t.hidden=false;requestAnimationFrame(()=>t.classList.add("show"));clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>{t.classList.remove("show");setTimeout(()=>t.hidden=true,200);},2800);}

$("#prevDay").addEventListener("click",()=>{state.date=schoolMove(state.date,-1);state.weekStart=startOfWeek(state.date);loadCompare();});
$("#nextDay").addEventListener("click",()=>{state.date=schoolMove(state.date,1);state.weekStart=startOfWeek(state.date);loadCompare();});
$("#dateBox").addEventListener("click",()=>{const p=$("#datePicker"); if(p.showPicker)p.showPicker();else p.click();});
$("#datePicker").addEventListener("change",e=>{if(e.target.value){state.date=e.target.value;state.weekStart=startOfWeek(state.date);loadCompare();}});
$("#prevWeek").addEventListener("click",()=>{state.weekStart=addDays(state.weekStart,-7);loadWeek();});
$("#nextWeek").addEventListener("click",()=>{state.weekStart=addDays(state.weekStart,7);loadWeek();});
$("#groupSearch").addEventListener("focus",()=>{$("#searchWrap").classList.add("open");renderGroupResults($("#groupSearch").value);});
$("#groupSearch").addEventListener("input",e=>{$("#searchWrap").classList.add("open");renderGroupResults(e.target.value);});
$("#openGroup").addEventListener("click",()=>{$("#searchWrap").classList.add("open");$("#groupSearch").focus();});
document.addEventListener("click",e=>{if(!e.target.closest("#searchWrap")&&!e.target.closest("#openGroup"))$("#searchWrap").classList.remove("open");});
$("#menuBtn").addEventListener("click",()=>openMenu("changes"));$("#closeMenu").addEventListener("click",closeMenu);$("#menuBackdrop").addEventListener("click",closeMenu);document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu();});
$$(".menu-tab").forEach(x=>x.addEventListener("click",()=>switchMenu(x.dataset.panel)));
$("#clearChanges").addEventListener("click",()=>{writeJson(CHANGE_KEY,[]);renderChanges();showToast("Muudatuste ajalugu tühjendatud");});
$$("[data-theme-value]").forEach(x=>x.addEventListener("click",()=>setTheme(x.dataset.themeValue)));
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change",()=>{if((localStorage.getItem(THEME_KEY)||"system")==="system")applyTheme("system");});

async function startApp(){
  applyTheme(localStorage.getItem(THEME_KEY)||"system");
  state.date=nextSchoolDate();
  state.weekStart=startOfWeek(state.date);
  renderComparePicker();
  renderGroupResults();
  renderChanges();
  loadWeek();
  loadCompare();
}

$("#authForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const name=$("#deviceName").value.trim();
  const adminKey=$("#adminKey").value;
  const btn=$("#allowDeviceBtn");
  $("#authError").hidden=true;
  if(!name || !adminKey){ showAuthGate("Sisesta seadme nimi ja admini võti."); return; }
  btn.disabled=true; btn.textContent="Luban…";
  try{
    await activateDevice(name,adminKey);
    $("#adminKey").value="";
    hideAuthGate();
    await startApp();
  }catch(err){
    showAuthGate(err?.message || "Seadme lubamine ebaõnnestus.");
  }finally{ btn.disabled=false; btn.textContent="Luba see seade"; }
});

(async function bootstrap(){
  applyTheme(localStorage.getItem(THEME_KEY)||"system");
  const device=await checkDeviceAuth();
  if(device){ hideAuthGate(); await startApp(); }
  else showAuthGate();
})();
