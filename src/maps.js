/* ===== MAPAS ===== */
const LEVELS={
 global:{name:'Global',scale:50,unit:'km',w:64,h:40,base:'a',child:'nacional',desc:'Continentes, islas, países y regiones'},
 nacional:{name:'Nacional',scale:5,unit:'km',w:60,h:40,base:'g',child:'minimo',desc:'Un país, isla o continente: pueblos, bosques y caminos'},
 minimo:{name:'Mínimo',scale:1.5,unit:'m',w:40,h:30,base:'g',child:null,desc:'Pueblos, ciudades, mazmorras y sectores'}
};
const TERR={
 global:[['o','Océano profundo','#1c3a5e','wave'],['a','Océano','#2a5a82','wave'],['c','Aguas costeras','#4c86a8',''],['p','Llanuras','#8ea75a',''],['f','Bosque','#4c7a3e','trees'],['j','Selva','#2e6b3b','trees2'],['h','Colinas','#a39457','hill'],['m','Montañas','#857c74','mount'],['n','Cumbres nevadas','#dfe3ec','mount'],['d','Desierto','#d7bd7c','dots'],['t','Tundra','#b5c0b0','dots'],['s','Pantano','#5c6b45','swamp'],['v','Tierras volcánicas','#5a3a35','mount']],
 nacional:[['g','Pradera','#93ad5d',''],['f','Bosque','#4e7c40','trees'],['F','Bosque denso','#33603a','trees2'],['h','Colinas','#a8975c','hill'],['m','Montaña','#877e75','mount'],['n','Nieve','#e2e6ee','mount'],['w','Lago o mar','#3a6c93','wave'],['r','Río','#4c86b0','wave'],['R','Camino','#b39a6b',''],['s','Pantano','#5e6c47','swamp'],['k','Cultivos','#b8af69','crop'],['d','Desierto','#d5bc7f','dots'],['x','Tierra baldía','#7c6e5e','dots']],
 minimo:[['g','Césped','#7ea256',''],['e','Tierra','#8e7451','dots'],['c','Adoquín','#8d8983','brick'],['s','Losa','#a6a199','tile'],['w','Suelo de madera','#9a6a42','plank'],['W','Muro','#3d3840','wall'],['D','Puerta','#c08a3e','door'],['a','Agua','#4a7ea8','wave'],['t','Árbol','#3e6a36','tree'],['b','Arbustos','#5b8945','bush'],['r','Escombros','#6e665f','rubble'],['A','Arena','#d6c38e','dots'],['l','Lava','#cf522a','lava']]
};
const TL={}; for(const [lv,arr] of Object.entries(TERR)){ TL[lv]={}; for(const [k,n,c,g] of arr) TL[lv][k]={name:n,c,g}; }
const MARK={
 global:[['capital','Capital'],['ciudad','Ciudad'],['puerto','Puerto'],['ruina','Ruina'],['portal','Portal'],['punto','Punto de interés']],
 nacional:[['ciudad','Ciudad'],['pueblo','Pueblo'],['castillo','Castillo'],['mazmorra','Mazmorra'],['cueva','Cueva'],['templo','Templo'],['ruina','Ruina'],['puerto','Puerto'],['campamento','Campamento'],['portal','Portal'],['punto','Punto']],
 minimo:[['taberna','Taberna'],['tienda','Tienda'],['templo','Templo'],['npc','PNJ'],['peligro','Peligro'],['tesoro','Tesoro'],['trampa','Trampa'],['puerta','Entrada'],['portal','Portal'],['punto','Punto']]
};
const REGION_COLORS=['#f0c75a','#e8695a','#6ac3e6','#9ee06c','#c78cf0','#f39c4c','#5ad8b6','#f07cbc','#b8b8cc','#7d8ff2'];
const MS={open:null,level:'global',tool:'pincel',brush:1,ter:{global:'p',nacional:'f',minimo:'s'},reg:0,mk:{global:'ciudad',nacional:'pueblo',minimo:'taberna'},grid:true,showReg:true};
const C=48;
const colName=i=>{ let s=''; i++; while(i>0){ const r=(i-1)%26; s=String.fromCharCode(65+r)+s; i=Math.floor((i-1)/26);} return s; };
const hashXY=(x,y,s=7)=>{ let h=(Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul(s,1442695041))|0; h=Math.imul(h^(h>>>13),1274126177); h^=h>>>16; return h>>>0; };
const vnoise=(x,y,s)=>{ const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf); const a=hashXY(xi,yi,s)/4294967295,b=hashXY(xi+1,yi,s)/4294967295,c=hashXY(xi,yi+1,s)/4294967295,d=hashXY(xi+1,yi+1,s)/4294967295; return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; };
const fbm=(x,y,s)=>{ let t=0,a=1,f=1,n=0; for(let o=0;o<5;o++){ t+=vnoise(x*f,y*f,s+o*31)*a; n+=a; a*=.5; f*=2; } return clamp((t/n-.5)*2.3+.5,0,1); };
function shade(hex,f){ const n=parseInt(hex.slice(1),16); let r=n>>16,g=n>>8&255,b=n&255; const t=f<0?0:255, p=Math.abs(f); r=Math.round(r+(t-r)*p); g=Math.round(g+(t-g)*p); b=Math.round(b+(t-b)*p); return `rgb(${r},${g},${b})`; }

function generateTerrain(m,seed){
 const w=m.w,h=m.h,lv=m.level; const out=new Array(w*h); const E=new Float32Array(w*h);
 for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const i=y*w+x; const nx=x/w-.5, ny=y/h-.5;
  if(lv==='global'){ const d=Math.sqrt(nx*nx*1.1+ny*ny*1.4)*2; const e=fbm(x/13,y/13,seed)*.85+.2-d*.42; const mo=fbm(x/9+40,y/9,seed+99); const lat=Math.abs(ny)*2; E[i]=e;
   out[i]=e<.33?'o':e<.41?'a':e<.44?'c':e>.85?'n':e>.77?(hashXY(x,y,seed)%9===0?'v':'m'):e>.7?'h':lat>.84?'t':mo<.36?'d':mo<.47?'p':mo<.6?'f':mo<.68?(lat<.45?'j':'f'):'s'; }
  else if(lv==='nacional'){ const e=fbm(x/12,y/12,seed); const mo=fbm(x/8+70,y/8,seed+51); const cr=fbm(x/5,y/5,seed+7); E[i]=e;
   out[i]=e<.24?'w':e>.9?'n':e>.82?'m':e>.72?'h':mo<.3?'x':mo<.5?(cr>.62?'k':'g'):mo<.62?'f':mo<.71?'F':'s'; }
  else { const e=fbm(x/7,y/7,seed); E[i]=e; out[i]=e<.3?'a':e<.36?'A':e>.68?'e':(hashXY(x,y,seed)%17===0?'t':hashXY(x,y,seed+3)%23===0?'b':'g'); } }
 if(lv==='nacional'){ for(let k=0;k<2;k++){ let best=-1,bi=0; for(let t=0;t<40;t++){ const i=hashXY(t,k,seed)%(w*h); if(E[i]>best&&out[i]!=='w'){best=E[i];bi=i;} }
   let cur=bi; for(let s=0;s<w*h&&cur>=0;s++){ if(out[cur]==='w') break; out[cur]='r'; const cx=cur%w, cy=(cur/w)|0; let nb=-1, ne=E[cur]+.02;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const xx=cx+dx, yy=cy+dy; if(xx<0||yy<0||xx>=w||yy>=h){ nb=-2; break; } const j=yy*w+xx; if(out[j]!=='r'&&E[j]<ne){ ne=E[j]; nb=j; } }
    if(nb===-2) break; if(nb<0){ E[cur]+=.05; const cands=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>[cx+dx,cy+dy]).filter(([a,b])=>a>=0&&b>=0&&a<w&&b<h&&out[b*w+a]!=='r'); if(!cands.length) break; const [a,b]=cands[hashXY(cx,cy,s)%cands.length]; nb=b*w+a; } cur=nb; } } }
 if(lv==='minimo'){ let ry=Math.floor(h/2); for(let x=0;x<w;x++){ if(hashXY(x,1,seed)%5===0) ry=clamp(ry+(hashXY(x,2,seed)%3)-1,2,h-3); out[ry*w+x]='c'; out[(ry+1)*w+x]='c'; } }
 return out.join('');
}

