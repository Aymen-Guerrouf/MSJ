/**
 * Populate Database with Valid Sample Data
 *
 * This script creates sample data with:
 * - Valid images matching each category
 * - Strong relationships between entities
 * - Realistic and professional content
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

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

// Category images (same as cleanup script)
const CATEGORY_IMAGES = {
  football: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
  basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  volleyball: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
  chess: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800',
  arts: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
  music: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
  theatre: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
  coding: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
  gaming: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
  education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
  volunteering: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
  culture: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
  health: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
  entrepreneurship: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
  design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
  marketing: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
  other: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
  Technology: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
  Education: 'https://images.unsplash.com/photo-1427504494785-3755977927d7?w=800',
  Healthcare: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
  Environment: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
  Innovation: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
  AI: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
  Mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
  Web: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800',
  'Social Impact': 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800',
  Business: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
  Science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
};

async function populateDatabase() {
  try {
    console.log('🚀 Starting Database Population...\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Create sample users
    console.log('👤 Creating sample users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Check if users already exist and use them or create new ones
    let adminUser = await User.findOne({ email: 'admin-sample@msj.dz' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin Sample',
        email: 'admin-sample@msj.dz',
        password: hashedPassword,
        role: 'center_admin',
        age: 30,
      });
    }

    let supervisorUser = await User.findOne({ email: 'supervisor-sample@msj.dz' });
    if (!supervisorUser) {
      supervisorUser = await User.create({
        name: 'Supervisor Sample',
        email: 'supervisor-sample@msj.dz',
        password: hashedPassword,
        role: 'user',
        age: 35,
        isSupervisor: true,
        supervisorTitle: 'Senior Entrepreneur & Startup Mentor',
        supervisorBio: 'Experienced entrepreneur with 10+ years helping startups grow',
        supervisorExpertise: ['Entrepreneurship', 'Business Development', 'Product Management'],
      });
    }

    let regularUser1 = await User.findOne({ email: 'ahmed.sample@example.com' });
    if (!regularUser1) {
      regularUser1 = await User.create({
        name: 'Ahmed Benali',
        email: 'ahmed.sample@example.com',
        password: hashedPassword,
        role: 'user',
        age: 22,
        interests: ['coding', 'tech', 'education'],
      });
    }

    let regularUser2 = await User.findOne({ email: 'fatima.sample@example.com' });
    if (!regularUser2) {
      regularUser2 = await User.create({
        name: 'Fatima Zerrouki',
        email: 'fatima.sample@example.com',
        password: hashedPassword,
        role: 'user',
        age: 21,
        interests: ['arts', 'design', 'culture'],
      });
    }

    let regularUser3 = await User.findOne({ email: 'youssef.sample@example.com' });
    if (!regularUser3) {
      regularUser3 = await User.create({
        name: 'Youssef Mansouri',
        email: 'youssef.sample@example.com',
        password: hashedPassword,
        role: 'user',
        age: 24,
        interests: ['football', 'health', 'volunteering'],
      });
    }

    console.log('  ✅ Created 5 users\n');

    // Create centers
    console.log('📍 Creating centers...');
    const center1 = await Center.create({
      name: 'Maison des Jeunes Algiers Central',
      wilaya: 'Algiers',
      address: '123 Didouche Mourad, Algiers',
      phone: '021234567',
      email: 'algiers@msj.dz',
      latitude: 36.7538,
      longitude: 3.0588,
      images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
      adminIds: [adminUser._id],
    });

    const center2 = await Center.create({
      name: 'Maison des Jeunes Oran',
      wilaya: 'Oran',
      address: '456 Boulevard de la Revolution, Oran',
      phone: '041234567',
      email: 'oran@msj.dz',
      latitude: 35.6969,
      longitude: -0.6331,
      images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
      adminIds: [adminUser._id],
    });

    console.log('  ✅ Created 2 centers\n');

    // Create clubs
    console.log('🏛️  Creating clubs...');
    const clubs = [];

    const clubData = [
      {
        centerId: center1._id,
        name: 'Coding & Tech Club',
        description: 'Learn programming, build apps, and explore the world of technology',
        category: 'coding',
        createdBy: adminUser._id,
      },
      {
        centerId: center1._id,
        name: 'Entrepreneurship Hub',
        description: 'For aspiring entrepreneurs to develop business ideas and network',
        category: 'entrepreneurship',
        createdBy: adminUser._id,
      },
      {
        centerId: center1._id,
        name: 'Football Club',
        description: 'Weekly football training and friendly matches',
        category: 'football',
        createdBy: adminUser._id,
      },
      {
        centerId: center2._id,
        name: 'Arts & Design Studio',
        description: 'Creative space for artists and designers to collaborate',
        category: 'arts',
        createdBy: adminUser._id,
      },
      {
        centerId: center2._id,
        name: 'Music Academy',
        description: 'Learn instruments, music theory, and perform together',
        category: 'music',
        createdBy: adminUser._id,
      },
    ];

    for (const data of clubData) {
      const club = await Club.create({
        ...data,
        images: [CATEGORY_IMAGES[data.category]],
        memberIds: [regularUser1._id, regularUser2._id],
      });
      clubs.push(club);
    }

    console.log(`  ✅ Created ${clubs.length} clubs\n`);

    // Create events
    console.log('📅 Creating events...');
    const events = [];

    const eventData = [
      {
        centerId: center1._id,
        clubId: clubs[0]._id, // Coding Club
        title: 'Hackathon 2025',
        description: '24-hour coding competition to build innovative solutions',
        date: new Date('2025-12-15'),
        category: 'coding',
        createdBy: adminUser._id,
      },
      {
        centerId: center1._id,
        clubId: clubs[1]._id, // Entrepreneurship
        title: 'Startup Pitch Night',
        description: 'Present your startup ideas to investors and mentors',
        date: new Date('2025-11-20'),
        category: 'entrepreneurship',
        createdBy: adminUser._id,
      },
      {
        centerId: center1._id,
        clubId: clubs[2]._id, // Football
        title: 'Inter-Center Football Tournament',
        description: 'Regional football championship between youth centers',
        date: new Date('2025-11-25'),
        category: 'football',
        createdBy: adminUser._id,
      },
      {
        centerId: center2._id,
        clubId: clubs[3]._id, // Arts
        title: 'Art Exhibition: Youth Vision',
        description: 'Showcase of artwork created by young artists',
        date: new Date('2025-12-01'),
        category: 'arts',
        createdBy: adminUser._id,
      },
      {
        centerId: center2._id,
        clubId: clubs[4]._id, // Music
        title: 'Live Music Concert',
        description: 'Evening of live performances by local musicians',
        date: new Date('2025-12-10'),
        category: 'music',
        createdBy: adminUser._id,
      },
    ];

    for (const data of eventData) {
      const event = await Event.create({
        ...data,
        image: CATEGORY_IMAGES[data.category],
        participantIds: [regularUser1._id, regularUser2._id, regularUser3._id],
      });
      events.push(event);
    }

    console.log(`  ✅ Created ${events.length} events\n`);

    // Create workshops
    console.log('🎓 Creating workshops...');
    const workshops = [];

    const workshopData = [
      {
        centerId: center1._id,
        clubId: clubs[0]._id,
        title: 'Web Development Fundamentals',
        description: 'Learn HTML, CSS, and JavaScript from scratch',
        date: new Date('2025-11-18'),
        category: 'coding',
        mentorId: 'Mohamed Alami',
        price: 0,
        createdBy: adminUser._id,
      },
      {
        centerId: center1._id,
        clubId: clubs[0]._id,
        title: 'Introduction to Artificial Intelligence',
        description: 'Explore AI concepts and build your first ML model',
        date: new Date('2025-11-22'),
        category: 'tech',
        mentorId: 'Dr. Sarah Boudiaf',
        price: 0,
        createdBy: adminUser._id,
      },
      {
        centerId: center1._id,
        clubId: clubs[1]._id,
        title: 'Business Model Canvas Workshop',
        description: 'Transform your idea into a viable business model',
        date: new Date('2025-11-19'),
        category: 'entrepreneurship',
        mentorId: 'Karim Benali',
        price: 0,
        createdBy: adminUser._id,
      },
      {
        centerId: center2._id,
        clubId: clubs[3]._id,
        title: 'UI/UX Design Masterclass',
        description: 'Design beautiful and user-friendly interfaces',
        date: new Date('2025-11-21'),
        category: 'design',
        mentorId: 'Amina Lahlou',
        price: 0,
        createdBy: adminUser._id,
      },
      {
        centerId: center2._id,
        clubId: clubs[4]._id,
        title: 'Guitar Basics for Beginners',
        description: 'Learn to play your first songs on guitar',
        date: new Date('2025-11-24'),
        category: 'music',
        mentorId: 'Yacine Mammeri',
        price: 0,
        createdBy: adminUser._id,
      },
    ];

    for (const data of workshopData) {
      const workshop = await Workshop.create({
        ...data,
        image: CATEGORY_IMAGES[data.category],
      });
      workshops.push(workshop);
    }

    console.log(`  ✅ Created ${workshops.length} workshops\n`);

    // Create startup ideas (sparks)
    console.log('💡 Creating startup ideas (sparks)...');
    const sparks = [];

    const sparkData = [
      {
        title: 'EduConnect Algeria',
        description: 'Digital platform connecting students with tutors across Algeria',
        category: 'Education',
        problemStatement:
          'Many students struggle to find quality tutoring in their area, especially in remote regions',
        solution:
          'An AI-powered matching platform that connects students with qualified tutors for online and in-person sessions',
        targetMarket:
          'High school and university students across Algeria, starting in major cities',
        businessModel: 'Marketplace',
        owner: regularUser1._id,
        status: 'public',
        supervisor: supervisorUser._id,
      },
      {
        title: 'HealthTrack AI',
        description: 'Personal health monitoring app using AI to track wellness',
        category: 'Healthcare',
        problemStatement:
          'People struggle to maintain healthy habits and track their wellness effectively',
        solution:
          'Mobile app that uses AI to analyze health data, provide personalized recommendations, and motivate users',
        targetMarket: 'Health-conscious individuals aged 20-45',
        businessModel: 'Freemium',
        owner: regularUser2._id,
        status: 'public',
        supervisor: supervisorUser._id,
      },
      {
        title: 'GreenCycle',
        description: 'Smart recycling platform to reduce waste and promote sustainability',
        category: 'Environment',
        problemStatement:
          'Recycling rates are low due to lack of awareness and inconvenient processes',
        solution:
          'Mobile app that gamifies recycling, provides pickup services, and rewards users for sustainable behavior',
        targetMarket: 'Urban residents and environmentally conscious consumers',
        businessModel: 'Service-Based',
        owner: regularUser3._id,
        status: 'pending_review',
        supervisor: supervisorUser._id,
      },
      {
        title: 'CodeMentor DZ',
        description: 'Platform for Algerian developers to learn and collaborate',
        category: 'Technology',
        problemStatement:
          'Aspiring developers lack structured learning paths and mentorship opportunities',
        solution:
          'Online learning platform with Algerian tech mentors, project-based curriculum, and job placement support',
        targetMarket: 'Youth interested in tech careers, bootcamp students',
        businessModel: 'SaaS (Subscription)',
        owner: regularUser1._id,
        status: 'public',
        supervisor: supervisorUser._id,
      },
      {
        title: 'LocalMart Algeria',
        description: 'E-commerce platform for local artisans and producers',
        category: 'Business',
        problemStatement: 'Local artisans struggle to reach wider markets and compete with imports',
        solution:
          'Digital marketplace showcasing authentic Algerian products with integrated payment and delivery',
        targetMarket: 'Consumers seeking authentic local products, tourists, diaspora',
        businessModel: 'E-commerce',
        owner: regularUser2._id,
        status: 'public',
        supervisor: supervisorUser._id,
      },
    ];

    for (const data of sparkData) {
      const spark = await StartupIdea.create({
        ...data,
        images: [CATEGORY_IMAGES[data.category]],
      });
      sparks.push(spark);
    }

    console.log(`  ✅ Created ${sparks.length} startup ideas\n`);

    // Final statistics
    console.log('✨ Database population completed!\n');
    console.log('📊 Summary:');
    console.log(`   Users: ${await User.countDocuments()}`);
    console.log(`   Centers: ${await Center.countDocuments()}`);
    console.log(`   Clubs: ${await Club.countDocuments()}`);
    console.log(`   Events: ${await Event.countDocuments()}`);
    console.log(`   Workshops: ${await Workshop.countDocuments()}`);
    console.log(`   Sparks: ${await StartupIdea.countDocuments()}`);
    console.log('');
    console.log('🔐 Sample Login Credentials:');
    console.log('   Admin: admin-sample@msj.dz / password123');
    console.log('   Supervisor: supervisor-sample@msj.dz / password123');
    console.log('   User: ahmed.sample@example.com / password123');
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the script
populateDatabase()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
