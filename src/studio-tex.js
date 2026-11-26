/* ===== Estudio de mapas · texturas pintadas a mano (procedurales, sin costuras) ===== */
const srng=seed=>{ let a=(seed>>>0)||1; return ()=>{ a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; };
const strHash=s=>{ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; };
const mkC=(w,h)=>{ const c=document.createElement('canvas'); c.width=Math.max(1,Math.round(w)); c.height=Math.max(1,Math.round(h||w)); return c; };
const hex2rgb=h=>{ const n=parseInt(h.slice(1),16); return [n>>16,n>>8&255,n&255]; };
const rgbs=(r,g,b,a=1)=>`rgba(${r|0},${g|0},${b|0},${a})`;
const mixHex=(a,b,t)=>{ const A=hex2rgb(a),B=hex2rgb(b); return rgbs(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+(B[2]-A[2])*t); };
const TXS=512;

/* Ruido de valor sin costuras, acelerado por el escalado del propio canvas */
function noiseCanvas(T,P,R){
 const t=mkC(P,P), tg=t.getContext('2d'), id=tg.createImageData(P,P);
 for(let i=0;i<P*P;i++){ const v=R()*255; id.data[i*4]=id.data[i*4+1]=id.data[i*4+2]=v; id.data[i*4+3]=255; }
 tg.putImageData(id,0,0);
 const s=mkC(P*3,P*3), sg=s.getContext('2d'); for(let y=0;y<3;y++) for(let x=0;x<3;x++) sg.drawImage(t,x*P,y*P);
 const o=mkC(T,T), og=o.getContext('2d'); og.imageSmoothingEnabled=true; og.imageSmoothingQuality='high';
 if(P<=16&&'filter' in og) og.filter=`blur(${Math.round(T/P/5)}px)`;
 og.drawImage(s,-T,-T,T*3,T*3); return o;
}
function sfbm(T,R,periods,weights){
 const c=mkC(T,T), g=c.getContext('2d');
 periods.forEach((P,i)=>{ g.globalAlpha=i?weights[i]:1; g.drawImage(noiseCanvas(T,P,R),0,0); });
 const d=g.getImageData(0,0,T,T).data, out=new Float32Array(T*T); let mn=255,mx=0;
 for(let i=0;i<T*T;i++){ const v=d[i*4]; out[i]=v; if(v<mn) mn=v; if(v>mx) mx=v; }
 const k=1/Math.max(1,mx-mn); for(let i=0;i<T*T;i++) out[i]=(out[i]-mn)*k; return out;
}
function rampLUT(ramp){ const L=new Uint8ClampedArray(256*3); for(let i=0;i<256;i++){ const t=i/255; let j=0; while(j<ramp.length-2&&t>ramp[j+1][0]) j++;
 const [t0,c0]=ramp[j],[t1,c1]=ramp[j+1]; const u=clamp((t-t0)/Math.max(1e-6,t1-t0),0,1), s=u*u*(3-2*u), A=hex2rgb(c0),B=hex2rgb(c1);
 for(let k=0;k<3;k++) L[i*3+k]=A[k]+(B[k]-A[k])*s; } return L; }
/* Dibuja algo repitiéndolo en los bordes para que la textura no tenga costuras */
function wrap(T,x,y,m,fn){ for(const ox of [0,-T,T]) for(const oy of [0,-T,T]){ const X=x+ox,Y=y+oy; if(X>-m&&X<T+m&&Y>-m&&Y<T+m) fn(X,Y); } }
function rampCol(ramp,t,a=1){ const L=ramp._L||(ramp._L=rampLUT(ramp)); const i=clamp(Math.round(t*255),0,255)*3; return rgbs(L[i],L[i+1],L[i+2],a); }

/* Detalles pintados */
const TFX={
 paint(g,T,R,d){ for(let i=0;i<(d.paint||900);i++){ const x=R()*T,y=R()*T, l=6+R()*18, a=R()*Math.PI, w=2+R()*5; g.fillStyle=rampCol(d.ramp,R(),.08+R()*.12);
  wrap(T,x,y,l,(X,Y)=>{ g.save(); g.translate(X,Y); g.rotate(a); g.beginPath(); g.ellipse(0,0,l,w,0,0,7); g.fill(); g.restore(); }); } },
 blades(g,T,R,d){ g.lineCap='round'; for(let i=0;i<(d.blades||2600);i++){ const x=R()*T,y=R()*T,l=3+R()*6,a=-Math.PI/2+(R()-.5)*.9, t=R(); g.strokeStyle=rampCol(d.ramp,t>.5?.75+R()*.25:R()*.35,.55); g.lineWidth=.8+R()*1.1;
  wrap(T,x,y,10,(X,Y)=>{ g.beginPath(); g.moveTo(X,Y); g.quadraticCurveTo(X+Math.cos(a+.3)*l*.5,Y+Math.sin(a+.3)*l*.5,X+Math.cos(a)*l,Y+Math.sin(a)*l); g.stroke(); }); } },
 flowers(g,T,R,d){ const cs=d.flowers||['#f4f1e4','#f2d35b','#e58fb0']; for(let i=0;i<70;i++){ const cx=R()*T,cy=R()*T,c=cs[(R()*cs.length)|0]; for(let j=0;j<5+R()*8;j++){ const x=cx+(R()-.5)*22,y=cy+(R()-.5)*22; g.fillStyle=c; wrap(T,x,y,4,(X,Y)=>{ g.beginPath(); g.arc(X,Y,.9+R()*1.1,0,7); g.fill(); }); } } },
 leaves(g,T,R,d){ for(let i=0;i<1400;i++){ const x=R()*T,y=R()*T,r=1.5+R()*3.2; g.fillStyle=rampCol(d.ramp,R(),.45); wrap(T,x,y,6,(X,Y)=>{ g.beginPath(); g.ellipse(X,Y,r,r*.6,R()*3,0,7); g.fill(); }); }
  for(let i=0;i<60;i++){ const x=R()*T,y=R()*T,r=10+R()*26; g.fillStyle='rgba(10,25,10,.12)'; wrap(T,x,y,r,(X,Y)=>{ g.beginPath(); g.arc(X,Y,r,0,7); g.fill(); }); } },
 pebbles(g,T,R,d){ for(let i=0;i<(d.pebbles||260);i++){ const x=R()*T,y=R()*T,r=1.5+R()*(d.peb||4.5), a=R()*3; const c=rampCol(d.ramp,.55+R()*.45);
  wrap(T,x,y,r*2,(X,Y)=>{ g.fillStyle='rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(X+r*.3,Y+r*.35,r,r*.75,a,0,7); g.fill(); g.fillStyle=c; g.beginPath(); g.ellipse(X,Y,r,r*.75,a,0,7); g.fill(); g.fillStyle='rgba(255,255,255,.25)'; g.beginPath(); g.ellipse(X-r*.3,Y-r*.3,r*.4,r*.28,a,0,7); g.fill(); }); } },
 cracks(g,T,R,d){ g.lineCap='round'; for(let i=0;i<(d.cracks||26);i++){ let x=R()*T,y=R()*T,a=R()*6.3; const pts=[[x,y]]; for(let j=0;j<6+R()*10;j++){ a+=(R()-.5)*1.2; x+=Math.cos(a)*7; y+=Math.sin(a)*7; pts.push([x,y]); }
  g.strokeStyle=d.crackCol||'rgba(20,15,10,.35)'; g.lineWidth=.8+R(); wrap(T,pts[0][0],pts[0][1],90,(X,Y)=>{ const dx=X-pts[0][0],dy=Y-pts[0][1]; g.beginPath(); pts.forEach((p,k)=>k?g.lineTo(p[0]+dx,p[1]+dy):g.moveTo(p[0]+dx,p[1]+dy)); g.stroke(); }); } },
 glow(g,T,R,d){ g.save(); g.lineCap='round'; for(let i=0;i<34;i++){ let x=R()*T,y=R()*T,a=R()*6.3; const pts=[[x,y]]; for(let j=0;j<8+R()*10;j++){ a+=(R()-.5)*1.3; x+=Math.cos(a)*8; y+=Math.sin(a)*8; pts.push([x,y]); }
  wrap(T,pts[0][0],pts[0][1],140,(X,Y)=>{ const dx=X-pts[0][0],dy=Y-pts[0][1]; const path=()=>{ g.beginPath(); pts.forEach((p,k)=>k?g.lineTo(p[0]+dx,p[1]+dy):g.moveTo(p[0]+dx,p[1]+dy)); };
   path(); g.strokeStyle='rgba(255,90,20,.25)'; g.lineWidth=7; g.stroke(); path(); g.strokeStyle='#ff8a2a'; g.lineWidth=2; g.stroke(); path(); g.strokeStyle='#ffe08a'; g.lineWidth=.8; g.stroke(); }); } g.restore(); },
 dunes(g,T,R,d){ for(let k=0;k<14;k++){ const y0=R()*T, A=4+R()*9, f=1+((R()*3)|0), ph=R()*6.3;
  for(const [off,col] of [[2.2,'rgba(120,80,30,.18)'],[0,'rgba(255,240,200,.32)']]){ g.strokeStyle=col; g.lineWidth=1.6; g.beginPath(); for(let x=0;x<=T;x+=4){ const y=y0+off+A*Math.sin(x/T*Math.PI*2*f+ph); x?g.lineTo(x,y):g.moveTo(x,y); } g.stroke();
   g.save(); g.translate(0,-T); g.stroke(); g.translate(0,2*T); g.stroke(); g.restore(); } } },
 sparkle(g,T,R){ for(let i=0;i<70;i++){ const x=R()*T,y=R()*T,r=14+R()*30; g.fillStyle='rgba(120,150,190,.10)'; wrap(T,x,y,r,(X,Y)=>{ g.beginPath(); g.ellipse(X,Y,r,r*.55,R()*3,0,7); g.fill(); }); }
  for(let i=0;i<500;i++){ const x=R()*T,y=R()*T; g.fillStyle=`rgba(255,255,255,${.4+R()*.6})`; g.fillRect(x,y,1.2,1.2); } },
 puddles(g,T,R){ for(let i=0;i<26;i++){ const x=R()*T,y=R()*T,r=6+R()*16; wrap(T,x,y,r*1.6,(X,Y)=>{ g.fillStyle='rgba(30,55,45,.55)'; g.beginPath(); g.ellipse(X,Y,r*1.4,r*.8,R()*3,0,7); g.fill(); g.strokeStyle='rgba(190,210,170,.25)'; g.lineWidth=1.2; g.stroke(); }); }
  g.strokeStyle='rgba(70,90,40,.6)'; g.lineWidth=1; for(let i=0;i<500;i++){ const x=R()*T,y=R()*T; wrap(T,x,y,8,(X,Y)=>{ g.beginPath(); g.moveTo(X,Y); g.lineTo(X+(R()-.5)*2,Y-4-R()*5); g.stroke(); }); } },
 caustic(g,T,R){ g.strokeStyle='rgba(220,250,255,.22)'; g.lineWidth=1.2; for(let i=0;i<120;i++){ const x=R()*T,y=R()*T,r=5+R()*12; wrap(T,x,y,r*2,(X,Y)=>{ g.beginPath(); g.arc(X,Y,r,R()*6,R()*6+1.6); g.stroke(); }); } },
 waves(g,T,R,d){ g.lineCap='round'; for(let i=0;i<(d.waves||150);i++){ const x=R()*T,y=R()*T,w=5+R()*9; g.strokeStyle=`rgba(225,240,255,${.12+R()*.18})`; g.lineWidth=1.1;
  wrap(T,x,y,w*3,(X,Y)=>{ g.beginPath(); g.moveTo(X-w,Y); g.quadraticCurveTo(X-w/2,Y-w*.45,X,Y); g.quadraticCurveTo(X+w/2,Y-w*.45,X+w,Y); g.stroke(); }); } },
 hatch(g,T,R){ g.lineCap='round'; for(let i=0;i<950;i++){ const x=R()*T,y=R()*T,a=R()*Math.PI,n=3+((R()*3)|0),l=8+R()*8; g.strokeStyle=`rgba(8,6,6,${.5+R()*.4})`; g.lineWidth=.9+R()*.5;
  wrap(T,x,y,30,(X,Y)=>{ for(let k=0;k<n;k++){ const o=(k-n/2)*3.2, cx=X+Math.cos(a+Math.PI/2)*o, cy=Y+Math.sin(a+Math.PI/2)*o; g.beginPath(); g.moveTo(cx-Math.cos(a)*l/2,cy-Math.sin(a)*l/2); g.lineTo(cx+Math.cos(a)*l/2,cy+Math.sin(a)*l/2); g.stroke(); } }); } },
 stains(g,T,R){ for(let i=0;i<40;i++){ const x=R()*T,y=R()*T,r=20+R()*60; wrap(T,x,y,r,(X,Y)=>{ const gr=g.createRadialGradient(X,Y,0,X,Y,r); gr.addColorStop(0,'rgba(120,80,30,.10)'); gr.addColorStop(.8,'rgba(120,80,30,.05)'); gr.addColorStop(1,'rgba(120,80,30,0)'); g.fillStyle=gr; g.beginPath(); g.arc(X,Y,r,0,7); g.fill(); }); }
  g.strokeStyle='rgba(110,80,40,.10)'; g.lineWidth=.8; for(let i=0;i<300;i++){ const x=R()*T,y=R()*T,a=R()*6,l=4+R()*14; wrap(T,x,y,l,(X,Y)=>{ g.beginPath(); g.moveTo(X,Y); g.lineTo(X+Math.cos(a)*l,Y+Math.sin(a)*l); g.stroke(); }); } },
 snowtufts(g,T,R){ g.strokeStyle='rgba(90,110,80,.45)'; g.lineWidth=1; for(let i=0;i<500;i++){ const x=R()*T,y=R()*T; wrap(T,x,y,8,(X,Y)=>{ g.beginPath(); g.moveTo(X,Y); g.lineTo(X+(R()-.5)*3,Y-3-R()*4); g.stroke(); }); } }
};

/* Celdas de Voronoi repetibles (adoquines, placas de lava) */
function voronoi(T,G,R){ const pts=[]; for(let j=0;j<G;j++) for(let i=0;i<G;i++) pts.push([(i+.15+R()*.7)*T/G,(j+.15+R()*.7)*T/G]);
 const cs=T/G, id=new Int32Array(T*T), e=new Float32Array(T*T), dc=new Float32Array(T*T);
 for(let y=0;y<T;y++) for(let x=0;x<T;x++){ const ci=Math.floor(x/cs), cj=Math.floor(y/cs); let d1=1e9,d2=1e9,b=0;
  for(let oj=-1;oj<=1;oj++) for(let oi=-1;oi<=1;oi++){ let ii=ci+oi, jj=cj+oj, sx=0, sy=0; if(ii<0){ii+=G;sx=-T;} if(ii>=G){ii-=G;sx=T;} if(jj<0){jj+=G;sy=-T;} if(jj>=G){jj-=G;sy=T;}
   const p=pts[jj*G+ii], dx=p[0]+sx-x, dy=p[1]+sy-y, d=dx*dx+dy*dy; if(d<d1){ d2=d1; d1=d; b=jj*G+ii; } else if(d<d2) d2=d; }
  const k=y*T+x; id[k]=b; e[k]=Math.sqrt(d2)-Math.sqrt(d1); dc[k]=Math.sqrt(d1); }
 return {id,e,dc,n:G*G}; }

/* Generadores especiales */
const TGEN={
 cobble(g,T,R,d){ const V=voronoi(T,d.G||11,R), N=sfbm(T,R,[8,32,128],[1,.4,.3]), img=g.createImageData(T,T), L=rampLUT(d.ramp), col=[], mor=hex2rgb(d.mortar||'#4a443c');
  for(let i=0;i<V.n;i++) col.push(.15+R()*.85);
  for(let k=0;k<T*T;k++){ const e=V.e[k]; let r,gg,b; if(e<(d.gap||2.2)){ const t=e/(d.gap||2.2); r=mor[0]*(.8+t*.3); gg=mor[1]*(.8+t*.3); b=mor[2]*(.8+t*.3); }
   else { const t=clamp(col[V.id[k]]*.75+N[k]*.35-.1,0,1), li=clamp(1.18-V.dc[k]/(T/(d.G||11))*.9,0.65,1.25)*(e<5?.82:1); const i=Math.round(t*255)*3; r=L[i]*li; gg=L[i+1]*li; b=L[i+2]*li; }
   img.data[k*4]=r; img.data[k*4+1]=gg; img.data[k*4+2]=b; img.data[k*4+3]=255; }
  g.putImageData(img,0,0); },
 lava(g,T,R,d){ const V=voronoi(T,7,R), N=sfbm(T,R,[8,32,64],[1,.5,.3]), img=g.createImageData(T,T);
  for(let k=0;k<T*T;k++){ const e=V.e[k]; let c; if(e<7){ const t=1-e/7; c=[255,90+t*150,20+t*90]; } else { const t=N[k]; c=[40+t*40,24+t*20,22+t*18]; if(e<12){ const u=(12-e)/5; c=[c[0]+u*120,c[1]+u*30,c[2]]; } }
   img.data[k*4]=c[0]; img.data[k*4+1]=c[1]; img.data[k*4+2]=c[2]; img.data[k*4+3]=255; } g.putImageData(img,0,0); },
 flag(g,T,R,d){ g.fillStyle=d.mortar||'#3c3832'; g.fillRect(0,0,T,T); const rows=d.rows||8, rh=T/rows, gap=d.gap||3;
  for(let j=0;j<rows;j++){ let x=-R()*T/4; const ws=[]; while(x<T){ const w=(d.sq?rh:rh*(1+R()*1.4)); ws.push([x,w]); x+=w; } const over=x-T; // ajusta para repetir
   ws[ws.length-1][1]-=over; for(const [x0,w] of ws){ const t=.2+R()*.8; for(const ox of [0,T,-T]){ const X=x0+ox; if(X>T||X+w<0) continue;
    const gr=g.createLinearGradient(X,j*rh,X+w,(j+1)*rh); gr.addColorStop(0,rampCol(d.ramp,clamp(t+.12,0,1))); gr.addColorStop(1,rampCol(d.ramp,clamp(t-.12,0,1))); g.fillStyle=gr;
    g.beginPath(); g.roundRect?g.roundRect(X+gap/2,j*rh+gap/2,w-gap,rh-gap,3):g.rect(X+gap/2,j*rh+gap/2,w-gap,rh-gap); g.fill();
    g.strokeStyle='rgba(255,255,255,.08)'; g.lineWidth=1.2; g.beginPath(); g.moveTo(X+gap,j*rh+gap); g.lineTo(X+w-gap,j*rh+gap); g.stroke(); } } } },
 planks(g,T,R,d){ const rows=d.rows||9, rh=T/rows;
  for(let j=0;j<rows;j++){ const joints=[]; let x=R()*T*.5; while(joints.length<3){ joints.push(x%T); x+=T*(.28+R()*.25); } joints.sort((a,b)=>a-b);
   for(let s=0;s<joints.length;s++){ const x0=joints[s], x1=s+1<joints.length?joints[s+1]:joints[0]+T, t=.25+R()*.6;
    for(const ox of [0,-T]){ const X=x0+ox, W=x1-x0; g.fillStyle=rampCol(d.ramp,t); g.fillRect(X,j*rh,W,rh);
     for(let k=0;k<5;k++){ g.strokeStyle=rampCol(d.ramp,clamp(t-.25+R()*.15,0,1),.5); g.lineWidth=.7+R()*.8; const yy=j*rh+3+R()*(rh-6), A=1+R()*2, f=2+((R()*4)|0); g.beginPath(); for(let xx=0;xx<=W;xx+=6){ const y=yy+A*Math.sin((xx/W)*Math.PI*f+k); xx?g.lineTo(X+xx,y):g.moveTo(X+xx,y); } g.stroke(); }
     if(R()<.4){ g.fillStyle=rampCol(d.ramp,.1,.6); g.beginPath(); g.ellipse(X+W*R(),j*rh+rh*(.3+R()*.4),3+R()*3,1.6,0,0,7); g.fill(); }
     g.fillStyle='rgba(20,10,5,.55)'; g.fillRect(X,j*rh,1.6,rh); g.fillStyle='rgba(0,0,0,.25)'; g.fillRect(X+3,j*rh+rh*.5-1.5,2,2); } }
   g.fillStyle='rgba(15,8,4,.6)'; g.fillRect(0,j*rh+rh-1.6,T,1.6); g.fillStyle='rgba(255,230,190,.10)'; g.fillRect(0,j*rh,T,1.2); } },
 fields(g,T,R,d){ const cols=['#c9b45a','#a9b055','#7f9b45','#8f7347','#b99a4e','#6f8c3e','#d1c06b'];
  const split=(x,y,w,h,k)=>{ if(k>5||(w<T/7&&h<T/7)||(k>2&&R()<.15)||w<T/12||h<T/12){ const c=cols[(R()*cols.length)|0]; g.fillStyle=c; g.fillRect(x,y,w,h); const vert=R()<.5;
    g.strokeStyle='rgba(60,45,20,.22)'; g.lineWidth=1.2; for(let i=4;i<(vert?w:h);i+=5){ g.beginPath(); vert?(g.moveTo(x+i,y),g.lineTo(x+i,y+h)):(g.moveTo(x,y+i),g.lineTo(x+w,y+i)); g.stroke(); }
    g.strokeStyle='rgba(50,70,30,.75)'; g.lineWidth=3; g.strokeRect(x,y,w,h); g.fillStyle='rgba(40,70,30,.75)'; for(let i=0;i<(w+h)/14;i++){ const e=R()*4|0, px=e<2?x+R()*w:(e===2?x:x+w), py=e>=2?y+R()*h:(e===0?y:y+h); g.beginPath(); g.arc(px,py,2+R()*2.5,0,7); g.fill(); } return; }
   if(w>h){ const s=w*(.3+R()*.4); split(x,y,s,h,k+1); split(x+s,y,w-s,h,k+1); } else { const s=h*(.3+R()*.4); split(x,y,w,s,k+1); split(x,y+s,w,h-s,k+1); } };
  split(0,0,T,T,0); },
 carpet(g,T,R,d){ g.fillStyle=d.ramp[1][1]; g.fillRect(0,0,T,T); const s=T/8; for(let j=0;j<8;j++) for(let i=0;i<8;i++){ const cx=(i+.5)*s, cy=(j+.5)*s; g.fillStyle=(i+j)%2?d.ramp[0][1]:d.ramp[2][1]; g.beginPath(); g.moveTo(cx,cy-s*.42); g.lineTo(cx+s*.42,cy); g.lineTo(cx,cy+s*.42); g.lineTo(cx-s*.42,cy); g.closePath(); g.fill();
  g.fillStyle='rgba(240,200,120,.55)'; g.beginPath(); g.arc(cx,cy,s*.08,0,7); g.fill(); } }
};

/* Catálogo de texturas: nombre, niveles (g global, n nacional, m mínimo, d mazmorra), rampa, escala en el mundo */
const TEX={
 pradera:{n:'Pradera',lv:'gnmc',ramp:[[0,'#55732f'],[.5,'#7a9844'],[1,'#a6b660']],fx:['paint','blades'],sc:.8},
 llanura:{n:'Llanura dorada',lv:'gn',ramp:[[0,'#8a8a44'],[.5,'#adaa5c'],[1,'#d0c47c']],fx:['paint','blades'],sc:.8},
 bosque:{n:'Suelo de bosque',lv:'gnmc',ramp:[[0,'#24401f'],[.5,'#355a2b'],[1,'#567a3a']],fx:['paint','leaves'],sc:.8},
 selva:{n:'Selva',lv:'gn',ramp:[[0,'#163d24'],[.5,'#22573a'],[1,'#3f7a3c']],fx:['paint','leaves','blades'],sc:.8,blades:1400},
 estepa:{n:'Estepa seca',lv:'gn',ramp:[[0,'#7d6c45'],[.5,'#9c8a5a'],[1,'#bfae7c']],fx:['paint','blades','pebbles'],sc:.8,blades:900,pebbles:80},
 desierto:{n:'Desierto',lv:'gnmc',ramp:[[0,'#c39b5e'],[.5,'#dcb879'],[1,'#f0d7a0']],fx:['paint','dunes'],sc:.9,paint:600},
 tundra:{n:'Tundra',lv:'gn',ramp:[[0,'#7b8574'],[.5,'#9aa391'],[1,'#c4c8b8']],fx:['paint','snowtufts'],sc:.8},
 nieve:{n:'Nieve',lv:'gnmdc',ramp:[[0,'#c6d2e0'],[.5,'#e2e9f1'],[1,'#ffffff']],fx:['paint','sparkle'],sc:.9},
 roca:{n:'Roca',lv:'gnmdc',ramp:[[0,'#5d5953'],[.5,'#86807a'],[1,'#aca59c']],fx:['paint','cracks','pebbles'],sc:.8,pebbles:120},
 pantano:{n:'Pantano',lv:'gnmc',ramp:[[0,'#38402a'],[.5,'#4f5a35'],[1,'#6e7448']],fx:['paint','puddles'],sc:.8},
 volcanico:{n:'Tierra volcánica',lv:'gnmdc',ramp:[[0,'#1f1b1b'],[.5,'#353030'],[1,'#4f4745']],fx:['paint','glow'],sc:.8},
 campos:{n:'Campos de cultivo',lv:'nmc',gen:'fields',sc:.6},
 hielo:{n:'Hielo',lv:'nmc',ramp:[[0,'#8fb8d4'],[.5,'#b5d5ea'],[1,'#e4f3fb']],fx:['paint','cracks'],sc:.9,crackCol:'rgba(255,255,255,.55)',cracks:40},
 cesped:{n:'Césped',lv:'mc',ramp:[[0,'#4c6e2c'],[.5,'#6c9141'],[1,'#94b45a']],fx:['paint','blades','flowers'],sc:.6,blades:3600},
 tierra:{n:'Tierra',lv:'gnmdc',ramp:[[0,'#5b4330'],[.5,'#7a5c40'],[1,'#9c7c58']],fx:['paint','pebbles'],sc:.6},
 barro:{n:'Barro',lv:'mdc',ramp:[[0,'#3d2f22'],[.5,'#54412e'],[1,'#6e573e']],fx:['paint','puddles'],sc:.6},
 arena:{n:'Arena',lv:'mdc',ramp:[[0,'#b8945c'],[.5,'#d1b07a'],[1,'#ead09e']],fx:['paint','pebbles'],sc:.6,pebbles:90,peb:2.5},
 adoquin:{n:'Adoquín',lv:'mdc',gen:'cobble',ramp:[[0,'#5f5b55'],[.5,'#8c867c'],[1,'#b3ab9e']],sc:.35,G:12},
 losas:{n:'Losas',lv:'mdc',gen:'flag',ramp:[[0,'#77716a'],[.5,'#9a948a'],[1,'#bdb5a8']],fx:['cracks'],sc:.45,rows:6,cracks:18},
 mazmorra:{n:'Losas de mazmorra',lv:'d',gen:'flag',sq:1,ramp:[[0,'#4a4744'],[.5,'#625e59'],[1,'#7d7871']],mortar:'#2a2725',fx:['cracks'],sc:.5,rows:5,cracks:30},
 cueva:{n:'Piedra de cueva',lv:'d',ramp:[[0,'#3e3833'],[.5,'#58504a'],[1,'#776d63']],fx:['paint','cracks','pebbles'],sc:.6,pebbles:200},
 madera:{n:'Suelo de madera',lv:'mdc',gen:'planks',ramp:[[0,'#5b3a22'],[.5,'#86593a'],[1,'#ad7d52']],sc:.45},
 alfombra:{n:'Alfombra',lv:'mdc',gen:'carpet',ramp:[[0,'#7a2b26'],[.5,'#5c1f1d'],[1,'#a0723a']],sc:.5},
 somera:{n:'Agua poco profunda',lv:'mdc',ramp:[[0,'#2f6f86'],[.5,'#3f8ea3'],[1,'#64b2c0']],fx:['paint','caustic'],sc:.6},
 lava:{n:'Lava',lv:'gnmdc',gen:'lava',sc:.6},
 corrupto:{n:'Tierra corrupta',lv:'gnmdc',ramp:[[0,'#2a1a33'],[.5,'#46284f'],[1,'#6b3f6f']],fx:['paint','glow'],sc:.8}
};
/* Fondos (lo que queda debajo de la tierra: mar, roca, papel o lava) */
const BGS={
 mar:{n:'Mar',ramp:[[0,'#1d4a6e'],[.5,'#27618a'],[1,'#3b7ca3']],fx:['paint','waves'],sc:1,shallow:[120,200,215],deep:[12,40,66],ring:[230,245,255],ink:[25,38,52],rim:[226,206,150]},
 roca:{n:'Roca maciza',ramp:[[0,'#1e1c1d'],[.5,'#2a2829'],[1,'#3a3738']],fx:['hatch'],sc:.8,wall:1},
 pergamino:{n:'Pergamino',ramp:[[0,'#cdb88c'],[.5,'#dcc9a0'],[1,'#ecdcb9']],fx:['paint','stains'],sc:1,paper:1,ink:[70,48,28],ring:[90,62,38]},
 lava:{n:'Mar de lava',gen:'lava',sc:1.2,lavaGlow:1,ink:[30,14,10],ring:[255,170,80],shallow:[255,120,40],deep:[60,20,10]},
 vacio:{n:'Vacío astral',ramp:[[0,'#0b0a1a'],[.5,'#161433'],[1,'#26214d']],fx:['paint','sparkle'],sc:1,ring:[180,170,255],ink:[10,8,30],shallow:[90,80,200],deep:[5,4,20]}
};
const STEXC={};
function texCanvas(id,isBg){ const key=(isBg?'bg:':'')+id; if(STEXC[key]) return STEXC[key]; const d=(isBg?BGS:TEX)[id]; const R=srng(strHash(key)); const c=mkC(TXS,TXS), g=c.getContext('2d');
 if(d.gen) TGEN[d.gen](g,TXS,R,d);
 else { const N=sfbm(TXS,R,[4,8,32,96],[1,.55,.4,.3]), img=g.createImageData(TXS,TXS), L=rampLUT(d.ramp);
  for(let k=0;k<TXS*TXS;k++){ const i=Math.round(clamp(N[k]+(R()-.5)*.06,0,1)*255)*3; img.data[k*4]=L[i]; img.data[k*4+1]=L[i+1]; img.data[k*4+2]=L[i+2]; img.data[k*4+3]=255; } g.putImageData(img,0,0); }
 for(const f of d.fx||[]) TFX[f](g,TXS,R,d);
 return STEXC[key]=c; }
const THMB={};
function texThumb(id,isBg,s=96){ const key=(isBg?'bg:':'')+id+s; if(THMB[key]) return THMB[key]; const c=mkC(s,s), g=c.getContext('2d'); const d=(isBg?BGS:TEX)[id];
 g.imageSmoothingQuality='high'; const z=s/(TXS*.5*(d.sc||1)); g.scale(z,z); g.drawImage(texCanvas(id,isBg),0,0); return THMB[key]=c.toDataURL('image/jpeg',.85); }
const PATC=new WeakMap();
function texPattern(g,id,isBg){ let m=PATC.get(g); if(!m){ m={}; PATC.set(g,m); } const key=(isBg?'bg:':'')+id; if(m[key]) return m[key];
 const d=(isBg?BGS:TEX)[id]; const p=g.createPattern(texCanvas(id,isBg),'repeat'); if(p.setTransform) p.setTransform(new DOMMatrix().scale(d.sc||1)); return m[key]=p; }
