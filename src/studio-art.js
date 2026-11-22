/* ===== Estudio de mapas · objetos ilustrados (vista lateral para mundo y región, cenital para batallas y mazmorras) ===== */
const INK='#2a2018';
const sh=(c,f)=>{ let r,g,b; if(c[0]==='#'){ const n=parseInt(c.slice(1),16); r=n>>16; g=n>>8&255; b=n&255; } else { [r,g,b]=c.match(/[\d.]+/g).map(Number); } const t=f<0?0:255, p=Math.abs(f);
 r=Math.round(r+(t-r)*p); g=Math.round(g+(t-g)*p); b=Math.round(b+(t-b)*p); return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1); };
function poly(g,pts,close=true){ g.beginPath(); pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])); if(close) g.closePath(); }
function smooth(g,pts,close=true){ g.beginPath(); const n=pts.length; if(close){ const m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2]; let s=m(pts[n-1],pts[0]); g.moveTo(s[0],s[1]); for(let i=0;i<n;i++){ const q=m(pts[i],pts[(i+1)%n]); g.quadraticCurveTo(pts[i][0],pts[i][1],q[0],q[1]); } g.closePath(); }
 else { g.moveTo(pts[0][0],pts[0][1]); for(let i=1;i<n-1;i++){ const q=[(pts[i][0]+pts[i+1][0])/2,(pts[i][1]+pts[i+1][1])/2]; g.quadraticCurveTo(pts[i][0],pts[i][1],q[0],q[1]); } g.lineTo(pts[n-1][0],pts[n-1][1]); } }
function lin(g,x0,y0,x1,y1,st){ const gr=g.createLinearGradient(x0,y0,x1,y1); st.forEach(([t,c])=>gr.addColorStop(t,c)); return gr; }
function rad(g,x,y,r0,r1,st,x1,y1){ const gr=g.createRadialGradient(x,y,r0,x1??x,y1??y,r1); st.forEach(([t,c])=>gr.addColorStop(t,c)); return gr; }
function ink(g,w,c=INK){ g.lineWidth=w; g.strokeStyle=c; g.lineJoin='round'; g.lineCap='round'; g.stroke(); }
function gshadow(g,x,y,rx,ry,a=.3){ g.fillStyle=rad(g,x,y,0,1,[[0,`rgba(20,14,8,${a})`],[1,'rgba(20,14,8,0)']]); g.save(); g.translate(x,y); g.scale(rx,ry); g.beginPath(); g.arc(0,0,1,0,7); g.restore(); g.fill(); }
function dropShadow(g,k,fn,ox=3,oy=4,blur=6,a=.45){ g.save(); g.shadowColor=`rgba(0,0,0,${a})`; g.shadowBlur=blur*k; g.shadowOffsetX=ox*k; g.shadowOffsetY=oy*k; fn(); g.restore(); }
const circle=(g,x,y,r)=>{ g.beginPath(); g.arc(x,y,r,0,Math.PI*2); };
const jit=(R,a)=>(R()-.5)*2*a;

/* ---- Vista lateral ---- */
function mountain(g,R,o){ const w=o.w||(78+R()*22), h=o.h||(58+R()*24), px=jit(R,w*.12), base=o.base||'#8f877c', lit=o.lit||sh(base,.35), dk=o.dk||sh(base,-.42);
 gshadow(g,w*.12,0,w*.62,8,.32);
 const L=[[-w/2,0]], Rr=[], n=4; for(let i=1;i<n;i++){ const t=i/n; L.push([-w/2+(px+w/2)*t+jit(R,5), -h*t+jit(R,5)-(t<.9?R()*4:0)]); } L.push([px,-h]);
 for(let i=1;i<n;i++){ const t=i/n; Rr.push([px+(w/2-px)*t+jit(R,5), -h*(1-t)+jit(R,5)]); } Rr.push([w/2,0]);
 const sil=[...L,...Rr];
 poly(g,sil); g.fillStyle=lin(g,-w*.4,-h,w*.2,0,[[0,lit],[.7,base],[1,sh(base,-.15)]]); g.fill();
 const ridge=[[px,-h]]; let rx=px, ry=-h; const steps=3+((R()*2)|0); for(let i=0;i<steps;i++){ rx+=w*(.04+R()*.08)*(i%2?-.6:1); ry+=h/steps; ridge.push([rx,Math.min(0,ry)]); }
 g.save(); poly(g,sil); g.clip();
 poly(g,[...ridge,[w/2+4,0],[w/2+4,-h-4]]); g.fillStyle=lin(g,px,-h,w/2,0,[[0,dk],[1,sh(dk,-.2)]]); g.fill();
 g.strokeStyle='rgba(30,22,16,.35)'; g.lineWidth=1; for(let i=0;i<7;i++){ const t=.15+R()*.75, yy=-h*(1-t), xx=px+(w/2-px)*t*(.3+R()*.6); g.beginPath(); g.moveTo(xx,yy); g.lineTo(xx+6+R()*6,yy+5+R()*5); g.stroke(); }
 g.strokeStyle='rgba(255,255,255,.22)'; g.lineWidth=1.2; for(let i=0;i<4;i++){ const t=.25+R()*.55; const yy=-h*(1-t)+jit(R,3), xx=px-(px+w/2)*t*(.2+R()*.5); g.beginPath(); g.moveTo(xx,yy); g.lineTo(xx-5-R()*5,yy+6+R()*4); g.stroke(); }
 if(o.snow){ const sy=-h*(.55+R()*.1); const pts=[[px-w*.5,sy-6]]; for(let i=0;i<=6;i++){ const t=i/6; pts.push([px-w*.32+w*.62*t, sy+(i%2?7:-2)+jit(R,3)]); } pts.push([px+w*.5,sy-6],[px,-h-6]);
  poly(g,pts); g.fillStyle='#f4f7fb'; g.fill(); g.save(); poly(g,[...ridge,[w/2+4,0],[w/2+4,-h-4]]); g.clip(); poly(g,pts); g.fillStyle='#b9c7d8'; g.fill(); g.restore(); }
 if(o.lava){ g.fillStyle=rad(g,px,-h+4,0,w*.35,[[0,'rgba(255,190,80,.95)'],[.4,'rgba(255,90,20,.55)'],[1,'rgba(255,60,10,0)']]); g.fillRect(-w,-h-30,w*2,h); g.strokeStyle='#ff7b22'; g.lineWidth=2.2; for(let i=0;i<3;i++){ let x=px+jit(R,6), y=-h+4; g.beginPath(); g.moveTo(x,y); for(let j=0;j<5;j++){ x+=jit(R,5); y+=h*.12; g.lineTo(x,y); } g.stroke(); } }
 g.restore();
 poly(g,sil,false); ink(g,2.2); smooth(g,ridge,false); ink(g,1.3,'rgba(42,32,24,.75)');
 if(o.lava){ for(let i=0;i<4;i++){ g.fillStyle=`rgba(${120+i*20},${115+i*20},${115+i*20},${.55-i*.1})`; circle(g,px+jit(R,6)+i*4,-h-10-i*11,6+i*3); g.fill(); } }
}
function hill(g,R,o){ const w=o.w||(62+R()*24), h=o.h||(20+R()*12), base=o.base||'#8a9a52';
 gshadow(g,w*.1,0,w*.6,6,.25);
 g.beginPath(); g.moveTo(-w/2,0); g.bezierCurveTo(-w*.38,-h*1.25,w*.28,-h*1.3,w/2,0); g.closePath(); g.fillStyle=lin(g,-w*.3,-h,w*.3,0,[[0,sh(base,.3)],[.6,base],[1,sh(base,-.3)]]); g.fill();
 g.save(); g.clip(); g.beginPath(); g.moveTo(w*.05,-h*1.1); g.bezierCurveTo(w*.18,-h*.6,w*.25,-h*.3,w*.2,0); g.lineTo(w/2,0); g.lineTo(w/2,-h*2); g.fillStyle='rgba(30,40,10,.22)'; g.fill(); g.restore();
 g.strokeStyle='rgba(40,50,20,.45)'; g.lineWidth=1; for(let i=0;i<5;i++){ const x=jit(R,w*.35), y=-h*(.2+R()*.5); g.beginPath(); g.moveTo(x,y); g.lineTo(x+2,y-4); g.moveTo(x+3,y); g.lineTo(x+4,y-3); g.stroke(); }
 g.beginPath(); g.moveTo(-w/2,0); g.bezierCurveTo(-w*.38,-h*1.25,w*.28,-h*1.3,w/2,0); ink(g,2); }
function conifer(g,R,o){ const h=o.h||(36+R()*12), w=h*.55, c=o.c||'#2f5a34';
 gshadow(g,w*.25,0,w*.55,4,.3); g.fillStyle='#4a3020'; g.fillRect(-1.6,-6,3.2,6);
 const tiers=3; for(let i=0;i<tiers;i++){ const t0=i/tiers, ty=-5-(h-5)*t0*.78, tw=w*(1-t0*.32)/2, th=(h-5)*.5;
  const pts=[[-tw,ty],[-tw*.5,ty-2.5],[0,ty-th],[tw*.5,ty-2.5],[tw,ty],[tw*.3,ty+1.5],[-tw*.3,ty+1.5]];
  poly(g,pts); g.fillStyle=lin(g,-tw,ty-th,tw,ty,[[0,sh(c,.28)],[.5,c],[.51,sh(c,-.25)],[1,sh(c,-.35)]]); g.fill(); ink(g,1.4); } }
