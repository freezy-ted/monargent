import { useEffect, useRef, useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');`;

const css = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg:#060606; --surface:#0f0f0f; --surface2:#141414; --border:#1e1e1e;
  --green:#00ff87; --green-dim:rgba(0,255,135,0.06); --green-glow:rgba(0,255,135,0.15);
  --red:#ff4757; --blue:#00d4ff; --orange:#ff9f43;
  --text:#f0f0f0; --muted:#555; --muted2:#888;
}
html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
body::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:999; opacity:.025;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:180px; }

nav { position:fixed; top:0; left:0; right:0; z-index:100; padding:16px 24px; display:flex; align-items:center; justify-content:space-between; transition:all .3s; }
nav.scrolled { background:rgba(6,6,6,.92); backdrop-filter:blur(12px); border-bottom:1px solid var(--border); }
.nav-logo { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:.05em; }
.nav-logo span { color:var(--green); }
.nav-cta { background:var(--green); color:#000; border:none; border-radius:6px; padding:9px 20px; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:700; cursor:pointer; letter-spacing:.05em; transition:opacity .2s; }
.nav-cta:hover { opacity:.85; }

.hero { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:120px 24px 80px; position:relative; overflow:hidden; }
.hero-orb { position:absolute; width:700px; height:700px; border-radius:50%; background:radial-gradient(circle,rgba(0,255,135,.07) 0%,transparent 65%); top:50%; left:50%; transform:translate(-50%,-55%); pointer-events:none; }
.hero-orb2 { position:absolute; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle,rgba(0,212,255,.04) 0%,transparent 65%); bottom:10%; right:-100px; pointer-events:none; }
.hero-eyebrow { font-size:11px; letter-spacing:.25em; text-transform:uppercase; color:var(--green); margin-bottom:20px; opacity:0; animation:fadeUp .6s ease .2s forwards; }
.hero-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(52px,10vw,110px); line-height:.95; letter-spacing:.02em; margin-bottom:24px; opacity:0; animation:fadeUp .6s ease .35s forwards; }
.hero-title .l2 { color:var(--green); } .hero-title .l3 { color:var(--muted2); }
.hero-sub { font-size:clamp(14px,2vw,18px); color:var(--muted2); max-width:520px; line-height:1.7; margin-bottom:40px; font-weight:300; opacity:0; animation:fadeUp .6s ease .5s forwards; }
.hero-sub strong { color:var(--text); font-weight:500; }
.hero-btns { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; opacity:0; animation:fadeUp .6s ease .65s forwards; }
.btn-primary { background:var(--green); color:#000; border:none; border-radius:8px; padding:15px 32px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:all .2s; letter-spacing:.04em; }
.btn-primary:hover { transform:translateY(-2px); box-shadow:0 12px 30px rgba(0,255,135,.25); }
.btn-ghost { background:transparent; color:var(--muted2); border:1px solid var(--border); border-radius:8px; padding:15px 28px; font-family:'DM Sans',sans-serif; font-size:14px; cursor:pointer; transition:all .2s; text-decoration:none; display:inline-block; }
.btn-ghost:hover { border-color:var(--green); color:var(--green); }
.hero-scroll { position:absolute; bottom:32px; left:50%; transform:translateX(-50%); font-size:11px; letter-spacing:.2em; color:var(--muted); text-transform:uppercase; opacity:0; animation:fadeUp .6s ease .9s forwards; }
.hero-scroll::after { content:''; display:block; width:1px; height:40px; background:var(--border); margin:10px auto 0; }
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

.ticker { border-top:1px solid var(--border); border-bottom:1px solid var(--border); padding:14px 0; overflow:hidden; background:var(--surface); }
.ticker-track { display:flex; gap:60px; animation:ticker 22s linear infinite; white-space:nowrap; }
.ticker-item { font-family:'Bebas Neue',sans-serif; font-size:14px; letter-spacing:.08em; color:var(--muted); display:flex; align-items:center; gap:10px; flex-shrink:0; }
.ticker-item .up { color:var(--green); } .ticker-item .down { color:var(--red); }
@keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }

.section { padding:100px 24px; max-width:1100px; margin:0 auto; }
.section-label { font-size:11px; letter-spacing:.25em; text-transform:uppercase; color:var(--green); margin-bottom:16px; }
.section-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(36px,6vw,72px); line-height:1; letter-spacing:.02em; margin-bottom:20px; }
.section-sub { font-size:15px; color:var(--muted2); max-width:500px; line-height:1.7; font-weight:300; margin-bottom:60px; }

.stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:2px; border:1px solid var(--border); border-radius:12px; overflow:hidden; }
.stat-box { background:var(--surface); padding:36px 28px; position:relative; overflow:hidden; }
.stat-box::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--green); transform:scaleX(0); transform-origin:left; transition:transform .5s ease; }
.stat-box.visible::before { transform:scaleX(1); }
.stat-number { font-family:'Bebas Neue',sans-serif; font-size:52px; letter-spacing:.02em; line-height:1; margin-bottom:8px; }
.stat-desc { font-size:13px; color:var(--muted2); line-height:1.5; }
.stat-desc strong { color:var(--text); }

.problem { padding:100px 24px; background:var(--surface); border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
.problem-inner { max-width:1100px; margin:0 auto; }
.problem-grid { display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center; }
.problem-list { display:flex; flex-direction:column; gap:20px; }
.problem-item { display:flex; gap:16px; align-items:flex-start; padding:20px; background:var(--surface2); border:1px solid var(--border); border-radius:10px; transition:border-color .3s; }
.problem-item:hover { border-color:var(--red); }
.pi-icon { font-size:22px; flex-shrink:0; margin-top:2px; }
.pi-title { font-size:14px; font-weight:600; color:var(--text); margin-bottom:4px; }
.pi-desc { font-size:12px; color:var(--muted2); line-height:1.5; }
.problem-statement { font-family:'Bebas Neue',sans-serif; font-size:clamp(32px,5vw,60px); line-height:1.05; letter-spacing:.02em; }
.problem-statement .accent { color:var(--red); } .problem-statement .green { color:var(--green); }

.features-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:16px; }
.feature-card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:28px; transition:all .25s; }
.feature-card:hover { border-color:var(--green); transform:translateY(-4px); box-shadow:0 20px 40px rgba(0,0,0,.4); }
.fc-icon { font-size:28px; margin-bottom:16px; }
.fc-title { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:.03em; margin-bottom:8px; }
.fc-desc { font-size:13px; color:var(--muted2); line-height:1.6; }
.fc-tag { display:inline-block; margin-top:14px; font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:var(--green); border:1px solid rgba(0,255,135,.25); border-radius:4px; padding:3px 8px; }

.sim-preview { padding:100px 24px; max-width:1100px; margin:0 auto; }
.sim-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:40px; position:relative; overflow:hidden; }
.sim-card::before { content:''; position:absolute; top:-100px; right:-100px; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle,rgba(0,255,135,.05) 0%,transparent 60%); pointer-events:none; }
.sim-numbers { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; margin-top:32px; }
.sim-num-item { text-align:center; }
.sim-num { font-family:'Bebas Neue',sans-serif; font-size:42px; letter-spacing:.03em; color:var(--green); }
.sim-num-label { font-size:11px; color:var(--muted2); margin-top:4px; }

