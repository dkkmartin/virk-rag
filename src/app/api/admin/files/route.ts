import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const skip = searchParams.get('skip') || '0';
  const limit = searchParams.get('limit') || '100';
  const sortBy = searchParams.get('sort_by') || 'last_modified';
  const order = searchParams.get('order') || 'desc';

  const apiKey = process.env.ADMIN_API_KEY;
  if (!apiKey) {
    console.error('Missing ADMIN_API_KEY environment variable');
    return Response.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const baseUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
  const queryString = new URLSearchParams({ skip, limit, sort_by: sortBy, order }).toString();

  try {
    const response = await fetch(`${baseUrl}/admin/files?${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json(error, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Failed to fetch files:', error);
    return Response.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}
