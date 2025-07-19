import React, { useState, useRef, useEffect } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchSuggestion {
  id: string;
  text: string;
  type: "product" | "category" | "recent" | "trending";
  count?: number;
}

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  suggestions?: SearchSuggestion[];
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  recentSearches?: string[];
  trendingSearches?: string[];
}

export const SearchInput: React.FC<SearchProps> = ({
  value,
  onChange,
  onSearch,
  suggestions = [],
  placeholder = "Search products...",
  className,
  showSuggestions = true,
  recentSearches = [],
  trendingSearches = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Combine all suggestions
  const allSuggestions: SearchSuggestion[] = [
    ...suggestions,
    ...recentSearches.map((search) => ({
      id: `recent-${search}`,
      text: search,
      type: "recent" as const,
      count: undefined,
    })),
    ...trendingSearches.map((search) => ({
      id: `trending-${search}`,
      text: search,
      type: "trending" as const,
      count: undefined,
    })),
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(newValue.length > 0 || showSuggestions);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < allSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          const suggestion = allSuggestions[highlightedIndex];
          handleSuggestionClick(suggestion.text);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearch = () => {
    if (value.trim()) {
      onSearch(value.trim());
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    onChange(suggestionText);
    onSearch(suggestionText);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    onChange("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "recent":
        return <Clock className="h-4 w-4 text-gray-400" />;
      case "trending":
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(showSuggestions || value.length > 0)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        {value && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && allSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {allSuggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion.text)}
              className={cn(
                "w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors",
                highlightedIndex === index && "bg-blue-50"
              )}
            >
              {getSuggestionIcon(suggestion.type)}
              <span className="flex-1 text-sm text-gray-900">
                {suggestion.text}
              </span>
              {suggestion.count && (
                <span className="text-xs text-gray-500">
                  {suggestion.count} results
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
