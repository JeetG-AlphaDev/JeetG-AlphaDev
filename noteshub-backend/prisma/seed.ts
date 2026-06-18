import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create admin user
    const adminPassword = await hashPassword('Admin123!');
    const admin = await prisma.admin.upsert({
      where: { email: 'admin@noteshub.com' },
      update: {},
      create: {
        email: 'admin@noteshub.com',
        username: 'admin',
        firstName: 'System',
        lastName: 'Administrator',
        password: adminPassword,
        role: 'SUPER_ADMIN',
        permissions: [
          'users:read',
          'users:write',
          'users:delete',
          'notes:read',
          'notes:write',
          'notes:delete',
          'files:read',
          'files:write',
          'files:delete',
          'admin:read',
          'admin:write',
          'admin:delete',
          'system:read',
          'system:write',
        ],
      },
    });

    console.log('✅ Created admin user:', admin.email);

    // Create demo users
    const demoUsers = [
      {
        email: 'john@example.com',
        username: 'john_doe',
        firstName: 'John',
        lastName: 'Doe',
        password: await hashPassword('Password123!'),
      },
      {
        email: 'jane@example.com',
        username: 'jane_smith',
        firstName: 'Jane',
        lastName: 'Smith',
        password: await hashPassword('Password123!'),
      },
      {
        email: 'demo@example.com',
        username: 'demo_user',
        firstName: 'Demo',
        lastName: 'User',
        password: await hashPassword('Password123!'),
      },
    ];

    const createdUsers = [];
    for (const userData of demoUsers) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData,
      });
      createdUsers.push(user);
      console.log('✅ Created demo user:', user.email);
    }

    // Create demo notes for the first user
    const firstUser = createdUsers[0];
    if (firstUser) {
      const demoNotes = [
        {
          title: 'Welcome to NotesHub!',
          content: `# Welcome to NotesHub!

This is your first note. NotesHub is a powerful note-taking application with the following features:

## Features
- **Rich Text Editing**: Write notes with markdown support
- **File Attachments**: Attach images, documents, and more
- **AI Chat**: Get help with your notes using AI
- **Search**: Find your notes quickly with powerful search
- **Tags**: Organize notes with tags
- **Public/Private**: Share notes publicly or keep them private

## Getting Started
1. Create new notes using the + button
2. Organize with tags
3. Try the AI chat feature
4. Upload files to your notes

Happy note-taking!`,
          tags: ['welcome', 'guide', 'features'],
          isPublic: true,
          isPinned: true,
          userId: firstUser.id,
        },
        {
          title: 'My First Note',
          content: `This is my first note in NotesHub. I can write in **markdown** and add *formatting*.

## Todo List
- [x] Create account
- [x] Write first note
- [ ] Explore AI features
- [ ] Upload a file
- [ ] Create more notes

This is going to be useful for organizing my thoughts!`,
          tags: ['personal', 'todo'],
          isPublic: false,
          userId: firstUser.id,
        },
        {
          title: 'Meeting Notes - Project Alpha',
          content: `# Meeting Notes - Project Alpha
**Date**: ${new Date().toISOString().split('T')[0]}
**Attendees**: John, Jane, Mike

## Agenda
1. Project timeline review
2. Resource allocation
3. Risk assessment

## Action Items
- [ ] Update project timeline (John)
- [ ] Review budget requirements (Jane)
- [ ] Schedule next meeting (Mike)

## Notes
The project is on track. We need to focus on the backend API development next week.`,
          tags: ['meeting', 'project', 'work'],
          isPublic: false,
          userId: firstUser.id,
        },
        {
          title: 'Learning JavaScript - Advanced Concepts',
          content: `# Advanced JavaScript Concepts

## Closures
A closure is a function that has access to variables in its outer scope even after the outer function returns.

\`\`\`javascript
function outerFunction(x) {
  return function innerFunction(y) {
    return x + y;
  };
}

const addFive = outerFunction(5);
console.log(addFive(3)); // 8
\`\`\`

## Promises and Async/Await
Promises help handle asynchronous operations.

\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\`

## Event Loop
The event loop is what allows JavaScript to perform non-blocking operations.`,
          tags: ['programming', 'javascript', 'learning'],
          isPublic: true,
          userId: firstUser.id,
        },
      ];

      for (const noteData of demoNotes) {
        // Calculate word count and read time
        const wordCount = noteData.content.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200); // 200 words per minute
        const excerpt = noteData.content.substring(0, 200) + (noteData.content.length > 200 ? '...' : '');

        await prisma.note.create({
          data: {
            ...noteData,
            wordCount,
            readTime,
            excerpt,
          },
        });
      }

      console.log(`✅ Created ${demoNotes.length} demo notes for ${firstUser.email}`);
    }

    // Create demo chat session for the first user
    if (firstUser) {
      const chatSession = await prisma.chatSession.create({
        data: {
          title: 'Welcome Chat',
          userId: firstUser.id,
          messages: {
            create: [
              {
                content: 'Hello! How can I help you with your notes today?',
                role: 'ASSISTANT',
                model: 'gpt-3.5-turbo',
                tokens: 12,
              },
              {
                content: 'Hi! I\'m new to NotesHub. Can you help me get started?',
                role: 'USER',
              },
              {
                content: 'Of course! I\'d be happy to help you get started with NotesHub. Here are some key features you can explore:\n\n1. **Create Notes**: Click the + button to create new notes with markdown support\n2. **Organize with Tags**: Add tags to categorize your notes\n3. **File Attachments**: Upload images and documents to your notes\n4. **Search**: Use the search feature to find notes quickly\n5. **Public Sharing**: Make notes public to share with others\n\nWould you like me to help you with any specific feature?',
                role: 'ASSISTANT',
                model: 'gpt-3.5-turbo',
                tokens: 98,
              },
            ],
          },
        },
      });

      console.log('✅ Created demo chat session for', firstUser.email);
    }

    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });