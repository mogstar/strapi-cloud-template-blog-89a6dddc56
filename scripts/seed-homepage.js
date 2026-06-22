'use strict';

// One-off seed for the Homepage single type, mirroring the exact mock layout
// in attache-app's src/app/(tabs)/home.tsx, so the CMS path renders
// identically to the mock fallback once live. Run with:
//   PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/seed-homepage.js
// (Strapi must be stopped — this boots its own instance against the same DB.)

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');

const LOREM =
  'Nunc putate libero et velit interdum ac aliquet omattis libero et velit interdum libero.';

function getFileData(fileName) {
  const filePath = path.join('data', 'uploads', fileName);
  const size = fs.statSync(filePath)['size'];
  const ext = fileName.split('.').pop();
  const mimetype = mime.lookup(ext || '') || '';
  return { filepath: filePath, originalFileName: fileName, size, mimetype };
}

async function uploadFile(fileName) {
  const existing = await strapi.query('plugin::upload.file').findOne({
    where: { name: fileName.replace(/\..*$/, '') },
  });
  if (existing) return existing;

  const name = fileName.split('.').shift();
  const [file] = await strapi.plugin('upload').service('upload').upload({
    files: getFileData(fileName),
    data: { fileInfo: { alternativeText: name, caption: name, name } },
  });
  return file;
}

async function setPublicPermissions() {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  for (const action of ['find', 'findOne']) {
    const existing = await strapi.query('plugin::users-permissions.permission').findOne({
      where: { action: `api::homepage.homepage.${action}`, role: publicRole.id },
    });
    if (!existing) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: { action: `api::homepage.homepage.${action}`, role: publicRole.id },
      });
    }
  }
}

async function seedHomepage() {
  const [hero, joinUs, riyadh, dining, about] = await Promise.all([
    uploadFile('hero.jpg'),
    uploadFile('join-us.jpg'),
    uploadFile('riyadh.jpg'),
    uploadFile('dining.jpg'),
    uploadFile('about.jpg'),
  ]);

  const sections = [
    {
      __component: 'sections.hero',
      heading: 'welcome\nto attaché',
      image: hero.id,
      ctaPrimaryLabel: 'Book',
      ctaSecondaryLabel: 'Profile',
    },
    {
      __component: 'sections.content',
      heading: 'join us',
      body: LOREM,
      video: true,
      cta: 'Enquire now',
      image: joinUs.id,
    },
    {
      __component: 'sections.content',
      heading: 'introducing attaché riyadh',
      body: LOREM,
      image: riyadh.id,
      background: 'diamond-lilac',
      backgroundOpacity: 0.4,
    },
    {
      __component: 'sections.carousel',
      subheading: 'clubbing',
      heading: 'UNSTABLE upcoming events',
      body: LOREM,
      items: [
        { title: 'Korolova DJ Set', date: '29.05.25', location: 'UNSTABLE', tags: ['Events', 'UNSTABLE'] },
        { title: 'Adam Beyer DJ Set', date: '22.05.25', location: 'UNSTABLE', tags: ['Events', 'UNSTABLE'] },
      ],
    },
    {
      __component: 'sections.content',
      subheading: 'dining',
      heading: 'attaché restaurant',
      body: LOREM,
      cta: 'Explore restaurant & shisha',
      ctaLink: '/booking/sevenrooms',
      image: dining.id,
      background: 'damask-tan',
      backgroundOpacity: 0.4,
    },
    {
      __component: 'sections.full-bleed',
      heading: 'about attaché',
      body: LOREM,
      linkLabel: 'Explore',
      image: about.id,
    },
    {
      __component: 'sections.carousel',
      subheading: 'reading',
      heading: 'attaché editorial',
      body: LOREM,
      background: 'guilloche-waves',
      backgroundOpacity: 0.3,
      items: [
        { title: 'Inside the Beast', date: '12.05.25', location: 'Riyadh', tags: ['Events', 'UNSTABLE'] },
        { title: 'A night at attaché', date: '04.05.25', location: 'Riyadh', tags: ['Events', 'UNSTABLE'] },
      ],
    },
  ];

  const existing = await strapi.documents('api::homepage.homepage').findFirst({});
  if (existing) {
    await strapi.documents('api::homepage.homepage').update({
      documentId: existing.documentId,
      data: { sections },
      status: 'published',
    });
    console.log('Updated existing Homepage entry.');
  } else {
    const created = await strapi.documents('api::homepage.homepage').create({
      data: { sections },
      status: 'published',
    });
    console.log('Created Homepage entry:', created.documentId);
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  await setPublicPermissions();
  await seedHomepage();

  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
