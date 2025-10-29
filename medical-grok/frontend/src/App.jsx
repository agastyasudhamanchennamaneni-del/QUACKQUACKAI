import React from "react";
import ChatUI from "./components/ChatUI";
import "./index.css";

const App = () => {
  return (
    <div className="app">
      <h1 className="title">🧠 Medical Grok AI</h1>
      <p className="subtitle">Your AI doctor & nutrition companion</p>
      <ChatUI />
    </div>
  );
};

export default App;
