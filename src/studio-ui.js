/* ===== Estudio de mapas · interfaz, herramientas y galería ===== */
const ICOAST=ic('<path d="M3 15c2 0 2-2 4.5-2S10 15 12 15s2.5-2 4.5-2S19 15 21 15"/><path d="M3 19c2 0 2-2 4.5-2S10 19 12 19s2.5-2 4.5-2S19 19 21 19" opacity=".6"/><path d="M5 11c1-4 4-7 7-7 2.5 0 4 1.5 5 3"/>');
const ITREE=ic('<path d="M12 3 6.5 11H9l-3.5 5h13L15 11h2.5z"/><path d="M12 16v5"/>');
const IPATH=ic('<path d="M4 20c3-6 5-2 8-8s5-5 8-8"/><circle cx="4" cy="20" r="1.4"/><circle cx="20" cy="4" r="1.4"/>');
const ICURSOR=ic('<path d="M5 3l14 7-6 2-2 6z"/>');
const ISTYLE=ic('<circle cx="12" cy="12" r="8.5"/><circle cx="8.5" cy="10" r="1.2"/><circle cx="12" cy="7.5" r="1.2"/><circle cx="15.5" cy="10" r="1.2"/><path d="M12 20.5c-1.5 0-2-1.2-2-2.2 0-1.5 2-1.5 2-3"/>');
const STOOLS=[['terreno','Pincel de terreno',I.brush,'B','Terreno'],['costa','Costa y agua',ICOAST,'C','Costa'],['objetos','Objetos',ITREE,'O','Objetos'],['caminos','Ríos, caminos y muros',IPATH,'P','Trazos'],['texto','Texto',I.label,'T','Texto'],['marcador','Marcadores',I.pin,'M','Lugares'],['seleccion','Seleccionar y mover',ICURSOR,'V','Elegir'],['medir','Medir distancias',I.ruler,'R','Medir'],['mano','Mover la vista',I.hand,'H','Vista']];
const LAYERS=[['fondo','Fondo'],['costa','Costa'],['terreno','Terreno'],['caminos','Caminos y ríos'],['objetos','Objetos'],['luces','Luces'],['texto','Texto'],['cuadricula','Cuadrícula'],['efectos','Efectos'],['marcadores','Marcadores']];
const lvTex=m=>Object.keys(TEX).filter(k=>SB.allTex||TEX[k].lv.includes(LVK(m).L));
const curTex=()=>{ const m=SD.map, L=m.level; let t=SB.tex[L]; if(!TEX[t]) t=SB.tex[L]=LVK(m).tex; return t; };
const lvStamps=m=>Object.values(STAMPS).filter(d=>d.side===!!LVK(m).side);
const lvScatter=m=>Object.entries(SCATTER).filter(([k,d])=>!!d.side===!!LVK(m).side);
const curStamp=()=>{ const m=SD.map; let id=SB.stamp[m.level]; const ok=id&&(STAMPS[id]&&STAMPS[id].side===!!LVK(m).side||SCATTER[id]&&!!SCATTER[id].side===!!LVK(m).side); if(!ok) id=SB.stamp[m.level]=LVK(m).side?'montana':'arbol_t'; return SCATTER[id]?SCATTER[id].ids[0]:id; };
const defSize=id=>{ const d=STAMPS[id], m=SD.map; return d.side?d.sz*LVK(m).mul:d.sz*m.grid.size; };
const lvPaths=m=>Object.keys(PATHS).filter(k=>PATHS[k].lv.includes(LVK(m).L));
const curPath=()=>{ const m=SD.map; let t=SB.path[m.level]; if(!PATHS[t]||!PATHS[t].lv.includes(LVK(m).L)) t=SB.path[m.level]=lvPaths(m)[0]; return t; };
const curPW=()=>{ const t=curPath(); return pathWidth(SD.map,t)*(SB.pw[t]||1); };
const pinKind=()=>{ const m=SD.map, ks=pinKinds(m); let k=SB.pin[m.level]; if(!ks.some(x=>x[0]===k)) k=SB.pin[m.level]=ks[ks.length-1][0]; return k; };
const SPRT={}; const stampThumb=id=>SPRT[id]||(SPRT[id]=stampSprite(id,0,128).toDataURL());
const coastWords=m=>({mar:['Tierra','Agua'],roca:['Excavar','Roca'],pergamino:['Tierra','Papel'],lava:['Tierra','Lava'],vacio:['Tierra','Vacío']}[m.bg]||['Tierra','Agua']);

/* ---------- Galería ---------- */
function studioGallery(v){ v.className='view'; const lvF=SB.gal||'todos'; const all=Store.list('maps').filter(m=>(m.plane||'material')===curPlane);
 const list=all.filter(m=>lvF==='todos'||m.level===lvF).sort((a,b)=>(b.updated||0)-(a.updated||0));
 v.innerHTML=`<div class="wrap stg"><div class="stg-head"><div><span class="eyebrow">${esc(planeById(curPlane).name)}</span><h1 class="h1">Estudio de mapas</h1><p class="muted">Pinta continentes, reinos, campos de batalla y mazmorras con pinceles de textura, costas automáticas, cientos de objetos ilustrados y tipografías de cartógrafo.</p></div>
  <button class="btn pri" id="stNew">${I.plus} Nuevo mapa</button></div>
  <div class="row" style="gap:6px;margin:6px 0 18px">${[['todos','Todos'],...Object.entries(SLV).map(([k,l])=>[k,l.n])].map(([k,n])=>`<span class="chip ${lvF===k?'on':''}" data-gl="${k}">${n} <small class="muted">${k==='todos'?all.length:all.filter(m=>m.level===k).length}</small></span>`).join('')}</div>
  <div class="stg-grid">${`<button class="stg-card stg-new" id="stNew2"><span>${I.plus}</span><b>Nuevo mapa</b><small>Global, nacional, mínimo o mazmorra</small></button>`+list.map(m=>`<div class="stg-card" data-open="${m.id}" tabindex="0">
   <div class="stg-img">${m.thumb?`<img alt="" src="${m.thumb}">`:m.v?'':`<img alt="" src="${thumb(m)}" style="image-rendering:pixelated">`}</div>
   <div class="stg-meta"><b>${esc(m.name)}</b><small>${esc((SLV[m.level]||{n:m.level}).n)}${m.parent&&Store.get('maps',m.parent)?' · en '+esc(Store.get('maps',m.parent).name):''}${m.v?'':' · <span class="tag">Clásico</span>'}</small></div></div>`).join('')}</div></div>`;
 $$('[data-gl]',v).forEach(c=>c.onclick=()=>{ SB.gal=c.dataset.gl; sbSave(); studioGallery(v); });
 $('#stNew',v).onclick=$('#stNew2',v).onclick=()=>newStudioMap();
 $$('[data-open]',v).forEach(c=>{ const go=()=>openStudio(c.dataset.open); c.onclick=go; c.onkeydown=e=>{ if(e.key==='Enter') go(); }; });
}
function openStudio(id){ const m=Store.get('maps',id); if(!m) return; if(!m.v){ MS.classic=true; MS.open=id; MS.level=m.level; render(true); return; } SD.openId=id; lsSet('oz:stOpen',id); render(true); }
function closeStudio(){ flushStudio(); SD.openId=null; lsSet('oz:stOpen',null); render(true); }
function flushStudio(){ if(!SD.map) return; clearTimeout(SD.saveT); clearTimeout(SD.terrT); const m=SD.map, c=SD.terr; makeThumb(); clearTimeout(SD.saveT); Store.put('maps',m); if(c) c.toBlob(b=>{ if(b) IDB.set(m.id,b,'maps'); },'image/webp',.92); }

