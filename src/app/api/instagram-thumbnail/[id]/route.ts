type InstagramOEmbed = { thumbnail_url?: string };

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[\w-]+$/.test(id)) return new Response("Invalid Instagram reel ID", { status: 400 });

  try {
    const reelUrl = `https://www.instagram.com/reel/${id}/`;
    const metadataResponse = await fetch(
      `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(reelUrl)}`,
      { next: { revalidate: 3600 } },
    );
    if (!metadataResponse.ok) return new Response("Instagram preview unavailable", { status: 502 });

    const metadata = await metadataResponse.json() as InstagramOEmbed;
    if (!metadata.thumbnail_url) return new Response("Instagram thumbnail unavailable", { status: 404 });

    const thumbnailUrl = new URL(metadata.thumbnail_url);
    if (!thumbnailUrl.hostname.endsWith(".cdninstagram.com")) {
      return new Response("Unexpected Instagram thumbnail host", { status: 502 });
    }

    const imageResponse = await fetch(thumbnailUrl, { next: { revalidate: 3600 } });
    if (!imageResponse.ok || !imageResponse.body) return new Response("Instagram thumbnail unavailable", { status: 502 });

    return new Response(imageResponse.body, {
      headers: {
        "Content-Type": imageResponse.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new Response("Instagram thumbnail unavailable", { status: 502 });
  }
}