"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ExternalLink, Eye, Heart, Menu, Play, X } from "lucide-react";
import { portfolio as p } from "@/config/portfolio";
import type { Video } from "@/lib/videos";

const cases = [
  {
    videoId: "H1xkHsPXmQ8",
    title: "FARMANDO de NOOB até PRO no FISCH | #02 Brine Infused Rod, Weather Matrix e SKYCREST",
    description: "Gameplay / Fisch",
  },
  {
    videoId: "icm9alsl8Ow",
    title: "O ÚNICO GUIA QUE VOCÊ PRECISA PRA VOLTAR PRO FISCH",
    description: "Gameplay/Guia",
  },
  {
    videoId: "q525rGMtMBo",
    title: "Novo melhor spot de farm de dinheiro Fisch",
    description: "Vídeo de gameplay teórico + tutorial",
  },
  {
    videoId: "p1Z4QvuBQjM",
    title: "Farmando de Noob até o Pro no Fisch",
    description: "Vídeo de gameplay",
  },
];

const reasons = [
  ["Mais views", "Acompanhe as views dos vídeos em destaque."],
  ["Mais tempo de exibição", "Os dados de tempo de exibição mostram quais vídeos mantêm o público assistindo."],
  ["Mais inscritos", "Um único vídeo trouxe 136 novos inscritos."],
];

function translateReason(value: string, english: boolean) {
  if (!english) return value;
  const translations: Record<string, string> = {
    "Mais views": "More views", "Mais tempo de exibição": "More watch time", "Mais inscritos": "More subscribers",
    "Acompanhe as views dos vídeos em destaque.": "Track the views on featured videos.",
    "Os dados de tempo de exibição mostram quais vídeos mantêm o público assistindo.": "Watch time data shows which videos keep viewers watching.",
    "Um único vídeo trouxe 136 novos inscritos.": "A single video brought in 136 new subscribers.",
  };
  return translations[value] || value;
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

function RollingText({ text, accent = false }: { text: string; accent?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || visible) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [visible]);

  const words = text.split(" ");
  const letters = Array.from(text.replace(/ /g, ""));
  const center = (letters.length - 1) / 2;
  const order = letters.map((_, index) => index).sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
  const rank = new Map(order.map((letterIndex, position) => [letterIndex, position]));
  let letterIndex = 0;

  return (
    <span ref={ref} className={`refRollingText${visible ? " isVisible" : ""}${accent ? " isAccent" : ""}`} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span className="refRollingWord" aria-hidden="true" key={`${word}-${wordIndex}`}>
          {Array.from(word).map((letter) => {
            const currentIndex = letterIndex++;
            return <span className="refRollingLetter" style={{ "--roll-order": rank.get(currentIndex) ?? currentIndex } as React.CSSProperties} key={`${letter}-${currentIndex}`}>{letter}</span>;
          })}
        </span>
      ))}
    </span>
  );
}

