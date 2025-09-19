import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@noteshub.com' },
    update: {},
    create: {
      email: 'admin@noteshub.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isPremium: true,
      emailVerified: true,
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 12);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@noteshub.com' },
    update: {},
    create: {
      email: 'demo@noteshub.com',
      passwordHash: demoPassword,
      name: 'Demo User',
      role: 'USER',
      isPremium: false,
      emailVerified: true,
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Create premium demo user
  const premiumPassword = await bcrypt.hash('premium123', 12);
  const premiumUser = await prisma.user.upsert({
    where: { email: 'premium@noteshub.com' },
    update: {},
    create: {
      email: 'premium@noteshub.com',
      passwordHash: premiumPassword,
      name: 'Premium User',
      role: 'USER',
      isPremium: true,
      emailVerified: true,
    },
  });

  console.log('✅ Created premium user:', premiumUser.email);

  // Sample notes data
  const sampleNotes = [
    {
      title: 'Introduction to Computer Science',
      subject: 'Computer Science',
      class: 'CS101',
      tags: ['programming', 'basics', 'algorithms'],
      description: 'Comprehensive notes covering fundamental concepts in computer science including programming basics, data structures, and algorithms.',
      contentHtml: '<h1>Introduction to Computer Science</h1><p>Computer science is the study of computational systems, algorithms, and the design of computer programs...</p>',
      contentText: 'Introduction to Computer Science\n\nComputer science is the study of computational systems, algorithms, and the design of computer programs...',
      fileUrl: 'https://example.com/sample.pdf',
      license: 'Creative Commons',
      visibility: 'PUBLIC' as const,
      ownerId: demoUser.id,
    },
    {
      title: 'Advanced Mathematics - Calculus',
      subject: 'Mathematics',
      class: 'MATH201',
      tags: ['calculus', 'derivatives', 'integrals'],
      description: 'Detailed notes on differential and integral calculus with solved examples and practice problems.',
      contentHtml: '<h1>Advanced Mathematics - Calculus</h1><p>Calculus is a branch of mathematics that studies continuous change...</p>',
      contentText: 'Advanced Mathematics - Calculus\n\nCalculus is a branch of mathematics that studies continuous change...',
      fileUrl: 'https://example.com/calculus.pdf',
      license: 'MIT',
      visibility: 'PUBLIC' as const,
      ownerId: demoUser.id,
    },
    {
      title: 'Physics - Quantum Mechanics',
      subject: 'Physics',
      class: 'PHYS301',
      tags: ['quantum', 'mechanics', 'wave-function'],
      description: 'Introduction to quantum mechanics principles and applications.',
      contentHtml: '<h1>Physics - Quantum Mechanics</h1><p>Quantum mechanics is a fundamental theory in physics...</p>',
      contentText: 'Physics - Quantum Mechanics\n\nQuantum mechanics is a fundamental theory in physics...',
      fileUrl: 'https://example.com/quantum.pdf',
      license: 'Academic Use',
      visibility: 'PUBLIC' as const,
      ownerId: premiumUser.id,
    },
    {
      title: 'Data Structures and Algorithms',
      subject: 'Computer Science',
      class: 'CS201',
      tags: ['data-structures', 'algorithms', 'complexity'],
      description: 'Comprehensive guide to data structures and algorithm analysis.',
      contentHtml: '<h1>Data Structures and Algorithms</h1><p>Data structures are ways of organizing data...</p>',
      contentText: 'Data Structures and Algorithms\n\nData structures are ways of organizing data...',
      fileUrl: 'https://example.com/dsa.pdf',
      license: 'GPL',
      visibility: 'PUBLIC' as const,
      ownerId: premiumUser.id,
    },
    {
      title: 'Chemistry - Organic Compounds',
      subject: 'Chemistry',
      class: 'CHEM201',
      tags: ['organic', 'compounds', 'reactions'],
      description: 'Study notes on organic chemistry compounds and their reactions.',
      contentHtml: '<h1>Chemistry - Organic Compounds</h1><p>Organic chemistry is the study of carbon compounds...</p>',
      contentText: 'Chemistry - Organic Compounds\n\nOrganic chemistry is the study of carbon compounds...',
      fileUrl: 'https://example.com/organic.pdf',
      license: 'Creative Commons',
      visibility: 'PUBLIC' as const,
      ownerId: demoUser.id,
    },
    {
      title: 'Biology - Cell Structure',
      subject: 'Biology',
      class: 'BIO101',
      tags: ['cell', 'structure', 'organelles'],
      description: 'Detailed study of cell structure and organelle functions.',
      contentHtml: '<h1>Biology - Cell Structure</h1><p>Cells are the basic units of life...</p>',
      contentText: 'Biology - Cell Structure\n\nCells are the basic units of life...',
      fileUrl: 'https://example.com/biology.pdf',
      license: 'Academic Use',
      visibility: 'PUBLIC' as const,
      ownerId: premiumUser.id,
    },
    {
      title: 'History - World War II',
      subject: 'History',
      class: 'HIST201',
      tags: ['wwii', 'history', 'warfare'],
      description: 'Comprehensive notes on World War II events and consequences.',
      contentHtml: '<h1>History - World War II</h1><p>World War II was a global war that lasted from 1939 to 1945...</p>',
      contentText: 'History - World War II\n\nWorld War II was a global war that lasted from 1939 to 1945...',
      fileUrl: 'https://example.com/wwii.pdf',
      license: 'Public Domain',
      visibility: 'PUBLIC' as const,
      ownerId: demoUser.id,
    },
    {
      title: 'Economics - Microeconomics',
      subject: 'Economics',
      class: 'ECON101',
      tags: ['economics', 'micro', 'market'],
      description: 'Introduction to microeconomics principles and market analysis.',
      contentHtml: '<h1>Economics - Microeconomics</h1><p>Microeconomics is the study of individual economic units...</p>',
      contentText: 'Economics - Microeconomics\n\nMicroeconomics is the study of individual economic units...',
      fileUrl: 'https://example.com/micro.pdf',
      license: 'MIT',
      visibility: 'PUBLIC' as const,
      ownerId: premiumUser.id,
    },
    {
      title: 'Literature - Shakespeare Analysis',
      subject: 'Literature',
      class: 'ENG301',
      tags: ['shakespeare', 'analysis', 'drama'],
      description: 'Literary analysis of Shakespeare\'s major works.',
      contentHtml: '<h1>Literature - Shakespeare Analysis</h1><p>William Shakespeare is widely regarded as the greatest writer...</p>',
      contentText: 'Literature - Shakespeare Analysis\n\nWilliam Shakespeare is widely regarded as the greatest writer...',
      fileUrl: 'https://example.com/shakespeare.pdf',
      license: 'Creative Commons',
      visibility: 'PUBLIC' as const,
      ownerId: demoUser.id,
    },
    {
      title: 'Private Study Notes',
      subject: 'Personal',
      class: 'Personal',
      tags: ['private', 'study', 'notes'],
      description: 'Personal study notes - private access only.',
      contentHtml: '<h1>Private Study Notes</h1><p>These are my private study notes...</p>',
      contentText: 'Private Study Notes\n\nThese are my private study notes...',
      fileUrl: 'https://example.com/private.pdf',
      license: 'All Rights Reserved',
      visibility: 'PRIVATE' as const,
      ownerId: demoUser.id,
    },
  ];

  // Create notes with slugs
  for (const noteData of sampleNotes) {
    const slug = noteData.title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    await prisma.note.upsert({
      where: { slug },
      update: {},
      create: {
        ...noteData,
        slug,
        views: Math.floor(Math.random() * 1000),
        downloads: Math.floor(Math.random() * 100),
      },
    });
  }

  console.log('✅ Created sample notes');

  // Create ad slots
  const adSlots = [
    {
      name: 'homepage-hero',
      page: 'homepage',
      position: 'hero',
      code: '<!-- AdSense code will go here -->',
      enabled: true,
    },
    {
      name: 'notes-sidebar',
      page: 'notes',
      position: 'sidebar',
      code: '<!-- AdSense code will go here -->',
      enabled: true,
    },
    {
      name: 'reader-banner',
      page: 'reader',
      position: 'banner',
      code: '<!-- AdSense code will go here -->',
      enabled: false,
    },
  ];

  for (const adSlot of adSlots) {
    await prisma.adSlot.upsert({
      where: { name: adSlot.name },
      update: {},
      create: adSlot,
    });
  }

  console.log('✅ Created ad slots');

  console.log('🎉 Database seeding completed!');
  console.log('');
  console.log('Demo accounts created:');
  console.log('📧 Admin: admin@noteshub.com / admin123');
  console.log('📧 Demo User: demo@noteshub.com / demo123');
  console.log('📧 Premium User: premium@noteshub.com / premium123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });