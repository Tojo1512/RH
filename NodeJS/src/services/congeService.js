const db = require('../db/db');

class CongeService {
  async getCongeDispo() {
    try {
      const result = await db.query('SELECT * FROM v_conge_dispo');
      return result.rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des congés disponibles: ${error.message}`);
    }
  }

  async calculerCongeDispo(annee) {
    try {
      const result = await db.query('SELECT * FROM calculer_conge_dispo($1)', [annee]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erreur lors du calcul des congés disponibles: ${error.message}`);
    }
  }
}

module.exports = new CongeService(); 