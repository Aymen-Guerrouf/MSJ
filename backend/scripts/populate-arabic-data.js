import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Club from '../src/models/club.model.js';
import Workshop from '../src/models/workshop.model.js';
import Event from '../src/models/event.model.js';
import VirtualSchoolVideo from '../src/models/virtualSchoolVideo.model.js';
import LearningResource from '../src/models/learningResource.model.js';
import StartupIdea from '../src/models/startupIdea.model.js';
import User from '../src/models/user.model.js';
import Center from '../src/models/center.model.js';

dotenv.config();

async function populateArabicData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/msj-db');
    console.log('✅ متصل بقاعدة البيانات');

    // Find or create a center
    const center = await Center.findOne();
    if (!center) {
      console.log('⚠️ لا يوجد مركز. يرجى إنشاء مركز أولاً');
      process.exit(1);
    }
    console.log('✅ تم العثور على المركز:', center.name);

    // Find or create users
    let adminUser = await User.findOne({ role: 'centerAdmin' });
    if (!adminUser) {
      adminUser = await User.findOne({ role: 'superAdmin' });
    }
    if (!adminUser) {
      adminUser = await User.findOne();
    }

    if (!adminUser) {
      console.log('⚠️ لا يوجد مستخدمين. يرجى إنشاء مستخدم أولاً');
      process.exit(1);
    }

    let entrepreneur = await User.findOne({ role: 'entrepreneur' });
    if (!entrepreneur) {
      entrepreneur = adminUser;
    }

    console.log('✅ تم العثور على المستخدمين');

    // =======================
    // 1. إنشاء الأندية (Clubs)
    // =======================
    console.log('\n📚 إنشاء الأندية...');
    const clubs = [
      {
        centerId: center._id,
        name: 'نادي البرمجة والتكنولوجيا',
        description:
          'نادي متخصص في تعليم البرمجة وتطوير المهارات التقنية للشباب. نقدم ورش عمل في تطوير التطبيقات، الذكاء الاصطناعي، وعلوم البيانات.',
        category: 'coding',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        name: 'نادي ريادة الأعمال والابتكار',
        description:
          'نادي يهدف إلى تطوير مهارات ريادة الأعمال وتحويل الأفكار إلى مشاريع ناجحة. نوفر الإرشاد والدعم لرواد الأعمال الشباب.',
        category: 'entrepreneurship',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        name: 'نادي التصميم والإبداع',
        description:
          'نادي مخصص للمبدعين والمصممين. نقدم ورش في التصميم الجرافيكي، تصميم واجهات المستخدم، والتصوير الفوتوغرافي.',
        category: 'design',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        name: 'نادي الفنون والمسرح',
        description:
          'نادي للفنون التمثيلية والمسرحية. نقدم دروس في التمثيل، الإخراج، وكتابة السيناريو.',
        category: 'theatre',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        name: 'نادي الموسيقى والإيقاع',
        description: 'نادي موسيقي يقدم تعليم العزف على الآلات الموسيقية المختلفة والغناء والتلحين.',
        category: 'music',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        name: 'نادي التطوع والعمل الخيري',
        description:
          'نادي مخصص للأنشطة التطوعية وخدمة المجتمع. ننظم حملات توعية ومبادرات اجتماعية.',
        category: 'volunteering',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        name: 'نادي الشطرنج والألعاب الذهنية',
        description: 'نادي لتطوير المهارات الذهنية من خلال الشطرنج والألعاب الاستراتيجية.',
        category: 'chess',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        name: 'نادي كرة القدم',
        description: 'نادي رياضي متخصص في كرة القدم. نقدم تدريبات منتظمة وننظم بطولات ومباريات.',
        category: 'football',
        createdBy: adminUser._id,
      },
    ];

    const createdClubs = await Club.insertMany(clubs);
    console.log(`✅ تم إنشاء ${createdClubs.length} نادي`);

    // =======================
    // 2. إنشاء ورش العمل (Workshops)
    // =======================
    console.log('\n🎓 إنشاء ورش العمل...');
    const workshops = [
      {
        centerId: center._id,
        clubId: createdClubs[0]._id, // نادي البرمجة
        title: 'مقدمة في تطوير تطبيقات الويب',
        description:
          'ورشة عمل شاملة لتعلم أساسيات تطوير تطبيقات الويب باستخدام HTML، CSS، JavaScript، وReact.',
        date: new Date('2025-11-15'),
        category: 'coding',
        mentorId: 'أحمد العربي',
        price: 0,
        status: 'open',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        clubId: createdClubs[0]._id,
        title: 'الذكاء الاصطناعي للمبتدئين',
        description:
          'تعلم أساسيات الذكاء الاصطناعي والتعلم الآلي مع تطبيقات عملية باستخدام Python.',
        date: new Date('2025-11-20'),
        category: 'tech',
        mentorId: 'سارة محمد',
        price: 0,
        status: 'open',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        clubId: createdClubs[1]._id, // نادي ريادة الأعمال
        title: 'كيف تحول فكرتك إلى مشروع ناجح',
        description:
          'ورشة عملية حول خطوات تأسيس مشروع ريادي من الفكرة إلى التنفيذ، مع نماذج أعمال حقيقية.',
        date: new Date('2025-11-18'),
        category: 'entrepreneurship',
        mentorId: 'خالد السعيد',
        price: 0,
        status: 'open',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        clubId: createdClubs[1]._id,
        title: 'التسويق الرقمي لرواد الأعمال',
        description:
          'تعلم استراتيجيات التسويق الرقمي الحديثة لتسويق مشروعك عبر وسائل التواصل الاجتماعي.',
        date: new Date('2025-11-25'),
        category: 'marketing',
        mentorId: 'ليلى حسن',
        price: 0,
        status: 'open',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        clubId: createdClubs[2]._id, // نادي التصميم
        title: 'تصميم واجهات المستخدم (UI/UX)',
        description:
          'ورشة شاملة في تصميم واجهات المستخدم وتجربة المستخدم باستخدام Figma وأدوات التصميم الحديثة.',
        date: new Date('2025-11-22'),
        category: 'design',
        mentorId: 'نور الدين',
        price: 0,
        status: 'open',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        clubId: createdClubs[4]._id, // نادي الموسيقى
        title: 'أساسيات العزف على الجيتار',
        description: 'تعلم أساسيات العزف على الجيتار للمبتدئين مع تمارين عملية.',
        date: new Date('2025-11-28'),
        category: 'music',
        mentorId: 'عمر الفنان',
        price: 0,
        status: 'open',
        createdBy: adminUser._id,
      },
    ];

    const createdWorkshops = await Workshop.insertMany(workshops);
    console.log(`✅ تم إنشاء ${createdWorkshops.length} ورشة عمل`);

    // =======================
    // 3. إنشاء الفعاليات (Events)
    // =======================
    console.log('\n🎉 إنشاء الفعاليات...');
    const events = [
      {
        centerId: center._id,
        clubId: createdClubs[0]._id,
        title: 'هاكاثون البرمجة 2025',
        description: 'مسابقة برمجية مدتها 48 ساعة لتطوير حلول تقنية مبتكرة. جوائز قيمة للفائزين!',
        date: new Date('2025-12-01'),
        category: 'coding',
        status: 'open',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        clubId: createdClubs[1]._id,
        title: 'ملتقى رواد الأعمال الشباب',
        description: 'لقاء مع رواد أعمال ناجحين لمشاركة تجاربهم وإلهام الجيل القادم من المبدعين.',
        date: new Date('2025-11-30'),
        category: 'entrepreneurship',
        status: 'open',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        clubId: createdClubs[2]._id,
        title: 'معرض التصميم والإبداع',
        description:
          'معرض لعرض أعمال المصممين الشباب في مجالات التصميم الجرافيكي والتصوير الفوتوغرافي.',
        date: new Date('2025-12-05'),
        category: 'design',
        status: 'open',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        clubId: createdClubs[3]._id,
        title: 'عرض مسرحي: أحلام الشباب',
        description: 'عرض مسرحي من إعداد وتقديم أعضاء نادي المسرح، يحكي قصص طموحات الشباب.',
        date: new Date('2025-12-10'),
        category: 'theatre',
        status: 'open',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        clubId: createdClubs[4]._id,
        title: 'حفل موسيقي: ليلة الموسيقى العربية',
        description: 'أمسية موسيقية تضم عزف حي على آلات موسيقية مختلفة وأغاني عربية أصيلة.',
        date: new Date('2025-12-08'),
        category: 'music',
        status: 'open',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        clubId: createdClubs[5]._id,
        title: 'يوم التطوع المجتمعي',
        description: 'يوم تطوعي لتنظيف الأحياء وزراعة الأشجار وتوزيع المساعدات على المحتاجين.',
        date: new Date('2025-11-29'),
        category: 'volunteering',
        status: 'open',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        clubId: createdClubs[6]._id,
        title: 'بطولة الشطرنج السنوية',
        description: 'بطولة شطرنج مفتوحة لجميع المستويات مع جوائز للفائزين.',
        date: new Date('2025-12-03'),
        category: 'chess',
        status: 'open',
        createdBy: adminUser._id,
      },
      {
        centerId: center._id,
        clubId: createdClubs[7]._id,
        title: 'دوري كرة القدم للشباب',
        description: 'دوري كرة قدم بين الفرق المختلفة، مباريات أسبوعية وجوائز للفريق الفائز.',
        date: new Date('2025-12-07'),
        category: 'football',
        status: 'open',
        createdBy: adminUser._id,
      },
    ];

    const createdEvents = await Event.insertMany(events);
    console.log(`✅ تم إنشاء ${createdEvents.length} فعالية`);

    // =======================
    // 4. إنشاء فيديوهات المدرسة الافتراضية (Virtual School Videos)
    // =======================
    console.log('\n🎥 إنشاء فيديوهات المدرسة الافتراضية...');
    const videos = [
      {
        title: 'مقدمة في البرمجة بلغة Python',
        category: 'coding',
        description: 'تعلم أساسيات البرمجة بلغة Python من الصفر. فيديو تعليمي شامل للمبتدئين.',
        videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
        thumbnailUrl: 'https://img.youtube.com/vi/rfscVS0vtbw/maxresdefault.jpg',
        centerId: center._id,
        createdBy: adminUser._id,
      },
      {
        title: 'تعلم اللغة الإنجليزية للمبتدئين',
        category: 'language',
        description: 'دورة شاملة لتعلم اللغة الإنجليزية من البداية مع تمارين عملية.',
        videoUrl: 'https://www.youtube.com/watch?v=3pKiKmvZJMk',
        thumbnailUrl: 'https://img.youtube.com/vi/3pKiKmvZJMk/maxresdefault.jpg',
        centerId: center._id,
        createdBy: adminUser._id,
      },
      {
        title: 'كيف تبدأ مشروعك الريادي',
        category: 'entrepreneurship',
        description: 'دليل شامل لبدء مشروعك الخاص خطوة بخطوة من الفكرة إلى التنفيذ.',
        videoUrl: 'https://www.youtube.com/watch?v=vgNZ_RPGjDo',
        thumbnailUrl: 'https://img.youtube.com/vi/vgNZ_RPGjDo/maxresdefault.jpg',
        centerId: center._id,
        createdBy: adminUser._id,
      },
      {
        title: 'أساسيات التصميم الجرافيكي',
        category: 'design',
        description: 'تعلم مبادئ التصميم الجرافيكي وأساسيات استخدام Photoshop وIllustrator.',
        videoUrl: 'https://www.youtube.com/watch?v=YqQx75OPRa0',
        thumbnailUrl: 'https://img.youtube.com/vi/YqQx75OPRa0/maxresdefault.jpg',
        centerId: center._id,
        createdBy: adminUser._id,
      },
      {
        title: 'التسويق الرقمي: دليل المبتدئين',
        category: 'marketing',
        description: 'تعلم أساسيات التسويق الرقمي والتسويق عبر وسائل التواصل الاجتماعي.',
        videoUrl: 'https://www.youtube.com/watch?v=nU-IIXBWlS4',
        thumbnailUrl: 'https://img.youtube.com/vi/nU-IIXBWlS4/maxresdefault.jpg',
        centerId: center._id,
        createdBy: adminUser._id,
      },
      {
        title: 'الصحة النفسية للشباب',
        category: 'health',
        description: 'محاضرة حول أهمية الصحة النفسية وكيفية التعامل مع ضغوط الحياة.',
        videoUrl: 'https://www.youtube.com/watch?v=3QIfkeA6HBY',
        thumbnailUrl: 'https://img.youtube.com/vi/3QIfkeA6HBY/maxresdefault.jpg',
        centerId: center._id,
        createdBy: adminUser._id,
      },
      {
        title: 'مهارات التواصل الفعال',
        category: 'career',
        description: 'تطوير مهارات التواصل والعرض التقديمي للنجاح في الحياة المهنية.',
        videoUrl: 'https://www.youtube.com/watch?v=IvTu2YngNGU',
        thumbnailUrl: 'https://img.youtube.com/vi/IvTu2YngNGU/maxresdefault.jpg',
        centerId: center._id,
        createdBy: adminUser._id,
      },
    ];

    const createdVideos = await VirtualSchoolVideo.insertMany(videos);
    console.log(`✅ تم إنشاء ${createdVideos.length} فيديو تعليمي`);

    // =======================
    // 5. إنشاء مصادر التعلم - الملحقات (Learning Resources - Annexes)
    // =======================
    console.log('\n📎 إنشاء مصادر التعلم (الملحقات)...');
    const resources = [
      {
        title: 'دليل البرمجة بلغة JavaScript',
        url: 'https://javascript.info/ar',
        description: 'موقع شامل لتعلم JavaScript من الصفر مع أمثلة تفاعلية',
        category: 'coding',
        center: center._id,
        addedBy: adminUser._id,
      },
      {
        title: 'كتاب: من الفكرة إلى المشروع',
        url: 'https://www.example.com/entrepreneurship-guide',
        description: 'كتاب إلكتروني مجاني عن ريادة الأعمال وكيفية تحويل الأفكار إلى مشاريع ناجحة',
        category: 'entrepreneurship',
        center: center._id,
        addedBy: adminUser._id,
      },
      {
        title: 'دورة تصميم UI/UX على Coursera',
        url: 'https://www.coursera.org/learn/ui-ux-design',
        description: 'دورة مجانية لتعلم تصميم واجهات المستخدم وتجربة المستخدم',
        category: 'design',
        center: center._id,
        addedBy: adminUser._id,
      },
      {
        title: 'مكتبة الموسيقى الحرة',
        url: 'https://www.bensound.com',
        description: 'مكتبة موسيقى مجانية للاستخدام في المشاريع',
        category: 'music',
        center: center._id,
        addedBy: adminUser._id,
      },
      {
        title: 'منصة GitHub للمطورين',
        url: 'https://github.com',
        description: 'منصة لمشاركة الأكواد والتعاون على المشاريع البرمجية',
        category: 'tech',
        center: center._id,
        addedBy: adminUser._id,
      },
      {
        title: 'دليل التسويق عبر مواقع التواصل',
        url: 'https://www.hubspot.com/marketing-statistics',
        description: 'مصدر شامل لإحصائيات واستراتيجيات التسويق الرقمي',
        category: 'marketing',
        center: center._id,
        addedBy: adminUser._id,
      },
      {
        title: 'مواقع تعلم الشطرنج',
        url: 'https://www.chess.com/ar',
        description: 'منصة شاملة لتعلم ولعب الشطرنج أونلاين',
        category: 'chess',
        center: center._id,
        addedBy: adminUser._id,
      },
      {
        title: 'قناة يوتيوب لتعليم الفنون',
        url: 'https://www.youtube.com/c/TheArtAssignment',
        description: 'قناة تعليمية متخصصة في الفنون المختلفة',
        category: 'arts',
        center: center._id,
        addedBy: adminUser._id,
      },
      {
        title: 'دليل الصحة واللياقة البدنية',
        url: 'https://www.who.int/ar',
        description: 'معلومات صحية موثوقة من منظمة الصحة العالمية',
        category: 'health',
        center: center._id,
        addedBy: adminUser._id,
      },
      {
        title: 'منصة التعليم المفتوح edX',
        url: 'https://www.edx.org',
        description: 'منصة تعليمية تقدم دورات مجانية من جامعات عالمية',
        category: 'education',
        center: center._id,
        addedBy: adminUser._id,
      },
    ];

    const createdResources = await LearningResource.insertMany(resources);
    console.log(`✅ تم إنشاء ${createdResources.length} مصدر تعليمي`);

    // =======================
    // 6. إنشاء مشاريع Sparks
    // =======================
    console.log('\n💡 إنشاء مشاريع Sparks...');
    const sparks = [
      {
        title: 'منصة التعليم الذكية',
        description:
          'منصة تعليمية تستخدم الذكاء الاصطناعي لتخصيص المحتوى التعليمي لكل طالب بناءً على مستواه واحتياجاته.',
        category: 'Education',
        problemStatement:
          'التعليم التقليدي لا يراعي الفروق الفردية بين الطلاب، مما يؤدي إلى تأخر بعض الطلاب وملل البعض الآخر.',
        solution:
          'منصة تستخدم الذكاء الاصطناعي لتحليل أداء الطالب وتقديم محتوى مخصص يناسب مستواه وسرعة تعلمه.',
        targetMarket:
          'المدارس والمراكز التعليمية في الوطن العربي، السوق المستهدف أكثر من 50 مليون طالب.',
        businessModel: 'SaaS (Subscription)',
        owner: entrepreneur._id,
        status: 'public',
      },
      {
        title: 'تطبيق الزراعة الذكية',
        description:
          'تطبيق يساعد المزارعين على مراقبة حقولهم باستخدام إنترنت الأشياء والذكاء الاصطناعي لتحسين الإنتاج.',
        category: 'Technology',
        problemStatement:
          'المزارعون يفتقرون إلى البيانات الدقيقة حول حالة التربة والمحاصيل، مما يؤدي إلى هدر الموارد.',
        solution:
          'نظام متكامل من المستشعرات والكاميرات مع تطبيق موبايل يوفر معلومات فورية ونصائح ذكية.',
        targetMarket: 'المزارع الصغيرة والمتوسطة في منطقة الشرق الأوسط وشمال أفريقيا.',
        businessModel: 'SaaS (Subscription)',
        owner: entrepreneur._id,
        status: 'public',
      },
      {
        title: 'منصة الرعاية الصحية عن بُعد',
        description:
          'منصة تربط المرضى بالأطباء لاستشارات طبية عبر الإنترنت مع إمكانية متابعة الحالة الصحية.',
        category: 'Healthcare',
        problemStatement:
          'صعوبة الوصول إلى الرعاية الصحية الجيدة خاصة في المناطق النائية، وطول فترات الانتظار.',
        solution: 'منصة رقمية تتيح حجز استشارات فورية أو مجدولة مع أطباء متخصصين عبر الفيديو.',
        targetMarket:
          'المرضى في المناطق الحضرية والنائية، السوق المستهدف أكثر من 100 مليون مستخدم محتمل.',
        businessModel: 'Marketplace',
        owner: entrepreneur._id,
        status: 'public',
      },
      {
        title: 'تطبيق إعادة التدوير الذكي',
        description:
          'تطبيق يسهل عملية جمع وإعادة تدوير النفايات من خلال ربط الأفراد بمراكز التدوير.',
        category: 'Environment',
        problemStatement: 'نقص الوعي بأهمية إعادة التدوير وصعوبة الوصول إلى مراكز التدوير.',
        solution: 'تطبيق يحدد أقرب نقاط التجميع، ويوفر خدمة استلام من المنزل، ومكافآت للمشاركين.',
        targetMarket: 'الأفراد والشركات المهتمة بالبيئة في المدن الكبرى.',
        businessModel: 'Service-Based',
        owner: entrepreneur._id,
        status: 'public',
      },
      {
        title: 'منصة التوظيف الذكية',
        description:
          'منصة توظيف تستخدم الذكاء الاصطناعي لمطابقة المرشحين مع الوظائف المناسبة بدقة عالية.',
        category: 'Business',
        problemStatement: 'صعوبة العثور على الوظيفة المناسبة، وعدم كفاءة عمليات التوظيف التقليدية.',
        solution: 'خوارزمية ذكية تحلل السير الذاتية ومتطلبات الوظائف لتقديم مطابقات دقيقة.',
        targetMarket: 'الباحثون عن عمل والشركات في منطقة الشرق الأوسط.',
        businessModel: 'Freemium',
        owner: entrepreneur._id,
        status: 'public',
      },
      {
        title: 'منصة التجارة الإلكترونية للمنتجات المحلية',
        description: 'سوق إلكتروني يربط المنتجين المحليين بالمستهلكين مباشرة.',
        category: 'Business',
        problemStatement: 'صعوبة وصول المنتجين المحليين الصغار إلى الأسواق، واعتمادهم على الوسطاء.',
        solution: 'منصة إلكترونية سهلة الاستخدام مع خدمات توصيل وحلول دفع متكاملة.',
        targetMarket: 'المنتجون والمستهلكون في المدن الصغيرة والمتوسطة.',
        businessModel: 'Marketplace',
        owner: entrepreneur._id,
        status: 'public',
      },
      {
        title: 'تطبيق تعلم اللغات بالذكاء الاصطناعي',
        description: 'تطبيق تفاعلي لتعلم اللغات باستخدام تقنيات الذكاء الاصطناعي والواقع المعزز.',
        category: 'AI',
        problemStatement: 'طرق تعلم اللغات التقليدية مملة وغير فعالة، ونقص فرص الممارسة الحقيقية.',
        solution: 'تطبيق يستخدم AI للمحادثات التفاعلية والواقع المعزز لمحاكاة مواقف واقعية.',
        targetMarket: 'متعلمو اللغات في جميع أنحاء العالم، السوق العالمي بمليارات الدولارات.',
        businessModel: 'Freemium',
        owner: entrepreneur._id,
        status: 'public',
      },
      {
        title: 'منصة الحجوزات الرياضية',
        description: 'تطبيق لحجز الملاعب والصالات الرياضية وتنظيم المباريات والدوريات.',
        category: 'Mobile',
        problemStatement: 'صعوبة حجز الملاعب وتنظيم المباريات بين الفرق الرياضية.',
        solution: 'منصة شاملة لحجز المنشآت الرياضية وتنظيم البطولات وإدارة الفرق.',
        targetMarket: 'الرياضيون وأصحاب المنشآت الرياضية في المدن.',
        businessModel: 'Marketplace',
        owner: entrepreneur._id,
        status: 'public',
      },
    ];

    const createdSparks = await StartupIdea.insertMany(sparks);
    console.log(`✅ تم إنشاء ${createdSparks.length} مشروع Spark`);

    // =======================
    // خلاصة النتائج
    // =======================
    console.log('\n' + '='.repeat(50));
    console.log('✅ تم إكمال عملية إضافة البيانات بنجاح!');
    console.log('='.repeat(50));
    console.log(`📚 الأندية: ${createdClubs.length}`);
    console.log(`🎓 ورش العمل: ${createdWorkshops.length}`);
    console.log(`🎉 الفعاليات: ${createdEvents.length}`);
    console.log(`🎥 الفيديوهات التعليمية: ${createdVideos.length}`);
    console.log(`📎 مصادر التعلم (الملحقات): ${createdResources.length}`);
    console.log(`💡 مشاريع Sparks: ${createdSparks.length}`);
    console.log('='.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ حدث خطأ:', error.message);
    console.error(error);
    process.exit(1);
  }
}

populateArabicData();
