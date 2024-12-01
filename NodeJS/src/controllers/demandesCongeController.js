const demandesCongeService = require('../services/demandesCongeService');

class DemandesCongeController {
  async getAll(req, res) {
    try {
      const result = await demandesCongeService.getAll();
      res.json({ data: result.rows, status: 'success', code: 200 });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error', code: 500 });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await demandesCongeService.getById(id);
      res.json({ data: result.rows[0], status: 'success', code: 200 });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error', code: 500 });
    }
  }

  async create(req, res) {
    try {
      const result = await demandesCongeService.create(req.body);
      res.json({ data: result.rows[0], status: 'success', code: 201 });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error', code: 500 });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const result = await demandesCongeService.update(id, req.body);
      res.json({ data: result.rows[0], status: 'success', code: 200 });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error', code: 500 });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await demandesCongeService.delete(id);
      res.json({ message: 'Demande de congé supprimée', status: 'success', code: 200 });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error', code: 500 });
    }
  }
}

module.exports = new DemandesCongeController(); 