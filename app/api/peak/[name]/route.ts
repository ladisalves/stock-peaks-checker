export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  if (!name) {
    return new Response('Name parameter is missing', { status: 400 });
  }

  return new Response(`Hello, ${name}!`);
}
