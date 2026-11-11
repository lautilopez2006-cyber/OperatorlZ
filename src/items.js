/* ===== Objetos mágicos (SRD 5.1, resúmenes propios) ===== */
const ITEM_TYPES={A:'Arma',R:'Armadura',M:'Objeto maravilloso',N:'Anillo',P:'Poción',S:'Pergamino',V:'Varita',B:'Bastón',D:'Vara',E:'Equipo'};
const RARITIES={c:'Común',u:'Infrecuente',r:'Rara',v:'Muy rara',l:'Legendaria',x:'Artefacto','*':'Variable'};
const RAR_ORDER='cur vlx*';
const ITEMS=`Arma +1, +2 o +3|Weapon, +1, +2, or +3|A|*||Bonificador a las tiradas de ataque y de daño igual a su rango (infrecuente +1, rara +2, muy rara +3).
Armadura +1, +2 o +3|Armor, +1, +2, or +3|R|*||Suma su rango a la CA (rara +1, muy rara +2, legendaria +3).
Escudo +1, +2 o +3|Shield, +1, +2, or +3|R|*||Además del bonificador normal del escudo, suma su rango a la CA.
Munición +1, +2 o +3|Ammunition, +1, +2, or +3|A|*||Bonificador al ataque y al daño; la pieza pierde la magia al impactar.
Poción de curación|Potion of Healing|P|c||Recupera 2d4+2 PG. Las versiones mayor (4d4+4), superior (8d4+8) y suprema (10d4+20) son más raras.
Poción de escalar|Potion of Climbing|P|c||Durante 1 hora obtienes velocidad trepadora igual a tu velocidad y ventaja en pruebas de Atletismo para trepar.
Poción de respirar bajo el agua|Potion of Water Breathing|P|u||Puedes respirar bajo el agua durante 1 hora.
Poción de resistencia|Potion of Resistance|P|u||Resistencia a un tipo de daño concreto durante 1 hora.
Poción de fuerza de gigante|Potion of Giant Strength|P|*||Tu Fuerza pasa a ser la del gigante indicado (21 a 29) durante 1 hora.
Poción de crecimiento|Potion of Growth|P|u||Aumentas de tamaño como con agrandar durante 1d4 horas.
Poción de heroísmo|Potion of Heroism|P|r||10 PG temporales y los efectos de bendición durante 1 hora.
Poción de invisibilidad|Potion of Invisibility|P|v||Invisible durante 1 hora; termina si atacas o lanzas un hechizo.
Poción de leer mentes|Potion of Mind Reading|P|r||Efecto de detectar pensamientos durante 1 minuto (CD 13).
Poción de veneno|Potion of Poison|P|u||Parece curativa, pero inflige 3d6 de veneno y envenena a quien la bebe (CD 13 Constitución).
Poción de velocidad|Potion of Speed|P|v||Efectos de acelerar durante 1 minuto, sin requerir concentración.
Poción de vuelo|Potion of Flying|P|v||Velocidad de vuelo igual a tu velocidad durante 1 hora.
Poción de forma gaseosa|Potion of Gaseous Form|P|r||Efecto de forma gaseosa durante 1 hora; puedes terminarlo con una acción adicional.
Poción de clarividencia|Potion of Clairvoyance|P|r||Efecto del hechizo clarividencia.
Poción de amistad animal|Potion of Animal Friendship|P|u||Efecto de amistad animal (CD 13) durante 1 hora.
Poción de disminución|Potion of Diminution|P|r||Te encoges como con reducir durante 1d4 horas.
Poción de longevidad|Potion of Longevity|P|v||Tu edad física se reduce 1d6+6 años; cada dosis extra puede salir mal.
Poción de vitalidad|Potion of Vitality|P|v||Elimina el cansancio, cura enfermedades y venenos y maximiza los dados de curación durante 24 horas.
Poción de aliento ígneo|Potion of Fire Breath|P|u||Durante 1 hora puedes exhalar fuego (4d6, CD 13 Destreza) como acción adicional, hasta tres veces.
Filtro de amor|Philter of Love|P|u|| Quedas hechizado por la primera criatura que veas durante 1 hora.
Aceite de etereidad|Oil of Etherealness|P|r||Aplicado sobre el cuerpo, te vuelves etéreo durante 1 hora.
Aceite de afilado|Oil of Sharpness|P|v||Un arma cortante o perforante obtiene +3 durante 1 hora.
Aceite resbaladizo|Oil of Slipperiness|P|u||Efecto de libertad de movimiento durante 8 horas, o crea una zona de grasa.
Pergamino de conjuro|Spell Scroll|S|*||Contiene un hechizo que puede lanzar quien lo tenga en su lista; su rareza depende del nivel.
Pergamino de protección|Scroll of Protection|S|r||Durante 5 minutos, un tipo de criatura no puede entrar en un círculo de 1,5 m a tu alrededor.
Bolsa de contención|Bag of Holding|M|u||Espacio extradimensional de 250 kg. Si se mete en otro espacio similar, ambos se rompen y abren un portal astral.
Bolsa de trucos|Bag of Tricks|M|u||Saca bolitas que se convierten en animales aliados durante 1 hora, tres veces al día.
Bolsa devoradora|Bag of Devouring|M|v||Parece una bolsa de contención, pero es la boca de una criatura que traga lo que se mete.
Botas élficas|Boots of Elvenkind|M|u||Pasos silenciosos y ventaja en pruebas de Sigilo para moverte sin ruido.
Botas de velocidad|Boots of Speed|M|r|1|Con una acción adicional duplicas tu velocidad durante 10 minutos al día.
Botas aladas|Winged Boots|M|u|1|Velocidad de vuelo igual a tu velocidad durante hasta 4 horas al día.
Botas de zancadas y saltos|Boots of Striding and Springing|M|u|1|Velocidad mínima de 9 m sin penalización por carga y triple distancia de salto.
Botas de levitación|Boots of Levitation|M|r|1|Lanzas levitar sobre ti a voluntad.
Botas de las tierras invernales|Boots of the Winterlands|M|u|1|Resistencia al frío, ignoras el terreno helado y toleras temperaturas extremas.
Capa élfica|Cloak of Elvenkind|M|u|1|Con la capucha puesta, ventaja en Sigilo y desventaja para quien intente verte.
Capa de protección|Cloak of Protection|M|u|1|+1 a la CA y a las tiradas de salvación.
Capa de desplazamiento|Cloak of Displacement|M|r|1|Los ataques contra ti tienen desventaja hasta que recibes daño en un turno.
Capa del murciélago|Cloak of the Bat|M|r|1|Ventaja en Sigilo y, en la oscuridad, vuelo y forma de murciélago.
Capa de la mantarraya|Cloak of the Manta Ray|M|u||Respiras bajo el agua y nadas a 18 m con la capucha puesta.
Capa del arácnido|Cloak of Arachnida|M|v|1|Resistencia a veneno, trepar como araña, inmunidad a telarañas y una gran telaraña al día.
Capa de invisibilidad|Cloak of Invisibility|M|l|1|Con la capucha puesta eres invisible, con un total de 2 horas por día.
Capa del saltimbanqui|Cape of the Mountebank|M|r||Una vez al día lanzas puerta dimensional dejando una nube de humo.
Manto de resistencia a conjuros|Mantle of Spell Resistance|M|r|1|Ventaja en tiradas de salvación contra hechizos.
Túnica de los ojos|Robe of Eyes|M|r|1|Ves en todas direcciones, en la oscuridad y lo invisible; la luz intensa puede cegarte.
Túnica de las estrellas|Robe of Stars|M|v|1|+1 a salvaciones y puedes lanzar proyectil mágico de nivel 5 con sus estrellas; también viajar al Astral.
Túnica del archimago|Robe of the Archmagi|M|l|lanzador|CA 15 + Des, ventaja contra hechizos y +2 a la CD y ataque de tus hechizos.
Túnica de objetos útiles|Robe of Useful Items|M|u||Parches que se convierten en objetos reales al arrancarlos.
Guanteletes de poder de ogro|Gauntlets of Ogre Power|M|u|1|Tu Fuerza pasa a ser 19.
Cinturón de fuerza de gigante|Belt of Giant Strength|M|*|1|Tu Fuerza pasa a ser la del gigante (21 a 29).
Diadema de intelecto|Headband of Intellect|M|u|1|Tu Inteligencia pasa a ser 19.
Amuleto de salud|Amulet of Health|M|r|1|Tu Constitución pasa a ser 19.
Amuleto de prueba contra detección|Amulet of Proof against Detection and Location|M|u|1|No puedes ser objetivo de adivinación ni percibido por sensores mágicos.
Amuleto de los planos|Amulet of the Planes|M|v|1|Puedes intentar lanzar desplazamiento entre planos; fallar te envía a un plano al azar.
Brazales de defensa|Bracers of Defense|M|r|1|+2 a la CA si no llevas armadura ni escudo.
Brazales de arquería|Bracers of Archery|M|u|1|Competencia con arcos y +2 al daño con ellos.
Broche escudo|Brooch of Shielding|M|u|1|Resistencia al daño de fuerza e inmunidad a proyectil mágico.
Collar de bolas de fuego|Necklace of Fireballs|M|r||Cuentas que puedes arrojar como bolas de fuego; varias juntas aumentan el daño.
Collar de adaptación|Necklace of Adaptation|M|u|1|Respiras con normalidad en cualquier ambiente y tienes ventaja contra gases.
Collar de cuentas de oración|Necklace of Prayer Beads|M|r|clérigo, druida o paladín|Cuentas que lanzan hechizos como bendición, curar heridas o palabra de regreso.
Periapto de salud|Periapt of Health|M|u||Inmunidad a las enfermedades.
Periapto de prueba contra veneno|Periapt of Proof against Poison|M|r||Inmunidad al daño y al estado envenenado.
Periapto de cierre de heridas|Periapt of Wound Closure|M|u|1|Te estabilizas solo y duplicas los PG que recuperas con dados de golpe.
Piedra de la buena suerte|Stone of Good Luck (Luckstone)|M|u|1|+1 a las pruebas de característica y tiradas de salvación.
Piedra Ioun|Ioun Stone|M|*|1|Gema que orbita tu cabeza y concede un beneficio según su tipo.
Gema de la vista|Gem of Seeing|M|r|1|Tres veces al día obtienes visión verdadera durante 10 minutos.
Gema de brillo|Gem of Brightness|M|u||Emite luz, rayos cegadores o un destello de cono.
Gafas de la noche|Goggles of Night|M|u||Visión en la oscuridad de 18 m.
Ojos del águila|Eyes of the Eagle|M|u|1|Ventaja en Percepción basada en la vista y ves detalles a gran distancia.
Ojos de encantamiento|Eyes of Charming|M|u|1|Tres cargas para lanzar hechizar persona (CD 13).
Ojos de minucias|Eyes of Minute Seeing|M|u||Ves de cerca con gran detalle; ventaja en Investigación a 30 cm.
Sombrero de disfraz|Hat of Disguise|M|u|1|Lanzas disfrazarse a voluntad.
Yelmo de telepatía|Helm of Telepathy|M|u|1|Detectar pensamientos a voluntad y sugestión una vez al día.
Yelmo de comprender idiomas|Helm of Comprehending Languages|M|u||Lanzas comprender idiomas a voluntad.
Yelmo brillante|Helm of Brilliance|M|v|1|Engastado con gemas que lanzan bola de fuego, muro de fuego, luz del día y más.
Yelmo de teletransporte|Helm of Teleportation|M|r|1|Tres cargas para lanzar teletransporte.
Guantes de robo|Gloves of Thievery|M|u||+5 a juego de manos y a pruebas para abrir cerraduras; son invisibles al llevarlos.
Guantes de nadar y trepar|Gloves of Swimming and Climbing|M|u|1|Velocidad de nado y trepado, +5 a Atletismo para ello.
Guantes de atrapar proyectiles|Gloves of Missile Snaring|M|u|1|Reduces el daño de proyectiles y puedes atraparlos.
Lámpara de detección|Lantern of Revealing|M|u||Su luz hace visibles a las criaturas y objetos invisibles.
Cuerda de escalar|Rope of Climbing|M|u||Cuerda de 18 m que se mueve y anuda sola a tus órdenes.
Cuerda de enredar|Rope of Entanglement|M|r||Se lanza para apresar a una criatura.
Agujero portátil|Portable Hole|M|r||Tela que, extendida, se convierte en un agujero extradimensional de 3 m de profundidad.
Alfombra voladora|Carpet of Flying|M|v||Alfombra que vuela con su carga según su tamaño.
Escoba voladora|Broom of Flying|M|u||Vuela a 15 m con hasta 90 kg y acude cuando la llamas.
Barco plegable|Folding Boat|M|r||Caja que se transforma en bote o en barco a voluntad.
Cofre secreto de Leomund|Leomund's Secret Chest|M|r||Cofre que guardas en el Plano Etéreo y recuperas cuando quieras.
Cubo de fuerza|Cube of Force|M|r|1|Crea barreras de fuerza que bloquean distintos efectos, con cargas.
Cubo de portales|Cubic Gate|M|l||Cada cara está conectada a un plano; abre portales o te transporta.
Esfera de aniquilación|Sphere of Annihilation|M|l||Esfera de oscuridad que destruye toda la materia que toca.
Espejo atrapavidas|Mirror of Life Trapping|M|v||Atrapa a quienes ven su reflejo en celdas extradimensionales.
Bola de cristal|Crystal Ball|M|v|1|Lanzas escudriñar; las versiones raras añaden telepatía o visión verdadera.
Baraja de las ilusiones|Deck of Illusions|M|u||Cartas que crean ilusiones de criaturas al arrojarlas.
Baraja de muchas cosas|Deck of Many Things|M|l||Cartas que otorgan fortunas o catástrofes al robarlas.
Cuerno del Valhalla|Horn of Valhalla|M|*||Invoca guerreros espirituales que luchan por ti durante 1 hora.
Cuerno de destrucción|Horn of Blasting|M|r||Su sonido causa 5d6 de daño de trueno en un cono; puede estallar.
Tambor del pánico|Drum of Panic|M|v||Su toque asusta a las criaturas cercanas (CD 15 Sabiduría).
Instrumento de los bardos|Instrument of the Bards|M|*|bardo|Instrumentos mágicos que lanzan hechizos y dificultan resistirse a tus encantamientos.
Figurilla de poder maravilloso|Figurine of Wondrous Power|M|*||Estatuilla que se convierte en un animal aliado durante un tiempo.
Polvo de desaparición|Dust of Disappearance|M|u||Vuelve invisible a todo lo que toca durante 2d4 minutos.
Polvo de estornudos|Dust of Sneezing and Choking|M|u||Parece polvo de desaparición, pero ahoga a quien está cerca.
Polvo de sequedad|Dust of Dryness|M|u||Convierte agua en una bolita que la libera al romperse.
Piedra de elementales de tierra|Stone of Controlling Earth Elementals|M|r||Invoca y controla un elemental de tierra una vez al día.
Brasero de elementales de fuego|Brazier of Commanding Fire Elementals|M|r||Invoca un elemental de fuego una vez al día.
Incensario de elementales de aire|Censer of Controlling Air Elementals|M|r||Invoca un elemental de aire una vez al día.
Cuenco de elementales de agua|Bowl of Commanding Water Elementals|M|r||Invoca un elemental de agua una vez al día.
Botella siempre humeante|Eversmoking Bottle|M|u||Libera humo denso que oscurece el área.
Garrafa de agua inagotable|Decanter of Endless Water|M|u||Produce agua a demanda, desde un chorro hasta un géiser.
Jarra alquímica|Alchemy Jug|M|u||Produce cada día un líquido diferente a elección: ácido, vino, aceite, miel…
Fortaleza instantánea|Instant Fortress|M|r||Un cubo que se convierte en una torre de adamantina.
Manual de salud corporal|Manual of Bodily Health|M|v||Libro que, estudiado durante 48 horas, aumenta tu Constitución en 2 de forma permanente.
Tomo del pensamiento claro|Tome of Clear Thought|M|v||Estudiarlo aumenta tu Inteligencia en 2 de forma permanente.
Tomo del liderazgo y la influencia|Tome of Leadership and Influence|M|v||Estudiarlo aumenta tu Carisma en 2 de forma permanente.
Tomo de la comprensión|Tome of Understanding|M|v||Estudiarlo aumenta tu Sabiduría en 2 de forma permanente.
Manual de ganancia de fuerza|Manual of Gainful Exercise|M|v||Estudiarlo aumenta tu Fuerza en 2 de forma permanente.
Manual de rapidez de acción|Manual of Quickness of Action|M|v||Estudiarlo aumenta tu Destreza en 2 de forma permanente.
Manual de gólems|Manual of Golems|M|v||Instrucciones para construir un gólem del tipo indicado.
Anillo de protección|Ring of Protection|N|r|1|+1 a la CA y a las tiradas de salvación.
Anillo de resistencia|Ring of Resistance|N|r|1|Resistencia a un tipo de daño según su gema.
Anillo de libertad de acción|Ring of Free Action|N|r|1|El terreno difícil y la magia no reducen tu movimiento ni te paralizan.
Anillo de invisibilidad|Ring of Invisibility|N|l|1|Te vuelves invisible a voluntad.
Anillo de caída de pluma|Ring of Feather Falling|N|r|1|Caes despacio, como con caída de pluma.
Anillo de nadar|Ring of Swimming|N|u||Velocidad de nado de 12 m.
Anillo de saltar|Ring of Jumping|N|u|1|Lanzas saltar sobre ti a voluntad.
Anillo de caminar sobre el agua|Ring of Water Walking|N|u||Puedes caminar sobre líquidos como si fueran tierra firme.
Anillo de calidez|Ring of Warmth|N|u|1|Resistencia al frío y toleras temperaturas muy bajas.
Anillo de mente blindada|Ring of Mind Shielding|N|u|1|Tus pensamientos y mentiras no pueden detectarse mágicamente.
Anillo de evasión|Ring of Evasion|N|r|1|Tres cargas para convertir una salvación de Destreza fallada en un éxito.
Anillo de almacenamiento de conjuros|Ring of Spell Storing|N|r|1|Guarda hasta 5 niveles de hechizos para lanzarlos luego.
Anillo de reflejar conjuros|Ring of Spell Turning|N|l|1|Ventaja contra hechizos de un solo objetivo y puede devolverlos al lanzador.
Anillo de regeneración|Ring of Regeneration|N|v|1|Recuperas 1d6 PG cada 10 minutos y regeneras miembros perdidos.
Anillo de telequinesis|Ring of Telekinesis|N|v|1|Lanzas telequinesis a voluntad sobre objetos no sujetos.
Anillo de visión de rayos X|Ring of X-ray Vision|N|r|1|Ves a través de la materia sólida durante 1 minuto.
Anillo de influencia animal|Ring of Animal Influence|N|r||Tres cargas para amistad animal, asustar bestias o hablar con animales.
Anillo de comandar elementales|Ring of Elemental Command|N|l|1|Dominio sobre un tipo de elemental y hechizos asociados.
Anillo de los tres deseos|Ring of Three Wishes|N|l||Contiene tres cargas de deseo.
Anillo de estrella fugaz|Ring of Shooting Stars|N|v|1|Luz danzante, bolas de rayos y estrellas fugaces bajo cielo nocturno.
Anillo del carnero|Ring of the Ram|N|r|1|Lanza una fuerza con forma de carnero que empuja y daña.
Varita de proyectil mágico|Wand of Magic Missiles|V|u||7 cargas para lanzar proyectil mágico, más nivel por carga extra.
Varita de bolas de fuego|Wand of Fireballs|V|r|lanzador|7 cargas para lanzar bola de fuego (CD 15).
Varita de relámpagos|Wand of Lightning Bolts|V|r|lanzador|7 cargas para lanzar relámpago (CD 15).
Varita de detectar magia|Wand of Magic Detection|V|u||3 cargas para lanzar detectar magia.
Varita del mago de guerra|Wand of the War Mage, +1, +2, or +3|V|*|lanzador|Bonificador a tus ataques de hechizo e ignoras la cobertura media.
Varita de paralizar|Wand of Paralysis|V|r|lanzador|Rayo que paraliza al objetivo (CD 15 Constitución).
Varita de miedo|Wand of Fear|V|r|1|Infunde miedo con orden o en un cono.
Varita de telaraña|Wand of Web|V|u|lanzador|7 cargas para lanzar telaraña (CD 15).
Varita de enemigos|Wand of Enemy Detection|V|r|1|Detecta la dirección de las criaturas hostiles cercanas.
Varita de secretos|Wand of Secrets|V|u||Señala la puerta secreta o trampa más cercana.
Varita de polimorfismo|Wand of Polymorph|V|v|lanzador|7 cargas para lanzar polimorfar (CD 15).
Varita de maravillas|Wand of Wonder|V|r|lanzador|Cada uso produce un efecto mágico aleatorio.
Varita de atadura|Wand of Binding|V|r|lanzador|Cargas para lanzar inmovilizar monstruo o inmovilizar persona.
Bastón de curación|Staff of Healing|B|r|bardo, clérigo o druida|Cargas para curar heridas, restablecimiento menor y curar heridas en masa.
Bastón de fuego|Staff of Fire|B|v|druida, hechicero, brujo o mago|Resistencia al fuego y cargas para manos ardientes, bola de fuego y muro de fuego.
Bastón de escarcha|Staff of Frost|B|v|druida, hechicero, brujo o mago|Resistencia al frío y cargas para cono de frío, muro de hielo y más.
Bastón de poder|Staff of Power|B|v|hechicero, brujo o mago|Arma +2, +2 a CA y salvaciones, y múltiples hechizos; puede romperse en una explosión final.
Bastón del magi|Staff of the Magi|B|l|hechicero, brujo o mago|Absorbe hechizos, lanza muchos otros y otorga ventaja contra la magia.
Bastón del bosque|Staff of the Woodlands|B|r|druida|Arma +2 que lanza hechizos de naturaleza y puede convertirse en árbol.
Bastón de la pitón|Staff of the Python|B|u|clérigo, druida o brujo|Se convierte en una serpiente constrictora a tus órdenes.
Bastón de encantamiento|Staff of Charming|B|r|bardo, clérigo, druida, hechicero, brujo o mago|Cargas para hechizar persona, orden y comprender idiomas.
Bastón de golpeo|Staff of Striking|B|v|1|Arma +3 que gasta cargas para infligir daño de fuerza extra.
Bastón de tormentas|Staff of Thunder and Lightning|B|v|1|Arma +2 con relámpago, trueno y una tormenta combinada.
Bastón marchitador|Staff of Withering|B|r|clérigo, druida o brujo|Sus golpes infligen necrótico y debilitan al objetivo.
Bastón del enjambre|Staff of Swarming Insects|B|r|bardo, clérigo, druida, hechicero, brujo o mago|Crea nubes de insectos y lanza plaga de insectos.
Vara de absorción|Rod of Absorption|D|v|1|Absorbe hechizos que te apuntan y almacena su energía.
Vara de alerta|Rod of Alertness|D|v|1|Ventaja en Percepción e iniciativa, y crea guardianes de protección.
Vara del señor poderoso|Rod of Lordly Might|D|l|1|Maza +3 con botones que la transforman en otras armas y herramientas.
Vara de resurrección|Rod of Resurrection|D|l|clérigo, druida o paladín|Cargas para lanzar curar o resurrección.
Vara de dominio|Rod of Rulership|D|r|1|Hechiza a las criaturas cercanas para que te obedezcan durante 8 horas.
Vara de seguridad|Rod of Security|D|v||Te lleva con tus aliados a un paraíso extradimensional durante días.
Vara inamovible|Immovable Rod|D|u||Al pulsar su botón queda fija en el aire y sostiene hasta 4 toneladas.
Armadura de adamantina|Adamantine Armor|R|u||Los críticos contra ti se vuelven impactos normales.
Armadura de mithral|Mithral Armor|R|u||Sin desventaja en Sigilo ni requisito de Fuerza.
Armadura de resistencia|Armor of Resistance|R|r|1|Resistencia a un tipo de daño.
Armadura de invulnerabilidad|Armor of Invulnerability|R|l|1|Resistencia al daño no mágico y, una vez al día, inmunidad durante 10 minutos.
Armadura de vulnerabilidad|Armor of Vulnerability|R|r|1|Maldita: da resistencia a un tipo físico y vulnerabilidad a los otros dos.
Armadura de escamas de dragón|Dragon Scale Mail|R|v|1|+1 a la CA, ventaja contra el aliento de dragones y resistencia a su elemento.
Armadura demoníaca|Demon Armor|R|v|1|+1 a la CA, garras como armas +1 y entiendes el abisal; maldita.
Armadura enana de placas|Dwarven Plate|R|v||+2 a la CA y reduces la distancia que te empujan.
Armadura élfica de cota|Elven Chain|R|r||+1 a la CA; cualquiera puede llevarla como armadura ligera.
Armadura de placas etérea|Plate Armor of Etherealness|R|l|1|Una vez al día lanzas forma etérea sobre ti.
Cuero tachonado brillante|Glamoured Studded Leather|R|r||+1 a la CA y su aspecto cambia a cualquier ropa.
Armadura del marinero|Mariner's Armor|R|u||Velocidad de nado y emerges a la superficie si quedas a 0 PG bajo el agua.
Escudo de atracción de proyectiles|Shield of Missile Attraction|R|r|1|Maldito: resistencia a proyectiles, pero los atrae hacia ti.
Escudo centinela|Sentinel Shield|R|u||Ventaja en iniciativa y en Percepción.
Escudo animado|Animated Shield|R|v|1|Flota a tu lado y te protege sin ocupar tus manos durante 1 minuto.
Escudo de guardia de hechizos|Spellguard Shield|R|v|1|Ventaja contra hechizos y los ataques de hechizo tienen desventaja contra ti.
Espada vorpal|Vorpal Sword|A|l|1|Arma +3 que ignora la resistencia cortante y, con un 20, decapita.
Espada danzante|Dancing Sword|A|v|1|Puedes soltarla para que ataque sola durante varios turnos.
Espada de la suerte|Luck Blade|A|l|1|+1 al ataque, al daño y a las salvaciones, repites una tirada al día y puede tener deseos.
Espada de ladrona de vidas|Sword of Life Stealing|A|r|1|Con un 20 natural inflige 10 necrótico extra y te da esos PG temporales.
Espada de heridas|Sword of Wounding|A|r|1|Las heridas no se curan con descanso y causan daño persistente.
Espada afilada|Sword of Sharpness|A|v|1|Con un 20 natural inflige daño extra y puede cortar un miembro.
Espada sagrada vengadora|Holy Avenger|A|l|paladín|Arma +3 que inflige radiante extra a infernales y no muertos y protege a los aliados contra la magia.
Lengua de fuego|Flame Tongue|A|r|1|Con una palabra arde e inflige 2d6 de fuego extra.
Marca de escarcha|Frost Brand|A|v|1|Inflige 1d6 de frío extra, resistencia al fuego y apaga llamas cercanas.
Espada solar|Sun Blade|A|r|1|Hoja de luz +2 que daña más a los no muertos y emite luz solar.
Matadragones|Dragon Slayer|A|r||Arma +1 que inflige 3d6 extra a los dragones.
Matagigantes|Giant Slayer|A|r||Arma +1 que inflige 2d6 extra a los gigantes y puede derribarlos.
Robanueve vidas|Nine Lives Stealer|A|v|1|Con un 20 natural puede matar al objetivo si tiene menos de 100 PG; nueve cargas.
Defensora|Defender|A|l|1|Arma +3 que te deja pasar su bonificador a la CA.
Arma de alerta|Weapon of Warning|A|u|1|Tú y tus aliados no podéis ser sorprendidos y tenéis ventaja en iniciativa.
Hacha berserker|Berserker Axe|A|r|1|+1 al ataque y daño, PG extra; maldita: te enfurece en combate.
Martillo de los truenos|Hammer of Thunderbolts|A|l|1|Martillo +1 que puede aturdir gigantes y lanzarse con un estallido de trueno.
Martillo enano arrojadizo|Dwarven Thrower|A|v|enano|Martillo +3 que vuelve a tu mano y daña más a los gigantes.
Tridente de dominio de peces|Trident of Fish Command|A|u|1|Cargas para lanzar dominar bestia sobre criaturas marinas.
Maza de destrucción|Mace of Disruption|A|r|1|Daña más a infernales y no muertos y puede destruirlos.
Maza del castigo|Mace of Smiting|A|r||Arma +1 que hace más daño a los constructos.
Maza del terror|Mace of Terror|A|r|1|Cargas para aterrar a las criaturas cercanas.
Jabalina del relámpago|Javelin of Lightning|A|u||Al lanzarla se convierte en un rayo de 4d6.
Flecha asesina|Arrow of Slaying|A|v||Inflige 6d10 extra al tipo de criatura indicado.
Arco del juramento|Oathbow|A|v|1|Arco que jura venganza contra un enemigo y lo castiga con daño extra.
Daga del veneno|Dagger of Venom|A|r||Arma +1 que puede cubrirse de veneno una vez al día.
Cimitarra de velocidad|Scimitar of Speed|A|v|1|Cimitarra +2 que permite un ataque extra como acción adicional.
Arma despiadada|Vicious Weapon|A|r||Con un 20 natural inflige 2d6 extra.
Espada de respuesta|Sword of Answering|A|l|1|Ataca de vuelta a quien te golpea, con su propio bonificador.
Bolsa de judías|Bag of Beans|M|r||Judías mágicas que producen efectos aleatorios al plantarse.
Mochila práctica de Heward|Heward's Handy Haversack|M|r||Mochila con compartimentos extradimensionales; lo que buscas siempre está arriba.
Ungüento de Keoghtom|Keoghtom's Ointment|M|u||Cura 2d8+2 PG y elimina venenos y enfermedades.
Talismán del bien puro|Talisman of Pure Good|M|l|bueno|Abre grietas que tragan criaturas malignas.
Talismán del mal absoluto|Talisman of Ultimate Evil|M|l|malvado|Abre grietas que tragan criaturas bondadosas.
Talismán de la esfera|Talisman of the Sphere|M|l|1|Mejora tu control de una esfera de aniquilación.
Perla de poder|Pearl of Power|M|u|lanzador|Recupera un espacio de hechizo de hasta nivel 3 al día.
Zapatillas de trepar como araña|Slippers of Spider Climbing|M|u|1|Caminas por paredes y techos.
Medallón de pensamientos|Medallion of Thoughts|M|u|1|Cargas para lanzar detectar pensamientos.
Piedra Ioun de perspicacia|Ioun Stone of Insight|M|v|1|Aumenta la Sabiduría en 2.
Alas de vuelo|Wings of Flying|M|r|1|Capa que se convierte en alas durante 1 hora al día.
Vela de invocación|Candle of Invocation|M|v|1|Vela que alinea a tu dios con tu causa y puede lanzar portal.
Grilletes dimensionales|Dimensional Shackles|M|r||Impiden el viaje planar de quien los lleva.
Grilletes|Manacles|E|c||Equipo: grilletes de hierro para criaturas Pequeñas o Medianas (CD 20 para escapar).
Kit de sanador|Healer's Kit|E|c||Diez usos para estabilizar a una criatura a 0 PG sin prueba de Medicina.
Kit de herbolario|Herbalism Kit|E|c||Herramienta para identificar plantas y crear antídotos y pociones de curación.
Fuego de alquimista|Alchemist's Fire|E|c||Frasco que prende fuego al objetivo: 1d4 de fuego por turno hasta que se apague.
Agua bendita|Holy Water|E|c||Frasco que inflige 2d6 radiante a infernales y no muertos.
Ácido|Acid (vial)|E|c||Vial que inflige 2d6 de ácido al romperse sobre una criatura.
Antitoxina|Antitoxin|E|c||Ventaja contra veneno durante 1 hora.
Abrojos|Caltrops|E|c||Bolsa que cubre 1,5 m²; quien los pisa sufre 1 perforante y reduce su velocidad.
Bolas|Ball Bearings|E|c||Canicas que cubren un área; quien pasa puede caer derribado (CD 10 Destreza).
Red|Net|E|c||Arma que apresa a una criatura Grande o menor.`.split('\n').map(l=>{ const [name,en,ty,ra,att,desc]=l.split('|'); return {id:'it-'+en.toLowerCase().replace(/[^a-z0-9]+/g,'-'),name,en,type:ITEM_TYPES[ty],rarity:RARITIES[ra],att:att==='1'?'Requiere sintonización':att?`Requiere sintonización (${att})`:'',desc,source:'SRD',full:true}; });
