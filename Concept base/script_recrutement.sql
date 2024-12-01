CREATE TABLE Offre_emploi(
   id_offre SERIAL PRIMARY KEY,
   titre VARCHAR(100) NOT NULL,
   description TEXT NOT NULL,
   date_publication DATE NOT NULL,
   date_limite_candidature DATE NOT NULL,
   statut VARCHAR(50) NOT NULL,
   salaire_min NUMERIC(15,2),
   salaire_max NUMERIC(15,2),
   id_service INTEGER NOT NULL,
   id_type_contract INTEGER NOT NULL,
   id_categorie_personnel INTEGER NOT NULL,
   FOREIGN KEY(id_service) REFERENCES Services(id_service),
   FOREIGN KEY(id_type_contract) REFERENCES Type_contract(id_type_contract),
   FOREIGN KEY(id_categorie_personnel) REFERENCES Categorie_personnel(id_categorie_personnel)
);


CREATE TABLE Candidature(
   id_candidature SERIAL PRIMARY KEY,
   date_candidature DATE NOT NULL,
   cv TEXT NOT NULL,
   lettre_motivation TEXT NOT NULL,
   statut VARCHAR(50) NOT NULL,
   id_offre INTEGER NOT NULL,
   id_user INTEGER NOT NULL,
   FOREIGN KEY(id_offre) REFERENCES Offre_emploi(id_offre),
   FOREIGN KEY(id_user) REFERENCES Users(id_user)
);
