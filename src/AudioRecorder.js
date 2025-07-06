import React, { useState, useRef } from "react";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);        // Track recording state
  const mediaRecorderRef = useRef(null);                         // Store MediaRecorder
  const mediaStreamRef = useRef(null);                           // Store the media stream

  // === Start recording ===
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // Ask for mic
      mediaStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      recorder.start();

      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      console.log("🎙️ Recording started");
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Microphone permission is required to start recording.");
    }
  };

  // === Stop recording & release mic ===
  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    const stream = mediaStreamRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      console.log("🛑 Recording stopped");
    }

    if (stream) {
      // Stop all tracks to release the mic
      stream.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      console.log("🎧 Microphone released");
    }

    setIsRecording(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial", textAlign: "center" }}>
      <h2>🎙️ Audio Recorder</h2>

      <button
        onClick={startRecording}
        disabled={isRecording}
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
      >
        ▶️ Start Recording
      </button>

      <button
        onClick={stopRecording}
        disabled={!isRecording}
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
      >
        ⏹️ Stop Recording
      </button>
    </div>
  );
};

export default AudioRecorder;