.pricing { padding:100px 24px; max-width:900px; margin:0 auto; text-align:center; }
.pricing-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:48px; max-width:640px; margin-left:auto; margin-right:auto; }
.price-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:32px; text-align:left; position:relative; }
.price-card.featured { border-color:var(--green); }
.price-badge { position:absolute; top:-12px; left:50%; transform:translateX(-50%); background:var(--green); color:#000; font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:4px 14px; border-radius:20px; }
.price-name { font-size:12px; letter-spacing:.15em; text-transform:uppercase; color:var(--muted2); margin-bottom:12px; }
.price-amount { font-family:'Bebas Neue',sans-serif; font-size:52px; letter-spacing:.02em; line-height:1; margin-bottom:4px; }
.price-period { font-size:12px; color:var(--muted2); margin-bottom:24px; }
.price-features { display:flex; flex-direction:column; gap:10px; margin-bottom:28px; }
.pf-item { display:flex; gap:10px; font-size:13px; color:var(--muted2); align-items:flex-start; }
.pf-item .dot { color:var(--green); flex-shrink:0; margin-top:2px; }
.pf-item.dim .dot { color:var(--muted); } .pf-item.dim { color:var(--muted); }
.btn-plan { width:100%; padding:13px; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:all .2s; letter-spacing:.04em; }
.btn-plan.free { background:transparent; border:1px solid var(--border); color:var(--muted2); }
.btn-plan.free:hover { border-color:var(--green); color:var(--green); }
.btn-plan.pro { background:var(--green); border:none; color:#000; }
.btn-plan.pro:hover { opacity:.85; }

.footer-cta { padding:100px 24px; text-align:center; position:relative; overflow:hidden; border-top:1px solid var(--border); }
.footer-cta::before { content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:600px; height:600px; border-radius:50%; background:radial-gradient(circle,rgba(0,255,135,.06) 0%,transparent 60%); pointer-events:none; }
.fcta-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(40px,7vw,90px); line-height:.95; letter-spacing:.02em; margin-bottom:20px; position:relative; }
.fcta-title span { color:var(--green); }
.fcta-sub { font-size:15px; color:var(--muted2); margin-bottom:36px; font-weight:300; position:relative; }

footer { border-top:1px solid var(--border); padding:32px 24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; max-width:1100px; margin:0 auto; }
.footer-logo { font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:.05em; }
.footer-logo span { color:var(--green); }
.footer-note { font-size:11px; color:var(--muted); line-height:1.6; }

.reveal { opacity:0; transform:translateY(28px); transition:opacity .6s ease,transform .6s ease; }
.reveal.visible { opacity:1; transform:translateY(0); }

@media(max-width:700px) {
  .problem-grid { grid-template-columns:1fr; }
  .pricing-grid { grid-template-columns:1fr; }
  .sim-numbers { grid-template-columns:1fr 1fr; }
  footer { flex-direction:column; text-align:center; }
}
`;

const TICKER_ITEMS = [
  { label: 'ETF WORLD', val: '+8.2%/an', up: true },
  { label: 'LIVRET A', val: '+3.0%', up: true },
  { label: 'INFLATION', val: '-2.5%', up: false },
  { label: 'ASSURANCE VIE', val: '+4.8%/an', up: true },
  { label: 'COMPTE COURANT', val: '0%', up: false },
  { label: 'PEA', val: 'Fiscalité 0% après 5 ans', up: true },
  { label: 'INTÉRÊTS COMPOSÉS', val: 'x10 en 30 ans', up: true },
];

export default function Landing({ onStart }) {
  const navRef = useRef(null);
  const simRef = useRef(null);
  const [sim5, setSim5] = useState(0);
  const [sim20, setSim20] = useState(0);
  const [sim30, setSim30] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) navRef.current.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: .12 });
    reveals.forEach(r => obs.observe(r));

    const statBoxes = document.querySelectorAll('.stat-box');
    const obs2 = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: .3 });
    statBoxes.forEach(b => obs2.observe(b));

    return () => { obs.disconnect(); obs2.disconnect(); };
  }, []);

  useEffect(() => {
    if (!simRef.current) return;
    const animate = (setter, target) => {
      const duration = 1500;
      const start = performance.now();
      const update = now => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setter(Math.round(ease * target));
        if (p < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animate(setSim5, 18400);
        animate(setSim20, 52000);
        animate(setSim30, 149000);
        obs.disconnect();
      }
    }, { threshold: .5 });
    obs.observe(simRef.current);
    return () => obs.disconnect();
  }, []);

  const fmt = n => new Intl.NumberFormat('fr-FR').format(n) + ' €';

  const tickerDouble = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      <style>{FONTS}{css}</style>

      {/* NAV */}
      <nav ref={navRef}>
        <div className="nav-logo">VESTO</div>
        <button className="nav-cta" onClick={onStart}>Commencer gratuitement</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-orb" /><div className="hero-orb2" />
        <div className="hero-eyebrow">Investis mieux. Vis mieux.</div>
        <h1 className="hero-title">
          TON ARGENT<br/><span className="l2">MÉRITE</span><br/><span className="l3">mieux.</span>
        </h1>
        <p className="hero-sub">
          <strong>70% des jeunes Français</strong> ne savent pas comment faire fructifier leur argent.<br/>
          Vesto change ça — simulations réelles, principes clairs, zéro bullshit.
        </p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={onStart}>Essayer gratuitement →</button>
          <a href="#features" className="btn-ghost">Voir comment ça marche</a>
        </div>
        <div className="hero-scroll">Découvrir</div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {tickerDouble.map((t, i) => (
            <div key={i} className="ticker-item">
              {t.label} <span className={t.up ? 'up' : 'down'}>{t.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section className="section">
        <div className="section-label reveal">Le problème en chiffres</div>
        <h2 className="section-title reveal">La réalité<br/>financière.</h2>
        <p className="section-sub reveal">Personne ne t'a appris ça à l'école. Voilà pourquoi.</p>
        <div className="stats-grid reveal">
          {[
            { num: '70%', color: 'var(--red)', desc: 'des Français estiment avoir une <strong>faible éducation financière</strong>' },
            { num: '80%', color: 'var(--orange)', desc: 'des 18-24 ans veulent <strong>l\'éducation financière à l\'école</strong>' },
            { num: 'x10', color: 'var(--green)', desc: 'différence de capital sur 30 ans entre <strong>investir ou ne pas investir</strong>' },
            { num: '-2.5%', color: 'var(--blue)', desc: 'perte annuelle de l\'argent dormant sur <strong>compte courant</strong> (inflation)' },
          ].map((s, i) => (
            <div key={i} className="stat-box">
              <div className="stat-number" style={{ color: s.color }}>{s.num}</div>
              <div className="stat-desc" dangerouslySetInnerHTML={{ __html: s.desc }} />
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section className="problem">
        <div className="problem-inner">
          <div className="problem-grid">
            <div>
              <div className="section-label reveal">Pourquoi ça bloque</div>
              <div className="problem-list">
                {[
                  { icon: '😶', title: 'Personne ne t\'a expliqué', desc: 'L\'école n\'enseigne pas la gestion de l\'argent. Tu apprends par tes erreurs — ou pas du tout.' },
                  { icon: '😰', title: 'La finance fait peur', desc: 'Jargon incompréhensible, influenceurs douteux, produits opaques. Difficile de savoir à qui faire confiance.' },
                  { icon: '⏳', title: 'Tu attends d\'avoir "assez"', desc: 'Chaque année sans investir te coûte des milliers d\'euros. La procrastination est le pire ennemi de ton patrimoine.' },
                  { icon: '🌀', title: 'Trop d\'options, trop confus', desc: 'Livret A, PEA, assurance vie, crypto, SCPI... Par où commencer ? Sans guide, tu ne commences pas.' },
                ].map((p, i) => (
                  <div key={i} className="problem-item reveal">
                    <div className="pi-icon">{p.icon}</div>
                    <div><div className="pi-title">{p.title}</div><div className="pi-desc">{p.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal">
              <div className="problem-statement">
                L'argent qui<br/><span className="accent">dort</span><br/>perd de la<br/>valeur.<br/>L'argent qui<br/><span className="green">travaille</span><br/>construit<br/>ton avenir.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="section-label reveal">Ce que tu obtiens</div>
        <h2 className="section-title reveal">Tout ce dont<br/>tu as besoin.</h2>
        <p className="section-sub reveal">Pas un cours ennuyeux. Pas un conseiller qui vend des produits. Un outil qui te donne le pouvoir de décider.</p>
        <div className="features-grid">
          {[
            { icon: '🧠', title: 'Apprendre', desc: 'Les 3 principes fondamentaux expliqués simplement : intérêts composés, diversification, temps. Avec des exemples en euros réels.', tag: 'Éducation' },
            { icon: '💸', title: 'Budget Perso', desc: 'Crée ton budget 100% personnalisé. Aucune catégorie imposée. Vois exactement où va chaque euro de ton revenu.', tag: 'Gestion' },
            { icon: '📈', title: 'Simulateur d\'Épargne', desc: 'Joue avec les chiffres : combien tu épargnes, pendant combien de temps, à quel rendement. Vois ta courbe en temps réel.', tag: 'Simulation' },
            { icon: '🚀', title: 'Comparateur de Placements', desc: 'Livret A, PEA, Assurance Vie, Crypto. Compare les rendements sur ta durée et avec ton montant. Sans jargon.', tag: 'Investissement' },
            { icon: '🗺️', title: 'Feuille de Route Perso', desc: 'Étudiant, premier salaire ou confirmé — obtiens les étapes concrètes adaptées à ta situation.', tag: 'Stratégie' },
            { icon: '⚡', title: 'Zéro bullshit', desc: 'Pas de produits à vendre, pas de pub, pas de "devenez riche en 30 jours". Juste des chiffres réels et des conseils honnêtes.', tag: 'Confiance' },
          ].map((f, i) => (
            <div key={i} className="feature-card reveal">
              <div className="fc-icon">{f.icon}</div>
              <div className="fc-title">{f.title}</div>
              <div className="fc-desc">{f.desc}</div>
              <div className="fc-tag">{f.tag}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SIM PREVIEW */}
      <section className="sim-preview">
        <div className="section-label reveal">Simulation live</div>
        <h2 className="section-title reveal">Vois ce que<br/>100€/mois peuvent faire.</h2>
        <div className="sim-card reveal" ref={simRef}>
          <p style={{ fontSize: 13, color: 'var(--muted2)', lineHeight: 1.7 }}>
            En investissant <strong style={{ color: 'var(--text)' }}>100€/mois</strong> dans un ETF World à <strong style={{ color: 'var(--text)' }}>8%/an</strong> :
          </p>
          <div className="sim-numbers">
            {[{ val: sim5, label: 'Dans 10 ans' }, { val: sim20, label: 'Dans 20 ans' }, { val: sim30, label: 'Dans 30 ans' }].map((s, i) => (
              <div key={i} className="sim-num-item">
                <div className="sim-num">{fmt(s.val)}</div>
                <div className="sim-num-label">{s.label}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 24, textAlign: 'center' }}>
            Pour 36 000€ versés sur 30 ans. Les 113 000€ restants ? Ce sont les intérêts composés.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing">
        <div className="section-label reveal">Tarifs</div>
        <h2 className="section-title reveal">Simple.<br/>Transparent.</h2>
        <div className="pricing-grid">
          <div className="price-card reveal">
            <div className="price-name">Gratuit</div>
            <div className="price-amount">0€</div>
            <div className="price-period">pour toujours</div>
            <div className="price-features">
              {['Onglet Apprendre complet', 'Budget personnalisable', 'Simulateur épargne', 'Comparateur placements'].map(f => (
                <div key={f} className="pf-item"><span className="dot">✓</span>{f}</div>
              ))}
              {['Suivi mensuel', 'Alertes & objectifs', 'Export PDF'].map(f => (
                <div key={f} className="pf-item dim"><span className="dot">–</span>{f}</div>
              ))}
            </div>
            <button className="btn-plan free" onClick={onStart}>Commencer →</button>
          </div>
          <div className="price-card featured reveal">
            <div className="price-badge">Bientôt</div>
            <div className="price-name">Pro</div>
            <div className="price-amount">4€</div>
            <div className="price-period">par mois · soit 1 café</div>
            <div className="price-features">
              {['Tout le plan Gratuit', 'Suivi mensuel du patrimoine', 'Objectifs & alertes perso', 'Export PDF bilan', 'Modules en avant-première', 'Support prioritaire'].map(f => (
                <div key={f} className="pf-item"><span className="dot">✓</span>{f}</div>
              ))}
            </div>
            <button className="btn-plan pro">Rejoindre la liste d'attente →</button>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="footer-cta">
        <h2 className="fcta-title reveal">COMMENCE<br/><span>MAINTENANT.</span></h2>
        <p className="fcta-sub reveal">Chaque jour qui passe est de l'argent qui dort.<br/>5 minutes suffisent pour changer ta vision de l'argent.</p>
        <button className="btn-primary reveal" style={{ fontSize: 15, padding: '17px 40px' }} onClick={onStart}>
          Essayer gratuitement →
        </button>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">VESTO</div>
        <div className="footer-note">Outil d'éducation financière · Pas de conseil financier · Pas de publicité<br/>Les rendements passés ne présagent pas des rendements futurs.</div>
      </footer>
    </>
  );
}
