/* ===== Importador local: tus manuales → wiki =====
   Todo ocurre en tu navegador: lee el texto ya extraído de cada PDF y detecta
   bloques de estadísticas, hechizos, objetos mágicos, especies y subclases. */
I.gem=ic('<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M12 21 8 9l4-6 4 6z"/>');
KINDS.item='Objeto'; KINDS.sec='Sección';
const WIKI={mon:[],spl:[],itm:[],sec:[],ready:false,
 async load(){ const d=await IDB.get('all','wiki'); if(d){ this.mon=d.mon||[]; this.spl=d.spl||[]; this.itm=d.itm||[]; this.sec=d.sec||[]; } this.ready=true; this.reindex(); },
 save(){ this.reindex(); return IDB.set('all',{mon:this.mon,spl:this.spl,itm:this.itm,sec:this.sec},'wiki'); },
 reindex(){ const ens=l=>new Set(l.map(x=>norm(x.en||x.name))); this.monEn=ens(this.mon); this.splEn=ens(this.spl); this.itmEn=ens(this.itm);
  this.secBy={}; for(const s of this.sec){ (this.secBy[s.kind+':'+norm(s.match||s.name)]=this.secBy[s.kind+':'+norm(s.match||s.name)]||[]).push(s); } },
 count(){ return this.mon.length+this.spl.length+this.itm.length+this.sec.length; },
 drop(manId){ for(const k of ['mon','spl','itm','sec']) this[k]=this[k].filter(x=>x.man!==manId); }
};

/* Fuente probable según el título del manual */
function guessBook(t){ const s=norm(t);
 const R=[[/(monster.?manual|manual de (los )?monstruos|bestiario)/,/(2024|2025|\b24\b|\b25\b)/,'MM25','MM14'],[/(player.?s.?handbook|manual del jugador)/,/(2024|\b24\b)/,'PHB24','PHB14'],
  [/xanathar/,0,'XGE'],[/tasha/,0,'TCE'],[/volo/,0,'VGM'],[/(tome of foes|tomo de enemigos)/,0,'MTF'],[/(monsters of the multiverse|monstruos del multiverso|mordenkainen presents)/,0,'MPMM'],
  [/fizban/,0,'FTD'],[/(sword coast|costa de la espada)/,0,'SCAG'],[/eberron/,0,'ERLW'],[/ravnica/,0,'GGR'],[/theros/,0,'MOT'],[/wildemount/,0,'EGW'],[/ravenloft/,0,'VRGR'],[/strixhaven/,0,'SCC'],
  [/witchlight/,0,'WBtW'],[/spelljammer/,0,'SAiS'],[/dragonlance/,0,'DSotDQ'],[/many things|muchas cosas/,0,'BMT'],[/(dungeon master|guia del dungeon|guia del dm|\bdmg\b)/,0,'DMG']];
 for(const [a,b,y,n] of R) if(a.test(s)) return b?(b.test(s)?y:n):y;
 return t.slice(0,40);
}

/* Utilidades de texto */
const W_SIZE='(Tiny|Small|Medium|Large|Huge|Gargantuan|Diminut[oa]|Pequeñ[oa]|Median[oa]|Grande|Enorme|Gargantuesc[oa])';
const TYPE_ES_MAP={aberration:'Aberración',beast:'Bestia',celestial:'Celestial',construct:'Constructo',dragon:'Dragón',elemental:'Elemental',fey:'Feérico',fiend:'Infernal',giant:'Gigante',humanoid:'Humanoide',monstrosity:'Monstruosidad',ooze:'Cieno',plant:'Planta',undead:'No muerto',swarm:'Enjambre'};
const typeEs=t=>t.replace(/^\p{L}+/u,w=>TYPE_ES_MAP[w.toLowerCase()]||w);
const SIZE_ES={tiny:'Diminuto',small:'Pequeño',medium:'Mediano',large:'Grande',huge:'Enorme',gargantuan:'Gargantuesco'};
const TYPE_RE=new RegExp('(?:^|[\\s.])'+W_SIZE+'(?:\\s+(?:or|o)\\s+\\p{L}+)?\\s+([\\p{L}][\\p{L} ()\\-/]{1,60}?)\\s*,\\s*((?:lawful|chaotic|neutral|unaligned|any|typically|legal|ca[oó]tic[oa]|neutral|sin alineamiento|cualquier|normalmente|generalmente)[\\p{L} \\-]{0,40}?)(?=\\s*(?:\\n|Armor|AC\\b|Clase de|CA\\b|$))','iu');
const TYPE_ES=new RegExp('(?:^|[\\s.])([\\p{Lu}][\\p{Ll}]+)\\s+(?:\\(([^)]*)\\)\\s+)?'+W_SIZE+'\\s*(?:\\(([^)]*)\\))?\\s*,\\s*((?:[Ll]egal|[Cc]a[oó]tic[oa]|[Nn]eutral|[Ss]in alineamiento|[Cc]ualquier|[Nn]ormalmente|[Gg]eneralmente)[\\p{L} \\-]{0,40}?)(?=\\s*(?:\\n|Clase de|CA\\b|$))','u');
function matchType(s){ let m=s.match(TYPE_RE); if(m) return {index:m.index,len:m[0].length,size:m[1],type:m[2].trim(),align:m[3].trim()};
 m=s.match(TYPE_ES); if(m) return {index:m.index,len:m[0].length,size:m[3],type:m[1]+((m[2]||m[4])?` (${m[2]||m[4]})`:''),align:m[5].trim()}; return null; }
