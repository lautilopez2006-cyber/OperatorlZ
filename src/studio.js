/* ===== Estudio de mapas · motor: lienzo pintado, costas, capas y render ===== */
const SLV={
 global:{n:'Global',desc:'Continentes, mares e islas',W:2400,H:1600,bg:'mar',grid:{type:'hex',size:48,op:.14},scale:50,unit:'km',side:1,tex:'pradera',mul:1,L:'g'},
 nacional:{n:'Nacional',desc:'Un reino o región: pueblos, bosques y caminos',W:2400,H:1600,bg:'mar',grid:{type:'hex',size:48,op:.14},scale:5,unit:'km',side:1,tex:'pradera',mul:1.45,L:'n'},
 minimo:{n:'Mínimo',desc:'Batallas, claros, calles y sectores',W:30*64,H:22*64,bg:'mar',grid:{type:'sq',size:64,op:.28},scale:1.5,unit:'m',side:0,tex:'cesped',mul:1,L:'m'},
 mazmorra:{n:'Mazmorra',desc:'Mazmorras, cuevas, criptas y guaridas',W:34*56,H:26*56,bg:'roca',grid:{type:'sq',size:56,op:.3},scale:1.5,unit:'m',side:0,tex:'mazmorra',mul:1,L:'d'}
};
const LOOKS={natural:['Natural','none'],vivo:['Vivo','saturate(1.28) contrast(1.06)'],pergamino:['Pergamino','sepia(.45) saturate(.85) contrast(.96)'],antiguo:['Antiguo','sepia(.85) contrast(.92) brightness(1.02)'],frio:['Invernal','saturate(.8) hue-rotate(-12deg) brightness(1.04)'],noche:['Noche','brightness(.62) saturate(.7) contrast(1.08)']};
const SD={map:null,terr:null,tg:null,coastU:null,coastO:null,cs:1,view:{x:0,y:0,z:.5},cv:null,ctx:null,dpr:1,raf:0,drag:null,ptrs:new Map(),pinch:null,sel:null,undo:[],redo:[],upx:0,hover:null,space:false,tab:'tool',buf:null,before:null,coastT:0,saveT:0,terrT:0,dark:null,loading:false};
const SB=Object.assign({tool:'terreno',tex:{},size:90,soft:.55,op:1,rough:.35,erase:false,coastLand:true,stamp:{},smul:1,srand:.25,srot:false,sflip:true,smode:'place',dens:.5,srad:120,path:{},pw:{},text:{font:'Cinzel',size:42,color:'#2a2018',halo:1,hc:'#f3ead6',sp:4,curve:0,up:true,it:false},pin:{},allTex:false,cat:{}},lsGet('oz:studio',{}));
const sbSave=()=>lsSet('oz:studio',SB);
const LVK=m=>SLV[m.level]||SLV.global;
const gridColor=m=>m.grid.color||((m.bg==='roca'||m.bg==='vacio'||m.bg==='lava')?'#ffffff':'#1a120c');

/* ---- Lienzo de terreno ---- */
function newTerrain(m){ SD.terr=mkC(m.w,m.h); SD.tg=SD.terr.getContext('2d'); SD.buf=mkC(m.w,m.h); SD.before=mkC(m.w,m.h); SD.coastU=null; SD.coastO=null; }
async function loadTerrain(m){ newTerrain(m); SD.loading=true; const b=await IDB.get(m.id,'maps');
 if(b){ try{ const bmp=await createImageBitmap(b); SD.tg.drawImage(bmp,0,0,m.w,m.h); }catch(e){ console.warn(e); } } SD.loading=false; computeCoast(); draw(); }
function saveTerrain(ms=1200){ clearTimeout(SD.terrT); const m=SD.map, c=SD.terr; SD.terrT=setTimeout(()=>{ if(!c||SD.map!==m) return; c.toBlob(b=>{ if(b) IDB.set(m.id,b,'maps'); },'image/webp',.92); makeThumb(); },ms); }
function saveDoc(ms=500){ clearTimeout(SD.saveT); const m=SD.map; SD.saveT=setTimeout(()=>{ if(m) Store.put('maps',m); },ms); }

/* ---- Distancias exactas (Felzenszwalb) para costas y muros ---- */
function edt1(f,n,d,v,z){ let k=0; v[0]=0; z[0]=-1e20; z[1]=1e20;
 for(let q=1;q<n;q++){ let s=((f[q]+q*q)-(f[v[k]]+v[k]*v[k]))/(2*q-2*v[k]); while(s<=z[k]){ k--; s=((f[q]+q*q)-(f[v[k]]+v[k]*v[k]))/(2*q-2*v[k]); } k++; v[k]=q; z[k]=s; z[k+1]=1e20; }
 k=0; for(let q=0;q<n;q++){ while(z[k+1]<q) k++; const dq=q-v[k]; d[q]=dq*dq+f[v[k]]; } }
function edt(mask,W,H,val){ const g=new Float32Array(W*H), N=Math.max(W,H), f=new Float32Array(N), d=new Float32Array(N), v=new Int32Array(N), z=new Float32Array(N+1);
 for(let i=0;i<W*H;i++) g[i]=mask[i]===val?0:1e10;
 for(let x=0;x<W;x++){ for(let y=0;y<H;y++) f[y]=g[y*W+x]; edt1(f,H,d,v,z); for(let y=0;y<H;y++) g[y*W+x]=d[y]; }
 for(let y=0;y<H;y++){ const o=y*W; for(let x=0;x<W;x++) f[x]=g[o+x]; edt1(f,W,d,v,z); for(let x=0;x<W;x++) g[o+x]=Math.sqrt(d[x]); }
 return g; }
