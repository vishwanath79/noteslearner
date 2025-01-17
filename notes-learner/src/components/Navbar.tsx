'use client';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-black bg-opacity-95 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-[#1DB954] font-bold text-xl">Notes Learner</div>
        <a
          href="https://vishsubramanian.me"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-white transition-colors"
        >
          About
        </a>
      </div>
    </nav>
  );
}