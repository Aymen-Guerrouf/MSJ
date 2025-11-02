import mongoose from 'mongoose';
import ExperienceSession from '../models/experienceSession.model.js';
import ExperienceCard from '../models/experienceCard.model.js';
import User from '../models/user.model.js';
import Center from '../models/center.model.js';

const seedExperienceData = async () => {
  try {
    console.log('🌱 Starting to seed experience data...');

    // Get a center and admin user
    const center = await Center.findOne();
    if (!center) {
      console.error('❌ No center found. Please create a center first.');
      return;
    }

    const admin = await User.findOne({ role: 'center_admin' });
    if (!admin) {
      // Try to find any user with admin or super_admin role
      const anyAdmin = await User.findOne({ $or: [{ role: 'admin' }, { role: 'super_admin' }] });
      if (anyAdmin) {
        // eslint-disable-next-line no-console
        console.log(`✅ Using admin: ${anyAdmin.name}`);
        const adminUser = anyAdmin;

        // eslint-disable-next-line no-console
        console.log(`✅ Using center: ${center.name}`);

        await seedDataWithUser(center, adminUser);
      } else {
        // eslint-disable-next-line no-console
        console.error('❌ No admin user found. Please create an admin user first.');
        return;
      }
    } else {
      // eslint-disable-next-line no-console
      console.log(`✅ Using center: ${center.name}`);
      // eslint-disable-next-line no-console
      console.log(`✅ Using admin: ${admin.name}`);

      await seedDataWithUser(center, admin);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Error seeding experience data:', error);
  }
};

const seedDataWithUser = async (center, admin) => {
  // Clear existing data
  await ExperienceSession.deleteMany({});
  await ExperienceCard.deleteMany({});
  // eslint-disable-next-line no-console
  console.log('🧹 Cleared existing experience data');

  // Create upcoming sessions
  const upcomingSessions = [
    {
      title: 'My Journey from Student to Entrepreneur',
      host: 'Ahmed Benali',
      description:
        'Join me as I share my experience of starting a tech company while still in university. Learn about the challenges, victories, and lessons learned along the way.',
      date: '2025-11-15',
      time: '14:00',
      tag: 'Entrepreneurship',
      centerId: center._id,
      createdBy: admin._id,
    },
    {
      title: 'رحلتي في تعلم البرمجة - My Coding Journey',
      host: 'فاطمة الزهراء - Fatima Zahra',
      description:
        'سأشارك معكم تجربتي في تعلم البرمجة من الصفر وكيف أصبحت مطور برامج محترف. I will share my experience learning programming from scratch and becoming a professional developer.',
      date: '2025-11-20',
      time: '16:00',
      tag: 'Technology',
      centerId: center._id,
      createdBy: admin._id,
    },
    {
      title: 'Breaking Into the Design Industry',
      host: 'Sarah Martinez',
      description:
        'A candid discussion about my path to becoming a UX/UI designer, the skills that matter most, and how to build a strong portfolio.',
      date: '2025-11-25',
      time: '15:00',
      tag: 'Design',
      centerId: center._id,
      createdBy: admin._id,
    },
    {
      title: 'تجربتي في العمل عن بعد - Remote Work Experience',
      host: 'كريم المصري - Karim El Masri',
      description:
        'كيف نجحت في بناء مسيرة مهنية ناجحة من خلال العمل عن بعد مع شركات عالمية. How I built a successful career working remotely with international companies.',
      date: '2025-12-01',
      time: '10:00',
      tag: 'Career',
      centerId: center._id,
      createdBy: admin._id,
    },
    {
      title: 'Leadership Lessons from Youth Projects',
      host: 'Amina Bensaid',
      description:
        'Sharing valuable leadership insights gained from managing youth-led community projects and social initiatives.',
      date: '2025-12-05',
      time: '14:30',
      tag: 'Leadership',
      centerId: center._id,
      createdBy: admin._id,
    },
  ];

  const createdSessions = await ExperienceSession.insertMany(upcomingSessions);
  // eslint-disable-next-line no-console
  console.log(`✅ Created ${createdSessions.length} upcoming sessions`);

  // Create past sessions (for archived tab)
  const pastSessions = [
    {
      title: 'Overcoming Public Speaking Anxiety',
      host: 'Mohammed Rachid',
      description:
        "I used to be terrified of speaking in front of people. Here's how I overcame that fear and became a confident presenter.",
      date: '2025-10-15',
      time: '14:00',
      tag: 'Personal Growth',
      centerId: center._id,
      createdBy: admin._id,
    },
    {
      title: 'كيف نجحت في الحصول على منحة دراسية - Scholarship Success',
      host: 'ليلى بوعزيز - Leila Bouaziz',
      description:
        'شاركت تجربتي الكاملة في التقديم للمنحات الدراسية والنصائح التي ساعدتني في النجاح. Shared my complete experience in applying for scholarships and tips that helped me succeed.',
      date: '2025-10-08',
      time: '16:00',
      tag: 'Education',
      centerId: center._id,
      createdBy: admin._id,
    },
    {
      title: 'From Freelancing to Full-Time: My Transition',
      host: 'Youssef Hamidi',
      description:
        'The ups and downs of transitioning from freelance work to a full-time position, and what I wish I knew earlier.',
      date: '2025-09-28',
      time: '15:00',
      tag: 'Career',
      centerId: center._id,
      createdBy: admin._id,
    },
  ];

  const createdPastSessions = await ExperienceSession.insertMany(pastSessions);
  // eslint-disable-next-line no-console
  console.log(`✅ Created ${createdPastSessions.length} past sessions`);

  // Create experience cards linked to some sessions
  const experienceCards = [
    {
      title: 'Overcoming Public Speaking Anxiety',
      host: 'Mohammed Rachid',
      summary:
        'My journey from being terrified of public speaking to confidently presenting to large audiences. I learned that fear is natural, but practice and preparation are the keys to success. Start small, join speaking clubs, and gradually challenge yourself with bigger audiences.',
      fullStory: `I remember my first presentation in university - my hands were shaking, my voice was trembling, and I could barely look at the audience. The fear of public speaking had controlled me for years, affecting my academic performance and career opportunities.

The turning point came when I realized that avoiding this fear was limiting my potential. I decided to face it head-on by joining a local Toastmasters club. The supportive environment there was crucial - everyone understood the struggle because they'd been through it themselves.

I started by giving short 2-minute speeches to small groups of 5-10 people. Each week, I pushed myself a little more. I learned breathing techniques to manage my anxiety - taking deep breaths before speaking helped calm my nerves significantly. I also discovered that thorough preparation was key; knowing my material inside and out gave me confidence.

One technique that worked wonders was shifting my focus from myself to my message. Instead of worrying about what people thought of me, I concentrated on the value I was providing to the audience. This mental shift reduced my self-consciousness dramatically.

After six months of consistent practice, I was asked to present at a university conference in front of 200 people. It was terrifying, but I applied everything I'd learned. The presentation went well, and the positive feedback I received was incredibly validating.

Today, I regularly speak at conferences and workshops. The anxiety hasn't completely disappeared - I still get nervous before big presentations - but I've learned to channel that energy into enthusiasm rather than fear. Public speaking has opened so many doors for me professionally and personally.

The most important lesson? Everyone feels nervous about public speaking. The difference between those who succeed and those who don't is simply practice and persistence. Your fear is valid, but it doesn't have to control you.`,
      lessons: [
        'Start with small groups and gradually increase audience size',
        'Practice makes perfect - rehearse your speeches multiple times',
        'Focus on your message, not on yourself',
        'Use breathing techniques to manage anxiety',
        'Remember that the audience wants you to succeed',
      ],
      tag: 'Personal Growth',
      centerId: center._id,
      sessionId: createdPastSessions[0]._id,
      createdBy: admin._id,
    },
    {
      title: 'كيف نجحت في الحصول على منحة دراسية',
      host: 'ليلى بوعزيز - Leila Bouaziz',
      summary:
        'رحلتي للحصول على منحة دراسية كاملة للدراسة في الخارج. تعلمت أن التحضير المبكر والبحث الجيد والصدق في الطلب هي مفاتيح النجاح. My journey to receiving a full scholarship to study abroad taught me that early preparation, thorough research, and authenticity are keys to success.',
      fullStory: `بدأت رحلتي للبحث عن منح دراسية في السنة الثانية من الجامعة. كنت أعلم أن عائلتي لا تستطيع تحمل تكاليف الدراسة في الخارج، لكنني كنت مصممة على تحقيق حلمي.

I started my scholarship search journey in my second year of university. I knew my family couldn't afford studying abroad, but I was determined to achieve my dream.

أمضيت ساعات طويلة في البحث عن المنح المتاحة. أنشأت جدول بيانات لتتبع المواعيد النهائية والمتطلبات لكل منحة. اكتشفت أن هناك مئات المنح المتاحة، لكن القليل منها فقط يناسب مجال دراستي واهتماماتي.

I spent long hours researching available scholarships. I created a spreadsheet to track deadlines and requirements for each one. I discovered there were hundreds of scholarships available, but only a few matched my field and interests.

الجزء الأصعب كان كتابة رسالة التحفيز. كتبت وأعدت الكتابة عشرات المرات. طلبت من أساتذتي وأصدقائي مراجعتها. تعلمت أن الصدق والشغف أهم من الكلمات الفخمة. حكيت قصتي الحقيقية - كيف أن التعليم غير حياة عائلتي وكيف أريد استخدام معرفتي لمساعدة مجتمعي.

The hardest part was writing the motivation letter. I wrote and rewrote it dozens of times. I asked my professors and friends to review it. I learned that honesty and passion are more important than fancy words. I told my true story - how education changed my family's life and how I want to use my knowledge to help my community.

بعد تقديم طلبات لـ 15 منحة مختلفة، حصلت على ثلاث مقابلات. كانت المقابلة الأولى كارثة - كنت متوترة جداً ولم أجب بشكل جيد. لكنني تعلمت من أخطائي واستعدت بشكل أفضل للمقابلات التالية.

After applying to 15 different scholarships, I got three interviews. The first interview was a disaster - I was too nervous and didn't answer well. But I learned from my mistakes and prepared better for the next interviews.

في النهاية، حصلت على منحة كاملة لدراسة الماجستير في هولندا. عندما تلقيت رسالة القبول، بكيت من الفرح. كانت تلك اللحظة تتويجاً لسنتين من العمل الجاد والمثابرة.

In the end, I received a full scholarship to study my Master's in the Netherlands. When I received the acceptance letter, I cried with joy. That moment was the culmination of two years of hard work and perseverance.

نصيحتي لكم: لا تستسلموا بعد الرفض الأول أو حتى العاشر. كل محاولة هي فرصة للتعلم والتحسين. حلمكم يستحق الجهد.

My advice to you: don't give up after the first rejection or even the tenth. Every attempt is an opportunity to learn and improve. Your dream is worth the effort.`,
      lessons: [
        'ابدأ البحث عن المنح مبكراً - Start searching for scholarships early',
        'اكتب رسالة تحفيزية صادقة وشخصية - Write an honest and personal motivation letter',
        'احصل على توصيات قوية من أساتذتك - Get strong recommendations from your professors',
        'قدم على عدة منح لزيادة فرصك - Apply to multiple scholarships to increase your chances',
        'استعد جيداً للمقابلات - Prepare well for interviews',
      ],
      tag: 'Education',
      centerId: center._id,
      sessionId: createdPastSessions[1]._id,
      createdBy: admin._id,
    },
    {
      title: 'From Freelancing to Full-Time Career',
      host: 'Youssef Hamidi',
      summary:
        'Transitioning from freelance work to a full-time position was both exciting and challenging. I learned the importance of financial planning, building professional relationships, and understanding the value of stability versus flexibility.',
      fullStory: `For three years, I worked as a freelance web developer. I loved the flexibility - working from coffee shops, choosing my projects, setting my own hours. But as time went on, I started feeling the downsides: inconsistent income, no benefits, and the constant pressure of finding the next client.

The decision to seek full-time employment wasn't easy. I felt like I was giving up my freedom, my independence. But my priorities were changing - I wanted stability, healthcare benefits, and the opportunity to work on larger, more complex projects as part of a team.

I started applying to companies while still maintaining my freelance clients. This was crucial because it gave me financial security during the transition. I was selective about the positions I applied for, looking for companies with good culture and interesting technical challenges.

The interview process was eye-opening. After years of working alone, I had to relearn how to present myself in a corporate setting, answer behavioral questions, and work through technical challenges with others watching. I failed several interviews before I got better at it.

What ultimately helped me land my current position was my freelance portfolio. I could show real projects, real clients, and real problem-solving. Companies valued that practical experience. My advice? Don't see freelancing and full-time work as opposites - they're complementary experiences that each make you stronger in different ways.

The first few months in my full-time role were an adjustment. I had to get used to meetings, team dynamics, and being in an office (or on video calls) at set hours. But I also discovered the benefits: learning from experienced colleagues, working on enterprise-scale projects, and having a steady paycheck with benefits.

One year in, I don't regret the transition. I still occasionally take small freelance projects on the side (with my employer's knowledge and approval), which gives me the best of both worlds. The key is finding what works for your current life stage and being open to change as your needs evolve.`,
      lessons: [
        'Build an emergency fund before making the transition',
        'Network actively - many full-time positions come from connections',
        'Evaluate benefits beyond salary (healthcare, retirement, etc.)',
        "Don't burn bridges with freelance clients - maintain relationships",
        'Be prepared for a cultural shift in work environment',
      ],
      tag: 'Career',
      centerId: center._id,
      sessionId: createdPastSessions[2]._id,
      createdBy: admin._id,
    },
    {
      title: 'Building My First Mobile App',
      host: 'Rami Khalil',
      summary:
        'The story of how I went from knowing nothing about mobile development to launching my first app on the App Store. It took months of learning, many failed attempts, and countless debugging sessions, but the achievement was worth every struggle.',
      fullStory: `I had an idea for a mobile app that would help students organize their study schedules. The problem? I had never built a mobile app before. I was a web developer with some JavaScript experience, but mobile development was completely new territory.

I started by researching different frameworks. Native iOS development seemed too limiting (I wanted both iOS and Android), and I wasn't ready to learn two completely different ecosystems. After comparing options, I chose React Native because of my JavaScript background.

The learning curve was steep. I spent my evenings and weekends going through tutorials, building small practice apps, and reading documentation. YouTube became my best friend. I must have watched hundreds of hours of tutorials. But watching videos wasn't enough - I needed to code.

My first attempts were terrible. The app crashed constantly, the UI looked amateurish, and the performance was sluggish. I almost gave up several times. What kept me going was the community - I joined React Native forums and Discord channels where other developers were incredibly helpful in answering my questions.

After three months of development, I had a working prototype. I showed it to friends and family. Their feedback was honest and sometimes harsh, but incredibly valuable. I spent another month refining the UI/UX, fixing bugs, and adding features they suggested.

Then came the app store submission process. Apple rejected my first submission because of guideline violations I didn't even know existed. I had to revise and resubmit three times before finally getting approved. Each rejection was frustrating, but it taught me to read guidelines more carefully.

The day my app went live on the App Store was surreal. I had spent six months from idea to launch. The first download from someone I didn't know felt incredible. Sure, the app wasn't perfect, and it only had a few hundred downloads in the first month, but it was MY app, built from scratch.

Looking back, what made the difference was persistence and community support. Every developer struggles with their first app. The ones who succeed are simply the ones who don't quit.`,
      lessons: [
        'Choose the right framework for your needs (React Native, Flutter, Native)',
        'Start with a simple MVP and iterate based on feedback',
        'User experience is more important than fancy features',
        'Testing on real devices is crucial',
        'The App Store approval process requires patience and attention to detail',
      ],
      tag: 'Technology',
      centerId: center._id,
      sessionId: null,
      createdBy: admin._id,
    },
    {
      title: 'تجربتي في تأسيس مشروع اجتماعي - Social Enterprise Journey',
      host: 'سارة حمدي - Sara Hamdi',
      summary:
        'كيف بدأت مشروعاً اجتماعياً لمساعدة الشباب في مجتمعي. تعلمت أن التأثير الاجتماعي يتطلب التزاماً طويل الأمد وفهماً عميقاً لاحتياجات المجتمع. How I started a social project to help youth in my community and learned that social impact requires long-term commitment.',
      fullStory: `كنت أعمل في شركة تقنية ناجحة براتب جيد، لكنني كنت أشعر بأن شيئاً ما ناقص. كنت أرى الشباب في حيي يفتقرون إلى الفرص والإرشاد الذي حظيت به أنا. قررت أن أفعل شيئاً حيال ذلك.

I was working at a successful tech company with a good salary, but I felt something was missing. I saw youth in my neighborhood lacking the opportunities and mentorship I had received. I decided to do something about it.

بدأت صغيراً - مجموعة من 10 شباب يلتقون كل سبت في مركز محلي. كنا نتحدث عن المهارات الحياتية، البرمجة، والتخطيط للمستقبل. لم أكن أعرف ما أفعله حقاً، لكنني كنت متحمسة ومستعدة للتعلم.

I started small - a group of 10 youth meeting every Saturday at a local center. We talked about life skills, coding, and planning for the future. I didn't really know what I was doing, but I was enthusiastic and ready to learn.

التحدي الأول كان المال. لم يكن لدي ميزانية، وكنت أدفع كل شيء من جيبي الخاص. بعد ستة أشهر، قدمت طلباً لمنحة صغيرة من منظمة محلية وحصلت عليها. كانت تلك لحظة محورية - الاعتراف الخارجي بعملنا منحني ثقة كبيرة.

The first challenge was money. I had no budget and was paying for everything from my own pocket. After six months, I applied for a small grant from a local organization and received it. That was a pivotal moment - external recognition of our work gave me great confidence.

مع نمو المشروع، تعلمت دروساً مهمة. أهمها: الاستماع أكثر من الحديث. في البداية، كنت أفترض أنني أعرف ما يحتاجه الشباب. لكنني تعلمت أن أسألهم مباشرة واستمع لإجاباتهم. هذا غير كل شيء - برامجنا أصبحت أكثر فعالية لأنها كانت تلبي احتياجات حقيقية.

As the project grew, I learned important lessons. Most importantly: listen more than you speak. Initially, I assumed I knew what youth needed. But I learned to ask them directly and listen to their answers. This changed everything - our programs became more effective because they addressed real needs.

اليوم، بعد ثلاث سنوات، لدينا 150 شاب في برامجنا، شراكات مع خمس مدارس، وفريق من 8 متطوعين. رأيت شباباً يحصلون على وظائف، يدخلون الجامعة، ويبدأون مشاريعهم الخاصة. هذا هو التأثير الحقيقي.

Today, after three years, we have 150 youth in our programs, partnerships with five schools, and a team of 8 volunteers. I've seen youth get jobs, enter university, and start their own projects. This is real impact.

المشروع الاجتماعي ليس سهلاً - إنه يتطلب صبراً، مرونة، والتزاماً طويل الأمد. لكن عندما ترى حياة شاب تتغير للأفضل بسبب عملك، تدرك أن كل التحديات كانت تستحق العناء.

Social enterprise isn't easy - it requires patience, flexibility, and long-term commitment. But when you see a young person's life change for the better because of your work, you realize all the challenges were worth it.`,
      lessons: [
        "افهم احتياجات مجتمعك بعمق - Deeply understand your community's needs",
        'ابدأ صغيراً واختبر فكرتك - Start small and test your idea',
        'بناء شراكات قوية أمر أساسي - Building strong partnerships is essential',
        'قس تأثيرك بطرق ملموسة - Measure your impact in tangible ways',
        'الاستدامة المالية مهمة للاستمرار - Financial sustainability is important for continuity',
      ],
      tag: 'Entrepreneurship',
      centerId: center._id,
      sessionId: null,
      createdBy: admin._id,
    },
  ];

  const createdCards = await ExperienceCard.insertMany(experienceCards);
  // eslint-disable-next-line no-console
  console.log(`✅ Created ${createdCards.length} experience cards`);

  // eslint-disable-next-line no-console
  console.log('\n🎉 Experience data seeding completed successfully!');
  // eslint-disable-next-line no-console
  console.log(`📊 Summary:`);
  // eslint-disable-next-line no-console
  console.log(`   - Upcoming Sessions: ${createdSessions.length}`);
  // eslint-disable-next-line no-console
  console.log(`   - Past Sessions: ${createdPastSessions.length}`);
  // eslint-disable-next-line no-console
  console.log(`   - Experience Cards: ${createdCards.length}`);
};

export default seedExperienceData;
