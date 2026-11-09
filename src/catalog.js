/* ===== Libros y fuentes ===== */
const BOOKS={
 'SRD 5.1':'Documento de referencia (libre, 2014)','Reglas 2024':'Documento de referencia 5.2 (libre, 2024)',
 PHB14:'Manual del Jugador (2014)',PHB24:'Manual del Jugador (2024)',MM14:'Manual de Monstruos (2014)',MM25:'Manual de Monstruos (2025)',DMG:'Guía del Dungeon Master',
 XGE:'Guía de Xanathar para todo',TCE:'Caldero de Tasha para todo',VGM:'Guía de Volo de los monstruos',MTF:'Tomo de enemigos de Mordenkainen',MPMM:'Mordenkainen presenta: monstruos del multiverso',
 FTD:'Tesoro de dragones de Fizban',SCAG:'Guía del aventurero de la Costa de la Espada',ERLW:'Eberron: Rising from the Last War',GGR:"Guildmasters' Guide to Ravnica",MOT:'Mythic Odysseys of Theros',
 EGW:"Explorer's Guide to Wildemount",VRGR:"Van Richten's Guide to Ravenloft",SCC:'Strixhaven: A Curriculum of Chaos',WBtW:'The Wild Beyond the Witchlight',SAiS:'Spelljammer: Adventures in Space',DSotDQ:'Dragonlance: Shadow of the Dragon Queen',BMT:'The Book of Many Things',RoT:'The Rise of Tiamat'
};
const bookName=s=>BOOKS[s]||s;

