/* ===== BESTIARIO ===== */
const BS={q:'',type:'',src:'todos',crMin:'',crMax:'',sort:'nombre',sel:null};
function allMonsters(){
 const over=Store.data.monsters||{}, out=[];
 for(const m of SRD_MONSTERS) out.push(over[m.id]?Object.assign({},over[m.id],{_mod:true}):m);
 for(const m of Object.values(over)) if(!String(m.id).startsWith('srd-')) out.push(m);
 return out;
}
const monType=m=>(m.type||'').split('(')[0].trim();
function filteredMonsters(){
 const q=norm(BS.q.trim());
 let l=allMonsters().filter(m=>{
  if(q&&!norm(`${m.name} ${m.en||''} ${m.type} ${(m.tags||[]).join(' ')}`).includes(q)) return false;
  if(BS.type&&monType(m)!==BS.type) return false;
  if(BS.src==='srd'&&m.source!=='SRD') return false;
  if(BS.src==='homebrew'&&m.source==='SRD') return false;
  if(BS.src==='mod'&&!m._mod) return false;
  if(BS.crMin!==''&&crNum(m.cr)<crNum(BS.crMin)) return false;
  if(BS.crMax!==''&&crNum(m.cr)>crNum(BS.crMax)) return false;
  return true; });
 l.sort(BS.sort==='vd'?(a,b)=>crNum(a.cr)-crNum(b.cr)||a.name.localeCompare(b.name):(a,b)=>a.name.localeCompare(b.name));
 return l;
}
function statblock(m,compact){
 const ab=['str','dex','con','int','wis','cha'], lab=['FUE','DES','CON','INT','SAB','CAR'];
 const kv=(k,v)=>v?`<span><b>${k}</b> ${esc(v)}</span>`:'';
 const sec=(t,arr)=>arr&&arr.length?`<h4>${t}</h4>${arr.map(entryHTML).join('')}`:'';
 return `<div class="sb">
  <div class="row" style="justify-content:space-between;align-items:flex-start;flex-wrap:nowrap"><div style="min-width:0"><h2>${esc(m.name)}</h2><div class="ty">${esc(m.size)} ${esc((m.type||'').toLowerCase())}, ${esc((m.align||'').toLowerCase())}${m.en?` · <span class="muted">${esc(m.en)}</span>`:''}</div></div>
  <div class="row" style="gap:6px;flex-wrap:nowrap">${m.source==='SRD'?(m._mod?'<span class="tag mod">Modificado</span>':'<span class="tag">SRD</span>'):'<span class="tag hb">Homebrew</span>'}</div></div>
  <div class="kv"><span><b>CA</b> ${esc(m.ac)}${m.acNote?` (${esc(m.acNote)})`:''}</span><span><b>PG</b> ${esc(m.hp)}${m.hpDice?` (<span class="roll" data-roll="${esc(m.hpDice)}" data-label="PG ${esc(m.name)}">${esc(m.hpDice)}</span>)`:''}</span><span><b>Velocidad</b> ${esc(m.speed)}</span></div>
  <div class="abil">${ab.map((a,i)=>`<div data-roll="1d20${fm(mod(m[a])).replace('−','-')}" data-label="Prueba de ${lab[i]}" title="Tirar prueba de ${lab[i]}"><small>${lab[i]}</small><b>${m[a]}</b> <i>${fm(mod(m[a]))}</i></div>`).join('')}</div>
  <div class="kv" style="flex-direction:column;gap:2px">${kv('Salvaciones',m.saves)}${kv('Habilidades',m.skills)}${kv('Vulnerabilidades',m.vuln)}${kv('Resistencias',m.res)}${kv('Inmunidades al daño',m.imm)}${kv('Inmunidades a estados',m.condImm)}${kv('Sentidos',m.senses)}${kv('Idiomas',m.lang)}<span><b>Desafío</b> ${esc(m.cr)} (${(CR_XP[m.cr]||0).toLocaleString('es')} PX) · <b>Bonif. competencia</b> +${profByCR(m.cr)}</span></div>
  ${sec('Rasgos',m.traits)}${sec('Acciones',m.actions)}${sec('Acciones adicionales',m.bonus)}${sec('Reacciones',m.reactions)}${sec('Acciones legendarias',m.legendary)}
  ${m.notes&&!compact?`<h4>Notas del DM</h4><p style="white-space:pre-wrap">${esc(m.notes)}</p>`:''}
 </div>`;
}
function vBestiario(v){
 viewDeps=['monsters'];
 const types=[...new Set(allMonsters().map(monType))].sort();
 const crs=Object.keys(CR_XP);
 v.innerHTML=`<div class="toolbar">
  <div class="search">${I.search}<input class="inp" id="bq" placeholder="Buscar criatura…" value="${esc(BS.q)}" aria-label="Buscar criatura"></div>
  <select class="sel" id="bt" style="width:auto" aria-label="Tipo"><option value="">Todos los tipos</option>${types.map(t=>`<option ${t===BS.type?'selected':''}>${esc(t)}</option>`).join('')}</select>
  <select class="sel" id="bmin" style="width:auto" aria-label="VD mínimo"><option value="">VD desde</option>${crs.map(c=>`<option ${c===BS.crMin?'selected':''}>${c}</option>`).join('')}</select>
  <select class="sel" id="bmax" style="width:auto" aria-label="VD máximo"><option value="">VD hasta</option>${crs.map(c=>`<option ${c===BS.crMax?'selected':''}>${c}</option>`).join('')}</select>
  <div class="row" style="gap:6px">${[['todos','Todos'],['srd','Oficiales'],['homebrew','Homebrew'],['mod','Modificados']].map(([k,t])=>`<span class="chip ${BS.src===k?'on':''}" data-src="${k}">${t}</span>`).join('')}</div>
  <div class="grow" style="flex:1"></div>
  <button class="btn pri" id="bnew">${I.plus} Crear homebrew</button>
 </div>
 <div class="split"><div><div class="row" style="justify-content:space-between;margin-bottom:6px"><small class="muted" id="bcount"></small><select class="sel" id="bsort" style="width:auto;padding:4px 8px;font-size:.85rem" aria-label="Ordenar"><option value="nombre">Por nombre</option><option value="vd" ${BS.sort==='vd'?'selected':''}>Por VD</option></select></div><div class="list" id="blist"></div></div><div id="bdetail"></div></div>`;
 const list=()=>{ const l=filteredMonsters(); if(!BS.sel||!l.find(m=>m.id===BS.sel)) BS.sel=l[0]?.id||null;
  $('#bcount').textContent=`${l.length} criaturas`;
  $('#blist').innerHTML=l.map(m=>`<div class="li ${m.id===BS.sel?'on':''}" data-id="${esc(m.id)}"><span class="cr">${esc(m.cr)}</span><span class="nm">${esc(m.name)}</span>${m.source!=='SRD'?'<span class="tag hb">HB</span>':m._mod?'<span class="tag mod">MOD</span>':''}</div>`).join('')||'<div class="empty">Ninguna criatura coincide con los filtros.</div>';
  detail(); };
 const detail=()=>{ const m=allMonsters().find(x=>x.id===BS.sel); const d=$('#bdetail');
  if(!m){ d.innerHTML='<div class="empty"><div class="h3">Elige una criatura</div>o crea una nueva de tu cosecha.</div>'; return; }
  d.innerHTML=`<div class="row" style="margin-bottom:12px"><input class="inp" id="bqty" type="number" min="1" max="20" value="1" style="width:70px" aria-label="Cantidad"><button class="btn pri" id="badd">${I.swords} Al combate</button><button class="btn" id="bedit">${I.edit} ${m.source==='SRD'?'Modificar':'Editar'}</button><button class="btn" id="bdup">${I.copy} Duplicar</button>${m._mod?`<button class="btn" id="breset">${I.undo} Restaurar oficial</button>`:''}${m.source!=='SRD'?`<button class="btn danger" id="bdel">${I.trash} Eliminar</button>`:''}</div>${statblock(m)}`;
  d.firstElementChild.nextElementSibling.style.animation='rise .4s cubic-bezier(.2,.8,.2,1)';
  $('#badd').onclick=()=>{ const q=clamp(Number($('#bqty').value)||1,1,20); addMonstersToCombat(m,q); toast(`${q} × ${m.name} añadido al combate.`); };
  $('#bedit').onclick=()=>editMonster(m);
  $('#bdup').onclick=()=>{ const c=clone(m); delete c._mod; c.id='hb-'+uid(); c.name=m.name+' (variante)'; c.source='Homebrew'; Store.put('monsters',c); BS.sel=c.id; editMonster(c); };
  if($('#breset')) $('#breset').onclick=()=>confirmBox(`¿Volver a la versión oficial de ${m.name}? Se pierden tus cambios.`,()=>{ Store.del('monsters',m.id); list(); },'Restaurar');
  if($('#bdel')) $('#bdel').onclick=()=>confirmBox(`¿Eliminar ${m.name}?`,()=>{ Store.del('monsters',m.id); BS.sel=null; list(); });
 };
 $('#bq').oninput=e=>{BS.q=e.target.value;list()};
 $('#bt').onchange=e=>{BS.type=e.target.value;list()};
 $('#bmin').onchange=e=>{BS.crMin=e.target.value;list()};
 $('#bmax').onchange=e=>{BS.crMax=e.target.value;list()};
 $('#bsort').onchange=e=>{BS.sort=e.target.value;list()};
 $$('[data-src]',v).forEach(c=>c.onclick=()=>{BS.src=c.dataset.src;$$('[data-src]',v).forEach(x=>x.classList.toggle('on',x===c));list()});
 $('#blist').onclick=e=>{ const li=e.target.closest('[data-id]'); if(!li) return; BS.sel=li.dataset.id; $$('#blist .li').forEach(x=>x.classList.toggle('on',x===li)); detail(); if(innerWidth<900) $('#bdetail').scrollIntoView({behavior:'smooth'}); };
 $('#bnew').onclick=()=>editMonster(null);
 list();
}
function editMonster(m){
 const isNew=!m; m=m?clone(m):{id:'hb-'+uid(),name:'',en:'',size:'Mediano',type:'Monstruosidad',align:'Neutral',ac:12,acNote:'',hp:20,hpDice:'3d8+6',speed:'9 m',str:10,dex:10,con:10,int:10,wis:10,cha:10,cr:'1',saves:'',skills:'',vuln:'',res:'',imm:'',condImm:'',senses:'Percepción pasiva 10',lang:'Común',traits:[],actions:[],bonus:[],reactions:[],legendary:[],source:'Homebrew',tags:[],notes:''};
 delete m._mod; const lines=a=>(a||[]).join('\n');
 const md=modal({title:isNew?'Nueva criatura homebrew':(m.source==='SRD'?'Modificar '+m.name:'Editar '+m.name),wide:true,body:`
  <div class="grid3">${fld('Nombre','name',m.name)}${fld('Nombre original (opcional)','en',m.en)}${sel('Tamaño','size',m.size,['Diminuto','Pequeño','Mediano','Grande','Enorme','Gargantuesco'])}</div>
  <div class="grid3">${fld('Tipo','type',m.type)}${fld('Alineamiento','align',m.align)}${sel('Valor de desafío','cr',m.cr,Object.keys(CR_XP))}</div>
  <div class="grid3">${fld('CA','ac',m.ac,'number')}${fld('Nota de CA','acNote',m.acNote)}${fld('Velocidad','speed',m.speed)}</div>
  <div class="grid3">${fld('PG','hp',m.hp,'number')}${fld('Dados de golpe','hpDice',m.hpDice)}${fld('Etiquetas (coma)','tags',(m.tags||[]).join(', '))}</div>
  <div class="grid6">${['str','dex','con','int','wis','cha'].map((a,i)=>fld(['FUE','DES','CON','INT','SAB','CAR'][i],a,m[a],'number','min="1" max="30"')).join('')}</div>
  <div class="grid2">${fld('Salvaciones','saves',m.saves)}${fld('Habilidades','skills',m.skills)}${fld('Vulnerabilidades','vuln',m.vuln)}${fld('Resistencias','res',m.res)}${fld('Inmunidades al daño','imm',m.imm)}${fld('Inmunidades a estados','condImm',m.condImm)}${fld('Sentidos','senses',m.senses)}${fld('Idiomas','lang',m.lang)}</div>
  <p class="muted" style="margin:0;font-size:.85rem">Una entrada por línea con el formato <span class="mono">Nombre: descripción</span>. Escribe "+5 al impacto" y "2d6+3" para que sean tiradas clicables.</p>
  ${area('Rasgos','traits',lines(m.traits),4)}${area('Acciones','actions',lines(m.actions),5)}
  <div class="grid2">${area('Acciones adicionales','bonus',lines(m.bonus),3)}${area('Reacciones','reactions',lines(m.reactions),3)}</div>
  ${area('Acciones legendarias','legendary',lines(m.legendary),3)}${area('Notas del DM','notes',m.notes||'',3)}`,
  foot:`<button class="btn" data-c>Cancelar</button><button class="btn pri" data-s>${I.save} Guardar</button>`});
 $('[data-c]',md.el).onclick=md.close;
 $('[data-s]',md.el).onclick=()=>{ const f=vals(md.el); if(!f.name.trim()){ $('#f-name',md.el).focus(); toast('Ponle un nombre a la criatura.','bad'); return; }
  for(const k of ['traits','actions','bonus','reactions','legendary']) f[k]=f[k].split('\n').map(s=>s.trim()).filter(Boolean);
  f.tags=f.tags.split(',').map(s=>s.trim()).filter(Boolean);
  Object.assign(m,f); Store.put('monsters',m); BS.sel=m.id; md.close(); toast(isNew?'Criatura creada.':'Cambios guardados.'); if(route==='bestiario') render(true); if(DR.stack.length) openEntry('monster',m.id,false); };
}

