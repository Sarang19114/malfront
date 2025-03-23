"use client";

import { useState, useEffect } from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight-new";
import React from "react";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem("malpred_response");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-lg font-medium">Loading malware analysis data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h1 className="text-2xl font-bold">Error Loading Data</h1>
          <p className="text-muted-foreground">
            Unable to load malware analysis data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const { prediction, features } = data;
  const featureEntries = Object.entries(features);

  return (
    <main className="container bg-card mx-auto py-8 pt-24">
      <div className="absolute inset-0 w-full h-full z-10 overflow-hidden">
        <Spotlight />
      </div>
      <header className="text-center mb-8">
        <Shield className="inline h-8 w-8 text-primary mr-2" />
        <h1 className="text-3xl font-bold">Prediction: {prediction}</h1>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border text-black px-4 py-2 bg-gray-100">Feature</th>
              <th className="border text-black px-4 py-2 bg-gray-100">Value</th>
            </tr>
          </thead>
          <tbody>
            {featureEntries.map(([key, value]) => (
              <tr key={key}>
                <td className="border px-4 py-2">
                  <a
                    href={`https://www.google.com/search?q=what+is+${encodeURIComponent(key)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {key}
                  </a>
                </td>
                <td className="border px-4 py-2">{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Analysis provided by MalwareInsight.</p>
      </footer>
    </main>
  );
}
