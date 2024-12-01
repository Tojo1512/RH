const db = require('../db/db');

class TypesCongeService {
  async getAll() {
    return db.query('SELECT * FROM Types_conge');
  }

  async getById(id) {
    return db.query('SELECT * FROM Types_conge WHERE id_conge = $1', [id]);
  }

  async create(typeConge) {
    const { type, est_remunere, nombre } = typeConge;
    return db.query(
      'INSERT INTO Types_conge (type, est_remunere, nombre) VALUES ($1, $2, $3) RETURNING *',
      [type, est_remunere, nombre]
    );
  }

  async update(id, typeConge) {
    const { type, est_remunere, nombre } = typeConge;
    return db.query(
      'UPDATE Types_conge SET type = $1, est_remunere = $2, nombre = $3 WHERE id_conge = $4 RETURNING *',
      [type, est_remunere, nombre, id]
    );
  }

  async delete(id) {
    return db.query('DELETE FROM Types_conge WHERE id_conge = $1', [id]);
  }
}

module.exports = new TypesCongeService(); 