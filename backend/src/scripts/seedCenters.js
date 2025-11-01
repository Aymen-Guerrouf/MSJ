import mongoose from 'mongoose';
import Center from '../models/center.model.js';
import Club from '../models/club.model.js';
import Event from '../models/event.model.js';
import Workshop from '../models/workshop.model.js';
import User from '../models/user.model.js';
import config from '../config/index.js';

const centersData = [
  {
    name: 'Maison de Jeunes Alger Centre',
    wilaya: 'Alger',
    latitude: 36.7732,
    longitude: 3.0587,
    address: 'Rue Didouche Mourad, Alger',
    phone: '+213 21 00 00 00',
    email: 'centre@msj-alger.dz',
    images: ['https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200'],
    clubs: [
      {
        name: 'Coding Club',
        description: 'Learn programming and build amazing projects together',
        category: 'tech',
        images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200'],
      },
      {
        name: 'Music Band',
        description: 'Express yourself through music and perform together',
        category: 'arts',
        images: ['https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=1200'],
      },
    ],
    events: [
      {
        title: 'Hackathon Junior',
        description: 'A 24-hour coding competition for young developers',
        date: new Date('2025-12-14T10:00:00'),
        category: 'coding',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200',
        seats: 50,
      },
      {
        title: 'Open Mic Night',
        description: 'Showcase your talent in front of a live audience',
        date: new Date('2025-12-20T19:00:00'),
        category: 'music',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200',
        seats: 100,
      },
    ],
  },
  {
    name: 'Annexe Bab El Oued',
    wilaya: 'Alger',
    latitude: 36.7928,
    longitude: 3.0479,
    address: 'Bab El Oued, Alger',
    phone: '+213 21 11 22 33',
    email: 'babeloued@msj-alger.dz',
    images: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200'],
    clubs: [
      {
        name: 'Coding Club',
        description: 'Learn programming and build amazing projects together',
        category: 'tech',
        images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200'],
      },
      {
        name: 'Music Band',
        description: 'Express yourself through music and perform together',
        category: 'arts',
        images: ['https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=1200'],
      },
    ],
    events: [
      {
        title: 'Hackathon Junior',
        description: 'A 24-hour coding competition for young developers',
        date: new Date('2025-12-14T10:00:00'),
        category: 'coding',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200',
        seats: 40,
      },
      {
        title: 'Open Mic Night',
        description: 'Showcase your talent in front of a live audience',
        date: new Date('2025-12-20T19:00:00'),
        category: 'music',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200',
        seats: 80,
      },
    ],
  },
  {
    name: 'Annexe Kouba',
    wilaya: 'Alger',
    latitude: 36.7206,
    longitude: 3.081,
    address: 'Kouba, Alger',
    phone: '+213 21 44 55 66',
    email: 'kouba@msj-alger.dz',
    images: ['https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200'],
    clubs: [
      {
        name: 'Coding Club',
        description: 'Learn programming and build amazing projects together',
        category: 'tech',
        images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200'],
      },
      {
        name: 'Music Band',
        description: 'Express yourself through music and perform together',
        category: 'arts',
        images: ['https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=1200'],
      },
    ],
    events: [
      {
        title: 'Hackathon Junior',
        description: 'A 24-hour coding competition for young developers',
        date: new Date('2025-12-14T10:00:00'),
        category: 'coding',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200',
        seats: 45,
      },
      {
        title: 'Open Mic Night',
        description: 'Showcase your talent in front of a live audience',
        date: new Date('2025-12-20T19:00:00'),
        category: 'music',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200',
        seats: 90,
      },
    ],
  },
  {
    name: 'Maison de Jeunes Oran Centre',
    wilaya: 'Oran',
    latitude: 35.6969,
    longitude: -0.6331,
    address: 'Boulevard de la Soummam, Oran',
    phone: '+213 41 33 44 55',
    email: 'centre@msj-oran.dz',
    images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1200'],
    clubs: [
      {
        name: 'Photography Club',
        description: 'Capture moments and learn the art of photography',
        category: 'arts',
        images: ['https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1200'],
      },
      {
        name: 'Sports Club',
        description: 'Stay active and healthy through various sports activities',
        category: 'sports',
        images: ['https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200'],
      },
    ],
    events: [
      {
        title: 'Photography Exhibition',
        description: 'Showcase your best shots in our annual photo exhibition',
        date: new Date('2025-12-28T14:00:00'),
        category: 'art',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200',
        seats: 60,
      },
    ],
    workshops: [
      {
        title: 'Digital Photography Basics',
        description: 'Learn the fundamentals of digital photography and photo editing',
        date: new Date('2025-12-10T10:00:00'),
        category: 'arts',
        image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200',
        seats: 25,
        price: 1500,
      },
    ],
  },
];