/* Editor */
const Ed={map:null,terrC:null,regC:null,cv:null,ctx:null,dpr:1,view:{x:0,y:0,z:1},undo:[],hover:null,ruler:null,drag:null,ptrs:new Map(),pinch:null,space:false,raf:0,regLabels:[]};
const lvT=()=>TL[Ed.map.level];
function drawCell(tc,m,x,y){
 const ch=m.t[y*m.w+x], d=TL[m.level][ch]||TL[m.level][LEVELS[m.level].base], px=x*C, py=y*C, h=hashXY(x,y);
 tc.fillStyle=shade(d.c,((h%11)-5)/110); tc.fillRect(px,py,C,C); glyph(tc,d.g,px,py,h,d.c);
}
function glyph(c,g,px,py,h,col){
 const r=k=>((h>>>(k*3))%7)/7;
 c.save(); c.lineWidth=1.4; c.lineCap='round';
 if(g==='trees'||g==='trees2'){ const n=g==='trees'?3:5; for(let i=0;i<n;i++){ const x=px+5+r(i)*20+((i%2)*4), y=py+6+r(i+5)*18; c.fillStyle=shade(col,-.32); c.beginPath(); c.arc(x+1.5,y+2.5,5.5,0,7); c.fill(); c.fillStyle=shade(col,.12); c.beginPath(); c.arc(x,y,5,0,7); c.fill(); } }
 else if(g==='tree'){ c.fillStyle='rgba(0,0,0,.28)'; c.beginPath(); c.arc(px+18,py+19,12,0,7); c.fill(); c.fillStyle=shade(col,.08); c.beginPath(); c.arc(px+16,py+16,12,0,7); c.fill(); c.fillStyle=shade(col,.3); c.beginPath(); c.arc(px+12,py+12,5,0,7); c.fill(); }
 else if(g==='bush'){ c.fillStyle=shade(col,.2); for(let i=0;i<3;i++){ c.beginPath(); c.arc(px+8+i*8,py+12+r(i)*10,5,0,7); c.fill(); } }
 else if(g==='mount'){ const bx=px+4+r(1)*4, s=22+r(2)*4; c.fillStyle=shade(col,-.25); c.beginPath(); c.moveTo(bx,py+28); c.lineTo(bx+s/2,py+28-s); c.lineTo(bx+s,py+28); c.fill(); c.fillStyle=shade(col,.18); c.beginPath(); c.moveTo(bx,py+28); c.lineTo(bx+s/2,py+28-s); c.lineTo(bx+s/2-2,py+28); c.fill(); c.fillStyle='rgba(255,255,255,.75)'; c.beginPath(); c.moveTo(bx+s/2-4,py+28-s+7); c.lineTo(bx+s/2,py+28-s); c.lineTo(bx+s/2+4,py+28-s+7); c.fill(); }
 else if(g==='hill'){ c.strokeStyle=shade(col,-.3); c.beginPath(); c.arc(px+11,py+22,7,Math.PI,0); c.stroke(); c.beginPath(); c.arc(px+22,py+17,6,Math.PI,0); c.stroke(); }
 else if(g==='swamp'){ c.strokeStyle=shade(col,-.3); for(let i=0;i<3;i++){ const y=py+8+i*8+r(i)*3, x=px+4+r(i+2)*10; c.beginPath(); c.moveTo(x,y); c.lineTo(x+12,y); c.stroke(); c.beginPath(); c.moveTo(x+6,y); c.lineTo(x+4,y-5); c.moveTo(x+6,y); c.lineTo(x+8,y-5); c.stroke(); } }
 else if(g==='dots'){ c.fillStyle=shade(col,-.22); for(let i=0;i<4;i++){ c.beginPath(); c.arc(px+4+r(i)*24,py+4+r(i+4)*24,1.3,0,7); c.fill(); } }
 else if(g==='wave'){ c.strokeStyle=shade(col,.18); c.globalAlpha=.7; const y=py+10+r(1)*12, x=px+5+r(2)*10; c.beginPath(); c.moveTo(x,y); c.quadraticCurveTo(x+4,y-4,x+8,y); c.quadraticCurveTo(x+12,y+4,x+16,y); c.stroke(); }
 else if(g==='crop'){ c.strokeStyle=shade(col,-.18); for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(px+2+i*8,py+30); c.lineTo(px+8+i*8,py+2); c.stroke(); } }
 else if(g==='brick'){ c.strokeStyle=shade(col,-.25); c.lineWidth=1; c.beginPath(); c.moveTo(px,py+16); c.lineTo(px+C,py+16); c.moveTo(px+16,py); c.lineTo(px+16,py+16); c.moveTo(px+8,py+16); c.lineTo(px+8,py+32); c.moveTo(px+24,py+16); c.lineTo(px+24,py+32); c.stroke(); }
 else if(g==='tile'){ c.strokeStyle=shade(col,-.2); c.lineWidth=1; c.strokeRect(px+1.5,py+1.5,C-3,C-3); }
 else if(g==='plank'){ c.strokeStyle=shade(col,-.28); c.lineWidth=1; for(let i=1;i<4;i++){ c.beginPath(); c.moveTo(px,py+i*8); c.lineTo(px+C,py+i*8); c.stroke(); } c.beginPath(); c.moveTo(px+6+r(1)*20,py); c.lineTo(px+6+r(1)*20,py+8); c.stroke(); }
 else if(g==='wall'){ c.fillStyle=shade(col,.15); c.fillRect(px,py,C,4); c.strokeStyle='rgba(0,0,0,.4)'; c.strokeRect(px+.5,py+.5,C-1,C-1); }
 else if(g==='door'){ c.fillStyle=shade(col,-.35); c.fillRect(px+6,py+3,20,26); c.fillStyle='#f3d27a'; c.beginPath(); c.arc(px+21,py+17,1.8,0,7); c.fill(); }
 else if(g==='rubble'){ c.fillStyle=shade(col,-.3); for(let i=0;i<5;i++){ c.fillRect(px+3+r(i)*24,py+3+r(i+3)*24,3+r(i+6)*4,3); } }
 else if(g==='lava'){ c.strokeStyle='#ffd25a'; c.globalAlpha=.8; c.beginPath(); c.moveTo(px+2,py+6+r(1)*20); c.lineTo(px+14,py+10+r(2)*14); c.lineTo(px+30,py+4+r(3)*24); c.stroke(); }
 c.restore();
}
function rebuildTerrain(){ const m=Ed.map; Ed.terrC=Ed.terrC||document.createElement('canvas'); Ed.terrC.width=m.w*C; Ed.terrC.height=m.h*C; const tc=Ed.terrC.getContext('2d'); for(let y=0;y<m.h;y++) for(let x=0;x<m.w;x++) drawCell(tc,m,x,y); }
function rebuildRegions(){
 const m=Ed.map; Ed.regC=Ed.regC||document.createElement('canvas'); Ed.regC.width=m.w*C; Ed.regC.height=m.h*C; const rc=Ed.regC.getContext('2d'); rc.clearRect(0,0,Ed.regC.width,Ed.regC.height);
 const acc={}; const R=(x,y)=>(x<0||y<0||x>=m.w||y>=m.h)?'.':m.r[y*m.w+x];
 for(let y=0;y<m.h;y++) for(let x=0;x<m.w;x++){ const k=R(x,y); if(k==='.') continue; const reg=m.regions[k.charCodeAt(0)-65]; if(!reg) continue;
  rc.globalAlpha=.24; rc.fillStyle=reg.color; rc.fillRect(x*C,y*C,C,C); rc.globalAlpha=.95;
  if(R(x-1,y)!==k) rc.fillRect(x*C,y*C,3,C); if(R(x+1,y)!==k) rc.fillRect(x*C+C-3,y*C,3,C); if(R(x,y-1)!==k) rc.fillRect(x*C,y*C,C,3); if(R(x,y+1)!==k) rc.fillRect(x*C,y*C+C-3,C,3);
  const a=acc[k]=acc[k]||{x:0,y:0,n:0}; a.x+=x; a.y+=y; a.n++; }
 rc.globalAlpha=1; Ed.regLabels=Object.entries(acc).map(([k,a])=>({name:m.regions[k.charCodeAt(0)-65].name,color:m.regions[k.charCodeAt(0)-65].color,x:a.x/a.n+.5,y:a.y/a.n+.5,n:a.n}));
}
function iconPath(c,kind,x,y,s){
 c.beginPath(); const p=(a,b)=>c.lineTo(x+a*s,y+b*s), mv=(a,b)=>c.moveTo(x+a*s,y+b*s);
 switch(kind){
  case 'capital': for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?.38:.85; i?p(Math.cos(a)*rr,Math.sin(a)*rr):mv(Math.cos(a)*rr,Math.sin(a)*rr);} c.closePath(); c.fill(); break;
  case 'ciudad': mv(-.7,.6);p(-.7,-.2);p(-.4,-.2);p(-.4,-.6);p(-.1,-.6);p(-.1,-.2);p(.1,-.2);p(.1,-.75);p(.45,-.75);p(.45,-.1);p(.7,-.1);p(.7,.6); c.closePath(); c.fill(); break;
  case 'pueblo': mv(-.6,.6);p(-.6,-.05);p(0,-.6);p(.6,-.05);p(.6,.6); c.closePath(); c.fill(); break;
  case 'castillo': mv(-.7,.65);p(-.7,-.55);p(-.45,-.55);p(-.45,-.3);p(-.15,-.3);p(-.15,-.55);p(.15,-.55);p(.15,-.3);p(.45,-.3);p(.45,-.55);p(.7,-.55);p(.7,.65); c.closePath(); c.fill(); break;
  case 'mazmorra': c.arc(x,y-.1*s,.55*s,0,7); c.fill(); c.globalCompositeOperation='destination-out'; c.beginPath(); c.arc(x-.22*s,y-.12*s,.14*s,0,7); c.arc(x+.22*s,y-.12*s,.14*s,0,7); c.fill(); c.globalCompositeOperation='source-over'; c.fillRect(x-.3*s,y+.3*s,.6*s,.35*s); break;
  case 'cueva': mv(-.75,.6); c.arc(x,y+.6*s,.75*s,Math.PI,0); c.closePath(); c.fill(); break;
  case 'templo': mv(-.7,-.25);p(0,-.75);p(.7,-.25); c.closePath(); c.fill(); c.fillRect(x-.6*s,y+.45*s,1.2*s,.2*s); for(const k of [-.45,-.1,.25]) c.fillRect(x+k*s,y-.2*s,.2*s,.65*s); break;
  case 'ruina': c.fillRect(x-.6*s,y-.3*s,.25*s,.95*s); c.fillRect(x-.1*s,y+.1*s,.25*s,.55*s); c.fillRect(x+.4*s,y-.55*s,.25*s,1.2*s); break;
  case 'puerto': c.lineWidth=.16*s; c.strokeStyle=c.fillStyle; c.arc(x,y-.55*s,.17*s,0,7); mv(0,-.38);p(0,.65); mv(-.6,.15); c.quadraticCurveTo(x-.55*s,y+.7*s,x,y+.65*s); c.quadraticCurveTo(x+.55*s,y+.7*s,x+.6*s,y+.15*s); mv(-.35,-.15);p(.35,-.15); c.stroke(); break;
  case 'portal': c.lineWidth=.17*s; c.strokeStyle=c.fillStyle; c.ellipse(x,y,.45*s,.75*s,0,0,7); c.stroke(); c.beginPath(); c.ellipse(x,y,.15*s,.35*s,0,0,7); c.fill(); break;
  case 'campamento': mv(-.75,.6);p(0,-.7);p(.75,.6); c.closePath(); c.fill(); break;
  case 'taberna': c.fillRect(x-.5*s,y-.5*s,.75*s,1.1*s); c.lineWidth=.16*s; c.strokeStyle=c.fillStyle; c.beginPath(); c.arc(x+.3*s,y+.05*s,.28*s,-1.4,1.4); c.stroke(); break;
  case 'tienda': c.arc(x,y,.65*s,0,7); c.fill(); c.globalCompositeOperation='destination-out'; c.beginPath(); c.arc(x,y,.35*s,0,7); c.fill(); c.globalCompositeOperation='source-over'; break;
  case 'npc': c.arc(x,y-.3*s,.32*s,0,7); c.fill(); c.beginPath(); c.arc(x,y+.7*s,.6*s,Math.PI,0); c.fill(); break;
  case 'peligro': mv(0,-.75);p(.75,.6);p(-.75,.6); c.closePath(); c.fill(); c.globalCompositeOperation='destination-out'; c.fillRect(x-.08*s,y-.3*s,.16*s,.5*s); c.fillRect(x-.08*s,y+.3*s,.16*s,.16*s); c.globalCompositeOperation='source-over'; break;
  case 'tesoro': mv(0,-.75);p(.65,0);p(0,.75);p(-.65,0); c.closePath(); c.fill(); break;
  case 'trampa': c.lineWidth=.22*s; c.strokeStyle=c.fillStyle; mv(-.55,-.55);p(.55,.55);mv(.55,-.55);p(-.55,.55); c.stroke(); break;
  case 'puerta': mv(-.45,.7);p(-.45,-.2); c.arc(x,y-.2*s,.45*s,Math.PI,0); p(.45,.7); c.closePath(); c.fill(); break;
  default: c.arc(x,y,.45*s,0,7); c.fill();
 }
}
function drawScene(ctx,W,H,view,opt={}){
 const m=Ed.map; const css=getComputedStyle(document.documentElement); const acc=css.getPropertyValue('--acc').trim()||'#d6a44c', bg=css.getPropertyValue('--bg').trim()||'#141219', panel=css.getPropertyValue('--panel').trim()||'#211d2a', ink=css.getPropertyValue('--ink').trim()||'#eee';
 if(!opt.export){ ctx.fillStyle=bg; ctx.fillRect(0,0,W,H); }
 const {x:vx,y:vy,z}=view, cs=C*z, MW=m.w*C, MH=m.h*C;
 ctx.save(); ctx.translate(vx,vy); ctx.scale(z,z);
 if(!opt.export){ ctx.shadowColor='rgba(0,0,0,.55)'; ctx.shadowBlur=40/z; ctx.fillStyle='#000'; ctx.fillRect(0,0,MW,MH); ctx.shadowBlur=0; }
 ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high'; ctx.drawImage(Ed.terrC,0,0,MW,MH);
 const tint=planeById(m.plane||'material').tint;
 if(tint){ ctx.globalCompositeOperation=tint[1]; ctx.globalAlpha=tint[2]; ctx.fillStyle=tint[0]; ctx.fillRect(0,0,MW,MH); ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=1; }
 if(MS.showReg) ctx.drawImage(Ed.regC,0,0);
 if(MS.grid&&cs>=7){ const x0=Math.max(0,Math.floor(-vx/cs)), x1=Math.min(m.w,Math.ceil((W-vx)/cs)), y0=Math.max(0,Math.floor(-vy/cs)), y1=Math.min(m.h,Math.ceil((H-vy)/cs));
  ctx.strokeStyle=`rgba(0,0,0,${(m.level==='global'||m.level==='nacional')?(cs<14?.06:.12):(cs<14?.12:.26)})`; ctx.lineWidth=1/z; ctx.beginPath();
  for(let i=x0;i<=x1;i++){ ctx.moveTo(i*C,y0*C); ctx.lineTo(i*C,y1*C); } for(let j=y0;j<=y1;j++){ ctx.moveTo(x0*C,j*C); ctx.lineTo(x1*C,j*C); } ctx.stroke(); }
 ctx.strokeStyle=acc; ctx.lineWidth=2/z; ctx.strokeRect(0,0,MW,MH);
 ctx.restore();
 const S=(cx,cy)=>[vx+cx*cs,vy+cy*cs];
 ctx.textAlign='center'; ctx.textBaseline='middle';
 if(MS.showReg) for(const r of Ed.regLabels){ const fs=clamp(Math.sqrt(r.n)*cs*.22,9,64); if(fs<9) continue; const [sx,sy]=S(r.x,r.y);
  ctx.font=`400 ${fs}px 'Marcellus SC', Georgia, serif`; ctx.letterSpacing=(fs*.18)+'px'; ctx.lineWidth=Math.max(2,fs/7); ctx.strokeStyle='rgba(10,8,14,.7)'; ctx.strokeText(r.name.toUpperCase(),sx,sy); ctx.fillStyle=r.color; ctx.fillText(r.name.toUpperCase(),sx,sy); }
 ctx.letterSpacing='0px';
 for(const l of m.labels||[]){ const fs=Math.max(8,l.size*cs*.55); const [sx,sy]=S(l.x+.5,l.y+.5); if(sx<-300||sx>W+300||sy<-60||sy>H+60) continue;
  ctx.font=`${l.italic?'italic ':''}500 ${fs}px 'Alegreya Sans', system-ui, sans-serif`; ctx.lineWidth=Math.max(2.5,fs/5); ctx.strokeStyle='rgba(12,10,16,.82)'; ctx.strokeText(l.text,sx,sy); ctx.fillStyle='#f6efe1'; ctx.fillText(l.text,sx,sy);
  if(opt.sel===l){ const tw=ctx.measureText(l.text).width; ctx.strokeStyle=acc; ctx.lineWidth=1.5; ctx.setLineDash([4,3]); ctx.strokeRect(sx-tw/2-6,sy-fs/2-4,tw+12,fs+8); ctx.setLineDash([]); } }
 const ms=clamp(cs*.42,8,17);
 for(const k of m.markers||[]){ const [sx,sy]=S(k.x+.5,k.y+.5); if(sx<-40||sx>W+40||sy<-40||sy>H+40) continue;
  ctx.fillStyle='rgba(0,0,0,.35)'; ctx.beginPath(); ctx.arc(sx+1.5,sy+2,ms*1.25,0,7); ctx.fill();
  ctx.fillStyle=panel; ctx.strokeStyle=k.link?acc:ink; ctx.lineWidth=k.link?2.4:1.4; ctx.beginPath(); ctx.arc(sx,sy,ms*1.2,0,7); ctx.fill(); ctx.stroke();
  ctx.fillStyle=acc; iconPath(ctx,k.kind,sx,sy,ms*.78);
  if(opt.sel===k){ ctx.strokeStyle=acc; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(sx,sy,ms*1.2+5,0,7); ctx.stroke(); }
  if(k.name&&cs>=10){ const fs=clamp(cs*.42,10,16); ctx.font=`600 ${fs}px 'Alegreya Sans', system-ui, sans-serif`; ctx.lineWidth=3; ctx.strokeStyle='rgba(12,10,16,.85)'; ctx.strokeText(k.name,sx,sy+ms*1.2+fs*.75); ctx.fillStyle='#f6efe1'; ctx.fillText(k.name,sx,sy+ms*1.2+fs*.75); } }
 if(opt.export) return;
 if(Ed.hover&&['pincel','region','rellenar','etiqueta','marcador'].includes(MS.tool)){ const b=['pincel','region'].includes(MS.tool)?MS.brush:1, o=Math.floor((b-1)/2); const [sx,sy]=S(Ed.hover.x-o,Ed.hover.y-o);
  ctx.strokeStyle=acc; ctx.lineWidth=1.5; ctx.strokeRect(sx,sy,b*cs,b*cs); }
 if(Ed.ruler){ const [ax,ay]=S(Ed.ruler.a.x+.5,Ed.ruler.a.y+.5), [bx,by]=S(Ed.ruler.b.x+.5,Ed.ruler.b.y+.5);
  ctx.strokeStyle=acc; ctx.lineWidth=2.5; ctx.setLineDash([8,6]); ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle=acc; for(const [px,py] of [[ax,ay],[bx,by]]){ ctx.beginPath(); ctx.arc(px,py,5,0,7); ctx.fill(); }
  const t=rulerText(); ctx.font="600 13px 'IBM Plex Mono', monospace"; const tw=ctx.measureText(t).width; const lx=(ax+bx)/2, ly=(ay+by)/2-20;
  ctx.fillStyle=panel; ctx.strokeStyle=acc; ctx.lineWidth=1; ctx.beginPath(); ctx.roundRect?ctx.roundRect(lx-tw/2-10,ly-13,tw+20,26,8):ctx.rect(lx-tw/2-10,ly-13,tw+20,26); ctx.fill(); ctx.stroke(); ctx.fillStyle=ink; ctx.fillText(t,lx,ly); }
 if(cs>=16){ ctx.font="500 10px 'IBM Plex Mono', monospace"; ctx.fillStyle=css.getPropertyValue('--ink3').trim();
  const step=cs<24?2:1; for(let i=0;i<m.w;i+=step){ const sx=vx+(i+.5)*cs; if(sx<20||sx>W) continue; ctx.fillText(colName(i),sx,Math.max(8,vy-9)); }
  ctx.textAlign='right'; for(let j=0;j<m.h;j+=step){ const sy=vy+(j+.5)*cs; if(sy<20||sy>H) continue; ctx.fillText(String(j+1),Math.max(22,vx-6),sy); } ctx.textAlign='center'; }
}
function rulerText(){ const m=Ed.map, a=Ed.ruler.a, b=Ed.ruler.b, dx=Math.abs(a.x-b.x), dy=Math.abs(a.y-b.y);
 if(m.level==='minimo'){ const n=Math.max(dx,dy), d=n*(m.scale||1.5); return `${n} casillas · ${d.toLocaleString('es',{maximumFractionDigits:1})} ${m.unit||'m'}${(m.unit||'m')==='m'?` (${Math.round(d/0.3048)} pies)`:''}`; }
 const d=Math.hypot(dx,dy)*(m.scale||5); const km=(m.unit||'km')==='km'?d:(m.unit==='mi'?d*1.609:d/1000);
 return `${d.toLocaleString('es',{maximumFractionDigits:1})} ${m.unit||'km'} · ${(km/38).toLocaleString('es',{maximumFractionDigits:1})} días a ritmo normal`; }
