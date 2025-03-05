export async function GET() {
  const apiKey = process.env.ADMIN_API_KEY;
  if (!apiKey) {
    console.error('Missing ADMIN_API_KEY environment variable');
    return Response.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const baseUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';

  try {
    const response = await fetch(`${baseUrl}/admin/requests`, {
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
    console.error('Failed to fetch request statistics:', error);
    return Response.json({ error: 'Failed to fetch request statistics' }, { status: 500 });
  }
}