/* ===== Más monstruos del SRD 5.1 ===== */
SRD_MONSTERS.push(
M('aboleth','Aboleth','Aboleth','Grande','Aberración','Legal malvado',17,'armadura natural',135,'18d10+36','3 m, nadar 12 m',[21,9,15,18,15,18],'10',{saves:'Con +6, Int +8, Sab +6',skills:'Historia +12, Percepción +10',senses:'Visión en la oscuridad 36 m, Percepción pasiva 20',lang:'Habla profunda, telepatía 36 m',tags:['jefe'],
 traits:['Anfibio: Respira aire y agua.','Nube mucosa: Bajo el agua, quien lo toque o golpee cuerpo a cuerpo a 1,5 m hace salvación de Con CD 14 o solo puede respirar agua durante 1d4 horas.','Telepatía sondeadora: Si una criatura se comunica con él telepáticamente, conoce sus mayores deseos.'],
 actions:['Ataque múltiple: Tres ataques de tentáculo.','Tentáculo: Ataque cuerpo a cuerpo con arma: +9 al impacto, alcance 3 m. Impacto: 12 (2d6+5) contundente; salvación de Con CD 14 o contrae una enfermedad que vuelve la piel translúcida y viscosa.','Cola: Ataque cuerpo a cuerpo con arma: +9 al impacto, alcance 3 m. Impacto: 15 (3d6+5) contundente.','Esclavizar (3/día): Una criatura a 9 m hace salvación de Sab CD 14 o queda hechizada hasta que el aboleth muera o esté en otro plano.'],
 legendary:['Puede realizar 3 acciones legendarias por ronda.','Detectar: Prueba de Sabiduría (Percepción).','Golpe de cola: Un ataque de cola.','Drenaje psíquico (cuesta 2 acciones): Una criatura hechizada recibe 10 (3d6) psíquico y el aboleth recupera esa cantidad.']}),
M('quimera','Quimera','Chimera','Grande','Monstruosidad','Caótico malvado',14,'armadura natural',114,'12d10+48','9 m, volar 18 m',[19,11,19,3,14,10],'6',{skills:'Percepción +8',senses:'Visión en la oscuridad 18 m, Percepción pasiva 18',lang:'Entiende dracónico',
 actions:['Ataque múltiple: Mordisco, cuernos y garras; puede usar el aliento en lugar de un ataque.','Mordisco: Ataque cuerpo a cuerpo con arma: +7 al impacto, alcance 1,5 m. Impacto: 11 (2d6+4) perforante.','Cuernos: Ataque cuerpo a cuerpo con arma: +7 al impacto, alcance 1,5 m. Impacto: 10 (1d12+4) contundente.','Garras: Ataque cuerpo a cuerpo con arma: +7 al impacto, alcance 1,5 m. Impacto: 11 (2d6+4) cortante.','Aliento de fuego (Recarga 5–6): Cono de 4,5 m, salvación de Des CD 15: 31 (7d8) fuego, mitad si tiene éxito.']}),
M('manticora','Mantícora','Manticore','Grande','Monstruosidad','Legal malvado',14,'armadura natural',68,'8d10+24','9 m, volar 15 m',[17,16,17,7,12,8],'3',{senses:'Visión en la oscuridad 18 m, Percepción pasiva 11',lang:'Común',
 traits:['Regeneración de púas: Tiene 24 púas en la cola y le vuelven a crecer tras un descanso largo.'],
 actions:['Ataque múltiple: Tres ataques: un mordisco y dos garras, o tres púas.','Mordisco: Ataque cuerpo a cuerpo con arma: +5 al impacto, alcance 1,5 m. Impacto: 7 (1d8+3) perforante.','Garra: Ataque cuerpo a cuerpo con arma: +5 al impacto, alcance 1,5 m. Impacto: 6 (1d6+3) cortante.','Púa de la cola: Ataque a distancia con arma: +5 al impacto, alcance 30/60 m. Impacto: 7 (1d8+3) perforante.']}),
M('medusa','Medusa','Medusa','Mediano','Monstruosidad','Legal malvado',15,'armadura natural',127,'17d8+51','9 m',[10,15,16,12,13,15],'6',{skills:'Engaño +5, Perspicacia +4, Percepción +4, Sigilo +5',senses:'Visión en la oscuridad 18 m, Percepción pasiva 14',lang:'Común',
 traits:['Mirada petrificante: Una criatura que empiece su turno a 9 m y vea sus ojos hace salvación de Con CD 14: si falla por 5 o más queda petrificada; si falla, empieza a petrificarse.'],
 actions:['Ataque múltiple: Tres ataques cuerpo a cuerpo (pelo de serpientes y dos de espada corta) o dos con arco.','Pelo de serpientes: Ataque cuerpo a cuerpo con arma: +5 al impacto, alcance 1,5 m. Impacto: 4 (1d4+2) perforante más 14 (4d6) veneno.','Espada corta: Ataque cuerpo a cuerpo con arma: +5 al impacto, alcance 1,5 m. Impacto: 5 (1d6+2) perforante.','Arco largo: Ataque a distancia con arma: +5 al impacto, alcance 45/180 m. Impacto: 6 (1d8+2) perforante más 7 (2d6) veneno.']}),
M('hidra','Hidra','Hydra','Enorme','Monstruosidad','Sin alineamiento',15,'armadura natural',172,'15d12+75','9 m, nadar 9 m',[20,12,20,2,10,7],'8',{skills:'Percepción +6',senses:'Visión en la oscuridad 18 m, Percepción pasiva 16',tags:['jefe'],
 traits:['Contener el aliento: Aguanta la respiración 1 hora.','Múltiples cabezas: Tiene cinco cabezas. Si recibe 25 de daño o más en un turno, pierde una. Al final de su turno le crecen dos por cada una perdida, salvo que haya recibido fuego. Muere si se queda sin cabezas.','Cabezas reactivas: Una reacción extra por cada cabeza además de la primera, solo para ataques de oportunidad.','Despierta: Siempre hay alguna cabeza despierta.'],
 actions:['Ataque múltiple: Tantos mordiscos como cabezas tenga.','Mordisco: Ataque cuerpo a cuerpo con arma: +8 al impacto, alcance 3 m. Impacto: 10 (1d10+5) perforante.']}),
M('fantasma','Fantasma','Ghost','Mediano','Muerto viviente','Cualquiera',11,'',45,'10d8','0 m, volar 12 m (flotar)',[7,13,10,10,12,17],'4',{res:'ácido, fuego, relámpago, trueno; contundente, perforante y cortante no mágico',imm:'frío, necrótico, veneno',condImm:'hechizado, agotamiento, asustado, agarrado, paralizado, petrificado, envenenado, derribado, apresado',senses:'Visión en la oscuridad 18 m, Percepción pasiva 11',lang:'Sus idiomas de vida',tags:['no muerto'],
 traits:['Vista etérea: Ve 18 m en el Plano Etéreo.','Movimiento incorpóreo: Atraviesa criaturas y objetos como terreno difícil; 5 (1d10) de fuerza si termina dentro de un objeto.'],
 actions:['Toque marchitador: Ataque cuerpo a cuerpo con arma: +5 al impacto, alcance 1,5 m. Impacto: 17 (4d6+3) necrótico.','Eteridad: Entra o sale del Plano Etéreo.','Rostro horripilante: Criaturas a 18 m que lo vean hacen salvación de Sab CD 13 o quedan asustadas 1 minuto; si fallan por 5 o más envejecen 1d4 × 10 años.','Posesión (Recarga 6): Un humanoide a 1,5 m hace salvación de Car CD 13 o es poseído.']}),
M('sombra','Sombra','Shadow','Mediano','Muerto viviente','Caótico malvado',12,'',16,'3d8+3','12 m',[6,14,13,6,10,8],'1/2',{skills:'Sigilo +4 (+6 en penumbra u oscuridad)',vuln:'radiante',res:'ácido, frío, fuego, relámpago, trueno; contundente, perforante y cortante no mágico',imm:'necrótico, veneno',condImm:'agotamiento, asustado, agarrado, paralizado, petrificado, envenenado, derribado, apresado',senses:'Visión en la oscuridad 18 m, Percepción pasiva 10',tags:['no muerto'],
 traits:['Amorfo: Pasa por espacios de 2,5 cm.','Sigilo en las sombras: En penumbra u oscuridad se esconde como acción adicional.','Debilidad a la luz solar: Desventaja en ataques, pruebas y salvaciones bajo luz solar.'],
 actions:['Drenar fuerza: Ataque cuerpo a cuerpo con arma: +4 al impacto, alcance 1,5 m. Impacto: 9 (2d6+2) necrótico y la Fuerza del objetivo baja 1d4. Si llega a 0, muere y se alza una nueva sombra.']}),
M('gargola','Gárgola','Gargoyle','Mediano','Elemental','Caótico malvado',15,'armadura natural',52,'7d8+21','9 m, volar 18 m',[15,11,16,6,11,7],'2',{res:'contundente, perforante y cortante no mágico ni adamantino',imm:'veneno',condImm:'agotamiento, petrificado, envenenado',senses:'Visión en la oscuridad 18 m, Percepción pasiva 10',lang:'Térreo',
 traits:['Apariencia falsa: Inmóvil, parece una estatua.'],
 actions:['Ataque múltiple: Un mordisco y un ataque de garras.','Mordisco: Ataque cuerpo a cuerpo con arma: +4 al impacto, alcance 1,5 m. Impacto: 5 (1d6+2) perforante.','Garras: Ataque cuerpo a cuerpo con arma: +4 al impacto, alcance 1,5 m. Impacto: 5 (1d6+2) cortante.']}),
M('bruja-verde','Bruja verde','Green Hag','Mediano','Feérico','Neutral malvado',17,'armadura natural',82,'11d8+33','9 m',[18,12,16,13,14,14],'3',{skills:'Arcanos +3, Engaño +4, Percepción +4, Sigilo +3',senses:'Visión en la oscuridad 18 m, Percepción pasiva 14',lang:'Común, dracónico, silvano',tags:['feérico'],
 traits:['Anfibia: Respira aire y agua.','Imitación: Imita sonidos de animales y voces; Perspicacia CD 14 para notarlo.','Lanzamiento innato (Car, CD 12): A voluntad: luces danzantes, ilusión menor, burla cruel.'],
 actions:['Garras: Ataque cuerpo a cuerpo con arma: +6 al impacto, alcance 1,5 m. Impacto: 13 (2d8+4) cortante.','Apariencia ilusoria: Se cubre con una ilusión de otra criatura humanoide; Investigación CD 20 para descubrirla.','Paso invisible: Se vuelve invisible hasta que ataque, lance un conjuro o pierda la concentración.']}),
M('doppelganger','Doppelgánger','Doppelganger','Mediano','Monstruosidad (cambiaformas)','Neutral',14,'',52,'8d8+16','9 m',[11,18,14,11,12,14],'3',{skills:'Engaño +6, Perspicacia +3',condImm:'hechizado',senses:'Visión en la oscuridad 18 m, Percepción pasiva 11',lang:'Común',
 traits:['Cambiaformas: Puede adoptar la forma de cualquier humanoide Pequeño o Mediano que haya visto.','Emboscador: Ventaja en ataques contra criaturas que haya sorprendido.','Ataque sorpresa: Si sorprende e impacta en la primera ronda, +10 (3d6) de daño.'],
 actions:['Ataque múltiple: Dos ataques cuerpo a cuerpo.','Golpe: Ataque cuerpo a cuerpo con arma: +6 al impacto, alcance 1,5 m. Impacto: 7 (1d6+4) contundente.','Leer pensamientos: Lee los pensamientos superficiales de una criatura a 18 m.']}),
M('grifo','Grifo','Griffon','Grande','Monstruosidad','Sin alineamiento',12,'',59,'7d10+21','9 m, volar 24 m',[18,15,16,2,13,8],'2',{skills:'Percepción +5',senses:'Visión en la oscuridad 18 m, Percepción pasiva 15',tags:['bestia'],
 traits:['Vista aguda: Ventaja en Percepción basada en la vista.'],
 actions:['Ataque múltiple: Un ataque con el pico y uno con las garras.','Pico: Ataque cuerpo a cuerpo con arma: +6 al impacto, alcance 1,5 m. Impacto: 8 (1d8+4) perforante.','Garras: Ataque cuerpo a cuerpo con arma: +6 al impacto, alcance 1,5 m. Impacto: 11 (2d6+4) cortante.']}),
M('monstruo-corrosivo','Monstruo corrosivo','Rust Monster','Mediano','Monstruosidad','Sin alineamiento',14,'armadura natural',27,'5d8+5','12 m',[13,12,13,2,13,6],'1/2',{senses:'Visión en la oscuridad 18 m, Percepción pasiva 11',
 traits:['Olfatear hierro: Huele metales ferrosos a 9 m.','Corroer metal: Un arma de metal no mágica que lo impacte se corroe (−1 al daño; se destruye en −5).'],
 actions:['Mordisco: Ataque cuerpo a cuerpo con arma: +3 al impacto, alcance 1,5 m. Impacto: 5 (1d8+1) perforante.','Antenas: Corroe un objeto de metal no mágico que vea a 1,5 m; la armadura pierde 1 de CA.']}),
M('vampiro','Vampiro','Vampire','Mediano','Muerto viviente (cambiaformas)','Legal malvado',16,'armadura natural',144,'17d8+68','9 m',[18,18,18,17,15,18],'13',{saves:'Des +9, Sab +7, Car +9',skills:'Percepción +7, Sigilo +9',res:'necrótico; contundente, perforante y cortante no mágico',senses:'Visión en la oscuridad 36 m, Percepción pasiva 17',lang:'Sus idiomas de vida',tags:['no muerto','jefe'],
 traits:['Resistencia legendaria (3/día).','Escapatoria brumosa: Al caer a 0 PG fuera de su ataúd se vuelve niebla y huye.','Regeneración: Recupera 20 PG al inicio de su turno si no recibió daño radiante ni agua bendita.','Trepar cual arácnido.','Debilidades vampíricas: Invitación, agua corriente, estaca en el corazón, luz solar.'],
 actions:['Ataque múltiple (solo forma de vampiro): Dos ataques, solo uno de ellos un mordisco.','Golpe sin armas: Ataque cuerpo a cuerpo con arma: +9 al impacto, alcance 1,5 m. Impacto: 8 (1d8+4) contundente, o agarra (CD 18).','Mordisco: Ataque cuerpo a cuerpo con arma: +9 al impacto, alcance 1,5 m. Impacto: 7 (1d6+4) perforante más 10 (3d6) necrótico; sus PG máximos bajan esa cantidad.','Hechizar: Un humanoide a 9 m hace salvación de Sab CD 17 o queda hechizado 24 horas.','Hijos de la noche (1/día): Invoca murciélagos o ratas en enjambre, o lobos.'],
 legendary:['Puede realizar 3 acciones legendarias por ronda.','Moverse: Se mueve su velocidad sin provocar ataques de oportunidad.','Golpe sin armas: Un golpe sin armas.','Mordisco (cuesta 2 acciones): Un mordisco.']}),
M('tarasca','Tarasca','Tarrasque','Gargantuesco','Monstruosidad (titán)','Sin alineamiento',25,'armadura natural',676,'33d20+330','12 m',[30,11,30,3,11,11],'30',{saves:'Int +5, Sab +9, Car +9',imm:'fuego, veneno; contundente, perforante y cortante no mágico',condImm:'hechizado, asustado, paralizado, envenenado',senses:'Vista ciega 36 m, Percepción pasiva 10',tags:['jefe'],
 traits:['Resistencia legendaria (3/día).','Resistencia mágica: Ventaja en salvaciones contra conjuros.','Caparazón reflectante: Los proyectil mágico, rayos y líneas que la apuntan pueden rebotar.','Monstruo de asedio: Daño doble a objetos y estructuras.'],
 actions:['Ataque múltiple: Usa Presencia aterradora y hace cinco ataques: mordisco, dos garras, cuernos y cola; puede Engullir en lugar del mordisco.','Mordisco: Ataque cuerpo a cuerpo con arma: +19 al impacto, alcance 3 m. Impacto: 36 (4d12+10) perforante y agarra (CD 20).','Garra: Ataque cuerpo a cuerpo con arma: +19 al impacto, alcance 4,5 m. Impacto: 28 (4d8+10) cortante.','Cuernos: Ataque cuerpo a cuerpo con arma: +19 al impacto, alcance 3 m. Impacto: 32 (4d10+10) perforante.','Cola: Ataque cuerpo a cuerpo con arma: +19 al impacto, alcance 6 m. Impacto: 24 (4d6+10) contundente; salvación de Fue CD 20 o derribado.','Presencia aterradora: Criaturas a 36 m, salvación de Sab CD 17 o asustadas 1 minuto.','Engullir: Traga a una criatura agarrada: cegada, apresada, 56 (16d6) ácido por turno.'],
 legendary:['Puede realizar 3 acciones legendarias por ronda.','Ataque: Una garra o la cola.','Moverse: Se mueve la mitad de su velocidad.','Masticar (cuesta 2 acciones): Un mordisco o Engullir.']})
);

