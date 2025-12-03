/* ============================================================
   SCRIPT PRINCIPAL — F1 MANAGER 2025 AAA
   ============================================================ */

/* ===============================
   ESTADO GLOBAL DO JOGO
   =============================== */
let JOGO = {
  gerente: null,
  equipeSelecionada: null,
  dinheiro: 5000000,
  funcionarios: [],
  patrocinador: null,
  pilotosEquipe: [],
  etapaAtual: 1,
  classificacao: [],
  resultadoCorrida: [],
  carro: { aero: 0, motor: 0, chassis: 0, pit: 0 },
  // Pontuação acumulada do gerente ao longo da temporada
  pontuacaoGerente: 0
};

/* tabelas de pontuação */
let TABELA_PILOTOS = {};
let TABELA_CONSTRUTORES = {};

PILOTOS.forEach(p => TABELA_PILOTOS[p.nome] = 0);
ESCUDERIAS.forEach(e => TABELA_CONSTRUTORES[e.key] = 0);

/* estado da corrida */
let ESTADO_CORRIDA = null;

/* ===============================
   FUNÇÕES ÚTEIS
   =============================== */
function mostrarTela(id) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
}

function nomeEquipe(code) {
  const e = ESCUDERIAS.find(x => x.key === code);
  return e ? e.nome : "Equipe";
}

/* ===============================
   NAVEGAÇÃO PRINCIPAL
   =============================== */

function abrirMenuPrincipal() { mostrarTela("menu-principal"); }
function voltarParaCapa() { mostrarTela("tela-capa"); }
function voltarMenuPrincipal() { mostrarTela("menu-principal"); }

function abrirCreditos() { mostrarTela("creditos"); }

function voltarLobby() {
  mostrarTela("lobby");
  iniciarLobby();
}

function voltarTelaGP() {
  mostrarTela("tela-gp");
}

function cancelarCorridaEVolarGP() {
  // Para a corrida 2D se estiver em andamento
  if (typeof stopRace2D === 'function') {
    stopRace2D();
  }
  // Se ainda existir a lógica antiga de corrida por voltas, limpamos também
  if (ESTADO_CORRIDA && ESTADO_CORRIDA.timer) {
    clearInterval(ESTADO_CORRIDA.timer);
  }
  mostrarTela("tela-gp");
}

/* ===============================
   CRIAÇÃO DO GERENTE
   =============================== */

function abrirCriarGerente() {
  mostrarTela("criar-gerente");
  carregarAvataresGerente();
  carregarBandeiras();
}

function carregarAvataresGerente() {
  const div = document.getElementById("lista-avatares");
  div.innerHTML = "";

  AVATARES_GERENTE.forEach(a => {
    const card = document.createElement("div");
    card.classList.add("avatar-card");

    // Define a imagem de fundo do avatar com base no arquivo enviado pelo jogador
    card.style.backgroundImage = `url('assets/managers/${a.arquivo}')`;
    card.style.backgroundSize = 'cover';
    card.style.backgroundPosition = 'center';

    // adicione título para melhorar a acessibilidade
    card.title = a.nome;

    card.onclick = () => {
      document.querySelectorAll(".avatar-card").forEach(c => c.classList.remove("selecionado"));
      card.classList.add("selecionado");
      JOGO.gerente = JOGO.gerente || {};
      JOGO.gerente.avatar = a.arquivo;
    };

    div.appendChild(card);
  });
}

function carregarBandeiras() {
  const div = document.getElementById("lista-bandeiras");
  div.innerHTML = "";

  BANDEIRAS.forEach(b => {
    const card = document.createElement("div");
    card.classList.add("bandeira-card");

    // Usa a imagem da bandeira como fundo do card
    card.style.backgroundImage = `url('assets/flags/${b.arquivo}')`;
    card.style.backgroundSize = 'cover';
    card.style.backgroundPosition = 'center';

    // título exibindo o código do país em letras maiúsculas
    card.title = b.codigo.toUpperCase();

    card.onclick = () => {
      document.querySelectorAll(".bandeira-card").forEach(c => c.classList.remove("selecionado"));
      card.classList.add("selecionado");
      JOGO.gerente = JOGO.gerente || {};
      JOGO.gerente.pais = b.codigo;
    };

    div.appendChild(card);
  });
}

function confirmarGerenteCriado() {
  const nome = document.getElementById("input-nome-gerente").value;
  if (!nome || !JOGO.gerente?.avatar || !JOGO.gerente?.pais) {
    alert("Preencha nome, avatar e bandeira.");
    return;
  }
  JOGO.gerente.nome = nome;
  abrirEscolhaEquipe();
}

/* ===============================
   GERENTES REAIS
   =============================== */

function abrirGerentesReais() {
  mostrarTela("gerentes-reais");
  const div = document.getElementById("lista-gerentes-reais");
  div.innerHTML = "";

  GERENTES_REAIS.forEach(g => {
    const card = document.createElement("div");
    card.classList.add("card");
    // adiciona um avatar realista para o gerente real
    card.innerHTML = `
      <div class="gerente-real-avatar">
        <img src="assets/managers_real/${g.avatar}" alt="${g.nome}">
      </div>
      <h3>${g.nome}</h3>
      <p>Equipe: ${nomeEquipe(g.equipe)}</p>
      <p>País: ${g.pais.toUpperCase()}</p>
    `;

    card.onclick = () => {
      // copia atributos do gerente real para o estado
      JOGO.gerente = { nome: g.nome, avatar: g.avatar, pais: g.pais };
      abrirEscolhaEquipe();
    };

    div.appendChild(card);
  });
}

