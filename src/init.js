/* ===== Arranque ===== */
const VIEWS={mesa:vMesa,combate:vCombate,personajes:vPersonajes,pnj:vPNJ,mapas:vMapas,wiki:vWiki,bestiario:vMonstruos,hechizos:vHechizos,especies:vEspecies,clases:vClases,dotes:vDotesW,reglas:vReglas,biblioteca:vBiblioteca};
Store.init(); shell(); Ambient.init();
(()=>{ const p=planeById((Store.docs.settings||{}).plane||lsGet('oz:plane','material')); curPlane=p.id; document.documentElement.dataset.plane=p.id; $('#plName').textContent=p.name; Ambient.set(p.fx,p.c); render(); })();