/* ===== Especies (reglas 2024, resumen propio) ===== */
const SPECIES=[
 ['aasimar','Aasimar','Aasimar','Mediano o Pequeño','9 m',[['Resistencia celestial','Resistencia al daño necrótico y radiante.'],['Visión en la oscuridad','18 m.'],['Manos curativas','Acción mágica: tocas a una criatura y tiras tantos d4 como tu bonificador de competencia para curarla. Una vez por descanso largo.'],['Portador de luz','Conoces el truco Luz (Carisma).'],['Revelación celestial','Desde nivel 3, acción adicional durante 1 minuto: alas celestiales (vuelo), manto interior (radiante en área) o manto necrótico (asusta). Una vez por turno sumas daño extra igual a tu competencia.']]],
 ['draconido','Dracónido','Dragonborn','Mediano','9 m',[['Ascendencia dracónica','Elige un dragón (negro, azul, latón, bronce, cobre, oro, verde, rojo, plata, blanco): fija el tipo de daño de tu aliento y tu resistencia.'],['Arma de aliento','Al atacar puedes sustituir un ataque por un cono de 4,5 m o una línea de 9 m. Salvación de Des (CD 8 + Con + competencia): 1d10, 2d10 a nv 5, 3d10 a nv 11, 4d10 a nv 17. Usos = competencia por descanso largo.'],['Resistencia al daño','Resistencia al tipo de tu ascendencia.'],['Visión en la oscuridad','18 m.'],['Vuelo dracónico','Desde nivel 5, alas espectrales durante 10 minutos (velocidad de vuelo igual a tu velocidad). Una vez por descanso largo.']]],
 ['enano','Enano','Dwarf','Mediano','9 m',[['Visión en la oscuridad','36 m.'],['Resistencia enana','Resistencia al veneno y ventaja contra quedar envenenado.'],['Dureza enana','+1 PG máximo por nivel.'],['Conocimiento de la piedra','Acción adicional: sentido de la vibración 18 m durante 10 minutos sobre piedra. Usos = competencia.']]],
 ['elfo','Elfo','Elf','Mediano','9 m',[['Visión en la oscuridad','18 m.'],['Linaje élfico','Drow (visión en la oscuridad 36 m, Luces danzantes; luego Fuego feérico y Oscuridad), Alto elfo (Prestidigitación intercambiable; luego Detectar magia y Paso brumoso) o Elfo de los bosques (10,5 m de velocidad, Druidismo; luego Zancada prodigiosa y Pasar sin rastro).'],['Ascendencia feérica','Ventaja contra quedar hechizado.'],['Sentidos agudos','Competencia en Perspicacia, Percepción o Supervivencia.'],['Trance','No necesitas dormir; un descanso largo te lleva 4 horas.']]],
 ['gnomo','Gnomo','Gnome','Pequeño','9 m',[['Visión en la oscuridad','18 m.'],['Astucia gnoma','Ventaja en salvaciones de Inteligencia, Sabiduría y Carisma.'],['Linaje gnomo','Gnomo de los bosques (Ilusión menor y Hablar con los animales) o Gnomo de las rocas (Reparar, Prestidigitación y pequeños mecanismos).']]],
 ['goliat','Goliat','Goliath','Mediano','10,5 m',[['Ascendencia gigante','Un don según el gigante: nube (teletransporte 9 m), fuego (+1d10 fuego), escarcha (+1d6 frío y −3 m de velocidad), colina (derriba), piedra (reduce daño 1d12 + Con) o tormenta (1d8 trueno como reacción). Usos = competencia.'],['Forma grande','Desde nivel 5, acción adicional: eres Grande durante 10 minutos, ventaja en Fuerza y +3 m de velocidad. Una vez por descanso largo.'],['Complexión poderosa','Ventaja para terminar el estado agarrado; cuentas como una talla mayor para cargar.']]],
 ['mediano','Mediano','Halfling','Pequeño','9 m',[['Valiente','Ventaja contra quedar asustado.'],['Agilidad mediana','Puedes moverte por el espacio de criaturas más grandes que tú.'],['Suerte','Si sacas un 1 en un d20, vuelve a tirarlo.'],['Sigilo natural','Puedes esconderte detrás de criaturas de mayor tamaño.']]],
 ['humano','Humano','Human','Mediano o Pequeño','9 m',[['Ingenioso','Ganas Inspiración heroica tras cada descanso largo.'],['Habilidoso','Competencia en una habilidad a elección.'],['Versátil','Una dote de origen a elección.']]],
 ['orco','Orco','Orc','Mediano','9 m',[['Arrebato de adrenalina','Correr como acción adicional y ganar PG temporales iguales a tu competencia. Usos = competencia por descanso corto o largo.'],['Visión en la oscuridad','36 m.'],['Aguante incansable','Cuando caerías a 0 PG quedas a 1. Una vez por descanso largo.']]],
 ['tiefling','Tiefling','Tiefling','Mediano o Pequeño','9 m',[['Visión en la oscuridad','18 m.'],['Legado infernal','Abisal (resistencia al veneno, Rociada venenosa; luego Rayo debilitante y Apresar), Ctónico (resistencia necrótica, Toque helado; luego Falsa vida y Rayo debilitante) o Infernal (resistencia al fuego, Descarga de fuego; luego Reprensión infernal y Oscuridad).'],['Presencia sobrenatural','Conoces el truco Taumaturgia.']]]
].map(([id,name,en,size,speed,traits])=>({id:'esp-'+id,name,en,size,speed,traits,source:'Reglas 2024',full:true}));
const SPECIES_CAT=`Aarakocra|Aarakocra|MPMM|Humanoide alado con velocidad de vuelo.
Bugbear|Bugbear|MPMM|Goblinoide de brazos largos y golpes sorpresa.
Centauro|Centaur|MPMM|Mitad caballo, carga poderosa.
Cambiante|Changeling|MPMM|Puede cambiar de apariencia a voluntad.
Gnomo de las profundidades|Deep Gnome|MPMM|Gnomo subterráneo con camuflaje.
Duergar|Duergar|MPMM|Enano de la Infraoscuridad con magia psiónica.
Eladrin|Eladrin|MPMM|Elfo feérico ligado a las estaciones.
Hada|Fairy|MPMM|Pequeño feérico con alas.
Firbolg|Firbolg|MPMM|Gigante gentil del bosque.
Genasí de aire|Air Genasi|MPMM|Ligado al Plano del Aire.
Genasí de tierra|Earth Genasi|MPMM|Ligado al Plano de la Tierra.
Genasí de fuego|Fire Genasi|MPMM|Ligado al Plano del Fuego.
Genasí de agua|Water Genasi|MPMM|Ligado al Plano del Agua.
Githyanki|Githyanki|MPMM|Guerreros astrales.
Githzerai|Githzerai|MPMM|Monjes de la disciplina mental.
Goblin|Goblin|MPMM|Pequeño, ágil y escurridizo.
Harengon|Harengon|MPMM|Conejo humanoide de reflejos rápidos.
Hobgoblin|Hobgoblin|MPMM|Goblinoide disciplinado.
Kenku|Kenku|MPMM|Ave humanoide imitadora.
Kóbold|Kobold|MPMM|Pequeño reptil de linaje dracónico.
Hombre lagarto|Lizardfolk|MPMM|Reptil anfibio con mordisco.
Minotauro|Minotaur|MPMM|Cuernos y embestidas.
Sátiro|Satyr|MPMM|Feérico juerguista.
Elfo marino|Sea Elf|MPMM|Elfo anfibio.
Shadar-kai|Shadar-kai|MPMM|Elfo del Páramo Sombrío.
Cambiapieles|Shifter|MPMM|Herencia licántropa.
Tabaxi|Tabaxi|MPMM|Felino humanoide veloz.
Tortuga|Tortle|MPMM|Caparazón natural.
Tritón|Triton|MPMM|Guardián de los océanos.
Yuan-ti|Yuan-ti|MPMM|Ofidio con resistencia mágica.
Kalashtar|Kalashtar|ERLW|Humanos ligados a espíritus de sueños.
Forjado|Warforged|ERLW|Constructo viviente.
Loxodonte|Loxodon|GGR|Elefantino sereno.
Híbrido Simic|Simic Hybrid|GGR|Mejoras animales.
Vedalken|Vedalken|GGR|Lógico y meticuloso.
Leonino|Leonin|MOT|Felino orgulloso de Theros.
Búhoide|Owlin|SCC|Humanoide búho que vuela.
Elfo astral|Astral Elf|SAiS|Elfo del Mar Astral.
Autognomo|Autognome|SAiS|Constructo gnomo.
Giff|Giff|SAiS|Hipopótamo humanoide.
Hadozee|Hadozee|SAiS|Simio planeador.
Plasmoide|Plasmoid|SAiS|Cuerpo de limo amorfo.
Thri-kreen|Thri-kreen|SAiS|Insectoide de cuatro brazos.
Kender|Kender|DSotDQ|Curioso e intrépido.
Hexblood|Hexblood|VRGR|Linaje de brujas (como linaje).
Dhampiro|Dhampir|VRGR|Medio vampiro (como linaje).
Reencarnado|Reborn|VRGR|Vuelto de la muerte (como linaje).
Semielfo|Half-Elf|PHB14|Del Manual del Jugador 2014.
Semiorco|Half-Orc|PHB14|Del Manual del Jugador 2014.`.split('\n').map(l=>{ const [name,en,src,desc]=l.split('|'); return {id:'espx-'+en.toLowerCase().replace(/[^a-z]+/g,'-'),name,en,source:src,desc,full:false}; });

