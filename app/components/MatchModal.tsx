import { Dog } from "../types/types";
import Image from "next/image";
import ReactConfetti from "react-confetti";
import { useEffect, useState } from "react";

interface MatchModalProps {
  dog: Dog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MatchModal({ dog, isOpen, onClose }: MatchModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isOpen || !dog) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 md:p-8 z-50">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}
      <div className="bg-[#1b1f26]/95 rounded-lg shadow-xl w-full max-w-md mx-4 md:mx-0 overflow-hidden backdrop-blur-sm">
        <div className="relative h-64 w-full">
          <Image
            src={dog.img}
            alt={dog.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            It&apos;s a Match! 🎉
          </h2>
          <p className="text-foreground mb-4">
            Meet {dog.name}, your perfect companion!
          </p>

          <dl className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Breed</dt>
              <dd className="text-foreground font-medium">{dog.breed}</dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Age</dt>
              <dd className="text-foreground font-medium">{dog.age} years</dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Location</dt>
              <dd className="text-foreground font-medium">{dog.zip_code}</dd>
            </div>
          </dl>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
