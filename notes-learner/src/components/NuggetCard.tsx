'use client';

import { Nugget } from '@/types';

interface NuggetCardProps {
  nugget: Nugget;
  topicColor: string;
  showDescription?: boolean;
}

export default function NuggetCard({ nugget, topicColor, showDescription = true }: NuggetCardProps) {
  if (!nugget) {
    return (
      <div className="p-6 rounded-lg bg-[#282828] shadow-lg">
        <p className="text-gray-400">No nugget available</p>
      </div>
    );
  }

  return (
    <div 
      className="p-6 rounded-lg bg-[#282828] shadow-lg hover:bg-[#3E3E3E] 
                 transition-colors duration-300"
      style={{ borderLeft: `4px solid ${topicColor}` }}
    >
      <h2 className="text-xl font-bold mb-4 text-white">
        {nugget.topic}
      </h2>
      {showDescription && (
        <p className="text-gray-300">
          {nugget.description}
        </p>
      )}
    </div>
  );
}