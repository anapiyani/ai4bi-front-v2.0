// write next js app router auth /login post request handler that talks to backend api

export const dynamic = "force-dynamic";
import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request: NextRequest) {
  try {
    const { refresh_token } = await request.json();
    let response = null;
    let attempt = 0;
    const maxRetries = 3;

    while (attempt < maxRetries) {
      try {
        response = await axios.post(`${API_URL}/user/refresh/`, {
          refresh_token,
        });
        break; // Exit loop if the request is successful
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          throw error; // Re-throw the error if max retries are reached
        }
      }
    }

    if (!response) {
      return NextResponse.json(
        { error: "Failed to refresh token. Please log in again." },
        { status: 401 }
      );
    }

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (!error.response) {
      console.log("No error response", error);
      return NextResponse.json(
        { error: "Something went wrong weirdly when connecting the backend" },
        { status: 400 }
      );
    }
    if (error.response && error.response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(error.response.data, {
      status: error.response.status,
    });
  }
}

