"use client";

import { useState, useEffect, useRef } from "react";
import { MalwareAnalysisHeader } from "@/components/MalwareAnalysisHeader";
import { ScanResultsTable } from "@/components/ScanResultsTable";
import { StatsSummary } from "@/components/StatsSummary";
import { Shield, AlertTriangle } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight-new";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React from "react";

export default function Home() {
  const reportRef = useRef(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const donwloadPDF = async () => {
    if (!reportRef.current) return;

    const input = reportRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("malware-analysis-report.pdf");
  }

  useEffect(() => {
    const storedData = localStorage.getItem("virus_total");
    console.log(storedData);
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  if (!loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-lg font-medium">
            Loading malware analysis data...
          </p>
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

  // Transform the results object into an array of objects with name, category, and result
  const scanResults = Object.entries(data.data.attributes.results).map(
    ([name, details]: [string, any]) => ({
      name,
      category: details.category,
      result: details.result,
    })
  );

  return (
    <main ref={reportRef} className="container mx-auto py-8 px-4 pt-24">
      <div className="absolute inset-0 w-full h-full z-10 overflow-hidden">
        <Spotlight />
      </div>
      <div className="flex items-center justify-center gap-2 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-center">Malware Insight</h1>
      </div>

      <MalwareAnalysisHeader
        fileInfo={data.meta.file_info}
        date={data.data.attributes.date}
        stats={data.data.attributes.stats}
      />

      <div className="grid grid-cols-1 gap-6 mb-6">
        <StatsSummary stats={data.data.attributes.stats} />
      </div>

      <ScanResultsTable results={scanResults} />

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p className="mt-1">SHA256: {data.meta.file_info.sha256}</p>
      </footer>

      <button 
        className="bg-white hover:bg-gray-300 text-black font-semibold px-4 py-2 rounded-md shadow"
        onClick={donwloadPDF}
        >
        Download as PDF
      </button>
    </main>
  );
}