const HP_RE=/(?:Hit Points|Puntos de [Gg]olpe|(?<![\p{L}])HP|(?<![\p{L}])PG)\s+\d+\s*(?:\(|$|\s)/u;
const LABELS=[['ac','Armor Class|Clase de [Aa]rmadura|AC|CA'],['hp','Hit Points|Puntos de [Gg]olpe|HP|PG'],['speed','Speed|Velocidad'],['init','Initiative|Iniciativa'],
 ['saves','Saving Throws|Tiradas de salvación|Salvaciones'],['skills','Skills|Habilidades'],['vuln','Damage Vulnerabilities|Vulnerabilidades al daño|Vulnerabilities|Vulnerabilidades'],
 ['res','Damage Resistances|Resistencias al daño|Resistances|Resistencias'],['imm','Damage Immunities|Inmunidades al daño'],['condImm','Condition Immunities|Inmunidades a estados|Inmunidades a condiciones'],
 ['imm2','Immunities|Inmunidades'],['senses','Senses|Sentidos'],['lang','Languages|Idiomas'],['gear','Gear|Equipo'],['cr','Challenge|Desafío|CR|VD'],['pb','Proficiency Bonus|Bonificador por competencia|Bonificador de competencia']];
const LABEL_RE=new RegExp('(?<![\\p{L}])('+LABELS.map(l=>l[1]).join('|')+')(?![\\p{L}])','gu');
const labelKey=s=>{ for(const [k,a] of LABELS) if(new RegExp('^(?:'+a+')$','u').test(s)) return k; return null; };
const SECTIONS=[['bonus','Bonus Actions|Acciones adicionales|Acciones bonus'],['legendary','Legendary Actions|Acciones legendarias'],['legendary','Mythic Actions|Acciones míticas'],['reactions','Reactions|Reacciones'],['actions','Actions|Acciones'],['traits','Traits|Rasgos']];
const SEC_RE=new RegExp('(?:^|\\n|\\s)('+SECTIONS.map(s=>s[1]).join('|')+')(?=\\s*(?:\\n|$|[A-ZÁÉÍÓÚÑ][^.\\n:]{0,48}[.:]))','gu');
const secKey=s=>{ for(const [k,a] of SECTIONS) if(new RegExp('^(?:'+a+')$').test(s)) return k; return 'actions'; };
const ABMAP={str:'str',fue:'str',dex:'dex',des:'dex',con:'con',int:'int',wis:'wis',sab:'wis',cha:'cha',car:'cha'};
const ABLAB={str:'FUE',dex:'DES',con:'CON',int:'INT',wis:'SAB',cha:'CAR'};
const clean=s=>s.replace(/\s*\n\s*/g,' ').replace(/\s{2,}/g,' ').trim();
const slug=s=>norm(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48);
const titleish=s=>s&&s.length>1&&s.length<64&&/^[\p{Lu}\d]/u.test(s)&&!/[.:;]$/.test(s)&&!/\d{2,}/.test(s);

function flatten(content){ const out=[]; content.pages.forEach((pg,p)=>pg.forEach(([t,s])=>{ if(s&&s.trim()) out.push({t,s:s.trim(),p}); })); return out; }

const CONN=new Set(['of','the','and','a','an','to','with','in','on','de','del','la','el','los','las','y','en','con','al']);
function nameOK(n){ const w=n.replace(/\([^)]*\)/,'').trim().split(/\s+/); if(w.length<=2) return true; if(w.length>4) return false;
 if(w.slice(1).every(x=>CONN.has(x.toLowerCase())||/^\p{Lu}/u.test(x))) return true;
 return w.length===3&&CONN.has(w[1].toLowerCase()); }
/* Divide un tramo en entradas «Nombre. texto» */
function splitEntries(txt){
 const t=clean(txt); if(!t) return [];
 const re=/(?:^|(?<=[.!?]\s))([\p{Lu}][\p{L}'’\-]*(?:\s+[\p{L}'’\-]+){0,5}(?:\s*\([^)]{1,40}\))?)\.\s+(?=[\p{Lu}\d+])/gu;
 const cut=[]; let m; while((m=re.exec(t))){ if(m[1].length<=48&&nameOK(m[1])) cut.push([m.index,m[1],m.index+m[0].length]); }
 if(!cut.length) return [t];
 const out=[]; if(cut[0][0]>0){ const pre=t.slice(0,cut[0][0]).trim(); if(pre) out.push(pre); }
 cut.forEach((c,i)=>{ const body=t.slice(c[2],i+1<cut.length?cut[i+1][0]:t.length).trim(); out.push(c[1]+': '+body); });
 // fusiona falsos cortes (entradas demasiado cortas que siguen a otra)
 const m2=[]; for(const e of out){ const i=e.indexOf(': '); if(m2.length&&i>0&&e.length-i<24) m2[m2.length-1]+=' '+e.replace(': ','. '); else m2.push(e); }
 return m2;
}

