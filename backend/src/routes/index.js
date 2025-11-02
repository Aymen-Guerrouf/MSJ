import express from 'express';
import authRoutes from './auth.routes.js';
import healthRoutes from './health.routes.js';
import userRoutes from './user.routes.js'
import centerRoutes from './center.routes.js';
import eventRoutes from './event.routes.js';
import workshopRoutes from './workshop.routes.js';
import eventRegistrationRoutes from './eventRegistration.routes.js';
import workshopEnrollmentRoutes from './workshopEnrollment.routes.js';
import clubMembershipRoutes from './clubMembership.routes.js';
import clubRoutes from './club.routes.js';
import experienceSessionRoutes from './experienceSession.routes.js';
import experienceCardRoutes from './experienceCard.routes.js';
import virtualSchoolRoutes from './virtualSchool.routes.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/user', userRoutes)
router.use('/centers', centerRoutes);
router.use('/events', eventRoutes);
router.use('/workshops', workshopRoutes);
router.use('/event-registrations', eventRegistrationRoutes);
router.use('/workshop-enrollments', workshopEnrollmentRoutes);
router.use('/club-memberships', clubMembershipRoutes);
router.use('/clubs', clubRoutes);
router.use('/experience-sessions', experienceSessionRoutes);
router.use('/experience-cards', experienceCardRoutes);
router.use('/virtual-school', virtualSchoolRoutes);

export default router;
