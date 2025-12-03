// Sistema de pit-stop simplificado
(function () {
  // tempo base de pit (em segundos)
  window.basePitTime = 3.0;
  // chance de erro no pit (5%)
  window.randomPitErrorChance = 0.05;

  /**
   * Calcula o tempo de pit e determina se houve erro
   * @returns {{time: number, error: string|null}}
   */
  window.calculatePitTime = function () {
    let time = window.basePitTime + Math.random() * 1.5;
    let error = null;
    if (Math.random() < window.randomPitErrorChance) {
      time += 4 + Math.random() * 5;
      error = 'Erro no pit-stop!';
    }
    return { time, error };
  };
})();