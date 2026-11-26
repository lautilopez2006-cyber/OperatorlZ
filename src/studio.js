/* ===== Estudio de mapas · motor: capas, pintura, costas, objetos, vectores, filtros y render ===== */
const SLV={
 global:{n:'Global',desc:'Continentes, mares e islas',W:2400,H:1600,bg:'mar',grid:{type:'hex',size:48,op:.14},scale:50,unit:'km',side:1,tex:'pradera',mul:1,L:'g'},
 nacional:{n:'Nacional',desc:'Un reino o región: pueblos, bosques y caminos',W:2400,H:1600,bg:'mar',grid:{type:'hex',size:48,op:.14},scale:5,unit:'km',side:1,tex:'pradera',mul:1.45,L:'n'},
 ciudad:{n:'Ciudad',desc:'Ciudades, aldeas y distritos vistos desde arriba',W:40*48,H:30*48,bg:'mar',grid:{type:'sq',size:48,op:.16},scale:5,unit:'m',side:0,tex:'cesped',mul:1,tmul:.35,L:'c'},
 minimo:{n:'Mínimo',desc:'Batallas, claros, tabernas e interiores',W:30*64,H:22*64,bg:'mar',grid:{type:'sq',size:64,op:.28},scale:1.5,unit:'m',side:0,tex:'cesped',mul:1,L:'m'},
 mazmorra:{n:'Mazmorra',desc:'Mazmorras, cuevas, criptas y guaridas',W:34*56,H:26*56,bg:'roca',grid:{type:'sq',size:56,op:.3},scale:1.5,unit:'m',side:0,tex:'mazmorra',mul:1,L:'d'}
};
const LOOKS={natural:['Natural','none'],vivo:['Vivo','saturate(1.28) contrast(1.06)'],pergamino:['Pergamino','sepia(.45) saturate(.85) contrast(.96)'],antiguo:['Antiguo','sepia(.85) contrast(.92) brightness(1.02)'],frio:['Invernal','saturate(.8) hue-rotate(-12deg) brightness(1.04)'],noche:['Noche','brightness(.62) saturate(.7) contrast(1.08)']};
const BLENDS=[['source-over','Normal'],['multiply','Multiplicar'],['screen','Trama'],['overlay','Superponer'],['soft-light','Luz suave'],['hard-light','Luz fuerte'],['darken','Oscurecer'],['lighten','Aclarar'],['color','Color'],['luminosity','Luminosidad'],['color-burn','Subexponer'],['color-dodge','Sobreexponer']];
const FPRESETS={ninguno:['Sin preset','',null],pergamino:['Pergamino','sepia(.45) saturate(.85)',['#c8a066','soft-light',.3]],noche:['Luz de luna','brightness(.68) saturate(.7) contrast(1.1)',['#3a5aa0','multiply',.5]],calido:['Cálido','saturate(1.1)',['#ff9a40','soft-light',.4]],frio:['Frío','saturate(.85)',['#5aa0ff','soft-light',.4]],nublado:['Nublado','saturate(.6) brightness(.92) contrast(.9)',['#9aa0a8','soft-light',.35]],atardecer:['Atardecer','saturate(1.15)',['#ff6a3a','overlay',.3]],sangre:['Infernal','saturate(1.2) contrast(1.05)',['#b01a1a','overlay',.3]]};
const FTEX={ninguna:'Ninguna',papel:'Papel envejecido',grano:'Grano',manchas:'Manchas'};
const SD={map:null,R:{},terr:null,tg:null,coastU:null,coastO:null,cs:1,view:{x:0,y:0,z:.5},cv:null,ctx:null,dpr:1,raf:0,drag:null,ptrs:new Map(),pinch:null,sel:[],undo:[],redo:[],upx:0,hover:null,space:false,tab:'tool',buf:null,before:null,coastT:0,saveT:0,terrT:0,dirtyR:new Set(),loading:false,activeL:null,player:false,off:{},saved:true};
const SB=Object.assign({tool:'terreno',tex:{},size:90,soft:.55,op:1,rough:.35,erase:false,blend:'source-over',tsc:1,trot:0,coastLand:true,landPoly:false,stamp:{},smul:1,srand:.25,smin:.8,smax:1.2,srot:false,sflip:true,smode:'place',dens:.5,srad:120,path:{},pw:{},
 text:{font:'Cinzel',size:42,color:'#2a2018',halo:1,hc:'#f3ead6',hw:1,sp:4,curve:0,up:true,it:false,b:true,lh:1.15,ts:0,o:1},shape:{sw:4,sc:'#2a2018',stex:'',dash:'solid',cap:'round',son:true,fon:true,fc:'#4a86b4',ftex:'',fo:1},
 pin:{},note:{icon:'punto',dm:true,col:'#d6a44c'},allTex:false,cat:{},favs:[],q:'',app:{}},lsGet('oz:studio',{}));
const sbSave=()=>lsSet('oz:studio',SB);
const LVK=m=>SLV[m.level]||SLV.global;
const gridColor=m=>m.grid.color||((m.bg==='roca'||m.bg==='vacio'||m.bg==='lava')?'#ffffff':'#1a120c');
const isSide=m=>!!LVK(m).side;

/* ---------- Documento y capas ---------- */
function ensureV3(m){ m.stamps=m.stamps||[]; m.paths=m.paths||[]; m.labels=m.labels||[]; m.pins=m.pins||[]; m.shapes=m.shapes||[]; m.fx=m.fx||{}; m.layers=m.layers||{}; m.coast=m.coast||{};
 m.grid=Object.assign({on:true,type:'sq',size:64,op:.3,lw:1,ox:0,oy:0,snap:false},m.grid||{});
 if(!m.L){ m.L=[{id:'land',type:'brush',land:1,name:'Tierra y costa',op:1,blend:'source-over'},{id:'obj',type:'object',name:'Objetos',op:1,blend:'source-over',shadow:{on:0,x:10,y:14,b:12,c:'#000000',a:.5}}];
  if(m.layers.terreno) m.L[0].hid=1; if(m.layers.objetos) m.L[1].hid=1; }
 if(!m.L.some(l=>l.type==='object')) m.L.push({id:'obj',type:'object',name:'Objetos',op:1,blend:'source-over',shadow:{on:0,x:10,y:14,b:12,c:'#000000',a:.5}});
 if(!m.L.some(l=>l.land)) m.L.unshift({id:'land',type:'brush',land:1,name:'Tierra y costa',op:1,blend:'source-over'});
 m.pins.forEach(p=>{ if(p.dm==null) p.dm=true; }); return m; }
const objLayers=m=>m.L.filter(l=>l.type==='object');
const defObj=m=>objLayers(m)[0].id;
const lyOf=(m,e)=>e.ly&&m.L.some(l=>l.id===e.ly&&l.type==='object')?e.ly:defObj(m);
const rKey=(m,L)=>L.land?m.id:m.id+':'+L.id;
const sysHidden=k=>!!(SD.map&&SD.map.layers[k]);
const activeObj=()=>{ const m=SD.map, L=m.L.find(l=>l.id===SD.activeL); return L&&L.type==='object'?L.id:(SD.lastObj&&m.L.some(l=>l.id===SD.lastObj)?SD.lastObj:defObj(m)); };
const activeBrush=()=>{ const m=SD.map, L=m.L.find(l=>l.id===SD.activeL); return L&&(L.type==='brush'||L.type==='mask')?L:m.L.find(l=>l.land); };
function newRasters(m){ SD.R={}; for(const L of m.L) if(L.type==='brush'||L.type==='mask') SD.R[L.id]=mkC(m.w,m.h); SD.terr=SD.R.land||SD.R[m.L.find(l=>l.land).id]; SD.tg=SD.terr.getContext('2d'); SD.buf=mkC(m.w,m.h); SD.before=mkC(m.w,m.h); SD.coastU=null; SD.coastO=null; SD.gridC=null; }
const newTerrain=m=>{ ensureV3(m); newRasters(m); };
async function loadTerrain(m){ newRasters(m); SD.loading=true;
 for(const L of m.L){ if(L.type!=='brush'&&L.type!=='mask') continue; const b=await IDB.get(rKey(m,L),'maps'); if(b){ try{ const bmp=await createImageBitmap(b); SD.R[L.id].getContext('2d').drawImage(bmp,0,0,m.w,m.h); }catch(e){ console.warn(e); } } else if(L.type==='mask'&&L.start==='full'){ const g=SD.R[L.id].getContext('2d'); g.fillRect(0,0,m.w,m.h); } }
 SD.loading=false; computeCoast(); draw(); }
function rDirty(id){ SD.dirtyR.add(id||'land'); saveTerrain(); }
function setSaved(v){ SD.saved=v; const el=$('#stSave'); if(el){ el.textContent=v?'Guardado':'Guardando…'; el.classList.toggle('busy',!v); } }
function saveTerrain(ms=1200){ clearTimeout(SD.terrT); const m=SD.map; setSaved(false); SD.terrT=setTimeout(()=>flushRasters(m),ms); }
function flushRasters(m){ if(!m||SD.map!==m){ return; } const ids=[...SD.dirtyR]; SD.dirtyR.clear(); let n=ids.length; if(!n){ makeThumb(); setSaved(true); return; }
 for(const id of ids){ const L=m.L.find(l=>l.id===id), c=SD.R[id]; if(!L||!c){ if(!--n) setSaved(true); continue; } c.toBlob(b=>{ if(b) IDB.set(rKey(m,L),b,'maps'); if(!--n){ makeThumb(); setSaved(true); } },'image/webp',.92); } }
function saveDoc(ms=500){ clearTimeout(SD.saveT); const m=SD.map; setSaved(false); SD.saveT=setTimeout(()=>{ if(m){ Store.put('maps',m); if(SD.map===m&&!SD.dirtyR.size) setSaved(true); } },ms); }

/* ---------- Distancias exactas (Felzenszwalb) para costas y muros ---------- */
function edt1(f,n,d,v,z){ let k=0; v[0]=0; z[0]=-1e20; z[1]=1e20;
 for(let q=1;q<n;q++){ let s=((f[q]+q*q)-(f[v[k]]+v[k]*v[k]))/(2*q-2*v[k]); while(s<=z[k]){ k--; s=((f[q]+q*q)-(f[v[k]]+v[k]*v[k]))/(2*q-2*v[k]); } k++; v[k]=q; z[k]=s; z[k+1]=1e20; }
 k=0; for(let q=0;q<n;q++){ while(z[k+1]<q) k++; const dq=q-v[k]; d[q]=dq*dq+f[v[k]]; } }
