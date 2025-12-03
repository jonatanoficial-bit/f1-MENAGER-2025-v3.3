/* ============================================================
   DATA DO JOGO — F1 MANAGER 2025 AAA
   ============================================================ */

/* AVATARES DO GERENTE (placeholders) */
const AVATARES_GERENTE = [
  { id: 1, arquivo: "manager_ethnic_01.png", nome: "Avatar Europeu" },
  { id: 2, arquivo: "manager_ethnic_02.png", nome: "Avatar Afrodescendente" },
  { id: 3, arquivo: "manager_ethnic_03.png", nome: "Avatar Asiático" },
  { id: 4, arquivo: "manager_ethnic_04.png", nome: "Avatar Latino" },
  { id: 5, arquivo: "manager_ethnic_05.png", nome: "Avatar Árabe" },
  { id: 6, arquivo: "manager_ethnic_06.png", nome: "Avatar Indiano" }
];

/* BANDEIRAS PRINCIPAIS */
const BANDEIRAS = [
  "br","us","gb","fr","de","it","es","nl","mx","mc","ca","au","jp","cn",
  "sa","bh","qa","at","fi","dk","se"
].map(b => ({ codigo: b, arquivo: b + ".png" }));

/* ============================================================
   GERENTES REAIS 2025
   ============================================================ */

const GERENTES_REAIS = [
  { nome: "Christian Horner", equipe: "red_bull", pais: "gb", avatar: "horner.png" },
  { nome: "Frédéric Vasseur", equipe: "ferrari", pais: "fr", avatar: "vasseur.png" },
  { nome: "Toto Wolff", equipe: "mercedes", pais: "at", avatar: "wolff.png" },
  { nome: "Andrea Stella", equipe: "mclaren", pais: "it", avatar: "stella.png" },
  { nome: "Mike Krack", equipe: "aston_martin", pais: "lu", avatar: "krack.png" },
  { nome: "Bruno Famin", equipe: "alpine", pais: "fr", avatar: "famin.png" },
  { nome: "James Vowles", equipe: "williams", pais: "gb", avatar: "vowles.png" },
  { nome: "Laurent Mekies", equipe: "rb", pais: "fr", avatar: "mekies.png" },
  { nome: "Ayao Komatsu", equipe: "haas", pais: "jp", avatar: "komatsu.png" },
  { nome: "Alunni Bravi", equipe: "sauber", pais: "it", avatar: "alunni.png" }
];

/* ============================================================
   EQUIPES COMPLETAS 2025
   ============================================================ */

const ESCUDERIAS = [
  {
    key: "red_bull",
    nome: "Red Bull Racing",
    pais: "at",
    motor: "Honda RBPT",
    logo: "red_bull.png",
    rating: 96,
    carroBase: { aero: 9, motor: 9, chassis: 9, pit: 8 },
    // Pontuação mínima que o gerente precisa para receber convite desta equipe
    minManagerPoints: 500,
    // Situação financeira inicial da escuderia
    financas: 12000000
  },
  {
    key: "ferrari",
    nome: "Ferrari",
    pais: "it",
    motor: "Ferrari",
    logo: "ferrari.png",
    rating: 93,
    carroBase: { aero: 9, motor: 9, chassis: 8, pit: 7 },
    minManagerPoints: 450,
    financas: 11000000
  },
  {
    key: "mercedes",
    nome: "Mercedes",
    pais: "de",
    motor: "Mercedes",
    logo: "mercedes.png",
    rating: 92,
    carroBase: { aero: 8, motor: 9, chassis: 9, pit: 8 },
    minManagerPoints: 430,
    financas: 10500000
  },
  {
    key: "mclaren",
    nome: "McLaren",
    pais: "gb",
    motor: "Mercedes",
    logo: "mclaren.png",
    rating: 90,
    carroBase: { aero: 9, motor: 8, chassis: 8, pit: 7 },
    minManagerPoints: 400,
    financas: 9500000
  },
  {
    key: "aston_martin",
    nome: "Aston Martin",
    pais: "gb",
    motor: "Mercedes",
    logo: "aston_martin.png",
    rating: 87,
    carroBase: { aero: 8, motor: 8, chassis: 7, pit: 7 },
    minManagerPoints: 350,
    financas: 8500000
  },
  {
    key: "alpine",
    nome: "Alpine",
    pais: "fr",
    motor: "Renault",
    logo: "alpine.png",
    rating: 82,
    carroBase: { aero: 7, motor: 7, chassis: 7, pit: 6 },
    minManagerPoints: 300,
    financas: 7000000
  },
  {
    key: "williams",
    nome: "Williams",
    pais: "gb",
    motor: "Mercedes",
    logo: "williams.png",
    rating: 80,
    carroBase: { aero: 6, motor: 7, chassis: 7, pit: 6 },
    minManagerPoints: 250,
    financas: 6000000
  },
  {
    key: "rb",
    nome: "RB (Visa Cash App RB)",
    pais: "it",
    motor: "Honda RBPT",
    logo: "rb.png",
    rating: 79,
    carroBase: { aero: 7, motor: 7, chassis: 7, pit: 6 },
    minManagerPoints: 200,
    financas: 5500000
  },
  {
    key: "haas",
    nome: "Haas",
    pais: "us",
    motor: "Ferrari",
    logo: "haas.png",
    rating: 76,
    carroBase: { aero: 6, motor: 6, chassis: 6, pit: 5 },
    minManagerPoints: 150,
    financas: 5000000
  },
  {
    key: "sauber",
    nome: "Stake F1 Team Sauber",
    pais: "ch",
    motor: "Ferrari",
    logo: "sauber.png",
    rating: 75,
    carroBase: { aero: 6, motor: 6, chassis: 6, pit: 5 },
    minManagerPoints: 100,
    financas: 4500000
  }
];