function broadleaf(g,R,o){ const h=o.h||(32+R()*12), r=h*.34, c=o.c||'#4d7a3a';
 gshadow(g,r*.5,0,r*1.2,4,.3); g.fillStyle='#5a3c26'; g.beginPath(); g.moveTo(-2,0); g.lineTo(-1.2,-h*.45); g.lineTo(1.2,-h*.45); g.lineTo(2,0); g.fill(); ink(g,1.1);
 const cy=-h+r, blobs=[]; for(let i=0;i<6;i++){ const a=i/6*Math.PI*2+R(); blobs.push([Math.cos(a)*r*.55,cy+Math.sin(a)*r*.45,r*(.5+R()*.18)]); } blobs.push([0,cy-r*.15,r*.62]);
 blobs.forEach(([x,y,rr])=>{ circle(g,x,y,rr); ink(g,3); });
 blobs.forEach(([x,y,rr])=>{ circle(g,x,y,rr); g.fillStyle=lin(g,x-rr,y-rr,x+rr,y+rr,[[0,sh(c,.25)],[1,sh(c,-.3)]]); g.fill(); });
 for(let i=0;i<6;i++){ g.fillStyle='rgba(255,255,220,.18)'; circle(g,-r*.3+jit(R,r*.3),cy-r*.3+jit(R,r*.25),r*.18); g.fill(); } }
function palm(g,R,o){ const h=o.h||(40+R()*10), lean=jit(R,6), c=o.c||'#4f8a3c';
 gshadow(g,6,0,12,3,.3); g.beginPath(); g.moveTo(-2,0); g.quadraticCurveTo(lean*.3,-h*.5,lean,-h); g.lineTo(lean+3,-h); g.quadraticCurveTo(lean*.3+4,-h*.5,2.5,0); g.closePath(); g.fillStyle='#8b6a42'; g.fill(); ink(g,1.2);
 g.strokeStyle='rgba(50,30,15,.6)'; g.lineWidth=.8; for(let i=1;i<7;i++){ const t=i/7, x=lean*t*t, y=-h*t; g.beginPath(); g.moveTo(x-2,y); g.lineTo(x+3,y+1); g.stroke(); }
 for(let i=0;i<7;i++){ const a=-Math.PI/2+(i-3)*.48+jit(R,.1), L=h*.42, ex=lean+1.5+Math.cos(a)*L, ey=-h+Math.sin(a)*L*.55+L*.25;
  g.beginPath(); g.moveTo(lean+1.5,-h); g.quadraticCurveTo(lean+1.5+Math.cos(a)*L*.5,-h+Math.sin(a)*L*.6-6,ex,ey); g.quadraticCurveTo(lean+1.5+Math.cos(a)*L*.45,-h+Math.sin(a)*L*.4,lean+1.5,-h); g.fillStyle=i%2?c:sh(c,-.2); g.fill(); ink(g,1); }
 g.fillStyle='#6b4a2a'; circle(g,lean,-h+2,2); g.fill(); circle(g,lean+3.5,-h+2.5,2); g.fill(); }
function deadtree(g,R,o){ const h=o.h||(34+R()*10); gshadow(g,6,0,10,3,.25);
 const br=(x,y,a,l,w,d)=>{ if(d>4||l<3) return; const x2=x+Math.cos(a)*l, y2=y+Math.sin(a)*l; g.beginPath(); g.moveTo(x,y); g.lineTo(x2,y2); g.lineWidth=w+1.6; g.strokeStyle=INK; g.lineCap='round'; g.stroke(); g.lineWidth=w; g.strokeStyle='#7a6450'; g.stroke();
  br(x2,y2,a-.45-R()*.3,l*.7,w*.65,d+1); if(R()<.85) br(x2,y2,a+.4+R()*.3,l*.65,w*.6,d+1); };
 br(0,0,-Math.PI/2+jit(R,.12),h*.45,3.4,0); }
function bush(g,R,o){ const r=o.r||(7+R()*3), c=o.c||'#557d3c'; gshadow(g,3,0,r*1.4,3,.25); const bl=[[-r*.7,-r*.6,r*.7],[r*.6,-r*.6,r*.75],[0,-r,r*.8]];
 bl.forEach(([x,y,rr])=>{ circle(g,x,y,rr); ink(g,2.4); }); bl.forEach(([x,y,rr])=>{ circle(g,x,y,rr); g.fillStyle=lin(g,x-rr,y-rr,x+rr,y+rr,[[0,sh(c,.25)],[1,sh(c,-.25)]]); g.fill(); }); }
function cactus(g,R){ const h=30+R()*10, c='#5f8f4a'; gshadow(g,5,0,10,3,.3);
 const arm=(x,y,dir,len)=>{ g.beginPath(); g.moveTo(x,y); g.lineTo(x+dir*7,y); g.quadraticCurveTo(x+dir*10,y,x+dir*10,y-4); g.lineTo(x+dir*10,y-len); g.lineWidth=7.5; g.strokeStyle=INK; g.lineCap='round'; g.stroke(); g.lineWidth=5; g.strokeStyle=c; g.stroke(); };
 arm(0,-h*.45,-1,h*.25); arm(0,-h*.6,1,h*.22);
 g.beginPath(); g.moveTo(0,-2); g.lineTo(0,-h); g.lineWidth=10; g.strokeStyle=INK; g.lineCap='round'; g.stroke(); g.lineWidth=7.4; g.strokeStyle=lin(g,-4,0,4,0,[[0,sh(c,.25)],[1,sh(c,-.25)]]); g.stroke(); g.strokeStyle='rgba(30,50,20,.5)'; g.lineWidth=.7; g.beginPath(); g.moveTo(1.2,-4); g.lineTo(1.2,-h+2); g.stroke(); }
function forest(g,R,o){ const n=o.n||(9+((R()*5)|0)), W=o.W||70, H=o.H||26, trees=[];
 for(let i=0;i<n;i++){ const t=R(); trees.push([jit(R,W/2)*(1-Math.abs(.5-t)*.4),-H*t*.9]); } trees.sort((a,b)=>a[1]-b[1]);
 for(const [x,y] of trees){ g.save(); g.translate(x,y); const s=.75+R()*.35; g.scale(s,s); const k=o.kind==='mix'?(R()<.5?'c':'b'):o.kind; if(k==='c') conifer(g,R,{c:o.c||'#2c5532'}); else if(k==='p') palm(g,R,{}); else broadleaf(g,R,{c:o.c||sh('#4a7838',jit(R,.12))}); g.restore(); } }

function house(g,x,y,w,hh,R,roof){ const d=w*.32, rh=hh*.75, wall='#e7d6b0', side='#bfa983'; roof=roof||['#a1452c','#b55a34','#7d3a2b','#5b6f8a'][(R()*4)|0];
 poly(g,[[x+w/2,y],[x+w/2+d,y-d*.55],[x+w/2+d,y-hh-d*.55],[x+w/2,y-hh]]); g.fillStyle=side; g.fill(); ink(g,1.2);
 poly(g,[[x-w/2,y],[x+w/2,y],[x+w/2,y-hh],[x-w/2,y-hh]]); g.fillStyle=lin(g,x-w/2,y-hh,x+w/2,y,[[0,sh(wall,.12)],[1,sh(wall,-.08)]]); g.fill(); ink(g,1.2);
 poly(g,[[x,y-hh-rh],[x+d,y-hh-rh-d*.55],[x+w/2+d+1.5,y-hh-d*.55+1],[x+w/2+1.5,y-hh+1]]); g.fillStyle=sh(roof,-.12); g.fill(); ink(g,1.2);
 g.strokeStyle='rgba(30,15,10,.35)'; g.lineWidth=.7; for(let i=1;i<4;i++){ const t=i/4; g.beginPath(); g.moveTo(x+(w/2+1.5)*t,y-hh-rh+(rh+1)*t); g.lineTo(x+d+(w/2+1.5)*t,y-hh-rh-d*.55+(rh-d*.0+1)*t); g.stroke(); }
 poly(g,[[x-w/2-1.5,y-hh+1],[x,y-hh-rh],[x+w/2+1.5,y-hh+1]]); g.fillStyle=sh(wall,-.15); g.fill(); ink(g,1.3);
 g.fillStyle='#4a3020'; g.fillRect(x-w*.1,y-hh*.55,w*.2,hh*.55); g.fillStyle='#e8c66a'; g.fillRect(x+w*.22,y-hh*.75,w*.15,hh*.22); g.fillRect(x-w*.38,y-hh*.75,w*.15,hh*.22);
 if(R()<.6){ g.fillStyle='#6d5a4a'; g.fillRect(x+w*.15+d*.4,y-hh-rh*.85-d*.3,3,6); } }
function tower(g,x,y,w,h,R,roof='#46597a',crenel){ const lw=w/2;
 g.beginPath(); g.moveTo(x-lw,y); g.lineTo(x-lw,y-h); g.lineTo(x+lw,y-h); g.lineTo(x+lw,y); g.ellipse(x,y,lw,lw*.3,0,0,Math.PI); g.closePath();
 g.fillStyle=lin(g,x-lw,0,x+lw,0,[[0,'#cfc6b6'],[.4,'#b8ae9c'],[1,'#7f7667']]); g.fill(); ink(g,1.3);
 g.strokeStyle='rgba(40,30,20,.3)'; g.lineWidth=.6; for(let yy=y-6;yy>y-h;yy-=6){ g.beginPath(); g.moveTo(x-lw,yy); g.lineTo(x+lw,yy); g.stroke(); }
 g.fillStyle='#2b2018'; g.fillRect(x-1.2,y-h*.6,2.4,5); g.fillRect(x-1.2,y-h*.3,2.4,5);
 if(crenel){ for(let i=0;i<4;i++){ g.fillStyle='#b5ab99'; g.fillRect(x-lw+i*(w/4)+.6,y-h-4,w/4-2.2,4); g.strokeStyle=INK; g.lineWidth=1; g.strokeRect(x-lw+i*(w/4)+.6,y-h-4,w/4-2.2,4); } }
 else { g.beginPath(); g.moveTo(x-lw-2,y-h); g.lineTo(x,y-h-w*1.3); g.lineTo(x+lw+2,y-h); g.closePath(); g.fillStyle=lin(g,x-lw,0,x+lw,0,[[0,sh(roof,.25)],[.5,roof],[1,sh(roof,-.35)]]); g.fill(); ink(g,1.3);
  g.strokeStyle=INK; g.lineWidth=1; g.beginPath(); g.moveTo(x,y-h-w*1.3); g.lineTo(x,y-h-w*1.3-6); g.stroke(); g.fillStyle='#c0392b'; poly(g,[[x,y-h-w*1.3-6],[x+6,y-h-w*1.3-4.5],[x,y-h-w*1.3-3]]); g.fill(); } }
