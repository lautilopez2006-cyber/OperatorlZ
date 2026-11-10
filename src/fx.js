/* ===== Capa de efectos: fondo en GPU, transiciones, dado 3D, rueda de mando y combate cinematográfico ===== */
const FX={q:lsGet('oz:fxq','auto'),auto:false,booted:false,mx:.5,my:.5,px:innerWidth/2,py:innerHeight/2,get low(){ return reduced||this.q==='bajo'||(this.q==='auto'&&this.auto); }};
const fxApply=()=>{ document.documentElement.dataset.fx=FX.low?'low':'high'; };
function fxLabel(){ const b=$('#fxq'); if(b) b.textContent='Efectos: '+(FX.q==='auto'?(FX.auto?'automáticos (reducidos)':'automáticos'):FX.q==='alto'?'altos':'bajos'); }
fxApply();
const hexRgb=h=>{ const m=String(h).trim().match(/^#([0-9a-f]{6})$/i); const x=m?parseInt(m[1],16):0x8a7a5a; return [(x>>16)/255,(x>>8&255)/255,(x&255)/255]; };
const cssVar=n=>getComputedStyle(document.documentElement).getPropertyValue(n);

/* ----- Fondo: nebulosa procedural en WebGL, a media resolución y 30 cuadros ----- */
const FRAG=`precision mediump float;
uniform vec2 r,m,wc,fl; uniform float t,wp; uniform vec3 ca,cb,cc,bg,k;
float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float n(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y); }
float fbm(vec2 p){ float a=.5,s=0.; for(int i=0;i<4;i++){ s+=a*n(p); p=p*2.03+vec2(11.3,7.1); a*=.5; } return s; }
void main(){
 vec2 uv=gl_FragCoord.xy/r; vec2 p=(gl_FragCoord.xy-.5*r)/r.y; vec2 mp=(m-.5)*vec2(r.x/r.y,1.);
 vec2 d=p-wc; float L=length(d); float on=step(.0005,wp);
 float ring=exp(-pow((L-wp*2.2)*4.5,2.))*on*(1.-wp);
 p+=normalize(d+.0001)*ring*.22; float an=on*wp*(1.-wp)*5.*exp(-L*1.4); p=wc+mat2(cos(an),-sin(an),sin(an),cos(an))*(p-wc);
 vec2 q=p*1.5+fl*t;
 vec2 w=vec2(fbm(q+vec2(0.,t*.05)),fbm(q+vec2(5.2,1.3)-t*.04));
 float f=fbm(q+k.x*w*1.5+(mp-p)*.06);
 float g=fbm(q*1.7-w*k.x+vec2(3.1,t*.03));
 vec3 col=bg;
 col=mix(col,ca,smoothstep(.28,.9,f)*.72);
 col=mix(col,cb,smoothstep(.4,.95,g)*.6);
 col+=cc*pow(smoothstep(.5,1.,f*g*2.3),2.)*.2;
 col+=cc*.07*exp(-length(p-mp)*2.6);
 vec2 sp=gl_FragCoord.xy/(r.y/46.); vec2 si=floor(sp); float sh=h(si);
 float sd=length(fract(sp)-.5-(vec2(h(si+3.1),h(si+7.7))-.5)*.6);
 col+=vec3(1.,.96,.88)*k.y*step(.9,sh)*smoothstep(.13,0.,sd)*(.45+.55*sin(t*(1.+sh*3.)+sh*40.))*.7;
 vec2 e=gl_FragCoord.xy/(r.y/24.); e.y-=t*1.3; e.x+=sin(e.y*.7+t*.5)*.35; vec2 ei=floor(e); float eh=h(ei);
 col+=cc*k.z*step(.9,eh)*smoothstep(.12,0.,length(fract(e)-.5-(vec2(h(ei+1.7),h(ei+9.2))-.5)*.6))*(.6+.4*sin(t*3.+eh*30.));
 col+=cc*ring*.8;
 col*=1.-.55*dot(uv-.5,uv-.5);
 gl_FragColor=vec4(col,1.);
}`;
/* velocidad, turbulencia, estrellas, ascuas, flujo x, flujo y */
const PLANE_FX={material:[.35,1,.5,0,0,.02],feywild:[.6,1.5,.35,.5,.04,.01],shadowfell:[.18,.8,.15,0,.02,0],abismo:[.8,2,.1,1,0,.1],infiernos:[1,1.6,.05,1.3,0,.16],celestia:[.3,.7,.8,.2,0,.03],astral:[.25,1.2,1.6,0,.01,0],elemental:[1.1,2.2,.3,.6,.08,.04]};
const GL={gl:null,ok:false,run:false,t:0,last:0,prev:0,cur:null,tgt:null,wp:0,wpT0:0,wc:[0,0],frames:[],slow:0,u:{},
 init(){
  const cv=$('#ambient'); if(!cv) return; let gl=null;
  try{ gl=cv.getContext('webgl',{antialias:false,alpha:false,powerPreference:'high-performance',failIfMajorPerformanceCaveat:!lsGet('oz:glforce',0)}); }catch(e){}
  if(!gl) return;
  try{ const sh=(type,src)=>{ const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s); if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
   const p=gl.createProgram(); gl.attachShader(p,sh(gl.VERTEX_SHADER,'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}')); gl.attachShader(p,sh(gl.FRAGMENT_SHADER,FRAG)); gl.linkProgram(p);
   if(!gl.getProgramParameter(p,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); gl.useProgram(p);
   gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
   const loc=gl.getAttribLocation(p,'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
   for(const n of ['r','t','ca','cb','cc','bg','m','k','wp','wc','fl']) this.u[n]=gl.getUniformLocation(p,n);
  }catch(e){ console.warn('Fondo GL no disponible:',e); return; }
  this.gl=gl; this.ok=true; document.documentElement.classList.add('gl');
  cv.addEventListener('webglcontextlost',e=>{ e.preventDefault(); this.ok=false; document.documentElement.classList.remove('gl'); });
  addEventListener('resize',()=>{ this.size(); this.draw(); }); this.size();
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) this.start(); });
 },
 size(){ if(!this.ok) return; const cv=this.gl.canvas, s=Math.min(.5,900/innerWidth); cv.width=Math.max(2,Math.round(innerWidth*s)); cv.height=Math.max(2,Math.round(innerHeight*s)); this.gl.viewport(0,0,cv.width,cv.height); },
 setPlane(){ this.tgt=[...hexRgb(cssVar('--neb1')),...hexRgb(cssVar('--neb2')),...hexRgb(cssVar('--acc')),...hexRgb(cssVar('--bg')),...(PLANE_FX[curPlane]||PLANE_FX.material)]; if(!this.cur) this.cur=this.tgt.slice(); this.start(); this.draw(); },
 portal(x,y){ this.wc=[(x-.5)*innerWidth/innerHeight,.5-y]; this.wpT0=performance.now(); this.wp=.001; this.start(); },
 start(){ if(!this.ok||this.run) return; this.run=true; this.prev=0; requestAnimationFrame(t=>this.loop(t)); },
 loop(now){
  if(!this.ok||document.hidden){ this.run=false; return; }
  const dt=this.prev?now-this.prev:16; this.prev=now;
  if(FX.q==='auto'&&!FX.auto&&dt<400){ this.frames.push(dt); if(this.frames.length>=120){ const avg=this.frames.reduce((a,b)=>a+b,0)/120; this.frames=[];
   if(avg>34){ if(++this.slow>=2){ FX.auto=true; fxApply(); fxLabel(); toast('Reduje los efectos para que todo vaya fluido. Puedes cambiarlo en "Efectos", abajo a la izquierda.'); } } else this.slow=0; } }
  const warping=this.wp>0; let moving=false;
  if(this.cur&&this.tgt) for(let i=0;i<this.cur.length;i++){ const d=this.tgt[i]-this.cur[i]; if(Math.abs(d)>.002){ this.cur[i]+=d*Math.min(1,dt/380); moving=true; } else this.cur[i]=this.tgt[i]; }
  if(warping){ const kk=(now-this.wpT0)/1400; this.wp=kk>=1?0:Math.max(.001,kk); }
  FX.mx+=(FX.px/innerWidth-FX.mx)*.06; FX.my+=(FX.py/innerHeight-FX.my)*.06;
  this.t+=Math.min(dt,100)/1000*(this.cur?this.cur[12]:.4)*(warping?3:1);
  if(warping||moving||now-this.last>31){ this.last=now; this.draw(); }
  if(FX.low&&!warping&&!moving){ this.run=false; return; }
  requestAnimationFrame(t=>this.loop(t));
 },
 draw(){ if(!this.ok||!this.cur) return; const g=this.gl,u=this.u,c=this.cur;
  g.uniform2f(u.r,g.canvas.width,g.canvas.height); g.uniform1f(u.t,this.t); g.uniform3f(u.ca,c[0],c[1],c[2]); g.uniform3f(u.cb,c[3],c[4],c[5]); g.uniform3f(u.cc,c[6],c[7],c[8]); g.uniform3f(u.bg,c[9],c[10],c[11]);
  g.uniform2f(u.m,FX.mx,1-FX.my); g.uniform3f(u.k,c[13],c[14],c[15]); g.uniform1f(u.wp,this.wp); g.uniform2f(u.wc,this.wc[0],this.wc[1]); g.uniform2f(u.fl,c[16],c[17]); g.drawArrays(g.TRIANGLES,0,3); }
};
/* Sin GPU no hay bucle de fondo que mida la fluidez: se toma una muestra corta al navegar */
let probeBusy=false,probeSlow=0,probeAt=0;
function fxProbe(){ if(GL.ok||FX.q!=='auto'||FX.auto||probeBusy||performance.now()-probeAt<8000) return; probeBusy=true; let n=0,sum=0,prev=0;
 const f=now=>{ if(prev&&now-prev<400){ sum+=now-prev; n++; } prev=now; if(n<90&&!document.hidden) requestAnimationFrame(f);
  else { probeBusy=false; probeAt=performance.now(); if(n>=60&&sum/n>34){ if(++probeSlow>=2){ FX.auto=true; fxApply(); fxLabel(); toast('Reduje los efectos para que todo vaya fluido. Puedes cambiarlo en "Efectos", abajo a la izquierda.'); } } else probeSlow=0; } };
 requestAnimationFrame(f); }
Ambient.init=function(){ GL.init(); };
Ambient.set=function(){ GL.setPlane(); };

/* ----- Puntero: luz del fondo, inclinación 3D de tarjetas y onda al pulsar ----- */
let tiltEl=null,tiltRaf=0,tiltEv=null;
function tiltStep(){ tiltRaf=0; const e=tiltEv; if(!e) return; const el=e.target&&e.target.closest?e.target.closest('.card,.qa,.pc,.bookc'):null;
 if(el!==tiltEl){ if(tiltEl) tiltEl.classList.remove('tilt'); tiltEl=el; if(el) el.classList.add('tilt'); }
 if(!el) return; const r=el.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height, k=Math.min(10,2600/Math.max(r.width,r.height));
 el.style.setProperty('--mx',(x*100).toFixed(1)+'%'); el.style.setProperty('--my',(y*100).toFixed(1)+'%'); el.style.setProperty('--rx',((.5-y)*k).toFixed(2)+'deg'); el.style.setProperty('--ry',((x-.5)*k).toFixed(2)+'deg'); }
document.addEventListener('pointermove',e=>{ FX.px=e.clientX; FX.py=e.clientY; if(WH.el) wheelMove(e); if(FX.low||e.pointerType!=='mouse') return; tiltEv=e; if(!tiltRaf) tiltRaf=requestAnimationFrame(tiltStep); },{passive:true});
document.addEventListener('pointerdown',e=>{ if(FX.low||!e.target.closest) return; const b=e.target.closest('.btn,.qa,.icbtn,.tool'); if(!b) return; const r=b.getBoundingClientRect(), d=Math.max(r.width,r.height)*2.2;
 const s=document.createElement('span'); s.className='rip'; s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`; b.append(s); s.addEventListener('animationend',()=>s.remove()); },{passive:true});

/* ----- Navegación: transición entre secciones, indicador deslizante y reordenado animado ----- */
const FLIP_SEL='.cmb[data-cid],.tok[data-tid]';
function flipSnap(){ const m=new Map(); $$(FLIP_SEL).forEach(el=>{ const r=el.getBoundingClientRect(); m.set(el.classList[0]+(el.dataset.cid||el.dataset.tid),[r.left,r.top]); }); return m; }
function flipPlay(m){ if(FX.low||!m.size) return; $$(FLIP_SEL).forEach(el=>{ const o=m.get(el.classList[0]+(el.dataset.cid||el.dataset.tid));
 if(!o){ el.animate([{opacity:0,transform:'scale(.85)'},{opacity:1,transform:'none'}],{duration:420,easing:'cubic-bezier(.34,1.4,.5,1)'}); return; }
 const r=el.getBoundingClientRect(), dx=o[0]-r.left, dy=o[1]-r.top; if(Math.abs(dx)+Math.abs(dy)<3) return;
 el.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:'translate(0,0)'}],{duration:560,easing:'cubic-bezier(.3,1.25,.4,1)'}); }); }
function navInd(){ const nav=$('.nav'), a=$('.nav a.on'); if(!nav||!a) return; let ind=$('.nav-ind'); if(!ind){ ind=document.createElement('i'); ind.className='nav-ind'; nav.prepend(ind); }
 ind.style.transform=`translateY(${a.offsetTop}px)`; ind.style.height=a.offsetHeight+'px'; }
function countUps(){ if(FX.low) return; $$('#view .tile b.n').forEach(el=>{ const n=parseInt(el.textContent,10); if(!n) return; const t0=performance.now();
 const step=now=>{ const k=Math.min(1,(now-t0)/700), e=1-Math.pow(1-k,3); el.textContent=Math.round(n*e); if(k<1&&el.isConnected) requestAnimationFrame(step); }; requestAnimationFrame(step); }); }
const _render=render;
render=function(soft){
 const snap=soft?flipSnap():null;
 const run=()=>{ _render(soft); navInd(); if(snap) flipPlay(snap); if(!soft){ countUps(); fxProbe(); } };
 if(!soft&&FX.booted&&!FX.low&&document.startViewTransition){ try{ document.startViewTransition(run); return; }catch(e){} }
 FX.booted=true; run();
};

/* ----- Viaje entre planos: onda en el fondo, anillos y título ----- */
applyPlane=function(id,save=true,from){
 const p=planeById(id);
 const set=()=>{ curPlane=p.id; document.documentElement.dataset.plane=p.id; $('#plName').textContent=p.name; Ambient.set(p.fx,p.c); lsSet('oz:plane',p.id); render(true); counts(); };
 if(save){ const s=Object.assign({},Store.docs.settings||{},{plane:p.id}); Store.setDoc('settings',s,300); }
 if(from&&!FX.low){ const r=from.getBoundingClientRect(), x=r.left+r.width/2, y=r.top+r.height/2; GL.portal(x/innerWidth,y/innerHeight);
  const po=$('#portal'); po.classList.remove('go'); po.style.setProperty('--px',x+'px'); po.style.setProperty('--py',y+'px'); po.style.setProperty('--pc',p.c);
  po.innerHTML=`<i class="pr1"></i><i class="pr2"></i><i class="pf"></i><div class="ptitle"><small>Has viajado a</small><b>${esc(p.name)}</b><span>${esc(p.sub)}</span></div>`; void po.offsetWidth; po.classList.add('go');
  clearTimeout(applyPlane.t); setTimeout(set,420); applyPlane.t=setTimeout(()=>{ po.classList.remove('go'); po.innerHTML=''; },2500); }
 else { set(); if(save) toast(`Has viajado a ${p.name}.`); }
};

/* ----- Dado de veinte caras en 3D ----- */
const ICO=(()=>{ const t=(1+Math.sqrt(5))/2, V=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(v=>{ const l=Math.hypot(v[0],v[1],v[2]); return v.map(x=>x/l); });
 const F=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
 const c=[0,1,2].map(i=>(V[0][i]+V[11][i]+V[5][i])/3), nl=Math.hypot(c[0],c[1],c[2]), n=c.map(x=>x/nl); let up=[0,1,2].map(i=>V[0][i]-c[i]); const ul=Math.hypot(up[0],up[1],up[2]); up=up.map(x=>x/ul);
 const rt=[up[1]*n[2]-up[2]*n[1],up[2]*n[0]-up[0]*n[2],up[0]*n[1]-up[1]*n[0]], dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
 return {V:V.map(v=>[dot(rt,v),dot(up,v),dot(n,v)]),F}; })();
function drawIco(ctx,S,ax,ay,az,rgb,numA,label){
 const W=ctx.canvas.width, cx=W/2, cy=W/2, sx=Math.sin(ax),cxx=Math.cos(ax),sy=Math.sin(ay),cyy=Math.cos(ay),sz=Math.sin(az),czz=Math.cos(az);
 const P=ICO.V.map(v=>{ let x=v[0],y=v[1],z=v[2]; let y1=y*cxx-z*sx, z1=y*sx+z*cxx; let x2=x*cyy+z1*sy, z2=-x*sy+z1*cyy; return [x2*czz-y1*sz,x2*sz+y1*czz,z2]; });
 ctx.clearRect(0,0,W,W); ctx.lineJoin='round'; ctx.lineWidth=W/190;
 const faces=ICO.F.map(f=>{ const a=P[f[0]],b=P[f[1]],c=P[f[2]]; return {a,b,c,n:[(a[0]+b[0]+c[0])/3,(a[1]+b[1]+c[1])/3,(a[2]+b[2]+c[2])/3]}; }).filter(f=>f.n[2]>-.02).sort((p,q)=>p.n[2]-q.n[2]);
 const pr=v=>{ const k=S*(1+v[2]*.16); return [cx+v[0]*k,cy-v[1]*k]; };
 for(const f of faces){ const l=Math.hypot(f.n[0],f.n[1],f.n[2]), s=Math.max(0,(f.n[0]*-.42+f.n[1]*.58+f.n[2]*.7)/l), sp=Math.pow(s,10)*.55;
  const col=rgb.map(c=>Math.round(255*Math.min(1,c*(.16+s*.92)+sp)));
  ctx.beginPath(); const A=pr(f.a),B=pr(f.b),C=pr(f.c); ctx.moveTo(A[0],A[1]); ctx.lineTo(B[0],B[1]); ctx.lineTo(C[0],C[1]); ctx.closePath();
  ctx.fillStyle=`rgb(${col})`; ctx.fill(); ctx.strokeStyle='rgba(255,255,255,.4)'; ctx.stroke(); }
 if(numA>0){ ctx.globalAlpha=numA; ctx.fillStyle='rgba(18,12,4,.92)'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.font=`700 ${S*(String(label).length>2?.3:.4)}px 'IBM Plex Mono',monospace`; ctx.fillText(label,cx,cy+S*.03); ctx.globalAlpha=1; }
}
diceFX=function(d20,total){
 if(FX.low) return; $$('.d3,.critring').forEach(x=>x.remove());
 const crit=d20===20, fum=d20===1, rgb=crit?[1,.82,.35]:fum?[.9,.3,.26]:hexRgb(cssVar('--acc'));
 const el=document.createElement('div'); el.className='d3'; if(crit) el.style.setProperty('--dg','rgba(255,204,58,.5)'); if(fum) el.style.setProperty('--dg','rgba(228,92,79,.45)');
 el.innerHTML=`<canvas></canvas>${crit?'<span class="lbl" style="color:#ffe08a">¡Crítico!</span>':fum?'<span class="lbl" style="color:#f7a59c">Pifia</span>':''}`; document.body.append(el);
 const cv=$('canvas',el), dpr=Math.min(devicePixelRatio||1,2); cv.width=cv.height=Math.round(300*dpr); const ctx=cv.getContext('2d'), S=cv.width*.3, T=1050, t0=performance.now();
 const r0=[7+Math.random()*4,6+Math.random()*4,4+Math.random()*3];
 el.animate([{transform:'translate(-50%,-160vh) scale(.45)'},{transform:'translate(-50%,-46%) scale(1.1)',offset:.55},{transform:'translate(-50%,-66%) scale(1)',offset:.74},{transform:'translate(-50%,-50%) scale(1)'}],{duration:T,easing:'cubic-bezier(.3,.6,.4,1)'});
 const frame=now=>{ if(!el.isConnected) return; const k=Math.min(1,(now-t0)/T), e=1-Math.pow(1-k,3), w=1-e;
  drawIco(ctx,S,r0[0]*w,r0[1]*w,r0[2]*w,rgb,Math.max(0,(k-.8)/.2),total); if(k<1) requestAnimationFrame(frame);
  else { if(crit){ const ring=document.createElement('i'); ring.className='critring'; document.body.append(ring); setTimeout(()=>ring.remove(),950);
    for(let i=0;i<34;i++){ const s=document.createElement('i'); s.className='spark'; const a=Math.random()*6.28, d=90+Math.random()*220; s.style.left=innerWidth/2+'px'; s.style.top=innerHeight*.46+'px'; document.body.append(s);
     s.animate([{transform:'translate(0,0) scale(1.4)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d+60}px) scale(.2)`,opacity:0}],{duration:900+Math.random()*500,easing:'cubic-bezier(.2,.8,.2,1)'}).onfinish=()=>s.remove(); } }
   if(fum) el.animate([{transform:'translate(-50%,-50%)'},{transform:'translate(calc(-50% - 12px),-50%) rotate(-3deg)'},{transform:'translate(calc(-50% + 10px),-50%) rotate(3deg)'},{transform:'translate(-50%,-50%)'}],{duration:380});
   setTimeout(()=>{ el.animate([{opacity:1,transform:'translate(-50%,-50%) scale(1)'},{opacity:0,transform:'translate(-50%,-50%) scale(.8)'}],{duration:380,fill:'forwards'}).onfinish=()=>el.remove(); },950); } };
 requestAnimationFrame(frame);
};

