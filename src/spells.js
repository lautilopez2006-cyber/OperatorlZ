/* ===== Hechizos del SRD 5.1 (CC-BY 4.0), resumen propio en español =====
   Formato: nombre|inglés|nivel|escuela|tiempo|alcance|componentes|duración|banderas(C=concentración,R=ritual)|clases|resumen */
const SPELL_SRC=`Salpicadura de ácido|Acid Splash|0|c|A|18 m|V,S|Inst.||HM|Una o dos criaturas adyacentes entre sí hacen salvación de Des o reciben 1d6 de ácido. Escala a 2d6, 3d6 y 4d6 en niveles 5, 11 y 17.
Toque helado|Chill Touch|0|n|A|36 m|V,S|1 asalto||HWM|Ataque de conjuro a distancia: 1d8 necrótico y el objetivo no recupera PG hasta tu siguiente turno. Los no muertos tienen desventaja contra ti. Escala con el nivel.
Luces danzantes|Dancing Lights|0|v|A|36 m|V,S,M|1 min|C|BHM|Creas hasta cuatro luces del tamaño de antorchas que puedes mover 18 m como acción adicional.
Druidismo|Druidcraft|0|t|A|9 m|V,S|Inst.||D|Pequeños efectos naturales: predecir el clima, hacer florecer una planta, encender o apagar una vela, un efecto sensorial inofensivo.
Descarga sobrenatural|Eldritch Blast|0|v|A|36 m|V,S|Inst.||W|Ataque de conjuro a distancia: 1d10 de fuerza. Rayos adicionales en niveles 5, 11 y 17.
Descarga de fuego|Fire Bolt|0|v|A|36 m|V,S|Inst.||HM|Ataque de conjuro a distancia: 1d10 de fuego; prende objetos inflamables. Escala a 2d10, 3d10 y 4d10.
Orientación divina|Guidance|0|d|A|Toque|V,S|1 min|C|CD|El objetivo suma 1d4 a una prueba de característica de su elección.
Luz|Light|0|v|A|Toque|V,M|1 h||BCHM|Un objeto emite luz brillante en 6 m y tenue 6 m más.
Mano de mago|Mage Hand|0|c|A|9 m|V,S|1 min||BHWM|Una mano espectral manipula objetos de hasta 5 kg; no ataca ni activa objetos mágicos.
Reparar|Mending|0|t|1 min|Toque|V,S,M|Inst.||BCDHM|Repara una rotura o desgarro de hasta 30 cm en un objeto.
Mensaje|Message|0|t|A|36 m|V,S,M|1 asalto||BHM|Susurras un mensaje a una criatura y solo ella lo oye y puede responder.
Ilusión menor|Minor Illusion|0|i|A|9 m|S,M|1 min||BHWM|Creas un sonido o la imagen de un objeto de hasta 1,5 m. Investigación contra tu CD para descubrirla.
Rociada venenosa|Poison Spray|0|c|A|3 m|V,S|Inst.||DHWM|Salvación de Con o 1d12 de veneno. Escala con el nivel.
Prestidigitación|Prestidigitation|0|t|A|3 m|V,S|1 h||BHWM|Trucos menores: chispas, limpiar, calentar, marcar, crear una baratija ilusoria.
Producir llama|Produce Flame|0|c|A|Personal|V,S|10 min||D|Una llama en tu mano da luz; puedes lanzarla (ataque a distancia 9 m) por 1d8 de fuego.
Rayo de escarcha|Ray of Frost|0|v|A|18 m|V,S|Inst.||HM|Ataque de conjuro a distancia: 1d8 de frío y la velocidad del objetivo baja 3 m hasta tu turno.
Resistencia|Resistance|0|a|A|Toque|V,S,M|1 min|C|CD|El objetivo suma 1d4 a una tirada de salvación.
Llama sagrada|Sacred Flame|0|v|A|18 m|V,S|Inst.||C|Salvación de Des o 1d8 radiante; ignora la cobertura.
Shillelagh|Shillelagh|0|t|AA|Toque|V,S,M|1 min||D|Tu garrote o bastón usa tu característica de lanzamiento y hace 1d8.
Agarre electrizante|Shocking Grasp|0|v|A|Toque|V,S|Inst.||HM|Ataque cuerpo a cuerpo con ventaja contra armadura de metal: 1d8 de relámpago y el objetivo no puede usar reacciones.
Piedad con los moribundos|Spare the Dying|0|n|A|Toque|V,S|Inst.||C|Estabilizas a una criatura viva con 0 PG.
Taumaturgia|Thaumaturgy|0|t|A|9 m|V|1 min||C|Manifestaciones menores: voz atronadora, temblores, llamas que parpadean, puertas que se abren de golpe.
Golpe certero|True Strike|0|d|A|9 m|S|1 asalto|C|BHWM|Tu próximo ataque contra el objetivo tiene ventaja.
Burla cruel|Vicious Mockery|0|e|A|18 m|V|Inst.||B|Salvación de Sab o 1d4 psíquico y desventaja en su próximo ataque.
Alarma|Alarm|1|a|1 min|9 m|V,S,M|8 h|R|EM|Una alarma mental o audible avisa cuando una criatura entra en el área vigilada.
Amistad con los animales|Animal Friendship|1|e|A|9 m|V,S,M|24 h||BDE|Una bestia con Int 3 o menos hace salvación de Sab o queda hechizada.
Perdición|Bane|1|e|A|9 m|V,S,M|1 min|C|BC|Hasta tres criaturas hacen salvación de Car o restan 1d4 a ataques y salvaciones.
Bendecir|Bless|1|e|A|9 m|V,S,M|1 min|C|CP|Hasta tres criaturas suman 1d4 a ataques y salvaciones.
Manos ardientes|Burning Hands|1|v|A|Cono 4,5 m|V,S|Inst.||HM|Salvación de Des: 3d6 de fuego, mitad si tiene éxito. +1d6 por nivel superior.
Hechizar persona|Charm Person|1|e|A|9 m|V,S|1 h||BDHWM|Un humanoide hace salvación de Sab (con ventaja si lo amenazas) o queda hechizado.
Rociada de color|Color Spray|1|i|A|Cono 4,5 m|V,S,M|1 asalto||HM|Ciega a criaturas sumando 6d10 PG, empezando por las de menos PG.
Orden imperiosa|Command|1|e|A|18 m|V|1 asalto||CP|Una palabra (acércate, suelta, huye, al suelo, alto). Salvación de Sab o la obedece en su turno.
Comprensión idiomática|Comprehend Languages|1|d|A|Personal|V,S,M|1 h|R|BHWM|Entiendes cualquier idioma hablado y escrito que oigas o toques.
Crear o destruir agua|Create or Destroy Water|1|t|A|9 m|V,S,M|Inst.||CD|Creas o destruyes hasta 40 litros de agua.
Curar heridas|Cure Wounds|1|v|A|Toque|V,S|Inst.||BCDPE|Recupera 1d8 + mod. de característica. +1d8 por nivel superior.
Detectar el bien y el mal|Detect Evil and Good|1|d|A|Personal|V,S|10 min|C|CP|Percibes aberraciones, celestiales, elementales, feéricos, infernales y no muertos a 9 m.
Detectar magia|Detect Magic|1|d|A|Personal|V,S|10 min|C,R|BCDPEHM|Percibes magia a 9 m y su escuela si la ves.
Detectar veneno y enfermedad|Detect Poison and Disease|1|d|A|Personal|V,S,M|10 min|C,R|CDPE|Percibes venenos, criaturas venenosas y enfermedades a 9 m.
Disfrazarse|Disguise Self|1|i|A|Personal|V,S|1 h||BHM|Cambias tu apariencia ilusoriamente. Investigación contra tu CD para notarlo.
Favor divino|Divine Favor|1|v|AA|Personal|V,S|1 min|C|P|Tus ataques con arma hacen 1d4 radiante extra.
Enmarañar|Entangle|1|c|A|27 m|V,S|1 min|C|D|Cuadrado de 6 m de terreno difícil; salvación de Fue o apresado.
Retirada expeditiva|Expeditious Retreat|1|t|AA|Personal|V,S|10 min|C|HWM|Puedes Correr como acción adicional.
Fuego feérico|Faerie Fire|1|v|A|18 m|V|1 min|C|BD|Cubo de 6 m: salvación de Des o brillan; ataques contra ellos con ventaja y no pueden ser invisibles.
Falsa vida|False Life|1|n|A|Personal|V,S,M|1 h||HM|Ganas 1d4+4 PG temporales (+5 por nivel superior).
Caída de pluma|Feather Fall|1|t|R|18 m|V,M|1 min||BHM|Hasta cinco criaturas caen a 18 m por asalto sin recibir daño.
Encontrar familiar|Find Familiar|1|c|1 h|3 m|V,S,M|Inst.|R|M|Invocas un espíritu con forma animal que te sirve y comparte sentidos contigo.
Disco flotante|Floating Disk|1|c|A|9 m|V,S,M|1 h|R|M|Un disco de fuerza carga hasta 250 kg y te sigue.
Nube de niebla|Fog Cloud|1|c|A|36 m|V,S|1 h|C|DEHM|Esfera de 6 m de niebla que oscurece completamente. +6 m de radio por nivel.
Bayas nutritivas|Goodberry|1|t|A|Toque|V,S,M|Inst.||DE|Diez bayas; cada una cura 1 PG y alimenta un día.
Grasa|Grease|1|c|A|18 m|V,S,M|1 min||M|Cuadrado de 3 m resbaladizo: salvación de Des o caen derribados.
Saeta guía|Guiding Bolt|1|v|A|36 m|V,S|1 asalto||C|Ataque de conjuro: 4d6 radiante y el siguiente ataque contra el objetivo tiene ventaja.
Palabra de curación|Healing Word|1|v|AA|18 m|V|Inst.||BCD|Cura 1d4 + mod. a distancia. +1d4 por nivel superior.
Reprensión infernal|Hellish Rebuke|1|v|R|18 m|V,S|Inst.||W|Cuando te dañan: salvación de Des, 2d10 de fuego, mitad si tiene éxito.
Heroísmo|Heroism|1|e|A|Toque|V,S|1 min|C|BP|Inmune a asustado y gana PG temporales igual a tu mod. cada turno.
Risa horrible|Hideous Laughter|1|e|A|9 m|V,S,M|1 min|C|BM|Salvación de Sab o cae derribado e incapacitado por la risa.
Marca del cazador|Hunter's Mark|1|d|AA|27 m|V|1 h|C|E|Tus ataques con arma hacen 1d6 extra al objetivo y tienes ventaja para rastrearlo.
Identificar|Identify|1|d|1 min|Toque|V,S,M|Inst.|R|BM|Conoces las propiedades de un objeto mágico y los conjuros que lo afectan.
Escritura ilusoria|Illusory Script|1|i|1 min|Toque|S,M|10 días|R|BWM|Un texto que solo tú y quienes elijas pueden leer.
Infligir heridas|Inflict Wounds|1|n|A|Toque|V,S|Inst.||C|Ataque cuerpo a cuerpo de conjuro: 3d10 necrótico. +1d10 por nivel.
Salto|Jump|1|t|A|Toque|V,S,M|1 min||DEHM|La distancia de salto del objetivo se triplica.
Zancada prodigiosa|Longstrider|1|t|A|Toque|V,S,M|1 h||BDEM|+3 m de velocidad.
Armadura de mago|Mage Armor|1|a|A|Toque|V,S,M|8 h||HM|CA base 13 + Des para una criatura sin armadura.
Proyectil mágico|Magic Missile|1|v|A|36 m|V,S|Inst.||HM|Tres dardos que aciertan siempre, 1d4+1 de fuerza cada uno. +1 dardo por nivel.
Protección contra el bien y el mal|Protection from Evil and Good|1|a|A|Toque|V,S,M|10 min|C|CPWM|Aberraciones, celestiales, elementales, feéricos, infernales y no muertos atacan con desventaja.
Purificar comida y bebida|Purify Food and Drink|1|t|A|3 m|V,S|Inst.|R|CDP|Elimina veneno y enfermedad de la comida y bebida en una esfera de 1,5 m.
Santuario|Sanctuary|1|a|AA|9 m|V,S,M|1 min||C|Quien quiera atacar al protegido hace salvación de Sab o debe elegir otro objetivo.
Escudo|Shield|1|a|R|Personal|V,S|1 asalto||HM|+5 a la CA hasta tu siguiente turno e inmunidad a Proyectil mágico.
Escudo de fe|Shield of Faith|1|a|AA|18 m|V,S,M|10 min|C|CP|+2 a la CA de una criatura.
Imagen silenciosa|Silent Image|1|i|A|18 m|V,S,M|10 min|C|BHM|Imagen visual de hasta un cubo de 4,5 m que puedes mover.
Dormir|Sleep|1|e|A|27 m|V,S,M|1 min||BHM|Duerme a criaturas sumando 5d8 PG, empezando por las de menos PG. +2d8 por nivel.
Hablar con los animales|Speak with Animals|1|d|A|Personal|V,S|10 min|R|BDE|Puedes comunicarte con las bestias.
Ola atronadora|Thunderwave|1|v|A|Cubo 4,5 m|V,S|Inst.||BDHM|Salvación de Con: 2d8 de trueno y empujadas 3 m; mitad sin empuje si tienen éxito.
Sirviente invisible|Unseen Servant|1|c|A|18 m|V,S,M|1 h|R|BWM|Una fuerza invisible hace tareas simples.
Flecha ácida|Acid Arrow|2|v|A|27 m|V,S,M|Inst.||M|Ataque de conjuro: 4d4 de ácido y 2d4 al final de su siguiente turno.
Ayuda|Aid|2|a|A|9 m|V,S,M|8 h||CP|Hasta tres criaturas aumentan sus PG máximos y actuales en 5.
Alterar el propio aspecto|Alter Self|2|t|A|Personal|V,S|1 h|C|HM|Adaptación acuática, cambiar apariencia o armas naturales (1d6).
Mensajero animal|Animal Messenger|2|e|A|9 m|V,S,M|24 h|R|BDE|Una bestia Diminuta lleva un mensaje a un lugar que describas.
Cerradura arcana|Arcane Lock|2|a|A|Toque|V,S,M|Hasta disipar||M|Cierra mágicamente una puerta o recipiente; +10 a la CD para forzarlo.
Aura mágica del arcanista|Arcanist's Magic Aura|2|i|A|Toque|V,S,M|24 h||M|Falsea el aura mágica de un objeto o cómo responde una criatura a la detección.
Augurio|Augury|2|d|1 min|Personal|V,S,M|Inst.|R|C|Recibes un presagio sobre un acto en los próximos 30 minutos: bien, mal, ambos o nada.
Piel de corteza|Barkskin|2|t|A|Toque|V,S,M|1 h|C|DE|La CA del objetivo no puede ser menor que 16.
Ceguera/sordera|Blindness/Deafness|2|n|A|9 m|V|1 min||BCHM|Salvación de Con o queda cegado o ensordecido.
Desenfoque|Blur|2|i|A|Personal|V|1 min|C|HM|Los ataques contra ti tienen desventaja salvo que tengan vista ciega o visión verdadera.
Castigo marcador|Branding Smite|2|v|AA|Personal|V|1 min|C|P|Tu siguiente impacto con arma hace 2d6 radiante y el objetivo no puede ser invisible.
Calmar emociones|Calm Emotions|2|e|A|18 m|V,S|1 min|C|BC|Humanoides en 6 m: salvación de Car o suprime hechizado/asustado o la hostilidad.
Llama permanente|Continual Flame|2|v|A|Toque|V,S,M|Hasta disipar||CM|Una llama sin calor que no consume oxígeno, como una antorcha.
Oscuridad|Darkness|2|v|A|18 m|V,M|10 min|C|HWM|Esfera de 4,5 m de oscuridad mágica que la visión en la oscuridad no atraviesa.
Visión en la oscuridad|Darkvision|2|t|A|Toque|V,S,M|8 h||DEHM|El objetivo gana visión en la oscuridad 18 m.
Detectar pensamientos|Detect Thoughts|2|d|A|Personal|V,S,M|1 min|C|BHM|Lees los pensamientos superficiales; puedes sondear más profundo con salvación de Sab.
Potenciar característica|Enhance Ability|2|t|A|Toque|V,S,M|1 h|C|BCDH|Ventaja en las pruebas de una característica y un efecto extra según cuál.
Agrandar/reducir|Enlarge/Reduce|2|t|A|9 m|V,S,M|1 min|C|HM|Duplica o reduce el tamaño: +1d4 o −1d4 al daño con armas y ventaja o desventaja en Fuerza.
Embelesar|Enthrall|2|e|A|18 m|V,S|1 min||BW|Salvación de Sab o desventaja en Percepción para notar a otros que no seas tú.
Encontrar corcel|Find Steed|2|c|10 min|9 m|V,S|Inst.||P|Invocas un corcel leal e inteligente con el que te comunicas telepáticamente.
Encontrar trampas|Find Traps|2|d|A|36 m|V,S|Inst.||CDE|Percibes la presencia de trampas a la vista, aunque no su ubicación exacta.
Hoja de fuego|Flame Blade|2|v|AA|Personal|V,S,M|10 min|C|D|Una cimitarra de fuego: ataque cuerpo a cuerpo de conjuro, 3d6 de fuego.
Esfera llameante|Flaming Sphere|2|c|A|18 m|V,S,M|1 min|C|DM|Esfera de fuego de 1,5 m que mueves; salvación de Des o 2d6 de fuego.
Descanso apacible|Gentle Repose|2|n|A|Toque|V,S,M|10 días|R|CM|Un cadáver no se descompone ni puede ser animado; el plazo para revivirlo se extiende.
Ráfaga de viento|Gust of Wind|2|v|A|Línea 18 m|V,S,M|1 min|C|DHM|Salvación de Fue o empujado 4,5 m; dispersa gases y apaga llamas.
Calentar metal|Heat Metal|2|t|A|18 m|V,S,M|1 min|C|BD|Un objeto de metal arde: 2d8 de fuego a quien lo toque; puedes repetir como acción adicional.
Inmovilizar persona|Hold Person|2|e|A|18 m|V,S,M|1 min|C|BCDHWM|Un humanoide hace salvación de Sab o queda paralizado; repite cada turno.
Invisibilidad|Invisibility|2|i|A|Toque|V,S,M|1 h|C|BHWM|El objetivo es invisible hasta que ataque o lance un conjuro.
Apertura|Knock|2|t|A|18 m|V|Inst.||BHM|Abre una cerradura o barra; suena fuerte a 90 m.
Restablecimiento menor|Lesser Restoration|2|a|A|Toque|V,S|Inst.||BCDPE|Termina una enfermedad o cegado, ensordecido, paralizado o envenenado.
Levitar|Levitate|2|t|A|18 m|V,S,M|10 min|C|HM|Una criatura u objeto se eleva hasta 6 m; salvación de Con si no quiere.
Localizar animales o plantas|Locate Animals or Plants|2|d|A|Personal|V,S,M|Inst.|R|BDE|Sabes la dirección y distancia del ejemplar más cercano en 8 km.
Localizar objeto|Locate Object|2|d|A|Personal|V,S,M|10 min|C|BCDPEM|Percibes la dirección de un objeto conocido a 300 m.
Boca mágica|Magic Mouth|2|i|1 min|9 m|V,S,M|Hasta disipar|R|BM|Un objeto recita un mensaje cuando se cumple una condición.
Arma mágica|Magic Weapon|2|t|AA|Toque|V,S|1 h|C|PM|Un arma se vuelve mágica con +1 al ataque y daño (+2 o +3 a niveles superiores).
Imagen múltiple|Mirror Image|2|i|A|Personal|V,S|1 min||HWM|Tres duplicados ilusorios que pueden recibir los ataques en tu lugar.
Paso brumoso|Misty Step|2|c|AA|Personal|V|Inst.||HWM|Te teletransportas 9 m a un espacio que veas.
Rayo de luna|Moonbeam|2|v|A|36 m|V,S,M|1 min|C|D|Cilindro de luz de 1,5 m: salvación de Con, 2d10 radiante, mitad si tiene éxito; los cambiaformas vuelven a su forma.
Pasar sin rastro|Pass without Trace|2|a|A|Personal|V,S,M|1 h|C|DE|Tú y aliados a 9 m sumáis +10 a Sigilo y no dejáis huellas.
Plegaria de curación|Prayer of Healing|2|v|10 min|9 m|V|Inst.||C|Hasta seis criaturas recuperan 2d8 + mod.
Protección contra el veneno|Protection from Poison|2|a|A|Toque|V,S|1 h||CDPE|Neutraliza un veneno; ventaja contra envenenado y resistencia al veneno.
Rayo debilitante|Ray of Enfeeblement|2|n|A|18 m|V,S|1 min|C|WM|Ataque de conjuro: el objetivo hace la mitad de daño con armas de Fuerza.
Truco de la cuerda|Rope Trick|2|t|A|Toque|V,S,M|1 h||M|Una cuerda lleva a un espacio extradimensional para ocho criaturas.
Rayo abrasador|Scorching Ray|2|v|A|36 m|V,S|Inst.||HM|Tres rayos con ataque de conjuro, 2d6 de fuego cada uno. +1 rayo por nivel.
Ver lo invisible|See Invisibility|2|d|A|Personal|V,S,M|1 h||BHM|Ves criaturas y objetos invisibles y el Plano Etéreo.
Romper|Shatter|2|v|A|18 m|V,S,M|Inst.||BHWM|Esfera de 3 m: salvación de Con, 3d8 de trueno, mitad si tiene éxito.
Silencio|Silence|2|i|A|36 m|V,S|10 min|C,R|BCE|Esfera de 6 m sin sonido; impide conjuros con componente verbal.
Trepar cual arácnido|Spider Climb|2|t|A|Toque|V,S,M|1 h|C|HWM|Trepar por paredes y techos con las manos libres.
Crecimiento espinoso|Spike Growth|2|t|A|45 m|V,S,M|10 min|C|DE|Radio de 6 m de terreno difícil; 2d4 perforante por cada 1,5 m recorrido.
Arma espiritual|Spiritual Weapon|2|v|AA|18 m|V,S|1 min||C|Un arma espectral ataca como acción adicional: 1d8 + mod. de fuerza.
Sugestión|Suggestion|2|e|A|9 m|V,M|8 h|C|BHWM|Sugieres un curso de acción razonable; salvación de Sab o lo sigue.
Vínculo protector|Warding Bond|2|a|A|Toque|V,S,M|1 h||C|El objetivo gana +1 a la CA y salvaciones y resistencia al daño; tú recibes el mismo daño.
Telaraña|Web|2|c|A|18 m|V,S,M|1 h|C|HM|Cubo de 6 m de telarañas: terreno difícil y salvación de Des o apresado.
Zona de verdad|Zone of Truth|2|e|A|18 m|V,S|10 min||BCP|Esfera de 4,5 m: salvación de Car o no puede mentir deliberadamente.
Animar a los muertos|Animate Dead|3|n|1 min|3 m|V,S,M|Inst.||CM|Creas un esqueleto o zombi bajo tu control 24 horas. Más criaturas a niveles superiores.
Faro de esperanza|Beacon of Hope|3|a|A|9 m|V,S|1 min|C|C|Ventaja en salvaciones de Sab y de muerte; reciben la curación máxima.
Imponer maldición|Bestow Curse|3|n|A|Toque|V,S|1 min|C|BCM|Salvación de Sab o una maldición: desventaja, daño extra, perder turnos, etc.
Intermitencia|Blink|3|t|A|Personal|V,S|1 min||HM|Al final de cada turno tira d20: con 11+ vas al Plano Etéreo hasta tu siguiente turno.
Llamar al relámpago|Call Lightning|3|c|A|36 m|V,S|10 min|C|D|Cada turno un rayo cae en un punto: salvación de Des, 3d10 de relámpago.
Clarividencia|Clairvoyance|3|d|10 min|1,5 km|V,S,M|10 min|C|BCHM|Un sensor invisible te permite ver u oír un lugar conocido.
Conjurar animales|Conjure Animals|3|c|A|18 m|V,S|1 h|C|DE|Invocas espíritus feéricos con forma de bestias (por ejemplo, ocho de VD 1/4).
Contraconjuro|Counterspell|3|a|R|18 m|S|Inst.||HWM|Interrumpe un conjuro de nivel 3 o menor; de nivel mayor con prueba de característica.
Crear comida y agua|Create Food and Water|3|c|A|9 m|V,S|Inst.||CP|Comida y agua para 15 humanoides o 5 monturas durante un día.
Luz del día|Daylight|3|v|A|18 m|V,S|1 h||CDPE|Esfera de 18 m de luz brillante que disipa oscuridad mágica de nivel 3 o menor.
Disipar magia|Dispel Magic|3|a|A|36 m|V,S|Inst.||BCDPHWM|Termina conjuros de nivel 3 o menor; los mayores requieren prueba de característica.
Miedo|Fear|3|i|A|Cono 9 m|V,S,M|1 min|C|BHWM|Salvación de Sab o sueltan lo que tienen y huyen asustados.
Bola de fuego|Fireball|3|v|A|45 m|V,S,M|Inst.||HM|Esfera de 6 m: salvación de Des, 8d6 de fuego, mitad si tiene éxito. +1d6 por nivel.
Volar|Fly|3|t|A|Toque|V,S,M|10 min|C|HWM|Velocidad de vuelo de 18 m.
Forma gaseosa|Gaseous Form|3|t|A|Toque|V,S,M|1 h|C|HWM|El objetivo se vuelve niebla: vuela 3 m, resistencia al daño no mágico.
Glifo custodio|Glyph of Warding|3|a|1 h|Toque|V,S,M|Hasta activarse||BCM|Un glifo oculto que explota (5d8) o lanza un conjuro guardado al activarse.
Acelerar|Haste|3|t|A|9 m|V,S,M|1 min|C|HM|Doble velocidad, +2 a la CA, ventaja en Des y una acción extra limitada. Al terminar, pierde un turno.
Patrón hipnótico|Hypnotic Pattern|3|i|A|36 m|S,M|1 min|C|BHWM|Cubo de 9 m: salvación de Sab o hechizados e incapacitados.
Relámpago|Lightning Bolt|3|v|A|Línea 30 m|V,S,M|Inst.||HM|Salvación de Des: 8d6 de relámpago, mitad si tiene éxito.
Círculo mágico|Magic Circle|3|a|1 min|3 m|V,S,M|1 h||CPWM|Un cilindro que impide entrar o salir a ciertos tipos de criaturas.
Imagen mayor|Major Image|3|i|A|36 m|V,S,M|10 min|C|BHWM|Ilusión de un cubo de 6 m con sonido, olor y temperatura.
Palabra de curación en masa|Mass Healing Word|3|v|AA|18 m|V|Inst.||C|Hasta seis criaturas recuperan 1d4 + mod.
Fundirse con la piedra|Meld into Stone|3|t|A|Toque|V,S|8 h|R|CD|Entras en un bloque de piedra con lo que llevas.
Indetectable|Nondetection|3|a|A|Toque|V,S,M|8 h||BEM|El objetivo no puede ser localizado por adivinación mágica.
Corcel fantasma|Phantom Steed|3|i|1 min|9 m|V,S|1 h|R|M|Un caballo cuasi real con velocidad de 30 m.
Crecimiento vegetal|Plant Growth|3|t|A|45 m|V,S|Inst.||BDE|Maleza densa en 30 m de radio, o cultivos más fértiles durante un año.
Protección contra la energía|Protection from Energy|3|a|A|Toque|V,S|1 h|C|CDEHM|Resistencia a ácido, frío, fuego, relámpago o trueno.
Levantar maldición|Remove Curse|3|a|A|Toque|V,S|Inst.||CPWM|Termina todas las maldiciones que afectan a una criatura u objeto.
Revivir|Revivify|3|n|A|Toque|V,S,M|Inst.||CP|Devuelve la vida con 1 PG a quien murió en el último minuto (diamantes de 300 po).
Recado|Sending|3|v|A|Ilimitado|V,S,M|1 asalto||BCM|Envías un mensaje de 25 palabras a una criatura conocida, que puede responder.
Tormenta de aguanieve|Sleet Storm|3|c|A|45 m|V,S,M|1 min|C|DHM|Cilindro de 12 m: terreno difícil, oscurecido y salvación de Des o derribado.
Ralentizar|Slow|3|t|A|36 m|V,S,M|1 min|C|HM|Hasta seis criaturas: salvación de Sab o media velocidad, −2 a CA y Des y acciones limitadas.
Hablar con los muertos|Speak with Dead|3|n|A|3 m|V,S,M|10 min||BC|Un cadáver responde cinco preguntas.
Hablar con las plantas|Speak with Plants|3|t|A|Personal|V,S|10 min||BDE|Las plantas te responden y puedes hacer que despejen o enmarañen el paso.
Espíritus guardianes|Spirit Guardians|3|c|A|Personal|V,S,M|10 min|C|C|Aura de 4,5 m: mitad de velocidad a enemigos y salvación de Sab, 3d8 radiante o necrótico.
Nube apestosa|Stinking Cloud|3|c|A|27 m|V,S,M|1 min|C|BHM|Esfera de 6 m: salvación de Con o pierde su acción por náuseas.
Pequeña choza|Tiny Hut|3|e|1 min|Personal|V,S,M|8 h|R|BM|Cúpula de 3 m impenetrable para criaturas y conjuros de fuera.
Don de lenguas|Tongues|3|d|A|Toque|V,M|1 h||BCHWM|El objetivo entiende y es entendido en cualquier idioma.
Toque vampírico|Vampiric Touch|3|n|A|Personal|V,S|1 min|C|WM|Ataque cuerpo a cuerpo de conjuro: 3d6 necrótico y recuperas la mitad.
Respirar bajo el agua|Water Breathing|3|t|A|9 m|V,S,M|24 h|R|DEHM|Hasta diez criaturas respiran bajo el agua.
Caminar sobre el agua|Water Walk|3|t|A|9 m|V,S,M|1 h|R|CDEH|Hasta diez criaturas caminan sobre superficies líquidas.
Muro de viento|Wind Wall|3|v|A|36 m|V,S,M|1 min|C|DE|Muro de viento de 15 m: 3d8 contundente y desvía proyectiles y gases.
Ojo arcano|Arcane Eye|4|d|A|9 m|V,S,M|1 h|C|CM|Un ojo invisible que vuela y te transmite lo que ve.
Destierro|Banishment|4|a|A|18 m|V,S,M|1 min|C|CPHWM|Salvación de Car o es desterrado; si es de otro plano, no vuelve.
Tentáculos negros|Black Tentacles|4|c|A|27 m|V,S,M|1 min|C|M|Cuadrado de 6 m: salvación de Des o 3d6 contundente y apresado.
Plaga|Blight|4|n|A|9 m|V,S|Inst.||DHWM|Salvación de Con: 8d8 necrótico (máximo a plantas), mitad si tiene éxito.
Compulsión|Compulsion|4|e|A|9 m|V,S|1 min|C|B|Salvación de Sab o se mueve en la dirección que indiques.
Confusión|Confusion|4|e|A|27 m|V,S,M|1 min|C|BDHM|Esfera de 3 m: salvación de Sab o actúa al azar cada turno.
Conjurar elementales menores|Conjure Minor Elementals|4|c|1 min|27 m|V,S|1 h|C|DM|Invocas elementales (por ejemplo, ocho de VD 1/4).
Conjurar seres de los bosques|Conjure Woodland Beings|4|c|A|18 m|V,S,M|1 h|C|DE|Invocas criaturas feéricas (por ejemplo, ocho de VD 1/4).
Controlar el agua|Control Water|4|t|A|90 m|V,S,M|10 min|C|CDM|Inundas, separas, rediriges el agua o creas un remolino.
Custodia contra la muerte|Death Ward|4|a|A|Toque|V,S|8 h||CP|La primera vez que caería a 0 PG queda en 1 PG.
Puerta dimensional|Dimension Door|4|c|A|150 m|V|Inst.||BHWM|Te teletransportas hasta 150 m, con una criatura dispuesta.
Adivinación|Divination|4|d|A|Personal|V,S,M|Inst.|R|C|Una pregunta sobre algo de los próximos 7 días recibe una respuesta veraz.
Dominar bestia|Dominate Beast|4|e|A|18 m|V,S|1 min|C|DH|Salvación de Sab o controlas a la bestia telepáticamente.
Fabricar|Fabricate|4|t|10 min|36 m|V,S|Inst.||M|Conviertes materias primas en productos terminados.
Perro fiel|Faithful Hound|4|c|A|9 m|V,S,M|8 h||M|Un perro invisible vigila y muerde (4d8 perforante) a intrusos.
Escudo de fuego|Fire Shield|4|v|A|Personal|V,S,M|10 min||M|Resistencia al frío o al fuego; quien te golpea cuerpo a cuerpo recibe 2d8.
Libertad de movimiento|Freedom of Movement|4|a|A|Toque|V,S,M|1 h||BCDE|Ignora terreno difícil y efectos que paralizan o apresan.
Insecto gigante|Giant Insect|4|t|A|9 m|V,S|10 min|C|D|Convierte insectos o arañas en versiones gigantes bajo tu control.
Invisibilidad mayor|Greater Invisibility|4|i|A|Toque|V,S|1 min|C|BHM|Invisible aunque ataque o lance conjuros.
Guardián de la fe|Guardian of Faith|4|c|A|9 m|V|8 h||C|Un guardián espectral: 20 radiante a enemigos que se acerquen (hasta 60 en total).
Terreno alucinatorio|Hallucinatory Terrain|4|i|10 min|90 m|V,S,M|24 h||BDWM|Un terreno parece otro en un cubo de 45 m.
Tormenta de hielo|Ice Storm|4|v|A|90 m|V,S,M|Inst.||DHM|Cilindro de 6 m: 2d8 contundente y 4d6 de frío; terreno difícil.
Localizar criatura|Locate Creature|4|d|A|Personal|V,S,M|1 h|C|BCDPEM|Percibes la dirección de una criatura conocida a 300 m.
Asesino fantasmal|Phantasmal Killer|4|i|A|36 m|V,S|1 min|C|M|Salvación de Sab o asustado y 4d10 psíquico cada turno.
Polimorfar|Polymorph|4|t|A|18 m|V,S,M|1 h|C|BDHM|Salvación de Sab o se transforma en una bestia de VD igual o menor a su nivel.
Santuario privado|Private Sanctum|4|a|10 min|36 m|V,S,M|24 h||M|Protege un área contra sonido, visión, adivinación y teletransporte.
Esfera elástica|Resilient Sphere|4|v|A|9 m|V,S,M|1 min|C|M|Una esfera de fuerza encierra a una criatura; salvación de Des.
Cofre secreto|Secret Chest|4|c|A|Toque|V,S,M|Inst.||M|Escondes un cofre en el Plano Etéreo y lo invocas cuando quieras.
Moldear la piedra|Stone Shape|4|t|A|Toque|V,S,M|Inst.||CDM|Das la forma que quieras a un trozo de piedra.
Piel pétrea|Stoneskin|4|a|A|Toque|V,S,M|1 h|C|DEHM|Resistencia al daño contundente, perforante y cortante no mágico.
Muro de fuego|Wall of Fire|4|v|A|36 m|V,S,M|1 min|C|DHM|Muro de fuego: salvación de Des, 5d8; quema a quien termine su turno cerca.
Animar objetos|Animate Objects|5|t|A|36 m|V,S|1 min|C|BHM|Hasta diez objetos cobran vida y luchan por ti.
Escudo antivida|Antilife Shell|5|a|A|Personal|V,S|1 h|C|D|Barrera de 3 m que impide el paso de criaturas vivas.
Despertar|Awaken|5|t|8 h|Toque|V,S,M|Inst.||BD|Una bestia o planta gana Int 10 y la capacidad de hablar.
Nube aniquiladora|Cloudkill|5|c|A|36 m|V,S|10 min|C|HM|Esfera de 6 m que avanza: salvación de Con, 5d8 de veneno.
Comunión|Commune|5|d|1 min|Personal|V,S,M|1 min|R|C|Tres preguntas de sí o no a tu deidad.
Comunión con la naturaleza|Commune with Nature|5|d|1 min|Personal|V,S|Inst.|R|DE|Conoces tres datos del terreno en 4,5 km.
Cono de frío|Cone of Cold|5|v|A|Cono 18 m|V,S,M|Inst.||HM|Salvación de Con: 8d8 de frío, mitad si tiene éxito.
Conjurar elemental|Conjure Elemental|5|c|1 min|27 m|V,S,M|1 h|C|DM|Invocas un elemental de VD 5 o menos.
Contactar con otro plano|Contact Other Plane|5|d|1 min|Personal|V|1 min|R|WM|Haces cinco preguntas a una entidad; prueba de Int o 6d6 psíquico y locura.
Contagio|Contagion|5|n|A|Toque|V,S|7 días||CD|Ataque cuerpo a cuerpo de conjuro: el objetivo contrae una enfermedad mágica.
Creación|Creation|5|i|1 min|9 m|V,S,M|Especial||HM|Creas un objeto de materia vegetal o mineral temporal.
Disipar el bien y el mal|Dispel Evil and Good|5|a|A|Personal|V,S,M|1 min|C|CP|Protección contra criaturas de otros planos; puedes romper encantamientos o desterrarlas.
Dominar persona|Dominate Person|5|e|A|18 m|V,S|1 min|C|BH|Salvación de Sab o controlas a un humanoide.
Sueño|Dream|5|i|1 min|Especial|V,S,M|8 h||BWM|Entras en los sueños de alguien para hablar o atormentarlo.
Golpe flamígero|Flame Strike|5|v|A|18 m|V,S,M|Inst.||C|Cilindro de 3 m: salvación de Des, 4d6 de fuego y 4d6 radiante.
Geas|Geas|5|e|1 min|18 m|V|30 días||BCDPM|Salvación de Sab o debe cumplir una orden; si la desobedece recibe 5d10 psíquico.
Restablecimiento mayor|Greater Restoration|5|a|A|Toque|V,S,M|Inst.||BCD|Elimina un nivel de agotamiento, hechizado, petrificado, maldición o reducción de características.
Santificar|Hallow|5|v|24 h|Toque|V,S,M|Hasta disipar||C|Consagra un área contra ciertos tipos de criaturas y añade un efecto.
Inmovilizar monstruo|Hold Monster|5|e|A|27 m|V,S,M|1 min|C|BHWM|Salvación de Sab o cualquier criatura queda paralizada.
Plaga de insectos|Insect Plague|5|c|A|90 m|V,S,M|10 min|C|CDH|Esfera de 6 m de langostas: salvación de Con, 4d10 perforante.
Saber legendario|Legend Lore|5|d|10 min|Personal|V,S,M|Inst.||BCM|Conoces leyendas sobre una persona, lugar u objeto importante.
Curar heridas en masa|Mass Cure Wounds|5|v|A|18 m|V,S|Inst.||BCD|Hasta seis criaturas recuperan 3d8 + mod.
Engañar|Mislead|5|i|A|Personal|S|1 h|C|BM|Te vuelves invisible y creas un doble ilusorio que controlas.
Modificar recuerdo|Modify Memory|5|e|A|9 m|V,S|1 min|C|BM|Salvación de Sab o reescribes 24 horas de sus recuerdos.
Atravesar paredes|Passwall|5|t|A|9 m|V,S,M|1 h||M|Abre un pasaje a través de madera, yeso o piedra.
Atadura planar|Planar Binding|5|a|1 h|18 m|V,S,M|24 h||BCDWM|Obligas a un celestial, elemental, feérico o infernal a servirte.
Alzar a los muertos|Raise Dead|5|n|1 h|Toque|V,S,M|Inst.||BCP|Revive a alguien muerto hace menos de 10 días (diamante de 500 po).
Escudriñar|Scrying|5|d|10 min|Personal|V,S,M|10 min|C|BCDWM|Ves y oyes a una criatura en cualquier plano; salvación de Sab.
Apariencia|Seeming|5|i|A|9 m|V,S|8 h||BHM|Cambias la apariencia de cualquier número de criaturas.
Telequinesis|Telekinesis|5|t|A|18 m|V,S|10 min|C|HM|Mueves criaturas u objetos de hasta 500 kg con la mente.
Vínculo telepático|Telepathic Bond|5|d|A|9 m|V,S,M|1 h|R|M|Hasta ocho criaturas se comunican telepáticamente.
Círculo de teletransportación|Teleportation Circle|5|c|1 min|3 m|V,M|1 asalto||BHM|Abres un portal a un círculo permanente conocido.
Caminar entre árboles|Tree Stride|5|c|A|Personal|V,S|1 min|C|DE|Entras en un árbol y sales por otro de la misma especie a 150 m.
Muro de fuerza|Wall of Force|5|v|A|36 m|V,S,M|10 min|C|M|Un muro invisible e indestructible de fuerza.
Muro de piedra|Wall of Stone|5|v|A|36 m|V,S,M|10 min|C|DHM|Muro de piedra de diez paneles; permanente si mantienes la concentración.
Barrera de cuchillas|Blade Barrier|6|v|A|27 m|V,S|10 min|C|C|Muro de cuchillas giratorias: 6d10 cortante al atravesarlo.
Relámpago en cadena|Chain Lightning|6|v|A|45 m|V,S,M|Inst.||HM|Un rayo salta a cuatro objetivos: salvación de Des, 10d8 de relámpago.
Círculo de muerte|Circle of Death|6|n|A|45 m|V,S,M|Inst.||HWM|Esfera de 18 m: salvación de Con, 8d6 necrótico.
Conjurar feérico|Conjure Fey|6|c|1 min|27 m|V,S|1 h|C|DW|Invocas un feérico o bestia de VD 6 o menos.
Contingencia|Contingency|6|v|10 min|Personal|V,S,M|10 días||M|Guardas un conjuro que se activa ante una condición.
Crear muerto viviente|Create Undead|6|n|1 min|3 m|V,S,M|Inst.||CWM|Creas necrófagos bajo tu control (más y más fuertes a niveles superiores).
Desintegrar|Disintegrate|6|t|A|18 m|V,S,M|Inst.||HM|Salvación de Des o 10d6+40 de fuerza; si llega a 0 PG queda reducido a polvo.
Mirada debilitadora|Eyebite|6|n|A|Personal|V,S|1 min|C|BHWM|Cada turno, una criatura hace salvación de Sab o se duerme, entra en pánico o enferma.
Encontrar el camino|Find the Path|6|d|1 min|Personal|V,S,M|1 día|C|BCD|Conoces la ruta más corta y directa a un lugar.
Carne a piedra|Flesh to Stone|6|t|A|18 m|V,S,M|1 min|C|WM|Salvación de Con: se va petrificando hasta quedar de piedra.
Prohibición|Forbiddance|6|a|10 min|Toque|V,S,M|1 día|R|C|Impide el teletransporte en un área y daña a ciertos tipos de criaturas.
Esfera congelante|Freezing Sphere|6|v|A|90 m|V,S,M|Inst.||M|Esfera de 18 m: salvación de Con, 10d6 de frío; congela el agua.
Globo de invulnerabilidad|Globe of Invulnerability|6|a|A|Personal|V,S,M|1 min|C|HM|Barrera de 3 m que bloquea conjuros de nivel 5 o menor.
Guardas y custodias|Guards and Wards|6|a|10 min|Toque|V,S,M|24 h||BM|Protege una fortaleza con niebla, cerraduras, telarañas y más.
Dañar|Harm|6|n|A|18 m|V,S|Inst.||C|Salvación de Con: 14d6 necrótico y reduce sus PG máximos.
Curar|Heal|6|v|A|18 m|V,S|Inst.||CD|Recupera 70 PG y termina ceguera, sordera y enfermedades.
Banquete de héroes|Heroes' Feast|6|c|10 min|9 m|V,S,M|Inst.||CD|Doce criaturas: curación, inmunidad a veneno y asustado, +2d10 PG máximos.
Convocatoria instantánea|Instant Summons|6|c|1 min|Toque|V,S,M|Hasta disipar|R|M|Marcas un objeto y lo convocas a tu mano cuando quieras.
Danza irresistible|Irresistible Dance|6|e|A|9 m|V|1 min|C|BM|El objetivo baila: desventaja en Des y ataques; los ataques contra él tienen ventaja.
Recipiente mágico|Magic Jar|6|n|1 min|Personal|V,S,M|Hasta disipar||M|Tu alma pasa a un recipiente y puedes poseer cuerpos cercanos.
Sugestión en masa|Mass Suggestion|6|e|A|18 m|V,M|24 h||BHWM|Sugestión a doce criaturas sin concentración.
Mover la tierra|Move Earth|6|t|A|36 m|V,S,M|2 h|C|DHM|Remodelas el terreno en una zona de 12 m.
Aliado planar|Planar Ally|6|c|10 min|18 m|V,S|Inst.||C|Tu deidad envía un celestial, elemental o infernal que pide un pago.
Ilusión programada|Programmed Illusion|6|i|A|36 m|V,S,M|Hasta disipar||BM|Ilusión que se activa ante una condición.
Rayo de sol|Sunbeam|6|v|A|Línea 18 m|V,S,M|1 min|C|DHM|Salvación de Con: 6d8 radiante y cegado; puedes repetir cada turno.
Transportar vía plantas|Transport via Plants|6|c|A|3 m|V,S|1 asalto||D|Une dos plantas grandes como portal.
Visión verdadera|True Seeing|6|d|A|Toque|V,S,M|1 h||BCHWM|Visión verdadera 36 m: ves lo invisible, las ilusiones y las formas reales.
Muro de hielo|Wall of Ice|6|v|A|36 m|V,S,M|10 min|C|M|Muro de hielo: 10d6 de frío al crearlo y 5d6 al atravesar la sección rota.
Muro de espinas|Wall of Thorns|6|c|A|36 m|V,S,M|10 min|C|D|Muro de espinas: 7d8 perforante; terreno difícil.
Caminar con el viento|Wind Walk|6|t|1 min|9 m|V,S,M|8 h||D|Hasta diez criaturas se vuelven nube y vuelan a 90 m.
Palabra de regreso|Word of Recall|6|c|A|1,5 m|V|Inst.||C|Tú y hasta cinco aliados volvéis a un santuario preparado.
Espada arcana|Arcane Sword|7|v|A|18 m|V,S,M|1 min|C|BM|Una espada de fuerza ataca: 3d10 de fuerza.
Conjurar celestial|Conjure Celestial|7|c|1 min|27 m|V,S|1 h|C|C|Invocas un celestial de VD 4 o menos (5 a nivel 9).
Bola de fuego de explosión retardada|Delayed Blast Fireball|7|v|A|45 m|V,S,M|1 min|C|HM|Bola de fuego de 12d6 que crece 1d6 por turno hasta estallar.
Palabra divina|Divine Word|7|v|AA|9 m|V|Inst.||C|Según sus PG: ensordece, ciega, aturde o mata; destierra a extraplanares.
Excursión etérea|Etherealness|7|t|A|Personal|V,S|8 h||BCHWM|Entras en el Plano Etéreo.
Dedo de la muerte|Finger of Death|7|n|A|18 m|V,S|Inst.||HWM|Salvación de Con: 7d8+30 necrótico; si muere se alza como zombi tuyo.
Tormenta de fuego|Fire Storm|7|v|A|45 m|V,S|Inst.||CDH|Diez cubos de 3 m: salvación de Des, 7d10 de fuego.
Jaula de fuerza|Forcecage|7|v|A|30 m|V,S,M|1 h||BWM|Una jaula o caja invisible de fuerza.
Mansión magnífica|Magnificent Mansion|7|c|1 min|90 m|V,S,M|24 h||BM|Una mansión extradimensional con sirvientes y banquete.
Espejismo arcano|Mirage Arcane|7|i|10 min|Vista|V,S|10 días||BDM|Transforma la apariencia, el sonido y el tacto de un terreno de 1,5 km.
Desplazamiento entre planos|Plane Shift|7|c|A|Toque|V,S,M|Inst.||CDHWM|Viajas con aliados a otro plano o destierras a una criatura (salvación de Car).
Rociada prismática|Prismatic Spray|7|v|A|Cono 18 m|V,S|Inst.||HM|Ocho rayos de colores con efectos distintos.
Proyectar imagen|Project Image|7|i|A|800 km|V,S,M|1 día|C|BM|Una copia ilusoria tuya a través de la que ves y hablas.
Regenerar|Regenerate|7|t|1 min|Toque|V,S,M|1 h||BCD|Cura 4d8+15 y 1 PG por turno; vuelven a crecer los miembros perdidos.
Resurrección|Resurrection|7|n|1 h|Toque|V,S,M|Inst.||BC|Revive a alguien muerto hace menos de un siglo.
Invertir la gravedad|Reverse Gravity|7|t|A|30 m|V,S,M|1 min|C|DHM|Cilindro de 15 m donde la gravedad se invierte.
Secuestrar|Sequester|7|t|A|Toque|V,S,M|Hasta disipar||M|Ocultas una criatura u objeto y lo dejas en estasis.
Simulacro|Simulacrum|7|i|12 h|Toque|V,S,M|Hasta disipar||M|Un duplicado de nieve de una bestia o humanoide con la mitad de PG.
Símbolo|Symbol|7|a|1 min|Toque|V,S,M|Hasta activarse||BCM|Un glifo con un efecto poderoso: muerte, discordia, miedo, dolor, sueño…
Teletransporte|Teleport|7|c|A|3 m|V|Inst.||BHM|Viajas a cualquier destino del mismo plano; el éxito depende de lo bien que lo conozcas.
Formas animales|Animal Shapes|8|t|A|9 m|V,S|24 h|C|D|Transformas a tus aliados en bestias de VD 4 o menos.
Campo antimagia|Antimagic Field|8|a|A|Personal|V,S,M|1 h|C|CM|Esfera de 3 m donde no funciona la magia.
Antipatía/simpatía|Antipathy/Sympathy|8|e|1 h|18 m|V,S,M|10 días||DM|Un objetivo atrae o repele a un tipo de criatura.
Clon|Clone|8|n|1 h|Toque|V,S,M|Inst.||M|Un clon inerte que recibe tu alma al morir.
Controlar el clima|Control Weather|8|t|10 min|Personal|V,S,M|8 h|C|CDM|Cambias el clima en 8 km.
Semiplano|Demiplane|8|c|A|18 m|S|1 h||WM|Una puerta a un semiplano vacío de 9 m.
Dominar monstruo|Dominate Monster|8|e|A|18 m|V,S|1 h|C|BHWM|Salvación de Sab o controlas a cualquier criatura.
Terremoto|Earthquake|8|v|A|150 m|V,S,M|1 min|C|CDH|Temblor de 30 m: derriba, abre grietas y daña estructuras.
Debilidad mental|Feeblemind|8|e|A|45 m|V,S,M|Inst.||BDWM|4d6 psíquico y salvación de Int o su Int y Car pasan a 1.
Labia|Glibness|8|t|A|Personal|V|1 h||BW|Tus pruebas de Car son al menos 15 y la magia no detecta tus mentiras.
Aura sagrada|Holy Aura|8|a|A|Personal|V,S,M|1 min|C|C|Aliados a 9 m: ventaja en salvaciones y ataques contra ellos con desventaja.
Nube incendiaria|Incendiary Cloud|8|c|A|45 m|V,S|1 min|C|HM|Esfera de 6 m de humo y ascuas: salvación de Des, 10d8 de fuego.
Laberinto|Maze|8|c|A|18 m|V,S|10 min|C|M|Destierras a una criatura a un laberinto; escapa con Int CD 20.
Mente en blanco|Mind Blank|8|a|A|Toque|V,S|24 h||BM|Inmune a daño psíquico, lectura de mente, adivinación y hechizado.
Palabra de poder: aturdir|Power Word Stun|8|e|A|18 m|V|Inst.||BHWM|Aturde a una criatura con 150 PG o menos.
Explosión solar|Sunburst|8|v|A|45 m|V,S,M|Inst.||DHM|Esfera de 18 m: salvación de Con, 12d6 radiante y cegado.
Proyección astral|Astral Projection|9|n|1 h|3 m|V,S,M|Especial||CWM|Proyectas tu cuerpo astral y el de ocho aliados al Plano Astral.
Presciencia|Foresight|9|d|1 min|Toque|V,S,M|8 h||BDWM|Ventaja en todo, nadie te sorprende y los ataques contra ti tienen desventaja.
Portal|Gate|9|c|A|18 m|V,S,M|1 min|C|CHM|Un portal a otro plano; puedes convocar a una criatura por su nombre.
Encarcelamiento|Imprisonment|9|a|1 min|9 m|V,S,M|Hasta disipar||WM|Salvación de Sab o queda encerrado: enterrado, encadenado, dormido…
Curación en masa|Mass Heal|9|v|A|18 m|V,S|Inst.||C|Repartes 700 PG entre criaturas y curas condiciones.
Enjambre de meteoritos|Meteor Swarm|9|v|A|1,5 km|V,S|Inst.||HM|Cuatro esferas de 12 m: 20d6 de fuego y 20d6 contundente.
Palabra de poder: matar|Power Word Kill|9|e|A|18 m|V|Inst.||BHWM|Mata a una criatura con 100 PG o menos.
Muro prismático|Prismatic Wall|9|a|A|18 m|V,S|10 min||M|Un muro de siete capas de colores con efectos distintos.
Cambiar de forma|Shapechange|9|t|A|Personal|V,S,M|1 h|C|DM|Adoptas la forma de cualquier criatura de VD igual o menor a tu nivel.
Tormenta de venganza|Storm of Vengeance|9|c|A|Vista|V,S|1 min|C|D|Una tormenta de 110 m con trueno, ácido, rayos, granizo y viento.
Detener el tiempo|Time Stop|9|t|A|Personal|V|Inst.||HM|Actúas 1d4+1 turnos seguidos mientras el tiempo se detiene.
Polimorfar verdadero|True Polymorph|9|t|A|9 m|V,S,M|1 h|C|BWM|Transformas una criatura u objeto en otro; permanente tras una hora.
Resurrección verdadera|True Resurrection|9|n|1 h|Toque|V,S,M|Inst.||CD|Revive a alguien muerto hace menos de 200 años, aunque no quede cuerpo.
Extraño|Weird|9|i|A|36 m|V,S|1 min|C|M|Esfera de 9 m: salvación de Sab o asustado y 4d10 psíquico por turno.
Deseo|Wish|9|c|A|Personal|V|Inst.||HM|Duplica cualquier conjuro de nivel 8 o menor, o altera la realidad con riesgos.`;
const SCHOOLS={a:'Abjuración',d:'Adivinación',c:'Conjuración',e:'Encantamiento',v:'Evocación',i:'Ilusión',n:'Nigromancia',t:'Transmutación'};
const SPELL_CLASSES={B:'Bardo',C:'Clérigo',D:'Druida',P:'Paladín',E:'Explorador',H:'Hechicero',W:'Brujo',M:'Mago'};
const SPELLS=SPELL_SRC.split('\n').map(l=>{ const [name,en,lv,sc,t,range,comp,dur,fl,cls,desc]=l.split('|');
 return {id:'sp-'+en.toLowerCase().replace(/[^a-z]+/g,'-'),name,en,level:+lv,school:SCHOOLS[sc],time:t==='A'?'1 acción':t==='AA'?'1 acción adicional':t==='R'?'1 reacción':t,range,comp,dur,conc:fl.includes('C'),ritual:fl.includes('R'),classes:[...cls].map(c=>SPELL_CLASSES[c]),desc,source:'SRD 5.1',full:true}; });
