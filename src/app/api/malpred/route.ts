import { NextRequest, NextResponse } from "next/server";

const MALWARE_PREDICTION_URL = "http://127.0.0.1:5000/malpred";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Forward the file to the Flask malware prediction server
    const externalFormData = new FormData();
    externalFormData.append("file", file);

    const response = await fetch(MALWARE_PREDICTION_URL, {
      method: "POST",
      body: externalFormData,
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Malware prediction failed" }, { status: 500 });
    }

    const data = await response.json(); // Expect JSON response
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
