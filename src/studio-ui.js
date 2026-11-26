/* ===== Estudio de mapas · interfaz, herramientas, selección, notas, capas y galería ===== */
const ICOAST=ic('<path d="M3 15c2 0 2-2 4.5-2S10 15 12 15s2.5-2 4.5-2S19 15 21 15"/><path d="M3 19c2 0 2-2 4.5-2S10 19 12 19s2.5-2 4.5-2S19 19 21 19" opacity=".6"/><path d="M5 11c1-4 4-7 7-7 2.5 0 4 1.5 5 3"/>');
const ITREE=ic('<path d="M12 3 6.5 11H9l-3.5 5h13L15 11h2.5z"/><path d="M12 16v5"/>');
const IPATH=ic('<path d="M4 20c3-6 5-2 8-8s5-5 8-8"/><circle cx="4" cy="20" r="1.4"/><circle cx="20" cy="4" r="1.4"/>');
const ISHAPE=ic('<path d="M5 18 9 5l10 4-3 10z"/><circle cx="5" cy="18" r="1.6"/><circle cx="9" cy="5" r="1.6"/><circle cx="19" cy="9" r="1.6"/><circle cx="16" cy="19" r="1.6"/>');
const ICURSOR=ic('<path d="M5 3l14 7-6 2-2 6z"/>');
const INOTE=ic('<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h5"/>');
const IEYE2=ic('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>');
const ILOCK=ic('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>');
const IMAG=ic('<path d="M6 3v8a6 6 0 0 0 12 0V3"/><path d="M6 7h4M14 7h4"/>');
const IFILTER=ic('<circle cx="12" cy="12" r="8.5"/><circle cx="8.5" cy="10" r="1.2"/><circle cx="12" cy="7.5" r="1.2"/><circle cx="15.5" cy="10" r="1.2"/><path d="M12 20.5c-1.5 0-2-1.2-2-2.2 0-1.5 2-1.5 2-3"/>');
const IMASK=ic('<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>');
const STOOLS=[['seleccion','Seleccionar y transformar',ICURSOR,'S','Elegir'],['costa','Tierra y agua',ICOAST,'L','Tierra'],['terreno','Pincel de texturas',I.brush,'B','Pincel'],['objetos','Objetos',ITREE,'O','Objetos'],['caminos','Ríos, caminos y muros',IPATH,'P','Trazos'],['formas','Líneas y formas por nodos',ISHAPE,'N','Formas'],['texto','Texto',I.label,'T','Texto'],['notas','Notas del DM',INOTE,'M','Notas'],['medir','Medir distancias',I.ruler,'R','Medir'],['mano','Mover la vista',I.hand,'H','Vista']];
const SYS_LAYERS=[['fondo','Fondo'],['costa','Costa'],['luces','Luces y oscuridad'],['cuadricula','Cuadrícula'],['efectos','Estilo global'],['marcadores','Notas']];
const LVL_ORDER=['global','nacional','ciudad','minimo','mazmorra'];
const LTYPE={brush:['Pintura',I.brush],object:['Objetos',ITREE],filter:['Filtro',IFILTER],mask:['Máscara',IMASK]};
const lvTex=m=>Object.keys(TEX).filter(k=>SB.allTex||TEX[k].lv.includes(LVK(m).L));
const curTex=()=>{ const m=SD.map, L=m.level; let t=SB.tex[L]; if(!TEX[t]) t=SB.tex[L]=LVK(m).tex; return t; };
const lvStamps=m=>Object.values(STAMPS).filter(d=>d.side===isSide(m));
const lvScatter=m=>Object.entries(SCATTER).filter(([k,d])=>!!d.side===isSide(m));
const curStamp=()=>{ const m=SD.map; let id=SB.stamp[m.level]; const ok=id&&(STAMPS[id]&&STAMPS[id].side===isSide(m)||SCATTER[id]&&!!SCATTER[id].side===isSide(m)); if(!ok) id=SB.stamp[m.level]=isSide(m)?'montana':'arbol_t'; return SCATTER[id]?SCATTER[id].ids[0]:id; };
const defSize=id=>defSizeOf(SD.map,id);
const lvPaths=m=>Object.keys(PATHS).filter(k=>PATHS[k].lv.includes(LVK(m).L));
const curPath=()=>{ const m=SD.map; let t=SB.path[m.level]; if(!PATHS[t]||!PATHS[t].lv.includes(LVK(m).L)) t=SB.path[m.level]=lvPaths(m)[0]; return t; };
const curPW=()=>{ const t=curPath(); return pathWidth(SD.map,t)*(SB.pw[t]||1); };
const SPRT={}; const stampThumb=id=>SPRT[id]||(SPRT[id]=stampSprite(id,0,128).toDataURL());
const coastWords=m=>({mar:['Tierra','Agua'],roca:['Suelo','Roca'],pergamino:['Tierra','Papel'],lava:['Tierra','Lava'],vacio:['Tierra','Vacío']}[m.bg]||['Tierra','Agua']);
const entName=s=>({stamp:()=>(STAMPS[s.o.k]||{n:'Objeto'}).n,label:()=>'Texto: '+(s.o.text||'').split('\n')[0].slice(0,24),path:()=>(PATHS[s.o.t]||{n:'Trazo'}).n,shape:()=>s.o.closed?'Forma':'Línea',pin:()=>'Nota: '+(s.o.name||'sin título')}[s.type]||(()=>''))();
function stChildFor(level,kind){ if((level==='nacional'||level==='global')&&['ciudad','pueblo','capital','puerto'].includes(kind)) return level==='global'&&kind!=='pueblo'?'nacional':'ciudad';
 if(level==='ciudad') return ['mazmorra','cueva'].includes(kind)?'mazmorra':'minimo'; if(level==='nacional'&&['mazmorra','cueva','ruina'].includes(kind)) return 'mazmorra'; return {global:'nacional',nacional:'minimo'}[level]||null; }

/* ---------- Galería ---------- */
function studioGallery(v){ v.className='view'; const lvF=SB.gal||'todos'; const all=Store.list('maps').filter(m=>(m.plane||'material')===curPlane);
 const list=all.filter(m=>lvF==='todos'||m.level===lvF).sort((a,b)=>(b.updated||0)-(a.updated||0));
 v.innerHTML=`<div class="wrap stg"><div class="stg-head"><div><span class="eyebrow">${esc(planeById(curPlane).name)}</span><h1 class="h1">Estudio de mapas</h1><p class="muted">Pinta continentes, reinos, ciudades, campos de batalla y mazmorras con capas, pinceles de textura, costas automáticas, objetos ilustrados, formas por nodos, filtros y notas para el DM.</p></div>
  <div class="row" style="gap:8px"><label class="btn" title="Abrir un proyecto .mapa.json">${I.upload} Importar<input type="file" id="stImp" accept=".json,application/json" hidden></label><button class="btn pri" id="stNew">${I.plus} Nuevo mapa</button></div></div>
  <div class="row" style="gap:6px;margin:6px 0 18px">${[['todos','Todos'],...LVL_ORDER.map(k=>[k,SLV[k].n])].map(([k,n])=>`<span class="chip ${lvF===k?'on':''}" data-gl="${k}">${n} <small class="muted">${k==='todos'?all.length:all.filter(m=>m.level===k).length}</small></span>`).join('')}</div>
  <div class="stg-grid">${`<button class="stg-card stg-new" id="stNew2"><span>${I.plus}</span><b>Nuevo mapa</b><small>Global, nacional, ciudad, mínimo o mazmorra</small></button>`+list.map(m=>`<div class="stg-card" data-open="${m.id}" tabindex="0">
   <div class="stg-img">${m.thumb?`<img alt="" src="${m.thumb}">`:m.v?'':`<img alt="" src="${thumb(m)}" style="image-rendering:pixelated">`}</div>
   <div class="stg-meta"><b>${esc(m.name)}</b><small>${esc((SLV[m.level]||{n:m.level}).n)}${m.parent&&Store.get('maps',m.parent)?' · en '+esc(Store.get('maps',m.parent).name):''}${m.v?'':' · <span class="tag">Clásico</span>'}</small></div></div>`).join('')}</div></div>`;
 $$('[data-gl]',v).forEach(c=>c.onclick=()=>{ SB.gal=c.dataset.gl; sbSave(); studioGallery(v); });
 $('#stNew',v).onclick=$('#stNew2',v).onclick=()=>newStudioMap();
 $('#stImp',v).onchange=async e=>{ const f=e.target.files[0]; if(!f) return; const m=await importProject(f); if(m) openStudio(m.id); };
 $$('[data-open]',v).forEach(c=>{ const go=()=>openStudio(c.dataset.open); c.onclick=go; c.onkeydown=e=>{ if(e.key==='Enter') go(); }; });
}
function openStudio(id){ const m=Store.get('maps',id); if(!m) return; if(!m.v){ MS.classic=true; MS.open=id; MS.level=m.level; render(true); return; } SD.openId=id; lsSet('oz:stOpen',id); render(true); }
function closeStudio(){ flushStudio(); SD.openId=null; lsSet('oz:stOpen',null); render(true); }
function flushStudio(){ if(!SD.map) return; clearTimeout(SD.saveT); clearTimeout(SD.terrT); const m=SD.map; for(const L of m.L) if(L.type==='brush'||L.type==='mask') SD.dirtyR.add(L.id); flushRasters(m); Store.put('maps',m); }

function newStudioMap(parent,fromPin){ const lv0=parent?(stChildFor(parent.level,fromPin&&fromPin.kind)||'minimo'):(SB.gal&&SLV[SB.gal]?SB.gal:'global');
 const md=modal({title:'Nuevo mapa',body:`<div class="st-lvcards">${LVL_ORDER.map(k=>{ const l=SLV[k]; return `<label class="st-lvc"><input type="radio" name="level" value="${k}" ${k===lv0?'checked':''}><span><b>${l.n}</b><small>${l.desc}</small></span></label>`; }).join('')}</div>
  <div class="grid2">${fld('Nombre','name',fromPin?.name||'')}${sel('Tamaño','size','m',[['s','Pequeño'],['m','Mediano'],['l','Grande']])}</div>
  <div class="grid2">${sel('Empezar con','start','gen',[['gen','Un terreno generado (recomendado)'],['blank','Lienzo en blanco']])}${sel('Fondo','bg','auto',[['auto','Según el nivel'],...Object.entries(BGS).map(([k,b])=>[k,b.n])])}</div>
  <p class="muted" style="margin:0;font-size:.86rem">Se crea en ${esc(planeById(curPlane).name)}. Todo se puede repintar después.</p>`,
  foot:`<button class="btn" data-c>Cancelar</button><button class="btn pri" data-s>${I.plus} Crear mapa</button>`});
 $('[data-c]',md.el).onclick=md.close;
 $('[data-s]',md.el).onclick=async()=>{ const f=vals(md.el), level=$('input[name=level]:checked',md.el).value, L=SLV[level], k={s:.7,m:1,l:1.35}[f.size]||1;
  const m=ensureV3({id:'map-'+uid(),v:2,name:f.name||({global:'Mundo conocido',nacional:'Nueva región',ciudad:'Nueva ciudad',minimo:'Nuevo encuentro',mazmorra:'Nueva mazmorra'}[level]),level,plane:curPlane,w:Math.round(L.W*k),h:Math.round(L.H*k),bg:f.bg==='auto'?L.bg:f.bg,
   grid:{on:true,type:L.grid.type,size:L.grid.size,op:L.grid.op},scale:L.scale,unit:L.unit,fx:{look:'natural',vig:.35,paper:level==='global'?.25:0,frame:level==='global'?'ornado':'none',dark:level==='mazmorra'?.5:0},layers:{},parent:parent?.id||null,created:Date.now()});
  if(!L.side){ m.w=Math.round(m.w/L.grid.size)*L.grid.size; m.h=Math.round(m.h/L.grid.size)*L.grid.size; }
  md.close(); SD.map=m; newTerrain(m); if(f.start==='gen') await stGenerate(m,true); else if(!L.side) fillAll(LVK(m).tex);
  SD.undo=[]; SD.upx=0; computeCoast(); makeThumb(); Store.put('maps',m); await new Promise(r=>SD.terr.toBlob(b=>{ IDB.set(m.id,b,'maps').then(r); },'image/webp',.92));
  if(fromPin&&parent){ fromPin.link=m.id; Store.put('maps',parent); }
  SD.map=null; SD.openId=m.id; lsSet('oz:stOpen',m.id); counts(); render(true); toast(`Mapa "${m.name}" creado.`); };
}

/* ---------- Editor ---------- */
function studioEditor(v,id){ const m=ensureV3(Store.get('maps',id)); v.className='view full'; if(SD.panelOpen===undefined&&innerWidth<900) SD.panelOpen=false;
 if(SD.map!==m){ SD.map=m; SD.undo=[]; SD.redo=[]; SD.upx=0; SD.sel=[]; SD.fitted=false; SD.activeL=null; SD.sdraft=null; SD.poly=null; loadTerrain(m); }
 v.innerHTML=`<div class="studio" id="studio">
  <header class="st-top"><button class="btn ghost sm" id="stBack" title="Volver a tus mapas">${I.back}<span class="hide-s">Mapas</span></button><div class="st-crumbs" id="stCrumbs"></div>
   <input class="st-name" id="stName" value="${esc(m.name)}" aria-label="Nombre del mapa"><span class="st-lv">${LVK(m).n}</span>
   <div class="st-ctx" id="stCtx"></div><div style="flex:1"></div>
   <button class="btn icon ghost" id="stU" title="Deshacer (Ctrl+Z)" aria-label="Deshacer">${I.undo}</button><button class="btn icon ghost" id="stR" title="Rehacer (Ctrl+Y)" aria-label="Rehacer"><span style="display:inline-flex;transform:scaleX(-1)">${I.undo}</span></button>
   <button class="btn icon ghost st-pv ${SD.player?'on':''}" id="stPV" title="Vista de jugadores: oculta las notas y luces solo para el DM" aria-label="Vista de jugadores">${IEYE2}</button>
   <button class="btn icon ghost st-ptog" id="stPT" title="Panel" aria-label="Mostrar panel">${I.layers}</button>
   <button class="btn pri sm" id="stExp">${I.down}<span class="hide-s">Exportar</span></button></header>
  <nav class="st-rail" id="stRail">${STOOLS.map(([k,n,ico,key,sh])=>`<button class="st-tool ${SB.tool===k?'on':''}" data-tool="${k}" title="${n} (${key})" aria-label="${n}">${ico}<span>${sh}</span></button>`).join('')}</nav>
  <div class="st-stage" id="stStage"><canvas id="stCv" aria-label="Lienzo del mapa"></canvas><div class="st-hint" id="stHint"></div></div>
  <footer class="st-bottom"><span class="st-save" id="stSave">Guardado</span><span class="st-coords" id="stStatus"></span><div style="flex:1"></div>
   <label class="st-mini" title="Resolución de edición del lienzo">${I.layers}<select id="stRes" aria-label="Resolución">${[1024,2048,3072,4096].map(r=>`<option value="${r}">${r/1024}K</option>`).join('')}<option value="cur" hidden></option></select></label>
   <button class="st-mini ${m.grid.snap?'on':''}" id="stSnap" title="Imán a la cuadrícula">${IMAG}<span class="hide-s">Imán</span></button>
   <div class="st-zoom"><button class="btn icon ghost" id="stZo" aria-label="Alejar">−</button><button class="st-zv" id="stZv" title="Ajustar a la pantalla">100%</button><button class="btn icon ghost" id="stZi" aria-label="Acercar">${I.plus}</button></div></footer>
  <aside class="st-panel ${SD.panelOpen===false?'closed':''}" id="stPanel"><div class="st-tabs">${[['tool','Herramienta'],['layers','Capas'],['objects','Objetos'],['style','Estilo']].map(([k,n])=>`<button data-tab="${k}" class="${SD.tab===k?'on':''}">${n}</button>`).join('')}</div><div class="st-pbody" id="stPB"></div></aside></div>`;
 const cv=$('#stCv'); SD.cv=cv; SD.ctx=cv.getContext('2d');
 const resize=()=>{ SD.dpr=Math.min(devicePixelRatio||1,2); cv.width=Math.max(1,cv.clientWidth*SD.dpr); cv.height=Math.max(1,cv.clientHeight*SD.dpr); if(!SD.fitted){ stFit(); SD.fitted=true; } draw(); };
 const ro=new ResizeObserver(resize); ro.observe($('#stStage'));
 stCrumbs(); stPanel(); stUpdUndo(); stHint(); ctxBar(); resLabel(); status();
 $('#stBack').onclick=closeStudio; $('#stU').onclick=stUndo; $('#stR').onclick=stRedo; $('#stExp').onclick=()=>exportDialog();
 $('#stZi').onclick=()=>zoomBy(1.25); $('#stZo').onclick=()=>zoomBy(.8); $('#stZv').onclick=stFit;
 $('#stPV').onclick=e=>{ SD.player=!SD.player; e.currentTarget.classList.toggle('on',SD.player); toast(SD.player?'Vista de jugadores: las notas y luces del DM quedan ocultas.':'Vista del DM.'); closeStPop(); SD.sel=SD.sel.filter(s=>!(s.type==='pin'&&s.o.dm)); draw(); };
 $('#stSnap').onclick=e=>{ m.grid.snap=!m.grid.snap; e.currentTarget.classList.toggle('on',m.grid.snap); saveDoc(); if(SD.tab==='style') stPanel(); };
 $('#stRes').onchange=e=>{ const target=+e.target.value; resLabel(); if(!target) return; const f=target/Math.max(m.w,m.h); if(Math.abs(f-1)<.02) return;
  confirmBox(`¿Cambiar la resolución del lienzo a ${target/1024}K (${Math.round(m.w*f)} × ${Math.round(m.h*f)} px)? Se reescala todo el mapa y se vacía el historial.`,()=>scaleMap(f),'Cambiar'); };
 $('#stPT').onclick=()=>{ SD.panelOpen=$('#stPanel').classList.toggle('closed')?false:true; setTimeout(resize,260); };
 $('#stName').oninput=e=>{ m.name=e.target.value||'Sin nombre'; saveDoc(); };
 $('#stRail').onclick=e=>{ const b=e.target.closest('[data-tool]'); if(b) setStTool(b.dataset.tool); };
 $$('[data-tab]').forEach(b=>b.onclick=()=>{ SD.tab=b.dataset.tab; $$('[data-tab]').forEach(x=>x.classList.toggle('on',x===b)); stPanel(); if(SD.panelOpen===false){ SD.panelOpen=true; $('#stPanel').classList.remove('closed'); } });
 bindCanvas(cv);
 const key=e=>stKey(e); document.addEventListener('keydown',key); document.addEventListener('keyup',key);
 const unsub=Store.on((c,o)=>{ if(c==='maps'&&o==='remote'){ const cur=Store.get('maps',id); if(!cur){ SD.map=null; SD.openId=null; render(true); } } });
 for(const [f] of FONTS) document.fonts&&document.fonts.load(`20px "${f}"`).then(()=>draw()).catch(()=>{});
 cleanup=()=>{ ro.disconnect(); unsub(); document.removeEventListener('keydown',key); document.removeEventListener('keyup',key); flushStudio(); SD.cv=null; SD.ctx=null; closeStPop(); if(SD.raf){ cancelAnimationFrame(SD.raf); SD.raf=0; } SD.map=null; };
}
function resLabel(){ const s=$('#stRes'); if(!s||!SD.map) return; const L=Math.max(SD.map.w,SD.map.h), o=[...s.options].find(x=>Math.abs(+x.value-L)<60); if(o) s.value=o.value; else { const c=s.querySelector('[value=cur]'); c.textContent=(L/1024).toFixed(1)+'K'; c.hidden=false; s.value='cur'; } }
function stCrumbs(){ const el=$('#stCrumbs'); if(!el) return; const chain=[]; let m=SD.map&&SD.map.parent&&Store.get('maps',SD.map.parent), g=0; while(m&&g++<5){ chain.unshift(m); m=m.parent&&Store.get('maps',m.parent); }
 el.innerHTML=chain.map(c=>`<button data-cr="${c.id}">${esc(c.name)}</button><span class="muted">›</span>`).join(''); el.onclick=e=>{ const b=e.target.closest('[data-cr]'); if(b){ flushStudio(); openStudio(b.dataset.cr); } }; }