function requestDraw(){ if(Ed.raf) return; Ed.raf=requestAnimationFrame(()=>{ Ed.raf=0; if(!Ed.cv||!Ed.map) return; const W=Ed.cv.clientWidth,H=Ed.cv.clientHeight; Ed.ctx.setTransform(Ed.dpr,0,0,Ed.dpr,0,0); drawScene(Ed.ctx,W,H,Ed.view,{sel:Ed.sel}); }); }
function fitView(){ if(!Ed.cv||!Ed.map) return; const W=Ed.cv.clientWidth,H=Ed.cv.clientHeight, m=Ed.map; const z=Math.min((W-60)/(m.w*C),(H-80)/(m.h*C)); Ed.view={z,x:(W-m.w*C*z)/2,y:(H-m.h*C*z)/2+10}; requestDraw(); }
function zoomAt(sx,sy,f){ const v=Ed.view, nz=clamp(v.z*f,.05,4); v.x=sx-(sx-v.x)*(nz/v.z); v.y=sy-(sy-v.y)*(nz/v.z); v.z=nz; requestDraw(); }
const cellAt=(sx,sy)=>{ const cs=C*Ed.view.z; return {x:Math.floor((sx-Ed.view.x)/cs),y:Math.floor((sy-Ed.view.y)/cs)}; };
const inMap=p=>p&&p.x>=0&&p.y>=0&&p.x<Ed.map.w&&p.y<Ed.map.h;
function setCells(layer,cx,cy,ch,size){ const m=Ed.map, o=Math.floor((size-1)/2); let s=m[layer].split(''), ch2=false;
 for(let j=0;j<size;j++) for(let i=0;i<size;i++){ const x=cx-o+i, y=cy-o+j; if(x<0||y<0||x>=m.w||y>=m.h) continue; const k=y*m.w+x; if(s[k]!==ch){ s[k]=ch; ch2=true; } }
 if(!ch2) return; m[layer]=s.join('');
 if(layer==='t'){ const tc=Ed.terrC.getContext('2d'); for(let j=0;j<size;j++) for(let i=0;i<size;i++){ const x=cx-o+i,y=cy-o+j; if(x>=0&&y>=0&&x<m.w&&y<m.h) drawCell(tc,m,x,y); } }
 else rebuildRegions();
 requestDraw(); }
