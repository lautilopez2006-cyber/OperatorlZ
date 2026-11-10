/* ===== Navegación ===== */
const ROUTES={
 mesa:{t:'Mesa del DM',s:'Tu centro de mando',i:'mesa',sec:'Jugar'},
 combate:{t:'Combate',s:'Iniciativa, PG y estados',i:'swords',sec:'Jugar'},
 personajes:{t:'Personajes',s:'El grupo de jugadores',i:'users',sec:'Campaña'},
 pnj:{t:'PNJ',s:'Personajes no jugadores',i:'mask',sec:'Campaña'},
 mapas:{t:'Mapas',s:'Global, nacional y mínimo',i:'map',sec:'Campaña'},
 wiki:{t:'Wiki',s:'Todo el material reunido',i:'compass',sec:'Wiki'},
 bestiario:{t:'Monstruos',s:'Oficiales, expansiones y homebrew',i:'skull',sec:'Wiki'},
 hechizos:{t:'Hechizos',s:'Del truco al nivel 9',i:'wand',sec:'Wiki'},
 especies:{t:'Especies',s:'Razas jugables',i:'leaf',sec:'Wiki'},
 clases:{t:'Clases',s:'Rasgos por nivel y subclases',i:'shield',sec:'Wiki'},
 dotes:{t:'Dotes',s:'De origen, generales y épicas',i:'star',sec:'Wiki'},
 reglas:{t:'Reglas',s:'Condiciones y consulta rápida',i:'scale',sec:'Wiki'},
 biblioteca:{t:'Manuales',s:'Tus PDF, legibles y buscables',i:'book',sec:'Wiki'}
};
I.compass=ic('<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>');
I.leaf=ic('<path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15"/><path d="M5 19 13 11"/>');
I.scale=ic('<path d="M12 3v18M5 21h14M6 7h12M6 7l-3 7a3 3 0 0 0 6 0zM18 7l-3 7a3 3 0 0 0 6 0z"/>');
I.fs=ic('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>');
I.fsx=ic('<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>');
I.more=ic('<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>');
I.ext=ic('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>');
I.pinOn=ic('<path d="M9 4h6l-1 6 4 4H6l4-4z" fill="currentColor"/><path d="M12 14v6"/>');
I.pinOff=ic('<path d="M9 4h6l-1 6 4 4H6l4-4z"/><path d="M12 14v6"/>');
const SIGIL='<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="100" cy="100" r="92"/><circle cx="100" cy="100" r="74"/><path d="M100 8 180 146H20z"/><path d="M100 192 20 54h160z"/><circle cx="100" cy="100" r="30"/>'+Array.from({length:24},(_,i)=>{const a=i*Math.PI/12;return `<path d="M${100+Math.cos(a)*74} ${100+Math.sin(a)*74}L${100+Math.cos(a)*92} ${100+Math.sin(a)*92}"/>`}).join('')+'</svg>';
let route='mesa', cleanup=null, curPlane='material', viewDeps=[];

function shell(){
 const secs={}; for(const [k,r] of Object.entries(ROUTES)) (secs[r.sec]=secs[r.sec]||[]).push(k);
 document.getElementById('root').innerHTML=`
 <div class="nebula" aria-hidden="true"><i></i><i></i><i></i></div><div class="grain" aria-hidden="true"></div><canvas id="ambient"></canvas>
 <div class="app">
  <aside class="rail" id="rail">
   <a class="brand" href="#mesa"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 3 35 11.5v17L20 37 5 28.5v-17z"/><path d="M20 3 12 19h16zM12 19l8 18 8-18M5 11.5 12 19M35 11.5 28 19M5 28.5 12 19M35 28.5 28 19"/></svg><div><b>OperatorlZ</b><small>Pantalla del DM</small></div></a>
   <nav class="nav" aria-label="Secciones">${Object.entries(secs).map(([s,ks])=>`<div class="nav-sec">${s}</div>`+ks.map(k=>`<a href="#${k}" data-r="${k}">${I[ROUTES[k].i]}<span>${ROUTES[k].t}</span><span class="cnt" data-cnt="${k}"></span></a>`).join('')).join('')}</nav>
   <div class="rail-foot"><div id="sync" class="sync local"><i></i><span>Guardado en este navegador</span></div><div><kbd>/</kbd> buscar · <kbd>D</kbd> dados · <kbd>N</kbd> turno</div></div>
  </aside>
  <div class="main">
   <header class="top">
    <button class="icbtn" id="menuBtn" aria-label="Abrir menú" style="display:none">${I.menu}</button>
    <div class="ttl"><h1 id="ttl"></h1><div class="sub" id="sub"></div></div>
    <div class="gsearch" id="gs">${I.search.replace('<svg','<svg class="ico"')}<input id="gq" placeholder="Buscar monstruos, hechizos, reglas, PNJ…" autocomplete="off" aria-label="Buscar en todo"><kbd>/</kbd></div>
    <div class="topbtns"><button class="icbtn" id="fsBtn" aria-label="Pantalla completa" title="Pantalla completa">${I.fs}</button>
    <div class="plane-pick"><button class="plane-btn" id="planeBtn" aria-haspopup="true"><span class="plane-dot"></span><span class="pl-name" id="plName"></span></button></div></div>
   </header>
   <section class="view" id="view"></section>
  </div>
 </div>
 <nav class="tabbar" aria-label="Accesos rápidos"><a href="#mesa" data-t="mesa">${I.mesa}Mesa</a><a href="#combate" data-t="combate">${I.swords}Combate</a><a href="#wiki" data-t="wiki">${I.compass}Wiki</a><a href="#mapas" data-t="mapas">${I.map}Mapas</a><button id="moreBtn">${I.more}Más</button></nav>
 <button class="fab" id="fab" aria-label="Bandeja de dados" title="Dados (D)">${I.d20}</button>
 <div class="toasts" id="toasts" aria-live="polite"></div>
 <div class="portal" id="portal"></div>`;
 const toph=()=>document.documentElement.style.setProperty('--toph',$('.top').offsetHeight+'px'); addEventListener('resize',toph); toph();
 const mq=matchMedia('(max-width:900px)'); const mb=()=>$('#menuBtn').style.display=mq.matches?'grid':'none'; mq.addEventListener('change',mb); mb();
 $('#menuBtn').onclick=$('#moreBtn').onclick=()=>$('#rail').classList.toggle('open');
 $('#rail').addEventListener('click',e=>{ if(e.target.closest('a')) $('#rail').classList.remove('open'); });
 $('#planeBtn').onclick=e=>{ e.stopPropagation(); planeMenu(); };
 $('#fab').onclick=diceTray;
 const fsb=$('#fsBtn'); if(!document.documentElement.requestFullscreen) fsb.hidden=true;
 fsb.onclick=async()=>{ try{ if(document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }catch(e){ toast('Este navegador no permite pantalla completa aquí. Prueba con F11.','bad'); } };
 document.addEventListener('fullscreenchange',()=>{ fsb.innerHTML=document.fullscreenElement?I.fsx:I.fs; });
 initSearch();
 document.addEventListener('keydown',e=>{
  const typing=/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){ e.preventDefault(); $('#gq').focus(); return; }
  if(e.key==='Escape'&&DR.stack.length&&!$('.modal-bg')){ closeDrawer(); return; }
  if(!typing&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!$('.modal-bg')){ if(e.key==='/'){ e.preventDefault(); $('#gq').focus(); } else if(e.key==='d'||e.key==='D') diceTray(); }
 });
 addEventListener('hashchange',()=>render());
 Store.on((c,origin)=>{ counts(); if(origin==='remote'){ if(c==='settings'){ const p=(Store.docs.settings||{}).plane; if(p&&p!==curPlane) applyPlane(p,false); if(route==='mesa') refreshView('settings'); } else refreshView(c); } });
}
function counts(){
 const n={personajes:Store.list('characters').length,pnj:Store.list('npcs').length,mapas:Store.list('maps').filter(m=>(m.plane||'material')===curPlane).length,biblioteca:Store.list('manuals').length,bestiario:allMonsters().length+MONSTER_CAT.length,hechizos:SPELLS.length+SPELL_CAT.length,especies:SPECIES.length+SPECIES_CAT.length,dotes:allFeats().length,combate:(Store.docs.combat&&Store.docs.combat.list||[]).length||''};
 $$('[data-cnt]').forEach(el=>el.textContent=n[el.dataset.cnt]??'');
}
function refreshView(c){ if(viewDeps.includes(c)&&!(document.activeElement&&$('#view').contains(document.activeElement)&&/INPUT|TEXTAREA/.test(document.activeElement.tagName))) render(true); }
function render(soft){
 const h=location.hash.slice(1); route=ROUTES[h]?h:'mesa';
 $$('.nav a').forEach(a=>a.classList.toggle('on',a.dataset.r===route));
 $$('.tabbar [data-t]').forEach(a=>a.classList.toggle('on',a.dataset.t===route||(a.dataset.t==='wiki'&&ROUTES[route].sec==='Wiki')));
 $('#ttl').textContent=ROUTES[route].t; $('#sub').textContent=ROUTES[route].s; document.title='OperatorlZ · '+ROUTES[route].t;
 if(cleanup){ try{cleanup()}catch(e){} cleanup=null; }
 const v=$('#view'); v.onclick=null;
 const st=scrollY; v.className='view'; viewDeps=[]; VIEWS[route](v); if(soft) scrollTo(0,st); else { scrollTo(0,0); v.classList.add('enter'); }
 counts();
}
const go=r=>{ if(location.hash.slice(1)===r) render(); else location.hash=r; };
document.addEventListener('click',e=>{ const g=e.target.closest('[data-go]'); if(g){ e.preventDefault(); go(g.dataset.go); } const p=e.target.closest('[data-plane-open]'); if(p){ e.stopPropagation(); planeMenu(); }
 const en=e.target.closest('[data-entry]'); if(en){ e.preventDefault(); const [k,id]=en.dataset.entry.split(':'); openEntry(k,id); } });