function computeCoast(){ const m=SD.map; if(!m||!SD.terr) return; const s=SD.cs=Math.min(1,1800/Math.max(m.w,m.h)), W=Math.round(m.w*s), H=Math.round(m.h*s);
 const t=mkC(W,H), tg=t.getContext('2d'); tg.drawImage(SD.terr,0,0,W,H); const a=tg.getImageData(0,0,W,H).data, mask=new Uint8Array(W*H);
 let land=0; for(let i=0;i<W*H;i++){ if(a[i*4+3]>110){ mask[i]=1; land++; } }
 SD.coastU=mkC(W,H); SD.coastO=mkC(W,H); if(!land||land===W*H){ draw(); return; }
 const dW=edt(mask,W,H,1), dL=edt(mask,W,H,0), B=BGS[m.bg]||BGS.mar, U=new ImageData(W,H), O=new ImageData(W,H), u=U.data, o=O.data;
 const sm=(e0,e1,x)=>{ const t=clamp((x-e0)/(e1-e0),0,1); return t*t*(3-2*t); };
 const put=(D,i,c,al)=>{ if(al<=0) return; const k=i*4, a0=D[k+3]/255, A=al+a0*(1-al); if(A<=0) return; for(let j=0;j<3;j++) D[k+j]=(c[j]*al+D[k+j]*a0*(1-al))/A; D[k+3]=A*255; };
 const fxS=m.fx||{};
 for(let i=0;i<W*H;i++){
  const av=a[i*4+3]/255;
  if(!mask[i]){ const d=Math.max(0,dW[i]-.5-av*.9)/s;
   if(B.wall){ put(u,i,[78,74,72],(1-sm(0,16,d))*.85); if(d<4.2) put(o,i,[12,10,10],1-sm(3.2,4.2,d)); }
   else if(B.paper){ for(const [r,al] of [[7,.6],[14,.42],[22,.28],[31,.16]]) put(u,i,B.ring,Math.max(0,1-Math.abs(d-r)*s/1.05)*al); if(d<2.4) put(o,i,B.ink,1-sm(1.4,2.4,d)); }
   else { const t=sm(0,fxS.depth??120,d); put(u,i,B.shallow,(1-t)*.6); put(u,i,B.deep,t*.38);
    if(fxS.rings!==false) for(const [r,al] of [[10,.55],[21,.38],[34,.22],[50,.12]]) put(u,i,B.ring,Math.max(0,1-Math.abs(d-r)*s/1.15)*al);
    if(B.lavaGlow) put(u,i,[255,150,60],(1-sm(0,30,d))*.7);
    if(d<2.6) put(o,i,B.ink,1-sm(1.5,2.6,d)); } }
  else { const d=Math.max(0,dL[i]-.5-(1-av)*.9)/s;
   if(B.wall){ put(o,i,[0,0,0],Math.pow(1-sm(0,18,d),1.6)*.55); if(d<1.2) put(o,i,[12,10,10],1-sm(.4,1.2,d)); }
   else { if(B.rim&&fxS.beach!==false) put(o,i,B.rim,(1-sm(0,7,d))*.55); if(d<1.1) put(o,i,B.ink||[30,30,30],(1-sm(.2,1.1,d))*.8); put(o,i,[0,0,0],(1-sm(0,9,d))*.12); } } }
 SD.coastV=(SD.coastV||0)+1; SD.coastU.getContext('2d').putImageData(U,0,0); SD.coastO.getContext('2d').putImageData(O,0,0); draw(); }
function coastSoon(ms=280){ clearTimeout(SD.coastT); SD.coastT=setTimeout(computeCoast,ms); }

/* ---- Pinceles ---- */
const MASKC={}; let NOISEA=null;
function noiseAlpha(){ if(NOISEA) return NOISEA; const T=256, N=sfbm(T,srng(77),[6,16,48],[1,.5,.35]), c=mkC(T,T), g=c.getContext('2d'), img=g.createImageData(T,T);
 for(let i=0;i<T*T;i++){ img.data[i*4+3]=clamp((N[i]-.35)*2.2,0,1)*255; } g.putImageData(img,0,0); return NOISEA=c; }
function softMask(r,h){ r=Math.max(1,Math.round(r)); const key=r+'|'+Math.round(h*20); if(MASKC[key]) return MASKC[key]; const c=mkC(2*r,2*r), g=c.getContext('2d');
 const gr=g.createRadialGradient(r,r,0,r,r,r); gr.addColorStop(0,'#000'); gr.addColorStop(clamp(h,0,.97),'#000'); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.fillRect(0,0,2*r,2*r); return MASKC[key]=c; }
let DAB=null;
function dabMask(r){ const base=softMask(r,SB.soft*.9); if(SB.rough<=.02) return base; const S=Math.ceil(2*r); if(!DAB||DAB.width<S){ DAB=mkC(S,S); } const g=DAB.getContext('2d'); g.setTransform(1,0,0,1,0,0); g.globalCompositeOperation='source-over'; g.clearRect(0,0,DAB.width,DAB.height);
 g.drawImage(base,0,0,S,S); g.globalCompositeOperation='destination-out'; g.globalAlpha=SB.rough; const n=noiseAlpha(), sc=Math.max(.6,S/180); g.save(); g.translate(Math.random()*-200,Math.random()*-200); g.scale(sc,sc); g.drawImage(n,0,0); g.drawImage(n,256,0); g.drawImage(n,0,256); g.drawImage(n,256,256); g.restore(); g.globalAlpha=1;
 g.globalCompositeOperation='source-over'; g.drawImage(softMask(r*.55,.7),S/2-r*.55,S/2-r*.55); return DAB; }