function edt(mask,W,H,val){ const g=new Float32Array(W*H), N=Math.max(W,H), f=new Float32Array(N), d=new Float32Array(N), v=new Int32Array(N), z=new Float32Array(N+1);
 for(let i=0;i<W*H;i++) g[i]=mask[i]===val?0:1e10;
 for(let x=0;x<W;x++){ for(let y=0;y<H;y++) f[y]=g[y*W+x]; edt1(f,H,d,v,z); for(let y=0;y<H;y++) g[y*W+x]=d[y]; }
 for(let y=0;y<H;y++){ const o=y*W; for(let x=0;x<W;x++) f[x]=g[o+x]; edt1(f,W,d,v,z); for(let x=0;x<W;x++) g[o+x]=Math.sqrt(d[x]); }
 return g; }
const h2a=h=>hex2rgb(h||'#000000');
function computeCoast(){ const m=SD.map; if(!m||!SD.terr) return; const s=SD.cs=Math.min(1,1800/Math.max(m.w,m.h)), W=Math.round(m.w*s), H=Math.round(m.h*s);
 const t=mkC(W,H), tg=t.getContext('2d'); tg.drawImage(SD.terr,0,0,W,H); const a=tg.getImageData(0,0,W,H).data, mask=new Uint8Array(W*H);
 let land=0; for(let i=0;i<W*H;i++){ if(a[i*4+3]>110){ mask[i]=1; land++; } }
 SD.coastU=mkC(W,H); SD.coastO=mkC(W,H); SD.coastV=(SD.coastV||0)+1; if(!land||land===W*H){ draw(); return; }
 const dW=edt(mask,W,H,1), dL=edt(mask,W,H,0), B=BGS[m.bg]||BGS.mar, U=new ImageData(W,H), O=new ImageData(W,H), u=U.data, o=O.data, C=m.coast, fxS=m.fx||{};
 const sm=(e0,e1,x)=>{ const t=clamp((x-e0)/(e1-e0),0,1); return t*t*(3-2*t); };
 const put=(D,i,c,al)=>{ if(al<=0) return; const k=i*4, a0=D[k+3]/255, A=al+a0*(1-al); if(A<=0) return; for(let j=0;j<3;j++) D[k+j]=(c[j]*al+D[k+j]*a0*(1-al))/A; D[k+3]=A*255; };
 const inkC=C.sc?h2a(C.sc):(B.ink||[30,30,30]), sw=C.sw??2.6, ringC=C.rc?h2a(C.rc):(B.ring||[230,245,255]), rOp=C.ro??1, nR=C.rip??(fxS.rings===false?0:4), glow=C.glow??1, beach=C.beach??(fxS.beach!==false), ish=C.ish??1;
 const RINGS=[[10,.55],[21,.38],[34,.22],[50,.12],[68,.08],[90,.05]].slice(0,nR), PR=[[7,.6],[14,.42],[22,.28],[31,.16],[42,.1],[55,.06]].slice(0,nR);
 for(let i=0;i<W*H;i++){ const av=a[i*4+3]/255;
  if(!mask[i]){ const d=Math.max(0,dW[i]-.5-av*.9)/s;
   if(B.wall){ put(u,i,[78,74,72],(1-sm(0,16,d))*.85*glow); if(d<sw*1.6) put(o,i,C.sc?inkC:[12,10,10],1-sm(sw*1.2,sw*1.6,d)); }
   else if(B.paper){ for(const [r,al] of PR) put(u,i,ringC,Math.max(0,1-Math.abs(d-r)*s/1.05)*al*rOp); if(d<sw) put(o,i,inkC,1-sm(sw*.55,sw,d)); }
   else { const t=sm(0,fxS.depth??120,d); put(u,i,B.shallow,(1-t)*.6*glow); put(u,i,B.deep,t*.38);
    for(const [r,al] of RINGS) put(u,i,ringC,Math.max(0,1-Math.abs(d-r)*s/1.15)*al*rOp);
    if(B.lavaGlow) put(u,i,[255,150,60],(1-sm(0,30,d))*.7*glow);
    if(d<sw) put(o,i,inkC,1-sm(sw*.58,sw,d)); } }
  else { const d=Math.max(0,dL[i]-.5-(1-av)*.9)/s;
   if(B.wall){ put(o,i,[0,0,0],Math.pow(1-sm(0,18,d),1.6)*.55*ish); if(d<1.2) put(o,i,C.sc?inkC:[12,10,10],1-sm(.4,1.2,d)); }
   else { if(B.rim&&beach) put(o,i,B.rim,(1-sm(0,7,d))*.55); if(d<1.1) put(o,i,inkC,(1-sm(.2,1.1,d))*.8); put(o,i,[0,0,0],(1-sm(0,9,d))*.12*ish); } } }
 SD.coastU.getContext('2d').putImageData(U,0,0); SD.coastO.getContext('2d').putImageData(O,0,0); draw(); }
function coastSoon(ms=280){ clearTimeout(SD.coastT); SD.coastT=setTimeout(computeCoast,ms); }

/* ---------- Pinceles ---------- */
const MASKC={}; let NOISEA=null;
function noiseAlpha(){ if(NOISEA) return NOISEA; const T=256, N=sfbm(T,srng(77),[6,16,48],[1,.5,.35]), c=mkC(T,T), g=c.getContext('2d'), img=g.createImageData(T,T);
 for(let i=0;i<T*T;i++){ img.data[i*4+3]=clamp((N[i]-.35)*2.2,0,1)*255; } g.putImageData(img,0,0); return NOISEA=c; }
function softMask(r,h){ r=Math.max(1,Math.round(r)); const key=r+'|'+Math.round(h*20); if(MASKC[key]) return MASKC[key]; const c=mkC(2*r,2*r), g=c.getContext('2d');
 const gr=g.createRadialGradient(r,r,0,r,r,r); gr.addColorStop(0,'#000'); gr.addColorStop(clamp(h,0,.97),'#000'); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.fillRect(0,0,2*r,2*r); return MASKC[key]=c; }
let DAB=null, DABT=null;
function dabMask(r){ const base=softMask(r,SB.soft*.9); if(SB.rough<=.02) return base; const S=Math.ceil(2*r); if(!DAB||DAB.width<S) DAB=mkC(S,S); const g=DAB.getContext('2d'); g.setTransform(1,0,0,1,0,0); g.globalCompositeOperation='source-over'; g.clearRect(0,0,DAB.width,DAB.height);
 g.drawImage(base,0,0,S,S); g.globalCompositeOperation='destination-out'; g.globalAlpha=SB.rough; const n=noiseAlpha(), sc=Math.max(.6,S/180); g.save(); g.translate(Math.random()*-200,Math.random()*-200); g.scale(sc,sc); g.drawImage(n,0,0); g.drawImage(n,256,0); g.drawImage(n,0,256); g.drawImage(n,256,256); g.restore(); g.globalAlpha=1;
 g.globalCompositeOperation='source-over'; g.drawImage(softMask(r*.55,.7),S/2-r*.55,S/2-r*.55); return DAB; }
function strokePattern(tex){ if(!DABT) DABT=mkC(64,64); const g=DABT.getContext('2d'), d=TEX[tex]; const p=g.createPattern(texCanvas(tex),'repeat'); if(p.setTransform) p.setTransform(new DOMMatrix().rotate(SB.trot||0).scale((d.sc||1)*(SB.tsc||1))); return p; }
function dab(x,y,r,pat){ const S=Math.ceil(2*r), bg=SD.buf.getContext('2d'); const mk=dabMask(r);
 if(pat){ if(DABT.width<S||DABT.height<S){ const w=Math.max(S,DABT.width); DABT.width=w; DABT.height=w; } const g=DABT.getContext('2d'); g.setTransform(1,0,0,1,0,0); g.globalCompositeOperation='source-over'; g.clearRect(0,0,S,S);
  g.save(); g.translate(-(x-r),-(y-r)); g.fillStyle=pat; g.fillRect(x-r,y-r,S,S); g.restore(); g.globalCompositeOperation='destination-in'; g.drawImage(mk,0,0,S,S); bg.drawImage(DABT,0,0,S,S,x-r,y-r,S,S); }
 else bg.drawImage(mk,0,0,S,S,x-r,y-r,S,S); }
/* Trazo raster: se pinta en un búfer y se compone sobre la capa con opacidad y modo de fusión */
function strokeBegin(erase,tex,layerId,label){ const m=SD.map, id=layerId||'land', tgt=SD.R[id]; if(!tgt) return; const b=SD.buf.getContext('2d'); b.setTransform(1,0,0,1,0,0); b.clearRect(0,0,m.w,m.h); const bf=SD.before.getContext('2d'); bf.clearRect(0,0,m.w,m.h); bf.drawImage(tgt,0,0);
 const isMask=(m.L.find(l=>l.id===id)||{}).type==='mask';
 SD.stroke={erase,pat:tex&&!isMask?strokePattern(tex):null,bb:[1e9,1e9,-1e9,-1e9],last:null,op:SB.op,id,blend:SB.tool==='terreno'&&!isMask?SB.blend:'source-over',label}; }
function strokeTo(x,y){ const st=SD.stroke; if(!st) return; const r=SB.size/2; const pts=[];
 if(!st.last) pts.push([x,y]); else { const [lx,ly]=st.last, d=Math.hypot(x-lx,y-ly), step=Math.max(1,r*.22); if(d<step) return; for(let t=step;t<=d;t+=step) pts.push([lx+(x-lx)*t/d,ly+(y-ly)*t/d]); }
 for(const [px,py] of pts){ dab(px,py,r,st.erase?null:st.pat); st.last=[px,py]; grow(st.bb,px-r,py-r,px+r,py+r); }
 strokeCompose(); }
const grow=(bb,x0,y0,x1,y1)=>{ bb[0]=Math.min(bb[0],x0); bb[1]=Math.min(bb[1],y0); bb[2]=Math.max(bb[2],x1); bb[3]=Math.max(bb[3],y1); };
function strokeRect(st){ const m=SD.map; const x0=clamp(Math.floor(st.bb[0])-2,0,m.w), y0=clamp(Math.floor(st.bb[1])-2,0,m.h), x1=clamp(Math.ceil(st.bb[2])+2,0,m.w), y1=clamp(Math.ceil(st.bb[3])+2,0,m.h); return [x0,y0,x1-x0,y1-y0]; }
function strokeCompose(){ const st=SD.stroke; if(!st) return; const [x0,y0,w,h]=strokeRect(st); if(w<=0||h<=0) return; const g=SD.R[st.id].getContext('2d');
 g.save(); g.globalCompositeOperation='copy'; g.beginPath(); g.rect(x0,y0,w,h); g.clip(); g.drawImage(SD.before,0,0); g.restore();
 g.save(); g.beginPath(); g.rect(x0,y0,w,h); g.clip(); g.globalAlpha=st.op; g.globalCompositeOperation=st.erase?'destination-out':(st.blend||'source-over');
 g.drawImage(SD.buf,x0,y0,w,h,x0,y0,w,h);
 if(st.blend&&st.blend!=='source-over'&&!st.erase){ g.globalCompositeOperation='destination-in'; g.globalAlpha=1; g.drawImage(SD.before,0,0); } g.restore(); draw(); }
