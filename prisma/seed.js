const express = require('express');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const https = require('https');

const prisma = new PrismaClient();

// Function to clean the database
async function cleanDatabase() {
  await prisma.favorite.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();
  console.log('Database cleaned');
}

// Function to fetch quotes from the API and handle tags
async function fetchQuotes() {
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    const response = await axios.get('https://api.quotable.io/quotes/random?limit=150', { httpsAgent: agent });
    const quotes = Array.isArray(response.data) ? response.data : response.data.results || [];

    if (!quotes.length) {
      console.log('No quotes received from API');
      return;
    }

    for (const quote of quotes) {
      // Process and connect tags dynamically
      const tagConnections = await Promise.all(
        quote.tags.map(async (name) =>
          prisma.tag.upsert({
            where: { name },
            create: { name },
            update: {},
          })
        )
      );

      // Store or update the quote
      await prisma.quote.upsert({
        where: { externalId: quote._id },
        update: {
          content: quote.content,
          author: quote.author,
          tags: {
            connect: tagConnections.map((tag) => ({ id: tag.id })),
          },
          authorSlug: quote.authorSlug,
          length: quote.length,
          dateModified: new Date(),
        },
        create: {
          externalId: quote._id,
          content: quote.content,
          author: quote.author,
          tags: {
            connect: tagConnections.map((tag) => ({ id: tag.id })),
          },
          authorSlug: quote.authorSlug,
          length: quote.length,
        },
      });
    }

    console.log(`${quotes.length} quotes fetched and stored successfully`);
  } catch (error) {
    console.error('Error in fetchQuotes:', error.message);
  }
}

// Function to create users
async function createUser() {
  await prisma.user.create({
    data: {
      id: 'user-1',
    },
  });

  console.log('User created successfully');
}

// Function to create favorites
async function createFavorite() {
  const user = await prisma.user.findFirst();
  const quote = await prisma.quote.findFirst();

  if (user && quote) {
    await prisma.favorite.create({
      data: {
        userId: user.id,
        quoteId: quote.id,
      },
    });

    console.log('Favorite created successfully');
  }
}

// Main function call
async function main() {
  await cleanDatabase();
  await fetchQuotes();
  await createUser();
  await createFavorite();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

// Start the server
const app = express();
app.listen(4400, () => {
  console.log('Server running on port 4400');
});