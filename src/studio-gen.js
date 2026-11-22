/* ===== Estudio de mapas · generadores: mundos, regiones, claros y mazmorras ===== */
function svnoise(seed){ const R=srng(seed), P=new Uint8Array(512), V=new Float32Array(256); for(let i=0;i<256;i++){ P[i]=i; V[i]=R(); } for(let i=255;i>0;i--){ const j=(R()*(i+1))|0; [P[i],P[j]]=[P[j],P[i]]; } for(let i=0;i<256;i++) P[i+256]=P[i];
 return (x,y)=>{ const xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf), h=(i,j)=>V[P[(P[i&255]+j)&255]];
  const a=h(xi,yi), b=h(xi+1,yi), c=h(xi,yi+1), d=h(xi+1,yi+1); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }; }
function fbm2(n,x,y,o=5){ let s=0,a=.5,f=1,t=0; for(let i=0;i<o;i++){ s+=a*n(x*f,y*f); t+=a; a*=.5; f*=2.03; } return s/t; }
const SYL=['ar','bel','dor','en','gar','is','mar','nor','os','ran','sil','thal','um','vel','wyn','zar','ka','lo','mi','na','ra','tor','ya','eth','an','ia','ur','va','gon','del','fen','mor','qua','lin','hal','bri'];
function fname(R,n){ let s=''; const k=n||2+((R()*2)|0); for(let i=0;i<k;i++) s+=SYL[(R()*SYL.length)|0]; return s[0].toUpperCase()+s.slice(1); }
const smoothst=(e0,e1,x)=>{ const t=clamp((x-e0)/(e1-e0),0,1); return t*t*(3-2*t); };

/* Pinta una textura en todo el mapa usando una máscara de baja resolución (valores 0..1) */
function paintMask(m,tex,vals,gw,gh,alpha=1,erase){ const mc=mkC(gw,gh), g=mc.getContext('2d'), img=g.createImageData(gw,gh); for(let i=0;i<gw*gh;i++) img.data[i*4+3]=clamp(vals[i],0,1)*255; g.putImageData(img,0,0);
 const big=mkC(m.w,m.h), bg=big.getContext('2d'); bg.imageSmoothingEnabled=true; bg.imageSmoothingQuality='high'; const blr=(m.w/gw)*.7; const up=()=>{ if('filter' in bg) bg.filter=`blur(${blr}px)`; bg.drawImage(mc,0,0,m.w,m.h); if('filter' in bg) bg.filter='none'; };
 if(erase){ up(); SD.tg.save(); SD.tg.globalCompositeOperation='destination-out'; SD.tg.globalAlpha=alpha; SD.tg.drawImage(big,0,0); SD.tg.restore(); return; }
 bg.fillStyle=texPattern(bg,tex); bg.fillRect(0,0,m.w,m.h); bg.globalCompositeOperation='destination-in'; up();
 SD.tg.save(); SD.tg.globalAlpha=alpha; SD.tg.drawImage(big,0,0); SD.tg.restore(); }
function blob(m,tex,x,y,r,alpha=1,erase){ const S=Math.ceil(r*2), c=mkC(S,S), g=c.getContext('2d'); const R=srng((x*7+y*13)|0);
 const pts=[]; for(let i=0;i<14;i++){ const a=i/14*Math.PI*2; pts.push([r+Math.cos(a)*r*(.62+R()*.32),r+Math.sin(a)*r*(.62+R()*.32)]); }
 if('filter' in g) g.filter=`blur(${Math.max(1,r*.08)}px)`; smooth(g,pts); g.fillStyle='#000'; g.fill(); if('filter' in g) g.filter='none';
 if(!erase){ g.globalCompositeOperation='source-in'; g.save(); g.translate(-(x-r),-(y-r)); g.fillStyle=texPattern(g,tex); g.fillRect(x-r,y-r,S,S); g.restore(); }
 SD.tg.save(); SD.tg.globalAlpha=alpha; if(erase) SD.tg.globalCompositeOperation='destination-out'; SD.tg.drawImage(c,x-r,y-r); SD.tg.restore(); }
const mkLabel=(m,x,y,text,o={})=>m.labels.push(Object.assign({id:uid(),x,y,text,font:'Cinzel',size:20,color:'#2a2018',halo:1,hc:'#f3ead6',sp:3,curve:0,up:true,it:false,r:0},o));
const mkStamp=(m,k,x,y,s,R,o={})=>m.stamps.push(Object.assign({id:uid(),k,x:Math.round(x),y:Math.round(y),s:Math.round(s),v:(R()*8)|0,r:0},R()<.5&&STAMPS[k].side?{f:1}:{},o));