/* ===============================
   ESCOLHA DE ESCUDERIA
   =============================== */

function abrirEscolhaEquipe() {
  mostrarTela("escolher-escuderia");
  const div = document.getElementById("lista-escuderias");
  div.innerHTML = "";

  ESCUDERIAS.forEach(e => {
    const card = document.createElement("div");
    card.classList.add("escuderia-card");
    card.innerHTML = `
      <div class="esc-logo">
        <img src="assets/logos/${e.logo}" alt="${e.nome}">
      </div>
      <h3>${e.nome}</h3>
      <p>Motor: ${e.motor}</p>
    `;
    card.onclick = () => selecionarEquipe(e.key);
    div.appendChild(card);
  });
}

function selecionarEquipe(key) {
  JOGO.equipeSelecionada = key;
  JOGO.pilotosEquipe = PILOTOS.filter(p => p.equipe === key);

  const equipe = ESCUDERIAS.find(e => e.key === key);
  if (equipe) {
    JOGO.carro = { ...equipe.carroBase };
  }

  iniciarLobby();
}

/* ===============================
   LOBBY
   =============================== */

function iniciarLobby() {
  mostrarTela("lobby");
  if (!JOGO.gerente || !JOGO.equipeSelecionada) return;

  document.getElementById("nome-gerente").innerText = JOGO.gerente.nome;
  document.getElementById("pais-gerente").innerText = (JOGO.gerente.pais || "").toUpperCase();

  const equipe = ESCUDERIAS.find(e => e.key === JOGO.equipeSelecionada);
  if (equipe) {
    document.getElementById("nome-equipe").innerText = equipe.nome;
    document.getElementById("motor-equipe").innerText = "Motor: " + equipe.motor;
  }

  document.getElementById("dinheiro-atual").innerText =
    "R$ " + JOGO.dinheiro.toLocaleString("pt-BR");

  // Atualiza pontuação do gerente caso o elemento exista
  const pontEl = document.getElementById("pontuacao-gerente");
  if (pontEl) {
    pontEl.innerText = `Pontuação do Gerente: ${JOGO.pontuacaoGerente} pts`;
  }

  // Atualiza imagem do avatar do gerente
  const avatarImgEl = document.getElementById("avatar-gerente-img");
  if (avatarImgEl) {
    const avatarArquivo = JOGO.gerente?.avatar;
    avatarImgEl.src = avatarArquivo ? `assets/managers/${avatarArquivo}` : "";
  }

  // Atualiza logo da equipe no lobby
  const logoImgEl = document.getElementById("logo-equipe");
  const equipeLogo = ESCUDERIAS.find(e => e.key === JOGO.equipeSelecionada);
  if (logoImgEl && equipeLogo) {
    logoImgEl.src = `assets/logos/${equipeLogo.logo}`;
    logoImgEl.alt = equipeLogo.nome;
  }

  // Atualiza lista de pilotos da equipe no lobby
  renderPilotosLobby();
}

/**
 * Renderiza no lobby a lista dos pilotos atuais da equipe do jogador. Cada
 * piloto é mostrado com seu avatar e nome em um pequeno card. Se não houver
 * pilotos (por exemplo, antes de contratar alguém), a lista permanece vazia.
 */
function renderPilotosLobby() {
  const container = document.getElementById("pilotos-lobby");
  if (!container) return;
  container.innerHTML = "";
  if (!JOGO.pilotosEquipe || JOGO.pilotosEquipe.length === 0) {
    return;
  }
  JOGO.pilotosEquipe.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("piloto-lobby-card");
    card.innerHTML = `
      <img src="assets/faces/${p.avatar}" alt="${p.nome}" class="mini-avatar-img">
      <span>${p.nome}</span>
    `;
    container.appendChild(card);
  });
}

/* ===============================
   CALENDÁRIO
   =============================== */

function abrirCalendario() {
  mostrarTela("calendario");

  const div = document.getElementById("lista-corridas");
  div.innerHTML = "";

  CALENDARIO.forEach(c => {
    const card = document.createElement("div");
    card.classList.add("card");

    const atual = c.etapa === JOGO.etapaAtual;

    card.innerHTML = `
      <h3>${c.nome}</h3>
      <p>${c.circuito}</p>
      <p>${c.voltas} voltas</p>
      <p>Etapa ${c.etapa} ${atual ? "(Próxima)" : ""}</p>
    `;

    card.onclick = () => {
      JOGO.etapaAtual = c.etapa;
      abrirProximaCorrida();
    };

    div.appendChild(card);
  });
}

/* ===============================
   PATROCÍNIO
   =============================== */

function abrirPatrocinio() {
  mostrarTela("patrocinadores");

  const div = document.getElementById("lista-patrocinios");
  div.innerHTML = "";

  PATROCINADORES.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${p.nome}</h3>
      <p>Pagamento por etapa: R$ ${p.valor.toLocaleString("pt-BR")}</p>
    `;

    card.onclick = () => {
      JOGO.patrocinador = p;
      JOGO.dinheiro += p.valor;
      alert("Patrocinador contratado: " + p.nome);
      iniciarLobby();
    };

    div.appendChild(card);
  });
}

/* ===============================
   FUNCIONÁRIOS
   =============================== */

function abrirFuncionarios() {
  mostrarTela("funcionarios");

  const div = document.getElementById("lista-funcionarios");
  div.innerHTML = "";

  FUNCIONARIOS.forEach(f => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${f.nome}</h3>
      <p>Área: ${f.tipo}</p>
      <p>Bônus: +${f.bonus}</p>
      <p>Preço: R$ ${f.preco.toLocaleString("pt-BR")}</p>
      <button onclick="contratarFuncionario('${f.nome}')">Contratar</button>
    `;

    div.appendChild(card);
  });
}

