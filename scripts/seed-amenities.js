'use strict';

// One-off seed for the Pool/Gym/Restaurant/Room amenity-page single types,
// mirroring attache-app's mock layout in each amenities/*.tsx screen, so the
// CMS path renders identically to the mock fallback once live. Run with:
//   PATH="/opt/homebrew/opt/node@20/bin:$PATH" node scripts/seed-amenities.js
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

async function upsertSingleType(uid, data) {
  const existing = await strapi.documents(uid).findFirst({});
  if (existing) {
    await strapi.documents(uid).update({ documentId: existing.documentId, data, status: 'published' });
    console.log(`Updated existing ${uid} entry.`);
  } else {
    const created = await strapi.documents(uid).create({ data, status: 'published' });
    console.log(`Created ${uid} entry:`, created.documentId);
  }
}

const CONTACT = {
  body: 'attaché is easily accessible via Olaya and King Fahd Road. Ample parking is available on-site.',
  hours: 'Mon - Fri: 9:00am - 5:00pm',
  address: '12531 Al Safarat, Riyadh',
  email: 'info@attache.sa',
  phone: '+966 00 000 0000',
};

async function seedPool() {
  const [hero, content, contentBg, event1, event2] = await Promise.all([
    uploadFile('pool-hero.png'),
    uploadFile('pool-content.png'),
    uploadFile('pool-content-bg.jpg'),
    uploadFile('pool-event-1.png'),
    uploadFile('pool-event-2.png'),
  ]);

  await upsertSingleType('api::pool-page.pool-page', {
    hero: { heading: 'pool', body: LOREM, image: hero.id },
    sections: [
      {
        __component: 'sections.content',
        heading: 'cabana or sunbed? why not both.',
        body: LOREM,
        cta: 'Poolside menu',
        image: content.id,
        background: contentBg.id,
      },
      {
        __component: 'sections.carousel',
        heading: "what's on",
        body: LOREM,
        items: [
          { title: 'Poolside DJ Set', date: '29.05.25', location: 'Pool Club', image: event1.id, tags: ['Events'] },
          { title: 'Sunset Sessions', date: '22.05.25', location: 'Pool Club', image: event2.id, tags: ['Events'] },
        ],
      },
    ],
    rules: {
      title: 'rules',
      body: LOREM,
      items: [
        { icon: 'camera-outline', label: 'No photography' },
        { icon: 'people-outline', label: 'Mixed groups only' },
        { icon: 'card-outline', label: '25+ ID required' },
        { icon: 'shirt-outline', label: 'Smart casual dress' },
        { icon: 'document-text-outline', label: 'No visa no entry' },
        { icon: 'sunny-outline', label: 'No hats or sunglasses' },
      ],
    },
    contact: CONTACT,
  });
}

async function seedGym() {
  const [hero, content1, contentBg1, content2, contentBg2] = await Promise.all([
    uploadFile('gym-hero.jpg'),
    uploadFile('gym-content-1.png'),
    uploadFile('gym-content-bg-1.jpg'),
    uploadFile('gym-content-2.png'),
    uploadFile('gym-content-bg-2.jpg'),
  ]);

  await upsertSingleType('api::gym-page.gym-page', {
    hero: { heading: 'gym', body: LOREM, image: hero.id },
    sections: [
      {
        __component: 'sections.content',
        heading: 'attaché private training',
        body: LOREM,
        cta: 'Find a trainer',
        image: content1.id,
        background: contentBg1.id,
      },
      {
        __component: 'sections.content',
        heading: 'attaché gym',
        body: LOREM,
        cta: 'Book',
        image: content2.id,
        background: contentBg2.id,
      },
    ],
    additionalServices: {
      title: 'additional services',
      body: LOREM,
      items: [
        { icon: 'shirt-outline', label: 'Laundry service' },
        { icon: 'restaurant-outline', label: 'Nutritional Menu' },
        { icon: 'barbell-outline', label: 'Gym Classes & PT' },
        { icon: 'lock-open-outline', label: 'Exclusive Access' },
        { icon: 'musical-notes-outline', label: 'Curated Music' },
        { icon: 'water-outline', label: 'Showers and Locker Rooms' },
      ],
    },
    contact: CONTACT,
  });
}

async function seedRestaurant() {
  const [hero, menu, menuBg, shisha, shishaBg] = await Promise.all([
    uploadFile('restaurant-hero.jpg'),
    uploadFile('restaurant-menu.jpg'),
    uploadFile('restaurant-menu-bg.jpg'),
    uploadFile('restaurant-shisha.jpg'),
    uploadFile('restaurant-shisha-bg.jpg'),
  ]);

  await upsertSingleType('api::restaurant-page.restaurant-page', {
    hero: { heading: 'restaurant & lounge', body: LOREM, image: hero.id },
    sections: [
      {
        __component: 'sections.content',
        heading: 'come hungry. leave speechless.',
        body: LOREM,
        cta: 'View menu',
        ctaLink: '/amenities/restaurant-nutrition-menu',
        image: menu.id,
        background: menuBg.id,
        backgroundOpacity: 0.4,
      },
      {
        __component: 'sections.content',
        heading: 'not just a lounge-- a state of mind',
        body: LOREM,
        cta: 'View shisha menu',
        image: shisha.id,
        background: shishaBg.id,
        backgroundOpacity: 0.2,
      },
    ],
    contact: CONTACT,
    menuCategories: [
      {
        name: 'Healthy Bites',
        sections: [
          {
            name: 'Salads',
            items: [
              {
                name: 'Quinoa Tabbouleh',
                description: 'Parsley, mint, tomato, quinoa, lemon dressing.',
                vegan: true,
                glutenFree: true,
              },
              {
                name: 'Caesar Salad',
                description: 'Romaine, parmesan, croutons, grilled chicken.',
                vegetarian: false,
              },
            ],
          },
          {
            name: 'Bowls',
            items: [
              {
                name: 'Buddha Bowl',
                description: 'Roasted vegetables, chickpeas, tahini, brown rice.',
                vegan: true,
                glutenFree: true,
                dairyFree: true,
              },
              {
                name: 'Acai Bowl',
                description: 'Acai, granola, banana, berries, honey.',
                vegetarian: true,
              },
            ],
          },
        ],
      },
      {
        name: 'Protein Bowls',
        sections: [
          {
            name: 'Power Plates',
            items: [
              {
                name: 'Grilled Chicken Bowl',
                description: 'Grilled chicken, sweet potato, broccoli, quinoa.',
                glutenFree: true,
                dairyFree: true,
              },
              {
                name: 'Salmon Poke',
                description: 'Seared salmon, edamame, avocado, sushi rice.',
                dairyFree: true,
              },
            ],
          },
        ],
      },
    ],
  });
}

async function seedRoom() {
  const hero = await uploadFile('room-hero.jpg');

  await upsertSingleType('api::room-page.room-page', {
    hero: { heading: 'room', body: LOREM, image: hero.id },
    sections: [],
    contact: CONTACT,
  });
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  for (const uid of [
    'api::pool-page.pool-page',
    'api::gym-page.gym-page',
    'api::restaurant-page.restaurant-page',
    'api::room-page.room-page',
    'api::discover-page.discover-page',
  ]) {
    await setPublicPermissions(uid);
  }

  await seedPool();
  await seedGym();
  await seedRestaurant();
  await seedRoom();

  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
