"use client";

import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Counter App</h1>

        {/* Counter Display */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-blue-600 mb-4">{count}</div>
          <p className="text-gray-600 text-lg">Current Count</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={decrement}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-xl transition-colors duration-200 transform hover:scale-105 active:scale-95"
          >
            -1
          </button>

          <button
            onClick={reset}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl transition-colors duration-200 transform hover:scale-105 active:scale-95"
          >
            Reset
          </button>

          <button
            onClick={increment}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl transition-colors duration-200 transform hover:scale-105 active:scale-95"
          >
            +1
          </button>
        </div>

        {/* Additional Features */}
        <div className="mt-8 flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={() => setCount(count + 5)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            +5
          </button>

          <button
            onClick={() => setCount(count - 5)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            -5
          </button>

          <button
            onClick={() => setCount(count * 2)}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            ×2
          </button>
        </div>

        {/* Status Message */}
        <div className="mt-6">
          {count === 0 && (
            <p className="text-gray-500 text-sm">You're at zero! 🎯</p>
          )}
          {count > 0 && (
            <p className="text-green-600 text-sm">Positive vibes! ✨</p>
          )}
          {count < 0 && (
            <p className="text-red-600 text-sm">In the negative zone! ⚡</p>
          )}
        </div>
      </div>
    </div>
  );
}