function wallSeg(g,x0,x1,y,h){ poly(g,[[x0,y],[x1,y],[x1,y-h],[x0,y-h]]); g.fillStyle=lin(g,0,y-h,0,y,[[0,'#c8bfae'],[1,'#958b7a']]); g.fill(); ink(g,1.2);
 g.strokeStyle='rgba(40,30,20,.28)'; g.lineWidth=.6; for(let yy=y-4;yy>y-h;yy-=4){ g.beginPath(); g.moveTo(x0,yy); g.lineTo(x1,yy); g.stroke(); }
 for(let x=x0;x<x1-2;x+=5){ g.fillStyle='#bdb3a2'; g.fillRect(x,y-h-3,3,3); g.strokeStyle=INK; g.lineWidth=.8; g.strokeRect(x,y-h-3,3,3); } }

const SIDE_ART={
 montana:(g,R)=>mountain(g,R,{}),
 montana_parda:(g,R)=>mountain(g,R,{base:'#8e7559'}),
 montana_nevada:(g,R)=>mountain(g,R,{snow:1,base:'#878a92'}),
 cordillera:(g,R)=>{ const p=[[-34,-10,.8],[34,-8,.78],[0,0,1.05]]; p.forEach(([x,y,s])=>{ g.save(); g.translate(x,y); g.scale(s,s); mountain(g,R,{snow:R()<.5,base:'#8a847c'}); g.restore(); }); },
 volcan:(g,R)=>mountain(g,R,{lava:1,base:'#4d4342',lit:'#6d625f',dk:'#2a2322'}),
 colina:(g,R)=>hill(g,R,{}),
 colinas:(g,R)=>{ [[-22,-6,.8],[22,-5,.85],[0,0,1]].forEach(([x,y,s])=>{ g.save(); g.translate(x,y); g.scale(s,s); hill(g,R,{base:sh('#8a9a52',jit(R,.1))}); g.restore(); }); },
 duna:(g,R)=>hill(g,R,{base:'#d6b278',h:16}),
 pino:(g,R)=>conifer(g,R,{}),
 arbol:(g,R)=>broadleaf(g,R,{}),
 arbol_otono:(g,R)=>broadleaf(g,R,{c:['#c8742e','#b5482c','#d4a23a'][(R()*3)|0]}),
 palmera:(g,R)=>palm(g,R,{}),
 arbol_seco:(g,R)=>deadtree(g,R,{}),
 arbusto:(g,R)=>bush(g,R,{}),
 cactus:(g,R)=>cactus(g,R),
 bosque:(g,R)=>forest(g,R,{kind:'b'}),
 pinar:(g,R)=>forest(g,R,{kind:'c'}),
 bosque_mixto:(g,R)=>forest(g,R,{kind:'mix'}),
 selva:(g,R)=>forest(g,R,{kind:'b',c:'#2c6436',n:12}),
 bosque_muerto:(g,R)=>{ for(let i=0;i<7;i++){ g.save(); g.translate(jit(R,30),-R()*18); g.scale(.7,.7); deadtree(g,R,{}); g.restore(); } },
 casa:(g,R)=>{ gshadow(g,6,0,22,5,.3); house(g,0,0,22,15,R); },
 aldea:(g,R)=>{ gshadow(g,4,0,42,8,.28); const hs=[[-18,-12],[14,-14],[-2,-4],[24,-1],[-24,0]].slice(0,3+((R()*3)|0)); hs.sort((a,b)=>a[1]-b[1]).forEach(([x,y])=>house(g,x,y,15+R()*5,10+R()*3,R)); },
 ciudad:(g,R)=>{ gshadow(g,6,0,58,10,.3); const hs=[]; for(let i=0;i<14;i++) hs.push([jit(R,40),-10-R()*22]); hs.sort((a,b)=>a[1]-b[1]).forEach(([x,y])=>house(g,x,y,12+R()*5,9+R()*4,R));
  tower(g,-6,-24,10,30,R,'#5b6f8a'); wallSeg(g,-52,52,0,12); tower(g,-52,0,11,18,R,'#7d3a2b',1); tower(g,52,0,11,18,R,'#7d3a2b',1);
  g.fillStyle='#3a281b'; g.beginPath(); g.moveTo(-5,0); g.lineTo(-5,-7); g.arc(0,-7,5,Math.PI,0); g.lineTo(5,0); g.fill(); },
 castillo:(g,R)=>{ gshadow(g,6,0,46,9,.32); poly(g,[[-14,-12],[14,-12],[14,-44],[-14,-44]]); g.fillStyle=lin(g,-14,0,14,0,[[0,'#d0c7b5'],[1,'#8f8574']]); g.fill(); ink(g,1.3);
  for(let i=0;i<5;i++){ g.fillStyle='#c2b8a6'; g.fillRect(-14+i*6,-48,4,4); g.strokeStyle=INK; g.lineWidth=.9; g.strokeRect(-14+i*6,-48,4,4); }
  g.fillStyle='#2b2018'; g.fillRect(-2,-36,4,7);
  tower(g,-30,-6,12,34,R,'#3e5a86'); tower(g,30,-6,12,34,R,'#3e5a86'); tower(g,0,-44,9,10,R,'#a1452c');
  wallSeg(g,-30,30,0,16); g.fillStyle='#3a281b'; g.beginPath(); g.moveTo(-6,0); g.lineTo(-6,-8); g.arc(0,-8,6,Math.PI,0); g.lineTo(6,0); g.closePath(); g.fill(); ink(g,1.1);
  g.strokeStyle='rgba(200,180,120,.6)'; g.lineWidth=.6; for(let x=-5;x<6;x+=2.5){ g.beginPath(); g.moveTo(x,0); g.lineTo(x,-11); g.stroke(); } },
 torre:(g,R)=>{ gshadow(g,5,0,12,3,.3); tower(g,0,0,13,40,R,['#46597a','#7d3a2b','#4e6b3c'][(R()*3)|0]); },
 torre_mago:(g,R)=>{ gshadow(g,5,0,12,3,.3); tower(g,0,0,12,48,R,'#5a3f8a'); g.fillStyle=rad(g,0,-70,0,14,[[0,'rgba(190,150,255,.9)'],[1,'rgba(150,90,255,0)']]); circle(g,0,-70,14); g.fill(); },
 templo:(g,R)=>{ gshadow(g,5,0,34,6,.3); for(let i=0;i<3;i++){ poly(g,[[-30+i*2,-i*3],[30-i*2,-i*3],[30-i*2,-i*3-3],[-30+i*2,-i*3-3]]); g.fillStyle=sh('#d8cfbd',-i*.05); g.fill(); ink(g,1); }
  for(let i=0;i<6;i++){ const x=-22+i*8.8; poly(g,[[x-2.4,-9],[x+2.4,-9],[x+2.4,-30],[x-2.4,-30]]); g.fillStyle=lin(g,x-2.4,0,x+2.4,0,[[0,'#f0e8d8'],[1,'#a59b88']]); g.fill(); ink(g,1); }
  poly(g,[[-28,-30],[28,-30],[28,-34],[-28,-34]]); g.fillStyle='#d8cfbd'; g.fill(); ink(g,1.1); poly(g,[[-30,-34],[0,-46],[30,-34]]); g.fillStyle=lin(g,0,-46,0,-34,[[0,'#e6dece'],[1,'#b4aa96']]); g.fill(); ink(g,1.3); },
 ruinas:(g,R)=>{ gshadow(g,5,0,32,6,.25); for(let i=0;i<4;i++){ const x=-26+i*15+jit(R,3), h=10+R()*20, w=7+R()*5; const pts=[[x,0],[x+w,0],[x+w,-h+jit(R,4)],[x+w*.6,-h-4+jit(R,3)],[x+w*.3,-h+3],[x,-h+jit(R,4)]];
  poly(g,pts); g.fillStyle=lin(g,x,0,x+w,0,[[0,'#bfb6a4'],[1,'#81786a']]); g.fill(); ink(g,1.2); g.fillStyle='rgba(90,120,60,.65)'; circle(g,x+R()*w,-R()*h*.5,2.2); g.fill(); }
  g.save(); g.translate(8,-1); g.rotate(.08); poly(g,[[-18,0],[14,0],[14,-5],[-18,-5]]); g.fillStyle='#b2a996'; g.fill(); ink(g,1); g.restore(); },
 faro:(g,R)=>{ gshadow(g,5,0,16,4,.3); for(let i=0;i<3;i++){ g.fillStyle='#6d665e'; circle(g,-8+i*8,-2,6); g.fill(); ink(g,1); }
  poly(g,[[-7,-4],[7,-4],[4.5,-42],[-4.5,-42]]); g.fillStyle='#efe6d8'; g.fill(); g.save(); g.clip(); for(let y=-10;y>-44;y-=12){ g.fillStyle='#b8392b'; g.fillRect(-10,y-6,20,6); } g.fillStyle='rgba(0,0,0,.18)'; g.fillRect(1,-44,10,42); g.restore(); poly(g,[[-7,-4],[7,-4],[4.5,-42],[-4.5,-42]]); ink(g,1.2);
  g.fillStyle=rad(g,0,-47,0,26,[[0,'rgba(255,240,170,.95)'],[.35,'rgba(255,215,110,.45)'],[1,'rgba(255,200,90,0)']]); circle(g,0,-47,26); g.fill(); g.fillStyle='#ffe9a0'; g.fillRect(-3.5,-50,7,6); g.strokeStyle=INK; g.lineWidth=1; g.strokeRect(-3.5,-50,7,6);
  poly(g,[[-5,-50],[0,-56],[5,-50]]); g.fillStyle='#3a3a3a'; g.fill(); ink(g,1); },
 molino:(g,R)=>{ gshadow(g,5,0,14,3,.3); poly(g,[[-8,0],[8,0],[5,-26],[-5,-26]]); g.fillStyle=lin(g,-8,0,8,0,[[0,'#e8dcc3'],[1,'#a99878']]); g.fill(); ink(g,1.2); poly(g,[[-6.5,-26],[0,-34],[6.5,-26]]); g.fillStyle='#8d4a33'; g.fill(); ink(g,1.2);
  g.save(); g.translate(0,-26); g.rotate(R()); for(let i=0;i<4;i++){ g.rotate(Math.PI/2); poly(g,[[0,-1],[22,-1.5],[22,4.5],[3,3.5]]); g.fillStyle='#e9e1cf'; g.fill(); ink(g,1); g.strokeStyle='rgba(60,40,20,.5)'; g.lineWidth=.5; for(let x=6;x<22;x+=4){ g.beginPath(); g.moveTo(x,-1.3); g.lineTo(x,4); g.stroke(); } } g.restore(); g.fillStyle='#3a2a1a'; circle(g,0,-26,2); g.fill(); },
 puerto:(g,R)=>{ for(let i=0;i<5;i++){ poly(g,[[-30+i*13,-4],[-19+i*13,-4],[-19+i*13,0],[-30+i*13,0]]); g.fillStyle=i%2?'#8a6440':'#9d7449'; g.fill(); ink(g,.9); g.fillStyle='#4a3020'; g.fillRect(-30+i*13,0,2,6); }
  g.save(); g.translate(18,-6); boat(g,R,.55); g.restore(); },
 campamento:(g,R)=>{ gshadow(g,5,0,26,5,.25); const tent=(x,y,c)=>{ poly(g,[[x-10,y],[x,y-14],[x+10,y]]); g.fillStyle=lin(g,x-10,0,x+10,0,[[0,sh(c,.2)],[.5,c],[.51,sh(c,-.25)],[1,sh(c,-.3)]]); g.fill(); ink(g,1.2); poly(g,[[x-2.5,y],[x,y-6],[x+2.5,y]]); g.fillStyle='#2b1d12'; g.fill(); };
  tent(-12,-4,'#c9a86a'); tent(12,-2,'#a0603a'); g.fillStyle=rad(g,0,4,0,12,[[0,'rgba(255,200,90,.8)'],[1,'rgba(255,140,40,0)']]); circle(g,0,4,12); g.fill(); g.fillStyle='#ff8c2a'; poly(g,[[-2.5,5],[0,-2],[2.5,5]]); g.fill(); },
 cueva:(g,R)=>{ gshadow(g,5,0,26,5,.3); smooth(g,[[-26,0],[-20,-14],[-6,-22],[10,-20],[22,-10],[26,0]]); g.fillStyle=lin(g,-10,-22,10,0,[[0,'#9d958a'],[1,'#5f584f']]); g.fill(); ink(g,1.6);
  g.beginPath(); g.moveTo(-8,0); g.quadraticCurveTo(-8,-13,0,-13); g.quadraticCurveTo(8,-13,8,0); g.closePath(); g.fillStyle=rad(g,0,-2,1,12,[[0,'#000'],[1,'#1c1714']]); g.fill(); ink(g,1.3); },
 puente:(g,R)=>{ g.beginPath(); g.moveTo(-36,-8); g.lineTo(36,-8); g.lineTo(36,10); g.lineTo(22,10); g.arc(0,10,22,0,Math.PI,true); g.lineTo(-36,10); g.closePath(); g.fillStyle=lin(g,0,-8,0,10,[[0,'#d3c8b3'],[1,'#8c826f']]); g.fill(); ink(g,1.3);
  g.strokeStyle='rgba(40,30,20,.35)'; g.lineWidth=.7; for(let y=-3;y<10;y+=4.5){ g.beginPath(); g.moveTo(-36,y); g.lineTo(36,y); g.stroke(); }
  g.beginPath(); g.arc(0,10,22,Math.PI,0); g.lineWidth=3; g.strokeStyle='#a89d86'; g.stroke(); g.lineWidth=1; g.strokeStyle=INK; g.stroke();
  for(let x=-35;x<35;x+=5){ g.fillStyle='#c4b9a2'; g.fillRect(x,-11,3,3); g.strokeStyle=INK; g.lineWidth=.7; g.strokeRect(x,-11,3,3); } },
 portal:(g,R)=>{ gshadow(g,4,0,20,4,.3); g.beginPath(); g.ellipse(0,-20,13,19,0,0,7); g.fillStyle=rad(g,0,-20,2,18,[[0,'#f1dcff'],[.4,'#a066ff'],[1,'#3a1a7a']]); g.fill();
  g.strokeStyle='rgba(255,255,255,.55)'; g.lineWidth=1; for(let i=0;i<3;i++){ g.beginPath(); g.ellipse(0,-20,4+i*3.5,7+i*4,i,0,4.5); g.stroke(); }
  g.beginPath(); g.ellipse(0,-20,15,21,0,0,7); g.lineWidth=5; g.strokeStyle='#8c8476'; g.stroke(); g.lineWidth=1.3; g.strokeStyle=INK; g.stroke(); g.beginPath(); g.ellipse(0,-20,12,18,0,0,7); g.stroke(); },
 obelisco:(g,R)=>{ gshadow(g,4,0,10,3,.3); poly(g,[[-6,0],[6,0],[4,-36],[0,-42],[-4,-36]]); g.fillStyle=lin(g,-6,0,6,0,[[0,'#cfc6b4'],[.5,'#a59b88'],[.51,'#7c7364'],[1,'#696052']]); g.fill(); ink(g,1.3);
  g.fillStyle='rgba(60,40,20,.45)'; for(let y=-30;y<-6;y+=6) g.fillRect(-1.5,y,3,2); },
 barco:(g,R)=>boat(g,R,1),
 serpiente:(g,R)=>{ const c='#3f7a5a'; for(let i=0;i<3;i++){ const x=-24+i*18; g.beginPath(); g.moveTo(x-7,0); g.quadraticCurveTo(x,-16+i*2,x+7,0); g.lineWidth=7; g.strokeStyle=INK; g.lineCap='round'; g.stroke(); g.lineWidth=4.6; g.strokeStyle=c; g.stroke();
   g.strokeStyle='rgba(230,245,255,.65)'; g.lineWidth=1.1; g.beginPath(); g.ellipse(x,1,10,2.4,0,0,7); g.stroke(); }
  g.save(); g.translate(30,-12); g.beginPath(); g.moveTo(-4,12); g.quadraticCurveTo(-6,0,2,-4); g.quadraticCurveTo(10,-6,10,-1); g.quadraticCurveTo(5,1,2,3); g.quadraticCurveTo(0,8,3,12); g.closePath(); g.fillStyle=c; g.fill(); ink(g,1.3); g.fillStyle='#ffd23a'; circle(g,4,-2,1.2); g.fill(); g.restore(); },
 remolino:(g,R)=>{ g.lineCap='round'; for(let k=0;k<2;k++){ g.beginPath(); for(let a=0;a<14;a+=.15){ const r=1+a*2.1; const x=Math.cos(a+k*Math.PI)*r, y=Math.sin(a+k*Math.PI)*r*.45-14; a?g.lineTo(x,y):g.moveTo(x,y); } g.strokeStyle=k?'rgba(220,240,255,.8)':'rgba(20,40,60,.7)'; g.lineWidth=k?1.6:2.4; g.stroke(); } },
 rocas_mar:(g,R)=>{ for(let i=0;i<4;i++){ const x=jit(R,18), y=-R()*8, r=4+R()*5; g.strokeStyle='rgba(235,245,255,.7)'; g.lineWidth=1.2; g.beginPath(); g.ellipse(x,y+1,r*1.5,r*.45,0,0,7); g.stroke();
  poly(g,[[x-r,y],[x-r*.6,y-r],[x+r*.3,y-r*1.2],[x+r,y]]); g.fillStyle=lin(g,x-r,y-r,x+r,y,[[0,'#9a948c'],[1,'#544e48']]); g.fill(); ink(g,1.1); } },
 kraken:(g,R)=>{ const c='#8b3f5a'; for(let i=0;i<4;i++){ const x=-24+i*16, h=18+R()*12, cw=i%2?1:-1; g.beginPath(); g.moveTo(x-3,0); g.bezierCurveTo(x-3,-h*.5,x+cw*10,-h*.7,x+cw*6,-h); g.bezierCurveTo(x+cw*12,-h*.6,x+4,-h*.4,x+3,0); g.closePath();
  g.fillStyle=lin(g,x-4,0,x+4,0,[[0,sh(c,.2)],[1,sh(c,-.3)]]); g.fill(); ink(g,1.2); g.fillStyle='#f2c6d2'; for(let j=1;j<4;j++){ circle(g,x+cw*j*1.2,-h*j/4,1); g.fill(); }
  g.strokeStyle='rgba(230,245,255,.7)'; g.lineWidth=1.1; g.beginPath(); g.ellipse(x,1,7,2,0,0,7); g.stroke(); } },
 brujula:(g,R)=>compass(g),
 bandera:(g,R)=>{ g.strokeStyle=INK; g.lineWidth=1.5; g.beginPath(); g.moveTo(0,0); g.lineTo(0,-30); g.stroke(); g.beginPath(); g.moveTo(0,-30); g.quadraticCurveTo(8,-33,16,-28); g.quadraticCurveTo(10,-24,16,-19); g.quadraticCurveTo(8,-22,0,-20); g.closePath(); g.fillStyle=['#b8392b','#3e5a86','#d6a23a','#3f7a4a'][(R()*4)|0]; g.fill(); ink(g,1.1); },
 calavera:(g,R)=>{ gshadow(g,3,0,10,3,.3); g.beginPath(); g.arc(0,-12,9,Math.PI*.9,Math.PI*2.1); g.lineTo(5,-2); g.lineTo(-5,-2); g.closePath(); g.fillStyle='#ece4d2'; g.fill(); ink(g,1.3); g.fillStyle=INK; circle(g,-3.5,-11,2.6); g.fill(); circle(g,3.5,-11,2.6); g.fill(); poly(g,[[0,-8],[-1.3,-5.5],[1.3,-5.5]]); g.fill(); }
};
function boat(g,R,s){ g.save(); g.scale(s,s); g.strokeStyle='rgba(230,245,255,.75)'; g.lineWidth=1.2; g.beginPath(); g.moveTo(-34,3); g.quadraticCurveTo(-20,6,-8,3); g.moveTo(-40,7); g.quadraticCurveTo(-24,9,-12,7); g.stroke();
 g.beginPath(); g.moveTo(-24,-8); g.lineTo(24,-8); g.quadraticCurveTo(22,2,12,3); g.lineTo(-16,3); g.quadraticCurveTo(-24,0,-24,-8); g.closePath(); g.fillStyle=lin(g,0,-8,0,3,[[0,'#9a6a3e'],[1,'#5e3d22']]); g.fill(); ink(g,1.3);
 g.strokeStyle='rgba(30,15,5,.5)'; g.lineWidth=.6; g.beginPath(); g.moveTo(-22,-4); g.lineTo(21,-4); g.stroke();
 for(const [x,h] of [[-6,40],[10,32]]){ g.strokeStyle=INK; g.lineWidth=1.6; g.beginPath(); g.moveTo(x,-8); g.lineTo(x,-8-h); g.stroke();
  g.beginPath(); g.moveTo(x-12,-14-h*.85); g.quadraticCurveTo(x-2,-13-h*.5,x-12,-12); g.lineTo(x+12,-12); g.quadraticCurveTo(x+16,-13-h*.5,x+12,-14-h*.85); g.closePath(); g.fillStyle=lin(g,x-12,0,x+12,0,[[0,'#fbf6ea'],[1,'#c9bfa8']]); g.fill(); ink(g,1.1); }
 g.fillStyle='#b8392b'; poly(g,[[-6,-48],[2,-46],[-6,-44]]); g.fill(); g.restore(); }
