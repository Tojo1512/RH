const JobService = require("../services/jobService");
const db = require("../config/database");

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
          message: "Tous les champs sont obligatoires",
        });
      }

      const newApplication = await JobService.createApplication({
        id_offre,
        id_user,
        cv,
        lettre_motivation,
        date_candidature: new Date(),
        statut: "En attente",
      });

      res.status(201).json(newApplication);
    } catch (error) {
      console.error("Erreur dans submitApplication:", error);

      if (
        error.message === "Offre d'emploi non trouvée" ||
        error.message === "Utilisateur non trouvé"
      ) {
        return res.status(404).json({ message: error.message });
      }

      if (error.message === "Vous avez déjà postulé à cette offre") {
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({
        message: "Erreur lors de l'envoi de la candidature",
        detail: error.message,
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

  async getAllApplications(req, res) {
    console.log("Tentative de récupération des candidatures");
    try {
      const query = `
        SELECT 
          c.*,
          u.login, u.mail,
          p.nom, p.prenom,
          oe.titre, oe.description
        FROM Candidature c
        JOIN Users u ON c.id_user = u.id_user
        LEFT JOIN Personnels p ON u.id_user = p.id_user
        JOIN Offre_emploi oe ON c.id_offre = oe.id_offre
        ORDER BY c.date_candidature DESC
      `;

      console.log("Exécution de la requête SQL");
      const { rows } = await db.query(query);
      console.log("Données récupérées:", rows);

      const formattedApplications = rows.map((row) => ({
        id_candidature: row.id_candidature,
        date_candidature: row.date_candidature,
        statut: row.statut,
        cv: row.cv,
        lettre_motivation: row.lettre_motivation,
        utilisateur: {
          id_user: row.id_user,
          login: row.login,
          email: row.mail,
          nom: row.nom || "Non renseigné",
          prenom: row.prenom || "Non renseigné",
        },
        offre: {
          id_offre: row.id_offre,
          titre: row.titre,
          description: row.description,
        },
      }));

      res.json(formattedApplications);
    } catch (error) {
      console.error("Erreur détaillée:", error);
      res.status(500).json({
        message: "Erreur lors de la récupération des candidatures",
        error: error.message,
      });
    }
  }

  async updateApplicationStatus(req, res) {
    const { id } = req.params;
    const { statut } = req.body;

    try {
      console.log(
        `Mise à jour du statut de la candidature ${id} vers ${statut}`
      );

      // Mise à jour du statut et récupération de l'id_user
      const updateQuery = `
        UPDATE Candidature 
        SET statut = $1 
        WHERE id_candidature = $2 
        RETURNING id_user, statut
      `;

      const result = await db.query(updateQuery, [statut, id]);
      console.log("Résultat de la mise à jour:", result.rows[0]);

      if (result.rows.length === 0) {
        console.log("Candidature non trouvée");
        return res.status(404).json({ message: "Candidature non trouvée" });
      }

      const userId = result.rows[0].id_user;
      console.log("UserId pour la notification:", userId);

      // Créer une notification avec le nom de colonne en minuscules
      const notificationQuery = `
        INSERT INTO Notifications (
          userid,
          message,
          type,
          date,
          read
        ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, false)
        RETURNING *
      `;

      const message = `Votre candidature a été ${statut.toLowerCase()}.`;
      const type = statut === "Acceptée" ? "success" : "error";

      console.log("Création de la notification avec les paramètres:", {
        userId,
        message,
        type,
      });

      const notificationResult = await db.query(notificationQuery, [
        userId,
        message,
        type,
      ]);

      console.log("Notification créée:", notificationResult.rows[0]);

      res.json({
        success: true,
        message: "Statut mis à jour et notification créée",
        notification: notificationResult.rows[0],
      });
    } catch (error) {
      console.error("Erreur détaillée:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour",
        error: error.message,
      });
    }
  }

  // Nouvelles méthodes pour les notifications
  async getUserNotifications(req, res) {
    const { userId } = req.params;

    try {
      console.log("Récupération des notifications pour userId:", userId);

      const query = `
        SELECT * FROM Notifications 
        WHERE userid = $1 AND read = false 
        ORDER BY date DESC
      `;

      const { rows } = await db.query(query, [userId]);
      console.log("Notifications trouvées:", rows.length);

      res.json({
        success: true,
        notifications: rows,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des notifications",
        error: error.message,
      });
    }
  }

  async markNotificationAsRead(req, res) {
    const { id } = req.params;

    try {
      console.log("Marquage de la notification comme lue:", id);

      const query = `
        UPDATE Notifications 
        SET read = true 
        WHERE id = $1
        RETURNING *
      `;

      const result = await db.query(query, [id]);
      console.log("Notification mise à jour:", result.rows[0]);

      res.json({
        success: true,
        notification: result.rows[0],
      });
    } catch (error) {
      console.error("Erreur lors du marquage de la notification:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors du marquage de la notification",
        error: error.message,
      });
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
  getAllApplications: jobController.getAllApplications.bind(jobController),
  updateApplicationStatus:
    jobController.updateApplicationStatus.bind(jobController),
  getUserNotifications: jobController.getUserNotifications.bind(jobController),
  markNotificationAsRead:
    jobController.markNotificationAsRead.bind(jobController),
};