function contratarFuncionario(nome) {
  const f = FUNCIONARIOS.find(x => x.nome === nome);
  if (!f) return;

  if (JOGO.dinheiro < f.preco) {
    alert("Dinheiro insuficiente.");
    return;
  }

  JOGO.dinheiro -= f.preco;
  JOGO.funcionarios.push(f);

  alert("Funcionário contratado: " + f.nome);
  iniciarLobby();
}

/* ===============================
   MERCADO DE PILOTOS
   =============================== */

function abrirMercadoPilotos() {
  mostrarTela("mercado-pilotos");

  const div = document.getElementById("lista-pilotos-mercado");
  div.innerHTML = "";

  // Seção de pilotos já contratados pela equipe do jogador
  const contratadosDiv = document.createElement("div");
  contratadosDiv.classList.add("mercado-secao");
  const header = document.createElement("h3");
  header.innerText = "Seus Pilotos";
  contratadosDiv.appendChild(header);
  if (JOGO.pilotosEquipe && JOGO.pilotosEquipe.length > 0) {
    JOGO.pilotosEquipe.forEach(pil => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <h4>${pil.nome}</h4>
        <p>Rating: ${pil.rating}</p>
        <button onclick="demitirPiloto('${pil.nome}')">Demitir</button>
      `;
      contratadosDiv.appendChild(card);
    });
  } else {
    const emptyP = document.createElement("p");
    emptyP.innerText = "Nenhum piloto contratado.";
    contratadosDiv.appendChild(emptyP);
  }
  div.appendChild(contratadosDiv);

  // Seção do mercado de pilotos
  const mercadoHeader = document.createElement("h3");
  mercadoHeader.innerText = "Mercado de Pilotos";
  div.appendChild(mercadoHeader);

  PILOTOS.forEach(p => {
    const custo = p.rating * 30000;
    const card = document.createElement("div");
    card.classList.add("card");
    const jaContratado = JOGO.pilotosEquipe && JOGO.pilotosEquipe.some(pp => pp.nome === p.nome);
    card.innerHTML = `
      <h3>${p.nome}</h3>
      <p>Equipe atual: ${nomeEquipe(p.equipe)}</p>
      <p>Rating: ${p.rating}</p>
      <p>Valor de contrato: R$ ${custo.toLocaleString("pt-BR")}</p>
      <button ${jaContratado ? 'disabled' : ''} onclick="contratarPiloto('${p.nome}')">${jaContratado ? 'Contratado' : 'Contratar'}</button>
    `;
    div.appendChild(card);
  });
}

function contratarPiloto(nome) {
  const piloto = PILOTOS.find(p => p.nome === nome);
  if (!piloto) return;

  if (JOGO.pilotosEquipe.length >= 2) {
    alert("Sua equipe já tem 2 pilotos. Remova alguém antes de contratar outro.");
    return;
  }

  const custo = piloto.rating * 30000;

  if (JOGO.dinheiro < custo) {
    alert("Dinheiro insuficiente.");
    return;
  }

  JOGO.dinheiro -= custo;
  piloto.equipe = JOGO.equipeSelecionada;
  JOGO.pilotosEquipe.push(piloto);

  alert("Piloto contratado: " + piloto.nome);
  iniciarLobby();
}

/**
 * Remove um piloto da equipe do jogador. O piloto se torna agente
 * livre e pode ser contratado por qualquer equipe na próxima janela.
 * Após demitir um piloto, a interface do mercado e do lobby é
 * atualizada imediatamente.
 */
function demitirPiloto(nome) {
  const idx = JOGO.pilotosEquipe ? JOGO.pilotosEquipe.findIndex(p => p.nome === nome) : -1;
  if (idx < 0) return;
  // Remove da equipe atual
  const piloto = JOGO.pilotosEquipe[idx];
  JOGO.pilotosEquipe.splice(idx, 1);
  // Atualiza a referência de equipe do piloto globalmente
  const pilotoGlobal = PILOTOS.find(p => p.nome === nome);
  if (pilotoGlobal) {
    pilotoGlobal.equipe = null;
  }
  alert(`Piloto ${nome} foi demitido.`);
  // Atualiza as telas relevantes
  abrirMercadoPilotos();
  renderPilotosLobby();
}

/* ===============================
   OFICINA / MELHORIAS DO CARRO
   =============================== */

function abrirOficina() {
  mostrarTela("oficina");
  renderOficina();
}

function renderOficina() {
  const status = document.getElementById("oficina-status");
  const upgrades = document.getElementById("oficina-upgrades");

  status.innerHTML = `
    <p>Aero: ${JOGO.carro.aero}</p>
    <p>Motor: ${JOGO.carro.motor}</p>
    <p>Chassis: ${JOGO.carro.chassis}</p>
    <p>Pit Stop: ${JOGO.carro.pit}</p>
  `;

  upgrades.innerHTML = "";

  [{tipo:"aero",nome:"Aerodinâmica",custo:400000,bonus:1},
   {tipo:"motor",nome:"Motor",custo:500000,bonus:1},
   {tipo:"chassis",nome:"Chassis",custo:350000,bonus:1},
   {tipo:"pit",nome:"Pit Stop",custo:300000,bonus:1}
  ].forEach(u => {

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${u.nome}</h3>
      <p>Melhora +${u.bonus}</p>
      <p>Custo: R$ ${u.custo.toLocaleString("pt-BR")}</p>
      <button onclick="aplicarUpgrade('${u.tipo}', ${u.custo}, ${u.bonus})">Aplicar</button>
    `;

    upgrades.appendChild(card);
  });
}

