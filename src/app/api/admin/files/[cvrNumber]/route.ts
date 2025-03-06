import { type NextRequest } from 'next/server';

// Get file details
export async function GET(request: NextRequest, context: { params: { cvrNumber: string } }) {
  const { cvrNumber } = await Promise.resolve(context.params);
  const apiKey = process.env.ADMIN_API_KEY;
  if (!apiKey) {
    console.error('Missing ADMIN_API_KEY environment variable');
    return Response.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const baseUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';

  try {
    const response = await fetch(`${baseUrl}/admin/files/${cvrNumber}`, {
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
    console.error('Failed to fetch file details:', error);
    return Response.json({ error: 'Failed to fetch file details' }, { status: 500 });
  }
}

// Create file
export async function POST(request: NextRequest, context: { params: { cvrNumber: string } }) {
  const { cvrNumber } = await Promise.resolve(context.params);
  const apiKey = process.env.ADMIN_API_KEY;
  if (!apiKey) {
    console.error('Missing ADMIN_API_KEY environment variable');
    return Response.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const baseUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';

  try {
    const data = await request.json();
    const response = await fetch(`${baseUrl}/admin/files/${cvrNumber}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(data),
    });

    if (response.status === 409) {
      return Response.json({ error: 'File already exists' }, { status: 409 });
    }

    if (!response.ok) {
      const error = await response.json();
      return Response.json(error, { status: response.status });
    }

    const result = await response.json();
    return Response.json(result);
  } catch (error) {
    console.error('Failed to create file:', error);
    return Response.json({ error: 'Failed to create file' }, { status: 500 });
  }
}

// Update file
export async function PUT(request: NextRequest, context: { params: { cvrNumber: string } }) {
  const { cvrNumber } = await Promise.resolve(context.params);
  const apiKey = process.env.ADMIN_API_KEY;
  if (!apiKey) {
    console.error('Missing ADMIN_API_KEY environment variable');
    return Response.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const baseUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';

  try {
    const data = await request.json();
    const response = await fetch(`${baseUrl}/admin/files/${cvrNumber}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json(error, { status: response.status });
    }

    const result = await response.json();
    return Response.json(result);
  } catch (error) {
    console.error('Failed to update file:', error);
    return Response.json({ error: 'Failed to update file' }, { status: 500 });
  }
}

// Delete file
export async function DELETE(request: NextRequest, context: { params: { cvrNumber: string } }) {
  const { cvrNumber } = await Promise.resolve(context.params);
  const apiKey = process.env.ADMIN_API_KEY;
  if (!apiKey) {
    console.error('Missing ADMIN_API_KEY environment variable');
    return Response.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const baseUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';

  try {
    const response = await fetch(`${baseUrl}/admin/files/${cvrNumber}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json(error, { status: response.status });
    }

    const result = await response.json();
    return Response.json(result);
  } catch (error) {
    console.error('Failed to delete file:', error);
    return Response.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
