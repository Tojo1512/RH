const db = require('../db/db');

class DemandesCongeService {
  async getAll() {
    return db.query('SELECT * FROM Demandes_conge');
  }

  async getById(id) {
    return db.query('SELECT * FROM Demandes_conge WHERE id_demande_congee = $1', [id]);
  }

  async create(demandeConge) {
    const { date_demande, date_fin, motif, duree, est_approuvee, id_conge, id_personnel } = demandeConge;
    return db.query(
      'INSERT INTO Demandes_conge (date_demande, date_fin, motif, duree, est_approuvee, id_conge, id_personnel) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [date_demande, date_fin, motif, duree, est_approuvee, id_conge, id_personnel]
    );
  }

  async update(id, demandeConge) {
    const { date_demande, date_fin, motif, duree, est_approuvee, id_conge, id_personnel } = demandeConge;
    return db.query(
      'UPDATE Demandes_conge SET date_demande = $1, date_fin = $2, motif = $3, duree = $4, est_approuvee = $5, id_conge = $6, id_personnel = $7 WHERE id_demande_congee = $8 RETURNING *',
      [date_demande, date_fin, motif, duree, est_approuvee, id_conge, id_personnel, id]
    );
  }

  async delete(id) {
    return db.query('DELETE FROM Demandes_conge WHERE id_demande_congee = $1', [id]);
  }
}

module.exports = new DemandesCongeService(); 