async function stGenerate(m,fresh){ toast('Generando el mapa…'); await new Promise(r=>setTimeout(r,40)); const seed=(Math.random()*1e9)|0, R=srng(seed);
 SD.tg.clearRect(0,0,m.w,m.h); m.stamps=[]; m.paths=[]; m.labels=[]; if(fresh) m.pins=[];
 try{ if(m.level==='mazmorra') genDungeon2(m,R); else if(m.level==='minimo') genClearing(m,R); else genWorld(m,R,m.level==='nacional'); }catch(e){ console.error(e); toast('No se pudo generar el terreno.','bad'); }
 SD.undo=fresh?[]:SD.undo; if(fresh) SD.upx=0; draw(); }

function genWorld(m,R,regional){ const cell=4, gw=Math.ceil(m.w/cell), gh=Math.ceil(m.h/cell), N=gw*gh, E=new Float32Array(N), Mo=new Float32Array(N), Te=new Float32Array(N);
 const n1=svnoise(R()*1e9|0), n2=svnoise(R()*1e9|0), n3=svnoise(R()*1e9|0), k=regional?2.6:3.4, asp=gh/gw;
 const isl=!regional&&R()<.4, cx=.5+(R()-.5)*.1, cy=.5+(R()-.5)*.1, side=(R()*4)|0;
 for(let y=0;y<gh;y++) for(let x=0;x<gw;x++){ const nx=x/gw, ny=y/gh, i=y*gw+x; let e=fbm2(n1,nx*k,ny*k*asp,6);
  if(regional){ const d=[nx,1-nx,ny,1-ny][side]; e+=.26-smoothst(0,.32,d)*.0-(d<.18?(.18-d)*1.6:0); const d2=Math.min(nx,1-nx,ny,1-ny); e-=d2<.04?(.04-d2)*3:0; }
  else { const dx=(nx-cx)/.62, dy=(ny-cy)/.6, d=Math.sqrt(dx*dx+dy*dy); e-= isl?d*d*.35:d*d*.55; e+=isl?(fbm2(n3,nx*7,ny*7*asp,3)-.5)*.25:0; const d2=Math.min(nx,1-nx,ny,1-ny); e-=d2<.05?(.05-d2)*4:0; }
  E[i]=e; Mo[i]=fbm2(n2,nx*2.2+9,ny*2.2*asp,4); Te[i]=regional?.45+(fbm2(n3,nx*1.5,ny*1.5*asp,3)-.5)*.6:clamp(ny*1.05-.02+(fbm2(n3,nx*2,ny*2*asp,3)-.5)*.35,0,1); }
 const srt=Float32Array.from(E).sort(), sea=srt[Math.floor(N*(regional?.3:.6))];
 const at=(x,y)=>{ const i=clamp(Math.floor(y/cell),0,gh-1)*gw+clamp(Math.floor(x/cell),0,gw-1); return {e:E[i],mo:Mo[i],t:Te[i]}; };
 const land=new Float32Array(N); for(let i=0;i<N;i++) land[i]=smoothst(sea-.011,sea+.011,E[i]);
 const mk=f=>{ const o=new Float32Array(N); for(let i=0;i<N;i++) o[i]=land[i]*f(E[i]-sea,Mo[i],Te[i]); return o; };
 paintMask(m,'pradera',land,gw,gh);
 paintMask(m,'llanura',mk((h,mo,t)=>smoothst(.5,.38,mo)*smoothst(.3,.45,t)),gw,gh,.85);
 paintMask(m,'estepa',mk((h,mo,t)=>smoothst(.42,.3,mo)*smoothst(.5,.65,t)),gw,gh,.9);
 paintMask(m,'desierto',mk((h,mo,t)=>smoothst(.38,.28,mo)*smoothst(.66,.78,t)),gw,gh);
 paintMask(m,'bosque',mk((h,mo,t)=>smoothst(.55,.65,mo)*smoothst(.18,.3,t)*smoothst(.78,.68,t)),gw,gh,.85);
 paintMask(m,'selva',mk((h,mo,t)=>smoothst(.58,.68,mo)*smoothst(.68,.8,t)),gw,gh,.9);
 paintMask(m,'pantano',mk((h,mo,t)=>smoothst(.7,.8,mo)*smoothst(.06,.02,h)),gw,gh,.85);
 paintMask(m,'tundra',mk((h,mo,t)=>smoothst(.26,.16,t)),gw,gh,.9);
 paintMask(m,'roca',mk((h)=>smoothst(.15,.22,h)),gw,gh,.9);
 paintMask(m,'nieve',mk((h,mo,t)=>Math.max(smoothst(.12,.05,t),smoothst(.27,.33,h))),gw,gh);
 const mul=LVK(m).mul, sp=(regional?34:30)*mul, mt=[];
 for(let y=sp/2;y<m.h;y+=sp*.62) for(let x=sp/2;x<m.w;x+=sp){ const px=x+(R()-.5)*sp*.9+(Math.round(y/sp)%2?sp/2:0), py=y+(R()-.5)*sp*.5; const a=at(px,py), h=a.e-sea; if(px<10||py<10||px>m.w-10||py>m.h-10||h<0) continue;
  if(h>.2){ const k2=h>.3||a.t<.22?'montana_nevada':(a.t>.7?'montana_parda':'montana'); mkStamp(m,k2,px,py,STAMPS[k2].sz*mul*(.7+Math.min(.6,(h-.2)*3)+R()*.2),R); mt.push([px,py]); }
  else if(h>.13&&R()<.55) mkStamp(m,a.t>.7&&a.mo<.35?'duna':'colina',px,py,STAMPS.colina.sz*mul*(.8+R()*.4),R);
  else if(a.mo>.6&&h<.18&&R()<.8){ const k2=a.t<.32?'pinar':a.t>.72?'selva':R()<.3?'bosque_mixto':'bosque'; mkStamp(m,k2,px,py,STAMPS[k2].sz*mul*(.55+R()*.3),R); }
  else if(a.mo>.5&&h<.15&&R()<.25) mkStamp(m,a.t<.32?'pino':'arbol',px,py,STAMPS.arbol.sz*mul*(.8+R()*.3),R);
  else if(a.mo<.3&&a.t>.72&&R()<.07) mkStamp(m,R()<.5?'cactus':'duna',px,py,STAMPS.cactus.sz*mul,R); }
 /* ríos */
 const nr=regional?5:4; for(let r=0;r<nr&&mt.length;r++){ let [x,y]=mt[(R()*mt.length)|0]; const pts=[[x,y]]; let ok=false;
  for(let s=0;s<400;s++){ let best=null, be=1e9; for(let a=0;a<12;a++){ const an=a/12*Math.PI*2, nx=x+Math.cos(an)*14*mul, ny=y+Math.sin(an)*14*mul; const e=at(nx,ny).e+(R()-.5)*.012; if(e<be){ be=e; best=[nx,ny]; } }
   if(!best||be>=at(x,y).e+.004) { x+= (R()-.5)*20; y+=(R()-.5)*20; } else [x,y]=best; pts.push([x,y]); if(at(x,y).e<sea){ ok=true; break; } }
  if(ok&&pts.length>8){ const sp2=[]; pts.forEach((p,i)=>{ if(i%3===0||i===pts.length-1) sp2.push([Math.round(p[0]),Math.round(p[1])]); }); m.paths.push({id:uid(),t:'rio',w:pathWidth(m,'rio'),pts:sp2}); } }
 /* asentamientos */
 const sites=[], want=regional?9:7; for(let tries=0;tries<600&&sites.length<want;tries++){ const x=40+R()*(m.w-80), y=40+R()*(m.h-80), a=at(x,y), h=a.e-sea; if(h<.01||h>.13) continue; if(sites.some(s=>Math.hypot(s[0]-x,s[1]-y)<(regional?260:330))) continue;
  const coast=[0,1,2,3].some(q=>at(x+Math.cos(q*1.57)*40*mul,y+Math.sin(q*1.57)*40*mul).e<sea); sites.push([x,y,coast]); }
 sites.forEach(([x,y,coast],i)=>{ const kinds=regional?['castillo','ciudad','aldea','aldea','torre','templo','ruinas','aldea','molino']:['castillo','ciudad','ciudad','aldea','torre','ruinas','templo'];
  let k2=kinds[i%kinds.length]; if(coast&&i>1&&R()<.6) k2=regional?'puerto':'ciudad'; m.stamps=m.stamps.filter(s=>Math.hypot(s.x-x,s.y-y)>STAMPS[k2].sz*mul*.6||!['bosque','pinar','selva','bosque_mixto','arbol','pino','colina'].includes(s.k));
  mkStamp(m,k2,x,y,STAMPS[k2].sz*mul*(regional?.9:.75),R); if(coast&&R()<.5&&k2==='puerto') mkStamp(m,'faro',x+40*mul,y-6,STAMPS.faro.sz*mul*.7,R);
  if(regional&&['aldea','molino','castillo'].includes(k2)) for(let j=0;j<3;j++) blob(m,'campos',x+(R()-.5)*120*mul,y+(R()-.2)*90*mul,(40+R()*40)*mul,.95);
  mkLabel(m,x,y+14*mul,fname(R),{font:'IM Fell English SC',size:Math.round((i<2?20:16)*mul),up:false,sp:1,halo:1}); });
 if(regional){ for(let i=1;i<sites.length;i++){ let j=0,bd=1e9; for(let k2=0;k2<i;k2++){ const d=Math.hypot(sites[k2][0]-sites[i][0],sites[k2][1]-sites[i][1]); if(d<bd){ bd=d; j=k2; } }
  const a=sites[i], b=sites[j], mid=[(a[0]+b[0])/2+(R()-.5)*bd*.25,(a[1]+b[1])/2+(R()-.5)*bd*.25]; let wet=false; for(let t=0;t<=1;t+=.05){ const p=t<.5?[a[0]+(mid[0]-a[0])*t*2,a[1]+(mid[1]-a[1])*t*2]:[mid[0]+(b[0]-mid[0])*(t-.5)*2,mid[1]+(b[1]-mid[1])*(t-.5)*2]; if(at(p[0],p[1]).e<sea) wet=true; }
  if(!wet) m.paths.push({id:uid(),t:'camino',w:pathWidth(m,'camino'),pts:[[a[0],a[1]],mid,[b[0],b[1]]].map(p=>[Math.round(p[0]),Math.round(p[1])])}); } }
 /* nombres de regiones y mares */
 const reg=[], wat=[]; for(let t=0;t<900;t++){ const x=m.w*(.26+R()*.48), y=m.h*(.14+R()*.72), a=at(x,y); if(a.e>sea+.06&&a.e<sea+.18&&!reg.some(p=>Math.hypot(p[0]-x,p[1]-y)<m.w*.3)) reg.push([x,y]); if(a.e<sea-.08&&!wat.some(p=>Math.hypot(p[0]-x,p[1]-y)<m.w*.35)) wat.push([x,y]); }
 reg.slice(0,regional?2:3).forEach(([x,y],i)=>mkLabel(m,x,y,(regional?['Ducado de ','Marca de '][i]:['Reino de ','Imperio de ','Tierras de '][i])+fname(R),{size:Math.round((regional?40:46)*mul),sp:14,curve:(R()-.5)*.25,color:'#3a2616',halo:.6}));
 wat.slice(0,regional?1:3).forEach(([x,y])=>mkLabel(m,x,y,(R()<.5?'Mar de ':'Golfo de ')+fname(R),{font:'IM Fell English',size:Math.round(30*mul),it:true,up:false,sp:6,color:'#e7f1f7',hc:'#1d3c63',halo:.5,curve:(R()-.5)*.3}));
 if(wat.length){ const [x,y]=wat[wat.length-1]; if(R()<.8) mkStamp(m,'barco',x+80*mul,y+60*mul,STAMPS.barco.sz*mul*.8,R); if(R()<.5) mkStamp(m,R()<.5?'serpiente':'kraken',x-120*mul,y+40*mul,STAMPS.serpiente.sz*mul*.8,R); }
 const corners=[[.12,.82],[.88,.82],[.12,.2],[.88,.2]].map(([a,b])=>[m.w*a,m.h*b]).filter(([x,y])=>at(x,y).e<sea-.02); if(corners.length){ const [x,y]=corners[0]; mkStamp(m,'brujula',x,y+STAMPS.brujula.sz*mul*.5,STAMPS.brujula.sz*mul*(regional?.75:.85),()=>.9,{f:0}); }
}