function newStudioMap(parent,fromPin){ const lv0=parent?(childFor(parent.level,fromPin&&fromPin.kind)||'minimo'):(SB.gal&&SLV[SB.gal]?SB.gal:'global');
 const md=modal({title:'Nuevo mapa',body:`<div class="st-lvcards">${Object.entries(SLV).map(([k,l])=>`<label class="st-lvc"><input type="radio" name="level" value="${k}" ${k===lv0?'checked':''}><span><b>${l.n}</b><small>${l.desc}</small></span></label>`).join('')}</div>
  <div class="grid2">${fld('Nombre','name',fromPin?.name||'')}${sel('Tamaño','size','m',[['s','Pequeño'],['m','Mediano'],['l','Grande']])}</div>
  <div class="grid2">${sel('Empezar con','start','gen',[['gen','Un terreno generado (recomendado)'],['blank','Lienzo en blanco']])}${sel('Fondo','bg','auto',[['auto','Según el nivel'],...Object.entries(BGS).map(([k,b])=>[k,b.n])])}</div>
  <p class="muted" style="margin:0;font-size:.86rem">Se crea en ${esc(planeById(curPlane).name)}. Todo se puede repintar después.</p>`,
  foot:`<button class="btn" data-c>Cancelar</button><button class="btn pri" data-s>${I.plus} Crear mapa</button>`});
 $('[data-c]',md.el).onclick=md.close;
 $('[data-s]',md.el).onclick=async()=>{ const f=vals(md.el), level=$('input[name=level]:checked',md.el).value, L=SLV[level], k={s:.7,m:1,l:1.35}[f.size]||1;
  const m={id:'map-'+uid(),v:2,name:f.name||({global:'Mundo conocido',nacional:'Nueva región',minimo:'Nuevo encuentro',mazmorra:'Nueva mazmorra'}[level]),level,plane:curPlane,w:Math.round(L.W*k),h:Math.round(L.H*k),bg:f.bg==='auto'?L.bg:f.bg,
   grid:{on:true,type:L.grid.type,size:L.grid.size,op:L.grid.op},scale:L.scale,unit:L.unit,fx:{look:'natural',vig:.35,paper:level==='global'?.25:0,frame:level==='global'?'ornado':'none',dark:level==='mazmorra'?.5:0},layers:{},stamps:[],paths:[],labels:[],pins:[],parent:parent?.id||null,created:Date.now()};
  if(level==='minimo'||level==='mazmorra'){ m.w=Math.round(m.w/L.grid.size)*L.grid.size; m.h=Math.round(m.h/L.grid.size)*L.grid.size; }
  md.close(); SD.map=m; newTerrain(m); if(f.start==='gen') await stGenerate(m,true); else if(level==='minimo'){ fillAll(LVK(m).tex); SD.undo=[]; SD.upx=0; }
  computeCoast(); makeThumb(); Store.put('maps',m); await new Promise(r=>SD.terr.toBlob(b=>{ IDB.set(m.id,b,'maps').then(r); },'image/webp',.92));
  if(fromPin&&parent){ fromPin.link=m.id; Store.put('maps',parent); }
  SD.map=null; SD.openId=m.id; lsSet('oz:stOpen',m.id); counts(); render(true); toast(`Mapa "${m.name}" creado.`); };
}

/* ---------- Editor ---------- */
function studioEditor(v,id){ const m=Store.get('maps',id); v.className='view full'; if(SD.panelOpen===undefined&&innerWidth<900) SD.panelOpen=false;
 if(SD.map!==m){ SD.map=m; SD.undo=[]; SD.redo=[]; SD.upx=0; SD.sel=null; SD.fitted=false; m.stamps=m.stamps||[]; m.paths=m.paths||[]; m.labels=m.labels||[]; m.pins=m.pins||[]; m.fx=m.fx||{}; m.layers=m.layers||{}; m.grid=m.grid||{on:true,type:'sq',size:64,op:.3}; loadTerrain(m); }
 v.innerHTML=`<div class="studio" id="studio">
  <header class="st-top"><button class="btn ghost sm" id="stBack" title="Volver a tus mapas">${I.back}<span class="hide-s">Mapas</span></button><div class="st-crumbs" id="stCrumbs"></div>
   <input class="st-name" id="stName" value="${esc(m.name)}" aria-label="Nombre del mapa"><span class="st-lv">${LVK(m).n}</span><div style="flex:1"></div>
   <button class="btn icon ghost" id="stU" title="Deshacer (Ctrl+Z)" aria-label="Deshacer">${I.undo}</button><button class="btn icon ghost" id="stR" title="Rehacer (Ctrl+Y)" aria-label="Rehacer"><span style="display:inline-flex;transform:scaleX(-1)">${I.undo}</span></button>
   <div class="st-zoom"><button class="btn icon ghost" id="stZo" aria-label="Alejar">−</button><button class="st-zv" id="stZv" title="Ajustar a la pantalla">100%</button><button class="btn icon ghost" id="stZi" aria-label="Acercar">${I.plus}</button></div>
   <button class="btn icon ghost st-ptog" id="stPT" title="Panel" aria-label="Mostrar panel">${I.layers}</button>
   <button class="btn pri sm" id="stExp">${I.down}<span class="hide-s">Exportar</span></button></header>
  <nav class="st-rail" id="stRail">${STOOLS.map(([k,n,ico,key,sh])=>`<button class="st-tool ${SB.tool===k?'on':''}" data-tool="${k}" title="${n} (${key})" aria-label="${n}">${ico}<span>${sh}</span></button>`).join('')}</nav>
  <div class="st-stage" id="stStage"><canvas id="stCv" aria-label="Lienzo del mapa"></canvas><div class="st-hint" id="stHint"></div><div class="st-status" id="stStatus"></div><div class="st-load" id="stLoad" hidden>Cargando lienzo…</div></div>
  <aside class="st-panel ${SD.panelOpen===false?'closed':''}" id="stPanel"><div class="st-tabs">${[['tool','Herramienta'],['style','Estilo'],['layers','Capas']].map(([k,n])=>`<button data-tab="${k}" class="${SD.tab===k?'on':''}">${n}</button>`).join('')}</div><div class="st-pbody" id="stPB"></div></aside></div>`;
 const cv=$('#stCv'); SD.cv=cv; SD.ctx=cv.getContext('2d');
 const resize=()=>{ SD.dpr=Math.min(devicePixelRatio||1,2); cv.width=Math.max(1,cv.clientWidth*SD.dpr); cv.height=Math.max(1,cv.clientHeight*SD.dpr); if(!SD.fitted){ stFit(); SD.fitted=true; } draw(); };
 const ro=new ResizeObserver(resize); ro.observe($('#stStage'));
 stCrumbs(); stPanel(); stUpdUndo(); stHint();
 $('#stBack').onclick=closeStudio; $('#stU').onclick=stUndo; $('#stR').onclick=stRedo; $('#stExp').onclick=()=>exportDialog();
 $('#stZi').onclick=()=>zoomBy(1.25); $('#stZo').onclick=()=>zoomBy(.8); $('#stZv').onclick=stFit;
 $('#stPT').onclick=()=>{ SD.panelOpen=$('#stPanel').classList.toggle('closed')?false:true; setTimeout(resize,260); };
 $('#stName').oninput=e=>{ m.name=e.target.value||'Sin nombre'; saveDoc(); };
 $('#stRail').onclick=e=>{ const b=e.target.closest('[data-tool]'); if(b) setStTool(b.dataset.tool); };
 $$('[data-tab]').forEach(b=>b.onclick=()=>{ SD.tab=b.dataset.tab; $$('[data-tab]').forEach(x=>x.classList.toggle('on',x===b)); stPanel(); if(SD.panelOpen===false){ SD.panelOpen=true; $('#stPanel').classList.remove('closed'); } });
 bindCanvas(cv);
 const key=e=>stKey(e); document.addEventListener('keydown',key); document.addEventListener('keyup',key);
 const unsub=Store.on((c,o)=>{ if(c==='maps'&&o==='remote'){ const cur=Store.get('maps',id); if(!cur){ SD.map=null; SD.openId=null; render(true); } } });
 const fl=()=>{ for(const [f] of FONTS) document.fonts&&document.fonts.load(`20px "${f}"`).then(()=>draw()).catch(()=>{}); }; fl();
 cleanup=()=>{ ro.disconnect(); unsub(); document.removeEventListener('keydown',key); document.removeEventListener('keyup',key); flushStudio(); SD.cv=null; SD.ctx=null; closeStPop(); if(SD.raf){ cancelAnimationFrame(SD.raf); SD.raf=0; } SD.map=null; };
}
function stCrumbs(){ const el=$('#stCrumbs'); if(!el) return; const chain=[]; let m=SD.map&&SD.map.parent&&Store.get('maps',SD.map.parent), g=0; while(m&&g++<5){ chain.unshift(m); m=m.parent&&Store.get('maps',m.parent); }
 el.innerHTML=chain.map(c=>`<button data-cr="${c.id}">${esc(c.name)}</button><span class="muted">›</span>`).join(''); el.onclick=e=>{ const b=e.target.closest('[data-cr]'); if(b){ flushStudio(); openStudio(b.dataset.cr); } }; }
