-- CreateTable
CREATE TABLE "ReglementContrat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contratId" TEXT NOT NULL,
    "texte" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReglementContrat_contratId_fkey" FOREIGN KEY ("contratId") REFERENCES "Contrat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
