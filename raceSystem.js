// Sistema de corrida 2D com mapa, pneus e pit-stop
(function () {
  // Base interval (ms) for race updates. Can be multiplied by raceSpeedMultiplier
  const baseRaceInterval = 200;
  // Multiplier for race speed (1x, 2x, 4x)
  let raceSpeedMultiplier = 1;
  /**
   * Ajusta a velocidade da corrida. Reinicia o loop de atualização com
   * intervalo proporcional ao multiplicador. Também atualiza o estado
   * visual dos botões na interface (classe 'active').
   * @param {number} mult Multiplicador de velocidade (1, 2 ou 4)
   */
  window.setRaceSpeed = function (mult) {
    // valores válidos: 1, 2 ou 4
    if (![1, 2, 4].includes(mult)) {
      mult = 1;
    }
    raceSpeedMultiplier = mult;
    // reinicia intervalo de corrida se estiver ativo
    if (raceInterval) {
      clearInterval(raceInterval);
    }
    raceInterval = setInterval(updateRace2D, baseRaceInterval / raceSpeedMultiplier);
    // atualiza classes nos botões para refletir o ativo
    const controls = document.getElementById('race-speed-controls');
    if (controls) {
      controls.querySelectorAll('button').forEach((btn) => {
        btn.classList.remove('active');
      });
      const btnId = `speed-${mult}x`;
      const activeBtn = document.getElementById(btnId);
      if (activeBtn) activeBtn.classList.add('active');
    }
  };
  /**
   * Gera uma lista de pontos (x,y) entre 0 e 1 definindo uma pista. Cada pista
   * tem um desenho único baseado em funções trigonométricas. Estas curvas
   * não são réplicas exatas dos circuitos reais, mas oferecem uma sensação
   * diferente para cada etapa sem depender de imagens vetoriais externas. Para
   * adicionar um novo traçado, inclua um caso no switch abaixo.
   *
   * @param {string} key Identificador da pista (ex: "bahrain", "monaco")
   * @param {number} n Número de pontos a gerar
   */
  function generateTrackPath(key, n) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const t = (2 * Math.PI * i) / n;
      let r = 0.45;
      let xMod = 1;
      let yMod = 1;
      // Ajustes específicos por pista para variar a forma do circuito. Estes
      // ajustes modificam o raio (r) e multiplicadores de x/y para criar
      // retas longas, curvas apertadas e chicanes simples.
      switch (key) {
        case 'bahrain':
          // Retas longas e frenagens fortes
          r = 0.42 + 0.05 * Math.sin(2 * t);
          xMod = 1.0;
          yMod = 0.85;
          break;
        case 'jeddah':
          // Circuito de rua rápido e estreito
          r = 0.40 + 0.04 * Math.sin(6 * t);
          xMod = 1.2;
          yMod = 0.6;
          break;
        case 'australia':
          // Albert Park com chicanes
          r = 0.43 + 0.05 * Math.sin(3 * t + Math.cos(5 * t));
          xMod = 1.0;
          yMod = 0.9;
          break;
        case 'japan':
          // Suzuka em formato de oito estilizado
          r = 0.40 + 0.06 * Math.sin(2 * t) * Math.cos(3 * t);
          xMod = 1.1;
          yMod = 0.8;
          break;
        case 'china':
          // Xangai com reta em forma de caracol
          r = 0.38 + 0.08 * Math.sin(t + Math.sin(4 * t));
          xMod = 1.1;
          yMod = 0.8;
          break;
        case 'miami':
          // Circuito com longa reta e curvas apertadas
          r = 0.41 + 0.05 * Math.sin(4 * t);
          xMod = 0.9;
          yMod = 1.2;
          break;
        case 'imola':
          r = 0.40 + 0.05 * Math.sin(3 * t);
          xMod = 1.0;
          yMod = 0.8;
          break;
        case 'monaco':
          // Ruas estreitas com muitas curvas fechadas
          r = 0.35 + 0.07 * Math.sin(5 * t);
          xMod = 0.8;
          yMod = 1.1;
          break;
        case 'silverstone':
          // Circuito de alta velocidade com curvas rápidas
          r = 0.42 + 0.05 * Math.sin(2 * t + Math.cos(4 * t));
          xMod = 1.2;
          yMod = 0.8;
          break;
        case 'hungary':
          r = 0.38 + 0.06 * Math.sin(4 * t);
          xMod = 0.9;
          yMod = 1.0;
          break;
        case 'spain':
          r = 0.40 + 0.05 * Math.sin(3 * t);
          xMod = 1.1;
          yMod = 0.9;
          break;
        case 'austria':
          // Red Bull Ring com retas e subidas
          r = 0.39 + 0.07 * Math.sin(2 * t);
          xMod = 1.0;
          yMod = 0.9;
          break;
        case 'canada':
          // Montreal com retas longas e chicanes
          r = 0.41 + 0.06 * Math.sin(4 * t);
          xMod = 1.0;
          yMod = 0.85;
          break;
        default:
          // Traçado padrão: círculo com pequenas variações
          r = 0.45 + 0.03 * Math.sin(3 * t);
          xMod = 1.0;
          yMod = 1.0;
          break;
      }
      const x = 0.5 + r * Math.cos(t) * xMod;
      const y = 0.5 + r * Math.sin(t) * yMod;
      pts.push({ x, y });
    }
    return pts;
  }

  /**
   * Gera automaticamente um traçado de pit lane baseado no traçado principal.
   * O pit lane é uma versão escalada para dentro do traçado principal com uma
   * pequena translação para assegurar que não se sobreponha ao traçado.
   * @param {Array} mainPath Lista de pontos do traçado principal
   */
  function generatePitLane(mainPath) {
    return mainPath.map((p) => {
      return {
        x: 0.5 + 0.3 * (p.x - 0.5),
        y: 0.5 + 0.3 * (p.y - 0.5)
      };
    });
  }

  // Escala pontos para o tamanho da pista
  function scalePath(path, width, height) {
    return path.map(p => ({ x: p.x * width, y: p.y * height }));
  }

  // Estado interno da corrida
  let RACE_STATE = null;
  let raceInterval = null;

  /**
   * Inicia a corrida 2D
   * @param {string} gpName
   * @param {Array} driversList
   * @param {number} lapsTotal
   */
  window.startRace2D = function (gpName, driversList, lapsTotal) {
    const totalLaps = lapsTotal || 10;
    // Prepara interface
    document.getElementById('race-standings').innerHTML = '';
    document.getElementById('race-hud').style.display = 'flex';
    document.getElementById('pit-popup').classList.add('hidden');
    document.getElementById('btn-box').disabled = false;

    const titleEl = document.getElementById('corrida-gp-nome');
    if (titleEl) {
      titleEl.textContent = 'Corrida - ' + gpName;
    }
    const trackImg = document.getElementById('track-image');
    // tenta carregar imagem correspondente, fallback para monaco
    const trackKey = gpName.toLowerCase().replace(/\s+/g, '_');
    const possibleNames = [trackKey + '.png', trackKey + '.jpg', trackKey + '.webp'];
    let loaded = false;
    for (const name of possibleNames) {
      const path = 'assets/tracks/' + name;
      // defini path sem verificar, tentaremos carregar; se falhar, navegadores substituem fallback automático
      trackImg.src = path;
      loaded = true;
      break;
    }
    if (!loaded) {
      trackImg.src = 'assets/tracks/monaco.png';
    }
    const trackContainer = document.getElementById('track-container');
    const carsLayer = document.getElementById('cars-layer');
    // quando imagem carregar, definimos caminhos
    trackImg.onload = function () {
      const width = trackContainer.clientWidth;
      const height = trackContainer.clientHeight;
      // gera traçado com base na chave da pista. se a chave não existir, usa padrão
      const basePath = generateTrackPath(gpName, 400);
      const basePit = generatePitLane(basePath);
      const mainPath = scalePath(basePath, width, height);
      const pitPath = scalePath(basePit, width, height);
      // inicializa estado dos pilotos
      const racers = driversList.map((p, idx) => {
        const tyreSet = createTyreSet('MEDIUM');
        return {
          name: p.nome,
          team: p.equipe,
          rating: p.rating,
          tyreSet: tyreSet,
          pitStopCount: 0,
          inPit: false,
          pitTime: 0,
          pitError: null,
          nextCompound: null,
          lap: 0,
          positionIndex: idx * 5,
          el: null,
          isPlayer: idx === 0, // primeiro piloto é do jogador
          order: idx
        };
      });
      // cria elementos dos carros
      carsLayer.innerHTML = '';
      racers.forEach((dr) => {
        const carEl = document.createElement('img');
        carEl.className = 'car-icon';
        // caminho do ícone da equipe
        carEl.src = 'assets/cars/' + dr.team + '.png';
        carsLayer.appendChild(carEl);
        dr.el = carEl;
      });
      // define estado da corrida
      RACE_STATE = {
        lapsTotal: totalLaps,
        mainPath: mainPath,
        pitPath: pitPath,
        racers: racers,
        weather: window.weatherState || { trackTemp: 30, rainLevel: 0 },
        finished: false
      };
      // Reinicia indicador de voltas se existir
      const lapIndEl = document.getElementById('lap-indicator');
      if (lapIndEl) {
        lapIndEl.textContent = 'Volta 1 / ' + totalLaps;
      }
      // inicia loop com velocidade padrão (1x)
      if (raceInterval) clearInterval(raceInterval);
      // define estado inicial do controle de velocidade
      raceSpeedMultiplier = 1;
      // se houver controles na UI, atualiza classe ativa
      const btn1x = document.getElementById('speed-1x');
      const btn2x = document.getElementById('speed-2x');
      const btn4x = document.getElementById('speed-4x');
      if (btn1x) btn1x.classList.add('active');
      if (btn2x) btn2x.classList.remove('active');
      if (btn4x) btn4x.classList.remove('active');
      // inicia intervalo utilizando função setRaceSpeed para manter consistência
      raceInterval = setInterval(updateRace2D, baseRaceInterval / raceSpeedMultiplier);
    };
  };

  // Atualiza a corrida: move carros, aplica desgaste, calcula posições e atualiza HUD
  function updateRace2D() {
    if (!RACE_STATE || RACE_STATE.finished) return;
    const path = RACE_STATE.mainPath;
    const pitPath = RACE_STATE.pitPath;
    const racers = RACE_STATE.racers;
    racers.forEach((dr) => {
      if (dr.inPit) {
        // em pit
        dr.pitTime -= 0.2;
        if (dr.pitTime <= 0) {
          // sai do pit
          dr.inPit = false;
          dr.pitStopCount++;
          dr.tyreSet = createTyreSet(dr.nextCompound || 'MEDIUM');
          dr.pitError = null;
          // retorna para pista em posição 0
          dr.positionIndex = 0;
        }
      } else {
        // desgaste dos pneus e penalidade de performance
        const penalty = updateTyresForLap(dr.tyreSet, 1, 1);
        // calcula velocidade base pelo rating (entre 1 e 1.4)
        const speedFactor = 1 + (dr.rating - 80) / 100;
        dr.positionIndex += speedFactor - penalty;
        // conclusão de volta
        if (dr.positionIndex >= path.length) {
          dr.positionIndex -= path.length;
          dr.lap++;
          // encerra corrida ao completar voltas
          if (dr.lap >= RACE_STATE.lapsTotal) {
            RACE_STATE.finished = true;
          }
        }
        // decisão de parada da IA
        if (!dr.isPlayer && !dr.inPit) {
          if (decideAiPit(dr, RACE_STATE)) {
            dr.inPit = true;
            const pitInfo = calculatePitTime();
            dr.pitTime = pitInfo.time;
            dr.pitError = pitInfo.error;
            dr.nextCompound = chooseNextCompoundForAi(dr, RACE_STATE);
          }
        }
      }
      // posiciona elemento
      const coords = dr.inPit ? pitPath[Math.floor(dr.positionIndex) % pitPath.length] : path[Math.floor(dr.positionIndex) % path.length];
      if (coords && dr.el) {
        dr.el.style.left = coords.x + 'px';
        dr.el.style.top = coords.y + 'px';
      }
    });
    // ordena pilotos pela volta e posição na pista
    racers.sort((a, b) => {
      if (a.lap !== b.lap) return b.lap - a.lap;
      return b.positionIndex - a.positionIndex;
    });
    // Atualiza tabela de classificação
    renderStandings();
    // Atualiza HUD do jogador
    const player = racers.find((r) => r.isPlayer);
    if (player) {
      renderHud(player);
      // Atualiza indicador de voltas
      const lapIndicator = document.getElementById('lap-indicator');
      if (lapIndicator && RACE_STATE) {
        // lap é zero-indexado internamente, então adicionamos 1 para exibição
        const currentLap = Math.min(player.lap + 1, RACE_STATE.lapsTotal);
        lapIndicator.textContent = 'Volta ' + currentLap + ' / ' + RACE_STATE.lapsTotal;
      }
    }
    // Encerra corrida se acabou
    if (RACE_STATE.finished) {
      clearInterval(raceInterval);
      document.getElementById('btn-box').disabled = true;
      document.getElementById('pit-popup').classList.add('hidden');
    }
  }

  // Atualiza tabela de classificação na UI
  function renderStandings() {
    const standingsEl = document.getElementById('race-standings');
    const racers = RACE_STATE.racers;
    let html = '<table><thead><tr><th>Pos</th><th>Piloto</th><th>Equipe</th><th>Pneu</th><th>Desg.</th><th>Pits</th></tr></thead><tbody>';
    racers.forEach((dr, idx) => {
      html += `<tr><td>${idx + 1}</td><td>${dr.name}</td><td>${dr.team}</td><td>${dr.tyreSet.compound}</td><td>${dr.tyreSet.wear.toFixed(0)}%</td><td>${dr.pitStopCount}</td></tr>`;
    });
    html += '</tbody></table>';
    standingsEl.innerHTML = html;
  }

  // Atualiza HUD do jogador
  function renderHud(player) {
    const tyreEl = document.getElementById('hud-tyre');
    const wearEl = document.getElementById('hud-wear');
    const tempEl = document.getElementById('hud-temp');
    const deltaEl = document.getElementById('hud-delta');
    if (!tyreEl) return;
    tyreEl.textContent = player.tyreSet.compound;
    wearEl.textContent = player.tyreSet.wear.toFixed(0);
    tempEl.textContent = player.tyreSet.temperature.toFixed(0);
    // delta para o piloto à frente
    const racers = RACE_STATE.racers;
    const idx = racers.indexOf(player);
    if (idx === 0) {
      deltaEl.textContent = '-';
    } else {
      const front = racers[idx - 1];
      // diferença de index convertida para segundos aproximados
      const diff = (front.lap - player.lap) * RACE_STATE.mainPath.length + (front.positionIndex - player.positionIndex);
      const seconds = Math.max(0, diff * 0.05);
      deltaEl.textContent = seconds.toFixed(1);
    }
  }

  // Chamado quando o jogador clica no botão BOX THIS LAP
  window.comandarBox = function () {
    if (!RACE_STATE) return;
    const player = RACE_STATE.racers.find((r) => r.isPlayer);
    if (player && !player.inPit) {
      // abre popup para escolher composto
      const popup = document.getElementById('pit-popup');
      popup.classList.remove('hidden');
      const optionsEl = document.getElementById('pit-tyre-options');
      optionsEl.innerHTML = '';
      ['SOFT', 'MEDIUM', 'HARD', 'INTER', 'WET'].forEach((comp) => {
        const btn = document.createElement('button');
        btn.textContent = comp;
        btn.onclick = function () {
          player.nextCompound = comp;
          player.inPit = true;
          const pitInfo = calculatePitTime();
          player.pitTime = pitInfo.time;
          player.pitError = pitInfo.error;
          popup.classList.add('hidden');
        };
        optionsEl.appendChild(btn);
      });
    }
  };

  window.cancelarBox = function () {
    const popup = document.getElementById('pit-popup');
    popup.classList.add('hidden');
  };

  // Permite parar a corrida 2D externamente (por exemplo, ao sair para o menu)
  window.stopRace2D = function () {
    if (raceInterval) {
      clearInterval(raceInterval);
      raceInterval = null;
    }
    RACE_STATE = null;
  };
})();