function stUpdUndo(){ const u=$('#stU'), r=$('#stR'); if(u) u.disabled=!SD.undo.length; if(r) r.disabled=!SD.redo.length; }
function setStTool(t){ SB.tool=t; sbSave(); SD.sel=null; SD.ruler=null; closeStPop(); $$('.st-tool').forEach(b=>b.classList.toggle('on',b.dataset.tool===t)); SD.tab='tool'; $$('[data-tab]').forEach(x=>x.classList.toggle('on',x.dataset.tab==='tool')); stPanel(); stHint(); draw(); }
const HINTS={terreno:'Arrastra para pintar la textura. Clic derecho o Alt borra la tierra. [ y ] cambian el tamaño.',costa:'Pinta tierra o agua. La costa, las olas y los muros se dibujan solos al soltar.',objetos:'Clic para colocar. En modo pincel, arrastra para sembrar bosques o montañas.',caminos:'Arrastra para trazar. La línea se suaviza sola.',texto:'Clic en el mapa para escribir un nombre. Edita su estilo en el panel.',marcador:'Clic para poner un marcador con notas o un submapa.',seleccion:'Clic para elegir. Arrastra para mover, usa las asas para girar y escalar. Supr borra, Ctrl+D duplica.',medir:'Arrastra para medir distancias.',mano:'Arrastra para mover la vista. Rueda o pellizco para el zoom.'};
function stHint(){ const h=$('#stHint'); if(!h) return; h.textContent=HINTS[SB.tool]||''; h.classList.remove('show'); void h.offsetWidth; h.classList.add('show'); }
function stFit(){ const m=SD.map, cv=SD.cv; if(!m||!cv) return; const W=cv.clientWidth, H=cv.clientHeight, z=Math.min((W-40)/m.w,(H-40)/m.h); SD.view={z,x:(W-m.w*z)/2,y:(H-m.h*z)/2}; zoomLabel(); draw(); }
function stZoomAt(sx,sy,f){ const v=SD.view, nz=clamp(v.z*f,.05,6); SD.view={z:nz,x:sx-(sx-v.x)*nz/v.z,y:sy-(sy-v.y)*nz/v.z}; zoomLabel(); draw(); }
function zoomBy(f){ const cv=SD.cv; stZoomAt(cv.clientWidth/2,cv.clientHeight/2,f); }
function zoomLabel(){ const z=$('#stZv'); if(z) z.textContent=Math.round(SD.view.z*100)+'%'; }
function status(p){ const s=$('#stStatus'); if(!s||!SD.map) return; const m=SD.map; s.textContent=p?`${Math.round(p.x/m.grid.size)}, ${Math.round(p.y/m.grid.size)} · 1 casilla = ${m.scale} ${m.unit}`:`1 casilla = ${m.scale} ${m.unit}`; }

/* ---------- Lienzo: punteros ---------- */
function wpt(e){ const r=SD.cv.getBoundingClientRect(), sx=e.clientX-r.left, sy=e.clientY-r.top; return {sx,sy,x:(sx-SD.view.x)/SD.view.z,y:(sy-SD.view.y)/SD.view.z}; }
function bindCanvas(cv){
 cv.addEventListener('contextmenu',e=>e.preventDefault());
 cv.addEventListener('pointerdown',e=>{ if(!SD.map||SD.loading) return; try{ cv.setPointerCapture(e.pointerId); }catch(_){} const p=wpt(e); SD.ptrs.set(e.pointerId,p); closeStPop();
  if(SD.ptrs.size===2){ const [a,b]=[...SD.ptrs.values()]; if(SD.stroke){ const st=SD.stroke; SD.stroke=null; SD.tg.save(); SD.tg.globalCompositeOperation='copy'; SD.tg.drawImage(SD.before,0,0); SD.tg.restore(); } SD.draft=null;
   SD.pinch={d:Math.hypot(a.sx-b.sx,a.sy-b.sy),cx:(a.sx+b.sx)/2,cy:(a.sy+b.sy)/2,v:{...SD.view}}; SD.drag=null; draw(); return; }
  const t=SB.tool, pan=e.button===1||SD.space||t==='mano';
  if(pan){ SD.drag={mode:'pan',sx:p.sx,sy:p.sy,vx:SD.view.x,vy:SD.view.y}; cv.style.cursor='grabbing'; return; }
  const m=SD.map;
  if(t==='terreno'){ strokeBegin(SB.erase||e.button===2||e.altKey,curTex()); strokeTo(p.x,p.y); SD.drag={mode:'paint'}; }
  else if(t==='costa'){ const land=SB.coastLand&&e.button!==2&&!e.altKey; strokeBegin(!land,curTex()); strokeTo(p.x,p.y); SD.drag={mode:'paint'}; }
  else if(t==='objetos'){ if(SB.smode==='place') SD.drag={mode:'place',sx:p.sx,sy:p.sy}; else { SD.drag={mode:SB.smode==='erase'?'serase':'scatter',b:vecSnap(),last:null}; (SB.smode==='erase'?stampErase:scatterAt)(p); } }
  else if(t==='caminos'){ SD.draft={t:curPath(),w:curPW(),pts:[[p.x,p.y]]}; SD.drag={mode:'path'}; }
  else if(t==='texto'){ const h=hitAt(p.x,p.y); if(h&&h.type==='label'){ SD.sel=h; SD.drag={mode:'move',b:vecSnap(),ox:p.x-h.o.x,oy:p.y-h.o.y}; } else { const b=vecSnap(), T=SB.text; const l={id:uid(),x:p.x,y:p.y,text:'Nuevo nombre',font:T.font,size:Math.round(T.size*(LVK(m).side?1:m.grid.size/64)),color:T.color,halo:T.halo,hc:T.hc,sp:T.sp,curve:T.curve,up:T.up,it:T.it,r:0};
    m.labels.push(l); SD.sel={type:'label',o:l}; vecCommit(b); setTimeout(()=>{ const i=$('#lbTxt'); if(i){ i.focus(); i.select(); } },40); } stPanel(); }
  else if(t==='marcador'){ const h=hitAt(p.x,p.y); if(h&&h.type==='pin'){ SD.sel=h; SD.drag={mode:'move',b:vecSnap(),ox:p.x-h.o.x,oy:p.y-h.o.y,pop:true,sx:p.sx,sy:p.sy}; } else { const b=vecSnap(); const k={id:uid(),x:p.x,y:p.y,kind:pinKind(),name:'',note:'',link:null}; m.pins.push(k); vecCommit(b); SD.sel={type:'pin',o:k}; pinPop(k,p,true); } }
  else if(t==='seleccion'){ const hh=handleAt(p); if(hh){ SD.drag=Object.assign({b:vecSnap()},hh); }
   else { const h=hitAt(p.x,p.y); if(h){ SD.sel=h; const o=h.o; SD.drag={mode:'move',b:vecSnap(),ox:p.x-(o.x??0),oy:p.y-(o.y??0),last:p,pop:h.type==='pin',sx:p.sx,sy:p.sy}; } else { SD.sel=null; SD.drag={mode:'pan',sx:p.sx,sy:p.sy,vx:SD.view.x,vy:SD.view.y}; } stPanel(); } }
  else if(t==='medir'){ SD.ruler={a:p,b:p}; SD.drag={mode:'ruler'}; }
  draw(); });
 cv.addEventListener('pointermove',e=>{ if(!SD.map) return; const p=wpt(e); if(SD.ptrs.has(e.pointerId)) SD.ptrs.set(e.pointerId,p);
  if(SD.pinch&&SD.ptrs.size===2){ const [a,b]=[...SD.ptrs.values()], d=Math.hypot(a.sx-b.sx,a.sy-b.sy), cx=(a.sx+b.sx)/2, cy=(a.sy+b.sy)/2, pv=SD.pinch.v, nz=clamp(pv.z*d/SD.pinch.d,.05,6);
   SD.view={z:nz,x:cx-(SD.pinch.cx-pv.x)*nz/pv.z,y:cy-(SD.pinch.cy-pv.y)*nz/pv.z}; zoomLabel(); draw(); return; }
  SD.hover=p; status(p); const d=SD.drag;
  if(d){ if(d.mode==='pan'){ SD.view.x=d.vx+p.sx-d.sx; SD.view.y=d.vy+p.sy-d.sy; }
   else if(d.mode==='paint') strokeTo(p.x,p.y);
   else if(d.mode==='scatter') scatterAt(p);
   else if(d.mode==='serase') stampErase(p);
   else if(d.mode==='path'){ const L=SD.draft.pts[SD.draft.pts.length-1]; if(Math.hypot(p.x-L[0],p.y-L[1])>Math.max(4,10/SD.view.z)) SD.draft.pts.push([p.x,p.y]); }
   else if(d.mode==='ruler') SD.ruler.b=p;
   else if(d.mode==='move'&&SD.sel){ if(Math.hypot(p.sx-(d.sx??p.sx),p.sy-(d.sy??p.sy))>3) d.moved=true; const o=SD.sel.o; if(SD.sel.type==='path'){ const dx=p.x-d.last.x, dy=p.y-d.last.y; o.pts.forEach(q=>{ q[0]+=dx; q[1]+=dy; }); d.last=p; } else { o.x=p.x-d.ox; o.y=p.y-d.oy; } }
   else if(d.mode==='scale'&&SD.sel){ const o=SD.sel.o, r=Math.hypot(p.x-d.cx,p.y-d.cy)/Math.max(1,d.r0); if(SD.sel.type==='stamp') o.s=clamp(d.s0*r,4,6000); else o.size=clamp(Math.round(d.s0*r),6,600); }
   else if(d.mode==='rot'&&SD.sel){ let a=Math.atan2(p.y-d.cy,p.x-d.cx)+Math.PI/2; if(e.shiftKey) a=Math.round(a/(Math.PI/12))*(Math.PI/12); SD.sel.o.r=a; }
   draw(); }
  else if(['terreno','costa','objetos'].includes(SB.tool)) draw(); });
 const up=e=>{ SD.ptrs.delete(e.pointerId); if(SD.ptrs.size<2) SD.pinch=null; const d=SD.drag; SD.drag=null; cv.style.cursor=''; if(!d||!SD.map) return; const p=wpt(e), m=SD.map;
  if(d.mode==='paint') strokeEnd();
  else if(d.mode==='scatter'||d.mode==='serase') vecCommit(d.b);
  else if(d.mode==='place'){ if(Math.hypot(p.sx-d.sx,p.sy-d.sy)<6){ const b=vecSnap(); const sid=SB.stamp[m.level]; const id=SCATTER[sid]?SCATTER[sid].ids[(Math.random()*SCATTER[sid].ids.length)|0]:curStamp(); addStamp(id,p.x,p.y,SD.ghostV); SD.ghostV=(Math.random()*6)|0; vecCommit(b); } }
  else if(d.mode==='path'){ const dr=SD.draft; SD.draft=null; if(dr&&dr.pts.length>1){ const b=vecSnap(); const pts=simplify(dr.pts,Math.max(2,4/SD.view.z)); m.paths.push({id:uid(),t:dr.t,w:dr.w,pts}); vecCommit(b); } }
  else if(d.mode==='move'||d.mode==='scale'||d.mode==='rot'){ vecCommit(d.b); if(d.pop&&!d.moved&&SD.sel) pinPop(SD.sel.o,p); stPanel(); }
  draw(); };
 cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
 cv.addEventListener('pointerleave',()=>{ SD.hover=null; draw(); });
 cv.addEventListener('wheel',e=>{ if(!SD.map) return; e.preventDefault(); const p=wpt(e); if(e.ctrlKey||!e.shiftKey&&Math.abs(e.deltaY)>=Math.abs(e.deltaX)&&!(e.deltaMode===0&&Math.abs(e.deltaY)<4&&e.deltaX)) stZoomAt(p.sx,p.sy,Math.exp(-e.deltaY*(e.ctrlKey?.01:.0018)));
  else { SD.view.x-=e.deltaX; SD.view.y-=e.deltaY; draw(); } },{passive:false});
}
function simplify(pts,tol){ if(pts.length<3) return pts; const out=[pts[0]]; for(let i=1;i<pts.length-1;i++){ const L=out[out.length-1]; if(Math.hypot(pts[i][0]-L[0],pts[i][1]-L[1])>=tol*3) out.push(pts[i]); } out.push(pts[pts.length-1]); return out.map(p=>[Math.round(p[0]*10)/10,Math.round(p[1]*10)/10]); }
function addStamp(id,x,y,v){ const m=SD.map, d=STAMPS[id]; const s=defSize(id)*SB.smul*(1+(Math.random()*2-1)*SB.srand*.6);
 const st={id:uid(),k:id,x:Math.round(x),y:Math.round(y),s:Math.round(s),v:v??((Math.random()*6)|0),r:SB.srot?(d.side?(Math.random()-.5)*.3:Math.random()*Math.PI*2):0}; if(SB.sflip&&Math.random()<.5) st.f=1; m.stamps.push(st); return st; }