function planeMenu(){
 const ex=$('.plane-menu'); if(ex){ ex.remove(); return; }
 const m=document.createElement('div'); m.className='plane-menu'; m.setAttribute('role','menu');
 m.innerHTML=`<div class="eyebrow" style="padding:6px 10px">Viajar a otro plano</div>`+PLANES.map(p=>`<button class="${p.id===curPlane?'on':''}" data-p="${p.id}" role="menuitem"><i style="background:${p.c};box-shadow:0 0 12px ${p.c}"></i><span>${p.name}</span><small>${p.sub}</small></button>`).join('');
 $('.plane-pick').append(m);
 m.onclick=e=>{ const b=e.target.closest('[data-p]'); if(!b) return; m.remove(); if(b.dataset.p!==curPlane) applyPlane(b.dataset.p,true,$('#planeBtn')); };
 setTimeout(()=>document.addEventListener('click',function off(ev){ if(!m.contains(ev.target)){ m.remove(); document.removeEventListener('click',off);} }),0);
}
function applyPlane(id,save=true,from){
 const p=planeById(id);
 const set=()=>{ curPlane=p.id; document.documentElement.dataset.plane=p.id; $('#plName').textContent=p.name; Ambient.set(p.fx,p.c); lsSet('oz:plane',p.id); render(true); counts(); };
 if(save){ const s=Object.assign({},Store.docs.settings||{},{plane:p.id}); Store.setDoc('settings',s,300); toast(`Has viajado a ${p.name}.`); }
 if(from&&!reduced){ const r=from.getBoundingClientRect(), po=$('#portal');
  po.style.setProperty('--px',(r.left+r.width/2)+'px'); po.style.setProperty('--py',(r.top+r.height/2)+'px'); po.style.setProperty('--pc',p.c);
  po.classList.remove('go'); void po.offsetWidth; po.classList.add('go'); setTimeout(set,480); setTimeout(()=>po.classList.remove('go'),1150); }
 else set();
}

