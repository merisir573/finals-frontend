import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

const GATEWAY_URL = "http://localhost:3000/api/v1";

interface Medicine {
  name: string;
  status: string;
}

interface SearchResponse {
  status: string;
  data: Medicine[];  // Array of medicines
  totalCount: number;  // Total count of search results
}

interface MedicineSearchProps {
  onAdd: (medicine: string) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

function MedicineSearch({ onAdd, currentPage, setCurrentPage }: MedicineSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const limit = 10; // Hardcoded limit

  const searchMedicine = async (page: number) => {
    try {
      const response: AxiosResponse<SearchResponse> = await axios.get(`${GATEWAY_URL}/medicine/v1/search`, {
        params: { 
          name: query, 
          page: page.toString(),  // Ensure page is passed as a string
        },
      });

      console.log(`Page ${page} response:`, response.data); // Log the response data for debugging

      if (response.data.status === "Success") {
        setResults(response.data.data.map((medicine) => medicine.name)); // Replace old results
        setTotalCount(response.data.totalCount); // Update total count
        console.log(`Total count for page ${page}:`, response.data.totalCount); // Log the totalCount
      }
    } catch (error) {
      console.error("Error searching medicine:", error);
    }
  };

  // Handle Next Page
  const handleNextPage = () => {
    if (currentPage < totalPages()) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      searchMedicine(nextPage); // Fetch the next page
    }
  };

  // Handle Previous Page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      searchMedicine(prevPage); // Fetch the previous page
    }
  };

  // Total pages based on total count and limit
  const totalPages = () => {
    return Math.ceil(totalCount / limit); // Calculate the total number of pages
  };

  // Handle page change dynamically when search results change
  const adjustPageIfNeeded = () => {
    if (currentPage > totalPages()) {
      // If current page is greater than available pages, set to last page
      setCurrentPage(totalPages());
    }
  };

  // Run this effect every time the search query or totalCount changes
  useEffect(() => {
    if (query) {
      setCurrentPage(1); // Set the current page to 1 when the query changes
      searchMedicine(1); // Fetch first page of results
    }
  }, [query]); // Trigger search when query changes

  // When totalCount changes, adjust the current page if necessary
  useEffect(() => {
    adjustPageIfNeeded();
  }, [totalCount]); // Adjust page after the totalCount is updated

  return (
    <div className="mt-4">
      <input
        type="text"
        placeholder="Search medicine"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border px-4 py-2 rounded w-full"
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        onClick={() => {
          setCurrentPage(1); // Reset to first page on search
          searchMedicine(1);  // Fetch first page of results
        }}
      >
        [SEARCH]
      </button>

      <ul className="mt-2">
        {results.map((medicine, idx) => (
          <li
            key={idx}
            className="cursor-pointer text-blue-600"
            onClick={() => onAdd(medicine)}
          >
            {medicine} [ADD]
          </li>
        ))}
      </ul>

      <div className="mt-2">
        {totalCount > 0 && <p>Total Results: {totalCount}</p>}
        <div className="mt-2 flex justify-between">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            [Previous]
          </button>

          <span>
            Page {currentPage} of {totalPages()}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages()}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            [Next]
          </button>
        </div>
      </div>
    </div>
  );
}

export default MedicineSearch;
