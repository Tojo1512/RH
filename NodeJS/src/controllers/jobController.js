const JobService = require("../services/jobService");

class JobController {
  async getAllJobs(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;

      const result = await JobService.getAllJobs(page, limit);
      res.json(result);
    } catch (error) {
      console.error("Erreur dans getAllJobs:", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des offres" });
    }
  }

  async submitApplication(req, res) {
    try {
      const { id_offre, id_user, cv, lettre_motivation } = req.body;

      // Validation des données
      if (!id_offre || !id_user || !cv || !lettre_motivation) {
        return res.status(400).json({ 
          message: "Tous les champs sont obligatoires" 
        });
      }

      const newApplication = await JobService.createApplication({
        id_offre,
        id_user,
        cv,
        lettre_motivation,
        date_candidature: new Date(),
        statut: 'En attente'
      });

      res.status(201).json(newApplication);
    } catch (error) {
      console.error('Erreur dans submitApplication:', error);
      
      if (error.message === 'Offre d\'emploi non trouvée' || 
          error.message === 'Utilisateur non trouvé') {
        return res.status(404).json({ message: error.message });
      }
      
      if (error.message === 'Vous avez déjà postulé à cette offre') {
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({ 
        message: "Erreur lors de l'envoi de la candidature",
        detail: error.message 
      });
    }
  }

  async getUserApplications(req, res) {
    try {
      const userId = parseInt(req.params.userId);
      const applications = await JobService.getUserApplications(userId);
      res.json(applications);
    } catch (error) {
      console.error("Erreur dans getUserApplications:", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des candidatures" });
    }
  }

  async getJobById(req, res) {
    try {
      const jobId = parseInt(req.params.id);
      const job = await JobService.getJobById(jobId);

      if (!job) {
        return res.status(404).json({ message: "Offre non trouvée" });
      }

      res.json(job);
    } catch (error) {
      console.error("Erreur dans getJobById:", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération de l'offre" });
    }
  }
}

// Créer une instance du contrôleur
const jobController = new JobController();

// Exporter les méthodes individuellement
module.exports = {
  getAllJobs: jobController.getAllJobs.bind(jobController),
  getJobById: jobController.getJobById.bind(jobController),
  submitApplication: jobController.submitApplication.bind(jobController),
  getUserApplications: jobController.getUserApplications.bind(jobController),
};
