/**
 * Database Cleanup and Validation Script
 *
 * This script:
 * 1. Cleans invalid data from the database
 * 2. Ensures all entities have valid images
 * 3. Assigns appropriate topic-related images based on categories
 * 4. Validates and fixes relationships between entities
 * 5. Removes orphaned records
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import models
import Center from '../src/models/center.model.js';
import Event from '../src/models/event.model.js';
import Workshop from '../src/models/workshop.model.js';
import StartupIdea from '../src/models/startupIdea.model.js';
import Club from '../src/models/club.model.js';
import User from '../src/models/user.model.js';

// Category-based default images from Unsplash (free to use)
const CATEGORY_IMAGES = {
  // Sports
  football: [
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  ],
  basketball: [
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800',
    'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=800',
  ],
  volleyball: [
    'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
    'https://images.unsplash.com/photo-1593107486322-14e7e4bac31c?w=800',
    'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800',
  ],
  chess: [
    'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800',
    'https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=800',
    'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=800',
  ],

  // Arts & Culture
  arts: [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800',
  ],
  music: [
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800',
  ],
  theatre: [
    'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
    'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
  ],
  design: [
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    'https://images.unsplash.com/photo-1558403194-611308249627?w=800',
    'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800',
  ],

  // Tech & Education
  coding: [
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
  ],
  tech: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
  ],
  gaming: [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
  ],
  education: [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
  ],

  // Business & Social
  entrepreneurship: [
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
  ],
  marketing: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
  ],
  volunteering: [
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
  ],
  culture: [
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
  ],
  health: [
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
  ],

  // Startup Categories
  Technology: [
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
  ],
  Education: [
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
  ],
  Healthcare: [
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800',
    'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800',
  ],
  Environment: [
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800',
    'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800',
  ],
  Innovation: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
  ],
  AI: [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800',
    'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=800',
  ],
  Mobile: [
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    'https://images.unsplash.com/photo-1601972599748-76be6cff6833?w=800',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
  ],
  Web: [
    'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
  ],
  'Social Impact': [
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800',
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800',
    'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=800',
  ],
  Business: [
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  ],
  Science: [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
  ],

  // Default
  other: [
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=800',
  ],
};

// Default center images
const DEFAULT_CENTER_IMAGES = [
  'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
];

/**
 * Get a random image for a category
 */
function getImageForCategory(category) {
  const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.other;
  return images[Math.floor(Math.random() * images.length)];
}

/**
 * Validate and fix image URLs
 */
function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return (
    /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url) ||
    /^https?:\/\/.*unsplash\.com.*$/i.test(url) ||
    /^https?:\/\/.*cloudinary\.com.*$/i.test(url)
  );
}

/**
 * Clean and validate Centers
 */
