export type Locale = "pt-BR" | "en";

const pt = {
  role: "Editor de vídeos Roblox & gaming",
  aboutCopy: "Eu edito com o mesmo critério que uso no meu próprio canal: sem enrolação, com cortes que valorizam o momento e sound design que segura a atenção. Roblox tem um ritmo e uma comunidade próprios — e eu sei conversar com os dois.",
  services: [
    ["Gameplay para YouTube", "Edições longas com ritmo e uma história clara."],
    ["TikTok & Shorts", "Cortes verticais rápidos, pensados para replay."],
    ["Conteúdo Roblox", "Edições que entendem o jogo e o público."],
    ["Highlights gamer", "Os melhores momentos, sem o filler."],
    ["Momentos engraçados", "Timing, reações e o som certo na hora certa."],
  ],
};

const en: typeof pt = {
  role: "Roblox & gaming video editor",
  aboutCopy: "I edit with the same standard I use on my own channel: no filler, cuts that elevate each moment, and sound design that holds attention. Roblox has its own rhythm and community — I know how to speak to both.",
  services: [
    ["YouTube gameplay", "Long-form edits with pace and a clear story."],
    ["TikTok & Shorts", "Fast vertical edits made for replay value."],
    ["Roblox content", "Edits that understand the game and its audience."],
    ["Gaming highlights", "The best moments, without the filler."],
    ["Funny moments", "Timing, reactions, and the right sound at the right time."],
  ],
};

export const copy = (locale: Locale) => locale === "pt-BR" ? pt : en;
