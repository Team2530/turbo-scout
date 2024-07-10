-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "state_prov" TEXT,
    "country" TEXT
);
INSERT INTO "new_Team" ("city", "country", "id", "name", "state_prov") SELECT "city", "country", "id", "name", "state_prov" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_id_key" ON "Team"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
