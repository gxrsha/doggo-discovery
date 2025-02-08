import { SearchFilters } from "./SearchFilters";
import { DogSearchParams } from "../types/types";
import { MdClose } from "react-icons/md";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  breeds: string[];
  selectedBreeds: string[];
  onFiltersChange: (filters: DogSearchParams) => void;
  currentSort: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
}

export function FilterModal({
  isOpen,
  onClose,
  breeds,
  selectedBreeds,
  onFiltersChange,
  currentSort,
  onSortChange,
  onClearFilters,
}: FilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
      <div className="fixed inset-y-0 right-0 w-screen max-w-md bg-[#1b1f26] shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
          <SearchFilters
            breeds={breeds}
            selectedBreeds={selectedBreeds}
            onFiltersChange={onFiltersChange}
            currentSort={currentSort}
            onSortChange={onSortChange}
            onClearFilters={onClearFilters}
          />
        </div>
      </div>
    </div>
  );
}
