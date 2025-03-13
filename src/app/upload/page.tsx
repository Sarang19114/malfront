"use client";

import { useState} from "react";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { FileUpload } from "@/components/ui/file-upload";
import ProcessingStatus from "@/components/ProcessingStatus";
import { GridPattern } from "@/components/ui/file-upload";
import { Spotlight } from "@/components/ui/spotlight-new";

// Grid Background Component

const Hero = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [responseData, setResponseData] = useState<{ report: string; extracted: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [codeResponseLoading, setCodeResponseLoading] = useState(false);
  const [decompilationSuccess, setDecompilationSuccess] = useState(false);
  const [virusTotalLoading, setVirusTotalLoading] = useState(false);
  const [virusTotalSuccess, setVirusTotalSuccess] = useState(false);
  const [capaLoading, setCapaLoading] = useState(false);
  const [capaSuccess, setCapaSuccess] = useState(false);

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
  
      // Reset states when a new file is selected
      setDecompilationSuccess(false);
      setVirusTotalSuccess(false);
      setCapaSuccess(false);
      setResponseData(null);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
  
    setLoading(true);
    setCodeResponseLoading(true);
    setVirusTotalLoading(true);
    setCapaLoading(true);
    setDecompilationSuccess(false);
    setVirusTotalSuccess(false);
    setCapaSuccess(false);
  
    const formData = new FormData();
    formData.append("file", selectedFile);
  
    try {
      // Perform all API requests in parallel
      const [decompilationRes, virusTotalRes, capaRes] = await Promise.all([
        fetch("/api/codeDecompilation", { method: "POST", body: formData, cache: "no-store" }),
        fetch("/api/virusTotal", { method: "POST", body: formData, cache: "no-store" }),
        fetch("/api/capa", { method: "POST", body: formData, cache: "no-store" }),
      ]);
  
      // Check if any request failed
      if (!decompilationRes.ok || !virusTotalRes.ok || !capaRes.ok) {
        throw new Error("Processing failed!");
      }
  
      // Parse responses
      const [decompilationData, virusTotalData, capaData] = await Promise.all([
        decompilationRes.json(),
        virusTotalRes.json(),
        capaRes.json(),
      ]);
  
      // Store responses in localStorage
      localStorage.setItem("code_response", JSON.stringify(decompilationData));
      localStorage.setItem("virus_total", JSON.stringify(virusTotalData));
      localStorage.setItem("capa_response", JSON.stringify(capaData));
  
      // Update states after successful storage
      setResponseData(decompilationData);
      setDecompilationSuccess(true);
      setVirusTotalSuccess(true);
      setCapaSuccess(true);
  
      console.log("Stored in localStorage:", { decompilationData, virusTotalData, capaData });
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
      setCodeResponseLoading(false);
      setVirusTotalLoading(false);
      setCapaLoading(false);
    }
  };
  

  return (
    <section className="relative min-h-screen bg-black overflow-hidden inset-0 [mask-image:radial-gradient(ellipse_at_top_left,white,transparent)]">
      <Spotlight />
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 -z-50">
        <GridPattern />
      </div>

      {/* Hero Content */}
      <div className="z-50 max-w-screen-xl mx-auto px-4 py-28 gap-12 text-gray-600 md:px-8">
        <div className="space-y-5 max-w-4xl mx-auto text-center">
          <h1 className="text-sm text-indigo-600 font-medium">Security Comes First.</h1>
          <h2 className="text-4xl text-white font-extrabold mx-auto md:text-5xl">
          Analyze Files with Confidence Using{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]">
              Malexe
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-white">
          Malexe is your all-in-one platform for{" "}
            <strong>automated malware analysis, decompilation, and threat detection.</strong>{" "}
            Gain deep insights into your files through advanced static and dynamic analysis—all in a secure environment.
          </p>

          {/* Upload Box */}
          <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-black border-neutral-200 rounded-lg p-4">
            <FileUpload onChange={handleFileChange} />
            <div className="mt-4 flex justify-center">
              <InteractiveHoverButton
                className="bg-white text-black mb-10"
                onClick={handleUpload}
                disabled={loading || !selectedFile}
              >
                {loading ? "Processing..." : "Submit"}
              </InteractiveHoverButton>
            </div>
          </div>

          {/* Processing Status */}
          <ProcessingStatus
            loading={codeResponseLoading}
            success={decompilationSuccess}
            loadingText="Decompiling Code...."
            successText="Successfully Decompiled Code"
            link="/upload/code"
          />
          <ProcessingStatus
            loading={virusTotalLoading}
            success={virusTotalSuccess}
            loadingText="Running Static Analysis...."
            successText="Static Analysis Completed"
            link="/upload/analysis"
          />
          <ProcessingStatus
            loading={capaLoading}
            success={capaSuccess}
            loadingText="Analyzing with CAPA...."
            successText="CAPA Analysis Completed"
            link="/upload/capa"
          />
        </div>
      </div>
    </section>
  );
};

Hero.displayName = "Hero";
export default Hero;