function compass(g){ const R0=40; g.save(); g.translate(0,-R0-6);
 g.beginPath(); g.arc(0,0,R0,0,7); g.lineWidth=1.4; g.strokeStyle=INK; g.stroke(); g.beginPath(); g.arc(0,0,R0-4,0,7); g.lineWidth=.8; g.stroke();
 for(let i=0;i<64;i++){ const a=i/64*Math.PI*2, l=i%8===0?6:i%4===0?4:2; g.beginPath(); g.moveTo(Math.cos(a)*(R0-4),Math.sin(a)*(R0-4)); g.lineTo(Math.cos(a)*(R0-4-l),Math.sin(a)*(R0-4-l)); g.lineWidth=.7; g.stroke(); }
 const star=(n,r1,r2,rot,c1,c2)=>{ for(let i=0;i<n;i++){ const a=rot+i/n*Math.PI*2, b=a+Math.PI/n, c=a-Math.PI/n;
  poly(g,[[0,0],[Math.cos(a)*r1,Math.sin(a)*r1],[Math.cos(b)*r2,Math.sin(b)*r2]]); g.fillStyle=c1; g.fill(); ink(g,.8);
  poly(g,[[0,0],[Math.cos(a)*r1,Math.sin(a)*r1],[Math.cos(c)*r2,Math.sin(c)*r2]]); g.fillStyle=c2; g.fill(); ink(g,.8); } };
 star(8,R0*.62,R0*.18,Math.PI/8-Math.PI/2,'#d8c9a3','#8c7a52'); star(4,R0*.95,R0*.2,-Math.PI/2,'#f3ead6','#2e2a26');
 g.fillStyle='#b8392b'; poly(g,[[0,0],[0,-R0*.95],[R0*.2*Math.cos(-Math.PI/2+Math.PI/4),R0*.2*Math.sin(-Math.PI/2+Math.PI/4)]]); g.fill(); ink(g,.8);
 g.beginPath(); g.arc(0,0,3.2,0,7); g.fillStyle='#d6a44c'; g.fill(); ink(g,1); g.fillStyle=INK; g.font='bold 11px Cinzel, serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('N',0,-R0-7); g.restore(); }

/* ---- Vista cenital ---- */
function canopy(g,R,k,r,c){ const blobs=[]; const n=8+((R()*4)|0); for(let i=0;i<n;i++){ const a=i/n*Math.PI*2+jit(R,.2); blobs.push([Math.cos(a)*r*.62,Math.sin(a)*r*.62,r*(.38+R()*.12)]); } blobs.push([0,0,r*.62]);
 dropShadow(g,k,()=>{ g.fillStyle=sh(c,-.35); blobs.forEach(([x,y,rr])=>{ circle(g,x,y,rr); g.fill(); }); },r*.25,r*.3,r*.3,.5);
 blobs.forEach(([x,y,rr])=>{ circle(g,x,y,rr+1.2); g.fillStyle='rgba(20,30,10,.6)'; g.fill(); });
 blobs.forEach(([x,y,rr])=>{ circle(g,x,y,rr); g.fillStyle=rad(g,x-rr*.35,y-rr*.35,rr*.1,rr*1.1,[[0,sh(c,.3)],[.6,c],[1,sh(c,-.3)]]); g.fill(); });
 for(let i=0;i<26;i++){ const a=R()*6.3, d=R()*r*.85; g.fillStyle=R()<.5?`rgba(255,255,210,${.12+R()*.12})`:`rgba(10,30,10,${.15+R()*.12})`; circle(g,Math.cos(a)*d,Math.sin(a)*d,1+R()*r*.1); g.fill(); } }
function rockTop(g,R,k,r,col='#8b857c'){ const pts=[]; const n=7+((R()*4)|0); for(let i=0;i<n;i++){ const a=i/n*Math.PI*2; pts.push([Math.cos(a)*r*(.7+R()*.35),Math.sin(a)*r*(.6+R()*.35)]); }
 dropShadow(g,k,()=>{ poly(g,pts); g.fillStyle=col; g.fill(); },r*.2,r*.25,r*.3,.5);
 poly(g,pts); g.fillStyle=lin(g,-r,-r,r,r,[[0,sh(col,.3)],[.55,col],[1,sh(col,-.35)]]); g.fill(); ink(g,1.4);
 poly(g,pts.map(([x,y])=>[x*.55-r*.1,y*.55-r*.12])); g.fillStyle='rgba(255,255,255,.14)'; g.fill();
 g.strokeStyle='rgba(30,25,20,.45)'; g.lineWidth=.8; g.beginPath(); g.moveTo(jit(R,r*.3),jit(R,r*.3)); g.lineTo(jit(R,r*.6),jit(R,r*.6)); g.stroke(); }
function woodRect(g,w,h,c='#8a5c36',lines=4,vert){ g.fillStyle=lin(g,-w/2,-h/2,w/2,h/2,[[0,sh(c,.18)],[1,sh(c,-.18)]]); g.fillRect(-w/2,-h/2,w,h);
 g.strokeStyle='rgba(40,20,8,.45)'; g.lineWidth=.8; for(let i=1;i<lines;i++){ g.beginPath(); if(vert){ const x=-w/2+w*i/lines; g.moveTo(x,-h/2); g.lineTo(x,h/2); } else { const y=-h/2+h*i/lines; g.moveTo(-w/2,y); g.lineTo(w/2,y); } g.stroke(); }
 g.strokeStyle=INK; g.lineWidth=1.3; g.strokeRect(-w/2,-h/2,w,h); }
function glowCircle(g,x,y,r,c){ g.fillStyle=rad(g,x,y,0,r,[[0,c],[1,'rgba(255,160,60,0)']]); circle(g,x,y,r); g.fill(); }
function flame(g,x,y,s){ g.fillStyle='#ff7a22'; g.beginPath(); g.moveTo(x,y-s*1.6); g.quadraticCurveTo(x+s,y-s*.2,x,y+s*.5); g.quadraticCurveTo(x-s,y-s*.2,x,y-s*1.6); g.fill(); g.fillStyle='#ffe28a'; g.beginPath(); g.moveTo(x,y-s*.9); g.quadraticCurveTo(x+s*.45,y,x,y+s*.35); g.quadraticCurveTo(x-s*.45,y,x,y-s*.9); g.fill(); }

const TOP_ART={
 arbol_t:(g,R,k)=>canopy(g,R,k,46,sh('#4f7f3a',jit(R,.1))),
 arbol_oscuro_t:(g,R,k)=>canopy(g,R,k,46,'#2e5230'),
 arbol_otono_t:(g,R,k)=>canopy(g,R,k,46,['#c27a2e','#b04c2a','#cfa036'][(R()*3)|0]),
 pino_t:(g,R,k)=>{ const r=42; dropShadow(g,k,()=>{ g.fillStyle='#1f3a24'; circle(g,0,0,r*.9); g.fill(); },r*.25,r*.3,r*.3,.5);
  for(let L=0;L<3;L++){ const rr=r*(1-L*.28), c=sh('#2c5532',L*.12); g.beginPath(); const n=14; for(let i=0;i<=n*2;i++){ const a=i/(n*2)*Math.PI*2+L, d=i%2?rr*.7:rr; i?g.lineTo(Math.cos(a)*d,Math.sin(a)*d):g.moveTo(Math.cos(a)*d,Math.sin(a)*d); } g.closePath(); g.fillStyle=c; g.fill(); ink(g,1.1,'rgba(10,25,10,.7)'); }
  g.fillStyle='#4a3020'; circle(g,0,0,3); g.fill(); },
 arbusto_t:(g,R,k)=>canopy(g,R,k,24,'#5a8a3e'),
 flores_t:(g,R,k)=>{ canopy(g,R,k,20,'#4f7f3a'); const c=['#f4f1e4','#f2d35b','#e58fb0','#b884e0'][(R()*4)|0]; for(let i=0;i<14;i++){ g.fillStyle=c; circle(g,jit(R,14),jit(R,14),2.2); g.fill(); g.fillStyle='#f2d35b'; circle(g,0,0,0); } },
 roca_t:(g,R,k)=>rockTop(g,R,k,36),
 rocas_t:(g,R,k)=>{ for(let i=0;i<4;i++){ g.save(); g.translate(jit(R,22),jit(R,22)); rockTop(g,R,k,10+R()*12); g.restore(); } },
 escombros_t:(g,R,k)=>{ for(let i=0;i<16;i++){ g.save(); g.translate(jit(R,30),jit(R,30)); rockTop(g,R,k,3+R()*6,'#7d776e'); g.restore(); } },
 tocon_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#6b4a2e'; circle(g,0,0,16); g.fill(); }); g.fillStyle='#c79a62'; circle(g,0,0,13); g.fill(); g.strokeStyle='rgba(90,55,25,.6)'; g.lineWidth=.8; for(let r=3;r<13;r+=2.6){ circle(g,0,0,r); g.stroke(); } circle(g,0,0,16); ink(g,1.4); },
 tronco_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#5e3f26'; g.fillRect(-40,-9,80,18); }); g.fillStyle=lin(g,0,-9,0,9,[[0,'#8a6440'],[.5,'#6b4a2e'],[1,'#4a3220']]); g.fillRect(-40,-9,80,18); g.strokeStyle='rgba(30,15,5,.5)'; g.lineWidth=.8; for(let i=0;i<8;i++){ g.beginPath(); g.moveTo(-36+i*9,-7+jit(R,2)); g.lineTo(-30+i*9,7); g.stroke(); }
  g.strokeStyle=INK; g.lineWidth=1.3; g.strokeRect(-40,-9,80,18); g.fillStyle='#c79a62'; g.beginPath(); g.ellipse(40,0,4,9,0,0,7); g.fill(); ink(g,1.2); },
 barril_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#6b4a2e'; circle(g,0,0,18); g.fill(); }); g.fillStyle=rad(g,-5,-5,2,20,[[0,'#b58552'],[1,'#6b4a2e']]); circle(g,0,0,18); g.fill(); g.strokeStyle='rgba(40,20,8,.5)'; g.lineWidth=.8; for(let i=0;i<6;i++){ g.beginPath(); g.moveTo(-15+i*6,-13+Math.abs(i-2.5)*1); g.lineTo(-15+i*6,13-Math.abs(i-2.5)*1); g.stroke(); }
  g.strokeStyle='#3a3a40'; g.lineWidth=2.2; circle(g,0,0,15); g.stroke(); circle(g,0,0,18); ink(g,1.4); },
 caja_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#6b4a2e'; g.fillRect(-20,-20,40,40); }); woodRect(g,40,40,'#9a6c3f',4); g.strokeStyle='rgba(50,25,10,.75)'; g.lineWidth=3; g.beginPath(); g.moveTo(-18,-18); g.lineTo(18,18); g.stroke(); g.strokeStyle=INK; g.lineWidth=1.3; g.strokeRect(-20,-20,40,40); },
 mesa_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#5e3f26'; g.fillRect(-46,-26,92,52); }); woodRect(g,92,52,'#8a5c36',5); },
 mesa_redonda_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#5e3f26'; circle(g,0,0,32); g.fill(); }); g.fillStyle=rad(g,-8,-8,2,34,[[0,'#a87444'],[1,'#6b4a2e']]); circle(g,0,0,32); g.fill(); g.strokeStyle='rgba(40,20,8,.35)'; g.lineWidth=.8; for(let i=-24;i<30;i+=8){ g.beginPath(); g.moveTo(i,-Math.sqrt(Math.max(0,1024-i*i))); g.lineTo(i,Math.sqrt(Math.max(0,1024-i*i))); g.stroke(); } circle(g,0,0,32); ink(g,1.4);
  for(let i=0;i<4;i++){ const a=i/4*Math.PI*2+.4; g.save(); g.translate(Math.cos(a)*42,Math.sin(a)*42); g.rotate(a+Math.PI/2); woodRect(g,16,14,'#7a5030',2); g.restore(); } },
 silla_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#5e3f26'; g.fillRect(-12,-12,24,24); }); woodRect(g,24,22,'#8a5c36',3); g.fillStyle='#5e3f26'; g.fillRect(-12,-15,24,5); g.strokeStyle=INK; g.lineWidth=1.2; g.strokeRect(-12,-15,24,5); },
 cama_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#4a3020'; g.fillRect(-24,-40,48,80); }); woodRect(g,48,80,'#6b4a2e',1); g.fillStyle='#e9e2d0'; g.fillRect(-20,-36,40,16); g.strokeStyle=INK; g.lineWidth=1; g.strokeRect(-20,-36,40,16);
  const c=['#7a2b26','#3e5a86','#4e6b3c','#8a6a2e'][(R()*4)|0]; g.fillStyle=lin(g,-20,-16,20,36,[[0,sh(c,.15)],[1,sh(c,-.2)]]); g.fillRect(-21,-18,42,54); g.strokeStyle='rgba(255,255,255,.2)'; g.lineWidth=1; g.beginPath(); g.moveTo(-21,-12); g.lineTo(21,-12); g.stroke(); g.strokeStyle=INK; g.lineWidth=1.2; g.strokeRect(-21,-18,42,54); },
 cofre_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#4a3020'; g.fillRect(-24,-15,48,30); }); woodRect(g,48,30,'#7a4e2a',1); g.fillStyle='#b9933e'; g.fillRect(-14,-15,4,30); g.fillRect(10,-15,4,30); g.fillStyle='#e0c060'; g.fillRect(-4,-4,8,8); g.strokeStyle=INK; g.lineWidth=1.1; g.strokeRect(-4,-4,8,8); g.strokeRect(-24,-15,48,30); },
 estanteria_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#4a3020'; g.fillRect(-48,-12,96,24); }); woodRect(g,96,24,'#5e3f26',1); let x=-45; while(x<44){ const w=3+R()*4; g.fillStyle=['#7a2b26','#3e5a86','#4e6b3c','#8a6a2e','#5a3f6a','#c4b18a'][(R()*6)|0]; g.fillRect(x,-9,w,15); x+=w+.6; } g.strokeStyle=INK; g.lineWidth=1.3; g.strokeRect(-48,-12,96,24); },
 hoguera_t:(g,R,k)=>{ for(let i=0;i<10;i++){ const a=i/10*Math.PI*2; g.save(); g.translate(Math.cos(a)*22,Math.sin(a)*22); rockTop(g,R,k,6,'#77716a'); g.restore(); }
  for(let i=0;i<3;i++){ g.save(); g.rotate(i*1.05); g.fillStyle='#5e3f26'; g.fillRect(-16,-3,32,6); g.strokeStyle=INK; g.lineWidth=1; g.strokeRect(-16,-3,32,6); g.restore(); } glowCircle(g,0,0,18,'rgba(255,190,80,.9)'); flame(g,0,2,8); flame(g,-5,4,5); flame(g,5,4,5); },
 brasero_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#2a2a2e'; circle(g,0,0,14); g.fill(); }); g.fillStyle='#3a3a40'; circle(g,0,0,14); g.fill(); ink(g,1.4); g.fillStyle=rad(g,0,0,0,11,[[0,'#ffe08a'],[.5,'#ff7a22'],[1,'#5a1a0a']]); circle(g,0,0,10); g.fill(); flame(g,0,2,5); },
 antorcha_t:(g,R,k)=>{ g.fillStyle='#5e3f26'; g.fillRect(-2.5,-4,5,16); g.strokeStyle=INK; g.lineWidth=1; g.strokeRect(-2.5,-4,5,16); glowCircle(g,0,-6,10,'rgba(255,200,90,.9)'); flame(g,0,-4,5); },
 columna_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#777'; circle(g,0,0,22); g.fill(); },5,6,8,.55); g.fillStyle='#9a948a'; g.fillRect(-24,-24,48,48); g.strokeStyle=INK; g.lineWidth=1.2; g.strokeRect(-24,-24,48,48);
  g.fillStyle=rad(g,-7,-7,2,22,[[0,'#e2dccf'],[1,'#8a8478']]); circle(g,0,0,19); g.fill(); ink(g,1.3); g.strokeStyle='rgba(60,50,40,.35)'; g.lineWidth=.8; for(let i=0;i<12;i++){ const a=i/12*Math.PI*2; g.beginPath(); g.moveTo(Math.cos(a)*8,Math.sin(a)*8); g.lineTo(Math.cos(a)*18,Math.sin(a)*18); g.stroke(); } },
 estatua_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#777'; g.fillRect(-26,-26,52,52); },5,6,8,.55); g.fillStyle=lin(g,-26,-26,26,26,[[0,'#bdb6a8'],[1,'#7e786d']]); g.fillRect(-26,-26,52,52); g.strokeStyle=INK; g.lineWidth=1.3; g.strokeRect(-26,-26,52,52);
  g.fillStyle=rad(g,-4,-4,1,18,[[0,'#e8e2d6'],[1,'#9c968a']]); g.beginPath(); g.ellipse(0,4,17,10,0,0,7); g.fill(); ink(g,1.2); circle(g,0,-4,8); g.fill(); ink(g,1.2); g.beginPath(); g.moveTo(14,2); g.lineTo(22,-18); ink(g,2.4,'#9c968a'); },
 escalera_t:(g,R,k)=>{ g.fillStyle='#2a2522'; g.fillRect(-26,-40,52,80); for(let i=0;i<8;i++){ g.fillStyle=sh('#9a948a',-i*.09); g.fillRect(-24,-38+i*9.5,48,8); g.strokeStyle='rgba(0,0,0,.6)'; g.lineWidth=1; g.strokeRect(-24,-38+i*9.5,48,8); } g.strokeStyle=INK; g.lineWidth=1.6; g.strokeRect(-26,-40,52,80); },
 puerta_t:(g,R,k)=>{ g.fillStyle='#4a4540'; g.fillRect(-34,-9,10,18); g.fillRect(24,-9,10,18); woodRect(g,48,12,'#7a4e2a',4,true); g.fillStyle='#c4a050'; circle(g,16,0,2); g.fill(); g.strokeStyle=INK; g.lineWidth=1.2; g.strokeRect(-34,-9,10,18); g.strokeRect(24,-9,10,18); },
 pozo_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#777'; circle(g,0,0,26); g.fill(); }); for(let i=0;i<14;i++){ const a=i/14*Math.PI*2; g.save(); g.rotate(a); g.fillStyle=sh('#9a948a',jit(R,.12)); g.fillRect(16,-5.5,10,11); g.strokeStyle=INK; g.lineWidth=1; g.strokeRect(16,-5.5,10,11); g.restore(); }
  g.fillStyle=rad(g,0,0,2,16,[[0,'#0a1a24'],[.7,'#1c3e52'],[1,'#2a2420']]); circle(g,0,0,16); g.fill(); g.strokeStyle='rgba(200,230,255,.3)'; g.lineWidth=1; g.beginPath(); g.arc(-3,-3,7,3.6,5); g.stroke(); },
 altar_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#666'; g.fillRect(-40,-20,80,40); }); g.fillStyle=lin(g,-40,-20,40,20,[[0,'#c9c2b4'],[1,'#7f796e']]); g.fillRect(-40,-20,80,40); g.strokeStyle=INK; g.lineWidth=1.4; g.strokeRect(-40,-20,80,40);
  g.fillStyle='#7a2b26'; g.fillRect(-26,-20,52,40); g.strokeRect(-26,-20,52,40); for(const x of [-33,33]){ glowCircle(g,x,-12,9,'rgba(255,220,130,.85)'); g.fillStyle='#efe6d2'; circle(g,x,-12,2.6); g.fill(); } },
 sarcofago_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#666'; g.fillRect(-20,-40,40,80); }); poly(g,[[-16,-40],[16,-40],[20,-20],[16,40],[-16,40],[-20,-20]]); g.fillStyle=lin(g,-20,-40,20,40,[[0,'#cfc8ba'],[1,'#7f796e']]); g.fill(); ink(g,1.5);
  g.fillStyle='rgba(60,50,40,.35)'; g.beginPath(); g.ellipse(0,-26,7,8,0,0,7); g.fill(); g.fillRect(-9,-16,18,40); g.strokeStyle='rgba(255,255,255,.25)'; g.lineWidth=1; g.strokeRect(-12,-34,24,70); },
 huesos_t:(g,R,k)=>{ for(let i=0;i<6;i++){ g.save(); g.translate(jit(R,24),jit(R,24)); g.rotate(R()*6); g.lineCap='round'; g.strokeStyle=INK; g.lineWidth=5; g.beginPath(); g.moveTo(-9,0); g.lineTo(9,0); g.stroke(); g.strokeStyle='#e8dfc8'; g.lineWidth=3.2; g.stroke(); g.fillStyle='#e8dfc8'; for(const x of [-9,9]){ circle(g,x,-1.8,2.2); g.fill(); circle(g,x,1.8,2.2); g.fill(); } g.restore(); }
  g.fillStyle='#ece4d2'; circle(g,6,-6,8); g.fill(); ink(g,1.3); g.fillStyle=INK; circle(g,3,-7,2); g.fill(); circle(g,9,-7,2); g.fill(); },
 telarana_t:(g,R,k)=>{ g.strokeStyle='rgba(235,235,240,.7)'; g.lineWidth=.9; for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; g.beginPath(); g.moveTo(0,0); g.lineTo(Math.cos(a)*40,Math.sin(a)*40); g.stroke(); }
  for(let r=6;r<40;r+=6){ g.beginPath(); for(let i=0;i<=8;i++){ const a=i/8*Math.PI*2, rr=r+jit(R,1.5); i?g.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):g.moveTo(Math.cos(a)*rr,Math.sin(a)*rr); } g.stroke(); } },
 alfombra_t:(g,R,k)=>{ const c=['#7a2b26','#2e4a6e','#4e3a6b'][(R()*3)|0]; g.fillStyle=c; g.fillRect(-60,-40,120,80); g.strokeStyle='#d6b25a'; g.lineWidth=3; g.strokeRect(-54,-34,108,68); g.lineWidth=1; g.strokeRect(-48,-28,96,56);
  g.fillStyle='#d6b25a'; poly(g,[[0,-20],[26,0],[0,20],[-26,0]]); g.fill(); g.fillStyle=c; poly(g,[[0,-12],[15,0],[0,12],[-15,0]]); g.fill(); g.strokeStyle='#e9dcc0'; g.lineWidth=1; for(let x=-60;x<=60;x+=4){ g.beginPath(); g.moveTo(x,-40); g.lineTo(x,-45); g.moveTo(x,40); g.lineTo(x,45); g.stroke(); } },
 caldero_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#222'; circle(g,0,0,20); g.fill(); }); g.fillStyle='#2a2a2e'; circle(g,0,0,20); g.fill(); ink(g,1.5); g.fillStyle=rad(g,0,0,2,16,[[0,'#d6ff8a'],[.6,'#58c23a'],[1,'#1f5a1a']]); circle(g,0,0,15); g.fill();
  for(let i=0;i<5;i++){ g.strokeStyle='rgba(230,255,200,.7)'; g.lineWidth=1; circle(g,jit(R,8),jit(R,8),1.5+R()*2); g.stroke(); } },
 carro_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#4a3020'; g.fillRect(-26,-40,52,70); }); for(const [x,y] of [[-30,-24],[26,-24],[-30,16],[26,16]]){ g.fillStyle='#3a2a1a'; g.fillRect(x,y,4,14); } woodRect(g,52,70,'#8a6440',5,true); g.strokeStyle=INK; g.lineWidth=2; g.beginPath(); g.moveTo(-8,-35); g.lineTo(-8,-62); g.moveTo(8,-35); g.lineTo(8,-62); g.stroke(); g.fillStyle='#d6c27a'; g.beginPath(); g.ellipse(0,4,18,22,0,0,7); g.fill(); },
 tienda_t:(g,R,k)=>{ const c=['#c9a86a','#a0603a','#6e7d4a'][(R()*3)|0]; dropShadow(g,k,()=>{ g.fillStyle=c; g.fillRect(-36,-30,72,60); });
  poly(g,[[-36,-30],[0,-30],[0,30],[-36,30]]); g.fillStyle=sh(c,.15); g.fill(); poly(g,[[0,-30],[36,-30],[36,30],[0,30]]); g.fillStyle=sh(c,-.2); g.fill(); g.strokeStyle=INK; g.lineWidth=1.4; g.strokeRect(-36,-30,72,60); g.beginPath(); g.moveTo(0,-30); g.lineTo(0,30); g.stroke(); },
 heno_t:(g,R,k)=>{ dropShadow(g,k,()=>{ g.fillStyle='#b8983a'; circle(g,0,0,22); g.fill(); }); g.fillStyle=rad(g,-6,-6,2,24,[[0,'#f0d878'],[1,'#a8863a']]); circle(g,0,0,22); g.fill(); g.strokeStyle='rgba(120,90,20,.6)'; g.lineWidth=.8; for(let i=0;i<30;i++){ const a=R()*6.3, d=R()*18; g.beginPath(); g.moveTo(Math.cos(a)*d,Math.sin(a)*d); g.lineTo(Math.cos(a)*d+jit(R,5),Math.sin(a)*d+jit(R,5)); g.stroke(); } circle(g,0,0,22); ink(g,1.2); },
 charco_t:(g,R,k)=>{ const pts=[]; for(let i=0;i<9;i++){ const a=i/9*Math.PI*2; pts.push([Math.cos(a)*30*(.7+R()*.4),Math.sin(a)*20*(.7+R()*.4)]); } smooth(g,pts); g.fillStyle=rad(g,-6,-4,2,30,[[0,'rgba(120,180,210,.85)'],[1,'rgba(40,80,110,.85)']]); g.fill(); g.strokeStyle='rgba(30,40,30,.5)'; g.lineWidth=1.5; g.stroke(); g.strokeStyle='rgba(255,255,255,.35)'; g.lineWidth=1; g.beginPath(); g.ellipse(-8,-5,8,3,-.3,3.6,5.2); g.stroke(); },
 trampa_t:(g,R,k)=>{ g.fillStyle='#141210'; g.fillRect(-28,-28,56,56); g.strokeStyle='#6d6a66'; g.lineWidth=3; for(let i=-20;i<=20;i+=10){ g.beginPath(); g.moveTo(i,-28); g.lineTo(i,28); g.stroke(); } g.strokeStyle=INK; g.lineWidth=1.6; g.strokeRect(-28,-28,56,56); },
 luz_t:(g,R,k)=>{ glowCircle(g,0,0,30,'rgba(255,220,150,.55)'); g.strokeStyle='rgba(255,230,170,.9)'; g.setLineDash([3,3]); g.lineWidth=1; circle(g,0,0,6); g.stroke(); g.setLineDash([]); },
 sangre_t:(g,R,k)=>{ for(let i=0;i<7;i++){ g.fillStyle=`rgba(${110+R()*30},10,12,${.55+R()*.3})`; circle(g,jit(R,22),jit(R,22),3+R()*10); g.fill(); } }
};

