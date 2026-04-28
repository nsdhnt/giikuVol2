import json
import logging
import os
import urllib.error
import urllib.request

from dotenv import load_dotenv


logger = logging.getLogger(__name__)


class OpenAIClient:
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model = os.getenv("OPENAI_MODEL", "gpt-5.4-mini")

        if not self.api_key:
            raise ValueError("OPENAI_API_KEY is not set")

    def generate_issue(self, topic: str) -> str:
        prompt = f"""
あなたは英単語クイズ作成AIです。

次のお題に関連する「単語1語」が答えになるクイズを1問だけ作ってください。

お題: {topic}

出力ルール:
- 日本語の問題文だけを返す
- 答えの単語は絶対に書かない
- 解説も書かない
- 選択肢も書かない
- 回答は必ず単語1語になるようにする
- 文ではなく単語を答えさせる問題にする

いい例:
ネットワークに接続された機器同士が通信するために共通で使う決まりを、英語で何というでしょうか
ネットワークに接続された機器同士が通信するために共通で使う決まりを、何というでしょうか

悪い例:
ゲームやアニメ、カードなどで世界中の人に親しまれている、日本発の人気コンテンツは何でしょう？
ゲームやカードでもおなじみで、たくさんの種類が登場する人気の存在は何でしょうか。
英語で自己紹介してください
次の英文を訳してください
"""
        return self._generate_text(prompt, max_output_tokens=80)

    def judge_answer(self, issue: str, answer: str) -> str:
        prompt = f"""次の問題と回答を見て、正解なら「正解」、不正解なら「不正解」だけを返してください。

問題:
{issue}

回答:
{answer}
"""
        text = self._generate_text(prompt, max_output_tokens=20)

        if "正解" in text and "不正解" not in text:
            return "正解"
        return "不正解"

    def _generate_text(self, prompt: str, max_output_tokens: int) -> str:
        payload = {
            "model": self.model,
            "input": prompt,
            "max_output_tokens": max_output_tokens,
        }
        data = json.dumps(payload).encode("utf-8")
        request = urllib.request.Request(
            "https://api.openai.com/v1/responses",
            data=data,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                body = response.read().decode("utf-8")
        except urllib.error.HTTPError as error:
            message = error.read().decode("utf-8")
            logger.error(
                "OpenAI API request failed. status=%s body=%s",
                error.code,
                message,
            )
            raise RuntimeError(f"OpenAI API error: {message}") from error
        except urllib.error.URLError as error:
            logger.error("OpenAI API request failed. reason=%s", error.reason)
            raise RuntimeError(f"OpenAI API connection error: {error.reason}") from error

        result = json.loads(body)
        return self._extract_text(result)

    def _extract_text(self, result: dict) -> str:
        if result.get("output_text"):
            return result["output_text"].strip()

        texts: list[str] = []
        for item in result.get("output", []):
            if item.get("type") != "message":
                continue
            for content in item.get("content", []):
                if content.get("type") == "output_text" and content.get("text"):
                    texts.append(content["text"])

        if not texts:
            raise RuntimeError("OpenAI API response did not include output text")

        return "\n".join(texts).strip()


# Backward-compatible name while the file is still named gemini_client.py.
GeminiClient = OpenAIClient