async function cleanCenters() {
  console.log('\n📍 Cleaning Centers...');

  const centers = await Center.find({});
  let updated = 0;
  let deleted = 0;

  for (const center of centers) {
    let needsUpdate = false;

    // Validate required fields
    if (!center.name || !center.wilaya || !center.address || !center.phone || !center.email) {
      console.log(
        `  ❌ Deleting invalid center (missing required fields): ${center.name || center._id}`
      );
      await Center.deleteOne({ _id: center._id });
      deleted++;
      continue;
    }

    // Clean and validate images
    if (!center.images || center.images.length === 0) {
      center.images = [
        DEFAULT_CENTER_IMAGES[Math.floor(Math.random() * DEFAULT_CENTER_IMAGES.length)],
      ];
      needsUpdate = true;
    } else {
      const validImages = center.images.filter(isValidImageUrl);
      if (validImages.length === 0) {
        center.images = [
          DEFAULT_CENTER_IMAGES[Math.floor(Math.random() * DEFAULT_CENTER_IMAGES.length)],
        ];
        needsUpdate = true;
      } else if (validImages.length !== center.images.length) {
        center.images = validImages;
        needsUpdate = true;
      }
    }

    // Validate adminIds exist
    if (center.adminIds && center.adminIds.length > 0) {
      const validAdmins = [];
      for (const adminId of center.adminIds) {
        const adminExists = await User.findById(adminId);
        if (adminExists) {
          validAdmins.push(adminId);
        }
      }
      if (validAdmins.length !== center.adminIds.length) {
        center.adminIds = validAdmins;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      await center.save();
      updated++;
      console.log(`  ✅ Updated center: ${center.name}`);
    }
  }

  console.log(`  📊 Centers: ${updated} updated, ${deleted} deleted`);
}

/**
 * Clean and validate Events
 */
async function cleanEvents() {
  console.log('\n📅 Cleaning Events...');

  const events = await Event.find({});
  let updated = 0;
  let deleted = 0;

  for (const event of events) {
    let needsUpdate = false;
    const shouldDelete = false;

    // Validate centerId exists
    const centerExists = await Center.findById(event.centerId);
    if (!centerExists) {
      console.log(`  ❌ Deleting event (center not found): ${event.title}`);
      await Event.deleteOne({ _id: event._id });
      deleted++;
      continue;
    }

    // Validate clubId if present
    if (event.clubId) {
      const clubExists = await Club.findById(event.clubId);
      if (!clubExists) {
        console.log(`  ⚠️  Removing invalid clubId from event: ${event.title}`);
        event.clubId = null;
        needsUpdate = true;
      }
    }

    // Validate createdBy exists
    const creatorExists = await User.findById(event.createdBy);
    if (!creatorExists) {
      console.log(`  ❌ Deleting event (creator not found): ${event.title}`);
      await Event.deleteOne({ _id: event._id });
      deleted++;
      continue;
    }

    // Validate and assign image based on category
    if (!event.image || !isValidImageUrl(event.image)) {
      event.image = getImageForCategory(event.category);
      needsUpdate = true;
    }

    // Validate required fields
    if (!event.title || !event.description || !event.date || !event.category) {
      console.log(`  ❌ Deleting event (missing required fields): ${event.title || event._id}`);
      await Event.deleteOne({ _id: event._id });
      deleted++;
      continue;
    }

    // Clean participantIds
    if (event.participantIds && event.participantIds.length > 0) {
      const validParticipants = [];
      for (const userId of event.participantIds) {
        const userExists = await User.findById(userId);
        if (userExists) {
          validParticipants.push(userId);
        }
      }
      if (validParticipants.length !== event.participantIds.length) {
        event.participantIds = validParticipants;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      await event.save();
      updated++;
      console.log(`  ✅ Updated event: ${event.title}`);
    }
  }

  console.log(`  📊 Events: ${updated} updated, ${deleted} deleted`);
}

/**
 * Clean and validate Workshops
 */
async function cleanWorkshops() {
  console.log('\n🎓 Cleaning Workshops...');

  const workshops = await Workshop.find({});
  let updated = 0;
  let deleted = 0;

  for (const workshop of workshops) {
    let needsUpdate = false;

    // Validate centerId exists
    const centerExists = await Center.findById(workshop.centerId);
    if (!centerExists) {
      console.log(`  ❌ Deleting workshop (center not found): ${workshop.title}`);
      await Workshop.deleteOne({ _id: workshop._id });
      deleted++;
      continue;
    }

    // Validate clubId if present
    if (workshop.clubId) {
      const clubExists = await Club.findById(workshop.clubId);
      if (!clubExists) {
        console.log(`  ⚠️  Removing invalid clubId from workshop: ${workshop.title}`);
        workshop.clubId = null;
        needsUpdate = true;
      }
    }

    // Validate createdBy exists
    const creatorExists = await User.findById(workshop.createdBy);
    if (!creatorExists) {
      console.log(`  ❌ Deleting workshop (creator not found): ${workshop.title}`);
      await Workshop.deleteOne({ _id: workshop._id });
      deleted++;
      continue;
    }

    // Validate and assign image based on category
    if (!workshop.image || !isValidImageUrl(workshop.image)) {
      workshop.image = getImageForCategory(workshop.category);
      needsUpdate = true;
    }

    // Validate required fields
    if (!workshop.title || !workshop.description || !workshop.date || !workshop.category) {
      console.log(
        `  ❌ Deleting workshop (missing required fields): ${workshop.title || workshop._id}`
      );
      await Workshop.deleteOne({ _id: workshop._id });
      deleted++;
      continue;
    }

    if (needsUpdate) {
      await workshop.save();
      updated++;
      console.log(`  ✅ Updated workshop: ${workshop.title}`);
    }
  }

  console.log(`  📊 Workshops: ${updated} updated, ${deleted} deleted`);
}

/**
 * Clean and validate Startup Ideas (Sparks)
 */
async function cleanStartupIdeas() {
  console.log('\n💡 Cleaning Startup Ideas (Sparks)...');

  const sparks = await StartupIdea.find({});
  let updated = 0;
  let deleted = 0;

  for (const spark of sparks) {
    let needsUpdate = false;

    // Validate owner exists
    const ownerExists = await User.findById(spark.owner);
    if (!ownerExists) {
      console.log(`  ❌ Deleting spark (owner not found): ${spark.title}`);
      await StartupIdea.deleteOne({ _id: spark._id });
      deleted++;
      continue;
    }

    // Validate supervisor if present
    if (spark.supervisor) {
      const supervisorExists = await User.findById(spark.supervisor);
      if (!supervisorExists) {
        console.log(`  ⚠️  Removing invalid supervisor from spark: ${spark.title}`);
        spark.supervisor = null;
        needsUpdate = true;
      }
    }

    // Validate and assign images based on category
    if (!spark.images || spark.images.length === 0) {
      spark.images = [getImageForCategory(spark.category)];
      needsUpdate = true;
    } else {
      const validImages = spark.images.filter(isValidImageUrl);
      if (validImages.length === 0) {
        spark.images = [getImageForCategory(spark.category)];
        needsUpdate = true;
      } else if (validImages.length !== spark.images.length) {
        spark.images = validImages;
        needsUpdate = true;
      }
    }

    // Validate required fields
    if (
      !spark.title ||
      !spark.description ||
      !spark.category ||
      !spark.problemStatement ||
      !spark.solution ||
      !spark.targetMarket
    ) {
      console.log(`  ❌ Deleting spark (missing required fields): ${spark.title || spark._id}`);
      await StartupIdea.deleteOne({ _id: spark._id });
      deleted++;
      continue;
    }

    if (needsUpdate) {
      await spark.save();
      updated++;
      console.log(`  ✅ Updated spark: ${spark.title}`);
    }
  }

  console.log(`  📊 Sparks: ${updated} updated, ${deleted} deleted`);
}

/**
 * Clean and validate Clubs (Annexes)
 */
async function cleanClubs() {
  console.log('\n🏛️  Cleaning Clubs (Annexes)...');

  const clubs = await Club.find({});
  let updated = 0;
  let deleted = 0;

  for (const club of clubs) {
    let needsUpdate = false;

    // Validate centerId exists
    const centerExists = await Center.findById(club.centerId);
    if (!centerExists) {
      console.log(`  ❌ Deleting club (center not found): ${club.name}`);
      await Club.deleteOne({ _id: club._id });
      deleted++;
      continue;
    }

    // Validate createdBy exists
    const creatorExists = await User.findById(club.createdBy);
    if (!creatorExists) {
      console.log(`  ❌ Deleting club (creator not found): ${club.name}`);
      await Club.deleteOne({ _id: club._id });
      deleted++;
      continue;
    }

    // Validate and assign images based on category
    if (!club.images || club.images.length === 0) {
      club.images = [getImageForCategory(club.category)];
      needsUpdate = true;
    } else {
      const validImages = club.images.filter(isValidImageUrl);
      if (validImages.length === 0) {
        club.images = [getImageForCategory(club.category)];
        needsUpdate = true;
      } else if (validImages.length !== club.images.length) {
        club.images = validImages;
        needsUpdate = true;
      }
    }

    // Clean memberIds
    if (club.memberIds && club.memberIds.length > 0) {
      const validMembers = [];
      for (const userId of club.memberIds) {
        const userExists = await User.findById(userId);
        if (userExists) {
          validMembers.push(userId);
        }
      }
      if (validMembers.length !== club.memberIds.length) {
        club.memberIds = validMembers;
        needsUpdate = true;
      }
    }

    // Validate required fields
    if (!club.name || !club.description || !club.category) {
      console.log(`  ❌ Deleting club (missing required fields): ${club.name || club._id}`);
      await Club.deleteOne({ _id: club._id });
      deleted++;
      continue;
    }

    if (needsUpdate) {
      await club.save();
      updated++;
      console.log(`  ✅ Updated club: ${club.name}`);
    }
  }

  console.log(`  📊 Clubs: ${updated} updated, ${deleted} deleted`);
}

/**
 * Main cleanup function
 */
async function cleanupDatabase() {
  try {
    console.log('🚀 Starting Database Cleanup and Validation...\n');
    console.log(
      'Database:',
      process.env.MONGODB_URI?.replace(/\/\/.*:.*@/, '//***:***@') || 'Not configured'
    );

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Run cleanup for each entity type
    await cleanCenters();
    await cleanClubs();
    await cleanEvents();
    await cleanWorkshops();
    await cleanStartupIdeas();

    console.log('\n✨ Database cleanup completed successfully!\n');

    // Generate summary
    const stats = {
      centers: await Center.countDocuments(),
      clubs: await Club.countDocuments(),
      events: await Event.countDocuments(),
      workshops: await Workshop.countDocuments(),
      sparks: await StartupIdea.countDocuments(),
    };

    console.log('📊 Final Database Statistics:');
    console.log(`   Centers: ${stats.centers}`);
    console.log(`   Clubs: ${stats.clubs}`);
    console.log(`   Events: ${stats.events}`);
    console.log(`   Workshops: ${stats.workshops}`);
    console.log(`   Sparks: ${stats.sparks}`);
    console.log('');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the script
cleanupDatabase()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
