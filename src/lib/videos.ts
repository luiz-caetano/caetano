export type Video = { url: string; title: string; thumbnail: string; platform: "youtube" | "tiktok" | "instagram"; embedUrl: string; viewCount?: string };

type YouTubeStatisticsResponse = {
	items?: { statistics?: { viewCount?: string } }[];
};

const tiktokFallbackTitles: Record<string, string> = {
	"7683242968215506197": "CLOUD GLIDER HAYATE IDOL FISCH",
	"7680882525459270932": "THE DEPTHS MELHOR FARM DO FISCH PÓS UPDATE",
	"7672655865991859477": "ADVANCED GLIDER FISCH PLANADOR AVANÇADO",
	"7671062061748604161": "COMO FICAR RICO NO FISCH COM O @astro.blox.brasil",
};

function youtubeId(url: string) {
	return url.match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/)([\w-]{11})/)?.[1];
}

function tiktokId(url: string) {
	return url.match(/\/video\/(\d+)/)?.[1];
}

function instagramId(url: string) {
	return url.match(/instagram\.com\/(?:p|reel|tv)\/([\w-]+)/)?.[1];
}

function cleanTitle(title: string | undefined, fallback: string) {
	return (title || fallback)
		.replace(/#[^\s#]+/g, " ")
		.replace(/\s*_{3,}\s*$/, "")
		.replace(/\s+/g, " ")
		.replace(/\s+([.,;!?])/g, "$1")
		.replace(/[.,;!?]+$/, "")
		.trim();
}

async function oEmbed(url: string, endpoint: string, revalidate = 3600) {
	try {
		const response = await fetch(`${endpoint}${encodeURIComponent(url)}`, { next: { revalidate } });
		return response.ok ? await response.json() : null;
	} catch {
		return null;
	}
}

async function youtubeViewCount(videoId: string) {
	const apiKey = process.env.YOUTUBE_API_KEY;
	if (!apiKey) return undefined;

	const apiUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
	apiUrl.searchParams.set("part", "statistics");
	apiUrl.searchParams.set("id", videoId);
	apiUrl.searchParams.set("key", apiKey);

	try {
		const response = await fetch(apiUrl, { next: { revalidate: 300 } });
		if (!response.ok) return undefined;
		const data = await response.json() as YouTubeStatisticsResponse;
		return data.items?.[0]?.statistics?.viewCount;
	} catch {
		return undefined;
	}
}

export async function getVideo(url: string): Promise<Video> {
	const youtubeVideoId = youtubeId(url);
	if (youtubeVideoId) {
		const [metadata, viewCount] = await Promise.all([
			oEmbed(url, "https://www.youtube.com/oembed?format=json&url="),
			youtubeViewCount(youtubeVideoId),
		]);
		return {
			url,
			title: cleanTitle(metadata?.title, "YouTube video"),
			thumbnail: `https://i.ytimg.com/vi/${youtubeVideoId}/maxresdefault.jpg`,
			platform: "youtube",
			embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeVideoId}`,
			viewCount,
		};
	}

	const tiktokVideoId = tiktokId(url);
	const instagramVideoId = instagramId(url);
	if (instagramVideoId) {
		return {
			url,
			title: "Instagram video",
			thumbnail: "",
			platform: "instagram",
			embedUrl: `https://www.instagram.com/p/${instagramVideoId}/embed`,
		};
	}

	const metadata = await oEmbed(url, "https://www.tiktok.com/oembed?url=");
	return {
		url,
		title: cleanTitle(metadata?.title, tiktokFallbackTitles[tiktokVideoId || ""] || "TikTok video"),
		thumbnail: metadata?.thumbnail_url || "",
		platform: "tiktok",
		embedUrl: tiktokVideoId ? `https://www.tiktok.com/embed/v2/${tiktokVideoId}` : url,
	};
}

export function getVideos(urls: string[]) {
	return Promise.all(urls.map(getVideo));
}
