CREATE DATABASE RH;

\c rh

CREATE TABLE Users(
   id_user SERIAL,
   login VARCHAR(50)  NOT NULL,
   mail VARCHAR(100)  NOT NULL,
   mdp VARCHAR(250)  NOT NULL,
   est_admin BOOLEAN NOT NULL,
   PRIMARY KEY(id_user)
);

CREATE TABLE Type_contract(
   id_type_contract SERIAL,
   nom VARCHAR(50)  NOT NULL,
   description VARCHAR(50)  NOT NULL,
   duree INTEGER NOT NULL,
   PRIMARY KEY(id_type_contract)
);

CREATE TABLE Salaire(
   id_salaire SERIAL,
   type VARCHAR(50)  NOT NULL,
   montant NUMERIC(15,2)   NOT NULL,
   PRIMARY KEY(id_salaire)
);

CREATE TABLE Services(
   id_service SERIAL,
   nom VARCHAR(50)  NOT NULL,
   PRIMARY KEY(id_service)
);

CREATE TABLE Categorie_personnel(
   id_categorie_personnel SERIAL,
   nom VARCHAR(50)  NOT NULL,
   poste VARCHAR(50)  NOT NULL,
   id_salaire SERIAL NOT NULL,
   PRIMARY KEY(id_categorie_personnel),
   FOREIGN KEY(id_salaire) REFERENCES Salaire(id_salaire)
);

CREATE TABLE Personnels(
   id_personnel SERIAL,
   matricule VARCHAR(50)  NOT NULL,
   nom VARCHAR(100)  NOT NULL,
   prenom VARCHAR(250)  NOT NULL,
   date_naissance DATE NOT NULL,
   adresse VARCHAR(50)  NOT NULL,
   date_embauche DATE NOT NULL,
   id_service INTEGER NOT NULL,
   id_categorie_personnel INTEGER NOT NULL,
   id_user INTEGER NOT NULL,
   PRIMARY KEY(id_personnel),
   UNIQUE(id_user),
   FOREIGN KEY(id_service) REFERENCES Services(id_service),
   FOREIGN KEY(id_categorie_personnel) REFERENCES Categorie_personnel(id_categorie_personnel),
   FOREIGN KEY(id_user) REFERENCES Users(id_user)
);

CREATE TABLE Absences(
   id_absence SERIAL,
   date_absence DATE NOT NULL,
   id_personnel INTEGER NOT NULL,
   PRIMARY KEY(id_absence),
   FOREIGN KEY(id_personnel) REFERENCES Personnels(id_personnel)
);

CREATE TABLE Heure_sup(
   id_heure_sup SERIAL,
   date_heure_sup DATE NOT NULL,
   duree INTEGER NOT NULL,
   id_personnel INTEGER NOT NULL,
   PRIMARY KEY(id_heure_sup),
   FOREIGN KEY(id_personnel) REFERENCES Personnels(id_personnel)
);

CREATE TABLE Heure_nuit(
   id_heure_nuit SERIAL,
   date_heure_nuit DATE NOT NULL,
   duree INTEGER NOT NULL,
   id_personnel INTEGER NOT NULL,
   PRIMARY KEY(id_heure_nuit),
   FOREIGN KEY(id_personnel) REFERENCES Personnels(id_personnel)
);

CREATE TABLE Contrats(
   id_personnel SERIAL ,
   id_type_contract SERIAL,
   date_debut DATE NOT NULL,
   date_fin DATE NOT NULL,
   duree VARCHAR(50)  NOT NULL,
   PRIMARY KEY(id_personnel, id_type_contract),
   FOREIGN KEY(id_personnel) REFERENCES Personnels(id_personnel),
   FOREIGN KEY(id_type_contract) REFERENCES Type_contract(id_type_contract)
);

CREATE TABLE Types_conge(
   id_conge SERIAL,
   type VARCHAR(50)  NOT NULL,
   est_remunere BOOLEAN,
   nombre NUMERIC(15,2)  NOT NULL,
   PRIMARY KEY(id_conge)
);

