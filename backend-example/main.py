"""
FastAPI Backend for CAPACITOR
Example structure - customize based on your LLM setup
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(title="CAPACITOR AI API")

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

class TextResponse(BaseModel):
    improved_text: Optional[str] = None
    result: Optional[str] = None
    corrected_text: Optional[str] = None
    rephrased_text: Optional[str] = None
    suggestions: Optional[List[dict]] = None

@app.get("/")
async def root():
    return {"message": "CAPACITOR AI API", "status": "running"}

@app.post("/api/improve", response_model=TextResponse)
async def improve_text(request: TextRequest):
    """
    Improve text grammar and clarity using AI
    TODO: Connect to your LLM (DeepSeek, Mistral, etc.)
    """
    # Placeholder - replace with actual LLM call
    improved = request.text.capitalize()
    if not improved.endswith(('.', '!', '?')):
        improved += '.'
    
    return TextResponse(improved_text=improved, result=improved)

@app.post("/api/rephrase", response_model=TextResponse)
async def rephrase_text(request: TextRequest):
    """
    Rephrase text using AI
    TODO: Connect to your LLM
    """
    # Placeholder - replace with actual LLM call
    return TextResponse(rephrased_text=request.text + " (rephrased)", result=request.text)

@app.post("/api/grammar", response_model=TextResponse)
async def check_grammar(request: TextRequest):
    """
    Check and fix grammar using AI
    TODO: Connect to your LLM
    """
    # Placeholder - replace with actual LLM call
    corrected = request.text.capitalize()
    return TextResponse(corrected_text=corrected, result=corrected, suggestions=[])

@app.post("/api/{action}")
async def generic_action(action: str, request: TextRequest):
    """
    Generic action handler for improve, shorten, formal, friendly, etc.
    """
    # Route to specific handlers or use a generic LLM call
    if action == "improve":
        return await improve_text(request)
    elif action == "rephrase":
        return await rephrase_text(request)
    elif action == "grammar":
        return await check_grammar(request)
    else:
        # Default: improve
        return await improve_text(request)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

