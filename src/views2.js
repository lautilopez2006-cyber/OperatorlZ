/* ===== PERSONAJES ===== */
const PC_COLORS=['#d6a44c','#e0584b','#6aa6d8','#6fbf86','#ad8dff','#f0832e','#5fd3c4','#e57fb3'];
const profBonus=l=>2+Math.floor(((Number(l)||1)-1)/4);
function vPersonajes(v){
 viewDeps=['characters'];
 const l=Store.list('characters').sort((a,b)=>(a.name||'').localeCompare(b.name||''));
 v.innerHTML=`<div class="toolbar"><div><span class="eyebrow">Grupo</span><h2 class="h2">${l.length} aventurero${l.length===1?'':'s'}</h2></div><div style="flex:1"></div><button class="btn" id="pccomb">${I.swords} Llevar al combate</button><button class="btn pri" id="pcnew">${I.plus} Nuevo personaje</button></div>
 ${l.length?`<div class="cards">${l.map((c,i)=>{ const pct=c.max?clamp((c.hp??c.max)/c.max*100,0,100):100; const cls=CLASSES.find(k=>k.name===c.cls);
  return `<div class="card" style="--i:${i}" data-id="${c.id}"><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><div class="av" style="background:${esc(c.color||PC_COLORS[i%8])};width:52px;height:52px;font-size:1.5rem">${esc((c.name||'?')[0])}</div>
   <div style="min-width:0;flex:1"><div class="h3">${esc(c.name||'Sin nombre')}</div><div class="muted" style="font-size:.85rem">${esc([c.species,c.cls&&(c.cls+(c.sub?' · '+c.sub:'')),'Nivel '+(c.level||1)].filter(Boolean).join(' · '))}</div>${c.player?`<div class="muted" style="font-size:.78rem">Jugador: ${esc(c.player)}</div>`:''}</div></div>
   <div class="hpbar" style="height:8px;margin-top:12px"><i style="width:${pct}%;background:${pct<30?'var(--bad)':pct<60?'var(--warn)':'var(--ok)'}"></i></div>
   <div class="row mono" style="justify-content:space-between;margin-top:10px;font-size:.88rem"><span>PG <b>${c.hp??c.max??'—'}</b>/${c.max||'—'}</span><span>CA <b>${c.ac||'—'}</b></span><span>Ini <b>${fm(mod(c.dex))}</b></span><span>PP <b>${c.pp||10+mod(c.wis)}</b></span></div>
   ${cls?`<div style="margin-top:10px"><span class="chip" data-cls="${cls.id}">${I.shield.replace('<svg','<svg width="13" height="13"')} Rasgos de ${esc(cls.name)}</span></div>`:''}</div>`; }).join('')}</div>`
 :`<div class="empty"><div class="h3">El grupo está vacío</div>Crea las fichas de tus jugadores para tener a mano PG, CA, salvaciones y notas.<div style="margin-top:12px"><button class="btn pri" id="pcnew2">${I.plus} Nuevo personaje</button></div></div>`}`;
 v.onclick=e=>{ const ch=e.target.closest('[data-cls]'); if(ch){ e.stopPropagation(); CL.sel=ch.dataset.cls; CL.lvl=Store.list('characters').find(c=>CLASSES.find(k=>k.id===ch.dataset.cls)?.name===c.cls)?.level||1; go('clases'); return; }
  const cd=e.target.closest('.card[data-id]'); if(cd) editPC(Store.get('characters',cd.dataset.id)); };
 $('#pcnew',v)?.addEventListener('click',()=>editPC(null)); $('#pcnew2',v)?.addEventListener('click',()=>editPC(null));
 $('#pccomb',v).onclick=()=>{ const n=addPCsToCombat(); toast(n?`${n} personajes añadidos al combate.`:'Ya están en el combate.'); };
}
function editPC(p){
 const isNew=!p; p=p?clone(p):{id:uid(),name:'',player:'',species:'',cls:'',sub:'',level:1,bg:'',align:'',ac:12,max:10,hp:10,speed:'9 m',str:10,dex:10,con:10,int:10,wis:10,cha:10,saves:{},skills:'',pp:'',langs:'',feats:'',gear:'',traits:'',story:'',hooks:'',color:PC_COLORS[Store.list('characters').length%8]};
 const ab=[['str','FUE'],['dex','DES'],['con','CON'],['int','INT'],['wis','SAB'],['cha','CAR']];
 const md=modal({title:isNew?'Nuevo personaje':p.name,wide:true,body:`
  <div class="grid3">${fld('Nombre','name',p.name)}${fld('Jugador','player',p.player)}${fld('Especie','species',p.species)}</div>
  <div class="grid3">${sel('Clase','cls',p.cls,[['','—'],...CLASSES.map(c=>c.name),'Otra'])}${fld('Subclase','sub',p.sub)}${fld('Nivel','level',p.level,'number','min="1" max="20"')}</div>
  <div class="grid3">${fld('Trasfondo','bg',p.bg)}${fld('Alineamiento','align',p.align)}${fld('Velocidad','speed',p.speed)}</div>
  <div class="grid3">${fld('CA','ac',p.ac,'number')}${fld('PG máximos','max',p.max,'number')}${fld('PG actuales','hp',p.hp,'number')}</div>
  <div class="grid6">${ab.map(([k,t])=>fld(t,k,p[k],'number','min="1" max="30"')).join('')}</div>
  <div class="row" style="gap:6px"><span class="muted" style="font-size:.8rem">Salvaciones con competencia:</span>${ab.map(([k,t])=>`<label class="chip" style="cursor:pointer"><input type="checkbox" name="sv_${k}" ${p.saves&&p.saves[k]?'checked':''}> ${t}</label>`).join('')}</div>
  <div id="pcsum" class="row mono muted" style="font-size:.85rem"></div>
  <div class="grid2">${fld('Habilidades con competencia','skills',p.skills)}${fld('Percepción pasiva (vacío = automática)','pp',p.pp,'number')}${fld('Idiomas','langs',p.langs)}${fld('Dotes','feats',p.feats)}</div>
  <div class="grid2">${area('Rasgos y habilidades especiales','traits',p.traits,4)}${area('Equipo y objetos mágicos','gear',p.gear,4)}</div>
  <div class="grid2">${area('Historia','story',p.story,4)}${area('Ganchos, secretos y objetivos','hooks',p.hooks,4)}</div>
  <div class="row" style="gap:6px"><span class="muted" style="font-size:.8rem">Color:</span>${PC_COLORS.map(c=>`<button class="btn icon sm" data-col="${c}" aria-label="Color ${c}" style="width:28px;height:28px;background:${c};${c===p.color?'outline:2px solid var(--ink)':''}"></button>`).join('')}</div>`,
  foot:`${isNew?'':`<button class="btn danger" data-del>${I.trash} Eliminar</button><div style="flex:1"></div>`}<button class="btn" data-c>Cancelar</button><button class="btn pri" data-s>${I.save} Guardar</button>`});
 const sum=()=>{ const f=vals(md.el); const pb=profBonus(f.level); $('#pcsum',md.el).innerHTML=`Competencia +${pb} · Iniciativa ${fm(mod(f.dex))} · Salvaciones: ${ab.map(([k,t])=>`${t} ${fm(mod(f[k])+(f['sv_'+k]?pb:0))}`).join(' · ')} · PP ${f.pp||10+mod(f.wis)}`; };
 md.el.addEventListener('input',sum); sum();
 $$('[data-col]',md.el).forEach(b=>b.onclick=()=>{ p.color=b.dataset.col; $$('[data-col]',md.el).forEach(x=>x.style.outline=x===b?'2px solid var(--ink)':''); });
 $('[data-c]',md.el).onclick=md.close;
 $('[data-del]',md.el)?.addEventListener('click',()=>confirmBox(`¿Eliminar a ${p.name}?`,()=>{ Store.del('characters',p.id); md.close(); render(true); }));
 $('[data-s]',md.el).onclick=()=>{ const f=vals(md.el); p.saves={}; for(const [k] of ab){ p.saves[k]=!!f['sv_'+k]; delete f['sv_'+k]; }
  Object.assign(p,f); if(!p.name.trim()) p.name='Sin nombre'; Store.put('characters',p); md.close(); toast(isNew?'Personaje creado.':'Ficha guardada.'); render(true); };
}