let DABT=null;
function dab(x,y,r,tex){ const S=Math.ceil(2*r), bg=SD.buf.getContext('2d'); const mk=dabMask(r);
 if(tex){ if(!DABT||DABT.width<S||DABT.height<S) DABT=mkC(Math.max(S,DABT?DABT.width:0),Math.max(S,DABT?DABT.height:0)); const g=DABT.getContext('2d'); g.setTransform(1,0,0,1,0,0); g.globalCompositeOperation='source-over'; g.clearRect(0,0,S,S);
  g.save(); g.translate(-(x-r),-(y-r)); g.fillStyle=texPattern(g,tex); g.fillRect(x-r,y-r,S,S); g.restore(); g.globalCompositeOperation='destination-in'; g.drawImage(mk,0,0,S,S); bg.drawImage(DABT,0,0,S,S,x-r,y-r,S,S); }
 else bg.drawImage(mk,0,0,S,S,x-r,y-r,S,S); }
/* Trazo: se pinta en un búfer y se compone con la opacidad elegida */
function strokeBegin(erase,tex){ const m=SD.map; const b=SD.buf.getContext('2d'); b.setTransform(1,0,0,1,0,0); b.clearRect(0,0,m.w,m.h); const bf=SD.before.getContext('2d'); bf.clearRect(0,0,m.w,m.h); bf.drawImage(SD.terr,0,0);
 SD.stroke={erase,tex,bb:[1e9,1e9,-1e9,-1e9],last:null,op:SB.op}; }
function strokeTo(x,y){ const st=SD.stroke; if(!st) return; const r=SB.size/2; const pts=[];
 if(!st.last) pts.push([x,y]); else { const [lx,ly]=st.last, d=Math.hypot(x-lx,y-ly), step=Math.max(1,r*.22); if(d<step) return; for(let t=step;t<=d;t+=step) pts.push([lx+(x-lx)*t/d,ly+(y-ly)*t/d]); }
 for(const [px,py] of pts){ dab(px,py,r,st.erase?null:st.tex); st.last=[px,py]; st.bb[0]=Math.min(st.bb[0],px-r); st.bb[1]=Math.min(st.bb[1],py-r); st.bb[2]=Math.max(st.bb[2],px+r); st.bb[3]=Math.max(st.bb[3],py+r); }
 strokeCompose(); }
function strokeCompose(){ const st=SD.stroke, m=SD.map; if(!st) return; const x0=clamp(Math.floor(st.bb[0])-2,0,m.w), y0=clamp(Math.floor(st.bb[1])-2,0,m.h), x1=clamp(Math.ceil(st.bb[2])+2,0,m.w), y1=clamp(Math.ceil(st.bb[3])+2,0,m.h), w=x1-x0, h=y1-y0; if(w<=0||h<=0) return;
 const g=SD.tg; g.save(); g.globalCompositeOperation='copy'; g.beginPath(); g.rect(x0,y0,w,h); g.clip(); g.drawImage(SD.before,0,0); g.restore();
 g.save(); g.globalAlpha=st.op; g.globalCompositeOperation=st.erase?'destination-out':'source-over'; g.drawImage(SD.buf,x0,y0,w,h,x0,y0,w,h); g.restore(); draw(); }
function strokeEnd(){ const st=SD.stroke; SD.stroke=null; if(!st||st.bb[2]<st.bb[0]) return; const m=SD.map; const x0=clamp(Math.floor(st.bb[0])-2,0,m.w), y0=clamp(Math.floor(st.bb[1])-2,0,m.h), x1=clamp(Math.ceil(st.bb[2])+2,0,m.w), y1=clamp(Math.ceil(st.bb[3])+2,0,m.h);
 pushTerrUndo(x0,y0,x1-x0,y1-y0); coastSoon(); saveTerrain(); }
function pushTerrUndo(x,y,w,h,beforeC){ if(w<=0||h<=0) return; const b=mkC(w,h), a=mkC(w,h); b.getContext('2d').drawImage(beforeC||SD.before,x,y,w,h,0,0,w,h); a.getContext('2d').drawImage(SD.terr,x,y,w,h,0,0,w,h);
 stPush({t:'r',x,y,w,h,b,a,px:w*h*2}); }
function fillAll(tex,landOnly){ const m=SD.map; const bf=SD.before.getContext('2d'); bf.clearRect(0,0,m.w,m.h); bf.drawImage(SD.terr,0,0);
 const g=SD.tg; g.save(); if(landOnly) g.globalCompositeOperation='source-atop'; g.fillStyle=texPattern(g,tex); g.fillRect(0,0,m.w,m.h); g.restore(); pushTerrUndo(0,0,m.w,m.h); computeCoast(); saveTerrain(400); }

