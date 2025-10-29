import React from "react";
import ChatUI from "./components/ChatUI";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-cyan-400 mb-6">🧠 Medical GROK</h1>
      <ChatUI />
      <p className="mt-4 text-sm text-gray-500">
        ⚠️ Not a doctor. Always verify information with a medical professional.
      </p>
    </div>
  );
}