/* ============================================================
   PILOTOS 2025 — GRID COMPLETO (20)
   ============================================================ */

const PILOTOS = [
  // Red Bull
  { nome: "Max Verstappen", equipe: "red_bull", pais: "nl", avatar: "verstappen.png", rating: 99, agressividade: 96, chuva: 98 },
  { nome: "Sergio Pérez", equipe: "red_bull", pais: "mx", avatar: "perez.png", rating: 91, agressividade: 88, chuva: 87 },

  // Ferrari
  { nome: "Charles Leclerc", equipe: "ferrari", pais: "mc", avatar: "leclerc.png", rating: 95, agressividade: 90, chuva: 92 },
  { nome: "Carlos Sainz Jr.", equipe: "ferrari", pais: "es", avatar: "sainz.png", rating: 93, agressividade: 89, chuva: 88 },

  // Mercedes
  { nome: "George Russell", equipe: "mercedes", pais: "gb", avatar: "russell.png", rating: 93, agressividade: 88, chuva: 90 },
  { nome: "Lewis Hamilton", equipe: "mercedes", pais: "gb", avatar: "hamilton.png", rating: 96, agressividade: 89, chuva: 96 },

  // McLaren
  { nome: "Lando Norris", equipe: "mclaren", pais: "gb", avatar: "norris.png", rating: 95, agressividade: 90, chuva: 91 },
  { nome: "Oscar Piastri", equipe: "mclaren", pais: "au", avatar: "piastri.png", rating: 92, agressividade: 87, chuva: 89 },

  // Aston Martin
  { nome: "Fernando Alonso", equipe: "aston_martin", pais: "es", avatar: "alonso.png", rating: 92, agressividade: 94, chuva: 90 },
  { nome: "Lance Stroll", equipe: "aston_martin", pais: "ca", avatar: "stroll.png", rating: 80, agressividade: 74, chuva: 70 },

  // Alpine
  { nome: "Pierre Gasly", equipe: "alpine", pais: "fr", avatar: "gasly.png", rating: 87, agressividade: 83, chuva: 86 },
  { nome: "Esteban Ocon", equipe: "alpine", pais: "fr", avatar: "ocon.png", rating: 87, agressividade: 82, chuva: 84 },

  // Williams
  { nome: "Alex Albon", equipe: "williams", pais: "th", avatar: "albon.png", rating: 85, agressividade: 82, chuva: 82 },
  { nome: "Logan Sargeant", equipe: "williams", pais: "us", avatar: "sargeant.png", rating: 74, agressividade: 70, chuva: 68 },

  // RB
  { nome: "Daniel Ricciardo", equipe: "rb", pais: "au", avatar: "ricciardo.png", rating: 84, agressividade: 78, chuva: 80 },
  { nome: "Yuki Tsunoda", equipe: "rb", pais: "jp", avatar: "tsunoda.png", rating: 83, agressividade: 86, chuva: 78 },

  // Haas
  { nome: "Nico Hülkenberg", equipe: "haas", pais: "de", avatar: "hulkenberg.png", rating: 82, agressividade: 79, chuva: 78 },
  { nome: "Kevin Magnussen", equipe: "haas", pais: "dk", avatar: "magnussen.png", rating: 81, agressividade: 82, chuva: 76 },

  // Sauber
  // Substituição de Bottas por Bortotoleto. O nome e o avatar foram atualizados
  { nome: "Bortotoleto", equipe: "sauber", pais: "fi", avatar: "bortoleto.png", rating: 84, agressividade: 78, chuva: 82 },
  { nome: "Guanyu Zhou", equipe: "sauber", pais: "cn", avatar: "zhou.png", rating: 79, agressividade: 72, chuva: 70 }
];

/* ============================================================
   FUNCIONÁRIOS
   ============================================================ */

