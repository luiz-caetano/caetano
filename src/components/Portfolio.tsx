"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ExternalLink, Play, X } from "lucide-react";
import { portfolio as p } from "@/config/portfolio";
import type { Video } from "@/lib/videos";

const cases = [
  {
    videoId: "icm9alsl8Ow",
    title: "O ÚNICO GUIA QUE VOCÊ PRECISA PRA VOLTAR PRO FISCH",
    description: "Gameplay/Guia",
    metrics: [
      ["15,7K", "Views", ""],
      ["731,9h", "Tempo de exibição", "+421,9h acima do usual"],
      ["+136", "Novos inscritos", ""],
    ],
  },
  {
    videoId: "q525rGMtMBo",
    title: "Novo melhor spot de farm de dinheiro Fisch",
    description: "Vídeo de gameplay teórico + tutorial",
    metrics: [
      ["2,6K", "Views", ""],
      ["74,1h", "Tempo de exibição", ""],
      ["+12", "Novos inscritos", ""],
    ],
  },
  {
    videoId: "p1Z4QvuBQjM",
    title: "Farmando de Noob até o Pro no Fisch",
    description: "Vídeo de gameplay",
    metrics: [
      ["4K", "Views", ""],
      ["456,7h", "Tempo de exibição", ""],
    ],
  },
];

const socialStats = [
  {
    name: "TikTok",
    id: "tiktok-about-stats",
    metrics: [
      ["669,5K", "Visualizações de vídeos"],
      ["7,5K", "Visualizações de perfil"],
      ["26,9K", "Curtidas"],
      ["1,8K", "Comentários"],
      ["3,5K", "Compartilhamentos"],
    ],
  },
  {
    name: "YouTube",
    id: "youtube-about-stats",
    metrics: [
      ["36.099", "Views · últimos 28 dias"],
      ["1,3K", "Horas de exibição · últimos 28 dias"],
      ["+242", "Inscritos · últimos 28 dias"],
      ["1.449", "Inscritos em tempo real"],
      ["6.248", "Views · últimas 48 horas"],
    ],
  },
];

const reasons = [
  ["Mais views", "Acompanhe as views dos vídeos em destaque."],
  ["Mais tempo de exibição", "Os dados de tempo de exibição mostram quais vídeos mantêm o público assistindo."],
  ["Mais inscritos", "Um único vídeo trouxe 136 novos inscritos."],
];

function parseCompactViews(value: string) {
  const multiplier = /K$/i.test(value) ? 1000 : 1;
  const numericValue = Number(value.replace(/K$/i, "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(numericValue) ? numericValue * multiplier : 0;
}

function formatCompactViews(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1).replace(".", ",")}K` : new Intl.NumberFormat("pt-BR").format(value);
}

function metricEmphasis(value: string) {
  if (value.endsWith("h")) return "perfMetric-emphasis-time";
  const numericValue = Number(value.replace(/\+/g, "").replace(/K$/i, "").replace(",", "."));
  const magnitude = numericValue * (/[K]$/i.test(value) ? 1000 : 1);
  if (magnitude >= 100000) return "perfMetric-emphasis-max";
  if (magnitude >= 10000) return "perfMetric-emphasis-high";
  if (magnitude >= 1000) return "perfMetric-emphasis-mid";
  return "";
}

function VideoMedia({ video }: { video: Video }) {
  const [thumbnailFailed, setThumbnailFailed] = useState(!video.thumbnail);
  const [useYoutubeFallback, setUseYoutubeFallback] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoId = video.embedUrl.split("/").pop();
  const thumbnail = useYoutubeFallback && videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : video.thumbnail;

  useEffect(() => {
    const image = imageRef.current;
    if (!image?.complete || image.naturalWidth > 0) return;
    if (video.platform === "youtube" && !useYoutubeFallback) setUseYoutubeFallback(true);
    else setThumbnailFailed(true);
  }, [thumbnail, useYoutubeFallback, video.platform]);

  return (
    <div className="perfPreviewMedia" aria-hidden="true">
      {thumbnailFailed && (
        <span className="perfThumbnailFallback">
          <strong>{video.title}</strong>
            <small>{video.platform.toUpperCase()}</small>
        </span>
      )}
      {thumbnail && !thumbnailFailed && (
        <img
          ref={imageRef}
          src={thumbnail}
          alt=""
          loading={video.platform === "instagram" ? "eager" : "lazy"}
          onError={() => {
            if (video.platform === "youtube" && !useYoutubeFallback) setUseYoutubeFallback(true);
            else setThumbnailFailed(true);
          }}
        />
      )}
    </div>
  );
}

export default function Portfolio({ youtube, shorts }: { youtube: Video[]; shorts: Video[] }) {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [activeWorkView, setActiveWorkView] = useState<"long" | "short">("long");
  const findVideo = (videoId: string) => youtube.find((item) => item.embedUrl.endsWith(`/${videoId}`));
  const viewsForCase = (caseStudy: (typeof cases)[number]) => {
    const liveViews = findVideo(caseStudy.videoId)?.viewCount;
    if (liveViews) return Number(liveViews);
    const fallbackViews = caseStudy.metrics.find(([, label]) => label === "Views")?.[0];
    return fallbackViews ? parseCompactViews(fallbackViews) : 0;
  };
  useEffect(() => {
    const revealTargets = document.querySelectorAll<HTMLElement>("#performancePortfolio [data-reveal]");
    revealTargets.forEach((element, index) => {
      element.style.setProperty("--reveal-index", String(index % 5));
      element.classList.add("perfReveal");
    });

    let frame = 0;
    const revealVisible = () => {
      frame = 0;
      revealTargets.forEach((element) => {
        if (element.classList.contains("perfIsVisible")) return;
        const bounds = element.getBoundingClientRect();
        if (bounds.top < window.innerHeight - 36 && bounds.bottom > 0) {
          element.classList.add("perfIsVisible");
        }
      });
    };
    const scheduleReveal = () => {
      if (!frame) frame = requestAnimationFrame(revealVisible);
    };

    revealVisible();
    window.addEventListener("scroll", scheduleReveal, { passive: true });
    window.addEventListener("resize", scheduleReveal, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleReveal);
      window.removeEventListener("resize", scheduleReveal);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const playCase = (videoId: string) => {
    const video = youtube.find((item) => item.embedUrl.endsWith(`/${videoId}`));
    if (video) setActiveVideo(video);
  };

  const videoGallery = (videos: Video[], platform: string, className: string) => (
    <div className={`perfVideoGrid ${className}`}>
      {videos.map((video, index) => (
        <article className="perfVideoCard" data-reveal key={video.url}>
          <button className="perfVideoThumbnail" onClick={() => setActiveVideo(video)} aria-label={`Assistir ${video.title}`}>
            <VideoMedia video={video} />
            <span className="perfPlayButton"><Play fill="currentColor" /></span>
            <small>{video.platform === "instagram" ? "Instagram" : platform}</small>
          </button>
          <div className="perfVideoMeta">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{video.title}</h3>
            <ArrowUpRight aria-hidden="true" />
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <div id="performancePortfolio">
      <header className="perfHeader">
        <nav className="perfNav" aria-label="Navegação principal">
          <a className="perfLogo" href="#inicio">@luizintws</a>
          <div className="perfNavLinks">
            <a href="#resultados">Resultados</a>
            <a href="#numeros">About Me</a>
            <a href="#contato">Contato</a>
          </div>
          <a href={`mailto:${p.email}`} className="perfButton perfButtonPrimary"><img className="refVectorIcon" src="/vectors/email-svgrepo-com.svg" alt="" aria-hidden="true" />Contato</a>
        </nav>
      </header>

      <div className="refContainer">
        <div className="refPoster" data-reveal>
          <p><span>Editor de vídeo para YouTube</span><br />Portfólio</p>
        </div>

        <main className="refMain">
          <section className="refSlide refHero" id="inicio">
            <span className="refBracket refTag1">[ Vídeos longos ]</span>
            <span className="refBracket refTag2">[ Shorts ]</span>
            <span className="refBracket refTag4">[ Ritmo ]</span>
            <span className="refBracket refTag5">[ Gaming ]</span>
            <span className="refBracket refTag6">[ Guias ]</span>
            <span className="refYear">✦ &nbsp;2026</span>
            <div className="refHeroStage">
              <div className="refFrame refFrameOne">
                <img src="/images/THIMBNOOB.jpg" alt="Miniatura de gameplay Noob to Pro" />
                <div className="refFrameCaption"><b>{formatCompactViews(viewsForCase(cases[0]))}</b><span>Views do vídeo</span></div>
              </div>
              <div className="refFrame refFrameTwo">
                <img src="/images/THUMB3.jpg" alt="Miniatura de gameplay Nova Rod" />
                <div className="refFrameCaption"><b>731,9h</b><span>Tempo de exibição</span></div>
              </div>
              <h1>Edição que traz <em>mais views</em> para o seu canal</h1>
            </div>
            <div className="refHeroFoot">
              <div><strong>luizintws</strong><span>Edição de vídeo para YouTube</span></div>
              <div className="refHeroActions">
                <a href="#resultados" className="perfButton perfButtonPrimary">Ver os números <ArrowUpRight /></a>
                <a href="#contato" className="perfButton perfButtonOutline">Entre em contato</a>
              </div>
            </div>
          </section>

          <section className="refSlide refAbout" id="numeros">
            <div className="refAboutIdentity">
              <img src="/images/logo_transparente.png" alt="Logo do canal luizintws" />
              <div>
                <p>About Me</p>
                <h2>luizintws</h2>
                <span className="refAboutDescription">Editor de vídeos focado em gameplay, especialmente Roblox.</span>
              </div>
            </div>
            <div className="refPlatformStats">
              {socialStats.map((platform) => (
                <section className="refPlatformPanel" aria-labelledby={platform.id} key={platform.id}>
                  <h3 id={platform.id}>{platform.name}</h3>
                  <dl className="refPlatformMetricGrid">
                    {platform.metrics.map(([value, label]) => (
                      <div className="refPlatformMetric" key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          </section>

          <section className="refSlide" id="resultados">
            <aside className="refWorkIndex" aria-label="Work categories" data-active={activeWorkView}>
              <span className="refWorkDots" aria-hidden="true"><i /><i /><i /></span>
              <button type="button" aria-pressed={activeWorkView === "long"} onClick={() => setActiveWorkView("long")}><b>01</b><span>YouTube long videos</span></button>
              <button type="button" aria-pressed={activeWorkView === "short"} onClick={() => setActiveWorkView("short")}><b>02</b><span>Short videos</span></button>
            </aside>
            <div className={`refWorkContent ${activeWorkView === "short" ? "refWorkSlideReverse" : ""}`} key={activeWorkView}>
              {activeWorkView === "long" ? (
                <>
                  <div className="refSlideHead" data-reveal>
                    <h2>Resultados de vídeos que editei</h2>
                    <p>Dados direto do YouTube Analytics.</p>
                  </div>
                  <div className="refCaseList">
                    {cases.map((caseStudy) => {
                      const video = findVideo(caseStudy.videoId);
                      const caseMetrics = caseStudy.metrics.map(([value, label, note]) => [
                        label === "Views" && video?.viewCount ? formatCompactViews(Number(video.viewCount)) : value,
                        label,
                        note,
                      ] as const);
                      return (
                        <article className="refCase" data-reveal key={caseStudy.videoId}>
                          <div className="refCaseTop">
                            {video ? (
                              <button className="refPreview" type="button" onClick={() => setActiveVideo(video)} aria-label={`Reproduzir: ${caseStudy.title}`}>
                                <VideoMedia video={video} />
                                <span className="refPlay"><Play fill="currentColor" /></span>
                              </button>
                            ) : <div className="refPreview refPreviewEmpty" />}
                            <div className="refCaseInfo">
                              <div><h3>{caseStudy.title}</h3><p>{caseStudy.description}</p></div>
                              {video && <a href={video.url} target="_blank" rel="noopener noreferrer" className="refCaseLink">Assistir no YouTube <ExternalLink /></a>}
                            </div>
                          </div>
                          <div className="refMetrics">
                            {caseMetrics.map(([value, label, note]) => (
                              <div className="refMetric" key={label}>
                                <strong className={metricEmphasis(value)}>{value}</strong>
                                <span>{label}</span>
                                {note && <small>{note}</small>}
                              </div>
                            ))}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="refShorts" id="videos">
                  <div className="refSlideHead" data-reveal>
                    <h2>Vídeos curtos</h2>
                    <p>Assista aos Shorts e TikToks do portfólio.</p>
                  </div>
                  {videoGallery(shorts, "TikTok", "perfShortGrid")}
                </div>
              )}
            </div>
          </section>

          <section className="refSlide">
            <div className="refSlideHead" data-reveal>
              <h2>Os principais pontos que valorizo no meu trabalho</h2>
              <p>Quando se trata do YouTube, os vídeos precisam de pontos específicos, para reter o publico.</p>
            </div>
            <ol className="refBenefits">
              {reasons.map(([title, description]) => (
                <li data-reveal key={title}><h3>{title}</h3><ArrowUpRight aria-hidden="true" /><p>{description}</p></li>
              ))}
            </ol>
          </section>

          <section className="refSlide refContact" id="contato">
            <h2>Quer números assim no seu canal?</h2>
            <p className="refContactLead">Conte sobre seu canal e o que quer melhorar: views, tempo de exibição ou inscritos.</p>
            <div className="refContactGrid">
              <a data-reveal href={`mailto:${p.email}`}><img className="refVectorIcon" src="/vectors/email-svgrepo-com.svg" alt="" aria-hidden="true" /><span><small>Email</small><strong>{p.email}</strong></span></a>
              <a data-reveal href="https://discord.com/users/luizn_" target="_blank" rel="noopener noreferrer"><img className="refVectorIcon" src="/vectors/discord-icon-svgrepo-com.svg" alt="" aria-hidden="true" /><span><small>Discord</small><strong>luizn_</strong></span></a>
            </div>
          </section>
        </main>
      </div>

      <footer className="refFooter"><div className="refContainer">luizintws · Edição de vídeo para YouTube, com resultado medido</div></footer>

      {activeVideo && (
        <div className="perfModal" role="dialog" aria-modal="true" aria-label={`Reproduzindo ${activeVideo.title}`} onClick={() => setActiveVideo(null)}>
          <button className="perfClose" onClick={() => setActiveVideo(null)} aria-label="Fechar vídeo"><X /></button>
          <div className={`perfPlayer perfPlayer-${activeVideo.platform}`} onClick={(event) => event.stopPropagation()}>
            <iframe src={`${activeVideo.embedUrl}?autoplay=1&rel=0`} title={activeVideo.title} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
          </div>
        </div>
      )}
    </div>
  );
}