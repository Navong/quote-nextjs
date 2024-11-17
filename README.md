# Quote App
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat&logo=next.js)](https://nextjs.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/) [![Zustand](https://img.shields.io/badge/Zustand-Latest-orange?style=flat)](https://github.com/pmndrs/zustand) [![pnpm](https://img.shields.io/badge/pnpm-7.10.0-blue?style=flat)](https://pnpm.io/) [![Vercel](https://img.shields.io/badge/Vercel-Deployed-green?style=flat)](https://vercel.com/)

Quote App is a Next.js application that allows users to discover, translate, and favorite inspiring quotes. Built with modern web technologies, it offers a seamless and interactive experience for quote enthusiasts.

## Features

- **Random Quote Generation**: Fetch and display random quotes.
- **Translation**: Translate quotes to Khmer, Korean, or Japanese using the Groq AI API for accurate contextual translations.
- **Favorites System**: Add quotes to favorites and manage them.
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technical Highlights

### Caching Strategy

I implemented a custom caching strategy for random quotes to balance between providing fresh content and reducing API calls:

- A pool of random quotes is fetched and cached on the server.
- Quotes are served from this pool for a set duration (60 seconds).
- The pool is refreshed after the cache duration expires.
- This approach reduces load on the backend while still providing variety in quotes.

Implementation details:
- Located in `app/api/quotes/random/route.ts`
- Uses in-memory caching with a fixed pool size and cache duration.
- Ensures each request gets a "random" quote without hitting the external API every time.

### Optimistic Updates

To enhance user experience, I implemented optimistic updates for adding and removing favorites:

- When a user adds a quote to favorites, the UI updates immediately.
- When a user removes a quote from favorites, it's instantly removed from the list.
- The favorites count in the header updates in real-time.
- If the server request fails, the UI reverts to its previous state.

Implementation details:
- Utilized Zustand for state management (`store/useFavoriteStore.ts`).
- Optimistic logic implemented in `addToFavorites` and `removeFromFavorites` functions.
- UI components (`QuoteCard`, `FavoritesPage`, `Header`) react to these optimistic updates.

These techniques significantly improve the perceived performance and responsiveness of the application.

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for production
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind CSS
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Lucide React](https://lucide.dev/) - Icon set
- [Groq AI API](https://groq.com/) - AI-powered translation for contextual accuracy

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/quote-nextjs.git
   cd quote-nextjs
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Configuration

Create a `.env.local` file in the root directory and add the necessary environment variables:

```env
NEXT_PUBLIC_API_URL=''
GROQ_API=''
```

## Deployment

To deploy the application, I recommend using [Vercel](https://vercel.com/) for seamless Next.js deployment:

1. Push your code to GitHub or another Git provider.
2. Connect your repository to Vercel.
3. Follow the deployment instructions provided by Vercel.

## Contributing

Contributions are welcome! If you want to contribute, follow these steps:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

If you have any questions or suggestions, feel free to reach out:

- Email: bongchannavong@outlook.com
- GitHub: [Navong](https://github.com/Navong)

Enjoy using the Quote App and get inspired every day!