function aplicarUpgrade(tipo, custo, bonus) {
  if (JOGO.dinheiro < custo) {
    alert("Dinheiro insuficiente.");
    return;
  }

  JOGO.dinheiro -= custo;
  JOGO.carro[tipo] += bonus;

  alert("Upgrade aplicado!");
  renderOficina();
}

/* ===============================
   PRÓXIMO GP
   =============================== */

function abrirProximaCorrida() {
  const etapa = CALENDARIO[JOGO.etapaAtual - 1];
  if (!etapa) {
    alert("Temporada encerrada!");
    return;
  }

  // Define fundo da pista para tela-gp, treino, quali e corrida
  setFundoPista(etapa.trackKey || "bahrain");

  mostrarTela("tela-gp");

  document.getElementById("gp-nome").innerText = etapa.nome;
  document.getElementById("gp-circuito").innerText = etapa.circuito;
  document.getElementById("gp-voltas").innerText = etapa.voltas + " voltas";
}

function setFundoPista(trackKey) {
  const caminho = `assets/tracks/${trackKey}.png`;
  ["tela-gp", "treino-livre", "classificacao", "corrida"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.backgroundImage = `url('${caminho}')`;
    }
  });
}

/* ============================================================
   TREINO LIVRE
   ============================================================ */

function abrirTreinoLivre() {
  mostrarTela("treino-livre");

  const texto =
`Iniciando sessão de Treino Livre...

Os carros entram na pista para ajustar:
• Pressão dos pneus
• Aerodinâmica e acerto de asas
• Consumo de combustível
• Modos de potência e recuperação de bateria

Sua equipe coleta dados de telemetria para melhorar o carro.

Quando terminar, avance para a Classificação.`;

  efeitoMaquina("texto-treino", texto, 18);
}

/* efeito de máquina de escrever */
function efeitoMaquina(id, texto, velocidade) {
  const div = document.getElementById(id);
  div.innerHTML = "";
  let i = 0;

  (function escrever() {
    if (i < texto.length) {
      div.innerHTML += texto.charAt(i);
      i++;
      setTimeout(escrever, velocidade);
    }
  })();
}

function finalizarTreino() {
  abrirQualificacao();
}

/* ============================================================
   CLASSIFICAÇÃO (GRID)
   ============================================================ */

function abrirQualificacao() {
  mostrarTela("classificacao");
  gerarClassificacao();
}

function gerarClassificacao() {
  const pilotos = [...PILOTOS];

  pilotos.forEach(p => {
    // tempo base (quanto melhor o rating, menor o tempo)
    let base = 200 - p.rating;

    // penalidade ou bônus leve pelo carro da equipe
    const equipe = ESCUDERIAS.find(e => e.key === p.equipe);
    const carroEquipe = equipe ? equipe.carroBase : { aero: 7, motor: 7, chassis: 7, pit: 7 };
    let equipeBonus = (10 - (carroEquipe.aero + carroEquipe.motor + carroEquipe.chassis) / 3);

    // bônus do carro customizado do jogador (somente para a equipe do jogador)
    let carroBonus = 0;
    if (p.equipe === JOGO.equipeSelecionada) {
      carroBonus =
        (JOGO.carro.aero + JOGO.carro.motor + JOGO.carro.chassis + JOGO.carro.pit) * -0.7;
    }

    // aleatoriedade
    const aleatorio = Math.random() * 8;

    p.tempoClassificacao = base + equipeBonus + aleatorio + carroBonus;
  });

  pilotos.sort((a, b) => a.tempoClassificacao - b.tempoClassificacao);
  JOGO.classificacao = pilotos;

  const div = document.getElementById("resultado-classificacao");
  div.innerHTML = "";

  pilotos.forEach((p, i) => {
    const linha = document.createElement("p");
    linha.innerText = `${i + 1}º - ${p.nome} (${nomeEquipe(p.equipe)})`;
    div.appendChild(linha);
  });
}

function finalizarClassificacao() {
  abrirCorrida();
}

/* ============================================================
   CORRIDA — SIMULAÇÃO POR VOLTAS + NARRAÇÃO
   ============================================================ */

function prepararCorrida() {
  document.getElementById("corrida-voltas").innerText = "";
  document.getElementById("resultado-corrida").innerHTML = "";
  document.getElementById("btn-corrida-continuar").disabled = true;
}

function abrirCorrida() {
  // Inicia a nova simulação 2D com mapa e pit-stop
  const etapa = CALENDARIO[JOGO.etapaAtual - 1] || { voltas: 20, nome: "GP", trackKey: "monaco" };
  const voltasTotais = Math.min(etapa.voltas, 20);
  // monta lista de pilotos para a corrida. o primeiro da lista será o carro do jogador
  let gridPilotos;
  if (JOGO.classificacao && JOGO.classificacao.length) {
    gridPilotos = [...JOGO.classificacao];
  } else {
    gridPilotos = [...PILOTOS];
  }
  // Ordena por rating decrescente para uma largada coerente
  gridPilotos.sort((a, b) => b.rating - a.rating);
  // Mostra a seção de corrida
  mostrarTela("corrida");
  // Atualiza cabeçalho com nome completo do GP
  const headerEl = document.getElementById("corrida-gp-nome");
  if (headerEl) {
    headerEl.textContent = "Corrida - " + etapa.nome;
  }
  // Inicia a corrida 2D com o trackKey da etapa
  startRace2D(etapa.trackKey || etapa.nome.toLowerCase().replace(/\s+/g, '_'), gridPilotos, voltasTotais);
}

