/* ===== MANUALES: PDF original, texto buscable, OCR y traducción ===== */
const LB={open:null,page:0,q:'',inq:'',mode:null};
const BOOK_COLORS=['#7a3b2e','#2e4f7a','#3d6b3a','#6b4a8a','#8a6a2a','#2e6b6b','#7a2e55','#4a4a5e'];
const PDFJS='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
const loadScript=src=>new Promise((res,rej)=>{ if($(`script[src="${src}"]`)) return res(); const s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=()=>rej(new Error('No se pudo cargar '+src.split('/').pop())); document.head.append(s); });
let pdfReady=null;
const abs=p=>new URL(p,location.href).href;
function loadPdfJs(){
 if(window.pdfjsLib) return Promise.resolve(); if(pdfReady) return pdfReady;
 const viaCdn=async()=>{ await loadScript(PDFJS+'pdf.min.js'); await loadScript(PDFJS+'pdf.worker.min.js'); pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS+'pdf.worker.min.js'; };
 pdfReady=(async()=>{
  if(!window.claude&&location.protocol.startsWith('http')){ try{ const m=await import(abs('vendor/pdfjs/pdf.min.mjs')); m.GlobalWorkerOptions.workerSrc=abs('vendor/pdfjs/pdf.worker.min.mjs'); window.pdfjsLib=m; return; }catch(e){ console.warn(e); } }
  await viaCdn();
 })().catch(e=>{ pdfReady=null; throw e; });
 return pdfReady;
}
const pdfDocs=new Map();
const closeDoc=d=>{ try{ if(d.loadingTask) d.loadingTask.destroy(); else if(d.destroy) d.destroy(); }catch(e){} };
async function openPdf(id){
 if(pdfDocs.has(id)) return pdfDocs.get(id);
 const blob=await IDB.get(id,'pdfs'); if(!blob) return null;
 await loadPdfJs(); const doc=await pdfjsLib.getDocument({data:new Uint8Array(await blob.arrayBuffer()),isEvalSupported:false}).promise;
 pdfDocs.set(id,doc); if(pdfDocs.size>3){ const k=pdfDocs.keys().next().value; closeDoc(pdfDocs.get(k)); pdfDocs.delete(k); }
 return doc;
}
function detectLang(txt){ const t=' '+norm(txt.slice(0,30000)).replace(/[^a-zñ ]+/g,' ')+' '; const c=w=>t.split(' '+w+' ').length-1;
 const en=c('the')+c('and')+c('you')+c('with')+c('your')+c('this'), es=c('el')+c('la')+c('los')+c('que')+c('con')+c('una'); return en>es*1.2?'en':'es'; }
function linesToBlocks(lines,med){
 const out=[]; let para=null, prev=null;
 for(const l of lines){ if(/^\d{1,4}$/.test(l.text)) continue;
  const isH=l.size>=med*1.22&&l.text.length<90&&/\p{L}/u.test(l.text);
  if(isH){ if(para){ out.push(['p',para]); para=null; } const last=out[out.length-1];
   if(last&&last[0]==='h'&&prev&&prev.isH&&Math.abs(prev.y-l.y)<l.size*1.9) last[1]+=' '+l.text; else out.push(['h',l.text]);
   prev=Object.assign({},l,{isH:true}); continue; }
  const gap=prev?prev.y-l.y:0, brk=!para||!prev||prev.isH||gap>l.size*1.8||gap<-l.size*2;
  if(brk){ if(para) out.push(['p',para]); para=l.text; } else para=/[-‐]$/.test(para)?para.replace(/[-‐]$/,'')+l.text:para+' '+l.text;
  prev=l; }
 if(para) out.push(['p',para]); return out;
}
async function renderCover(doc){ try{ const pg=await doc.getPage(1); const v0=pg.getViewport({scale:1}); const vp=pg.getViewport({scale:320/v0.width});
 const cv=document.createElement('canvas'); cv.width=vp.width; cv.height=vp.height; await pg.render({canvas:cv,canvasContext:cv.getContext('2d'),viewport:vp}).promise; return cv.toDataURL('image/jpeg',.72); }catch(e){ return null; } }
