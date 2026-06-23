'use strict';

// One-off seed for the `global` singleType's `contact` field — the single
// site-wide Contact Us sheet popped up from the bottom-nav Contact tab, no
// longer duplicated per amenity page. Run with:
//   PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/seed-global.js
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

const DATA = {
  siteName: 'attaché',
  siteDescription: 'MDLBeast attaché — premium concierge & membership app.',
  contact: {
    body: 'attaché is easily accessible via Olaya and King Fahd Road. Ample parking is available on-site.',
    hours: 'Mon - Fri: 9:00am - 5:00pm',
    address: '12531 Al Safarat, Riyadh',
    email: 'info@attache.sa',
    phone: '+966 00 000 0000',
  },
};

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  await setPublicPermissions('api::global.global');

  // global has draftAndPublish disabled — no `status` param needed/accepted.
  const existing = await strapi.documents('api::global.global').findFirst({});
  if (existing) {
    await strapi.documents('api::global.global').update({ documentId: existing.documentId, data: DATA });
    console.log('Updated existing global entry.');
  } else {
    const created = await strapi.documents('api::global.global').create({ data: DATA });
    console.log('Created global entry:', created.documentId);
  }

  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
