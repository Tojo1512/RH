const db = require('../db/db');

class DroitCongeService {
  async getAll() {
    return db.query('SELECT * FROM droit_conge');
  }

  async getById(id) {
    return db.query('SELECT * FROM droit_conge WHERE id_personnel = $1', [id]);
  }

  async create(droitConge) {
    const { id_personnel, id_conge, annee } = droitConge;
    return db.query(
      'INSERT INTO droit_conge (id_personnel, id_conge, annee) VALUES ($1, $2, $3) RETURNING *',
      [id_personnel, id_conge, annee]
    );
  }

  async update(id, droitConge) {
    const { id_conge, annee } = droitConge;
    return db.query(
      'UPDATE droit_conge SET id_conge = $1, annee = $2 WHERE id_personnel = $3 RETURNING *',
      [id_conge, annee, id]
    );
  }

  async delete(id) {
    return db.query('DELETE FROM droit_conge WHERE id_personnel = $1', [id]);
  }
}

module.exports = new DroitCongeService(); 