async function parsePdf(file,prog){
 await loadPdfJs();
 const doc=await pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false}).promise;
 const cover=await renderCover(doc); const raw=[], sizes={};
 for(let i=1;i<=doc.numPages;i++){ const pg=await doc.getPage(i); const tc=await pg.getTextContent(); const lines=[]; let cur=null;
  const flush=()=>{ if(cur&&cur.text.trim()){ cur.text=cur.text.replace(/\s+/g,' ').trim(); lines.push(cur); const k=Math.round(cur.size); sizes[k]=(sizes[k]||0)+cur.text.length; } cur=null; };
  for(const it of tc.items){ if(typeof it.str!=='string') continue; const t=it.transform, size=Math.hypot(t[2],t[3])||it.height||10, x=t[4], y=t[5];
   if(it.str!==''){ if(cur&&Math.abs(y-cur.y)<Math.max(size,cur.size)*0.55){ const gap=x-cur.xe; cur.text+=(gap>size*0.12&&!/\s$/.test(cur.text)&&!/^\s/.test(it.str)?' ':'')+it.str; cur.xe=x+(it.width||0); cur.size=Math.max(cur.size,size); }
    else { flush(); cur={text:it.str,x,y,xe:x+(it.width||0),size}; } }
   if(it.hasEOL) flush(); }
  flush(); raw.push(lines); pg.cleanup(); prog(i/doc.numPages,`Leyendo página ${i} de ${doc.numPages}`);
  if(i%4===0) await new Promise(r=>setTimeout(r)); }
 const med=Number(Object.entries(sizes).sort((a,b)=>b[1]-a[1])[0]?.[0])||10;
 const pages=raw.map(ls=>linesToBlocks(ls,med));
 const ocrTodo=[]; pages.forEach((p,i)=>{ if(p.reduce((a,b)=>a+b[1].length,0)<25) ocrTodo.push(i); });
 closeDoc(doc);
 return {content:{v:2,pages,ocrTodo},cover};
}
function parseText(txt,md){
 const blocks=[]; let para=[]; const fl=()=>{ if(para.length){ blocks.push(['p',para.join(' ')]); para=[]; } };
 for(const ln of txt.split(/\r?\n/)){ const s=ln.trim(); if(!s){ fl(); continue; } const h=md&&s.match(/^#{1,4}\s+(.*)/); if(h){ fl(); blocks.push(['h',h[1]]); } else para.push(s.replace(/^[-*]\s+/,'• ')); }
 fl(); const pages=[]; let cur=[], n=0; for(const b of blocks){ cur.push(b); n+=b[1].length; if(n>3200){ pages.push(cur); cur=[]; n=0; } } if(cur.length) pages.push(cur);
 return {v:2,pages:pages.length?pages:[[['p','(vacío)']]],ocrTodo:[]};
}
function parseHTML(html){ const d=new DOMParser().parseFromString(html,'text/html'); const out=[];
 d.body.querySelectorAll('h1,h2,h3,h4,p,li,td').forEach(e=>{ const t=e.textContent.replace(/\s+/g,' ').trim(); if(t) out.push((/H\d/.test(e.tagName)?'# ':'')+t); out.push(''); });
 return parseText(out.join('\n'),true); }
async function importFiles(files,ui){
 try{ navigator.storage&&navigator.storage.persist&&navigator.storage.persist(); }catch(e){}
 for(const file of files){ const name=file.name.replace(/\.[^.]+$/,''); ui(0,`Abriendo ${file.name}…`);
  try{ let content, cover=null; const ext=(file.name.split('.').pop()||'').toLowerCase(); const isPdf=ext==='pdf'||file.type==='application/pdf';
   if(isPdf) ({content,cover}=await parsePdf(file,(p,t)=>ui(p,`${file.name}: ${t}`)));
   else if(ext==='html'||ext==='htm') content=parseHTML(await file.text());
   else if(['txt','md','markdown'].includes(ext)) content=parseText(await file.text(),ext!=='txt');
   else { toast(`${file.name}: solo se aceptan PDF, TXT, MD o HTML.`,'bad'); continue; }
   const all=content.pages.map(p=>p.map(b=>b[1]).join(' ')).join(' ');
   const meta={id:'man-'+uid(),title:name,pages:content.pages.length,chars:all.length,color:pick(BOOK_COLORS),added:Date.now(),file:file.name,size:file.size,cover,hasPdf:isPdf,lang:all.length>400?detectLang(all):null,ocr:content.ocrTodo.length?{done:0,total:content.ocrTodo.length}:null};
   ui(1,`${file.name}: guardando…`);
   if(isPdf&&!(await IDB.set(meta.id,file,'pdfs'))){ toast(`No hay espacio en el navegador para guardar el PDF de ${file.name}. Libera espacio o sube menos libros a la vez.`,'bad'); meta.hasPdf=false; }
   await IDB.set(meta.id,content); manualCache.set(meta.id,content);
   if(Store.assets&&!content.ocrTodo.length){ try{ const a=await Store.assets.upload(new Blob([JSON.stringify(content)],{type:'application/json'})); meta.assetId=a.id; meta.assetUrl=a.url; }catch(e){} }
   Store.put('manuals',meta);
   toast(meta.ocr?`${name}: ${meta.ocr.total} páginas sin texto. Las reconozco con OCR en segundo plano.`:`${name}: ${content.pages.length} páginas listas.`);
   if(meta.ocr) OCR.kick();
  }catch(e){ console.error(e); toast(`No pude leer ${file.name}: ${e.message||e}`,'bad'); } }
 ui(null);
}

/* OCR automático en segundo plano */
const OCR={
 running:false,worker:null,cur:null,
 async kick(){ if(this.running) return; this.running=true;
  try{ for(;;){ const m=Store.list('manuals').find(x=>x.ocr&&x.ocr.done<x.ocr.total&&x.hasPdf&&!x.ocrFail); if(!m) break; this.cur=m.id; await this.run(m); } }
  catch(e){ console.error(e); } finally{ this.running=false; this.cur=null; if(this.worker){ try{ await this.worker.terminate(); }catch(e){} this.worker=null; } }
 },
 async run(m){
  const content=await manualContent(m), doc=await openPdf(m.id); if(!content||!doc){ m.ocrFail=true; Store.put('manuals',m); return; }
  if(!this.worker){ try{ const local=!window.claude&&location.protocol.startsWith('http'); if(local){ await loadScript(abs('vendor/ocr/tesseract.min.js')); this.worker=await Tesseract.createWorker('spa',1,{workerPath:abs('vendor/ocr/worker.min.js'),corePath:abs('vendor/ocr'),langPath:abs('vendor/ocr'),gzip:true}); } else { await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js'); this.worker=await Tesseract.createWorker('spa+eng'); } }
   catch(e){ m.ocrFail=true; Store.put('manuals',m); toast('No pude iniciar el reconocimiento de texto (OCR). Funciona en la versión publicada en Cloudflare con conexión a internet.','bad'); return; } }
  const todo=content.ocrTodo||[];
  while(m.ocr.done<todo.length){ const i=todo[m.ocr.done];
   const pg=await doc.getPage(i+1); const v0=pg.getViewport({scale:1}); const vp=pg.getViewport({scale:Math.min(2.5,1700/v0.width)});
   const cv=document.createElement('canvas'); cv.width=vp.width; cv.height=vp.height; await pg.render({canvas:cv,canvasContext:cv.getContext('2d'),viewport:vp}).promise; pg.cleanup();
   const {data}=await this.worker.recognize(cv); cv.width=0;
   content.pages[i]=(data.text||'').split(/\n\s*\n/).map(p=>p.replace(/-\n/g,'').replace(/\s*\n\s*/g,' ').trim()).filter(p=>p.length>1).map(p=>['p',p]);
   normCache.delete(m.id+':'+i); m.ocr.done++;
   if(m.ocr.done%4===0||m.ocr.done===todo.length){ await IDB.set(m.id,content); if(!m.lang&&m.ocr.done>=3){ m.lang=detectLang(content.pages.map(p=>p.map(b=>b[1]).join(' ')).join(' ')); } m.chars=content.pages.reduce((s,p)=>s+p.reduce((a,b)=>a+b[1].length,0),0); Store.put('manuals',m); ocrUI(m); }
   if(!Store.get('manuals',m.id)) return; }
  toast(`${m.title}: reconocimiento de texto terminado.`);
 }
};
function ocrUI(m){ const el=$(`[data-ocr="${m.id}"]`); if(el) el.innerHTML=ocrLabel(m); }
const ocrLabel=m=>!m.ocr?'':m.ocrFail?'<span class="tag ix">OCR pendiente</span>':m.ocr.done<m.ocr.total?`<span class="tag ix">OCR ${m.ocr.done}/${m.ocr.total}</span>`:'<span class="tag">OCR listo</span>';

/* Traducción con el traductor integrado del navegador */
const TR={inst:{},
 supported:()=>'Translator' in self,
 async get(src,tgt,activate){ const k=src+'>'+tgt; if(this.inst[k]) return this.inst[k]; if(!this.supported()) throw new Error('nosupport');
  const a=await Translator.availability({sourceLanguage:src,targetLanguage:tgt}); if(a==='unavailable') throw new Error('nosupport'); if(a!=='available'&&!activate) throw new Error('activate');
  this.inst[k]=await Translator.create({sourceLanguage:src,targetLanguage:tgt,monitor(mo){ mo.addEventListener('downloadprogress',e=>{ const t=$('#trstat'); if(t) t.textContent=`Descargando traductor… ${Math.round(e.loaded*100)}%`; }); }});
  return this.inst[k]; },
 async page(id,p,blocks,activate){ const key=id+':'+p; const c=await IDB.get(key,'trans'); if(c) return c;
  const tr=await this.get('en','es',activate); const out=[];
  for(const [t,s] of blocks){ let r=s; try{ r=await tr.translate(s); }catch(e){} out.push([t,r]); }
  await IDB.set(key,out,'trans'); return out; }
};

/* Búsqueda */
const normCache=new Map();
function pageText(id,p,blocks){ const k=id+':'+p; let v=normCache.get(k); if(!v){ const raw=blocks.map(b=>b[1]).join('\n'); v={raw,n:norm(raw)}; normCache.set(k,v); } return v; }
function hl(text,qn){ if(!qn) return esc(text); const n=norm(text); let out='',i=0,j; while((j=n.indexOf(qn,i))>=0){ out+=esc(text.slice(i,j))+'<mark>'+esc(text.slice(j,j+qn.length))+'</mark>'; i=j+qn.length; } return out+esc(text.slice(i)); }
async function searchManuals(q,limit=80){
 const qn=norm(q.trim()); if(qn.length<2) return [];
 let qEn=null; if(Store.list('manuals').some(m=>m.lang==='en')){ try{ const t=await TR.get('es','en',false); const r=norm((await t.translate(q.trim())).trim()); if(r&&r!==qn) qEn=r; }catch(e){} }
 const hits=[];
 for(const m of Store.list('manuals')){ const c=await manualContent(m); if(!c) continue; const terms=m.lang==='en'&&qEn?[qn,qEn]:[qn];
  for(let p=0;p<c.pages.length&&hits.length<limit;p++){ const t=pageText(m.id,p,c.pages[p]);
   for(const term of terms){ let j=t.n.indexOf(term), per=0;
    while(j>=0&&per<2&&hits.length<limit){ const a=Math.max(0,j-90), b=Math.min(t.raw.length,j+term.length+120); hits.push({m,p,term,snip:(a?'…':'')+t.raw.slice(a,b).replace(/\n/g,' ')+(b<t.raw.length?'…':'')}); per++; j=t.n.indexOf(term,j+term.length+200); } } } }
 return hits;
}

/* Vista de la biblioteca */
function vBiblioteca(v){
 viewDeps=['manuals'];
 const m=LB.open&&Store.get('manuals',LB.open); if(m) return vReader(v,m);
 const l=Store.list('manuals').sort((a,b)=>b.added-a.added);
 v.innerHTML=`<div class="wrap"><div style="--i:0"><span class="eyebrow">Wiki</span><h2 class="h1">Manuales</h2><p class="muted" style="margin:6px 0 0;max-width:70ch">Sube tus PDF y se ven tal cual son, con sus ilustraciones. Además se indexa el texto para buscar, los escaneados se reconocen con OCR automático y los que están en inglés se pueden leer traducidos.</p></div>
 <div class="cols2" style="--i:1;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr)">
  <div class="drop" id="drop" tabindex="0" role="button" aria-label="Subir manuales">${I.upload}<div class="h3">Subir manuales</div><div class="muted" style="font-size:.9rem">Arrastra PDF, TXT, MD o HTML, o haz clic para elegirlos. Mejor de a 5 o 10 por vez.</div><input type="file" id="fin" accept=".pdf,.txt,.md,.markdown,.html,.htm" multiple hidden><div id="pg" hidden><div class="prog"><i id="pgb"></i></div><small class="muted" id="pgt"></small></div></div>
  <div class="panel"><h3 class="h3" style="margin-bottom:8px">Buscar en todos los manuales</h3><div class="search" style="max-width:none">${I.search}<input class="inp" id="lq" placeholder="Ej.: agarre, bola de fuego, cobertura…" value="${esc(LB.q)}" aria-label="Buscar en manuales"></div><div id="lres" style="display:flex;flex-direction:column;gap:8px;margin-top:10px;max-height:420px;overflow:auto"></div></div>
 </div>
 ${l.length?`<div class="books" style="--i:2">${l.map((b,i)=>`<div class="bookc" data-b="${b.id}" style="animation:rise .5s ${Math.min(i,20)*40}ms var(--ease) both">
   <div class="cover">${b.cover?`<img src="${b.cover}" alt="" loading="lazy">`:`<div class="spine" style="background:linear-gradient(135deg,${b.color},${b.color}aa)">${esc(b.title[0]||'?')}</div>`}<span class="lang">${b.lang==='en'?'EN':b.lang==='es'?'ES':''}</span></div>
   <div class="bt">${esc(b.title)}</div><div class="muted mono" style="font-size:.74rem">${b.pages} pág.${b.size?` · ${(b.size/1048576).toFixed(0)} MB`:''}</div>
   <div class="row" style="gap:4px;margin-top:4px" data-ocr="${b.id}">${ocrLabel(b)}</div>
   <div class="bacts"><button class="btn sm icon" data-ren="${b.id}" title="Renombrar" aria-label="Renombrar">${I.edit}</button><button class="btn sm icon danger" data-del="${b.id}" title="Quitar" aria-label="Quitar">${I.trash}</button></div></div>`).join('')}</div>`
 :`<div class="empty" style="--i:2"><div class="h3">La biblioteca está vacía</div>Sube el Manual del Jugador, la Guía del DM o tus suplementos.</div>`}</div>`;
 const drop=$('#drop'), fin=$('#fin');
 const ui=(p,t)=>{ const g=$('#pg'); if(!g) return; if(p==null){ g.hidden=true; render(true); return; } g.hidden=false; $('#pgb').style.width=(p*100)+'%'; $('#pgt').textContent=t||''; };
 drop.onclick=()=>fin.click(); drop.onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); fin.click(); } };
 fin.onchange=()=>{ if(fin.files.length) importFiles([...fin.files],ui); };
 drop.ondragover=e=>{e.preventDefault();drop.classList.add('over')}; drop.ondragleave=()=>drop.classList.remove('over');
 drop.ondrop=e=>{ e.preventDefault(); drop.classList.remove('over'); if(e.dataTransfer.files.length) importFiles([...e.dataTransfer.files],ui); };
 let tok=0; const doSearch=async()=>{ const my=++tok; const r=$('#lres'); if(!r) return; if(LB.q.trim().length<2){ r.innerHTML=`<span class="muted" style="font-size:.9rem">${l.length?'Escribe al menos 2 letras. En los manuales en inglés también busca la traducción.':'Sube un manual para empezar a buscar.'}</span>`; return; }
  r.innerHTML='<span class="muted">Buscando…</span>'; const hits=await searchManuals(LB.q); if(my!==tok) return;
  r.innerHTML=hits.length?hits.map((h,i)=>`<div class="hit" data-h="${i}"><small>${esc(h.m.title)} · pág. ${h.p+1}</small><div style="font-size:.92rem">${hl(h.snip,h.term)}</div></div>`).join(''):'<span class="muted">Sin coincidencias.</span>';
  r.onclick=e=>{ const x=e.target.closest('[data-h]'); if(!x) return; const h=hits[+x.dataset.h]; LB.open=h.m.id; LB.page=h.p; LB.inq=h.term; LB.mode=null; render(); }; };
 $('#lq').oninput=e=>{ LB.q=e.target.value; debounce('lq',doSearch,250); }; doSearch();
 v.onclick=e=>{ const d=e.target.closest('[data-del]'), rn=e.target.closest('[data-ren]'), b=e.target.closest('[data-b]');
  if(d){ e.stopPropagation(); const mm=Store.get('manuals',d.dataset.del); confirmBox(`¿Quitar "${mm.title}" de la biblioteca?`,()=>{ IDB.del(mm.id); IDB.del(mm.id,'pdfs'); IDB.delPrefix(mm.id+':','trans'); manualCache.delete(mm.id); pdfDocs.delete(mm.id); if(mm.assetId&&Store.assets) Store.assets.delete(mm.assetId).catch(()=>{}); Store.del('manuals',mm.id); render(true); },'Quitar'); return; }
  if(rn){ e.stopPropagation(); const mm=Store.get('manuals',rn.dataset.ren); const md=modal({title:'Renombrar manual',body:fld('Título','title',mm.title),foot:'<button class="btn pri" data-s>Guardar</button>'}); $('[data-s]',md.el).onclick=()=>{ mm.title=vals(md.el).title||mm.title; Store.put('manuals',mm); md.close(); render(true); }; return; }
  if(b){ LB.open=b.dataset.b; LB.page=0; LB.inq=''; LB.mode=null; render(); } };
}

/* Lector */
let readerObs=null;
async function vReader(v,m){
 const content=await manualContent(m);
 if(route!=='biblioteca'||LB.open!==m.id) return;
 const hasPdf=m.hasPdf&&!!(await IDB.get(m.id,'pdfs'));
 const modes=[...(hasPdf?[['pdf','PDF original']]:[]),...(hasPdf&&m.lang==='en'?[['dual','PDF + traducción']]:[]),['text','Texto'],...(m.lang==='en'?[['trans','Traducción']]:[])];
 if(!LB.mode||!modes.find(x=>x[0]===LB.mode)) LB.mode=hasPdf?(m.lang==='en'?'dual':'pdf'):(m.lang==='en'?'trans':'text');
 v.innerHTML=`<div class="rbar"><button class="btn ghost" id="rback">${I.back} Manuales</button><h2 class="h2" style="flex:1;min-width:180px;overflow-wrap:anywhere">${esc(m.title)}</h2>
  <div class="seg">${modes.map(([k,t])=>`<button data-mode="${k}" class="${LB.mode===k?'on':''}">${t}</button>`).join('')}</div>
  <div class="search" style="max-width:240px">${I.search}<input class="inp" id="rq" placeholder="Buscar en este manual" value="${esc(LB.inq)}" aria-label="Buscar en este manual"></div>
  <div class="row" style="gap:6px;flex-wrap:nowrap"><input class="inp mono" id="rp" type="number" min="1" max="${m.pages}" value="${LB.page+1}" style="width:84px" aria-label="Ir a página"><span class="muted mono">/ ${m.pages}</span></div>
  ${LB.mode==='pdf'||LB.mode==='dual'?`<div class="row" style="gap:4px;flex-wrap:nowrap"><button class="btn sm icon" id="zo" aria-label="Alejar">−</button><button class="btn sm icon" id="zi" aria-label="Acercar">+</button></div>`:''}</div>
  ${!hasPdf&&m.hasPdf===undefined?`<div class="ixnote" style="margin-bottom:14px">Este manual se subió con la versión anterior y no guardó el PDF original. Quítalo y vuelve a subirlo para verlo con sus imágenes.</div>`:''}
  ${m.ocr&&m.ocr.done<m.ocr.total?`<div class="ixnote" style="margin-bottom:14px">Reconociendo texto con OCR: <span data-ocr="${m.id}">${ocrLabel(m)}</span>. Puedes leer el PDF mientras tanto; la búsqueda mejora a medida que avanza.</div>`:''}
  <div id="trstat" class="muted" style="font-size:.85rem;margin-bottom:8px"></div>
  <div class="reader"><nav class="toc" aria-label="Índice" id="rtoc"></nav><div id="rpages"></div></div>`;
 $('#rback').onclick=()=>{ LB.open=null; render(); };
 if(!content){ $('#rpages').innerHTML=`<div class="empty"><div class="h3">El contenido no está en este dispositivo</div>Vuelve a subir el archivo aquí.</div>`; return; }
 const toc=[]; content.pages.forEach((p,i)=>p.forEach(b=>{ if(b[0]==='h'&&toc.length<500) toc.push([i,b[1]]); }));
 $('#rtoc').innerHTML=toc.length?toc.map(t=>`<a href="#" data-p="${t[0]}">${esc(t[1].slice(0,70))}<span class="muted mono" style="font-size:.72rem"> ${t[0]+1}</span></a>`).join(''):'<span class="muted" style="font-size:.85rem">Sin índice detectado. Usa el número de página.</span>';
 $$('[data-mode]',v).forEach(b=>b.onclick=()=>{ LB.mode=b.dataset.mode; render(true); });
 if(LB.mode==='pdf'||LB.mode==='dual') await pdfMode(m,content); else textMode(m,content);
 $('#rtoc').onclick=e=>{ const p=e.target.closest('[data-p]'); if(p){ e.preventDefault(); goPage(+p.dataset.p); } };
 $('#rp').onchange=e=>goPage(clamp((Number(e.target.value)||1)-1,0,m.pages-1));
 $('#rq').onkeydown=e=>{ if(e.key!=='Enter') return; LB.inq=e.target.value; const qn=norm(LB.inq.trim()); if(qn.length<2) return;
  for(let k=1;k<=content.pages.length;k++){ const p=(LB.page+k)%content.pages.length; if(pageText(m.id,p,content.pages[p]).n.includes(qn)){ goPage(p); return; } } toast('Sin coincidencias en este manual.'); };
 cleanup=()=>{ if(readerObs){ readerObs.disconnect(); readerObs=null; } };
}
let goPage=()=>{};
const scrollToEl=(el,center)=>{ const off=($('.top')?.offsetHeight||66)+($('.rbar')?.offsetHeight||60)+12; const r=el.getBoundingClientRect(); scrollTo(0,r.top+scrollY-(center?innerHeight/2-r.height/2:off)); };
function textMode(m,content){
 const trans=LB.mode==='trans'; const box=$('#rpages'); const qn=()=>{ const q=norm(LB.inq.trim()); return q.length>1?q:''; };
 box.innerHTML=content.pages.map((p,i)=>`<article class="page" id="pg-${i}" data-i="${i}"><div class="pn">Página ${i+1}</div><div class="pb">${trans?'<p class="muted">Traduciendo…</p>':p.map(bl=>bl[0]==='h'?`<h3>${hl(bl[1],qn())}</h3>`:`<p>${hl(bl[1],qn())}</p>`).join('')||'<p class="muted">(Página sin texto)</p>'}</div></article>`).join('');
 goPage=p=>{ LB.page=p; $('#rp').value=p+1; const t=$('#pg-'+p); if(t){ const mk=$('mark',t); scrollToEl(mk||t,!!mk); } };
 if(trans) observePages(m,content,async(el,i)=>{ await fillTrans(m,content,i,$('.pb',el)); });
 else observePages(m,content,()=>{});
 requestAnimationFrame(()=>goPage(LB.page));
}
async function fillTrans(m,content,i,box){
 if(box.dataset.done) return; box.dataset.done='1';
 try{ const out=await TR.page(m.id,i,content.pages[i],false); box.innerHTML=out.map(b=>b[0]==='h'?`<h3>${esc(b[1])}</h3>`:`<p>${esc(b[1])}</p>`).join('')||'<p class="muted">(Página sin texto)</p>'; }
 catch(e){ delete box.dataset.done;
  if(e.message==='activate'){ box.innerHTML=`<p class="muted">La traducción necesita descargar el traductor del navegador una sola vez.</p><button class="btn pri sm" data-act>${I.sparkle} Activar traducción</button>`;
   $('[data-act]',box).onclick=async()=>{ try{ $('#trstat').textContent='Preparando el traductor…'; await TR.get('en','es',true); $('#trstat').textContent=''; render(true); }catch(err){ $('#trstat').textContent='No se pudo activar el traductor.'; } }; }
  else box.innerHTML=`<p class="muted">Tu navegador no tiene traductor integrado. Usa Chrome o Edge en computadora (versión 138 o posterior) para la traducción automática.</p>`; }
}
function observePages(m,content,onShow){
 if(readerObs) readerObs.disconnect();
 readerObs=new IntersectionObserver(es=>{ for(const e of es){ const i=+e.target.dataset.i; if(e.isIntersecting){ onShow(e.target,i,true); if(e.intersectionRatio>0&&Math.abs(e.boundingClientRect.top)<innerHeight/2){ LB.page=i; const rp=$('#rp'); if(rp) rp.value=i+1; } } else onShow(e.target,i,false); } },{rootMargin:'1200px 0px'});
 $$('#rpages [data-i]').forEach(el=>readerObs.observe(el));
}
let pdfZoom=1;
async function pdfMode(m,content){
 const box=$('#rpages'); box.innerHTML='<div class="muted">Abriendo el PDF…</div>';
 let doc; try{ doc=await openPdf(m.id); }catch(e){ box.innerHTML=`<div class="empty">No pude abrir el PDF: ${esc(e.message||e)}</div>`; return; }
 if(!doc||route!=='biblioteca'||LB.open!==m.id) return;
 const p1=await doc.getPage(1); const v1=p1.getViewport({scale:1}); const ratio=v1.height/v1.width;
 const dual=LB.mode==='dual'; box.classList.toggle('isdual',dual);
 const width=()=>Math.min(dual?620:900,(box.clientWidth||800)*(dual?.55:1))*pdfZoom;
 box.innerHTML=Array.from({length:doc.numPages},(_,i)=>`<div class="pdfrow ${dual?'dual':''}" id="pg-${i}" data-i="${i}"><div class="pdfp" style="width:${width()}px;aspect-ratio:${1/ratio}"><canvas width="0" height="0"></canvas><span class="pn2">${i+1}</span></div>${dual?'<div class="pg-tr pb"><p class="muted">Traduciendo…</p></div>':''}</div>`).join('');
 const rendering=new Map();
 const show=async(el,i,on)=>{ const pp=$('.pdfp',el), cv=$('canvas',pp);
  if(!on){ if(cv.dataset.r&&!rendering.has(i)){ cv.width=0; cv.height=0; delete cv.dataset.r; } return; }
  if(dual) fillTrans(m,content,i,$('.pg-tr',el));
  if(cv.dataset.r||rendering.has(i)) return; rendering.set(i,1);
  try{ const pg=await doc.getPage(i+1); const v0=pg.getViewport({scale:1}); const w=pp.clientWidth||width(); const dpr=Math.min(devicePixelRatio||1,2); const vp=pg.getViewport({scale:w*dpr/v0.width});
   pp.style.aspectRatio=v0.width/v0.height; cv.width=vp.width; cv.height=vp.height; await pg.render({canvas:cv,canvasContext:cv.getContext('2d'),viewport:vp}).promise; cv.dataset.r='1'; pg.cleanup(); }
  catch(e){ console.error('render',e); } finally{ rendering.delete(i); } };
 observePages(m,content,show);
 goPage=p=>{ LB.page=p; $('#rp').value=p+1; const t=$('#pg-'+p); if(t) scrollToEl(t); };
 const rezoom=f=>{ pdfZoom=clamp(pdfZoom*f,.5,3); const cur=LB.page; $$('.pdfp',box).forEach(pp=>{ pp.style.width=width()+'px'; const cv=$('canvas',pp); cv.width=0; cv.height=0; delete cv.dataset.r; }); observePages(m,content,show); goPage(cur); };
 $('#zi')&&($('#zi').onclick=()=>rezoom(1.2)); $('#zo')&&($('#zo').onclick=()=>rezoom(1/1.2));
 requestAnimationFrame(()=>goPage(LB.page));
}
