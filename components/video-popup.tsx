// components/video-popup

import React from 'react';
import { X } from 'lucide-react';

const VideoPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center p-4 z-50">
        <button
          className="absolute top-0 right-0 mt-2 mr-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 focus:outline-none z-10"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
      <div className="relative w-full max-w-4xl">

        <div className="relative pb-[56.25%] h-0">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/rhTFF5fw3pc"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;