/* ----- Rueda de mando (tecla Q o el botón flotante) ----- */
const WHEEL=[['Tirar d20',()=>I.d20,()=>rollToast('1d20','d20')],['Bandeja de dados',()=>I.dice,()=>diceTray()],['Siguiente turno',()=>I.next,()=>{ if(route!=='combate') go('combate'); else nextTurn(); }],['Combate',()=>I.swords,()=>go('combate')],
 ['Buscar',()=>I.search,()=>$('#gq').focus()],['PNJ al azar',()=>I.mask,()=>editNPC(randomNPC())],['Mapas',()=>I.map,()=>go('mapas')],['Cambiar de plano',()=>I.portal,()=>{ scrollTo(0,0); planeMenu(); }]];
const WH={el:null,bg:null,sel:-1,hold:false,x:0,y:0};
function openWheel(x,y,hold){
 closeWheel(); x=innerWidth<380?innerWidth/2:clamp(x,172,innerWidth-172); y=clamp(y,172,innerHeight-172); const R=114;
 const bg=document.createElement('div'); bg.className='wheel-bg'; bg.style.setProperty('--wx',x+'px'); bg.style.setProperty('--wy',y+'px');
 const w=document.createElement('div'); w.className='wheel'; w.style.left=x+'px'; w.style.top=y+'px'; w.setAttribute('role','menu');
 w.innerHTML=`<div class="wheel-ring"></div><div class="wheel-hub"><span id="whl">Rueda de mando</span></div>`+WHEEL.map((it,i)=>{ const a=i/WHEEL.length*Math.PI*2-Math.PI/2; return `<button class="wheel-it" data-w="${i}" role="menuitem" aria-label="${it[0]}" style="--x:${(Math.cos(a)*R).toFixed(1)}px;--y:${(Math.sin(a)*R).toFixed(1)}px;--d:${i*26}ms">${it[1]()}</button>`; }).join('');
 document.body.append(bg,w); Object.assign(WH,{el:w,bg,sel:-1,hold,x,y});
 bg.onclick=closeWheel; w.onclick=e=>{ const b=e.target.closest('[data-w]'); if(b) wheelRun(+b.dataset.w); };
}
function closeWheel(){ if(!WH.el) return; WH.el.remove(); WH.bg.remove(); WH.el=WH.bg=null; WH.sel=-1; }
function wheelMove(e){ const dx=e.clientX-WH.x, dy=e.clientY-WH.y, d=Math.hypot(dx,dy); let i=-1;
 if(d>40){ const n=WHEEL.length; i=Math.round(((Math.atan2(dy,dx)+Math.PI/2)/(Math.PI*2))*n); i=((i%n)+n)%n; }
 if(i===WH.sel) return; WH.sel=i; $$('.wheel-it',WH.el).forEach((b,k)=>b.classList.toggle('sel',k===i)); $('#whl').textContent=i<0?'Rueda de mando':WHEEL[i][0]; }