function genClearing(m,R){ const G=m.grid.size, gw=Math.ceil(m.w/8), gh=Math.ceil(m.h/8), n=svnoise(R()*1e9|0), n2=svnoise(R()*1e9|0), N=gw*gh;
 fillTerrain(m,'cesped'); const dirt=new Float32Array(N), forestD=new Float32Array(N); for(let y=0;y<gh;y++) for(let x=0;x<gw;x++){ const i=y*gw+x; dirt[i]=smoothst(.56,.66,fbm2(n,x/gw*5,y/gw*5,5)); forestD[i]=fbm2(n2,x/gw*3,y/gw*3,4); }
 paintMask(m,'tierra',dirt,gw,gh,.85); const fl=new Float32Array(N); for(let i=0;i<N;i++) fl[i]=smoothst(.6,.7,forestD[i]); paintMask(m,'bosque',fl,gw,gh,.6);
 const pts=[]; const vert=R()<.5; for(let t=-.05;t<=1.05;t+=.1){ const w=(R()-.5)*.12+Math.sin(t*5+R())*.08; pts.push(vert?[m.w*(.5+w),m.h*t]:[m.w*t,m.h*(.5+w)]); }
 m.paths.push({id:uid(),t:'tierra',w:G*(1.2+R()*.5),pts:pts.map(p=>[Math.round(p[0]),Math.round(p[1])])});
 const nearPath=(x,y,d)=>{ for(let i=1;i<pts.length;i++) if(distSeg(x,y,pts[i-1],pts[i])<d) return true; return false; };
 let pond=null; if(R()<.6){ for(let t=0;t<30&&!pond;t++){ const x=m.w*(.2+R()*.6), y=m.h*(.2+R()*.6); if(!nearPath(x,y,G*4)) pond=[x,y,G*(1.6+R()*1.2)]; } if(pond){ blob(m,null,pond[0],pond[1],pond[2],1,true); blob(m,null,pond[0]+pond[2]*.5,pond[1]+pond[2]*.2,pond[2]*.7,1,true); } }
 const camp=[m.w*(.35+R()*.3),m.h*(.35+R()*.3)];
 for(let y=G*.6;y<m.h;y+=G*1.25) for(let x=G*.6;x<m.w;x+=G*1.25){ const px=x+(R()-.5)*G, py=y+(R()-.5)*G, ex=Math.min(px,m.w-px,py,m.h-py)/Math.min(m.w,m.h), fd=forestD[clamp(Math.floor(py/8),0,gh-1)*gw+clamp(Math.floor(px/8),0,gw-1)];
  const p=smoothst(.22,.03,ex)*.95+smoothst(.55,.72,fd)*.8; if(nearPath(px,py,G*1.4)||pond&&Math.hypot(px-pond[0],py-pond[1])<pond[2]*1.4||Math.hypot(px-camp[0],py-camp[1])<G*3) continue;
  if(R()<p){ const k=R()<.2?'pino_t':R()<.25?'arbol_oscuro_t':'arbol_t'; mkStamp(m,k,px,py,STAMPS[k].sz*G*(.75+R()*.5),R,{r:R()*6.3}); }
  else if(R()<.06) mkStamp(m,R()<.6?'arbusto_t':'flores_t',px,py,STAMPS.arbusto_t.sz*G*(.8+R()*.5),R,{r:R()*6.3});
  else if(R()<.035) mkStamp(m,R()<.5?'roca_t':'rocas_t',px,py,STAMPS.roca_t.sz*G*(.7+R()*.6),R,{r:R()*6.3}); }
 if(R()<.8){ mkStamp(m,'hoguera_t',camp[0],camp[1],STAMPS.hoguera_t.sz*G,R); mkStamp(m,'tronco_t',camp[0],camp[1]+G*1.3,STAMPS.tronco_t.sz*G*.8,R); mkStamp(m,'tienda_t',camp[0]+G*2.2,camp[1]-G*1.2,STAMPS.tienda_t.sz*G,R,{r:(R()-.5)*.6}); }
 for(let i=0;i<3;i++){ const x=m.w*R(), y=m.h*R(); if(!nearPath(x,y,G*1.5)) mkStamp(m,R()<.5?'tocon_t':'tronco_t',x,y,STAMPS.tocon_t.sz*G*1.4,R,{r:R()*6.3}); }
 m.fx.dark=0; }
