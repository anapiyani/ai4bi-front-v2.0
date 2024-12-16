// app/api/proxy/[...proxy].ts
export const dynamic = "force-dynamic";
import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL;

async function handleProxy(req: NextRequest) {
  try {
    let url = req.nextUrl.searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const config = {
      headers: {
        Authorization: req.headers.get("Authorization"),
        "Content-Type": "application/json",
      },
      retries: 5, // number of retries
      retryDelay: (retryCount: number) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 8000; // time interval between retries 
      },
    };

    const fullUrl = `${BACKEND_URL}${url}`;

    if (req.method === "GET") {
      const response = await axios.get(fullUrl, config);
      return NextResponse.json(response.data);
    } else if (req.method === "POST") {
      const body = await req.json();
      const response = await axios.post(fullUrl, body, config);
      return NextResponse.json(response.data);
    } else if (req.method === "DELETE") {
      const response = await axios.delete(fullUrl, config);
      return NextResponse.json(response.data);
    } else if (req.method === "PATCH") {
      console.log("PATCH request");
      const body = await req.json();
      const response = await axios.patch(fullUrl, body, config);
      return NextResponse.json(response.data);
    } else {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }
  } catch (err: any) {
    if (err.response && err.response.status === 401) {
      return NextResponse.json(
        { error: "Failed to refresh token. Please log in again." },
        { status: 401 }
      );
    }
    console.log("Something went wrong with request itself", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return handleProxy(req);
}

export async function POST(req: NextRequest) {
  return handleProxy(req);
}

export async function PATCH(req: NextRequest) {
  return handleProxy(req);
}

export async function DELETE(req: NextRequest) {
  return handleProxy(req);
}
