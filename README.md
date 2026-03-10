# Pokemon Shakespearean Description App

A web application that fetches Pokemon descriptions and translates them into Shakespearean English. Users can also save
their favorite Pokemon for quick access.

## Features

- 🔍 **Search Pokemon**: Enter any Pokemon name to get its description
- 🎭 **Shakespearean Translation**: Automatically translates Pokemon descriptions into Shakespearean English
- ❤️ **Favorites**: Save and manage your favorite Pokemon
- 💾 **Persistence**: Favorites are saved in localStorage and persist after browser refresh
- ⚡ **Server-Rendered**: Built with Next.js for optimal performance

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Validation**: Zod
- **Styling**: Tailwind CSS
- **APIs**:
    - [PokéAPI](https://pokeapi.co/docs/v2) - Pokemon data
    - [Shakespeare Translator API](https://funtranslations.com/api/shakespeare) - Text translation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd poke-shakespere
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Running Locally

1. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Usage

1. **Search for a Pokemon**: Type a Pokemon name (e.g., "pikachu") in the text field and click Submit
2. **View Descriptions**: See both the original and Shakespearean descriptions
3. **Add to Favorites**: Click the heart icon to save a Pokemon to your favorites
4. **Manage Favorites**: Click on a favorite to view it again, or click ❌ to remove it

## Project Structure

```
poke-shakespere/
├── app/
│   ├── api/
│   │   └── pokemon/
│   │       └── route.ts     # API route for fetching and translating Pokemon
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── PokemonForm.tsx      # Main form component with state management
│   ├── PokemonCard.tsx      # Displays Pokemon data
│   ├── FavoritesList.tsx    # Favorites section
│   ├── TextField.tsx        # Input component
│   └── SubmitButton.tsx     # Button component
├── lib/
│   ├── api.ts               # Client-side API calls
│   ├── schemas.ts           # Zod schemas for type validation
│   └── favorites.ts         # LocalStorage management for favorites
├── __tests__/
│   ├── components/          # Component tests
│   ├── lib/                 # Utility function tests
│   └── app/api/             # API route tests
├── jest.config.js           # Jest configuration
├── jest.setup.js            # Jest setup file
└── README.md
```

## Important Note About Shakespeare API

⚠️ **The Shakespeare Translator API (funtranslations.com) requires a paid subscription for production use.** If the
Shakespeare API is unavailable or returns an error, the app will gracefully fall back to displaying the original Pokemon
description.