// src/app/api/me/route.ts
import axios from 'axios'
import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function GET() {
  try {
    // Directly call an external API or a database
    const { data } = await axios.get(`${API_URL}/user/me`);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }
}