CREATE TABLE droit_conge(
   id_personnel SERIAL,
   id_conge SERIAL,
   annee INTEGER NOT NULL,
   PRIMARY KEY(id_personnel, id_conge, annee),
   FOREIGN KEY(id_personnel) REFERENCES Personnels(id_personnel),
   FOREIGN KEY(id_conge) REFERENCES Types_conge(id_conge)
);

CREATE TABLE Demandes_conge(
   id_demande_congee SERIAL,
   date_demande TIMESTAMP NOT NULL,
   date_fin TIMESTAMP NOT NULL,
   motif VARCHAR(250) ,
   duree NUMERIC(15,2) NOT NULL,
   est_approuvee BOOLEAN NOT NULL,
   id_conge INTEGER NOT NULL,
   id_personnel INTEGER NOT NULL,
   PRIMARY KEY(id_demande_congee),
   FOREIGN KEY(id_conge) REFERENCES Types_conge(id_conge),
   FOREIGN KEY(id_personnel) REFERENCES Personnels(id_personnel)
);


CREATE OR REPLACE VIEW v_total_demandes_conge AS
SELECT 
    id_personnel,
    id_conge,
    SUM(duree) AS total_demandes
FROM 
    Demandes_conge
WHERE 
    est_approuvee = TRUE
GROUP BY 
    id_personnel, id_conge;

CREATE OR REPLACE VIEW v_conge_dispo AS
SELECT 
    p.id_personnel,
    tc.type AS type_conge,
    (COUNT(dc.annee) * tc.nombre) - COALESCE(td.total_demandes, 0) AS jours_conge_dispo
FROM 
    droit_conge dc
JOIN 
    Types_conge tc ON dc.id_conge = tc.id_conge
JOIN 
    Personnels p ON dc.id_personnel = p.id_personnel
LEFT JOIN 
    v_total_demandes_conge td ON dc.id_personnel = td.id_personnel 
    AND dc.id_conge = td.id_conge
WHERE 
    dc.annee BETWEEN EXTRACT(YEAR FROM CURRENT_DATE) - 3 AND EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY 
    p.id_personnel, tc.type, tc.nombre, td.total_demandes;

CREATE OR REPLACE FUNCTION calculer_conge_dispo(a INTEGER)
RETURNS TABLE (
    id_personnel INTEGER,
    type_conge VARCHAR,
    jours_conge_dispo NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id_personnel,
        tc.type AS type_conge,
        (COUNT(dc.annee) * tc.nombre) - COALESCE(td.total_demandes, 0) AS jours_conge_dispo
    FROM 
        droit_conge dc
    JOIN 
        Types_conge tc ON dc.id_conge = tc.id_conge
    JOIN 
        Personnels p ON dc.id_personnel = p.id_personnel
    LEFT JOIN 
        v_total_demandes_conge td ON dc.id_personnel = td.id_personnel 
        AND dc.id_conge = td.id_conge
    WHERE 
        dc.annee BETWEEN a - 3 AND a
    GROUP BY 
        p.id_personnel, tc.type, tc.nombre, td.total_demandes;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION reset_database()
RETURNS void AS $$
DECLARE
    rec RECORD;
BEGIN
    -- Désactiver les contraintes de clés étrangères
    FOR rec IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    LOOP
        EXECUTE 'ALTER TABLE ' || quote_ident(rec.tablename) || ' DISABLE TRIGGER ALL';
    END LOOP;

    -- Vider toutes les tables
    FOR rec IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(rec.tablename) || ' CASCADE';
    END LOOP;

    -- Réinitialiser toutes les séquences
    FOR rec IN
        SELECT sequence_name
        FROM information_schema.sequences
        WHERE sequence_schema = 'public'
    LOOP
        EXECUTE 'ALTER SEQUENCE ' || quote_ident(rec.sequence_name) || ' RESTART WITH 1';
    END LOOP;

    -- Réactiver les contraintes de clés étrangères
    FOR rec IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    LOOP
        EXECUTE 'ALTER TABLE ' || quote_ident(rec.tablename) || ' ENABLE TRIGGER ALL';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

