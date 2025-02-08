"use client";

import { useState } from "react";
import { DogSearchParams } from "../types/types";
import { MdFilterAltOff } from "react-icons/md";

interface SearchFiltersProps {
  breeds: string[];
  onFiltersChange: (filters: DogSearchParams) => void;
  currentSort: string;
  onSortChange: (sort: string) => void;
  selectedBreeds: string[];
  onClearFilters: () => void;
}

export function SearchFilters({
  breeds,
  onFiltersChange,
  currentSort,
  onSortChange,
  selectedBreeds = [],
  onClearFilters,
}: SearchFiltersProps) {
  const [ageRange, setAgeRange] = useState({ min: "", max: "" });

  // Check if any filters are active
  const hasActiveFilters =
    selectedBreeds.length > 0 || ageRange.min !== "" || ageRange.max !== "";

  const handleBreedChange = (breed: string) => {
    const newBreeds = selectedBreeds.includes(breed)
      ? selectedBreeds.filter((b) => b !== breed)
      : [...selectedBreeds, breed];

    onFiltersChange({
      breeds: newBreeds,
      ageMin: ageRange.min ? parseInt(ageRange.min) : undefined,
      ageMax: ageRange.max ? parseInt(ageRange.max) : undefined,
    });
  };

  const handleAgeChange = (type: "min" | "max", value: string) => {
    const newAgeRange = { ...ageRange, [type]: value };
    setAgeRange(newAgeRange);

    onFiltersChange({
      breeds: selectedBreeds,
      ageMin: newAgeRange.min ? parseInt(newAgeRange.min) : undefined,
      ageMax: newAgeRange.max ? parseInt(newAgeRange.max) : undefined,
    });
  };

  const handleClearAll = () => {
    setAgeRange({ min: "", max: "" });
    onClearFilters();
  };

  return (
    <div className="space-y-4 p-4 bg-[#1b1f26] rounded-lg shadow sticky top-4 backdrop-blur-sm">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Sort by Breed</h3>
          <button
            onClick={handleClearAll}
            disabled={!hasActiveFilters}
            className={`p-2 transition-colors ${
              hasActiveFilters
                ? "text-white hover:text-gray-200"
                : "text-gray-500 cursor-not-allowed"
            }`}
            title={hasActiveFilters ? "Clear all filters" : "No active filters"}
          >
            <MdFilterAltOff className="w-5 h-5" />
          </button>
        </div>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
        >
          <option value="breed:asc">Breed (A-Z)</option>
          <option value="breed:desc">Breed (Z-A)</option>
        </select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Age Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min age"
            value={ageRange.min}
            onChange={(e) => handleAgeChange("min", e.target.value)}
            className="w-1/2 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-900"
          />
          <input
            type="number"
            min="0"
            placeholder="Max age"
            value={ageRange.max}
            onChange={(e) => handleAgeChange("max", e.target.value)}
            className="w-1/2 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-900"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Breeds</h3>
        <div className="space-y-2 h-[calc(100vh-24rem)] overflow-y-auto">
          {breeds.map((breed) => (
            <label key={breed} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedBreeds.includes(breed)}
                onChange={() => handleBreedChange(breed)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-foreground">{breed}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
