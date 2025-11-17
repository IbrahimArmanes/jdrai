# RPG AI System

A text-based RPG game system powered by Deepseek-V3.2 Exp (Thinking Mode).

## Project Structure

```
jdrai/
├── backend/          # Express.js backend
│   ├── routes/       # API routes
│   ├── controllers/  # Route controllers
│   ├── services/     # Business logic services
│   ├── utils/        # Utility functions
│   └── middleware/   # Express middleware
├── frontend/         # React frontend
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── utils/       # Utility functions
└── phase1-tasks.json # Project tasks tracking
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your Deepseek API key:
```
DEEPSEEK_API_KEY=your_actual_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Development

- Backend: `npm run dev` (runs with --watch for auto-reload)
- Frontend: `npm run dev` (Vite dev server with hot reload)

## Phase 0: Simple LLM Chat Interface

This phase implements a basic chat interface similar to online LLM services, with support for context parameters.

