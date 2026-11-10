/* ===== Editor de mapas 2: texturas, autounión entre casillas, mazmorras y controles nuevos ===== */
LEVELS.minimo.child='mazmorra'; LEVELS.minimo.desc='Pueblos, ciudades, barrios y sectores';
LEVELS.mazmorra={name:'Mazmorra',scale:1.5,unit:'m',w:36,h:28,base:'v',child:null,desc:'Mazmorras, cuevas, criptas y guaridas'};
function childFor(lv,kind){ if(lv==='nacional'&&['mazmorra','cueva','ruina'].includes(kind)) return 'mazmorra'; return LEVELS[lv]&&LEVELS[lv].child; }
MARK.mazmorra=[['trampa','Trampa'],['tesoro','Tesoro'],['peligro','Monstruo'],['npc','PNJ'],['puerta','Entrada'],['templo','Altar'],['portal','Portal'],['punto','Punto']];
MS.ter.mazmorra='f'; MS.mk.mazmorra='trampa'; MS.ter.minimo='c';

/* Terrenos: clave, nombre, color, capa (0 agua/fosos, 1 suelo, 2 muros), textura, adorno, opciones */
const TD={};
function defT(lv,list){ TERR[lv]=list.map(a=>[a[0],a[1],a[2],a[5]||'']); TL[lv]={}; TD[lv]={};
 for(const [k,n,c,s,tex,deco,o] of list){ TL[lv][k]={name:n,c,g:deco||''}; TD[lv][k]=Object.assign({k,name:n,c,s,tex,deco:deco||null,round:true},o||{}); } }
defT('global',[['o','Océano profundo','#173556',0,'deep'],['a','Océano','#24527a',0,'water'],['c','Aguas costeras','#3f84a4',0,'shallow'],['p','Llanuras','#8aa65a',1,'grass'],['f','Bosque','#4f7d3f',1,'grassD','trees'],['j','Selva','#2f6b3a',1,'jungleG','jungle'],['h','Colinas','#9d9a5c',1,'grassY','hills'],['m','Montañas','#8a8178',1,'rock','mount'],['n','Cumbres nevadas','#dfe5ee',1,'snow','snowmount'],['d','Desierto','#d9bd7e',1,'sand','dunes'],['t','Tundra','#b2bea9',1,'tundra'],['s','Pantano','#5a6b45',1,'swamp','reeds'],['v','Tierras volcánicas','#4a3532',1,'ash','volcano']]);
defT('nacional',[['g','Pradera','#93ad5d',1,'grass'],['f','Bosque','#4e7c40',1,'grassD','trees'],['F','Bosque denso','#33603a',1,'jungleG','trees2'],['h','Colinas','#a8975c',1,'grassY','hills'],['m','Montaña','#877e75',1,'rock','mount'],['n','Nieve','#e2e6ee',1,'snow','snowmount'],['w','Lago o mar','#3a6c93',0,'water'],['r','Río','#4c86b0',1,'grass','river'],['R','Camino','#b39a6b',1,'grass','road'],['s','Pantano','#5e6c47',1,'swamp','reeds'],['k','Cultivos','#9c8350',1,'soil','crops'],['d','Desierto','#d5bc7f',1,'sand','dunes'],['x','Tierra baldía','#7c6e5e',1,'dirt','stones']]);
defT('minimo',[['g','Césped','#7ea256',1,'grass'],['e','Tierra','#8e7451',1,'dirt'],['P','Sendero','#a88d62',1,'grass','path'],['c','Adoquín','#8d8983',1,'cobble',null,{round:false}],['s','Losa','#a6a199',1,'flag',null,{round:false}],['w','Suelo de madera','#9a6a42',1,'wood',null,{round:false}],['T','Tejado','#8a3f2c',2,'roof',null,{round:false,edge:'#3b1a12'}],['W','Muro','#5b5560',2,'brick',null,{round:false}],['D','Puerta','#c08a3e',1,'flag','door',{round:false}],['t','Árbol','#3e6a36',1,'grass','tree'],['b','Arbustos','#5b8945',1,'grass','bush'],['k','Huerto','#8a7048',1,'soil','crops'],['r','Escombros','#6e665f',1,'dirt','rubble'],['A','Arena','#d6c38e',1,'sand'],['a','Agua','#4a7ea8',0,'water'],['l','Lava','#cf522a',0,'lava']]);
defT('mazmorra',[['v','Roca sólida','#2a2730',2,'hatch',null,{round:false}],['f','Piso de losas','#8d8578',1,'flag',null,{round:false}],['F','Baldosas','#9b8f7a',1,'tiles',null,{round:false,edge:'#4a3d2c'}],['b','Alfombra','#7a2430',1,'carpet',null,{round:false,edge:'#d9b25a'}],['c','Suelo de cueva','#6d6152',1,'cave'],['R','Pared de cueva','#3b352f',2,'caverock'],['W','Muro de ladrillo','#4b4550',2,'brick',null,{round:false}],['D','Puerta','#c08a3e',1,'flag','door',{round:false}],['S','Escaleras','#9a9182',1,'flag','stairs',{round:false}],['o','Columna','#b9b0a0',1,'flag','pillar',{round:false}],['r','Escombros','#6e665f',1,'flag','rubble',{round:false}],['a','Agua','#2f6a7a',0,'dwater'],['p','Foso','#0b0a0d',0,'pit'],['l','Lava','#cf522a',0,'lava']]);
const DEFK={global:['a','p','p'],nacional:['w','g','g'],minimo:['a','g','g'],mazmorra:['p','f','f']};
const DSC={global:.75,nacional:1,minimo:1,mazmorra:1};
const mrng=seed=>{ let a=seed>>>0; return ()=>{ a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; };
const hr=(x,y,i)=>hashXY(x,y,i+11)/4294967296;

/* ----- Texturas procedurales (96 px = 2 casillas, alineadas con la cuadrícula) ----- */
const TS=96, TEXC={};
function makeTex(type,col){
 const cv=document.createElement('canvas'); cv.width=cv.height=TS; const g=cv.getContext('2d'); let sd=7; for(const ch of type+col) sd=Math.imul(sd^ch.charCodeAt(0),16777619); const R=mrng(sd);
 const W9=f=>{ for(const a of [-TS,0,TS]) for(const b of [-TS,0,TS]) f(a,b); };
 const blot=(n,r0,r1,f0,f1,al)=>{ g.globalAlpha=al; for(let i=0;i<n;i++){ const x=R()*TS,y=R()*TS,r=r0+R()*(r1-r0); g.fillStyle=shade(col,f0+R()*(f1-f0)); W9((a,b)=>{ g.beginPath(); g.arc(x+a,y+b,r,0,7); g.fill(); }); } g.globalAlpha=1; };
 const speck=(n,sz,f0,f1,al,fixed)=>{ g.globalAlpha=al; for(let i=0;i<n;i++){ g.fillStyle=fixed||shade(col,f0+R()*(f1-f0)); const s=sz*(.6+R()*.8); g.fillRect(R()*TS,R()*TS,s,s); } g.globalAlpha=1; };
 const blades=(n,len,f0,f1)=>{ g.lineWidth=1.3; g.lineCap='round'; g.globalAlpha=.85; for(let i=0;i<n;i++){ const x=R()*TS,y=R()*TS,a=-Math.PI/2+(R()-.5)*1.1,l=len*(.6+R()*.7); g.strokeStyle=shade(col,f0+R()*(f1-f0)); W9((ox,oy)=>{ g.beginPath(); g.moveTo(x+ox,y+oy); g.lineTo(x+ox+Math.cos(a)*l,y+oy+Math.sin(a)*l); g.stroke(); }); } g.globalAlpha=1; };
 const cracks=(n,len,c,al,w)=>{ g.strokeStyle=c; g.globalAlpha=al; g.lineWidth=w; g.lineJoin='round'; for(let i=0;i<n;i++){ const p=new Path2D(); let x=R()*TS,y=R()*TS; p.moveTo(x,y); for(let s=0;s<5;s++){ x+=(R()-.5)*len*.7; y+=(R()-.5)*len*.7; p.lineTo(x,y); } W9((a,b)=>{ g.save(); g.translate(a,b); g.stroke(p); g.restore(); }); } g.globalAlpha=1; };
 const pebbles=n=>{ for(let i=0;i<n;i++){ const x=R()*TS,y=R()*TS,r=1.4+R()*2.4; W9((a,b)=>{ g.fillStyle='rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(x+a+.8,y+b+1,r,r*.75,0,0,7); g.fill(); g.fillStyle=shade(col,.12+R()*.15); g.beginPath(); g.ellipse(x+a,y+b,r,r*.75,0,0,7); g.fill(); }); } };
 const waves=n=>{ g.strokeStyle='rgba(255,255,255,.2)'; g.lineWidth=1.4; g.lineCap='round'; for(let i=0;i<n;i++){ const x=R()*TS,y=R()*TS,s=5+R()*5; W9((a,b)=>{ g.beginPath(); g.moveTo(x+a,y+b); g.quadraticCurveTo(x+a+s*.5,y+b-s*.35,x+a+s,y+b); g.quadraticCurveTo(x+a+s*1.5,y+b+s*.35,x+a+s*2,y+b); g.stroke(); }); } };
 const bevel=(x,y,w,h,hi,lo)=>{ g.fillStyle=`rgba(255,255,255,${hi})`; g.fillRect(x,y,w,1.5); g.fillRect(x,y,1.5,h); g.fillStyle=`rgba(0,0,0,${lo})`; g.fillRect(x,y+h-1.5,w,1.5); g.fillRect(x+w-1.5,y,1.5,h); };
 g.fillStyle=col; g.fillRect(0,0,TS,TS);
 switch(type){
  case 'grass': case 'grassD': case 'grassY': case 'jungleG': blot(14,8,20,-.08,.07,.35); blades(type==='jungleG'?340:260,5,-.3,.2); if(type==='grass') speck(8,2.2,0,0,.7,'#efe4a2'); break;
  case 'tundra': blot(16,6,18,-.06,.08,.4); blades(70,4,-.2,.1); speck(40,1.5,.3,.5,.5); break;
  case 'swamp': blot(10,6,16,-.1,.05,.4); g.fillStyle='rgba(35,55,50,.4)'; for(let i=0;i<6;i++){ const x=R()*TS,y=R()*TS,r=4+R()*8; W9((a,b)=>{ g.beginPath(); g.ellipse(x+a,y+b,r,r*.55,0,0,7); g.fill(); }); } blades(170,5,-.3,.15); break;
  case 'soil': blot(12,6,16,-.08,.06,.4); speck(170,1.6,-.3,.15,.6); break;
  case 'dirt': blot(14,6,16,-.08,.07,.4); speck(140,1.6,-.3,.2,.55); pebbles(16); break;
  case 'sand': blot(10,10,24,-.05,.06,.35); speck(260,1.2,-.18,.18,.55); g.strokeStyle='rgba(255,255,255,.18)'; g.lineWidth=1.2; for(let i=0;i<7;i++){ const x=R()*TS,y=R()*TS; W9((a,b)=>{ g.beginPath(); g.arc(x+a,y+b,9+R()*6,3.6,5.6); g.stroke(); }); } break;
  case 'snow': blot(14,8,22,-.08,.02,.35); speck(30,1.6,0,0,.95,'#ffffff'); break;
  case 'ash': blot(14,6,18,-.15,.1,.45); cracks(5,30,'#1b1210',.7,1.5); speck(14,1.8,0,0,.85,'#ff7a2a'); break;
  case 'rock': blot(16,6,18,-.12,.1,.45); cracks(6,26,shade(col,-.45),.6,1.3); cracks(3,20,shade(col,.3),.4,1); break;
  case 'cave': blot(18,6,18,-.12,.08,.45); speck(120,1.6,-.35,.2,.5); pebbles(12); cracks(3,22,shade(col,-.45),.5,1.1); break;
  case 'caverock': blot(14,10,22,-.15,.12,.5); for(let i=0;i<9;i++){ const x=R()*TS,y=R()*TS,r=6+R()*9; W9((a,b)=>{ g.fillStyle='rgba(0,0,0,.25)'; g.beginPath(); g.arc(x+a+2,y+b+2,r,0,7); g.fill(); g.fillStyle=shade(col,.05+R()*.1); g.beginPath(); g.arc(x+a,y+b,r,0,7); g.fill(); g.fillStyle='rgba(255,255,255,.08)'; g.beginPath(); g.arc(x+a-r*.3,y+b-r*.3,r*.5,0,7); g.fill(); }); } cracks(4,22,shade(col,-.5),.6,1.2); break;
  case 'water': case 'deep': case 'shallow': case 'dwater': blot(10,14,30,-.1,.08,.35); waves(type==='deep'?8:type==='dwater'?10:16); break;
  case 'lava': g.fillStyle=shade(col,-.55); g.fillRect(0,0,TS,TS); blot(10,8,20,-.65,-.35,.6); g.shadowColor='#ff9a3c'; g.shadowBlur=8; cracks(9,40,'#ff7b2a',.95,2.4); cracks(6,30,'#ffd27a',.9,1.2); g.shadowBlur=0; break;
  case 'pit': speck(40,2,.1,.3,.25); break;
  case 'hatch': g.fillStyle=shade(col,-.25); g.fillRect(0,0,TS,TS); blot(10,8,18,-.1,.1,.4); g.lineWidth=1.1; g.lineCap='round'; g.strokeStyle=shade(col,.38); g.globalAlpha=.55;
   for(let i=0;i<40;i++){ const x=R()*TS,y=R()*TS,an=R()*Math.PI,l=6+R()*5,c=Math.cos(an),s=Math.sin(an); W9((a,b)=>{ g.beginPath(); for(let j=-1.5;j<=1.5;j++){ const ox=-s*j*2.6,oy=c*j*2.6; g.moveTo(x+a+ox-c*l/2,y+b+oy-s*l/2); g.lineTo(x+a+ox+c*l/2,y+b+oy+s*l/2); } g.stroke(); }); } g.globalAlpha=1; break;
  case 'flag': { g.fillStyle=shade(col,-.5); g.fillRect(0,0,TS,TS); const H=TS/2; for(let cy=0;cy<2;cy++) for(let cx=0;cx<2;cx++){ const sp=R(); const rs=sp<.3?[[0,0,1,1]]:sp<.55?[[0,0,1,.5],[0,.5,1,.5]]:sp<.8?[[0,0,.5,1],[.5,0,.5,1]]:[[0,0,.5,.5],[.5,0,.5,.5],[0,.5,.5,.5],[.5,.5,.5,.5]];
    for(const r of rs){ const x=cx*H+r[0]*H+1.5,y=cy*H+r[1]*H+1.5,w=r[2]*H-3,h=r[3]*H-3; g.fillStyle=shade(col,(R()-.5)*.24); g.beginPath(); g.roundRect?g.roundRect(x,y,w,h,2.5):g.rect(x,y,w,h); g.fill(); bevel(x,y,w,h,.13,.25);
     g.globalAlpha=.4; for(let i=0;i<10;i++){ g.fillStyle=shade(col,(R()-.5)*.5); g.fillRect(x+R()*w,y+R()*h,1.4,1.4); } g.globalAlpha=1;
     if(R()<.25){ g.strokeStyle='rgba(0,0,0,.35)'; g.lineWidth=1; g.beginPath(); g.moveTo(x+R()*w,y+1); g.lineTo(x+R()*w,y+h*.5); g.lineTo(x+R()*w,y+h-1); g.stroke(); } } } break; }
  case 'tiles': { g.fillStyle=shade(col,-.5); g.fillRect(0,0,TS,TS); for(let j=0;j<4;j++) for(let i=0;i<4;i++){ const x=i*24,y=j*24, lt=(i+j)%2===0; g.fillStyle=lt?shade(col,.06+(R()-.5)*.06):shade(col,-.3+(R()-.5)*.06); g.fillRect(x+1,y+1,22,22); bevel(x+1,y+1,22,22,.14,.25);
    if(lt){ g.fillStyle='rgba(200,165,90,.55)'; g.save(); g.translate(x+12,y+12); g.rotate(Math.PI/4); g.fillRect(-3,-3,6,6); g.restore(); } } break; }
  case 'wood': for(let r=0;r<8;r++){ const y=r*12; g.fillStyle=shade(col,(R()-.5)*.2); g.fillRect(0,y,TS,12); g.strokeStyle='rgba(0,0,0,.22)'; g.lineWidth=.8; for(let k=0;k<3;k++){ const yy=y+2+R()*8; g.beginPath(); g.moveTo(0,yy); g.bezierCurveTo(30,yy+(R()-.5)*3,60,yy+(R()-.5)*3,TS,yy); g.stroke(); }
    g.fillStyle='rgba(0,0,0,.45)'; g.fillRect(0,y+11,TS,1.2); g.fillStyle='rgba(255,255,255,.1)'; g.fillRect(0,y,TS,1); for(let k=0;k<2;k++){ const x=(R()*TS)|0; g.fillStyle='rgba(0,0,0,.5)'; g.fillRect(x,y,1.4,12); g.fillStyle='rgba(30,20,10,.7)'; g.fillRect(x+3,y+3,1.6,1.6); g.fillRect(x+3,y+8,1.6,1.6); } } break;
  case 'roof': for(let r=0;r<8;r++){ const y=r*12, off=(r%2)*6; for(let i=-1;i<9;i++){ const x=i*12+off; g.fillStyle=shade(col,(R()-.5)*.24); g.fillRect(x+.5,y,11,12); g.fillStyle='rgba(0,0,0,.35)'; g.fillRect(x+.5,y+10,11,2); g.fillStyle='rgba(255,255,255,.12)'; g.fillRect(x+.5,y,11,1); g.fillStyle='rgba(0,0,0,.25)'; g.fillRect(x+11,y,1,12); } } break;
  case 'brick': g.fillStyle=shade(col,-.45); g.fillRect(0,0,TS,TS); for(let r=0;r<8;r++){ const y=r*12, off=(r%2)*12; for(let i=-1;i<5;i++){ const x=i*24+off; g.fillStyle=shade(col,(R()-.5)*.22); g.fillRect(x+1.5,y+1.5,21,9); bevel(x+1.5,y+1.5,21,9,.12,.3); } } break;
  case 'cobble': g.fillStyle=shade(col,-.5); g.fillRect(0,0,TS,TS); for(let j=0;j<8;j++) for(let i=0;i<8;i++){ const x=i*12+6+(R()-.5)*3+(j%2)*3,y=j*12+6+(R()-.5)*3,rx=4.8+R()*1.2,ry=4.2+R()*1.2,c=shade(col,(R()-.5)*.28);
    W9((a,b)=>{ g.fillStyle=c; g.beginPath(); g.ellipse(x+a,y+b,rx,ry,R()*.6,0,7); g.fill(); g.fillStyle='rgba(255,255,255,.16)'; g.beginPath(); g.ellipse(x+a-1.4,y+b-1.4,rx*.5,ry*.4,0,0,7); g.fill(); }); } break;
  case 'carpet': g.strokeStyle=shade(col,.22); g.lineWidth=1.2; g.globalAlpha=.6; for(let i=-4;i<8;i++){ g.beginPath(); g.moveTo(i*24,0); g.lineTo(i*24+TS,TS); g.moveTo(i*24+TS,0); g.lineTo(i*24,TS); g.stroke(); } g.globalAlpha=1; g.fillStyle='#d9b25a'; for(let j=0;j<4;j++) for(let i=0;i<4;i++){ g.beginPath(); g.arc(i*24+12,j*24+12,1.6,0,7); g.fill(); } speck(60,1.2,-.2,.1,.4); break;
 }
 return cv;
}
function texOf(lv,key){ const d=TD[lv][key]||TD[lv][LEVELS[lv].base]; const id=lv+':'+d.k; return TEXC[id]||(TEXC[id]=makeTex(d.tex,d.c)); }

/* ----- Adornos ----- */
function treeD(g,x,y,r,col){ g.fillStyle='rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(x+r*.35,y+r*.5,r*1.02,r*.82,0,0,7); g.fill();
 g.fillStyle=shade(col,-.38); g.beginPath(); g.arc(x,y,r,0,7); g.fill(); g.fillStyle=col; g.beginPath(); g.arc(x-r*.16,y-r*.2,r*.8,0,7); g.fill();
 g.fillStyle=shade(col,.2); g.beginPath(); g.arc(x-r*.34,y-r*.4,r*.4,0,7); g.fill(); g.fillStyle='rgba(255,255,255,.12)'; g.beginPath(); g.arc(x-r*.42,y-r*.5,r*.16,0,7); g.fill(); }
function peakD(g,cx,by,w,h,col,snow){ g.fillStyle='rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(cx+w*.12,by,w*.58,w*.16,0,0,7); g.fill();
 g.fillStyle=shade(col,.2); g.beginPath(); g.moveTo(cx-w/2,by); g.lineTo(cx,by-h); g.lineTo(cx+w*.06,by); g.closePath(); g.fill();
 g.fillStyle=shade(col,-.3); g.beginPath(); g.moveTo(cx+w*.06,by); g.lineTo(cx,by-h); g.lineTo(cx+w/2,by); g.closePath(); g.fill();
 g.strokeStyle=shade(col,-.45); g.lineWidth=1.2; g.beginPath(); g.moveTo(cx,by-h); g.lineTo(cx-w*.12,by-h*.55); g.moveTo(cx+w*.02,by-h*.7); g.lineTo(cx+w*.18,by-h*.35); g.stroke();
 if(snow>0){ const sh=h*snow; g.fillStyle='#f4f6fa'; g.beginPath(); g.moveTo(cx,by-h); g.lineTo(cx-w/2*snow,by-h+sh); g.lineTo(cx-w*.12*snow,by-h+sh*.78); g.lineTo(cx+w*.04,by-h+sh*1.05); g.lineTo(cx+w*.06*snow,by-h+sh*.82); g.closePath(); g.fill();
  g.fillStyle='#c5cfde'; g.beginPath(); g.moveTo(cx,by-h); g.lineTo(cx+w*.06*snow,by-h+sh*.82); g.lineTo(cx+w/2*snow,by-h+sh); g.closePath(); g.fill(); } }
function moundD(g,cx,by,rw,rh,col){ g.fillStyle='rgba(0,0,0,.22)'; g.beginPath(); g.ellipse(cx+rw*.15,by+1,rw*1.05,rh*.35,0,0,7); g.fill(); g.fillStyle=shade(col,.08); g.beginPath(); g.ellipse(cx,by,rw,rh,0,Math.PI,0); g.fill();
 g.fillStyle=shade(col,-.2); g.beginPath(); g.ellipse(cx,by,rw,rh,0,Math.PI*1.5,0); g.lineTo(cx,by); g.fill(); g.strokeStyle=shade(col,.32); g.lineWidth=1.5; g.beginPath(); g.ellipse(cx,by,rw*.8,rh*.8,0,Math.PI*1.08,Math.PI*1.42); g.stroke(); }
function rockD(g,x,y,r,col,R){ g.fillStyle='rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(x+r*.3,y+r*.45,r,r*.7,0,0,7); g.fill(); g.fillStyle=col; g.beginPath(); for(let i=0;i<6;i++){ const a=i/6*6.283, rr=r*(.75+R(i)*.4); i?g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr*.8):g.moveTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr*.8); } g.closePath(); g.fill(); g.fillStyle='rgba(255,255,255,.18)'; g.beginPath(); g.arc(x-r*.25,y-r*.25,r*.35,0,7); g.fill(); }

/* ----- Renderizado de un área: capas con bordes redondeados, sombras, costas y adornos conectados ----- */
const CORN=[[0,0,1,1,-1,-1],[1,0,-1,1,1,-1],[0,1,1,-1,-1,1],[1,1,-1,-1,1,1]];
function filP(g,px,py,dx,dy,r){ g.moveTo(px,py); g.lineTo(px+dx*r,py); g.quadraticCurveTo(px,py,px,py+dy*r); g.closePath(); }
function renderArea(m,rx0,ry0,rx1,ry1){
 const lv=m.level, D=TD[lv], base=LEVELS[lv].base, W=m.w, H=m.h, RW=rx1-rx0, RH=ry1-ry0, ox=rx0*C, oy=ry0*C, def=DEFK[lv], sc=DSC[lv];
 const key=(x,y)=>{ x=x<0?0:x>=W?W-1:x; y=y<0?0:y>=H?H-1:y; const k=m.t[y*W+x]; return D[k]?k:base; };
 const under=(k,x,y)=>{ const cnt={}; let best=null,bn=0; for(let j=-1;j<=1;j++) for(let i=-1;i<=1;i++){ if(!i&&!j) continue; const q=key(x+i,y+j); if(D[q].s!==k) continue; const n=(cnt[q]=(cnt[q]||0)+(i&&j?1:2)); if(n>bn){ bn=n; best=q; } } return best||def[k]; };
 const memo=[new Map(),new Map(),new Map()];
 const lt=(k,x,y)=>{ const id=(y+4)*8192+x+4, mm=memo[k]; if(mm.has(id)) return mm.get(id); const q=key(x,y), s=D[q].s; const v=k===0?(s===0?q:under(0,x,y)):(s<k?null:s===k?q:under(k,x,y)); mm.set(id,v); return v; };
 const rnd=q=>D[q]&&D[q].round!==false;
 const mk=()=>{ const c=document.createElement('canvas'); c.width=Math.max(1,RW*C); c.height=Math.max(1,RH*C); return c; };
 const f=mk(), L=[mk(),null,null];
 for(let k=0;k<3;k++){
  let any=k===0; if(!any){ outer: for(let y=ry0;y<ry1;y++) for(let x=rx0;x<rx1;x++) if(D[key(x,y)].s>=k){ any=true; break outer; } } if(!any) continue;
  if(k) L[k]=mk(); const g=L[k].getContext('2d'), pats={};
  const P=q=>{ let p=pats[q]; if(!p){ p=g.createPattern(texOf(lv,q),'repeat'); try{ p.setTransform(new DOMMatrix([1,0,0,1,-ox,-oy])); }catch(e){} pats[q]=p; } return p; };
  for(let y=ry0;y<ry1;y++) for(let x=rx0;x<rx1;x++){ const T=lt(k,x,y); if(T==null) continue; g.fillStyle=P(T); g.fillRect(x*C-ox,y*C-oy,C,C); }
  for(let y=ry0;y<ry1;y++) for(let x=rx0;x<rx1;x++){ const T=lt(k,x,y); if(T==null||!rnd(T)) continue; const px=x*C-ox, py=y*C-oy;
   for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const U=lt(k,x+dx,y+dy); if(U==null||U===T||!rnd(U)) continue; g.fillStyle=P(U);
    for(const [wd,al] of [[.22,.28],[.12,.4]]){ g.globalAlpha=al; const w=C*wd; if(dx>0) g.fillRect(px+C-w,py,w,C); else if(dx<0) g.fillRect(px,py,w,C); else if(dy>0) g.fillRect(px,py+C-w,C,w); else g.fillRect(px,py,C,w); } g.globalAlpha=1; } }
  for(let y=ry0;y<ry1;y++) for(let x=rx0;x<rx1;x++){ const T=lt(k,x,y); if(T==null) continue;
   for(const c of CORN){ const a=lt(k,x+c[4],y), b=lt(k,x,y+c[5]); if(a==null||a!==b||a===T) continue; if(lt(k,x+c[4],y+c[5])===T||!rnd(a)||!rnd(T)) continue; g.fillStyle=P(a); g.beginPath(); filP(g,(x+c[0])*C-ox,(y+c[1])*C-oy,c[2],c[3],C*.42); g.fill(); } }
  if(k>0){
   for(let y=ry0;y<ry1;y++) for(let x=rx0;x<rx1;x++){ if(lt(k,x,y)!=null) continue;
    for(const c of CORN){ const a=lt(k,x+c[4],y), b=lt(k,x,y+c[5]); if(a==null||b==null||lt(k,x+c[4],y+c[5])==null||!rnd(a)||!rnd(b)) continue; g.fillStyle=P(a); g.beginPath(); filP(g,(x+c[0])*C-ox,(y+c[1])*C-oy,c[2],c[3],C*.5); g.fill(); } }
   g.globalCompositeOperation='destination-out'; g.fillStyle='#000';
   for(let y=ry0;y<ry1;y++) for(let x=rx0;x<rx1;x++){ const T=lt(k,x,y); if(T==null||!rnd(T)) continue;
    for(const c of CORN){ if(lt(k,x+c[4],y)!=null||lt(k,x,y+c[5])!=null||lt(k,x+c[4],y+c[5])!=null) continue; g.beginPath(); filP(g,(x+c[0])*C-ox,(y+c[1])*C-oy,c[2],c[3],C*.5); g.fill(); } }
   g.globalCompositeOperation='source-over'; }
 }
 const g=f.getContext('2d'); g.drawImage(L[0],0,0); const dung=lv==='mazmorra';
 if(L[1]){ g.save(); g.shadowColor=dung?'rgba(0,0,0,.85)':'rgba(232,246,255,.75)'; g.shadowBlur=dung?14:8; g.drawImage(L[1],0,0); g.restore(); g.save(); g.shadowColor='rgba(0,0,0,.4)'; g.shadowBlur=6; g.shadowOffsetY=3; g.drawImage(L[1],0,0); g.restore(); }
 if(L[2]){ g.save(); g.shadowColor='rgba(0,0,0,.62)'; g.shadowBlur=18; g.shadowOffsetY=6; g.drawImage(L[2],0,0); g.restore();
  if(dung||lv==='minimo'){ g.save(); g.shadowColor='#0d0b10'; for(const [a,b] of [[3,0],[-3,0],[0,3],[0,-3]]){ g.shadowOffsetX=a; g.shadowOffsetY=b; g.drawImage(L[2],0,0); } g.restore(); }
  g.drawImage(L[2],0,0); }
 /* bordes de terrenos que se unifican (alfombras, tejados, baldosas) */
 const e=Math.max(3,C*.07);
 for(let y=ry0;y<ry1;y++) for(let x=rx0;x<rx1;x++){ const q=key(x,y), d=D[q]; if(!d.edge) continue; const px=x*C-ox, py=y*C-oy; g.fillStyle=d.edge;
  if(key(x-1,y)!==q) g.fillRect(px,py,e,C); if(key(x+1,y)!==q) g.fillRect(px+C-e,py,e,C); if(key(x,y-1)!==q) g.fillRect(px,py,C,e); if(key(x,y+1)!==q) g.fillRect(px,py+C-e,C,e); }
 /* caminos, ríos y senderos que se conectan solos */
 const conn={road:n=>D[n].deco==='road',river:n=>D[n].deco==='river'||D[n].s===0,path:n=>D[n].deco==='path'||D[n].deco==='door'||D[n].tex==='cobble'};
 const segs={road:[],river:[],path:[]};
 for(let y=ry0-1;y<ry1+1;y++) for(let x=rx0-1;x<rx1+1;x++){ if(x<0||y<0||x>=W||y>=H) continue; const d=D[key(x,y)]; const t=d.deco; if(!segs[t]) continue; const ok=conn[t], px=x*C-ox, py=y*C-oy;
  const cx=px+C*(.5+(hr(x,y,1)-.5)*.22), cy=py+C*(.5+(hr(x,y,2)-.5)*.22); const pts=[]; let inMapN=0;
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+dx, ny=y+dy; if(nx<0||ny<0||nx>=W||ny>=H) continue; if(ok(key(nx,ny))){ inMapN++; const toC=t==='river'&&D[key(nx,ny)].s===0; pts.push([px+C/2+dx*C*(toC?1:.5),py+C/2+dy*C*(toC?1:.5)]); } }
  for(const [dx,dy] of [[1,1],[1,-1],[-1,1],[-1,-1]]){ const nx=x+dx, ny=y+dy; if(nx<0||ny<0||nx>=W||ny>=H) continue; if(ok(key(nx,ny))&&!ok(key(x+dx,y))&&!ok(key(x,y+dy))){ inMapN++; pts.push([px+C/2+dx*C/2,py+C/2+dy*C/2]); } }
  if(inMapN<=1) for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+dx, ny=y+dy; if(nx<0||ny<0||nx>=W||ny>=H) pts.push([px+C/2+dx*C*.6,py+C/2+dy*C*.6]); }
  if(!pts.length) pts.push([cx+.1,cy]); for(const p of pts) segs[t].push([cx,cy,p[0],p[1]]); }
 const stroke=(arr,w,col,dash)=>{ if(!arr.length) return; g.save(); g.lineCap='round'; g.lineJoin='round'; g.strokeStyle=col; g.lineWidth=w; if(dash) g.setLineDash(dash); g.beginPath(); for(const s of arr){ g.moveTo(s[0],s[1]); g.lineTo(s[2],s[3]); } g.stroke(); g.restore(); };
 stroke(segs.river,C*.56,'rgba(96,82,55,.6)'); stroke(segs.river,C*.42,'#3b77a6'); stroke(segs.river,C*.14,'rgba(170,215,240,.45)');
 stroke(segs.road,C*.4,'rgba(60,45,30,.55)'); stroke(segs.road,C*.3,'#bba274'); stroke(segs.road,1.4,'rgba(90,70,45,.45)',[4,6]);
 stroke(segs.path,C*.42,'rgba(70,55,35,.3)'); stroke(segs.path,C*.32,'#b39a6e');
 /* adornos planos */
 const wall=n=>D[n].s===2;
 for(let y=ry0;y<ry1;y++) for(let x=rx0;x<rx1;x++){ const q=key(x,y), d=D[q], t=d.deco; if(!t) continue; const px=x*C-ox, py=y*C-oy, R=i=>hr(x,y,i);
  if(t==='crops'){ const o=hashXY(x>>1,y>>1,3)%2; g.save(); g.beginPath(); g.rect(px,py,C,C); g.clip(); g.strokeStyle='rgba(98,132,56,.85)'; g.lineWidth=C/13; g.beginPath();
    for(let i=0;i<6;i++){ const v=(i+.5)*C/6; if(o){ g.moveTo(px+v,py); g.lineTo(px+v,py+C); } else { g.moveTo(px,py+v); g.lineTo(px+C,py+v); } } g.stroke(); g.restore();
    g.fillStyle='rgba(48,68,32,.85)'; const pid=(a,b)=>hashXY(a>>1,b>>1,3); for(const [dx,dy] of [[1,0],[0,1]]){ const n=key(x+dx,y+dy); if(D[n].deco==='crops'&&pid(x+dx,y+dy)!==pid(x,y)){ if(dx) g.fillRect(px+C-1.5,py,3,C); else g.fillRect(px,py+C-1.5,C,3); } } }
  else if(t==='dunes'){ for(let i=0;i<2;i++){ const cx=px+C*(.3+.45*R(i)), cy=py+C*(.3+.45*R(i+3)), r=C*.28*sc; g.fillStyle=shade(d.c,.14); g.beginPath(); g.arc(cx,cy,r,Math.PI*1.1,Math.PI*1.9); g.arc(cx,cy+r*.35,r*.9,Math.PI*1.85,Math.PI*1.15,true); g.fill(); g.strokeStyle=shade(d.c,-.22); g.lineWidth=1.4; g.beginPath(); g.arc(cx,cy,r,Math.PI*1.1,Math.PI*1.9); g.stroke(); } }
  else if(t==='reeds'){ g.fillStyle='rgba(38,58,52,.5)'; g.beginPath(); g.ellipse(px+C*(.3+.4*R(1)),py+C*(.35+.3*R(2)),C*.18,C*.09,0,0,7); g.fill(); g.strokeStyle='#3b5a2b'; g.lineWidth=1.3;
    for(let i=0;i<4;i++){ const bx=px+C*(.15+.7*R(i+4)), by=py+C*(.3+.6*R(i+8)); g.beginPath(); for(let k=-2;k<=2;k++){ g.moveTo(bx,by); g.lineTo(bx+k*2.4,by-C*.16*sc); } g.stroke(); } }
  else if(t==='stones'){ for(let i=0;i<4;i++) rockD(g,px+C*(.15+.7*R(i)),py+C*(.15+.7*R(i+4)),C*.06,shade(d.c,-.1+R(i+8)*.3),k=>R(k+i*7)); }
  else if(t==='rubble'){ for(let i=0;i<6;i++) rockD(g,px+C*(.12+.76*R(i)),py+C*(.12+.76*R(i+6)),C*(.05+.06*R(i+12)),shade('#7a736b',(R(i+18)-.5)*.3),k=>R(k+i*5)); }
  else if(t==='door'){ const lw=wall(key(x-1,y)), rw=wall(key(x+1,y)), uw=wall(key(x,y-1)), dw=wall(key(x,y+1)); const hz=(lw&&rw)||(!(uw&&dw)&&(lw||rw));
    g.save(); g.translate(px+C/2,py+C/2); if(!hz) g.rotate(Math.PI/2); g.fillStyle='rgba(0,0,0,.35)'; g.fillRect(-C/2,-C*.17,C,C*.34);
    g.fillStyle='#4a4550'; g.fillRect(-C/2,-C*.16,C*.13,C*.32); g.fillRect(C/2-C*.13,-C*.16,C*.13,C*.32);
    g.fillStyle='#8a5a2b'; g.fillRect(-C*.37,-C*.1,C*.74,C*.2); g.strokeStyle='#2a1a0c'; g.lineWidth=1.5; g.strokeRect(-C*.37,-C*.1,C*.74,C*.2);
    g.strokeStyle='rgba(30,18,8,.6)'; g.lineWidth=1; g.beginPath(); for(let i=1;i<5;i++){ g.moveTo(-C*.37+i*C*.148,-C*.1); g.lineTo(-C*.37+i*C*.148,C*.1); } g.stroke();
    g.fillStyle='#e8c35a'; g.beginPath(); g.arc(C*.22,0,C*.035,0,7); g.fill(); g.restore(); }
  else if(t==='stairs'){ let ang=0; const dirs=[[0,-1,0],[1,0,Math.PI/2],[0,1,Math.PI],[-1,0,-Math.PI/2]]; for(const [dx,dy,a] of dirs){ const n=D[key(x+dx,y+dy)]; if(n.s===1&&n.deco!=='stairs'){ ang=a; break; } }
    g.save(); g.translate(px+C/2,py+C/2); g.rotate(ang); for(let i=0;i<6;i++){ const yy=-C/2+i*C/6; g.fillStyle=shade('#a49a8a',-i*.12); g.fillRect(-C*.42,yy+.5,C*.84,C/6-1.5); g.fillStyle='rgba(255,255,255,.18)'; g.fillRect(-C*.42,yy+.5,C*.84,1.2); }
    g.fillStyle='#3a3540'; g.fillRect(-C/2,-C/2,C*.08,C); g.fillRect(C/2-C*.08,-C/2,C*.08,C); g.restore(); }
 }
 /* adornos altos, de arriba hacia abajo para que se superpongan bien */
 for(let y=ry0;y<ry1;y++) for(let x=rx0;x<rx1;x++){ const q=key(x,y), d=D[q], t=d.deco; if(!t) continue; const px=x*C-ox, py=y*C-oy, R=i=>hr(x,y,i);
  if(t==='trees'||t==='trees2'||t==='jungle'){ const n=t==='trees'?3:t==='trees2'?4:5, base2=t==='trees'?'#3f6e37':t==='trees2'?'#2c5531':'#2d6a3a'; const arr=[];
    for(let i=0;i<n;i++) arr.push([px+C*(.12+.76*R(i)),py+C*(.12+.76*R(i+5)),C*(t==='jungle'?.2:.24+.08*R(i+9))*sc,shade(base2,(R(i+13)-.5)*.2)]);
    arr.sort((a,b)=>a[1]-b[1]).forEach(a=>treeD(g,a[0],a[1],a[2],a[3])); }
  else if(t==='tree') treeD(g,px+C*(.5+(R(1)-.5)*.15),py+C*(.48+(R(2)-.5)*.15),C*.46,shade('#3e6a36',(R(3)-.5)*.16));
  else if(t==='bush'){ for(let i=0;i<3;i++) treeD(g,px+C*(.25+.5*R(i)),py+C*(.3+.45*R(i+3)),C*.17,shade('#5b8945',(R(i+6)-.5)*.2)); }
  else if(t==='mount'||t==='snowmount'){ const snow=t==='snowmount'?.48:(R(4)<.35?.22:0); if(R(5)>.5) peakD(g,px+C*(.2+.15*R(6)),py+C*.8,C*.8*sc,C*.62*sc,shade(d.c,-.06),snow*.8);
    peakD(g,px+C*(.5+(R(1)-.5)*.25),py+C*.95,C*1.15*sc,C*.95*sc,d.c,snow); }
  else if(t==='hills'){ moundD(g,px+C*(.32+.1*R(1)),py+C*.62,C*.32*sc,C*.24*sc,'#8f9a55'); moundD(g,px+C*(.66+.1*R(2)),py+C*.84,C*.28*sc,C*.2*sc,'#8f9a55'); }
  else if(t==='volcano'){ if(R(1)<.34){ peakD(g,px+C*.5,py+C*.95,C*1.2*sc,C*.85*sc,'#3a2a28',0); const cx=px+C*.5, cy=py+C*.95-C*.85*sc; const gr=g.createRadialGradient(cx,cy,0,cx,cy,C*.3*sc); gr.addColorStop(0,'#ffd27a'); gr.addColorStop(.4,'#f0582a'); gr.addColorStop(1,'rgba(240,88,42,0)'); g.fillStyle=gr; g.beginPath(); g.arc(cx,cy,C*.3*sc,0,7); g.fill(); }
    else moundD(g,px+C*.5,py+C*.7,C*.3*sc,C*.2*sc,'#4a3532'); }
  else if(t==='pillar'){ const cx=px+C/2, cy=py+C/2; g.fillStyle='rgba(0,0,0,.42)'; g.beginPath(); g.ellipse(cx+C*.08,cy+C*.1,C*.34,C*.3,0,0,7); g.fill(); g.fillStyle='#6e6860'; g.fillRect(cx-C*.32,cy-C*.32,C*.64,C*.64); g.fillStyle='rgba(255,255,255,.14)'; g.fillRect(cx-C*.32,cy-C*.32,C*.64,2);
    const gr=g.createRadialGradient(cx-C*.1,cy-C*.1,C*.02,cx,cy,C*.28); gr.addColorStop(0,'#ece4d4'); gr.addColorStop(1,'#857c6e'); g.fillStyle=gr; g.beginPath(); g.arc(cx,cy,C*.26,0,7); g.fill(); g.strokeStyle='rgba(0,0,0,.35)'; g.lineWidth=1.4; g.stroke(); }
 }
 return f;
}

/* ----- Integración con el editor: render incremental por zonas ----- */
let mapDirty=null;
function markDirty(x0,y0,x1,y1){ mapDirty=mapDirty?{x0:Math.min(mapDirty.x0,x0),y0:Math.min(mapDirty.y0,y0),x1:Math.max(mapDirty.x1,x1),y1:Math.max(mapDirty.y1,y1)}:{x0,y0,x1,y1}; if(!Ed.flushRaf) Ed.flushRaf=requestAnimationFrame(flushDirty); }
function flushDirty(){ Ed.flushRaf=0; const d=mapDirty; mapDirty=null; if(!d||!Ed.map||!Ed.terrC) return; paintArea(Ed.map,d.x0-1,d.y0-1,d.x1+1,d.y1+1); requestDraw(); }
function paintArea(m,cx0,cy0,cx1,cy1){ cx0=clamp(cx0,0,m.w); cy0=clamp(cy0,0,m.h); cx1=clamp(cx1,0,m.w); cy1=clamp(cy1,0,m.h); if(cx1<=cx0||cy1<=cy0) return;
 const rx0=Math.max(0,cx0-2), ry0=Math.max(0,cy0-2), rx1=Math.min(m.w,cx1+2), ry1=Math.min(m.h,cy1+2); const f=renderArea(m,rx0,ry0,rx1,ry1), q=Ed.q||1, g=Ed.terrC.getContext('2d');
 const sx=(cx0-rx0)*C, sy=(cy0-ry0)*C, w=(cx1-cx0)*C, h=(cy1-cy0)*C; g.clearRect(cx0*C*q,cy0*C*q,w*q,h*q); g.drawImage(f,sx,sy,w,h,cx0*C*q,cy0*C*q,w*q,h*q); }
rebuildTerrain=function(){ const m=Ed.map; if(!m) return; Ed.terrC=Ed.terrC||document.createElement('canvas'); const MW=m.w*C, MH=m.h*C; Ed.q=Math.min(1,Math.sqrt(15e6/(MW*MH)));
 Ed.terrC.width=Math.round(MW*Ed.q); Ed.terrC.height=Math.round(MH*Ed.q); const T=28; for(let y=0;y<m.h;y+=T) for(let x=0;x<m.w;x+=T) paintArea(m,x,y,x+T,y+T); };
function brushCells(cx,cy,n){ const o=Math.floor((n-1)/2), out=[], r2=(n/2)*(n/2)+.15; for(let j=0;j<n;j++) for(let i=0;i<n;i++){ const dx=i-(n-1)/2, dy=j-(n-1)/2; if(n>2&&dx*dx+dy*dy>r2) continue; out.push([cx-o+i,cy-o+j]); } return out; }
setCells=function(layer,cx,cy,ch,size){ const m=Ed.map; const s=m[layer].split(''); let any=false, x0=1e9,y0=1e9,x1=-1,y1=-1;
 for(const [x,y] of brushCells(cx,cy,size)){ if(x<0||y<0||x>=m.w||y>=m.h) continue; const k=y*m.w+x; if(s[k]!==ch){ s[k]=ch; any=true; x0=Math.min(x0,x); y0=Math.min(y0,y); x1=Math.max(x1,x+1); y1=Math.max(y1,y+1); } }
 if(!any) return; m[layer]=s.join(''); if(layer==='t') markDirty(x0,y0,x1,y1); else { rebuildRegions(); requestDraw(); } };
function fillRectCells(a,b,ch,outline){ const m=Ed.map, x0=clamp(Math.min(a.x,b.x),0,m.w-1), x1=clamp(Math.max(a.x,b.x),0,m.w-1), y0=clamp(Math.min(a.y,b.y),0,m.h-1), y1=clamp(Math.max(a.y,b.y),0,m.h-1); const s=m.t.split('');
 for(let y=y0;y<=y1;y++) for(let x=x0;x<=x1;x++){ if(outline&&x>x0&&x<x1&&y>y0&&y<y1) continue; s[y*m.w+x]=ch; } m.t=s.join(''); markDirty(x0,y0,x1+1,y1+1); }
flood=function(cx,cy,ch){ const m=Ed.map, w=m.w, s=m.t.split(''), from=s[cy*w+cx]; if(from===ch) return; const st=[cy*w+cx]; let n=0;
 while(st.length){ const k=st.pop(); if(s[k]!==from) continue; s[k]=ch; n++; const x=k%w,y=(k/w)|0; if(x>0) st.push(k-1); if(x<w-1) st.push(k+1); if(y>0) st.push(k-w); if(y<m.h-1) st.push(k+w); }
 m.t=s.join(''); rebuildTerrain(); requestDraw(); };
const snapMap=()=>{ const m=Ed.map; return {t:m.t,r:m.r,labels:clone(m.labels||[]),markers:clone(m.markers||[])}; };
pushUndo=function(){ Ed.undo.push(snapMap()); if(Ed.undo.length>60) Ed.undo.shift(); Ed.redo=[]; };
doUndo=function(){ const u=Ed.undo.pop(); if(!u){ toast('No hay nada que deshacer.'); return; } (Ed.redo=Ed.redo||[]).push(snapMap()); Object.assign(Ed.map,u); rebuildTerrain(); rebuildRegions(); saveMap(); requestDraw(); };
function doRedo(){ const r=(Ed.redo||[]).pop(); if(!r){ toast('No hay nada que rehacer.'); return; } Ed.undo.push(snapMap()); Object.assign(Ed.map,r); rebuildTerrain(); rebuildRegions(); saveMap(); requestDraw(); }
const curKey=()=>{ const lv=Ed.map?Ed.map.level:MS.level; let k=MS.ter[lv]; if(!TD[lv][k]) k=MS.ter[lv]=TERR[lv].find(t=>t[0]!==LEVELS[lv].base)[0]; return k; };

/* ----- Generadores: mazmorra y pueblo ----- */
function genDungeon(m,seed){ const w=m.w,h=m.h,R=mrng(seed),ri=(a,b)=>a+Math.floor(R()*(b-a+1)); const g=new Array(w*h).fill('v'); const ok=(x,y)=>x>0&&y>0&&x<w-1&&y<h-1;
 const set=(x,y,c)=>{ if(ok(x,y)) g[y*w+x]=c; }, get=(x,y)=>ok(x,y)?g[y*w+x]:'#';
 const rooms=[], want=Math.max(4,Math.round(w*h/95));
 for(let t=0;t<300&&rooms.length<want;t++){ const rw=ri(4,Math.min(9,w-4)),rh=ri(4,Math.min(7,h-4)),x=ri(1,w-rw-2),y=ri(1,h-rh-2); if(rooms.some(r=>x<r.x+r.w+2&&x+rw+2>r.x&&y<r.y+r.h+2&&y+rh+2>r.y)) continue; rooms.push({x,y,w:rw,h:rh,cx:x+(rw>>1),cy:y+(rh>>1)}); }
 rooms.forEach((r,i)=>{ r.cave=i>0&&R()<.2; for(let yy=r.y;yy<r.y+r.h;yy++) for(let xx=r.x;xx<r.x+r.w;xx++){ if(r.cave){ const dx=(xx-r.x+.5)/r.w-.5, dy=(yy-r.y+.5)/r.h-.5; if(dx*dx+dy*dy<.23+(R()-.5)*.08) set(xx,yy,'c'); } else set(xx,yy,'f'); } });
 const sorted=[...rooms].sort((a,b)=>a.cx-b.cx), carve=(x,y)=>{ if(get(x,y)==='v') set(x,y,'f'); };
 for(let i=1;i<sorted.length;i++){ const a=sorted[i-1], b=sorted[i]; let x=a.cx,y=a.cy; const hf=R()<.5; const hx=()=>{ while(x!==b.cx){ carve(x,y); x+=Math.sign(b.cx-x); } }, vy=()=>{ while(y!==b.cy){ carve(x,y); y+=Math.sign(b.cy-y); } }; if(hf){ hx(); vy(); } else { vy(); hx(); } carve(x,y); }
 if(sorted.length>3&&R()<.6){ const a=sorted[0], b=sorted[sorted.length-1]; let x=a.cx,y=a.cy; while(y!==b.cy){ carve(x,y); y+=Math.sign(b.cy-y); } while(x!==b.cx){ carve(x,y); x+=Math.sign(b.cx-x); } }
 for(let y=0;y<h;y++) for(let x=0;x<w;x++){ if(get(x,y)!=='v') continue; let nc=false; for(let j=-1;j<=1;j++) for(let i=-1;i<=1;i++) if(get(x+i,y+j)==='c') nc=true; if(nc) set(x,y,'R'); }
 const inRoom=(r,x,y)=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h;
 for(const r of rooms){ if(r.cave) continue; const per=[]; for(let x=r.x;x<r.x+r.w;x++){ per.push([x,r.y-1,1]); per.push([x,r.y+r.h,1]); } for(let y=r.y;y<r.y+r.h;y++){ per.push([r.x-1,y,0]); per.push([r.x+r.w,y,0]); }
  for(const [x,y,hz] of per){ if(get(x,y)!=='f') continue; const sideA=hz?get(x-1,y):get(x,y-1), sideB=hz?get(x+1,y):get(x,y+1); if(sideA==='v'&&sideB==='v'&&R()<.75) set(x,y,'D'); } }
 const plain=rooms.filter(r=>!r.cave); const first=sorted.find(r=>!r.cave)||plain[0];
 if(first){ set(first.x,first.cy,'S'); }
 plain.forEach((r,i)=>{ if(r===first) return; const roll=R();
  if(r.w>=6&&r.h>=5&&roll<.35){ for(const [x,y] of [[r.x+1,r.y+1],[r.x+r.w-2,r.y+1],[r.x+1,r.y+r.h-2],[r.x+r.w-2,r.y+r.h-2]]) set(x,y,'o'); }
  else if(roll<.55&&r.w>=5){ for(let yy=r.y;yy<r.y+r.h;yy++) for(let xx=r.x;xx<r.x+r.w;xx++) set(xx,yy,'F'); for(let xx=r.x+1;xx<r.x+r.w-1;xx++) set(xx,r.cy,'b'); }
  else if(roll<.72){ const rad=Math.max(1,Math.min(r.w,r.h)/3); for(let yy=r.y;yy<r.y+r.h;yy++) for(let xx=r.x;xx<r.x+r.w;xx++){ const dx=(xx-r.cx)/rad, dy=(yy-r.cy)/(rad*.8); if(dx*dx+dy*dy<1) set(xx,yy,'a'); } }
  else if(roll<.82){ set(r.cx,r.cy,'p'); set(r.cx+1,r.cy,'p'); set(r.cx,r.cy+1,'p'); set(r.cx+1,r.cy+1,'p'); } });
 for(const r of rooms) if(r.cave&&R()<.35){ set(r.cx,r.cy,'l'); set(r.cx+1,r.cy,'l'); }
 for(let y=0;y<h;y++) for(let x=0;x<w;x++) if(get(x,y)==='f'&&!rooms.some(r=>inRoom(r,x,y))&&R()<.07) set(x,y,'r');
 return g.join(''); }
function genTown(m,seed){ const w=m.w,h=m.h,R=mrng(seed),ri=(a,b)=>a+Math.floor(R()*(b-a+1)); const g=new Array(w*h); const at=(x,y)=>x>=0&&y>=0&&x<w&&y<h?g[y*w+x]:'#'; const set=(x,y,c)=>{ if(x>=0&&y>=0&&x<w&&y<h) g[y*w+x]=c; };
 for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const e=fbm(x/7,y/7,seed); g[y*w+x]=e>.74?'e':hashXY(x,y,seed)%31===0?'b':'g'; }
 if(R()<.75){ const px=ri(4,w-7),py=ri(3,h-6),rx=ri(2,4),ry=ri(2,3); for(let y=py-ry-1;y<=py+ry+1;y++) for(let x=px-rx-1;x<=px+rx+1;x++){ const d=((x-px)/rx)**2+((y-py)/ry)**2; if(d<1) set(x,y,'a'); else if(d<1.7&&at(x,y)!=='a') set(x,y,'A'); } }
 let ry=Math.floor(h/2); for(let x=0;x<w;x++){ if(R()<.18) ry=clamp(ry+(R()<.5?-1:1),3,h-5); set(x,ry,'c'); set(x,ry+1,'c'); }
 let rx=Math.floor(w*(.35+R()*.3)); for(let y=0;y<h;y++){ if(R()<.18) rx=clamp(rx+(R()<.5?-1:1),3,w-5); set(rx,y,'c'); set(rx+1,y,'c'); }
 const near=(x0,y0,x1,y1,d)=>{ for(let y=y0-d;y<=y1+d;y++) for(let x=x0-d;x<=x1+d;x++) if(at(x,y)==='c') return true; return false; };
 const free=(x0,y0,x1,y1)=>{ for(let y=y0-1;y<=y1+1;y++) for(let x=x0-1;x<=x1+1;x++){ const c=at(x,y); if(c==='#'||c==='c'||c==='a'||c==='A'||c==='T'||c==='D'||c==='k') return false; } return true; };
 let houses=0; const want=Math.round(w*h/55);
 for(let t=0;t<600&&houses<want;t++){ const bw=ri(2,4),bh=ri(2,3),x=ri(1,w-bw-1),y=ri(1,h-bh-1); if(!free(x,y,x+bw-1,y+bh-1)||!near(x,y,x+bw-1,y+bh-1,2)) continue;
  for(let yy=y;yy<y+bh;yy++) for(let xx=x;xx<x+bw;xx++) set(xx,yy,'T'); houses++;
  const sides=[[x+(bw>>1),y+bh-1,0,1],[x+(bw>>1),y,0,-1],[x,y+(bh>>1),-1,0],[x+bw-1,y+(bh>>1),1,0]];
  for(const [dx0,dy0,dx,dy] of sides){ let hit=false; for(let k=1;k<=3;k++) if(at(dx0+dx*k,dy0+dy*k)==='c'){ hit=true; for(let j=1;j<k;j++) if(at(dx0+dx*j,dy0+dy*j)==='g'||at(dx0+dx*j,dy0+dy*j)==='e') set(dx0+dx*j,dy0+dy*j,'P'); break; } if(hit){ set(dx0,dy0,'D'); break; } }
  if(R()<.35){ const gx=x+bw+1, gy=y; if(free(gx,gy,gx+1,gy+1)) for(let yy=gy;yy<gy+2;yy++) for(let xx=gx;xx<gx+2;xx++) set(xx,yy,'k'); } }
 for(let y=0;y<h;y++) for(let x=0;x<w;x++) if(at(x,y)==='g'&&!near(x,y,x,y,1)&&hashXY(x,y,seed+5)%9===0) set(x,y,'t');
 return g.join(''); }
const _genBase=generateTerrain;
generateTerrain=function(m,seed){ if(m.level==='mazmorra') return genDungeon(m,seed); if(m.level==='minimo') return genTown(m,seed); return _genBase(m,seed); };

/* ----- Miniaturas de terreno ----- */
const THC={};
function terThumb(lv,k){ const id=lv+':'+k; if(THC[id]) return THC[id]; const d=TD[lv][k]; if(!d) return ''; let t=k.repeat(9); const flo=lv==='mazmorra'?'f':'g', wl=lv==='mazmorra'?'v':'T';
 if(d.deco==='door') t=flo.repeat(3)+wl+k+wl+flo.repeat(3); else if(d.deco==='stairs'||d.deco==='pillar') t=flo.repeat(4)+k+flo.repeat(4); else if(['river','road','path'].includes(d.deco)) t=flo.repeat(3)+k.repeat(3)+flo.repeat(3);
 try{ const f=renderArea({w:3,h:3,level:lv,t},0,0,3,3); const c=document.createElement('canvas'); c.width=c.height=72; c.getContext('2d').drawImage(f,C*.55,C*.55,C*1.9,C*1.9,0,0,72,72); return THC[id]=c.toDataURL(); }catch(e){ return ''; } }

/* ----- Vista previa del pincel y del rectángulo ----- */
const _drawSceneBase=drawScene;
drawScene=function(ctx,W,H,view,opt={}){ const hv=Ed.hover; if(!opt.export) Ed.hover=null; _drawSceneBase(ctx,W,H,view,opt); Ed.hover=hv; if(!opt.export&&Ed.map) drawPreview(ctx,view); };
function drawPreview(ctx,view){ const m=Ed.map, cs=C*view.z, S=(x,y)=>[view.x+x*cs,view.y+y*cs], acc=getComputedStyle(document.documentElement).getPropertyValue('--acc').trim()||'#d9a64e', d=Ed.drag, base=LEVELS[m.level].base;
 const col=k=>(TD[m.level][k]||{}).c||'#ffffff'; ctx.save();
 if(d&&d.mode==='rect'&&d.cur){ const x0=clamp(Math.min(d.start.x,d.cur.x),0,m.w-1), x1=clamp(Math.max(d.start.x,d.cur.x),0,m.w-1), y0=clamp(Math.min(d.start.y,d.cur.y),0,m.h-1), y1=clamp(Math.max(d.start.y,d.cur.y),0,m.h-1);
  const [sx,sy]=S(x0,y0), w=(x1-x0+1)*cs, h=(y1-y0+1)*cs; ctx.globalAlpha=.38; ctx.fillStyle=d.button===2?'#e45c4f':col(curKey()); ctx.fillRect(sx,sy,w,h); ctx.globalAlpha=1; ctx.setLineDash([7,5]); ctx.strokeStyle=acc; ctx.lineWidth=2; ctx.strokeRect(sx,sy,w,h); ctx.setLineDash([]);
  const txt=`${x1-x0+1} × ${y1-y0+1}`+(m.unit==='m'||m.unit==='pies'?` · ${((x1-x0+1)*m.scale).toLocaleString('es',{maximumFractionDigits:1})} × ${((y1-y0+1)*m.scale).toLocaleString('es',{maximumFractionDigits:1})} ${m.unit}`:''); ctx.font="600 13px 'IBM Plex Mono', monospace"; const tw=ctx.measureText(txt).width;
  ctx.fillStyle='rgba(12,10,16,.88)'; ctx.beginPath(); ctx.roundRect?ctx.roundRect(sx+w/2-tw/2-10,sy-30,tw+20,24,8):ctx.rect(sx+w/2-tw/2-10,sy-30,tw+20,24); ctx.fill(); ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(txt,sx+w/2,sy-18); }
 else if(Ed.hover&&(!d||['pincel','borrar','region'].includes(d.mode))){ const tool=d?d.mode:MS.tool;
  if(['pincel','borrar','region'].includes(tool)){ const cells=brushCells(Ed.hover.x,Ed.hover.y,MS.brush).filter(([x,y])=>x>=0&&y>=0&&x<m.w&&y<m.h); const set=new Set(cells.map(c=>c[0]+','+c[1]));
   ctx.globalAlpha=tool==='borrar'?.45:.35; ctx.fillStyle=tool==='borrar'?'#e45c4f':tool==='region'?((m.regions[MS.reg]||{}).color||'#ffffff'):col(curKey()); for(const [x,y] of cells){ const [sx,sy]=S(x,y); ctx.fillRect(sx,sy,cs,cs); } ctx.globalAlpha=1;
   ctx.strokeStyle=acc; ctx.lineWidth=2; ctx.beginPath(); for(const [x,y] of cells){ const [sx,sy]=S(x,y); if(!set.has((x-1)+','+y)){ ctx.moveTo(sx,sy); ctx.lineTo(sx,sy+cs); } if(!set.has((x+1)+','+y)){ ctx.moveTo(sx+cs,sy); ctx.lineTo(sx+cs,sy+cs); } if(!set.has(x+','+(y-1))){ ctx.moveTo(sx,sy); ctx.lineTo(sx+cs,sy); } if(!set.has(x+','+(y+1))){ ctx.moveTo(sx,sy+cs); ctx.lineTo(sx+cs,sy+cs); } } ctx.stroke(); }
  else if(['rellenar','etiqueta','marcador','rect'].includes(tool)){ const [sx,sy]=S(Ed.hover.x,Ed.hover.y); ctx.strokeStyle=acc; ctx.lineWidth=2; ctx.strokeRect(sx+1,sy+1,cs-2,cs-2); } }
 ctx.restore(); }

/* ----- Vista de mapas: barra de herramientas flotante y panel simplificado ----- */
const ICR=ic('<rect x="4" y="5" width="16" height="14" rx="1.5"/><path d="M4 9.5h16" opacity=".55"/>'), IREDO=ic('<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/>');
const MTOOLS=[['mover','Mover',()=>I.hand,'V'],['pincel','Pincel',()=>I.brush,'B'],['rect','Rectángulo',()=>ICR,'R'],['rellenar','Rellenar',()=>I.fill,'F'],['borrar','Borrar',()=>I.eraser,'E'],['region','Zonas',()=>I.region,'Z'],['etiqueta','Texto',()=>I.label,'T'],['marcador','Lugar',()=>I.pin,'M'],['regla','Regla',()=>I.ruler,'G']];
function setTool(t){ MS.tool=t; Ed.ruler=null; Ed.sel=null; closePop(); sideRender(); requestDraw(); }
function renderDock(){ const d=$('#dock'); if(!d) return; if(!Ed.map){ d.hidden=true; return; } d.hidden=false; const lv=Ed.map.level, k=curKey();
 d.innerHTML=MTOOLS.map(t=>`<button class="dk ${MS.tool===t[0]?'on':''}" data-tool="${t[0]}" title="${t[1]} (${t[3]})" aria-label="${t[1]}">${t[2]()}<kbd>${t[3]}</kbd></button>`).join('')
  +`<i class="dsep"></i><button class="dcur" data-pick title="Terreno actual: ${esc(TD[lv][k].name)}"><img alt="" src="${terThumb(lv,k)}"><span>${esc(TD[lv][k].name)}</span></button>`
  +(['pincel','borrar','region'].includes(MS.tool)?`<div class="dsz"><button class="dk" data-bs="-1" aria-label="Pincel más chico">−</button><span title="Tamaño del pincel">${MS.brush}</span><button class="dk" data-bs="1" aria-label="Pincel más grande">+</button></div>`:'')
  +`<i class="dsep"></i><button class="dk" data-undo title="Deshacer (Ctrl+Z)" aria-label="Deshacer">${I.undo}</button><button class="dk" data-redo title="Rehacer (Ctrl+Y)" aria-label="Rehacer">${IREDO}</button>`;
 d.onclick=e=>{ const t=e.target.closest('[data-tool]'); if(t){ setTool(t.dataset.tool); return; } if(e.target.closest('[data-pick]')){ if(!['pincel','rect','rellenar'].includes(MS.tool)) setTool('pincel'); const p=$('.pal'); if(p) p.scrollIntoView({block:'nearest',behavior:'smooth'}); return; }
  const b=e.target.closest('[data-bs]'); if(b){ MS.brush=clamp(MS.brush+ +b.dataset.bs,1,9); sideRender(); return; } if(e.target.closest('[data-undo]')) doUndo(); else if(e.target.closest('[data-redo]')) doRedo(); }; }
const MHINT={mover:'Arrastra para desplazarte. Toca un lugar o un texto para editarlo; Supr lo elimina.',pincel:'Arrastra para pintar. Clic derecho borra. Mayús + clic traza una línea recta desde el último punto. Los terrenos iguales se unen solos.',
 rect:lv=>lv==='mazmorra'?'Arrastra para crear una sala: el piso queda rodeado de roca y los muros se dibujan solos. Con Muro o Pared de cueva traza solo el contorno.':'Arrastra un rectángulo para rellenarlo. Con Muro traza solo el contorno.',
 rellenar:'Clic para rellenar toda la zona contigua del mismo terreno.',borrar:'Arrastra para devolver las casillas al terreno base.',region:'Pinta zonas con nombre: reinos, barrios o sectores.',etiqueta:'Clic para escribir un nombre sobre el mapa.',marcador:'Clic para colocar un lugar. Puede abrir un submapa del nivel siguiente.',
 regla:lv=>lv==='minimo'||lv==='mazmorra'?'Arrastra para medir. Cada diagonal cuenta como una casilla.':'Arrastra para medir. Incluye días de viaje a ritmo normal.'};
sideRender=function(){
 const s=$('#mside'); if(!s) return; renderDock(); const m=Ed.map, lv=MS.level;
 const maps=Store.list('maps').filter(x=>(x.plane||'material')===curPlane&&x.level===lv).sort((a,b)=>a.name.localeCompare(b.name));
 const pal=m&&['pincel','rect','rellenar'].includes(MS.tool), hint=m&&(typeof MHINT[MS.tool]==='function'?MHINT[MS.tool](m.level):MHINT[MS.tool]);
 s.innerHTML=`<div><span class="eyebrow">${esc(planeById(curPlane).name)}</span><div class="lvl-tabs" style="margin-top:6px">${Object.entries(LEVELS).map(([k,l])=>`<button data-lv="${k}" class="${k===lv?'on':''}">${l.name}</button>`).join('')}</div></div>
 <div class="maplist">${maps.map(x=>`<div class="li ${x.id===MS.open?'on':''}" data-open="${x.id}"><img alt="" src="${thumb(x)}" style="width:44px;height:28px;border-radius:4px;image-rendering:pixelated;object-fit:cover;flex:none"><span class="nm">${esc(x.name)}</span>${x.parent?'<span class="tag">sub</span>':''}</div>`).join('')||'<small class="muted">No hay mapas de este nivel en este plano.</small>'}
  <button class="btn sm" id="mnew" style="margin-top:4px">${I.plus} Nuevo mapa ${LEVELS[lv].name.toLowerCase()}</button></div>
 ${m?`${pal?`<div><div class="row" style="justify-content:space-between"><span class="eyebrow">Terreno</span><small class="muted">Teclas 1 a 9</small></div><div class="pal">${TERR[m.level].map(([k,n],i)=>`<button class="pt ${curKey()===k?'on':''}" data-ter="${k}" title="${esc(n)}"><img alt="" src="${terThumb(m.level,k)}" loading="lazy"><span>${esc(n)}</span>${i<9?`<kbd>${i+1}</kbd>`:''}</button>`).join('')}</div></div>`:''}
  ${['pincel','borrar','region'].includes(MS.tool)?`<label class="f"><span>Tamaño del pincel: ${MS.brush}</span><input type="range" id="bsz" min="1" max="9" value="${MS.brush}" style="accent-color:var(--acc)"></label>`:''}
  ${MS.tool==='region'?`<div><span class="eyebrow">Zonas</span><div style="display:flex;flex-direction:column;gap:5px;margin-top:6px">${m.regions.map((r,i)=>`<div class="sw ${MS.reg===i?'on':''}" data-reg="${i}" style="cursor:pointer"><i style="background:${r.color}"></i><input class="inp" data-rn="${i}" value="${esc(r.name)}" style="padding:3px 6px;font-size:.82rem" aria-label="Nombre de la zona"><button class="btn ghost icon sm" data-rdel="${i}" aria-label="Eliminar zona">${I.x}</button></div>`).join('')}
   <button class="sw ${MS.reg<0?'on':''}" data-reg="-1"><i style="background:transparent;border:1px dashed var(--line2)"></i><span>Borrar zona</span></button><button class="btn sm" id="radd">${I.plus} Nueva zona</button></div></div>`:''}
  ${MS.tool==='marcador'?`<div><span class="eyebrow">Tipo de lugar</span><div class="swatches" style="margin-top:6px">${MARK[m.level].map(([k,n])=>`<button class="sw ${MS.mk[m.level]===k?'on':''}" data-mk="${k}"><canvas width="32" height="32" data-ico="${k}" style="width:16px;height:16px"></canvas><span>${n}</span></button>`).join('')}</div></div>`:''}
  ${hint?`<div class="hint">${esc(hint)}</div>`:''}
  <details class="mset" ${MS.setOpen?'open':''}><summary>Ajustes del mapa</summary><div>
   <input class="inp" id="mname" value="${esc(m.name)}" aria-label="Nombre del mapa">
   <div class="row" style="flex-wrap:nowrap;gap:6px"><small class="muted" style="white-space:nowrap">1 casilla =</small><input class="inp mono" id="mscale" type="number" step="0.1" min="0.1" value="${m.scale}" style="width:80px" aria-label="Escala"><select class="sel" id="munit" style="width:auto" aria-label="Unidad">${['m','km','mi','pies'].map(u=>`<option ${u===m.unit?'selected':''}>${u}</option>`).join('')}</select></div>
   <div class="row" style="flex-wrap:nowrap;gap:6px"><input class="inp mono" id="mw" type="number" min="8" max="120" value="${m.w}" style="width:68px" aria-label="Ancho"><span class="muted">×</span><input class="inp mono" id="mh" type="number" min="8" max="120" value="${m.h}" style="width:68px" aria-label="Alto"><button class="btn sm" id="mres">Redimensionar</button></div>
   <select class="sel" id="mplane" aria-label="Plano del mapa">${PLANES.map(p=>`<option value="${p.id}" ${p.id===(m.plane||'material')?'selected':''}>${p.name}</option>`).join('')}</select>
   <div class="row" style="gap:6px"><button class="btn sm" id="mgen">${I.wand} ${m.level==='mazmorra'?'Generar mazmorra':m.level==='minimo'?'Generar pueblo':'Generar terreno'}</button><button class="btn sm danger" id="mdel">${I.trash} Eliminar</button></div></div></details>`:''}`;
 $$('canvas[data-ico]',s).forEach(c=>{ const x=c.getContext('2d'); x.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--acc'); iconPath(x,c.dataset.ico,16,16,13); });
 const det=$('.mset',s); if(det) det.ontoggle=()=>{ MS.setOpen=det.open; };
 s.onclick=e=>{ const t=e.target;
  const lvb=t.closest('[data-lv]'); if(lvb){ MS.level=lvb.dataset.lv; if(Ed.map&&Ed.map.level===MS.level){ sideRender(); return; } if(Ed.map) saveMap(0); openMap(null); return; }
  const o=t.closest('[data-open]'); if(o){ if(Ed.map) saveMap(0); openMap(o.dataset.open); return; }
  if(t.closest('#mnew')){ newMapDialog(); return; }
  const te=t.closest('[data-ter]'); if(te){ MS.ter[Ed.map.level]=te.dataset.ter; if(MS.tool==='borrar') MS.tool='pincel'; sideRender(); return; }
  const rd=t.closest('[data-rdel]'); if(rd){ const i=+rd.dataset.rdel; pushUndo(); const ch=String.fromCharCode(65+i); Ed.map.regions.splice(i,1);
   Ed.map.r=Ed.map.r.split('').map(c=>c==='.'?c:c===ch?'.':c>ch?String.fromCharCode(c.charCodeAt(0)-1):c).join(''); MS.reg=Math.min(MS.reg,Ed.map.regions.length-1); rebuildRegions(); saveMap(); sideRender(); requestDraw(); return; }
  const rg=t.closest('[data-reg]'); if(rg&&!t.matches('input')){ MS.reg=+rg.dataset.reg; sideRender(); return; }
  if(t.closest('#radd')){ if(Ed.map.regions.length>=26) return toast('Máximo 26 zonas por mapa.'); const n=Ed.map.regions.length; Ed.map.regions.push({name:({global:'Reino ',nacional:'Comarca ',minimo:'Barrio ',mazmorra:'Sector '}[Ed.map.level]||'Zona ')+(n+1),color:REGION_COLORS[n%REGION_COLORS.length]}); MS.reg=n; saveMap(); sideRender(); return; }
  const mk=t.closest('[data-mk]'); if(mk){ MS.mk[Ed.map.level]=mk.dataset.mk; sideRender(); return; }
  if(t.closest('#mres')){ const w=clamp(+$('#mw').value||Ed.map.w,8,120), h=clamp(+$('#mh').value||Ed.map.h,8,120); resizeMap(w,h); return; }
  if(t.closest('#mgen')){ confirmBox('¿Generar de nuevo? Reemplaza el terreno actual (puedes deshacer).',()=>{ pushUndo(); Ed.map.t=generateTerrain(Ed.map,(Math.random()*1e6)|0); rebuildTerrain(); saveMap(); requestDraw(); sideRender(); },'Generar'); return; }
  if(t.closest('#mdel')){ confirmBox(`¿Eliminar el mapa "${Ed.map.name}"? Los submapas se conservan.`,()=>{ const id=Ed.map.id; Ed.map=null; Store.del('maps',id); openMap(null); }); return; } };
 const bs=$('#bsz',s); if(bs) bs.oninput=()=>{ MS.brush=+bs.value; bs.previousElementSibling.textContent='Tamaño del pincel: '+MS.brush; renderDock(); requestDraw(); };
 const nm=$('#mname',s); if(nm) nm.oninput=e=>{ Ed.map.name=e.target.value||'Sin nombre'; saveMap(); crumbs(); };
 $('#mscale',s)?.addEventListener('change',e=>{ Ed.map.scale=Number(e.target.value)||1; saveMap(); info({x:-1,y:-1}); });
 $('#munit',s)?.addEventListener('change',e=>{ Ed.map.unit=e.target.value; saveMap(); info({x:-1,y:-1}); });
 $('#mplane',s)?.addEventListener('change',e=>{ Ed.map.plane=e.target.value; saveMap(0); toast(`Mapa movido a ${planeById(e.target.value).name}.`); openMap(null); counts(); });
 $$('[data-rn]',s).forEach(i=>i.oninput=()=>{ Ed.map.regions[+i.dataset.rn].name=i.value; rebuildRegions(); saveMap(); requestDraw(); });
};
vMapas=function(v){
 v.className='view full';
 v.innerHTML=`<div class="mapwrap"><aside class="mapside" id="mside"></aside><div class="mapstage" id="stage"><canvas id="mcv" aria-label="Lienzo del mapa"></canvas><div class="crumbs" id="crumbs"></div>
  <div class="mapctl"><button class="btn icon" id="zin" title="Acercar" aria-label="Acercar">${I.plus}</button><button class="btn icon" id="zout" title="Alejar" aria-label="Alejar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M5 12h14"/></svg></button><button class="btn icon" id="zfit" title="Encuadrar" aria-label="Encuadrar">${I.eye}</button><button class="btn icon" id="tgrid" title="Cuadrícula" aria-label="Mostrar u ocultar cuadrícula">${I.grid}</button><button class="btn icon" id="treg" title="Zonas" aria-label="Mostrar u ocultar zonas">${I.layers}</button><button class="btn icon" id="mexp" title="Exportar PNG" aria-label="Exportar imagen">${I.down}</button></div>
  <div class="mapinfo" id="minfo">Elige o crea un mapa</div><div class="dock" id="dock" hidden></div><div id="mempty"></div></div></div>`;
 const cv=$('#mcv'); Ed.cv=cv; Ed.ctx=cv.getContext('2d'); Ed.sel=null; Ed.ruler=null;
 const resize=()=>{ Ed.dpr=Math.min(devicePixelRatio||1,2); cv.width=cv.clientWidth*Ed.dpr; cv.height=cv.clientHeight*Ed.dpr; requestDraw(); };
 const ro=new ResizeObserver(resize); ro.observe($('#stage'));
 openMap(MS.open,true);
 const unsub=Store.on((c,o)=>{ if(c!=='maps'||o!=='remote') return; const cur=MS.open&&Store.get('maps',MS.open);
  if(MS.open&&!cur){ MS.open=null; openMap(null); return; }
  if(cur&&cur!==Ed.map&&!Ed.drag){ Ed.map=cur; rebuildTerrain(); rebuildRegions(); requestDraw(); } sideRender(); });
 const pos=e=>{ const r=cv.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top}; };
 const paintCh=()=>MS.tool==='borrar'?LEVELS[Ed.map.level].base:curKey();
 cv.addEventListener('contextmenu',e=>e.preventDefault());
 cv.addEventListener('pointerdown',e=>{ if(!Ed.map) return; try{ cv.setPointerCapture(e.pointerId); }catch(_){} const p=pos(e); Ed.ptrs.set(e.pointerId,p); closePop();
  if(Ed.ptrs.size===2){ const [a,b]=[...Ed.ptrs.values()]; Ed.pinch={d:Math.hypot(a.x-b.x,a.y-b.y),cx:(a.x+b.x)/2,cy:(a.y+b.y)/2,v:{...Ed.view}};
   if(Ed.drag&&Ed.drag.painted&&!Ed.drag.moved){ const u=Ed.undo.pop(); if(u){ Object.assign(Ed.map,u); rebuildTerrain(); rebuildRegions(); } } Ed.drag=null; requestDraw(); return; }
  const lv=Ed.map.level, base=LEVELS[lv].base; let tool=MS.tool;
  if(e.button===2){ if(['pincel','borrar'].includes(tool)) tool='borrar'; else if(tool==='rect'||tool==='rellenar') tool=tool; else return; }
  const pan=e.button===1||Ed.space||tool==='mover'; const cell=cellAt(p.x,p.y);
  Ed.drag={mode:pan?'pan':tool,sx:p.x,sy:p.y,vx:Ed.view.x,vy:Ed.view.y,moved:false,last:cell,start:cell,cur:cell,button:e.button};
  if(pan){ cv.style.cursor='grabbing'; return; }
  if(tool==='rect'){ requestDraw(); return; }
  if(!inMap(cell)&&tool!=='regla'){ Ed.drag=null; return; }
  const ch=tool==='borrar'?base:curKey();
  if(tool==='pincel'||tool==='borrar'){ pushUndo(); Ed.drag.painted=true; if(e.shiftKey&&Ed.lastPt) lineCells(Ed.lastPt,cell,(x,y)=>setCells('t',x,y,ch,MS.brush)); else setCells('t',cell.x,cell.y,ch,MS.brush); Ed.lastPt=cell; Ed.drag.ch=ch; }
  else if(tool==='region'){ pushUndo(); Ed.drag.painted=true; setCells('r',cell.x,cell.y,MS.reg<0?'.':String.fromCharCode(65+MS.reg),MS.brush); }
  else if(tool==='rellenar'){ pushUndo(); flood(cell.x,cell.y,e.button===2?base:curKey()); saveMap(); }
  else if(tool==='regla'){ Ed.ruler={a:cell,b:cell}; }
  requestDraw(); });
 cv.addEventListener('pointermove',e=>{ if(!Ed.map) return; const p=pos(e); if(Ed.ptrs.has(e.pointerId)) Ed.ptrs.set(e.pointerId,p);
  if(Ed.pinch&&Ed.ptrs.size===2){ const [a,b]=[...Ed.ptrs.values()]; const d=Math.hypot(a.x-b.x,a.y-b.y), cx=(a.x+b.x)/2, cy=(a.y+b.y)/2; const pv=Ed.pinch.v, nz=clamp(pv.z*d/Ed.pinch.d,.05,4);
   Ed.view={z:nz,x:cx-(Ed.pinch.cx-pv.x)*(nz/pv.z),y:cy-(Ed.pinch.cy-pv.y)*(nz/pv.z)}; requestDraw(); return; }
  const cell=cellAt(p.x,p.y); const changed=!Ed.hover||Ed.hover.x!==cell.x||Ed.hover.y!==cell.y; Ed.hover=inMap(cell)?cell:null; if(changed) info(cell);
  const d=Ed.drag; if(d){ if(Math.hypot(p.x-d.sx,p.y-d.sy)>4) d.moved=true;
   if(d.mode==='pan'){ Ed.view.x=d.vx+p.x-d.sx; Ed.view.y=d.vy+p.y-d.sy; }
   else if((d.mode==='pincel'||d.mode==='borrar')&&changed){ lineCells(d.last,cell,(x,y)=>setCells('t',x,y,d.ch,MS.brush)); d.last=cell; Ed.lastPt=cell; }
   else if(d.mode==='region'&&changed){ lineCells(d.last,cell,(x,y)=>setCells('r',x,y,MS.reg<0?'.':String.fromCharCode(65+MS.reg),MS.brush)); d.last=cell; }
   else if(d.mode==='rect') d.cur=cell;
   else if(d.mode==='regla'&&Ed.ruler) Ed.ruler.b=cell; }
  if(changed||d) requestDraw(); });
 const up=e=>{ Ed.ptrs.delete(e.pointerId); if(Ed.ptrs.size<2) Ed.pinch=null; const d=Ed.drag; Ed.drag=null; cv.style.cursor=''; if(!d||!Ed.map) return; const p=pos(e);
  if(d.mode==='pan'&&!d.moved&&MS.tool==='mover'&&d.button===0){ const h=hitTest(p.x,p.y); if(h){ Ed.sel=h.o; h.type==='marker'?markerPop(h.o,p):labelPop(h.o,p); } else Ed.sel=null; requestDraw(); }
  else if(d.mode==='rect'){ const lv=Ed.map.level, k=d.button===2?LEVELS[lv].base:curKey(); pushUndo(); fillRectCells(d.start,d.cur,k,d.button!==2&&(k==='W'||k==='R')); saveMap(); requestDraw(); }
  else if(['pincel','borrar','region'].includes(d.mode)) saveMap();
  else if((d.mode==='etiqueta'||d.mode==='marcador')&&!d.moved){ const h=hitTest(p.x,p.y), cell=cellAt(p.x,p.y);
   if(h){ Ed.sel=h.o; h.type==='marker'?markerPop(h.o,p):labelPop(h.o,p); }
   else if(inMap(cell)){ pushUndo(); if(d.mode==='etiqueta'){ const l={id:uid(),x:cell.x,y:cell.y,text:'Nuevo nombre',size:Ed.map.level==='global'?2:1.3,italic:false}; (Ed.map.labels=Ed.map.labels||[]).push(l); Ed.sel=l; labelPop(l,p,true); }
    else { const k={id:uid(),x:cell.x,y:cell.y,kind:MS.mk[Ed.map.level],name:'',note:'',link:null}; (Ed.map.markers=Ed.map.markers||[]).push(k); Ed.sel=k; markerPop(k,p,true); } saveMap(400); }
   requestDraw(); } };
 cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
 cv.addEventListener('pointerleave',()=>{ Ed.hover=null; requestDraw(); });
 cv.addEventListener('wheel',e=>{ if(!Ed.map) return; e.preventDefault(); const p=pos(e); const f=e.ctrlKey?Math.exp(-e.deltaY*.01):(e.deltaY<0?1.15:1/1.15); zoomAt(p.x,p.y,f); },{passive:false});
 const key=e=>{ if(route!=='mapas'||$('.modal-bg')||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
  if(e.code==='Space'){ Ed.space=e.type==='keydown'; if(Ed.space) e.preventDefault(); return; } if(e.type!=='keydown'||!Ed.map) return;
  const kk=e.key.toLowerCase();
  if((e.ctrlKey||e.metaKey)&&(kk==='y'||(kk==='z'&&e.shiftKey))){ e.preventDefault(); doRedo(); return; }
  if((e.ctrlKey||e.metaKey)&&kk==='z'){ e.preventDefault(); doUndo(); return; }
  if(e.ctrlKey||e.metaKey||e.altKey) return;
  if(e.key==='Delete'||e.key==='Backspace'){ if(Ed.sel){ Ed.map.markers=(Ed.map.markers||[]).filter(k=>k!==Ed.sel); Ed.map.labels=(Ed.map.labels||[]).filter(k=>k!==Ed.sel); Ed.sel=null; closePop(); saveMap(300); requestDraw(); } return; }
  if(/^[1-9]$/.test(e.key)){ const t=TERR[Ed.map.level][+e.key-1]; if(t){ MS.ter[Ed.map.level]=t[0]; if(!['pincel','rect','rellenar'].includes(MS.tool)) MS.tool='pincel'; sideRender(); requestDraw(); } return; }
  if(e.key==='['||e.key===']'){ MS.brush=clamp(MS.brush+(e.key===']'?1:-1),1,9); sideRender(); requestDraw(); return; }
  const t={v:'mover',b:'pincel',r:'rect',f:'rellenar',e:'borrar',z:'region',t:'etiqueta',m:'marcador',g:'regla'}[kk]; if(t) setTool(t); };
 document.addEventListener('keydown',key); document.addEventListener('keyup',key);
 $('#zin').onclick=()=>zoomAt(cv.clientWidth/2,cv.clientHeight/2,1.3); $('#zout').onclick=()=>zoomAt(cv.clientWidth/2,cv.clientHeight/2,1/1.3); $('#zfit').onclick=fitView;
 $('#tgrid').onclick=()=>{ MS.grid=!MS.grid; requestDraw(); }; $('#treg').onclick=()=>{ MS.showReg=!MS.showReg; requestDraw(); }; $('#mexp').onclick=exportMap;
 cleanup=()=>{ ro.disconnect(); unsub(); document.removeEventListener('keydown',key); document.removeEventListener('keyup',key); if(Ed.map) Store.put('maps',Ed.map,0); Ed.cv=null; Ed.map=null; closePop(); };
};
