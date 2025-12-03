// Estratégias simplificadas de paradas para a IA
(function () {
  /**
   * Decide se o piloto deve parar nos boxes baseado no desgaste dos pneus e no tempo de corrida
   * @param {object} driver
   * @param {object} raceState
   * @returns {boolean}
   */
  window.decideAiPit = function (driver, raceState) {
    if (!driver.tyreSet) return false;
    const wear = driver.tyreSet.wear || 0;
    // parar se desgaste > 60% e ainda não fez duas paradas
    if (wear > 60 && (driver.pitStopCount || 0) < 2) {
      return true;
    }
    // se chover e estiver com pneus slick, parar imediatamente
    if (raceState.weather && raceState.weather.rainLevel > 0.5) {
      const comp = driver.tyreSet.compound;
      if (comp === 'SOFT' || comp === 'MEDIUM' || comp === 'HARD') return true;
    }
    return false;
  };

  /**
   * Escolhe o próximo composto para a IA
   * @param {object} driver
   * @param {object} raceState
   * @returns {string}
   */
  window.chooseNextCompoundForAi = function (driver, raceState) {
    if (raceState.weather && raceState.weather.rainLevel > 0.5) {
      // se muito molhado, escolha intermediário
      if (raceState.weather.rainLevel > 0.8) {
        return 'WET';
      }
      return 'INTER';
    }
    // alternar compostos
    switch (driver.tyreSet.compound) {
      case 'SOFT':
        return 'MEDIUM';
      case 'MEDIUM':
        return 'HARD';
      case 'HARD':
      default:
        return 'SOFT';
    }
  };
})();