/* ===== PNJ ===== */
const NS={q:'',att:'',loc:''};
function randomNPC(){ const sp=pick(Object.keys(NAMEGEN)); return {id:uid(),_new:true,name:genName(sp),species:sp,role:pick(NPC_ROLES),att:'neutral',location:'',faction:'',appearance:'',personality:pick(NPC_TRAITS),quirk:pick(NPC_QUIRKS),motive:pick(NPC_MOTIVES),secret:pick(NPC_SECRETS),notes:'',template:'srd-plebeyo',fav:false}; }
function vPNJ(v){
 viewDeps=['npcs'];
 const all=Store.list('npcs'); const locs=[...new Set(all.map(n=>n.location).filter(Boolean))].sort();
 v.innerHTML=`<div class="toolbar"><div class="search">${I.search}<input class="inp" id="nq" placeholder="Buscar PNJ, rol, facción…" value="${esc(NS.q)}" aria-label="Buscar PNJ"></div>
  <div class="row" style="gap:6px">${[['','Todos'],['aliado','Aliados'],['neutral','Neutrales'],['hostil','Hostiles']].map(([k,t])=>`<span class="chip ${NS.att===k?'on':''}" data-att="${k}">${t}</span>`).join('')}</div>
  ${locs.length?`<select class="sel" id="nloc" style="width:auto" aria-label="Lugar"><option value="">Todos los lugares</option>${locs.map(l=>`<option ${l===NS.loc?'selected':''}>${esc(l)}</option>`).join('')}</select>`:''}
  <div style="flex:1"></div><button class="btn" id="nrand">${I.sparkle} PNJ al azar</button><button class="btn pri" id="nnew">${I.plus} Nuevo PNJ</button></div><div id="ngrid"></div>`;
 const draw=()=>{ const q=norm(NS.q); const l=all.filter(n=>(!NS.att||n.att===NS.att)&&(!NS.loc||n.location===NS.loc)&&(!q||norm([n.name,n.role,n.faction,n.location,n.species].join(' ')).includes(q))).sort((a,b)=>(b.fav-a.fav)||(a.name||'').localeCompare(b.name||''));
  $('#ngrid').innerHTML=l.length?`<div class="cards">${l.map((n,i)=>`<div class="card" style="--i:${i}" data-id="${n.id}">
   <div class="row" style="justify-content:space-between;flex-wrap:nowrap"><div class="h3" style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${n.fav?'<span style="color:var(--acc)">★</span> ':''}${esc(n.name)}</div><span class="att ${n.att||'neutral'}">${esc(n.att||'neutral')}</span></div>
   <div class="muted" style="font-size:.86rem">${esc([n.species,n.role].filter(Boolean).join(' · '))}</div>
   ${n.location||n.faction?`<div style="font-size:.82rem;margin-top:6px">${n.location?`${I.pin.replace('<svg','<svg width="13" height="13" style="vertical-align:-2px"')} ${esc(n.location)}`:''}${n.faction?` · ${esc(n.faction)}`:''}</div>`:''}
   ${n.quirk?`<p style="margin:8px 0 0;font-size:.88rem;font-style:italic;color:var(--ink2)">“${esc(n.quirk)}”</p>`:''}</div>`).join('')}</div>`
   :`<div class="empty"><div class="h3">${all.length?'Ningún PNJ coincide':'Aún no hay PNJ'}</div>Crea uno desde cero o genera uno al azar con nombre, manía, motivación y secreto.</div>`; };
 $('#nq').oninput=e=>{NS.q=e.target.value;draw()};
 $$('[data-att]',v).forEach(c=>c.onclick=()=>{NS.att=c.dataset.att;$$('[data-att]',v).forEach(x=>x.classList.toggle('on',x===c));draw()});
 $('#nloc')?.addEventListener('change',e=>{NS.loc=e.target.value;draw()});
 $('#ngrid').onclick=e=>{ const c=e.target.closest('[data-id]'); if(c) editNPC(Store.get('npcs',c.dataset.id)); };
 $('#nnew').onclick=()=>editNPC(null); $('#nrand').onclick=()=>editNPC(randomNPC());
 draw();
}
function editNPC(n){
 const isNew=!n||n._new; n=n?clone(n):{id:uid(),name:'',species:'',role:'',att:'neutral',location:'',faction:'',appearance:'',personality:'',quirk:'',motive:'',secret:'',notes:'',template:'',fav:false}; delete n._new;
 const mons=allMonsters().sort((a,b)=>a.name.localeCompare(b.name));
 const md=modal({title:isNew?'Nuevo PNJ':n.name,wide:true,body:`
  <div class="grid3">${fld('Nombre','name',n.name)}${fld('Especie','species',n.species)}${fld('Rol u ocupación','role',n.role)}</div>
  <div class="grid3">${sel('Actitud','att',n.att,[['aliado','Aliado'],['neutral','Neutral'],['hostil','Hostil']])}${fld('Lugar','location',n.location,'text','list="nlocs"')}${fld('Facción','faction',n.faction)}</div>
  <datalist id="nlocs">${[...new Set([...Store.list('npcs').map(x=>x.location),...Store.list('maps').flatMap(m=>(m.markers||[]).map(k=>k.name))].filter(Boolean))].map(l=>`<option value="${esc(l)}">`).join('')}</datalist>
  <div class="grid2">${area('Apariencia','appearance',n.appearance,2)}${area('Personalidad','personality',n.personality,2)}${area('Manía o voz','quirk',n.quirk,2)}${area('Motivación','motive',n.motive,2)}</div>
  ${area('Secreto (solo para el DM)','secret',n.secret,2)}${area('Notas','notes',n.notes,3)}
  <div class="grid2">${sel('Estadísticas en combate','template',n.template,[['','Sin estadísticas'],...mons.map(m=>[m.id,`${m.name} (VD ${m.cr})`])])}<label class="f"><span>Favorito</span><label class="chip" style="cursor:pointer;width:max-content"><input type="checkbox" name="fav" ${n.fav?'checked':''}> Fijar arriba</label></label></div>`,
  foot:`${isNew?'':`<button class="btn danger" data-del>${I.trash}</button>`}<button class="btn" data-rr>${I.sparkle} Rehacer rasgos</button><div style="flex:1"></div>${isNew?'':`<button class="btn" data-cb>${I.swords} Al combate</button>`}<button class="btn pri" data-s>${I.save} Guardar</button>`});
 $('[data-rr]',md.el).onclick=()=>{ const r=randomNPC(); for(const k of ['personality','quirk','motive','secret']) $('#f-'+k,md.el).value=r[k]; if(!$('#f-name',md.el).value) { $('#f-name',md.el).value=r.name; $('#f-species',md.el).value=r.species; } };
 $('[data-del]',md.el)?.addEventListener('click',()=>confirmBox(`¿Eliminar a ${n.name}?`,()=>{ Store.del('npcs',n.id); md.close(); render(true); }));
 const save=()=>{ Object.assign(n,vals(md.el)); if(!n.name.trim()) n.name='PNJ sin nombre'; Store.put('npcs',n); };
 $('[data-cb]',md.el)?.addEventListener('click',()=>{ save(); addNPCToCombat(n); toast(`${n.name} entra al combate.`); });
 $('[data-s]',md.el).onclick=()=>{ save(); md.close(); toast(isNew?'PNJ creado.':'PNJ guardado.'); if(route==='pnj') render(true); };
}

