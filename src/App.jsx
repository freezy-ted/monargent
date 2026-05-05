import { useState, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #080808; --surface: #111; --surface2: #161616;
    --border: #222; --border2: #2a2a2a;
    --green: #00ff87; --green-dim: rgba(0,255,135,0.07); --green-mid: rgba(0,255,135,0.14);
    --red: #ff4757; --orange: #ff9f43; --blue: #00d4ff; --purple: #a29bfe;
    --text: #f0f0f0; --muted: #555; --muted2: #888;
  }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  .app { min-height: 100vh; max-width: 520px; margin: 0 auto; padding: 28px 18px 80px; }

  .logo { font-family: 'Bebas Neue', sans-serif; font-size: 40px; letter-spacing: .04em; line-height: 1; margin-bottom: 4px; }
  .logo span { color: var(--green); }
  .tagline { font-size: 12px; color: var(--muted2); font-weight: 300; margin-bottom: 28px; }

  .tabs { display: flex; gap: 5px; margin-bottom: 22px; flex-wrap: wrap; }
  .tab { flex:1; min-width: 70px; padding:10px 4px; border:1px solid var(--border); border-radius:6px; background:transparent; color:var(--muted2); font-family:'DM Sans',sans-serif; font-size:11px; font-weight:500; cursor:pointer; transition:all .2s; text-align:center; }
  .tab.active { background:var(--green); color:#000; border-color:var(--green); font-weight:600; }
  .tab:not(.active):hover { border-color:var(--green); color:var(--green); }

  .card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:22px; margin-bottom:14px; animation:fadeUp .3s ease; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .card-title { font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); margin-bottom:18px; }

  .slider-row { margin-bottom:20px; }
  .slider-label { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px; }
  .slider-name { font-size:13px; color:var(--muted2); }
  .slider-val { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--green); letter-spacing:.04em; }
  input[type=range] { width:100%; -webkit-appearance:none; appearance:none; height:3px; background:var(--border2); border-radius:2px; outline:none; cursor:pointer; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:var(--green); border:3px solid var(--bg); box-shadow:0 0 10px rgba(0,255,135,.4); transition:box-shadow .2s; }
  input[type=range]::-webkit-slider-thumb:hover { box-shadow:0 0 18px rgba(0,255,135,.7); }

  .result-block { background:var(--green-dim); border:1px solid rgba(0,255,135,.18); border-radius:10px; padding:20px; margin-bottom:14px; text-align:center; }
  .result-label { font-size:11px; color:var(--muted2); letter-spacing:.1em; margin-bottom:5px; }
  .result-big { font-family:'Bebas Neue',sans-serif; font-size:52px; color:var(--green); letter-spacing:.03em; line-height:1; animation:pop .35s ease; }
  @keyframes pop { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
  .result-sub { font-size:12px; color:var(--muted2); margin-top:4px; }

  .breakdown { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px; }
  .bk-item { background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:13px; }
  .bk-label { font-size:10px; color:var(--muted); letter-spacing:.1em; text-transform:uppercase; margin-bottom:5px; }
  .bk-val { font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:.03em; }
  .bk-val.pos { color:var(--green); } .bk-val.neg { color:var(--red); } .bk-val.neu { color:var(--text); }

  .chart-wrap { height:150px; margin-top:6px; }
  .custom-tt { background:var(--surface2); border:1px solid var(--border); border-radius:6px; padding:8px 12px; font-size:11px; color:var(--muted2); }
  .custom-tt .tv { font-family:'Bebas Neue',sans-serif; font-size:18px; color:var(--green); }

  .insight { background:var(--surface2); border-left:3px solid var(--green); border-radius:0 8px 8px 0; padding:13px 15px; font-size:13px; color:var(--muted2); line-height:1.6; margin-top:14px; }
  .insight strong { color:var(--text); }

  /* BUDGET */
  .revenu-row { display:flex; justify-content:space-between; align-items:center; padding-bottom:16px; border-bottom:1px solid var(--border); margin-bottom:18px; }
  .rv-label { font-size:12px; color:var(--muted2); margin-bottom:4px; }
  .rv-val { font-family:'Bebas Neue',sans-serif; font-size:32px; color:var(--text); }
  .rv-restant { text-align:right; }
  .rv-restant .rv-val { color:var(--green); }
  .rv-restant .rv-val.over { color:var(--red); }
  .cats-list { display:flex; flex-direction:column; gap:10px; margin-bottom:16px; }
  .cat-item { background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:14px; transition:border-color .2s; }
  .cat-top { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
  .cat-emoji { font-size:18px; width:28px; text-align:center; flex-shrink:0; cursor:pointer; }
  .cat-name-input { flex:1; background:transparent; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; color:var(--text); border-bottom:1px solid transparent; transition:border-color .2s; }
  .cat-name-input:focus { border-bottom-color:var(--border2); }
  .cat-amount-input { background:var(--bg); border:1px solid var(--border); border-radius:6px; padding:5px 10px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; color:var(--text); outline:none; width:90px; text-align:right; transition:border-color .2s; }
  .cat-amount-input:focus { border-color:var(--green); }
  .cat-del { background:none; border:none; color:var(--muted); cursor:pointer; font-size:14px; padding:2px 4px; transition:color .2s; flex-shrink:0; }
  .cat-del:hover { color:var(--red); }
  .cat-slider-row { display:flex; align-items:center; gap:10px; }
  .cat-bar-track { flex:1; height:4px; background:var(--border); border-radius:2px; overflow:hidden; }
  .cat-bar-fill { height:100%; border-radius:2px; transition:width .4s cubic-bezier(.16,1,.3,1); }
  .cat-pct { font-family:'Bebas Neue',sans-serif; font-size:14px; color:var(--muted2); width:36px; text-align:right; flex-shrink:0; }
  .emoji-row { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px; }
  .emoji-opt { font-size:20px; cursor:pointer; padding:4px; border-radius:6px; transition:background .15s; }
  .emoji-opt:hover { background:var(--border2); }
  .add-cat-btn { width:100%; padding:13px; background:transparent; border:1px dashed var(--border2); border-radius:10px; color:var(--muted2); font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:8px; }
  .add-cat-btn:hover { border-color:var(--green); color:var(--green); }

  /* INVEST PILLS */
  .invest-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:18px; }
  .invest-pill { border:1px solid var(--border); border-radius:8px; padding:14px; cursor:pointer; transition:all .2s; background:transparent; text-align:left; }
  .invest-pill:hover { border-color:var(--green); }
  .invest-pill.sel { border-color:var(--green); background:var(--green-mid); }
  .ip-name { font-size:13px; font-weight:600; color:var(--text); margin-bottom:2px; }
  .ip-rate { font-family:'Bebas Neue',sans-serif; font-size:20px; color:var(--green); }
  .ip-desc { font-size:10px; color:var(--muted2); margin-top:2px; line-height:1.4; }

  /* ── APPRENDRE ── */
  .learn-hero {
    background: linear-gradient(135deg, rgba(0,255,135,0.08), rgba(0,212,255,0.05));
    border: 1px solid rgba(0,255,135,0.2);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 14px;
    text-align: center;
    animation: fadeUp .3s ease;
  }
  .learn-hero-icon { font-size: 36px; margin-bottom: 10px; }
  .learn-hero-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: .04em; color: var(--text); margin-bottom: 6px; }
  .learn-hero-sub { font-size: 13px; color: var(--muted2); line-height: 1.6; }

  /* STAT CARDS */
  .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 16px; text-align: center; animation: fadeUp .3s ease; }
  .stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 34px; letter-spacing: .03em; line-height: 1; margin-bottom: 4px; }
  .stat-label { font-size: 11px; color: var(--muted2); line-height: 1.4; }

  /* PRINCIPE CARDS */
  .principe { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 10px; animation: fadeUp .3s ease; }
  .principe-top { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
  .principe-icon { font-size: 26px; width: 44px; height: 44px; background: var(--surface2); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .principe-title { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: .03em; color: var(--text); line-height: 1.1; }
  .principe-sub { font-size: 11px; color: var(--muted2); margin-top: 2px; }
  .principe-body { font-size: 13px; color: var(--muted2); line-height: 1.7; }
  .principe-body strong { color: var(--text); }
  .principe-example { background: var(--surface2); border-radius: 8px; padding: 12px 14px; margin-top: 12px; font-size: 12px; color: var(--muted2); line-height: 1.6; border-left: 3px solid; }

  /* MINI CHART COMPOSÉ */
  .compose-chart { height: 120px; margin: 12px 0; }

  /* PERSPECTIVES */
  .perspective-title { font-family: 'Bebas Neue', sans-serif; font-size: 13px; letter-spacing: .15em; color: var(--muted); text-transform: uppercase; margin: 22px 0 12px; }

  .profile-grid { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
  .profile-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 18px; cursor: pointer; transition: all .2s; animation: fadeUp .3s ease; }
  .profile-card:hover { border-color: var(--green); transform: translateX(3px); }
  .profile-card.open { border-color: var(--green); }
  .profile-top { display: flex; align-items: center; gap: 12px; }
  .profile-icon { font-size: 22px; width: 40px; height: 40px; background: var(--surface2); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .profile-info { flex: 1; }
  .profile-name { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
  .profile-desc { font-size: 11px; color: var(--muted2); }
  .profile-arrow { font-size: 12px; color: var(--muted); transition: transform .2s; }
  .profile-card.open .profile-arrow { transform: rotate(90deg); color: var(--green); }
  .profile-detail { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); animation: fadeUp .2s ease; }
  .profile-steps { display: flex; flex-direction: column; gap: 8px; }
  .profile-step { display: flex; gap: 12px; align-items: flex-start; }
  .step-num { font-family: 'Bebas Neue', sans-serif; font-size: 16px; color: var(--green); width: 20px; flex-shrink: 0; line-height: 1.3; }
  .step-text { font-size: 12px; color: var(--muted2); line-height: 1.6; }
  .step-text strong { color: var(--text); }
  .profile-result { background: var(--green-dim); border: 1px solid rgba(0,255,135,.15); border-radius: 8px; padding: 12px 14px; margin-top: 12px; font-size: 12px; color: var(--muted2); text-align: center; }
  .profile-result strong { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: var(--green); display: block; letter-spacing: .03em; }

  /* MYTHE */
  .mythe { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin-bottom: 8px; animation: fadeUp .3s ease; }
  .mythe-q { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 8px; display: flex; gap: 8px; }
  .mythe-q::before { content: '❌'; flex-shrink: 0; }
  .mythe-r { font-size: 12px; color: var(--muted2); line-height: 1.6; display: flex; gap: 8px; }
  .mythe-r::before { content: '✅'; flex-shrink: 0; }

  /* CTA */
  .cta-block { background: linear-gradient(135deg, rgba(0,255,135,0.1), rgba(0,212,255,0.06)); border: 1px solid rgba(0,255,135,0.25); border-radius: 12px; padding: 22px; margin-top: 8px; text-align: center; animation: fadeUp .3s ease; }
  .cta-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: .03em; margin-bottom: 8px; }
  .cta-sub { font-size: 12px; color: var(--muted2); margin-bottom: 16px; line-height: 1.6; }
  .cta-btn { background: var(--green); color: #000; border: none; border-radius: 8px; padding: 13px 28px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity .2s; letter-spacing: .03em; }
  .cta-btn:hover { opacity: .85; }
`;

const fmt = n => new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
const fmtK = n => n>=1000?`${(n/1000).toFixed(1)}K €`:`${Math.round(n)} €`;
const EMOJIS = ['🏠','🍔','🚗','🎮','✈️','👗','💊','📱','🎓','💡','🐶','🍺','💪','🎵','📚','💅','🛒','🎁','🏋️','☕'];
const COLORS = ['#00ff87','#00d4ff','#ff9f43','#ff6b81','#a29bfe','#fd79a8','#55efc4','#fdcb6e','#e17055','#74b9ff'];
const DEFAULT_CATS = [
  {id:1,emoji:'🏠',name:'Logement',    montant:600,color:COLORS[0]},
  {id:2,emoji:'🍔',name:'Alimentation',montant:300,color:COLORS[1]},
  {id:3,emoji:'🚗',name:'Transport',   montant:200,color:COLORS[2]},
  {id:4,emoji:'🎮',name:'Loisirs',     montant:150,color:COLORS[3]},
  {id:5,emoji:'💰',name:'Épargne',     montant:200,color:COLORS[4]},
];
const INVESTS = [
  {id:'livretA',   name:'Livret A',      rate:3,  desc:"Sûr, liquide, garanti État"},
  {id:'pea',       name:'PEA / ETF',     rate:8,  desc:"Actions, long terme"},
  {id:'assurance', name:'Assurance Vie', rate:5,  desc:"Fiscalité avantageuse"},
  {id:'crypto',    name:'Crypto (BTC)',  rate:20, desc:"Très risqué, très volatile"},
];

function CustomTT({active,payload,label}) {
  if (!active||!payload?.length) return null;
  return <div className="custom-tt"><div>Année {label}</div><div className="tv">{fmt(payload[0]?.value)}</div></div>;
}

// ── TAB BUDGET ───────────────────────────────────────────────
function TabBudget() {
  const [revenu,setRevenu]=useState(1800);
  const [cats,setCats]=useState(DEFAULT_CATS);
  const [showEmojiFor,setShowEmojiFor]=useState(null);
  const nextId=useRef(10);
  const totalDeps=cats.reduce((s,c)=>s+c.montant,0);
  const restant=revenu-totalDeps;
  const update=(id,f,v)=>setCats(cs=>cs.map(c=>c.id===id?{...c,[f]:v}:c));
  const del=id=>setCats(cs=>cs.filter(c=>c.id!==id));
  const add=()=>{const id=nextId.current++;setCats(cs=>[...cs,{id,emoji:'📦',name:'Nouvelle catégorie',montant:100,color:COLORS[id%COLORS.length]}]);};
  return (
    <div style={{animation:'fadeUp .3s ease'}}>
      <div className="card">
        <div className="card-title">Ton revenu mensuel</div>
        <div className="slider-row">
          <div className="slider-label"><span className="slider-name">Revenu net / mois</span><span className="slider-val">{fmt(revenu)}</span></div>
          <input type="range" min={0} max={8000} step={50} value={revenu} onChange={e=>setRevenu(+e.target.value)}/>
        </div>
      </div>
      <div className="card">
        <div className="revenu-row">
          <div><div className="rv-label">Revenu</div><div className="rv-val">{fmt(revenu)}</div></div>
          <div className="rv-restant"><div className="rv-label">{restant>=0?'Disponible':'Dépassement'}</div><div className={`rv-val ${restant<0?'over':''}`}>{fmt(Math.abs(restant))}</div></div>
        </div>
        <div className="cats-list">
          {cats.map(cat=>{
            const pct=revenu>0?Math.min(100,Math.round(cat.montant/revenu*100)):0;
            return (
              <div key={cat.id} className="cat-item">
                <div className="cat-top">
                  <span className="cat-emoji" onClick={()=>setShowEmojiFor(showEmojiFor===cat.id?null:cat.id)}>{cat.emoji}</span>
                  <input className="cat-name-input" value={cat.name} onChange={e=>update(cat.id,'name',e.target.value)}/>
                  <input className="cat-amount-input" type="number" min={0} value={cat.montant} onChange={e=>update(cat.id,'montant',Math.max(0,+e.target.value))}/>
                  <button className="cat-del" onClick={()=>del(cat.id)}>✕</button>
                </div>
                {showEmojiFor===cat.id&&<div className="emoji-row">{EMOJIS.map(em=><span key={em} className="emoji-opt" onClick={()=>{update(cat.id,'emoji',em);setShowEmojiFor(null);}}>{em}</span>)}</div>}
                <div className="cat-slider-row">
                  <div className="cat-bar-track"><div className="cat-bar-fill" style={{width:`${pct}%`,background:cat.color}}/></div>
                  <span className="cat-pct">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
        <button className="add-cat-btn" onClick={add}>+ Ajouter une catégorie</button>
        {restant<0&&<div className="insight" style={{borderLeftColor:'var(--red)',marginTop:14}}>⚠️ Tu dépenses <strong>{fmt(Math.abs(restant))}</strong> de plus que ton revenu. Réduis une catégorie.</div>}
        {restant>=0&&restant<revenu*0.1&&revenu>0&&<div className="insight" style={{marginTop:14}}>💡 Il te reste <strong>{fmt(restant)}</strong>. Essaie de mettre au moins <strong>{fmt(revenu*0.1)}</strong> de côté (10%).</div>}
        {restant>=revenu*0.1&&revenu>0&&<div className="insight" style={{marginTop:14}}>✅ Bien joué — <strong>{fmt(restant)}</strong> disponibles ({Math.round(restant/revenu*100)}%). Place-les dans l'onglet <strong>Épargne</strong>.</div>}
      </div>
    </div>
  );
}

// ── TAB ÉPARGNE ──────────────────────────────────────────────
function TabEpargne() {
  const [mensuel,setMensuel]=useState(100);
  const [duree,setDuree]=useState(10);
  const [taux,setTaux]=useState(5);
  const data=Array.from({length:duree+1},(_,i)=>{
    const verse=mensuel*12*i;
    const total=mensuel*((Math.pow(1+taux/100,i)-1)/(taux/100))*(1+taux/100);
    return {year:i,total:Math.round(total),verse:Math.round(verse)};
  });
  const final=data[duree];
  const gains=final.total-final.verse;
  return (
    <div style={{animation:'fadeUp .3s ease'}}>
      <div className="card">
        <div className="card-title">Tes paramètres</div>
        {[
          {label:'Épargne mensuelle',val:fmt(mensuel),min:10,max:2000,step:10,v:mensuel,set:setMensuel},
          {label:'Durée',val:`${duree} ans`,min:1,max:40,step:1,v:duree,set:setDuree},
          {label:'Rendement annuel',val:`${taux}%`,min:1,max:20,step:.5,v:taux,set:setTaux},
        ].map(s=>(
          <div className="slider-row" key={s.label}>
            <div className="slider-label"><span className="slider-name">{s.label}</span><span className="slider-val">{s.val}</span></div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.v} onChange={e=>s.set(+e.target.value)}/>
          </div>
        ))}
      </div>
      <div className="result-block">
        <div className="result-label">Capital final dans {duree} ans</div>
        <div className="result-big" key={final.total}>{fmt(final.total)}</div>
        <div className="result-sub">Pour {fmt(mensuel)}/mois à {taux}%/an</div>
      </div>
      <div className="breakdown">
        <div className="bk-item"><div className="bk-label">Versé</div><div className="bk-val neu">{fmtK(final.verse)}</div></div>
        <div className="bk-item"><div className="bk-label">Intérêts</div><div className="bk-val pos">{fmtK(gains)}</div></div>
      </div>
      <div className="card">
        <div className="card-title">Évolution du capital</div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{top:4,right:0,bottom:0,left:0}}>
              <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00ff87" stopOpacity={.2}/><stop offset="95%" stopColor="#00ff87" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="year" tick={{fill:'#555',fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis hide/><Tooltip content={<CustomTT/>}/>
              <Area type="monotone" dataKey="total" stroke="#00ff87" strokeWidth={2} fill="url(#g1)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="insight" style={{marginTop:14}}>Les intérêts composés travaillent <strong>pour toi</strong>. Sur {duree} ans, tu gagnes <strong>{fmt(gains)}</strong> supplémentaires sans effort.</div>
      </div>
    </div>
  );
}

// ── TAB INVESTIR ─────────────────────────────────────────────
function TabInvest() {
  const [sel,setSel]=useState('pea');
  const [montant,setMontant]=useState(200);
  const [duree,setDuree]=useState(10);
  const inv=INVESTS.find(i=>i.id===sel);
  const final=montant*Math.pow(1+inv.rate/100,duree);
  const gains=final-montant;
  const data=Array.from({length:duree+1},(_,i)=>({year:i,val:Math.round(montant*Math.pow(1+inv.rate/100,i))}));
  return (
    <div style={{animation:'fadeUp .3s ease'}}>
      <div className="card">
        <div className="card-title">Choisis un placement</div>
        <div className="invest-grid">
          {INVESTS.map(iv=>(
            <button key={iv.id} className={`invest-pill ${sel===iv.id?'sel':''}`} onClick={()=>setSel(iv.id)}>
              <div className="ip-name">{iv.name}</div><div className="ip-rate">~{iv.rate}%/an</div><div className="ip-desc">{iv.desc}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-title">Simulation</div>
        {[
          {label:'Montant initial',val:fmt(montant),min:50,max:10000,step:50,v:montant,set:setMontant},
          {label:'Durée',val:`${duree} ans`,min:1,max:30,step:1,v:duree,set:setDuree},
        ].map(s=>(
          <div className="slider-row" key={s.label}>
            <div className="slider-label"><span className="slider-name">{s.label}</span><span className="slider-val">{s.val}</span></div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.v} onChange={e=>s.set(+e.target.value)}/>
          </div>
        ))}
      </div>
      <div className="result-block">
        <div className="result-label">{inv.name} — dans {duree} ans</div>
        <div className="result-big" key={`${sel}-${Math.round(final)}`}>{fmt(Math.round(final))}</div>
        <div className="result-sub">+{fmt(Math.round(gains))} de gains · {inv.rate}%/an</div>
      </div>
      <div className="card">
        <div className="card-title">Croissance</div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{top:4,right:0,bottom:0,left:0}}>
              <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00ff87" stopOpacity={.2}/><stop offset="95%" stopColor="#00ff87" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="year" tick={{fill:'#555',fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis hide/><Tooltip content={<CustomTT/>}/>
              <Area type="monotone" dataKey="val" stroke="#00ff87" strokeWidth={2} fill="url(#g2)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="insight" style={{marginTop:14}}>
          {sel==='crypto'?<>⚠️ La crypto peut <strong>multiplier ou perdre 80%</strong>. Ne place jamais plus que tu peux te permettre de perdre.</>:<>Avec {fmt(montant)} sur {duree} ans en {inv.name}, tu transformes ton épargne en <strong>{fmt(Math.round(final))}</strong>.</>}
        </div>
      </div>
    </div>
  );
}

// ── TAB APPRENDRE ────────────────────────────────────────────
const PROFILES = [
  {
    id:'etudiant', icon:'🎓', name:'Étudiant / Sans revenus fixes',
    desc:'Pas de salaire stable, budget serré',
    steps:[
      {n:1, t:'Ouvre un <strong>Livret A</strong> si ce n\'est pas fait. Gratuit, zéro risque, disponible immédiatement.'},
      {n:2, t:'Mets de côté <strong>10€/mois minimum</strong>. L\'habitude compte plus que le montant.'},
      {n:3, t:'Ouvre un <strong>PEA</strong> maintenant — l\'ancienneté fiscale commence dès l\'ouverture, même avec 1€.'},
      {n:4, t:'Investis <strong>5-20€/mois en ETF World</strong> via ton PEA. Automatise le virement.'},
    ],
    result:'50€/mois pendant 5 ans à 8% = <strong>3 600 €</strong> de capital'
  },
  {
    id:'actif', icon:'💼', name:'Actif / Premier salaire',
    desc:'CDI ou CDD, commence à épargner',
    steps:[
      {n:1, t:'Applique la règle <strong>50/30/20</strong> : 50% besoins, 30% envies, 20% épargne dès le 1er salaire.'},
      {n:2, t:'Constitue une <strong>épargne de précaution</strong> : 3 mois de dépenses sur Livret A avant tout.'},
      {n:3, t:'Ouvre une <strong>Assurance Vie</strong> pour le moyen terme (projet, immobilier dans 5-10 ans).'},
      {n:4, t:'Alimente ton <strong>PEA avec 100-200€/mois</strong> en ETF diversifiés pour le long terme.'},
    ],
    result:'200€/mois pendant 20 ans à 7% = <strong>104 000 €</strong> de capital'
  },
  {
    id:'avance', icon:'🚀', name:'Confirmé / Veut accélérer',
    desc:'Épargne déjà, cherche à optimiser',
    steps:[
      {n:1, t:'Maximise ton <strong>PEA à 150 000€</strong> en priorité — fiscalité imbattable après 5 ans.'},
      {n:2, t:'Diversifie : <strong>ETF World + ETF obligataires</strong> pour réduire la volatilité.'},
      {n:3, t:'Explore l\'<strong>immobilier locatif ou les SCPI</strong> pour des revenus passifs réguliers.'},
      {n:4, t:'Pense à l\'<strong>optimisation fiscale</strong> : PER, défiscalisation, holding si entrepreneur.'},
    ],
    result:'500€/mois pendant 25 ans à 8% = <strong>473 000 €</strong> de capital'
  },
];

const MYTHES = [
  {q:'Il faut beaucoup d\'argent pour investir', r:'Tu peux commencer avec 1€ sur un ETF. L\'important c\'est la régularité, pas le montant.'},
  {q:'C\'est trop risqué, je peux tout perdre', r:'Un ETF World diversifié sur 10 ans+ n\'a jamais été négatif historiquement. Le risque diminue avec le temps.'},
  {q:'C\'est trop compliqué, je comprends rien', r:'Acheter un ETF World = posséder un bout de 1500 entreprises mondiales. Aussi simple qu\'un Livret A.'},
  {q:'C\'est trop tard pour commencer', r:'Le meilleur moment pour planter un arbre était il y a 20 ans. Le deuxième meilleur moment, c\'est aujourd\'hui.'},
];

function TabApprendre() {
  const [openProfile, setOpenProfile] = useState(null);
  const compData = Array.from({length:21},(_,i)=>({
    year:i,
    compose:Math.round(100*((Math.pow(1.07,i)-1)/0.07)*(1.07)),
    simple:100*12*i
  }));

  return (
    <div style={{animation:'fadeUp .3s ease'}}>

      {/* Hero */}
      <div className="learn-hero">
        <div className="learn-hero-icon">📊</div>
        <div className="learn-hero-title">Pourquoi investir change tout</div>
        <div className="learn-hero-sub">L'argent qui dort perd de la valeur.<br/>L'argent qui travaille te construit un avenir.</div>
      </div>

      {/* Stats choc */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-num" style={{color:'var(--red)'}}>-2.5%</div>
          <div className="stat-label">Perte annuelle de l'argent sur compte courant (inflation)</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{color:'var(--green)'}}>+8%</div>
          <div className="stat-label">Rendement historique moyen d'un ETF World / an</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{color:'var(--orange)'}}>70%</div>
          <div className="stat-label">Des Français ont une faible éducation financière</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{color:'var(--blue)'}}>x10</div>
          <div className="stat-label">Différence de capital à 30 ans : investir vs ne pas investir</div>
        </div>
      </div>

      {/* Principe 1 — Intérêts composés */}
      <div className="principe">
        <div className="principe-top">
          <div className="principe-icon">⚡</div>
          <div><div className="principe-title">Les intérêts composés</div><div className="principe-sub">Le 8e merveille du monde selon Einstein</div></div>
        </div>
        <div className="principe-body">
          Quand tu investis, tu gagnes des intérêts. Ces intérêts <strong>génèrent eux-mêmes des intérêts</strong>. C'est une boule de neige : plus elle roule longtemps, plus elle grossit vite.
        </div>
        <div className="compose-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={compData} margin={{top:4,right:0,bottom:0,left:0}}>
              <defs>
                <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00ff87" stopOpacity={.25}/><stop offset="95%" stopColor="#00ff87" stopOpacity={0}/></linearGradient>
                <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#888" stopOpacity={.15}/><stop offset="95%" stopColor="#888" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{fill:'#555',fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip formatter={(v,n)=>[fmt(v), n==='compose'?'Avec intérêts composés':'Sans intérêts']}  contentStyle={{background:'#161616',border:'1px solid #222',borderRadius:6,fontSize:11}}/>
              <Area type="monotone" dataKey="simple"  stroke="#555" strokeWidth={1.5} fill="url(#gs)" dot={false}/>
              <Area type="monotone" dataKey="compose" stroke="#00ff87" strokeWidth={2} fill="url(#gc)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="principe-example" style={{borderLeftColor:'var(--green)'}}>
          💡 <strong>100€/mois pendant 20 ans :</strong> sans intérêts → 24 000 €. Avec 7%/an composé → <strong>52 000 €</strong>. La différence de 28 000€ vient uniquement des intérêts qui ont fructifié.
        </div>
      </div>

      {/* Principe 2 — Temps */}
      <div className="principe">
        <div className="principe-top">
          <div className="principe-icon">⏰</div>
          <div><div className="principe-title">Le temps est ton meilleur allié</div><div className="principe-sub">Commencer tôt &gt; investir beaucoup tard</div></div>
        </div>
        <div className="principe-body">
          <strong>Alice</strong> investit 100€/mois de 20 à 30 ans puis s'arrête (10 ans, 12 000€ versés).<br/>
          <strong>Bob</strong> attend et investit 100€/mois de 30 à 60 ans (30 ans, 36 000€ versés).<br/>
          À 60 ans, Alice a <strong>plus d'argent que Bob</strong> — malgré 3x moins versé.
        </div>
        <div className="principe-example" style={{borderLeftColor:'var(--orange)'}}>
          ⚡ Chaque année de retard te coûte des dizaines de milliers d'euros. <strong>Commencer maintenant avec peu vaut mieux qu'attendre d'avoir beaucoup.</strong>
        </div>
      </div>

      {/* Principe 3 — Diversification */}
      <div className="principe">
        <div className="principe-top">
          <div className="principe-icon">🌍</div>
          <div><div className="principe-title">Diversifier = réduire le risque</div><div className="principe-sub">Ne pas mettre tous ses œufs dans le même panier</div></div>
        </div>
        <div className="principe-body">
          Un ETF World te donne accès à <strong>plus de 1500 entreprises</strong> dans 23 pays pour quelques euros. Si Apple chute, Microsoft, Toyota ou LVMH compensent. Tu ne parles pas sur une seule carte.
        </div>
        <div className="principe-example" style={{borderLeftColor:'var(--blue)'}}>
          🛡️ La diversification ne maximise pas les gains — elle <strong>protège contre les pertes catastrophiques</strong>. C'est ça l'investissement intelligent.
        </div>
      </div>

      {/* Mythes */}
      <div className="perspective-title">Idées reçues à oublier</div>
      {MYTHES.map((m,i)=>(
        <div key={i} className="mythe">
          <div className="mythe-q">{m.q}</div>
          <div className="mythe-r">{m.r}</div>
        </div>
      ))}

      {/* Perspectives par profil */}
      <div className="perspective-title">Ta feuille de route selon ton profil</div>
      <div className="profile-grid">
        {PROFILES.map(p=>(
          <div key={p.id} className={`profile-card ${openProfile===p.id?'open':''}`} onClick={()=>setOpenProfile(openProfile===p.id?null:p.id)}>
            <div className="profile-top">
              <div className="profile-icon">{p.icon}</div>
              <div className="profile-info">
                <div className="profile-name">{p.name}</div>
                <div className="profile-desc">{p.desc}</div>
              </div>
              <div className="profile-arrow">→</div>
            </div>
            {openProfile===p.id&&(
              <div className="profile-detail">
                <div className="profile-steps">
                  {p.steps.map(s=>(
                    <div key={s.n} className="profile-step">
                      <div className="step-num">{s.n}</div>
                      <div className="step-text" dangerouslySetInnerHTML={{__html:s.t}}/>
                    </div>
                  ))}
                </div>
                <div className="profile-result">
                  <span style={{fontSize:11,color:'#888',display:'block',marginBottom:4}}>Projection réaliste</span>
                  <strong dangerouslySetInnerHTML={{__html:p.result.split('<strong>')[1]?.split('</strong>')[0]||p.result}}/>
                  <span style={{fontSize:11,color:'#888',display:'block',marginTop:2}} dangerouslySetInnerHTML={{__html:p.result.replace(/<strong>.*?<\/strong>/,'')}}/>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="cta-block">
        <div className="cta-title">Prêt à passer à l'action ?</div>
        <div className="cta-sub">Utilise les simulateurs pour voir concrètement ce que ton argent peut devenir. Chaque euro placé aujourd'hui travaille pour ton futur.</div>
        <button className="cta-btn" onClick={()=>document.querySelector('.tab:nth-child(2)')?.click()}>
          Simuler mon épargne →
        </button>
      </div>

    </div>
  );
}

// ── APP ──────────────────────────────────────────────────────

// ── TAB GLOSSAIRE ────────────────────────────────────────────
const GLOSSAIRE_DATA = [
  { term:'ETF', full:'Exchange Traded Fund', emoji:'🌍', simple:'Un panier d\'actions que tu achètes en une seule fois.', detail:'Imagine que tu veux posséder un bout de 1500 grandes entreprises mondiales. Un ETF te permet de tout acheter en un seul clic pour quelques euros. C\'est le moyen le plus simple et le moins cher d\'investir en bourse.', exemple:'Tu achètes 1 ETF World à 50€ → tu possèdes un tout petit morceau de 1500 entreprises dans 23 pays.', risque:'Moyen', diff:'Facile' },
  { term:'PEA', full:'Plan d\'Épargne en Actions', emoji:'🏦', simple:'Un compte spécial pour investir en bourse sans payer d\'impôts après 5 ans.', detail:'Le PEA est une enveloppe fiscale offerte par l\'État français. Après 5 ans d\'ouverture, tu ne paies quasiment plus d\'impôts sur tes gains. Plafond : 150 000€.', exemple:'Tu ouvres un PEA aujourd\'hui avec 1€. Dans 5 ans, tes gains seront taxés à seulement 17.2% au lieu de 30%.', risque:'Selon contenu', diff:'Facile' },
  { term:'Intérêts composés', full:'La boule de neige financière', emoji:'⚡', simple:'Tes intérêts génèrent eux-mêmes des intérêts. L\'argent grossit exponentiellement.', detail:'Quand tu places 100€ à 8%, tu gagnes 8€. L\'année suivante, tu gagnes 8% sur 108€. Au bout de 30 ans, ton argent a été multiplié par 10 sans rien faire de plus.', exemple:'100€ à 8%/an : après 10 ans → 216€. Après 30 ans → 1006€. La différence vient uniquement des intérêts composés.', risque:'Aucun risque', diff:'Concept clé' },
  { term:'Assurance Vie', full:'Assurance Vie', emoji:'🛡️', simple:'Un placement souple avec une fiscalité avantageuse après 8 ans.', detail:'Malgré son nom, c\'est surtout un outil d\'épargne. Tu peux y mettre de l\'argent en fonds euros sécurisé (~3%/an) ou en ETF plus risqués mais rentables. Fiscalité très avantageuse après 8 ans.', exemple:'Tu places 200€/mois pendant 20 ans. À la retraite, tu retires ton capital avec peu d\'impôts.', risque:'Faible à Moyen', diff:'Facile' },
  { term:'Livret A', full:'Livret A', emoji:'💚', simple:'Le placement le plus sûr. Garanti par l\'État, disponible à tout moment.', detail:'Ton argent est garanti par l\'État, disponible quand tu veux, rapporte 3%/an. Idéal pour l\'épargne de précaution (3-6 mois de dépenses). Plafond : 22 950€.', exemple:'Tu mets 3 000€ sur ton Livret A = épargne de sécurité. En cas de coup dur, tu retires en 24h.', risque:'Aucun', diff:'Très facile' },
  { term:'Diversification', full:'Diversification', emoji:'🎯', simple:'Ne pas mettre tous ses œufs dans le même panier.', detail:'Plutôt qu\'investir dans une seule entreprise, tu répartis sur plusieurs secteurs et pays. Un ETF World diversifie automatiquement sur 1500 entreprises.', exemple:'Apple chute de 30%. Ton ETF World ne baisse que de 2% car il contient 1499 autres entreprises.', risque:'Réduit le risque', diff:'Concept clé' },
  { term:'Inflation', full:'Inflation', emoji:'📉', simple:'La hausse des prix qui fait perdre du pouvoir d\'achat à ton argent qui dort.', detail:'Chaque année, les prix augmentent de 2-3%. Si ton argent ne rapporte pas autant, tu t\'appauvris sans le savoir. 1000€ sur compte courant = 750€ de pouvoir d\'achat dans 10 ans.', exemple:'Un café coûtait 1€ en 2010, 2€ en 2024. Ton argent doit suivre l\'inflation pour ne pas perdre de valeur.', risque:'Si tu n\'investis pas', diff:'Important' },
  { term:'Dividendes', full:'Dividendes', emoji:'💰', simple:'Une part des bénéfices qu\'une entreprise te verse parce que tu es actionnaire.', detail:'Quand tu possèdes des actions, certaines entreprises reversent une partie de leurs profits à leurs actionnaires. C\'est un revenu passif : tu reçois de l\'argent sans rien faire.', exemple:'Tu as 100 actions Total. Total verse 2€/action. Tu reçois automatiquement 200€ cette année.', risque:'Moyen', diff:'Facile' },
  { term:'SCPI', full:'Société Civile de Placement Immobilier', emoji:'🏢', simple:'Investir dans l\'immobilier sans acheter un appartement, dès quelques centaines d\'euros.', detail:'Une SCPI achète et gère des immeubles. Toi tu achètes des parts. En échange tu reçois des loyers. C\'est l\'immobilier sans les contraintes : pas de locataires, pas de travaux.', exemple:'Tu investis 500€ dans une SCPI. Elle possède 200 immeubles. Tu reçois ~4-5%/an soit ~25€ par trimestre.', risque:'Moyen', diff:'Facile' },
  { term:'Plus-value', full:'Plus-value', emoji:'📈', simple:'Le bénéfice que tu fais quand tu revends quelque chose plus cher que tu ne l\'as acheté.', detail:'Si tu achètes une action 100€ et la revends 150€, ta plus-value est 50€. En France, la flat tax est 30% sur les plus-values (sauf PEA après 5 ans : 17.2%).', exemple:'Tu achètes un ETF à 100€ en 2024. En 2034 il vaut 216€. Plus-value : 116€. Impôts : 34.8€.', risque:'N\'existe que si tu gagnes', diff:'Imposition' },
];

const RISQUE_COL = { 'Aucun':'#00ff87','Aucun risque':'#00ff87','Réduit le risque':'#00ff87','Moyen':'#ff9f43','Faible à Moyen':'#ff9f43','Selon contenu':'#00d4ff','Si tu n\'investis pas':'#ff4757' };

function TabGlossaire() {
  const [open,setOpen]=useState(null);
  const [search,setSearch]=useState('');
  const filtered=GLOSSAIRE_DATA.filter(g=>g.term.toLowerCase().includes(search.toLowerCase())||g.simple.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{animation:'fadeUp .3s ease'}}>
      <div className="card">
        <div className="card-title">Dictionnaire financier · {GLOSSAIRE_DATA.length} termes</div>
        <input type="text" placeholder="Rechercher un terme... (ETF, PEA, inflation...)" value={search} onChange={e=>setSearch(e.target.value)}
          style={{width:'100%',background:'var(--bg)',border:'1.5px solid var(--border)',borderRadius:8,padding:'12px 14px',fontFamily:'DM Sans,sans-serif',fontSize:14,color:'var(--text)',outline:'none'}}
          onFocus={e=>e.target.style.borderColor='var(--green)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {filtered.map(g=>(
          <div key={g.term} style={{background:'var(--surface)',border:`1px solid ${open===g.term?'var(--green)':'var(--border)'}`,borderRadius:12,overflow:'hidden',cursor:'pointer',transition:'border-color .2s'}} onClick={()=>setOpen(open===g.term?null:g.term)}>
            <div style={{padding:'16px 18px',display:'flex',alignItems:'center',gap:12}}>
              <span style={{fontSize:22,flexShrink:0}}>{g.emoji}</span>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:3,flexWrap:'wrap'}}>
                  <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:20,letterSpacing:'.03em'}}>{g.term}</span>
                  <span style={{fontSize:10,color:'var(--muted2)'}}>{g.full}</span>
                </div>
                <div style={{fontSize:12,color:'var(--muted2)',lineHeight:1.4}}>{g.simple}</div>
              </div>
              <span style={{fontSize:14,color:open===g.term?'var(--green)':'var(--muted)',transition:'transform .2s',transform:open===g.term?'rotate(45deg)':'none',flexShrink:0}}>+</span>
            </div>
            {open===g.term&&(
              <div style={{padding:'16px 18px 18px',borderTop:'1px solid var(--border)',animation:'fadeUp .2s ease'}}>
                <p style={{fontSize:13,color:'var(--muted2)',lineHeight:1.7,marginBottom:14}}>{g.detail}</p>
                <div style={{background:'var(--surface2)',borderLeft:'3px solid var(--green)',borderRadius:'0 8px 8px 0',padding:'11px 14px',marginBottom:12,fontSize:12,color:'var(--muted2)',lineHeight:1.6}}>
                  💡 <strong style={{color:'var(--text)'}}>Exemple : </strong>{g.exemple}
                </div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  <span style={{fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',padding:'4px 10px',borderRadius:4,border:`1px solid ${RISQUE_COL[g.risque]||'var(--border)'}`,color:RISQUE_COL[g.risque]||'var(--muted2)'}}>Risque : {g.risque}</span>
                  <span style={{fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',padding:'4px 10px',borderRadius:4,border:'1px solid var(--border)',color:'var(--muted2)'}}>{g.diff}</span>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length===0&&<div style={{textAlign:'center',padding:'40px 20px',color:'var(--muted2)',fontSize:13}}>Aucun terme trouvé pour "{search}"</div>}
      </div>
    </div>
  );
}
export default function MonArgent() {
  const [tab,setTab]=useState('apprendre');
  return (
    <>
      <style>{FONTS}{css}</style>
      <div className="app">
        <div className="logo">VESTO</div>
        <div className="tagline">Investis mieux. Vis mieux.</div>
        <div className="tabs">
          {[
            {id:'apprendre',label:'🧠 Apprendre'},
            {id:'budget',   label:'💸 Budget'},
            {id:'epargne',  label:'📈 Épargne'},
            {id:'invest',   label:'🚀 Investir'},
            {id:'glossaire',label:'📖 Glossaire'},
          ].map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        {tab==='apprendre' && <TabApprendre/>}
        {tab==='budget'    && <TabBudget/>}
        {tab==='epargne'   && <TabEpargne/>}
        {tab==='invest'    && <TabInvest/>}
        {tab==='glossaire'  && <TabGlossaire/>}
      </div>
    </>
  );
}