/* Catálogo: nombre, categoría, vista, tamaño por defecto (lado: px en mapa global, cenital: casillas), caja de dibujo, luz */
const STAMP_CATS={montanas:'Montañas y colinas',vegetacion:'Árboles y vegetación',asentamientos:'Asentamientos',lugares:'Lugares',mar:'Mar',decoracion:'Decoración',naturaleza:'Naturaleza',mobiliario:'Mobiliario',mazmorra:'Mazmorra',luz:'Luces'};
const STAMPS={};
const defS=(id,n,cat,sz,box,extra={})=>{ STAMPS[id]=Object.assign({id,n,cat,side:!id.endsWith('_t'),sz,box},extra); };
[['montana','Montaña','montanas',95,[110,96]],['montana_parda','Montaña parda','montanas',95,[110,96]],['montana_nevada','Montaña nevada','montanas',100,[110,96]],['cordillera','Cordillera','montanas',140,[170,104]],['volcan','Volcán','montanas',110,[110,130]],
 ['colina','Colina','montanas',46,[90,40]],['colinas','Colinas','montanas',70,[130,46]],['duna','Duna','montanas',40,[90,30]],
 ['pino','Pino','vegetacion',30,[30,52]],['arbol','Árbol','vegetacion',30,[44,56]],['arbol_otono','Árbol otoñal','vegetacion',30,[44,56]],['palmera','Palmera','vegetacion',36,[64,66]],['arbol_seco','Árbol seco','vegetacion',32,[60,58]],['arbusto','Arbusto','vegetacion',14,[28,20]],['cactus','Cactus','vegetacion',26,[36,52]],
 ['bosque','Bosque','vegetacion',80,[100,72]],['pinar','Pinar','vegetacion',80,[100,74]],['bosque_mixto','Bosque mixto','vegetacion',80,[100,74]],['selva','Selva','vegetacion',84,[100,72]],['bosque_muerto','Bosque muerto','vegetacion',64,[90,50]],
 ['casa','Casa','asentamientos',26,[42,36]],['aldea','Aldea','asentamientos',50,[80,44]],['ciudad','Ciudad','asentamientos',100,[130,82]],['castillo','Castillo','asentamientos',90,[100,90]],['torre','Torre','asentamientos',46,[30,64]],['torre_mago','Torre de mago','asentamientos',52,[40,90]],
 ['templo','Templo','lugares',52,[70,52]],['ruinas','Ruinas','lugares',48,[72,40]],['faro','Faro','lugares',52,[56,80]],['molino','Molino','asentamientos',40,[52,64]],['puerto','Puerto','asentamientos',50,[90,36]],['campamento','Campamento','lugares',40,[60,36]],
 ['cueva','Cueva','lugares',40,[60,32]],['puente','Puente','lugares',50,[80,34]],['portal','Portal','lugares',40,[40,50]],['obelisco','Obelisco','lugares',34,[24,50]],
 ['barco','Barco','mar',56,[80,64]],['serpiente','Serpiente marina','mar',56,[86,40]],['remolino','Remolino','mar',40,[60,36]],['rocas_mar','Rocas','mar',32,[50,26]],['kraken','Kraken','mar',56,[80,46]],
 ['brujula','Rosa de los vientos','decoracion',200,[100,106]],['bandera','Bandera','decoracion',26,[40,40]],['calavera','Peligro','decoracion',22,[28,30]]
].forEach(([id,n,cat,sz,box])=>defS(id,n,cat,sz,box,{ay:id==='brujula'?.97:.9}));
[['arbol_t','Árbol','naturaleza',2.6,100],['arbol_oscuro_t','Árbol oscuro','naturaleza',2.6,100],['arbol_otono_t','Árbol otoñal','naturaleza',2.6,100],['pino_t','Pino','naturaleza',2.2,100],['arbusto_t','Arbusto','naturaleza',1,60],['flores_t','Flores','naturaleza',.8,50],
 ['roca_t','Roca','naturaleza',1.2,84],['rocas_t','Rocas','naturaleza',1.4,84],['escombros_t','Escombros','mazmorra',1.4,80],['tocon_t','Tocón','naturaleza',.6,40],['tronco_t','Tronco','naturaleza',1.8,96],['charco_t','Charco','naturaleza',1.4,72],['heno_t','Fardo de heno','mobiliario',.9,52],
 ['barril_t','Barril','mobiliario',.6,42],['caja_t','Caja','mobiliario',.8,46],['mesa_t','Mesa','mobiliario',1.8,100],['mesa_redonda_t','Mesa redonda','mobiliario',2,110],['silla_t','Silla','mobiliario',.5,34],['cama_t','Cama','mobiliario',1.8,90],['cofre_t','Cofre','mobiliario',.8,52],
 ['estanteria_t','Estantería','mobiliario',1.8,100],['carro_t','Carro','mobiliario',2.2,130],['tienda_t','Tienda de campaña','mobiliario',2,80],['alfombra_t','Alfombra','mobiliario',2.6,130],
 ['columna_t','Columna','mazmorra',1,56],['estatua_t','Estatua','mazmorra',1,60],['escalera_t','Escalera','mazmorra',1.8,84],['puerta_t','Puerta','mazmorra',1.2,72],['pozo_t','Pozo','mazmorra',1.1,60],['altar_t','Altar','mazmorra',1.6,90],['sarcofago_t','Sarcófago','mazmorra',1.6,84],
 ['huesos_t','Huesos','mazmorra',.9,60],['telarana_t','Telaraña','mazmorra',1.4,84],['caldero_t','Caldero','mazmorra',.8,46],['trampa_t','Trampa','mazmorra',1,60],['sangre_t','Mancha','mazmorra',.9,56],
 ['hoguera_t','Hoguera','luz',1.1,60,{light:[5,'255,170,80']}],['brasero_t','Brasero','luz',.6,34,{light:[4,'255,180,90']}],['antorcha_t','Antorcha','luz',.4,32,{light:[4,'255,190,100']}],['luz_t','Luz','luz',.6,64,{light:[5,'255,225,170'],editorOnly:1}]
].forEach(([id,n,cat,cells,box,ex])=>defS(id,n,cat,cells,[box,box],Object.assign({ay:.5,flat:['alfombra_t','charco_t','sangre_t','trampa_t','escalera_t'].includes(id)},ex||{})));
STAMPS.faro.light=[160,'255,220,140']; STAMPS.torre_mago.light=[120,'180,140,255']; STAMPS.portal.light=[90,'170,120,255']; STAMPS.campamento.light=[80,'255,170,80']; STAMPS.volcan.light=[110,'255,110,40']; STAMPS.caldero_t.light=[3,'140,255,120'];
STAMPS.altar_t.light=[3.5,'255,215,140'];
/* Pinceles de dispersión: varios objetos a la vez */
const SCATTER={bosque_mix:{n:'Bosque al pincel',ids:['arbol','arbol','pino','arbusto'],side:1},pinos_mix:{n:'Pinos al pincel',ids:['pino'],side:1},montes_mix:{n:'Montañas al pincel',ids:['montana','montana','montana_nevada','colina'],side:1},
 arboles_t_mix:{n:'Arboleda',ids:['arbol_t','arbol_t','arbol_oscuro_t','pino_t','arbusto_t'],side:0},rocas_t_mix:{n:'Pedregal',ids:['roca_t','rocas_t','escombros_t'],side:0}};

const SPRC=new Map();
function stampSprite(id,v,px){ const key=id+'|'+v+'|'+px; let c=SPRC.get(key); if(c) return c; if(SPRC.size>700) SPRC.clear();
 const d=STAMPS[id]; const [bw,bh]=d.box, k=px/Math.max(bw,bh), P=d.side?1:1.36; c=mkC(bw*k*P,bh*k*P); const g=c.getContext('2d'); g.translate(bw*k*P/2,bh*k*P*(d.ay??.9)); g.scale(k,k);
 const R=srng(strHash(id)+v*7919+1); (d.side?SIDE_ART:TOP_ART)[id](g,R,k); c.k=k; SPRC.set(key,c); return c; }