function stUpdUndo(){ const u=$('#stU'), r=$('#stR'); if(u){ u.disabled=!SD.undo.length; u.title='Deshacer'+(SD.undo.length?': '+SD.undo[SD.undo.length-1].label:'')+' (Ctrl+Z)'; } if(r){ r.disabled=!SD.redo.length; r.title='Rehacer'+(SD.redo.length?': '+SD.redo[SD.redo.length-1].label:'')+' (Ctrl+Y)'; } if(SD.tab==='layers') renderHistory(); }
function setStTool(t){ if(SD.sdraft&&t!=='formas') finishShape(); SD.poly=null; SB.tool=t; sbSave(); SD.ruler=null; closeStPop(); if(t!=='seleccion'&&t!=='formas'&&t!=='texto') SD.sel=[]; $$('.st-tool').forEach(b=>b.classList.toggle('on',b.dataset.tool===t)); SD.tab='tool'; $$('[data-tab]').forEach(x=>x.classList.toggle('on',x.dataset.tab==='tool')); stPanel(); stHint(); ctxBar(); draw(); }
const HINTS={seleccion:'Clic para elegir, Mayús o Ctrl para sumar, arrastra en vacío para seleccionar un área. Asas: esquinas escalan, lados estiran, círculo superior gira (Mayús: de 15 en 15°).',costa:'Pinta tierra o agua; la costa, las olas y los muros se dibujan solos. En modo polígono, haz clic punto a punto y cierra en el primero.',terreno:'Pinta texturas en la capa de pintura activa. Alt o clic derecho borra. [ y ] cambian el tamaño.',objetos:'Clic para colocar. En modo Muchos arrastra para sembrar; elige variación, giro y densidad en el panel.',caminos:'Arrastra para trazar ríos, caminos, muros y fronteras. La línea se suaviza sola.',formas:'Clic para poner nodos rectos, clic y arrastrar para nodos curvos. Cierra en el primer nodo o pulsa Intro para terminar.',texto:'Clic en el mapa para escribir. El texto admite varias líneas, curva, contorno y sombra.',notas:'Clic para poner una nota. Clic sobre una nota para leerla; las notas DM no se ven en la vista de jugadores.',medir:'Arrastra para medir distancias.',mano:'Arrastra para mover la vista. Rueda o pellizco para el zoom.'};
function stHint(){ const h=$('#stHint'); if(!h) return; h.textContent=HINTS[SB.tool]||''; h.classList.remove('show'); void h.offsetWidth; h.classList.add('show'); }
function stFit(){ const m=SD.map, cv=SD.cv; if(!m||!cv) return; const W=cv.clientWidth, H=cv.clientHeight, z=Math.min((W-40)/m.w,(H-40)/m.h); SD.view={z,x:(W-m.w*z)/2,y:(H-m.h*z)/2}; zoomLabel(); draw(); }
function stZoomAt(sx,sy,f){ const v=SD.view, nz=clamp(v.z*f,.05,8); SD.view={z:nz,x:sx-(sx-v.x)*nz/v.z,y:sy-(sy-v.y)*nz/v.z}; zoomLabel(); draw(); }
function zoomBy(f){ const cv=SD.cv; stZoomAt(cv.clientWidth/2,cv.clientHeight/2,f); }
function zoomLabel(){ const z=$('#stZv'); if(z) z.textContent=Math.round(SD.view.z*100)+'%'; }
function flyTo(x,y,z){ const cv=SD.cv; if(!cv) return; const v0={...SD.view}, z1=z||Math.max(v0.z,1), v1={z:z1,x:cv.clientWidth/2-x*z1,y:cv.clientHeight/2-y*z1}, t0=performance.now();
 const step=t=>{ const k=Math.min(1,(t-t0)/420), e=1-Math.pow(1-k,3); SD.view={z:v0.z+(v1.z-v0.z)*e,x:v0.x+(v1.x-v0.x)*e,y:v0.y+(v1.y-v0.y)*e}; zoomLabel(); drawNow(); if(k<1) requestAnimationFrame(step); }; requestAnimationFrame(step); }
function status(p){ const s=$('#stStatus'); if(!s||!SD.map) return; const m=SD.map; s.textContent=(p?`${Math.round(p.x/m.grid.size)}, ${Math.round(p.y/m.grid.size)} · `:'')+`1 casilla = ${m.scale} ${m.unit}`+(SD.sel.length?` · ${SD.sel.length} seleccionado${SD.sel.length>1?'s':''}`:''); }