function lineCells(a,b,fn){ let x0=a.x,y0=a.y; const x1=b.x,y1=b.y,dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1; let err=dx+dy; for(let n=0;n<500;n++){ fn(x0,y0); if(x0===x1&&y0===y1) break; const e2=2*err; if(e2>=dy){err+=dy;x0+=sx;} if(e2<=dx){err+=dx;y0+=sy;} } }
function flood(cx,cy,ch){ const m=Ed.map, w=m.w, s=m.t.split(''), from=s[cy*w+cx]; if(from===ch) return; const st=[cy*w+cx];
 while(st.length){ const k=st.pop(); if(s[k]!==from) continue; s[k]=ch; const x=k%w,y=(k/w)|0; if(x>0) st.push(k-1); if(x<w-1) st.push(k+1); if(y>0) st.push(k-w); if(y<m.h-1) st.push(k+w); }
 m.t=s.join(''); rebuildTerrain(); requestDraw(); }
function pushUndo(){ const m=Ed.map; Ed.undo.push({t:m.t,r:m.r,labels:clone(m.labels||[]),markers:clone(m.markers||[])}); if(Ed.undo.length>40) Ed.undo.shift(); }
function doUndo(){ const u=Ed.undo.pop(); if(!u){ toast('No hay nada que deshacer.'); return; } Object.assign(Ed.map,u); rebuildTerrain(); rebuildRegions(); saveMap(); requestDraw(); }
function saveMap(ms=900){ if(Ed.map) Store.put('maps',Ed.map,ms); }
function hitTest(sx,sy){ const m=Ed.map, cs=C*Ed.view.z, ms=clamp(cs*.42,8,17)*1.3;
 for(const k of [...(m.markers||[])].reverse()){ const px=Ed.view.x+(k.x+.5)*cs, py=Ed.view.y+(k.y+.5)*cs; if(Math.hypot(px-sx,py-sy)<=ms+4) return {type:'marker',o:k}; }
 const ctx=Ed.ctx; for(const l of [...(m.labels||[])].reverse()){ const fs=Math.max(8,l.size*cs*.55); ctx.font=`500 ${fs}px 'Alegreya Sans', system-ui`; const tw=ctx.measureText(l.text).width; const px=Ed.view.x+(l.x+.5)*cs, py=Ed.view.y+(l.y+.5)*cs; if(Math.abs(sx-px)<=tw/2+6&&Math.abs(sy-py)<=fs/2+5) return {type:'label',o:l}; }
 return null; }