/* ---------- Monstruos ---------- */
function parseMonsters(fl,src){
 const out=[]; const anchors=[];
 fl.forEach((x,i)=>{ if(HP_RE.test(x.s)) anchors.push(i); });
 const starts=[];
 for(const a of anchors){ let ti=-1, tm=null;
  for(let j=a;j>=Math.max(0,a-4);j--){ const m=matchType(fl[j].s); if(m){ ti=j; tm=m; break; } }
  if(ti<0) continue;
  let name=fl[ti].s.slice(0,tm.index).trim(), ni=ti;
  if(!titleish(name)){ name=''; for(let j=ti-1;j>=Math.max(0,ti-3);j--){ if(titleish(fl[j].s)){ name=fl[j].s; ni=j; break; } if(fl[j].s.length>120) break; } }
  if(!name) continue;
  if(starts.length&&starts[starts.length-1].a===a) continue;
  starts.push({a,ti,ni,tm,name}); }
 starts.forEach((st,k)=>{
  const end=Math.min(k+1<starts.length?starts[k+1].ni:fl.length,st.a+60);
  let stop=end; for(let j=st.a+1;j<end;j++){ const x=fl[j]; if(x.t==='h'&&!new RegExp('^(?:'+SECTIONS.map(s=>s[1]).join('|')+')$').test(x.s)){ stop=j; break; } }
  const seg=fl.slice(st.ti,stop).map(x=>x.s); seg[0]=seg[0].slice(st.tm.index+st.tm.len);
  const body=seg.join('\n').trim();
  const m=parseStat(body); if(!m) return;
  const {size,type,align}=st.tm;
  Object.assign(m,{name:st.name.replace(/\s+/g,' '),en:st.name,size:SIZE_ES[size.toLowerCase()]||size,type:typeEs(type[0].toUpperCase()+type.slice(1)),align,source:src,full:true,_imp:{p:fl[st.ni].p}});
  out.push(m); });
 return out;
}
function parseStat(body){
 const m={ac:'',acNote:'',hp:'',hpDice:'',speed:'',str:10,dex:10,con:10,int:10,wis:10,cha:10,cr:'',saves:'',skills:'',vuln:'',res:'',imm:'',condImm:'',senses:'',lang:'—',traits:[],actions:[],bonus:[],reactions:[],legendary:[],tags:[]};
 // características
 let h=body; const saves=[];
 const a24=[...h.matchAll(/(?<![\p{L}])(Str|Dex|Con|Int|Wis|Cha|Fue|Des|Sab|Car|STR|DEX|CON|INT|WIS|CHA|FUE|DES|SAB|CAR)\s+(\d{1,2})\s+([+\-−–]\s?\d{1,2})\s+([+\-−–]\s?\d{1,2})/gu)];
 if(a24.length>=4){ for(const x of a24){ const k=ABMAP[x[1].toLowerCase()]; if(!k) continue; m[k]=+x[2]; const md=x[3].replace(/\s/g,'').replace(/[−–]/,'-'), sv=x[4].replace(/\s/g,'').replace(/[−–]/,'-'); if(md!==sv) saves.push(`${ABLAB[k]} ${sv}`); }
  const s0=a24[0].index, s1=a24[a24.length-1].index+a24[a24.length-1][0].length; h=h.slice(0,s0)+' '+h.slice(s1); }
 else { const hd=h.search(/(?<![\p{L}])(STR|FUE)\s+(DEX|DES)\s+CON/u);
  if(hd>=0){ const rest=h.slice(hd); const nums=[...rest.matchAll(/(\d{1,2})\s*\(\s*([+\-−–]\s?\d{1,2})\s*\)/g)].slice(0,6);
   if(nums.length===6){ ['str','dex','con','int','wis','cha'].forEach((k,i)=>m[k]=+nums[i][1]); const e=hd+nums[5].index+nums[5][0].length; h=h.slice(0,hd)+' '+h.slice(e); } } }
 h=h.replace(/(?<![\p{L}])(MOD|SAVE|SALV|Mod|Save)(?![\p{L}])/gu,' ');
 // etiquetas
 const hits=[...h.matchAll(LABEL_RE)]; if(!hits.length) return null;
 const f={}; let tail='';
 for(let i=0;i<hits.length;i++){ const k=labelKey(hits[i][1]); const st=hits[i].index+hits[i][0].length; const en=i+1<hits.length?hits[i+1].index:h.length; let v=h.slice(st,en);
  if(k==='cr'){ const c=v.match(/^\s*([\d\/½¼⅛]+)\s*(\([^)]*\))?/); if(!c) continue; f.cr=c[1].replace('½','1/2').replace('¼','1/4').replace('⅛','1/8'); tail=v.slice(c[0].length)+h.slice(en);
   if(i+1<hits.length&&labelKey(hits[i+1][1])==='pb'){ const pb=h.slice(hits[i+1].index+hits[i+1][0].length).match(/^\s*[+\-]?\d+/); tail=h.slice(hits[i+1].index+hits[i+1][0].length+(pb?pb[0].length:0)); }
   break; }
  if(f[k]==null) f[k]=clean(v); }
 if(!f.hp||f.cr==null||!f.ac) return null;
 const ac=f.ac.match(/^(\d+)\s*(?:\(([^)]*)\))?/); if(!ac) return null; m.ac=+ac[1]; m.acNote=ac[2]||'';
 const hp=f.hp.match(/^(\d+)\s*(?:\(([^)]*)\))?/); if(!hp) return null; m.hp=+hp[1]; m.hpDice=(hp[2]||'').replace(/\s+/g,'');
 m.cr=f.cr; if(!(m.cr in CR_XP)) return null;
 m.speed=f.speed||''; m.skills=f.skills||''; m.vuln=f.vuln||''; m.res=f.res||''; m.imm=f.imm||''; m.condImm=f.condImm||''; m.senses=f.senses||''; m.lang=f.lang||'—';
 if(f.imm2){ const [d,c]=f.imm2.split(';'); m.imm=m.imm||clean(d||''); if(c) m.condImm=m.condImm||clean(c); }
 m.saves=f.saves||saves.join(', '); if(f.init) m.init=f.init; if(f.gear) m.gear=f.gear;
 // secciones
 const parts=[]; let last=0, key='traits'; SEC_RE.lastIndex=0; let s;
 while((s=SEC_RE.exec(tail))){ parts.push([key,tail.slice(last,s.index)]); key=secKey(s[1]); last=s.index+s[0].length; }
 parts.push([key,tail.slice(last)]);
 for(const [k,t] of parts){ const e=splitEntries(t); if(e.length) m[k].push(...e); }
 if(!m.actions.length&&!m.traits.length) return null;
 return m;
}

