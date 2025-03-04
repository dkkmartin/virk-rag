export const dynamic = 'force-static';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await fetch(`${process.env.API_URL}${id}`);
  const data = await response.json();
  return new Response(JSON.stringify(data));
}
