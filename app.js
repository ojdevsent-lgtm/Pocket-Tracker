const KEY="pockettracker-v4";
const CATEGORIES=["Food","Transport","Bills","Shopping","Entertainment","Health","Education","Salary","Housing","Other"];
const defaults={transactions:[],budgets:{},theme:"light",currency:"NGN"};
let d=load(),view="dashboard",edit=null;
const $=id=>document.getElementById(id);
const today=()=>new Date().toISOString().slice(0,10);
const cur=()=>d.currency||"NGN";
const money=n=>new Intl.NumberFormat("en-NG",{style:"currency",currency:cur(),maximumFractionDigits:2}).format(Number(n)||0);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const save=()=>localStorage.setItem(KEY,JSON.stringify(d));
const toast=m=>{const x=$("toast");x.textContent=m;x.classList.add("toast-show");clearTimeout(window._toast);window._toast=setTimeout(()=>x.classList.remove("toast-show"),2200)};
const month=x=>x.slice(0,7)===today().slice(0,7);
const fmt=x=>new Intl.DateTimeFormat("en-NG",{day:"numeric",month:"short",year:"numeric"}).format(new Date(x+"T00:00:00"));
function load(){
  try{
    const raw=JSON.parse(localStorage.getItem(KEY)||"null");
    if(raw&&Array.isArray(raw.transactions)) return {...defaults,...raw,budgets:raw.budgets||{}};
    const old=JSON.parse(localStorage.getItem("pockettracker-v3")||"null");
    if(old&&Array.isArray(old.transactions)){const migrated={...defaults,...old,budgets:old.budgets||{}};localStorage.setItem(KEY,JSON.stringify(migrated));return migrated}
  }catch{}
  return {...defaults,transactions:[],budgets:{}};
}
function stat(){
  const i=d.transactions.filter(x=>x.type==="income"),e=d.transactions.filter(x=>x.type==="expense");
  const inc=i.reduce((a,x)=>a+x.amount,0),out=e.reduce((a,x)=>a+x.amount,0);
  const mi=i.filter(x=>month(x.date)).reduce((a,x)=>a+x.amount,0),me=e.filter(x=>month(x.date)).reduce((a,x)=>a+x.amount,0);
  return{inc,out,bal:inc-out,mi,me,rate:mi?Math.round((mi-me)/mi*100):0};
}
function populateCategories(){
  const select=$("cat"); if(!select)return;
  const current=select.value;
  select.innerHTML=CATEGORIES.map(c=>"<option>"+esc(c)+"</option>").join("");
  if(current)select.value=current;
}
function sorted(a){return a.slice().sort((x,y)=>y.date.localeCompare(x.date)||y.id-x.id)}
function rows(a){
  if(!a.length)return '<div class="empty"><b>No transactions yet</b>Add one to get started.</div>';
  return sorted(a).map(x=>'<div class="tx"><div class="icon">'+(x.type==="income"?"↗":"↘")+'</div><div class="txmain"><b>'+esc(x.description)+'</b><small>'+esc(x.category)+' · '+fmt(x.date)+(x.recurring?" · Monthly":"")+'</small></div><span class="amt '+x.type+'">'+(x.type==="income"?"+":"−")+money(x.amount)+'</span><div class="tx-actions"><button class="edit" aria-label="Edit '+esc(x.description)+'" onclick="openModal('+x.id+')">✎</button><button class="del" aria-label="Delete '+esc(x.description)+'" onclick="removeTx('+x.id+')">×</button></div></div>').join("");
}
function dash(){
  const s=stat(),cats={};
  d.transactions.filter(x=>x.type==="expense"&&month(x.date)).forEach(x=>cats[x.category]=(cats[x.category]||0)+x.amount);
  const c=Object.entries(cats).sort((a,b)=>b[1]-a[1]),top=c[0]?.[1]||0;
  return '<section class="hero"><div><p class="eyebrow">PERSONAL FINANCE</p><h1>Know where your money went.</h1><p class="muted">Private, simple and stored on this device.</p></div><button class="primary" onclick="openModal()">＋ Add transaction</button></section><section class="cards"><div class="card balance"><span>Current balance</span><strong>'+money(s.bal)+'</strong><small>All time</small></div><div class="card"><span>Income</span><strong>'+money(s.mi)+'</strong><small>This month</small></div><div class="card"><span>Expenses</span><strong>'+money(s.me)+'</strong><small>This month</small></div><div class="card"><span>Savings rate</span><strong>'+s.rate+'%</strong><small>This month</small></div></section><section class="grid"><article class="panel"><div class="head"><div><h2>Recent transactions</h2><p class="muted">Latest activity</p></div><button class="secondary" onclick="setView('transactions')">View all</button></div>'+rows(sorted(d.transactions).slice(0,8))+'</article><aside class="panel"><div class="head"><div><h2>Spending</h2><p class="muted">This month</p></div></div><div class="bar"><i style="width:'+Math.min(100,s.me?top/s.me*100:0)+'%"></i></div><div class="list">'+(c.length?c.map(x=>'<div class="row"><span>'+esc(x[0])+'</span><b>'+money(x[1])+'</b></div>').join(""):'<div class="empty">No spending this month.</div>')+'</div></aside></section>';
}
function txPage(){
  return '<section class="page"><p class="eyebrow">ACTIVITY</p><h1>Transactions</h1><p class="muted">Search, filter, edit and remove transactions.</p></section><article class="panel"><div class="filters"><input id="q" aria-label="Search transactions" placeholder="Search description or category…" oninput="filter()"><select id="f" aria-label="Filter transaction type" onchange="filter()"><option value="all">All types</option><option value="income">Income</option><option value="expense">Expenses</option></select></div><div id="txbox">'+rows(d.transactions)+'</div></article>';
}
function filter(){
  const q=($("q")?.value||"").toLowerCase(),f=$("f")?.value||"all";
  $("txbox").innerHTML=rows(d.transactions.filter(x=>(f==="all"||x.type===f)&&(x.description+" "+x.category).toLowerCase().includes(q)));
}
function budgets(){
  const spent={};
  d.transactions.filter(x=>x.type==="expense"&&month(x.date)).forEach(x=>spent[x.category]=(spent[x.category]||0)+x.amount);
  const cats=[...new Set([...CATEGORIES,...Object.keys(d.budgets)])];
  return '<section class="page"><p class="eyebrow">CONTROL</p><h1>Budgets</h1><p class="muted">Set monthly spending limits by category.</p></section><article class="panel">'+cats.map(c=>{const b=d.budgets[c]||0,v=spent[c]||0,p=b?Math.min(100,v/b*100):0,id="b_"+c.replace(/[^a-z0-9]/gi,"_");return '<div class="budget"><div class="budgetmeta"><b>'+esc(c)+'</b><span>'+money(v)+(b?" / "+money(b):"")+'</span></div><div class="progress"><i style="width:'+p+'%"></i></div><div class="two" style="margin-top:8px"><input id="'+id+'" type="number" min="0" step=".01" value="'+b+'" placeholder="Monthly limit" aria-label="'+esc(c)+' monthly limit"><button class="secondary" onclick="budget('+JSON.stringify(c)+')">Save</button></div></div>}).join("")+'</article>';
}
function budget(c){const id="b_"+c.replace(/[^a-z0-9]/gi,"_"),n=Number($(id).value);if(n>0)d.budgets[c]=n;else delete d.budgets[c];save();render();toast("Budget saved")}
function reports(){
  const m={};d.transactions.forEach(x=>{const k=x.date.slice(0,7);m[k]??={income:0,expense:0};m[k][x.type]+=x.amount});
  const s=stat(),r=Object.entries(m).sort((a,b)=>b[0].localeCompare(a[0]));
  return '<section class="page"><p class="eyebrow">INSIGHTS</p><h1>Reports</h1><p class="muted">Understand your cash flow over time.</p></section><section class="stats"><div class="card"><span>All-time income</span><strong>'+money(s.inc)+'</strong></div><div class="card"><span>All-time expenses</span><strong>'+money(s.out)+'</strong></div><div class="card"><span>Net</span><strong>'+money(s.bal)+'</strong></div></section><article class="panel"><div class="head"><h2>Monthly summary</h2><button class="secondary" onclick="csv()">Export CSV</button></div>'+(r.length?'<div class="table-wrap"><table class="table"><thead><tr><th>Month</th><th>Income</th><th>Expenses</th><th>Net</th></tr></thead><tbody>'+r.map(x=>'<tr><td>'+x[0]+'</td><td>'+money(x[1].income)+'</td><td>'+money(x[1].expense)+'</td><td>'+money(x[1].income-x[1].expense)+'</td></tr>').join("")+'</tbody></table></div>':'<div class="empty">Add transactions to generate a report.</div>')+'</article>';
}
function settings(){
  return '<section class="page"><p class="eyebrow">PREFERENCES</p><h1>Settings</h1><p class="muted">Manage currency, backups and local data.</p></section><div class="settings"><section class="setting"><h3>Currency</h3><p>Choose how amounts are displayed.</p><select id="currency" onchange="currency()"><option value="NGN">Nigerian Naira (₦)</option><option value="USD">US Dollar ($)</option><option value="GBP">British Pound (£)</option><option value="EUR">Euro (€)</option></select></section><section class="setting"><h3>Backup</h3><p>Save a complete JSON backup and restore it later.</p><div class="actions"><button class="secondary" onclick="backup()">Download backup</button><button class="secondary" onclick="$('file').click()">Restore backup</button><input id="file" type="file" accept=".json,application/json" hidden onchange="restore(event)"></div></section><section class="setting"><h3>Privacy</h3><p>Your transactions remain in browser storage. No server or account is required.</p><button class="secondary" onclick="resetData()">Reset local data</button></section><section class="setting"><h3>Installable</h3><p>PocketTracker includes a lightweight web-app manifest and service worker for supported browsers.</p></section></div>';
}
function setView(v){view=v;document.querySelectorAll("nav button").forEach(x=>x.classList.toggle("active",x.dataset.v===v));render()}
function render(){
  document.body.classList.toggle("dark",d.theme==="dark");
  $("theme").textContent=d.theme==="dark"?"☀":"☾";
  $("theme").setAttribute("aria-label",d.theme==="dark"?"Switch to light mode":"Switch to dark mode");
  $("app").innerHTML=view==="dashboard"?dash():view==="transactions"?txPage():view==="budgets"?budgets():view==="reports"?reports():settings();
  if(view==="settings")$("currency").value=cur();
  if(view==="dashboard"&&d.transactions.length===0){}
}
function openModal(id){
  edit=id||null;const x=edit?d.transactions.find(t=>t.id===edit):null;
  $("formTitle").textContent=x?"Edit transaction":"Add transaction";
  $("desc").value=x?.description||"";$("amount").value=x?.amount||"";$("kind").value=x?.type||"expense";populateCategories();$("cat").value=x?.category||"Food";$("date").value=x?.date||today();$("repeat").checked=!!x?.recurring;
  $("modal").classList.remove("hidden");setTimeout(()=>$("desc").focus(),0);
}
function closeModal(){$("modal").classList.add("hidden");$("form").reset();edit=null}
function removeTx(id){const x=d.transactions.find(t=>t.id===id);if(x&&confirm('Delete "'+x.description+'"?')){d.transactions=d.transactions.filter(t=>t.id!==id);save();render();toast("Transaction deleted")}}
function csv(){
  const r=[["Date","Description","Type","Category","Amount","Monthly"],...sorted(d.transactions).map(x=>[x.date,x.description,x.type,x.category,x.amount,x.recurring?"Yes":"No"])];
  const s=r.map(a=>a.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(",")).join("\n");
  download("pockettracker-transactions.csv",s,"text/csv;charset=utf-8");toast("CSV exported");
}
function backup(){download("pockettracker-backup.json",JSON.stringify(d,null,2),"application/json");toast("Backup downloaded")}
function restore(e){
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader;r.onload=()=>{try{
    const x=JSON.parse(r.result);
    if(!Array.isArray(x.transactions)||typeof x.budgets!=="object")throw Error();
    d={...defaults,transactions:x.transactions,budgets:x.budgets||{},theme:x.theme==="dark"?"dark":"light",currency:["NGN","USD","GBP","EUR"].includes(x.currency)?x.currency:"NGN"};
    save();render();toast("Backup restored");
  }catch{toast("Invalid PocketTracker backup")}e.target.value=""};r.readAsText(f);
}
function download(n,s,t){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([s],{type:t}));a.download=n;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function currency(){d.currency=$("currency").value;save();render();toast("Currency updated")}
function resetData(){if(confirm("Erase all PocketTracker data from this browser?")){localStorage.removeItem(KEY);localStorage.removeItem("pockettracker-v3");location.reload()}}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>setView(b.dataset.v));
$("add").onclick=()=>openModal();
$("theme").onclick=()=>{d.theme=d.theme==="dark"?"light":"dark";save();render()};
$("close").onclick=closeModal;$("cancel").onclick=closeModal;
$("modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("modal").classList.contains("hidden"))closeModal()});
$("form").onsubmit=e=>{
  e.preventDefault();
  const x={id:edit||Date.now(),description:$("desc").value.trim(),amount:Number($("amount").value),type:$("kind").value,category:$("cat").value,date:$("date").value,recurring:$("repeat").checked};
  if(!x.description||!(x.amount>0)||!x.date)return;
  if(edit){const i=d.transactions.findIndex(t=>t.id===edit);if(i>=0)d.transactions[i]=x}else d.transactions.push(x);
  save();closeModal();render();toast(edit?"Transaction updated":"Transaction saved");
};
populateCategories();render();