function iniciarSimulacaoPorVoltas() {
  const grid = [...JOGO.classificacao];
  if (!grid || grid.length === 0) {
    gerarClassificacao();
  }

  const etapa = CALENDARIO[JOGO.etapaAtual - 1] || { voltas: 50, nome: "GP" };

  // Determina o número de voltas a serem simuladas (limitado para evitar corridas longas demais)
  const voltasTotais = Math.min(etapa.voltas, 20);

  // Calcula as paradas planejadas para cada piloto com base na duração da corrida
  function gerarPitStops(totalVoltas) {
    const stops = [];
    // usa 1 parada para corridas curtas (< 15 voltas) e 2 para as mais longas
    const numeroParadas = totalVoltas > 15 ? 2 : 1;
    for (let i = 1; i <= numeroParadas; i++) {
      // divide a corrida em segmentos iguais e adiciona um pequeno desvio aleatório
      const baseLap = Math.floor((totalVoltas / (numeroParadas + 1)) * i);
      const desvio = Math.floor(Math.random() * 3); // 0 a 2 voltas de desvio
      let lap = baseLap + desvio;
      if (lap < 2) lap = 2;
      if (lap > totalVoltas - 1) lap = totalVoltas - 1;
      stops.push(lap);
    }
    return stops;
  }

  ESTADO_CORRIDA = {
    pilotos: (grid.length ? grid : [...PILOTOS]).map((p, idx) => ({
      ...p,
      score: 0,
      posicao: idx + 1,
      ativo: true,
      pitStops: gerarPitStops(voltasTotais),
      fezPitStop: []
    })),
    voltaAtual: 0,
    voltasTotais,
    chuva: Math.random() < 0.25,
    bonusEquipe: calcularBonusFuncionariosECarro(),
    weatherChangeProb: 0.05,
    accidentChance: 0.008,
    pitPenalty: 40,
    timer: null
  };

  ESTADO_CORRIDA.timer = setInterval(tickVolta, 350);
}

/* bônus total do carro + funcionários para equipe do jogador */
function calcularBonusFuncionariosECarro() {
  let total = 0;

  JOGO.funcionarios.forEach(f => {
    if (f.tipo === "engenheiro" || f.tipo === "tecnico" || f.tipo === "pit") {
      total += f.bonus;
    }
  });

  total += (JOGO.carro.aero + JOGO.carro.motor + JOGO.carro.chassis + JOGO.carro.pit);
  return total;
}

/* chamado a cada "volta" */
function tickVolta() {
  if (!ESTADO_CORRIDA) return;

  const e = ESTADO_CORRIDA;
  e.voltaAtual++;

  const mensagens = [];

  // Possível mudança de clima durante a corrida
  if (Math.random() < e.weatherChangeProb) {
    e.chuva = !e.chuva;
    mensagens.push(e.chuva ? "☔ A chuva começou!" : "☀️ A pista secou!");
  }

  e.pilotos.forEach(p => {
    // se o piloto já abandonou não atualiza seu score
    if (!p.ativo) return;

    // Verifica se o piloto sofrerá um acidente nesta volta
    if (Math.random() < e.accidentChance) {
      p.ativo = false;
      p.score -= 10000; // grande penalidade para jogá-lo ao final da classificação
      mensagens.push(`💥 ${p.nome} abandonou a corrida após um acidente!`);
      return;
    }

    // Verifica se é hora do pit stop
    if (p.pitStops.includes(e.voltaAtual) && !p.fezPitStop.includes(e.voltaAtual)) {
      p.fezPitStop.push(e.voltaAtual);
      p.score -= e.pitPenalty;
      mensagens.push(`🔧 ${p.nome} faz uma parada nos boxes.`);
    }

    // cálculo de desempenho baseado em rating e atributos
    const base = p.rating * 1.1;
    const agress = p.agressividade * (0.7 + Math.random() * 0.5);
    const bonusChuva = e.chuva ? p.chuva * 1.15 : p.chuva * 0.5;
    const equipeRating = ESCUDERIAS.find(x => x.key === p.equipe)?.rating || 75;
    const rand = Math.random() * 10;

    let bonusTeam = 0;
    if (p.equipe === JOGO.equipeSelecionada) {
      bonusTeam = e.bonusEquipe * 1.25;
    }

    p.score += base + agress + bonusChuva + equipeRating + rand + bonusTeam;
  });

  // Ordena pilotos pelo score decrescente
  e.pilotos.sort((a, b) => b.score - a.score);

  const lider = e.pilotos[0];
  mensagens.push(`Volta ${e.voltaAtual}/${e.voltasTotais}: ${lider.nome} lidera com ${nomeEquipe(lider.equipe)}.`);

  // Mensagens específicas para os pilotos da equipe do jogador nas 10 primeiras posições
  e.pilotos.forEach((p, idx) => {
    if (p.equipe === JOGO.equipeSelecionada && idx < 10) {
      mensagens.push(`• ${p.nome} está em ${idx + 1}º lugar.`);
    }
  });

  atualizarPainelCorrida(mensagens);

  // encerra a corrida se chegou ao final das voltas ou apenas um piloto ativo permanecer
  if (e.voltaAtual >= e.voltasTotais) {
    encerrarSimulacaoCorrida();
  }
}

