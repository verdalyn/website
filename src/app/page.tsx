'use client'

import { useEffect, useState } from 'react';

export default function Home() {
  const [fact, setFact] = useState('');

  useEffect(() => {
    // Fetch a random fact from the Random Useless Facts API
    
    fetch('https://uselessfacts.jsph.pl/random.json?language=en')
      .then((response) => response.json())
      .then((data) => setFact(data.text))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-green-500">
      <div className="max-w-2xl p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Site Under Construction
        </h1>
        <p className="text-lg text-gray-700 text-center mb-6">
          We're working hard to bring you a new and improved experience. Stay tuned for updates!
        </p>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Random Fact</h2>
          <p className="text-gray-600">{fact || 'Loading a fun fact...'}</p>
        </div>
      </div>
    </div>
  );
}