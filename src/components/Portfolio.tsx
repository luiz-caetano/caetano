"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ExternalLink, Gamepad2, Instagram, Mail, MessageCircle, Play, X } from "lucide-react";
import { portfolio as p } from "@/config/portfolio";
import type { Video } from "@/lib/videos";

const cases = [
  {
    videoId: "icm9alsl8Ow",
    title: "Guia completo de progressão Fisch",
    description: "Vídeo longo de gaming · 42 dias de dados",
    metrics: [
      ["20,6K", "Views", "+3,1K acima da média do canal"],
      ["8,9%", "CTR", ""],
      ["118K", "Impressões", ""],
      ["11,5K", "Espectadores únicos", ""],
      ["719,3h", "Tempo de exibição", "+419h acima da média do canal"],
      ["+136", "Novos inscritos", ""],
    ],
  },
  {
    videoId: "q525rGMtMBo",
    title: "Melhor spot de farm de dinheiro Fisch",
    description: "Vídeo tático curto · 24 dias de dados",
    metrics: [
      ["5,4K", "Views", ""],
      ["7,5%", "CTR", ""],
      ["26,9K", "Impressões", ""],
      ["2,2K", "Espectadores únicos", ""],
      ["72,6h", "Tempo de exibição", ""],
      ["+12", "Novos inscritos", ""],
    ],
  },
];

const summaryStats = [
  ["26K+", "Views em 2 vídeos", "green"],
  ["8,9%", "CTR da melhor thumbnail", "blue"],
  ["719h", "De exibição em 1 vídeo", "yellow"],
  ["+136", "Novos inscritos em 1 vídeo", ""],
];

const reasons = [
  ["Mais cliques", "CTR de 8,9% e 7,5% nos dois vídeos. Muitos canais ficam entre 2% e 5%. Mais cliques transformam mais impressões em views."],
  ["Mais tempo de exibição", "Um único vídeo somou 719 horas de exibição, 419 a mais que a média do canal. O YouTube mostra mais os vídeos que prendem o público."],
  ["Mais inscritos", "Um único vídeo trouxe 136 novos inscritos."],
];