/* ---- Deshacer ---- */
const vecSnap=()=>JSON.stringify({s:SD.map.stamps,p:SD.map.paths,l:SD.map.labels,k:SD.map.pins});
function vecCommit(before){ const a=vecSnap(); if(a===before) return; stPush({t:'v',b:before,a,px:0}); saveDoc(); }
function stPush(u){ SD.undo.push(u); SD.upx+=u.px; SD.redo=[]; while(SD.undo.length>80||SD.upx>30e6){ const x=SD.undo.shift(); SD.upx-=x.px; } stUpdUndo(); }
function applyU(u,back){ const m=SD.map; if(u.t==='v'){ const s=JSON.parse(back?u.b:u.a); m.stamps=s.s; m.paths=s.p; m.labels=s.l; m.pins=s.k; SD.sel=null; saveDoc(); }
 else { const g=SD.tg; g.save(); g.globalCompositeOperation='copy'; g.beginPath(); g.rect(u.x,u.y,u.w,u.h); g.clip(); g.drawImage(back?u.b:u.a,u.x,u.y); g.restore(); coastSoon(50); saveTerrain(); }
 draw(); stPanel(); }
function stUndo(){ const u=SD.undo.pop(); if(!u) return toast('No hay nada que deshacer.'); SD.upx-=u.px; SD.redo.push(u); applyU(u,true); stUpdUndo(); }
function stRedo(){ const u=SD.redo.pop(); if(!u) return toast('No hay nada que rehacer.'); SD.undo.push(u); SD.upx+=u.px; applyU(u,false); stUpdUndo(); }

/* ---- Caminos ---- */
const PATHS={
 rio:{n:'Río',lv:'gnmd',w:{g:7,n:9,m:.9,d:.8}},camino:{n:'Camino',lv:'gn',w:{g:3,n:4}},sendero:{n:'Sendero',lv:'gnm',w:{g:2.5,n:3,m:.12}},frontera:{n:'Frontera',lv:'gn',w:{g:4,n:5}},ruta:{n:'Ruta marítima',lv:'gn',w:{g:2.5,n:3}},
 calzada:{n:'Calzada empedrada',lv:'md',w:{m:1.4,d:1.2}},tierra:{n:'Camino de tierra',lv:'m',w:{m:1.4}},muro:{n:'Muro de piedra',lv:'md',w:{m:.35,d:.4}},empalizada:{n:'Empalizada',lv:'m',w:{m:.35}},cerca:{n:'Cerca',lv:'m',w:{m:.25}},acantilado:{n:'Acantilado',lv:'gnmd',w:{g:5,n:6,m:.5,d:.5}}
};
function pathWidth(m,t){ const L=LVK(m).L, w=PATHS[t].w[L]??PATHS[t].w.g??1; return L==='m'||L==='d'?w*m.grid.size:w; }
function samplePath(pts,step=4){ if(pts.length<2) return pts.slice(); const out=[]; const P=i=>pts[clamp(i,0,pts.length-1)];
 for(let i=0;i<pts.length-1;i++){ const p0=P(i-1),p1=P(i),p2=P(i+1),p3=P(i+2), L=Math.hypot(p2[0]-p1[0],p2[1]-p1[1]), n=Math.max(1,Math.ceil(L/step));
  for(let j=0;j<n;j++){ const t=j/n, t2=t*t, t3=t2*t; out.push([.5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),.5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)]); } }
 out.push(pts[pts.length-1]); return out; }
function polyPath(c,pts){ c.beginPath(); pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); }
const SPC=new WeakMap(); const spOf=p=>{ let v=SPC.get(p); if(!v||v.n!==p.pts.length||v.x!==p.pts[0][0]){ v={n:p.pts.length,x:p.pts[0][0],pts:samplePath(p.pts)}; SPC.set(p,v); } return v.pts; };
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
   c.strokeStyle='rgba(20,15,12,.7)'; c.lineWidth=1.4; let acc=0; for(let i=1;i<pts.length;i++){ const a=pts[i-1], b=pts[i], l=Math.hypot(b[0]-a[0],b[1]-a[1]); acc+=l; if(acc>w*1.4){ acc=0; const dx=(b[0]-a[0])/l, dy=(b[1]-a[1])/l; c.beginPath(); c.moveTo(b[0]-dy*w/2,b[1]+dx*w/2); c.lineTo(b[0]+dy*w/2,b[1]-dx*w/2); c.stroke(); } } break; }
  case 'empalizada':{ let acc=w; for(let i=1;i<pts.length;i++){ const a=pts[i-1], b=pts[i], l=Math.hypot(b[0]-a[0],b[1]-a[1]); acc+=l; while(acc>=w*.9){ acc-=w*.9; const t=1-acc/l, x=a[0]+(b[0]-a[0])*t, y=a[1]+(b[1]-a[1])*t;
    c.beginPath(); c.arc(x+2,y+3,w/2,0,7); c.fillStyle='rgba(0,0,0,.35)'; c.fill(); c.beginPath(); c.arc(x,y,w/2,0,7); c.fillStyle='#7a5434'; c.fill(); c.lineWidth=1.2; c.strokeStyle=INK; c.stroke(); c.beginPath(); c.arc(x,y,w/4,0,7); c.strokeStyle='rgba(220,180,120,.5)'; c.stroke(); } } break; }
  case 'cerca': polyPath(c,pts); c.lineWidth=w*.45+2; c.strokeStyle=INK; c.stroke(); c.lineWidth=w*.45; c.strokeStyle='#9a7448'; c.stroke(); { let acc=0; for(let i=1;i<pts.length;i++){ const a=pts[i-1], b=pts[i]; acc+=Math.hypot(b[0]-a[0],b[1]-a[1]); if(acc>w*3){ acc=0; c.fillStyle='#6b4a2e'; c.fillRect(b[0]-w*.45,b[1]-w*.45,w*.9,w*.9); c.lineWidth=1; c.strokeStyle=INK; c.strokeRect(b[0]-w*.45,b[1]-w*.45,w*.9,w*.9); } } } break;
  case 'acantilado':{ c.strokeStyle='rgba(30,22,16,.75)'; c.lineWidth=1.3; for(let i=1;i<pts.length;i+=2){ const a=pts[i-1], b=pts[i], l=Math.hypot(b[0]-a[0],b[1]-a[1])||1, dx=(b[0]-a[0])/l, dy=(b[1]-a[1])/l, L=w*(1.2+((i*7)%5)/5);
    c.beginPath(); c.moveTo(b[0],b[1]); c.lineTo(b[0]+dy*L,b[1]-dx*L); c.stroke(); } polyPath(c,pts); c.lineWidth=w*.5+1.5; c.strokeStyle=INK; c.stroke(); break; }
 } c.restore(); }