/* ===== Subclases de manuales y expansiones (índice) ===== */
const SUBCLASS_CAT={
 barbaro:'Corazón salvaje|PHB24;Árbol del mundo|PHB24;Fanático|PHB24;Guardián ancestral|XGE;Heraldo de la tormenta|XGE;Bestia|TCE;Magia salvaje|TCE;Furia de batalla|SCAG',
 bardo:'Danza|PHB24;Glamour|PHB24;Valor|PHB24;Espadas|XGE;Susurros|XGE;Creación|TCE;Elocuencia|TCE;Espíritus|VRGR',
 clerigo:'Luz|PHB24;Engaño|PHB24;Guerra|PHB24;Forja|XGE;Sepulcro|XGE;Orden|TCE;Paz|TCE;Crepúsculo|TCE;Arcano|SCAG',
 druida:'Luna|PHB24;Mar|PHB24;Estrellas|PHB24;Sueños|XGE;Pastor|XGE;Fuego salvaje|TCE;Esporas|GGR',
 guerrero:'Maestro de batalla|PHB24;Caballero arcano|PHB24;Guerrero psiónico|PHB24;Arquero arcano|XGE;Caballero|XGE;Samurái|XGE;Caballero rúnico|TCE;Caballero del eco|EGW;Caballero dragón púrpura|SCAG',
 monje:'Misericordia|PHB24;Sombra|PHB24;Elementos|PHB24;Maestro borracho|XGE;Kensei|XGE;Alma solar|XGE;Yo astral|TCE;Dragón ascendente|FTD;Larga muerte|SCAG',
 paladin:'Antiguos|PHB24;Gloria|PHB24;Venganza|PHB24;Conquista|XGE;Redención|XGE;Vigilantes|TCE;Corona|SCAG;Rompejuramentos|DMG',
 explorador:'Señor de las bestias|PHB24;Feérico errante|PHB24;Acechador sombrío|PHB24;Caminante del horizonte|XGE;Cazador de monstruos|XGE;Guardián del enjambre|TCE;Guardián dracónico|FTD',
 picaro:'Asesino|PHB24;Embaucador arcano|PHB24;Alma afilada|PHB24;Inquisitivo|XGE;Cerebro criminal|XGE;Explorador|XGE;Espadachín|XGE;Fantasma|TCE',
 hechicero:'Mente aberrante|PHB24;Alma mecánica|PHB24;Magia salvaje|PHB24;Alma divina|XGE;Magia sombría|XGE;Hechicería de tormenta|XGE;Hechicería lunar|BMT',
 brujo:'Archifeérico|PHB24;Celestial|PHB24;Gran Antiguo|PHB24;Hoja maldita|XGE;Insondable|TCE;Genio|TCE;No muerto|VRGR;Inmortal|SCAG',
 mago:'Abjurador|PHB24;Adivino|PHB24;Ilusionista|PHB24;Magia de guerra|XGE;Danzarín de la espada|TCE;Orden de los escribas|TCE;Cronurgia|EGW;Graviturgia|EGW'
};
const EXTRA_CLASSES=[{id:'artifice',name:'Artífice',en:'Artificer',source:'TCE',desc:'Inventor que infunde objetos con magia. Medio lanzador con Inteligencia. Especialistas: Alquimista, Armero, Artillero y Herrero de batalla.',full:false}];