function scatterAt(p){ const d=SD.drag, m=SD.map; if(d.last&&Math.hypot(p.x-d.last.x,p.y-d.last.y)<SB.srad*.35) return; d.last={x:p.x,y:p.y};
 const sid=SB.stamp[m.level], ids=SCATTER[sid]?SCATTER[sid].ids:[curStamp()], n=1+Math.round(SB.dens*4), R=SB.srad/2;
 for(let i=0;i<n;i++){ const a=Math.random()*Math.PI*2, rr=Math.sqrt(Math.random())*R, x=p.x+Math.cos(a)*rr, y=p.y+Math.sin(a)*rr; if(x<0||y<0||x>m.w||y>m.h) continue; const id=ids[(Math.random()*ids.length)|0], sz=defSize(id)*SB.smul, md=sz*(LVK(m).side?.42:.55)*(1.25-SB.dens*.6);
  if(m.stamps.some(s=>Math.abs(s.x-x)<md&&Math.abs(s.y-y)<md*(LVK(m).side?.6:1))) continue; addStamp(id,x,y); } draw(); }
function stampErase(p){ const m=SD.map, R=SB.srad/2, n=m.stamps.length; m.stamps=m.stamps.filter(s=>Math.hypot(s.x-p.x,s.y-p.y)>R); if(m.stamps.length!==n) draw(); }
function distSeg(x,y,a,b){ const dx=b[0]-a[0], dy=b[1]-a[1], l=dx*dx+dy*dy||1, t=clamp(((x-a[0])*dx+(y-a[1])*dy)/l,0,1); return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy); }
function inBox(b,x,y,k=1){ const dx=x-b.cx, dy=y-b.cy, c=Math.cos(-b.r), s=Math.sin(-b.r), lx=dx*c-dy*s, ly=dx*s+dy*c; return Math.abs(lx)<=b.w/2*k&&Math.abs(ly)<=b.h/2*k; }
function hitAt(x,y){ const m=SD.map, z=SD.view.z;
 for(const p of m.pins.slice().reverse()){ const s=15/z; if(Math.abs(x-p.x)<s*.95&&y<p.y+3/z&&y>p.y-s*2.4) return {type:'pin',o:p}; }
 for(const l of m.labels.slice().reverse()) if(inBox(selBox({type:'label',o:l}),x,y)) return {type:'label',o:l};
 let best=null,ba=1e18; for(const st of m.stamps){ if(!STAMPS[st.k]) continue; const b=selBox({type:'stamp',o:st}); if(inBox(b,x,y,.8)){ const a=b.w*b.h; if(a<ba){ ba=a; best=st; } } } if(best) return {type:'stamp',o:best};
 for(const p of m.paths.slice().reverse()){ const pts=spOf(p); for(let i=1;i<pts.length;i++) if(distSeg(x,y,pts[i-1],pts[i])<Math.max(p.w/2,7/z)) return {type:'path',o:p}; }
 return null; }
function handleAt(p){ const s=SD.sel; if(!s||(s.type!=='stamp'&&s.type!=='label')) return null; const b=selBox(s), z=SD.view.z, c=Math.cos(b.r), sn=Math.sin(b.r), L=(lx,ly)=>({x:b.cx+lx*c-ly*sn,y:b.cy+lx*sn+ly*c});
 const sc=L(b.w/2,b.h/2), ro=L(0,-b.h/2-22/z); const o=s.o;
 if(Math.hypot(p.x-sc.x,p.y-sc.y)<10/z) return {mode:'scale',cx:b.cx,cy:b.cy,r0:Math.hypot(sc.x-b.cx,sc.y-b.cy),s0:s.type==='stamp'?o.s:o.size};
 if(Math.hypot(p.x-ro.x,p.y-ro.y)<10/z) return {mode:'rot',cx:o.x,cy:o.y};
 return null; }