function fillTerrain(m,tex){ SD.tg.save(); SD.tg.fillStyle=texPattern(SD.tg,tex); SD.tg.fillRect(0,0,m.w,m.h); SD.tg.restore(); }

function genDungeon2(m,R){ const G=m.grid.size, W=Math.floor(m.w/G), H=Math.floor(m.h/G), grid=new Uint8Array(W*H), rooms=[];
 for(let t=0;t<220&&rooms.length<12;t++){ const w=3+((R()*6)|0), h=3+((R()*5)|0), x=1+((R()*(W-w-2))|0), y=1+((R()*(H-h-2))|0); if(rooms.some(r=>x<r.x+r.w+1&&x+w+1>r.x&&y<r.y+r.h+1&&y+h+1>r.y)) continue; rooms.push({x,y,w,h,cx:x+(w>>1),cy:y+(h>>1)}); }
 rooms.sort((a,b)=>a.cx-b.cx||a.cy-b.cy); const floorTex=R()<.5?'mazmorra':'losas', alt=['madera','cueva','adoquin'];
 const tg=SD.tg, cellR=(x,y,w,h,tex)=>{ tg.save(); tg.fillStyle=texPattern(tg,tex); tg.fillRect(x*G,y*G,w*G,h*G); tg.restore(); };
 rooms.forEach((r,i)=>{ for(let y=r.y;y<r.y+r.h;y++) for(let x=r.x;x<r.x+r.w;x++) grid[y*W+x]=2; r.tex=i>0&&R()<.22?alt[(R()*alt.length)|0]:floorTex; cellR(r.x,r.y,r.w,r.h,r.tex); });
 const doors=[]; const carve=(x,y,px,py)=>{ const i=y*W+x; if(grid[i]===2&&px!=null&&grid[py*W+px]===1) doors.push([x,y,px,py]); if(grid[i]===1&&px!=null&&grid[py*W+px]===2) doors.push([px,py,x,y]); if(!grid[i]){ grid[i]=1; cellR(x,y,1,1,floorTex); } };
 const link=(a,b)=>{ let x=a.cx, y=a.cy, px=null, py=null; const hf=R()<.5; const stepX=()=>{ while(x!==b.cx){ carve(x,y,px,py); px=x; py=y; x+=Math.sign(b.cx-x); } }, stepY=()=>{ while(y!==b.cy){ carve(x,y,px,py); px=x; py=y; y+=Math.sign(b.cy-y); } };
  if(hf){ stepX(); stepY(); } else { stepY(); stepX(); } carve(x,y,px,py); };
 for(let i=1;i<rooms.length;i++) link(rooms[i-1],rooms[i]); if(rooms.length>4) link(rooms[0],rooms[(rooms.length/2)|0]);
 const used=new Set(); doors.forEach(([rx,ry,cx,cy])=>{ const key=rx+','+ry; if(used.has(key)||R()<.35) return; used.add(key); const x=(rx+cx+1)/2*G, y=(ry+cy+1)/2*G; mkStamp(m,'puerta_t',x,y,STAMPS.puerta_t.sz*G*.85,R,{r:ry===cy?Math.PI/2:0}); });
 const S=(k,x,y,sc=1,o={})=>mkStamp(m,k,x*G,y*G,STAMPS[k].sz*G*sc,R,o);
 const big=rooms.slice().sort((a,b)=>b.w*b.h-a.w*a.h)[0];
 rooms.forEach((r,i)=>{ const X=r.x, Y=r.y; mkLabel(m,(X+.55)*G,(Y+.55)*G,String(i+1),{size:Math.round(G*.42),sp:0,color:'#f3ead6',hc:'#1b140d',halo:1,font:'Cinzel'});
  if(i===0) S('escalera_t',X+r.w/2,Y+r.h/2,.9);
  if(r===big){ S('altar_t',r.cx+.5,Y+1,1); S('sarcofago_t',r.cx+.5,r.cy+1.2,1); }
  if(r.w>=6&&r.h>=5) for(const [dx,dy] of [[1.5,1.5],[r.w-1.5,1.5],[1.5,r.h-1.5],[r.w-1.5,r.h-1.5]]) S('columna_t',X+dx,Y+dy,.8);
  if(R()<.75){ S('brasero_t',X+.6,Y+.6,1); if(R()<.6) S('brasero_t',X+r.w-.6,Y+r.h-.6,1); }
  const deco=['huesos_t','escombros_t','telarana_t','cofre_t','barril_t','caja_t','caldero_t','sangre_t','estatua_t','pozo_t','trampa_t'];
  for(let k=0;k<1+((R()*3)|0);k++){ const id=deco[(R()*deco.length)|0]; S(id,X+.8+R()*(r.w-1.6),Y+.8+R()*(r.h-1.6),.9,{r:['cofre_t','estatua_t'].includes(id)?0:R()*6.3}); }
  if(r.tex==='madera'&&R()<.7) S('alfombra_t',X+r.w/2,Y+r.h/2,Math.min(r.w,r.h)/3); });
 if(R()<.5){ const r=rooms[(R()*rooms.length)|0]; blob(m,'somera',(r.cx+.5)*G,(r.cy+.5)*G,G*Math.min(r.w,r.h)*.35,1); }
 m.fx.dark=Math.max(m.fx.dark||0,.45); }