function VideoStats({ video, english }: { video: Video; english: boolean }) {
  if (!video.viewCount && !video.likeCount) return null;
  const format = (value: string) => new Intl.NumberFormat(english ? "en" : "pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(Number(value));
  return (
    <div className="refVideoStats" aria-label={english ? "Video statistics" : "Estatísticas do vídeo"}>
      {video.viewCount && <span><Eye aria-hidden="true" />{format(video.viewCount)} <small>views</small></span>}
      {video.likeCount && <span><Heart aria-hidden="true" />{format(video.likeCount)} <small>{english ? "likes" : "curtidas"}</small></span>}
    </div>
  );
}

function VideoSummary({ videos, english }: { videos: Video[]; english: boolean }) {
  const totalViews = videos.reduce((sum, video) => sum + Number(video.viewCount || 0), 0);
  const totalLikes = videos.reduce((sum, video) => sum + Number(video.likeCount || 0), 0);
  const countKnownViews = videos.every((video) => video.viewCount !== undefined);
  const countKnownLikes = videos.every((video) => video.likeCount !== undefined);
  if (!videos.length || !countKnownViews || !countKnownLikes) return null;
  const format = (value: number) => new Intl.NumberFormat(english ? "en" : "pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(value);
  return (
    <div className="refVideoSummary" aria-label={english ? "Portfolio totals" : "Totais do portfólio"}>
      <div><strong>{videos.length}</strong><span>{english ? "Videos" : "Vídeos"}</span></div>
      <div><strong>{countKnownViews ? format(totalViews) : "—"}</strong><span>{english ? "Views" : "Views"}</span></div>
      <div><strong>{countKnownLikes ? format(totalLikes) : "—"}</strong><span>{english ? "Likes" : "Curtidas"}</span></div>
    </div>
  );
}

export default function Portfolio({ youtube, shorts }: { youtube: Video[]; shorts: Video[] }) {
  const [locale, setLocale] = useState<"pt-BR" | "en" | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [activeWorkView, setActiveWorkView] = useState<"long" | "short">("long");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const findVideo = (videoId: string) => youtube.find((item) => item.embedUrl.endsWith(`/${videoId}`));
  useEffect(() => {
    const savedLocale = window.sessionStorage.getItem("portfolio-locale");
    if (savedLocale === "pt-BR" || savedLocale === "en") setLocale(savedLocale);
  }, []);

  const english = locale === "en";
  const selectLocale = (value: "pt-BR" | "en") => {
    window.sessionStorage.setItem("portfolio-locale", value);
    setLocale(value);
    document.documentElement.lang = value;
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
  }, [locale]);

  if (!locale) return (
    <main className="languageGate" aria-label="Choose your language">
      <div className="languageGateCard">
        <span className="languageGateBrand">@luizintws</span>
        <h1>Choose your language</h1>
        <p>Escolha seu idioma</p>
        <div className="languageGateOptions">
          <button type="button" onClick={() => selectLocale("en")}>English <span>→</span></button>
          <button type="button" onClick={() => selectLocale("pt-BR")}>Português <span>→</span></button>
        </div>
      </div>
    </main>
  );

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
          <VideoStats video={video} english={locale === "en"} />
        </article>
      ))}
    </div>
  );

  return (
    <div id="performancePortfolio">
      <header className="perfHeader">
        <nav className="perfNav" aria-label={english ? "Main navigation" : "Navegação principal"}>
          <a className="perfLogo" href="#inicio">@luizintws</a>
          <div className={`perfNavLinks${mobileMenuOpen ? " isOpen" : ""}`}>
            <a href="#resultados" onClick={() => setMobileMenuOpen(false)}>{english ? "Results" : "Resultados"}</a>
            <a href="#numeros" onClick={() => setMobileMenuOpen(false)}>{english ? "About Me" : "Sobre mim"}</a>
            <a href="#contato" onClick={() => setMobileMenuOpen(false)}>{english ? "Contact" : "Contato"}</a>
          </div>
          <div className="perfNavActions"><div className="perfLanguageSwitch"><button type="button" onClick={() => selectLocale("en")} aria-pressed={english}>EN</button><button type="button" onClick={() => selectLocale("pt-BR")} aria-pressed={!english}>PT</button></div><a href={`mailto:${p.email}`} className="perfButton perfButtonPrimary"><img className="refVectorIcon" src="/vectors/email-svgrepo-com.svg" alt="" aria-hidden="true" />{english ? "Contact" : "Contato"}</a><button className="perfMenuButton" type="button" aria-label={mobileMenuOpen ? (english ? "Close menu" : "Fechar menu") : (english ? "Open menu" : "Abrir menu")} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}><Menu aria-hidden="true" /></button></div>
        </nav>
      </header>

      <div className="refContainer">
        <div className="refPoster" data-reveal>
          <p><span>{english ? "YouTube video editor" : "Editor de vídeo para YouTube"}</span><br />{english ? "Portfolio" : "Portfólio"}</p>
        </div>

        <main className="refMain">
          <section className="refSlide refHero" id="inicio">
            <span className="refBracket refTag1">[ {english ? "Long-form videos" : "Vídeos longos"} ]</span>
            <span className="refBracket refTag2">[ Shorts ]</span>
            <span className="refBracket refTag4">[ {english ? "Pacing" : "Ritmo"} ]</span>
            <span className="refBracket refTag5">[ Gaming ]</span>
            <span className="refBracket refTag6">[ {english ? "Guides" : "Guias"} ]</span>
            <span className="refYear">✦ &nbsp;2026</span>
            <div className="refScrollCue" aria-hidden="true"><span>{english ? "SCROLL DOWN TO SEE" : "ROLE PARA BAIXO PARA VER"}</span><i /></div>
            <div className="refHeroStage refLandingStage">
              {youtube.map((video, index) => (
                <div className={`refHeroFloat refHeroVideoPop refHeroVideoPop${index % 4}`} key={video.url} style={{ "--pop-delay": `${(index % 4) * -1.55}s` } as React.CSSProperties} aria-hidden="true">
                  <img src={video.thumbnail} alt="" />
                  <span>{video.title}</span>
                </div>
              ))}
              <div className="refHeroCenter">
                <h1>
                  <span className="refHeroRevealLine"><RollingText text={english ? "Editing that makes" : "Edição que cria"} /></span>
                  <span className="refHeroRevealLine"><RollingText text={english ? "videos" : "vídeos"} accent /></span>
                  <span className="refHeroRevealLine"><RollingText text={english ? "stand out" : "que se destacam"} /></span>
                </h1>
                <p className="refHeroLead">{english ? "YouTube videos with rhythm, personality, and care in every detail." : "Vídeos para YouTube com ritmo, personalidade e cuidado em cada detalhe."}</p>
                <div className="refHeroActions">
                  <a href="#contato" className="perfButton perfButtonPrimary">{english ? "Get in touch" : "Entre em contato"} <ArrowUpRight /></a>
                  <a href="#resultados" className="perfButton perfButtonOutline">{english ? "Explore my work" : "Ver meu trabalho"}</a>
                </div>
                <span className="refHeroNote">{english ? "Video editor / YouTube" : "Editor de vídeo / YouTube"}</span>
              </div>
            </div>

          </section>

          <section className="refSlide refAbout" id="numeros">
            <div className="refAboutIdentity">
              <img src="/images/logo_transparente.png" alt="Logo do canal luizintws" />
              <div>
                <p>{english ? "A little about me" : "Sobre mim"}</p>
                <h2>{english ? "I turn gameplay into stories." : "Transformo gameplay em histórias."}</h2>
                <span className="refAboutDescription">{english ? "I edit YouTube videos with rhythm, personality, and attention to every detail, so each moment keeps its impact." : "Edito vídeos para YouTube com ritmo, personalidade e atenção a cada detalhe, para cada momento ter impacto."}</span>
              </div>
            </div>
          </section>

          <section className="refSlide" id="resultados">
            <aside className="refWorkIndex" aria-label="Work categories" data-active={activeWorkView}>
              <span className="refWorkDots" aria-hidden="true"><i /><i /><i /></span>
              <button type="button" aria-pressed={activeWorkView === "long"} onClick={() => setActiveWorkView("long")}><b>01</b><span>{english ? "YouTube long-form" : "Vídeos longos no YouTube"}</span></button>
              <button type="button" aria-pressed={activeWorkView === "short"} onClick={() => setActiveWorkView("short")}><b>02</b><span>{english ? "Short videos" : "Vídeos curtos"}</span></button>
            </aside>
            <div className={`refWorkContent ${activeWorkView === "short" ? "refWorkSlideReverse" : ""}`} key={activeWorkView}>
              {activeWorkView === "long" ? (
                <>
                  <div className="refSlideHead" data-reveal>
                    <h2>{english ? "Results from videos I edited" : "Resultados de vídeos que editei"}</h2>
                    <p>{english ? "Views and likes, updated from YouTube." : "Views e curtidas atualizadas pelo YouTube."}</p>
                  </div>
                  <VideoSummary videos={youtube} english={english} />
                  <div className="refCaseList refGalleryGrid">
                    {cases.map((caseStudy) => {
                      const video = findVideo(caseStudy.videoId);
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
                              <div><h3>{english ? ({"O ÚNICO GUIA QUE VOCÊ PRECISA PRA VOLTAR PRO FISCH":"THE ONLY GUIDE YOU NEED TO GET BACK INTO FISCH", "Novo melhor spot de farm de dinheiro Fisch":"The new best money farming spot in Fisch", "Farmando de Noob até o Pro no Fisch":"Going from Noob to Pro in Fisch"}[caseStudy.title] || caseStudy.title) : caseStudy.title}</h3><p>{(english ? ({"Gameplay/Guia":"Gameplay / Guide", "Vídeo de gameplay teórico + tutorial":"Gameplay theory + tutorial", "Vídeo de gameplay":"Gameplay"}[caseStudy.description] || caseStudy.description) : caseStudy.description)}</p></div>
                              {video && <VideoStats video={video} english={english} />}
                              {video && <a href={video.url} target="_blank" rel="noopener noreferrer" className="refCaseLink">{english ? "Watch on YouTube" : "Assistir no YouTube"} <ExternalLink /></a>}
                            </div>
                          </div>

                        </article>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="refShorts" id="videos">
                  <div className="refSlideHead" data-reveal>
                    <h2>{english ? "Short videos" : "Vídeos curtos"}</h2>
                    <p>{english ? "Watch the portfolio's Shorts and TikToks." : "Assista aos Shorts e TikToks do portfólio."}</p>
                  </div>
                  {videoGallery(shorts, "TikTok", "perfShortGrid")}
                </div>
              )}
            </div>
          </section>

          <section className="refSlide">
            <div className="refSlideHead" data-reveal>
              <h2>{english ? "What I value most in my work" : "Os principais pontos que valorizo no meu trabalho"}</h2>
              <p>{english ? "YouTube videos need specific elements to keep viewers watching." : "Quando se trata do YouTube, os vídeos precisam de pontos específicos, para reter o publico."}</p>
            </div>
            <ol className="refBenefits">
              {reasons.map(([title, description]) => (
                <li data-reveal key={title}><h3>{translateReason(title, english)}</h3><ArrowUpRight aria-hidden="true" /><p>{translateReason(description, english)}</p></li>
              ))}
            </ol>
          </section>

          <section className="refSlide refContact" id="contato">
            <h2>{english ? "Want results like these for your channel?" : "Quer números assim no seu canal?"}</h2>
            <p className="refContactLead">{english ? "Tell me about your channel and what you want to improve: views, watch time, or subscribers." : "Conte sobre seu canal e o que quer melhorar: views, tempo de exibição ou inscritos."}</p>
            <div className="refContactGrid">
              <a data-reveal href={`mailto:${p.email}`}><img className="refVectorIcon" src="/vectors/email-svgrepo-com.svg" alt="" aria-hidden="true" /><span><small>Email</small><strong>{p.email}</strong></span></a>
              <a data-reveal href="https://discord.com/users/luizn_" target="_blank" rel="noopener noreferrer"><img className="refVectorIcon" src="/vectors/discord-icon-svgrepo-com.svg" alt="" aria-hidden="true" /><span><small>Discord</small><strong>luizn_</strong></span></a>
            </div>
          </section>
        </main>
      </div>

      <footer className="refFooter"><div className="refContainer">luizintws · {english ? "YouTube video editing, with measurable results" : "Edição de vídeo para YouTube, com resultado medido"}</div></footer>

      {activeVideo && (
        <div className="perfModal" role="dialog" aria-modal="true" aria-label={`Reproduzindo ${activeVideo.title}`} onClick={() => setActiveVideo(null)}>
          <button className="perfClose" onClick={() => setActiveVideo(null)} aria-label={english ? "Close video" : "Fechar vídeo"}><X /></button>
          <div className={`perfPlayer perfPlayer-${activeVideo.platform}`} onClick={(event) => event.stopPropagation()}>
            <iframe src={`${activeVideo.embedUrl}?autoplay=1&rel=0`} title={activeVideo.title} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
          </div>
        </div>
      )}
    </div>
  );
}