/* ---------- Teclado ---------- */
function stKey(e){ if(route!=='mapas'||!SD.map||$('.modal-bg')||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
 if(e.code==='Space'){ SD.space=e.type==='keydown'; if(SD.space) e.preventDefault(); return; } if(e.type!=='keydown') return; const k=e.key.toLowerCase(), m=SD.map;
 if((e.ctrlKey||e.metaKey)&&(k==='y'||(k==='z'&&e.shiftKey))){ e.preventDefault(); stRedo(); return; }
 if((e.ctrlKey||e.metaKey)&&k==='z'){ e.preventDefault(); stUndo(); return; }
 if((e.ctrlKey||e.metaKey)&&k==='d'&&SD.sel){ e.preventDefault(); dupSel(); return; }
 if(e.ctrlKey||e.metaKey||e.altKey) return;
 if((e.key==='Delete'||e.key==='Backspace')&&SD.sel){ delSel(); return; }
 if(e.key==='Escape'){ SD.sel=null; closeStPop(); stPanel(); draw(); return; }
 if(e.key==='['||e.key===']'){ const f=e.key===']'?1.2:1/1.2; if(SB.tool==='objetos'&&SB.smode!=='place') SB.srad=clamp(SB.srad*f,10,1200); else SB.size=clamp(SB.size*f,4,800); sbSave(); stPanel(); draw(); return; }
 const t=STOOLS.find(x=>x[3].toLowerCase()===k); if(t) setStTool(t[0]); }
function delSel(){ const s=SD.sel, m=SD.map; if(!s) return; const b=vecSnap(); const col={stamp:'stamps',label:'labels',path:'paths',pin:'pins'}[s.type]; m[col]=m[col].filter(o=>o!==s.o); SD.sel=null; closeStPop(); vecCommit(b); stPanel(); draw(); }
function dupSel(){ const s=SD.sel, m=SD.map; if(!s) return; const b=vecSnap(); const col={stamp:'stamps',label:'labels',path:'paths',pin:'pins'}[s.type]; const o=clone(s.o); o.id=uid(); const off=20/SD.view.z;
 if(s.type==='path') o.pts=o.pts.map(p=>[p[0]+off,p[1]+off]); else { o.x+=off; o.y+=off; } m[col].push(o); SD.sel={type:s.type,o}; vecCommit(b); stPanel(); draw(); }

/* ---------- Marcadores ---------- */
let stPopEl=null;
function closeStPop(){ if(stPopEl){ stPopEl.remove(); stPopEl=null; } }
function pinPop(k,p,isNew){ closeStPop(); const m=SD.map, child=childFor(m.level,k.kind), linked=k.link&&Store.get('maps',k.link); const el=document.createElement('div'); el.className='pop st-pop';
 el.innerHTML=`<input class="inp" id="kn" placeholder="Nombre del lugar" value="${esc(k.name)}" aria-label="Nombre del lugar"><select class="sel" id="kk" aria-label="Tipo">${pinKinds(m).map(([v,t])=>`<option value="${v}" ${v===k.kind?'selected':''}>${t}</option>`).join('')}</select>
  <textarea class="inp" id="knote" rows="3" placeholder="Notas: quién vive aquí, qué esconde…" aria-label="Notas">${esc(k.note||'')}</textarea>
  ${child?(linked?`<button class="btn sm pri" id="kgo">${I.map} Abrir ${esc(linked.name)}</button>`:`<button class="btn sm" id="ksub">${I.plus} Crear mapa ${(SLV[child]||{n:''}).n.toLowerCase()} aquí</button>`):''}
  <div class="row" style="justify-content:space-between"><button class="btn sm danger" id="kdel">${I.trash} Quitar</button><button class="btn sm pri" id="kok">Listo</button></div>`;
 const st=$('#stStage'); st.append(el); const W=st.clientWidth,H=st.clientHeight; el.style.left=clamp(p.sx+16,8,W-el.offsetWidth-8)+'px'; el.style.top=clamp(p.sy-20,8,H-el.offsetHeight-8)+'px'; stPopEl=el; if(isNew) setTimeout(()=>$('#kn',el).focus(),30);
 const sync=()=>{ k.name=$('#kn',el).value; k.kind=$('#kk',el).value; k.note=$('#knote',el).value; saveDoc(600); draw(); };
 el.addEventListener('input',sync); el.addEventListener('change',sync); $('#kn',el).onkeydown=e=>{ if(e.key==='Enter') closeStPop(); };
 $('#kok',el).onclick=()=>{ sync(); closeStPop(); SD.sel=null; draw(); };
 $('#kdel',el).onclick=()=>{ const b=vecSnap(); m.pins=m.pins.filter(x=>x!==k); vecCommit(b); SD.sel=null; closeStPop(); draw(); };
 $('#kgo',el)?.addEventListener('click',()=>{ flushStudio(); openStudio(linked.id); });
 $('#ksub',el)?.addEventListener('click',()=>{ sync(); closeStPop(); flushStudio(); newStudioMap(m,k); }); }

/* ---------- Panel ---------- */
const slider=(id,label,val,min,max,step,fmt=v=>v)=>`<label class="st-sl"><span>${label}</span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"><b id="${id}V">${fmt(val)}</b></label>`;
const seg=(id,opts,cur)=>`<div class="st-seg" id="${id}">${opts.map(([k,n])=>`<button data-v="${k}" class="${String(cur)===String(k)?'on':''}">${n}</button>`).join('')}</div>`;
function bindSlider(id,fn,fmt=v=>v){ const i=$('#'+id); if(!i) return; i.oninput=()=>{ const v=+i.value; $('#'+id+'V').textContent=fmt(v); fn(v); }; }
function bindSeg(id,fn){ const s=$('#'+id); if(!s) return; s.onclick=e=>{ const b=e.target.closest('[data-v]'); if(!b) return; $$('button',s).forEach(x=>x.classList.toggle('on',x===b)); fn(b.dataset.v); }; }
function lazyThumbs(root){ const q=$$('[data-tx]',root).filter(el=>!el.style.backgroundImage); let i=0; const step=()=>{ if(!document.body.contains(root)) return; const t0=performance.now(); while(i<q.length&&performance.now()-t0<24){ const el=q[i++]; el.style.backgroundImage=`url(${texThumb(el.dataset.tx,el.dataset.bg==='1',112)})`; } if(i<q.length) setTimeout(step,0); }; step(); }
function stPanel(){ const pb=$('#stPB'); if(!pb||!SD.map) return; const m=SD.map; let h='';
 if(SD.tab==='layers'){ h=`<div class="st-sec"><span class="eyebrow">Capas visibles</span>${LAYERS.map(([k,n])=>`<label class="st-layer"><input type="checkbox" data-ly="${k}" ${m.layers[k]?'':'checked'}><span>${n}</span>${I.eye}</label>`).join('')}</div>
   <div class="st-sec"><span class="eyebrow">Contenido</span><p class="muted" style="margin:0;font-size:.88rem">${m.stamps.length} objetos · ${m.paths.length} trazos · ${m.labels.length} textos · ${m.pins.length} marcadores</p>
   <div class="row" style="gap:6px"><button class="btn sm" id="clrSt">${I.trash} Quitar objetos</button><button class="btn sm" id="clrPa">${I.trash} Quitar trazos</button></div></div>`; }
 else if(SD.tab==='style'){ const fx=m.fx, G=m.grid;
  h=`<div class="st-sec"><span class="eyebrow">Fondo</span><div class="st-tiles sm">${Object.entries(BGS).map(([k,b])=>`<button class="st-tile ${m.bg===k?'on':''}" data-bgk="${k}" data-tx="${k}" data-bg="1"><span>${b.n}</span></button>`).join('')}</div></div>
   <div class="st-sec"><span class="eyebrow">Aspecto</span><div class="st-chips">${Object.entries(LOOKS).map(([k,[n]])=>`<button class="chip ${(fx.look||'natural')===k?'on':''}" data-look="${k}">${n}</button>`).join('')}</div>
    ${slider('fxVig','Viñeta',fx.vig||0,0,1,.05,v=>Math.round(v*100)+'%')}${slider('fxPap','Textura de papel',fx.paper||0,0,1,.05,v=>Math.round(v*100)+'%')}${slider('fxDark','Oscuridad (las luces la atraviesan)',fx.dark||0,0,.95,.05,v=>Math.round(v*100)+'%')}
    ${slider('fxDep','Degradado del agua',fx.depth??120,0,400,10,v=>v+' px')}
    <label class="st-check"><input type="checkbox" id="fxRings" ${fx.rings!==false?'checked':''}> Ondas en la costa</label><label class="st-check"><input type="checkbox" id="fxBeach" ${fx.beach!==false?'checked':''}> Borde de playa</label><label class="st-check"><input type="checkbox" id="fxTint" ${fx.tint!==false?'checked':''}> Tono del plano (${esc(planeById(m.plane||'material').name)})</label>
    <span class="st-lab">Marco</span>${seg('fxFrame',[['none','Sin marco'],['fino','Fino'],['ornado','Ornamentado']],fx.frame||'none')}</div>
   <div class="st-sec"><span class="eyebrow">Cuadrícula y escala</span><label class="st-check"><input type="checkbox" id="gOn" ${G.on?'checked':''}> Mostrar cuadrícula</label>${seg('gType',[['sq','Cuadrada'],['hex','Hexagonal']],G.type)}
    ${slider('gSize','Tamaño de casilla',G.size,16,200,2,v=>v+' px')}${slider('gOp','Opacidad',G.op,.05,1,.05,v=>Math.round(v*100)+'%')}
    <div class="row" style="gap:6px;flex-wrap:nowrap"><small class="muted" style="white-space:nowrap">1 casilla =</small><input class="inp mono" id="gScale" type="number" step="0.1" min="0.1" value="${m.scale}" style="width:84px"><select class="sel" id="gUnit" style="width:auto">${['m','km','millas','pies'].map(u=>`<option ${u===m.unit?'selected':''}>${u}</option>`).join('')}</select></div></div>
   <div class="st-sec"><span class="eyebrow">Este mapa</span><select class="sel" id="mPlane" aria-label="Plano">${PLANES.map(p=>`<option value="${p.id}" ${p.id===(m.plane||'material')?'selected':''}>${p.name}</option>`).join('')}</select>
    <div class="row" style="gap:6px"><button class="btn sm" id="mGen">${I.wand} Generar de nuevo</button><button class="btn sm danger" id="mDel">${I.trash} Eliminar</button></div><small class="muted">Lienzo de ${m.w} × ${m.h} px · ${Math.round(m.w/G.size)} × ${Math.round(m.h/G.size)} casillas</small></div>`; }
 else h=toolPanel(m);
 pb.innerHTML=h; bindPanel(pb); lazyThumbs(pb); }
function toolPanel(m){ const t=SB.tool;
 if(t==='terreno'||t==='costa'){ const cw=coastWords(m), tx=lvTex(m);
  return `<div class="st-sec"><span class="eyebrow">${t==='costa'?'Costa y agua':'Pincel de terreno'}</span>
   ${t==='costa'?seg('cMode',[['1',`Pintar ${cw[0].toLowerCase()}`],['0',`Pintar ${cw[1].toLowerCase()}`]],SB.coastLand?'1':'0'):seg('tMode',[['0','Pintar'],['1','Borrar tierra']],SB.erase?'1':'0')}
   <div class="st-brush"><canvas id="bPrev" width="120" height="120"></canvas><div style="flex:1;min-width:0">${slider('bSize','Tamaño',SB.size,4,800,2,v=>v+' px')}${slider('bSoft','Dureza',SB.soft,0,1,.05,v=>Math.round(v*100)+'%')}</div></div>
   ${slider('bOp','Opacidad',SB.op,.05,1,.05,v=>Math.round(v*100)+'%')}${slider('bRough','Borde irregular',SB.rough,0,1,.05,v=>Math.round(v*100)+'%')}</div>
   <div class="st-sec"><div class="row" style="justify-content:space-between"><span class="eyebrow">Texturas</span><label class="st-check sm"><input type="checkbox" id="allTex" ${SB.allTex?'checked':''}> Todas</label></div>
   <div class="st-tiles">${tx.map(k=>`<button class="st-tile ${curTex()===k?'on':''}" data-tex="${k}" data-tx="${k}"><span>${TEX[k].n}</span></button>`).join('')}</div>
   <div class="row" style="gap:6px"><button class="btn sm" id="fillAll" title="Cubre todo el mapa con esta textura">${I.fill} Rellenar todo</button><button class="btn sm" id="fillLand" title="Cambia la textura de toda la tierra ya pintada">${I.brush} Recolorear tierra</button></div></div>`; }
 if(t==='objetos'){ const cats=[...new Set(lvStamps(m).map(d=>d.cat))], cat=SB.cat[m.level]&&cats.includes(SB.cat[m.level])?SB.cat[m.level]:'todo', sel=SB.stamp[m.level];
  const items=lvStamps(m).filter(d=>cat==='todo'||d.cat===cat);
  return `<div class="st-sec"><span class="eyebrow">Objetos</span>${seg('sMode',[['place','Colocar'],['scatter','Pincel'],['erase','Borrar']],SB.smode)}
   ${slider('sMul','Tamaño',SB.smul,.2,4,.05,v=>Math.round(v*100)+'%')}${slider('sRand','Variación de tamaño',SB.srand,0,1,.05,v=>Math.round(v*100)+'%')}
   ${SB.smode!=='place'?slider('sRad','Radio del pincel',SB.srad,10,1200,5,v=>v+' px')+(SB.smode==='scatter'?slider('sDens','Densidad',SB.dens,0,1,.05,v=>Math.round(v*100)+'%'):''):''}
   <div class="row" style="gap:12px"><label class="st-check"><input type="checkbox" id="sRot" ${SB.srot?'checked':''}> Giro al azar</label><label class="st-check"><input type="checkbox" id="sFlip" ${SB.sflip?'checked':''}> Espejar al azar</label></div></div>
   <div class="st-sec"><div class="st-chips">${[['todo','Todo'],...cats.map(c=>[c,STAMP_CATS[c]])].map(([k,n])=>`<button class="chip ${cat===k?'on':''}" data-cat="${k}">${n}</button>`).join('')}</div>
   <div class="st-stamps">${(cat==='todo'||cat==='vegetacion'||cat==='naturaleza'||cat==='montanas')?lvScatter(m).map(([k,d])=>`<button class="st-st ${sel===k?'on':''}" data-stamp="${k}" title="${d.n}"><img alt="" src="${stampThumb(d.ids[0])}"><i>pincel</i><span>${d.n}</span></button>`).join(''):''}
    ${items.map(d=>`<button class="st-st ${sel===d.id?'on':''}" data-stamp="${d.id}" title="${d.n}"><img alt="" src="${stampThumb(d.id)}"><span>${d.n}</span></button>`).join('')}</div></div>`; }
 if(t==='caminos') return `<div class="st-sec"><span class="eyebrow">Tipo de trazo</span><div class="st-paths">${lvPaths(m).map(k=>`<button class="st-pa ${curPath()===k?'on':''}" data-path="${k}"><canvas width="120" height="34" data-pv="${k}"></canvas><span>${PATHS[k].n}</span></button>`).join('')}</div>
   ${slider('pW','Grosor',SB.pw[curPath()]||1,.3,4,.05,v=>Math.round(v*100)+'%')}<p class="muted" style="font-size:.85rem;margin:0">Los ríos se ensanchan hacia la desembocadura: trázalos desde el nacimiento hasta el mar.</p></div>`;
 if(t==='texto'){ const s=SD.sel&&SD.sel.type==='label'?SD.sel.o:null, T=s||SB.text;
  return `<div class="st-sec"><span class="eyebrow">${s?'Texto seleccionado':'Estilo del próximo texto'}</span>${s?`<textarea class="inp" id="lbTxt" rows="2" aria-label="Texto">${esc(s.text)}</textarea>`:'<p class="muted" style="margin:0;font-size:.88rem">Haz clic en el mapa para escribir.</p>'}
   <div class="st-fonts">${FONTS.map(([f,n,it])=>`<button class="st-font ${T.font===f?'on':''}" data-font="${f}" style="font-family:'${f}';${it?'font-style:italic':''}">${esc(n)}</button>`).join('')}</div>
   ${slider('lSize','Tamaño',T.size,8,300,1,v=>v+' px')}${slider('lSp','Espaciado',T.sp||0,-2,40,1)}${slider('lCurve','Curva',T.curve||0,-1,1,.05,v=>Math.round(v*100)+'%')}
   <div class="st-colors">${['#2a2018','#f3ead6','#7a1f36','#1d3c63','#3b5a2a','#6b4a2e','#b8862e','#ffffff'].map(c=>`<button class="st-col ${T.color===c?'on':''}" data-col="${c}" style="background:${c}" aria-label="Color ${c}"></button>`).join('')}<input type="color" id="lColor" value="${T.color||'#2a2018'}" aria-label="Otro color"></div>
   <div class="row" style="gap:12px"><label class="st-check"><input type="checkbox" id="lUp" ${T.up?'checked':''}> Mayúsculas</label><label class="st-check"><input type="checkbox" id="lIt" ${T.it?'checked':''}> Cursiva</label><label class="st-check"><input type="checkbox" id="lHalo" ${T.halo?'checked':''}> Halo</label></div>
   ${s?`<div class="row" style="gap:6px"><button class="btn sm" id="selDup">${I.copy} Duplicar</button><button class="btn sm danger" id="selDel">${I.trash} Borrar</button></div>`:''}</div>`; }
 if(t==='marcador') return `<div class="st-sec"><span class="eyebrow">Tipo de marcador</span><div class="st-chips">${pinKinds(m).map(([k,n])=>`<button class="chip ${pinKind()===k?'on':''}" data-pin="${k}">${n}</button>`).join('')}</div>
   <p class="muted" style="font-size:.88rem;margin:0">Los marcadores guardan notas y pueden abrir un submapa (de global a nacional, de nacional a mínimo o mazmorra). No salen en la imagen exportada.</p></div>`;
 if(t==='seleccion'){ const s=SD.sel; if(!s) return `<div class="st-sec"><span class="eyebrow">Seleccionar</span><p class="muted" style="margin:0;font-size:.9rem">Haz clic en un objeto, texto, trazo o marcador. Arrastrar el fondo mueve la vista.</p>
   <div class="st-keys"><span><kbd>Supr</kbd> borrar</span><span><kbd>Ctrl D</kbd> duplicar</span><span><kbd>Mayús</kbd> girar de 15 en 15°</span><span><kbd>Esc</kbd> soltar</span></div></div>`;
  const o=s.o; const nm={stamp:STAMPS[o.k]?.n,label:'Texto',path:PATHS[o.t]?.n,pin:'Marcador'}[s.type];
  return `<div class="st-sec"><span class="eyebrow">${esc(nm||'')}</span>
   ${s.type==='stamp'?slider('oS','Tamaño',Math.round(o.s),4,Math.max(800,Math.round(o.s*2)),1,v=>v+' px')+slider('oR','Giro',Math.round((o.r||0)*180/Math.PI),-180,180,1,v=>v+'°')+slider('oO','Opacidad',o.o??1,.1,1,.05,v=>Math.round(v*100)+'%')+`<div class="row" style="gap:6px"><button class="btn sm" id="oFlip">Espejar</button><button class="btn sm" id="oVar">Otra variante</button></div>`:''}
   ${s.type==='path'?slider('oW','Grosor',Math.round(o.w*10)/10,1,Math.max(60,o.w*3),.5,v=>v+' px')+`<select class="sel" id="oT">${lvPaths(SD.map).map(k=>`<option value="${k}" ${k===o.t?'selected':''}>${PATHS[k].n}</option>`).join('')}</select>`:''}
   ${s.type==='label'?'<button class="btn sm" id="oEdit">Editar estilo del texto</button>':''}
   <div class="row" style="gap:6px">${s.type==='stamp'||s.type==='label'?`<button class="btn sm" id="oUp">Al frente</button><button class="btn sm" id="oDown">Atrás</button>`:''}<button class="btn sm" id="selDup">${I.copy} Duplicar</button><button class="btn sm danger" id="selDel">${I.trash} Borrar</button></div></div>`; }
 if(t==='medir') return `<div class="st-sec"><span class="eyebrow">Medir</span><p class="muted" style="margin:0;font-size:.9rem">Arrastra sobre el mapa. Cada casilla equivale a <b>${m.scale} ${m.unit}</b>${m.unit==='km'?'; los viajes se calculan a unos 38 km por día':''}. Cambia la escala en la pestaña Estilo.</p></div>`;
 return `<div class="st-sec"><span class="eyebrow">Mover la vista</span><p class="muted" style="margin:0;font-size:.9rem">Arrastra para desplazarte. La barra espaciadora activa esta herramienta desde cualquier otra.</p></div>`; }
function brushPreview(){ const c=$('#bPrev'); if(!c) return; const g=c.getContext('2d'); g.clearRect(0,0,120,120); const r=52, tmp=mkC(120,120), tg=tmp.getContext('2d');
 if(SB.tool==='costa'&&!SB.coastLand||SB.tool==='terreno'&&SB.erase){ tg.fillStyle=texPattern(tg,SD.map.bg,true); } else tg.fillStyle=texPattern(tg,curTex()); tg.fillRect(0,0,120,120);
 tg.globalCompositeOperation='destination-in'; const sv=SB.size; SB.size=r*2; tg.drawImage(dabMask(r),8,8,104,104); SB.size=sv; g.globalAlpha=SB.op; g.drawImage(tmp,0,0); g.globalAlpha=1; }
function drawPathPreviews(root){ $$('canvas[data-pv]',root).forEach(cv=>{ const g=cv.getContext('2d'), t=cv.dataset.pv; g.fillStyle=SD.map.level==='mazmorra'?'#6b6560':'#9aab66'; g.fillRect(0,0,120,34); const w=Math.min(14,pathWidth(SD.map,t)*(SD.map.grid.size>20&&LVK(SD.map).L>='d'?.3:1));
  const pts=[]; for(let x=6;x<=114;x+=12) pts.push([x,17+Math.sin(x/18)*7]); drawPath(g,{t,w:Math.max(3,Math.min(14,PATHS[t].w[LVK(SD.map).L]!=null&&(LVK(SD.map).L==='m'||LVK(SD.map).L==='d')?PATHS[t].w[LVK(SD.map).L]*18:PATHS[t].w.g*1.4||6)),pts},SD.map); }); }
function bindPanel(pb){ const m=SD.map, sv=()=>{ sbSave(); };
 brushPreview(); drawPathPreviews(pb);
 bindSeg('tMode',v=>{ SB.erase=v==='1'; sv(); brushPreview(); }); bindSeg('cMode',v=>{ SB.coastLand=v==='1'; sv(); brushPreview(); });
 bindSlider('bSize',v=>{ SB.size=v; sv(); },v=>v+' px'); bindSlider('bSoft',v=>{ SB.soft=v; sv(); brushPreview(); },v=>Math.round(v*100)+'%'); bindSlider('bOp',v=>{ SB.op=v; sv(); brushPreview(); },v=>Math.round(v*100)+'%'); bindSlider('bRough',v=>{ SB.rough=v; sv(); brushPreview(); },v=>Math.round(v*100)+'%');
 $$('[data-tex]',pb).forEach(b=>b.onclick=()=>{ SB.tex[m.level]=b.dataset.tex; sv(); $$('[data-tex]',pb).forEach(x=>x.classList.toggle('on',x===b)); brushPreview(); });
 $('#allTex',pb)?.addEventListener('change',e=>{ SB.allTex=e.target.checked; sv(); stPanel(); });
 $('#fillAll',pb)?.addEventListener('click',()=>confirmBox(`¿Cubrir todo el mapa con ${TEX[curTex()].n.toLowerCase()}? Puedes deshacerlo.`,()=>fillAll(curTex()),'Rellenar'));
 $('#fillLand',pb)?.addEventListener('click',()=>fillAll(curTex(),true));
 bindSeg('sMode',v=>{ SB.smode=v; sv(); stPanel(); draw(); }); bindSlider('sMul',v=>{ SB.smul=v; sv(); draw(); },v=>Math.round(v*100)+'%'); bindSlider('sRand',v=>{ SB.srand=v; sv(); },v=>Math.round(v*100)+'%'); bindSlider('sRad',v=>{ SB.srad=v; sv(); },v=>v+' px'); bindSlider('sDens',v=>{ SB.dens=v; sv(); },v=>Math.round(v*100)+'%');
 $('#sRot',pb)?.addEventListener('change',e=>{ SB.srot=e.target.checked; sv(); }); $('#sFlip',pb)?.addEventListener('change',e=>{ SB.sflip=e.target.checked; sv(); });
 $$('[data-cat]',pb).forEach(b=>b.onclick=()=>{ SB.cat[m.level]=b.dataset.cat; sv(); stPanel(); });
 $$('[data-stamp]',pb).forEach(b=>b.onclick=()=>{ const id=b.dataset.stamp; SB.stamp[m.level]=id; if(SCATTER[id]&&SB.smode==='place') SB.smode='scatter'; else if(!SCATTER[id]&&SB.smode==='erase') SB.smode='place'; if(!LVK(m).side&&!SCATTER[id]) SB.srot=!['puerta_t','escalera_t','cama_t','mesa_t','estanteria_t','altar_t','sarcofago_t','alfombra_t','carro_t','tienda_t'].includes(id); sv(); stPanel(); });
 $$('[data-path]',pb).forEach(b=>b.onclick=()=>{ SB.path[m.level]=b.dataset.path; sv(); stPanel(); }); bindSlider('pW',v=>{ SB.pw[curPath()]=v; sv(); },v=>Math.round(v*100)+'%');
 const L=SD.sel&&SD.sel.type==='label'?SD.sel.o:null, T=L||SB.text, setT=(k,v,redo)=>{ const b=L?vecSnap():null; T[k]=v; if(L){ vecCommit(b); draw(); } else sv(); if(redo) stPanel(); };
 $('#lbTxt',pb)?.addEventListener('input',e=>{ L.text=e.target.value; saveDoc(600); draw(); });
 $$('[data-font]',pb).forEach(b=>b.onclick=()=>{ setT('font',b.dataset.font); $$('[data-font]',pb).forEach(x=>x.classList.toggle('on',x===b)); });
 bindSlider('lSize',v=>{ T.size=v; L?(saveDoc(),draw()):sv(); },v=>v+' px'); bindSlider('lSp',v=>{ T.sp=v; L?(saveDoc(),draw()):sv(); }); bindSlider('lCurve',v=>{ T.curve=v; L?(saveDoc(),draw()):sv(); },v=>Math.round(v*100)+'%');
 $$('[data-col]',pb).forEach(b=>b.onclick=()=>{ setT('color',b.dataset.col); setT('hc',['#f3ead6','#ffffff'].includes(b.dataset.col)?'#1b140d':'#f3ead6'); $$('[data-col]',pb).forEach(x=>x.classList.toggle('on',x===b)); });
 $('#lColor',pb)?.addEventListener('input',e=>setT('color',e.target.value)); $('#lUp',pb)?.addEventListener('change',e=>setT('up',e.target.checked)); $('#lIt',pb)?.addEventListener('change',e=>setT('it',e.target.checked)); $('#lHalo',pb)?.addEventListener('change',e=>setT('halo',e.target.checked?1:0));
 $$('[data-pin]',pb).forEach(b=>b.onclick=()=>{ SB.pin[m.level]=b.dataset.pin; sv(); stPanel(); });
 const S=SD.sel, o=S&&S.o, ed=fn=>{ const b=vecSnap(); fn(); vecCommit(b); draw(); };
 bindSlider('oS',v=>{ o.s=v; saveDoc(); draw(); },v=>v+' px'); bindSlider('oR',v=>{ o.r=v*Math.PI/180; saveDoc(); draw(); },v=>v+'°'); bindSlider('oO',v=>{ o.o=v; saveDoc(); draw(); },v=>Math.round(v*100)+'%'); bindSlider('oW',v=>{ o.w=v; saveDoc(); draw(); },v=>v+' px');
 $('#oT',pb)?.addEventListener('change',e=>ed(()=>{ o.t=e.target.value; }));
 $('#oFlip',pb)?.addEventListener('click',()=>ed(()=>{ o.f=o.f?0:1; })); $('#oVar',pb)?.addEventListener('click',()=>ed(()=>{ o.v=((o.v||0)+1)%8; }));
 $('#oUp',pb)?.addEventListener('click',()=>ed(()=>{ const col=S.type==='stamp'?'stamps':'labels'; m[col]=m[col].filter(x=>x!==o); m[col].push(o); }));
 $('#oDown',pb)?.addEventListener('click',()=>ed(()=>{ const col=S.type==='stamp'?'stamps':'labels'; m[col]=m[col].filter(x=>x!==o); m[col].unshift(o); }));
 $('#oEdit',pb)?.addEventListener('click',()=>{ SB.tool='texto'; $$('.st-tool').forEach(b=>b.classList.toggle('on',b.dataset.tool==='texto')); stPanel(); });
 $('#selDup',pb)?.addEventListener('click',dupSel); $('#selDel',pb)?.addEventListener('click',delSel);
 $$('[data-ly]',pb).forEach(c=>c.onchange=()=>{ m.layers[c.dataset.ly]=!c.checked; saveDoc(); draw(); });
 $('#clrSt',pb)?.addEventListener('click',()=>confirmBox('¿Quitar todos los objetos del mapa?',()=>{ const b=vecSnap(); m.stamps=[]; vecCommit(b); draw(); stPanel(); },'Quitar'));
 $('#clrPa',pb)?.addEventListener('click',()=>confirmBox('¿Quitar todos los ríos, caminos y muros?',()=>{ const b=vecSnap(); m.paths=[]; vecCommit(b); draw(); stPanel(); },'Quitar'));
 const fx=m.fx, fxs=(k,v,coast)=>{ fx[k]=v; saveDoc(); if(coast) coastSoon(120); draw(); };
 $$('[data-bgk]',pb).forEach(b=>b.onclick=()=>{ m.bg=b.dataset.bgk; $$('[data-bgk]',pb).forEach(x=>x.classList.toggle('on',x===b)); saveDoc(); computeCoast(); saveTerrain(300); });
 $$('[data-look]',pb).forEach(b=>b.onclick=()=>{ fxs('look',b.dataset.look); $$('[data-look]',pb).forEach(x=>x.classList.toggle('on',x===b)); });
 bindSlider('fxVig',v=>fxs('vig',v),v=>Math.round(v*100)+'%'); bindSlider('fxPap',v=>fxs('paper',v),v=>Math.round(v*100)+'%'); bindSlider('fxDark',v=>fxs('dark',v),v=>Math.round(v*100)+'%'); bindSlider('fxDep',v=>fxs('depth',v,1),v=>v+' px');
 $('#fxRings',pb)?.addEventListener('change',e=>fxs('rings',e.target.checked,1)); $('#fxBeach',pb)?.addEventListener('change',e=>fxs('beach',e.target.checked,1)); $('#fxTint',pb)?.addEventListener('change',e=>fxs('tint',e.target.checked));
 bindSeg('fxFrame',v=>fxs('frame',v));
 const G=m.grid; $('#gOn',pb)?.addEventListener('change',e=>{ G.on=e.target.checked; saveDoc(); draw(); }); bindSeg('gType',v=>{ G.type=v; saveDoc(); draw(); });
 bindSlider('gSize',v=>{ G.size=v; saveDoc(); draw(); },v=>v+' px'); bindSlider('gOp',v=>{ G.op=v; saveDoc(); draw(); },v=>Math.round(v*100)+'%');
 $('#gScale',pb)?.addEventListener('change',e=>{ m.scale=+e.target.value||1; saveDoc(); status(); }); $('#gUnit',pb)?.addEventListener('change',e=>{ m.unit=e.target.value; saveDoc(); status(); });
 $('#mPlane',pb)?.addEventListener('change',e=>{ m.plane=e.target.value; saveDoc(0); toast(`Mapa movido a ${planeById(e.target.value).name}.`); draw(); stPanel(); });
 $('#mGen',pb)?.addEventListener('click',()=>confirmBox('¿Generar un terreno nuevo? Reemplaza el terreno, los objetos y los textos (puedes deshacerlo).',async()=>{ const b=vecSnap(); const bf=SD.before.getContext('2d'); bf.clearRect(0,0,m.w,m.h); bf.drawImage(SD.terr,0,0); const keep=mkC(m.w,m.h); keep.getContext('2d').drawImage(SD.terr,0,0);
  await stGenerate(m,false); pushTerrUndo(0,0,m.w,m.h,keep); vecCommit(b); computeCoast(); saveTerrain(200); stPanel(); },'Generar'));
 $('#mDel',pb)?.addEventListener('click',()=>confirmBox(`¿Eliminar el mapa "${m.name}"? Los submapas se conservan.`,()=>{ const id=m.id; SD.map=null; SD.openId=null; lsSet('oz:stOpen',null); Store.del('maps',id); IDB.del&&IDB.del(id,'maps'); counts(); render(true); }));
}
function exportDialog(){ const m=SD.map; const md=modal({title:'Exportar mapa',body:`<p class="muted" style="margin:0">Se guarda como imagen PNG con las capas visibles. Los marcadores no se incluyen.</p>
  ${sel('Resolución','sc','1',[['0.5',`Media · ${Math.round(m.w/2)} × ${Math.round(m.h/2)}`],['1',`Completa · ${m.w} × ${m.h}`],['2',`Doble · ${m.w*2} × ${m.h*2}`]])}`,foot:`<button class="btn" data-c>Cancelar</button><button class="btn pri" data-s>${I.down} Exportar PNG</button>`});
 $('[data-c]',md.el).onclick=md.close; $('[data-s]',md.el).onclick=()=>{ const sc=+vals(md.el).sc||1; md.close(); stExport(sc); }; }

/* ---------- Mapas clásicos ---------- */
ROUTES.mapas.s='Mundos, regiones, batallas y mazmorras';
const _vMapasClassic=vMapas;
vMapas=function(v){ const om=MS.open&&Store.get('maps',MS.open);
 if(MS.classic&&om&&!om.v){ _vMapasClassic(v); const st=$('#stage',v); if(st){ const bar=document.createElement('div'); bar.className='st-classic'; bar.innerHTML=`<button class="btn sm" id="clBack">${I.back} Estudio</button><button class="btn sm pri" id="clConv">${I.wand} Pasar al estudio nuevo</button>`; st.append(bar);
   $('#clBack').onclick=()=>{ MS.classic=false; MS.open=null; render(true); }; $('#clConv').onclick=()=>convertClassic(om); } return; }
 MS.classic=false; if(!SD.openId) SD.openId=lsGet('oz:stOpen',null); const sm=SD.openId&&Store.get('maps',SD.openId);
 if(sm&&sm.v) studioEditor(v,sm.id); else { SD.openId=null; studioGallery(v); } };
async function convertClassic(om){ const C0=C, W=om.w*C0, H=om.h*C0; const c=mkC(W,H), g=c.getContext('2d'); if(Ed.terrC) g.drawImage(Ed.terrC,0,0,W,H);
 const lv=om.level==='mazmorra'?'mazmorra':om.level, L=SLV[lv]||SLV.nacional;
 const m={id:om.id,v:2,name:om.name,level:lv,plane:om.plane||'material',w:W,h:H,bg:lv==='mazmorra'?'roca':'pergamino',grid:{on:true,type:'sq',size:C0,op:L.grid.op},scale:om.scale||L.scale,unit:om.unit||L.unit,fx:{look:'natural',vig:.3,paper:0,frame:'none',dark:0},layers:{},stamps:[],paths:[],
  labels:(om.labels||[]).map(l=>({id:l.id||uid(),x:l.x*C0+C0/2,y:l.y*C0+C0/2,text:l.text,font:'Cinzel',size:Math.round(18*(l.size||1)),color:'#2a2018',halo:1,hc:'#f3ead6',sp:3,curve:0,up:true,it:!!l.italic,r:0})),
  pins:(om.markers||[]).map(k=>({id:k.id||uid(),x:k.x*C0+C0/2,y:k.y*C0+C0/2,kind:k.kind,name:k.name||'',note:k.note||'',link:k.link||null})),parent:om.parent||null,created:om.created||Date.now()};
 await new Promise(r=>c.toBlob(b=>{ IDB.set(m.id,b,'maps').then(r); },'image/webp',.92)); Ed.map=null; SD.map=m; newTerrain(m); SD.tg.drawImage(c,0,0); makeThumb(); SD.map=null; Store.put('maps',m);
 MS.classic=false; MS.open=null; SD.openId=m.id; lsSet('oz:stOpen',m.id); toast('Mapa pasado al estudio nuevo.'); render(true); }
