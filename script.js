let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

async function getGeminiResponse(prompt) {
  const apiUrl =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDgxjjVCCyAwEwABZ2QrRgv5Xc5p2GE6Pc";

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
      // Handle errors
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data); // To see the full response in the console
    return data;
  } catch (error) {
    console.error("Error with Gemini API call:", error);
    return "Sorry, there was an issue getting a response from Gemini.";
  }
}


function cleanText(text) {
  // Remove markdown-like formatting (e.g., **bold**, *italic*)
  let cleanedText = text
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold (i.e., **text**)
    .replace(/\*(.*?)\*/g, "$1") // Remove italic (i.e., *text*)
    .replace(/[\n]/g, " ") // Replace newlines with spaces
    .replace(/[*]/g, "") // Remove any remaining asterisks
    .replace(/[#]/g, ""); // Remove any remaining asterisks

  return cleanedText;
}

function speak(text, callback) {
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  let cleanedText = cleanText(text);
  let text_speak = new SpeechSynthesisUtterance(cleanedText);

  text_speak.rate = 1.1;
  text_speak.pitch = 1;
  text_speak.volume = 1;
  text_speak.lang = "hi-IN";

  text_speak.onend = function (event) {
    console.log("Speech has finished.");
    if (callback) callback(); // Call the callback function if provided
  };

  text_speak.onerror = function (event) {
    console.error("SpeechSynthesisUtterance.onerror:", event);
    // You can add more specific error handling here
  };

  window.speechSynthesis.speak(text_speak);
}



function delayedSpeak(text, delay = 500) {
  setTimeout(() => {
    speakWhenReady(text);
  }, delay);
}

function speakWhenReady(text) {
  const synth = window.speechSynthesis;

  if (synth.getVoices().length > 0) {
    speak(text);
  } else {
    synth.onvoiceschanged = function () {
      speak(text);
    };
  }
}


function wishMe() {
  let day = new Date();
  let hours = day.getHours();

  if (hours >= 0 && hours < 12) {
    speak("Good Morning Sir");
  } else if (hours >= 12 && hours < 16) {
    speak("Good Afternoon Sir");
  } else if (hours >= 16 && hours < 22) {
    speak("Good Evening Sir");
  } else {
    speak("Good Night Sir");
  }
}

window.addEventListener("load", () => {
  wishMe();
});

let speechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

recognition.onresult = (event) => {
  let currIndex = event.resultIndex;
  let transcript = event.results[currIndex][0].transcript;
  content.innerText = transcript;
  takeCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
  recognition.start();
  btn.style.display = "none";
  voice.style.display = "block";
});

async function takeCommand(message) {
  btn.style.display = "flex";
  voice.style.display = "none";

  if (
    message.includes("hello aura") ||
    message.includes("hey aura") ||
    message.includes("how") ||
    message.includes("your name")
  ) {
    speak("Hello Sir, I'm Aura, What can I help you with?");
    message = message
      .replace("hello aura", "")
      .replace("hey aura", "")
      .replace("how", "")
      .replace("your name", "")
      .trim();
  } else if (message.includes("who are you")) {
    speak("I'm a virtual assistant, created by PankajDevelops");
  } else if (message.includes("open youtube")) {
    speak("Opening YouTube");
    window.open("https://www.youtube.com/");
  } else if (message.includes("open facebook")) {
    speak("Opening Facebook");
    window.open("https://www.facebook.com/");
  } else if (message.includes("open instagram")) {
    speak("Opening Instagram");
    window.open("https://www.instagram.com/");
  } else if (message.includes("open google")) {
    speak("Opening Google");
    window.open("https://www.google.com/");
  } else if (message.includes("time")) {
    let time = new Date().toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
    });
    speak(time);
  } else if (message.includes("date")) {
    let date = new Date().toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    speak(date);
  } else if (/\d+[\s]*([+\-x\/]|into)[\s]*\d+/.test(message)) {
    let result;
    try {
      let cleanedMessage = message
        .replace("plus", "+")
        .replace("add", "+")
        .replace("minus", "-")
        .replace("subtract", "-")
        .replace("x", "*")
        .replace("into", "*")
        .replace("multiply by", "*")
        .replace("divide", "/");
      result = eval(cleanedMessage);
      speak(`The result is ${result}`);
    } catch (error) {
      speak("Sorry, I couldn't perform the calculation. Please try again.");
    }
  } else {
  
    speak("Let me check that for you.");

    const geminiResponse = await getGeminiResponse(message);

    const responseText = geminiResponse.candidates[0].content.parts[0].text;
    const cleanedResponseText = cleanText(responseText); 

    // Split the cleaned response into sentences or sections (optional)
    const responseParts = cleanedResponseText.split('. '); // Split by sentence

    // Function to speak each part one after another
    const speakParts = (parts) => {
        if (parts.length === 0) return; // No more parts to speak
        speak(parts[0], () => {
            speakParts(parts.slice(1)); // Speak the next part
        });
    };

    // Start speaking the response parts
    speakParts(responseParts); // Start with the response parts

    // Optionally, display the cleaned text on the screen
    content.innerText = cleanedResponseText; // Also display the cleaned text
  }
}