/* ---------- Hechizos ---------- */
const SCH_EN={abjuration:'Abjuración',conjuration:'Conjuración',divination:'Adivinación',enchantment:'Encantamiento',evocation:'Evocación',illusion:'Ilusión',necromancy:'Nigromancia',transmutation:'Transmutación'};
const SCH_ES=Object.fromEntries(Object.values(SCHOOLS).map(v=>[norm(v),v]));
const CLS_EN={bard:'Bardo',cleric:'Clérigo',druid:'Druida',paladin:'Paladín',ranger:'Explorador',sorcerer:'Hechicero',warlock:'Brujo',wizard:'Mago',artificer:'Artífice'};
const SP_F=[['time','Casting Time|Tiempo de lanzamiento|Tiempo de conjuraci[oó]n|Tiempo de invocaci[oó]n'],['range','Range|Alcance'],['comp','Components|Componentes'],['dur','Duration|Duraci[oó]n']];
const SP_RE=new RegExp('('+SP_F.map(x=>x[1]).join('|')+')\\s*:','gu');
const DUR_RE=/^\s*((?:Concentration|Concentración)[,;]?\s*(?:up to|hasta)\s+[\d\w ]+?(?:minutes?|hours?|days?|rounds?|minutos?|horas?|días?|rondas?)|Instantaneous|Instantánea|Instantáneo|Until dispelled(?: or triggered)?|Hasta que se disipe(?: o se active)?|Permanent|Permanente|Special|Especial|(?:Up to |Hasta )?\d+\s+(?:minutes?|hours?|days?|rounds?|minutos?|horas?|días?|rondas?))/i;
function spellMeta(line){ const s=norm(line), o={level:null,school:'',classes:[],ritual:/ritual/.test(s)};
 if(/cantrip|truco/.test(s)) o.level=0; else { const l=s.match(/(\d)(?:st|nd|rd|th)?[- ]level|level (\d)|nivel (\d)/); if(l) o.level=+(l[1]||l[2]||l[3]); }
 for(const [k,v] of Object.entries(SCH_EN)) if(s.includes(k)) o.school=v; if(!o.school) for(const [k,v] of Object.entries(SCH_ES)) if(s.includes(k)) o.school=v;
 const c=line.match(/\(([^)]+)\)/); if(c) for(const p of c[1].split(/,|\by\b|\band\b/)){ const k=norm(p.trim()); const v=CLS_EN[k]||Object.values(SPELL_CLASSES).find(x=>norm(x)===k); if(v) o.classes.push(v); }
 return o; }
function parseSpells(fl,src){
 const out=[]; const anchors=[];
 fl.forEach((x,i)=>{ SP_RE.lastIndex=0; const m=SP_RE.exec(x.s); if(m&&/^(Casting|Tiempo)/.test(m[1])) anchors.push(i); });
 const st=[];
 for(const a of anchors){ let meta=null, mi=-1, pre='';
  const pos=fl[a].s.search(/Casting Time|Tiempo de/); pre=fl[a].s.slice(0,pos).trim();
  if(pre&&spellMeta(pre).level!=null){ meta=spellMeta(pre); mi=a; }
  else for(let j=a-1;j>=Math.max(0,a-2);j--){ const mm=spellMeta(fl[j].s); if(mm.level!=null&&fl[j].s.length<140){ meta=mm; mi=j; break; } }
  if(!meta) continue;
  let name='', ni=mi;
  const ml=mi===a?pre:fl[mi].s; const lvPos=ml.search(/(\d(st|nd|rd|th)?[- ]level|Level \d|Nivel \d|nivel \d|cantrip|Cantrip|Truco|truco|\p{Lu}\p{Ll}+ cantrip)/u);
  for(let j=mi-1;j>=Math.max(0,mi-2);j--) if(fl[j].t==='h'&&titleish(fl[j].s)){ name=fl[j].s; ni=j; break; }
  if(!name&&lvPos>0&&titleish(ml.slice(0,lvPos).trim())&&!/ de\s*$/.test(ml.slice(0,lvPos))) name=ml.slice(0,lvPos).trim();
  if(!name) for(let j=mi-1;j>=Math.max(0,mi-2);j--) if(titleish(fl[j].s)){ name=fl[j].s; ni=j; break; }
  if(!name) continue; st.push({a,ni,name,meta}); }
 st.forEach((x,k)=>{
  const end=Math.min(k+1<st.length?st[k+1].ni:fl.length,x.a+14);
  let stop=end; for(let j=x.a+1;j<end;j++) if(fl[j].t==='h'&&!/^(At Higher|A niveles superiores|Using a Higher|Mejora de truco|Cantrip Upgrade)/.test(fl[j].s)){ stop=j; break; }
  const body=fl.slice(x.a,stop).map(y=>y.s).join('\n'); const t=body.slice(body.search(/Casting Time|Tiempo de/));
  const hits=[...t.matchAll(SP_RE)]; const f={}; let rest='';
  hits.forEach((hh,i)=>{ const k=SP_F.find(q=>new RegExp('^(?:'+q[1]+')$','u').test(hh[1]))[0]; const s0=hh.index+hh[0].length, s1=i+1<hits.length?hits[i+1].index:t.length; let v=t.slice(s0,s1);
   if(k==='dur'){ const d=v.match(DUR_RE); if(d){ rest=v.slice(d[0].length); v=d[0]; } else { const c=v.match(/^[^.\n]{1,50}/); rest=v.slice(c?c[0].length:0); v=c?c[0]:''; } }
   f[k]=f[k]||clean(v); });
  if(!f.time||!f.dur) return;
  const desc=clean(rest.replace(/^[\s.]+/,''));
  out.push({id:'',name:x.name,en:x.name,level:x.meta.level,school:x.meta.school||'—',classes:x.meta.classes,ritual:x.meta.ritual||/ritual/i.test(f.time),conc:/^concentra/i.test(f.dur),time:f.time,range:f.range||'',comp:f.comp||'',dur:f.dur.replace(/^(Concentration|Concentración)[,;]?\s*/i,''),desc,source:src,full:true,_imp:{p:fl[x.ni].p}}); });
 return out;
}