const FUNCIONARIOS = [
  { nome: "Engenheiro de Pista N1", tipo: "engenheiro", bonus: 3, preco: 150000 },
  { nome: "Engenheiro de Pista N2", tipo: "engenheiro", bonus: 6, preco: 300000 },
  { nome: "Diretor Técnico N1", tipo: "tecnico", bonus: 4, preco: 180000 },
  { nome: "Diretor Técnico N2", tipo: "tecnico", bonus: 7, preco: 350000 },
  { nome: "Chefe de Box N1", tipo: "pit", bonus: 4, preco: 200000 },
  { nome: "Chefe de Box N2", tipo: "pit", bonus: 7, preco: 350000 },
  { nome: "Marketing Pro", tipo: "marketing", bonus: 5, preco: 250000 }
];

/* ============================================================
   PATROCINADORES
   ============================================================ */

const PATROCINADORES = [
  { nome: "Petronas", valor: 2500000, arquivo: "petronas.png" },
  { nome: "Shell", valor: 2300000, arquivo: "shell.png" },
  { nome: "Red Bull", valor: 2800000, arquivo: "redbull_sponsor.png" },
  { nome: "Santander", valor: 2100000, arquivo: "santander.png" }
];

/* ============================================================
   CALENDÁRIO 2025 (24 GPs, COM CHAVE DE FUNDO)
   ============================================================ */

const CALENDARIO = [
  { etapa: 1,  nome: "GP do Bahrein",         circuito: "Sakhir",              voltas: 57, pais: "bh", trackKey: "bahrain" },
  { etapa: 2,  nome: "GP da Arábia Saudita",  circuito: "Jeddah",              voltas: 50, pais: "sa", trackKey: "jeddah" },
  { etapa: 3,  nome: "GP da Austrália",       circuito: "Albert Park",         voltas: 58, pais: "au", trackKey: "australia" },
  { etapa: 4,  nome: "GP do Japão",           circuito: "Suzuka",              voltas: 53, pais: "jp", trackKey: "japan" },
  { etapa: 5,  nome: "GP da China",           circuito: "Xangai",              voltas: 56, pais: "cn", trackKey: "china" },
  { etapa: 6,  nome: "GP de Miami",           circuito: "Miami",               voltas: 57, pais: "us", trackKey: "miami" },
  { etapa: 7,  nome: "GP da Emília-Romanha",  circuito: "Imola",               voltas: 63, pais: "it", trackKey: "imola" },
  { etapa: 8,  nome: "GP de Mônaco",          circuito: "Monte Carlo",         voltas: 78, pais: "mc", trackKey: "monaco" },
  { etapa: 9,  nome: "GP do Canadá",          circuito: "Montreal",            voltas: 70, pais: "ca", trackKey: "canada" },
  { etapa: 10, nome: "GP da Espanha",         circuito: "Barcelona",           voltas: 66, pais: "es", trackKey: "spain" },
  { etapa: 11, nome: "GP da Áustria",         circuito: "Red Bull Ring",       voltas: 71, pais: "at", trackKey: "austria" },
  { etapa: 12, nome: "GP da Inglaterra",      circuito: "Silverstone",         voltas: 52, pais: "gb", trackKey: "silverstone" },
  { etapa: 13, nome: "GP da Hungria",         circuito: "Hungaroring",         voltas: 70, pais: "hu", trackKey: "hungary" },
  { etapa: 14, nome: "GP da Bélgica",         circuito: "Spa-Francorchamps",   voltas: 44, pais: "be", trackKey: "spa" },
  { etapa: 15, nome: "GP dos Países Baixos",  circuito: "Zandvoort",           voltas: 72, pais: "nl", trackKey: "zandvoort" },
  { etapa: 16, nome: "GP da Itália",          circuito: "Monza",               voltas: 53, pais: "it", trackKey: "monza" },
  { etapa: 17, nome: "GP do Azerbaijão",      circuito: "Baku",                voltas: 51, pais: "az", trackKey: "baku" },
  { etapa: 18, nome: "GP de Singapura",       circuito: "Marina Bay",          voltas: 61, pais: "sg", trackKey: "singapore" },
  { etapa: 19, nome: "GP dos EUA - Austin",   circuito: "COTA",                voltas: 56, pais: "us", trackKey: "cota" },
  { etapa: 20, nome: "GP do México",          circuito: "Hermanos Rodríguez",  voltas: 71, pais: "mx", trackKey: "mexico" },
  { etapa: 21, nome: "GP de São Paulo",       circuito: "Interlagos",          voltas: 71, pais: "br", trackKey: "interlagos" },
  { etapa: 22, nome: "GP de Las Vegas",       circuito: "Las Vegas Strip",     voltas: 50, pais: "us", trackKey: "lasvegas" },
  { etapa: 23, nome: "GP do Catar",           circuito: "Lusail",              voltas: 57, pais: "qa", trackKey: "qatar" },
  { etapa: 24, nome: "GP de Abu Dhabi",       circuito: "Yas Marina",          voltas: 58, pais: "ae", trackKey: "abudhabi" }
];

/* ============================================================
   PONTUAÇÃO OFICIAL F1
   ============================================================ */

const PONTOS = [25,18,15,12,10,8,6,4,2,1];