/* ===== Hechizos de manuales y expansiones (índice) ===== */
const SPELL_CAT=`Protección contra armas|Blade Ward|0|a|PHB14
Amistad|Friends|0|e|PHB14
Orbe cromático|Chromatic Orb|1|v|PHB14
Rayo de bruja|Witch Bolt|1|v|PHB14
Armadura de Agathys|Armor of Agathys|1|a|PHB14
Brazos de Hadar|Arms of Hadar|1|c|PHB14
Maleficio|Hex|1|e|PHB14
Susurros disonantes|Dissonant Whispers|1|e|PHB14
Golpe atrapador|Ensnaring Strike|1|c|PHB14
Granizo de espinas|Hail of Thorns|1|c|PHB14
Duelo obligado|Compelled Duel|1|e|PHB14
Castigo abrasador|Searing Smite|1|v|PHB14
Castigo atronador|Thunderous Smite|1|v|PHB14
Castigo colérico|Wrathful Smite|1|v|PHB14
Nube de dagas|Cloud of Daggers|2|c|PHB14
Corona de locura|Crown of Madness|2|e|PHB14
Fuerza fantasmal|Phantasmal Force|2|i|PHB14
Sentido de bestia|Beast Sense|2|d|PHB14
Cordón de flechas|Cordon of Arrows|2|t|PHB14
Aura de vitalidad|Aura of Vitality|3|v|PHB14
Castigo cegador|Blinding Smite|3|v|PHB14
Conjurar andanada|Conjure Barrage|3|c|PHB14
Manto del cruzado|Crusader's Mantle|3|v|PHB14
Arma elemental|Elemental Weapon|3|t|PHB14
Fingir muerte|Feign Death|3|n|PHB14
Hambre de Hadar|Hunger of Hadar|3|c|PHB14
Flecha relampagueante|Lightning Arrow|3|t|PHB14
Aura de vida|Aura of Life|4|a|PHB14
Aura de pureza|Aura of Purity|4|a|PHB14
Enredadera aferradora|Grasping Vine|4|c|PHB14
Castigo asombroso|Staggering Smite|4|v|PHB14
Castigo desterrador|Banishing Smite|5|a|PHB14
Círculo de poder|Circle of Power|5|a|PHB14
Conjurar descarga|Conjure Volley|5|c|PHB14
Onda destructora|Destructive Wave|5|v|PHB14
Carcaj veloz|Swift Quiver|5|t|PHB14
Portal arcano|Arcane Gate|6|c|PHB14
Telepatía|Telepathy|8|v|PHB14
Palabra de poder: sanar|Power Word Heal|9|v|PHB14
Controlar llamas|Control Flames|0|t|XGE
Crear hoguera|Create Bonfire|0|c|XGE
Congelación|Frostbite|0|v|XGE
Ráfaga|Gust|0|t|XGE
Infestación|Infestation|0|c|XGE
Piedra mágica|Magic Stone|0|t|XGE
Moldear la tierra|Mold Earth|0|t|XGE
Salvajismo primigenio|Primal Savagery|0|t|XGE
Moldear el agua|Shape Water|0|t|XGE
Trueno|Thunderclap|0|v|XGE
Doblar por los muertos|Toll the Dead|0|n|XGE
Palabra radiante|Word of Radiance|0|v|XGE
Absorber elementos|Absorb Elements|1|a|XGE
Vínculo bestial|Beast Bond|1|d|XGE
Catapulta|Catapult|1|t|XGE
Causar miedo|Cause Fear|1|n|XGE
Ceremonia|Ceremony|1|a|XGE
Descarga caótica|Chaos Bolt|1|v|XGE
Temblor|Earth Tremor|1|v|XGE
Cuchillo de hielo|Ice Knife|1|c|XGE
Trampa de lazo|Snare|1|a|XGE
Golpe céfiro|Zephyr Strike|1|t|XGE
Abrasador de Aganazzar|Aganazzar's Scorcher|2|v|XGE
Aliento de dragón|Dragon's Breath|2|t|XGE
Remolino de polvo|Dust Devil|2|c|XGE
Atadura terrestre|Earthbind|2|t|XGE
Espíritu sanador|Healing Spirit|2|c|XGE
Púa mental|Mind Spike|2|d|XGE
Agarre terrenal de Maximilian|Maximilian's Earthen Grasp|2|t|XGE
Pirotecnia|Pyrotechnics|2|t|XGE
Hoja de sombras|Shadow Blade|2|i|XGE
Escritura celeste|Skywrite|2|t|XGE
Enjambre de bolas de nieve de Snilloc|Snilloc's Snowball Swarm|2|v|XGE
Viento protector|Warding Wind|2|v|XGE
Siesta|Catnap|3|e|XGE
Enemigos por doquier|Enemies Abound|3|e|XGE
Tierra en erupción|Erupting Earth|3|t|XGE
Flechas de fuego|Flame Arrows|3|t|XGE
Transferencia de vida|Life Transference|3|n|XGE
Meteoritos diminutos de Melf|Melf's Minute Meteors|3|v|XGE
Invocar demonios menores|Summon Lesser Demons|3|c|XGE
Paso atronador|Thunder Step|3|c|XGE
Ola gigante|Tidal Wave|3|c|XGE
Pequeño sirviente|Tiny Servant|3|t|XGE
Muro de arena|Wall of Sand|3|v|XGE
Muro de agua|Wall of Water|3|v|XGE
Hechizar monstruo|Charm Monster|4|e|XGE
Perdición elemental|Elemental Bane|4|t|XGE
Encontrar corcel mayor|Find Greater Steed|4|c|XGE
Guardián de la naturaleza|Guardian of Nature|4|t|XGE
Radiación nauseabunda|Sickening Radiance|4|v|XGE
Esfera de tormenta|Storm Sphere|4|v|XGE
Invocar demonio mayor|Summon Greater Demon|4|c|XGE
Esfera vitriólica|Vitriolic Sphere|4|v|XGE
Esfera acuosa|Watery Sphere|4|c|XGE
Controlar vientos|Control Winds|5|t|XGE
Danza macabra|Danse Macabre|5|n|XGE
Alba|Dawn|5|v|XGE
Enervación|Enervation|5|n|XGE
Paso lejano|Far Step|5|c|XGE
Arma sagrada|Holy Weapon|5|v|XGE
Inmolación|Immolation|5|v|XGE
Llamada infernal|Infernal Calling|5|c|XGE
Inundación de energía negativa|Negative Energy Flood|5|n|XGE
Potenciar habilidad|Skill Empowerment|5|t|XGE
Golpe del viento de acero|Steel Wind Strike|5|c|XGE
Estática sináptica|Synaptic Static|5|e|XGE
Transmutar roca|Transmute Rock|5|t|XGE
Muro de luz|Wall of Light|5|v|XGE
Ira de la naturaleza|Wrath of Nature|5|v|XGE
Huesos de la tierra|Bones of the Earth|6|t|XGE
Crear homúnculo|Create Homunculus|6|t|XGE
Investidura de llamas|Investiture of Flame|6|t|XGE
Investidura de hielo|Investiture of Ice|6|t|XGE
Investidura de piedra|Investiture of Stone|6|t|XGE
Investidura de viento|Investiture of Wind|6|t|XGE
Prisión mental|Mental Prison|6|i|XGE
Custodia primordial|Primordial Ward|6|a|XGE
Dispersar|Scatter|6|c|XGE
Jaula de almas|Soul Cage|6|n|XGE
Transformación de Tenser|Tenser's Transformation|6|t|XGE
Corona de estrellas|Crown of Stars|7|v|XGE
Palabra de poder: dolor|Power Word Pain|7|e|XGE
Templo de los dioses|Temple of the Gods|7|c|XGE
Torbellino|Whirlwind|7|v|XGE
Marchitamiento horrible de Abi-Dalzim|Abi-Dalzim's Horrid Wilting|8|n|XGE
Dragón ilusorio|Illusory Dragon|8|i|XGE
Oscuridad enloquecedora|Maddening Darkness|8|v|XGE
Fortaleza poderosa|Mighty Fortress|8|c|XGE
Invulnerabilidad|Invulnerability|9|a|XGE
Polimorfar en masa|Mass Polymorph|9|t|XGE
Grito psíquico|Psychic Scream|9|e|XGE
Hoja atronadora|Booming Blade|0|v|TCE
Hoja de llama verde|Green-Flame Blade|0|v|TCE
Señuelo relampagueante|Lightning Lure|0|v|TCE
Astilla mental|Mind Sliver|0|e|TCE
Estallido de espadas|Sword Burst|0|c|TCE
Brebaje cáustico de Tasha|Tasha's Caustic Brew|1|v|TCE
Látigo mental de Tasha|Tasha's Mind Whip|2|e|TCE
Invocar bestia|Summon Beast|2|c|TCE
Fortaleza del intelecto|Intellect Fortress|3|a|TCE
Mortaja espiritual|Spirit Shroud|3|n|TCE
Invocar feérico|Summon Fey|3|c|TCE
Invocar engendro sombrío|Summon Shadowspawn|3|c|TCE
Invocar muerto viviente|Summon Undead|3|n|TCE
Invocar aberración|Summon Aberration|4|c|TCE
Invocar constructo|Summon Construct|4|c|TCE
Invocar elemental|Summon Elemental|4|c|TCE
Invocar celestial|Summon Celestial|5|c|TCE
Invocar infernal|Summon Fiend|6|c|TCE
Disfraz de otro mundo de Tasha|Tasha's Otherworldly Guise|6|t|TCE
Sueño del velo azul|Dream of the Blue Veil|7|c|TCE
Hoja del desastre|Blade of Disaster|9|c|TCE
Travesura de Nathair|Nathair's Mischief|2|i|FTD
Hielo vinculante de Rime|Rime's Binding Ice|2|v|FTD
Zancada de Ashardalon|Ashardalon's Stride|3|t|FTD
Lanza psíquica de Raulothim|Raulothim's Psychic Lance|4|e|FTD
Invocar espíritu dracónico|Summon Draconic Spirit|5|c|FTD
Escudo de platino de Fizban|Fizban's Platinum Shield|6|a|FTD
Transformación dracónica|Draconic Transformation|7|t|FTD
Elementalismo|Elementalism|0|t|PHB24
Estallido hechicero|Sorcerous Burst|0|v|PHB24
Destello estelar|Starry Wisp|0|v|PHB24
Vigor arcano|Arcane Vigor|2|a|PHB24
Castigo resplandeciente|Shining Smite|2|t|PHB24
Fuente de luz lunar|Fount of Moonlight|4|v|PHB24
Tormenta radiante de Jallarzi|Jallarzi's Storm of Radiance|5|v|PHB24
Presencia regia de Yolande|Yolande's Regal Presence|5|e|PHB24
Invocar dragón|Summon Dragon|5|c|PHB24
Caldero burbujeante de Tasha|Tasha's Bubbling Cauldron|6|c|PHB24
Palabra de poder: fortalecer|Power Word Fortify|7|e|PHB24`.split('\n').map(l=>{ const [name,en,lv,sc,src]=l.split('|'); return {id:'spx-'+en.toLowerCase().replace(/[^a-z]+/g,'-'),name,en,level:+lv,school:SCHOOLS[sc],source:src,classes:[],full:false}; });