/* ---------- Objetos mágicos ---------- */
const IT_RE=/^(Wondrous item|Armor|Weapon|Ring|Rod|Staff|Wand|Potion|Scroll|Objeto maravilloso|Armadura|Arma|Anillo|Vara|Bastón|Varita|Poción|Pergamino)\b([^,\n]{0,70}),\s*(rarity varies|very rare|uncommon|common|rare|legendary|artifact|rareza variable|muy rar[oa]|poco común|infrecuente|común|rar[oa]|legendari[oa]|artefacto)\b(\s*(?:\((?:requires attunement|requiere sintonizaci[oó]n)[^)]*\)))?/i;
const IT_TY={wondrous:'Objeto maravilloso',armor:'Armadura',weapon:'Arma',ring:'Anillo',rod:'Vara',staff:'Bastón',wand:'Varita',potion:'Poción',scroll:'Pergamino'};
const IT_RA={'rarity varies':'Variable','very rare':'Muy rara',uncommon:'Infrecuente',common:'Común',rare:'Rara',legendary:'Legendaria',artifact:'Artefacto','rareza variable':'Variable','muy raro':'Muy rara','muy rara':'Muy rara','poco comun':'Infrecuente',infrecuente:'Infrecuente',comun:'Común',raro:'Rara',rara:'Rara',legendario:'Legendaria',legendaria:'Legendaria',artefacto:'Artefacto'};
function parseItems(fl,src){
 const out=[]; const idx=[];
 fl.forEach((x,i)=>{ const m=x.s.match(IT_RE); if(m) idx.push([i,m]); });
 const st=[];
 for(const [i,m] of idx){ let name='', ni=i; for(let j=i-1;j>=Math.max(0,i-2);j--) if(titleish(fl[j].s)){ name=fl[j].s; ni=j; break; } if(name) st.push({i,ni,m,name}); }
 st.forEach((x,k)=>{ const end=Math.min(k+1<st.length?st[k+1].ni:fl.length,x.i+12); let stop=end; for(let j=x.i+1;j<end;j++) if(fl[j].t==='h'){ stop=j; break; }
  const desc=clean([fl[x.i].s.slice(x.m[0].length),...fl.slice(x.i+1,stop).map(y=>y.s)].join(' ')).replace(/^[\s.]+/,'');
  if(desc.length<20) return;
  const ty=IT_TY[x.m[1].toLowerCase().split(' ')[0]]||x.m[1]; const att=x.m[4]?clean(x.m[4]).replace(/^\(|\)$/g,''):'';
  out.push({id:'',name:x.name,en:x.name,type:ty+(x.m[2].trim()?' '+clean(x.m[2]):''),rarity:IT_RA[norm(x.m[3])]||x.m[3],att:att?att[0].toUpperCase()+att.slice(1):'',desc:desc.slice(0,6000),source:src,full:true,_imp:{p:fl[x.ni].p}}); });
 return out;
}

/* ---------- Especies, subclases y clases ---------- */
const SUB_PFX=/^(Path of (the )?|College of |Circle of (the )?|Oath of (the )?|Way of (the )?|School of |Order of (the )?|The [\p{L} ]+ Patron$|Senda del? |Colegio de(l| la)? |Círculo de(l| la)? |Juramento de(l| la)? |Camino de(l| la)? |Escuela de |Dominio de(l| la)? |Patr[oó]n )|( Domain| Conclave| Archetype| Bloodline| Patron| Sorcery| Subclass)$/u;
function subGuess(n){ const G=[[/^(path of|senda)/,'barbaro'],[/^(college of|colegio)/,'bardo'],[/(domain$|^dominio)/,'clerigo'],[/^(circle of|circulo)/,'druida'],[/^(oath of|juramento)/,'paladin'],[/^(way of|camino)/,'monje'],[/(conclave$|^cónclave)/,'explorador'],[/(bloodline$|sorcery$|^linaje)/,'hechicero'],[/(patron$|^patron|^the .+ patron)/,'brujo'],[/^(school of|escuela)/,'mago']];
 for(const [r,c] of G) if(r.test(n)) return c; return ''; }
function parseSections(fl,src){
 const out=[]; const sp=new Map(); for(const x of allSpecies()) { sp.set(norm(x.en),x); sp.set(norm(x.name),x); }
 const cls=new Map(); for(const c of [...CLASSES,...EXTRA_CLASSES]){ cls.set(norm(c.name),c); if(c.en) cls.set(norm(c.en),c); }
 const subs=new Map(); for(const [cid,str] of Object.entries(SUBCLASS_CAT)) for(const s of str.split(';')){ const [n]=s.split('|'); subs.set(norm(n),cid); }
 const take=(i,max,stopRe)=>{ const b=[]; let n=0; for(let j=i+1;j<fl.length&&b.length<max&&n<14000;j++){ const x=fl[j]; if(x.t==='h'&&stopRe&&stopRe(x.s)) break; b.push([x.t,x.s]); n+=x.s.length; } return b; };
 const isMajor=s=>sp.has(norm(s))||cls.has(norm(s))||SUB_PFX.test(s)||subs.has(norm(s.replace(SUB_PFX,'')));
 fl.forEach((x,i)=>{ if(x.t!=='h'||x.s.length>60) return; const n=norm(x.s);
  const nx=fl.slice(i+1,i+6).map(y=>y.s).join(' ');
  if(sp.has(n)&&/(Creature Type|Tipo de criatura|Size|Tamaño|Speed|Velocidad)\s*[:.]/.test(nx)){ const e=sp.get(n); out.push({kind:'species',name:e.name,en:e.en,match:e.en,blocks:take(i,30,isMajor),source:src,p:x.p}); return; }
  if(cls.has(n)&&/(Hit Point Die|Hit Dice|Dado de golpe|Dados de golpe|Primary Ability|Característica principal)/.test(fl.slice(i+1,i+14).map(y=>y.s).join(' '))){ const c=cls.get(n); out.push({kind:'class',name:c.name,cls:c.id,match:c.id,blocks:take(i,90,s=>cls.has(norm(s))),source:src,p:x.p}); return; }
  const bare=n.replace(/^(senda|colegio|circulo|juramento|camino|escuela|dominio|patron|path|college|circle|oath|way|school|order)( of| de)?( the| la| los| las| el)?( del?)? /,'');
  const sc=subs.get(n)||subs.get(bare)||subGuess(n);
  if(sc||SUB_PFX.test(x.s)){ const near=fl.slice(i+1,i+4).map(y=>y.s).join(' ');
   if(!sc&&!/(level|nivel|subclass|subclase|feature|rasgo)/i.test(near)) return;
   out.push({kind:'subclass',name:x.s,cls:sc||'',match:x.s,blocks:take(i,40,isMajor),source:src,p:x.p}); } });
 return out.filter(s=>s.blocks.length);
}

