import { Dog } from "../types/types";
import Image from "next/image";

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dogId: string) => void;
}

export function DogCard({ dog, isFavorite, onToggleFavorite }: DogCardProps) {
  return (
    <div className="bg-[#1b1f26] rounded-lg shadow-md overflow-hidden backdrop-blur-sm">
      <div className="relative h-48 w-full">
        <Image
          src={dog.img}
          alt={dog.name}
          fill
          priority
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-foreground">{dog.name}</h3>
          <button
            onClick={() => onToggleFavorite(dog.id)}
            className="text-red-500 hover:text-red-600"
          >
            {isFavorite ? (
              <HeartFilledIcon className="w-6 h-6" />
            ) : (
              <HeartOutlineIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        <dl className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-gray-400">Breed:</dt>
            <dd className="text-foreground">{dog.breed}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-gray-400">Age:</dt>
            <dd className="text-foreground">{dog.age} years</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-gray-400">Location:</dt>
            <dd className="text-foreground">{dog.zip_code}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function HeartFilledIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function HeartOutlineIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}