const services = [
  "Edição de vídeos longos no YouTube",
  "Otimização de Shorts e formato curto",
  "Cortes de Lives",
  "Ritmo focado em retenção",
  "Conteúdo de gaming e guias",
  "Análise de métricas e feedback",
];

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
          <small>{video.platform === "tiktok" ? "TIKTOK" : "YOUTUBE"}</small>
        </span>
      )}
      {thumbnail && !thumbnailFailed && (
        <img
          ref={imageRef}
          src={thumbnail}
          alt=""
          loading="lazy"
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
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updatePointerPosition = (event: PointerEvent) => {
      const bounds = header.getBoundingClientRect();
      const x = `${event.clientX - bounds.left}px`;
      const y = `${event.clientY - bounds.top}px`;
      header.style.setProperty("--pointer-x", x);
      header.style.setProperty("--pointer-y", y);
      header.style.backgroundImage = `radial-gradient(360px circle at ${x} ${y}, rgb(167 139 250 / 24%), transparent 72%)`;
    };
    const activatePointerGlow = (event: PointerEvent) => {
      header.classList.add("perfPointerActive");
      header.style.boxShadow = "0 12px 44px -28px rgb(167 139 250 / 80%)";
      updatePointerPosition(event);
    };
    const deactivatePointerGlow = () => {
      header.classList.remove("perfPointerActive");
      header.style.backgroundImage = "none";
      header.style.boxShadow = "none";
    };

    header.addEventListener("pointermove", updatePointerPosition, { passive: true });
    header.addEventListener("pointerenter", activatePointerGlow);
    header.addEventListener("pointerleave", deactivatePointerGlow);
    return () => {
      header.removeEventListener("pointermove", updatePointerPosition);
      header.removeEventListener("pointerenter", activatePointerGlow);
      header.removeEventListener("pointerleave", deactivatePointerGlow);
    };
  }, []);

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
            <small>{platform}</small>
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
      <header className="perfHeader" ref={headerRef}>
        <nav className="perfNav" aria-label="Navegação principal">
          <a className="perfLogo" href="#inicio">@luizintws</a>
          <div className="perfNavLinks">
            <a href="#resultados">Resultados</a>
            <a href="#servicos">Serviços</a>
            <a href="#contato">Contato</a>
          </div>
          <a href="#contato" className="perfButton perfButtonPrimary">Pedir orçamento</a>
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
            <span className="refBracket refTag3">[ Thumbnails ]</span>
            <span className="refBracket refTag4">[ Ritmo ]</span>
            <span className="refBracket refTag5">[ Gaming ]</span>
            <span className="refBracket refTag6">[ Guias ]</span>
            <span className="refYear">✦ &nbsp;2026</span>
            <div className="refHeroStage">
              <div className="refFrame refFrameOne"><b>8,9%</b><span>CTR da melhor thumbnail</span></div>
              <div className="refFrame refFrameTwo"><b>7,5%</b><span>CTR no vídeo curto</span></div>
              <h1>Edição que traz <em>mais views</em> para o seu canal</h1>
            </div>
            <div className="refHeroFoot">
              <div><strong>luizintws</strong><span>Edição de vídeo para YouTube</span></div>
              <div className="refHeroActions">
                <a href="#resultados" className="perfButton perfButtonPrimary">Ver os números <ArrowUpRight /></a>
                <a href="#contato" className="perfButton perfButtonOutline">Falar sobre meu canal</a>
              </div>
            </div>
          </section>

          <section className="refSlide refAbout" id="numeros">
            <div className="refAboutTop">
              <h2>luizintws</h2>
              <p><ArrowUpRight aria-hidden="true" /><span>Dados reais: mais cliques, mais tempo de exibição e mais inscritos.</span></p>
            </div>
            <div className="refStatGrid">
              {summaryStats.map(([value, label, color]) => (
                <article className="refStat" data-reveal key={label}>
                  <strong className={color ? `perfValue-${color}` : ""}>{value}</strong>
                  <span>{label}</span>
                </article>
              ))}
              <p className="refNote">Tudo medido, nada inventado.</p>
              <p className="refNote">Dados direto do YouTube Analytics.</p>
            </div>
          </section>

          <section className="refSlide" id="resultados">
            <div className="refSlideHead" data-reveal>
              <h2>Resultados de vídeos que editei</h2>
              <p>Dados direto do YouTube Analytics.</p>
            </div>
            <div className="refCaseList">
              {cases.map((caseStudy) => {
                const video = youtube.find((item) => item.embedUrl.endsWith(`/${caseStudy.videoId}`));
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
                    <div className={`refMetrics ${caseStudy.metrics.length === 6 ? "refMetricsSix" : ""}`}>
                      {caseStudy.metrics.map(([value, label, note]) => (
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
          </section>

          <section className="refSlide">
            <div className="refSlideHead" data-reveal>
              <h2>Showreel mostra estilo. Números mostram resultado.</h2>
              <p>Edição bonita é comum. Edição que ajuda o YouTube a recomendar seu vídeo é rara.</p>
            </div>
            <ol className="refBenefits">
              {reasons.map(([title, description]) => (
                <li data-reveal key={title}><h3>{title}</h3><ArrowUpRight aria-hidden="true" /><p>{description}</p></li>
              ))}
            </ol>
          </section>

          <section className="refSlide" id="servicos">
            <div className="refSlideHead" data-reveal>
              <h2>O que você recebe</h2>
              <p>Cada corte existe para prender o espectador.</p>
            </div>
            <div className="refServices">
              {[
                "Edição de vídeos longos para YouTube",
                "Edição de Shorts e vídeos curtos",
                "Thumbnail e título que geram cliques",
                "Ritmo que segura o espectador",
                "Vídeos de gaming e guias",
                "Análise de métricas e feedback para melhorar",
              ].map((service) => <div className="refService" data-reveal key={service}><ArrowUpRight aria-hidden="true" /><span>{service}</span></div>)}
            </div>
          </section>

          <section className="refSlide refShorts" id="videos">
            <div className="refSlideHead" data-reveal>
              <h2>Vídeos curtos</h2>
              <p>Assista aos Shorts e TikToks do portfólio.</p>
            </div>
            {videoGallery(shorts, "TikTok", "perfShortGrid")}
          </section>

          <section className="refSlide refContact" id="contato">
            <h2>Quer números assim no seu canal?</h2>
            <p className="refContactLead">Conte sobre seu canal e o que quer melhorar: views, CTR, retenção ou inscritos.</p>
            <div className="refContactGrid">
              <a data-reveal href={`mailto:${p.email}`}><Mail /><span><small>Email</small><strong>{p.email}</strong></span></a>
              <a data-reveal href="https://wa.me/5535999902059" target="_blank" rel="noopener noreferrer"><MessageCircle /><span><small>WhatsApp</small><strong>+55 35 99990-2059</strong></span></a>
              <a data-reveal href="https://discord.com/users/luizn_" target="_blank" rel="noopener noreferrer"><Gamepad2 /><span><small>Discord</small><strong>luizn_</strong></span></a>
              <a data-reveal href="https://instagram.com/luizintws" target="_blank" rel="noopener noreferrer"><Instagram /><span><small>Instagram</small><strong>@luizintws</strong></span></a>
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