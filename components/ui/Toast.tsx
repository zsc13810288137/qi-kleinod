'use client';

import { useEffect } from 'react';

type ToastProps = {
  message: string;
  isVisible: boolean;
  onClose: () => void;
};

export default function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // 3秒后自动消失

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className="bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-sm">✓</div>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}