function vMapas(v){
 v.className='view full';
 v.innerHTML=`<div class="mapwrap"><aside class="mapside" id="mside"></aside><div class="mapstage" id="stage"><canvas id="mcv" aria-label="Lienzo del mapa"></canvas><div class="crumbs" id="crumbs"></div>
  <div class="mapctl"><button class="btn icon" id="zin" title="Acercar" aria-label="Acercar">${I.plus}</button><button class="btn icon" id="zout" title="Alejar" aria-label="Alejar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M5 12h14"/></svg></button><button class="btn icon" id="zfit" title="Encuadrar" aria-label="Encuadrar">${I.eye}</button><button class="btn icon" id="tgrid" title="Cuadrícula" aria-label="Mostrar u ocultar cuadrícula">${I.grid}</button><button class="btn icon" id="treg" title="Regiones" aria-label="Mostrar u ocultar regiones">${I.layers}</button><button class="btn icon" id="mundo" title="Deshacer (Ctrl+Z)" aria-label="Deshacer">${I.undo}</button><button class="btn icon" id="mexp" title="Exportar PNG" aria-label="Exportar imagen">${I.down}</button></div>
  <div class="mapinfo" id="minfo">Elige o crea un mapa</div><div id="mempty"></div></div></div>`;
 const cv=$('#mcv'); Ed.cv=cv; Ed.ctx=cv.getContext('2d'); Ed.sel=null; Ed.ruler=null;
 const resize=()=>{ Ed.dpr=Math.min(devicePixelRatio||1,2); cv.width=cv.clientWidth*Ed.dpr; cv.height=cv.clientHeight*Ed.dpr; requestDraw(); };
 const ro=new ResizeObserver(resize); ro.observe($('#stage'));
 openMap(MS.open,true);
 const unsub=Store.on((c,o)=>{ if(c!=='maps'||o!=='remote') return; const cur=MS.open&&Store.get('maps',MS.open);
  if(MS.open&&!cur){ MS.open=null; openMap(null); return; }
  if(cur&&cur!==Ed.map&&!Ed.drag){ Ed.map=cur; rebuildTerrain(); rebuildRegions(); requestDraw(); } sideRender(); });
 // Interacción
 const pos=e=>{ const r=cv.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top}; };
 cv.addEventListener('contextmenu',e=>e.preventDefault());
 cv.addEventListener('pointerdown',e=>{ if(!Ed.map) return; cv.setPointerCapture(e.pointerId); const p=pos(e); Ed.ptrs.set(e.pointerId,p); closePop();
  if(Ed.ptrs.size===2){ const [a,b]=[...Ed.ptrs.values()]; Ed.pinch={d:Math.hypot(a.x-b.x,a.y-b.y),cx:(a.x+b.x)/2,cy:(a.y+b.y)/2,v:{...Ed.view}}; Ed.drag=null; return; }
  const pan=e.button===1||e.button===2||Ed.space||MS.tool==='mover'; const cell=cellAt(p.x,p.y);
  Ed.drag={mode:pan?'pan':MS.tool,sx:p.x,sy:p.y,vx:Ed.view.x,vy:Ed.view.y,moved:false,last:cell,button:e.button};
  if(pan) { cv.style.cursor='grabbing'; return; }
  if(!inMap(cell)&&MS.tool!=='regla') return;
  if(MS.tool==='pincel'){ pushUndo(); setCells('t',cell.x,cell.y,MS.ter[Ed.map.level],MS.brush); }
  else if(MS.tool==='region'){ pushUndo(); setCells('r',cell.x,cell.y,MS.reg<0?'.':String.fromCharCode(65+MS.reg),MS.brush); }
  else if(MS.tool==='rellenar'){ pushUndo(); flood(cell.x,cell.y,MS.ter[Ed.map.level]); saveMap(); }
  else if(MS.tool==='regla'){ Ed.ruler={a:cell,b:cell}; requestDraw(); } });
 cv.addEventListener('pointermove',e=>{ if(!Ed.map) return; const p=pos(e); if(Ed.ptrs.has(e.pointerId)) Ed.ptrs.set(e.pointerId,p);
  if(Ed.pinch&&Ed.ptrs.size===2){ const [a,b]=[...Ed.ptrs.values()]; const d=Math.hypot(a.x-b.x,a.y-b.y), cx=(a.x+b.x)/2, cy=(a.y+b.y)/2; const pv=Ed.pinch.v, nz=clamp(pv.z*d/Ed.pinch.d,.05,4);
   Ed.view={z:nz,x:cx-(Ed.pinch.cx-pv.x)*(nz/pv.z),y:cy-(Ed.pinch.cy-pv.y)*(nz/pv.z)}; requestDraw(); return; }
  const cell=cellAt(p.x,p.y); const changed=!Ed.hover||Ed.hover.x!==cell.x||Ed.hover.y!==cell.y; Ed.hover=inMap(cell)?cell:null;
  if(changed) info(cell);
  const d=Ed.drag; if(d){ if(Math.hypot(p.x-d.sx,p.y-d.sy)>4) d.moved=true;
   if(d.mode==='pan'){ Ed.view.x=d.vx+p.x-d.sx; Ed.view.y=d.vy+p.y-d.sy; }
   else if((d.mode==='pincel'||d.mode==='region')&&changed){ const ch=d.mode==='pincel'?MS.ter[Ed.map.level]:(MS.reg<0?'.':String.fromCharCode(65+MS.reg)); lineCells(d.last,cell,(x,y)=>setCells(d.mode==='pincel'?'t':'r',x,y,ch,MS.brush)); d.last=cell; }
   else if(d.mode==='regla'&&Ed.ruler){ Ed.ruler.b=cell; } }
  if(changed||d) requestDraw(); });
 const up=e=>{ Ed.ptrs.delete(e.pointerId); if(Ed.ptrs.size<2) Ed.pinch=null; const d=Ed.drag; Ed.drag=null; cv.style.cursor=''; if(!d||!Ed.map) return; const p=pos(e);
  if(d.mode==='pan'&&!d.moved&&MS.tool==='mover'&&d.button===0){ const h=hitTest(p.x,p.y); if(h){ Ed.sel=h.o; h.type==='marker'?markerPop(h.o,p):labelPop(h.o,p); } else { Ed.sel=null; } requestDraw(); }
  else if(d.mode==='pincel'||d.mode==='region'){ saveMap(); }
  else if((d.mode==='etiqueta'||d.mode==='marcador')&&!d.moved){ const h=hitTest(p.x,p.y); const cell=cellAt(p.x,p.y);
   if(h){ Ed.sel=h.o; h.type==='marker'?markerPop(h.o,p):labelPop(h.o,p); }
   else if(inMap(cell)){ pushUndo(); if(d.mode==='etiqueta'){ const l={id:uid(),x:cell.x,y:cell.y,text:'Nuevo nombre',size:Ed.map.level==='global'?2:1.3,italic:false}; (Ed.map.labels=Ed.map.labels||[]).push(l); Ed.sel=l; labelPop(l,p,true); }
    else { const k={id:uid(),x:cell.x,y:cell.y,kind:MS.mk[Ed.map.level],name:'',note:'',link:null}; (Ed.map.markers=Ed.map.markers||[]).push(k); Ed.sel=k; markerPop(k,p,true); } saveMap(400); }
   requestDraw(); }
  else if(d.mode==='regla'){ /* la regla queda visible hasta el siguiente clic */ } };
 cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
 cv.addEventListener('pointerleave',()=>{ Ed.hover=null; requestDraw(); });
 cv.addEventListener('wheel',e=>{ if(!Ed.map) return; e.preventDefault(); const p=pos(e); const f=e.ctrlKey?Math.exp(-e.deltaY*.01):(e.deltaY<0?1.15:1/1.15); zoomAt(p.x,p.y,f); },{passive:false});
 const key=e=>{ if(route!=='mapas'||$('.modal-bg')||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
  if(e.code==='Space'){ Ed.space=e.type==='keydown'; if(Ed.space) e.preventDefault(); return; } if(e.type!=='keydown') return;
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){ e.preventDefault(); doUndo(); return; }
  if(e.key==='Delete'||e.key==='Backspace'){ if(Ed.sel){ Ed.map.markers=(Ed.map.markers||[]).filter(k=>k!==Ed.sel); Ed.map.labels=(Ed.map.labels||[]).filter(k=>k!==Ed.sel); Ed.sel=null; closePop(); saveMap(300); requestDraw(); } return; }
  const t={v:'mover',b:'pincel',f:'rellenar',r:'region',t:'etiqueta',m:'marcador',g:'regla'}[e.key.toLowerCase()]; if(t&&Ed.map&&!e.ctrlKey&&!e.metaKey){ MS.tool=t; Ed.ruler=null; sideRender(); requestDraw(); } };
 document.addEventListener('keydown',key); document.addEventListener('keyup',key);
 $('#zin').onclick=()=>zoomAt(cv.clientWidth/2,cv.clientHeight/2,1.3); $('#zout').onclick=()=>zoomAt(cv.clientWidth/2,cv.clientHeight/2,1/1.3); $('#zfit').onclick=fitView;
 $('#tgrid').onclick=()=>{ MS.grid=!MS.grid; requestDraw(); }; $('#treg').onclick=()=>{ MS.showReg=!MS.showReg; requestDraw(); };
 $('#mundo').onclick=()=>Ed.map&&doUndo(); $('#mexp').onclick=exportMap;
 cleanup=()=>{ ro.disconnect(); unsub(); document.removeEventListener('keydown',key); document.removeEventListener('keyup',key); if(Ed.map) Store.put('maps',Ed.map,0); Ed.cv=null; Ed.map=null; closePop(); };
}
function info(cell){ const el=$('#minfo'); if(!el||!Ed.map) return; const m=Ed.map; if(!inMap(cell)){ el.textContent=`${m.name} · ${m.w}×${m.h} casillas · 1 casilla = ${String(m.scale).replace('.',',')} ${m.unit}`; return; }
 const t=lvT()[m.t[cell.y*m.w+cell.x]], rk=m.r[cell.y*m.w+cell.x], rg=rk!=='.'?m.regions[rk.charCodeAt(0)-65]:null;
 el.textContent=`${colName(cell.x)}${cell.y+1} · ${t?t.name:'—'}${rg?' · '+rg.name:''}`; }
