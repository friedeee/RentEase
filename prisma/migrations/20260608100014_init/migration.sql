-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Proprietaire" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Bien" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "proprietaireId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bien_proprietaireId_fkey" FOREIGN KEY ("proprietaireId") REFERENCES "Proprietaire" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Chambre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "superficie" REAL NOT NULL,
    "loyer" REAL NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'libre',
    "bienId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Chambre_bienId_fkey" FOREIGN KEY ("bienId") REFERENCES "Bien" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Locataire" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cni" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Contrat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locataireId" TEXT NOT NULL,
    "chambreId" TEXT NOT NULL,
    "dateDebut" DATETIME NOT NULL,
    "dateFin" DATETIME,
    "loyer" REAL NOT NULL,
    "caution" REAL NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'actif',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Contrat_locataireId_fkey" FOREIGN KEY ("locataireId") REFERENCES "Locataire" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Contrat_chambreId_fkey" FOREIGN KEY ("chambreId") REFERENCES "Chambre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contratId" TEXT NOT NULL,
    "montant" REAL NOT NULL,
    "datePaiement" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moisConcerne" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'paye',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Paiement_contratId_fkey" FOREIGN KEY ("contratId") REFERENCES "Contrat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Recu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paiementId" TEXT NOT NULL,
    "numeroRecu" TEXT NOT NULL,
    "dateGeneration" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Recu_paiementId_fkey" FOREIGN KEY ("paiementId") REFERENCES "Paiement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Recu_paiementId_key" ON "Recu"("paiementId");

-- CreateIndex
CREATE UNIQUE INDEX "Recu_numeroRecu_key" ON "Recu"("numeroRecu");