/* ---- Textos ---- */
const LBW=new WeakMap();
const FONTS=[['Cinzel','Cinzel'],['Cinzel Decorative','Cinzel Decorativa'],['IM Fell English SC','Imprenta antigua'],['IM Fell English','Imprenta cursiva',1],['Uncial Antiqua','Uncial'],['Pirata One','Gótica'],['MedievalSharp','Medieval'],['Marcellus SC','Marcellus'],['Alegreya Sans','Moderna']];
function labelFont(l){ return `${l.it?'italic ':''}${l.font==='Cinzel'||l.font==='Cinzel Decorative'?'700 ':'400 '}${l.size}px "${l.font}"`; }
function drawLabel(c,l){ const txt=l.up?l.text.toUpperCase():l.text; if(!txt) return; c.save(); c.translate(l.x,l.y); if(l.r) c.rotate(l.r); c.font=labelFont(l); c.textBaseline='middle'; c.textAlign='left'; c.lineJoin='round';
 const sp=(l.sp||0)*l.size/40, chars=[...txt], ws=chars.map(ch=>c.measureText(ch).width), W=ws.reduce((a,b)=>a+b,0)+sp*(chars.length-1); LBW.set(l,W);
 const each=(fn)=>{ if(Math.abs(l.curve||0)<.01){ let x=-W/2; chars.forEach((ch,i)=>{ fn(ch,x,0,0); x+=ws[i]+sp; }); return; }
  const Rr=W/((l.curve)*Math.PI*.9); let s=-W/2; chars.forEach((ch,i)=>{ const mid=s+ws[i]/2, th=mid/Rr; fn(ch,Rr*Math.sin(th)-ws[i]/2*Math.cos(th),Rr*(1-Math.cos(th))-ws[i]/2*Math.sin(th),th); s+=ws[i]+sp; }); };
 const put=(stroke)=>each((ch,x,y,th)=>{ c.save(); c.translate(x,y); c.rotate(th); stroke?c.strokeText(ch,0,0):c.fillText(ch,0,0); c.restore(); });
 if(l.halo){ c.lineWidth=Math.max(2,l.size*.16*l.halo); c.strokeStyle=l.hc||'#f3ead6'; c.globalAlpha=.9; put(true); c.globalAlpha=1; }
 c.fillStyle=l.color||INK; put(false); c.restore(); }

/* ---- Cuadrícula ---- */
function drawGrid(c,m,vb,z){ const G=m.grid; if(!G.on) return; const s=G.size; c.save(); c.globalAlpha=G.op; c.strokeStyle=gridColor(m); c.lineWidth=Math.max(.6,1/z); c.beginPath();
 const x0=Math.max(0,vb[0]), y0=Math.max(0,vb[1]), x1=Math.min(m.w,vb[2]), y1=Math.min(m.h,vb[3]);
 if(G.type==='hex'){ const r=s/Math.sqrt(3), h=1.5*r; for(let row=Math.floor(y0/h)-1;row<=y1/h+1;row++){ const off=row%2?s/2:0; for(let col=Math.floor((x0-off)/s)-1;col<=(x1-off)/s+1;col++){ const cx=col*s+off, cy=row*h;
   for(let k=0;k<=6;k++){ const a=-Math.PI/2+k*Math.PI/3, X=cx+r*Math.cos(a), Y=cy+r*Math.sin(a); k?c.lineTo(X,Y):c.moveTo(X,Y); } } } }
 else { for(let x=Math.ceil(x0/s)*s;x<=x1;x+=s){ c.moveTo(x,y0); c.lineTo(x,y1); } for(let y=Math.ceil(y0/s)*s;y<=y1;y+=s){ c.moveTo(x0,y); c.lineTo(x1,y); } }
 c.stroke(); c.restore(); }

/* ---- Objetos ---- */
function stampDims(st){ const d=STAMPS[st.k]; const [bw,bh]=d.box, u=st.s/Math.max(bw,bh); return {d,u,w:bw*u,h:bh*u,ay:d.ay??.9}; }
function drawStamp(c,st,z,exp){ const D=stampDims(st); const px=Math.pow(2,Math.ceil(Math.log2(clamp(st.s*z*(exp?1:SD.dpr),24,exp?1024:512)))); const spr=stampSprite(st.k,st.v||0,px);
 c.save(); c.translate(st.x,st.y); if(st.r) c.rotate(st.r); if(st.f) c.scale(-1,1); if(st.o!=null) c.globalAlpha=st.o; const P=D.d.side?1:1.36; c.drawImage(spr,-D.w*P/2,-D.h*P*D.ay,D.w*P,D.h*P); c.restore(); }
