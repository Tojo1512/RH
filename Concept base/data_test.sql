-- Insérer des utilisateurs
INSERT INTO Users (login, mail, mdp, est_admin) VALUES
('user1', 'user1@example.com', 'password1', FALSE),
('user2', 'user2@example.com', 'password2', TRUE),
('user3', 'user3@example.com', 'password3', FALSE);

-- Insérer des types de contrat
INSERT INTO Type_contract (nom, description, duree) VALUES
('CDI', 'Contrat à durée indéterminée', 0),
('CDD', 'Contrat à durée déterminée', 12),
('Stage', 'Contrat de stage', 6);

-- Insérer des salaires
INSERT INTO Salaire (type, montant) VALUES
('Mensuel', 3000.00),
('Horaire', 20.00),
('Annuel', 36000.00);

-- Insérer des services
INSERT INTO Services (nom) VALUES
('Informatique'),
('Ressources Humaines'),
('Marketing');

-- Insérer des catégories de personnel
INSERT INTO Categorie_personnel (nom, poste, id_salaire) VALUES
('Développeur', 'Ingénieur logiciel', 1),
('RH', 'Gestionnaire RH', 2),
('Marketeur', 'Spécialiste marketing', 3);

-- Insérer des personnels
INSERT INTO Personnels (matricule, nom, prenom, date_naissance, adresse, date_embauche, id_service, id_categorie_personnel, id_user) VALUES
('M001', 'Dupont', 'Jean', '1985-05-15', '123 Rue A', '2010-06-01', 1, 1, 1),
('M002', 'Martin', 'Marie', '1990-07-20', '456 Rue B', '2015-09-15', 2, 2, 2),
('M003', 'Durand', 'Paul', '1982-11-30', '789 Rue C', '2008-01-10', 3, 3, 3);

-- Insérer des absences
INSERT INTO Absences (date_absence, id_personnel) VALUES
('2023-01-15', 1),
('2023-02-20', 2),
('2023-03-25', 3);

-- Insérer des heures supplémentaires
INSERT INTO Heure_sup (date_heure_sup, duree, id_personnel) VALUES
('2023-04-10', 2, 1),
('2023-05-15', 3, 2),
('2023-06-20', 1, 3);

-- Insérer des heures de nuit
INSERT INTO Heure_nuit (date_heure_nuit, duree, id_personnel) VALUES
('2023-07-05', 4, 1),
('2023-08-10', 5, 2),
('2023-09-15', 6, 3);

-- Insérer des contrats
INSERT INTO Contrats (id_personnel, id_type_contract, date_debut, date_fin, duree) VALUES
(1, 1, '2020-01-01', '2025-01-01', '5 ans'),
(2, 2, '2021-02-01', '2022-02-01', '1 an'),
(3, 3, '2022-03-01', '2022-09-01', '6 mois');

-- Insérer des types de congé
INSERT INTO Types_conge (type, est_remunere, nombre) VALUES
('Vacances', TRUE, 30),
('Maladie', TRUE, 15),
('Formation', FALSE, 10);

-- Insérer des droits de congé
INSERT INTO droit_conge (id_personnel, id_conge, annee) VALUES
(1, 1, 2022),
(2, 1, 2022),
(3, 1, 2022),
(1, 1, 2023),
(2, 1, 2023),
(3, 1, 2023),
(1, 1, 2024),
(2, 1, 2024),
(3, 1, 2024),
(1, 2, 2022),
(2, 2, 2022),
(3, 2, 2022),
(1, 2, 2023),
(2, 2, 2023),
(3, 2, 2023),
(1, 2, 2024),
(2, 2, 2024),
(3, 2, 2024),
(1, 3, 2022),
(2, 3, 2022),
(3, 3, 2022),
(1, 3, 2023),
(2, 3, 2023),
(3, 3, 2023),
(1, 3, 2024),
(2, 3, 2024),
(3, 3, 2024);

-- Insérer des demandes de congé
INSERT INTO Demandes_conge (date_demande, date_fin, motif, duree, est_approuvee, id_conge, id_personnel) VALUES
('2024-01-01', '2024-01-10', 'Vacances', 10, TRUE, 1, 1),
('2022-02-01', '2022-02-05', 'Maladie', 5, FALSE, 2, 1),
('2023-03-01', '2023-03-03', 'Formation', 3, TRUE, 3, 1),
('2023-01-01', '2023-01-10', 'Vacances', 10, TRUE, 1, 2),
('2024-02-01', '2024-02-05', 'Maladie', 5, FALSE, 2, 2),
('2022-03-01', '2022-03-03', 'Formation', 3, TRUE, 3, 2),
('2022-01-01', '2022-01-10', 'Vacances', 10, TRUE, 1, 3),
('2023-02-01', '2023-02-05', 'Maladie', 5, FALSE, 2, 3),
('2024-03-01', '2024-03-03', 'Formation', 3, TRUE, 3, 3);

SELECT * FROM calculer_conge_dispo('2024-01-01');