function strokeEnd(){ const st=SD.stroke; SD.stroke=null; if(!st||st.bb[2]<st.bb[0]) return; const [x,y,w,h]=strokeRect(st);
 pushTerrUndo(x,y,w,h,null,st.id,st.label||(st.erase?'Borrar pintura':'Pintar')); if(st.id===(SD.map.L.find(l=>l.land)||{}).id) coastSoon(); rDirty(st.id); }
function strokeCancel(){ const st=SD.stroke; if(!st) return; SD.stroke=null; const g=SD.R[st.id].getContext('2d'); g.save(); g.globalCompositeOperation='copy'; g.drawImage(SD.before,0,0); g.restore(); draw(); }
function polyFill(pts,erase,tex,layerId,feather){ strokeBegin(erase,tex,layerId,erase?'Recortar polígono':'Rellenar polígono'); const st=SD.stroke; if(!st) return; const b=SD.buf.getContext('2d');
 b.save(); if(feather>0&&'filter' in b) b.filter=`blur(${feather}px)`; b.beginPath(); pts.forEach((p,i)=>i?b.lineTo(p[0],p[1]):b.moveTo(p[0],p[1])); b.closePath(); b.fillStyle=(!erase&&st.pat)?st.pat:'#000'; b.fill(); b.restore();
 pts.forEach(p=>grow(st.bb,p[0]-feather*2,p[1]-feather*2,p[0]+feather*2,p[1]+feather*2)); strokeCompose(); strokeEnd(); }
function pushTerrUndo(x,y,w,h,beforeC,id='land',label='Pintar'){ if(w<=0||h<=0) return; const b=mkC(w,h), a=mkC(w,h); b.getContext('2d').drawImage(beforeC||SD.before,x,y,w,h,0,0,w,h); a.getContext('2d').drawImage(SD.R[id],x,y,w,h,0,0,w,h);
 stPush({t:'r',id,x,y,w,h,b,a,px:w*h*2,label}); }
function fillAll(tex,landOnly,layerId){ const m=SD.map, id=layerId||(m.L.find(l=>l.land)||{}).id, c=SD.R[id]; const bf=SD.before.getContext('2d'); bf.clearRect(0,0,m.w,m.h); bf.drawImage(c,0,0);
 const g=c.getContext('2d'); g.save(); if(landOnly) g.globalCompositeOperation='source-atop'; g.fillStyle=texPattern(g,tex); g.fillRect(0,0,m.w,m.h); g.restore(); pushTerrUndo(0,0,m.w,m.h,null,id,landOnly?'Recolorear':'Rellenar todo'); computeCoast(); rDirty(id); }

/* ---------- Historial por comandos (deltas) ---------- */
const COLLS=['stamps','paths','shapes','labels','pins'];
function vecSnap(){ const m=SD.map, S={e:{},o:{}}; for(const c of COLLS){ S.o[c]=m[c].map(x=>x.id); for(const x of m[c]) S.e[x.id]=JSON.stringify(x); } S.L=JSON.stringify(m.L); return S; }
function vecCommit(before,label='Editar'){ if(!before) return; const after=vecSnap(), d=[]; const ids=new Set([...Object.keys(before.e),...Object.keys(after.e)]);
 for(const id of ids) if(before.e[id]!==after.e[id]) d.push([id,before.e[id]||null,after.e[id]||null]);
 const oc={}; for(const c of COLLS) if(before.o[c].join()!==after.o[c].join()) oc[c]=[before.o[c],after.o[c]];
 const lc=before.L!==after.L?[before.L,after.L]:null; if(!d.length&&!Object.keys(oc).length&&!lc) return;
 stPush({t:'v',d,oc,lc,label,px:0}); saveDoc(); }
function collOf(o){ if(o.k) return 'stamps'; if(o.nodes) return 'shapes'; if(o.pts&&o.t) return 'paths'; if(o.text!=null) return 'labels'; return 'pins'; }
function applyVec(u,back){ const m=SD.map, map={}; for(const c of COLLS) for(const x of m[c]) map[x.id]=x;
 for(const [id,b,a] of u.d){ const j=back?b:a; if(j) map[id]=JSON.parse(j); else delete map[id]; }
 for(const c of COLLS){ const order=(u.oc[c]?u.oc[c][back?0:1]:m[c].map(x=>x.id)).slice(); const cur=new Set(order);
  for(const [id,b,a] of u.d){ const j=back?b:a; if(j&&!cur.has(id)&&collOf(map[id])===c){ order.push(id); cur.add(id); } }
  m[c]=order.filter(id=>map[id]&&collOf(map[id])===c).map(id=>map[id]); }
 if(u.lc) m.L=JSON.parse(u.lc[back?0:1]); }
function stPush(u){ SD.undo.push(u); SD.upx+=u.px; SD.redo=[]; while(SD.undo.length>150||SD.upx>40e6){ const x=SD.undo.shift(); SD.upx-=x.px; } stUpdUndo(); }
const collName=t=>({stamp:'stamps',label:'labels',path:'paths',shape:'shapes',pin:'pins'}[t]);
function applyU(u,back){ const m=SD.map; if(u.t==='v'){ applyVec(u,back); const byId={}; for(const c of COLLS) for(const x of m[c]) byId[x.id]=x; SD.sel=SD.sel.map(s=>({type:s.type,o:byId[s.o.id]})).filter(s=>s.o); saveDoc(); if(u.lc) syncRasters(); }
 else { const c=SD.R[u.id]; if(c){ const g=c.getContext('2d'); g.save(); g.globalCompositeOperation='copy'; g.beginPath(); g.rect(u.x,u.y,u.w,u.h); g.clip(); g.drawImage(back?u.b:u.a,u.x,u.y); g.restore(); if(u.id===(m.L.find(l=>l.land)||{}).id) coastSoon(50); rDirty(u.id); } }
 draw(); stPanel(); }
function syncRasters(){ const m=SD.map; for(const L of m.L) if((L.type==='brush'||L.type==='mask')&&!SD.R[L.id]){ SD.R[L.id]=mkC(m.w,m.h); if(L.type==='mask'&&L.start==='full') SD.R[L.id].getContext('2d').fillRect(0,0,m.w,m.h); } }
function stUndo(){ const u=SD.undo.pop(); if(!u) return toast('No hay nada que deshacer.'); SD.upx-=u.px; SD.redo.push(u); applyU(u,true); stUpdUndo(); }
function stRedo(){ const u=SD.redo.pop(); if(!u) return toast('No hay nada que rehacer.'); SD.undo.push(u); SD.upx+=u.px; applyU(u,false); stUpdUndo(); }

/* ---------- Trazos con estilo (ríos, caminos, muros…) ---------- */
const PATHS={
 rio:{n:'Río',lv:'gncmd',w:{g:7,n:9,c:1.2,m:.9,d:.8}},camino:{n:'Camino',lv:'gn',w:{g:3,n:4}},sendero:{n:'Sendero',lv:'gnm',w:{g:2.5,n:3,m:.12}},frontera:{n:'Frontera',lv:'gn',w:{g:4,n:5}},ruta:{n:'Ruta marítima',lv:'gn',w:{g:2.5,n:3}},
 calzada:{n:'Calzada empedrada',lv:'cmd',w:{c:1,m:1.4,d:1.2}},tierra:{n:'Camino de tierra',lv:'cm',w:{c:1,m:1.4}},muro:{n:'Muro de piedra',lv:'cmd',w:{c:.4,m:.35,d:.4}},empalizada:{n:'Empalizada',lv:'cm',w:{c:.3,m:.35}},cerca:{n:'Cerca',lv:'cm',w:{c:.2,m:.25}},acantilado:{n:'Acantilado',lv:'gncmd',w:{g:5,n:6,c:.5,m:.5,d:.5}}
};
function pathWidth(m,t){ const L=LVK(m).L, w=PATHS[t].w[L]??PATHS[t].w.g??1; return 'mdc'.includes(L)?w*m.grid.size:w; }
function samplePath(pts,step=4){ if(pts.length<2) return pts.slice(); const out=[]; const P=i=>pts[clamp(i,0,pts.length-1)];
 for(let i=0;i<pts.length-1;i++){ const p0=P(i-1),p1=P(i),p2=P(i+1),p3=P(i+2), L=Math.hypot(p2[0]-p1[0],p2[1]-p1[1]), n=Math.max(1,Math.ceil(L/step));
  for(let j=0;j<n;j++){ const t=j/n, t2=t*t, t3=t2*t; out.push([.5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),.5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)]); } }
 out.push(pts[pts.length-1]); return out; }
