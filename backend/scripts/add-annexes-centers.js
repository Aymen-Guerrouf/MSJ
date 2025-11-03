/**
 * Add Annexes Centers Across Algeria
 *
 * This script creates annex centers (Maisons des Jeunes) across all wilayas of Algeria
 * - Setif center has hasTour: true
 * - Includes centers in all regions including Sahara
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
import User from '../src/models/user.model.js';
import Event from '../src/models/event.model.js';
import Workshop from '../src/models/workshop.model.js';
import Club from '../src/models/club.model.js';

// Annexes Centers data for all Algeria including Sahara
const ANNEXES_DATA = [
  // Northern Algeria
  {
    name: 'Maison des Jeunes Sétif',
    wilaya: 'Sétif',
    address: 'Avenue 8 Mai 1945, Cité Maabouda, Sétif 19000',
    phone: '036123456',
    email: 'setif@msj.dz',
    latitude: 36.1905,
    longitude: 5.4103,
    hasTour: true, // Setif has tour
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
  },
  {
    name: 'Maison des Jeunes Constantine',
    wilaya: 'Constantine',
    address: 'Boulevard de la Victoire, Constantine',
    phone: '031234567',
    email: 'constantine@msj.dz',
    latitude: 36.365,
    longitude: 6.6147,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  },
  {
    name: 'Maison des Jeunes Annaba',
    wilaya: 'Annaba',
    address: 'Rue de la Révolution, Annaba',
    phone: '038234567',
    email: 'annaba@msj.dz',
    latitude: 36.9,
    longitude: 7.7667,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
  },
  {
    name: 'Maison des Jeunes Batna',
    wilaya: 'Batna',
    address: "Avenue de l'Indépendance, Batna",
    phone: '033345678',
    email: 'batna@msj.dz',
    latitude: 35.5559,
    longitude: 6.1738,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  },
  {
    name: 'Maison des Jeunes Blida',
    wilaya: 'Blida',
    address: 'Boulevard Ben Boulaid, Blida',
    phone: '025456789',
    email: 'blida@msj.dz',
    latitude: 36.4803,
    longitude: 2.8277,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
  },
  {
    name: 'Maison des Jeunes Tizi Ouzou',
    wilaya: 'Tizi Ouzou',
    address: 'Rue Abane Ramdane, Tizi Ouzou',
    phone: '026567890',
    email: 'tiziouzou@msj.dz',
    latitude: 36.7167,
    longitude: 4.05,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
  },
  {
    name: 'Maison des Jeunes Béjaïa',
    wilaya: 'Béjaïa',
    address: 'Boulevard de la Liberté, Béjaïa',
    phone: '034678901',
    email: 'bejaia@msj.dz',
    latitude: 36.7525,
    longitude: 5.0556,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
  },
  {
    name: 'Maison des Jeunes Tlemcen',
    wilaya: 'Tlemcen',
    address: 'Avenue de la Mekka, Tlemcen',
    phone: '043789012',
    email: 'tlemcen@msj.dz',
    latitude: 34.8833,
    longitude: -1.3167,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  },
  {
    name: 'Maison des Jeunes Mostaganem',
    wilaya: 'Mostaganem',
    address: 'Boulevard National, Mostaganem',
    phone: '045890123',
    email: 'mostaganem@msj.dz',
    latitude: 35.9311,
    longitude: 0.0894,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
  },
  {
    name: 'Maison des Jeunes Skikda',
    wilaya: 'Skikda',
    address: 'Avenue 20 Août 1955, Skikda',
    phone: '038901234',
    email: 'skikda@msj.dz',
    latitude: 36.8667,
    longitude: 6.9,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  },

  // Central and High Plateaus
  {
    name: 'Maison des Jeunes Médéa',
    wilaya: 'Médéa',
    address: 'Centre Ville, Médéa',
    phone: '025012345',
    email: 'medea@msj.dz',
    latitude: 36.2639,
    longitude: 2.7539,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
  },
  {
    name: "Maison des Jeunes M'Sila",
    wilaya: "M'Sila",
    address: "Boulevard de la République, M'Sila",
    phone: '035123456',
    email: 'msila@msj.dz',
    latitude: 35.7,
    longitude: 4.5333,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  },
  {
    name: 'Maison des Jeunes Bordj Bou Arréridj',
    wilaya: 'Bordj Bou Arréridj',
    address: 'Rue Ahmed Bouguerra, BBA',
    phone: '035234567',
    email: 'bba@msj.dz',
    latitude: 36.0685,
    longitude: 4.7648,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
  },
  {
    name: 'Maison des Jeunes Djelfa',
    wilaya: 'Djelfa',
    address: "Avenue de l'ALN, Djelfa",
    phone: '027345678',
    email: 'djelfa@msj.dz',
    latitude: 34.6703,
    longitude: 3.2631,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  },
  {
    name: 'Maison des Jeunes Tiaret',
    wilaya: 'Tiaret',
    address: 'Boulevard de la Liberté, Tiaret',
    phone: '046456789',
    email: 'tiaret@msj.dz',
    latitude: 35.3711,
    longitude: 1.3225,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
  },

  // Sahara Region - Important inclusion
  {
    name: 'Maison des Jeunes Ouargla',
    wilaya: 'Ouargla',
    address: 'Avenue Emir Abdelkader, Ouargla',
    phone: '029567890',
    email: 'ouargla@msj.dz',
    latitude: 31.9492,
    longitude: 5.3258,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
  },
  {
    name: 'Maison des Jeunes Ghardaïa',
    wilaya: 'Ghardaïa',
    address: "Boulevard Larbi Ben M'Hidi, Ghardaïa",
    phone: '029678901',
    email: 'ghardaia@msj.dz',
    latitude: 32.4911,
    longitude: 3.6761,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  },
  {
    name: 'Maison des Jeunes Tamanrasset',
    wilaya: 'Tamanrasset',
    address: 'Centre Ville, Tamanrasset',
    phone: '029789012',
    email: 'tamanrasset@msj.dz',
    latitude: 22.785,
    longitude: 5.5228,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
  },
  {
    name: 'Maison des Jeunes Béchar',
    wilaya: 'Béchar',
    address: 'Boulevard de la Victoire, Béchar',
    phone: '049890123',
    email: 'bechar@msj.dz',
    latitude: 31.6167,
    longitude: -2.2167,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  },
  {
    name: 'Maison des Jeunes Adrar',
    wilaya: 'Adrar',
    address: 'Avenue Colonel Lotfi, Adrar',
    phone: '049901234',
    email: 'adrar@msj.dz',
    latitude: 27.8742,
    longitude: -0.2936,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
  },
  {
    name: 'Maison des Jeunes Laghouat',
    wilaya: 'Laghouat',
    address: 'Boulevard Emir Abdelkader, Laghouat',
    phone: '029012345',
    email: 'laghouat@msj.dz',
    latitude: 33.8,
    longitude: 2.8667,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  },
  {
    name: 'Maison des Jeunes Biskra',
    wilaya: 'Biskra',
    address: 'Avenue de la République, Biskra',
    phone: '033123456',
    email: 'biskra@msj.dz',
    latitude: 34.8514,
    longitude: 5.7248,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
  },
  {
    name: 'Maison des Jeunes El Oued',
    wilaya: 'El Oued',
    address: "Boulevard de l'Indépendance, El Oued",
    phone: '032234567',
    email: 'eloued@msj.dz',
    latitude: 33.3675,
    longitude: 6.8636,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  },
  {
    name: 'Maison des Jeunes Illizi',
    wilaya: 'Illizi',
    address: 'Centre Ville, Illizi',
    phone: '029345678',
    email: 'illizi@msj.dz',
    latitude: 26.5,
    longitude: 8.4833,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
  },
  {
    name: 'Maison des Jeunes Tindouf',
    wilaya: 'Tindouf',
    address: 'Avenue Principale, Tindouf',
    phone: '049456789',
    email: 'tindouf@msj.dz',
    latitude: 27.6711,
    longitude: -8.1475,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  },

  // Additional important cities
  {
    name: 'Maison des Jeunes Jijel',
    wilaya: 'Jijel',
    address: 'Boulevard du 1er Novembre, Jijel',
    phone: '034567890',
    email: 'jijel@msj.dz',
    latitude: 36.82,
    longitude: 5.7667,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
  },
  {
    name: 'Maison des Jeunes Bouira',
    wilaya: 'Bouira',
    address: 'Rue Ali Lounici, Bouira',
    phone: '026678901',
    email: 'bouira@msj.dz',
    latitude: 36.3689,
    longitude: 3.9006,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
  },
  {
    name: 'Maison des Jeunes Chlef',
    wilaya: 'Chlef',
    address: 'Boulevard Colonel Bounaama, Chlef',
    phone: '027789012',
    email: 'chlef@msj.dz',
    latitude: 36.1647,
    longitude: 1.3347,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  },
  {
    name: 'Maison des Jeunes Saïda',
    wilaya: 'Saïda',
    address: 'Avenue de la Révolution, Saïda',
    phone: '048890123',
    email: 'saida@msj.dz',
    latitude: 34.8333,
    longitude: 0.15,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
  },
  {
    name: 'Maison des Jeunes Relizane',
    wilaya: 'Relizane',
    address: 'Boulevard Houari Boumediene, Relizane',
    phone: '046901234',
    email: 'relizane@msj.dz',
    latitude: 35.7372,
    longitude: 0.5561,
    hasTour: false,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  },
];

async function addAnnexesCenters() {
  try {
    console.log('🚀 Starting to add Annexes Centers across Algeria...\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find an admin user to assign to centers
    let adminUser = await User.findOne({ role: 'center_admin' });
    if (!adminUser) {
      adminUser = await User.findOne({ role: 'super_admin' });
    }
    if (!adminUser) {
      adminUser = await User.findOne();
    }

    if (!adminUser) {
      console.log('⚠️  No admin user found. Creating a default admin...');
      const bcrypt = (await import('bcrypt')).default;
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser = await User.create({
        name: 'System Admin',
        email: 'systemadmin@msj.dz',
        password: hashedPassword,
        role: 'center_admin',
        age: 30,
      });
      console.log('✅ Created default admin user\n');
    }

    console.log('📍 Creating annex centers...');
    const createdCenters = [];

    for (const centerData of ANNEXES_DATA) {
      // Check if center already exists
      const existingCenter = await Center.findOne({
        $or: [
          { name: centerData.name },
          { wilaya: centerData.wilaya, address: centerData.address },
        ],
      });

      if (existingCenter) {
        console.log(`  ⚠️  Center already exists: ${centerData.name} in ${centerData.wilaya}`);
        continue;
      }

      const center = await Center.create({
        ...centerData,
        adminIds: [adminUser._id],
      });

      createdCenters.push(center);

      if (centerData.hasTour) {
        console.log(`  ✅ Created: ${center.name} in ${center.wilaya} (hasTour: true) ⭐`);
      } else {
        console.log(`  ✅ Created: ${center.name} in ${center.wilaya}`);
      }
    }

    // Create Hackathon Event for Setif Center
    console.log('\n🎉 Creating Hackathon 2025 event for Sétif...');
    const setifCenter = await Center.findOne({ wilaya: 'Sétif', name: 'Maison des Jeunes Sétif' });

    if (setifCenter) {
      // Check if event already exists
      const existingEvent = await Event.findOne({
        title: 'Hackathon 2025 - Sétif',
        centerId: setifCenter._id,
      });

      if (!existingEvent) {
        const hackathonEvent = await Event.create({
          centerId: setifCenter._id,
          title: 'Hackathon 2025 - Sétif',
          description: `🚀 Grand Hackathon National 2025 - Sétif Edition

Organisé par le Ministère de la Jeunesse et des Sports en partenariat avec la Maison des Jeunes de Sétif.

📅 Un événement exceptionnel de 48 heures consacré à l'innovation technologique et à l'entrepreneuriat numérique.

🎯 Objectifs :
• Encourager l'innovation technologique chez les jeunes
• Développer des solutions numériques pour les défis locaux
• Créer une communauté de développeurs et entrepreneurs
• Promouvoir la culture startup en Algérie

💡 Thèmes principaux :
• Intelligence Artificielle et Machine Learning
• Applications mobiles innovantes
• Solutions e-gov pour l'administration
• AgriTech et solutions pour l'agriculture
• EdTech - Technologies éducatives
• HealthTech - Santé digitale
• Green Tech - Solutions environnementales

🏆 Prix et récompenses :
1ère place : 500,000 DA + Incubation gratuite pendant 6 mois
2ème place : 300,000 DA + Mentorat personnalisé
3ème place : 150,000 DA + Formation avancée

👥 Qui peut participer ?
• Développeurs et programmeurs (tous niveaux)
• Designers UI/UX
• Entrepreneurs et porteurs de projets
• Étudiants en informatique et technologies
• Jeunes innovateurs âgés de 18 à 35 ans

📦 Ce que nous offrons :
✅ Espace de travail équipé (WiFi haut débit, prises électriques)
✅ Repas et rafraîchissements durant tout l'événement
✅ Mentorat par des experts du secteur
✅ Ateliers de formation (Git, Cloud, APIs)
✅ Accès aux outils et ressources de développement
✅ Networking avec investisseurs et entrepreneurs
✅ Certificat de participation

🎓 Programme :
Jour 1 - Samedi :
• 08h00 : Accueil et inscription
• 09h00 : Cérémonie d'ouverture avec le Ministre
• 10h00 : Présentation des challenges
• 11h00 : Formation des équipes et brainstorming
• 14h00 : Début du développement
• 19h00 : Session de mentorat #1

Jour 2 - Dimanche :
• 08h00 : Continuation du développement
• 12h00 : Session de mentorat #2
• 15h00 : Finalisation et préparation des pitchs
• 17h00 : Présentations finales devant le jury
• 19h00 : Délibération du jury
• 20h00 : Cérémonie de clôture et remise des prix

👨‍⚖️ Jury composé de :
• Représentants du Ministère de la Jeunesse
• Experts en innovation et startups
• Investisseurs et business angels
• Professeurs universitaires en informatique
• Entrepreneurs à succès

📍 Lieu : Maison des Jeunes de Sétif - Avenue 8 Mai 1945, Cité Maabouda

📝 Inscription obligatoire - Places limitées à 150 participants

Une opportunité unique de transformer vos idées en réalité et de contribuer au développement numérique de l'Algérie ! 🇩🇿

#Hackathon2025 #InnovationJeunesse #SétifTech #MinistèreDeLaJeunesse #StartupAlgeria`,
          date: new Date('2025-12-14T08:00:00'),
          category: 'coding',
          status: 'open',
          image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
          createdBy: adminUser._id,
          participantIds: [],
        });
        console.log(`  ✅ Created Hackathon 2025 event for Sétif center`);
        console.log(`     Event ID: ${hackathonEvent._id}`);
        console.log(`     Date: ${hackathonEvent.date.toLocaleDateString('fr-FR')}`);
      } else {
        console.log(`  ⚠️  Hackathon 2025 event already exists for Sétif`);
      }
    } else {
      console.log(`  ⚠️  Sétif center not found, cannot create event`);
    }

    // Create Workshops for Setif Center
    console.log('\n🎓 Creating workshops for Sétif center...');
    if (setifCenter) {
      const workshopsData = [
        {
          title: 'Introduction au Développement Web - HTML, CSS & JavaScript',
          description: `Atelier pratique pour apprendre les fondamentaux du développement web moderne.

📚 Programme détaillé :
• Introduction à HTML5 - Structure et sémantique
• Stylisation avec CSS3 - Flexbox et Grid
• JavaScript ES6+ - Variables, fonctions, DOM manipulation
• Création d'un site web responsive complet
• Bonnes pratiques et outils de développement

🎯 Objectifs :
✅ Créer votre premier site web professionnel
✅ Maîtriser les bases du développement frontend
✅ Comprendre le fonctionnement d'une page web
✅ Acquérir les compétences pour poursuivre en développement

👥 Pour qui ?
• Débutants sans expérience en programmation
• Étudiants souhaitant apprendre le web
• Professionnels en reconversion
• Entrepreneurs voulant créer leur site

📦 Fourni :
• Support de cours complet
• Exercices pratiques
• Projet final à réaliser
• Certificat de participation
• Accès aux ressources en ligne

⏰ Durée : 3 jours (9h00-17h00)
💻 Prérequis : Ordinateur portable`,
          date: new Date('2025-11-20T09:00:00'),
          category: 'coding',
          mentorId: 'Karim Benali',
          price: 0,
          status: 'open',
          image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
        },
        {
          title: 'Intelligence Artificielle & Machine Learning avec Python',
          description: `Formation avancée sur l'IA et le Machine Learning pour résoudre des problèmes réels.

🤖 Contenu de la formation :
• Introduction à l'Intelligence Artificielle
• Python pour la Data Science (NumPy, Pandas)
• Visualisation de données (Matplotlib, Seaborn)
• Algorithmes de Machine Learning (Scikit-learn)
• Réseaux de neurones et Deep Learning (TensorFlow)
• Traitement du langage naturel (NLP)
• Vision par ordinateur
• Projet pratique : Créer votre propre modèle IA

🎯 Ce que vous apprendrez :
✅ Comprendre les concepts fondamentaux de l'IA
✅ Manipuler et analyser des données
✅ Créer des modèles de prédiction
✅ Implémenter des réseaux de neurones
✅ Déployer des solutions IA

👥 Participants :
• Développeurs Python intermédiaire
• Data scientists débutants
• Étudiants en informatique/mathématiques
• Passionnés de technologie et innovation

📦 Inclus :
• Notebooks Jupyter complets
• Datasets pour la pratique
• Accès aux outils cloud (Google Colab)
• Projet portfolio
• Certification

⏰ Durée : 5 jours intensifs
💻 Prérequis : Connaissance de base en Python`,
          date: new Date('2025-11-25T09:00:00'),
          category: 'tech',
          mentorId: 'Dr. Amina Hadj',
          price: 0,
          status: 'open',
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        },
        {
          title: "Design Thinking & Innovation - De l'Idée au Prototype",
          description: `Méthodologie Design Thinking pour transformer vos idées en solutions innovantes.

💡 Méthodologie :
• Empathie - Comprendre les besoins utilisateurs
• Définition - Formuler le bon problème
• Idéation - Générer des solutions créatives
• Prototypage - Créer des maquettes rapides
• Test - Valider avec les utilisateurs

🎯 Compétences développées :
✅ Pensée créative et innovation
✅ Résolution de problèmes complexes
✅ Prototypage rapide
✅ Travail collaboratif
✅ Présentation d'idées

📋 Activités pratiques :
• Exercices de brainstorming
• Création de personas
• Customer journey mapping
• Wireframing et maquettage
• Pitch de projet

👥 Idéal pour :
• Entrepreneurs et startuppers
• Chefs de projet
• Designers et créatifs
• Étudiants en innovation
• Toute personne avec une idée

📦 Matériel fourni :
• Kit de prototypage
• Templates et outils
• Guide méthodologique
• Certificat Design Thinking

⏰ Durée : 2 jours
💻 Prérequis : Aucun - Ouvert à tous`,
          date: new Date('2025-11-28T09:00:00'),
          category: 'entrepreneurship',
          mentorId: 'Sofiane Meziane',
          price: 0,
          status: 'open',
          image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
        },
        {
          title: 'UI/UX Design - Créer des Interfaces Utilisateur Exceptionnelles',
          description: `Maîtrisez les principes du design d'interface et d'expérience utilisateur.

🎨 Programme complet :
• Principes fondamentaux du design UI/UX
• Psychologie de l'utilisateur
• Recherche utilisateur et personas
• Architecture de l'information
• Wireframing et prototypage
• Design visuel et branding
• Design system et composants
• Outils professionnels (Figma, Adobe XD)
• Tests utilisateurs et itération

🎯 Objectifs pédagogiques :
✅ Créer des interfaces intuitives
✅ Améliorer l'expérience utilisateur
✅ Maîtriser Figma professionnellement
✅ Constituer un portfolio de designer
✅ Comprendre le processus de design

👥 Public cible :
• Designers graphiques en transition
• Développeurs web/mobile
• Product managers
• Étudiants en design
• Créatifs et passionnés

📦 Ressources incluses :
• Templates Figma professionnels
• Bibliothèque de composants
• Guides de style
• Projets pratiques
• Feedback personnalisé

⏰ Durée : 4 jours
💻 Prérequis : Créativité et ordinateur`,
          date: new Date('2025-12-02T09:00:00'),
          category: 'design',
          mentorId: 'Yasmine Bouzid',
          price: 0,
          status: 'open',
          image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        },
        {
          title: 'Marketing Digital & Réseaux Sociaux pour Startups',
          description: `Stratégies marketing digital pour lancer et développer votre startup.

📱 Thématiques abordées :
• Stratégie marketing digital 360°
• Social Media Marketing (Facebook, Instagram, LinkedIn, TikTok)
• Content Marketing - Création de contenu engageant
• SEO et référencement naturel
• Google Ads et publicité payante
• Email marketing et automation
• Analytics et mesure de performance
• Growth hacking et acquisition
• Personal branding et influence

🎯 Résultats attendus :
✅ Créer une stratégie marketing complète
✅ Gérer vos réseaux sociaux efficacement
✅ Augmenter votre visibilité en ligne
✅ Acquérir vos premiers clients
✅ Analyser et optimiser vos campagnes

👥 Pour qui :
• Entrepreneurs et startuppers
• Responsables marketing
• Community managers
• Freelances et consultants
• Commerçants et PME

📦 Bonus inclus :
• Calendrier éditorial
• Templates réseaux sociaux
• Checklist SEO
• Outils marketing gratuits
• Plan d'action personnalisé

⏰ Durée : 3 jours
💻 Prérequis : Projet ou entreprise`,
          date: new Date('2025-12-05T09:00:00'),
          category: 'marketing',
          mentorId: 'Rania Mansouri',
          price: 0,
          status: 'open',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        },
        {
          title: 'Développement Mobile avec React Native',
          description: `Créez des applications mobiles iOS et Android avec une seule base de code.

📱 Contenu technique :
• Introduction à React Native et Expo
• JavaScript moderne (ES6+) et React
• Navigation et routing (React Navigation)
• État et gestion de données (Redux, Context)
• API et intégration backend
• Composants natifs et personnalisés
• Animations et performances
• Publication sur App Store et Google Play
• Best practices et architecture

🎯 Projets réalisés :
✅ Application météo avec API
✅ App de todo list avec stockage local
✅ Application e-commerce complète
✅ App de réseaux sociaux (clone)

👥 Participants idéaux :
• Développeurs web voulant passer au mobile
• Étudiants en développement
• Entrepreneurs tech
• Développeurs JavaScript

📦 Support fourni :
• Code source complet
• Documentation détaillée
• Ressources et librairies
• Aide au déploiement
• Accès communauté développeurs

⏰ Durée : 5 jours
💻 Prérequis : JavaScript/React de base`,
          date: new Date('2025-12-09T09:00:00'),
          category: 'coding',
          mentorId: 'Mehdi Cherif',
          price: 0,
          status: 'open',
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
        },
      ];

      let workshopsCreated = 0;
      for (const workshopData of workshopsData) {
        const existingWorkshop = await Workshop.findOne({
          title: workshopData.title,
          centerId: setifCenter._id,
        });

        if (!existingWorkshop) {
          await Workshop.create({
            ...workshopData,
            centerId: setifCenter._id,
            createdBy: adminUser._id,
          });
          workshopsCreated++;
          console.log(`  ✅ Created: ${workshopData.title}`);
        } else {
          console.log(`  ⚠️  Already exists: ${workshopData.title}`);
        }
      }

      console.log(`\n  📊 Total workshops created: ${workshopsCreated}/${workshopsData.length}`);
    } else {
      console.log(`  ⚠️  Sétif center not found, cannot create workshops`);
    }

    // Create Clubs for Setif Center
    console.log('\n🏛️  Creating clubs for Sétif center...');
    if (setifCenter) {
      const clubsData = [
        {
          name: 'Club Innovation & Entrepreneuriat Sétif',
          description: `Club dédié à l'innovation et l'entrepreneuriat pour les jeunes de Sétif.

🚀 Mission du club :
Accompagner les jeunes entrepreneurs et innovateurs de Sétif dans la réalisation de leurs projets et le développement de leurs compétences entrepreneuriales.

🎯 Activités principales :
• Sessions de brainstorming et idéation
• Ateliers de création de business model
• Pitch training et présentation de projets
• Networking avec entrepreneurs locaux
• Visites d'entreprises et startups
• Conférences avec des experts
• Compétitions de pitch et hackathons
• Mentorat personnalisé

👥 Pour qui ?
• Porteurs de projets et idées innovantes
• Étudiants en commerce et gestion
• Jeunes entrepreneurs (18-35 ans)
• Freelances et créateurs d'entreprise
• Passionnés d'innovation et startups

💡 Avantages membres :
✅ Accès aux ressources et outils entrepreneuriaux
✅ Mentorat par des entrepreneurs expérimentés
✅ Réseau de partenaires et investisseurs
✅ Espace de coworking
✅ Formation continue
✅ Accompagnement projet
✅ Événements exclusifs

📅 Réunions : Tous les mercredis à 18h00
📍 Lieu : Maison des Jeunes Sétif`,
          category: 'entrepreneurship',
          images: ['https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800'],
        },
        {
          name: 'Club Développement & Technologies Sétif',
          description: `Club pour les passionnés de programmation, développement web/mobile et nouvelles technologies.

💻 Notre vision :
Former une communauté de développeurs compétents et créatifs capables de créer des solutions technologiques innovantes pour les défis locaux et mondiaux.

🎯 Activités du club :
• Coding sessions et live coding
• Workshops techniques (Web, Mobile, IA, Cloud)
• Projets collaboratifs open source
• Challenges de programmation
• Code reviews et pair programming
• Tech talks et conférences
• Participation aux hackathons
• Contribution à des projets réels

💡 Technologies couvertes :
• Frontend : HTML, CSS, JavaScript, React, Vue
• Backend : Node.js, Python, Java, PHP
• Mobile : React Native, Flutter
• Data Science & AI : Python, TensorFlow, Scikit-learn
• DevOps : Git, Docker, CI/CD
• Bases de données : MongoDB, MySQL, PostgreSQL

👥 Membres :
• Développeurs débutants et avancés
• Étudiants en informatique
• Autodidactes passionnés
• Professionnels du secteur tech
• Toute personne intéressée par la programmation

🎁 Bénéfices :
✅ Apprentissage collaboratif
✅ Projets portfolio
✅ Certifications gratuites
✅ Accès outils et plateformes
✅ Mentorat technique
✅ Opportunités de stage
✅ Réseau professionnel tech

📅 Réunions : Mardis et vendredis à 17h30
📍 Salle informatique - Maison des Jeunes Sétif`,
          category: 'coding',
          images: ['https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800'],
        },
        {
          name: 'Club Design & Créativité Sétif',
          description: `Espace créatif pour designers, artistes digitaux et créatifs de tous horizons.

🎨 Notre mission :
Cultiver la créativité et développer les compétences en design graphique, UI/UX, illustration digitale et arts visuels chez les jeunes de Sétif.

🎯 Activités créatives :
• Ateliers de design graphique
• Sessions UI/UX design
• Illustration digitale et animation
• Photographie et retouche photo
• Création de contenu visuel
• Branding et identité visuelle
• Portfolio building
• Expositions de travaux

🛠️ Outils et logiciels :
• Adobe Creative Suite (Photoshop, Illustrator, InDesign)
• Figma et Adobe XD (UI/UX)
• Canva et outils design accessibles
• Procreate et illustration digitale
• After Effects (Animation)
• Lightroom (Photo editing)

👥 Communauté :
• Designers graphiques
• UI/UX designers
• Illustrateurs digitaux
• Photographes
• Créateurs de contenu
• Étudiants en arts et design
• Marketeurs créatifs
• Entrepreneurs créatifs

💼 Opportunités :
✅ Projets clients réels
✅ Collaborations avec startups
✅ Création de portfolio professionnel
✅ Freelancing guidance
✅ Networking créatif
✅ Exposition de vos œuvres
✅ Concours et challenges design

📅 Réunions : Lundis et jeudis à 18h00
📍 Espace créatif - Maison des Jeunes Sétif
🎨 Matériel fourni : Tablettes graphiques disponibles`,
          category: 'design',
          images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'],
        },
      ];

      let clubsCreated = 0;
      for (const clubData of clubsData) {
        const existingClub = await Club.findOne({
          name: clubData.name,
          centerId: setifCenter._id,
        });

        if (!existingClub) {
          await Club.create({
            ...clubData,
            centerId: setifCenter._id,
            createdBy: adminUser._id,
            memberIds: [],
          });
          clubsCreated++;
          console.log(`  ✅ Created: ${clubData.name}`);
        } else {
          console.log(`  ⚠️  Already exists: ${clubData.name}`);
        }
      }

      console.log(`\n  📊 Total clubs created: ${clubsCreated}/${clubsData.length}`);
    } else {
      console.log(`  ⚠️  Sétif center not found, cannot create clubs`);
    }

    // Statistics
    console.log('\n' + '='.repeat(70));
    console.log('✨ Annexes Centers Addition Completed!\n');
    console.log('📊 Summary:');
    console.log(`   New Centers Created: ${createdCenters.length}`);
    console.log(`   Total Centers in Database: ${await Center.countDocuments()}`);

    const centersWithTour = await Center.find({ hasTour: true });
    console.log(`   Centers with Virtual Tour: ${centersWithTour.length}`);
    centersWithTour.forEach((c) => {
      console.log(`      - ${c.name} (${c.wilaya})`);
    });

    // Regional breakdown
    const saharaCenters = createdCenters.filter((c) =>
      [
        'Ouargla',
        'Ghardaïa',
        'Tamanrasset',
        'Béchar',
        'Adrar',
        'Laghouat',
        'Biskra',
        'El Oued',
        'Illizi',
        'Tindouf',
      ].includes(c.wilaya)
    );
    console.log(`\n   Sahara Region Centers: ${saharaCenters.length}`);

    const northernCenters = createdCenters.filter(
      (c) =>
        ![
          'Ouargla',
          'Ghardaïa',
          'Tamanrasset',
          'Béchar',
          'Adrar',
          'Laghouat',
          'Biskra',
          'El Oued',
          'Illizi',
          'Tindouf',
        ].includes(c.wilaya)
    );
    console.log(`   Northern & Highlands Centers: ${northernCenters.length}`);

    console.log('='.repeat(70) + '\n');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the script
addAnnexesCenters()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
