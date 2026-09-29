/* ============================================================
   i18n.js — tradução automática por geolocalização de IP.
   Visitantes fora do Brasil veem o site em inglês; visitantes
   no Brasil (ou se a detecção falhar) veem o português normal.
   Carregar ANTES de site.js em toda página pública (não usar
   em /instasim/, que é uma ferramenta interna só em PT-BR).
   ============================================================ */
(function(){
  const CACHE_KEY = 'lc_lang';
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

  const T = {
    /* -------- comum (nav / menu mobile / footer) -------- */
    'common.nav.home': 'Home',
    'common.nav.about': 'About',
    'common.nav.projects': 'Projects',
    'common.nav.socialmedia': 'Social Media',
    'common.nav.method': 'Method',
    'common.nav.contact': 'Contact',
    'common.nav.openMenu': 'Open menu',
    'common.nav.closeMenu': 'Close menu',
    'common.nav.whatsappCta': 'Chat on WhatsApp',
    'common.footer.heading': 'Let’s create something<br>that grabs attention?',
    'common.footer.whatsapp': 'Chat on WhatsApp',
    'common.footer.navLabel': 'Navigation',
    'common.footer.contactLabel': 'Contact',
    'common.footer.baseLabel': 'Location',
    'common.footer.baseValue': 'Varginha, Brazil',
    'common.cta.whatsappArrow': 'Chat on WhatsApp →',

    /* -------- home -------- */
    'home.eyebrow': 'Portfolio — Luiz Caetano',
    'home.h1': 'Design & websites<br>that truly<br>sell.',
    'home.lede': 'Visual identity and websites built to attract clients and generate real results — not just to look pretty. Hover over a project below to see the preview.',
    'home.cta.socialmedia': 'See social media',
    'home.proj.aj.subtitle': 'Corporate website — coffee export',
    'home.proj.np.subtitle': 'Identity & landing page — fintech',
    'home.proj.tw.subtitle': 'Website & UI — VRChat world',

    /* -------- sobre / about -------- */
    'about.eyebrow': 'About',
    'about.h1': 'About me',
    'about.fact.base.label': 'Location',
    'about.fact.base.value': 'Minas Gerais, Brazil',
    'about.fact.avail.label': 'Availability',
    'about.fact.avail.value': 'Full-time',
    'about.fact.deliver.label': 'Services',
    'about.fact.deliver.value': 'Design & Web',
    'about.lead.p1': 'I’m Luiz Caetano — a freelance designer working with websites and social media management. I work toward one simple goal: making your brand sell more. I don’t just deliver a pretty graphic or a flashy website. I deliver visual identity, a website and a social media presence built to attract clients, build trust and generate real returns for your business.',
    'about.lead.p2': 'I handle everything that shapes your image online: from visual identity to your website, from content planning to day-to-day posting. You focus on your business — I make sure it looks (and is) more professional, more visible and more profitable.',
    'about.lead.p3': 'Every project starts by understanding your audience and what has or hasn’t worked for you so far. A pretty design without strategy doesn’t sell anything. Here, both go hand in hand.',
    'about.tag.identity': 'Identity Design',
    'about.tag.website': 'Corporate Website',
    'about.tag.socialmedia': 'Social Media',
    'about.tag.landing': 'Landing Pages',
    'about.tag.video': 'Video Editing',
    'about.tag.marketing': 'Marketing',

    /* -------- contato / contact -------- */
    'contact.eyebrow': '05 — Contact',
    'contact.h1': 'Let’s talk<br>about your project?',
    'contact.box.p': 'Visual identity and website design, with fast AI-assisted development. Quick turnaround and no-obligation quotes.',
    'contact.cta': 'Message on WhatsApp →',

    /* -------- comum entre páginas de projeto -------- */
    'proj.next.label': 'Next',
    'proj.seemore.label': 'See more',

    /* -------- ajcoffe -------- */
    'ajcoffe.eyebrow': 'Case study — 01',
    'ajcoffe.tag.website': 'Corporate website',
    'ajcoffe.tag.export': 'Coffee export',
    'ajcoffe.meta.sector.label': 'Industry',
    'ajcoffe.meta.sector.value': 'Coffee import/export,<br>customs & logistics',
    'ajcoffe.meta.deliver.label': 'Deliverables',
    'ajcoffe.meta.deliver.value': 'Visual identity + website',
    'ajcoffe.direction.h': 'Direction',
    'ajcoffe.direction.p': 'An earthy palette (olive green, coffee brown and cream) speaks directly to the product’s origin without falling into a cute “coffee shop” cliché. Firm typography, with cream highlights on a dark background, gives it institutional weight suited to international B2B buyers.',
    'ajcoffe.solution.h': 'Solution',
    'ajcoffe.solution.p': 'The homepage leads with a harvest image, reinforcing traceability and origin — two pillars green-coffee buyers care about. Lean navigation designed for the quick decisions of visitors who already arrive looking for a supplier.',
    'ajcoffe.cta': 'I want a site like this →',

    /* -------- novapay -------- */
    'novapay.eyebrow': 'Case study — 02',
    'novapay.tag.identity': 'Digital identity',
    'novapay.meta.sector.label': 'Industry',
    'novapay.meta.sector.value': 'Fintech / international<br>payments',
    'novapay.meta.deliver.label': 'Deliverables',
    'novapay.meta.deliver.value': 'Landing page + identity',
    'novapay.direction.h': 'Direction',
    'novapay.direction.p': 'A black background with a fluid purple/violet gradient conveys the movement of money without falling back on fintech’s overused corporate blue. The line “Your money. No borders, no surprises.” sums up the whole proposition in one sentence.',
    'novapay.solution.h': 'Solution',
    'novapay.solution.p': 'A straight-to-the-point hero: headline, a single call-to-action button, and social proof right below with logos the audience already recognizes, building trust before the user even scrolls.',
    'novapay.cta': 'I want a landing page like this →',

    /* -------- 12twilights -------- */
    'twilights.eyebrow': 'Case study — 03',
    'twilights.tag.community': 'Community website',
    'twilights.tag.ui': 'Cyberpunk UI',
    'twilights.meta.sector.label': 'Industry',
    'twilights.meta.sector.value': 'Gaming / virtual world<br>VRChat',
    'twilights.meta.deliver.label': 'Deliverables',
    'twilights.meta.deliver.value': 'Website + mobile UI',
    'twilights.direction.h': 'Direction',
    'twilights.direction.p': 'A cyberpunk aesthetic faithful to the VRChat world: absolute black background, condensed uppercase type and cyan/magenta contrast echoing the map’s neon setting. The UI exists to reinforce immersion, not compete with it.',
    'twilights.solution.h': 'Solution',
    'twilights.solution.p': 'A mobile version conceived as an extension of the world itself — vertical layout with a prominent subscription CTA and a grid news section that organizes map updates like a feed, familiar to anyone who already uses social media.',
    'twilights.next.gallery': 'Social media gallery →',
    'twilights.cta': 'I want a project like this →',

    /* -------- social media -------- */
    'socialmedia.lede': 'A selection of designs and posts made for clients and personal projects.',

    /* -------- método -------- */
    'metodo.meta.title': 'Digital Presence Method — Luiz Caetano',
    'metodo.meta.description': 'You’re not expensive. You’re invisible. The Digital Presence Method builds the positioning that gets the right client to pay what you ask.',
    'metodo.nav.pillars': 'The method',
    'metodo.nav.investment': 'Investment',
    'metodo.nav.faq': 'FAQ',
    'metodo.nav.applyCta': 'Apply for a spot',
    'metodo.hero.eyebrow': 'Digital Presence Method',
    'metodo.hero.h1': 'You’re not expensive. You’re <span class="lime">invisible.</span>',
    'metodo.hero.sub': 'The Digital Presence Method builds the positioning that gets the right client to pay what you ask — without putting you in the comparison line with the cheapest freelancer on Instagram.',
    'metodo.hero.cta1': 'I want to stop being invisible',
    'metodo.hero.cta2': 'See the investment',
    'metodo.hero.note': 'Spots limited per month. The method is applied, not just delivered.',
    'metodo.pain.eyebrow': 'The real problem',
    'metodo.pain.h2': 'You don’t have a pricing problem. You have a perception problem.',
    'metodo.pain.lead': 'Nobody is born knowing what your work is worth. People decide that by looking at your brand, before they ever talk to you.',
    'metodo.pain1.h': 'You compete on price because no one sees a difference',
    'metodo.pain1.p': 'When a brand doesn’t communicate authority, the only thing left for the client to compare is how much it costs.',
    'metodo.pain2.h': 'Your content doesn’t support the price you want to charge',
    'metodo.pain2.p': 'Posting pretty pictures isn’t the same as looking expensive. Without strategy behind it, a post doesn’t convince anyone to pay more.',
    'metodo.pain3.h': 'Without consistency, there’s no trust',
    'metodo.pain3.p': 'A brand that disappears from the feed is a brand the client forgets. A discount is all that’s left for them to remember you by.',
    'metodo.fear.eyebrow': 'The price you’re not seeing',
    'metodo.fear.h2': 'Without positioning, your price only knows how to do one thing: go down.',
    'metodo.fear.p1': 'Picture yourself three years from now. Same work, same dedication, and the client still asks if there’s a discount before asking what’s included.',
    'metodo.fear.p2': 'You say yes again. Because you know that if you refuse, they’ll go with whoever charges R$200 less and delivers a worse post.',
    'metodo.fear.p3': 'That’s the cost of never solving the problem that makes clients compare you to anyone: your brand doesn’t explain why you cost what you cost.',
    'metodo.fear.p4': 'Meanwhile, someone with less experience than you charges double. They have clear positioning, and the client asks when they can start — not how much it costs.',
    'metodo.fear.p5': 'The difference between the two of you is a decision. They decided, before selling anything, who they are and who they speak to. You haven’t decided yet.',
    'metodo.fear.p6': 'Every discount you give to close a client becomes the next one’s expectation. Your list price becomes just a starting point for negotiation — with that client, and with whoever they refer next.',
    'metodo.fear.p7strong': 'Without changing this, five years from now you’ll charge almost the same as you do today. Just more exhausted.',
    'metodo.fear.transition': 'That’s exactly what the method’s 3 pillars solve, before the price conversation even happens.',
    'metodo.pillars.eyebrow': 'The method',
    'metodo.pillars.h2': 'The 3 pillars of the Digital Presence Method',
    'metodo.pillars.lead': 'They’re not three separate deliverables. It’s a sequence: each pillar exists to support the next.',
    'metodo.pillar1.label': 'Pillar 01',
    'metodo.pillar1.h': 'Brand Foundation',
    'metodo.pillar1.p': 'This is what makes someone see your price as fair before they even talk to you. Brand diagnosis and a complete visual system: palette, typography and templates, so your business is recognized in under 2 seconds of scrolling.',
    'metodo.pillar2.label': 'Pillar 02',
    'metodo.pillar2.h': 'Strategic Content Arsenal',
    'metodo.pillar2.p': 'Content that showcases authority, not just aesthetics. The 20 pieces are organized by function, and each one exists to justify what you charge — not just to fill the feed.',
    'metodo.pillar3.label': 'Pillar 03',
    'metodo.pillar3.h': 'Guided Publishing Plan',
    'metodo.pillar3.p': 'Consistency turns “I’ve seen this brand before” into “this brand is a reference” — and references don’t give discounts. Each piece ships with a day and time set by funnel logic, not a generic calendar.',
    'metodo.process.eyebrow': 'How it works',
    'metodo.process.h2': 'From the first conversation to publishing',
    'metodo.step1.h': 'Diagnosis',
    'metodo.step1.p': 'We understand your business, audience and competitors before designing anything.',
    'metodo.step2.h': 'Visual foundation',
    'metodo.step2.p': 'We build the brand system that supports everything else.',
    'metodo.step3.h': 'Arsenal production',
    'metodo.step3.p': 'The 20 pieces of content are created already organized by function within the funnel.',
    'metodo.step4.h': 'Guided delivery',
    'metodo.step4.p': 'You receive the ready calendar, with date, time and the reasoning behind each choice.',
    'metodo.offer.eyebrow': 'The investment',
    'metodo.offer.h2': 'All of this is included when you apply the method',
    'metodo.offer.lead': 'Each item below has its own market value. Add it all up, and that’s what you get for one single, fixed price.',
    'metodo.offer.badge': 'Complete method',
    'metodo.offer.item1.label': 'Brand diagnosis',
    'metodo.offer.item1.val': 'R$ 347.00',
    'metodo.offer.item2.label': 'Complete visual identity',
    'metodo.offer.item2.val': 'R$ 1,247.90',
    'metodo.offer.item3.label': 'Landing page / corporate site',
    'metodo.offer.item3.val': 'R$ 997.00',
    'metodo.offer.item4.label': '20 strategic content pieces organized by function',
    'metodo.offer.item4.val': 'R$ 687.90',
    'metodo.offer.item5.label': 'Guided editorial calendar, with day and time',
    'metodo.offer.item5.val': 'R$ 300.00',
    'metodo.offer.total.label': 'Total value',
    'metodo.offer.total.val': 'R$ 3,579.80',
    'metodo.offer.quote': '“What you’re getting here isn’t just a pretty page. It’s permission to charge what you already know you deserve.”',
    'metodo.offer.was': 'From R$ 3,579.80',
    'metodo.offer.now': 'R$ 1,497.65',
    'metodo.offer.installments': 'or 3x of R$ 549.22 by card',
    'metodo.offer.cta': 'Apply for a spot',
    'metodo.upsell.h': 'Motion Module',
    'metodo.upsell.p': 'Static content sells. Video content retains. Turn pieces from your arsenal into edited videos: cuts, captions and pacing ready for Reels and Stories.',
    'metodo.upsell.pricenote': 'additional to the method. 8 edited videos made from your arsenal',
    'metodo.guarantee.days': 'Days',
    'metodo.guarantee.h2': 'Risk-free application',
    'metodo.guarantee.p': 'If, after the Brand Foundation is delivered, you feel the method isn’t right for your business, we refund the amount invested in that stage. No red tape.',
    'metodo.faq.eyebrow': 'Frequently asked questions',
    'metodo.faq.h2': 'Still have questions?',
    'metodo.faq1.q': 'Does this replace a social media agency?',
    'metodo.faq1.a': 'It replaces the foundation and initial strategy part. Daily posting and ongoing management can be arranged separately, if you’re interested.',
    'metodo.faq2.q': 'How long until I receive everything?',
    'metodo.faq2.a': 'The timeline is set during the diagnosis, usually between 10 and 15 business days for the complete package.',
    'metodo.faq3.q': 'Does it work for any niche?',
    'metodo.faq3.a': 'The method adapts to the segment, but works best for businesses that already have a defined audience.',
    'metodo.faq4.q': 'Can I add the Motion Module later?',
    'metodo.faq4.a': 'Yes, but the promotional price of R$ 697 is only valid for those who purchase it together with the method.',
    'metodo.final.eyebrow': 'Spots per month are limited',
    'metodo.final.h2': 'You don’t need to charge less. You need to stop being invisible.',
    'metodo.footer.tagline': 'Digital Presence Method. Positioning that supports the price you charge.',
    'metodo.float.subscribe': 'Sign up',
    'metodo.modal.close': 'Close',
    'metodo.modal.eyebrow': 'Application',
    'metodo.modal.h2': 'Let’s see if the method makes sense for you',
    'metodo.modal.lead': 'Answer in under 1 minute. It saves us both from conversations that go nowhere.',
    'metodo.form.name.label': 'Name and business',
    'metodo.form.name.placeholder': 'Your name and your business name',
    'metodo.form.insta.label': 'Current Instagram',
    'metodo.form.insta.placeholder': '@yourprofile',
    'metodo.form.whats.label': 'WhatsApp for contact',
    'metodo.form.invest.label': 'Monthly marketing investment',
    'metodo.form.invest.opt0': 'Select',
    'metodo.form.invest.opt1': 'I don’t invest yet',
    'metodo.form.invest.opt2': 'Up to R$ 500',
    'metodo.form.invest.opt3': 'R$ 500 to R$ 1,500',
    'metodo.form.invest.opt4': 'R$ 1,500 to R$ 3,000',
    'metodo.form.invest.opt5': 'More than R$ 3,000',
    'metodo.form.prazo.label': 'Timeline to start',
    'metodo.form.prazo.opt0': 'Select',
    'metodo.form.prazo.opt1': 'I want to start now',
    'metodo.form.prazo.opt2': 'In the next 2 weeks',
    'metodo.form.prazo.opt3': 'This month',
    'metodo.form.prazo.opt4': 'Just researching for now',
    'metodo.form.dor.label': 'Biggest challenge today',
    'metodo.form.dor.placeholder': 'What’s holding you back most in your digital presence today?',
    'metodo.form.submit': 'Submit application'
  };

  function applyEnglish(){
    document.documentElement.lang = 'en';

    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(T[key] !== undefined) el.innerHTML = T[key];
    });

    ['placeholder','aria-label','content'].forEach(attr=>{
      document.querySelectorAll('[data-i18n-'+attr+']').forEach(el=>{
        const key = el.getAttribute('data-i18n-'+attr);
        if(T[key] !== undefined) el.setAttribute(attr, T[key]);
      });
    });
  }

  function getCache(){
    try{
      const raw = localStorage.getItem(CACHE_KEY);
      if(!raw) return null;
      const data = JSON.parse(raw);
      if(!data || (Date.now() - data.ts) > CACHE_TTL) return null;
      return data.lang;
    }catch(e){ return null; }
  }

  function setCache(lang){
    try{ localStorage.setItem(CACHE_KEY, JSON.stringify({ lang, ts: Date.now() })); }catch(e){}
  }

  function init(){
    const cached = getCache();
    if(cached === 'en'){ applyEnglish(); return; }
    if(cached === 'pt') return;

    fetch('https://ipapi.co/json/', { cache: 'no-store' })
      .then(r=>r.json())
      .then(data=>{
        const country = data && data.country_code;
        if(country && country !== 'BR'){
          setCache('en');
          applyEnglish();
        } else if(country){
          setCache('pt');
        }
      })
      .catch(()=>{ /* geolocalização indisponível — mantém português */ });
  }

  init();
})();
