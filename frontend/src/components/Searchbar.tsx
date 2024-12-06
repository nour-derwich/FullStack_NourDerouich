import React, { useState, useEffect, useCallback } from "react";
import api from "../lib/api";
import { Input } from "../components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { Products } from "../types/types";
import _ from "lodash";
export default function Searchbar({
  products,
  setProducts,
}: {
  products: Products[] | null;
  setProducts: React.Dispatch<React.SetStateAction<Products[] | null>>;
}) {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch initial categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await api.get("/");
        const uniqueCategories: string[] = [...new Set((res.data.products as Products[]).map((p: Products) => p.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    getCategories();
  }, []);

  // Search and filter functionality
  const searchAndFilterProducts = useCallback((searchQuery: string, category?: string) => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/");
        let filteredProducts = res.data.products as Products[];

        // Filter by search query
        if (searchQuery) {
          filteredProducts = filteredProducts.filter((p: Products) => 
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Filter by category if selected
        if (category) {
          filteredProducts = filteredProducts.filter((p: Products) => p.category === category);
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error searching products", error);
      }
    };

    fetchProducts();
  }, [setProducts]);

  // Debounced search
  const debouncedSearch = useCallback(
    _.debounce((searchQuery: string, category?: string) => {
      searchAndFilterProducts(searchQuery, category);
    }, 300),
    [searchAndFilterProducts]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    debouncedSearch(query, category);
  };

  return (
    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <div className="relative w-full flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder="Search products..."
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary"
              onChange={handleInputChange}
              value={query}
            />
          </div>
        </div>
        <Select onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}