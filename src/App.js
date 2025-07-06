import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AudioRecorder from "./AudioRecorder";
import SpeechToText from "./SpeechToText";

function App() {
  return (
    <Router>
      <div style={{ padding: "1rem", fontFamily: "Arial" }}>
        {/* Navigation Links */}
        <nav style={{ marginBottom: "1rem" }}>
          <Link to="/" style={{ marginRight: "20px" }}>🎙️ Audio Recorder</Link>
          <Link to="/transcription">📝 Speech to Text</Link>
        </nav>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<AudioRecorder />} />
          <Route path="/transcription" element={<SpeechToText />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