/* ===== Monstruos de manuales y expansiones (índice) ===== */
const MONSTER_CAT=`Contemplador|Beholder|13|Aberración|MM14
Tirano de la muerte|Death Tyrant|14|No muerto|MM14
Espectador|Spectator|3|Aberración|MM14
Azotamentes|Mind Flayer|7|Aberración|MM14
Devorador de intelectos|Intellect Devourer|2|Aberración|MM14
Bestia trasladante|Displacer Beast|3|Monstruosidad|MM14
Guerrero githyanki|Githyanki Warrior|3|Humanoide|MM14
Monje githzerai|Githzerai Monk|2|Humanoide|MM14
Kuo-toa|Kuo-toa|1/4|Humanoide|MM14
Abominación yuan-ti|Yuan-ti Abomination|7|Monstruosidad|MM14
Slaad rojo|Red Slaad|5|Aberración|MM14
Gusano carroñero|Carrion Crawler|2|Monstruosidad|MM14
Horror ganchudo|Hook Horror|3|Monstruosidad|MM14
Nótico|Nothic|2|Aberración|MM14
Grell|Grell|3|Aberración|MM14
Horror con yelmo|Helmed Horror|4|Constructo|MM14
Aparecido|Revenant|5|No muerto|MM14
Caballero de la muerte|Death Knight|17|No muerto|MM14
Semiliche|Demilich|18|No muerto|MM14
Sacerdotisa drow de Lolth|Drow Priestess of Lolth|8|Humanoide|MM14
Flumph|Flumph|1/8|Aberración|MM14
Soberano miconide|Myconid Sovereign|2|Planta|MM14
Froghemoth|Froghemoth|10|Monstruosidad|VGM
Neogi|Neogi|3|Aberración|VGM
Caracol de mayales|Flail Snail|3|Elemental|VGM
Banderhobb|Banderhobb|5|Monstruosidad|VGM
Bodak|Bodak|6|No muerto|VGM
Barghest|Barghest|4|Infernal|VGM
Leucrota|Leucrotta|3|Monstruosidad|VGM
Sabueso yeth|Yeth Hound|4|Feérico|VGM
Cerebro anciano|Elder Brain|14|Aberración|VGM
Neotélido|Neothelid|13|Aberración|VGM
Woad del bosque|Wood Woad|5|Planta|VGM
Orcus|Orcus|26|Infernal (demonio)|MTF
Demogorgon|Demogorgon|26|Infernal (demonio)|MTF
Graz'zt|Graz'zt|24|Infernal (demonio)|MTF
Yeenoghu|Yeenoghu|24|Infernal (demonio)|MTF
Baphomet|Baphomet|23|Infernal (demonio)|MTF
Juiblex|Juiblex|23|Infernal (demonio)|MTF
Zuggtmoy|Zuggtmoy|23|Infernal (demonio)|MTF
Bael|Bael|19|Infernal (diablo)|MTF
Tiamat|Tiamat|30|Infernal|MTF
Caminante nocturno|Nightwalker|20|No muerto|MTF
Depredador de acero|Steel Predator|16|Constructo|MTF
Tempestad anciana|Elder Tempest|23|Elemental|MTF
Marut|Marut|25|Constructo|MTF
Déspota duergar|Duergar Despot|12|Humanoide|MTF
Madre matrona drow|Drow Matron Mother|20|Humanoide|MTF
Dragón de amatista adulto|Adult Amethyst Dragon|16|Dragón|FTD
Dragón de cristal adulto|Adult Crystal Dragon|12|Dragón|FTD
Dragón de esmeralda adulto|Adult Emerald Dragon|15|Dragón|FTD
Dragón de zafiro adulto|Adult Sapphire Dragon|15|Dragón|FTD
Dragón de topacio adulto|Adult Topaz Dragon|13|Dragón|FTD
Dracolich adulto azul|Adult Blue Dracolich|17|No muerto|MM14`.split('\n').map(l=>{ const [name,en,cr,type,src]=l.split('|'); return {id:'mx-'+en.toLowerCase().replace(/[^a-z]+/g,'-'),name,en,cr,type,source:src,full:false}; });