/* ---------- Importar un manual ---------- */
async function wikiImport(m,silent){
 const content=await manualContent(m); if(!content) return null;
 const fl=flatten(content), src=guessBook(m.title);
 const mon=parseMonsters(fl,src), spl=parseSpells(fl,src), itm=parseItems(fl,src), sec=parseSections(fl,src);
 const sp=new Map(allSpells().filter(x=>!x._imp).map(x=>[norm(x.en||''),x])), mc=new Map([...SRD_MONSTERS,...MONSTER_CAT].map(x=>[norm(x.en||''),x])), ic=new Map(ITEMS.map(x=>[norm(x.en),x]));
 const seen=new Set();
 const fix=(arr,pfx,cat)=>arr.filter(x=>{ const k=norm(x.en); if(!k||seen.has(pfx+k)) return false; seen.add(pfx+k);
  const c=cat.get(k); if(c){ x.name=c.name; if(c.source==='SRD') x.name+=` (${src})`; }
  else if(m.lang!=='es') x.name=x.en;
  x.id=`imp-${pfx}-${slug(m.id)}-${slug(x.en)}`; x.man=m.id; x._imp.man=m.id; x._imp.title=m.title; return true; });
 WIKI.drop(m.id);
 WIKI.mon.push(...fix(mon,'m',mc)); WIKI.spl.push(...fix(spl,'s',sp)); WIKI.itm.push(...fix(itm,'i',ic));
 sec.forEach((s,i)=>{ s.id=`imp-x-${slug(m.id)}-${i}`; s.man=m.id; s.title=m.title; }); WIKI.sec.push(...sec);
 await WIKI.save();
 const r={mon:WIKI.mon.filter(x=>x.man===m.id).length,spl:WIKI.spl.filter(x=>x.man===m.id).length,itm:WIKI.itm.filter(x=>x.man===m.id).length,sec:sec.length};
 m.wiki=Object.assign(r,{at:Date.now()}); Store.put('manuals',m);
 if(!silent) toast(`${m.title}: ${r.mon} monstruos, ${r.spl} hechizos, ${r.itm} objetos y ${r.sec} secciones añadidos a la wiki.`);
 return r;
}
async function wikiImportAll(ui){
 const l=Store.list('manuals'); const tot={mon:0,spl:0,itm:0,sec:0};
 for(let i=0;i<l.length;i++){ ui&&ui(i/l.length,`Analizando ${l[i].title}…`); await new Promise(r=>setTimeout(r,30)); try{ const r=await wikiImport(l[i],true); if(r) for(const k in tot) tot[k]+=r[k]; }catch(e){ console.error(e); } }
 ui&&ui(null); toast(`Wiki actualizada: ${tot.mon} monstruos, ${tot.spl} hechizos, ${tot.itm} objetos y ${tot.sec} secciones de clases, subclases y especies.`); return tot;
}

/* ---------- Integración con la wiki ---------- */
allMonsterEntries=function(){ return [...allMonsters(),...WIKI.mon,...MONSTER_CAT.filter(x=>!WIKI.monEn||!WIKI.monEn.has(norm(x.en)))]; };
allSpells=function(){ return [...SPELLS,...WIKI.spl.filter(x=>!SPELLS.some(s=>norm(s.en)===norm(x.en))),...SPELL_CAT.filter(x=>!WIKI.splEn||!WIKI.splEn.has(norm(x.en)))]; };
function allItems(){ return [...ITEMS,...WIKI.itm]; }
const _findEntry=findEntry;
findEntry=function(k,id){
 if(k==='item') return allItems().find(x=>x.id===id);
 if(k==='sec') return WIKI.sec.find(x=>x.id===id);
 if(k==='monster'){ const w=WIKI.mon.find(x=>x.id===id); if(w) return w; }
 return _findEntry(k,id); };
