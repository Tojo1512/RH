const typesCongeService = require('../services/typesCongeService');

class TypesCongeController {
  async getAll(req, res) {
    try {
      const result = await typesCongeService.getAll();
      res.json({ data: result.rows, status: 'success', code: 200 });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error', code: 500 });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await typesCongeService.getById(id);
      res.json({ data: result.rows[0], status: 'success', code: 200 });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error', code: 500 });
    }
  }

  async create(req, res) {
    try {
      const result = await typesCongeService.create(req.body);
      res.json({ data: result.rows[0], status: 'success', code: 201 });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error', code: 500 });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const result = await typesCongeService.update(id, req.body);
      res.json({ data: result.rows[0], status: 'success', code: 200 });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error', code: 500 });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await typesCongeService.delete(id);
      res.json({ message: 'Type de congé supprimé', status: 'success', code: 200 });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error', code: 500 });
    }
  }
}

module.exports = new TypesCongeController(); 