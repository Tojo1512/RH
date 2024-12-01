const db = require("../config/database");

class JobService {
  async getAllJobs(page = 1, limit = 5) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT 
        oe.id_offre,
        oe.titre,
        LEFT(oe.description, 150) as description,
        oe.statut
      FROM Offre_emploi oe
      WHERE oe.statut = 'Actif'
      ORDER BY oe.date_publication DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(*) 
      FROM Offre_emploi 
      WHERE statut = 'Actif'
    `;

    const [jobs, count] = await Promise.all([
      db.query(query, [limit, offset]),
      db.query(countQuery),
    ]);

    return {
      jobs: jobs.rows,
      total: parseInt(count.rows[0].count),
    };
  }

  async createApplication(applicationData) {
    try {
      // Vérifier si l'offre existe
      const jobExists = await db.query(
        "SELECT id_offre FROM Offre_emploi WHERE id_offre = $1",
        [applicationData.id_offre]
      );

      if (jobExists.rows.length === 0) {
        throw new Error("Offre d'emploi non trouvée");
      }

      // Vérifier si l'utilisateur existe
      const userExists = await db.query(
        "SELECT id_user FROM Users WHERE id_user = $1",
        [applicationData.id_user]
      );

      if (userExists.rows.length === 0) {
        throw new Error("Utilisateur non trouvé");
      }

      // Vérifier si une candidature existe déjà
      const existingApplication = await db.query(
        "SELECT id_candidature FROM Candidature WHERE id_offre = $1 AND id_user = $2",
        [applicationData.id_offre, applicationData.id_user]
      );

      if (existingApplication.rows.length > 0) {
        throw new Error("Vous avez déjà postulé à cette offre");
      }

      const query = `
        INSERT INTO Candidature 
        (date_candidature, cv, lettre_motivation, statut, id_offre, id_user)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;

      const values = [
        applicationData.date_candidature,
        applicationData.cv,
        applicationData.lettre_motivation,
        applicationData.statut,
        applicationData.id_offre,
        applicationData.id_user,
      ];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Erreur dans createApplication:", error);
      throw error;
    }
  }

  async getUserApplications(userId) {
    const query = `
      SELECT c.*, oe.titre, oe.description
      FROM Candidature c
      JOIN Offre_emploi oe ON c.id_offre = oe.id_offre
      WHERE c.id_user = $1
      ORDER BY c.date_candidature DESC
    `;

    const result = await db.query(query, [userId]);
    return result.rows;
  }

  async getJobById(id) {
    const query = `
      SELECT oe.*, s.nom as nom_service, tc.nom as type_contract, cp.nom as categorie
      FROM Offre_emploi oe
      JOIN Services s ON oe.id_service = s.id_service
      JOIN Type_contract tc ON oe.id_type_contract = tc.id_type_contract
      JOIN Categorie_personnel cp ON oe.id_categorie_personnel = cp.id_categorie_personnel
      WHERE oe.id_offre = $1
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = new JobService();