/* ===== CLASES ===== */
const CL={sel:null,lvl:1};
function vClases(v){
 const c=CLASSES.find(k=>k.id===CL.sel);
 if(!c){ v.innerHTML=`<div class="toolbar"><div><span class="eyebrow">Consulta rápida</span><h2 class="h2">Doce clases, del nivel 1 al 20</h2></div></div>
  <div class="class-grid">${CLASSES.map((k,i)=>`<div class="card cls" style="--i:${i}" data-c="${k.id}"><span class="sig" aria-hidden="true">${k.name[0]}</span><span class="eyebrow">d${k.hd} · ${esc(k.primary)}</span><div class="h3">${esc(k.name)}</div><div class="muted" style="font-size:.88rem">${esc(k.blurb)}</div><div class="row" style="gap:5px;margin-top:auto">${k.caster?`<span class="tag">${k.caster==='full'?'Lanzador completo':k.caster==='half'?'Medio lanzador':'Magia de pacto'}</span>`:'<span class="tag">Marcial</span>'}</div></div>`).join('')}${EXTRA_CLASSES.map(k=>`<div class="card cls" data-ix="${k.id}"><span class="sig" aria-hidden="true">${k.name[0]}</span><span class="eyebrow">${esc(k.source)}</span><div class="h3">${esc(k.name)}</div><div class="muted" style="font-size:.88rem">${esc(k.desc)}</div><div class="row" style="gap:5px;margin-top:auto"><span class="tag ix">${esc(bookName(k.source))}</span></div></div>`).join('')}</div>
  <p class="muted" style="font-size:.82rem;margin-top:18px">Resumen propio de las reglas de 2024 (SRD 5.2, CC-BY 4.0) con la subclase del SRD. Para el texto completo, sube tu manual a la Biblioteca.</p>`;
  v.onclick=e=>{ const ix=e.target.closest('[data-ix]'); if(ix){ LB.q=EXTRA_CLASSES.find(k=>k.id===ix.dataset.ix).name; LB.open=null; go('biblioteca'); return; } const k=e.target.closest('[data-c]'); if(k){ CL.sel=k.dataset.c; render(true); v.classList.add('enter'); } }; return; }
 v.onclick=null;
 const all=[...c.feats.map(f=>[...f,false]),...c.sub.feats.map(f=>[...f,true])].sort((a,b)=>a[0]-b[0]);
 const slotT=c.caster==='full'?SLOTS_FULL:c.caster==='half'?SLOTS_HALF:c.caster==='pact'?SLOTS_PACT:null;
 v.innerHTML=`<div class="row" style="margin-bottom:14px"><button class="btn ghost" id="clback">${I.back} Todas las clases</button><div style="flex:1"></div>${CLASSES.map(k=>`<span class="chip ${k.id===c.id?'on':''}" data-c="${k.id}">${k.name}</span>`).join('')}</div>
 <div class="cols2" style="grid-template-columns:minmax(0,1.6fr) minmax(0,1fr)">
  <div>
   <div class="panel" style="margin-bottom:14px;position:relative;overflow:hidden"><span class="sig" aria-hidden="true" style="position:absolute;right:10px;top:-20px;font:400 9rem/1 var(--f-disp);color:var(--acc);opacity:.1">${c.name[0]}</span>
    <span class="eyebrow">${esc(c.en)}</span><h2 class="h2" style="font-size:2.3rem">${esc(c.name)}</h2><p class="muted" style="margin:4px 0 10px">${esc(c.blurb)}</p>
    <div class="row" style="gap:6px"><span class="tag">Dado de golpe d${c.hd}</span><span class="tag">${esc(c.primary)}</span><span class="tag">Salv.: ${esc(c.saves)}</span>${c.ability?`<span class="tag">Conjuros: ${esc(c.ability)}</span>`:''}</div>
    <p style="margin:10px 0 0;font-size:.9rem"><b>Armaduras:</b> ${esc(c.armor)} · <b>Armas:</b> ${esc(c.weapons)}</p></div>
   <div class="panel"><div class="row" style="justify-content:space-between;margin-bottom:12px"><h3 class="h3">Rasgos hasta el nivel <span class="mono" id="cllv">${CL.lvl}</span></h3><input type="range" id="clr" min="1" max="20" value="${CL.lvl}" style="flex:1;max-width:280px;accent-color:var(--acc)" aria-label="Nivel"></div>
    <div class="timeline" id="cltl">${all.map(f=>`<div class="tl" data-l="${f[0]}"><span class="lv">NIVEL ${f[0]}${f[3]?' · '+esc(c.sub.name.toUpperCase()):''}</span><div><b>${esc(f[1])}.</b> <span style="color:var(--ink2)">${esc(f[2])}</span></div></div>`).join('')}</div></div>
  </div>
  <div>
   <div class="panel" style="margin-bottom:14px"><span class="eyebrow">Subclase del SRD</span><h3 class="h3" style="margin:4px 0 8px">${esc(c.sub.name)}</h3>${c.sub.feats.map(f=>`<p style="margin:6px 0;font-size:.92rem"><span class="tag">Nv ${f[0]}</span> <b>${esc(f[1])}.</b> ${esc(f[2])}</p>`).join('')}</div>
   <div class="panel" style="margin-bottom:14px"><span class="eyebrow">Todas las subclases</span><h3 class="h3" style="margin:4px 0 10px">Manuales y expansiones</h3><div style="display:flex;flex-direction:column;gap:6px">${SUBCLASS_CAT[c.id].split(';').map(x=>{const [n,src]=x.split('|');return `<div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span>${esc(n)}</span><span class="row" style="gap:6px;flex-wrap:nowrap"><span class="tag ix" title="${esc(bookName(src))}">${esc(src)}</span><button class="btn ghost icon sm" data-man="${esc(n)}" title="Buscar en mis manuales" aria-label="Buscar ${esc(n)} en mis manuales">${I.book}</button></span></div>`}).join('')}</div><p class="muted" style="font-size:.8rem;margin:10px 0 0">Su texto está en el libro indicado; súbelo a Manuales para leerlo aquí.</p></div>
   <div class="panel" style="margin-bottom:14px"><h3 class="h3" style="margin-bottom:8px">De un vistazo</h3><div class="grid2 mono" style="font-size:.9rem"><div>Competencia <b id="clpb">+${profBonus(CL.lvl)}</b></div><div>PG nivel 1 <b>${c.hd}+Con</b></div><div>PG por nivel <b>${c.hd/2+1}+Con</b></div><div>Mejoras hasta ahora <b id="clasi"></b></div></div></div>
   ${slotT?`<div class="panel"><h3 class="h3" style="margin-bottom:8px">${c.caster==='pact'?'Magia de pacto':'Espacios de conjuro'}</h3><div class="tblwrap"><table class="slots" id="clslots"><tr><th>Nv</th>${c.caster==='pact'?'<th>Espacios</th><th>Nivel</th>':[1,2,3,4,5,6,7,8,9].map(n=>`<th>${n}º</th>`).join('')}</tr>${slotT.map((r,i)=>`<tr data-l="${i+1}"><td>${i+1}</td>${c.caster==='pact'?`<td>${r[0]}</td><td>${r[1]}º</td>`:[0,1,2,3,4,5,6,7,8].map(j=>`<td>${r[j]||'–'}</td>`).join('')}</tr>`).join('')}</table></div></div>`:''}
  </div></div>`;
 const upd=()=>{ $('#cllv').textContent=CL.lvl; $('#clpb').textContent='+'+profBonus(CL.lvl);
  $$('#cltl .tl').forEach(t=>{ const on=Number(t.dataset.l)<=CL.lvl; t.classList.toggle('on',on); t.classList.toggle('off',!on); });
  $('#clasi').textContent=all.filter(f=>/Mejora de característica|Don épico/.test(f[1])&&f[0]<=CL.lvl).length+(c.id==='guerrero'?[6,14].filter(x=>x<=CL.lvl).length:0)+(c.id==='picaro'&&CL.lvl>=10?1:0);
  $$('#clslots tr[data-l]').forEach(r=>r.classList.toggle('on',Number(r.dataset.l)===CL.lvl)); };
 $('#clr').oninput=e=>{CL.lvl=Number(e.target.value);upd()};
 $('#clback').onclick=()=>{CL.sel=null;render(true);v.classList.add('enter')};
 $$('[data-c]',v).forEach(k=>k.onclick=()=>{CL.sel=k.dataset.c;render(true)});
 $$('[data-man]',v).forEach(b=>b.onclick=()=>{ LB.q=b.dataset.man; LB.open=null; go('biblioteca'); });
 upd();
}