function wheelRun(i){ const it=WHEEL[i]; closeWheel(); if(it) it[2](); }
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&WH.el){ closeWheel(); return; }
 if((e.key==='q'||e.key==='Q')&&!e.repeat&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!$('.modal-bg')){ e.preventDefault(); if(WH.el) closeWheel(); else openWheel(FX.px,FX.py,true); } });
document.addEventListener('keyup',e=>{ if((e.key==='q'||e.key==='Q')&&WH.el&&WH.hold){ if(WH.sel>=0) wheelRun(WH.sel); else WH.hold=false; } });

/* ----- Combate: cinta de iniciativa, daño arrastrando la barra, impactos y cartel de turno ----- */
function vignette(c){ const v=document.createElement('i'); v.className='vig'; v.style.setProperty('--vc',c); document.body.append(v); setTimeout(()=>v.remove(),650); }
function turnBanner(top,name){ if(FX.low) return; $$('.tbanner').forEach(x=>x.remove()); const b=document.createElement('div'); b.className='tbanner'; b.innerHTML=`<small>${esc(top)}</small><b>${esc(name)}</b>`; document.body.append(b); setTimeout(()=>b.remove(),1750); }
function scrub(bar){ bar.title='Arrastra: a la izquierda daña, a la derecha cura';
 bar.addEventListener('pointerdown',e=>{ const row=bar.closest('.cmb'), id=row.dataset.cid, x=CS().list.find(k=>k.id===id); if(!x||!x.max) return; e.preventDefault(); try{ bar.setPointerCapture(e.pointerId); }catch(err){}
  const w=bar.clientWidth, x0=e.clientX, fill=$('i',bar); let n=0; const tip=document.createElement('span'); tip.className='scrub-tip'; tip.style.top=bar.offsetTop+'px'; bar.parentNode.append(tip);
  const mv=ev=>{ n=clamp(Math.round((ev.clientX-x0)/w*x.max),-x.hp,x.max-x.hp); const pct=clamp((x.hp+n)/x.max*100,0,100); tip.textContent=n===0?'0':n>0?'+'+n:'−'+(-n); tip.dataset.s=n<0?'d':n>0?'h':''; tip.style.left=pct+'%'; fill.style.transition='none'; fill.style.width=pct+'%'; };
  const up=()=>{ bar.removeEventListener('pointermove',mv); bar.removeEventListener('pointerup',up); bar.removeEventListener('pointercancel',up); tip.remove(); fill.style.transition='';
   if(n){ $('[name=amt]',row).value=Math.abs(n); hpChange(id,n<0?'dmg':'heal'); } else fill.style.width=clamp(x.hp/x.max*100,0,100)+'%'; };
  bar.addEventListener('pointermove',mv); bar.addEventListener('pointerup',up); bar.addEventListener('pointercancel',up); mv(e); }); }
