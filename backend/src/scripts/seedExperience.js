import mongoose from 'mongoose';
import ExperienceSession from '../models/experienceSession.model.js';
import ExperienceCard from '../models/experienceCard.model.js';
import Center from '../models/center.model.js';
import User from '../models/user.model.js';
import { connectDB } from '../config/database.config.js';

const seedExperience = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding experience data...');

    // Get first center and admin
    const center = await Center.findOne();
    const admin = await User.findOne({ role: { $in: ['center_admin', 'super_admin'] } });

    if (!center || !admin) {
      console.log('❌ Need at least 1 center and 1 admin');
      process.exit(1);
    }

    // Create experience session
    const session = await ExperienceSession.create({
      title: 'Youth Leadership Workshop - December 2025',
      description:
        'A transformative session focused on developing leadership skills among young people through interactive activities and group discussions.',
      date: '2025-12-15',
      time: '14:00',
      tag: 'leadership',
      centerId: center._id,
      createdBy: admin._id,
    });

    console.log('✅ Created session:', session.title);

    // Create experience card linked to session
    const card = await ExperienceCard.create({
      title: 'Key Learnings from Youth Leadership Workshop',
      summary:
        'Our December leadership workshop brought together 30 young participants who explored essential leadership qualities. Through team-building exercises, role-playing scenarios, and peer discussions, participants discovered their unique leadership styles. The session emphasized the importance of active listening, empathy, and collaborative decision-making. Many participants reported increased confidence in their ability to lead group projects and initiatives in their communities.',
      lessons: [
        'Effective leadership starts with understanding yourself and your values',
        'Active listening is more powerful than speaking',
        'Teamwork and collaboration achieve better results than individual efforts',
        'Empathy builds trust and strengthens group dynamics',
        'Every young person has leadership potential waiting to be developed',
      ],
      tag: 'leadership',
      centerId: center._id,
      sessionId: session._id,
      createdBy: admin._id,
    });

    console.log('✅ Created card:', card.title);
    console.log('');
    console.log('🎉 Experience data seeded successfully!');
    console.log('');
    console.log('📋 Created:');
    console.log('  - 1 Experience Session');
    console.log('  - 1 Experience Card (linked to session)');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding experience:', error);
    process.exit(1);
  }
};

seedExperience();
