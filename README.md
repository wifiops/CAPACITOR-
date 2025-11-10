# CAPACITOR
A voice-powered writing companion built with Next.js, React, TypeScript, and FastAPI.

## Features
- 🎤 Real-time voice dictation
- 🤖 AI-powered text improvement (FastAPI backend)
- ✨ Grammar and clarity suggestions
- 📝 Punctuation voice commands
- 💬 Natural language AI commands

## Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend**: FastAPI (Python 3.12)
- **AI**: Ready for LLM integration (DeepSeek, Mistral, IBM Granite, OpenAI, etc.)

## Getting Started

### Frontend (Next.js)

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
FASTAPI_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Backend (FastAPI)

1. Navigate to backend directory:
```bash
cd backend-example
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run FastAPI server:
```bash
python main.py
# or
uvicorn main:app --reload --port 8000
```

4. API will be available at [http://localhost:8000](http://localhost:8000)

## Project Structure
```
├── app/              # Next.js app directory
│   ├── api/          # API routes (proxies to FastAPI)
│   ├── components/   # React components
│   └── page.tsx      # Main page
├── components/       # React components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and AI handler
├── backend-example/ # FastAPI backend example
└── public/          # Static assets
```

## API Endpoints

### Next.js API Routes (proxies to FastAPI)
- `POST /api/ai` - Generic AI action handler
- `POST /api/ai/improve` - Improve text
- `POST /api/ai/rephrase` - Rephrase text
- `POST /api/ai/grammar` - Check grammar

### FastAPI Endpoints
- `POST /api/improve` - Improve text grammar and clarity
- `POST /api/rephrase` - Rephrase text
- `POST /api/grammar` - Check and fix grammar
- `POST /api/{action}` - Generic action handler

## Connecting Your LLM

Edit `backend-example/main.py` and replace placeholder functions with your LLM calls:

```python
# Example with OpenAI
from openai import OpenAI
client = OpenAI()

async def improve_text(request: TextRequest):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": f"Improve this text: {request.text}"}]
    )
    return TextResponse(improved_text=response.choices[0].message.content)
```

## Development
- `npm run dev` - Start Next.js dev server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Extension Development
This project is designed to be converted into a browser extension. The structure supports:
- Content scripts
- Background workers
- Popup UI
- Options page