function polyPath(c,pts){ c.beginPath(); pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); }
const SPC=new WeakMap(); const spOf=p=>{ let v=SPC.get(p); const sig=p.pts.map(q=>q[0]+','+q[1]).join(';'); if(!v||v.sig!==sig){ v={sig,pts:samplePath(p.pts)}; SPC.set(p,v); } return v.pts; };
function drawPath(c,p,m){ const pts=p.sp||spOf(p); if(pts.length<2) return; const w=p.w, B=BGS[m.bg]||BGS.mar; c.save(); c.lineJoin='round'; c.lineCap='round';
 switch(p.t){
  case 'rio':{ const n=pts.length, L=[],R=[]; for(let i=0;i<n;i++){ const a=pts[Math.max(0,i-1)], b=pts[Math.min(n-1,i+1)], dx=b[0]-a[0], dy=b[1]-a[1], l=Math.hypot(dx,dy)||1, t=i/(n-1), ww=w*(.28+.72*Math.pow(t,.7))/2; L.push([pts[i][0]-dy/l*ww,pts[i][1]+dx/l*ww]); R.push([pts[i][0]+dy/l*ww,pts[i][1]-dx/l*ww]); }
   const shape=()=>{ c.beginPath(); L.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1])); for(let i=R.length-1;i>=0;i--) c.lineTo(R[i][0],R[i][1]); c.closePath(); };
   const wc=B.shallow?`rgb(${B.shallow.map(v=>v*.75|0)})`:'#4a86b4'; shape(); c.lineWidth=2.6; c.strokeStyle=B.ink?`rgb(${B.ink})`:'#1c2a36'; c.stroke(); c.fillStyle=wc; c.fill();
   polyPath(c,pts); c.lineWidth=w*.18; c.strokeStyle='rgba(235,248,255,.35)'; c.stroke(); break; }
  case 'camino': polyPath(c,pts); c.lineWidth=w+3; c.strokeStyle='rgba(250,238,205,.45)'; c.stroke(); c.setLineDash([w*2.2,w*1.4]); c.lineWidth=w*.55; c.strokeStyle='#5a3e26'; c.stroke(); break;
  case 'sendero': polyPath(c,pts); c.setLineDash([.1,w*1.8]); c.lineWidth=w*.8; c.strokeStyle='#4a3320'; c.stroke(); break;
  case 'frontera': polyPath(c,pts); c.lineWidth=w*3; c.strokeStyle='rgba(150,30,60,.16)'; c.stroke(); c.setLineDash([w*3,w*1.2,w*.4,w*1.2]); c.lineWidth=w*.55; c.strokeStyle='#7a1f36'; c.stroke(); break;
  case 'ruta': polyPath(c,pts); c.setLineDash([w*1.6,w*1.6]); c.lineWidth=w*.5; c.strokeStyle=B.ink?`rgba(${B.ink},.8)`:'#1c2a36'; c.stroke(); break;
  case 'calzada': case 'tierra':{ polyPath(c,pts); c.lineWidth=w+4; c.strokeStyle=p.t==='calzada'?'rgba(30,26,22,.55)':'rgba(40,28,18,.25)'; c.stroke(); c.lineWidth=w; c.strokeStyle=texPattern(c,p.t==='calzada'?'adoquin':'tierra'); c.stroke(); if(p.t==='tierra'){ c.lineWidth=w*.55; c.strokeStyle='rgba(255,240,210,.08)'; c.stroke(); } break; }
  case 'muro':{ polyPath(c,pts); c.lineWidth=w+4; c.strokeStyle='rgba(10,8,8,.9)'; c.stroke(); c.lineWidth=w; c.strokeStyle='#8b857c'; c.stroke(); c.lineWidth=w*.35; c.strokeStyle='rgba(255,255,255,.18)'; c.stroke();
   c.strokeStyle='rgba(20,15,12,.7)'; c.lineWidth=1.4; let acc=0; for(let i=1;i<pts.length;i++){ const a=pts[i-1], b=pts[i], l=Math.hypot(b[0]-a[0],b[1]-a[1])||1; acc+=l; if(acc>w*1.4){ acc=0; const dx=(b[0]-a[0])/l, dy=(b[1]-a[1])/l; c.beginPath(); c.moveTo(b[0]-dy*w/2,b[1]+dx*w/2); c.lineTo(b[0]+dy*w/2,b[1]-dx*w/2); c.stroke(); } } break; }
  case 'empalizada':{ let acc=w; for(let i=1;i<pts.length;i++){ const a=pts[i-1], b=pts[i], l=Math.hypot(b[0]-a[0],b[1]-a[1])||1; acc+=l; while(acc>=w*.9){ acc-=w*.9; const t=1-acc/l, x=a[0]+(b[0]-a[0])*t, y=a[1]+(b[1]-a[1])*t;
    c.beginPath(); c.arc(x+2,y+3,w/2,0,7); c.fillStyle='rgba(0,0,0,.35)'; c.fill(); c.beginPath(); c.arc(x,y,w/2,0,7); c.fillStyle='#7a5434'; c.fill(); c.lineWidth=1.2; c.strokeStyle=INK; c.stroke(); c.beginPath(); c.arc(x,y,w/4,0,7); c.strokeStyle='rgba(220,180,120,.5)'; c.stroke(); } } break; }
  case 'cerca': polyPath(c,pts); c.lineWidth=w*.45+2; c.strokeStyle=INK; c.stroke(); c.lineWidth=w*.45; c.strokeStyle='#9a7448'; c.stroke(); { let acc=0; for(let i=1;i<pts.length;i++){ const a=pts[i-1], b=pts[i]; acc+=Math.hypot(b[0]-a[0],b[1]-a[1]); if(acc>w*3){ acc=0; c.fillStyle='#6b4a2e'; c.fillRect(b[0]-w*.45,b[1]-w*.45,w*.9,w*.9); c.lineWidth=1; c.strokeStyle=INK; c.strokeRect(b[0]-w*.45,b[1]-w*.45,w*.9,w*.9); } } } break;
  case 'acantilado':{ c.strokeStyle='rgba(30,22,16,.75)'; c.lineWidth=1.3; for(let i=1;i<pts.length;i+=2){ const a=pts[i-1], b=pts[i], l=Math.hypot(b[0]-a[0],b[1]-a[1])||1, dx=(b[0]-a[0])/l, dy=(b[1]-a[1])/l, L=w*(1.2+((i*7)%5)/5);
    c.beginPath(); c.moveTo(b[0],b[1]); c.lineTo(b[0]+dy*L,b[1]-dx*L); c.stroke(); } polyPath(c,pts); c.lineWidth=w*.5+1.5; c.strokeStyle=INK; c.stroke(); break; }
 } c.restore(); }

/* ---------- Líneas y formas por nodos (Bézier) ---------- */
function shapePath(c,s){ const N=s.nodes; if(!N.length) return; c.beginPath(); c.moveTo(N[0].x,N[0].y);
 const seg=(p,q)=>{ if(p.o||q.i) c.bezierCurveTo(p.x+(p.o?p.o[0]:0),p.y+(p.o?p.o[1]:0),q.x+(q.i?q.i[0]:0),q.y+(q.i?q.i[1]:0),q.x,q.y); else c.lineTo(q.x,q.y); };
 for(let i=1;i<N.length;i++) seg(N[i-1],N[i]); if(s.closed&&N.length>2){ seg(N[N.length-1],N[0]); c.closePath(); } }
function drawShape(c,s){ const st=s.st||{}, fi=s.fi||{}; c.save(); if(s.o!=null) c.globalAlpha=s.o; shapePath(c,s);
 if(s.closed&&fi.on){ c.save(); c.globalAlpha*=fi.o??1; c.fillStyle=fi.tex&&TEX[fi.tex]?texPattern(c,fi.tex):(fi.c||'#4a86b4'); c.fill(); c.restore(); }
 if(st.on!==false&&(st.w||0)>0){ c.lineWidth=st.w; c.lineJoin='round'; c.lineCap=st.cap||'round'; c.strokeStyle=st.tex&&TEX[st.tex]?texPattern(c,st.tex):(st.c||INK);
  if(st.dash==='dash') c.setLineDash([st.w*2.4,st.w*1.6]); else if(st.dash==='dot'){ c.setLineDash([.1,st.w*2]); c.lineCap='round'; } c.stroke(); }
 c.restore(); }
