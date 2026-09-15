// Base de datos de futbolistas argentinos, del fútbol argentino y leyendas mundiales.
// REGLA: Pistas CORTAS Y CONCISAS (1-3 palabras), ingeniosas/complicadas (nunca palabras obvias como delantero, zurdo o diez).
export const FOOTBALL_PLAYERS = [
  // ==========================================
  // LEYENDAS HISTÓRICAS ARGENTINAS
  // ==========================================
  { id: "maradona", name: "Diego Maradona", aliases: ["maradona", "diego maradona", "el diego", "pelusa", "d10s", "el diez"], hint: "Fiorito" },
  { id: "messi", name: "Lionel Messi", aliases: ["messi", "lionel messi", "leo messi", "la pulga", "d10s"], hint: "Servilleta" },
  { id: "kempes", name: "Mario Kempes", aliases: ["kempes", "mario kempes", "el matador"], hint: "Bell Ville" },
  { id: "passarella", name: "Daniel Passarella", aliases: ["passarella", "daniel passarella", "el gran capitan", "el kaiser"], hint: "Kaiser" },
  { id: "fillol", name: "Ubaldo Fillol", aliases: ["fillol", "ubaldo fillol", "el pato fillol", "pato fillol"], hint: "Buzo verde" },
  { id: "carrizo", name: "Amadeo Carrizo", aliases: ["amadeo carrizo", "carrizo", "amadeo"], hint: "Boina" },
  { id: "gatti", name: "Hugo Gatti", aliases: ["gatti", "hugo gatti", "el loco gatti", "loco gatti"], hint: "Vincha" },
  { id: "bochini", name: "Ricardo Bochini", aliases: ["bochini", "ricardo bochini", "el bocha", "bocha"], hint: "Zárate" },
  { id: "alonso", name: "Norberto Alonso", aliases: ["alonso", "norberto alonso", "beto alonso", "el beto"], hint: "Pelota naranja" },
  { id: "labruna", name: "Ángel Labruna", aliases: ["labruna", "angel labruna", "el feo labruna", "angelito labruna"], hint: "Taparse la nariz" },
  { id: "di_stefano", name: "Alfredo Di Stéfano", aliases: ["di stefano", "alfredo di stefano", "la saeta rubia"], hint: "Saeta Rubia" },
  { id: "houseman", name: "René Houseman", aliases: ["houseman", "rene houseman", "el loco houseman"], hint: "Bajo Belgrano" },
  { id: "sanfilippo", name: "José Sanfilippo", aliases: ["sanfilippo", "jose sanfilippo", "el nene sanfilippo"], hint: "El Nene" },
  { id: "batistuta", name: "Gabriel Batistuta", aliases: ["batistuta", "gabriel batistuta", "batigol"], hint: "Metralleta" },
  { id: "caniggia", name: "Claudio Caniggia", aliases: ["caniggia", "claudio caniggia", "el pajaro", "hijo del viento"], hint: "Hijo del viento" },
  { id: "redondo", name: "Fernando Redondo", aliases: ["redondo", "fernando redondo", "el principe redondo"], hint: "Pelo largo" },
  { id: "zanetti", name: "Javier Zanetti", aliases: ["zanetti", "javier zanetti", "el pupi", "pupi zanetti"], hint: "Pupi" },
  { id: "simeone", name: "Diego Simeone", aliases: ["simeone", "diego simeone", "el cholo", "cholo simeone"], hint: "Cuchillo entre dientes" },
  { id: "ruggeri", name: "Oscar Ruggeri", aliases: ["ruggeri", "oscar ruggeri", "el cabezon ruggeri"], hint: "Corral de Bustos" },
  { id: "burruchaga", name: "Jorge Burruchaga", aliases: ["burruchaga", "jorge burruchaga", "burru"], hint: "Minuto 84" },

  // ==========================================
  // ÍCONOS DE CLUBES ARGENTINOS (2000s - 2010s)
  // ==========================================
  { id: "riquelme", name: "Juan Román Riquelme", aliases: ["riquelme", "juan roman riquelme", "roman", "el diez de boca"], hint: "Topo Gigio" },
  { id: "palermo", name: "Martín Palermo", aliases: ["palermo", "martin palermo", "el titan", "el optimista del gol"], hint: "Optimista del gol" },
  { id: "gallardo", name: "Marcelo Gallardo", aliases: ["gallardo", "marcelo gallardo", "el muneco", "muneco gallardo"], hint: "Muñeco" },
  { id: "francescoli", name: "Enzo Francescoli", aliases: ["francescoli", "enzo francescoli", "el principe francescoli"], hint: "Príncipe" },
  { id: "tevez", name: "Carlos Tevez", aliases: ["tevez", "carlos tevez", "el apache", "el jugador del pueblo"], hint: "Fuerte Apache" },
  { id: "veron", name: "Juan Sebastián Verón", aliases: ["veron", "juan sebastian veron", "la brujita veron", "brujita"], hint: "Brujita" },
  { id: "ortega", name: "Ariel Ortega", aliases: ["ortega", "ariel ortega", "el burrito ortega", "burrito"], hint: "Ledesma" },
  { id: "aimar", name: "Pablo Aimar", aliases: ["aimar", "pablo aimar", "el payasito aimar", "payaso aimar"], hint: "Río Cuarto" },
  { id: "saviola", name: "Javier Saviola", aliases: ["saviola", "javier saviola", "el conejito saviola"], hint: "Conejito" },
  { id: "mascherano", name: "Javier Mascherano", aliases: ["mascherano", "javier mascherano", "el jefecito"], hint: "Jefecito" },
  { id: "goycochea", name: "Sergio Goycochea", aliases: ["goycochea", "sergio goycochea", "goyco"], hint: "Penales de Italia" },
  { id: "schelotto", name: "Guillermo Barros Schelotto", aliases: ["guillermo barros schelotto", "elBusca", "guillermo", "mellizo schelotto"], hint: "Mellizo" },
  { id: "schiavi", name: "Rolando Schiavi", aliases: ["schiavi", "rolando schiavi", "el flaco schiavi"], hint: "Lincoln" },
  { id: "abbondanzieri", name: "Roberto Abbondanzieri", aliases: ["abbondanzieri", "roberto abbondanzieri", "el pato abbondanzieri"], hint: "Bouquet" },
  { id: "ibarra", name: "Hugo Ibarra", aliases: ["ibarra", "hugo ibarra", "el negro ibarra"], hint: "Formosa" },
  { id: "chilavert", name: "José Luis Chilavert", aliases: ["chilavert", "jose luis chilavert", "chila"], hint: "Bulldog" },
  { id: "serna", name: "Mauricio Serna", aliases: ["serna", "mauricio serna", "chicho serna"], hint: "Chicho" },
  { id: "bermudez", name: "Jorge Bermúdez", aliases: ["bermudez", "jorge bermudez", "el patron bermudez"], hint: "El Patrón" },
  { id: "cordoba", name: "Oscar Córdoba", aliases: ["cordoba", "oscar cordoba"], hint: "Morumbí" },
  { id: "delgado", name: "Marcelo Delgado", aliases: ["delgado", "marcelo delgado", "el chelo delgado"], hint: "Tres dedos" },
  { id: "romagnoli", name: "Leandro Romagnoli", aliases: ["romagnoli", "leandro romagnoli", "el pipi romagnoli", "pipi romagnoli"], hint: "Boedo" },
  { id: "erviti", name: "Walter Erviti", aliases: ["erviti", "walter erviti"], hint: "Banfield 2009" },
  { id: "falcao", name: "Radamel Falcao García", aliases: ["falcao", "radamel falcao", "el tigre falcao"], hint: "Tigre" },
  { id: "teo_gutierrez", name: "Teófilo Gutiérrez", aliases: ["teo gutierrez", "teofilo gutierrez", "teo"], hint: "Banda en la Bombonera" },
  { id: "alario", name: "Lucas Alario", aliases: ["alario", "lucas alario", "el pipa alario"], hint: "Tostado" },
  { id: "driussi", name: "Sebastián Driussi", aliases: ["driussi", "sebastian driussi"], hint: "Tatuaje del león" },
  { id: "pity_martinez", name: "Gonzalo Martínez", aliases: ["pity martinez", "gonzalo martinez", "el pity", "pity"], hint: "Y va el tercero" },
  { id: "pratto", name: "Lucas Pratto", aliases: ["pratto", "lucas pratto", "el oso pratto"], hint: "Modo Oso" },
  { id: "quintero", name: "Juan Fernando Quintero", aliases: ["quintero", "juan fernando quintero", "juanfer quintero", "juanfer"], hint: "Madrid 2018" },
  { id: "barovero", name: "Marcelo Barovero", aliases: ["barovero", "marcelo barovero", "trapito barovero"], hint: "Trapito" },
  { id: "ponzio", name: "Leonardo Ponzio", aliases: ["ponzio", "leonardo ponzio", "el leon ponzio"], hint: "Las Rosas" },
  { id: "maidana", name: "Jonathan Maidana", aliases: ["maidana", "jonathan maidana", "joni maidana"], hint: "Caudillo" },
  { id: "casco", name: "Milton Casco", aliases: ["casco", "milton casco"], hint: "María Grande" },
  { id: "enzo_perez", name: "Enzo Pérez", aliases: ["enzo perez", "enzo nicolas perez"], hint: "Buzo verde" },
  { id: "benedetto", name: "Darío Benedetto", aliases: ["benedetto", "dario benedetto", "el pipa benedetto"], hint: "Lengua afuera" },
  { id: "wanchope", name: "Ramón Ábila", aliases: ["wanchope", "ramon abila", "wanchope abila"], hint: "Offside" },
  { id: "rossi", name: "Agustín Rossi", aliases: ["rossi", "agustin rossi"], hint: "Penales" },
  { id: "diego_milito", name: "Diego Milito", aliases: ["diego milito", "milito", "el principe milito"], hint: "Bernabéu 2010" },
  { id: "lisandro_lopez", name: "Lisandro López", aliases: ["lisandro lopez", "licha lopez", "licha"], hint: "Dedo en la sien" },
  { id: "cavenaghi", name: "Fernando Cavenaghi", aliases: ["cavenaghi", "fernando cavenaghi", "el torito cavenaghi"], hint: "Torito" },
  { id: "higuain", name: "Gonzalo Higuaín", aliases: ["higuain", "gonzalo higuain", "el pipita higuain", "pipita"], hint: "36 goles" },
  { id: "aguero", name: "Sergio Agüero", aliases: ["aguero", "sergio aguero", "el kun aguero", "kun"], hint: "Minuto 93" },
  { id: "lavezzi", name: "Ezequiel Lavezzi", aliases: ["lavezzi", "ezequiel lavezzi", "el pocho lavezzi", "pocho"], hint: "Agua a Sabella" },
  { id: "rojo", name: "Marcos Rojo", aliases: ["rojo", "marcos rojo"], hint: "Rabona" },
  { id: "chiquito_romero", name: "Sergio Romero", aliases: ["sergio romero", "chiquito romero", "chiquito"], hint: "Te convertís en héroe" },

  // ==========================================
  // CAMPEONES DEL MUNDO (QATAR) Y ACTUALIDAD
  // ==========================================
  { id: "dibu_martinez", name: "Emiliano Martínez", aliases: ["dibu martinez", "emiliano martinez", "dibu"], hint: "Mirá que te como" },
  { id: "julian_alvarez", name: "Julián Álvarez", aliases: ["julian alvarez", "la arana", "arana alvarez"], hint: "Calchín" },
  { id: "di_maria", name: "Ángel Di María", aliases: ["di maria", "angel di maria", "el fideo di maria", "fideo"], hint: "Picadita" },
  { id: "de_paul", name: "Rodrigo De Paul", aliases: ["de paul", "rodrigo de paul", "el motorcito de paul"], hint: "Motorcito" },
  { id: "enzo_fernandez", name: "Enzo Fernández", aliases: ["enzo fernandez", "enzo"], hint: "Golden Boy" },
  { id: "mac_allister", name: "Alexis Mac Allister", aliases: ["mac allister", "alexis mac allister", "el colo mac allister"], hint: "La Pampa" },
  { id: "cuti_romero", name: "Cristian Romero", aliases: ["cuti romero", "cristian romero", "el cuti"], hint: "Belgrano" },
  { id: "otamendi", name: "Nicolás Otamendi", aliases: ["otamendi", "nicolas otamendi", "el general otamendi"], hint: "General" },
  { id: "montiel", name: "Gonzalo Montiel", aliases: ["montiel", "gonzalo montiel", "cachete montiel"], hint: "González Catán" },
  { id: "lautaro_martinez", name: "Lautaro Martínez", aliases: ["lautaro martinez", "el toro martinez", "lautaro"], hint: "Bahía Blanca" },
  { id: "paredes", name: "Leandro Paredes", aliases: ["paredes", "leandro paredes"], hint: "Pelotazo al banco" },
  { id: "tagliafico", name: "Nicolás Tagliafico", aliases: ["tagliafico", "nicolas tagliafico"], hint: "Twitch" },
  { id: "dybala", name: "Paulo Dybala", aliases: ["dybala", "paulo dybala", "la joya dybala"], hint: "Laguna Larga" },
  { id: "barco", name: "Valentín Barco", aliases: ["valentin barco", "colo barco", "el colo barco"], hint: "Arriba de la pelota" },
  { id: "echeverri", name: "Claudio Echeverri", aliases: ["claudio echeverri", "diablito echeverri", "el diablito"], hint: "Chaco" },
  { id: "mastantuono", name: "Franco Mastantuono", aliases: ["franco mastantuono", "mastantuono"], hint: "Azul" },
  { id: "cavani", name: "Edinson Cavani", aliases: ["edinson cavani", "cavani", "el matador cavani"], hint: "Alambrado" },

  // ==========================================
  // ENTRENADORES Y CULTO DEL FÚTBOL ARGENTINO
  // ==========================================
  { id: "scaloni", name: "Lionel Scaloni", aliases: ["scaloni", "lionel scaloni", "el gringo scaloni"], hint: "Pujato" },
  { id: "bilardo", name: "Carlos Bilardo", aliases: ["bilardo", "carlos bilardo", "el narigon bilardo", "doctor bilardo"], hint: "Bidón de Branco" },
  { id: "menotti", name: "César Luis Menotti", aliases: ["menotti", "cesar luis menotti", "el flaco menotti"], hint: "Cigarrillo" },
  { id: "bianchi", name: "Carlos Bianchi", aliases: ["bianchi", "carlos bianchi", "el virrey bianchi"], hint: "Celular de Dios" },
  { id: "mostaza_merlo", name: "Reinaldo Merlo", aliases: ["mostaza merlo", "reinaldo merlo", "mostaza"], hint: "Paso a paso" },
  { id: "caruso_lombardi", name: "Ricardo Caruso Lombardi", aliases: ["caruso lombardi", "ricardo caruso lombardi", "caruso"], hint: "Salvador del descenso" },
  { id: "garce", name: "Ariel Garcé", aliases: ["ariel garce", "el chino garce", "garce"], hint: "Alfajores" },

  // ==========================================
  // LEYENDAS INTERNACIONALES INDISCUTIDAS
  // ==========================================
  { id: "pele", name: "Pelé", aliases: ["pele", "edson arantes do nascimento", "o rei"], hint: "Tres mundiales" },
  { id: "ronaldinho", name: "Ronaldinho", aliases: ["ronaldinho", "dinho", "ronaldinho gaucho"], hint: "Ovación del Bernabéu" },
  { id: "zidane", name: "Zinedine Zidane", aliases: ["zidane", "zinedine zidane", "zizou"], hint: "Materazzi" },
  { id: "cruyff", name: "Johan Cruyff", aliases: ["cruyff", "johan cruyff", "el flaco cruyff"], hint: "Naranja Mecánica" },
  { id: "ronaldo_nazario", name: "Ronaldo Nazário", aliases: ["ronaldo", "r9", "ronaldo nazario", "el fenomeno"], hint: "Flequillo triangular" },
  { id: "cr7", name: "Cristiano Ronaldo", aliases: ["cristiano ronaldo", "ronaldo", "cr7", "el bicho"], hint: "Siuuu" },
  { id: "mbappe", name: "Kylian Mbappé", aliases: ["mbappe", "kylian mbappe"], hint: "Lusail 2022" },
  { id: "haaland", name: "Erling Haaland", aliases: ["haaland", "erling haaland"], hint: "Androide" },
  { id: "neymar", name: "Neymar Jr", aliases: ["neymar", "neymar jr", "ney"], hint: "Santos" },
  { id: "modric", name: "Luka Modrić", aliases: ["modric", "luka modric"], hint: "Balón de Oro 2018" },
  { id: "ibrahimovic", name: "Zlatan Ibrahimović", aliases: ["zlatan", "ibrahimovic", "zlatan ibrahimovic"], hint: "Taekwondo" },
  { id: "iniesta", name: "Andrés Iniesta", aliases: ["iniesta", "andres iniesta", "don andres"], hint: "Dani Jarque" },
  { id: "buffon", name: "Gianluigi Buffon", aliases: ["buffon", "gianluigi buffon", "gigi buffon"], hint: "Serie B" }
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
    name: p.name
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
