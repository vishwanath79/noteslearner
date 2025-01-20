'use client';

import Link from 'next/link';
import HelpModal from './HelpModal';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#282828] shadow-lg z-40">
      <div className="max-w-4xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-white hover:text-[#1DB954] transition-colors">
            Notes Learner
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/vishwanath79/noteslearner"
              className="text-white hover:text-[#1DB954] transition-colors"
              target="_blank"
            >
              About
            </Link>
            <HelpModal />
          </div>
        </div>
      </div>
    </nav>
  );
}