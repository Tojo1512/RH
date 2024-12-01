CREATE TABLE Evaluation(
    id_evaluation SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL,
    date_evaluation DATE NOT NULL,
    note INTEGER NOT NULL,
    commentaire TEXT NOT NULL,
    FOREIGN KEY(id_user) REFERENCES Users(id_user)
);