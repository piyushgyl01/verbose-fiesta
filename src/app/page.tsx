'use client'

import { useState } from 'react'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black mb-8">Counter</h1>
        
        <div className="text-6xl font-bold text-black mb-8">
          {count}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setCount(count - 1)}
            className="bg-black text-white px-8 py-4 text-xl font-bold hover:bg-gray-800"
          >
            -
          </button>
          
          <button
            onClick={() => setCount(0)}
            className="bg-white text-black border-2 border-black px-8 py-4 text-xl font-bold hover:bg-gray-100"
          >
            Reset
          </button>
          
          <button
            onClick={() => setCount(count + 1)}
            className="bg-black text-white px-8 py-4 text-xl font-bold hover:bg-gray-800"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}