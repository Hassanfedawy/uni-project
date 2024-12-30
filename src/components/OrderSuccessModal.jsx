"use client";

import { useState, useEffect } from 'react';

export default function OrderSuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Order Placed Successfully!</h2>
        <div className="aspect-video">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/5KD-E3R_lzc?autoplay=1&mute=0" 
            title="Order Success Video" 
            frameBorder="0" 
            allow="autoplay; encrypted-media; picture-in-picture" 
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
        <p className="mt-4 text-center text-gray-600">
          Your order has been confirmed and is being prepared!
        </p>
      </div>
    </div>
  );
}