function lightOf(st,m){ const d=STAMPS[st.k]; if(!d||!d.light) return null; const k=st.s/(d.side?d.sz*LVK(m).mul:d.sz*m.grid.size); return {x:st.x,y:st.y-(d.side?stampDims(st).h*.5:0),r:(d.side?d.light[0]*LVK(m).mul:d.light[0]*m.grid.size)*k,c:d.light[1]}; }
function stampOrder(m){ const L=m.stamps.slice(); const side=LVK(m).side; return L.map((s,i)=>[s,i]).sort((A,B)=>{ const a=A[0],b=B[0], fa=STAMPS[a.k]?.flat?0:1, fb=STAMPS[b.k]?.flat?0:1; if(fa!==fb) return fa-fb; if(a.k==='brujula'||b.k==='brujula') return (a.k==='brujula')-(b.k==='brujula'); return side?(a.y-b.y)||(A[1]-B[1]):A[1]-B[1]; }).map(x=>x[0]); }

/* ---- Marcadores ---- */
function pinKinds(m){ return (MARK[m.level]||MARK.nacional); }
function drawPin(c,p,z,sel){ const s=15/z; c.save(); c.translate(p.x,p.y); c.fillStyle='rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(1/z,1/z,s*.45,s*.18,0,0,7); c.fill();
 c.beginPath(); c.moveTo(0,0); c.bezierCurveTo(-s*.9,-s*1.1,-s*.95,-s*2.3,0,-s*2.3); c.bezierCurveTo(s*.95,-s*2.3,s*.9,-s*1.1,0,0); c.fillStyle=sel?'#ffd27a':'#d6a44c'; c.fill(); c.lineWidth=1.6/z; c.strokeStyle='#1b140d'; c.stroke();
 c.fillStyle='#1b140d'; iconPath(c,p.kind,0,-s*1.55,s*.55); c.globalCompositeOperation='source-over';
 if(p.name){ c.font=`600 ${12/z}px "Alegreya Sans"`; c.textAlign='center'; c.textBaseline='top'; c.lineWidth=3/z; c.strokeStyle='rgba(15,12,10,.85)'; c.strokeText(p.name,0,4/z); c.fillStyle='#f6ecd6'; c.fillText(p.name,0,4/z); } c.restore(); }

/* ---- Render de la escena ---- */
function renderScene(c,v,opt={}){ const m=SD.map; if(!m) return; const z=v.z, Lh=m.layers||{}, vis=k=>!Lh[k];
 const W=opt.W, H=opt.H; const vb=[-v.x/z,-v.y/z,(W-v.x)/z,(H-v.y)/z];
 c.save(); c.setTransform(v.k*z,0,0,v.k*z,v.k*v.x,v.k*v.y); c.imageSmoothingEnabled=true; c.imageSmoothingQuality=opt.export?'high':'medium';
 c.beginPath(); c.rect(0,0,m.w,m.h); c.clip();
 if(vis('fondo')){ c.fillStyle=texPattern(c,m.bg,true); c.fillRect(0,0,m.w,m.h); } else { c.fillStyle='#ece4d2'; c.fillRect(0,0,m.w,m.h); }
 if(vis('costa')&&SD.coastU) c.drawImage(SD.coastU,0,0,m.w,m.h);
 if(vis('terreno')&&SD.terr) c.drawImage(SD.terr,0,0);
 if(vis('costa')&&SD.coastO) c.drawImage(SD.coastO,0,0,m.w,m.h);
 if(vis('caminos')) for(const p of m.paths) if(p.t==='rio'||p.t==='acantilado'||p.t==='calzada'||p.t==='tierra') drawPath(c,p,m);
 if(vis('caminos')) for(const p of m.paths) if(!(p.t==='rio'||p.t==='acantilado'||p.t==='calzada'||p.t==='tierra')) drawPath(c,p,m);
 const lights=[];
 if(vis('objetos')) for(const st of stampOrder(m)){ if(!STAMPS[st.k]) continue; const D=stampDims(st); if(st.x+D.w<vb[0]||st.x-D.w>vb[2]||st.y+D.h<vb[1]||st.y-D.h>vb[3]) { const L=lightOf(st,m); if(L) lights.push(L); continue; }
  if(!(STAMPS[st.k].editorOnly&&opt.export)) drawStamp(c,st,z,opt.export); const L=lightOf(st,m); if(L) lights.push(L); }
 const fx=m.fx||{};
 if(vis('luces')){
  if(fx.dark>0){ const dc=SD.dark&&SD.dark.width===W&&SD.dark.height===H?SD.dark:(SD.dark=mkC(W,H)); const g=dc.getContext('2d'); g.setTransform(1,0,0,1,0,0); g.globalCompositeOperation='source-over'; g.clearRect(0,0,W,H); g.fillStyle=`rgba(6,6,16,${fx.dark})`; g.fillRect(0,0,W,H);
   g.setTransform(v.k*z,0,0,v.k*z,v.k*v.x,v.k*v.y); g.globalCompositeOperation='destination-out'; for(const L of lights){ const gr=g.createRadialGradient(L.x,L.y,0,L.x,L.y,L.r); gr.addColorStop(0,'rgba(0,0,0,1)'); gr.addColorStop(.55,'rgba(0,0,0,.75)'); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.beginPath(); g.arc(L.x,L.y,L.r,0,7); g.fill(); }
   c.save(); c.setTransform(1,0,0,1,0,0); c.drawImage(dc,0,0); c.restore(); }
  c.save(); c.globalCompositeOperation='screen'; for(const L of lights){ const gr=c.createRadialGradient(L.x,L.y,0,L.x,L.y,L.r*.8); gr.addColorStop(0,`rgba(${L.c},.55)`); gr.addColorStop(1,`rgba(${L.c},0)`); c.fillStyle=gr; c.beginPath(); c.arc(L.x,L.y,L.r*.8,0,7); c.fill(); } c.restore(); }
 if(vis('texto')) for(const l of m.labels) drawLabel(c,l);
 if(vis('cuadricula')){ if((BGS[m.bg]||{}).wall&&m.grid.on){ const gc=gridMasked(m); if(gc) c.drawImage(gc,0,0,m.w,m.h); } else drawGrid(c,m,vb,z); }
 if(vis('efectos')){
  if(fx.look==='noche'){ c.save(); c.globalCompositeOperation='multiply'; c.fillStyle='rgba(70,90,160,.45)'; c.fillRect(0,0,m.w,m.h); c.restore(); }
  if(fx.paper>0){ c.save(); c.globalCompositeOperation='multiply'; c.globalAlpha=fx.paper*.75; c.fillStyle=texPattern(c,'pergamino',true); c.fillRect(0,0,m.w,m.h); c.restore(); }
  const p=planeById(m.plane||'material'); if(p.tint&&fx.tint!==false){ c.save(); c.globalCompositeOperation=p.tint[1]; c.globalAlpha=p.tint[2]*.55; c.fillStyle=p.tint[0]; c.fillRect(0,0,m.w,m.h); c.restore(); }
  if(fx.vig>0){ const gr=c.createRadialGradient(m.w/2,m.h/2,Math.min(m.w,m.h)*.35,m.w/2,m.h/2,Math.hypot(m.w,m.h)*.56); gr.addColorStop(0,'rgba(25,15,8,0)'); gr.addColorStop(1,`rgba(25,15,8,${fx.vig*.85})`); c.fillStyle=gr; c.fillRect(0,0,m.w,m.h); }
  if(fx.frame&&fx.frame!=='none') drawFrame(c,m,fx.frame); }
 if(!opt.export&&vis('marcadores')) for(const p of m.pins) drawPin(c,p,z,SD.sel&&SD.sel.o===p);
 c.restore(); }
