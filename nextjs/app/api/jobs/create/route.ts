import { NextRequest, NextResponse } from 'next/server';

/**
 * Backend-for-Frontend (BFF) proxy endpoint for job creation.
 *
 * This endpoint acts as a secure proxy between the frontend and backend.
 * The API key is stored server-side only and never exposed to the browser.
 *
 * Security:
 * - API key stored in server environment variable (not NEXT_PUBLIC_)
 * - API key never sent to browser
 * - Backend validates API key before issuing job tokens
 */
export async function POST(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development';
  const backendUrl = isDev
    ? 'http://localhost:8000'
    : process.env.BACKEND_URL || 'https://codr-websocket.fly.dev';

  // API key stored server-side only (not NEXT_PUBLIC_)
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error('API_KEY not configured in server environment');
    return NextResponse.json(
      { detail: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${backendUrl}/api/jobs/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,  // API key stays server-side!
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Backend job creation failed:', data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Failed to connect to backend:', error);
    return NextResponse.json(
      { detail: 'Failed to connect to backend service' },
      { status: 502 }
    );
  }
}
