import React, { useState, useEffect, useRef } from "react";

const SpeechToText = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "fr-FR";

    let final = "";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript(final + interim);
    };

    recognition.onend = () => {
      if (isListening) recognition.start(); // Auto-restart
    };

    recognitionRef.current = recognition;
  }, [isListening]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const handleTextChange = (e) => {
    setTranscript(e.target.value);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial", maxWidth: 800, margin: "0 auto" }}>
      <h2>🎤 Transcription Vocale (FR)</h2>
      <button onClick={toggleListening} style={{ padding: "10px 20px", marginBottom: "1rem" }}>
        {isListening ? "⏹️ Arrêter" : "🎙️ Démarrer"}
      </button>
      <br />
      <textarea
        rows={12}
        style={{
          width: "100%",
          fontSize: "1.2rem",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          resize: "vertical",
          backgroundColor: "#ffffff",
        }}
        value={transcript}
        onChange={handleTextChange}
      />
    </div>
  );
};

export default SpeechToText;