/* ===== COMBATE ===== */
const CS=()=>{ if(!Store.docs.combat) Store.docs.combat={round:1,turn:0,active:false,list:[],log:[],hpMode:'avg'}; return Store.docs.combat; };
const saveCombat=()=>{ Store.setDoc('combat',CS(),400); counts(); };
const clog=t=>{ const c=CS(); c.log.unshift(`R${c.round} · ${t}`); c.log.length=Math.min(c.log.length,60); };
function addMonstersToCombat(m,q){
 const c=CS(); const same=c.list.filter(x=>x.ref===m.id).length;
 for(let i=0;i<q;i++){ const hp=c.hpMode==='roll'&&m.hpDice?(roll(m.hpDice)?.total||m.hp):m.hp;
  c.list.push({id:uid(),name:q>1||same?`${m.name} ${same+i+1}`:m.name,kind:'mon',ref:m.id,init:null,dex:mod(m.dex),ac:Number(m.ac)||10,hp,max:hp,tmp:0,conds:[],conc:false,cr:m.cr}); }
 clog(`Entra ${q} × ${m.name}`); saveCombat();
}
function addPCsToCombat(){ const c=CS(); let n=0; for(const p of Store.list('characters')){ if(c.list.find(x=>x.ref===p.id)) continue;
  c.list.push({id:uid(),name:p.name||'PJ',kind:'pj',ref:p.id,init:null,dex:mod(p.dex),ac:Number(p.ac)||10,hp:p.hp??p.max??10,max:p.max||10,tmp:0,conds:[],conc:false,ds:{s:0,f:0},level:p.level||1}); n++; }
 if(n){ clog(`Se unen ${n} personajes`); saveCombat(); } return n; }
