import json
import time

import google.generativeai as genai

from app.config import GEMINI_API_KEY
from app.logger import logger

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-3-flash-preview")


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
"""


def generate_description(title: str, type: str):

    start = time.time()

    prompt = f"""
    Título: {title}
    Tipo: {type}
    """

    response = model.generate_content(SYSTEM_PROMPT + prompt)

    latency = time.time() - start

    logger.info(f'AI Request: Title="{title}", Latency={latency:.2f}s')

    return json.loads(response.text)
