// Sistema de pneus realista para a corrida 2D
(function () {
  // Definições de compostos
  window.TyreCompounds = {
    SOFT: { name: 'Soft', baseDeg: 0.045, wearPenalty: 0.03, tempIdeal: 100 },
    MEDIUM: { name: 'Medium', baseDeg: 0.03, wearPenalty: 0.02, tempIdeal: 100 },
    HARD: { name: 'Hard', baseDeg: 0.02, wearPenalty: 0.015, tempIdeal: 100 },
    INTER: { name: 'Intermediário', baseDeg: 0.03, wearPenalty: 0.02, tempIdeal: 80 },
    WET: { name: 'Wet', baseDeg: 0.025, wearPenalty: 0.02, tempIdeal: 60 }
  };

  /**
   * Cria um novo conjunto de pneus a partir do composto escolhido
   * @param {string} compoundKey
   */
  window.createTyreSet = function (compoundKey) {
    const comp = window.TyreCompounds[compoundKey] || window.TyreCompounds.MEDIUM;
    return {
      compound: compoundKey,
      wear: 0,
      temperature: comp.tempIdeal
    };
  };

  /**
   * Atualiza o desgaste e a temperatura dos pneus para uma volta
   * Retorna a penalidade em segundos a ser adicionada ao tempo de volta
   * @param {object} tyreSet
   * @param {number} drivingFactor (1.0 = ritmo normal, >1 = agressivo, <1 = conservador)
   * @param {number} setupFactor (1.0 = setup neutro)
   */
  window.updateTyresForLap = function (tyreSet, drivingFactor, setupFactor) {
    const comp = window.TyreCompounds[tyreSet.compound] || window.TyreCompounds.MEDIUM;
    const drive = drivingFactor || 1;
    const setup = setupFactor || 1;
    // aumenta desgaste proporcional ao composto e estilo de pilotagem
    tyreSet.wear += comp.baseDeg * drive * setup;
    if (tyreSet.wear > 100) tyreSet.wear = 100;
    // penalidade em segundos é proporcional ao desgaste acumulado
    const penalty = tyreSet.wear * comp.wearPenalty;
    return penalty;
  };
})();