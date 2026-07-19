# Stadex - World Cup 2026 App

Stadex is the ultimate application for navigating and experiencing the 2026 World Cup across North America. It provides real-time information for fans and operational tools for stadium staff.

## Features

- **Live & History Match Results**: Real-time integration with `worldcup26.ir` API to fetch game scores, stadium details, and group standings.
- **Stadiums Explorer**: Browse all 16 official World Cup 2026 venues with detailed capacity and location data.
- **AI Translator**: An on-device translation tool powered by M2M100 for offline, secure translations in multiple languages (English, Spanish, French, Portuguese, German).
- **AI Support Chatbot**: An intelligent, responsive chatbot that actively pulls real-time context (like live scores, past matches, and stadium data) to answer your queries dynamically.
- **Authentication System**: Secure role-based access for Fans and Staff members.
- **Help & FAQ**: An easily accessible Help center with emergency contact information and answers to frequent questions.
- **Modern UI**: A responsive, accessible, and fast interface built using React, Vite, Tailwind CSS v4, and Shadcn UI.
- **Light/Dark Mode**: Full support for system-preferred theme switching.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Shadcn UI
- **Backend**: Express.js proxy with in-memory caching
- **Database**: SQLite3 (for user authentication)
- **AI**: Transformers.js (M2M100 Model)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server and backend concurrently:
   ```bash
   npm run dev
   ```
   
   *This command starts both the Vite frontend on port 5173 and the Express API on port 3001.*

## Sample Users (Authentication)

You can log in to the application using the following pre-configured demo accounts.

**Fan Account:**
- Email: `fan@fifa.com`
- Password: `password123`

**Staff Account:**
- Email: `staff@fifa.com`
- Password: `password123`

*Staff members receive access to specialized operational widgets and elevated permissions on the dashboard.*