/* ===== Reglas rápidas ===== */
const RULES=[
 ['Acciones en combate',[['Atacar','Un ataque con arma o sin armas (más con Ataque adicional).'],['Correr','Ganas movimiento extra igual a tu velocidad.'],['Destrabarse','Tu movimiento no provoca ataques de oportunidad este turno.'],['Esquivar','Ataques contra ti con desventaja y ventaja en salvaciones de Des hasta tu turno.'],['Ayudar','Un aliado tiene ventaja en su próxima prueba o ataque contra un enemigo a 1,5 m de ti.'],['Esconderse','Prueba de Sigilo CD 15 estando fuera de la vista.'],['Influir','Prueba social para convencer a una criatura.'],['Magia','Lanzar un conjuro o usar un objeto mágico.'],['Preparar','Preparas una acción para un desencadenante; la usas con tu reacción.'],['Buscar','Prueba de Sabiduría para encontrar algo.'],['Estudiar','Prueba de Inteligencia para recordar o analizar.'],['Usar un objeto','Interactuar con un objeto que lo requiera.']]],
 ['Cobertura',[['Media','+2 a la CA y a las salvaciones de Destreza.'],['Tres cuartos','+5 a la CA y a las salvaciones de Destreza.'],['Total','No puede ser objetivo directo.']]],
 ['Dificultad de pruebas',[['Muy fácil','CD 5'],['Fácil','CD 10'],['Media','CD 15'],['Difícil','CD 20'],['Muy difícil','CD 25'],['Casi imposible','CD 30']]],
 ['Descansos',[['Descanso corto','1 hora: gastas Dados de Golpe para curarte.'],['Descanso largo','8 horas: recuperas todos los PG y los Dados de Golpe, y bajas un nivel de agotamiento.']]],
 ['Visión y luz',[['Luz brillante','Visión normal.'],['Penumbra','Ligeramente oscurecido: desventaja en Percepción basada en la vista.'],['Oscuridad','Muy oscurecido: estás cegado a efectos prácticos.']]],
 ['Peligros',[['Caídas','1d6 contundente por cada 3 m, máximo 20d6; caes derribado.'],['Asfixia','Aguantas la respiración 1 + Con minutos (mínimo 30 segundos).'],['Salvaciones de muerte','CD 10 al inicio del turno a 0 PG; 3 éxitos te estabilizan, 3 fallos te matan. Un 20 te devuelve 1 PG.'],['Concentración','Al recibir daño, salvación de Con CD 10 o la mitad del daño (máximo 30).']]],
 ['Viaje',[['Ritmo rápido','Unos 48 km por día; desventaja en Percepción.'],['Ritmo normal','Unos 38 km por día.'],['Ritmo lento','Unos 29 km por día; puedes moverte con sigilo.']]]
];