function atualizarPainelCorrida(mensagens) {
  const e = ESTADO_CORRIDA;
  if (!e) return;

  document.getElementById("corrida-voltas").innerText =
    `Volta ${e.voltaAtual} / ${e.voltasTotais}`;

  const div = document.getElementById("resultado-corrida");

  mensagens.forEach(txt => {
    const p = document.createElement("p");
    p.innerText = txt;
    div.appendChild(p);
  });

  while (div.childNodes.length > 30) {
    div.removeChild(div.firstChild);
  }
}

function encerrarSimulacaoCorrida() {
  if (!ESTADO_CORRIDA) return;

  clearInterval(ESTADO_CORRIDA.timer);

  ESTADO_CORRIDA.pilotos.sort((a, b) => b.score - a.score);

  JOGO.resultadoCorrida = ESTADO_CORRIDA.pilotos.map(p => ({
    piloto: p,
    performance: p.score
  }));

  aplicarPontuacao(JOGO.resultadoCorrida);

  document.getElementById("btn-corrida-continuar").disabled = false;
}

/* ============================================================
   PARTE 3 — PÓDIO, TABELAS, PONTUAÇÃO, SAVE/LOAD
   ============================================================ */

/* PONTUAÇÃO DO MUNDIAL */
function aplicarPontuacao(resultado) {
  resultado.forEach((r, i) => {
    const piloto = r.piloto;
    const equipeKey = piloto.equipe;
    const pontos = PONTOS[i] || 0;

    if (pontos > 0) {
      if (TABELA_PILOTOS[piloto.nome] == null) TABELA_PILOTOS[piloto.nome] = 0;
      if (TABELA_CONSTRUTORES[equipeKey] == null) TABELA_CONSTRUTORES[equipeKey] = 0;

      TABELA_PILOTOS[piloto.nome] += pontos;
      TABELA_CONSTRUTORES[equipeKey] += pontos;

      // Se o piloto pertence à equipe do jogador, acumula a pontuação
      // para o gerente. Esse indicador será utilizado ao final da
      // temporada para definir convites de outras escuderias.
      if (piloto.equipe === JOGO.equipeSelecionada) {
        JOGO.pontuacaoGerente = (JOGO.pontuacaoGerente || 0) + pontos;
      }
    }
  });
}

/* PÓDIO */
function irParaPodio() {
  mostrarTela("podio");
  renderPodio();
}

function renderPodio() {
  const container = document.getElementById("podio-top3");
  container.innerHTML = "";

  if (!JOGO.resultadoCorrida || JOGO.resultadoCorrida.length === 0) {
    const aviso = document.createElement("p");
    aviso.innerText = "Nenhum resultado de corrida disponível.";
    container.appendChild(aviso);
    return;
  }

  const top3 = JOGO.resultadoCorrida.slice(0, 3);

  top3.forEach((r, idx) => {
    const p = r.piloto;
    const equipe = ESCUDERIAS.find(e => e.key === p.equipe);

    const card = document.createElement("div");
    card.classList.add("podio-card");

    card.innerHTML = `
      <h3>${idx + 1}º Lugar</h3>
      <div class="podio-imagens">
        <img src="assets/faces/${p.avatar}" class="mini-avatar-img" alt="${p.nome}">
        ${equipe ? `<img src="assets/logos/${equipe.logo}" class="mini-logo-img" alt="${equipe.nome}">` : ""}
      </div>
      <p>${p.nome}</p>
      <p>${equipe ? equipe.nome : ""}</p>
    `;

    container.appendChild(card);
  });
}

function finalizarCorrida() {
  JOGO.etapaAtual++;

  if (JOGO.etapaAtual > CALENDARIO.length) {
    // Encerrar a temporada mostrando resumo e convites em vez de voltar
    encerrarTemporada();
    return;
  }

  mostrarTela("lobby");
  iniciarLobby();
}

/* CLASSIFICAÇÃO DE PILOTOS */
function abrirTabelaPilotos() {
  mostrarTela("tabela-pilotos");

  const div = document.getElementById("tabela-pilotos-conteudo");
  div.innerHTML = "";

  const lista = Object.keys(TABELA_PILOTOS).map(nome => {
    const piloto = PILOTOS.find(p => p.nome === nome);
    return {
      nome,
      pontos: TABELA_PILOTOS[nome],
      piloto
    };
  }).filter(x => x.piloto)
    .sort((a, b) => b.pontos - a.pontos);

  lista.forEach((item, idx) => {
    const p = item.piloto;
    const equipe = ESCUDERIAS.find(e => e.key === p.equipe);

    const linha = document.createElement("div");
    linha.classList.add("card");
    linha.innerHTML = `
      <p>
        ${idx + 1}º -
        <img src="assets/faces/${p.avatar}" class="mini-avatar-img" alt="${p.nome}">
        ${item.nome} (${equipe ? equipe.nome : ""}) — ${item.pontos} pts
      </p>
    `;
    div.appendChild(linha);
  });
}

