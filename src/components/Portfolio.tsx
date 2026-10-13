import { ArrowUpRight } from "lucide-react";
import { portfolio as p } from "@/config/portfolio";
import type { Video } from "@/lib/videos";

export default function Portfolio({ youtube, shorts }: { youtube: Video[]; shorts: Video[] }) {
  const videoGrid = (videos: Video[], isShort = false) => <div className={`simpleVideoGrid${isShort ? " simpleShortGrid" : ""}`}>
    {videos.map((video) => <a className="simpleVideoCard" key={video.url} href={video.url} target="_blank" rel="noopener noreferrer">
      <div className="simpleThumbnail">{video.thumbnail && <img src={video.thumbnail} alt="" loading="lazy" />}<span><ArrowUpRight size={17} /></span></div>
      <h3>{video.title}</h3>
    </a>)}
  </div>;

  return (
    <div className="simplePortfolio">
      <header className="simpleHeader">
          <a className="simpleBrand" href="#inicio" aria-label="Luiz Caetano, início"><img src="/images/logo_transparente.png" alt="Luiz Caetano" /></a>
        <nav aria-label="Navegação principal">
          <a href="#sobre">Sobre</a><a href="#ferramentas">Ferramentas</a><a href="#longos">Vídeos longos</a><a href="#curtos">Vídeos curtos</a>
        </nav>
        <a className="simpleContactLink" href={`mailto:${p.email}`}>Vamos conversar <ArrowUpRight size={16} /></a>
      </header>

      <main className="simpleMain" id="inicio">
        <section className="simpleIntro" id="sobre">
          <div className="simpleIntroCopy">
            <span className="simpleEyebrow">Editor de vídeo · Roblox & Games</span>
            <h1>Mais views para o seu canal!</h1>
            <p>Eu edito seus gameplays focando em aumentar o WATCHTIME, usando minha exp com o público de Roblox, ritmo e sound design, para vídeos longos, Shorts e TikTok.
            </p>
            <a className="simpleButton" href="#trabalho">Conheça meu trabalho <ArrowUpRight size={17} /></a>
          </div>
          <div className="simpleLogoFrame"><img src="/images/logo_transparente.png" alt="Logo de Luiz Caetano" /></div>
        </section>

        <section className="simpleSection simpleTools" id="ferramentas">
          <div className="simpleSectionHeading"><span className="simpleEyebrow">Como trabalho</span><h2>Ferramentas & habilidades</h2></div>
          <div className="simpleToolGrid">
            {p.tools.map(([name, detail]) => <article className="simpleCard" key={name}>
              <img className="simpleToolIcon" src={name === "Adobe Premiere Pro" ? "/images/premiere.png" : "/images/davincii.png"} alt="" />
              <div><h3>{name}</h3><p>{detail}</p></div>
            </article>)}
          </div>
        </section>

        <section className="simpleSection" id="longos">
          <div className="simpleSectionHeading"><span className="simpleEyebrow">Portfólio</span><h2>Vídeos longos</h2><p>Edições para YouTube.</p></div>
          {videoGrid(youtube)}
        </section>

        <section className="simpleSection" id="curtos">
          <div className="simpleSectionHeading"><span className="simpleEyebrow">Portfólio</span><h2>Vídeos curtos</h2><p>Shorts e vídeos verticais.</p></div>
          {videoGrid(shorts, true)}
        </section>

        <section className="simpleContact" id="contato"><div><span className="simpleEyebrow">Tem um projeto?</span><h2>Vamos fazer seu próximo vídeo.</h2></div><a className="simpleButton" href={`mailto:${p.email}`}>{p.email}<ArrowUpRight size={17} /></a></section>
      </main>
      <footer className="simpleFooter"><span>Luiz Caetano · Editor de vídeo</span><a href={p.social.youtube} target="_blank" rel="noopener noreferrer">YouTube <ArrowUpRight size={13} /></a><a href={p.social.tiktok} target="_blank" rel="noopener noreferrer">TikTok <ArrowUpRight size={13} /></a></footer>
    </div>
  );
}
