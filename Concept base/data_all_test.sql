-- Insertion des services
INSERT INTO Services (nom) VALUES
('Ressources Humaines'),
('Informatique'),
('Comptabilité'),
('Marketing'),
('Production');

-- Insertion des types de contrats
INSERT INTO Type_contract (nom, description, duree) VALUES
('CDI', 'Contrat à Durée Indéterminée', 0),
('CDD', 'Contrat à Durée Déterminée', 12),
('Stage', 'Stage conventionné', 6),
('Alternance', 'Contrat en alternance', 24);

-- Insertion des salaires
INSERT INTO Salaire (type, montant) VALUES
('Junior', 30000.00),
('Confirmé', 45000.00),
('Senior', 60000.00),
('Manager', 75000.00);

-- Insertion des catégories de personnel
INSERT INTO Categorie_personnel (nom, poste, id_salaire) VALUES
('Technique', 'Développeur', 1),
('Technique', 'Architecte', 3),
('RH', 'Chargé de recrutement', 2),
('Marketing', 'Chef de projet', 4);

-- Insertion des utilisateurs de test
INSERT INTO Users (login, mail, mdp, est_admin) VALUES
('john_doe', 'john@example.com', '$2b$10$encrypted_password', false),
('jane_smith', 'jane@example.com', '$2b$10$encrypted_password', false),
('admin_user', 'admin@example.com', '$2b$10$encrypted_password', true);

-- Insertion des offres d'emploi
INSERT INTO Offre_emploi (
    titre, 
    description, 
    date_publication, 
    date_limite_candidature, 
    statut, 
    salaire_min, 
    salaire_max, 
    id_service, 
    id_type_contract, 
    id_categorie_personnel
) VALUES
(
    'Développeur Full Stack',
    'Nous recherchons un développeur Full Stack expérimenté maîtrisant Vue.js et Node.js. 
    Vous travaillerez sur des projets innovants dans un environnement dynamique.',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    'Actif',
    35000.00,
    45000.00,
    2, -- Service Informatique
    1, -- CDI
    1  -- Développeur
),
(
    'Chargé de recrutement H/F',
    'Rejoignez notre équipe RH pour gérer le recrutement et le développement des talents.
    Expérience minimum de 3 ans requise.',
    CURRENT_DATE - INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '25 days',
    'Actif',
    32000.00,
    38000.00,
    1, -- Service RH
    2, -- CDD
    3  -- Chargé de recrutement
),
(
    'Stage - Marketing Digital',
    'Stage de 6 mois en marketing digital. Vous participerez à la stratégie digitale
    et à la gestion des réseaux sociaux.',
    CURRENT_DATE - INTERVAL '2 days',
    CURRENT_DATE + INTERVAL '20 days',
    'Actif',
    1800.00,
    1800.00,
    4, -- Service Marketing
    3, -- Stage
    4  -- Marketing
);

-- Insertion des candidatures de test
INSERT INTO Candidature (
    date_candidature,
    cv,
    lettre_motivation,
    statut,
    id_offre,
    id_user
) VALUES
(
    CURRENT_DATE - INTERVAL '2 days',
    'Mon parcours inclut 5 ans d''expérience en développement web...',
    'Je suis très intéressé par le poste de développeur Full Stack...',
    'En cours',
    1,
    1
),
(
    CURRENT_DATE - INTERVAL '1 day',
    'Diplômé en ressources humaines avec 3 ans d''expérience...',
    'Je souhaite rejoindre votre équipe RH...',
    'En cours',
    2,
    2
);