function openMap(id,first){
 const m=id&&Store.get('maps',id);
 if(m&&(m.plane||'material')!==curPlane) { MS.open=null; return openMap(null); }
 MS.open=m?m.id:null; Ed.map=m||null; Ed.undo=[]; Ed.sel=null; Ed.ruler=null; closePop();
 if(m){ MS.level=m.level; if(!m.r||m.r.length!==m.w*m.h) m.r='.'.repeat(m.w*m.h); m.regions=m.regions||[]; rebuildTerrain(); rebuildRegions(); setTimeout(fitView,first?30:0); info({x:-1,y:-1}); }
 const em=$('#mempty'); if(em) em.innerHTML=m?'':`<div style="position:absolute;inset:0;display:grid;place-items:center;padding:20px"><div class="empty" style="max-width:420px;background:var(--panel)"><div class="h3">${Store.list('maps').some(x=>(x.plane||'material')===curPlane&&x.level===MS.level)?'Elige un mapa de la lista':'Crea tu primer mapa '+LEVELS[MS.level].name.toLowerCase()}</div>${LEVELS[MS.level].desc}. Cada mapa pertenece al plano activo: ${esc(planeById(curPlane).name)}.<div style="margin-top:12px"><button class="btn pri" id="mnew2">${I.plus} Nuevo mapa ${LEVELS[MS.level].name.toLowerCase()}</button></div></div></div>`;
 $('#mnew2')?.addEventListener('click',()=>newMapDialog());
 crumbs(); sideRender(); requestDraw();
}
function crumbs(){ const el=$('#crumbs'); if(!el) return; if(!Ed.map){ el.innerHTML=''; return; } const chain=[]; let m=Ed.map, g=0; while(m&&g++<6){ chain.unshift(m); m=m.parent&&Store.get('maps',m.parent); }
 el.innerHTML=chain.map(c=>`<button data-open="${c.id}">${esc(c.name)}</button>`).join(`<span class="muted">›</span>`); el.onclick=e=>{ const b=e.target.closest('[data-open]'); if(b&&b.dataset.open!==MS.open){ saveMap(0); openMap(b.dataset.open); } }; }
function thumb(m){ const cv=document.createElement('canvas'); cv.width=m.w; cv.height=m.h; const c=cv.getContext('2d'); const img=c.createImageData(m.w,m.h); const T=TL[m.level];
 for(let i=0;i<m.w*m.h;i++){ const d=T[m.t[i]]; const n=parseInt((d?d.c:'#000000').slice(1),16); img.data[i*4]=n>>16; img.data[i*4+1]=n>>8&255; img.data[i*4+2]=n&255; img.data[i*4+3]=255; } c.putImageData(img,0,0); return cv.toDataURL(); }
