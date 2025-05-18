# Percent to AGI

A React-based web application that tracks humanity's progress toward Artificial General Intelligence with a blend of humor and scientific rigor.

## Features

- **AGI Completion Percentage**: A visually striking, dynamic indicator showing the estimated progress to AGI
- **Transparent Methodology**: Detailed breakdown of how the percentage is calculated with interactive elements
- **Multiple Perspectives**: Different percentage models representing optimistic, conservative, and capability-focused views
- **Data Visualizations**: Charts and graphs showing AI benchmark performances, research trends, and more
- **News Aggregation**: Recent AI research breakthroughs that impact the AGI percentage
- **Expert Opinions**: Quotes from researchers about where they believe we stand
- **Social Sharing**: Easy ways to share the current AGI percentage with others

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to a new file called `.env.local`
   - Fill in your API keys (see "Environment Variables" section below)
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

This project requires several API keys to function properly. Never commit these keys to version control.

### Required API Keys:

1. **OpenAI API Key** - Used for AI analysis of research papers and news
   - Sign up at [OpenAI Platform](https://platform.openai.com/signup)
   - Set as `OPENAI_API_KEY` in your `.env.local` file

2. **Firebase** - Used for authentication and database
   - Create a project at [Firebase Console](https://console.firebase.google.com/)
   - Add a web app to your project to get configuration details
   - Set the Firebase variables in your `.env.local` file

3. **News API Key** - Used to fetch AI news
   - Sign up at [News API](https://newsapi.org/register)
   - Set as `NEXT_PUBLIC_NEWS_API_KEY` in your `.env.local` file

## Technology Stack

- **Next.js** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Charting library for data visualizations

## Project Structure

```
percent-to-agi/
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js application routes
│   ├── components/    # Reusable components
│   ├── data/          # Data files and utilities
│   └── utils/         # Helper functions
├── postcss.config.js  # PostCSS configuration
├── tailwind.config.js # Tailwind CSS configuration
└── tsconfig.json      # TypeScript configuration
```

## Contributing

Contributions, suggestions, and feature requests are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the ISC License. 