function bezPt(p,q,t){ const a=[p.x,p.y], b=[p.x+(p.o?p.o[0]:0),p.y+(p.o?p.o[1]:0)], cc=[q.x+(q.i?q.i[0]:0),q.y+(q.i?q.i[1]:0)], d=[q.x,q.y], u=1-t; return [u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*cc[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*cc[1]+t*t*t*d[1]]; }
function shapeSamples(s){ const out=[]; const N=s.nodes, n=s.closed?N.length:N.length-1; for(let i=0;i<n;i++){ const p=N[i], q=N[(i+1)%N.length]; for(let k=0;k<12;k++) out.push([...bezPt(p,q,k/12),i]); } if(N.length){ const e=N[s.closed?0:N.length-1]; out.push([e.x,e.y,Math.max(0,n-1)]); } return out; }

/* ---------- Textos ---------- */
const LBW=new WeakMap();
const FONTS=[['Cinzel','Cinzel'],['Cinzel Decorative','Cinzel Decorativa'],['IM Fell English SC','Imprenta antigua'],['IM Fell English','Imprenta cursiva',1],['Uncial Antiqua','Uncial'],['Pirata One','Gótica'],['MedievalSharp','Medieval'],['Marcellus SC','Marcellus'],['Alegreya Sans','Moderna']];
function labelFont(l){ const bold=l.b??(l.font==='Cinzel'||l.font==='Cinzel Decorative'); return `${l.it?'italic ':''}${bold?'700 ':'400 '}${l.size}px "${l.font}"`; }
function drawLabel(c,l){ const raw=l.up?(l.text||'').toUpperCase():(l.text||''); if(!raw.trim()) return; c.save(); c.translate(l.x,l.y); if(l.r) c.rotate(l.r); if(l.sx||l.sy) c.scale(l.sx||1,l.sy||1); c.font=labelFont(l); c.textBaseline='middle'; c.textAlign='left'; c.lineJoin='round';
 const al=l.o??1; c.globalAlpha=al; if(l.bl&&l.bl!=='source-over') c.globalCompositeOperation=l.bl; if(l.blur>0&&'filter' in c) c.filter=`blur(${l.blur}px)`;
 const lines=raw.split('\n'), lh=l.size*(l.lh||1.15), sp=(l.sp||0)*l.size/40; let maxW=0;
 const lay=lines.map(t=>{ const chars=[...t], ws=chars.map(ch=>c.measureText(ch).width), W=ws.reduce((a,b)=>a+b,0)+sp*Math.max(0,chars.length-1); maxW=Math.max(maxW,W); return {chars,ws,W}; }); LBW.set(l,[maxW,lh*lines.length]);
 const each=(fn)=>lay.forEach((ln,li)=>{ const y0=(li-(lines.length-1)/2)*lh; if(Math.abs(l.curve||0)<.01||lines.length>1){ let x=-ln.W/2; ln.chars.forEach((ch,i)=>{ fn(ch,x,y0,0); x+=ln.ws[i]+sp; }); return; }
  const Rr=ln.W/((l.curve)*Math.PI*.9); let s=-ln.W/2; ln.chars.forEach((ch,i)=>{ const mid=s+ln.ws[i]/2, th=mid/Rr; fn(ch,Rr*Math.sin(th)-ln.ws[i]/2*Math.cos(th),Rr*(1-Math.cos(th))-ln.ws[i]/2*Math.sin(th),th); s+=ln.ws[i]+sp; }); });
 const put=(stroke)=>each((ch,x,y,th)=>{ c.save(); c.translate(x,y); c.rotate(th); stroke?c.strokeText(ch,0,0):c.fillText(ch,0,0); c.restore(); });
 if(l.ts){ c.save(); c.shadowColor='rgba(0,0,0,.6)'; c.shadowBlur=l.size*.25; c.shadowOffsetX=l.size*.06; c.shadowOffsetY=l.size*.08; c.fillStyle=l.color||INK; put(false); c.restore(); }
 if(l.halo){ c.lineWidth=Math.max(2,l.size*.16*(l.hw||1)*l.halo); c.strokeStyle=l.hc||'#f3ead6'; c.globalAlpha=al*.92; put(true); c.globalAlpha=al; }
 c.fillStyle=l.color||INK; put(false); c.restore(); }

/* ---------- Cuadrícula ---------- */
function drawGrid(c,m,vb,z){ const G=m.grid; if(!G.on) return; const s=G.size, ox=G.ox||0, oy=G.oy||0; c.save(); c.globalAlpha=G.op; c.strokeStyle=gridColor(m); c.lineWidth=Math.max(.6,(G.lw||1)/z); c.beginPath();
 const x0=Math.max(0,vb[0]), y0=Math.max(0,vb[1]), x1=Math.min(m.w,vb[2]), y1=Math.min(m.h,vb[3]);
 if(G.type==='hex'){ const r=s/Math.sqrt(3), h=1.5*r; for(let row=Math.floor((y0-oy)/h)-1;row<=(y1-oy)/h+1;row++){ const off=(row&1)?s/2:0; for(let col=Math.floor((x0-ox-off)/s)-1;col<=(x1-ox-off)/s+1;col++){ const cx=col*s+off+ox, cy=row*h+oy;
   for(let k=0;k<=6;k++){ const a=-Math.PI/2+k*Math.PI/3, X=cx+r*Math.cos(a), Y=cy+r*Math.sin(a); k?c.lineTo(X,Y):c.moveTo(X,Y); } } } }
 else if(G.type==='iso'){ const k0=Math.floor((x0-2*y1-ox+2*oy)/s)-1, k1=Math.ceil((x1-2*y0-ox+2*oy)/s)+1; for(let k=k0;k<=k1;k++){ const b=k*s+ox-2*oy; c.moveTo(b+2*y0,y0); c.lineTo(b+2*y1,y1); }
  const j0=Math.floor((x0+2*y0-ox-2*oy)/s)-1, j1=Math.ceil((x1+2*y1-ox-2*oy)/s)+1; for(let j=j0;j<=j1;j++){ const b=j*s+ox+2*oy; c.moveTo(b-2*y0,y0); c.lineTo(b-2*y1,y1); } }
 else { for(let x=Math.ceil((x0-ox)/s)*s+ox;x<=x1;x+=s){ c.moveTo(x,y0); c.lineTo(x,y1); } for(let y=Math.ceil((y0-oy)/s)*s+oy;y<=y1;y+=s){ c.moveTo(x0,y); c.lineTo(x1,y); } }
 c.stroke(); c.restore(); }
function snapPt(x,y,kind='cell'){ const m=SD.map, G=m.grid; if(!G.snap) return [x,y]; const s=G.size, ox=G.ox||0, oy=G.oy||0;
 if(G.type==='hex'){ const r=s/Math.sqrt(3), h=1.5*r; let best=[x,y], bd=1e18; const row0=Math.round((y-oy)/h); for(let row=row0-1;row<=row0+1;row++){ const off=(row&1)?s/2:0, col=Math.round((x-ox-off)/s), cx=col*s+off+ox, cy=row*h+oy, d=(cx-x)**2+(cy-y)**2; if(d<bd){ bd=d; best=[cx,cy]; } } return best; }
 if(G.type==='iso'){ const u=(x-ox+2*(y-oy))/s, v=(x-ox-2*(y-oy))/s, U=kind==='cell'?Math.floor(u)+.5:Math.round(u), V=kind==='cell'?Math.floor(v)+.5:Math.round(v); return [ox+(U+V)*s/2,oy+(U-V)*s/4]; }
 return kind==='cell'?[Math.floor((x-ox)/s)*s+s/2+ox,Math.floor((y-oy)/s)*s+s/2+oy]:[Math.round((x-ox)/s)*s+ox,Math.round((y-oy)/s)*s+oy]; }

/* ---------- Objetos ilustrados ---------- */
function stampDims(st){ const d=STAMPS[st.k]; const [bw,bh]=d.box, u=st.s/Math.max(bw,bh); return {d,u,w:bw*u*(st.sx||1),h:bh*u*(st.sy||1),ay:d.ay??.9}; }
function apFilter(a){ if(!a) return ''; let f=''; if(a.blur>0) f+=`blur(${a.blur}px) `; if(a.hue) f+=`hue-rotate(${a.hue}deg) `; if(a.sat!=null&&a.sat!==1) f+=`saturate(${a.sat}) `; if(a.bri!=null&&a.bri!==1) f+=`brightness(${a.bri}) `; if(a.con!=null&&a.con!==1) f+=`contrast(${a.con}) `; return f.trim(); }
const hexA=(h,a)=>{ const [r,g,b]=hex2rgb(h); return `rgba(${r},${g},${b},${a})`; };
function drawStamp(c,st,z,exp){ const D=stampDims(st); const px=Math.pow(2,Math.ceil(Math.log2(clamp(Math.max(st.s*(st.sx||1),st.s*(st.sy||1))*z*(exp?1:SD.dpr),24,exp?1024:512)))); const spr=stampSprite(st.k,st.v||0,px), k=z*(exp?1:SD.dpr);
 c.save(); c.translate(st.x,st.y); if(st.r) c.rotate(st.r); if(st.f||st.fy) c.scale(st.f?-1:1,st.fy?-1:1); const a=st.ap;
 if(st.o!=null) c.globalAlpha*=st.o; if(a){ if(a.o!=null) c.globalAlpha*=a.o; if(a.bl&&a.bl!=='source-over') c.globalCompositeOperation=a.bl; const f=apFilter(a); if(f&&'filter' in c) c.filter=a.blur>0?f.replace(/blur\(([\d.]+)px\)/,(_,b)=>`blur(${b*k}px)`):f; }
 if(st.sh&&st.sh.m==='custom'){ c.shadowColor=hexA(st.sh.c||'#000000',st.sh.a??.5); c.shadowBlur=(st.sh.b??8)*k; c.shadowOffsetX=(st.sh.x??6)*k; c.shadowOffsetY=(st.sh.y??8)*k; }
 const P=D.d.side?1:1.36; c.drawImage(spr,-D.w*P/2,-D.h*P*D.ay,D.w*P,D.h*P); c.restore(); }
function defSizeOf(m,id){ const d=STAMPS[id]; return d.side?d.sz*LVK(m).mul:d.sz*m.grid.size*(LVK(m).tmul||1); }
function lightOf(st,m){ const d=STAMPS[st.k]; if(!d||!d.light) return null; const k=st.s/defSizeOf(m,st.k); const D=stampDims(st); return {x:st.x,y:st.y-(d.side?D.h*.5:0),r:(d.side?d.light[0]*LVK(m).mul:d.light[0]*m.grid.size*(LVK(m).tmul||1))*k,c:d.light[1]}; }

/* ---------- Entidades por capa y orden en Z: zIndex = subcapa · Y (si hay perspectiva) · orden ---------- */
function slOf(kind,o){ if(o.sl!=null) return o.sl; if(kind==='path') return ['rio','acantilado','calzada','tierra'].includes(o.t)?-3:-2; if(kind==='stamp') return STAMPS[o.k]&&STAMPS[o.k].flat?-1:0; return {shape:-1,label:8,pin:9}[kind]??0; }
function entitiesOf(m,L,all){ const side=isSide(m), out=[]; const add=(kind,arr,ko)=>arr.forEach((o,j)=>{ if((!all&&o.hd)||lyOf(m,o)!==L.id) return; if(kind==='stamp'&&!STAMPS[o.k]) return; out.push({kind,o,sl:slOf(kind,o),y:side&&kind==='stamp'?(o.k==='brujula'?1e6:o.y):0,ko,j}); });
 add('path',m.paths,0); add('shape',m.shapes,1); add('stamp',m.stamps,2); add('label',m.labels,3);
 out.sort((a,b)=>a.sl-b.sl||a.y-b.y||a.ko-b.ko||a.j-b.j); return out; }
function entBox(it){ const o=it.o; if(it.kind==='stamp'){ const D=stampDims(o), r=Math.max(D.w,D.h); return [o.x-r,o.y-r,o.x+r,o.y+r]; }
 if(it.kind==='label'){ const s=(o.size||20)*Math.max(4,(o.text||'').length); return [o.x-s,o.y-s,o.x+s,o.y+s]; }
 const pts=it.kind==='path'?o.pts:o.nodes.map(n=>[n.x,n.y]); let bb=[1e9,1e9,-1e9,-1e9]; for(const p of pts) grow(bb,p[0],p[1],p[0],p[1]); const w=(it.kind==='path'?o.w:((o.st||{}).w||0))+80; return [bb[0]-w,bb[1]-w,bb[2]+w,bb[3]+w]; }

/* ---------- Notas del DM ---------- */
const NOTE_ICONS=[['punto','Punto'],['peligro','Peligro'],['trampa','Trampa'],['tesoro','Tesoro'],['npc','PNJ'],['taberna','Taberna'],['tienda','Tienda'],['templo','Templo'],['puerta','Entrada'],['portal','Portal'],['mazmorra','Mazmorra'],['cueva','Cueva'],['castillo','Castillo'],['ciudad','Ciudad'],['pueblo','Pueblo'],['capital','Capital'],['puerto','Puerto'],['ruina','Ruina'],['campamento','Campamento']];
const NOTE_COLS=['#d6a44c','#c0392b','#2e86c1','#27ae60','#8e44ad','#e67e22','#e9e2d0','#34495e'];
function drawPin(c,p,z,sel,exp){ const s=(exp?11:15)/z; c.save(); c.translate(p.x,p.y); c.fillStyle='rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(1/z,1/z,s*.45,s*.18,0,0,7); c.fill();
 c.beginPath(); c.moveTo(0,0); c.bezierCurveTo(-s*.9,-s*1.1,-s*.95,-s*2.3,0,-s*2.3); c.bezierCurveTo(s*.95,-s*2.3,s*.9,-s*1.1,0,0); c.fillStyle=sel?'#ffe7a8':(p.col||'#d6a44c'); c.fill(); c.lineWidth=1.6/z; c.strokeStyle='#1b140d'; c.stroke();
 c.fillStyle='#1b140d'; iconPath(c,p.kind||'punto',0,-s*1.55,s*.55);
 if(p.dm&&!exp){ c.beginPath(); c.arc(s*.78,-s*2.15,s*.44,0,7); c.fillStyle='#7a1f36'; c.fill(); c.lineWidth=1/z; c.strokeStyle='#f3ead6'; c.stroke(); c.fillStyle='#f3ead6'; c.font=`700 ${s*.4}px "IBM Plex Mono"`; c.textAlign='center'; c.textBaseline='middle'; c.fillText('DM',s*.78,-s*2.13); }
 if(p.name){ c.font=`600 ${12/z}px "Alegreya Sans"`; c.textAlign='center'; c.textBaseline='top'; c.lineWidth=3/z; c.strokeStyle='rgba(15,12,10,.85)'; c.strokeText(p.name,0,4/z); c.fillStyle='#f6ecd6'; c.fillText(p.name,0,4/z); } c.restore(); }

/* ---------- Render por capas ---------- */
function offC(name,W,H){ let c=SD.off[name]; if(!c) c=SD.off[name]=mkC(W,H); if(c.width!==W||c.height!==H){ c.width=W; c.height=H; } const g=c.getContext('2d'); g.setTransform(1,0,0,1,0,0); g.globalAlpha=1; g.globalCompositeOperation='source-over'; if('filter' in g) g.filter='none'; g.clearRect(0,0,W,H); return g; }
function renderScene(c,v,opt={}){ const m=SD.map; if(!m) return; const z=v.z, W=opt.W, H=opt.H, T=[v.k*z,0,0,v.k*z,v.k*v.x,v.k*v.y], vb=[-v.x/z,-v.y/z,(W/v.k-v.x)/z,(H/v.k-v.y)/z];
 const setT=g=>g.setTransform(T[0],T[1],T[2],T[3],T[4],T[5]); const info={W,H,T,setT,z,vb,exp:!!opt.export,player:!!opt.export||SD.player};
 c.save(); setT(c); c.imageSmoothingEnabled=true; c.imageSmoothingQuality=opt.export?'high':'medium'; c.beginPath(); c.rect(0,0,m.w,m.h); c.clip();
 if(!sysHidden('fondo')){ c.fillStyle=texPattern(c,m.bg,true); c.fillRect(0,0,m.w,m.h); } else { c.fillStyle='#ece4d2'; c.fillRect(0,0,m.w,m.h); }
 if(!sysHidden('costa')&&SD.coastU) c.drawImage(SD.coastU,0,0,m.w,m.h);
 info.lights=[]; const objs=m.L.filter(l=>l.type==='object'&&!l.hid); const vis=new Set(objs.map(l=>l.id)); for(const st of m.stamps) if(!st.hd&&vis.has(lyOf(m,st))){ const li=lightOf(st,m); if(li) info.lights.push(li); }
 info.lastObj=objs.length?objs[objs.length-1].id:null; info.darkDone=false;
 for(const L of m.L){ if(L.hid||L.type==='mask') continue; if(L.type==='filter'){ applyFilter(c,L,info,m); continue; }
  const mask=m.L.find(x=>x.type==='mask'&&x.parent===L.id&&!x.hid&&SD.R[x.id]); const off=!!mask||(L.op??1)<1||(L.blend&&L.blend!=='source-over');
  let g=c; if(off){ g=offC('L',W,H); setT(g); }
  if(L.type==='brush'){ const r=SD.R[L.id]; if(r) g.drawImage(r,0,0); if(L.land&&!sysHidden('costa')&&SD.coastO) g.drawImage(SD.coastO,0,0,m.w,m.h); }
  else drawObjectLayer(g,L,m,info);
  if(off){ if(mask){ g.save(); setT(g); g.globalCompositeOperation=mask.inv?'destination-out':'destination-in'; g.drawImage(SD.R[mask.id],0,0); g.restore(); }
   c.save(); c.setTransform(1,0,0,1,0,0); c.globalAlpha=L.op??1; c.globalCompositeOperation=L.blend||'source-over'; c.drawImage(g.canvas,0,0); c.restore(); } }
 if(!info.darkDone) darkPass(c,info,m);
 if(!sysHidden('cuadricula')&&(!opt.export||opt.grid!==false)){ if((BGS[m.bg]||{}).wall&&m.grid.on){ const gc=gridMasked(m); if(gc) c.drawImage(gc,0,0,m.w,m.h); } else drawGrid(c,m,vb,z); }
 if(!sysHidden('efectos')) styleFx(c,m);
 if(!sysHidden('marcadores')&&(!opt.export||opt.notes)) for(const p of m.pins) if(!(info.player&&p.dm)) drawPin(c,p,z,!opt.export&&SD.sel.some(s=>s.o===p),opt.export);
 c.restore(); }
function drawObjectLayer(g,L,m,info){ const items=entitiesOf(m,L).filter(it=>{ const b=entBox(it); return !(b[2]<info.vb[0]||b[0]>info.vb[2]||b[3]<info.vb[1]||b[1]>info.vb[3]); });
 const isLast=L.id===info.lastObj, shOn=L.shadow&&L.shadow.on, special=it=>(it.o.ap&&it.o.ap.clip)||(shOn&&it.o.sh&&it.o.sh.m&&it.o.sh.m!=='layer');
 const drawIt=(t,it)=>{ const o=it.o; if(it.kind==='stamp'){ if(STAMPS[o.k].editorOnly&&info.player) return; drawStamp(t,o,info.z,info.exp); } else if(it.kind==='path') drawPath(t,o,m); else if(it.kind==='shape') drawShape(t,o); else drawLabel(t,o); };
 const main=items.filter(it=>!special(it)), rest=items.filter(special);
 if(shOn){ const t=offC('S',info.W,info.H); info.setT(t); for(const it of main) drawIt(t,it); const s=L.shadow, k=info.T[0];
  g.save(); g.setTransform(1,0,0,1,0,0); g.shadowColor=hexA(s.c||'#000000',s.a??.5); g.shadowBlur=(s.b??10)*k; g.shadowOffsetX=(s.x??10)*k; g.shadowOffsetY=(s.y??14)*k; g.drawImage(t.canvas,0,0); g.restore();
  if(isLast){ darkPass(g,info,m); info.darkDone=true; } }
 else { for(const it of main){ if(isLast&&!info.darkDone&&it.sl>=5){ darkPass(g,info,m); info.darkDone=true; } drawIt(g,it); } if(isLast&&!info.darkDone){ darkPass(g,info,m); info.darkDone=true; } }
 const clipd=rest.filter(it=>it.o.ap&&it.o.ap.clip), plain=rest.filter(it=>!(it.o.ap&&it.o.ap.clip));
 for(const it of plain) drawIt(g,it);
 if(clipd.length&&SD.terr){ const t=offC('K',info.W,info.H); info.setT(t); for(const it of clipd) drawIt(t,it); t.globalCompositeOperation='destination-in'; t.drawImage(SD.terr,0,0); g.save(); g.setTransform(1,0,0,1,0,0); g.drawImage(t.canvas,0,0); g.restore(); } }
function darkPass(c,info,m){ const fx=m.fx||{}, lights=info.lights; if(sysHidden('luces')) return;
 if(fx.dark>0){ const g=offC('D',info.W,info.H); g.fillStyle=`rgba(6,6,16,${fx.dark})`; g.fillRect(0,0,info.W,info.H); info.setT(g); g.globalCompositeOperation='destination-out';
  for(const L of lights){ const gr=g.createRadialGradient(L.x,L.y,0,L.x,L.y,L.r); gr.addColorStop(0,'rgba(0,0,0,1)'); gr.addColorStop(.55,'rgba(0,0,0,.75)'); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.beginPath(); g.arc(L.x,L.y,L.r,0,7); g.fill(); }
  c.save(); c.setTransform(1,0,0,1,0,0); c.drawImage(g.canvas,0,0); c.restore(); }
 if(!lights.length) return; c.save(); info.setT(c); c.globalCompositeOperation='screen'; for(const L of lights){ const gr=c.createRadialGradient(L.x,L.y,0,L.x,L.y,L.r*.8); gr.addColorStop(0,`rgba(${L.c},.55)`); gr.addColorStop(1,`rgba(${L.c},0)`); c.fillStyle=gr; c.beginPath(); c.arc(L.x,L.y,L.r*.8,0,7); c.fill(); } c.restore(); }
let GRAIN=null; function grainTex(){ if(GRAIN) return GRAIN; const T=256, c=mkC(T,T), g=c.getContext('2d'), d=g.createImageData(T,T), R=srng(9); for(let i=0;i<T*T;i++){ const v=R()*255; d.data[i*4]=d.data[i*4+1]=d.data[i*4+2]=v; d.data[i*4+3]=255; } g.putImageData(d,0,0); return GRAIN=c; }
let STAINT=null;
function overlayPattern(c,kind,sc){ let src; if(kind==='papel') src=texCanvas('pergamino',true); else if(kind==='grano') src=grainTex(); else { if(!STAINT){ const T=512, cc=mkC(T,T), g=cc.getContext('2d'); g.fillStyle='#e8dcc0'; g.fillRect(0,0,T,T); TFX.stains(g,T,srng(5)); TFX.stains(g,T,srng(6)); STAINT=cc; } src=STAINT; }
 const p=c.createPattern(src,'repeat'); if(p.setTransform) p.setTransform(new DOMMatrix().scale(sc||1)); return p; }
function applyFilter(c,L,info,m){ const f=L.f||{}, W=info.W, H=info.H, pr=FPRESETS[f.preset||'ninguno']||FPRESETS.ninguno; const t=offC('F',W,H);
 let fs=(pr[1]||'')+' '; if(f.hue) fs+=`hue-rotate(${f.hue}deg) `; if(f.sat!=null&&f.sat!==1) fs+=`saturate(${f.sat}) `; if(f.bri!=null&&f.bri!==1) fs+=`brightness(${f.bri}) `; if(f.con!=null&&f.con!==1) fs+=`contrast(${f.con}) `; if(f.blur>0) fs+=`blur(${f.blur*info.T[0]}px) `;
 fs=fs.trim(); if(fs&&'filter' in t) t.filter=fs; t.drawImage(c.canvas,0,0); if('filter' in t) t.filter='none';
 if(f.tilt>0){ const b=offC('F2',W,H); if('filter' in b) b.filter=`blur(${f.tilt*8*info.T[0]}px)`; b.drawImage(t.canvas,0,0); if('filter' in b) b.filter='none'; b.globalCompositeOperation='destination-in'; info.setT(b); const gr=b.createLinearGradient(0,0,0,m.h); const fo=f.focus??.5, wd=.18;
  gr.addColorStop(0,'#000'); gr.addColorStop(clamp(fo-wd*1.6,0,1),'rgba(0,0,0,.9)'); gr.addColorStop(clamp(fo-wd*.4,0,1),'rgba(0,0,0,0)'); gr.addColorStop(clamp(fo+wd*.4,0,1),'rgba(0,0,0,0)'); gr.addColorStop(clamp(fo+wd*1.6,0,1),'rgba(0,0,0,.9)'); gr.addColorStop(1,'#000'); b.fillStyle=gr; b.fillRect(0,0,m.w,m.h);
  t.setTransform(1,0,0,1,0,0); t.drawImage(b.canvas,0,0); }
 info.setT(t); t.save(); t.beginPath(); t.rect(0,0,m.w,m.h); t.clip();
 if(pr[2]){ t.globalCompositeOperation=pr[2][1]; t.globalAlpha=pr[2][2]; t.fillStyle=pr[2][0]; t.fillRect(0,0,m.w,m.h); t.globalAlpha=1; t.globalCompositeOperation='source-over'; }
 if(f.tex&&f.tex!=='ninguna'){ t.globalCompositeOperation=f.tb||'multiply'; t.globalAlpha=f.to??.5; t.fillStyle=overlayPattern(t,f.tex,f.ts||1); t.fillRect(0,0,m.w,m.h); t.globalAlpha=1; t.globalCompositeOperation='source-over'; }
 if(f.vig>0){ const gr=t.createRadialGradient(m.w/2,m.h/2,Math.min(m.w,m.h)*.32,m.w/2,m.h/2,Math.hypot(m.w,m.h)*.56); gr.addColorStop(0,'rgba(20,12,6,0)'); gr.addColorStop(1,`rgba(20,12,6,${f.vig*.9})`); t.fillStyle=gr; t.fillRect(0,0,m.w,m.h); }
 t.restore(); c.save(); c.setTransform(1,0,0,1,0,0); c.globalAlpha=L.op??1; c.drawImage(t.canvas,0,0); c.restore(); }
function styleFx(c,m){ const fx=m.fx||{};
 if(fx.look==='noche'){ c.save(); c.globalCompositeOperation='multiply'; c.fillStyle='rgba(70,90,160,.45)'; c.fillRect(0,0,m.w,m.h); c.restore(); }
 if(fx.paper>0){ c.save(); c.globalCompositeOperation='multiply'; c.globalAlpha=fx.paper*.75; c.fillStyle=texPattern(c,'pergamino',true); c.fillRect(0,0,m.w,m.h); c.restore(); }
 const p=planeById(m.plane||'material'); if(p.tint&&fx.tint!==false){ c.save(); c.globalCompositeOperation=p.tint[1]; c.globalAlpha=p.tint[2]*.55; c.fillStyle=p.tint[0]; c.fillRect(0,0,m.w,m.h); c.restore(); }
 if(fx.vig>0){ const gr=c.createRadialGradient(m.w/2,m.h/2,Math.min(m.w,m.h)*.35,m.w/2,m.h/2,Math.hypot(m.w,m.h)*.56); gr.addColorStop(0,'rgba(25,15,8,0)'); gr.addColorStop(1,`rgba(25,15,8,${fx.vig*.85})`); c.fillStyle=gr; c.fillRect(0,0,m.w,m.h); }
 if(fx.frame&&fx.frame!=='none') drawFrame(c,m,fx.frame); }
function gridMasked(m){ const G=m.grid, key=[G.size,G.type,G.op,G.color,G.lw,G.ox,G.oy,SD.coastV].join('|'); if(SD.gridC&&SD.gridK===key) return SD.gridC; if(!SD.terr) return null;
 const k=Math.min(1,2600/Math.max(m.w,m.h)), c=mkC(m.w*k,m.h*k), g=c.getContext('2d'); g.scale(k,k); drawGrid(g,m,[0,0,m.w,m.h],k*1.25); g.setTransform(1,0,0,1,0,0); g.globalCompositeOperation='destination-in'; g.drawImage(SD.terr,0,0,c.width,c.height);
 SD.gridC=c; SD.gridK=key; return c; }
function drawFrame(c,m,kind){ const b=Math.min(m.w,m.h)*.022; c.save(); c.strokeStyle='#2a2018';
 if(kind==='fino'){ c.lineWidth=b*.35; c.strokeRect(b*.6,b*.6,m.w-b*1.2,m.h-b*1.2); c.lineWidth=b*.12; c.strokeRect(b*1.25,b*1.25,m.w-b*2.5,m.h-b*2.5); }
 else { c.fillStyle='#2a2018'; c.fillRect(0,0,m.w,b*1.5); c.fillRect(0,m.h-b*1.5,m.w,b*1.5); c.fillRect(0,0,b*1.5,m.h); c.fillRect(m.w-b*1.5,0,b*1.5,m.h);
  c.fillStyle='#e9dcc0'; const seg=b*2.2; for(let x=b*1.5,i=0;x<m.w-b*1.5;x+=seg,i++) if(i%2){ c.fillRect(x,b*.45,Math.min(seg,m.w-b*1.5-x),b*.6); c.fillRect(x,m.h-b*1.05,Math.min(seg,m.w-b*1.5-x),b*.6); }
  for(let y=b*1.5,i=0;y<m.h-b*1.5;y+=seg,i++) if(i%2){ c.fillRect(b*.45,y,b*.6,Math.min(seg,m.h-b*1.5-y)); c.fillRect(m.w-b*1.05,y,b*.6,Math.min(seg,m.h-b*1.5-y)); }
  c.lineWidth=b*.12; c.strokeStyle='#e9dcc0'; c.strokeRect(b*1.5,b*1.5,m.w-b*3,m.h-b*3);
  for(const [x,y] of [[0,0],[m.w-b*1.5,0],[0,m.h-b*1.5],[m.w-b*1.5,m.h-b*1.5]]){ c.fillStyle='#b8862e'; c.fillRect(x,y,b*1.5,b*1.5); c.fillStyle='#2a2018'; c.beginPath(); c.moveTo(x+b*.75,y+b*.2); c.lineTo(x+b*1.3,y+b*.75); c.lineTo(x+b*.75,y+b*1.3); c.lineTo(x+b*.2,y+b*.75); c.closePath(); c.fill(); } }
 c.restore(); }

/* ---------- Bucle del editor ---------- */
function draw(){ if(SD.raf||!SD.cv) return; SD.raf=requestAnimationFrame(()=>{ SD.raf=0; drawNow(); }); }
function drawNow(){ const c=SD.ctx, cv=SD.cv, m=SD.map; if(!c||!m) return; const W=cv.width, H=cv.height;
 c.setTransform(1,0,0,1,0,0); c.clearRect(0,0,W,H);
 c.save(); c.setTransform(SD.dpr*SD.view.z,0,0,SD.dpr*SD.view.z,SD.dpr*SD.view.x,SD.dpr*SD.view.y); c.shadowColor='rgba(0,0,0,.55)'; c.shadowBlur=40*SD.dpr; c.fillStyle='#000'; c.fillRect(0,0,m.w,m.h); c.restore();
 renderScene(c,{x:SD.view.x,y:SD.view.y,z:SD.view.z,k:SD.dpr},{W,H});
 cv.style.filter=(LOOKS[(m.fx||{}).look]||LOOKS.natural)[1]; overlay(c); }
function selBox(s){ const o=s.o; if(s.type==='stamp'){ const D=stampDims(o); const ly=-D.h*D.ay+D.h/2; const r=o.r||0; return {cx:o.x-Math.sin(r)*ly,cy:o.y+Math.cos(r)*ly,w:D.w,h:D.h,r}; }
 if(s.type==='label'){ let wh=LBW.get(o); if(!wh){ const c=SD.ctx||mkC(2,2).getContext('2d'); c.save(); c.font=labelFont(o); wh=[c.measureText(o.up?(o.text||'').toUpperCase():(o.text||'')).width,o.size*1.15]; c.restore(); }
  const ext=(o.text||'').includes('\n')?0:Math.abs(o.curve||0)*wh[0]*.18; return {cx:o.x,cy:o.y+(o.curve>0?ext/2:-ext/2),w:(wh[0]+o.size*.4)*(o.sx||1),h:(wh[1]+o.size*.1+ext)*(o.sy||1),r:o.r||0}; }
 if(s.type==='pin'){ const z=SD.view.z; return {cx:o.x,cy:o.y-18/z,w:28/z,h:38/z,r:0}; }
 const pts=s.type==='path'?o.pts:shapeSamples(o); let bb=[1e9,1e9,-1e9,-1e9]; for(const p of pts) grow(bb,p[0],p[1],p[0],p[1]); const pad=s.type==='path'?o.w/2:((o.st||{}).w||0)/2; return {cx:(bb[0]+bb[2])/2,cy:(bb[1]+bb[3])/2,w:Math.max(4,bb[2]-bb[0]+pad*2),h:Math.max(4,bb[3]-bb[1]+pad*2),r:0}; }
function groupBox(){ const S=SD.sel; if(!S.length) return null; if(S.length===1) return selBox(S[0]); let bb=[1e9,1e9,-1e9,-1e9];
 for(const s of S){ const b=selBox(s), c=Math.cos(b.r), sn=Math.sin(b.r); for(const [lx,ly] of [[-b.w/2,-b.h/2],[b.w/2,-b.h/2],[b.w/2,b.h/2],[-b.w/2,b.h/2]]){ const X=b.cx+lx*c-ly*sn, Y=b.cy+lx*sn+ly*c; grow(bb,X,Y,X,Y); } }
 return {cx:(bb[0]+bb[2])/2,cy:(bb[1]+bb[3])/2,w:bb[2]-bb[0],h:bb[3]-bb[1],r:0}; }
const handlePts=b=>[[-b.w/2,-b.h/2],[b.w/2,-b.h/2],[b.w/2,b.h/2],[-b.w/2,b.h/2],[0,-b.h/2],[b.w/2,0],[0,b.h/2],[-b.w/2,0]];
function nodeHandles(c,s,z){ c.save(); for(const n of s.nodes){ for(const k of ['i','o']) if(n[k]){ c.beginPath(); c.moveTo(n.x,n.y); c.lineTo(n.x+n[k][0],n.y+n[k][1]); c.lineWidth=1/z; c.strokeStyle='#8fd3ff'; c.stroke(); c.beginPath(); c.arc(n.x+n[k][0],n.y+n[k][1],3.5/z,0,7); c.fillStyle='#8fd3ff'; c.fill(); }
  c.fillStyle=n===SD.nodeSel?'#ffd27a':'#fff'; c.strokeStyle='#1b140d'; c.lineWidth=1.2/z; c.fillRect(n.x-4/z,n.y-4/z,8/z,8/z); c.strokeRect(n.x-4/z,n.y-4/z,8/z,8/z); } c.restore(); }
function overlay(c){ const m=SD.map, z=SD.view.z; c.save(); c.setTransform(SD.dpr*z,0,0,SD.dpr*z,SD.dpr*SD.view.x,SD.dpr*SD.view.y);
 const h=SD.hover, t=SB.tool;
 if(h&&((t==='terreno')||(t==='costa'&&!SB.landPoly)||(t==='objetos'&&SB.smode!=='place'))){ const r=t==='objetos'?SB.srad/2:SB.size/2; c.beginPath(); c.arc(h.x,h.y,r,0,7); c.lineWidth=2/z; c.strokeStyle='rgba(0,0,0,.55)'; c.stroke(); c.lineWidth=1/z; c.strokeStyle='#fff'; c.stroke();
  if(t!=='objetos'){ c.beginPath(); c.arc(h.x,h.y,r*SB.soft*.9,0,7); c.setLineDash([4/z,4/z]); c.strokeStyle='rgba(255,255,255,.6)'; c.stroke(); c.setLineDash([]); } }
 if(h&&t==='objetos'&&SB.smode==='place'){ const id=curStamp(); if(STAMPS[id]){ const [sx,sy]=snapPt(h.x,h.y); c.globalAlpha=.6; drawStamp(c,{k:id,x:sx,y:sy,s:defSize(id)*SB.smul,v:SD.ghostV||0,r:0,ap:SB.app[id]},z); c.globalAlpha=1; } }
 if(SD.draft&&SD.draft.pts.length>1){ const p=SD.draft; drawPath(c,{t:p.t,w:p.w,pts:p.pts,sp:samplePath(p.pts)},m); }
 if(SD.poly&&SD.poly.length){ c.beginPath(); SD.poly.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); if(h) c.lineTo(h.x,h.y); c.lineWidth=2/z; c.strokeStyle='#ffd27a'; c.setLineDash([6/z,4/z]); c.stroke(); c.setLineDash([]);
  SD.poly.forEach((p,i)=>{ c.beginPath(); c.arc(p[0],p[1],(i?3.5:6)/z,0,7); c.fillStyle=i?'#ffd27a':'#fff'; c.fill(); }); }
 if(SD.sdraft){ const s=SD.sdraft; drawShape(c,s); nodeHandles(c,s,z); if(h&&s.nodes.length&&!SD.drag){ const L=s.nodes[s.nodes.length-1]; c.beginPath(); c.moveTo(L.x,L.y); c.lineTo(h.x,h.y); c.setLineDash([4/z,4/z]); c.lineWidth=1/z; c.strokeStyle='#ffd27a'; c.stroke(); c.setLineDash([]); } }
 if(SD.ruler){ const {a,b}=SD.ruler; c.beginPath(); c.moveTo(a.x,a.y); c.lineTo(b.x,b.y); c.lineWidth=3/z; c.strokeStyle='rgba(0,0,0,.6)'; c.stroke(); c.setLineDash([8/z,6/z]); c.lineWidth=1.6/z; c.strokeStyle='#ffd27a'; c.stroke(); c.setLineDash([]);
  for(const p of [a,b]){ c.beginPath(); c.arc(p.x,p.y,4/z,0,7); c.fillStyle='#ffd27a'; c.fill(); }
  const d=Math.hypot(b.x-a.x,b.y-a.y)/m.grid.size*m.scale, txt=`${d<10?d.toFixed(1):Math.round(d)} ${m.unit}`+(m.unit==='km'&&d>5?` · ${(d/38).toFixed(1)} días`:'')+(m.unit==='m'?` · ${Math.round(d/m.scale)} casillas`:'');
  c.font=`600 ${13/z}px "IBM Plex Mono"`; const tw=c.measureText(txt).width; c.fillStyle='rgba(15,12,10,.85)'; c.fillRect(b.x+10/z,b.y-24/z,tw+14/z,22/z); c.fillStyle='#ffd27a'; c.textBaseline='middle'; c.fillText(txt,b.x+17/z,b.y-13/z); }
 if(SD.marq){ const q=SD.marq, x=Math.min(q.a.x,q.b.x), y=Math.min(q.a.y,q.b.y), w=Math.abs(q.b.x-q.a.x), hh=Math.abs(q.b.y-q.a.y); c.fillStyle='rgba(255,210,122,.08)'; c.fillRect(x,y,w,hh); c.lineWidth=1/z; c.strokeStyle='#ffd27a'; c.setLineDash([5/z,4/z]); c.strokeRect(x,y,w,hh); c.setLineDash([]); }
 const S=SD.sel; if(S.length){ c.lineWidth=1/z; c.strokeStyle='rgba(255,210,122,.55)'; c.setLineDash([3/z,3/z]);
  if(S.length>1) for(const s of S){ const b=selBox(s); c.save(); c.translate(b.cx,b.cy); c.rotate(b.r); c.strokeRect(-b.w/2,-b.h/2,b.w,b.h); c.restore(); }
  c.setLineDash([]); const one=S.length===1?S[0]:null;
  if(one&&one.type==='shape') nodeHandles(c,one.o,z);
  if(one&&one.type==='path'){ polyPath(c,spOf(one.o)); c.lineWidth=one.o.w+8; c.strokeStyle='rgba(255,210,122,.25)'; c.stroke(); }
  if(!(one&&one.type==='pin')){ const b=groupBox(); c.save(); c.translate(b.cx,b.cy); c.rotate(b.r); c.lineWidth=1.5/z; c.strokeStyle='#ffd27a'; c.setLineDash([5/z,4/z]); c.strokeRect(-b.w/2,-b.h/2,b.w,b.h); c.setLineDash([]);
   const hs=7/z; c.fillStyle='#ffd27a'; c.strokeStyle='#1b140d'; handlePts(b).forEach(([hx,hy],i)=>{ if(i<4){ c.fillRect(hx-hs/2,hy-hs/2,hs,hs); c.strokeRect(hx-hs/2,hy-hs/2,hs,hs); } else { c.beginPath(); c.arc(hx,hy,hs*.45,0,7); c.fill(); c.stroke(); } });
   c.beginPath(); c.moveTo(0,-b.h/2); c.lineTo(0,-b.h/2-18/z); c.strokeStyle='#ffd27a'; c.stroke(); c.beginPath(); c.arc(0,-b.h/2-22/z,5/z,0,7); c.fill(); c.strokeStyle='#1b140d'; c.stroke(); c.restore(); } }
 c.restore(); }

