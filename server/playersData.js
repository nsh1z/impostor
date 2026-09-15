// Base de datos curada de más de 100 futbolistas legendarios y contemporáneos
// Sin emojis, con soporte de pista táctica exclusiva para el Impostor (impostorHint)

export const FOOTBALL_PLAYERS = [
  // LEYENDAS HISTÓRICAS
  {
    id: "maradona",
    name: "Diego Maradona",
    aliases: ["maradona", "diego maradona", "el diego", "pelusa", "d10s"],
    country: "Argentina",
    position: "Enganche / Mediapunta",
    era: "Leyenda",
    iconicClub: "Napoli / Boca Juniors",
    hints: ["Campeón del Mundo 1986 con una actuación legendaria", "Autor de La Mano de Dios y el Gol del Siglo", "Ídolo absoluto en el sur de Italia"],
    impostorHint: "Enganche sudamericano zurdo • Campeón del Mundo en los años 80 • Ídolo histórico en Italia"
  },
  {
    id: "pele",
    name: "Pelé",
    aliases: ["pele", "edson arantes do nascimento", "o rei"],
    country: "Brasil",
    position: "Delantero",
    era: "Leyenda",
    iconicClub: "Santos / New York Cosmos",
    hints: ["Único futbolista en la historia en ganar 3 Copas del Mundo", "Conocido mundialmente como O Rei", "Anotó más de mil goles en su carrera profesional"],
    impostorHint: "Delantero sudamericano legendario • Tricampeón del Mundo con Brasil • Considerado rey histórico del fútbol"
  },
  {
    id: "ronaldinho",
    name: "Ronaldinho",
    aliases: ["ronaldinho", "dinho", "ronaldinho gaucho"],
    country: "Brasil",
    position: "Extremo / Mediapunta",
    era: "Leyenda",
    iconicClub: "FC Barcelona / AC Milan / PSG",
    hints: ["Famoso por su sonrisa eterna y regates como la elástica", "Balón de Oro 2005 y ovacionado en el estadio del eterno rival", "Campeón del Mundo en 2002"],
    impostorHint: "Extremo / Mediapunta brasileño • Ganó el Balón de Oro en España en la década del 2000 • Símbolo del Joga Bonito"
  },
  {
    id: "zidane",
    name: "Zinedine Zidane",
    aliases: ["zidane", "zizou", "zinedine zidane"],
    country: "Francia",
    position: "Mediocampista ofensivo",
    era: "Leyenda",
    iconicClub: "Real Madrid / Juventus",
    hints: ["Inolvidable volea con la zurda en la final de Champions 2002", "Balón de Oro y Campeón del Mundo 1998", "Maestro indiscutido de la ruleta marsellesa"],
    impostorHint: "Mediocampista ofensivo europeo • Campeón del Mundo con Francia • Autor de una de las voleas más famosas de la Champions"
  },
  {
    id: "cruyff",
    name: "Johan Cruyff",
    aliases: ["cruyff", "johan cruyff", "el flaco"],
    country: "Países Bajos",
    position: "Delantero / Creador de juego",
    era: "Leyenda",
    iconicClub: "Ajax / FC Barcelona",
    hints: ["Líder del 'Fútbol Total' y de la Naranja Mecánica de los años 70", "Ganador de 3 Balones de Oro", "Inventó un regate con giro de 180 grados que lleva su nombre"],
    impostorHint: "Creador de juego europeo de los años 70 • Filosofía de fútbol total • Ídolo absoluto en Ámsterdam y Cataluña"
  },
  {
    id: "ronaldo_nazario",
    name: "Ronaldo Nazário",
    aliases: ["ronaldo", "r9", "ronaldo nazario", "el fenomeno"],
    country: "Brasil",
    position: "Delantero centro",
    era: "Leyenda",
    iconicClub: "Real Madrid / Inter / Barcelona",
    hints: ["Apodado El Fenómeno por su velocidad y potencia imparables", "Goleador estelar de la final del Mundial 2002", "Ganador de múltiples Balones de Oro antes de cumplir 22 años"],
    impostorHint: "Delantero centro sudamericano letal • Bicampeón del Mundo • Famoso por su regate de bicicleta y paso por el Calcio y LaLiga"
  },
  {
    id: "beckham",
    name: "David Beckham",
    aliases: ["beckham", "david beckham", "becks"],
    country: "Inglaterra",
    position: "Mediocampista derecho",
    era: "Leyenda",
    iconicClub: "Manchester United / Real Madrid",
    hints: ["Especialista magistral en tiros libres con comba perfecta", "Miembro clave de los Galácticos y del triplete inglés de 1999", "Dorsal 7 emblemático"],
    impostorHint: "Mediocampista inglés de pegada exquisita • Famoso por sus tiros libres con efecto • Ícono en Manchester y Madrid"
  },
  {
    id: "henry",
    name: "Thierry Henry",
    aliases: ["henry", "thierry henry", "titi"],
    country: "Francia",
    position: "Delantero centro / Extremo",
    era: "Leyenda",
    iconicClub: "Arsenal / FC Barcelona",
    hints: ["Líder y máximo goleador de Los Invencibles de Londres", "Definición patentada abriendo el pie al segundo poste", "Campeón de Champions con el Barça en 2009"],
    impostorHint: "Delantero francés elegante y veloz • Ídolo máximo de la Premier League en los 2000 • Ganó el triplete en España"
  },
  {
    id: "iniesta",
    name: "Andrés Iniesta",
    aliases: ["iniesta", "andres iniesta", "don andres"],
    country: "España",
    position: "Mediocampista",
    era: "Leyenda",
    iconicClub: "FC Barcelona / Vissel Kobe",
    hints: ["Anotó el gol que dio el título mundial en Sudáfrica 2010", "Cerebro del sextete bajo la dirección de Guardiola", "Conocido por su pase filtrado y regate en una baldosa"],
    impostorHint: "Mediocampista español legendario • Gol más importante en la historia de su selección nacional • Multicampeón con el Barça"
  },
  {
    id: "xavi",
    name: "Xavi Hernández",
    aliases: ["xavi", "xavi hernandez"],
    country: "España",
    position: "Mediocampista organizador",
    era: "Leyenda",
    iconicClub: "FC Barcelona",
    hints: ["Metrónomo supremo del estilo de posesión y tiki-taka", "Récords de precisión de pase y visión periférica de 360 grados", "Capitán histórico multicampeón de Europa"],
    impostorHint: "Mediocampista central español • El cerebro del tiki-taka y del control del juego • Campeón del Mundo y bicampeón de Europa"
  },
  {
    id: "pirlo",
    name: "Andrea Pirlo",
    aliases: ["pirlo", "andrea pirlo", "el arquitecto"],
    country: "Italia",
    position: "Regista / Mediocampista",
    era: "Leyenda",
    iconicClub: "AC Milan / Juventus",
    hints: ["Apodado Il Maestro y El Arquitecto por su clase", "Especialista en tiros libres con efecto 'maldita'", "Campeón del Mundo en Alemania 2006"],
    impostorHint: "Regista italiano de pelo largo • Campeón del Mundo 2006 • Jugó en los dos clubes más grandes del norte de Italia"
  },
  {
    id: "kaka",
    name: "Kaká",
    aliases: ["kaka", "ricardo kaka"],
    country: "Brasil",
    position: "Mediapunta",
    era: "Leyenda",
    iconicClub: "AC Milan / Real Madrid",
    hints: ["Balón de Oro 2007 antes del duopolio moderno", "Zancada demoledora en transiciones rápidas", "Figura indiscutible de la Champions League 2007"],
    impostorHint: "Mediapunta brasileño de enorme potencia física • Balón de Oro en 2007 con un club italiano • Traspaso récord a España"
  },
  {
    id: "maldini",
    name: "Paolo Maldini",
    aliases: ["maldini", "paolo maldini"],
    country: "Italia",
    position: "Defensa central / Lateral",
    era: "Leyenda",
    iconicClub: "AC Milan",
    hints: ["Defendió una sola camiseta durante 25 temporadas consecutivas", "Ganó 5 Copas de Europa / Champions League", "Elegancia defensiva sin necesidad de cometer faltas"],
    impostorHint: "Defensor italiano legendario • Jugó 25 años en el mismo club • Alzó 5 Copas de Europa con el brazalete de capitán"
  },
  {
    id: "puyol",
    name: "Carles Puyol",
    aliases: ["puyol", "carles puyol", "tarzan"],
    country: "España",
    position: "Defensa central",
    era: "Leyenda",
    iconicClub: "FC Barcelona",
    hints: ["Capitán indomable conocido por su entrega y juego aéreo", "Gol de cabeza clave ante Alemania en la semifinal de 2010", "Líder de la mejor era defensiva de su club"],
    impostorHint: "Defensa central español de pelo rizado • Famoso por su liderazgo y valentía • Capitán histórico del Barça de Guardiola"
  },
  {
    id: "roberto_carlos",
    name: "Roberto Carlos",
    aliases: ["roberto carlos"],
    country: "Brasil",
    position: "Lateral izquierdo",
    era: "Leyenda",
    iconicClub: "Real Madrid / Palmeiras",
    hints: ["Disparo con zurda con una potencia descomunal que desafió la física", "Gol imposible con efecto en el Tournoi de France 1997", "Tricampeón de Europa y campeón del Mundo 2002"],
    impostorHint: "Lateral izquierdo sudamericano • Conocido por los tiros libres más potentes de la historia • Jugó una década en el Real Madrid"
  },
  {
    id: "casillas",
    name: "Iker Casillas",
    aliases: ["casillas", "iker casillas", "san iker"],
    country: "España",
    position: "Arquero",
    era: "Leyenda",
    iconicClub: "Real Madrid / Porto",
    hints: ["Conocido popularmente como San Iker por sus milagrosas paradas", "Parada con la punta del pie en el mano a mano de la final de 2010", "Capitán del ciclo dorado de su selección"],
    impostorHint: "Arquero europeo legendario • Capitán en Eurocopas y Mundial con España • Defendió el arco del Real Madrid desde muy joven"
  },
  {
    id: "buffon",
    name: "Gianluigi Buffon",
    aliases: ["buffon", "gianluigi buffon", "gigi buffon"],
    country: "Italia",
    position: "Arquero",
    era: "Leyenda",
    iconicClub: "Juventus / Parma / PSG",
    hints: ["Disputó más de 1100 partidos oficiales y 5 Mundiales", "Campeón del Mundo 2006 recibiendo apenas 2 goles en todo el torneo", "Ícono de regularidad en el arco"],
    impostorHint: "Arquero italiano histórico • Campeón del Mundo en 2006 • Atajó al máximo nivel durante más de dos décadas"
  },
  {
    id: "riquelme",
    name: "Juan Román Riquelme",
    aliases: ["riquelme", "juan roman riquelme", "roman"],
    country: "Argentina",
    position: "Enganche clásico",
    era: "Leyenda",
    iconicClub: "Boca Juniors / Villarreal",
    hints: ["El arquetipo del '10' cerebral que pisa la pelota", "Conquistó 3 Copas Libertadores con noches inolvidables", "Llevó a un club humilde español a semifinales de Champions"],
    impostorHint: "Enganche argentino clásico • Especialista en pausar el juego y pisar el balón • Ídolo supremo de Boca Juniors"
  },
  {
    id: "batistuta",
    name: "Gabriel Batistuta",
    aliases: ["batistuta", "gabriel batistuta", "batigol"],
    country: "Argentina",
    position: "Delantero centro",
    era: "Leyenda",
    iconicClub: "Fiorentina / Roma / Boca",
    hints: ["Apodado Batigol por su demoledor remate de media distancia", "Anotó tripletes en dos Mundiales diferentes", "Monumento e ídolo eterno en Florencia"],
    impostorHint: "Delantero centro argentino de los años 90 • Disparos con violencia demoledora a la red • Histórico del Calcio italiano"
  },
  {
    id: "ibrahimovic",
    name: "Zlatan Ibrahimović",
    aliases: ["zlatan", "ibrahimovic", "zlatan ibrahimovic"],
    country: "Suecia",
    position: "Delantero centro",
    era: "Leyenda",
    iconicClub: "AC Milan / PSG / Inter / Barcelona / Ajax",
    hints: ["Chilena acrobática de más de 30 metros contra Inglaterra", "Cinturón negro de taekwondo que aplicó a remates acrobáticos", "Campeón de liga en 4 países distintos"],
    impostorHint: "Delantero europeo carismático y acrobático • Campeón en Italia, Francia, España y Países Bajos • Famoso por goles imposibles"
  },
  {
    id: "gerrard",
    name: "Steven Gerrard",
    aliases: ["gerrard", "steven gerrard"],
    country: "Inglaterra",
    position: "Mediocampista",
    era: "Leyenda",
    iconicClub: "Liverpool",
    hints: ["Lideró el legendario Milagro de Estambul remontando un 0-3", "Capitán eterno de Anfield con remates letales de larga distancia", "Símbolo de entrega de la Premier"],
    impostorHint: "Mediocampista inglés todoterreno • Capitán histórico de Anfield • Héroe de una de las remontadas más míticas de Champions"
  },
  {
    id: "lampard",
    name: "Frank Lampard",
    aliases: ["lampard", "frank lampard"],
    country: "Inglaterra",
    position: "Mediocampista llegador",
    era: "Leyenda",
    iconicClub: "Chelsea",
    hints: ["Máximo goleador histórico del Chelsea a pesar de jugar de volante", "Llegada al área y remate de media distancia impecables", "Ganador de la Champions 2012"],
    impostorHint: "Mediocampista inglés con tremendo olfato goleador • Máximo anotador en la historia del Chelsea • Campeón de Champions"
  },
  {
    id: "drogba",
    name: "Didier Drogba",
    aliases: ["drogba", "didier drogba"],
    country: "Costa de Marfil",
    position: "Delantero centro",
    era: "Leyenda",
    iconicClub: "Chelsea",
    hints: ["Gol de cabeza agónico y penal decisivo en la final de Múnich 2012", "Poderío físico dominante ante defensas centrales", "Líder histórico africano"],
    impostorHint: "Delantero centro africano de enorme potencia • Ídolo del Chelsea en la era Mourinho • Héroe de la final de Champions 2012"
  },
  {
    id: "eto",
    name: "Samuel Eto'o",
    aliases: ["etoo", "samuel etoo", "eto"],
    country: "Camerún",
    position: "Delantero centro",
    era: "Leyenda",
    iconicClub: "FC Barcelona / Inter / Mallorca",
    hints: ["Logró dos tripletes consecutivos con clubes distintos en 2009 y 2010", "Goles en finales de Champions con Barça e Inter", "Velocidad felina y definición"],
    impostorHint: "Delantero africano histórico • Ganó dos tripletes seguidos en España e Italia • Goleador temido en Europa"
  },
  {
    id: "rooney",
    name: "Wayne Rooney",
    aliases: ["rooney", "wayne rooney"],
    country: "Inglaterra",
    position: "Delantero centro",
    era: "Leyenda",
    iconicClub: "Manchester United / Everton",
    hints: ["Máximo goleador histórico del Manchester United", "Inolvidable golazo de chilena en el derbi de la ciudad en 2011", "Entrega física y garra total"],
    impostorHint: "Delantero inglés corpulento y combativo • Máximo goleador en Old Trafford • Marcó una de las chilenas más célebres de la Premier"
  },
  {
    id: "figo",
    name: "Luís Figo",
    aliases: ["figo", "luis figo"],
    country: "Portugal",
    position: "Extremo",
    era: "Leyenda",
    iconicClub: "Real Madrid / FC Barcelona / Inter",
    hints: ["Protagonizó el traspaso más controversial del fútbol moderno en el año 2000", "Balón de Oro 2000 y líder de la Generación de Oro portuguesa", "Pase y desborde quirúrgicos"],
    impostorHint: "Extremo portugués • Ganador del Balón de Oro en el 2000 • Famoso por cruzar directamente la rivalidad Madrid-Barça"
  },
  {
    id: "schevchenko",
    name: "Andriy Shevchenko",
    aliases: ["shevchenko", "andriy shevchenko"],
    country: "Ucrania",
    position: "Delantero centro",
    era: "Leyenda",
    iconicClub: "AC Milan / Dinamo Kiev",
    hints: ["Balón de Oro 2004 gracias a sus temporadas goleadoras en Italia", "Penal definitorio en la final de Champions 2003 en Manchester", "Ataque veloz e implacable"],
    impostorHint: "Delantero centro de Europa del Este • Balón de Oro con el AC Milan • Goleador temido en el Calcio de los 2000"
  },
  {
    id: "kroos",
    name: "Toni Kroos",
    aliases: ["kroos", "toni kroos"],
    country: "Alemania",
    position: "Mediocampista organizador",
    era: "Leyenda",
    iconicClub: "Real Madrid / Bayern Múnich",
    hints: ["Precisión de pase cercana al 95% a lo largo de toda su carrera", "Conquistó 6 títulos de Champions League", "Campeón del Mundo 2014 en Brasil"],
    impostorHint: "Mediocampista central alemán de pase perfecto • 6 veces campeón de la Champions • Se retiró en la cima con el Real Madrid"
  },

  // ESTRELLAS CONTEMPORÁNEAS Y ACTUALES
  {
    id: "messi",
    name: "Lionel Messi",
    aliases: ["messi", "lionel messi", "leo messi", "la pulga"],
    country: "Argentina",
    position: "Delantero / Extremo / Creador",
    era: "Actual",
    iconicClub: "FC Barcelona / Inter Miami / PSG",
    hints: ["Campeón del Mundo en Qatar 2022 con 7 goles anotados", "Récord histórico de 8 Balones de Oro", "Más de 800 goles oficiales y 40 títulos"],
    impostorHint: "Delantero / Creador zurdo argentino • Ganador de 8 Balones de Oro • Campeón del Mundo en 2022"
  },
  {
    id: "cr7",
    name: "Cristiano Ronaldo",
    aliases: ["cristiano", "ronaldo", "cr7", "cristiano ronaldo", "el bicho"],
    country: "Portugal",
    position: "Delantero centro / Extremo",
    era: "Actual",
    iconicClub: "Real Madrid / Manchester United / Juventus / Al Nassr",
    hints: ["Máximo goleador histórico del fútbol profesional", "Ganador de 5 Balones de Oro y 5 Champions League", "Famoso por su celebración con salto y grito"],
    impostorHint: "Delantero portugués • Máximo anotador histórico del fútbol • 5 Balones de Oro y leyenda en Madrid y Manchester"
  },
  {
    id: "mbappe",
    name: "Kylian Mbappé",
    aliases: ["mbappe", "kylian mbappe"],
    country: "Francia",
    position: "Delantero / Extremo",
    era: "Actual",
    iconicClub: "Real Madrid / PSG / Monaco",
    hints: ["Anotó un hat-trick en la final del Mundial 2022", "Campeón del Mundo en Rusia 2018 con solo 19 años", "Velocidad de punta y zancada electrizante"],
    impostorHint: "Delantero velocísimo francés • Campeón del Mundo en 2018 • Fichaje estelar del Real Madrid"
  },
  {
    id: "haaland",
    name: "Erling Haaland",
    aliases: ["haaland", "erling haaland"],
    country: "Noruega",
    position: "Delantero centro",
    era: "Actual",
    iconicClub: "Manchester City / Borussia Dortmund",
    hints: ["Récord histórico de goles en una misma temporada de Premier League", "Pieza clave en el triplete de 2023 con Pep Guardiola", "Potencia física y festejo en posición de loto"],
    impostorHint: "Delantero centro nórdico de físico imponente • Máximo goleador de la Premier League • Juega en Manchester City"
  },
  {
    id: "vinicius",
    name: "Vinícius Jr",
    aliases: ["vinicius", "vini", "vinicius jr", "vinicius junior"],
    country: "Brasil",
    position: "Extremo izquierdo",
    era: "Actual",
    iconicClub: "Real Madrid / Flamengo",
    hints: ["Anotó goles en las finales de Champions League de 2022 y 2024", "Regate audaz pegado a la banda izquierda y aceleración", "Dorsal 7 en el club blanco"],
    impostorHint: "Extremo izquierdo brasileño muy desequilibrante • Goles en finales de Champions • Figura del Real Madrid actual"
  },
  {
    id: "bellingham",
    name: "Jude Bellingham",
    aliases: ["bellingham", "jude bellingham"],
    country: "Inglaterra",
    position: "Mediocampista ofensivo",
    era: "Actual",
    iconicClub: "Real Madrid / Borussia Dortmund",
    hints: ["Festejo característico abriendo los brazos frente a la grada", "Chilena salvadora en el minuto 95 de la Eurocopa 2024", "Portador del dorsal 5 de Zidane"],
    impostorHint: "Mediocampista ofensivo inglés • Llegada al área y gol en España • Festejo con los brazos abiertos"
  },
  {
    id: "de_bruyne",
    name: "Kevin De Bruyne",
    aliases: ["de bruyne", "kevin de bruyne", "kdb"],
    country: "Bélgica",
    position: "Mediocampista creador",
    era: "Actual",
    iconicClub: "Manchester City / Wolfsburg",
    hints: ["Considerado el mejor pasador del fútbol contemporáneo", "Centro con comba milimétrica hacia el segundo poste", "Líder del mediocampo del City"],
    impostorHint: "Mediocampista belga de visión suprema • Rey de las asistencias en la Premier League • Juega de celeste en Inglaterra"
  },
  {
    id: "salah",
    name: "Mohamed Salah",
    aliases: ["salah", "mo salah", "mohamed salah"],
    country: "Egipto",
    position: "Extremo derecho",
    era: "Actual",
    iconicClub: "Liverpool / Roma",
    hints: ["Conocido como el Faraón de Anfield", "Múltiples Botas de Oro en la liga inglesa recortando hacia adentro con la zurda", "Campeón de Premier y Champions"],
    impostorHint: "Extremo zurdo africano que juega por derecha • Ídolo absoluto de Anfield en Liverpool • Goleador estelar"
  },
  {
    id: "neymar",
    name: "Neymar Jr",
    aliases: ["neymar", "neymar jr", "ney"],
    country: "Brasil",
    position: "Extremo / Mediapunta",
    era: "Actual",
    iconicClub: "Santos / FC Barcelona / PSG / Al Hilal",
    hints: ["Máximo goleador histórico de la selección brasileña", "Integró el mítico tridente MSN", "Fantasía, regates y control de balón de dibujos animados"],
    impostorHint: "Extremo brasileño de pura magia y regate • Máximo anotador de la Canarinha • Formó parte de la MSN en Barcelona"
  },
  {
    id: "lewandowski",
    name: "Robert Lewandowski",
    aliases: ["lewandowski", "robert lewandowski"],
    country: "Polonia",
    position: "Delantero centro",
    era: "Actual",
    iconicClub: "FC Barcelona / Bayern Múnich / Dortmund",
    hints: ["Anotó 5 goles en solo 9 minutos saliendo desde el banco", "Bota de Oro europea y sextete en 2020", "Definición clínica en el área"],
    impostorHint: "Delantero centro polaco de área • Bota de Oro europea • Goleador en Alemania y actualmente en España"
  },
  {
    id: "modric",
    name: "Luka Modrić",
    aliases: ["modric", "luka modric"],
    country: "Croacia",
    position: "Mediocampista",
    era: "Actual",
    iconicClub: "Real Madrid / Tottenham",
    hints: ["Ganador del Balón de Oro 2018 rompiendo diez años de hegemonía", "Famoso por su pase con el empeine exterior (tres dedos)", "Subcampeón del Mundo en Rusia"],
    impostorHint: "Mediocampista croata incombustible • Balón de Oro en 2018 • Famoso por su pase de tres dedos con el exterior del pie"
  },
  {
    id: "benzema",
    name: "Karim Benzema",
    aliases: ["benzema", "karim benzema"],
    country: "Francia",
    position: "Delantero centro",
    era: "Actual",
    iconicClub: "Real Madrid / Lyon",
    hints: ["Balón de Oro 2022 con remontadas épicas en Champions", "Delantero asociativo con gran capacidad para hacer jugar a los demás", "Vendaje característico en la muñeca"],
    impostorHint: "Delantero centro francés técnico • Ganador del Balón de Oro 2022 tras remontadas históricas • Leyenda del Real Madrid"
  },
  {
    id: "rodri",
    name: "Rodri Hernández",
    aliases: ["rodri", "rodri hernandez"],
    country: "España",
    position: "Pivote / Mediocentro",
    era: "Actual",
    iconicClub: "Manchester City / Atlético de Madrid",
    hints: ["Ganador del Balón de Oro 2024", "Gol decisivo en la final de Champions 2023", "Elegido mejor jugador de la Eurocopa 2024"],
    impostorHint: "Pivote defensivo español • Balón de Oro 2024 • Campeón de Europa con su club y su selección"
  },
  {
    id: "lamine_yamal",
    name: "Lamine Yamal",
    aliases: ["lamine", "lamine yamal"],
    country: "España",
    position: "Extremo derecho",
    era: "Actual",
    iconicClub: "FC Barcelona",
    hints: ["Golazo al ángulo a Francia en la Eurocopa 2024 antes de cumplir los 17 años", "Joven prodigio formado en La Masia", "Celebración formando el número 304"],
    impostorHint: "Extremo derecho zurdo muy joven • Campeón y revelación de la Eurocopa 2024 con España • Joya del Barça"
  },
  {
    id: "dibu_martinez",
    name: "Emiliano Martínez",
    aliases: ["dibu", "dibu martinez", "emiliano martinez"],
    country: "Argentina",
    position: "Arquero",
    era: "Actual",
    iconicClub: "Aston Villa / Arsenal",
    hints: ["Parada en el minuto 123 de la final de Qatar 2022", "Bicampeón del Trofeo Yashin al mejor portero del mundo", "Famoso por su personalidad intimidante en tandas de penales"],
    impostorHint: "Arquero argentino campeón del Mundo • Trofeo Yashin en múltiples ocasiones • Ataja en la Premier League"
  },
  {
    id: "julian_alvarez",
    name: "Julián Álvarez",
    aliases: ["julian", "julian alvarez", "la arana"],
    country: "Argentina",
    position: "Delantero",
    era: "Actual",
    iconicClub: "Atlético de Madrid / Manchester City / River Plate",
    hints: ["Conquistó Mundial, Champions League, Copa América y Libertadores a muy temprana edad", "Apodado La Araña por su presión incansable", "Festejo imitando al Hombre Araña"],
    impostorHint: "Delantero sudamericano incansable • Ganó Mundial y Champions con pocos años de carrera • Traspaso sonado al fútbol español"
  },
  {
    id: "lautaro_martinez",
    name: "Lautaro Martínez",
    aliases: ["lautaro", "lautaro martinez"],
    country: "Argentina",
    position: "Delantero centro",
    era: "Actual",
    iconicClub: "Inter de Milán / Racing Club",
    hints: ["Apodado El Toro por su potencia en el cuerpo a cuerpo", "Capitán y máximo goleador de la Serie A italiana", "Gol del campeonato en la final de la Copa América 2024"],
    impostorHint: "Delantero centro potente sudamericano • Capitán e ídolo del Inter de Milán • Gol en la final de Copa América"
  },
  {
    id: "di_maria",
    name: "Ángel Di María",
    aliases: ["di maria", "angel di maria", "el fideo"],
    country: "Argentina",
    position: "Extremo / Creador",
    era: "Actual",
    iconicClub: "Benfica / Real Madrid / PSG / Juventus",
    hints: ["Goles picando el balón en las finales de Juegos Olímpicos, Maracaná 2021 y Qatar 2022", "Celebración dibujando un corazón con las manos", "Zurda prodigiosa y regate"],
    impostorHint: "Extremo zurdo argentino • Héroe con goles en todas las finales grandes de su selección • Festejo del corazón"
  },
  {
    id: "courtois",
    name: "Thibaut Courtois",
    aliases: ["courtois", "thibaut courtois"],
    country: "Bélgica",
    position: "Arquero",
    era: "Actual",
    iconicClub: "Real Madrid / Chelsea / Atlético de Madrid",
    hints: ["Actuación consagratoria con 9 paradas en la final de Champions 2022", "Estatura imponente de dos metros con reflejos felinos", "Guante de Oro en el Mundial 2018"],
    impostorHint: "Arquero belga de dos metros de altura • Muralla decisiva en finales de Champions • Juega en el Real Madrid"
  },
  {
    id: "valverde",
    name: "Federico Valverde",
    aliases: ["valverde", "fede valverde"],
    country: "Uruguay",
    position: "Mediocampista",
    era: "Actual",
    iconicClub: "Real Madrid / Peñarol",
    hints: ["Apodado El Halcón por su despliegue físico de área a área", "Disparo con potencia de cañón desde fuera del área", "Falta táctica histórica en la Supercopa de España"],
    impostorHint: "Mediocampista uruguayo de enorme despliegue • Potencia de remate de larga distancia • Heredero del dorsal 8 en Madrid"
  },
  {
    id: "kane",
    name: "Harry Kane",
    aliases: ["kane", "harry kane"],
    country: "Inglaterra",
    position: "Delantero centro",
    era: "Actual",
    iconicClub: "Bayern Múnich / Tottenham",
    hints: ["Máximo goleador histórico de la selección inglesa", "Bota de Oro europea y especialista infalible en penales", "Delantero centro con gran visión de enlace"],
    impostorHint: "Delantero centro inglés de élite • Máximo artillero de su país • Fichaje estelar del Bayern Múnich"
  },
  {
    id: "son",
    name: "Son Heung-min",
    aliases: ["son", "son heung min"],
    country: "Corea del Sur",
    position: "Extremo / Delantero",
    era: "Actual",
    iconicClub: "Tottenham / Bayer Leverkusen",
    hints: ["Premio Puskás por recorrer 80 metros dejando rivales en el camino", "Bota de Oro de la Premier League sin anotar un solo penal", "Celebración haciendo una foto con los dedos"],
    impostorHint: "Extremo asiático de élite • Bota de Oro en la Premier League • Ídolo absoluto de los Spurs de Londres"
  },
  {
    id: "neuer",
    name: "Manuel Neuer",
    aliases: ["neuer", "manuel neuer"],
    country: "Alemania",
    position: "Arquero líbero",
    era: "Actual",
    iconicClub: "Bayern Múnich / Schalke 04",
    hints: ["Revolucionó el concepto de portero moderno jugando como líbero fuera del área", "Campeón del Mundo 2014 barriendo como último defensor", "Doble triplete en Múnich"],
    impostorHint: "Arquero alemán que revolucionó el puesto saliendo del área • Campeón del Mundo en 2014 • Leyenda del Bayern"
  },
  {
    id: "van_dijk",
    name: "Virgil van Dijk",
    aliases: ["van dijk", "virgil van dijk"],
    country: "Países Bajos",
    position: "Defensa central",
    era: "Actual",
    iconicClub: "Liverpool / Southampton",
    hints: ["Segundo en el Balón de Oro 2019 tras una campaña perfecta de Champions", "Racha histórica de más de un año sin que ningún delantero pudiera regatearlo", "Líder de la zaga de Anfield"],
    impostorHint: "Defensa central neerlandés de imponente porte físico • Mariscal de la zaga del Liverpool • Estuvo a un paso del Balón de Oro"
  }
];

export function getRandomPlayer(recentIds = []) {
  const available = FOOTBALL_PLAYERS.filter(p => !recentIds.includes(p.id));
  const pool = available.length > 0 ? available : FOOTBALL_PLAYERS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

export function getAllPlayerNames() {
  return FOOTBALL_PLAYERS.map(p => ({
    id: p.id,
    name: p.name,
    country: p.country,
    era: p.era,
    iconicClub: p.iconicClub
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export function checkGuess(guess, secretPlayer) {
  if (!guess || !secretPlayer) return false;
  const clean = guess.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (secretPlayer.id.toLowerCase() === clean) return true;

  const targetClean = secretPlayer.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (targetClean === clean || targetClean.includes(clean) || clean.includes(targetClean)) {
    return true;
  }

  if (secretPlayer.aliases && secretPlayer.aliases.some(alias => {
    const aliasClean = alias.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return aliasClean === clean || clean.includes(aliasClean);
  })) {
    return true;
  }

  return false;
}
