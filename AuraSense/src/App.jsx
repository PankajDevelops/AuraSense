import React, { useState, useEffect } from "react";
import styles from "./styles/App.module.css";
import { getGeminiResponse, cleanText, speak, wishMe } from "./utils/helper.js";

function App() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceVisible, setVoiceVisible] = useState(false);

  useEffect(() => {
    wishMe();
  }, []);

  const handleSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => {
      setListening(true);
      setVoiceVisible(true);
    };

    recognition.onresult = (event) => {
      const currIndex = event.resultIndex;
      const text = event.results[currIndex][0].transcript;
      setTranscript(text);
      handleCommand(text.toLowerCase());
    };

    recognition.onend = () => {
      setListening(false);
      setVoiceVisible(false);
    };

    recognition.start();
  };

  const handleCommand = async (message) => {
    if (message.includes("hello") || message.includes("hey")) {
      speak("hello sir,what can i help you?");
    } else if (message.includes("who created you")) {
      speak("i am virtual assistant ,created by Pankaj Develops");
    } else if (message.includes("open youtube")) {
      speak("opening youtube...");
      window.open("https://youtube.com/", "_blank");
    } else if (message.includes("open google")) {
      speak("opening google...");
      window.open("https://google.com/", "_blank");
    } else if (message.includes("open facebook")) {
      speak("opening facebook...");
      window.open("https://facebook.com/", "_blank");
    } else if (message.includes("open instagram")) {
      speak("opening instagram...");
      window.open("https://instagram.com/", "_blank");
    } else if (message.includes("open calculator")) {
      speak("opening calculator..");
      window.open("calculator://");
    } else if (message.includes("open whatsapp")) {
      speak("opening whatsapp..");
      window.open("whatsapp://");
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
      });
      speak(date);
    } else {
      const response = await getGeminiResponse(message);
      const cleanedResponse = cleanText(response);
      speak(cleanedResponse);
      setTranscript(cleanedResponse);
    }
  };

  return (
    <div className={styles.app}>
      <img src="/contents/assistant.png" alt="logo" className={styles.logo} />
      <h1>
        I'm <span className={styles.name}>Aura</span>, Your{" "}
        <span className={styles.va}>Virtual Assistant</span>
      </h1>
      {voiceVisible && (
        <img src="/contents/voice.gif" alt="voice" className={styles.voice} />
      )}
      <button onClick={handleSpeechRecognition} className={styles.btn}>
        <img src="/contents/mic-svgrepo-com.svg" alt="mic" />
        <span>{listening ? "Listening..." : "Click Here To Talk !!!"}</span>
      </button>
      <p className={styles.transcript}>{transcript}</p>
    </div>
  );
}

export default App;