const _statblock=statblock;
statblock=function(m,c){ let h=_statblock(m,c); if(m._imp) h=h.replace('<span class="tag hb">Homebrew</span>',`<span class="tag" title="${esc(bookName(m.source))}">${esc(m.source)}</span>`); if(m._imp&&m.init) h=h.replace('<div class="abil">',`<div class="kv"><span><b>Iniciativa</b> ${esc(m.init)}</span></div><div class="abil">`); return h; };
const pageBtn=x=>x&&x._imp||x&&x.p!=null?`<button class="btn" data-page="${esc((x._imp||x).man||x.man)}:${(x._imp||x).p}">${I.book} Ver en el manual (pág. ${((x._imp||x).p)+1})</button>`:'';
const trBtn=()=>`<button class="btn" data-trn>${I.globe||I.book} Traducir al español</button>`;
const secHTML=s=>s.blocks.map(([t,x])=>t==='h'?`<h4>${esc(x)}</h4>`:`<p>${rollify(esc(x))}</p>`).join('');
const _entryHTMLFor=entryHTMLFor;
entryHTMLFor=function(k,x){
 if(k==='item') return `<div class="sb"><h2>${esc(x.name)}</h2><div class="ty">${esc(x.type)} · ${esc((x.rarity||'').toLowerCase())}${x.en&&x.en!==x.name?` · <span class="muted">${esc(x.en)}</span>`:''}</div>${x.att?`<p class="muted"><i>${esc(x.att)}</i></p>`:''}<div class="trx"><p style="font-size:1.04rem;white-space:pre-line">${rollify(esc(x.desc))}</p></div><div class="row" style="margin-top:14px;gap:8px">${srcTag(x)}<small class="muted">${esc(bookName(x.source))}</small></div></div><div class="acts" style="margin-top:14px">${pageBtn(x)}${x._imp?trBtn():manualBtn(x.name)}</div>`;
 if(k==='sec') return `<div class="sb"><h2>${esc(x.name)}</h2><div class="ty">${{species:'Especie',subclass:'Subclase',class:'Clase'}[x.kind]}${x.cls?' · '+esc(([...CLASSES,...EXTRA_CLASSES].find(c=>c.id===x.cls)||{}).name||''):''} · <span class="muted">${esc(x.title)}</span></div><div class="trx">${secHTML(x)}</div></div><div class="acts" style="margin-top:14px">${pageBtn(x)}${trBtn()}</div>`;
 if(k==='species'&&x.full===false){ const s=(WIKI.secBy['species:'+norm(x.en)]||[])[0]; if(s) return `<div class="sb"><h2>${esc(x.name)}</h2><div class="ty">${esc(x.desc)} · <span class="muted">${esc(x.en)}</span></div><div class="trx">${secHTML(s)}</div><div class="row" style="margin-top:14px;gap:8px"><span class="tag">${esc(x.source)}</span><small class="muted">${esc(s.title)}</small></div></div><div class="acts" style="margin-top:14px">${pageBtn(s)}${trBtn()}</div>`; }
 let h=_entryHTMLFor(k,x);
 if(x&&x._imp){
  if(k==='monster') h=h.replace(/<button class="btn" id="bedit">[\s\S]*?<\/button>/,'').replace(/<button class="btn danger" id="bdel">[\s\S]*?<\/button>/,'').replace(manualBtn(x.name),pageBtn(x)+trBtn());
  if(k==='spell') h=h.replace(manualBtn(x.name),pageBtn(x)+trBtn()).replace('<p style="font-size:1.04rem">','<div class="trx"><p style="font-size:1.04rem">').replace('<h4>Clases</h4>','</div><h4>Clases</h4>');
 }
 return h; };
const _bindEntry=bindEntry;
bindEntry=function(b,k,x){
 _bindEntry(b,k,x);
 $$('[data-page]',b).forEach(btn=>btn.onclick=()=>{ const [id,p]=btn.dataset.page.split(':'); if(!Store.get('manuals',id)){ toast('Ese manual ya no está en tu biblioteca.','bad'); return; } LB.open=id; LB.page=+p; closeDrawer(); go('biblioteca'); });
 $$('[data-trn]',b).forEach(btn=>btn.onclick=async()=>{ btn.disabled=true; btn.textContent='Traduciendo…';
  try{ const tr=await TR.get('en','es',true); const nodes=$$('.sb p, .sb h4, .sb .ty',b).filter(n=>n.textContent.trim()&&!n.querySelector('input,button'));
   for(const n of nodes){ const walker=document.createTreeWalker(n,NodeFilter.SHOW_TEXT); const ts=[]; while(walker.nextNode()) ts.push(walker.currentNode); for(const t of ts){ if(t.nodeValue.trim().length>1) t.nodeValue=await tr.translate(t.nodeValue); } }
   btn.textContent='Traducido'; }
  catch(e){ btn.disabled=false; btn.textContent='Traducir al español'; toast(e.message==='nosupport'?'Tu navegador no trae traductor integrado. Funciona en Chrome o Edge actualizados.':'No pude traducir ahora.','bad'); } });
 if(k==='monster'&&x._imp){ const d=$('#bdup',b); if(d){ const n=d.cloneNode(true); d.replaceWith(n); n.onclick=()=>{ const c=clone(x); delete c._imp; delete c.man; c.id='hb-'+uid(); c.name=x.name+' (variante)'; c.source='Homebrew'; Store.put('monsters',c); openEntry('monster',c.id); editMonster(c); }; } }
};
const _searchIndex=searchIndex;
searchIndex=function(){ const it=_searchIndex();
 for(const x of allItems()) it.push({g:'Objetos',t:x.name,s:`${x.type} · ${x.rarity}`,tag:x,a:()=>openEntry('item',x.id)});
 for(const s of WIKI.sec) if(s.kind!=='species') it.push({g:s.kind==='class'?'Clases':'Subclases',t:s.name,s:`${s.kind==='class'?'Texto completo':'Subclase'} · ${s.title}`,a:()=>openEntry('sec',s.id)});
 return it; };
ROUTES.objetos={t:'Objetos',s:'Objetos mágicos y equipo',i:'gem',sec:'Wiki'};
{ const o={}; for(const [k,v] of Object.entries(ROUTES)){ if(k==='objetos') continue; o[k]=v; if(k==='dotes') o.objetos=ROUTES.objetos; } for(const k of Object.keys(ROUTES)) delete ROUTES[k]; Object.assign(ROUTES,o); }
const _counts=counts;
counts=function(){ _counts(); const n={bestiario:allMonsterEntries().length,hechizos:allSpells().length,objetos:allItems().length}; for(const [k,v] of Object.entries(n)) $$(`[data-cnt="${k}"]`).forEach(el=>el.textContent=v); };
function vObjetos(v){
 wikiList(v,{key:'objetos',kind:'item',eyebrow:'Wiki',title:'Objetos',items:allItems,text:x=>x.type+' '+x.rarity+' '+x.desc,
  filters:[{id:'type',label:'Tipo',opts:()=>[...new Set(allItems().map(x=>x.type.split(' ')[0]==='Objeto'?'Objeto maravilloso':x.type.split(' ')[0]))].sort(),test:(x,v)=>x.type.startsWith(v)},
   {id:'rar',label:'Rareza',opts:()=>Object.values(RARITIES),test:(x,v)=>x.rarity===v},
   {id:'att',label:'Sintonización',opts:()=>[['s','Requiere'],['n','No requiere']],test:(x,v)=>v==='s'?!!x.att:!x.att},
   {id:'src',label:'Fuente',opts:SRC_OPTS(allItems),test:(x,v)=>x.source===v}],
  sort:(a,b)=>rarIx(a)-rarIx(b)||a.name.localeCompare(b.name),group:x=>x.rarity||'—',
  row:x=>({bd:esc((x.rarity||'?')[0]),ds:`${x.type}${x.att?' · sintonización':''} · ${x.desc}`})});
}
const rarIx=x=>{ const i=Object.values(RARITIES).indexOf(x.rarity); return i<0?9:i; };

