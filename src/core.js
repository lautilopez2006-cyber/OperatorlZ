/* ===== Utilidades ===== */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const mod=s=>Math.floor(((Number(s)||10)-10)/2);
const fm=n=>(n>=0?'+':'−')+Math.abs(n);
const clone=o=>JSON.parse(JSON.stringify(o));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const norm=s=>{s=String(s);let o='';for(let i=0;i<s.length;i++){const c=s[i];const d=c.normalize('NFD')[0].toLowerCase();o+=d[0]||c;}return o;};
const lsGet=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const debounceMap=new Map();
const debounce=(key,fn,ms)=>{clearTimeout(debounceMap.get(key));debounceMap.set(key,setTimeout(()=>{debounceMap.delete(key);fn()},ms))};
const rnd=n=>{const a=new Uint32Array(1);crypto.getRandomValues(a);return 1+(a[0]%n)};
const pick=a=>a[rnd(a.length)-1];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== Iconos ===== */
const ic=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I={
 mesa:ic('<path d="M4 9h16l-2 4H6z"/><path d="M7 13v7M17 13v7M12 4v5"/><circle cx="12" cy="4" r="1"/>'),
 skull:ic('<path d="M12 3a8 8 0 0 0-8 8c0 3 1.6 5 4 6v3h8v-3c2.4-1 4-3 4-6a8 8 0 0 0-8-8z"/><circle cx="9" cy="11" r="1.6"/><circle cx="15" cy="11" r="1.6"/><path d="M10 20v-2.5M14 20v-2.5"/>'),
 book:ic('<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>'),
 swords:ic('<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6M16 16l4 4M19 21l2-2"/><path d="M9.5 6.5 18 3h3v3l-3.5 8.5M5 14l4 4M7 21l-2-2"/>'),
 users:ic('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>'),
 mask:ic('<path d="M4 5c3 1.5 13 1.5 16 0v6a8 8 0 0 1-16 0z"/><path d="M8 10.5h2M14 10.5h2M9 15c2 1.3 4 1.3 6 0"/>'),
 map:ic('<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>'),
 shield:ic('<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M12 8v8M8 12h8"/>'),
 star:ic('<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>'),
 search:ic('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
 plus:ic('<path d="M12 5v14M5 12h14"/>'), x:ic('<path d="M6 6l12 12M18 6 6 18"/>'),
 edit:ic('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13 7 4 4"/>'),
 trash:ic('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
 copy:ic('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'),
 d20:ic('<path d="M12 2.5 20.5 7.3v9.4L12 21.5 3.5 16.7V7.3z"/><path d="M12 2.5 7 11h10zM7 11l5 10.5L17 11M3.5 7.3 7 11M20.5 7.3 17 11M3.5 16.7 7 11M20.5 16.7 17 11"/>'),
 brush:ic('<path d="M18 3 9.5 11.5"/><path d="M21 6 12.5 14.5"/><path d="M18 3l3 3"/><path d="M9.5 11.5 12.5 14.5c-.5 3-3 5.5-8.5 5.5 0-5.5 2.5-8 5.5-8.5z"/>'),
 fill:ic('<path d="m5 11 7-7 7 7-7 7z"/><path d="M19 15c1 1.5 2 2.7 2 3.7a2 2 0 0 1-4 0c0-1 1-2.2 2-3.7z"/><path d="M5 11h14"/>'),
 label:ic('<path d="M4 7V4h16v3M9 20h6M12 4v16"/>'),
 pin:ic('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
 ruler:ic('<path d="M3 17 17 3l4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>'),
 hand:ic('<path d="M7 11V6a1.5 1.5 0 0 1 3 0v4M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V11M16 11V8.5a1.5 1.5 0 0 1 3 0V14c0 4-3 7-7 7-3 0-4.5-1.5-6.5-4L3.5 14a1.6 1.6 0 0 1 2.5-2l1 1"/>'),
 region:ic('<path d="M4 6l5-2 6 3 5-2v13l-5 2-6-3-5 2z" stroke-dasharray="3 2"/>'),
 eraser:ic('<path d="m7 21-4-4L14 6l6 6-9 9z"/><path d="M7 21h13M9 11l6 6"/>'),
 undo:ic('<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>'),
 grid:ic('<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>'),
 menu:ic('<path d="M4 7h16M4 12h16M4 17h16"/>'),
 back:ic('<path d="M15 18 9 12l6-6"/>'),
 next:ic('<path d="M5 5v14l9-7z"/><path d="M18 5v14"/>'),
 prev:ic('<path d="M19 5v14l-9-7z"/><path d="M6 5v14"/>'),
 upload:ic('<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>'),
 down:ic('<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 18v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1"/>'),
 flame:ic('<path d="M12 21a7 7 0 0 1-7-7c0-4 4-6 4-11 3 2 5 4 5 7 1-1 1.5-2 1.5-3 2 2 3.5 4.5 3.5 7a7 7 0 0 1-7 7z"/>'),
 heart:ic('<path d="M12 20s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.5-8 11-8 11z"/>'),
 dice:ic('<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1.2"/><circle cx="16" cy="16" r="1.2"/><circle cx="12" cy="12" r="1.2"/>'),
 sparkle:ic('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'),
 wand:ic('<path d="m4 20 11-11M15 4v3M18.5 5.5l-2 2M20 9h-3M13 2.5v1"/>'),
 layers:ic('<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>'),
 eye:ic('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
 portal:ic('<ellipse cx="12" cy="12" rx="6" ry="9"/><ellipse cx="12" cy="12" rx="2.5" ry="5"/>'),
 crown:ic('<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>'),
 save:ic('<path d="M5 3h11l4 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M8 3v5h7M8 21v-7h8v7"/>')
};
const DIE={4:'<path d="M12 3 21 19H3z"/>',6:'<rect x="4" y="4" width="16" height="16" rx="2"/>',8:'<path d="M12 2l9 10-9 10-9-10z"/><path d="M3 12h18"/>',10:'<path d="M12 2l8 8-8 12-8-12z"/><path d="M4 10l8 3 8-3M12 13v9"/>',12:'<path d="M12 2l9 6.5-3.4 10.5H6.4L3 8.5z"/><path d="M12 7l4.5 3.3-1.7 5.2H9.2L7.5 10.3z"/>',20:'<path d="M12 2.5 20.5 7.3v9.4L12 21.5 3.5 16.7V7.3z"/><path d="M12 2.5 7 11h10zM7 11l5 10.5L17 11"/>',100:'<circle cx="8.5" cy="12" r="5.5"/><circle cx="15.5" cy="12" r="5.5"/>'};

/* ===== Planos ===== */
const PLANES=[
 {id:'material',name:'Plano Material',sub:'El mundo terrenal donde transcurre la campaña.',fx:'motes',tint:null,c:'#d6a44c'},
 {id:'feywild',name:'Agrestia Feérica',sub:'Reflejo luminoso y salvaje del mundo.',fx:'spores',tint:['#36e0a0','soft-light',.5],c:'#62d4a8'},
 {id:'shadowfell',name:'Páramo Sombrío',sub:'Eco gris y frío, tierra de la muerte.',fx:'ash',tint:['#808080','saturation',.8],c:'#a7acd6'},
 {id:'abismo',name:'El Abismo',sub:'Capas infinitas de caos demoníaco.',fx:'embers',tint:['#ff2a1a','color',.32],c:'#e8503f'},
 {id:'infiernos',name:'Los Nueve Infiernos',sub:'Orden tiránico de los diablos.',fx:'embers',tint:['#ff7a1a','color',.27],c:'#f0832e'},
 {id:'celestia',name:'Monte Celestia',sub:'Cielos de la ley y la bondad.',fx:'motes',tint:['#fff0b0','soft-light',.55],c:'#f1d98a'},
 {id:'astral',name:'Plano Astral',sub:'El mar plateado del pensamiento.',fx:'stars',tint:['#8c6bff','color',.34],c:'#ad8dff'},
 {id:'elemental',name:'Caos Elemental',sub:'Fuego, agua, tierra y aire sin freno.',fx:'spores',tint:['#2a9bff','color',.22],c:'#54b6ea'}
];
const planeById=id=>PLANES.find(p=>p.id===id)||PLANES[0];

/* ===== Almacenamiento: db compartido en la nube con respaldo local ===== */
const COLS=['monsters','characters','npcs','maps','manuals','feats','sessions'];
const Store={
 mode:'local',db:null,assets:null,downloads:null,data:{},docs:{},pending:new Set(),subs:new Set(),firstCloud:{},
 init(){
  for(const c of COLS) this.data[c]=lsGet('oz:'+c,{});
  this.docs.combat=lsGet('oz:doc:combat',null); this.docs.settings=lsGet('oz:doc:settings',{});
  this.connect();
 },
 async connect(){
  if(!window.claude||!claude.use) { this.setMode('local'); return; }
  try{
   const [db,assets,downloads]=await Promise.all([claude.use('db'),claude.use('assets').catch(()=>null),claude.use('downloads').catch(()=>null)]);
   this.assets=assets; this.downloads=downloads;
   if(!db){ this.setMode('local'); return; }
   this.db=db; this.setMode('cloud');
   for(const c of COLS){
    db.collection(c).onSnapshot(snap=>this.onCol(c,snap),e=>{ if(e&&e.code==='unavailable') setTimeout(()=>this.resub(c),3000); });
   }
   for(const d of ['combat','settings']) db.doc('state/'+d).onSnapshot(s=>this.onDoc(d,s),()=>{});
  }catch(e){ this.setMode('local'); }
 },
 resub(c){ if(this.db) this.db.collection(c).onSnapshot(s=>this.onCol(c,s),()=>{}); },
 setMode(m){ this.mode=m; const el=$('#sync'); if(el){ el.className='sync '+m; el.lastElementChild.textContent=m==='cloud'?'Guardado en la nube':'Guardado en este navegador'; } },
 onCol(c,snap){
  const local=this.data[c], next={}; let changed=false;
  for(const d of snap.docs){ const v=d.data(); if(!v) continue; const key=c+'/'+d.id;
   if(this.pending.has(key)&&local[d.id]){ next[d.id]=local[d.id]; continue; }
   next[d.id]=Object.assign({},v,{_cloud:true});
   if(!local[d.id]||local[d.id].updated!==v.updated) changed=true; }
  if(!snap.metadata.fromCache && !this.firstCloud[c]){
   this.firstCloud[c]=true;
   for(const [id,v] of Object.entries(local)){ if(!next[id] && !v._cloud){ next[id]=v; this.write(c,v); changed=true; } }
  } else { for(const [id,v] of Object.entries(local)) if(!next[id]&&this.pending.has(c+'/'+id)) next[id]=v; }
  if(Object.keys(local).length!==Object.keys(next).length) changed=true;
  this.data[c]=next; lsSet('oz:'+c,next);
  if(changed) this.emit(c,'remote');
 },
 onDoc(d,s){ if(!s.exists||this.pending.has('state/'+d)) return; const v=s.data(); const cur=this.docs[d];
  if(cur&&cur.updated===v.updated) return; this.docs[d]=v; lsSet('oz:doc:'+d,v); this.emit(d,'remote'); },
 list(c){ return Object.values(this.data[c]||{}); },
 get(c,id){ return (this.data[c]||{})[id]; },
 put(c,obj,ms=0){
  obj.updated=Date.now(); this.data[c][obj.id]=obj; this.emit(c,'local');
  debounce('ls:'+c,()=>lsSet('oz:'+c,this.data[c]),400);
  if(this.db){ const key=c+'/'+obj.id; this.pending.add(key);
   const go=()=>this.write(c,this.data[c][obj.id]).finally(()=>this.pending.delete(key));
   ms?debounce('w:'+key,go,ms):go(); }
 },
 async write(c,obj){ if(!this.db||!obj) return; const body=clone(obj); delete body._cloud;
  try{ await this.db.collection(c).doc(obj.id).set(body); obj._cloud=true; }
  catch(e){ if(e&&e.code==='quota_exceeded') toast('La base de datos está llena. Borra elementos que ya no uses.','bad');
   else if(e&&e.code==='invalid_argument') toast('Este elemento es demasiado grande para guardarse en la nube. Se guarda solo en este navegador.','bad'); } },
 del(c,id){ delete this.data[c][id]; lsSet('oz:'+c,this.data[c]); this.emit(c,'local');
  if(this.db) this.db.collection(c).doc(id).delete().catch(()=>{}); },
 setDoc(d,v,ms=500){ v.updated=Date.now(); this.docs[d]=v; debounce('ls:doc:'+d,()=>lsSet('oz:doc:'+d,v),300);
  if(this.db){ const key='state/'+d; this.pending.add(key);
   debounce('w:'+key,()=>{ const b=clone(this.docs[d]); this.db.doc(key).set(b).catch(()=>{}).finally(()=>this.pending.delete(key)); },ms); } },
 on(fn){ this.subs.add(fn); return ()=>this.subs.delete(fn); },
 emit(c,origin){ for(const f of this.subs) try{f(c,origin)}catch(e){console.error(e)} }
};

/* Contenido de manuales: activos en la nube + caché IndexedDB local */
const IDB={
 db:null,
 open(){ if(this.db) return Promise.resolve(this.db); return new Promise((res,rej)=>{ try{ const r=indexedDB.open('operatorlz',1);
  r.onupgradeneeded=()=>r.result.createObjectStore('manuals'); r.onsuccess=()=>{this.db=r.result;res(this.db)}; r.onerror=()=>rej(r.error);}catch(e){rej(e)} }); },
 async get(k){ try{ const db=await this.open(); return await new Promise(r=>{const q=db.transaction('manuals').objectStore('manuals').get(k);q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}); }catch(e){return null} },
 async set(k,v){ try{ const db=await this.open(); await new Promise(r=>{const t=db.transaction('manuals','readwrite');t.objectStore('manuals').put(v,k);t.oncomplete=r;t.onerror=r}); }catch(e){} },
 async del(k){ try{ const db=await this.open(); db.transaction('manuals','readwrite').objectStore('manuals').delete(k);}catch(e){} }
};
const manualCache=new Map();
async function manualContent(m){
 if(manualCache.has(m.id)) return manualCache.get(m.id);
 let c=await IDB.get(m.id);
 if(!c && (m.assetUrl||m.assetId)){ try{ const r=await fetch(m.assetUrl||('/_blob/'+m.assetId)); if(r.ok){ c=await r.json(); IDB.set(m.id,c); } }catch(e){} }
 if(c) manualCache.set(m.id,c);
 return c;
}

/* ===== Dados ===== */
function roll(expr,adv=0){
 expr=String(expr).replace(/\s+/g,'').replace(/[−–]/g,'-').toLowerCase(); if(!expr) return null;
 const terms=expr.match(/[+-]?[^+-]+/g); if(!terms) return null; let total=0,parts=[],d20=null;
 for(const t of terms){ const sign=t[0]==='-'?-1:1, body=t.replace(/^[+-]/,''); const m=body.match(/^(\d*)d(\d+|%)$/);
  if(m){ const n=Math.min(100,parseInt(m[1]||'1')), s=m[2]==='%'?100:parseInt(m[2]); if(!s) return null; let rs=[];
   if(s===20&&n===1&&adv){ const a=rnd(20),b=rnd(20),p=adv>0?Math.max(a,b):Math.min(a,b); rs=[p]; parts.push(`[${a}, ${b}]→${p}`); d20=p; }
   else { for(let i=0;i<n;i++) rs.push(rnd(s)); parts.push((sign<0?'− ':'')+`[${rs.join(', ')}]`); if(s===20&&n===1) d20=rs[0]; }
   total+=sign*rs.reduce((a,b)=>a+b,0); }
  else if(/^\d+$/.test(body)){ total+=sign*parseInt(body); parts.push((sign<0?'− ':'+ ')+body); }
  else return null; }
 return {total,parts:parts.join(' '),d20,expr};
}
const rollHist=[];
function rollToast(expr,label,adv=0){
 const r=roll(expr,adv); if(!r){ toast('No entiendo esa tirada. Prueba con algo como 2d6+3.','bad'); return null; }
 const cls=r.d20===20?'crit':r.d20===1?'fumble':'';
 rollHist.unshift(`${label?label+' · ':''}${expr} = ${r.total}`); rollHist.length=Math.min(rollHist.length,40);
 toast(`<div class="rt"><b>${r.total}</b><span>${esc(label||expr)}</span></div><small class="muted mono">${esc(expr)}${adv?(adv>0?' · ventaja':' · desventaja'):''} · ${esc(r.parts)}${r.d20===20?' · ¡crítico!':r.d20===1?' · pifia':''}</small>`,cls,true);
 const h=$('#dhist'); if(h) renderHist();
 return r;
}
function toast(html,cls='',raw=false){
 const t=document.createElement('div'); t.className='toast '+(cls||''); t.innerHTML=raw?html:esc(html);
 $('#toasts').prepend(t); const kids=$('#toasts').children; if(kids.length>5) kids[kids.length-1].remove();
 setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300)},cls==='bad'?6000:4200);
}
document.addEventListener('click',e=>{ const r=e.target.closest('[data-roll]'); if(r){ e.preventDefault(); rollToast(r.dataset.roll,r.dataset.label||'', e.shiftKey?1:e.altKey?-1:0); } });

/* ===== Modales ===== */
function modal({title,body,foot,wide,onClose,cls}){
 const bg=document.createElement('div'); bg.className='modal-bg';
 bg.innerHTML=`<div class="modal ${wide?'wide':''} ${cls||''}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header><h3>${esc(title)}</h3><button class="btn ghost icon" data-x aria-label="Cerrar">${I.x}</button></header><div class="bd">${body}</div>${foot?`<footer>${foot}</footer>`:''}</div>`;
 document.body.append(bg);
 const close=()=>{ if(!bg.isConnected) return; bg.remove(); document.removeEventListener('keydown',k); onClose&&onClose(); };
 const k=e=>{ if(e.key==='Escape'&&document.body.lastElementChild===bg) close(); };
 document.addEventListener('keydown',k);
 bg.addEventListener('mousedown',e=>{ if(e.target===bg) close(); });
 $('[data-x]',bg).onclick=close;
 const f=$('input,textarea,select',bg); if(f&&!('ontouchstart' in window)) setTimeout(()=>f.focus(),60);
 return {el:bg,close};
}
function confirmBox(text,yes,label='Eliminar'){
 const m=modal({title:'Confirmar',body:`<p style="margin:0">${esc(text)}</p>`,foot:`<button class="btn" data-no>Cancelar</button><button class="btn pri" data-yes>${esc(label)}</button>`});
 $('[data-no]',m.el).onclick=m.close; $('[data-yes]',m.el).onclick=()=>{m.close();yes();};
}
function vals(root){ const o={}; $$('[name]',root).forEach(el=>{ o[el.name]=el.type==='checkbox'?el.checked:el.type==='number'?(el.value===''?'':Number(el.value)):el.value; }); return o; }
const fld=(label,name,val,type='text',extra='')=>`<label class="f"><span>${esc(label)}</span><input class="inp" id="f-${name}" name="${name}" type="${type}" value="${esc(val??'')}" ${extra}></label>`;
const area=(label,name,val,rows=3)=>`<label class="f"><span>${esc(label)}</span><textarea class="inp" id="f-${name}" name="${name}" rows="${rows}">${esc(val??'')}</textarea></label>`;
const sel=(label,name,val,opts)=>`<label class="f"><span>${esc(label)}</span><select class="sel" id="f-${name}" name="${name}">${opts.map(o=>{const [v,t]=Array.isArray(o)?o:[o,o];return `<option value="${esc(v)}" ${String(v)===String(val)?'selected':''}>${esc(t)}</option>`}).join('')}</select></label>`;

/* ===== Texto de reglas con tiradas clicables ===== */
function rollify(text){
 return esc(text).replace(/([+\-−]\d+) al impacto|(\d+d\d+(?:\s*[+\-−]\s*\d+)?)/g,(m,a,d)=>{
  if(a){ const n=a.replace('−','-'); return `<span class="roll" data-roll="1d20${n.startsWith('-')?n:'+'+n.replace('+','')}" data-label="Ataque" title="Tirar ataque (Mayús: ventaja, Alt: desventaja)">${a}</span> al impacto`; }
  return `<span class="roll" data-roll="${d.replace(/\s/g,'').replace('−','-')}" data-label="Daño">${d}</span>`;
 });
}
const entryHTML=s=>{ const i=s.indexOf(':'); if(i>0&&i<60) return `<p><b>${esc(s.slice(0,i))}.</b> ${rollify(s.slice(i+1).trim())}</p>`; return `<p>${rollify(s)}</p>`; };

/* ===== Ambiente animado por plano ===== */
const Ambient={
 cv:null,ctx:null,ps:[],fx:'motes',run:false,
 init(){ this.cv=$('#ambient'); if(!this.cv||reduced) return; this.ctx=this.cv.getContext('2d'); addEventListener('resize',()=>this.size()); this.size();
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden&&!this.run){this.run=true;requestAnimationFrame(t=>this.loop(t))} }); this.run=true; requestAnimationFrame(t=>this.loop(t)); },
 size(){ const d=1; this.cv.width=innerWidth*d; this.cv.height=innerHeight*d; this.cv.style.width=innerWidth+'px'; this.cv.style.height=innerHeight+'px'; this.d=d; },
 set(fx,color){ this.fx=fx; this.color=color; if(!this.ctx) return; const n=fx==='stars'?50:26; this.ps=Array.from({length:n},()=>this.spawn(true)); },
 spawn(any){ const W=this.cv.width,H=this.cv.height,f=this.fx;
  const p={x:Math.random()*W,y:any?Math.random()*H:(f==='ash'?-10:H+10),r:(Math.random()*1.8+.6)*this.d,a:Math.random(),t:Math.random()*6.28};
  if(f==='embers'){p.vx=(Math.random()-.5)*.4;p.vy=-(Math.random()*.9+.4);}
  else if(f==='ash'){p.vx=(Math.random()-.3)*.4;p.vy=Math.random()*.5+.2;}
  else if(f==='stars'){p.vx=0;p.vy=0;p.r*=.8;}
  else if(f==='spores'){p.vx=(Math.random()-.5)*.3;p.vy=(Math.random()-.5)*.3;}
  else {p.vx=(Math.random()-.5)*.15;p.vy=-(Math.random()*.25+.05);}
  return p; },
 loop(t){ if(document.hidden){this.run=false;return;} const c=this.ctx,W=this.cv.width,H=this.cv.height; c.clearRect(0,0,W,H);
  for(let i=0;i<this.ps.length;i++){ const p=this.ps[i]; p.t+=.02; p.x+=p.vx*this.d+(this.fx==='spores'?Math.sin(p.t)*.3:0); p.y+=p.vy*this.d;
   if(p.y<-20||p.y>H+20||p.x<-20||p.x>W+20){ this.ps[i]=this.spawn(false); continue; }
   const al=this.fx==='stars'?(.25+.6*Math.abs(Math.sin(p.t*.6))):this.fx==='embers'?.75:.45;
   c.globalAlpha=al*(this.fx==='ash'?.7:1); c.fillStyle=this.fx==='ash'?'#9a9aa8':this.color;
   c.beginPath(); c.arc(p.x,p.y,p.r,0,6.283); c.fill();
   if(this.fx==='embers'||this.fx==='spores'){ c.globalAlpha=al*.15; c.beginPath(); c.arc(p.x,p.y,p.r*4,0,6.283); c.fill(); } }
  c.globalAlpha=1; requestAnimationFrame(tt=>this.loop(tt)); }
};
