import React, { useState } from 'react';
import { X } from 'lucide-react';

const images = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
    category: 'previous',
    alt: 'Hackathon participants collaborating'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94',
    category: 'campus',
    alt: 'University campus during event'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
    category: 'performances',
    alt: 'Evening performance'
  },
  // Add more images here
];

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredImages = activeCategory === 'all'
    ? images
    : images.filter(img => img.category === activeCategory);

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Gallery
        </h2>

        <div className="flex justify-center mb-8 space-x-4">
          {['all', 'previous', 'campus', 'performances'].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="relative mb-4 cursor-pointer transform transition-all hover:scale-105"
              onClick={() => setSelectedImage(image.url)}
            >
              <img
                src={`${image.url}?w=600&fit=crop`}
                alt={image.alt}
                className="w-full rounded-lg shadow-soft"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-full max-h-[90vh] rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;