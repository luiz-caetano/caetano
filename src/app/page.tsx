import Portfolio from "@/components/Portfolio";
import { portfolio } from "@/config/portfolio";
import { getVideos } from "@/lib/videos";

export default async function Page() {
  const [youtube, shorts] = await Promise.all([getVideos(portfolio.youtubeVideos), getVideos(portfolio.shortVideos)]);
  return <Portfolio youtube={youtube} shorts={shorts} />;
}