/* ---------- Barra contextual ---------- */
function ctxBar(){ const el=$('#stCtx'); if(!el||!SD.map) return; const t=SB.tool; let h='';
 const mini=(id,label,val,min,max,step)=>`<label class="st-cx"><span>${label}</span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;
 if(t==='terreno'||t==='costa') h=mini('cxSize','Tamaño',SB.size,4,800,2)+mini('cxOp','Opacidad',SB.op,.05,1,.05);
 else if(t==='objetos') h=`<div class="st-seg sm" id="cxMode">${[['place','Uno'],['scatter','Muchos'],['erase','Borrar']].map(([k,n])=>`<button data-v="${k}" class="${SB.smode===k?'on':''}">${n}</button>`).join('')}</div>`+mini('cxSm','Tamaño',SB.smul,.2,4,.05);
 else if(t==='formas') h=mini('cxSw','Grosor',SB.shape.sw,0,60,.5);
 else if(t==='texto') h=`<select class="sel sm" id="cxFont" aria-label="Fuente">${FONTS.map(([f,n])=>`<option value="${f}" ${SB.text.font===f?'selected':''}>${n}</option>`).join('')}</select>`;
 el.innerHTML=h;
 const b=(id,fn)=>{ const i=$('#'+id); if(i) i.oninput=()=>{ fn(+i.value); sbSave(); if(SD.tab==='tool') stPanel(); draw(); }; };
 b('cxSize',v=>SB.size=v); b('cxOp',v=>SB.op=v); b('cxSm',v=>SB.smul=v); b('cxSw',v=>SB.shape.sw=v);
 $('#cxFont')?.addEventListener('change',e=>{ SB.text.font=e.target.value; sbSave(); stPanel(); });
 $('#cxMode')?.addEventListener('click',e=>{ const x=e.target.closest('[data-v]'); if(!x) return; SB.smode=x.dataset.v; sbSave(); ctxBar(); stPanel(); draw(); }); }

/* ---------- Lienzo: punteros ---------- */
function wpt(e){ const r=SD.cv.getBoundingClientRect(), sx=e.clientX-r.left, sy=e.clientY-r.top; return {sx,sy,x:(sx-SD.view.x)/SD.view.z,y:(sy-SD.view.y)/SD.view.z}; }
const layerLocked=id=>{ const L=SD.map.L.find(l=>l.id===id); return L&&(L.lk||L.hid); };
function bindCanvas(cv){
 cv.addEventListener('contextmenu',e=>e.preventDefault());
 cv.addEventListener('dblclick',e=>{ if(!SD.map) return; const p=wpt(e);
  if(SB.tool==='formas'&&SD.sdraft){ const d=SD.sdraft; if(d.nodes.length>2){ const a=d.nodes[d.nodes.length-1], b=d.nodes[d.nodes.length-2]; if(Math.hypot(a.x-b.x,a.y-b.y)<2/SD.view.z) d.nodes.pop(); } finishShape(); return; }
  if(SB.tool==='costa'&&SB.landPoly&&SD.poly){ closePoly(); return; }
  const one=SD.sel.length===1&&SD.sel[0].type==='shape'?SD.sel[0].o:null; if(one&&(SB.tool==='seleccion'||SB.tool==='formas')){ insertNode(one,p); return; }
  const h=hitAt(p.x,p.y); if(h&&h.type==='label'){ SD.sel=[h]; setStTool('texto'); setTimeout(()=>{ const i=$('#lbTxt'); if(i){ i.focus(); i.select(); } },40); } });
 cv.addEventListener('pointerdown',e=>{ if(!SD.map||SD.loading) return; try{ cv.setPointerCapture(e.pointerId); }catch(_){} const p=wpt(e); SD.ptrs.set(e.pointerId,p); closeStPop();
  if(SD.ptrs.size===2){ const [a,b]=[...SD.ptrs.values()]; strokeCancel(); SD.draft=null; SD.marq=null;
   SD.pinch={d:Math.hypot(a.sx-b.sx,a.sy-b.sy),cx:(a.sx+b.sx)/2,cy:(a.sy+b.sy)/2,v:{...SD.view}}; SD.drag=null; draw(); return; }
  const t=SB.tool, pan=e.button===1||SD.space||t==='mano';
  if(pan){ SD.drag={mode:'pan',sx:p.sx,sy:p.sy,vx:SD.view.x,vy:SD.view.y}; cv.style.cursor='grabbing'; return; }
  const m=SD.map;
  if(t==='terreno'){ const L=activeBrush(); if(L.lk) return toast('La capa activa está bloqueada.','bad'); if(L.hid) return toast('La capa activa está oculta.','bad'); strokeBegin(SB.erase||e.button===2||e.altKey,curTex(),L.id,L.type==='mask'?'Pintar máscara':'Pintar textura'); strokeTo(p.x,p.y); SD.drag={mode:'paint'}; }
  else if(t==='costa'){ const land=SB.coastLand&&e.button!==2&&!e.altKey, Ld=m.L.find(l=>l.land);
   if(SB.landPoly){ const q=snapPt(p.x,p.y,'pt'); if(SD.poly&&SD.poly.length>2&&Math.hypot(q[0]-SD.poly[0][0],q[1]-SD.poly[0][1])<10/SD.view.z) closePoly(); else (SD.poly=SD.poly||[]).push(q); draw(); return; }
   strokeBegin(!land,curTex(),Ld.id,land?'Pintar tierra':'Pintar agua'); strokeTo(p.x,p.y); SD.drag={mode:'paint'}; }
  else if(t==='objetos'){ if(layerLocked(activeObj())) return toast('La capa de objetos está bloqueada u oculta.','bad'); if(SB.smode==='place') SD.drag={mode:'place',sx:p.sx,sy:p.sy}; else { SD.drag={mode:SB.smode==='erase'?'serase':'scatter',b:vecSnap(),last:null}; (SB.smode==='erase'?stampErase:scatterAt)(p); } }
  else if(t==='caminos'){ SD.draft={t:curPath(),w:curPW(),pts:[[p.x,p.y]]}; SD.drag={mode:'path'}; }
  else if(t==='formas'){ const nh=!SD.sdraft&&nodeHit(p); if(nh){ SD.drag=Object.assign({b:vecSnap()},nh); return; }
   if(!SD.sdraft){ SD.sel=[]; const S=SB.shape; SD.sdraft={id:uid(),nodes:[],closed:false,st:{on:S.son,w:S.sw,c:S.sc,tex:S.stex,dash:S.dash,cap:S.cap},fi:{on:S.fon,c:S.fc,tex:S.ftex,o:S.fo},ly:activeObj()}; }
   const d=SD.sdraft, q=snapPt(p.x,p.y,'pt'); if(d.nodes.length>2&&Math.hypot(q[0]-d.nodes[0].x,q[1]-d.nodes[0].y)<10/SD.view.z){ d.closed=true; finishShape(); return; }
   const n={x:q[0],y:q[1],i:null,o:null}; d.nodes.push(n); SD.drag={mode:'newnode',n,sx:p.sx,sy:p.sy}; draw(); }
  else if(t==='texto'){ const h=hitAt(p.x,p.y,false); if(h&&h.type==='label'){ SD.sel=[h]; SD.drag={mode:'move',b:vecSnap(),start:p,init:[clone(h.o)]}; } else { const b=vecSnap(), T=SB.text, q=snapPt(p.x,p.y); const l={id:uid(),x:q[0],y:q[1],text:'Nuevo nombre',font:T.font,size:Math.round(T.size*(isSide(m)?1:m.grid.size/64)),color:T.color,halo:T.halo,hc:T.hc,hw:T.hw,sp:T.sp,curve:T.curve,up:T.up,it:T.it,b:T.b,lh:T.lh,ts:T.ts,o:T.o,r:0,ly:activeObj()};
    m.labels.push(l); SD.sel=[{type:'label',o:l}]; vecCommit(b,'Añadir texto'); setTimeout(()=>{ const i=$('#lbTxt'); if(i){ i.focus(); i.select(); } },40); } stPanel(); }
  else if(t==='notas'){ const h=hitAt(p.x,p.y,true); if(h&&h.type==='pin'){ SD.sel=[h]; SD.drag={mode:'move',b:vecSnap(),start:p,init:[clone(h.o)],pop:true,sx:p.sx,sy:p.sy}; } else { const b=vecSnap(), N=SB.note, q=snapPt(p.x,p.y); const k={id:uid(),x:q[0],y:q[1],kind:N.icon,name:'',note:'',dm:N.dm,col:N.col,link:null}; m.pins.push(k); vecCommit(b,'Añadir nota'); SD.sel=[{type:'pin',o:k}]; notePop(k,p,true); } }
  else if(t==='seleccion'){ const nh=SD.sel.length===1&&SD.sel[0].type==='shape'?nodeHit(p):null; if(nh){ if(e.altKey&&nh.mode==='node'){ delNode(nh.s,nh.n); return; } SD.drag=Object.assign({b:vecSnap()},nh); return; }
   const hh=handleAt(p); if(hh){ SD.drag=Object.assign({b:vecSnap(),start:p,init:SD.sel.map(s=>clone(s.o)),box:groupBox()},hh); return; }
   const h=hitAt(p.x,p.y,true); const add=e.shiftKey||e.ctrlKey||e.metaKey;
   if(h){ const grp=expandGroup(h,e.altKey); if(add){ const has=SD.sel.some(s=>s.o===h.o); SD.sel=has?SD.sel.filter(s=>!grp.some(g=>g.o===s.o)):[...SD.sel,...grp.filter(g=>!SD.sel.some(s=>s.o===g.o))]; } else if(!SD.sel.some(s=>s.o===h.o)) SD.sel=grp;
    SD.drag={mode:'move',b:vecSnap(),start:p,init:SD.sel.map(s=>clone(s.o)),pop:h.type==='pin'&&!add,sx:p.sx,sy:p.sy}; }
   else { if(!add) SD.sel=[]; SD.marq={a:p,b:p,add}; SD.drag={mode:'marq'}; } stPanel(); status(); }
  else if(t==='medir'){ SD.ruler={a:p,b:p}; SD.drag={mode:'ruler'}; }
  draw(); });
 cv.addEventListener('pointermove',e=>{ if(!SD.map) return; const p=wpt(e); if(SD.ptrs.has(e.pointerId)) SD.ptrs.set(e.pointerId,p);
  if(SD.pinch&&SD.ptrs.size===2){ const [a,b]=[...SD.ptrs.values()], d=Math.hypot(a.sx-b.sx,a.sy-b.sy), cx=(a.sx+b.sx)/2, cy=(a.sy+b.sy)/2, pv=SD.pinch.v, nz=clamp(pv.z*d/SD.pinch.d,.05,8);
   SD.view={z:nz,x:cx-(SD.pinch.cx-pv.x)*nz/pv.z,y:cy-(SD.pinch.cy-pv.y)*nz/pv.z}; zoomLabel(); draw(); return; }
  SD.hover=p; status(p); const d=SD.drag;
  if(d){ if(d.mode==='pan'){ SD.view.x=d.vx+p.sx-d.sx; SD.view.y=d.vy+p.sy-d.sy; }
   else if(d.mode==='paint') strokeTo(p.x,p.y);
   else if(d.mode==='scatter') scatterAt(p);
   else if(d.mode==='serase') stampErase(p);
   else if(d.mode==='path'){ const L=SD.draft.pts[SD.draft.pts.length-1]; if(Math.hypot(p.x-L[0],p.y-L[1])>Math.max(4,10/SD.view.z)) SD.draft.pts.push([p.x,p.y]); }
   else if(d.mode==='newnode'){ if(Math.hypot(p.sx-d.sx,p.sy-d.sy)>4){ const o=[p.x-d.n.x,p.y-d.n.y]; d.n.o=o; d.n.i=[-o[0],-o[1]]; } }
   else if(d.mode==='node'){ const q=snapPt(p.x,p.y,'pt'); d.n.x=q[0]; d.n.y=q[1]; }
   else if(d.mode==='hnd'){ const v=[p.x-d.n.x,p.y-d.n.y]; d.n[d.k]=v; const other=d.k==='o'?'i':'o'; if(!e.altKey&&d.n[other]){ const L=Math.hypot(...d.n[other]), l=Math.hypot(...v)||1; d.n[other]=[-v[0]/l*L,-v[1]/l*L]; } }
   else if(d.mode==='ruler') SD.ruler.b=p;
   else if(d.mode==='marq') SD.marq.b=p;
   else if(d.mode==='move'&&SD.sel.length){ if(Math.hypot(p.sx-(d.sx??p.sx),p.sy-(d.sy??p.sy))>3) d.moved=true; let dx=p.x-d.start.x, dy=p.y-d.start.y; const i0=d.init[0];
    if(SD.map.grid.snap&&i0.x!=null){ const q=snapPt(i0.x+dx,i0.y+dy,SD.sel[0].type==='stamp'||SD.sel[0].type==='pin'?'cell':'pt'); dx=q[0]-i0.x; dy=q[1]-i0.y; }
    SD.sel.forEach((s,i)=>moveEnt(s,d.init[i],dx,dy)); }
   else if((d.mode==='scale'||d.mode==='sx'||d.mode==='sy'||d.mode==='rot')&&SD.sel.length) transformSel(d,p,e.shiftKey);
   draw(); }
  else if(['terreno','costa','objetos','formas'].includes(SB.tool)||SD.poly) draw(); });
 const up=e=>{ SD.ptrs.delete(e.pointerId); if(SD.ptrs.size<2) SD.pinch=null; const d=SD.drag; SD.drag=null; cv.style.cursor=''; if(!d||!SD.map) return; const p=wpt(e), m=SD.map;
  if(d.mode==='paint') strokeEnd();
  else if(d.mode==='scatter'||d.mode==='serase') vecCommit(d.b,d.mode==='scatter'?'Sembrar objetos':'Borrar objetos');
  else if(d.mode==='place'){ if(Math.hypot(p.sx-d.sx,p.sy-d.sy)<6){ const b=vecSnap(); const sid=SB.stamp[m.level]; const id=SCATTER[sid]?SCATTER[sid].ids[(Math.random()*SCATTER[sid].ids.length)|0]:curStamp(); const q=snapPt(p.x,p.y); addStamp(id,q[0],q[1],SD.ghostV); SD.ghostV=(Math.random()*8)|0; vecCommit(b,'Colocar '+STAMPS[id].n.toLowerCase()); } }
  else if(d.mode==='path'){ const dr=SD.draft; SD.draft=null; if(dr&&dr.pts.length>1){ const b=vecSnap(); const pts=simplify(dr.pts,Math.max(2,4/SD.view.z)); m.paths.push({id:uid(),t:dr.t,w:dr.w,pts,ly:activeObj()}); vecCommit(b,'Trazar '+PATHS[dr.t].n.toLowerCase()); } }
  else if(d.mode==='marq'){ const q=SD.marq; SD.marq=null; const x0=Math.min(q.a.x,q.b.x), x1=Math.max(q.a.x,q.b.x), y0=Math.min(q.a.y,q.b.y), y1=Math.max(q.a.y,q.b.y);
   if(x1-x0>2/SD.view.z||y1-y0>2/SD.view.z){ const found=allSelectable().filter(s=>{ const b=selBox(s); return b.cx>=x0&&b.cx<=x1&&b.cy>=y0&&b.cy<=y1; }); SD.sel=q.add?[...SD.sel,...found.filter(f=>!SD.sel.some(s=>s.o===f.o))]:found; } stPanel(); status(); }
  else if(['move','scale','sx','sy','rot','node','hnd'].includes(d.mode)){ vecCommit(d.b,{move:'Mover',scale:'Escalar',sx:'Estirar',sy:'Estirar',rot:'Girar',node:'Editar nodo',hnd:'Editar curva'}[d.mode]); if(d.pop&&!d.moved&&SD.sel[0]) notePop(SD.sel[0].o,p); stPanel(); }
  draw(); };
 cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
 cv.addEventListener('pointerleave',()=>{ SD.hover=null; draw(); });
 cv.addEventListener('wheel',e=>{ if(!SD.map) return; e.preventDefault(); const p=wpt(e); if(e.ctrlKey||!e.shiftKey&&Math.abs(e.deltaY)>=Math.abs(e.deltaX)&&!(e.deltaMode===0&&Math.abs(e.deltaY)<4&&e.deltaX)) stZoomAt(p.sx,p.sy,Math.exp(-e.deltaY*(e.ctrlKey?.01:.0018)));
  else { SD.view.x-=e.deltaX; SD.view.y-=e.deltaY; draw(); } },{passive:false});
}
function simplify(pts,tol){ if(pts.length<3) return pts; const out=[pts[0]]; for(let i=1;i<pts.length-1;i++){ const L=out[out.length-1]; if(Math.hypot(pts[i][0]-L[0],pts[i][1]-L[1])>=tol*3) out.push(pts[i]); } out.push(pts[pts.length-1]); return out.map(p=>[Math.round(p[0]*10)/10,Math.round(p[1]*10)/10]); }
function addStamp(id,x,y,v){ const m=SD.map, d=STAMPS[id]; const lo=Math.min(SB.smin,SB.smax), hi=Math.max(SB.smin,SB.smax), sc=SB.srand>0?lo+Math.random()*(hi-lo):1;
 const st={id:uid(),k:id,x:Math.round(x),y:Math.round(y),s:Math.round(defSize(id)*SB.smul*sc),v:v??((Math.random()*8)|0),r:SB.srot?(d.side?(Math.random()-.5)*.3:Math.random()*Math.PI*2):0,ly:activeObj()}; if(SB.sflip&&Math.random()<.5) st.f=1;
 const ap=SB.app[id]; if(ap&&Object.keys(ap).length) st.ap=clone(ap); m.stamps.push(st); return st; }
function scatterAt(p){ const d=SD.drag, m=SD.map; if(d.last&&Math.hypot(p.x-d.last.x,p.y-d.last.y)<SB.srad*.35) return; d.last={x:p.x,y:p.y};
 const sid=SB.stamp[m.level], ids=SCATTER[sid]?SCATTER[sid].ids:[curStamp()], n=1+Math.round(SB.dens*4), R=SB.srad/2, ly=activeObj();
 for(let i=0;i<n;i++){ const a=Math.random()*Math.PI*2, rr=Math.sqrt(Math.random())*R, x=p.x+Math.cos(a)*rr, y=p.y+Math.sin(a)*rr; if(x<0||y<0||x>m.w||y>m.h) continue; const id=ids[(Math.random()*ids.length)|0], sz=defSize(id)*SB.smul, md=sz*(isSide(m)?.42:.55)*(1.25-SB.dens*.6);
  if(m.stamps.some(s=>lyOf(m,s)===ly&&Math.abs(s.x-x)<md&&Math.abs(s.y-y)<md*(isSide(m)?.6:1))) continue; addStamp(id,x,y); } draw(); }
function stampErase(p){ const m=SD.map, R=SB.srad/2, n=m.stamps.length, ly=activeObj(); m.stamps=m.stamps.filter(s=>s.lk||lyOf(m,s)!==ly||Math.hypot(s.x-p.x,s.y-p.y)>R); if(m.stamps.length!==n) draw(); }
function distSeg(x,y,a,b){ const dx=b[0]-a[0], dy=b[1]-a[1], l=dx*dx+dy*dy||1, t=clamp(((x-a[0])*dx+(y-a[1])*dy)/l,0,1); return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy); }
function inBox(b,x,y,k=1){ const dx=x-b.cx, dy=y-b.cy, c=Math.cos(-b.r), s=Math.sin(-b.r), lx=dx*c-dy*s, ly=dx*s+dy*c; return Math.abs(lx)<=b.w/2*k&&Math.abs(ly)<=b.h/2*k; }
function allSelectable(){ const m=SD.map, ok=o=>!o.lk&&!o.hd&&!layerLocked(lyOf(m,o)), out=[];
 m.stamps.forEach(o=>{ if(STAMPS[o.k]&&ok(o)) out.push({type:'stamp',o}); }); m.labels.forEach(o=>{ if(ok(o)) out.push({type:'label',o}); }); m.paths.forEach(o=>{ if(ok(o)) out.push({type:'path',o}); }); m.shapes.forEach(o=>{ if(ok(o)) out.push({type:'shape',o}); });
 if(!sysHidden('marcadores')) m.pins.forEach(o=>{ if(!o.lk&&!(SD.player&&o.dm)) out.push({type:'pin',o}); }); return out; }
function hitAt(x,y,withPins){ const m=SD.map, z=SD.view.z;
 if(withPins!==false&&!sysHidden('marcadores')) for(const p of m.pins.slice().reverse()){ if(SD.player&&p.dm) continue; const s=15/z; if(Math.abs(x-p.x)<s*.95&&y<p.y+3/z&&y>p.y-s*2.4) return {type:'pin',o:p}; }
 const all=allSelectable().filter(s=>s.type!=='pin'); for(const s of all.filter(s=>s.type==='label').reverse()) if(inBox(selBox(s),x,y)) return s;
 let best=null,ba=1e18; for(const s of all) if(s.type==='stamp'){ const b=selBox(s); if(inBox(b,x,y,.8)){ const a=b.w*b.h; if(a<ba){ ba=a; best=s; } } } if(best) return best;
 for(const s of all.filter(s=>s.type==='shape').reverse()){ const o=s.o; if(o.closed&&o.fi&&o.fi.on){ const c=SD.ctx; c.save(); c.setTransform(1,0,0,1,0,0); shapePath(c,o); const inside=c.isPointInPath(x,y); c.restore(); if(inside) return s; } const pts=shapeSamples(o); for(let i=1;i<pts.length;i++) if(distSeg(x,y,pts[i-1],pts[i])<Math.max(((o.st||{}).w||0)/2,7/z)) return s; }
 for(const s of all.filter(s=>s.type==='path').reverse()){ const pts=spOf(s.o); for(let i=1;i<pts.length;i++) if(distSeg(x,y,pts[i-1],pts[i])<Math.max(s.o.w/2,7/z)) return s; }
 return null; }
function expandGroup(h,noGroup){ if(noGroup||!h.o.g) return [h]; return allSelectable().filter(s=>s.o.g===h.o.g); }
function handleAt(p){ if(!SD.sel.length||(SD.sel.length===1&&SD.sel[0].type==='pin')) return null; const b=groupBox(), z=SD.view.z, c=Math.cos(b.r), sn=Math.sin(b.r), W=(lx,ly)=>({x:b.cx+lx*c-ly*sn,y:b.cy+lx*sn+ly*c});
 const ro=W(0,-b.h/2-22/z); if(Math.hypot(p.x-ro.x,p.y-ro.y)<9/z) return {mode:'rot'};
 const hp=handlePts(b); for(let i=0;i<8;i++){ const q=W(...hp[i]); if(Math.hypot(p.x-q.x,p.y-q.y)<9/z) return i<4?{mode:'scale'}:{mode:(i===5||i===7)?'sx':'sy'}; }
 return null; }
function moveEnt(s,i,dx,dy){ const o=s.o; if(s.type==='path') o.pts=i.pts.map(q=>[q[0]+dx,q[1]+dy]); else if(s.type==='shape') o.nodes=i.nodes.map(n=>Object.assign({},n,{x:n.x+dx,y:n.y+dy})); else { o.x=i.x+dx; o.y=i.y+dy; } }
function transformSel(d,p,shift){ const b=d.box, R=b.r, cs=Math.cos(R), sn=Math.sin(R), toL=(x,y)=>{ const dx=x-b.cx, dy=y-b.cy; return [dx*cs+dy*sn,-dx*sn+dy*cs]; };
 let fx=1, fy=1, th=0; const [sx0,sy0]=toL(d.start.x,d.start.y), [px,py]=toL(p.x,p.y);
 if(d.mode==='scale'){ const f=Math.max(.02,Math.hypot(px,py)/Math.max(1e-3,Math.hypot(sx0,sy0))); fx=fy=f; }
 else if(d.mode==='sx') fx=clamp(px/(Math.abs(sx0)>1e-3?sx0:1),.02,50); else if(d.mode==='sy') fy=clamp(py/(Math.abs(sy0)>1e-3?sy0:1),.02,50);
 else { th=Math.atan2(p.y-b.cy,p.x-b.cx)-Math.atan2(d.start.y-b.cy,d.start.x-b.cx); if(shift){ const base=SD.sel.length===1?(d.init[0].r||0):0; th=Math.round((base+th)/(Math.PI/12))*(Math.PI/12)-base; } }
 const lin=(vx,vy)=>{ let lx=vx*cs+vy*sn, ly=-vx*sn+vy*cs; lx*=fx; ly*=fy; let X=lx*cs-ly*sn, Y=lx*sn+ly*cs; if(th){ const c2=Math.cos(th), s2=Math.sin(th); [X,Y]=[X*c2-Y*s2,X*s2+Y*c2]; } return [X,Y]; };
 const P=(x,y)=>{ const [X,Y]=lin(x-b.cx,y-b.cy); return [b.cx+X,b.cy+Y]; }; const one=SD.sel.length===1, uni=fx===fy;
 SD.sel.forEach((s,i)=>{ const o=s.o, I0=d.init[i];
  if(s.type==='path'){ o.pts=I0.pts.map(q=>P(q[0],q[1])); return; }
  if(s.type==='shape'){ o.nodes=I0.nodes.map(n=>{ const [x,y]=P(n.x,n.y); return Object.assign({},n,{x,y,i:n.i?lin(...n.i):null,o:n.o?lin(...n.o):null}); }); return; }
  const [x,y]=P(I0.x,I0.y); o.x=x; o.y=y; if(s.type==='pin') return;
  if(th) o.r=(I0.r||0)+th;
  if(s.type==='stamp'){ if(uni) o.s=clamp(I0.s*fx,3,8000); else if(one){ o.sx=clamp((I0.sx||1)*fx,.05,20); o.sy=clamp((I0.sy||1)*fy,.05,20); } else o.s=clamp(I0.s*Math.sqrt(fx*fy),3,8000); }
  if(s.type==='label'){ if(uni) o.size=clamp(Math.round(I0.size*fx),4,800); else if(one){ o.sx=clamp((I0.sx||1)*fx,.1,10); o.sy=clamp((I0.sy||1)*fy,.1,10); } else o.size=clamp(Math.round(I0.size*Math.sqrt(fx*fy)),4,800); } }); }
function flipSel(axis){ if(!SD.sel.length) return; const b=vecSnap(), g=groupBox(), multi=SD.sel.length>1;
 SD.sel.forEach(s=>{ const o=s.o; const mx=x=>2*g.cx-x, my=y=>2*g.cy-y;
  if(s.type==='path') o.pts=o.pts.map(q=>axis==='x'?[mx(q[0]),q[1]]:[q[0],my(q[1])]);
  else if(s.type==='shape') o.nodes=o.nodes.map(n=>Object.assign({},n,axis==='x'?{x:mx(n.x),i:n.i?[-n.i[0],n.i[1]]:null,o:n.o?[-n.o[0],n.o[1]]:null}:{y:my(n.y),i:n.i?[n.i[0],-n.i[1]]:null,o:n.o?[n.o[0],-n.o[1]]:null}));
  else { if(multi){ if(axis==='x') o.x=mx(o.x); else o.y=my(o.y); } if(s.type==='stamp'){ if(axis==='x') o.f=o.f?0:1; else o.fy=o.fy?0:1; if(o.r) o.r=-o.r; } } });
 vecCommit(b,axis==='x'?'Espejar horizontal':'Espejar vertical'); draw(); }

/* ---------- Nodos de formas ---------- */
function nodeHit(p){ const z=SD.view.z, S=SD.sdraft||(SD.sel.length===1&&SD.sel[0].type==='shape'?SD.sel[0].o:null); if(!S) return null;
 for(const n of S.nodes) for(const k of ['i','o']) if(n[k]&&Math.hypot(p.x-n.x-n[k][0],p.y-n.y-n[k][1])<7/z) return {mode:'hnd',n,k,s:S};
 for(const n of S.nodes) if(Math.hypot(p.x-n.x,p.y-n.y)<7/z){ SD.nodeSel=n; return {mode:'node',n,s:S}; } return null; }
function finishShape(){ const d=SD.sdraft; SD.sdraft=null; if(!d) return; if(d.nodes.length<2){ draw(); return; } if(SB.shapeClosed&&d.nodes.length>2) d.closed=true;
 const b=vecSnap(); SD.map.shapes.push(d); SD.sel=[{type:'shape',o:d}]; vecCommit(b,d.closed?'Dibujar forma':'Dibujar línea'); stPanel(); draw(); }
function insertNode(s,p){ const pts=shapeSamples(s); let bi=-1, bd=1e9; for(let i=1;i<pts.length;i++){ const d=distSeg(p.x,p.y,pts[i-1],pts[i]); if(d<bd){ bd=d; bi=i; } } if(bi<0||bd>14/SD.view.z) return;
 const b=vecSnap(), seg=pts[bi-1][2]; s.nodes.splice(seg+1,0,{x:p.x,y:p.y,i:null,o:null}); vecCommit(b,'Añadir nodo'); draw(); }
function delNode(s,n){ if(s.nodes.length<=2) return toast('Una línea necesita al menos dos nodos.'); const b=vecSnap(); s.nodes=s.nodes.filter(x=>x!==n); vecCommit(b,'Quitar nodo'); draw(); }
function cutShape(){ const s=SD.sel.length===1&&SD.sel[0].type==='shape'?SD.sel[0].o:null, n=SD.nodeSel; if(!s||!n||!s.nodes.includes(n)) return toast('Haz clic en un nodo de la línea para cortarla ahí.');
 const b=vecSnap(), i=s.nodes.indexOf(n);
 if(s.closed){ s.nodes=[...s.nodes.slice(i),...s.nodes.slice(0,i),clone(n)]; s.closed=false; }
 else { if(i===0||i===s.nodes.length-1) return toast('Elige un nodo del medio para cortar.'); const s2=clone(s); s2.id=uid(); s2.nodes=s.nodes.slice(i).map(x=>clone(x)); s.nodes=s.nodes.slice(0,i+1); SD.map.shapes.push(s2); }
 vecCommit(b,'Cortar trazo'); stPanel(); draw(); }
function closePoly(){ const pts=SD.poly; SD.poly=null; if(!pts||pts.length<3){ draw(); return; } const m=SD.map; polyFill(pts,!SB.coastLand,curTex(),m.L.find(l=>l.land).id,SB.feather||0); draw(); }

/* ---------- Teclado ---------- */
function stKey(e){ if(route!=='mapas'||!SD.map||$('.modal-bg')||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
 if(e.code==='Space'){ SD.space=e.type==='keydown'; if(SD.space) e.preventDefault(); return; } if(e.type!=='keydown') return; const k=e.key.toLowerCase(), m=SD.map, mod=e.ctrlKey||e.metaKey;
 if(mod&&(k==='y'||(k==='z'&&e.shiftKey))){ e.preventDefault(); stRedo(); return; }
 if(mod&&k==='z'){ e.preventDefault(); stUndo(); return; }
 if(mod&&k==='d'&&SD.sel.length){ e.preventDefault(); dupSel(); return; }
 if(mod&&k==='a'&&SB.tool==='seleccion'){ e.preventDefault(); SD.sel=allSelectable().filter(s=>s.type!=='pin'&&lyOf(m,s.o)===activeObj()); stPanel(); draw(); return; }
 if(mod&&k==='g'){ e.preventDefault(); groupSel(e.shiftKey); return; }
 if(mod) return;
 if(e.key==='Enter'){ if(SD.sdraft){ finishShape(); return; } if(SD.poly){ closePoly(); return; } }
 if((e.key==='Delete'||e.key==='Backspace')&&SD.sel.length){ delSel(); return; }
 if(e.key==='Escape'){ if(SD.sdraft){ SD.sdraft=null; draw(); return; } if(SD.poly){ SD.poly=null; draw(); return; } SD.sel=[]; closeStPop(); stPanel(); draw(); return; }
 if(e.key.startsWith('Arrow')&&SD.sel.length){ e.preventDefault(); const st=e.shiftKey?10:1, dx=e.key==='ArrowLeft'?-st:e.key==='ArrowRight'?st:0, dy=e.key==='ArrowUp'?-st:e.key==='ArrowDown'?st:0; const b=vecSnap(); SD.sel.forEach(s=>moveEnt(s,clone(s.o),dx,dy)); vecCommit(b,'Mover'); draw(); return; }
 if(e.key==='['||e.key===']'){ const f=e.key===']'?1.2:1/1.2; if(SB.tool==='objetos'&&SB.smode!=='place') SB.srad=clamp(SB.srad*f,10,1200); else SB.size=clamp(SB.size*f,4,800); sbSave(); stPanel(); ctxBar(); draw(); return; }
 if(k==='v'){ setStTool('seleccion'); return; }
 const t=STOOLS.find(x=>x[3].toLowerCase()===k); if(t) setStTool(t[0]); }
function delSel(){ if(!SD.sel.length) return; const m=SD.map, b=vecSnap(); for(const s of SD.sel){ const col=collName(s.type); m[col]=m[col].filter(o=>o!==s.o); } SD.sel=[]; closeStPop(); vecCommit(b,'Borrar'); stPanel(); draw(); }
function dupSel(){ if(!SD.sel.length) return; const m=SD.map, b=vecSnap(), off=20/SD.view.z, ng={}; SD.sel=SD.sel.map(s=>{ const o=clone(s.o); o.id=uid(); if(o.g) o.g=ng[o.g]||(ng[o.g]=uid());
  if(s.type==='path') o.pts=o.pts.map(p=>[p[0]+off,p[1]+off]); else if(s.type==='shape') o.nodes=o.nodes.map(n=>Object.assign({},n,{x:n.x+off,y:n.y+off})); else { o.x+=off; o.y+=off; } m[collName(s.type)].push(o); return {type:s.type,o}; });
 vecCommit(b,'Duplicar'); stPanel(); draw(); }
function groupSel(un){ if(SD.sel.length<(un?1:2)) return toast(un?'Elige un grupo para desagruparlo.':'Elige dos o más objetos para agruparlos.'); const b=vecSnap(), g=uid(); SD.sel.forEach(s=>{ if(un) delete s.o.g; else s.o.g=g; }); vecCommit(b,un?'Desagrupar':'Agrupar'); toast(un?'Grupo deshecho.':'Objetos agrupados: se seleccionan juntos (Alt+clic elige uno solo).'); stPanel(); }

/* ---------- Notas interactivas ---------- */
let stPopEl=null;
function closeStPop(){ if(stPopEl){ stPopEl.remove(); stPopEl=null; } }
function mdRender(t){ const lines=(t||'').split('\n'); let html='', list=false;
 const inl=s=>rollify(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(^|[^*])\*(?!\s)(.+?)\*/g,'$1<i>$2</i>').replace(/\[\[(.+?)\]\]/g,(_,n)=>`<button class="st-wl" data-wl="${n.replace(/"/g,'&quot;')}">${n}</button>`);
 for(const ln of lines){ const li=ln.match(/^\s*[-•*]\s+(.*)/); if(li){ if(!list){ html+='<ul>'; list=true; } html+=`<li>${inl(li[1])}</li>`; continue; } if(list){ html+='</ul>'; list=false; }
  const hd=ln.match(/^#{1,3}\s+(.*)/); if(hd){ html+=`<h4>${inl(hd[1])}</h4>`; continue; } if(ln.trim()) html+=`<p>${inl(ln)}</p>`; }
 if(list) html+='</ul>'; return html||'<p class="muted">Sin descripción.</p>'; }
function openWikiLink(name){ const n=norm(name), idx=searchIndex(); const it=idx.find(x=>norm(x.t)===n)||idx.find(x=>norm(x.t).startsWith(n))||idx.find(x=>norm(x.t).includes(n)); if(it&&it.a) it.a(); else toast(`No encontré "${name}" en la wiki.`,'bad'); }
function stPlacePop(el,p){ const st=$('#stStage'); st.append(el); const W=st.clientWidth,H=st.clientHeight; el.style.left=clamp(p.sx+16,8,W-el.offsetWidth-8)+'px'; el.style.top=clamp(p.sy-20,8,H-el.offsetHeight-8)+'px'; stPopEl=el;
 el.addEventListener('pointerdown',e=>e.stopPropagation()); }
function notePop(k,p,edit){ closeStPop(); if(!p){ const z=SD.view.z; p={sx:k.x*z+SD.view.x,sy:k.y*z+SD.view.y}; } const m=SD.map; if(SD.player) edit=false;
 const child=stChildFor(m.level,k.kind), linked=k.link&&Store.get('maps',k.link); const el=document.createElement('div'); el.className='pop st-pop st-note';
 if(!edit){ el.innerHTML=`<div class="row" style="gap:8px;align-items:center;flex-wrap:nowrap"><span class="st-ndot" style="background:${esc(k.col||'#d6a44c')}"></span><b class="st-ntitle">${esc(k.name||'Nota sin título')}</b>${k.dm?'<span class="tag st-dmtag">Solo DM</span>':''}</div>
   <div class="st-nbody">${mdRender(k.note)}</div>
   <div class="row" style="gap:6px;justify-content:flex-end">${linked?`<button class="btn sm" id="kgo">${I.map} ${esc(linked.name)}</button>`:''}${SD.player?'':`<button class="btn sm pri" id="kedit">${I.brush} Editar</button>`}</div>`;
  stPlacePop(el,p); $('#kedit',el)?.addEventListener('click',()=>notePop(k,p,true)); $('#kgo',el)?.addEventListener('click',()=>{ flushStudio(); openStudio(linked.id); });
  el.addEventListener('click',e=>{ const w=e.target.closest('[data-wl]'); if(w) openWikiLink(w.dataset.wl); }); return; }
 el.innerHTML=`<input class="inp" id="kn" placeholder="Título de la nota" value="${esc(k.name)}" aria-label="Título">
  <div class="st-icons">${NOTE_ICONS.map(([v,t])=>`<button class="st-ico ${v===k.kind?'on':''}" data-ico="${v}" title="${t}" aria-label="${t}"><canvas width="44" height="44" data-ic="${v}"></canvas></button>`).join('')}</div>
  <div class="row" style="gap:5px">${NOTE_COLS.map(c=>`<button class="st-col sm ${c===k.col?'on':''}" data-nc="${c}" style="background:${c}" aria-label="Color"></button>`).join('')}</div>
  <textarea class="inp" id="knote" rows="5" placeholder="Trampas, encuentros, lore…&#10;**negrita**, *cursiva*, - listas, [[Goblin]] enlaza a la wiki y 2d6+3 se puede tirar" aria-label="Descripción">${esc(k.note||'')}</textarea>
  <label class="st-check"><input type="checkbox" id="kdm" ${k.dm?'checked':''}> Solo la ve el DM</label>
  ${child?(linked?`<button class="btn sm" id="kgo">${I.map} Abrir ${esc(linked.name)}</button>`:`<button class="btn sm" id="ksub">${I.plus} Crear mapa ${(SLV[child]||{n:''}).n.toLowerCase()} desde aquí</button>`):''}
  <div class="row" style="justify-content:space-between"><button class="btn sm danger" id="kdel">${I.trash} Quitar</button><div class="row" style="gap:6px"><button class="btn sm" id="kview">Vista previa</button><button class="btn sm pri" id="kok">Listo</button></div></div>`;
 stPlacePop(el,p); $$('canvas[data-ic]',el).forEach(c=>{ const g=c.getContext('2d'); g.fillStyle='#e9dcc0'; iconPath(g,c.dataset.ic,22,22,15); });
 if(!k.name) setTimeout(()=>$('#kn',el).focus(),30); const b0=vecSnap();
 const sync=()=>{ k.name=$('#kn',el).value; k.note=$('#knote',el).value; k.dm=$('#kdm',el).checked; saveDoc(600); draw(); };
 el.addEventListener('input',sync); el.addEventListener('change',sync); $('#kn',el).onkeydown=e=>{ if(e.key==='Enter') $('#kok',el).click(); };
 $$('[data-ico]',el).forEach(b=>b.onclick=()=>{ k.kind=b.dataset.ico; SB.note.icon=k.kind; sbSave(); $$('[data-ico]',el).forEach(x=>x.classList.toggle('on',x===b)); draw(); });
 $$('[data-nc]',el).forEach(b=>b.onclick=()=>{ k.col=b.dataset.nc; SB.note.col=k.col; sbSave(); $$('[data-nc]',el).forEach(x=>x.classList.toggle('on',x===b)); draw(); });
 const done=()=>{ sync(); SB.note.dm=k.dm; sbSave(); vecCommit(b0,'Editar nota'); };
 $('#kok',el).onclick=()=>{ done(); closeStPop(); if(SB.tool==='notas') stPanel(); draw(); };
 $('#kview',el).onclick=()=>{ done(); notePop(k,p,false); };
 $('#kdel',el).onclick=()=>{ m.pins=m.pins.filter(x=>x!==k); vecCommit(b0,'Quitar nota'); SD.sel=[]; closeStPop(); stPanel(); draw(); };
 $('#kgo',el)?.addEventListener('click',()=>{ done(); flushStudio(); openStudio(linked.id); });
 $('#ksub',el)?.addEventListener('click',()=>{ done(); closeStPop(); flushStudio(); newStudioMap(m,k); }); }

/* ---------- Panel lateral ---------- */
const slider=(id,label,val,min,max,step,fmt=v=>v)=>`<label class="st-sl"><span>${label}</span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"><b id="${id}V">${fmt(val)}</b></label>`;
const seg=(id,opts,cur)=>`<div class="st-seg" id="${id}">${opts.map(([k,n])=>`<button data-v="${k}" class="${String(cur)===String(k)?'on':''}">${n}</button>`).join('')}</div>`;
const selBlend=(id,cur)=>`<select class="sel sm" id="${id}" aria-label="Modo de fusión">${BLENDS.map(([k,n])=>`<option value="${k}" ${k===(cur||'source-over')?'selected':''}>${n}</option>`).join('')}</select>`;
const texSel=(id,cur,none='Color sólido')=>`<select class="sel sm" id="${id}" aria-label="Textura"><option value="">${none}</option>${Object.entries(TEX).map(([k,d])=>`<option value="${k}" ${k===cur?'selected':''}>${d.n}</option>`).join('')}</select>`;
function bindSlider(id,fn,fmt=v=>v,root=document){ const i=root.querySelector('#'+id); if(!i) return; i.oninput=()=>{ const v=+i.value; const o=root.querySelector('#'+id+'V'); if(o) o.textContent=fmt(v); fn(v); }; }
function bindSeg(id,fn,root=document){ const s=root.querySelector('#'+id); if(!s) return; s.onclick=e=>{ const b=e.target.closest('[data-v]'); if(!b) return; $$('button',s).forEach(x=>x.classList.toggle('on',x===b)); fn(b.dataset.v); }; }
function lazyThumbs(root){ const q=$$('[data-tx]',root).filter(el=>!el.style.backgroundImage); let i=0; const step=()=>{ if(!document.body.contains(root)) return; const t0=performance.now(); while(i<q.length&&performance.now()-t0<24){ const el=q[i++]; el.style.backgroundImage=`url(${texThumb(el.dataset.tx,el.dataset.bg==='1',112)})`; } if(i<q.length) setTimeout(step,0); }; step(); }
function stPanel(){ const pb=$('#stPB'); if(!pb||!SD.map) return; const m=SD.map, st=pb.scrollTop; let h='';
 if(SD.tab==='layers') h=layersPanel(m); else if(SD.tab==='objects') h=objectsPanel(m); else if(SD.tab==='style') h=stylePanel(m); else h=toolPanel(m);
 pb.innerHTML=h; bindPanel(pb); lazyThumbs(pb); pb.scrollTop=st; if(SD.tab==='layers') renderHistory(); status(); }

function toolPanel(m){ const t=SB.tool;
 if(t==='terreno'||t==='costa'){ const cw=coastWords(m), tx=lvTex(m), AB=activeBrush();
  return `<div class="st-sec"><span class="eyebrow">${t==='costa'?'Tierra y agua':'Pincel de texturas'}</span>
   ${t==='costa'?seg('cMode',[['1',`Sumar ${cw[0].toLowerCase()}`],['0',`Sumar ${cw[1].toLowerCase()}`]],SB.coastLand?'1':'0')+seg('cShape',[['0','Pincel'],['1','Polígono']],SB.landPoly?'1':'0')
    :`<div class="st-target">Pinta en: <b>${esc(AB.name)}</b>${AB.type==='mask'?' (máscara)':''} <button class="btn sm ghost" id="goLayers">Cambiar</button></div>`+seg('tMode',[['0',AB.type==='mask'?'Revelar':'Pintar'],['1',AB.type==='mask'?'Ocultar':'Borrar']],SB.erase?'1':'0')}
   ${t==='costa'&&SB.landPoly?slider('bFeat','Difuminado del borde',SB.feather||0,0,40,1,v=>v+' px')+'<p class="muted" style="margin:0;font-size:.84rem">Clic punto a punto y cierra en el primero (o Intro / doble clic).</p>':`<div class="st-brush"><canvas id="bPrev" width="120" height="120"></canvas><div style="flex:1;min-width:0">${slider('bSize','Tamaño',SB.size,4,800,2,v=>v+' px')}${slider('bSoft','Dureza',SB.soft,0,1,.05,v=>Math.round(v*100)+'%')}</div></div>
   ${slider('bOp','Opacidad',SB.op,.05,1,.05,v=>Math.round(v*100)+'%')}${slider('bRough','Borde irregular',SB.rough,0,1,.05,v=>Math.round(v*100)+'%')}`}
   ${t==='terreno'&&AB.type!=='mask'?`<div class="grid2">${slider('bTsc','Escala de textura',SB.tsc,.25,4,.05,v=>Math.round(v*100)+'%')}${slider('bTrot','Giro de textura',SB.trot,0,360,5,v=>v+'°')}</div><label class="st-lab">Modo de fusión ${selBlend('bBlend',SB.blend)}</label>`:''}</div>
   ${AB.type==='mask'&&t==='terreno'?'':`<div class="st-sec"><div class="row" style="justify-content:space-between"><span class="eyebrow">Texturas</span><label class="st-check sm"><input type="checkbox" id="allTex" ${SB.allTex?'checked':''}> Todas</label></div>
   <div class="st-tiles">${tx.map(k=>`<button class="st-tile ${curTex()===k?'on':''}" data-tex="${k}" data-tx="${k}"><span>${TEX[k].n}</span></button>`).join('')}</div>
   <div class="row" style="gap:6px"><button class="btn sm" id="fillAll" title="Cubre toda la capa con esta textura">${I.fill} Rellenar todo</button>${t==='costa'||AB.land?`<button class="btn sm" id="fillLand" title="Cambia la textura de toda la tierra ya pintada">${I.brush} Recolorear tierra</button>`:''}</div></div>`}`; }
 if(t==='objetos'){ const cats=[...new Set(lvStamps(m).map(d=>d.cat))], cat=SB.cat[m.level]==='fav'?'fav':(SB.cat[m.level]&&cats.includes(SB.cat[m.level])?SB.cat[m.level]:'todo'), sel=SB.stamp[m.level], q=norm(SB.q||'');
  const favs=(SB.favs||[]).filter(f=>STAMPS[f.k]&&STAMPS[f.k].side===isSide(m));
  const items=cat==='fav'?[]:lvStamps(m).filter(d=>(cat==='todo'||d.cat===cat)&&(!q||norm(d.n+' '+STAMP_CATS[d.cat]).includes(q)));
  const ap=SB.app[curStamp()]||{};
  return `<div class="st-sec"><span class="eyebrow">Objetos · capa ${esc((m.L.find(l=>l.id===activeObj())||{}).name||'')}</span>${seg('sMode',[['place','Colocar'],['scatter','Muchos'],['erase','Borrar']],SB.smode)}
   ${slider('sMul','Tamaño',SB.smul,.2,4,.05,v=>Math.round(v*100)+'%')}
   <label class="st-check"><input type="checkbox" id="sRandOn" ${SB.srand>0?'checked':''}> Escala aleatoria</label>${SB.srand>0?`<div class="grid2">${slider('sMin','Mínima',SB.smin,.3,2,.05,v=>Math.round(v*100)+'%')}${slider('sMax','Máxima',SB.smax,.3,3,.05,v=>Math.round(v*100)+'%')}</div>`:''}
   ${SB.smode!=='place'?slider('sRad','Área del pincel',SB.srad,10,1200,5,v=>v+' px')+(SB.smode==='scatter'?slider('sDens','Densidad',SB.dens,0,1,.05,v=>Math.round(v*100)+'%'):''):''}
   <div class="row" style="gap:12px"><label class="st-check"><input type="checkbox" id="sRot" ${SB.srot?'checked':''}> Giro al azar</label><label class="st-check"><input type="checkbox" id="sFlip" ${SB.sflip?'checked':''}> Espejar al azar</label></div>
   <details class="st-det"><summary>Apariencia de los nuevos objetos</summary>${apControls('na',ap)}</details></div>
   <div class="st-sec"><input class="inp" id="sQ" placeholder="Buscar objetos…" value="${esc(SB.q||'')}" aria-label="Buscar objetos">
   <div class="st-chips">${[['todo','Todo'],['fav','★ Favoritos'],...cats.map(c=>[c,STAMP_CATS[c]])].map(([k,n])=>`<button class="chip ${cat===k?'on':''}" data-cat="${k}">${n}</button>`).join('')}</div>
   <div class="st-stamps">${cat==='fav'?(favs.length?favs.map(f=>`<button class="st-st" data-fav="${SB.favs.indexOf(f)}" title="${esc(STAMPS[f.k].n)}"><img alt="" src="${stampThumb(f.k)}"><i>★</i><span>${esc(STAMPS[f.k].n)}</span></button>`).join(''):'<p class="muted" style="grid-column:1/-1;font-size:.86rem">Guarda un objeto con sus ajustes con el botón ★ de abajo.</p>')
    :((cat==='todo'||['vegetacion','naturaleza','montanas'].includes(cat))&&!q?lvScatter(m).map(([k,d])=>`<button class="st-st ${sel===k?'on':''}" data-stamp="${k}" title="${d.n}: elige variantes al azar"><img alt="" src="${stampThumb(d.ids[0])}"><i>set</i><span>${d.n}</span></button>`).join(''):'')+items.map(d=>`<button class="st-st ${sel===d.id?'on':''}" data-stamp="${d.id}" title="${d.n}"><img alt="" src="${stampThumb(d.id)}"><span>${d.n}</span></button>`).join('')}</div>
   ${cat!=='fav'?`<button class="btn sm" id="favAdd">★ Guardar ${esc((STAMPS[curStamp()]||{n:''}).n.toLowerCase())} con estos ajustes</button>`:''}</div>`; }
 if(t==='caminos') return `<div class="st-sec"><span class="eyebrow">Tipo de trazo</span><div class="st-paths">${lvPaths(m).map(k=>`<button class="st-pa ${curPath()===k?'on':''}" data-path="${k}"><canvas width="120" height="34" data-pv="${k}"></canvas><span>${PATHS[k].n}</span></button>`).join('')}</div>
   ${slider('pW','Grosor',SB.pw[curPath()]||1,.3,4,.05,v=>Math.round(v*100)+'%')}<p class="muted" style="font-size:.85rem;margin:0">Los ríos se ensanchan hacia la desembocadura: trázalos desde el nacimiento hasta el mar. Para trazos con nodos, rellenos y texturas usa Formas.</p></div>`;
 if(t==='formas'){ const one=SD.sel.length===1&&SD.sel[0].type==='shape'?SD.sel[0].o:null; return (one?shapeProps(one):'')+`<div class="st-sec"><span class="eyebrow">Nuevas líneas y formas</span>${seg('shK',[['0','Línea abierta'],['1','Forma cerrada']],SB.shapeClosed?'1':'0')}${shapeStyleControls('ns',SB.shape)}
   <div class="st-keys"><span>Clic: nodo recto</span><span>Clic y arrastrar: curva</span><span><kbd>Intro</kbd> terminar</span><span><kbd>Esc</kbd> cancelar</span><span>Doble clic en el trazo: nodo nuevo</span><span><kbd>Alt</kbd>+clic en nodo: quitarlo</span></div></div>`; }
 if(t==='texto'){ const s=SD.sel.length===1&&SD.sel[0].type==='label'?SD.sel[0].o:null, T=s||SB.text;
  return `<div class="st-sec"><span class="eyebrow">${s?'Texto seleccionado':'Estilo del próximo texto'}</span>${s?`<textarea class="inp" id="lbTxt" rows="3" aria-label="Texto">${esc(s.text)}</textarea>`:'<p class="muted" style="margin:0;font-size:.88rem">Haz clic en el mapa para escribir. Admite varias líneas.</p>'}
   <div class="st-fonts">${FONTS.map(([f,n,it])=>`<button class="st-font ${T.font===f?'on':''}" data-font="${f}" style="font-family:'${f}';${it?'font-style:italic':''}">${esc(n)}</button>`).join('')}</div>
   ${slider('lSize','Tamaño',T.size,8,300,1,v=>v+' px')}<div class="grid2">${slider('lSp','Espaciado',T.sp||0,-2,40,1)}${slider('lLh','Interlineado',T.lh||1.15,.8,2.5,.05)}</div>${slider('lCurve','Curva',T.curve||0,-1,1,.05,v=>Math.round(v*100)+'%')}
   <div class="st-colors">${['#2a2018','#f3ead6','#7a1f36','#1d3c63','#3b5a2a','#6b4a2e','#b8862e','#ffffff'].map(c=>`<button class="st-col ${T.color===c?'on':''}" data-col="${c}" style="background:${c}" aria-label="Color ${c}"></button>`).join('')}<input type="color" id="lColor" value="${T.color||'#2a2018'}" aria-label="Otro color"></div>
   <div class="row" style="gap:10px;flex-wrap:wrap"><label class="st-check"><input type="checkbox" id="lUp" ${T.up?'checked':''}> Mayúsculas</label><label class="st-check"><input type="checkbox" id="lB" ${(T.b??true)?'checked':''}> Negrita</label><label class="st-check"><input type="checkbox" id="lIt" ${T.it?'checked':''}> Cursiva</label><label class="st-check"><input type="checkbox" id="lTs" ${T.ts?'checked':''}> Sombra</label></div>
   <label class="st-check"><input type="checkbox" id="lHalo" ${T.halo?'checked':''}> Contorno</label>${T.halo?`<div class="row" style="gap:8px;flex-wrap:nowrap"><div style="flex:1">${slider('lHw','Grosor del contorno',T.hw||1,.2,3,.1)}</div><input type="color" id="lHc" value="${T.hc||'#f3ead6'}" aria-label="Color del contorno"></div>`:''}
   <div class="grid2">${slider('lO','Opacidad',T.o??1,.1,1,.05,v=>Math.round(v*100)+'%')}${slider('lBlur','Desenfoque',T.blur||0,0,10,.5,v=>v+' px')}</div><label class="st-lab">Fusión ${selBlend('lBl',T.bl)}</label>
   ${s?`<div class="row" style="gap:6px"><button class="btn sm" id="selDup">${I.copy} Duplicar</button><button class="btn sm danger" id="selDel">${I.trash} Borrar</button></div>`:''}</div>`; }
 if(t==='notas'){ const q=norm(SB.nq||''), list=m.pins.filter(p=>!q||norm((p.name||'')+' '+(p.note||'')).includes(q));
  return `<div class="st-sec"><span class="eyebrow">Nueva nota</span><div class="st-icons sm">${NOTE_ICONS.map(([v,t2])=>`<button class="st-ico ${v===SB.note.icon?'on':''}" data-nico="${v}" title="${t2}" aria-label="${t2}"><canvas width="40" height="40" data-ic="${v}"></canvas></button>`).join('')}</div>
   <label class="st-check"><input type="checkbox" id="nDm" ${SB.note.dm?'checked':''}> Nuevas notas solo para el DM</label></div>
   <div class="st-sec"><span class="eyebrow">Notas del mapa (${m.pins.length})</span><input class="inp" id="nQ" placeholder="Buscar en las notas…" value="${esc(SB.nq||'')}" aria-label="Buscar notas">
   <div class="st-nlist">${list.map(p=>`<button class="st-nrow" data-nid="${p.id}"><span class="st-ndot" style="background:${esc(p.col||'#d6a44c')}"></span><span class="st-nname">${esc(p.name||'Sin título')}</span>${p.dm?'<small class="tag">DM</small>':''}${p.link?'<small class="tag">submapa</small>':''}</button>`).join('')||'<p class="muted" style="font-size:.86rem;margin:0">Todavía no hay notas.</p>'}</div>
   <p class="muted" style="font-size:.82rem;margin:0">El ojo de la barra superior activa la vista de jugadores, que oculta las notas marcadas como DM.</p></div>`; }
 if(t==='seleccion') return selProps(m)||`<div class="st-sec"><span class="eyebrow">Seleccionar</span><p class="muted" style="margin:0;font-size:.9rem">Clic en un objeto, texto, trazo, forma o nota. Arrastra en un espacio vacío para seleccionar un área.</p>
   <div class="st-keys"><span><kbd>Mayús</kbd>/<kbd>Ctrl</kbd> sumar</span><span><kbd>Ctrl A</kbd> todo</span><span><kbd>Supr</kbd> borrar</span><span><kbd>Ctrl D</kbd> duplicar</span><span><kbd>Ctrl G</kbd> agrupar</span><span><kbd>Flechas</kbd> mover</span><span><kbd>Esc</kbd> soltar</span></div></div>`;
 if(t==='medir') return `<div class="st-sec"><span class="eyebrow">Medir</span><p class="muted" style="margin:0;font-size:.9rem">Arrastra sobre el mapa. Cada casilla equivale a <b>${m.scale} ${m.unit}</b>${m.unit==='km'?'; los viajes se calculan a unos 38 km por día':''}. Cambia la escala en la pestaña Estilo.</p></div>`;
 return `<div class="st-sec"><span class="eyebrow">Mover la vista</span><p class="muted" style="margin:0;font-size:.9rem">Arrastra para desplazarte. La barra espaciadora o el botón central del ratón mueven la vista desde cualquier herramienta.</p></div>`; }
function apControls(p,a){ return `${slider(p+'O','Opacidad',a.o??1,.05,1,.05,v=>Math.round(v*100)+'%')}<label class="st-lab">Fusión ${selBlend(p+'Bl',a.bl)}</label>
 <div class="grid2">${slider(p+'Hue','Matiz',a.hue||0,-180,180,5,v=>v+'°')}${slider(p+'Sat','Saturación',a.sat??1,0,2,.05,v=>Math.round(v*100)+'%')}${slider(p+'Bri','Brillo',a.bri??1,.2,2,.05,v=>Math.round(v*100)+'%')}${slider(p+'Con','Contraste',a.con??1,.2,2,.05,v=>Math.round(v*100)+'%')}</div>
 ${slider(p+'Blur','Desenfoque (altura)',a.blur||0,0,12,.5,v=>v+' px')}<label class="st-check"><input type="checkbox" id="${p}Clip" ${a.clip?'checked':''}> Recortar a la tierra (orillas y acantilados)</label>`; }
function bindAp(pb,p,setK,commit){ const set=(k,v)=>{ setK(k,v); commit(); };
 bindSlider(p+'O',v=>set('o',v<1?v:null),v=>Math.round(v*100)+'%',pb); bindSlider(p+'Hue',v=>set('hue',v||null),v=>v+'°',pb); bindSlider(p+'Sat',v=>set('sat',v!==1?v:null),v=>Math.round(v*100)+'%',pb);
 bindSlider(p+'Bri',v=>set('bri',v!==1?v:null),v=>Math.round(v*100)+'%',pb); bindSlider(p+'Con',v=>set('con',v!==1?v:null),v=>Math.round(v*100)+'%',pb); bindSlider(p+'Blur',v=>set('blur',v||null),v=>v+' px',pb);
 pb.querySelector('#'+p+'Bl')?.addEventListener('change',e=>set('bl',e.target.value==='source-over'?null:e.target.value)); pb.querySelector('#'+p+'Clip')?.addEventListener('change',e=>set('clip',e.target.checked?1:null)); }
function shapeStyleControls(p,S){ return `<label class="st-check"><input type="checkbox" id="${p}Son" ${S.son!==false?'checked':''}> Borde</label>
 <div class="grid2">${slider(p+'Sw','Grosor',S.sw??4,0,80,.5,v=>v+' px')}<label class="st-lab">Color <input type="color" id="${p}Sc" value="${S.sc||'#2a2018'}"></label></div>
 <div class="grid2"><label class="st-lab">Textura del borde ${texSel(p+'Stex',S.stex)}</label><label class="st-lab">Estilo <select class="sel sm" id="${p}Dash">${[['solid','Continuo'],['dash','Discontinuo'],['dot','Punteado']].map(([k,n])=>`<option value="${k}" ${k===(S.dash||'solid')?'selected':''}>${n}</option>`).join('')}</select></label></div>
 <label class="st-lab">Remate <select class="sel sm" id="${p}Cap">${[['round','Redondo'],['square','Cuadrado'],['butt','Plano']].map(([k,n])=>`<option value="${k}" ${k===(S.cap||'round')?'selected':''}>${n}</option>`).join('')}</select></label>
 <label class="st-check"><input type="checkbox" id="${p}Fon" ${S.fon?'checked':''}> Relleno (formas cerradas)</label>
 <div class="grid2"><label class="st-lab">Color <input type="color" id="${p}Fc" value="${S.fc||'#4a86b4'}"></label><label class="st-lab">Textura del relleno ${texSel(p+'Ftex',S.ftex)}</label></div>${slider(p+'Fo','Opacidad del relleno',S.fo??1,.05,1,.05,v=>Math.round(v*100)+'%')}`; }
function shapeAsStyle(o){ const st=o.st||{}, fi=o.fi||{}; return {son:st.on!==false,sw:st.w||0,sc:st.c||'#2a2018',stex:st.tex||'',dash:st.dash||'solid',cap:st.cap||'round',fon:!!fi.on,fc:fi.c||'#4a86b4',ftex:fi.tex||'',fo:fi.o??1}; }
function bindShapeStyle(pb,p,S,apply){ const ch=(k,v)=>{ S[k]=v; apply(); };
 pb.querySelector('#'+p+'Son')?.addEventListener('change',e=>ch('son',e.target.checked)); bindSlider(p+'Sw',v=>ch('sw',v),v=>v+' px',pb); pb.querySelector('#'+p+'Sc')?.addEventListener('input',e=>ch('sc',e.target.value));
 pb.querySelector('#'+p+'Stex')?.addEventListener('change',e=>ch('stex',e.target.value)); pb.querySelector('#'+p+'Dash')?.addEventListener('change',e=>ch('dash',e.target.value)); pb.querySelector('#'+p+'Cap')?.addEventListener('change',e=>ch('cap',e.target.value));
 pb.querySelector('#'+p+'Fon')?.addEventListener('change',e=>ch('fon',e.target.checked)); pb.querySelector('#'+p+'Fc')?.addEventListener('input',e=>ch('fc',e.target.value)); pb.querySelector('#'+p+'Ftex')?.addEventListener('change',e=>ch('ftex',e.target.value)); bindSlider(p+'Fo',v=>ch('fo',v),v=>Math.round(v*100)+'%',pb); }
function shapeProps(o){ return `<div class="st-sec"><span class="eyebrow">${o.closed?'Forma':'Línea'} seleccionada</span>${shapeStyleControls('es',shapeAsStyle(o))}
 <label class="st-check"><input type="checkbox" id="esClosed" ${o.closed?'checked':''}> Cerrada</label><div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm" id="esCut" title="Corta el trazo en el último nodo que tocaste">Cortar en el nodo</button><button class="btn sm" id="selDup">${I.copy} Duplicar</button><button class="btn sm danger" id="selDel">${I.trash} Borrar</button></div></div>`; }
const SL_OPTS=Array.from({length:21},(_,i)=>i-10);
function selProps(m){ const S=SD.sel; if(!S.length) return ''; const one=S.length===1?S[0]:null, o=one&&one.o, stamps=S.filter(s=>s.type==='stamp');
 const head=one?entName(one):`${S.length} elementos`; const sl=one&&one.type!=='pin'?slOf(one.type,o):0, ly=one&&one.type!=='pin'?lyOf(m,o):null;
 let h=`<div class="st-sec"><span class="eyebrow">${esc(head)}</span>`;
 if(one&&one.type==='pin') return h+`<button class="btn sm pri" id="pinOpen">${INOTE} Abrir la nota</button><div class="row" style="gap:6px"><button class="btn sm" id="selDup">${I.copy} Duplicar</button><button class="btn sm danger" id="selDel">${I.trash} Borrar</button></div></div>`;
 if(one&&one.type==='stamp') h+=slider('oS','Tamaño',Math.round(o.s),3,Math.max(800,Math.round(o.s*2)),1,v=>v+' px')+`<div class="grid2">${slider('oSx','Estirar ancho',o.sx||1,.1,4,.05,v=>Math.round(v*100)+'%')}${slider('oSy','Estirar alto',o.sy||1,.1,4,.05,v=>Math.round(v*100)+'%')}</div>`+slider('oR','Giro',Math.round((o.r||0)*180/Math.PI),-180,180,1,v=>v+'°');
 if(one&&one.type==='path') h+=slider('oW','Grosor',Math.round(o.w*10)/10,1,Math.max(60,o.w*3),.5,v=>v+' px')+`<select class="sel sm" id="oT" aria-label="Tipo">${lvPaths(m).map(k=>`<option value="${k}" ${k===o.t?'selected':''}>${PATHS[k].n}</option>`).join('')}</select>`;
 if(one&&one.type==='label') h+=`<button class="btn sm" id="oEdit">Editar texto y estilo</button>`;
 h+=`<div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm" id="fx">⇋ Espejar</button><button class="btn sm" id="fy">⇵ Voltear</button>${stamps.length?'<button class="btn sm" id="oVar">Otra variante</button>':''}</div>
  <div class="grid2"><label class="st-lab">Subcapa <select class="sel sm" id="oSl">${S.length>1?'<option value="">Varias</option>':''}${SL_OPTS.map(v=>`<option value="${v}" ${one&&v===sl?'selected':''}>${v>0?'+'+v:v}</option>`).join('')}</select></label>
  <label class="st-lab">Capa <select class="sel sm" id="oLy">${S.length>1?'<option value="">Varias</option>':''}${objLayers(m).map(L=>`<option value="${L.id}" ${L.id===ly?'selected':''}>${esc(L.name)}</option>`).join('')}</select></label></div>
  <div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm" id="oUp">Al frente</button><button class="btn sm" id="oDown">Atrás</button><button class="btn sm" id="oGrp">${S.some(s=>s.o.g)?'Desagrupar':'Agrupar'}</button><button class="btn sm" id="oLock">${ILOCK} Bloquear</button></div>`;
 if(stamps.length) h+=`<div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm" id="oRepl" title="Cambia por el objeto o set elegido en la herramienta Objetos">Reemplazar por ${esc((SCATTER[SB.stamp[m.level]]||STAMPS[curStamp()]||{n:''}).n.toLowerCase())}</button>${one?'<button class="btn sm" id="oSync" title="Copia tamaño y apariencia al pincel de objetos">Copiar ajustes al pincel</button>':''}</div>
  <details class="st-det" ${one?'open':''}><summary>Apariencia</summary>${apControls('oa',(one&&o.ap)||{})}</details>
  <details class="st-det"><summary>Sombra</summary>${seg('oShM',[['none','Ninguna'],['layer','De la capa'],['custom','Propia']],(one&&o.sh&&o.sh.m)||'layer')}${one&&o.sh&&o.sh.m==='custom'?`<div class="grid2">${slider('shX','Desplaz. X',o.sh.x??6,-60,60,1)}${slider('shY','Desplaz. Y',o.sh.y??8,-60,60,1)}${slider('shB','Desenfoque',o.sh.b??8,0,60,1)}${slider('shA','Opacidad',o.sh.a??.5,0,1,.05,v=>Math.round(v*100)+'%')}</div><label class="st-lab">Color <input type="color" id="shC" value="${o.sh.c||'#000000'}"></label>`:'<p class="muted" style="font-size:.82rem;margin:0">La sombra unificada de la capa se activa en Capas.</p>'}</details>`;
 h+=`<div class="row" style="gap:6px"><button class="btn sm" id="selDup">${I.copy} Duplicar</button><button class="btn sm danger" id="selDel">${I.trash} Borrar</button></div></div>`;
 if(one&&one.type==='shape') h+=shapeProps(o);
 return h; }

/* ---------- Capas ---------- */
function layersPanel(m){ const act=SD.activeL||activeObj(); const L=[...m.L].reverse();
 return `<div class="st-sec"><div class="row" style="justify-content:space-between;gap:6px"><span class="eyebrow">Capas</span><div class="row" style="gap:4px"><button class="btn sm" data-addl="brush" title="Nueva capa de pintura">${I.plus} Pintura</button><button class="btn sm" data-addl="object" title="Nueva capa de objetos">${I.plus} Objetos</button><button class="btn sm" data-addl="filter" title="Nueva capa de filtro">${I.plus} Filtro</button></div></div>
  <div class="st-layers">${L.map(l=>{ const [tn,ti]=LTYPE[l.type]||['',''], on=l.id===act, par=l.type==='mask'?m.L.find(x=>x.id===l.parent):null;
  return `<div class="st-lyr ${on?'on':''} ${l.type==='mask'?'mask':''}" data-lid="${l.id}"><button class="st-eye ${l.hid?'off':''}" data-leye="${l.id}" aria-label="Mostrar u ocultar">${IEYE2}</button><span class="st-lti">${ti}</span>
   <span class="st-lnm"><b>${esc(l.name)}</b><small>${tn}${par?' de '+esc(par.name):''}${l.land?' · define la costa':''}</small></span><button class="st-eye ${l.lk?'':'off'}" data-llk="${l.id}" aria-label="Bloquear">${ILOCK}</button></div>
   ${on?layerProps(m,l):''}`; }).join('')}</div>
  <p class="muted" style="font-size:.8rem;margin:0">Lo de arriba tapa lo de abajo. Los filtros afectan a todo lo que tienen debajo. Clic en una capa para activarla.</p></div>
  <div class="st-sec"><span class="eyebrow">Capas fijas</span>${SYS_LAYERS.map(([k,n])=>`<label class="st-layer"><input type="checkbox" data-ly="${k}" ${m.layers[k]?'':'checked'}><span>${n}</span></label>`).join('')}</div>
  <div class="st-sec"><span class="eyebrow">Historial</span><div class="st-hist" id="stHist"></div></div>`; }
function layerProps(m,l){ let h=`<div class="st-lprops"><div class="row" style="gap:6px;flex-wrap:nowrap"><input class="inp sm" id="lyName" value="${esc(l.name)}" aria-label="Nombre de la capa"><button class="btn icon sm" id="lyUp" title="Subir" aria-label="Subir">↑</button><button class="btn icon sm" id="lyDn" title="Bajar" aria-label="Bajar">↓</button>${l.land?'':`<button class="btn icon sm danger" id="lyDel" title="Eliminar capa" aria-label="Eliminar capa">${I.trash}</button>`}</div>`;
 if(l.type!=='mask') h+=`${slider('lyOp','Opacidad',l.op??1,0,1,.05,v=>Math.round(v*100)+'%')}${l.type!=='filter'?`<label class="st-lab">Fusión ${selBlend('lyBl',l.blend)}</label>`:''}`;
 if(l.type==='object'){ const s=l.shadow||{}; h+=`<label class="st-check"><input type="checkbox" id="lyShOn" ${s.on?'checked':''}> Sombra unificada de la capa</label>${s.on?`<div class="grid2">${slider('lyShX','Desplaz. X',s.x??10,-80,80,1)}${slider('lyShY','Desplaz. Y',s.y??14,-80,80,1)}${slider('lyShB','Desenfoque',s.b??12,0,80,1)}${slider('lyShA','Opacidad',s.a??.5,0,1,.05,v=>Math.round(v*100)+'%')}</div><label class="st-lab">Color <input type="color" id="lyShC" value="${s.c||'#000000'}"></label>`:''}`; }
 if(l.type==='brush'||l.type==='object') h+=`<div class="row" style="gap:6px;flex-wrap:wrap">${m.L.some(x=>x.type==='mask'&&x.parent===l.id)?'':`<button class="btn sm" id="lyMask">${I.plus} Máscara</button>`}${l.type==='brush'?`<button class="btn sm" id="lyPaint">${I.brush} Pintar aquí</button>`:''}${l.type==='brush'&&!l.land?`<button class="btn sm" id="lyClr">${I.trash} Vaciar</button>`:''}</div>`;
 if(l.type==='mask') h+=`<label class="st-check"><input type="checkbox" id="lyInv" ${l.inv?'checked':''}> Invertir (lo pintado oculta)</label><p class="muted" style="font-size:.8rem;margin:0">Con el Pincel en esta capa: Revelar muestra, Ocultar esconde.</p><button class="btn sm" id="lyPaint">${I.brush} Pintar la máscara</button>`;
 if(l.type==='filter'){ const f=l.f||(l.f={}); h+=`<label class="st-lab">Preset <select class="sel sm" id="fPre">${Object.entries(FPRESETS).map(([k,[n]])=>`<option value="${k}" ${k===(f.preset||'ninguno')?'selected':''}>${n}</option>`).join('')}</select></label>
  <div class="grid2">${slider('fHue','Matiz',f.hue||0,-180,180,5,v=>v+'°')}${slider('fSat','Saturación',f.sat??1,0,2,.05,v=>Math.round(v*100)+'%')}${slider('fBri','Brillo',f.bri??1,.2,2,.05,v=>Math.round(v*100)+'%')}${slider('fCon','Contraste',f.con??1,.2,2,.05,v=>Math.round(v*100)+'%')}</div>
  <label class="st-lab">Textura <select class="sel sm" id="fTex">${Object.entries(FTEX).map(([k,n])=>`<option value="${k}" ${k===(f.tex||'ninguna')?'selected':''}>${n}</option>`).join('')}</select></label>
  ${f.tex&&f.tex!=='ninguna'?`<div class="grid2">${slider('fTo','Intensidad',f.to??.5,0,1,.05,v=>Math.round(v*100)+'%')}${slider('fTs','Escala',f.ts||1,.25,4,.05,v=>Math.round(v*100)+'%')}</div><label class="st-lab">Fusión ${selBlend('fTb',f.tb||'multiply')}</label>`:''}
  ${slider('fVig','Viñeta',f.vig||0,0,1,.05,v=>Math.round(v*100)+'%')}<div class="grid2">${slider('fBlur','Desenfoque',f.blur||0,0,10,.5,v=>v+' px')}${slider('fTilt','Tilt-shift',f.tilt||0,0,3,.1)}</div>${f.tilt>0?slider('fFoc','Foco (altura)',f.focus??.5,0,1,.02,v=>Math.round(v*100)+'%'):''}`; }
 return h+'</div>'; }
function renderHistory(){ const el=$('#stHist'); if(!el) return; const U=SD.undo.slice(-30), R=SD.redo.slice(-10);
 el.innerHTML=(R.map((u,i)=>`<button class="st-hrow redo" data-hr="${R.length-i}">${esc(u.label||'Paso')}</button>`).join(''))+(U.length||R.length?`<div class="st-hnow">Estado actual</div>`:'')+U.slice().reverse().map((u,i)=>`<button class="st-hrow" data-hu="${i+1}">${esc(u.label||'Paso')}</button>`).join('')||'<p class="muted" style="font-size:.84rem;margin:0">Sin cambios todavía.</p>';
 el.onclick=e=>{ const u=e.target.closest('[data-hu]'), r=e.target.closest('[data-hr]'); if(u) for(let i=0;i<+u.dataset.hu;i++) stUndo(); if(r) for(let i=0;i<+r.dataset.hr;i++) stRedo(); }; }

/* ---------- Panel de objetos ---------- */
function objectsPanel(m){ const L=m.L.find(l=>l.id===activeObj()), q=norm(SB.oq||''); const items=entitiesOf(m,L,true).reverse().filter(it=>!q||norm(entName({type:it.kind,o:it.o})).includes(q));
 return selProps(m)+`<div class="st-sec"><div class="grid2"><label class="st-lab">Capa <select class="sel sm" id="obL">${objLayers(m).map(l=>`<option value="${l.id}" ${l.id===L.id?'selected':''}>${esc(l.name)}</option>`).join('')}</select></label><input class="inp sm" id="obQ" placeholder="Buscar…" value="${esc(SB.oq||'')}" aria-label="Buscar objetos"></div>
  <div class="st-olist">${items.slice(0,300).map(it=>{ const on=SD.sel.some(s=>s.o===it.o); return `<div class="st-orow ${on?'on':''}" data-oid="${it.o.id}" data-ok="${it.kind}"><button class="st-eye ${it.o.hd?'off':''}" data-ohd="${it.o.id}" aria-label="Ocultar">${IEYE2}</button>
   <span class="st-oname">${esc(entName({type:it.kind,o:it.o}))}${it.o.g?' <small class="muted">· grupo</small>':''}</span><small class="st-osl" title="Subcapa">${it.sl>0?'+'+it.sl:it.sl}</small><button class="st-eye ${it.o.lk?'':'off'}" data-olk="${it.o.id}" aria-label="Bloquear">${ILOCK}</button></div>`; }).join('')||'<p class="muted" style="font-size:.86rem;margin:0">Esta capa está vacía.</p>'}${items.length>300?`<p class="muted" style="font-size:.8rem">Mostrando 300 de ${items.length}. Usa el buscador.</p>`:''}</div></div>`; }

/* ---------- Estilo del mapa ---------- */
const rgbHex=a=>'#'+a.map(v=>(v|0).toString(16).padStart(2,'0')).join('');
function stylePanel(m){ const fx=m.fx, G=m.grid, C=m.coast, B=BGS[m.bg]||BGS.mar;
 return `<div class="st-sec"><span class="eyebrow">Fondo</span><div class="st-tiles sm">${Object.entries(BGS).map(([k,b])=>`<button class="st-tile ${m.bg===k?'on':''}" data-bgk="${k}" data-tx="${k}" data-bg="1"><span>${b.n}</span></button>`).join('')}</div></div>
  <div class="st-sec"><span class="eyebrow">Estilo de la costa</span><div class="grid2"><label class="st-lab">Contorno <input type="color" id="cSc" value="${C.sc||rgbHex(B.ink||[30,30,30])}"></label>${slider('cSw','Grosor',C.sw??2.6,0,10,.2,v=>v+' px')}</div>
   <div class="grid2">${slider('cRip','Ondas',C.rip??(fx.rings===false?0:4),0,6,1)}<label class="st-lab">Color de ondas <input type="color" id="cRc" value="${C.rc||rgbHex(B.ring||[230,245,255])}"></label></div>
   <div class="grid2">${slider('cRo','Opacidad de ondas',C.ro??1,0,1.5,.05,v=>Math.round(v*100)+'%')}${slider('cGlow','Resplandor',C.glow??1,0,1.5,.05,v=>Math.round(v*100)+'%')}</div>
   <div class="grid2">${slider('cIsh','Sombra interior',C.ish??1,0,2,.05,v=>Math.round(v*100)+'%')}${slider('fxDep','Degradado del agua',fx.depth??120,0,400,10,v=>v+' px')}</div>
   <label class="st-check"><input type="checkbox" id="cBeach" ${(C.beach??(fx.beach!==false))?'checked':''}> Borde de playa</label></div>
  <div class="st-sec"><span class="eyebrow">Aspecto global</span><div class="st-chips">${Object.entries(LOOKS).map(([k,[n]])=>`<button class="chip ${(fx.look||'natural')===k?'on':''}" data-look="${k}">${n}</button>`).join('')}</div>
   ${slider('fxVig','Viñeta',fx.vig||0,0,1,.05,v=>Math.round(v*100)+'%')}${slider('fxPap','Textura de papel',fx.paper||0,0,1,.05,v=>Math.round(v*100)+'%')}${slider('fxDark','Oscuridad (las luces la atraviesan)',fx.dark||0,0,.95,.05,v=>Math.round(v*100)+'%')}
   <label class="st-check"><input type="checkbox" id="fxTint" ${fx.tint!==false?'checked':''}> Tono del plano (${esc(planeById(m.plane||'material').name)})</label>
   <span class="st-lab">Marco</span>${seg('fxFrame',[['none','Sin marco'],['fino','Fino'],['ornado','Ornamentado']],fx.frame||'none')}<p class="muted" style="font-size:.8rem;margin:0">Para filtros por capas (luz de luna, grano, tilt-shift…) añade una capa de filtro en Capas.</p></div>
  <div class="st-sec"><span class="eyebrow">Cuadrícula y escala</span><label class="st-check"><input type="checkbox" id="gOn" ${G.on?'checked':''}> Mostrar cuadrícula</label>${seg('gType',[['sq','Cuadrada'],['hex','Hexagonal'],['iso','Isométrica']],G.type)}
   ${slider('gSize','Tamaño de casilla',G.size,12,240,1,v=>v+' px')}<div class="grid2">${slider('gLw','Grosor de línea',G.lw||1,.5,6,.5)}${slider('gOp','Opacidad',G.op,.05,1,.05,v=>Math.round(v*100)+'%')}</div>
   <div class="grid2">${slider('gOx','Desplaz. X',G.ox||0,0,Math.round(G.size),1)}${slider('gOy','Desplaz. Y',G.oy||0,0,Math.round(G.size),1)}</div>
   <div class="row" style="gap:8px"><label class="st-lab">Color <input type="color" id="gCol" value="${gridColor(m)}"></label><label class="st-check"><input type="checkbox" id="gSnap" ${G.snap?'checked':''}> Imán a la cuadrícula</label></div>
   <div class="row" style="gap:6px;flex-wrap:nowrap"><small class="muted" style="white-space:nowrap">1 casilla =</small><input class="inp mono" id="gScale" type="number" step="0.1" min="0.1" value="${m.scale}" style="width:84px"><select class="sel" id="gUnit" style="width:auto">${['m','km','millas','pies'].map(u=>`<option ${u===m.unit?'selected':''}>${u}</option>`).join('')}</select></div></div>
  <div class="st-sec"><span class="eyebrow">Este mapa</span><select class="sel" id="mPlane" aria-label="Plano">${PLANES.map(p=>`<option value="${p.id}" ${p.id===(m.plane||'material')?'selected':''}>${p.name}</option>`).join('')}</select>
   <div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm" id="mResize">Recortar o ampliar lienzo</button><button class="btn sm" id="mGen">${I.wand} Generar de nuevo</button></div>
   <div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm" id="mJson">${I.down} Proyecto (.json)</button><button class="btn sm danger" id="mDel">${I.trash} Eliminar mapa</button></div><small class="muted">Lienzo de ${m.w} × ${m.h} px · ${Math.round(m.w/G.size)} × ${Math.round(m.h/G.size)} casillas</small></div>`; }

function brushPreview(){ const c=$('#bPrev'); if(!c) return; const g=c.getContext('2d'); g.clearRect(0,0,120,120); const r=52, tmp=mkC(120,120), tg=tmp.getContext('2d'), AB=activeBrush();
 if(SB.tool==='costa'&&!SB.coastLand||SB.tool==='terreno'&&SB.erase&&AB.type!=='mask') tg.fillStyle=texPattern(tg,SD.map.bg,true); else if(SB.tool==='terreno'&&AB.type==='mask') tg.fillStyle=SB.erase?'#333':'#e9dcc0'; else { const p=tg.createPattern(texCanvas(curTex()),'repeat'); if(p.setTransform) p.setTransform(new DOMMatrix().rotate(SB.tool==='terreno'?SB.trot||0:0).scale((TEX[curTex()].sc||1)*(SB.tool==='terreno'?SB.tsc||1:1)*.6)); tg.fillStyle=p; }
 tg.fillRect(0,0,120,120); tg.globalCompositeOperation='destination-in'; tg.drawImage(dabMask(r),8,8,104,104); g.globalAlpha=SB.op; g.drawImage(tmp,0,0); g.globalAlpha=1; }
function drawPathPreviews(root){ const m=SD.map, L=LVK(m).L; $$('canvas[data-pv]',root).forEach(cv=>{ const g=cv.getContext('2d'), t=cv.dataset.pv; g.fillStyle=m.level==='mazmorra'?'#6b6560':'#9aab66'; g.fillRect(0,0,120,34);
  const base=PATHS[t].w[L]??PATHS[t].w.g??1, w=clamp('mdc'.includes(L)?base*18:base*1.4,3,14); const pts=[]; for(let x=6;x<=114;x+=12) pts.push([x,17+Math.sin(x/18)*7]); drawPath(g,{t,w,pts,sp:samplePath(pts)},m); }); }
function bindPanel(pb){ const m=SD.map, sv=()=>sbSave(), S=SD.sel, one=S.length===1?S[0]:null, o=one&&one.o;
 brushPreview(); drawPathPreviews(pb); $$('canvas[data-ic]',pb).forEach(c=>{ const g=c.getContext('2d'); g.fillStyle='#e9dcc0'; iconPath(g,c.dataset.ic,c.width/2,c.height/2,c.width*.34); });
 bindSeg('tMode',v=>{ SB.erase=v==='1'; sv(); brushPreview(); },pb); bindSeg('cMode',v=>{ SB.coastLand=v==='1'; sv(); brushPreview(); },pb); bindSeg('cShape',v=>{ SB.landPoly=v==='1'; SD.poly=null; sv(); stPanel(); draw(); },pb);
 bindSlider('bFeat',v=>{ SB.feather=v; sv(); },v=>v+' px',pb);
 bindSlider('bSize',v=>{ SB.size=v; sv(); ctxBar(); },v=>v+' px',pb); bindSlider('bSoft',v=>{ SB.soft=v; sv(); brushPreview(); },v=>Math.round(v*100)+'%',pb); bindSlider('bOp',v=>{ SB.op=v; sv(); brushPreview(); ctxBar(); },v=>Math.round(v*100)+'%',pb); bindSlider('bRough',v=>{ SB.rough=v; sv(); brushPreview(); },v=>Math.round(v*100)+'%',pb);
 bindSlider('bTsc',v=>{ SB.tsc=v; sv(); brushPreview(); },v=>Math.round(v*100)+'%',pb); bindSlider('bTrot',v=>{ SB.trot=v; sv(); brushPreview(); },v=>v+'°',pb); $('#bBlend',pb)?.addEventListener('change',e=>{ SB.blend=e.target.value; sv(); });
 $('#goLayers',pb)?.addEventListener('click',()=>{ SD.tab='layers'; $$('[data-tab]').forEach(x=>x.classList.toggle('on',x.dataset.tab==='layers')); stPanel(); });
 $$('[data-tex]',pb).forEach(b=>b.onclick=()=>{ SB.tex[m.level]=b.dataset.tex; sv(); $$('[data-tex]',pb).forEach(x=>x.classList.toggle('on',x===b)); brushPreview(); });
 $('#allTex',pb)?.addEventListener('change',e=>{ SB.allTex=e.target.checked; sv(); stPanel(); });
 $('#fillAll',pb)?.addEventListener('click',()=>{ const L=SB.tool==='costa'?m.L.find(l=>l.land):activeBrush(); confirmBox(`¿Cubrir toda la capa "${L.name}" con ${TEX[curTex()].n.toLowerCase()}? Puedes deshacerlo.`,()=>fillAll(curTex(),false,L.id),'Rellenar'); });
 $('#fillLand',pb)?.addEventListener('click',()=>fillAll(curTex(),true));
 bindSeg('sMode',v=>{ SB.smode=v; sv(); stPanel(); ctxBar(); draw(); },pb); bindSlider('sMul',v=>{ SB.smul=v; sv(); ctxBar(); draw(); },v=>Math.round(v*100)+'%',pb);
 $('#sRandOn',pb)?.addEventListener('change',e=>{ SB.srand=e.target.checked?.25:0; sv(); stPanel(); }); bindSlider('sMin',v=>{ SB.smin=v; sv(); },v=>Math.round(v*100)+'%',pb); bindSlider('sMax',v=>{ SB.smax=v; sv(); },v=>Math.round(v*100)+'%',pb);
 bindSlider('sRad',v=>{ SB.srad=v; sv(); },v=>v+' px',pb); bindSlider('sDens',v=>{ SB.dens=v; sv(); },v=>Math.round(v*100)+'%',pb);
 $('#sRot',pb)?.addEventListener('change',e=>{ SB.srot=e.target.checked; sv(); }); $('#sFlip',pb)?.addEventListener('change',e=>{ SB.sflip=e.target.checked; sv(); });
 if($('#naO',pb)) bindAp(pb,'na',(k,v)=>{ const a=SB.app[curStamp()]=SB.app[curStamp()]||{}; if(v==null) delete a[k]; else a[k]=v; },()=>{ sv(); draw(); });
 const refocus=id=>{ const i=$('#'+id); if(i){ i.focus(); i.setSelectionRange(i.value.length,i.value.length); } };
 $('#sQ',pb)?.addEventListener('input',e=>{ SB.q=e.target.value; clearTimeout(SD.qT); SD.qT=setTimeout(()=>{ stPanel(); refocus('sQ'); },220); });
 $$('[data-cat]',pb).forEach(b=>b.onclick=()=>{ SB.cat[m.level]=b.dataset.cat; sv(); stPanel(); });
 $$('[data-stamp]',pb).forEach(b=>b.onclick=()=>{ const id=b.dataset.stamp; SB.stamp[m.level]=id; if(SCATTER[id]&&SB.smode==='place') SB.smode='scatter'; else if(!SCATTER[id]&&SB.smode==='erase') SB.smode='place'; if(!isSide(m)&&!SCATTER[id]) SB.srot=!['puerta_t','escalera_t','cama_t','mesa_t','estanteria_t','altar_t','sarcofago_t','alfombra_t','carro_t','tienda_t','tejado_t','puesto_t','barco_t'].includes(id); sv(); stPanel(); ctxBar(); });
 $$('[data-fav]',pb).forEach(b=>b.onclick=()=>{ const f=SB.favs[+b.dataset.fav]; if(!f) return; SB.stamp[m.level]=f.k; Object.assign(SB,{smul:f.smul,srand:f.srand,smin:f.smin,smax:f.smax,srot:f.srot,sflip:f.sflip}); if(f.ap) SB.app[f.k]=clone(f.ap); SB.cat[m.level]='todo'; SB.smode='place'; sv(); stPanel(); ctxBar(); toast(`${STAMPS[f.k].n} listo con tus ajustes.`); });
 $('#favAdd',pb)?.addEventListener('click',()=>{ const k=curStamp(); SB.favs=(SB.favs||[]).filter(f=>!(f.k===k&&JSON.stringify(f.ap||{})===JSON.stringify(SB.app[k]||{}))); SB.favs.unshift({k,smul:SB.smul,srand:SB.srand,smin:SB.smin,smax:SB.smax,srot:SB.srot,sflip:SB.sflip,ap:clone(SB.app[k]||{})}); SB.favs=SB.favs.slice(0,40); sv(); toast('Guardado en favoritos.'); });
 $$('[data-path]',pb).forEach(b=>b.onclick=()=>{ SB.path[m.level]=b.dataset.path; sv(); stPanel(); }); bindSlider('pW',v=>{ SB.pw[curPath()]=v; sv(); },v=>Math.round(v*100)+'%',pb);
 bindSeg('shK',v=>{ SB.shapeClosed=v==='1'; sv(); },pb); if($('#nsSw',pb)) bindShapeStyle(pb,'ns',SB.shape,()=>{ sv(); ctxBar(); });
 if($('#esSw',pb)&&o&&o.nodes){ const st=shapeAsStyle(o); let b0=null; bindShapeStyle(pb,'es',st,()=>{ b0=b0||vecSnap(); o.st={on:st.son,w:st.sw,c:st.sc,tex:st.stex,dash:st.dash,cap:st.cap}; o.fi={on:st.fon,c:st.fc,tex:st.ftex,o:st.fo}; clearTimeout(SD.cT); SD.cT=setTimeout(()=>{ vecCommit(b0,'Estilo de forma'); b0=null; },500); draw(); });
  $('#esClosed',pb)?.addEventListener('change',e=>{ const b=vecSnap(); o.closed=e.target.checked; vecCommit(b,'Cerrar forma'); draw(); }); $('#esCut',pb)?.addEventListener('click',cutShape); }
 const L=one&&one.type==='label'?o:null, T=L||SB.text; let lb0=null; const lc=()=>{ if(L){ lb0=lb0||vecSnap(); clearTimeout(SD.lT); SD.lT=setTimeout(()=>{ vecCommit(lb0,'Editar texto'); lb0=null; },600); draw(); } else sv(); };
 const setT=(k,v,redo)=>{ if(v==null) delete T[k]; else T[k]=v; lc(); if(redo) stPanel(); };
 $('#lbTxt',pb)?.addEventListener('input',e=>{ L.text=e.target.value; lc(); });
 $$('[data-font]',pb).forEach(b=>b.onclick=()=>{ setT('font',b.dataset.font); $$('[data-font]',pb).forEach(x=>x.classList.toggle('on',x===b)); ctxBar(); });
 bindSlider('lSize',v=>setT('size',v),v=>v+' px',pb); bindSlider('lSp',v=>setT('sp',v),v=>v,pb); bindSlider('lLh',v=>setT('lh',v),v=>v,pb); bindSlider('lCurve',v=>setT('curve',v),v=>Math.round(v*100)+'%',pb);
 bindSlider('lHw',v=>setT('hw',v),v=>v,pb); bindSlider('lO',v=>setT('o',v),v=>Math.round(v*100)+'%',pb); bindSlider('lBlur',v=>setT('blur',v||null),v=>v+' px',pb); $('#lBl',pb)?.addEventListener('change',e=>setT('bl',e.target.value==='source-over'?null:e.target.value));
 $$('[data-col]',pb).forEach(b=>b.onclick=()=>{ setT('color',b.dataset.col); setT('hc',['#f3ead6','#ffffff'].includes(b.dataset.col)?'#1b140d':'#f3ead6'); $$('[data-col]',pb).forEach(x=>x.classList.toggle('on',x===b)); });
 $('#lColor',pb)?.addEventListener('input',e=>setT('color',e.target.value)); $('#lHc',pb)?.addEventListener('input',e=>setT('hc',e.target.value));
 $('#lUp',pb)?.addEventListener('change',e=>setT('up',e.target.checked)); $('#lB',pb)?.addEventListener('change',e=>setT('b',e.target.checked)); $('#lIt',pb)?.addEventListener('change',e=>setT('it',e.target.checked)); $('#lTs',pb)?.addEventListener('change',e=>setT('ts',e.target.checked?1:0)); $('#lHalo',pb)?.addEventListener('change',e=>setT('halo',e.target.checked?1:0,true));
 $$('[data-nico]',pb).forEach(b=>b.onclick=()=>{ SB.note.icon=b.dataset.nico; sv(); $$('[data-nico]',pb).forEach(x=>x.classList.toggle('on',x===b)); }); $('#nDm',pb)?.addEventListener('change',e=>{ SB.note.dm=e.target.checked; sv(); });
 $('#nQ',pb)?.addEventListener('input',e=>{ SB.nq=e.target.value; clearTimeout(SD.qT); SD.qT=setTimeout(()=>{ stPanel(); refocus('nQ'); },220); });
 $$('[data-nid]',pb).forEach(b=>b.onclick=()=>{ const k=m.pins.find(p=>p.id===b.dataset.nid); if(!k) return; SD.sel=[{type:'pin',o:k}]; flyTo(k.x,k.y); setTimeout(()=>notePop(k),460); });
 $('#pinOpen',pb)?.addEventListener('click',()=>notePop(o));
 /* selección */
 let sb0=null; const live=(fn,label)=>{ sb0=sb0||vecSnap(); fn(); clearTimeout(SD.sT); SD.sT=setTimeout(()=>{ vecCommit(sb0,label); sb0=null; },500); draw(); };
 const ed=(fn,label)=>{ const b=vecSnap(); fn(); vecCommit(b,label); draw(); stPanel(); };
 bindSlider('oS',v=>live(()=>o.s=v,'Tamaño'),v=>v+' px',pb); bindSlider('oSx',v=>live(()=>o.sx=v,'Estirar'),v=>Math.round(v*100)+'%',pb); bindSlider('oSy',v=>live(()=>o.sy=v,'Estirar'),v=>Math.round(v*100)+'%',pb); bindSlider('oR',v=>live(()=>o.r=v*Math.PI/180,'Girar'),v=>v+'°',pb); bindSlider('oW',v=>live(()=>o.w=v,'Grosor'),v=>v+' px',pb);
 $('#oT',pb)?.addEventListener('change',e=>ed(()=>{ o.t=e.target.value; },'Tipo de trazo'));
 $('#fx',pb)?.addEventListener('click',()=>flipSel('x')); $('#fy',pb)?.addEventListener('click',()=>flipSel('y'));
 $('#oVar',pb)?.addEventListener('click',()=>ed(()=>S.forEach(s=>{ if(s.type==='stamp') s.o.v=((s.o.v||0)+1+((Math.random()*5)|0))%8; }),'Variante'));
 $('#oSl',pb)?.addEventListener('change',e=>{ if(e.target.value==='') return; ed(()=>S.forEach(s=>{ if(s.type!=='pin') s.o.sl=+e.target.value; }),'Subcapa'); });
 $('#oLy',pb)?.addEventListener('change',e=>{ if(!e.target.value) return; ed(()=>S.forEach(s=>{ if(s.type!=='pin') s.o.ly=e.target.value; }),'Mover de capa'); });
 const reorder=up=>ed(()=>{ for(const c of COLLS){ const set=new Set(S.filter(s=>collName(s.type)===c).map(s=>s.o)); if(!set.size) continue; const rest=m[c].filter(x=>!set.has(x)), mv=m[c].filter(x=>set.has(x)); m[c]=up?[...rest,...mv]:[...mv,...rest]; } if(isSide(m)) toast('En mapas de mundo y región manda la altura (Y); usa la subcapa para forzar el orden.'); },up?'Al frente':'Atrás');
 $('#oUp',pb)?.addEventListener('click',()=>reorder(true)); $('#oDown',pb)?.addEventListener('click',()=>reorder(false));
 $('#oGrp',pb)?.addEventListener('click',()=>groupSel(S.some(s=>s.o.g))); $('#oLock',pb)?.addEventListener('click',()=>{ ed(()=>S.forEach(s=>s.o.lk=1),'Bloquear'); SD.sel=[]; toast('Bloqueado. Desbloquéalo desde la pestaña Objetos.'); stPanel(); });
 $('#oRepl',pb)?.addEventListener('click',()=>{ const sid=SB.stamp[m.level], ids=SCATTER[sid]?SCATTER[sid].ids:[curStamp()]; ed(()=>S.forEach(s=>{ if(s.type!=='stamp') return; const k=ids[(Math.random()*ids.length)|0]; s.o.s=Math.round(s.o.s*defSize(k)/defSize(s.o.k)); s.o.k=k; s.o.v=(Math.random()*8)|0; }),'Reemplazar objeto'); });
 $('#oSync',pb)?.addEventListener('click',()=>{ SB.stamp[m.level]=o.k; SB.smul=+(o.s/defSize(o.k)).toFixed(2); SB.app[o.k]=clone(o.ap||{}); sv(); toast('Ajustes copiados al pincel de objetos.'); });
 if($('#oaO',pb)) bindAp(pb,'oa',(k,v)=>S.forEach(s=>{ if(s.type!=='stamp') return; s.o.ap=s.o.ap||{}; if(v==null) delete s.o.ap[k]; else s.o.ap[k]=v; if(!Object.keys(s.o.ap).length) delete s.o.ap; }),()=>live(()=>{},'Apariencia'));
 bindSeg('oShM',v=>ed(()=>S.forEach(s=>{ if(s.type==='stamp'){ if(v==='layer') delete s.o.sh; else s.o.sh=Object.assign({x:6,y:8,b:8,a:.5,c:'#000000'},s.o.sh||{},{m:v}); } }),'Sombra'),pb);
 const shs=(k,v)=>live(()=>S.forEach(s=>{ if(s.o.sh) s.o.sh[k]=v; }),'Sombra'); bindSlider('shX',v=>shs('x',v),v=>v,pb); bindSlider('shY',v=>shs('y',v),v=>v,pb); bindSlider('shB',v=>shs('b',v),v=>v,pb); bindSlider('shA',v=>shs('a',v),v=>Math.round(v*100)+'%',pb); $('#shC',pb)?.addEventListener('input',e=>shs('c',e.target.value));
 $('#oEdit',pb)?.addEventListener('click',()=>setStTool('texto'));
 $$('#selDup',pb).forEach(b=>b.addEventListener('click',dupSel)); $$('#selDel',pb).forEach(b=>b.addEventListener('click',delSel));
 /* capas */
 $$('[data-lid]',pb).forEach(r=>r.onclick=e=>{ if(e.target.closest('button,input,select,label')) return; SD.activeL=r.dataset.lid; const Lx=m.L.find(l=>l.id===SD.activeL); if(Lx&&Lx.type==='object') SD.lastObj=Lx.id; stPanel(); });
 $$('[data-addl]',pb).forEach(b=>b.onclick=()=>addLayer(b.dataset.addl));
 $$('[data-leye]',pb).forEach(b=>b.onclick=()=>ed(()=>{ const Lx=m.L.find(l=>l.id===b.dataset.leye); Lx.hid=Lx.hid?0:1; },'Visibilidad de capa'));
 $$('[data-llk]',pb).forEach(b=>b.onclick=()=>ed(()=>{ const Lx=m.L.find(l=>l.id===b.dataset.llk); Lx.lk=Lx.lk?0:1; },'Bloqueo de capa'));
 const AL=m.L.find(l=>l.id===(SD.activeL||activeObj())); let lb=null; const lv=fn=>{ lb=lb||vecSnap(); fn(); clearTimeout(SD.lyT); SD.lyT=setTimeout(()=>{ vecCommit(lb,'Ajustar capa'); lb=null; },500); draw(); };
 if(AL&&SD.tab==='layers'){ $('#lyName',pb)?.addEventListener('change',e=>ed(()=>{ AL.name=e.target.value||AL.name; },'Renombrar capa'));
  $('#lyUp',pb)?.addEventListener('click',()=>moveLayer(AL,1)); $('#lyDn',pb)?.addEventListener('click',()=>moveLayer(AL,-1)); $('#lyDel',pb)?.addEventListener('click',()=>delLayer(AL));
  bindSlider('lyOp',v=>lv(()=>AL.op=v),v=>Math.round(v*100)+'%',pb); $('#lyBl',pb)?.addEventListener('change',e=>ed(()=>{ AL.blend=e.target.value; },'Fusión de capa'));
  $('#lyShOn',pb)?.addEventListener('change',e=>ed(()=>{ AL.shadow=Object.assign({x:10,y:14,b:12,c:'#000000',a:.5},AL.shadow||{},{on:e.target.checked?1:0}); },'Sombra de capa'));
  const ls=k=>v=>lv(()=>AL.shadow[k]=v); bindSlider('lyShX',ls('x'),v=>v,pb); bindSlider('lyShY',ls('y'),v=>v,pb); bindSlider('lyShB',ls('b'),v=>v,pb); bindSlider('lyShA',ls('a'),v=>Math.round(v*100)+'%',pb); $('#lyShC',pb)?.addEventListener('input',e=>lv(()=>AL.shadow.c=e.target.value));
  $('#lyMask',pb)?.addEventListener('click',()=>addMask(AL)); $('#lyClr',pb)?.addEventListener('click',()=>confirmBox(`¿Vaciar la capa "${AL.name}"?`,()=>{ const c=SD.R[AL.id]; const bf=SD.before.getContext('2d'); bf.clearRect(0,0,m.w,m.h); bf.drawImage(c,0,0); c.getContext('2d').clearRect(0,0,m.w,m.h); pushTerrUndo(0,0,m.w,m.h,null,AL.id,'Vaciar capa'); rDirty(AL.id); draw(); },'Vaciar'));
  $('#lyInv',pb)?.addEventListener('change',e=>ed(()=>{ AL.inv=e.target.checked?1:0; },'Invertir máscara')); $('#lyPaint',pb)?.addEventListener('click',()=>{ SD.activeL=AL.id; setStTool('terreno'); });
  const f=AL.f; if(f){ const fv=k=>v=>lv(()=>{ if(v==null) delete f[k]; else f[k]=v; });
   $('#fPre',pb)?.addEventListener('change',e=>ed(()=>{ f.preset=e.target.value; },'Preset de filtro'));
   bindSlider('fHue',fv('hue'),v=>v+'°',pb); bindSlider('fSat',fv('sat'),v=>Math.round(v*100)+'%',pb); bindSlider('fBri',fv('bri'),v=>Math.round(v*100)+'%',pb); bindSlider('fCon',fv('con'),v=>Math.round(v*100)+'%',pb);
   $('#fTex',pb)?.addEventListener('change',e=>ed(()=>{ f.tex=e.target.value; },'Textura de filtro')); bindSlider('fTo',fv('to'),v=>Math.round(v*100)+'%',pb); bindSlider('fTs',fv('ts'),v=>Math.round(v*100)+'%',pb); $('#fTb',pb)?.addEventListener('change',e=>ed(()=>{ f.tb=e.target.value; },'Fusión de filtro'));
   bindSlider('fVig',fv('vig'),v=>Math.round(v*100)+'%',pb); bindSlider('fBlur',fv('blur'),v=>v+' px',pb); bindSlider('fTilt',fv('tilt'),v=>v,pb); bindSlider('fFoc',fv('focus'),v=>Math.round(v*100)+'%',pb);
   $('#fTilt',pb)?.addEventListener('change',()=>stPanel()); } }
 $$('[data-ly]',pb).forEach(c=>c.onchange=()=>{ m.layers[c.dataset.ly]=!c.checked; saveDoc(); draw(); });
 /* objetos */
 $('#obL',pb)?.addEventListener('change',e=>{ SD.activeL=e.target.value; SD.lastObj=e.target.value; stPanel(); }); $('#obQ',pb)?.addEventListener('input',e=>{ SB.oq=e.target.value; clearTimeout(SD.qT); SD.qT=setTimeout(()=>{ stPanel(); refocus('obQ'); },220); });
 const findE=id=>{ for(const c of COLLS){ const x=m[c].find(e=>e.id===id); if(x) return x; } };
 $$('[data-oid]',pb).forEach(r=>r.onclick=e=>{ if(e.target.closest('button')) return; const x=findE(r.dataset.oid); if(!x||x.lk) return; const s={type:r.dataset.ok,o:x}; if(e.shiftKey||e.ctrlKey||e.metaKey) SD.sel=SD.sel.some(q=>q.o===x)?SD.sel.filter(q=>q.o!==x):[...SD.sel,s]; else { SD.sel=[s]; const b=selBox(s); flyTo(b.cx,b.cy,SD.view.z); } stPanel(); draw(); });
 $$('[data-ohd]',pb).forEach(b=>b.onclick=()=>ed(()=>{ const x=findE(b.dataset.ohd); x.hd=x.hd?0:1; if(x.hd) SD.sel=SD.sel.filter(s=>s.o!==x); },'Ocultar objeto'));
 $$('[data-olk]',pb).forEach(b=>b.onclick=()=>ed(()=>{ const x=findE(b.dataset.olk); x.lk=x.lk?0:1; if(x.lk) SD.sel=SD.sel.filter(s=>s.o!==x); },'Bloquear objeto'));
 /* estilo */
 const fx=m.fx, C=m.coast, fxs=(k,v,coast)=>{ fx[k]=v; saveDoc(); if(coast) coastSoon(120); draw(); }, cst=(k,v)=>{ C[k]=v; saveDoc(); coastSoon(150); };
 $$('[data-bgk]',pb).forEach(b=>b.onclick=()=>{ m.bg=b.dataset.bgk; $$('[data-bgk]',pb).forEach(x=>x.classList.toggle('on',x===b)); saveDoc(); computeCoast(); saveTerrain(300); stPanel(); });
 $('#cSc',pb)?.addEventListener('input',e=>cst('sc',e.target.value)); bindSlider('cSw',v=>cst('sw',v),v=>v+' px',pb); bindSlider('cRip',v=>cst('rip',v),v=>v,pb); $('#cRc',pb)?.addEventListener('input',e=>cst('rc',e.target.value));
 bindSlider('cRo',v=>cst('ro',v),v=>Math.round(v*100)+'%',pb); bindSlider('cGlow',v=>cst('glow',v),v=>Math.round(v*100)+'%',pb); bindSlider('cIsh',v=>cst('ish',v),v=>Math.round(v*100)+'%',pb); $('#cBeach',pb)?.addEventListener('change',e=>cst('beach',e.target.checked));
 $$('[data-look]',pb).forEach(b=>b.onclick=()=>{ fxs('look',b.dataset.look); $$('[data-look]',pb).forEach(x=>x.classList.toggle('on',x===b)); });
 bindSlider('fxVig',v=>fxs('vig',v),v=>Math.round(v*100)+'%',pb); bindSlider('fxPap',v=>fxs('paper',v),v=>Math.round(v*100)+'%',pb); bindSlider('fxDark',v=>fxs('dark',v),v=>Math.round(v*100)+'%',pb); bindSlider('fxDep',v=>fxs('depth',v,1),v=>v+' px',pb);
 $('#fxTint',pb)?.addEventListener('change',e=>fxs('tint',e.target.checked)); bindSeg('fxFrame',v=>fxs('frame',v),pb);
 const G=m.grid, gs=(k,v)=>{ G[k]=v; saveDoc(); draw(); };
 $('#gOn',pb)?.addEventListener('change',e=>gs('on',e.target.checked)); bindSeg('gType',v=>gs('type',v),pb); bindSlider('gSize',v=>gs('size',v),v=>v+' px',pb); bindSlider('gLw',v=>gs('lw',v),v=>v,pb); bindSlider('gOp',v=>gs('op',v),v=>Math.round(v*100)+'%',pb);
 bindSlider('gOx',v=>gs('ox',v),v=>v,pb); bindSlider('gOy',v=>gs('oy',v),v=>v,pb); $('#gCol',pb)?.addEventListener('input',e=>gs('color',e.target.value)); $('#gSnap',pb)?.addEventListener('change',e=>{ gs('snap',e.target.checked); $('#stSnap')?.classList.toggle('on',G.snap); });
 $('#gScale',pb)?.addEventListener('change',e=>{ m.scale=+e.target.value||1; saveDoc(); status(); }); $('#gUnit',pb)?.addEventListener('change',e=>{ m.unit=e.target.value; saveDoc(); status(); });
 $('#mPlane',pb)?.addEventListener('change',e=>{ m.plane=e.target.value; saveDoc(0); toast(`Mapa movido a ${planeById(e.target.value).name}.`); draw(); stPanel(); });
 $('#mResize',pb)?.addEventListener('click',resizeDialog); $('#mJson',pb)?.addEventListener('click',exportProject);
 $('#mGen',pb)?.addEventListener('click',()=>confirmBox('¿Generar un terreno nuevo? Reemplaza la tierra, los objetos y los textos (puedes deshacerlo).',async()=>{ const b=vecSnap(); const keep=mkC(m.w,m.h); keep.getContext('2d').drawImage(SD.terr,0,0);
  await stGenerate(m,false); pushTerrUndo(0,0,m.w,m.h,keep,m.L.find(l=>l.land).id,'Generar terreno'); vecCommit(b,'Generar objetos'); computeCoast(); rDirty(m.L.find(l=>l.land).id); stPanel(); },'Generar'));
 $('#mDel',pb)?.addEventListener('click',()=>confirmBox(`¿Eliminar el mapa "${m.name}"? Los submapas se conservan.`,()=>{ const id=m.id; for(const Lx of m.L) IDB.del&&IDB.del(rKey(m,Lx),'maps'); SD.map=null; SD.openId=null; lsSet('oz:stOpen',null); Store.del('maps',id); counts(); render(true); }));
}
function addLayer(type){ const m=SD.map, b=vecSnap(), id=type[0]+uid().slice(0,6); const n=m.L.filter(l=>l.type===type).length+1;
 const L={id,type,name:({brush:'Pintura ',object:'Objetos ',filter:'Atmósfera '}[type])+n,op:1,blend:'source-over'}; if(type==='object') L.shadow={on:0,x:10,y:14,b:12,c:'#000000',a:.5}; if(type==='filter') L.f={preset:'noche',vig:.3};
 const act=m.L.find(l=>l.id===SD.activeL); let at; if(type==='filter') at=m.L.length; else if(type==='brush') at=act&&act.type==='brush'?m.L.indexOf(act)+1:Math.max(1,m.L.findIndex(l=>l.type==='object')); else at=act?m.L.indexOf(act)+1:m.L.length; if(type!=='filter'&&m.L[at-1]&&m.L[at-1].type==='mask') at++; m.L.splice(at,0,L); if(type==='brush') SD.R[id]=mkC(m.w,m.h); SD.activeL=id; if(type==='object') SD.lastObj=id; vecCommit(b,'Nueva capa'); stPanel(); draw(); }
function addMask(parent){ const md=modal({title:'Nueva máscara',body:`<p class="muted" style="margin:0">La máscara decide qué partes de "${esc(parent.name)}" se ven. Sirve para revelar habitaciones o recortar terreno.</p>${sel('Empieza','start','empty',[['empty','Todo oculto (pinta para revelar)'],['full','Todo visible (borra para ocultar)']])}`,foot:`<button class="btn" data-c>Cancelar</button><button class="btn pri" data-s>Crear</button>`});
 $('[data-c]',md.el).onclick=md.close; $('[data-s]',md.el).onclick=()=>{ const st=vals(md.el).start, m=SD.map, b=vecSnap(), id='k'+uid().slice(0,6); const L={id,type:'mask',name:'Máscara de '+parent.name,parent:parent.id,start:st};
  m.L.splice(m.L.indexOf(parent)+1,0,L); SD.R[id]=mkC(m.w,m.h); if(st==='full') SD.R[id].getContext('2d').fillRect(0,0,m.w,m.h); rDirty(id); SD.activeL=id; vecCommit(b,'Nueva máscara'); md.close(); SB.erase=false; setStTool('terreno'); draw(); }; }
function moveLayer(L,dir){ const m=SD.map, i=m.L.indexOf(L), j=i+dir; if(j<0||j>=m.L.length) return; const b=vecSnap(); [m.L[i],m.L[j]]=[m.L[j],m.L[i]]; vecCommit(b,'Reordenar capas'); stPanel(); draw(); }
function delLayer(L){ const m=SD.map; if(L.type==='object'&&objLayers(m).length<=1) return toast('El mapa necesita al menos una capa de objetos.','bad');
 const ents=COLLS.filter(c=>c!=='pins').reduce((n,c)=>n+m[c].filter(e=>lyOf(m,e)===L.id).length,0);
 confirmBox(`¿Eliminar la capa "${L.name}"${ents&&L.type==='object'?` y sus ${ents} elementos`:''}?`,()=>{ const b=vecSnap(); if(L.type==='object') for(const c of COLLS) if(c!=='pins') m[c]=m[c].filter(e=>lyOf(m,e)!==L.id); m.L=m.L.filter(l=>l!==L&&l.parent!==L.id); SD.activeL=null; SD.sel=[]; vecCommit(b,'Eliminar capa'); stPanel(); draw(); }); }

/* ---------- Lienzo: recortar, ampliar y resolución ---------- */
function resizeDialog(){ const m=SD.map, G=m.grid.size; const md=modal({title:'Recortar o ampliar el lienzo',body:`<div class="grid2">${fld('Ancho (px)','w',m.w,'number')}${fld('Alto (px)','h',m.h,'number')}</div>
  <p class="muted" style="margin:0;font-size:.86rem">Ahora: ${m.w} × ${m.h} px (${Math.round(m.w/G)} × ${Math.round(m.h/G)} casillas). Elige desde dónde se recorta o amplía:</p>
  <div class="st-anchor">${['tl','t','tr','l','c','r','bl','b','br'].map(a=>`<label><input type="radio" name="anc" value="${a}" ${a==='c'?'checked':''}><span></span></label>`).join('')}</div>`,foot:`<button class="btn" data-c>Cancelar</button><button class="btn pri" data-s>Aplicar</button>`});
 $('[data-c]',md.el).onclick=md.close; $('[data-s]',md.el).onclick=()=>{ const f=vals(md.el), w=clamp(Math.round(+f.w),64,8192), h=clamp(Math.round(+f.h),64,8192), a=$('input[name=anc]:checked',md.el).value; md.close();
  const ox=a.includes('l')?0:a.includes('r')?w-m.w:Math.round((w-m.w)/2), oy=a.startsWith('t')?0:a.startsWith('b')?h-m.h:Math.round((h-m.h)/2); remapMap(w,h,1,ox,oy); }; }
function scaleMap(f){ const m=SD.map; remapMap(Math.round(m.w*f),Math.round(m.h*f),f,0,0); }
function remapMap(w,h,f,ox,oy){ const m=SD.map; for(const id in SD.R){ const o=SD.R[id], c=mkC(w,h); const g=c.getContext('2d'); g.imageSmoothingQuality='high'; g.drawImage(o,ox,oy,m.w*f,m.h*f); SD.R[id]=c; SD.dirtyR.add(id); }
 const P=(x,y)=>[x*f+ox,y*f+oy]; m.stamps.forEach(s=>{ [s.x,s.y]=P(s.x,s.y); s.s*=f; }); m.labels.forEach(l=>{ [l.x,l.y]=P(l.x,l.y); l.size=Math.round(l.size*f); }); m.pins.forEach(p=>{ [p.x,p.y]=P(p.x,p.y); });
 m.paths.forEach(p=>{ p.pts=p.pts.map(q=>P(q[0],q[1])); p.w*=f; }); m.shapes.forEach(s=>{ s.nodes=s.nodes.map(n=>Object.assign({},n,{x:n.x*f+ox,y:n.y*f+oy,i:n.i?[n.i[0]*f,n.i[1]*f]:null,o:n.o?[n.o[0]*f,n.o[1]*f]:null})); if(s.st&&s.st.w) s.st.w*=f; });
 m.grid.size=Math.round(m.grid.size*f*100)/100; m.grid.ox=(((m.grid.ox||0)*f+ox)%m.grid.size+m.grid.size)%m.grid.size; m.grid.oy=(((m.grid.oy||0)*f+oy)%m.grid.size+m.grid.size)%m.grid.size; m.w=w; m.h=h;
 SD.terr=SD.R[m.L.find(l=>l.land).id]; SD.tg=SD.terr.getContext('2d'); SD.buf=mkC(w,h); SD.before=mkC(w,h); SD.gridC=null; SD.undo=[]; SD.redo=[]; SD.upx=0; SD.sel=[];
 computeCoast(); saveTerrain(200); saveDoc(0); stFit(); stPanel(); resLabel(); stUpdUndo(); toast(`Lienzo ahora de ${w} × ${h} px.`); }
function exportDialog(){ const m=SD.map, L=Math.max(m.w,m.h), opts=[[.5,'Media'],[1,'Completa'],[2,'Doble'],[3,'Triple'],[Math.floor(8192/L*1000)/1000,'8K']].filter(([s],i,a)=>s<=8192/L+1e-6&&a.findIndex(x=>Math.abs(x[0]-s)<.01)===i);
 const md=modal({title:'Exportar mapa',body:`${sel('Resolución','sc','1',opts.map(([s,n])=>[String(s),`${n} · ${Math.round(m.w*s)} × ${Math.round(m.h*s)}`]))}
  ${sel('Formato','fmt','png',[['png','PNG (con transparencia)'],['jpg','JPG (más liviano)']])}
  <label class="st-check"><input type="checkbox" name="grid" ${m.grid.on?'checked':''}> Incluir la cuadrícula (desmárcala para Foundry o Roll20)</label>
  <label class="st-check"><input type="checkbox" name="notes"> Incluir las notas públicas (las de DM nunca salen)</label>
  <p class="muted" style="margin:0;font-size:.84rem">También puedes guardar el proyecto completo como .json desde Estilo para abrirlo en otro dispositivo.</p>`,foot:`<button class="btn" data-c>Cancelar</button><button class="btn pri" data-s>${I.down} Exportar</button>`});
 $('[data-c]',md.el).onclick=md.close; $('[data-s]',md.el).onclick=()=>{ const v=vals(md.el); md.close(); stExport({scale:+v.sc||1,fmt:v.fmt,grid:$('[name=grid]',md.el).checked,notes:$('[name=notes]',md.el).checked}); }; }

/* ---------- Mapas clásicos ---------- */
ROUTES.mapas.s='Mundos, regiones, ciudades, batallas y mazmorras';
const _vMapasClassic=vMapas;
vMapas=function(v){ const om=MS.open&&Store.get('maps',MS.open);
 if(MS.classic&&om&&!om.v){ _vMapasClassic(v); const st=$('#stage',v); if(st){ const bar=document.createElement('div'); bar.className='st-classic'; bar.innerHTML=`<button class="btn sm" id="clBack">${I.back} Estudio</button><button class="btn sm pri" id="clConv">${I.wand} Pasar al estudio nuevo</button>`; st.append(bar);
   $('#clBack').onclick=()=>{ MS.classic=false; MS.open=null; render(true); }; $('#clConv').onclick=()=>convertClassic(om); } return; }
 MS.classic=false; if(!SD.openId) SD.openId=lsGet('oz:stOpen',null); const sm=SD.openId&&Store.get('maps',SD.openId);
 if(sm&&sm.v) studioEditor(v,sm.id); else { SD.openId=null; studioGallery(v); } };
async function convertClassic(om){ const C0=C, W=om.w*C0, H=om.h*C0; const c=mkC(W,H), g=c.getContext('2d'); if(Ed.terrC) g.drawImage(Ed.terrC,0,0,W,H);
 const lv=om.level==='mazmorra'?'mazmorra':om.level, L=SLV[lv]||SLV.nacional;
 const m=ensureV3({id:om.id,v:2,name:om.name,level:lv,plane:om.plane||'material',w:W,h:H,bg:lv==='mazmorra'?'roca':'pergamino',grid:{on:true,type:'sq',size:C0,op:L.grid.op},scale:om.scale||L.scale,unit:om.unit||L.unit,fx:{look:'natural',vig:.3,paper:0,frame:'none',dark:0},layers:{},
  labels:(om.labels||[]).map(l=>({id:l.id||uid(),x:l.x*C0+C0/2,y:l.y*C0+C0/2,text:l.text,font:'Cinzel',size:Math.round(18*(l.size||1)),color:'#2a2018',halo:1,hc:'#f3ead6',sp:3,curve:0,up:true,it:!!l.italic,r:0})),
  pins:(om.markers||[]).map(k=>({id:k.id||uid(),x:k.x*C0+C0/2,y:k.y*C0+C0/2,kind:k.kind,name:k.name||'',note:k.note||'',link:k.link||null,dm:true})),parent:om.parent||null,created:om.created||Date.now()});
 await new Promise(r=>c.toBlob(b=>{ IDB.set(m.id,b,'maps').then(r); },'image/webp',.92)); Ed.map=null; SD.map=m; newTerrain(m); SD.tg.drawImage(c,0,0); makeThumb(); SD.map=null; Store.put('maps',m);
 MS.classic=false; MS.open=null; SD.openId=m.id; lsSet('oz:stOpen',m.id); toast('Mapa pasado al estudio nuevo.'); render(true); }