/* Panel de importación en la portada de la wiki */
const _vWiki=vWiki;
vWiki=function(v){ _vWiki(v);
 const intro=$('.wrap > div:first-child p',v); if(intro) intro.textContent='Busca cualquier cosa con el buscador de arriba. Las fichas completas vienen del contenido libre (SRD) y de los manuales que subes: de cada libro saco sus monstruos, hechizos, objetos, clases, subclases y especies. Lo que no está en tus libros aparece en el índice con su fuente.';
 const tiles=$('.tiles',v); if(tiles){ const t=document.createElement('div'); t.className='card tile'; t.dataset.go='objetos'; t.style.animation='rise .6s 380ms var(--ease) both'; t.innerHTML=`<span class="ico">${I.gem}</span><div class="h3">Objetos</div><div class="muted" style="font-size:.88rem">Objetos mágicos del SRD y los de tus manuales.</div><b class="n">${allItems().length}</b>`; tiles.insertBefore(t,tiles.children[5]||null); }
 const n=Store.list('manuals').length, w=WIKI;
 const p=document.createElement('div'); p.className='panel wimp'; p.style.setProperty('--i',1);
 p.innerHTML=`<div class="row" style="justify-content:space-between;gap:14px"><div style="min-width:0;flex:1 1 320px"><h3 class="h3">Tu biblioteca dentro de la wiki</h3><p class="muted" style="margin:6px 0 0;font-size:.92rem">${n?`Leo tus ${n} manuales y saco de ellos cada monstruo, hechizo, objeto, clase, subclase y especie con su ficha completa. Todo queda guardado solo en este navegador.`:'Sube tus libros a Manuales (por ejemplo el Manual de Monstruos 2024 o tus expansiones) y sus fichas aparecen aquí con el texto completo.'}</p>
  <div class="wstat">${[['Monstruos',w.mon.length],['Hechizos',w.spl.length],['Objetos',w.itm.length],['Secciones',w.sec.length]].map(([a,b])=>`<span><b>${b}</b>${a}</span>`).join('')}</div></div>
  <div style="display:flex;flex-direction:column;gap:8px;align-items:stretch;min-width:220px">${n?`<button class="btn pri" id="wimp">${I.book} Actualizar desde mis manuales</button>`:`<button class="btn pri" data-go="biblioteca">${I.upload} Subir manuales</button>`}<div id="wpg" hidden><div class="prog"><i id="wpgb"></i></div><small class="muted" id="wpgt"></small></div></div></div>`;
 const first=$('.wrap',v).children[1]; $('.wrap',v).insertBefore(p,first);
 $('#wimp',p)?.addEventListener('click',async e=>{ e.target.disabled=true; await wikiImportAll((q,t)=>{ const g=$('#wpg'); if(!g) return; if(q==null){ g.hidden=true; return; } g.hidden=false; $('#wpgb').style.width=(q*100)+'%'; $('#wpgt').textContent=t; }); render(true); });
 $$('[data-go]',p).forEach(b=>b.onclick=()=>go(b.dataset.go));
};

/* Biblioteca: botón «Añadir a la wiki» y estado por libro */
const _vBiblioteca=vBiblioteca;
vBiblioteca=function(v){ wikiPrune(); _vBiblioteca(v); if(LB.open) return;
 const da=$('#delAll'); if(da){ const b=document.createElement('button'); b.className='btn sm'; b.id='toWiki'; b.innerHTML=`${I.compass} Añadir todo a la wiki`; da.before(b); da.parentElement.style.gap='8px';
  const holder=document.createElement('div'); holder.className='row'; holder.style.gap='8px'; da.parentElement.append(holder); holder.append(b,da);
  b.onclick=async()=>{ b.disabled=true; await wikiImportAll((q,t)=>{ b.textContent=q==null?'Listo':`${Math.round(q*100)}% · ${t}`; }); render(true); }; }
 for(const m of Store.list('manuals')){ const el=$(`[data-ocr="${m.id}"]`,v); if(el&&m.wiki) el.insertAdjacentHTML('beforeend',`<span class="tag" title="${m.wiki.mon} monstruos · ${m.wiki.spl} hechizos · ${m.wiki.itm} objetos · ${m.wiki.sec} secciones">Wiki ${m.wiki.mon+m.wiki.spl+m.wiki.itm+m.wiki.sec}</span>`); }
};
/* Importa solo cada libro nuevo y tras terminar el OCR */
const _importFiles=importFiles;
importFiles=async function(files,ui){ const before=new Set(Store.list('manuals').map(m=>m.id)); await _importFiles(files,ui);
 for(const m of Store.list('manuals')) if(!before.has(m.id)&&!(m.ocr&&m.ocr.done<m.ocr.total)){ try{ await wikiImport(m); }catch(e){ console.error(e); } } if(route==='biblioteca') render(true); };
const _ocrRun=OCR.run.bind(OCR);
OCR.run=async function(m){ await _ocrRun(m); const mm=Store.get('manuals',m.id); if(mm&&mm.ocr&&mm.ocr.done>=mm.ocr.total) try{ await wikiImport(mm); }catch(e){} };
/* Limpia la wiki cuando se borra un manual */
function wikiPrune(){ if(!WIKI.ready) return; const ids=new Set(Store.list('manuals').map(m=>m.id)); const before=WIKI.count(); for(const k of ['mon','spl','itm','sec']) WIKI[k]=WIKI[k].filter(x=>ids.has(x.man)); if(WIKI.count()!==before) WIKI.save(); }
