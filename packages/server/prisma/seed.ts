import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // eslint-disable-next-line no-console
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.pkKillLog.deleteMany();
  await prisma.xpLedger.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.bankAccount.deleteMany();
  await prisma.character.deleteMany();
  await prisma.account.deleteMany();

  // Create test accounts
  const testPassword = await bcrypt.hash('testpassword123', 10);

  const account1 = await prisma.account.create({
    data: {
      email: 'player1@aeturnis.com',
      hashedPassword: testPassword,
      lastLoginAt: new Date(),
    },
  });

  const account2 = await prisma.account.create({
    data: {
      email: 'player2@aeturnis.com',
      hashedPassword: testPassword,
      lastLoginAt: new Date(),
    },
  });

  // Create characters for account1
  const char1 = await prisma.character.create({
    data: {
      accountId: account1.id,
      name: 'Dragonslayer',
      level: 10,
      experience: 5000,
      gold: 1500,
      alignment: 500,
      lastPlayedAt: new Date(),
    },
  });

  const char2 = await prisma.character.create({
    data: {
      accountId: account1.id,
      name: 'Shadowmage',
      level: 5,
      experience: 1200,
      gold: 300,
      alignment: -200,
      lastPlayedAt: new Date(Date.now() - 86400000), // 1 day ago
    },
  });

  // Create character for account2
  const char3 = await prisma.character.create({
    data: {
      accountId: account2.id,
      name: 'HolyPaladin',
      level: 8,
      experience: 3500,
      gold: 800,
      alignment: 800,
      lastPlayedAt: new Date(),
    },
  });

  // Create bank accounts
  await prisma.bankAccount.create({
    data: {
      characterId: char1.id,
      balance: 10000,
      lastBankedAt: new Date(),
    },
  });

  await prisma.bankAccount.create({
    data: {
      characterId: char2.id,
      balance: 500,
      lastBankedAt: new Date(Date.now() - 172800000), // 2 days ago
    },
  });

  await prisma.bankAccount.create({
    data: {
      characterId: char3.id,
      balance: 5000,
      lastBankedAt: new Date(),
    },
  });

  // Create some transactions
  await prisma.transaction.createMany({
    data: [
      {
        characterId: char1.id,
        amount: 5000,
        type: 'DEPOSIT',
        description: 'Initial deposit',
      },
      {
        characterId: char1.id,
        amount: 5000,
        type: 'DEPOSIT',
        description: 'Quest reward banking',
      },
      {
        characterId: char2.id,
        amount: 500,
        type: 'DEPOSIT',
        description: 'Small savings',
      },
      {
        characterId: char3.id,
        amount: 5000,
        type: 'DEPOSIT',
        description: 'Safe keeping',
      },
    ],
  });

  // Create XP ledger entries
  await prisma.xpLedger.createMany({
    data: [
      {
        characterId: char1.id,
        xpChange: 1000,
        reason: "Quest: Dragon's Lair completed",
      },
      {
        characterId: char1.id,
        xpChange: 500,
        reason: 'Monster kill: Ancient Dragon',
      },
      {
        characterId: char1.id,
        xpChange: -1000,
        reason: 'Death penalty (20% XP loss)',
      },
      {
        characterId: char2.id,
        xpChange: 300,
        reason: 'Quest: Shadow Trials completed',
      },
      {
        characterId: char3.id,
        xpChange: 800,
        reason: 'Quest: Holy Mission completed',
      },
    ],
  });

  // Create PK kill logs
  await prisma.pkKillLog.createMany({
    data: [
      {
        killerId: char1.id,
        victimId: char2.id,
        zoneId: 'pvp_arena',
      },
      {
        killerId: char3.id,
        victimId: char1.id,
        zoneId: 'wilderness',
      },
    ],
  });

  // eslint-disable-next-line no-console
  console.log('✅ Database seeded successfully!');
  // eslint-disable-next-line no-console
  console.log(`Created ${await prisma.account.count()} accounts`);
  // eslint-disable-next-line no-console
  console.log(`Created ${await prisma.character.count()} characters`);
  // eslint-disable-next-line no-console
  console.log(`Created ${await prisma.bankAccount.count()} bank accounts`);
  // eslint-disable-next-line no-console
  console.log(`Created ${await prisma.transaction.count()} transactions`);
  // eslint-disable-next-line no-console
  console.log(`Created ${await prisma.xpLedger.count()} XP ledger entries`);
  // eslint-disable-next-line no-console
  console.log(`Created ${await prisma.pkKillLog.count()} PK kill logs`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
