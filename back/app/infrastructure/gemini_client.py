import json
import logging
import os
import urllib.error
import urllib.request

from dotenv import load_dotenv


logger = logging.getLogger(__name__)


class GeminiClient:
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = "gemini-2.0-flash"

        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is not set")

    def generate_issue(self) -> str:
        prompt = "英単語クイズを1問だけ出してください。問題文だけ返してください。"
        return self._generate_text(prompt)

    def judge_answer(self, issue: str, answer: str) -> str:
        prompt = f"""次の問題と回答を見て、正解なら⭕️、不正解なら❌だけ返してください。

問題:
{issue}

回答:
{answer}
"""
        text = self._generate_text(prompt)

        # Gemini の返答に余計な文字が混ざっても、DBには必ず指定の2値だけ保存します。
        if "⭕️" in text or "⭕" in text:
            return "⭕️"
        return "❌"

    def _generate_text(self, prompt: str) -> str:
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{self.model}:generateContent?key={self.api_key}"
        )
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt,
                        }
                    ]
                }
            ]
        }
        data = json.dumps(payload).encode("utf-8")
        request = urllib.request.Request(
            url,
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                body = response.read().decode("utf-8")
        except urllib.error.HTTPError as error:
            message = error.read().decode("utf-8")
            if error.code == 429:
                logger.error(
                    "Gemini API quota/rate limit exceeded. status=%s body=%s",
                    error.code,
                    message,
                )
            else:
                logger.error(
                    "Gemini API request failed. status=%s body=%s",
                    error.code,
                    message,
                )
            raise RuntimeError(f"Gemini API error: {message}") from error

        result = json.loads(body)
        return result["candidates"][0]["content"]["parts"][0]["text"].strip()
