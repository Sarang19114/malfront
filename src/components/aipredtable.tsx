"use client";

import { useState } from "react";
import { Search, ArrowUpDown } from "lucide-react";

interface ScanResult {
  name: string;
  result: string | null;
}

interface ScanResultsTableProps {
  results: ScanResult[];
}

export function ScanResultsTable({ results }: ScanResultsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ScanResult;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });

  const handleSort = (key: keyof ScanResult) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const filteredResults = results
    .filter(
      (result) =>
        result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (result.result &&
          result.result.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";

      if (sortConfig.direction === "asc") {
        return String(aValue).localeCompare(String(bValue));
      } else {
        return String(bValue).localeCompare(String(aValue));
      }
    });

  return (
    <div className="bg-card bg-white text-black rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">AI Prediction Results</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or result..."
            className="w-full text-white pl-10 pr-4 py-2 border rounded-md bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>


      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Scanner Name
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer"
              >
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer"
                onClick={() => handleSort("result")}
              >
                <div className="flex items-center gap-1">
                  Result
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredResults.map((result, index) => (
              <tr key={index} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium">{result.name}</td>
                <td className="px-4 py-3 text-sm">
                </td>
                <td className="px-4 py-3 text-sm font-mono">
                  {result.result || (
                    <span className="text-muted-foreground italic">
                      No result
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredResults.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No results found matching your criteria
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Showing {filteredResults.length} of {results.length} results
      </div>
    </div>
  );
}
