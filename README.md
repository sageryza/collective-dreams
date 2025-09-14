# Collective Dreams - Anonymous Dream Journal

A mystical web application where people can share their dreams anonymously, creating a collective unconscious experience. Dreams are displayed in a beautiful sky-and-clouds themed interface with purple mystical elements.

## Features

- **Anonymous Dream Sharing**: Post dreams without revealing your identity
- **Interactive Comments**: Respond to dreams while staying anonymous
- **Heart Reactions**: Show appreciation for dreams
- **Mystical Design**: Sky blue background with floating clouds and purple accents
- **Mobile Responsive**: Optimized for mobile and desktop
- **Real-time Updates**: See new dreams and comments as they appear

## Tech Stack

- **Frontend**: Next.js 15 with React and TypeScript
- **Styling**: Tailwind CSS with custom mystical theme
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the schema from `schema.sql`
3. Get your project URL and anon key from Settings > API
4. Update `.env.local` with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 4. Build for Production

```bash
npm run build
npm start
```

## Database Schema

The application uses the following tables:

- **users**: Stores user authentication data (private)
- **dreams**: Stores dream content (displayed anonymously)
- **comments**: Stores responses to dreams (displayed anonymously)
- **hearts**: Stores like reactions to dreams

## Key Design Decisions

### Anonymous by Design
- No usernames or profile pictures are displayed
- All interactions appear as "A dreamer" to maintain anonymity
- Users can only see their own data in private areas

### Mystical Aesthetic
- Dream text uses Courier New for readability
- UI elements use purple cursive fonts
- Animated cloud background creates ethereal atmosphere
- Soft gradients and transparency effects

### User Experience
- No character limits on dreams (with "see more" expansion)
- Simple heart reactions instead of complex social features
- Mobile-first responsive design
- Clean, distraction-free interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this code for your own projects!