/* ---------- Miniatura y exportación ---------- */
function makeThumb(){ const m=SD.map; if(!m||!SD.terr) return; const k=300/m.w, c=mkC(300,Math.round(m.h*k)), g=c.getContext('2d'); renderScene(g,{x:0,y:0,z:k,k:1},{W:c.width,H:c.height,export:true});
 const f=(LOOKS[(m.fx||{}).look]||LOOKS.natural)[1]; let out=c; if(f!=='none'&&'filter' in g){ out=mkC(c.width,c.height); const o=out.getContext('2d'); o.filter=f; o.drawImage(c,0,0); }
 m.thumb=out.toDataURL('image/jpeg',.72); saveDoc(200); }
async function saveBlob(blob,name){ if(Store.downloads){ try{ const r=await Store.downloads.save({filename:name,data:blob}); if(r&&r.status==='saved') toast('Archivo guardado.'); }catch(e){ if(e&&e.code!=='cancelled'&&e.code!=='declined') toast('No se pudo guardar.','bad'); } return; }
 if(window.claude){ toast('Descargar no está disponible en esta vista.','bad'); return; }
 const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),4000); toast('Archivo guardado.'); }
async function stExport(o={}){ const m=SD.map; if(!m) return; toast('Preparando la imagen…'); await new Promise(r=>setTimeout(r,30)); const scale=o.scale||1;
 try{ const W=Math.round(m.w*scale), H=Math.round(m.h*scale), c=mkC(W,H), g=c.getContext('2d'); if(o.fmt==='jpg'){ g.fillStyle='#fff'; g.fillRect(0,0,W,H); } renderScene(g,{x:0,y:0,z:scale,k:1},{W,H,export:true,grid:o.grid,notes:o.notes});
  const f=(LOOKS[(m.fx||{}).look]||LOOKS.natural)[1]; let out=c; if(f!=='none'){ out=mkC(W,H); const x=out.getContext('2d'); x.filter=f; x.drawImage(c,0,0); }
  const blob=await new Promise(r=>out.toBlob(r,o.fmt==='jpg'?'image/jpeg':'image/png',.92)); if(!blob) throw new Error('mem');
  await saveBlob(blob,(m.name||'mapa').replace(/[^\p{L}\p{N} _-]/gu,'')+(o.fmt==='jpg'?'.jpg':'.png')); }
 catch(e){ console.error(e); toast('La imagen es demasiado grande para este dispositivo. Prueba una resolución menor.','bad'); } }
async function exportProject(){ const m=SD.map; const rasters={}; for(const L of m.L) if(SD.R[L.id]) rasters[L.id]=SD.R[L.id].toDataURL('image/webp',.92);
 const json=JSON.stringify({app:'OperatorlZ',kind:'map',version:3,doc:Object.assign({},m,{thumb:undefined}),rasters});
 await saveBlob(new Blob([json],{type:'application/json'}),(m.name||'mapa').replace(/[^\p{L}\p{N} _-]/gu,'')+'.mapa.json'); }
async function importProject(file){ try{ const d=JSON.parse(await file.text()); if(!d||d.kind!=='map'||!d.doc) throw 0; const m=ensureV3(Object.assign({},d.doc,{id:'map-'+uid(),plane:curPlane,parent:null,created:Date.now()})); m.pins.forEach(p=>p.link=null);
  for(const L of m.L){ const u=d.rasters&&d.rasters[L.id]; if(!u) continue; const b=await (await fetch(u)).blob(); await IDB.set(rKey(m,L),b,'maps'); }
  Store.put('maps',m); toast(`Mapa "${m.name}" importado.`); return m; }catch(e){ toast('Ese archivo no es un proyecto de mapa válido.','bad'); return null; } }