function gridMasked(m){ const key=[m.grid.size,m.grid.type,m.grid.op,m.grid.color,SD.coastV].join('|'); if(SD.gridC&&SD.gridK===key) return SD.gridC; if(!SD.terr) return null;
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

/* ---- Bucle de dibujo del editor ---- */
function draw(){ if(SD.raf||!SD.cv) return; SD.raf=requestAnimationFrame(()=>{ SD.raf=0; drawNow(); }); }
function drawNow(){ const c=SD.ctx, cv=SD.cv, m=SD.map; if(!c||!m) return; const W=cv.width, H=cv.height;
 c.setTransform(1,0,0,1,0,0); c.clearRect(0,0,W,H);
 c.save(); c.setTransform(SD.dpr*SD.view.z,0,0,SD.dpr*SD.view.z,SD.dpr*SD.view.x,SD.dpr*SD.view.y); c.shadowColor='rgba(0,0,0,.55)'; c.shadowBlur=40*SD.dpr; c.fillStyle='#000'; c.fillRect(0,0,m.w,m.h); c.restore();
 renderScene(c,{x:SD.view.x,y:SD.view.y,z:SD.view.z,k:SD.dpr},{W,H});
 cv.style.filter=(LOOKS[(m.fx||{}).look]||LOOKS.natural)[1];
 overlay(c); }
function overlay(c){ const m=SD.map, z=SD.view.z; c.save(); c.setTransform(SD.dpr*z,0,0,SD.dpr*z,SD.dpr*SD.view.x,SD.dpr*SD.view.y);
 const h=SD.hover, t=SB.tool;
 if(h&&(t==='terreno'||t==='costa'||(t==='objetos'&&SB.smode!=='place'))){ const r=t==='objetos'?SB.srad/2:SB.size/2; c.beginPath(); c.arc(h.x,h.y,r,0,7); c.lineWidth=2/z; c.strokeStyle='rgba(0,0,0,.55)'; c.stroke(); c.lineWidth=1/z; c.strokeStyle='#fff'; c.stroke();
  if(t==='terreno'||t==='costa'){ c.beginPath(); c.arc(h.x,h.y,r*SB.soft*.9,0,7); c.setLineDash([4/z,4/z]); c.strokeStyle='rgba(255,255,255,.6)'; c.stroke(); c.setLineDash([]); } }
 if(h&&t==='objetos'&&SB.smode==='place'){ const id=curStamp(); if(STAMPS[id]){ c.globalAlpha=.6; drawStamp(c,{k:id,x:h.x,y:h.y,s:defSize(id)*SB.smul,v:SD.ghostV||0,r:0},z); c.globalAlpha=1; } }
 if(SD.draft&&SD.draft.pts.length>1){ const p=SD.draft; drawPath(c,{t:p.t,w:p.w,pts:p.pts,sp:samplePath(p.pts)},m); }
 if(SD.ruler){ const {a,b}=SD.ruler; c.beginPath(); c.moveTo(a.x,a.y); c.lineTo(b.x,b.y); c.lineWidth=3/z; c.strokeStyle='rgba(0,0,0,.6)'; c.stroke(); c.setLineDash([8/z,6/z]); c.lineWidth=1.6/z; c.strokeStyle='#ffd27a'; c.stroke(); c.setLineDash([]);
  for(const p of [a,b]){ c.beginPath(); c.arc(p.x,p.y,4/z,0,7); c.fillStyle='#ffd27a'; c.fill(); }
  const d=Math.hypot(b.x-a.x,b.y-a.y)/m.grid.size*m.scale, txt=`${d<10?d.toFixed(1):Math.round(d)} ${m.unit}`+(m.unit==='km'&&d>5?` · ${(d/38).toFixed(1)} días`:'')+(m.unit==='m'?` · ${Math.round(d/1.5)} casillas`:'');
  c.font=`600 ${13/z}px "IBM Plex Mono"`; const tw=c.measureText(txt).width; c.fillStyle='rgba(15,12,10,.85)'; c.fillRect(b.x+10/z,b.y-24/z,tw+14/z,22/z); c.fillStyle='#ffd27a'; c.textBaseline='middle'; c.fillText(txt,b.x+17/z,b.y-13/z); }
 const s=SD.sel; if(s){ c.lineWidth=1.5/z; c.strokeStyle='#ffd27a'; c.setLineDash([5/z,4/z]);
  if(s.type==='stamp'||s.type==='label'){ const bx=selBox(s); c.save(); c.translate(bx.cx,bx.cy); c.rotate(bx.r); c.strokeRect(-bx.w/2,-bx.h/2,bx.w,bx.h); c.setLineDash([]);
   c.fillStyle='#ffd27a'; c.strokeStyle='#1b140d'; const hs=7/z; c.fillRect(bx.w/2-hs/2,bx.h/2-hs/2,hs,hs); c.strokeRect(bx.w/2-hs/2,bx.h/2-hs/2,hs,hs);
   c.beginPath(); c.moveTo(0,-bx.h/2); c.lineTo(0,-bx.h/2-18/z); c.strokeStyle='#ffd27a'; c.stroke(); c.beginPath(); c.arc(0,-bx.h/2-22/z,5/z,0,7); c.fill(); c.strokeStyle='#1b140d'; c.stroke(); c.restore(); }
  else if(s.type==='path'){ const pts=spOf(s.o); polyPath(c,pts); c.lineWidth=(s.o.w+8)/1; c.strokeStyle='rgba(255,210,122,.25)'; c.setLineDash([]); c.stroke(); }
  c.setLineDash([]); }
 c.restore(); }
function selBox(s){ const o=s.o; if(s.type==='stamp'){ const D=stampDims(o); const ly=-D.h*D.ay+D.h/2; const r=o.r||0; return {cx:o.x-Math.sin(r)*ly,cy:o.y+Math.cos(r)*ly,w:D.w,h:D.h,r}; }
 const c=SD.ctx; c.save(); c.font=labelFont(o); const W=LBW.get(o)||c.measureText(o.up?o.text.toUpperCase():o.text).width; c.restore(); const ext=Math.abs(o.curve||0)*W*.18; return {cx:o.x,cy:o.y+(o.curve>0?ext/2:-ext/2),w:W+o.size*.4,h:o.size*1.2+ext,r:o.r||0}; }

/* ---- Miniatura y exportación ---- */
function makeThumb(){ const m=SD.map; if(!m) return; const k=300/m.w, c=mkC(300,Math.round(m.h*k)), g=c.getContext('2d'); renderScene(g,{x:0,y:0,z:k,k:1},{W:c.width,H:c.height,export:true});
 const f=(LOOKS[(m.fx||{}).look]||LOOKS.natural)[1]; let out=c; if(f!=='none'&&'filter' in g){ out=mkC(c.width,c.height); const o=out.getContext('2d'); o.filter=f; o.drawImage(c,0,0); }
 m.thumb=out.toDataURL('image/jpeg',.72); saveDoc(200); }
async function stExport(scale=1){ const m=SD.map; if(!m) return; toast('Preparando la imagen…'); await new Promise(r=>setTimeout(r,30));
 const W=Math.round(m.w*scale), H=Math.round(m.h*scale), c=mkC(W,H), g=c.getContext('2d'); renderScene(g,{x:0,y:0,z:scale,k:1},{W,H,export:true});
 const f=(LOOKS[(m.fx||{}).look]||LOOKS.natural)[1]; let out=c; if(f!=='none'){ out=mkC(W,H); const o=out.getContext('2d'); o.filter=f; o.drawImage(c,0,0); }
 const blob=await new Promise(r=>out.toBlob(r,'image/png')); const name=(m.name||'mapa').replace(/[^\p{L}\p{N} _-]/gu,'')+'.png';
 if(Store.downloads){ try{ const r=await Store.downloads.save({filename:name,data:blob}); if(r&&r.status==='saved') toast('Mapa exportado.'); }catch(e){ if(e&&e.code!=='cancelled'&&e.code!=='declined') toast('No se pudo exportar.','bad'); } return; }
 if(window.claude){ toast('Exportar no está disponible en esta vista.','bad'); return; }
 const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),4000); toast('Mapa exportado.'); }