/* CLASSIFICAÇÃO DE EQUIPES */
function abrirTabelaEquipes() {
  mostrarTela("tabela-equipes");

  const div = document.getElementById("tabela-equipes-conteudo");
  div.innerHTML = "";

  const lista = ESCUDERIAS.map(e => ({
    equipe: e,
    pontos: TABELA_CONSTRUTORES[e.key] || 0
  })).sort((a, b) => b.pontos - a.pontos);

  lista.forEach((item, idx) => {
    const e = item.equipe;

    const linha = document.createElement("div");
    linha.classList.add("card");
    linha.innerHTML = `
      <p>
        ${idx + 1}º -
        <img src="assets/logos/${e.logo}" class="mini-logo-img" alt="${e.nome}">
        ${e.nome} — ${item.pontos} pts
      </p>
    `;
    div.appendChild(linha);
  });
}

/* SALVAR / CARREGAR / RESETAR CARREIRA */

function salvarJogo() {
  const save = {
    JOGO,
    TABELA_PILOTOS,
    TABELA_CONSTRUTORES
  };

  try {
    localStorage.setItem("F1_MANAGER_2025_SAVE", JSON.stringify(save));
    alert("Carreira salva com sucesso!");
  } catch (e) {
    console.error("Erro ao salvar jogo:", e);
    alert("Erro ao salvar carreira.");
  }
}

function carregarJogo() {
  let data;
  try {
    data = localStorage.getItem("F1_MANAGER_2025_SAVE");
  } catch (e) {
    console.error("Erro ao ler save:", e);
  }

  if (!data) {
    alert("Nenhuma carreira salva encontrada.");
    return;
  }

  try {
    const save = JSON.parse(data);
    JOGO = save.JOGO;
    TABELA_PILOTOS = save.TABELA_PILOTOS;
    TABELA_CONSTRUTORES = save.TABELA_CONSTRUTORES;
  } catch (e) {
    console.error("Erro ao interpretar save:", e);
    alert("Save corrompido.");
    return;
  }

  iniciarLobby();
  alert("Carreira carregada!");
}

function resetarCarreira() {
  if (!confirm("Tem certeza que deseja apagar tudo e recomeçar?")) return;

  try {
    localStorage.removeItem("F1_MANAGER_2025_SAVE");
  } catch (e) {
    console.error("Erro ao limpar save:", e);
  }

  JOGO = {
    gerente: null,
    equipeSelecionada: null,
    dinheiro: 5000000,
    funcionarios: [],
    patrocinador: null,
    pilotosEquipe: [],
    etapaAtual: 1,
    classificacao: [],
    resultadoCorrida: [],
    carro: { aero: 0, motor: 0, chassis: 0, pit: 0 }
  };

  TABELA_PILOTOS = {};
  TABELA_CONSTRUTORES = {};
  PILOTOS.forEach(p => TABELA_PILOTOS[p.nome] = 0);
  ESCUDERIAS.forEach(e => TABELA_CONSTRUTORES[e.key] = 0);

  mostrarTela("tela-capa");
}

/* ============================================================
   FIM DE TEMPORADA — RESUMO E CONVITES
   ============================================================ */

/**
 * Encerrar a temporada. Calcula a posição final da equipe do jogador no
 * campeonato de construtores, aplica um bônus de posição ao gerente e
 * determina quais escuderias irão oferecer um contrato para a próxima
 * temporada. Também exibe um resumo da temporada e, se o desempenho
 * for fraco, mostra uma tela de game over. Ao receber convites, o
 * jogador pode escolher sua nova equipe para iniciar a próxima
 * temporada.
 */
