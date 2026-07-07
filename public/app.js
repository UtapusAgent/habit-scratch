
const $=s=>document.querySelector(s);let items=[];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function api(path,opt){const r=await fetch(path,{headers:{'content-type':'application/json'},...opt});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||r.statusText);return d}
async function load(){items=await api('/api/items');render()}
async function addItem(data){await api('/api/items',{method:'POST',body:JSON.stringify(data)});await load()}
async function updateItem(item){await api('/api/items/'+item.id,{method:'PUT',body:JSON.stringify(item)});await load()}
async function deleteItem(id){if(confirm('Delete this item?')){await api('/api/items/'+id,{method:'DELETE'});await load()}}
function shell(body){document.body.innerHTML='<main><header class="top"><div><h1>'+esc(APP.name)+'</h1><p class="muted">'+esc(APP.desc)+'</p></div></header><div id="app">'+body+'</div></main>'}

function today(){return new Date().toISOString().slice(0,10)}function render(){shell('<section class="tool-layout"><aside class="panel"><h2>New Habit</h2><form id="f"><input id="title" placeholder="Drink water" required><select id="frequency"><option>daily</option><option>weekdays</option><option>weekly</option></select><textarea id="body" placeholder="Why this matters"></textarea><button>Add habit</button></form></aside><section><div class="habit-grid">'+(items.map(habit).join('')||'<p class="muted">No habits yet.</p>')+'</div></section></section>');$('#f').onsubmit=e=>{e.preventDefault();addItem({title:$('#title').value,body:$('#body').value,status:'active',meta:{frequency:$('#frequency').value,streak:0,last_checkin:''}})}}
function habit(x){let checked=x.meta?.last_checkin===today(),streak=Number(x.meta?.streak||0);return '<article class="item-card"><div class="row space"><h3>'+esc(x.title)+'</h3><span class="badge">'+esc(x.meta?.frequency)+'</span></div><p>'+esc(x.body)+'</p><strong>'+streak+' day streak</strong><div class="meter"><span style="width:'+Math.min(100,streak*10)+'%"></span></div><p>'+esc(x.meta?.last_checkin?'Last: '+x.meta.last_checkin:'Not checked in')+'</p><button '+(checked?'disabled':'')+' onclick="checkin('+x.id+')">'+(checked?'Done today':'Check in')+'</button> <button class="danger" onclick="deleteItem('+x.id+')">Delete</button></article>'}
async function checkin(id){let x=items.find(i=>i.id===id);x.meta.streak=Number(x.meta?.streak||0)+1;x.meta.last_checkin=today();await updateItem(x)}window.checkin=checkin;window.deleteItem=deleteItem;load();