function sideRender(){
 const s=$('#mside'); if(!s) return; const m=Ed.map, lv=MS.level;
 const maps=Store.list('maps').filter(x=>(x.plane||'material')===curPlane&&x.level===lv).sort((a,b)=>a.name.localeCompare(b.name));
 const tools=[['mover','Mover',I.hand,'V'],['pincel','Pincel',I.brush,'B'],['rellenar','Rellenar',I.fill,'F'],['region','Región',I.region,'R'],['etiqueta','Texto',I.label,'T'],['marcador','Lugar',I.pin,'M'],['regla','Regla',I.ruler,'G']];
 s.innerHTML=`<div><span class="eyebrow">${esc(planeById(curPlane).name)}</span><div class="lvl-tabs" style="margin-top:6px">${Object.entries(LEVELS).map(([k,l])=>`<button data-lv="${k}" class="${k===lv?'on':''}">${l.name}</button>`).join('')}</div></div>
 <div class="maplist">${maps.map(x=>`<div class="li ${x.id===MS.open?'on':''}" data-open="${x.id}"><img alt="" src="${thumb(x)}" style="width:44px;height:28px;border-radius:4px;image-rendering:pixelated;object-fit:cover;flex:none"><span class="nm">${esc(x.name)}</span>${x.parent?'<span class="tag">sub</span>':''}</div>`).join('')||'<small class="muted">No hay mapas de este nivel en este plano.</small>'}
  <button class="btn sm" id="mnew" style="margin-top:4px">${I.plus} Nuevo mapa ${LEVELS[lv].name.toLowerCase()}</button></div>
 ${m?`<div><span class="eyebrow">Herramientas</span><div class="tools" style="margin-top:6px">${tools.map(t=>`<button class="tool ${MS.tool===t[0]?'on':''}" data-tool="${t[0]}" title="${t[1]} (${t[3]})">${t[2]}${t[1]}</button>`).join('')}<button class="tool" id="mundo2" title="Deshacer (Ctrl+Z)">${I.undo}Deshacer</button></div></div>
  ${['pincel','region'].includes(MS.tool)?`<div class="row" style="gap:6px"><small class="muted">Tamaño</small>${[1,2,3,5,8].map(n=>`<span class="chip ${MS.brush===n?'on':''}" data-br="${n}">${n}</span>`).join('')}</div>`:''}
  ${['pincel','rellenar'].includes(MS.tool)?`<div><span class="eyebrow">Terreno</span><div class="swatches" style="margin-top:6px">${TERR[m.level].map(([k,n,c])=>`<button class="sw ${MS.ter[m.level]===k?'on':''}" data-ter="${k}"><i style="background:${c}"></i><span>${n}</span></button>`).join('')}</div></div>`:''}
  ${MS.tool==='region'?`<div><span class="eyebrow">Regiones y zonas</span><div style="display:flex;flex-direction:column;gap:5px;margin-top:6px">${m.regions.map((r,i)=>`<div class="sw ${MS.reg===i?'on':''}" data-reg="${i}" style="cursor:pointer"><i style="background:${r.color}"></i><input class="inp" data-rn="${i}" value="${esc(r.name)}" style="padding:3px 6px;font-size:.82rem" aria-label="Nombre de la región"><button class="btn ghost icon sm" data-rdel="${i}" aria-label="Eliminar región">${I.x}</button></div>`).join('')}
   <button class="sw ${MS.reg<0?'on':''}" data-reg="-1"><i style="background:transparent;border:1px dashed var(--line2)"></i><span>Borrar región</span></button><button class="btn sm" id="radd">${I.plus} Nueva región</button></div></div>`:''}
  ${MS.tool==='marcador'?`<div><span class="eyebrow">Tipo de lugar</span><div class="swatches" style="margin-top:6px">${MARK[m.level].map(([k,n])=>`<button class="sw ${MS.mk[m.level]===k?'on':''}" data-mk="${k}"><canvas width="32" height="32" data-ico="${k}" style="width:16px;height:16px"></canvas><span>${n}</span></button>`).join('')}</div><small class="muted" style="display:block;margin-top:6px">Clic en el mapa para colocar. Un lugar puede abrir un submapa.</small></div>`:''}
  ${MS.tool==='regla'?`<small class="muted">Arrastra para medir. ${m.level==='minimo'?'En mapas mínimos cada diagonal cuenta como una casilla.':'Incluye días de viaje a ritmo normal (unos 38 km por día).'}</small>`:''}
  ${MS.tool==='mover'?`<small class="muted">Arrastra para desplazarte. Clic en un lugar o texto para editarlo; Supr lo elimina. Rueda o pellizco para zoom.</small>`:''}
  <hr class="rule" style="margin:4px 0"><div style="display:flex;flex-direction:column;gap:8px"><span class="eyebrow">Este mapa</span>
   <input class="inp" id="mname" value="${esc(m.name)}" aria-label="Nombre del mapa">
   <div class="row" style="flex-wrap:nowrap;gap:6px"><small class="muted" style="white-space:nowrap">1 casilla =</small><input class="inp mono" id="mscale" type="number" step="0.1" min="0.1" value="${m.scale}" style="width:80px" aria-label="Escala"><select class="sel" id="munit" style="width:auto" aria-label="Unidad">${['m','km','mi','pies'].map(u=>`<option ${u===m.unit?'selected':''}>${u}</option>`).join('')}</select></div>
   <div class="row" style="flex-wrap:nowrap;gap:6px"><input class="inp mono" id="mw" type="number" min="8" max="120" value="${m.w}" style="width:68px" aria-label="Ancho"><span class="muted">×</span><input class="inp mono" id="mh" type="number" min="8" max="120" value="${m.h}" style="width:68px" aria-label="Alto"><button class="btn sm" id="mres">Redimensionar</button></div>
   <select class="sel" id="mplane" aria-label="Plano del mapa">${PLANES.map(p=>`<option value="${p.id}" ${p.id===(m.plane||'material')?'selected':''}>${p.name}</option>`).join('')}</select>
   <div class="row" style="gap:6px"><button class="btn sm" id="mgen">${I.wand} Generar terreno</button><button class="btn sm danger" id="mdel">${I.trash} Eliminar</button></div></div>`:''}`;
 $$('canvas[data-ico]',s).forEach(c=>{ const x=c.getContext('2d'); x.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--acc'); iconPath(x,c.dataset.ico,16,16,13); });
 s.onclick=e=>{ const t=e.target;
  const lvb=t.closest('[data-lv]'); if(lvb){ MS.level=lvb.dataset.lv; if(Ed.map&&Ed.map.level===MS.level){ sideRender(); return; } if(Ed.map) saveMap(0); openMap(null); return; }
  const o=t.closest('[data-open]'); if(o){ if(Ed.map) saveMap(0); openMap(o.dataset.open); return; }
  if(t.closest('#mnew')){ newMapDialog(); return; }
  const tl=t.closest('[data-tool]'); if(tl){ MS.tool=tl.dataset.tool; Ed.ruler=null; Ed.sel=null; closePop(); sideRender(); requestDraw(); return; }
  if(t.closest('#mundo2')){ doUndo(); return; }
  const br=t.closest('[data-br]'); if(br){ MS.brush=+br.dataset.br; sideRender(); return; }
  const te=t.closest('[data-ter]'); if(te){ MS.ter[Ed.map.level]=te.dataset.ter; sideRender(); return; }
  const rd=t.closest('[data-rdel]'); if(rd){ const i=+rd.dataset.rdel; pushUndo(); const ch=String.fromCharCode(65+i); Ed.map.regions.splice(i,1);
   Ed.map.r=Ed.map.r.split('').map(c=>c==='.'?c:c===ch?'.':c>ch?String.fromCharCode(c.charCodeAt(0)-1):c).join(''); MS.reg=Math.min(MS.reg,Ed.map.regions.length-1); rebuildRegions(); saveMap(); sideRender(); requestDraw(); return; }
  const rg=t.closest('[data-reg]'); if(rg&&!t.matches('input')){ MS.reg=+rg.dataset.reg; sideRender(); return; }
  if(t.closest('#radd')){ if(Ed.map.regions.length>=26) return toast('Máximo 26 regiones por mapa.'); const n=Ed.map.regions.length; Ed.map.regions.push({name:(Ed.map.level==='global'?'Reino ':Ed.map.level==='nacional'?'Comarca ':'Barrio ')+(n+1),color:REGION_COLORS[n%REGION_COLORS.length]}); MS.reg=n; saveMap(); sideRender(); return; }
  const mk=t.closest('[data-mk]'); if(mk){ MS.mk[Ed.map.level]=mk.dataset.mk; sideRender(); return; }
  if(t.closest('#mres')){ const w=clamp(+$('#mw').value||Ed.map.w,8,120), h=clamp(+$('#mh').value||Ed.map.h,8,120); resizeMap(w,h); return; }
  if(t.closest('#mgen')){ confirmBox('¿Generar terreno nuevo? Reemplaza el terreno actual (puedes deshacer).',()=>{ pushUndo(); Ed.map.t=generateTerrain(Ed.map,(Math.random()*1e6)|0); rebuildTerrain(); saveMap(); requestDraw(); sideRender(); },'Generar'); return; }
  if(t.closest('#mdel')){ confirmBox(`¿Eliminar el mapa "${Ed.map.name}"? Los submapas se conservan.`,()=>{ const id=Ed.map.id; Ed.map=null; Store.del('maps',id); openMap(null); }); return; }
 };
 const nm=$('#mname',s); if(nm) nm.oninput=e=>{ Ed.map.name=e.target.value||'Sin nombre'; saveMap(); crumbs(); };
 $('#mscale',s)?.addEventListener('change',e=>{ Ed.map.scale=Number(e.target.value)||1; saveMap(); info({x:-1,y:-1}); });
 $('#munit',s)?.addEventListener('change',e=>{ Ed.map.unit=e.target.value; saveMap(); info({x:-1,y:-1}); });
 $('#mplane',s)?.addEventListener('change',e=>{ Ed.map.plane=e.target.value; saveMap(0); toast(`Mapa movido a ${planeById(e.target.value).name}.`); openMap(null); counts(); });
 $$('[data-rn]',s).forEach(i=>i.oninput=()=>{ Ed.map.regions[+i.dataset.rn].name=i.value; rebuildRegions(); saveMap(); requestDraw(); });
}
function resizeMap(w,h){ const m=Ed.map; pushUndo(); const base=LEVELS[m.level].base; let t='',r='';
 for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const ok=x<m.w&&y<m.h; t+=ok?m.t[y*m.w+x]:base; r+=ok?m.r[y*m.w+x]:'.'; }
 m.w=w; m.h=h; m.t=t; m.r=r; m.labels=(m.labels||[]).filter(l=>l.x<w&&l.y<h); m.markers=(m.markers||[]).filter(k=>k.x<w&&k.y<h);
 rebuildTerrain(); rebuildRegions(); saveMap(); fitView(); sideRender(); }
function newMapDialog(parent,fromMarker){
 const lv=parent?childFor(parent.level,fromMarker&&fromMarker.kind):MS.level, L=LEVELS[lv];
 const md=modal({title:'Nuevo mapa '+L.name.toLowerCase(),body:`<p class="muted" style="margin:0">${L.desc}. Se crea en ${esc(planeById(curPlane).name)}.</p>
  <div class="grid2">${fld('Nombre','name',fromMarker?.name||(lv==='global'?'Mundo conocido':lv==='nacional'?'Nueva región':lv==='mazmorra'?'Nueva mazmorra':'Nuevo pueblo'))}${sel('Nivel','level',lv,Object.entries(LEVELS).map(([k,l])=>[k,l.name]))}</div>
  <div class="grid3">${fld('Ancho (casillas)','w',L.w,'number','min="8" max="120"')}${fld('Alto (casillas)','h',L.h,'number','min="8" max="120"')}${fld(`Escala (${L.unit} por casilla)`,'scale',L.scale,'number','step="0.1" min="0.1"')}</div>
  <label class="chip" style="cursor:pointer;width:max-content"><input type="checkbox" name="gen" checked> ${lv==='mazmorra'?'Generar salas y pasillos para empezar':lv==='minimo'?'Generar un pueblo para empezar':'Generar terreno procedural para empezar'}</label>`,
  foot:`<button class="btn" data-c>Cancelar</button><button class="btn pri" data-s>${I.plus} Crear</button>`});
 $('[data-c]',md.el).onclick=md.close;
 $('[data-s]',md.el).onclick=()=>{ const f=vals(md.el); const level=f.level; const w=clamp(f.w||LEVELS[level].w,8,120), h=clamp(f.h||LEVELS[level].h,8,120);
  const m={id:'map-'+uid(),name:f.name||'Mapa',level,plane:curPlane,w,h,scale:f.scale||LEVELS[level].scale,unit:LEVELS[level].unit,t:LEVELS[level].base.repeat(w*h),r:'.'.repeat(w*h),regions:[],labels:[],markers:[],parent:parent?.id||null,created:Date.now()};
  if(f.gen) m.t=generateTerrain(m,(Math.random()*1e6)|0);
  Store.put('maps',m); if(fromMarker&&parent){ fromMarker.link=m.id; Store.put('maps',parent); } md.close(); MS.level=level; if(Ed.map) saveMap(0); openMap(m.id); toast(`Mapa "${m.name}" creado.`); counts(); };
}
let popEl=null;
function closePop(){ if(popEl){ popEl.remove(); popEl=null; } }
function placePop(el,p){ const st=$('#stage'); st.append(el); const W=st.clientWidth,H=st.clientHeight; el.style.left=clamp(p.x+16,8,W-el.offsetWidth-8)+'px'; el.style.top=clamp(p.y-20,8,H-el.offsetHeight-8)+'px'; popEl=el; }
function markerPop(k,p,isNew){
 closePop(); const m=Ed.map, child=childFor(m.level,k.kind); const linked=k.link&&Store.get('maps',k.link);
 const el=document.createElement('div'); el.className='pop';
 el.innerHTML=`<input class="inp" id="kn" placeholder="Nombre del lugar" value="${esc(k.name)}" aria-label="Nombre del lugar"><select class="sel" id="kk" aria-label="Tipo">${MARK[m.level].map(([v,t])=>`<option value="${v}" ${v===k.kind?'selected':''}>${t}</option>`).join('')}</select>
  <textarea class="inp" id="knote" rows="3" placeholder="Notas: quién vive aquí, qué esconde…" aria-label="Notas">${esc(k.note||'')}</textarea>
  ${child?(linked?`<button class="btn sm pri" id="kgo">${I.map} Abrir ${esc(linked.name)}</button>`:`<button class="btn sm" id="ksub">${I.plus} Crear mapa ${LEVELS[child].name.toLowerCase()} aquí</button>`):''}
  <div class="row" style="justify-content:space-between"><button class="btn sm danger" id="kdel">${I.trash} Quitar</button><button class="btn sm pri" id="kok">Listo</button></div>`;
 placePop(el,p); if(isNew) setTimeout(()=>$('#kn',el).focus(),30);
 const sync=()=>{ k.name=$('#kn',el).value; k.kind=$('#kk',el).value; k.note=$('#knote',el).value; saveMap(600); requestDraw(); };
 el.addEventListener('input',sync); el.addEventListener('change',sync);
 $('#kn',el).onkeydown=e=>{ if(e.key==='Enter'){ closePop(); } };
 $('#kok',el).onclick=()=>{ sync(); closePop(); Ed.sel=null; requestDraw(); };
 $('#kdel',el).onclick=()=>{ m.markers=m.markers.filter(x=>x!==k); Ed.sel=null; closePop(); saveMap(300); requestDraw(); };
 $('#kgo',el)?.addEventListener('click',()=>{ saveMap(0); openMap(linked.id); });
 $('#ksub',el)?.addEventListener('click',()=>{ sync(); closePop(); newMapDialog(m,k); });
}
function labelPop(l,p,isNew){
 closePop(); const el=document.createElement('div'); el.className='pop';
 el.innerHTML=`<input class="inp" id="ln" value="${esc(l.text)}" aria-label="Texto"><div class="row" style="gap:6px"><small class="muted">Tamaño</small>${[1,1.3,2,3,4].map(s=>`<span class="chip ${l.size===s?'on':''}" data-ls="${s}">${s===1?'S':s===1.3?'M':s===2?'L':s===3?'XL':'XXL'}</span>`).join('')}<label class="chip" style="cursor:pointer"><input type="checkbox" id="lit" ${l.italic?'checked':''}> Cursiva</label></div>
  <div class="row" style="justify-content:space-between"><button class="btn sm danger" id="ldel">${I.trash} Quitar</button><button class="btn sm pri" id="lok">Listo</button></div>`;
 placePop(el,p); if(isNew) setTimeout(()=>{ const i=$('#ln',el); i.focus(); i.select(); },30);
 $('#ln',el).oninput=e=>{ l.text=e.target.value; saveMap(600); requestDraw(); };
 $('#ln',el).onkeydown=e=>{ if(e.key==='Enter') closePop(); };
 $('#lit',el).onchange=e=>{ l.italic=e.target.checked; saveMap(); requestDraw(); };
 $$('[data-ls]',el).forEach(c=>c.onclick=()=>{ l.size=+c.dataset.ls; $$('[data-ls]',el).forEach(x=>x.classList.toggle('on',x===c)); saveMap(); requestDraw(); });
 $('#lok',el).onclick=()=>{ if(!l.text.trim()) Ed.map.labels=Ed.map.labels.filter(x=>x!==l); closePop(); Ed.sel=null; saveMap(300); requestDraw(); };
 $('#ldel',el).onclick=()=>{ Ed.map.labels=Ed.map.labels.filter(x=>x!==l); closePop(); Ed.sel=null; saveMap(300); requestDraw(); };
}
async function exportMap(){
 if(!Ed.map) return; const m=Ed.map; const sc=m.w*m.h>6000?.5:1; const cv=document.createElement('canvas'); cv.width=m.w*C*sc; cv.height=m.h*C*sc; const c=cv.getContext('2d');
 const css=getComputedStyle(document.documentElement); c.fillStyle=css.getPropertyValue('--bg'); c.fillRect(0,0,cv.width,cv.height);
 drawScene(c,cv.width,cv.height,{x:0,y:0,z:sc},{export:true});
 const blob=await new Promise(r=>cv.toBlob(r,'image/png'));
 if(!Store.downloads){ if(window.claude){ toast('Exportar no está disponible en esta vista.','bad'); return; } const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=(m.name||'mapa')+'.png'; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),4000); toast('Mapa exportado como imagen.'); return; }
 try{ const r=await Store.downloads.save({filename:(m.name||'mapa').replace(/[^\p{L}\p{N} _-]/gu,'')+'.png',data:blob}); if(r&&r.status==='saved') toast('Mapa exportado como imagen.'); }
 catch(e){ if(e&&e.code!=='cancelled'&&e.code!=='declined') toast('No se pudo exportar el mapa.','bad'); }
}
