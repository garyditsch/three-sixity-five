import type { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Colors" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {


  return (
    <main className="max-w-full h-full flex relative overflow-y-scroll bg-slate-100">
      <div className="w-full m-8">
        <div className="mb-16">
            <h1>Fresh Morning</h1>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 500 250" xmlSpace="preserve">
            <rect fill="#a8d5ba" x="0" y="0" width="100" height="220"/>,<rect fill="#f3e9d2" x="100" y="0" width="100" height="220"/>,<rect fill="#b2b2b2" x="200" y="0" width="100" height="220"/>,<rect fill="#a1c6ea" x="300" y="0" width="100" height="220"/>,<rect fill="#ffffff" x="400" y="0" width="100" height="220"/>
            </svg>
            <div>Fresh Morning: 
                Primary: Light Green (#A8D5BA), 
                Secondary: Soft Beige (#F3E9D2), 
                Accent 1: Warm Gray (#B2B2B2), 
                Accent 2: Gentle Blue (#A1C6EA), 
                Neutral: Off White (#FFFFFF)
            </div>
        </div>
        <div className="mb-16">
            <h1>Mindul Serenity</h1>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 500 250" xmlSpace="preserve">
                <rect fill="#98d9c2" x="0" y="0" width="100" height="220"/>,<rect fill="#ead9f7" x="100" y="0" width="100" height="220"/>,<rect fill="#fed4c4" x="200" y="0" width="100" height="220"/>,<rect fill="#d4a5a5" x="300" y="0" width="100" height="220"/>,<rect fill="#f0f0f0" x="400" y="0" width="100" height="220"/>
            </svg>
            <div>Mindful Serenity
                Primary: Mint Green (#98D9C2),
                Secondary: Pale Lavender (#EAD9F7),
                Accent 1: Soft Peach (#FED4C4),
                Accent 2: Dusty Rose (#D4A5A5),
                Neutral: Light Gray (#F0F0F0)
            </div>
        </div>
        <div className="mb-16">
            <h1>Nature Pulse</h1>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 500 250" xmlSpace="preserve">
                <rect fill="#b8d8ba" x="0" y="0" width="100" height="220"/>,<rect fill="#e2c391" x="100" y="0" width="100" height="220"/>,<rect fill="#9e7777" x="200" y="0" width="100" height="220"/>,<rect fill="#a3d8fa" x="300" y="0" width="100" height="220"/>,<rect fill="#fff8e7" x="400" y="0" width="100" height="220"/>
            </svg>
            <div>Nature's Pulse
                Primary: Sage Green (#B8D8BA),
                Secondary: Sandstone (#E2C391),
                Accent 1: Earthy Brown (#9E7777),
                Accent 2: Sky Blue (#A3D8F4),
                Neutral: Cream (#FFF8E7)
            </div>
        </div>
        <div className="mb-16">
            <h1>Gentle Awakening</h1>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 500 250" xmlSpace="preserve">
                <rect fill="#93d1c5" x="0" y="0" width="100" height="220"/>,<rect fill="#ffc4a3" x="100" y="0" width="100" height="220"/>,<rect fill="#9687a3" x="200" y="0" width="100" height="220"/>,<rect fill="#fff4a3" x="300" y="0" width="100" height="220"/>,<rect fill="#f9f9f9" x="400" y="0" width="100" height="220"/>
            </svg>
            <div>Gentle Awakening
                Primary: Seafoam Green (#93D1C5),
                Secondary: Muted Coral (#FFC4A3),
                Accent 1: Twilight Lavender (#9687A3),
                Accent 2: Pastel Yellow (#FFF4A3),
                Neutral: Soft White (#F9F9F9)
            </div>
        </div>
        <div className="mb-16">
            <h1>Harmonious Engery</h1>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 500 250" xmlSpace="preserve">
                <rect fill="#aed9a4" x="0" y="0" width="100" height="220"/>,<rect fill="#ffb562" x="100" y="0" width="100" height="220"/>,<rect fill="#588b8b" x="200" y="0" width="100" height="220"/>,<rect fill="#f4c1c1" x="300" y="0" width="100" height="220"/>,<rect fill="#fffff0" x="400" y="0" width="100" height="220"/>
            </svg>
            <div>Harmonious Engery
                Primary: Bamboo Green (#AED9A4),
                Secondary: Sunrise Orange (#FFB562),
                Accent 1: Deep Teal (#588B8B),
                Accent 2: Pale Pink (#F4C1C1),
                Neutral: Classic Ivory (#FFFFF0)
            </div>
        </div>
      </div>
  </main>
  );
}