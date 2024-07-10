/*
  Warnings:

  - Added the required column `city` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state_prov` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state_prov" TEXT NOT NULL,
    "country" TEXT NOT NULL
);
INSERT INTO "new_Team" ("id", "name") SELECT "id", "name" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_id_key" ON "Team"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