const _vCombate=vCombate;
vCombate=function(v){ _vCombate(v); const c=CS(); if(!c.list.length) return;
 const strip=document.createElement('div'); strip.className='tl-strip'; strip.setAttribute('aria-label','Orden de iniciativa');
 strip.innerHTML=c.list.map((x,i)=>{ const hp=x.max?clamp(x.hp/x.max,0,1):0; return `<button class="tok ${x.kind} ${i===c.turn&&c.active?'cur':''} ${x.hp<=0?'down':''}" data-tid="${x.id}" title="${esc(x.name)} · iniciativa ${x.init??'–'}" style="--hp:${hp.toFixed(3)};--c:${hp<.3?'var(--bad)':hp<.6?'var(--warn)':'var(--ok)'}"><b>${esc((x.name||'?')[0])}${(x.name.match(/\d+$/)||[''])[0]}</b><small>${x.init??'–'}</small></button>`; }).join('');
 $('.cb-head',v).after(strip);
 strip.onclick=e=>{ const t=e.target.closest('.tok'); if(!t) return; const r=$(`.cmb[data-cid="${t.dataset.tid}"]`); if(!r) return; r.scrollIntoView({block:'center',behavior:FX.low?'auto':'smooth'}); r.animate([{boxShadow:'0 0 0 2px var(--acc2), 0 0 40px var(--glow)'},{boxShadow:'0 0 0 0 transparent'}],{duration:1000}); };
 const cur=$('.tok.cur',strip); if(cur) strip.scrollLeft=cur.offsetLeft-strip.clientWidth/2;
 $$('.cmb .hpbar',v).forEach(scrub);
};
const _hpChange=hpChange;
hpChange=function(id,a){ const x=CS().list.find(k=>k.id===id), before=x?x.hp:0; _hpChange(id,a); if(!x||FX.low) return; const d=before-x.hp, row=$(`.cmb[data-cid="${id}"]`); if(!row||!d) return;
 const r=$('.hpbar',row).getBoundingClientRect(), f=document.createElement('span'); f.className='float'; f.textContent=d>0?'−'+d:'+'+(-d); f.style.cssText=`left:${r.left+r.width/2-14}px;top:${r.top-16}px;color:${d>0?'var(--bad)':'var(--ok)'}`; document.body.append(f); setTimeout(()=>f.remove(),1000);
 if(d>0&&(d>=x.max*.25||x.hp===0)){ row.animate([{transform:'translateX(0)'},{transform:'translateX(-12px) rotate(-.7deg)'},{transform:'translateX(9px) rotate(.5deg)'},{transform:'translateX(-4px)'},{transform:'translateX(0)'}],{duration:440}); vignette(x.hp===0?'rgba(228,92,79,.55)':'rgba(228,92,79,.28)'); }
 else if(d<0) vignette('rgba(115,196,140,.22)');
};
const _nextTurn=nextTurn;
nextTurn=function(){ const c0=CS(), was=c0.active, r0=c0.round; _nextTurn(); const c=CS(), x=c.active&&c.list[c.turn]; if(x) turnBanner(!was?'Comienza el combate':c.round!==r0?`Ronda ${c.round}`:'Turno de',x.name); };

