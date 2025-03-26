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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [responseData, setResponseData] = useState<{ report: string; extracted: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [codeResponseLoading, setCodeResponseLoading] = useState(false);
  const [decompilationSuccess, setDecompilationSuccess] = useState(false);
  const [virusTotalLoading, setVirusTotalLoading] = useState(false);
  const [virusTotalSuccess, setVirusTotalSuccess] = useState(false);
  const [capaLoading, setCapaLoading] = useState(false);
  const [capaSuccess, setCapaSuccess] = useState(false);
  const [malpredLoading, setMalpredLoading] = useState(false);
  const [malpredSuccess, setMalpredSuccess] = useState(false);

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
  
      // Reset UI states
      setDecompilationSuccess(false);
      setVirusTotalSuccess(false);
      setCapaSuccess(false);
      setMalpredSuccess(false);

      // Clear previous results from localStorage
      localStorage.removeItem("code_response");
      localStorage.removeItem("virus_total");
      localStorage.removeItem("capa_response");
      localStorage.removeItem("malpred_response");
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
  
    setLoading(true);
    const fileBuffer = await selectedFile.arrayBuffer();
  
    const sendFileForAnalysis = async (
      endpoint: string,
      setLoading: (val: boolean) => void,
      setSuccess: (val: boolean) => void,
      storageKey: string,
      errorMsg: string
    ) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", new File([fileBuffer], selectedFile.name, { type: selectedFile.type }));
  
        const response = await fetch(endpoint, { method: "POST", body: formData });
        if (!response.ok) throw new Error(errorMsg);
  
        const data = await response.json();
        localStorage.setItem(storageKey, JSON.stringify(data)); // Store in localStorage
        setSuccess(true);
      } catch (error) {
        console.error(errorMsg, error);
        alert(errorMsg);
      } finally {
        setLoading(false);
      }
    };
  
    await sendFileForAnalysis("/api/codeDecompilation", setCodeResponseLoading, setDecompilationSuccess, "code_response", "Code decompilation failed!");
    await sendFileForAnalysis("/api/virusTotal", setVirusTotalLoading, setVirusTotalSuccess, "virus_total", "Static analysis failed!");
    await sendFileForAnalysis("/api/capa", setCapaLoading, setCapaSuccess, "capa_response", "CAPA analysis failed!");
    await sendFileForAnalysis("/api/malpred", setMalpredLoading, setMalpredSuccess, "malpred_response", "Malware prediction failed!");
  
    setLoading(false);
  };

  return (
    <section 
      className="relative min-h-screen bg-black overflow-hidden inset-0 "
      style={{
        maskImage: "radial-gradient(ellipse at top left, white 60%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse at top left, white 60%, transparent 100%)"
      }}
    >
      <Spotlight />
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 -z-50 ">
        <GridPattern />
      </div>

      {/* Hero Content */}
      <div className="z-50 max-w-screen-xl mx-auto px-4 py-28 gap-12 text-gray-600 md:px-8">
        <div className="space-y-5 max-w-4xl mx-auto text-center">
          {/* {<h1 className="text-xl font-bold text-indigo-400">Security Comes First.</h1>} */}
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
                className="bg-white text-black mb-1"
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
          <ProcessingStatus
            loading={malpredLoading}
            success={malpredSuccess}
            loadingText="Predicting Malware...."
            successText="Malware Prediction Completed"
            link="/upload/aipred"
          />
        </div>
      </div>
    </section>
  );
};

Hero.displayName = "Hero";
export default Hero;
