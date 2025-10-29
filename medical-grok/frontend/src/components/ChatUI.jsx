import React, { useState } from "react";

export default function ChatUI() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  async function sendQuery() {
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setResponse(data);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-2xl bg-gray-900 p-4 rounded-2xl shadow-lg">
      <textarea
        className="w-full bg-black border border-cyan-500 text-white p-3 rounded-lg mb-3"
        placeholder="Describe your symptoms or ask about food nutrition..."
        rows="4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={sendQuery}
        className="bg-cyan-500 hover:bg-cyan-600 text-black px-5 py-2 rounded-xl"
      >
        {loading ? "Analyzing..." : "Ask GROK"}
      </button>

      {response && (
        <div className="mt-4 bg-gray-800 p-4 rounded-lg">
          {response.emergency ? (
            <p className="text-red-400">{response.message}</p>
          ) : (
            <>
              <h3 className="text-cyan-400 text-xl font-semibold mb-2">
                GROK's Insight:
              </h3>
              <pre className="whitespace-pre-wrap text-gray-200">
                {JSON.stringify(response.grogResult, null, 2)}
              </pre>
              <h3 className="text-cyan-400 text-xl font-semibold mt-4 mb-2">
                Top Google Links:
              </h3>
              <ul className="list-disc pl-6 text-blue-400">
                {response.serpResult?.map((r, i) => (
                  <li key={i}>
                    <a href={r.link} target="_blank" rel="noreferrer">
                      {r.title}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
