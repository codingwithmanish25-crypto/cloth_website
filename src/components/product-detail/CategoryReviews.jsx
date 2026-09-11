import React from 'react';
import Image from 'next/image';

const realUserStories = [
  { id: 1, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  { id: 2, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
  { id: 3, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
  { id: 4, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
  { id: 5, img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150" },
  { id: 6, img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150" },
];

const CategoryReviews = () => {
  return (
    <div className="mt-20 border-t border-zinc-800 pt-12 space-y-12 text-center">
      {/* Testimonial Card */}
      <div>
        <h2 className="text-xl font-bold uppercase tracking-wider text-white">Category Reviews</h2>
        <div className="mt-4 max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-left flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-zinc-700 flex-shrink-0 overflow-hidden relative">
            <Image 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
              alt="Reviewer" 
              fill 
              className="object-cover" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white">Nilesh</span>
              <span className="text-yellow-400 text-xs">★★★★★</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Really impressed with the fabric quality! Fits premium and has nice weight to it. Definitely worth the price.
            </p>
          </div>
        </div>
      </div>

      {/* Real Stories Avatars */}
      <div>
        <h2 className="text-xl font-bold uppercase tracking-wider text-white">Real Stories From Real Users</h2>
        <div className="flex justify-center items-center gap-4 mt-6 overflow-x-auto pb-4">
          {realUserStories.map((story) => (
            <div 
              key={story.id} 
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-orange-500 p-0.5 overflow-hidden flex-shrink-0"
            >
              <Image
                src={story.img}
                alt="User story"
                fill
                sizes="48px"
                className="rounded-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryReviews;