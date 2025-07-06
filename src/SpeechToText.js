import React, { useState, useEffect, useRef } from "react";

const SpeechToText = () => {
  // === STATE MANAGEMENT ===

  // Stores the ongoing transcript text
  const [transcript, setTranscript] = useState("");

  // Indicates whether recording is active
  const [isListening, setIsListening] = useState(false);

  // Stores the MediaRecorder instance for audio recording
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // Stores the audio stream from microphone
  const [mediaStream, setMediaStream] = useState(null);

  // Holds the Blob URL for the recorded audio (used for playback/download)
  const [audioURL, setAudioURL] = useState(null);

  // Ref to store the SpeechRecognition instance
  const recognitionRef = useRef(null);

  // === INITIALIZE SPEECH RECOGNITION ===
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    // If browser doesn't support the Web Speech API
    if (!SpeechRecognition) {
      alert("❌ Speech Recognition API is not supported in this browser.");
      return;
    }

    // Create and configure the speech recognition instance
    const recognition = new SpeechRecognition();  // Create new instance of SpeechRecognition model
    recognition.continuous = true; // Keep listening after speech ends
    recognition.interimResults = true; // Show in-progress transcription
    recognition.lang = "fr-FR"; // Set language to French

    let finalTranscript = "";

    // When speech is detected and transcribed
    recognition.onresult = (event) => {
      let interimTranscript = "";

      // Loop through all results since last onresult call
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Update state with full and interim text
      setTranscript(finalTranscript + interimTranscript);
    };

    // // Restart recognition automatically if stopped and still listening
    // recognition.onend = () => {
    //   if (isListening) recognition.start();
    // };

    // Store the recognition instance for use in other functions
    recognitionRef.current = recognition;
  }, [isListening]);

  // === TOGGLE MICROPHONE + AUDIO RECORDING ===
  const toggleListening = async () => {
    if (isListening) {
      // ===== STOP RECORDING =====
      recognitionRef.current.stop(); // Stop speech recognition

      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop(); // Stop audio recording
      }

      if (mediaStream) {
        // Stop all active audio tracks (releases mic access)
        mediaStream.getTracks().forEach((track) => track.stop());
        setMediaStream(null);
      }

      setIsListening(false); // Update listening state
    } else {
      // ===== START RECORDING =====
      try {
        // Request access to the user's microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMediaStream(stream); // Save stream to state

        // Set up the media recorder to capture audio
        const recorder = new MediaRecorder(stream);
        const audioChunks = [];

        // Collect chunks of recorded audio data
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunks.push(e.data);
        };

        // When recording stops, assemble the chunks and create a downloadable URL
        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          const url = URL.createObjectURL(audioBlob);
          setAudioURL(url); // Set audio URL for playback & download
        };

        recorder.start(); // Begin recording
        setMediaRecorder(recorder); // Save recorder instance

        recognitionRef.current.start(); // Start speech-to-text
        setIsListening(true); // Update listening state
      } catch (err) {
        console.error("🎙️ Microphone access denied:", err);
        alert("Microphone permission is required to use this feature.");
      }
    }
  };

  // === HANDLE TEXTAREA EDITS ===
  const handleTextChange = (e) => {
    setTranscript(e.target.value);
  };

  // === RENDER UI ===
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial", maxWidth: 800, margin: "0 auto" }}>
      <h2>🎤 Transcription Vocale (FR)</h2>

      {/* Start/Stop Recording Button */}
      <button onClick={toggleListening} style={{ padding: "10px 20px", marginBottom: "1rem" }}>
        {isListening ? "⏹️ Arrêter" : "🎙️ Démarrer"}
      </button>

      {/* Editable Transcript Output */}
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
        placeholder="Votre transcription apparaîtra ici..."
      />

      {/* Audio Playback & Download Link */}
      {audioURL && (
        <div style={{ marginTop: "1rem" }}>
          <audio controls src={audioURL} />
          <br />
          <a
            href={audioURL}
            download={`audio_${new Date().toISOString()}.webm`}
            style={{
              marginTop: "0.5rem",
              display: "inline-block",
              padding: "8px 15px",
              backgroundColor: "#3498db",
              color: "#fff",
              borderRadius: "5px",
              textDecoration: "none",
            }}
          >
            ⬇️ Télécharger l'audio
          </a>
        </div>
      )}
    </div>
  );
};

export default SpeechToText;
