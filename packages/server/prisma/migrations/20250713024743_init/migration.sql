-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'INTEREST', 'FEE', 'DEATH_PENALTY');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characters" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "gold" INTEGER NOT NULL DEFAULT 0,
    "alignment" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastPlayedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_accounts" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "lastBankedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL,
    "description" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xp_ledger" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "xpChange" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xp_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pk_kill_logs" (
    "id" TEXT NOT NULL,
    "killerId" TEXT NOT NULL,
    "victimId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "zoneId" TEXT,

    CONSTRAINT "pk_kill_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE INDEX "accounts_email_idx" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "characters_name_key" ON "characters"("name");

-- CreateIndex
CREATE INDEX "characters_accountId_idx" ON "characters"("accountId");

-- CreateIndex
CREATE INDEX "characters_name_idx" ON "characters"("name");

-- CreateIndex
CREATE INDEX "characters_level_idx" ON "characters"("level");

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_characterId_key" ON "bank_accounts"("characterId");

-- CreateIndex
CREATE INDEX "bank_accounts_characterId_idx" ON "bank_accounts"("characterId");

-- CreateIndex
CREATE INDEX "transactions_characterId_idx" ON "transactions"("characterId");

-- CreateIndex
CREATE INDEX "transactions_timestamp_idx" ON "transactions"("timestamp");

-- CreateIndex
CREATE INDEX "xp_ledger_characterId_idx" ON "xp_ledger"("characterId");

-- CreateIndex
CREATE INDEX "xp_ledger_timestamp_idx" ON "xp_ledger"("timestamp");

-- CreateIndex
CREATE INDEX "pk_kill_logs_killerId_idx" ON "pk_kill_logs"("killerId");

-- CreateIndex
CREATE INDEX "pk_kill_logs_victimId_idx" ON "pk_kill_logs"("victimId");

-- CreateIndex
CREATE INDEX "pk_kill_logs_timestamp_idx" ON "pk_kill_logs"("timestamp");

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xp_ledger" ADD CONSTRAINT "xp_ledger_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pk_kill_logs" ADD CONSTRAINT "pk_kill_logs_killerId_fkey" FOREIGN KEY ("killerId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pk_kill_logs" ADD CONSTRAINT "pk_kill_logs_victimId_fkey" FOREIGN KEY ("victimId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
