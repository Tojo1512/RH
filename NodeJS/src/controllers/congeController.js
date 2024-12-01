const congeService = require('../services/congeService');

class CongeController {
  async getCongeDispo(req, res) {
    try {
      const data = await congeService.getCongeDispo();
      res.json({ data, status: 'success', code: 200 });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error', code: 500 });
    }
  }

  async calculerCongeDispo(req, res) {
    try {
      const { annee } = req.params;
      if (!annee || isNaN(annee)) {
        return res.status(400).json({ error: 'Année invalide', status: 'error', code: 400 });
      }
      const data = await congeService.calculerCongeDispo(annee);
      res.json({ data, status: 'success', code: 200 });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error', code: 500 });
    }
  }
}

module.exports = new CongeController(); 