/* ----- Montaje: entrada, selector de efectos y rueda en el botón flotante ----- */
function intro(){ if(FX.low) return; try{ if(sessionStorage.getItem('oz:intro')) return; sessionStorage.setItem('oz:intro','1'); }catch(e){}
 const el=document.createElement('div'); el.className='intro'; el.innerHTML=`<div class="intro-sig">${SIGIL}</div><div class="intro-t">${'OperatorlZ'.split('').map((c,i)=>`<span style="--d:${i*45}ms">${c}</span>`).join('')}</div>`;
 document.body.append(el); setTimeout(()=>el.classList.add('out'),1300); setTimeout(()=>el.remove(),1900); }
const _shell=shell;
shell=function(){ _shell();
 const f=$('.rail-foot'), b=document.createElement('button'); b.className='fxq'; b.id='fxq'; b.title='Cambia la calidad de las animaciones'; f.prepend(b);
 b.onclick=()=>{ FX.q={auto:'alto',alto:'bajo',bajo:'auto'}[FX.q]; FX.auto=false; GL.slow=0; GL.frames=[]; lsSet('oz:fxq',FX.q); fxApply(); fxLabel(); GL.start(); GL.draw(); }; fxLabel();
 f.lastElementChild.insertAdjacentHTML('beforeend',' · <kbd>Q</kbd> rueda');
 const fab=$('#fab'); fab.title='Rueda de mando (Q)'; fab.setAttribute('aria-label','Rueda de mando');
 fab.onclick=()=>{ if(WH.el){ closeWheel(); return; } const r=fab.getBoundingClientRect(); openWheel(r.left+r.width/2-120,r.top+r.height/2-120,false); };
 addEventListener('resize',navInd); intro();
};
