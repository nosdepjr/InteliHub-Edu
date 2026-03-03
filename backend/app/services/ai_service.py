import json
import time

from google import genai

from app.config import GEMINI_API_KEY
from app.logger import logger

# Cria o client passando a chave
client = genai.Client(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-3-flash-preview"

SYSTEM_PROMPT = """
Você é um assistente pedagógico especializado em educação digital.

Dado um título e tipo de material educacional,
gere:

1 descrição clara e objetiva
3 tags relevantes

Responda APENAS em JSON no formato:

{
"description": "...",
"tags": ["tag1","tag2","tag3"]
}
}
"""


def generate_description(title: str, type: str):

    start = time.time()

    prompt = f"""
Título: {title}
Tipo: {type}
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=SYSTEM_PROMPT + prompt,
    )

    latency = time.time() - start

    logger.info(f'AI Request: Title="{title}", Latency={latency:.2f}s')

    return json.loads(response.text)