async function seedCenters() {
  try {
    // Connect to database
    console.log('Connecting to database...');
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB');

    // Find or create a system user for creating centers/clubs/events
    let systemUser = await User.findOne({ email: 'system@msj.dz' });
    if (!systemUser) {
      console.log('Creating system user...');
      systemUser = await User.create({
        email: 'system@msj.dz',
        password: 'SystemUser123!',
        name: 'System User',
        age: 30,
        role: 'super_admin',
        isEmailVerified: true,
      });
      console.log('System user created');
    }

    console.log('\nStarting to seed centers...\n');

    for (const centerData of centersData) {
      console.log(`\nProcessing: ${centerData.name}`);

      // Check if center already exists
      let center = await Center.findOne({ name: centerData.name });
      if (center) {
        console.log(`  ✓ Center already exists (ID: ${center._id})`);
      } else {
        // Create center
        center = await Center.create({
          name: centerData.name,
          wilaya: centerData.wilaya,
          latitude: centerData.latitude,
          longitude: centerData.longitude,
          address: centerData.address,
          phone: centerData.phone,
          email: centerData.email,
          images: centerData.images,
          adminIds: [systemUser._id],
        });
        console.log(`  ✓ Center created (ID: ${center._id})`);
      }

      // Create clubs
      console.log(`  Creating clubs...`);
      for (const clubData of centerData.clubs) {
        const existingClub = await Club.findOne({
          centerId: center._id,
          name: clubData.name,
        });

        if (!existingClub) {
          const club = await Club.create({
            centerId: center._id,
            name: clubData.name,
            description: clubData.description,
            category: clubData.category,
            images: clubData.images,
            createdBy: systemUser._id,
            memberIds: [],
          });
          console.log(`    ✓ Club created: ${club.name} (ID: ${club._id})`);
        } else {
          console.log(`    - Club already exists: ${clubData.name}`);
        }
      }

      // Create events
      console.log(`  Creating events...`);
      for (const eventData of centerData.events) {
        const existingEvent = await Event.findOne({
          centerId: center._id,
          title: eventData.title,
        });

        if (!existingEvent) {
          const event = await Event.create({
            centerId: center._id,
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            category: eventData.category,
            image: eventData.image,
            seats: eventData.seats,
            bookedCount: 0,
            status: 'open',
            createdBy: systemUser._id,
          });
          console.log(`    ✓ Event created: ${event.title} (ID: ${event._id})`);
        } else {
          console.log(`    - Event already exists: ${eventData.title}`);
        }
      }

      // Create workshops
      if (centerData.workshops && centerData.workshops.length > 0) {
        console.log(`  Creating workshops...`);
        for (const workshopData of centerData.workshops) {
          const existingWorkshop = await Workshop.findOne({
            centerId: center._id,
            title: workshopData.title,
          });

          if (!existingWorkshop) {
            const workshop = await Workshop.create({
              centerId: center._id,
              title: workshopData.title,
              description: workshopData.description,
              date: workshopData.date,
              category: workshopData.category,
              image: workshopData.image,
              seats: workshopData.seats,
              price: workshopData.price,
              mentorId: systemUser._id,
              bookedCount: 0,
              status: 'open',
              createdBy: systemUser._id,
            });
            console.log(`    ✓ Workshop created: ${workshop.title} (ID: ${workshop._id})`);
          } else {
            console.log(`    - Workshop already exists: ${workshopData.title}`);
          }
        }
      }
    }

    console.log('\n✅ Seeding completed successfully!\n');
    console.log('Summary:');
    const centerCount = await Center.countDocuments();
    const clubCount = await Club.countDocuments();
    const eventCount = await Event.countDocuments();
    const workshopCount = await Workshop.countDocuments();
    console.log(`  - Centers: ${centerCount}`);
    console.log(`  - Clubs: ${clubCount}`);
    console.log(`  - Events: ${eventCount}`);
    console.log(`  - Workshops: ${workshopCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedCenters();
