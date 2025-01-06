const API_KEY = import.meta.env.VITE_API_KEY;

export async function getGeminiResponse(prompt) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error:", error);
    return "Sorry, there was an issue getting a response.";
  }
}

export function cleanText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/[\n]/g, " ")
    .replace(/[*]/g, "")
    .replace(/[#]/g, "");
}

export function speak(text, callback) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.1;
  utterance.pitch = 1;
  utterance.lang = "hi-GB";

  utterance.onend = () => callback && callback();
  window.speechSynthesis.speak(utterance);
}

export function wishMe() {
  const hours = new Date().getHours();
  const greeting =
    hours < 12
      ? "Good Morning Sir"
      : hours < 16
      ? "Good Afternoon Sir"
      : hours < 22
      ? "Good Evening Sir"
      : "Good Night Sir";

  speak(greeting);

}