function addNPCToCombat(n){ const t=n.template&&allMonsters().find(m=>m.id===n.template); const c=CS();
 c.list.push({id:uid(),name:n.name,kind:'pnj',ref:n.id,tpl:t?.id||null,init:null,dex:t?mod(t.dex):0,ac:t?Number(t.ac):10,hp:t?t.hp:10,max:t?t.hp:10,tmp:0,conds:[],conc:false,cr:t?.cr,ally:n.att==='aliado'});
 clog(`Entra ${n.name}`); saveCombat(); }
function sortInit(c){ c.list.sort((a,b)=>(b.init??-99)-(a.init??-99)||(b.dex||0)-(a.dex||0)); }
function vCombate(v){
 viewDeps=['combat','characters'];
 const c=CS(); const cur=c.active?c.list[c.turn]:null;
 const party=c.list.filter(x=>x.kind==='pj').map(x=>x.level||Store.get('characters',x.ref)?.level||1);
 const lv=party.length?party:Store.list('characters').map(p=>p.level||1);
 const budget=[0,1,2].map(i=>lv.reduce((s,l)=>s+XP_BUDGET[clamp(l,1,20)-1][i],0));
 const xp=c.list.filter(x=>(x.kind==='mon'||(x.kind==='pnj'&&!x.ally))&&x.cr).reduce((s,x)=>s+(CR_XP[x.cr]||0),0);
 const diff=!lv.length?'Agrega personajes para calcular':xp===0?'Sin enemigos':xp<=budget[0]?'Bajo':xp<=budget[1]?'Moderado':xp<=budget[2]?'Alto':'Supera el alto: muy peligroso';
 v.innerHTML=`
 <div class="cb-head">
  <div class="round"><div><small class="muted" style="font-size:.7rem;letter-spacing:.14em">RONDA</small><br><b id="rnd">${c.round}</b></div><div style="min-width:0"><small class="muted" style="font-size:.7rem;letter-spacing:.14em">TURNO DE</small><div style="font:400 1.2rem var(--f-disp)">${cur?esc(cur.name):'—'}</div></div></div>
  <button class="btn" id="cprev" ${!c.active?'disabled':''}>${I.prev} Anterior</button>
  <button class="btn pri" id="cnext">${I.next} ${c.active?'Siguiente turno':'Empezar combate'} <kbd style="color:inherit;border-color:currentColor;opacity:.7">N</kbd></button>
  <button class="btn" id="cinit">${I.d20} Tirar iniciativa</button>
  <div class="grow" style="flex:1"></div>
  <button class="btn" id="cadd">${I.plus} Añadir</button>
  <button class="btn" id="cpcs">${I.users} Grupo</button>
  <button class="btn danger" id="cend">${I.x} Terminar</button>
 </div>
 <div class="init" id="clist">${c.list.length?c.list.map((x,i)=>cRow(x,i===c.turn&&c.active)).join(''):`<div class="empty"><div class="h3">Ningún combatiente</div>Añade al grupo, criaturas del bestiario o PNJ. La iniciativa se tira con un clic y el orden se arma solo.<div class="row" style="justify-content:center;margin-top:12px"><button class="btn pri" data-go="bestiario">${I.skull} Ir al bestiario</button><button class="btn" id="cpcs2">${I.users} Añadir el grupo</button></div></div>`}</div>
 <div class="cols2" style="margin-top:18px">
  <div class="panel"><h3 class="h3" style="margin-bottom:10px">Dificultad</h3>
   <div class="diff"><span class="mono">${xp.toLocaleString('es')} PX</span><div class="meter"><i style="width:${budget[2]?clamp(xp/budget[2]*100,0,100):0}%"></i></div><b>${diff}</b></div>
   <p class="muted" style="font-size:.85rem;margin:8px 0 0">Grupo de ${lv.length} (${lv.join(', ')||'—'}). Presupuesto: bajo ${budget[0].toLocaleString('es')} · moderado ${budget[1].toLocaleString('es')} · alto ${budget[2].toLocaleString('es')} PX.</p>
   <hr class="rule"><div class="row"><label class="f" style="flex-direction:row;align-items:center;gap:8px"><span>PG de criaturas</span><select class="sel" id="chp" style="width:auto"><option value="avg">Promedio</option><option value="roll" ${c.hpMode==='roll'?'selected':''}>Tirados</option></select></label><button class="btn sm" id="cclean">${I.trash} Quitar derrotados</button></div>
  </div>
  <div class="panel"><h3 class="h3" style="margin-bottom:10px">Registro</h3><div class="log">${c.log.map(l=>`<div>${esc(l)}</div>`).join('')||'<span class="muted">Los daños, curas y turnos aparecen aquí.</span>'}</div></div>
 </div>`;
 const rer=()=>{ saveCombat(); render(true); };
 $('#cnext').onclick=nextTurn; $('#cprev').onclick=()=>{ if(!c.active) return; c.turn--; if(c.turn<0){ c.turn=c.list.length-1; c.round=Math.max(1,c.round-1);} rer(); };
 $('#cinit').onclick=()=>{ for(const x of c.list){ if(x.kind==='pj'&&x.init!=null) continue; x.init=(roll('1d20')?.total||10)+(x.dex||0); } sortInit(c); c.turn=0; clog('Iniciativa tirada'); rer(); toast('Iniciativa tirada. Los personajes que ya tenían valor se mantienen.'); };
 $('#cadd').onclick=addDialog;
 const pcs=()=>{ const n=addPCsToCombat(); toast(n?`${n} personajes añadidos.`:'El grupo ya está en el combate (o no hay personajes).'); render(true); };
 $('#cpcs').onclick=pcs; if($('#cpcs2')) $('#cpcs2').onclick=pcs;
 $('#cend').onclick=()=>confirmBox('¿Terminar el combate y vaciar la lista?',()=>{ Store.docs.combat={round:1,turn:0,active:false,list:[],log:[],hpMode:c.hpMode}; saveCombat(); render(true); },'Terminar');
 $('#chp').onchange=e=>{c.hpMode=e.target.value;saveCombat()};
 $('#cclean').onclick=()=>{ const curId=cur?.id; c.list=c.list.filter(x=>x.hp>0||x.kind==='pj'); c.turn=Math.max(0,c.list.findIndex(x=>x.id===curId)); rer(); };
 const L=$('#clist');
 L.addEventListener('change',e=>{ const row=e.target.closest('[data-cid]'); if(!row) return; const x=c.list.find(k=>k.id===row.dataset.cid);
  if(e.target.name==='init'){ const curId=cur?.id; x.init=e.target.value===''?null:Number(e.target.value); sortInit(c); if(curId) c.turn=c.list.findIndex(k=>k.id===curId); rer(); } });
 L.addEventListener('keydown',e=>{ if(e.key==='Enter'&&e.target.name==='amt'){ e.preventDefault(); hpChange(e.target.closest('[data-cid]').dataset.cid,'dmg'); } });
 L.addEventListener('click',e=>{ const row=e.target.closest('[data-cid]'); if(!row) return; const id=row.dataset.cid, x=c.list.find(k=>k.id===id); const b=e.target.closest('[data-a]'); if(!b) return; const a=b.dataset.a;
  if(a==='dmg'||a==='heal'||a==='tmp') hpChange(id,a);
  else if(a==='cond') condDialog(x);
  else if(a==='rmcond'){ x.conds.splice(Number(b.dataset.i),1); rer(); }
  else if(a==='conc'){ x.conc=!x.conc; clog(`${x.name} ${x.conc?'se concentra':'deja la concentración'}`); rer(); }
  else if(a==='del'){ const curId=cur?.id; c.list=c.list.filter(k=>k!==x); c.turn=Math.max(0,c.list.findIndex(k=>k.id===curId)); rer(); }
  else if(a==='sb'){ const m=allMonsters().find(mm=>mm.id===(x.tpl||x.ref)); if(m) modal({title:m.name,wide:true,body:statblock(m,true)}); else if(x.kind==='pj'){ const p=Store.get('characters',x.ref); if(p) editPC(p);} }
  else if(a==='ds'){ x.ds=x.ds||{s:0,f:0}; const k=b.dataset.k; x.ds[k]=(x.ds[k]+1)%4; if(x.ds.s>=3) clog(`${x.name} se estabiliza`); if(x.ds.f>=3) clog(`${x.name} muere`); rer(); }
 });
}
function cRow(x,isCur){
 const pct=x.max?clamp(x.hp/x.max*100,0,100):0, col=pct<=0?'var(--ink3)':pct<30?'var(--bad)':pct<60?'var(--warn)':'var(--ok)';
 const kind=x.kind==='pj'?'Personaje':x.kind==='pnj'?(x.ally?'PNJ aliado':'PNJ'):'Criatura';
 return `<div class="cmb ${isCur?'cur':''} ${x.hp<=0?'down':''}" data-cid="${x.id}">
  <input class="ini mono" name="init" type="number" value="${x.init??''}" placeholder="–" aria-label="Iniciativa de ${esc(x.name)}">
  <div style="min-width:0"><div class="nm"><a href="#" data-a="sb" style="color:inherit;text-decoration:none" title="Ver ficha">${esc(x.name)}</a></div><div class="kd muted">${kind}${x.cr?` · VD ${esc(x.cr)}`:''}${x.dex?` · Des ${fm(x.dex)}`:''}</div></div>
  <div class="ac">${x.ac}<small>CA</small></div>
  <div class="hpw"><div class="nums">${x.hp}<span class="muted">/${x.max}</span>${x.tmp?` <span style="color:var(--info)">+${x.tmp}</span>`:''}</div><div class="hpbar"><i style="width:${pct}%;background:${col}"></i></div>
   <div class="row"><input class="inp mono" name="amt" type="number" min="0" placeholder="0" aria-label="Cantidad"><button class="btn sm icon danger" data-a="dmg" title="Daño" aria-label="Aplicar daño">−</button><button class="btn sm icon" data-a="heal" title="Curar" aria-label="Curar">+</button><button class="btn sm icon" data-a="tmp" title="PG temporales" aria-label="PG temporales">T</button></div></div>
  <div class="conds">${x.conc?'<span class="cchip conc" data-a="conc" title="Quitar concentración">Concentración</span>':''}${(x.conds||[]).map((k,i)=>`<span class="cchip" data-a="rmcond" data-i="${i}" title="Quitar">${esc(k.n)}${k.r?` · ${k.r}`:''} ×</span>`).join('')}
   ${x.kind==='pj'&&x.hp<=0?`<span class="cchip" data-a="ds" data-k="s" style="background:color-mix(in srgb,var(--ok) 20%,transparent);color:#bfe9c9">Éxitos ${'●'.repeat(x.ds?.s||0)}${'○'.repeat(3-(x.ds?.s||0))}</span><span class="cchip" data-a="ds" data-k="f" style="background:color-mix(in srgb,var(--bad) 20%,transparent);color:#f5b9b1">Fallos ${'●'.repeat(x.ds?.f||0)}${'○'.repeat(3-(x.ds?.f||0))}</span>`:''}</div>
  <div class="row" style="gap:4px;flex-wrap:nowrap"><button class="btn sm" data-a="cond">${I.plus} Estado</button><button class="btn sm icon" data-a="conc" title="Concentración" aria-label="Concentración">${I.flame}</button><button class="btn sm icon danger" data-a="del" title="Quitar" aria-label="Quitar del combate">${I.x}</button></div>
 </div>`;
}
function hpChange(id,a){
 const c=CS(), x=c.list.find(k=>k.id===id); const row=$(`[data-cid="${id}"]`); const n=Number($('[name=amt]',row).value)||0; if(!n) return;
 if(a==='dmg'){ let d=n; if(x.tmp){ const t=Math.min(x.tmp,d); x.tmp-=t; d-=t; } x.hp=Math.max(0,x.hp-d); clog(`${x.name} recibe ${n} de daño (${x.hp}/${x.max})`);
  if(x.conc) toast(`${x.name}: salvación de Constitución CD ${Math.min(30,Math.max(10,Math.floor(n/2)))} para mantener la concentración.`,'');
  if(x.hp===0){ clog(`${x.name} cae a 0 PG`); if(x.kind!=='pj') toast(`${x.name} ha caído.`); } }
 else if(a==='heal'){ x.hp=Math.min(x.max,x.hp+n); if(x.ds) x.ds={s:0,f:0}; clog(`${x.name} recupera ${n} PG (${x.hp}/${x.max})`); }
 else { x.tmp=Math.max(x.tmp||0,n); clog(`${x.name} gana ${n} PG temporales`); }
 if(x.kind==='pj'){ const p=Store.get('characters',x.ref); if(p){ p.hp=x.hp; Store.put('characters',p,1000); } }
 saveCombat(); render(true); const r2=$(`[data-cid="${id}"]`); if(r2) r2.classList.add(a==='dmg'?'flash-dmg':'flash-heal');
}
function nextTurn(){
 const c=CS(); if(!c.list.length){ toast('Añade combatientes primero.'); return; }
 if(!c.active){ if(c.list.some(x=>x.init==null)){ for(const x of c.list) if(x.init==null) x.init=(roll('1d20')?.total||10)+(x.dex||0); } sortInit(c); c.active=true; c.turn=0; c.round=1; clog('¡Comienza el combate!'); }
 else { const x=c.list[c.turn]; if(x){ x.conds=(x.conds||[]).filter(k=>{ if(k.r){ k.r--; if(k.r<=0){ clog(`${x.name} ya no está ${k.n.toLowerCase()}`); return false; } } return true; }); }
  c.turn++; if(c.turn>=c.list.length){ c.turn=0; c.round++; clog(`Ronda ${c.round}`); } }
 saveCombat(); render(true);
 const cur=$('.cmb.cur'); if(cur) cur.scrollIntoView({block:'nearest',behavior:reduced?'auto':'smooth'});
}
document.addEventListener('keydown',e=>{ if(route!=='combate'||$('.modal-bg')) return; if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return; if(e.key==='n'||e.key==='N') nextTurn(); });
function condDialog(x){
 const md=modal({title:'Estado de '+x.name,body:`<div class="row" style="gap:6px">${CONDITIONS.map(k=>`<span class="chip" data-c="${esc(k[0])}" title="${esc(k[1])}">${k[0]}</span>`).join('')}</div>
  <div class="grid2">${fld('Otro estado o efecto','other','')}${fld('Duración en rondas (vacío = indefinida)','rounds','','number','min="1"')}</div>`,foot:`<button class="btn pri" data-ok>Aplicar</button>`});
 let chosen=null; $$('[data-c]',md.el).forEach(ch=>ch.onclick=()=>{ chosen=ch.dataset.c; $$('[data-c]',md.el).forEach(k=>k.classList.toggle('on',k===ch)); });
 $('[data-ok]',md.el).onclick=()=>{ const f=vals(md.el); const n=f.other.trim()||chosen; if(!n){ toast('Elige un estado.'); return; }
  x.conds=x.conds||[]; x.conds.push({n,r:f.rounds?Number(f.rounds):0}); clog(`${x.name} queda ${n.toLowerCase()}`); md.close(); saveCombat(); render(true); };
}
function addDialog(){
 const md=modal({title:'Añadir al combate',wide:true,body:`
  <div class="row" style="gap:6px"><span class="chip on" data-t="mon">Criatura</span><span class="chip" data-t="pnj">PNJ</span><span class="chip" data-t="man">Manual</span></div>
  <div id="adbody"></div>`});
 const body=$('#adbody',md.el);
 const show=t=>{ $$('[data-t]',md.el).forEach(c=>c.classList.toggle('on',c.dataset.t===t));
  if(t==='mon'){ body.innerHTML=`<div class="row" style="flex-wrap:nowrap"><div class="search" style="max-width:none">${I.search}<input class="inp" id="adq" placeholder="Buscar criatura…" aria-label="Buscar criatura"></div><input class="inp" id="adn" type="number" value="1" min="1" max="20" style="width:80px" aria-label="Cantidad"></div><div class="list" id="adl" style="max-height:340px;margin-top:8px"></div>`;
   const draw=()=>{ const q=norm($('#adq').value); $('#adl').innerHTML=allMonsters().filter(m=>!q||norm(m.name+' '+(m.en||'')).includes(q)).sort((a,b)=>a.name.localeCompare(b.name)).map(m=>`<div class="li" data-m="${esc(m.id)}"><span class="cr">${esc(m.cr)}</span><span class="nm">${esc(m.name)}</span><span class="muted mono" style="font-size:.8rem">CA ${m.ac} · ${m.hp} PG</span><span class="btn sm">${I.plus}</span></div>`).join(''); };
   $('#adq').oninput=draw; draw();
   $('#adl').onclick=e=>{ const li=e.target.closest('[data-m]'); if(!li) return; const m=allMonsters().find(k=>k.id===li.dataset.m); const q=clamp(Number($('#adn').value)||1,1,20); addMonstersToCombat(m,q); toast(`${q} × ${m.name} añadido.`); render(true); }; }
  else if(t==='pnj'){ const n=Store.list('npcs'); body.innerHTML=n.length?`<div class="list" id="adp" style="max-height:380px">${n.map(p=>`<div class="li" data-p="${p.id}"><span class="nm">${esc(p.name)}</span><span class="att ${p.att||'neutral'}">${esc(p.att||'neutral')}</span><span class="btn sm">${I.plus}</span></div>`).join('')}</div>`:'<div class="empty">No hay PNJ todavía.</div>';
   const l=$('#adp'); if(l) l.onclick=e=>{ const li=e.target.closest('[data-p]'); if(!li) return; addNPCToCombat(Store.get('npcs',li.dataset.p)); toast('PNJ añadido.'); render(true); }; }
  else { body.innerHTML=`<div class="grid3">${fld('Nombre','name','')}${fld('Iniciativa','init','','number')}${fld('CA','ac',12,'number')}${fld('PG','hp',10,'number')}${sel('Tipo','kind','mon',[['mon','Criatura'],['pnj','PNJ'],['pj','Personaje']])}${fld('VD (opcional)','cr','')}</div><div class="row" style="justify-content:flex-end"><button class="btn pri" id="adgo">${I.plus} Añadir</button></div>`;
   $('#adgo').onclick=()=>{ const f=vals(body); if(!f.name.trim()) return toast('Ponle un nombre.'); const c=CS(); c.list.push({id:uid(),name:f.name,kind:f.kind,init:f.init===''?null:f.init,dex:0,ac:f.ac||10,hp:f.hp||1,max:f.hp||1,tmp:0,conds:[],conc:false,cr:CR_XP[f.cr]?f.cr:null,ds:{s:0,f:0}}); if(c.active){ const id=c.list[c.turn]?.id; sortInit(c); c.turn=c.list.findIndex(k=>k.id===id);} clog(`Entra ${f.name}`); saveCombat(); render(true); md.close(); }; } };
 $$('[data-t]',md.el).forEach(c=>c.onclick=()=>show(c.dataset.t)); show('mon');
}
