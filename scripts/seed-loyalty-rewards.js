'use strict';

// One-off seed for the loyalty-reward collection type — the Rewards screen's
// catalog. TalonOne has no fetchable reward-catalog endpoint (see
// docs/talonone-loyalty-integration.md §3.4 in attache-app), so this app/CMS
// owns the listing; each entry just describes what a TalonOne campaign rule's
// effects do. Run with:
//   PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/seed-loyalty-rewards.js
// (Strapi must be stopped — this boots its own instance against the same DB.)

async function setPublicPermissions(uid) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  for (const action of ['find', 'findOne']) {
    const existing = await strapi.query('plugin::users-permissions.permission').findOne({
      where: { action: `${uid}.${action}`, role: publicRole.id },
    });
    if (!existing) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: { action: `${uid}.${action}`, role: publicRole.id },
      });
    }
  }
}

async function upsertByName(uid, data) {
  const existing = await strapi.documents(uid).findFirst({ filters: { name: data.name } });
  if (existing) {
    await strapi.documents(uid).update({ documentId: existing.documentId, data, status: 'published' });
    console.log(`Updated existing ${uid} entry: ${data.name}`);
  } else {
    const created = await strapi.documents(uid).create({ data, status: 'published' });
    console.log(`Created ${uid} entry: ${data.name} (${created.documentId})`);
  }
}

const REWARDS = [
  {
    name: 'Free pool sunbed slot',
    description: 'Redeem for a complimentary sunbed reservation at the Pool Club.',
    pointCost: 200,
    amenity: 'pool',
    redemptionType: 'giveaway',
    giveawayPoolId: 'pool-sunbed-free',
    active: true,
  },
  {
    name: 'Complimentary shisha session',
    description: 'One free shisha session for you and your guests.',
    pointCost: 150,
    amenity: 'shisha',
    redemptionType: 'giveaway',
    giveawayPoolId: 'shisha-free',
    active: true,
  },
  {
    name: '10% off your restaurant bill',
    description: 'A 10% discount applied to your next attaché restaurant reservation.',
    pointCost: 500,
    amenity: 'restaurant',
    redemptionType: 'discount',
    discountPercent: 10,
    active: true,
  },
  {
    name: 'Free guest pass',
    description: 'Bring a guest on us — one complimentary guest pass for any amenity.',
    pointCost: 300,
    amenity: 'general',
    redemptionType: 'giveaway',
    giveawayPoolId: 'guest-pass-free',
    active: true,
  },
];

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  await setPublicPermissions('api::loyalty-reward.loyalty-reward');

  for (const reward of REWARDS) {
    await upsertByName('api::loyalty-reward.loyalty-reward', reward);
  }

  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