/* ===== DOTES ===== */
const FS={q:'',cat:'todas'};
const FEAT_CATS=[['todas','Todas'],['origen','De origen (iniciales)'],['general','Generales (nivel 4+)'],['estilo','Estilo de combate'],['epico','Dones épicos (19+)'],['homebrew','Homebrew']];
function allFeats(){ return [...FEATS,...Store.list('feats')]; }
function vDotes(v){
 viewDeps=['feats'];
 v.innerHTML=`<div class="toolbar"><div class="search">${I.search}<input class="inp" id="fq" placeholder="Buscar dote…" value="${esc(FS.q)}" aria-label="Buscar dote"></div><div class="row" style="gap:6px">${FEAT_CATS.map(([k,t])=>`<span class="chip ${FS.cat===k?'on':''}" data-cat="${k}">${t}</span>`).join('')}</div><div style="flex:1"></div><button class="btn pri" id="fnew">${I.plus} Dote homebrew</button></div><div id="fgrid"></div>
 <p class="muted" style="font-size:.82rem;margin-top:18px">Las dotes de origen se eligen al crear el personaje (por el trasfondo). Las generales se toman con el rasgo de Mejora de característica desde el nivel 4. Resúmenes propios de las reglas de 2024.</p>`;
 const draw=()=>{ const q=norm(FS.q); const l=allFeats().filter(f=>(FS.cat==='todas'||(FS.cat==='homebrew'?f.source==='Homebrew':f.cat===FS.cat))&&(!q||norm(f.name+' '+f.en+' '+f.desc).includes(q)));
  const lbl=Object.fromEntries(FEAT_CATS);
  $('#fgrid').innerHTML=l.length?`<div class="cards">${l.map((f,i)=>`<div class="card feat" style="--i:${i%30}"><div class="row" style="justify-content:space-between;flex-wrap:nowrap;align-items:flex-start"><div class="h3">${esc(f.name)}</div>${f.source==='Homebrew'?`<button class="btn ghost icon sm" data-fe="${f.id}" aria-label="Editar">${I.edit}</button>`:''}</div>
   <div class="row" style="gap:6px"><span class="tag ${f.source==='Homebrew'?'hb':''}">${esc((lbl[f.cat]||f.cat).split(' (')[0])}</span>${f.en?`<small class="muted">${esc(f.en)}</small>`:''}</div>
   ${f.pre?`<div class="pre">Requisito: ${esc(f.pre)}</div>`:''}<div style="font-size:.92rem;color:var(--ink2)">${esc(f.desc)}</div></div>`).join('')}</div>`:'<div class="empty">Ninguna dote coincide.</div>'; };
 $('#fq').oninput=e=>{FS.q=e.target.value;draw()};
 $$('[data-cat]',v).forEach(c=>c.onclick=()=>{FS.cat=c.dataset.cat;$$('[data-cat]',v).forEach(x=>x.classList.toggle('on',x===c));draw()});
 $('#fgrid').onclick=e=>{ const b=e.target.closest('[data-fe]'); if(b) editFeat(Store.get('feats',b.dataset.fe)); };
 $('#fnew').onclick=()=>editFeat(null); draw();
}
function editFeat(f){
 const isNew=!f; f=f?clone(f):{id:'hbf-'+uid(),name:'',en:'',cat:'general',pre:'',desc:'',source:'Homebrew'};
 const md=modal({title:isNew?'Nueva dote homebrew':f.name,body:`<div class="grid2">${fld('Nombre','name',f.name)}${sel('Categoría','cat',f.cat,FEAT_CATS.slice(1,5))}</div>${fld('Requisito','pre',f.pre)}${area('Descripción','desc',f.desc,5)}`,
  foot:`${isNew?'':`<button class="btn danger" data-del>${I.trash} Eliminar</button><div style="flex:1"></div>`}<button class="btn pri" data-s>${I.save} Guardar</button>`});
 $('[data-del]',md.el)?.addEventListener('click',()=>{ Store.del('feats',f.id); md.close(); render(true); });
 $('[data-s]',md.el).onclick=()=>{ Object.assign(f,vals(md.el)); if(!f.name.trim()) return toast('Ponle un nombre.'); Store.put('feats',f); md.close(); render(true); };
}

