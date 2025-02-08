"use client";

import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Dog, DogSearchParams } from "../types/types";
import { DogCard } from "../components/DogCard";
import { SearchFilters } from "../components/SearchFilters";
import { Pagination } from "../components/Pagination";
import { Navbar } from "../components/Navbar";
import { MatchModal } from "../components/MatchModal";
import { FaHeart, FaTimes } from "react-icons/fa";
import { FilterModal } from "../components/FilterModal";
import { MdFilterList } from "react-icons/md";

export default function SearchPage() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [currentSort, setCurrentSort] = useState("breed:asc");
  const [searchParams, setSearchParams] = useState<DogSearchParams>({
    sort: "breed:asc",
    size: 15,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const PAGE_SIZE = 15;
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    const searchDogs = async () => {
      try {
        const response = await api.searchDogs({
          ...searchParams,
          size: PAGE_SIZE,
          from: ((currentPage - 1) * PAGE_SIZE).toString(),
        });
        const dogList = await api.getDogs(response.resultIds);
        setDogs(dogList);
        setTotalResults(response.total);
      } catch (error) {
        console.error("Failed to search dogs:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        await searchDogs();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchParams, PAGE_SIZE]);

  useEffect(() => {
    loadBreeds();
  }, []);

  async function loadBreeds() {
    try {
      const breedList = await api.getBreeds();
      setBreeds(breedList);
    } catch (error) {
      console.error("Failed to load breeds:", error);
    }
  }

  const handleFiltersChange = (filters: DogSearchParams) => {
    if (filters.breeds !== undefined) {
      setSelectedBreeds(filters.breeds);
    }
    setSearchParams((prev) => {
      const newParams = { ...prev, ...filters };
      if (filters.breeds && filters.breeds.length === 0) {
        delete newParams.breeds;
      }
      return newParams;
    });
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
    setSearchParams((prev) => ({ ...prev, sort }));
    setCurrentPage(1);
  };

  const toggleFavorite = (dogId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(dogId)) {
      newFavorites.delete(dogId);
    } else {
      newFavorites.add(dogId);
    }
    setFavorites(newFavorites);
  };

  const handleGenerateMatch = async () => {
    try {
      const matchResult = await api.getMatch(Array.from(favorites));
      const [matchedDogData] = await api.getDogs([matchResult.match]);
      setMatchedDog(matchedDogData);
      setIsMatchModalOpen(true);
    } catch (error) {
      console.error("Failed to generate match:", error);
    }
  };

  const handleCloseModal = () => {
    setIsMatchModalOpen(false);
    setMatchedDog(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFavorites = () => {
    setFavorites(new Set());
  };

  const handleClearFilters = () => {
    setSelectedBreeds([]);
    setSearchParams({
      sort: currentSort,
      size: PAGE_SIZE,
    });
    setCurrentPage(1);
  };

  return (
    <div
      className="min-h-screen bg-repeat"
      style={{
        backgroundImage: 'url("/paw_pattern_bg.png")',
        backgroundColor: "#f0f0f0",
        backgroundBlendMode: "multiply",
      }}
    >
      <Navbar />
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4 lg:space-y-0 mb-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold px-4 py-2 text-black rounded-lg">
                  Find Your Perfect Companion
                </h1>
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="lg:hidden p-2 rounded-xl bg-white text-gray-900 hover:bg-gray-100 flex items-center gap-2"
                >
                  <MdFilterList className="w-5 h-5" />
                  <span className="text-sm font-medium">Filters</span>
                </button>
              </div>
              <div className="hidden lg:flex lg:items-center lg:gap-2">
                <button
                  onClick={handleGenerateMatch}
                  disabled={favorites.size === 0}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
                    favorites.size > 0
                      ? "bg-pink-500 text-white hover:bg-pink-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <span>
                    Find Match {favorites.size > 0 ? `(${favorites.size})` : ""}
                  </span>
                  <FaHeart className="w-4 h-4" />
                </button>
                {favorites.size > 0 && (
                  <button
                    onClick={clearFavorites}
                    className="p-2 rounded-xl bg-white text-gray-900 hover:bg-gray-100"
                    title="Clear favorites"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="hidden lg:block lg:col-span-1">
              <SearchFilters
                breeds={breeds}
                selectedBreeds={selectedBreeds}
                onFiltersChange={handleFiltersChange}
                currentSort={currentSort}
                onSortChange={handleSortChange}
                onClearFilters={handleClearFilters}
              />
            </div>

            <div className="col-span-1 lg:col-span-3">
              {loading ? (
                <div className="text-center text-black font-medium">
                  Loading dogs...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[50vh]">
                    {dogs.map((dog) => (
                      <DogCard
                        key={dog.id}
                        dog={dog}
                        isFavorite={favorites.has(dog.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalResults / PAGE_SIZE)}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Match Button */}
      {favorites.size > 0 && (
        <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2 lg:hidden">
          <button
            onClick={clearFavorites}
            className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
            title="Clear favorites"
          >
            <FaTimes className="w-5 h-5" />
          </button>
          <button
            onClick={handleGenerateMatch}
            className="p-4 rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition-colors flex items-center justify-center"
            title="Find your perfect match"
          >
            <div className="relative">
              <FaHeart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-white text-pink-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {favorites.size}
              </span>
            </div>
          </button>
        </div>
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        breeds={breeds}
        selectedBreeds={selectedBreeds}
        onFiltersChange={handleFiltersChange}
        currentSort={currentSort}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
      />
      <MatchModal
        dog={matchedDog}
        isOpen={isMatchModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
