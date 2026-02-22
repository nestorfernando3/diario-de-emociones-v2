# Diario de Emociones V2

A mindful, offline-first web application designed as a personal emotional refuge. Built with React, Vite, Tailwind CSS, and GSAP for gentle, organic animations, and backed by Supabase for secure cloud synchronization.

## Features

- **The Refuge (Zen Editor):** A distraction-free writing environment that auto-saves to your local browser. It features a focus mode that fades out surrounding UI elements and gentle, empathetic prompts.
- **The Emotional Map:** A visual constellation of your past entries mapped by emotional resonance, using neutral, grounding colors instead of harsh red/green dichotomies.
- **Emotional First Aid Kit & Calm Anchor:** A globally accessible, heavy-blur modal designed for moments of high anxiety. It includes a guided 4-7-8 breathing visualizer using precise GSAP timelines, a 5-4-3-2-1 grounding technique, and direct local emergency contact lines (Atlántico Region).
- **Privacy & The Vault:** Full control over your data. You can export your entire journal as a JSON file, permanently erase local data, or synchronize securely to the cloud.
- **Supabase Cloud Sync:** Robust authentication and database synchronization. Your data is protected by Row Level Security (RLS), ensuring you are the only one who can access your thoughts.

## Tech Stack

- **Frontend:** React 19, Vite
- **Styling:** Tailwind CSS (emphasizing organic aesthetics like backdrop-blur, soft palettes, and CSS noise filters)
- **Animations:** GSAP 3 (ScrollTrigger, Timelines)
- **Icons:** Lucide React
- **Backend/BaaS:** Supabase (Auth, PostgreSQL)

## Local Setup

### Prerequisites

Make sure you have Node.js and npm installed.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nestorfernando3/diario-de-emociones-v2.git
   cd "diario-de-emociones-v2"
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Supabase Environment Variables:
   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Database Setup:
   Execute the SQL commands found in `supabase_setup.sql` in your Supabase SQL Editor to generate the `profiles` and `entries` tables with their respective Row Level Security policies.

5. Start the development server:

   ```bash
   npm run dev
   ```

## Design Philosophy (Semiotics of Safety)

This project strictly adheres to a "Semiotics of Safety" design framework:

- **No Judgmental Colors:** Avoiding harsh reds for "bad" emotions and bright greens for "good" emotions. Instead, we use a nuanced palette (e.g., Deep Indigo, Warm Amber, Soft Sage).
- **Motion as Medicine:** Animations mimic human breathing rather than abrupt UI popping.
- **Cognitive Load Reduction:** Heavy usage of backdrop filters and simplified interfaces to create a calming presence.

## Deployment

This application is deployed via GitHub Pages. To deploy a new version:

1. Ensure your `.env` variables are configured in your deployment environment if you want Supabase to function in the live build.
2. Run the deploy script:

   ```bash
   npm run deploy
   ```

## License

MIT License