/* ===== BIBLIOTECA ===== */
const LB={open:null,page:0,q:'',inq:''};
const BOOK_COLORS=['#7a3b2e','#2e4f7a','#3d6b3a','#6b4a8a','#8a6a2a','#2e6b6b','#7a2e55','#4a4a5e'];
let pdfReady=null;
function loadPdfJs(){
 if(window.pdfjsLib) return Promise.resolve(); if(pdfReady) return pdfReady;
 const add=src=>new Promise((res,rej)=>{ const s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=()=>rej(new Error('No se pudo cargar el lector de PDF.')); document.head.append(s); });
 const base='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
 pdfReady=add(base+'pdf.min.js').then(()=>add(base+'pdf.worker.min.js')).then(()=>{ pdfjsLib.GlobalWorkerOptions.workerSrc=base+'pdf.worker.min.js'; }).catch(e=>{ pdfReady=null; throw e; });
 return pdfReady;
}
function linesToBlocks(lines,med){
 const out=[]; let para=null, prev=null;
 for(const l of lines){ if(/^\d{1,4}$/.test(l.text)) continue;
  const isH=l.size>=med*1.22&&l.text.length<90&&/\p{L}/u.test(l.text);
  if(isH){ if(para){ out.push(['p',para]); para=null; } const last=out[out.length-1];
   if(last&&last[0]==='h'&&prev&&prev.isH&&Math.abs(prev.y-l.y)<l.size*1.9) last[1]+=' '+l.text; else out.push(['h',l.text]);
   prev=Object.assign({},l,{isH:true}); continue; }
  const gap=prev?prev.y-l.y:0;
  const brk=!para||!prev||prev.isH||gap>l.size*1.8||gap<-l.size*2;
  if(brk){ if(para) out.push(['p',para]); para=l.text; } else para=/[-‐]$/.test(para)?para.replace(/[-‐]$/,'')+l.text:para+' '+l.text;
  prev=l; }
 if(para) out.push(['p',para]); return out;
}
async function parsePdf(file,prog){
 await loadPdfJs();
 const pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer(),isEvalSupported:false}).promise;
 const raw=[], sizes={};
 for(let i=1;i<=pdf.numPages;i++){ const pg=await pdf.getPage(i); const tc=await pg.getTextContent(); const lines=[]; let cur=null;
  const flush=()=>{ if(cur&&cur.text.trim()){ cur.text=cur.text.replace(/\s+/g,' ').trim(); lines.push(cur); const k=Math.round(cur.size); sizes[k]=(sizes[k]||0)+cur.text.length; } cur=null; };
  for(const it of tc.items){ if(typeof it.str!=='string') continue; const t=it.transform, size=Math.hypot(t[2],t[3])||it.height||10, x=t[4], y=t[5];
   if(it.str!==''){ if(cur&&Math.abs(y-cur.y)<Math.max(size,cur.size)*0.55){ const gap=x-cur.xe; cur.text+=(gap>size*0.12&&!/\s$/.test(cur.text)&&!/^\s/.test(it.str)?' ':'')+it.str; cur.xe=x+(it.width||0); cur.size=Math.max(cur.size,size); }
    else { flush(); cur={text:it.str,x,y,xe:x+(it.width||0),size}; } }
   if(it.hasEOL) flush(); }
  flush(); raw.push(lines); pg.cleanup&&pg.cleanup(); prog(i/pdf.numPages,`Página ${i} de ${pdf.numPages}`);
  if(i%4===0) await new Promise(r=>setTimeout(r)); }
 const med=Number(Object.entries(sizes).sort((a,b)=>b[1]-a[1])[0]?.[0])||10;
 return {v:1,pages:raw.map(ls=>linesToBlocks(ls,med))};
}
function parseText(txt,md){
 const blocks=[]; let para=[];
 const fl=()=>{ if(para.length){ blocks.push(['p',para.join(' ')]); para=[]; } };
 for(const ln of txt.split(/\r?\n/)){ const s=ln.trim(); if(!s){ fl(); continue; } const h=md&&s.match(/^#{1,4}\s+(.*)/); if(h){ fl(); blocks.push(['h',h[1]]); } else para.push(s.replace(/^[-*]\s+/,'• ')); }
 fl(); const pages=[]; let cur=[], n=0;
 for(const b of blocks){ cur.push(b); n+=b[1].length; if(n>3200){ pages.push(cur); cur=[]; n=0; } } if(cur.length) pages.push(cur);
 return {v:1,pages:pages.length?pages:[[['p','(vacío)']]]};
}
function parseHTML(html){ const d=new DOMParser().parseFromString(html,'text/html'); const out=[];
 d.body.querySelectorAll('h1,h2,h3,h4,p,li,td').forEach(e=>{ const t=e.textContent.replace(/\s+/g,' ').trim(); if(t) out.push((/H\d/.test(e.tagName)?'# ':'')+t); out.push(''); });
 return parseText(out.join('\n'),true); }
async function importFiles(files,ui){
 for(const file of files){ const name=file.name.replace(/\.[^.]+$/,''); ui(0,`Leyendo ${file.name}…`);
  try{ let content; const ext=(file.name.split('.').pop()||'').toLowerCase();
   if(ext==='pdf'||file.type==='application/pdf') content=await parsePdf(file,(p,t)=>ui(p,`${file.name}: ${t}`));
   else if(ext==='html'||ext==='htm') content=parseHTML(await file.text());
   else if(['txt','md','markdown'].includes(ext)) content=parseText(await file.text(),ext!=='txt');
   else { toast(`${file.name}: solo se aceptan PDF, TXT, MD o HTML.`,'bad'); continue; }
   const chars=content.pages.reduce((s,p)=>s+p.reduce((a,b)=>a+b[1].length,0),0);
   if(chars<40){ toast(`${file.name} no tiene texto seleccionable (parece escaneado). Pasa el PDF por un OCR y vuelve a subirlo.`,'bad'); continue; }
   const meta={id:'man-'+uid(),title:name,pages:content.pages.length,chars,color:pick(BOOK_COLORS),added:Date.now(),file:file.name};
   await IDB.set(meta.id,content); manualCache.set(meta.id,content);
   if(Store.assets){ ui(1,`${file.name}: guardando en la nube…`);
    try{ const a=await Store.assets.upload(new Blob([JSON.stringify(content)],{type:'application/json'})); meta.assetId=a.id; meta.assetUrl=a.url; }
    catch(e){ toast(`${file.name} quedó guardado solo en este navegador (${e&&e.code==='too_large'?'el texto supera 20 MB':'la nube no lo aceptó'}).`,'bad'); } }
   Store.put('manuals',meta); toast(`${name}: ${content.pages.length} páginas listas para buscar.`);
  }catch(e){ console.error(e); toast(`No pude leer ${file.name}: ${e.message||e}`,'bad'); } }
 ui(null);
}
const normCache=new Map();
function pageText(id,p,blocks){ const k=id+':'+p; let v=normCache.get(k); if(!v){ const raw=blocks.map(b=>b[1]).join('\n'); v={raw,n:norm(raw)}; normCache.set(k,v); } return v; }
function hl(text,qn){ if(!qn) return esc(text); const n=norm(text); let out='',i=0,j; while((j=n.indexOf(qn,i))>=0){ out+=esc(text.slice(i,j))+'<mark>'+esc(text.slice(j,j+qn.length))+'</mark>'; i=j+qn.length; } return out+esc(text.slice(i)); }
async function searchManuals(q,limit=80){
 const qn=norm(q.trim()); if(qn.length<2) return [];
 const hits=[];
 for(const m of Store.list('manuals')){ const c=await manualContent(m); if(!c) continue;
  for(let p=0;p<c.pages.length&&hits.length<limit;p++){ const t=pageText(m.id,p,c.pages[p]); let j=t.n.indexOf(qn), per=0;
   while(j>=0&&per<2&&hits.length<limit){ const a=Math.max(0,j-90), b=Math.min(t.raw.length,j+qn.length+120); hits.push({m,p,snip:(a?'…':'')+t.raw.slice(a,b).replace(/\n/g,' ')+(b<t.raw.length?'…':'')}); per++; j=t.n.indexOf(qn,j+qn.length+200); } } }
 return hits;
}
function vBiblioteca(v){
 viewDeps=['manuals'];
 const m=LB.open&&Store.get('manuals',LB.open); if(m) return vReader(v,m);
 const l=Store.list('manuals').sort((a,b)=>b.added-a.added);
 v.innerHTML=`<div class="cols2" style="grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);margin-bottom:18px">
  <div class="drop" id="drop" tabindex="0" role="button" aria-label="Subir manuales">${I.upload}<div class="h3">Sube tus manuales</div><div class="muted" style="font-size:.9rem">Arrastra PDF, TXT, MD o HTML, o haz clic para elegirlos. Se convierten a texto legible y quedan indexados para buscar.</div><input type="file" id="fin" accept=".pdf,.txt,.md,.markdown,.html,.htm" multiple hidden><div id="pg" hidden><div class="prog"><i id="pgb"></i></div><small class="muted" id="pgt"></small></div></div>
  <div class="panel"><h3 class="h3" style="margin-bottom:8px">Buscar en todos los manuales</h3><div class="search" style="max-width:none">${I.search}<input class="inp" id="lq" placeholder="Ej.: agarre, bola de fuego, cobertura…" value="${esc(LB.q)}" aria-label="Buscar en manuales"></div><div id="lres" style="display:flex;flex-direction:column;gap:8px;margin-top:10px;max-height:420px;overflow:auto"></div></div>
 </div>
 ${l.length?`<div class="cards">${l.map((b,i)=>`<div class="card" style="--i:${i}" data-b="${b.id}"><div class="book"><div class="spine" style="background:linear-gradient(90deg,${b.color},${b.color}cc)">${esc(b.title[0]||'?')}</div><div style="min-width:0;flex:1"><div class="h3" style="overflow-wrap:anywhere">${esc(b.title)}</div><div class="muted mono" style="font-size:.8rem">${b.pages} pág. · ${(b.chars/1000).toFixed(0)}k caracteres</div><div class="row" style="gap:6px;margin-top:8px">${b.assetId?'<span class="tag">En la nube</span>':'<span class="tag">Este navegador</span>'}</div></div></div>
  <div class="row" style="gap:6px;margin-top:12px"><button class="btn sm" data-ren="${b.id}">${I.edit} Renombrar</button><button class="btn sm danger" data-del="${b.id}">${I.trash} Quitar</button></div></div>`).join('')}</div>`
 :`<div class="empty"><div class="h3">La biblioteca está vacía</div>Sube el Manual del Jugador, la Guía del DM o tus propios suplementos. Necesitan tener texto seleccionable; los PDF escaneados requieren OCR previo.</div>`}`;
 const drop=$('#drop'), fin=$('#fin');
 const ui=(p,t)=>{ const g=$('#pg'); if(!g) return; if(p==null){ g.hidden=true; render(true); return; } g.hidden=false; $('#pgb').style.width=(p*100)+'%'; $('#pgt').textContent=t||''; };
 drop.onclick=()=>fin.click(); drop.onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); fin.click(); } };
 fin.onchange=()=>{ if(fin.files.length) importFiles([...fin.files],ui); };
 drop.ondragover=e=>{e.preventDefault();drop.classList.add('over')}; drop.ondragleave=()=>drop.classList.remove('over');
 drop.ondrop=e=>{ e.preventDefault(); drop.classList.remove('over'); if(e.dataTransfer.files.length) importFiles([...e.dataTransfer.files],ui); };
 let tok=0; const doSearch=async()=>{ const my=++tok; const r=$('#lres'); if(LB.q.trim().length<2){ r.innerHTML=`<span class="muted" style="font-size:.9rem">${l.length?'Escribe al menos 2 letras.':'Sube un manual para empezar a buscar.'}</span>`; return; }
  r.innerHTML='<span class="muted">Buscando…</span>'; const hits=await searchManuals(LB.q); if(my!==tok) return; const qn=norm(LB.q.trim());
  r.innerHTML=hits.length?hits.map((h,i)=>`<div class="hit" data-h="${i}"><small>${esc(h.m.title)} · pág. ${h.p+1}</small><div style="font-size:.92rem">${hl(h.snip,qn)}</div></div>`).join(''):'<span class="muted">Sin coincidencias.</span>';
  r.onclick=e=>{ const x=e.target.closest('[data-h]'); if(!x) return; const h=hits[+x.dataset.h]; LB.open=h.m.id; LB.page=h.p; LB.inq=LB.q; render(true); }; };
 $('#lq').oninput=e=>{ LB.q=e.target.value; debounce('lq',doSearch,250); }; doSearch();
 v.onclick=e=>{ const d=e.target.closest('[data-del]'), rn=e.target.closest('[data-ren]'), b=e.target.closest('[data-b]');
  if(d){ e.stopPropagation(); const mm=Store.get('manuals',d.dataset.del); confirmBox(`¿Quitar "${mm.title}" de la biblioteca?`,()=>{ IDB.del(mm.id); manualCache.delete(mm.id); if(mm.assetId&&Store.assets) Store.assets.delete(mm.assetId).catch(()=>{}); Store.del('manuals',mm.id); render(true); },'Quitar'); return; }
  if(rn){ e.stopPropagation(); const mm=Store.get('manuals',rn.dataset.ren); const md=modal({title:'Renombrar manual',body:fld('Título','title',mm.title),foot:'<button class="btn pri" data-s>Guardar</button>'}); $('[data-s]',md.el).onclick=()=>{ mm.title=vals(md.el).title||mm.title; Store.put('manuals',mm); md.close(); render(true); }; return; }
  if(b&&!e.target.closest('button')){ LB.open=b.dataset.b; LB.page=0; LB.inq=''; render(true); } };
}
async function vReader(v,m){
 v.onclick=null;
 v.innerHTML=`<div class="row" style="margin-bottom:14px"><button class="btn ghost" id="rback">${I.back} Biblioteca</button><h2 class="h2" style="flex:1;min-width:0;overflow-wrap:anywhere">${esc(m.title)}</h2><div class="search" style="max-width:280px">${I.search}<input class="inp" id="rq" placeholder="Buscar en este manual" value="${esc(LB.inq)}" aria-label="Buscar en este manual"></div><input class="inp mono" id="rp" type="number" min="1" max="${m.pages}" value="${LB.page+1}" style="width:90px" aria-label="Ir a página"><span class="muted mono">/ ${m.pages}</span></div><div id="rbody"><div class="muted">Abriendo…</div></div>`;
 $('#rback').onclick=()=>{ LB.open=null; render(true); };
 const c=await manualContent(m);
 if(route!=='biblioteca'||LB.open!==m.id) return;
 if(!c){ $('#rbody').innerHTML=`<div class="empty"><div class="h3">El contenido no está en este dispositivo</div>Este manual se subió desde otro navegador sin copia en la nube. Vuelve a subir el archivo aquí.</div>`; return; }
 const toc=[]; c.pages.forEach((p,i)=>p.forEach(b=>{ if(b[0]==='h'&&toc.length<500) toc.push([i,b[1]]); }));
 $('#rbody').innerHTML=`<div class="reader"><nav class="toc" aria-label="Índice">${toc.length?toc.map(t=>`<a href="#" data-p="${t[0]}">${esc(t[1].slice(0,70))}<span class="muted mono" style="font-size:.72rem"> ${t[0]+1}</span></a>`).join(''):'<span class="muted" style="font-size:.85rem">No se detectaron títulos.</span>'}</nav><div id="rpages"></div></div>`;
 const showPages=()=>{ const qn=norm(LB.inq.trim()); const a=Math.max(0,LB.page-1), b=Math.min(c.pages.length,LB.page+12);
  $('#rpages').innerHTML=(a>0?`<button class="btn" data-more="-1" style="margin-bottom:12px">Páginas anteriores</button>`:'')+c.pages.slice(a,b).map((p,i)=>`<article class="page" id="pg-${a+i}"><div class="pn">Página ${a+i+1}</div>${p.map(bl=>bl[0]==='h'?`<h3>${hl(bl[1],qn.length>1?qn:'')}</h3>`:`<p>${hl(bl[1],qn.length>1?qn:'')}</p>`).join('')||'<p class="muted">(Página sin texto)</p>'}</article>`).join('')+(b<c.pages.length?`<button class="btn" data-more="1">Páginas siguientes</button>`:'');
  const t=$('#pg-'+LB.page); if(t){ const mk=$('mark',t); (mk||t).scrollIntoView({block:mk?'center':'start'}); }
  $('#rp').value=LB.page+1; };
 showPages();
 $('#rbody').addEventListener('click',e=>{ const p=e.target.closest('[data-p]'); if(p){ e.preventDefault(); LB.page=+p.dataset.p; showPages(); } const mo=e.target.closest('[data-more]'); if(mo){ LB.page=clamp(LB.page+(mo.dataset.more==='1'?12:-12),0,c.pages.length-1); showPages(); } });
 $('#rp').onchange=e=>{ LB.page=clamp((Number(e.target.value)||1)-1,0,c.pages.length-1); showPages(); };
 $('#rq').onkeydown=e=>{ if(e.key!=='Enter') return; LB.inq=e.target.value; const qn=norm(LB.inq.trim()); if(qn.length<2){ showPages(); return; }
  let start=LB.page+1; for(let k=0;k<c.pages.length;k++){ const p=(start+k)%c.pages.length; if(pageText(m.id,p,c.pages[p]).n.includes(qn)){ LB.page=p; showPages(); return; } } toast('Sin coincidencias en este manual.'); };
}