function encerrarTemporada() {
  // Ordena as equipes pelo total de pontos
  const rankingEquipes = ESCUDERIAS.map(e => ({
    equipe: e,
    pontos: TABELA_CONSTRUTORES[e.key] || 0
  })).sort((a, b) => b.pontos - a.pontos);
  // Determina posição da equipe do jogador
  const idx = rankingEquipes.findIndex(item => item.equipe.key === JOGO.equipeSelecionada);
  const posicao = idx >= 0 ? idx + 1 : rankingEquipes.length;
  const pontosEquipe = idx >= 0 ? rankingEquipes[idx].pontos : 0;

  // Bônus de posição: quanto melhor a colocação, maior o bônus
  const bonusPosicao = Math.max(0, (rankingEquipes.length - idx)) * 10;
  JOGO.pontuacaoGerente += bonusPosicao;

  // Prepara os elementos de resumo e convites
  const resumoEl = document.getElementById("resumo-temporada");
  const convitesEl = document.getElementById("convites-equipes");
  if (resumoEl) resumoEl.innerHTML = "";
  if (convitesEl) convitesEl.innerHTML = "";

  // Exibe campeão ou posição final
  if (posicao === 1) {
    const championDiv = document.createElement("div");
    championDiv.classList.add("campeao-section");
    championDiv.innerHTML = `
      <h3>🎉 Parabéns! Você é o campeão!</h3>
      <p>Sua equipe <strong>${rankingEquipes[0].equipe.nome}</strong> venceu o campeonato de construtores com ${pontosEquipe} pontos.</p>
      <div class="campeao-avatar">
        <img src="assets/managers/${JOGO.gerente.avatar}" alt="${JOGO.gerente.nome}" class="avatar-img">
        <img src="assets/logos/${rankingEquipes[0].equipe.logo}" alt="${rankingEquipes[0].equipe.nome}" class="logo-equipe-img">
      </div>
    `;
    resumoEl.appendChild(championDiv);
  } else {
    const resumoDiv = document.createElement("div");
    resumoDiv.classList.add("resumo-section");
    resumoDiv.innerHTML = `
      <p>Sua equipe <strong>${rankingEquipes[idx].equipe.nome}</strong> terminou a temporada em <strong>${posicao}º</strong> lugar com ${pontosEquipe} pontos no campeonato de construtores.</p>
    `;
    resumoEl.appendChild(resumoDiv);
  }

  // Exibe pontuação final do gerente
  const pontDiv = document.createElement("div");
  pontDiv.classList.add("resumo-pontuacao");
  pontDiv.innerHTML = `<p>Sua pontuação de gerente final é <strong>${JOGO.pontuacaoGerente}</strong> pts.</p>`;
  resumoEl.appendChild(pontDiv);

  // Determina quais escuderias enviarão convites
  const convites = ESCUDERIAS.filter(e => JOGO.pontuacaoGerente >= (e.minManagerPoints || 0));

  if (convites.length === 0) {
    // Caso nenhum convite seja recebido, game over
    const goDiv = document.createElement("div");
    goDiv.classList.add("gameover-section");
    goDiv.innerHTML = `
      <h3>Game Over</h3>
      <p>Seu desempenho foi insuficiente e nenhuma equipe deseja te contratar para a próxima temporada.</p>
      <p>Você foi demitido. Tente novamente em uma nova carreira!</p>
    `;
    resumoEl.appendChild(goDiv);
    // Botão para iniciar nova carreira
    const botao = document.createElement("button");
    botao.classList.add("btn-principal");
    botao.innerText = "Iniciar Nova Carreira";
    botao.onclick = () => {
      resetarCarreira();
    };
    convitesEl.appendChild(botao);
  } else {
    // Exibe cards de convite para cada equipe que atender aos critérios
    convites.forEach(e => {
      const card = document.createElement("div");
      card.classList.add("convite-card");
      card.innerHTML = `
        <div class="convite-logo">
          <img src="assets/logos/${e.logo}" alt="${e.nome}" class="mini-logo-img">
        </div>
        <h4>${e.nome}</h4>
        <p>Requer ${e.minManagerPoints} pts</p>
        <p>Finanças: R$ ${e.financas.toLocaleString('pt-BR')}</p>
        <button onclick="aceitarConvite('${e.key}')">Aceitar Convite</button>
      `;
      convitesEl.appendChild(card);
    });
  }
  mostrarTela("fim-temporada");
}

/**
 * Aceita o convite de uma escuderia e prepara o jogo para a próxima
 * temporada. Ajusta os pilotos, finanças e estado do carro para a nova
 * equipe, reinicia as pontuações e realiza um embaralhamento de pilotos.
 * Ao final o lobby é carregado com a nova equipe.
 */
function aceitarConvite(equipeKey) {
  const novaEquipe = ESCUDERIAS.find(e => e.key === equipeKey);
  if (!novaEquipe) return;
  // Define a equipe selecionada e seus pilotos
  JOGO.equipeSelecionada = novaEquipe.key;
  // Atualiza pilotos da equipe do jogador para a nova equipe
  JOGO.pilotosEquipe = PILOTOS.filter(p => p.equipe === novaEquipe.key);
  // Ajusta finanças e carro de acordo com a nova equipe
  JOGO.dinheiro = novaEquipe.financas || 5000000;
  JOGO.carro = { ...novaEquipe.carroBase };
  // Limpa patrocinador e funcionários
  JOGO.patrocinador = null;
  JOGO.funcionarios = [];
  // Reinicia as tabelas de pontuação
  TABELA_PILOTOS = {};
  TABELA_CONSTRUTORES = {};
  PILOTOS.forEach(p => {
    TABELA_PILOTOS[p.nome] = 0;
  });
  ESCUDERIAS.forEach(e => {
    TABELA_CONSTRUTORES[e.key] = 0;
  });
  // Reinicia pontuação do gerente e etapa
  JOGO.pontuacaoGerente = 0;
  JOGO.etapaAtual = 1;
  // Embaralha os pilotos para a nova temporada
  shufflePilotos();
  // Atualiza pilotos da nova equipe após embaralhar
  JOGO.pilotosEquipe = PILOTOS.filter(p => p.equipe === JOGO.equipeSelecionada);
  // Vai para o lobby
  iniciarLobby();
  mostrarTela("lobby");
}

/**
 * Embaralha os pilotos entre todas as equipes de forma aleatória, garantindo
 * que cada equipe possua no máximo dois pilotos. Essa função é chamada
 * ao iniciar uma nova temporada, permitindo alterações no grid entre
 * temporadas consecutivas.
 */
function shufflePilotos() {
  const teams = ESCUDERIAS.map(e => e.key);
  const assignments = {};
  teams.forEach(t => assignments[t] = []);
  const shuffled = [...PILOTOS].sort(() => Math.random() - 0.5);
  let teamIdx = 0;
  shuffled.forEach(p => {
    // encontra a próxima equipe com menos de 2 pilotos
    while (assignments[teams[teamIdx]].length >= 2) {
      teamIdx = (teamIdx + 1) % teams.length;
    }
    const team = teams[teamIdx];
    assignments[team].push(p);
    p.equipe = team;
  });
}

/* INICIALIZAÇÃO */

window.onload = () => {
  mostrarTela("tela-capa");
  // Torna a capa interativa: qualquer clique inicia o jogo e leva ao menu principal.
  const capaEl = document.getElementById("tela-capa");
  if (capaEl) {
    capaEl.addEventListener(
      "click",
      (e) => {
        // evita múltiplas chamadas anexando apenas uma vez
        abrirMenuPrincipal();
      },
      { once: true }
    );
  }
};