/* ===== Dados con animación ===== */
function diceFX(d20,total){
 if(reduced) return; $$('.dfx').forEach(x=>x.remove());
 const el=document.createElement('div'); el.className='dfx '+(d20===20?'crit':d20===1?'fumble':'');
 el.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round">${DIE[20]}</svg><b>${total}</b>`;
 document.body.append(el); setTimeout(()=>el.classList.add('out'),1500); setTimeout(()=>el.remove(),1950);
 if(d20===20){ setTimeout(()=>{ for(let i=0;i<26;i++){ const s=document.createElement('i'); s.className='spark'; const a=Math.random()*6.28, d=80+Math.random()*160; s.style.left=innerWidth/2+'px'; s.style.top=innerHeight*.44+'px'; document.body.append(s);
  s.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(.2)`,opacity:0}],{duration:900+Math.random()*400,easing:'cubic-bezier(.2,.8,.2,1)'}).onfinish=()=>s.remove(); } },650); }
}
const baseRollToast=rollToast;
rollToast=function(expr,label,adv){ const r=baseRollToast(expr,label,adv); if(r&&r.d20!=null) diceFX(r.d20,r.total); return r; };
function renderHist(){ const h=$('#dhist'); if(h) h.innerHTML=rollHist.map(x=>`<div>${esc(x)}</div>`).join('')||'<span class="muted">Aún no hay tiradas.</span>'; }
function diceTray(){
 const ex=$('.tray'); if(ex){ ex.remove(); return; }
 const t=document.createElement('div'); t.className='tray';
 t.innerHTML=`<div class="row" style="justify-content:space-between"><span class="eyebrow">Bandeja de dados</span><button class="btn ghost icon sm" data-close aria-label="Cerrar">${I.x}</button></div>
 <div class="dres" id="dres">d20</div>
 <div class="dice">${[4,6,8,10,12,20,100].map(n=>`<button class="die" data-d="${n}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">${DIE[n]}</svg>d${n}</button>`).join('')}<button class="die" data-adv="1"><b style="font-size:1.1rem">V</b>ventaja</button></div>
 <div class="row" style="flex-wrap:nowrap"><input class="inp mono" id="dexpr" placeholder="2d6+3, 1d20+5…" aria-label="Expresión de dados"><button class="btn pri" id="dgo">Tirar</button></div>
 <div class="row" style="margin:8px 0;gap:6px"><span class="chip" data-adv="-1">Desventaja</span><span class="chip" data-x="4d6">4d6</span><span class="chip" data-x="2d20">2d20</span><span class="chip" data-x="1d100">d100</span></div>
 <div class="dhist" id="dhist"></div>`;
 document.body.append(t); renderHist();
 const out=$('#dres',t);
 const doRoll=(expr,adv=0)=>{ const r=roll(expr,adv); if(!r){ out.textContent='¿?'; return; }
  let k=0; const anim=setInterval(()=>{ out.textContent=rnd(Math.max(4,Math.abs(r.total)||6)); if(++k>9){ clearInterval(anim); out.textContent=r.total; out.style.color=r.d20===20?'#ffe08a':r.d20===1?'var(--bad)':''; } },reduced?0:40);
  if(r.d20!=null) diceFX(r.d20,r.total);
  rollHist.unshift(`${expr}${adv?(adv>0?' (V)':' (D)'):''} = ${r.total}  ${r.parts}`); renderHist(); };
 t.addEventListener('click',e=>{ const d=e.target.closest('[data-d]'); if(d) doRoll('1d'+d.dataset.d);
  const a=e.target.closest('[data-adv]'); if(a) doRoll('1d20',Number(a.dataset.adv));
  const x=e.target.closest('[data-x]'); if(x) doRoll(x.dataset.x); if(e.target.closest('[data-close]')) t.remove(); });
 $('#dgo',t).onclick=()=>doRoll($('#dexpr',t).value);
 $('#dexpr',t).onkeydown=e=>{ if(e.key==='Enter') doRoll(e.target.value); if(e.key==='Escape') t.remove(); };
}

/* ===== Fuentes de la wiki ===== */
const KINDS={monster:'Monstruo',spell:'Hechizo',species:'Especie',feat:'Dote',cond:'Condición',rule:'Regla',cls:'Clase'};
function allSpells(){ return [...SPELLS,...SPELL_CAT]; }
function allSpecies(){ return [...SPECIES,...SPECIES_CAT]; }
function allMonsterEntries(){ return [...allMonsters(),...MONSTER_CAT]; }
function findEntry(k,id){
 if(k==='monster') return allMonsterEntries().find(x=>x.id===id);
 if(k==='spell') return allSpells().find(x=>x.id===id);
 if(k==='species') return allSpecies().find(x=>x.id===id);
 if(k==='feat') return allFeats().find(x=>x.id===id);
 if(k==='cond'){ const c=CONDITIONS[+id]; return c&&{id,name:c[0],desc:c[1],source:'Reglas 2024',full:true}; }
 return null;
}
const srcTag=x=>x.source==='Homebrew'?'<span class="tag hb">Homebrew</span>':x._mod?'<span class="tag mod">Modificado</span>':x.full===false?`<span class="tag ix" title="${esc(bookName(x.source))}">${esc(x.source)}</span>`:`<span class="tag" title="${esc(bookName(x.source))}">${esc(x.source==='SRD'?'SRD 5.1':x.source)}</span>`;

/* ===== Panel lateral de fichas ===== */
const DR={stack:[]};
function openEntry(k,id,push=true){
 if(k==='cls'){ CL.sel=id; closeDrawer(true); go('clases'); return; }
 const x=findEntry(k,id); if(!x){ toast('No encontré esa ficha.'); return; }
 if(push){ if(!(DR.stack.length&&DR.stack[DR.stack.length-1].k===k&&DR.stack[DR.stack.length-1].id===id)) DR.stack.push({k,id}); } else if(!DR.stack.length) DR.stack.push({k,id});
 const rec=lsGet('oz:recent',[]).filter(r=>!(r.k===k&&r.id===id)); rec.unshift({k,id}); lsSet('oz:recent',rec.slice(0,12));
 let dr=$('.drawer');
 if(!dr){ const bg=document.createElement('div'); bg.className='drawer-bg'; bg.onclick=()=>closeDrawer(); dr=document.createElement('aside'); dr.className='drawer'; dr.setAttribute('role','dialog'); dr.setAttribute('aria-modal','true'); document.body.append(bg,dr); }
 const pins=(Store.docs.settings||{}).pins||[], pinned=pins.some(p=>p.k===k&&p.id===id);
 dr.innerHTML=`<header><button class="btn ghost icon" id="drBack" aria-label="Atrás" ${DR.stack.length>1?'':'hidden'}>${I.back}</button><span class="k">${KINDS[k]}</span>
  <button class="btn ghost icon" id="drPin" title="${pinned?'Quitar de la Mesa':'Fijar en la Mesa'}" aria-label="Fijar en la Mesa">${pinned?I.pinOn:I.pinOff}</button><button class="btn ghost icon" id="drX" aria-label="Cerrar">${I.x}</button></header><div class="db" id="drBody"></div>`;
 const b=$('#drBody',dr); b.innerHTML=entryHTMLFor(k,x);
 $('#drX',dr).onclick=()=>closeDrawer(); $('#drBack',dr).onclick=()=>{ DR.stack.pop(); const t=DR.stack[DR.stack.length-1]; if(t) openEntry(t.k,t.id,false); };
 $('#drPin',dr).onclick=()=>{ const s=Object.assign({},Store.docs.settings||{}); s.pins=(s.pins||[]).filter(p=>!(p.k===k&&p.id===id)); if(!pinned) s.pins.unshift({k,id}); Store.setDoc('settings',s,300); toast(pinned?'Quitado de la Mesa.':'Fijado en la Mesa.'); openEntry(k,id,false); if(route==='mesa') render(true); };
 bindEntry(b,k,x);
}
function closeDrawer(instant){ DR.stack=[]; const d=$('.drawer'), bg=$('.drawer-bg'); if(!d) return; if(instant||reduced){ d.remove(); bg&&bg.remove(); return; } d.classList.add('out'); bg&&(bg.style.opacity=0,bg.style.transition='opacity .25s'); setTimeout(()=>{ d.remove(); bg&&bg.remove(); },280); }
const manualBtn=q=>`<button class="btn" data-manual="${esc(q)}">${I.book} Buscar en mis manuales</button>`;
const beyondBtn=en=>`<a class="btn" href="https://www.dndbeyond.com/search?q=${encodeURIComponent(en)}" target="_blank" rel="noopener">${I.ext} D&D Beyond</a>`;
const ixNote=x=>`<div class="ixnote"><b>${esc(bookName(x.source))}</b><br>Este contenido pertenece a un libro con derechos reservados, así que aquí solo aparece su ficha de índice. Sube ese libro a Manuales y el botón "Buscar en mis manuales" te lleva directo a la página.</div>`;
function entryHTMLFor(k,x){
 if(k==='monster'){
  if(x.full===false) return `<div class="sb"><h2>${esc(x.name)}</h2><div class="ty">${esc(x.type)} · <span class="muted">${esc(x.en)}</span></div><div class="facts"><div><small>Desafío</small>${esc(x.cr)} (${(CR_XP[x.cr]||0).toLocaleString('es')} PX)</div><div><small>Fuente</small>${esc(bookName(x.source))}</div></div></div>${ixNote(x)}<div class="acts" style="margin-top:14px">${manualBtn(x.name)}${beyondBtn(x.en)}<button class="btn" id="mkHB">${I.plus} Crear versión homebrew</button></div>`;
  return `<div class="acts"><input class="inp" id="bqty" type="number" min="1" max="20" value="1" style="width:68px" aria-label="Cantidad"><button class="btn pri" id="badd">${I.swords} Al combate</button><button class="btn" id="bedit">${I.edit} ${x.source==='SRD'?'Modificar':'Editar'}</button><button class="btn" id="bdup">${I.copy} Duplicar</button>${x._mod?`<button class="btn" id="breset">${I.undo} Restaurar</button>`:''}${x.source!=='SRD'?`<button class="btn danger" id="bdel">${I.trash}</button>`:''}</div>${statblock(x)}<div class="acts" style="margin-top:16px">${manualBtn(x.name)}</div>`;
 }
 if(k==='spell'){
  const lv=x.level===0?'Truco':`Nivel ${x.level}`;
  return `<div class="sb"><h2>${esc(x.name)}</h2><div class="ty">${lv} · ${esc((x.school||'').toLowerCase())}${x.ritual?' (ritual)':''} · <span class="muted">${esc(x.en)}</span></div>
  ${x.full?`<div class="facts"><div><small>Tiempo</small>${esc(x.time)}</div><div><small>Alcance</small>${esc(x.range)}</div><div><small>Componentes</small>${esc(x.comp)}</div><div><small>Duración</small>${x.conc?'Concentración, ':''}${esc(x.dur)}</div></div><p style="font-size:1.04rem">${rollify(x.desc)}</p>
  <h4>Clases</h4><div class="row" style="gap:6px">${x.classes.map(c=>`<span class="chip" data-spcls="${esc(c)}">${esc(c)}</span>`).join('')}</div>`:''}
  <div class="row" style="margin-top:14px;gap:8px">${srcTag(x)}<small class="muted">${esc(bookName(x.source))}</small></div></div>
  ${x.full?'':`<div style="margin-top:12px">${ixNote(x)}</div>`}<div class="acts" style="margin-top:14px">${manualBtn(x.name)}${x.full?'':beyondBtn(x.en)}</div>`;
 }
 if(k==='species'){
  return `<div class="sb"><h2>${esc(x.name)}</h2><div class="ty">${x.full?`${esc(x.size)} · velocidad ${esc(x.speed)}`:esc(x.desc)} · <span class="muted">${esc(x.en)}</span></div>
  ${x.full?x.traits.map(t=>`<p><b>${esc(t[0])}.</b> ${esc(t[1])}</p>`).join(''):ixNote(x)}<div class="row" style="margin-top:14px;gap:8px">${srcTag(x)}<small class="muted">${esc(bookName(x.source))}</small></div></div><div class="acts" style="margin-top:14px">${manualBtn(x.name)}${x.full?'':beyondBtn(x.en)}</div>`;
 }
 if(k==='feat'){
  const lbl=Object.fromEntries(FEAT_CATS);
  return `<div class="sb"><h2>${esc(x.name)}</h2><div class="ty">${esc(lbl[x.cat]||x.cat)}${x.en?` · <span class="muted">${esc(x.en)}</span>`:''}</div>${x.pre?`<p><b>Requisito.</b> ${esc(x.pre)}</p>`:''}<p style="font-size:1.04rem">${esc(x.desc)}</p><div class="row" style="margin-top:14px;gap:8px">${srcTag(x)}</div></div>
  <div class="acts" style="margin-top:14px">${manualBtn(x.name)}${x.source==='Homebrew'?`<button class="btn" id="fedit">${I.edit} Editar</button>`:''}</div>`;
 }
 if(k==='cond') return `<div class="sb"><h2>${esc(x.name)}</h2><p style="font-size:1.06rem">${esc(x.desc)}</p></div><div class="acts" style="margin-top:14px">${manualBtn(x.name)}</div>`;
 return '';
}
function bindEntry(b,k,x){
 $$('[data-manual]',b).forEach(btn=>btn.onclick=()=>{ LB.q=btn.dataset.manual; LB.open=null; closeDrawer(); go('biblioteca'); });
 $$('[data-spcls]',b).forEach(c=>c.onclick=()=>{ WS.hechizos={q:'',f:{cls:c.dataset.spcls}}; closeDrawer(); go('hechizos'); });
 if(k==='monster'){
  $('#mkHB',b)?.addEventListener('click',()=>{ closeDrawer(true); editMonster(null); setTimeout(()=>{ const n=$('#f-name'); if(n){ n.value=x.name; $('#f-cr').value=x.cr; $('#f-type').value=x.type; $('#f-en').value=x.en; } },60); });
  if($('#badd',b)) $('#badd',b).onclick=()=>{ const q=clamp(Number($('#bqty',b).value)||1,1,20); addMonstersToCombat(x,q); toast(`${q} × ${x.name} añadido al combate.`); };
  $('#bedit',b)?.addEventListener('click',()=>editMonster(x));
  $('#bdup',b)?.addEventListener('click',()=>{ const c=clone(x); delete c._mod; c.id='hb-'+uid(); c.name=x.name+' (variante)'; c.source='Homebrew'; Store.put('monsters',c); openEntry('monster',c.id); editMonster(c); });
  $('#breset',b)?.addEventListener('click',()=>confirmBox(`¿Volver a la versión oficial de ${x.name}?`,()=>{ Store.del('monsters',x.id); openEntry('monster',x.id,false); },'Restaurar'));
  $('#bdel',b)?.addEventListener('click',()=>confirmBox(`¿Eliminar ${x.name}?`,()=>{ Store.del('monsters',x.id); closeDrawer(); if(route==='bestiario') render(true); }));
 }
 if(k==='feat') $('#fedit',b)?.addEventListener('click',()=>{ closeDrawer(true); editFeat(Store.get('feats',x.id)); });
}

/* ===== Buscador global ===== */
function searchIndex(){
 const it=[];
 for(const [k,r] of Object.entries(ROUTES)) it.push({g:'Secciones',t:r.t,s:r.s,a:()=>go(k)});
 for(const m of allMonsterEntries()) it.push({g:'Monstruos',t:m.name,s:`${m.en||''} · VD ${m.cr}`,tag:m,a:()=>openEntry('monster',m.id)});
 for(const x of allSpells()) it.push({g:'Hechizos',t:x.name,s:`${x.en} · ${x.level?'Nv '+x.level:'Truco'}`,tag:x,a:()=>openEntry('spell',x.id)});
 for(const x of allSpecies()) it.push({g:'Especies',t:x.name,s:x.en,tag:x,a:()=>openEntry('species',x.id)});
 for(const c of CLASSES) it.push({g:'Clases',t:c.name,s:c.en,a:()=>openEntry('cls',c.id)});
 for(const [cid,str] of Object.entries(SUBCLASS_CAT)) for(const s of str.split(';')){ const [n,src]=s.split('|'); it.push({g:'Subclases',t:n,s:`${CLASSES.find(c=>c.id===cid).name} · ${src}`,a:()=>openEntry('cls',cid)}); }
 for(const f of allFeats()) it.push({g:'Dotes',t:f.name,s:f.en,tag:f,a:()=>openEntry('feat',f.id)});
 CONDITIONS.forEach((c,i)=>it.push({g:'Reglas',t:c[0],s:'Condición',a:()=>openEntry('cond',String(i))}));
 for(const [sec,list] of RULES) for(const [n] of list) it.push({g:'Reglas',t:n,s:sec,a:()=>go('reglas')});
 for(const c of Store.list('characters')) it.push({g:'Campaña',t:c.name||'Sin nombre',s:'Personaje',a:()=>editPC(c)});
 for(const n of Store.list('npcs')) it.push({g:'Campaña',t:n.name||'Sin nombre',s:'PNJ · '+(n.role||''),a:()=>editNPC(n)});
 for(const m of Store.list('maps')) it.push({g:'Campaña',t:m.name,s:'Mapa '+LEVELS[m.level].name.toLowerCase()+' · '+planeById(m.plane||'material').name,a:()=>{ if((m.plane||'material')!==curPlane) applyPlane(m.plane||'material',true); MS.open=m.id; go('mapas'); }});
 for(const m of Store.list('manuals')) it.push({g:'Campaña',t:m.title,s:'Manual',a:()=>{ LB.open=m.id; LB.page=0; go('biblioteca'); }});
 return it;
}
function initSearch(){
 const q=$('#gq'), box=$('#gs'); let idx=null, cur=[], sel=0, res=null;
 const close=()=>{ res&&res.remove(); res=null; };
 const draw=()=>{ const s=norm(q.value.trim()); if(!idx) idx=searchIndex();
  if(!res){ res=document.createElement('div'); res.className='gres'; box.append(res); res.addEventListener('mousedown',e=>e.preventDefault()); res.addEventListener('click',e=>{ const r=e.target.closest('[data-n]'); if(r) pickR(+r.dataset.n); }); }
  if(!s){ const rec=lsGet('oz:recent',[]).map(r=>{ const x=findEntry(r.k,r.id); return x&&{g:'Recientes',t:x.name,s:KINDS[r.k],a:()=>openEntry(r.k,r.id)}; }).filter(Boolean);
   cur=rec.length?rec:idx.filter(i=>i.g==='Secciones'); }
  else { const sc=i=>{ const n=norm(i.t); return n.startsWith(s)?0:n.includes(s)?1:norm(i.s||'').includes(s)?2:9; };
   cur=idx.map(i=>[sc(i),i]).filter(a=>a[0]<9).sort((a,b)=>a[0]-b[0]||a[1].t.length-b[1].t.length).slice(0,60).map(a=>a[1]);
   const order=['Secciones','Monstruos','Hechizos','Especies','Clases','Subclases','Dotes','Reglas','Campaña']; cur.sort((a,b)=>order.indexOf(a.g)-order.indexOf(b.g)); }
  const dx=q.value.trim(); if(/^\d*d\d/i.test(dx)&&roll(dx)) cur.unshift({g:'Dados',t:'Tirar '+dx,s:'Enter para tirar',a:()=>rollToast(dx,'Tirada')});
  if(s.length>1) cur.push({g:'Manuales',t:`Buscar «${q.value.trim()}» en mis manuales`,s:'Texto completo de tus PDF',a:()=>{ LB.q=q.value.trim(); LB.open=null; go('biblioteca'); }});
  sel=clamp(sel,0,cur.length-1); let last='';
  res.innerHTML=cur.map((i,n)=>{ const h=i.g!==last?`<div class="grp">${i.g}</div>`:''; last=i.g; return h+`<div class="r ${n===sel?'sel':''}" data-n="${n}"><span class="t">${esc(i.t)}</span>${i.s?`<small>${esc(i.s.slice(0,46))}</small>`:''}${i.tag&&i.tag.full===false?`<span class="tag ix">${esc(i.tag.source)}</span>`:''}</div>`; }).join('')||'<div class="muted" style="padding:12px">Sin resultados.</div>';
  const se=$('.r.sel',res); se&&se.scrollIntoView({block:'nearest'}); };
 const pickR=n=>{ const i=cur[n]; if(!i) return; q.value=''; q.blur(); close(); i.a(); };
 q.addEventListener('focus',()=>{ idx=searchIndex(); sel=0; draw(); });
 q.addEventListener('input',()=>{ sel=0; draw(); });
 q.addEventListener('blur',()=>setTimeout(close,120));
 q.addEventListener('keydown',e=>{ if(e.key==='ArrowDown'){ sel++; draw(); e.preventDefault(); } else if(e.key==='ArrowUp'){ sel=Math.max(0,sel-1); draw(); e.preventDefault(); } else if(e.key==='Enter'){ pickR(sel); } else if(e.key==='Escape'){ q.value=''; q.blur(); } });
}

/* ===== Lista genérica de la wiki ===== */
const WS={};
function wikiList(v,cfg){
 const st=WS[cfg.key]=WS[cfg.key]||{q:'',f:{}};
 const all=cfg.items(); const nFull=all.filter(x=>x.full!==false).length;
 v.innerHTML=`<div class="wrap"><div class="wl-head" style="--i:0"><div class="grow"><span class="eyebrow">${cfg.eyebrow}</span><h2 class="h1">${cfg.title}</h2><p class="muted" style="margin:6px 0 0">${nFull} con ficha completa · ${all.length-nFull} en el índice de manuales y expansiones</p></div>${cfg.create?`<button class="btn pri" id="wcreate">${I.plus} ${cfg.create.label}</button>`:''}</div>
  <div class="panel" style="--i:1;padding:14px"><div class="row"><div class="search">${I.search}<input class="inp" id="wq" placeholder="Filtrar ${cfg.title.toLowerCase()}…" value="${esc(st.q)}" aria-label="Filtrar"></div>
  <div class="filters">${cfg.filters.map(f=>`<select class="sel" data-f="${f.id}" aria-label="${esc(f.label)}"><option value="">${esc(f.label)}</option>${f.opts().map(o=>{const [val,t]=Array.isArray(o)?o:[o,o];return `<option value="${esc(val)}" ${String(st.f[f.id]??'')===String(val)?'selected':''}>${esc(t)}</option>`}).join('')}</select>`).join('')}
  <span class="chip ${st.f.full?'on':''}" id="wfull">Solo ficha completa</span><span class="chip" id="wclear">Limpiar</span></div></div></div>
  <div class="wl" id="wl" style="--i:2"></div></div>`;
 const draw=()=>{ const q=norm(st.q.trim());
  let l=all.filter(x=>(!q||norm(`${x.name} ${x.en||''} ${cfg.text?cfg.text(x):''}`).includes(q))&&(!st.f.full||x.full!==false)&&cfg.filters.every(f=>st.f[f.id]==null||st.f[f.id]===''||f.test(x,st.f[f.id])));
  l.sort(cfg.sort);
  let h='', last=null;
  for(const x of l){ const g=cfg.group(x); if(g!==last){ h+=`<div class="gh">${esc(g)}</div>`; last=g; } const r=cfg.row(x);
   h+=`<div class="wr ${x.full===false?'ix':''}" data-entry="${cfg.kind}:${esc(x.id)}"><span class="bd">${r.bd}</span><div style="min-width:0"><div class="nm">${esc(x.name)}</div><div class="ds">${esc(r.ds)}</div></div><div class="meta">${srcTag(x)}</div></div>`; }
  $('#wl').innerHTML=h||'<div class="empty"><div class="h3">Nada coincide</div>Prueba con otro nombre o limpia los filtros.</div>'; };
 $('#wq').oninput=e=>{ st.q=e.target.value; draw(); };
 $$('[data-f]',v).forEach(s=>s.onchange=()=>{ st.f[s.dataset.f]=s.value; draw(); });
 $('#wfull').onclick=e=>{ st.f.full=!st.f.full; e.target.classList.toggle('on',st.f.full); draw(); };
 $('#wclear').onclick=()=>{ WS[cfg.key]={q:'',f:{}}; render(true); };
 if(cfg.create) $('#wcreate').onclick=cfg.create.fn;
 draw();
}
const SRC_OPTS=list=>()=>[...new Set(list().map(x=>x.source))].map(s=>[s,s==='SRD'?'SRD 5.1':bookName(s)]);
function vMonstruos(v){ viewDeps=['monsters'];
 wikiList(v,{key:'bestiario',kind:'monster',eyebrow:'Wiki',title:'Monstruos',items:allMonsterEntries,create:{label:'Crear homebrew',fn:()=>editMonster(null)},
  text:x=>x.type+' '+(x.tags||[]).join(' '),
  filters:[{id:'type',label:'Tipo',opts:()=>[...new Set(allMonsterEntries().map(x=>(x.type||'').split('(')[0].trim()))].sort(),test:(x,v)=>(x.type||'').startsWith(v)},
   {id:'cr',label:'Desafío',opts:()=>[['0-1','VD 0 a 1'],['2-4','VD 2 a 4'],['5-10','VD 5 a 10'],['11-16','VD 11 a 16'],['17-30','VD 17+']],test:(x,v)=>{const [a,b]=v.split('-').map(Number);const n=crNum(x.cr);return n>=a&&n<=b;}},
   {id:'src',label:'Fuente',opts:SRC_OPTS(allMonsterEntries),test:(x,v)=>x.source===v}],
  sort:(a,b)=>crNum(a.cr)-crNum(b.cr)||a.name.localeCompare(b.name),group:x=>`Desafío ${x.cr}`,
  row:x=>({bd:esc(x.cr),ds:`${x.size?x.size+' · ':''}${x.type}${x.hp?` · CA ${x.ac} · ${x.hp} PG`:''}`})});
}
function vHechizos(v){
 wikiList(v,{key:'hechizos',kind:'spell',eyebrow:'Wiki',title:'Hechizos',items:allSpells,text:x=>(x.school||'')+' '+(x.desc||''),
  filters:[{id:'lvl',label:'Nivel',opts:()=>[['0','Trucos'],...[1,2,3,4,5,6,7,8,9].map(n=>[String(n),'Nivel '+n])],test:(x,v)=>x.level===+v},
   {id:'cls',label:'Clase',opts:()=>Object.values(SPELL_CLASSES),test:(x,v)=>x.classes.includes(v)},
   {id:'sch',label:'Escuela',opts:()=>Object.values(SCHOOLS),test:(x,v)=>x.school===v},
   {id:'conc',label:'Concentración o ritual',opts:()=>[['c','Concentración'],['r','Ritual'],['n','Sin concentración']],test:(x,v)=>v==='c'?x.conc:v==='r'?x.ritual:!x.conc},
   {id:'src',label:'Fuente',opts:SRC_OPTS(allSpells),test:(x,v)=>x.source===v}],
  sort:(a,b)=>a.level-b.level||a.name.localeCompare(b.name),group:x=>x.level===0?'Trucos':`Nivel ${x.level}`,
  row:x=>({bd:x.level===0?'T':x.level,ds:x.full?`${x.school} · ${x.time} · ${x.range}${x.conc?' · Concentración':''}${x.ritual?' · Ritual':''}`:`${x.school} · ${bookName(x.source)}`})});
}
function vEspecies(v){
 wikiList(v,{key:'especies',kind:'species',eyebrow:'Wiki',title:'Especies',items:allSpecies,text:x=>x.desc||'',
  filters:[{id:'src',label:'Fuente',opts:SRC_OPTS(allSpecies),test:(x,v)=>x.source===v}],
  sort:(a,b)=>(a.full===false)-(b.full===false)||a.name.localeCompare(b.name),group:x=>x.full===false?'Manuales y expansiones':'Reglas 2024 (ficha completa)',
  row:x=>({bd:esc(x.name[0]),ds:x.full?`${x.size} · ${x.speed} · ${x.traits.map(t=>t[0]).join(', ')}`:x.desc})});
}
function vDotesW(v){ viewDeps=['feats'];
 wikiList(v,{key:'dotes',kind:'feat',eyebrow:'Wiki',title:'Dotes',items:allFeats,create:{label:'Dote homebrew',fn:()=>editFeat(null)},text:x=>x.desc,
  filters:[{id:'cat',label:'Tipo de dote',opts:()=>FEAT_CATS.slice(1,5),test:(x,v)=>x.cat===v}],
  sort:(a,b)=>['origen','general','estilo','epico'].indexOf(a.cat)-['origen','general','estilo','epico'].indexOf(b.cat)||a.name.localeCompare(b.name),
  group:x=>Object.fromEntries(FEAT_CATS)[x.cat]||x.cat,row:x=>({bd:{origen:'O',general:'G',estilo:'E',epico:'É'}[x.cat]||'·',ds:(x.pre?x.pre+' · ':'')+x.desc})});
}
function vReglas(v){
 v.innerHTML=`<div class="wrap"><div style="--i:0"><span class="eyebrow">Wiki</span><h2 class="h1">Reglas de consulta rápida</h2><p class="muted" style="margin:6px 0 0">Lo que más se consulta en mesa, resumido. Toca una condición para abrir su ficha.</p></div>
  <div class="panel" style="--i:1"><div class="phead"><h3 class="h2">Condiciones</h3></div><div class="cond-list">${CONDITIONS.map((c,i)=>`<div class="cond" data-entry="cond:${i}"><b>${c[0]}</b>${esc(c[1])}</div>`).join('')}</div></div>
  <div class="cols2" style="--i:2">${RULES.map(([t,list])=>`<div class="panel"><h3 class="h3" style="margin-bottom:10px">${t}</h3>${list.map(([n,d])=>`<p style="margin:6px 0"><b style="color:var(--acc2)">${esc(n)}.</b> ${esc(d)}</p>`).join('')}</div>`).join('')}</div></div>`;
}
function vWiki(v){
 const tiles=[['bestiario','Monstruos','skull',allMonsterEntries().length,'Estadísticas completas del SRD, homebrew y catálogo de expansiones.'],['hechizos','Hechizos','wand',allSpells().length,'Todos los hechizos del SRD y el índice de los manuales.'],['especies','Especies','leaf',allSpecies().length,'Especies 2024 y todas las de expansiones.'],['clases','Clases','shield',CLASSES.length+EXTRA_CLASSES.length,'Rasgos nivel por nivel y todas las subclases.'],['dotes','Dotes','star',allFeats().length,'De origen, generales, estilos y dones épicos.'],['reglas','Reglas','scale',CONDITIONS.length+RULES.reduce((s,r)=>s+r[1].length,0),'Condiciones, acciones, cobertura, descansos.'],['biblioteca','Manuales','book',Store.list('manuals').length,'Tus PDF convertidos en texto buscable.']];
 const rec=lsGet('oz:recent',[]).map(r=>({r,x:findEntry(r.k,r.id)})).filter(o=>o.x);
 v.innerHTML=`<div class="wrap"><div style="--i:0"><span class="eyebrow">Compendio</span><h2 class="h1">La wiki de tu mesa</h2><p class="muted" style="margin:8px 0 0;max-width:68ch">Usa el buscador de arriba para encontrar cualquier cosa al instante. Las fichas con texto completo vienen del contenido libre (SRD); las de libros con derechos aparecen en el índice con su fuente y se abren en tu PDF cuando lo subes a Manuales.</p></div>
  <div class="tiles" style="--i:1">${tiles.map((t,i)=>`<div class="card tile" data-go="${t[0]}" style="animation:rise .6s ${i*60}ms var(--ease) both"><span class="ico">${I[t[2]]}</span><div class="h3">${t[1]}</div><div class="muted" style="font-size:.88rem">${t[4]}</div><b class="n">${t[3]}</b></div>`).join('')}</div>
  ${rec.length?`<div class="panel" style="--i:2"><h3 class="h3" style="margin-bottom:10px">Consultado hace poco</h3><div class="pins">${rec.map(o=>`<span class="pin" data-entry="${o.r.k}:${esc(o.r.id)}">${esc(o.x.name)} <small class="muted">${KINDS[o.r.k]}</small></span>`).join('')}</div></div>`:''}
  <div class="panel" style="--i:3"><h3 class="h3" style="margin-bottom:10px">Fuentes</h3><div class="grid2" style="font-size:.88rem">${Object.entries(BOOKS).map(([k,n])=>`<div><span class="tag ${k.startsWith('SRD')||k==='Reglas 2024'?'':'ix'}">${esc(k)}</span> ${esc(n)}</div>`).join('')}</div></div></div>`;
}

/* ===== MESA ===== */
function vMesa(v){
 viewDeps=['characters','sessions','settings'];
 const pl=planeById(curPlane), pcs=Store.list('characters').sort((a,b)=>(a.name||'').localeCompare(b.name||''));
 const sess=Store.list('sessions').sort((a,b)=>(b.n||0)-(a.n||0)); const cur=sess[0];
 const pins=((Store.docs.settings||{}).pins||[]).map(p=>({p,x:findEntry(p.k,p.id)})).filter(o=>o.x);
 const c=Store.docs.combat; const inCombat=c&&c.list&&c.list.length;
 v.innerHTML=`<div class="wrap">
 <div class="hero" style="--i:0">
  <div class="panel glow plane-banner"><span class="sigil" aria-hidden="true">${SIGIL}</span><span class="eyebrow">Plano activo</span><h2 class="h1">${esc(pl.name)}</h2><p class="muted" style="margin:0 0 12px;max-width:52ch">${esc(pl.sub)} Los mapas que ves y creas pertenecen a este plano.</p>
   <div class="row"><button class="btn" data-plane-open>${I.portal} Cambiar de plano</button>${inCombat?`<button class="btn pri" data-go="combate">${I.swords} Volver al combate · ronda ${c.round}</button>`:''}</div></div>
  <div class="panel"><span class="eyebrow">Acceso rápido</span><div class="quick" style="margin-top:12px">
   <button class="qa" data-go="combate">${I.swords}<span><b>Combate</b><small>Iniciativa y PG</small></span></button>
   <button class="qa" id="qa20">${I.d20}<span><b>Tirar d20</b><small>O usa la tecla D</small></span></button>
   <button class="qa" id="qaNpc">${I.mask}<span><b>PNJ al azar</b><small>Nombre, manía y secreto</small></span></button>
   <button class="qa" id="qaFind">${I.search}<span><b>Buscar regla</b><small>Monstruos, hechizos…</small></span></button>
   <button class="qa" data-go="mapas">${I.map}<span><b>Mapas</b><small>${esc(pl.name)}</small></span></button>
   <button class="qa" data-go="biblioteca">${I.book}<span><b>Manuales</b><small>Busca en tus PDF</small></span></button></div></div>
 </div>
 <div class="panel" style="--i:1"><div class="phead"><h3 class="h2">El grupo</h3><div class="row"><button class="btn sm" id="toCombat">${I.swords} Al combate</button><button class="btn sm" data-go="personajes">${I.users} Gestionar</button></div></div>
  ${pcs.length?`<div class="party">${pcs.map(p=>{ const pct=p.max?clamp((p.hp??p.max)/p.max*100,0,100):100; return `<div class="pc" data-pc="${p.id}"><div class="av" style="background:${esc(p.color||'#d6a44c')}">${esc((p.name||'?')[0])}</div><div style="flex:1;min-width:0"><div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.name)}</div><div class="muted mono" style="font-size:.76rem">${esc(p.cls||'')} ${p.level||''} · CA ${p.ac||'—'} · PP ${p.pp||10+mod(p.wis)}</div><div class="hpbar"><i style="width:${pct}%;background:${pct<30?'var(--bad)':pct<60?'var(--warn)':'var(--ok)'}"></i></div></div></div>`; }).join('')}</div>`
  :`<div class="empty"><div class="h3">Todavía no hay personajes</div>Agrégalos para ver sus PG, CA y Percepción pasiva de un vistazo.<div style="margin-top:12px"><button class="btn pri" data-go="personajes">${I.plus} Agregar personaje</button></div></div>`}
 </div>
 <div class="cols2" style="--i:2">
  <div class="panel"><div class="phead"><h3 class="h2">Bitácora</h3><button class="btn sm" id="newSess">${I.plus} Nueva sesión</button></div>
   ${cur?`<div class="row" style="flex-wrap:nowrap;margin-bottom:8px"><input class="inp mono" id="s-n" type="number" style="width:76px" value="${cur.n||1}" aria-label="Número de sesión"><input class="inp" id="s-t" value="${esc(cur.title||'')}" placeholder="Título de la sesión" aria-label="Título"><input class="inp" id="s-d" type="date" style="width:160px" value="${esc(cur.date||'')}" aria-label="Fecha"></div>
   <textarea class="inp" id="s-x" rows="10" placeholder="Qué pasó, ganchos pendientes, botín, PX…">${esc(cur.notes||'')}</textarea>
   ${sess.length>1?`<div class="row" style="margin-top:10px;gap:6px">${sess.slice(1,12).map(s=>`<span class="chip" data-sess="${s.id}">#${s.n} ${esc((s.title||'').slice(0,22))}</span>`).join('')}</div>`:''}`
   :`<div class="empty">Lleva un registro de cada sesión: lo que pasó, ganchos y botín.<div style="margin-top:10px"><button class="btn pri" id="newSess2">${I.plus} Empezar la primera</button></div></div>`}</div>
  <div style="display:flex;flex-direction:column;gap:20px">
   <div class="panel"><div class="phead"><h3 class="h2">Fijado para esta sesión</h3></div>${pins.length?`<div class="pins">${pins.map(o=>`<span class="pin" data-entry="${o.p.k}:${esc(o.p.id)}">${esc(o.x.name)} <small class="muted">${KINDS[o.p.k]}</small><button data-unpin="${o.p.k}:${esc(o.p.id)}" aria-label="Quitar">${I.x.replace('<svg','<svg width="14" height="14"')}</button></span>`).join('')}</div>`:`<p class="muted" style="margin:0">Abre cualquier ficha de la wiki y toca el alfiler para tenerla aquí a mano: el jefe de hoy, los hechizos que más usas, una condición.</p>`}</div>
   <div class="panel"><div class="phead"><h3 class="h2">Nombres al vuelo</h3></div><div class="row" style="flex-wrap:nowrap"><select class="sel" id="g-sp" aria-label="Especie">${Object.keys(NAMEGEN).map(s=>`<option>${s}</option>`).join('')}</select><button class="btn" id="g-name">${I.sparkle} Generar</button></div><div id="g-out" class="row" style="margin-top:10px;min-height:32px;gap:6px"></div></div>
  </div>
 </div>
 <div class="panel" style="--i:3"><div class="phead"><h3 class="h2">Condiciones</h3><button class="btn sm" data-go="reglas">${I.scale} Todas las reglas</button></div><div class="cond-list">${CONDITIONS.map((c,i)=>`<div class="cond" data-entry="cond:${i}"><b>${c[0]}</b>${esc(c[1].length>90?c[1].slice(0,88)+'…':c[1])}</div>`).join('')}</div></div>
 </div>`;
 $$('[data-pc]',v).forEach(e=>e.onclick=()=>editPC(Store.get('characters',e.dataset.pc)));
 $('#qa20').onclick=()=>rollToast('1d20','d20'); $('#qaNpc').onclick=()=>editNPC(randomNPC()); $('#qaFind').onclick=()=>$('#gq').focus();
 $('#toCombat').onclick=()=>{ const n=addPCsToCombat(); toast(n?`${n} personajes añadidos al combate.`:'El grupo ya está en el combate.'); };
 const ns=()=>{ const n=(cur?.n||0)+1; Store.put('sessions',{id:uid(),n,title:'',date:new Date().toISOString().slice(0,10),notes:''}); render(true); };
 $('#newSess',v).onclick=ns; $('#newSess2',v)?.addEventListener('click',ns);
 if(cur){ const save=()=>{ Object.assign(cur,{n:Number($('#s-n').value)||1,title:$('#s-t').value,date:$('#s-d').value,notes:$('#s-x').value}); Store.put('sessions',cur,800); };
  ['#s-n','#s-t','#s-d','#s-x'].forEach(s=>$(s,v).addEventListener('input',save)); }
 $$('[data-sess]',v).forEach(ch=>ch.onclick=()=>{ const s=Store.get('sessions',ch.dataset.sess); modal({title:`Sesión ${s.n}: ${s.title||''}`,body:`<p class="muted" style="margin:0">${esc(s.date||'')}</p><div style="white-space:pre-wrap">${esc(s.notes||'Sin notas.')}</div>`}); });
 $$('[data-unpin]',v).forEach(b=>b.onclick=e=>{ e.stopPropagation(); const [k,id]=b.dataset.unpin.split(':'); const s=Object.assign({},Store.docs.settings||{}); s.pins=(s.pins||[]).filter(p=>!(p.k===k&&p.id===id)); Store.setDoc('settings',s,300); render(true); });
 $('#g-name',v).onclick=()=>{ const sp=$('#g-sp').value; $('#g-out').innerHTML=Array.from({length:5},(_,i)=>`<span class="chip st" style="animation:pop .4s ${i*60}ms var(--spring) both">${esc(genName(sp))}</span>`).join(''); };
}
function genName(sp){ const g=NAMEGEN[sp]||NAMEGEN.Humano; const n=pick(g.a)+pick(g.b); return n[0].toUpperCase()+n.slice(1); }
