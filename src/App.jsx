import React, { useState, useEffect, useMemo } from "react";
import {
  Eye, EyeOff, Pencil, Check, ArrowUpRight, ArrowDownRight, Plus, Send,
  Download, Wifi, Home, Coins, TrendingUp, List, Trash2, X, Settings as SettingsIcon,
  Lock, Instagram, RotateCcw,
} from "lucide-react";

const ACCENTS = {
  green: "#00D964",
  gold: "#D4AF37",
  blue: "#4C8DFF",
};
const BLACK = "#000000";
const SURFACE = "#141414";
const SURFACE_2 = "#1C1C1C";
const MUTED = "#8A8A8A";
const WHITE = "#F5F5F5";
const INSTAGRAM_URL = "https://instagram.com/9vm4n";
const STORAGE_KEY = "cashapp_demo_state_v1";

function randomCardDigits() {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
}
function fmt(n) {
  return Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const CATEGORIES = ["General", "Food", "Bills", "Shopping", "Income", "Transfer"];

const FREE_COINS = [
  { id: "c1", name: "NovaCoin", symbol: "NVC", color: "#00D964", amount: 4.812, price: 2140.55, change: 3.2 },
  { id: "c2", name: "PulseChain", symbol: "PLS", color: "#7C8CFF", amount: 1250, price: 0.84, change: -1.4 },
  { id: "c3", name: "Ember", symbol: "EMB", color: "#FF8A4C", amount: 18.4, price: 96.2, change: 5.7 },
];
const PRO_COINS = [
  { id: "c4", name: "Driftwood", symbol: "DRFT", color: "#B9A3FF", amount: 900, price: 1.42, change: 0.8 },
  { id: "c5", name: "Halcyon", symbol: "HLC", color: "#5CE1E6", amount: 12.6, price: 310.9, change: -2.3 },
  { id: "c6", name: "Marrow", symbol: "MRW", color: "#FF6B6B", amount: 3.1, price: 5820.0, change: 4.1 },
];

const FREE_STOCKS = [
  { id: "s1", name: "Solstice Corp", ticker: "SOLC", color: "#00D964", shares: 42, price: 188.3, change: 1.8 },
  { id: "s2", name: "Vantage Robotics", ticker: "VNTG", color: "#4CC9FF", shares: 15, price: 412.9, change: -0.6 },
  { id: "s3", name: "Cobalt Materials", ticker: "COBL", color: "#C9A876", shares: 60, price: 74.15, change: 2.1 },
];
const PRO_STOCKS = [
  { id: "s4", name: "Ferrous Dynamics", ticker: "FRRD", color: "#FFB86B", shares: 22, price: 264.4, change: 3.4 },
  { id: "s5", name: "Northlight Air", ticker: "NRLT", color: "#8FD3FF", shares: 33, price: 91.2, change: -1.1 },
  { id: "s6", name: "Quarry Systems", ticker: "QRRY", color: "#C792EA", shares: 8, price: 1180.5, change: 0.4 },
];

const INITIAL_TX = [
  { id: "t1", label: "Design Studio LLC", sub: "Incoming transfer", amount: 4200, type: "in", category: "Income" },
  { id: "t2", label: "Riverside Market", sub: "Groceries", amount: -86.4, type: "out", category: "Food" },
  { id: "t3", label: "Interest Payout", sub: "Savings vault", amount: 312.18, type: "in", category: "Income" },
  { id: "t4", label: "Skyline Utilities", sub: "Electric & water", amount: -142.75, type: "out", category: "Bills" },
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

function AssetIcon({ letter, color, size = 36 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: size * 0.42, color: BLACK, flexShrink: 0 }}>
      {letter}
    </div>
  );
}

function EditableNumber({ value, onSave, prefix = "", decimals = 2, fontSize = 14, color = WHITE, accent }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value.toFixed(decimals));
  if (editing) {
    return (
      <input
        autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { const p = parseFloat(draft); onSave(!isNaN(p) ? p : value); setEditing(false); } }}
        onBlur={() => { const p = parseFloat(draft); onSave(!isNaN(p) ? p : value); setEditing(false); }}
        inputMode="decimal" className="num"
        style={{ width: 90, fontSize, color, background: SURFACE_2, border: `1px solid ${accent}`, borderRadius: 6, padding: "2px 6px", outline: "none" }}
      />
    );
  }
  return (
    <span onClick={() => { setDraft(value.toFixed(decimals)); setEditing(true); }} className="num" style={{ fontSize, color, cursor: "pointer", borderBottom: "1px dashed #333" }}>
      {prefix}{fmt(value)}
    </span>
  );
}

function TabBar({ tab, setTab, accent }) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "crypto", label: "Crypto", icon: Coins },
    { id: "trade", label: "Trade", icon: TrendingUp },
    { id: "tx", label: "Activity", icon: List },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0A0A0A", borderTop: "1px solid #1E1E1E", display: "flex", justifyContent: "space-around", padding: "10px 0 18px", zIndex: 10 }}>
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = tab === t.id;
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: active ? accent : MUTED, cursor: "pointer", fontSize: 10.5, fontWeight: 600 }}>
            <Icon size={20} color={active ? accent : MUTED} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function DemoBadge({ pro }) {
  if (pro) {
    return <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#333", flexShrink: 0 }} title="Demo" />;
  }
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: SURFACE, border: "1px solid #2A2A2A", borderRadius: 20, padding: "4px 10px", fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: "0.06em" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#666" }} />
      DEMO MODE
    </div>
  );
}

function LockedCard({ accent }) {
  return (
    <div style={{ background: SURFACE, borderRadius: 16, padding: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: MUTED, fontSize: 12.5, fontWeight: 600 }}>
      <Lock size={14} color={MUTED} />
      Unlock Pro to see more
    </div>
  );
}

function HomeView({ username, setUsername, balance, setBalance, cardLast4, transactions, pro, accent }) {
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(username);
  const [editingBal, setEditingBal] = useState(false);
  const [balDraft, setBalDraft] = useState(balance.toFixed(2));
  const [hidden, setHidden] = useState(false);

  const commitName = () => { const t = nameDraft.trim(); setUsername(t.length ? t : username); setEditingName(false); };
  const commitBal = () => { const p = parseFloat(balDraft.replace(/,/g, "")); if (!isNaN(p) && p >= 0) setBalance(p); else setBalDraft(balance.toFixed(2)); setEditingBal(false); };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const formatted = balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 4, fontWeight: 500 }}>{greeting}</div>
          {editingName ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700 }}>Hello,</span>
              <input autoFocus value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && commitName()}
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: WHITE, background: "transparent", border: "none", borderBottom: `2px solid ${accent}`, outline: "none", width: 120, padding: "0 0 2px" }} />
              <button onClick={commitName} style={{ background: accent, border: "none", borderRadius: 10, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Check size={14} color={BLACK} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700 }}>Hello, {username}</div>
              <button onClick={() => { setNameDraft(username); setEditingName(true); }} style={{ background: SURFACE, border: "none", borderRadius: 8, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Pencil size={11} color={accent} />
              </button>
            </div>
          )}
        </div>
        <DemoBadge pro={pro} />
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 12, color: MUTED, letterSpacing: "0.06em", fontWeight: 600 }}>TOTAL BALANCE</div>
          <button onClick={() => setHidden((h) => !h)} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", display: "flex", padding: 4 }}>
            {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {editingBal ? (
            <>
              <span className="num" style={{ fontSize: 40, fontWeight: 700, color: accent }}>$</span>
              <input autoFocus value={balDraft} onChange={(e) => setBalDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && commitBal()}
                inputMode="decimal" className="num balance-input" style={{ fontSize: 40, fontWeight: 700, color: accent }} />
              <button onClick={commitBal} style={{ background: accent, border: "none", borderRadius: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                <Check size={16} color={BLACK} />
              </button>
            </>
          ) : (
            <>
              <div className="num" style={{ fontSize: 40, fontWeight: 700, color: accent, lineHeight: 1 }}>{hidden ? "$ ••••••" : `$${formatted}`}</div>
              <button onClick={() => { setBalDraft(balance.toFixed(2)); setEditingBal(true); }} style={{ background: SURFACE, border: "none", borderRadius: 10, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                <Pencil size={13} color={accent} />
              </button>
            </>
          )}
        </div>
        <div style={{ fontSize: 13, color: accent, marginTop: 8, fontWeight: 600 }}>+ 2.4% this month</div>
      </div>

      <div style={{ position: "relative", borderRadius: 20, padding: 24, height: 190, background: SURFACE, border: "1px solid #262626", overflow: "hidden", marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ width: 44, height: 34, borderRadius: 7, background: "#C7C1A8", position: "relative", overflow: "hidden", border: "1px solid #8F8A73" }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "#8F8A73" }} />
            <div style={{ position: "absolute", top: "33%", left: 0, right: 0, height: 1, background: "#8F8A73" }} />
            <div style={{ position: "absolute", top: "66%", left: 0, right: 0, height: 1, background: "#8F8A73" }} />
            <div style={{ position: "absolute", left: "22%", top: 0, bottom: 0, width: 1, background: "#8F8A73" }} />
            <div style={{ position: "absolute", left: "78%", top: 0, bottom: 0, width: 1, background: "#8F8A73" }} />
            <div style={{ position: "absolute", left: "30%", right: "30%", top: "22%", bottom: "22%", border: "1px solid #8F8A73", borderRadius: 3 }} />
          </div>
          <Wifi size={20} color={MUTED} style={{ transform: "rotate(90deg)" }} />
        </div>
        <div className="num" style={{ marginTop: 26, fontSize: 20, letterSpacing: "0.14em", color: WHITE, fontWeight: 500 }}>•••• •••• •••• {cardLast4}</div>
        <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 10, color: MUTED, marginBottom: 3, fontWeight: 600 }}>CARD HOLDER</div>
            <div style={{ fontSize: 13, color: WHITE, fontWeight: 500 }}>{username.toUpperCase()}</div>
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, fontStyle: "italic", color: WHITE, letterSpacing: "-0.01em" }}>VISA</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 26 }}>
        {[{ label: "Add funds", icon: <Plus size={18} /> }, { label: "Send", icon: <Send size={17} /> }, { label: "Request", icon: <Download size={17} /> }].map((a) => (
          <button key={a.label} style={{ background: SURFACE, border: "none", borderRadius: 16, padding: "16px 8px", color: WHITE, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 600 }}>
            <span style={{ color: BLACK, background: accent, width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{a.icon}</span>
            {a.label}
          </button>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 12, color: MUTED, letterSpacing: "0.06em", marginBottom: 12, fontWeight: 600 }}>RECENT ACTIVITY</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {transactions.slice(0, 4).map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: SURFACE, borderRadius: 14, padding: "13px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: item.type === "in" ? accent : SURFACE_2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {item.type === "in" ? <ArrowDownRight size={16} color={BLACK} /> : <ArrowUpRight size={16} color={WHITE} />}
                </div>
                <div>
                  <div style={{ fontSize: 13.5, color: WHITE, fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: 11.5, color: MUTED }}>{item.sub}</div>
                </div>
              </div>
              <div className="num" style={{ fontSize: 13.5, color: item.type === "in" ? accent : WHITE, fontWeight: 700 }}>{item.type === "in" ? "+" : "-"}${fmt(item.amount)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function CryptoView({ coins, setCoins, pro, accent }) {
  const visible = pro ? coins : coins.slice(0, 3);
  const total = visible.reduce((s, c) => s + c.amount * c.price, 0);
  const update = (id, field, value) => setCoins(coins.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700 }}>Crypto</div>
        <DemoBadge pro={pro} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 6 }}>PORTFOLIO VALUE</div>
        <div className="num" style={{ fontSize: 34, fontWeight: 700, color: accent }}>${fmt(total)}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {visible.map((c) => (
          <div key={c.id} style={{ background: SURFACE, borderRadius: 16, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <AssetIcon letter={c.symbol[0]} color={c.color} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: WHITE }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color: MUTED }}>{c.symbol}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="num" style={{ fontSize: 14, fontWeight: 700, color: WHITE }}>${fmt(c.amount * c.price)}</div>
                <div style={{ fontSize: 11.5, color: c.change >= 0 ? accent : MUTED, fontWeight: 600 }}>{c.change >= 0 ? "+" : ""}{c.change}%</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: MUTED, borderTop: "1px solid #232323", paddingTop: 10 }}>
              <span>Holdings: <EditableNumber value={c.amount} onSave={(v) => update(c.id, "amount", v)} decimals={3} color={WHITE} fontSize={12} accent={accent} /></span>
              <span>Price: <EditableNumber value={c.price} onSave={(v) => update(c.id, "price", v)} prefix="$" color={WHITE} fontSize={12} accent={accent} /></span>
            </div>
          </div>
        ))}
        {!pro && <LockedCard accent={accent} />}
      </div>
    </>
  );
}

function StockChart({ seedKey, price, color }) {
  const [live, setLive] = useState(price);

  const points = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < seedKey.length; i++) seed += seedKey.charCodeAt(i) * (i + 1);
    let val = price * 0.92;
    let s = seed || 1;
    const arr = [];
    for (let i = 0; i < 22; i++) {
      s = (s * 9301 + 49297) % 233280;
      const rnd = s / 233280;
      val += (rnd - 0.48) * price * 0.025;
      arr.push(val);
    }
    arr.push(price);
    return arr;
  }, [seedKey, price]);

  useEffect(() => {
    setLive(price);
    const id = setInterval(() => {
      setLive((p) => Math.max(0.01, p * (1 + (Math.random() - 0.5) * 0.006)));
    }, 1800);
    return () => clearInterval(id);
  }, [price]);

  const allPoints = [...points, live];
  const min = Math.min(...allPoints);
  const max = Math.max(...allPoints);
  const range = max - min || 1;
  const w = 300, h = 90;
  const stepX = w / (allPoints.length - 1);
  const path = allPoints.map((v, i) => `${i === 0 ? "M" : "L"} ${(i * stepX).toFixed(1)} ${(h - ((v - min) / range) * h).toFixed(1)}`).join(" ");
  const liveUp = live >= points[points.length - 1];

  return (
    <div style={{ marginTop: 10, borderTop: "1px solid #232323", paddingTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 10.5, color: MUTED, letterSpacing: "0.06em", fontWeight: 600 }}>LIVE CHART</div>
        <div className="num" style={{ fontSize: 14, fontWeight: 700, color: liveUp ? color : "#F87171" }}>${live.toFixed(2)}</div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={70} preserveAspectRatio="none">
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function TradeView({ stocks, setStocks, pro, accent }) {
  const visible = pro ? stocks : stocks.slice(0, 3);
  const total = visible.reduce((s, x) => s + x.shares * x.price, 0);
  const update = (id, field, value) => setStocks(stocks.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  const [openId, setOpenId] = useState(null);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700 }}>Trade</div>
        <DemoBadge pro={pro} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 6 }}>PORTFOLIO VALUE</div>
        <div className="num" style={{ fontSize: 34, fontWeight: 700, color: accent }}>${fmt(total)}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {visible.map((s) => (
          <div key={s.id} onClick={() => setOpenId(openId === s.id ? null : s.id)} style={{ background: SURFACE, borderRadius: 16, padding: 14, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <AssetIcon letter={s.ticker[0]} color={s.color} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: WHITE }}>{s.name}</div>
                <div style={{ fontSize: 11.5, color: MUTED }}>{s.ticker}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="num" style={{ fontSize: 14, fontWeight: 700, color: WHITE }}>${fmt(s.shares * s.price)}</div>
                <div style={{ fontSize: 11.5, color: s.change >= 0 ? accent : MUTED, fontWeight: 600 }}>{s.change >= 0 ? "+" : ""}{s.change}%</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: MUTED, borderTop: "1px solid #232323", paddingTop: 10 }}>
              <span onClick={(e) => e.stopPropagation()}>Shares: <EditableNumber value={s.shares} onSave={(v) => update(s.id, "shares", v)} decimals={0} color={WHITE} fontSize={12} accent={accent} /></span>
              <span onClick={(e) => e.stopPropagation()}>Price: <EditableNumber value={s.price} onSave={(v) => update(s.id, "price", v)} prefix="$" color={WHITE} fontSize={12} accent={accent} /></span>
            </div>

            {openId === s.id && (
              pro ? (
                <StockChart seedKey={s.id} price={s.price} color={s.color} />
              ) : (
                <div style={{ marginTop: 10, borderTop: "1px solid #232323", paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: MUTED, fontSize: 12.5, fontWeight: 600 }}>
                  <Lock size={14} color={MUTED} />
                  Unlock Pro to see live trading charts
                </div>
              )
            )}
          </div>
        ))}
        {!pro && <LockedCard accent={accent} />}
      </div>
    </>
  );
}

function TxView({ transactions, setTransactions, pro, accent }) {
  const [showAdd, setShowAdd] = useState(false);
  const [label, setLabel] = useState("");
  const [sub, setSub] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("in");
  const [category, setCategory] = useState("General");

  const addTx = () => {
    if (!label.trim() || !amount) return;
    const val = Math.abs(parseFloat(amount)) || 0;
    setTransactions([{ id: `t${Date.now()}`, label: label.trim(), sub: sub.trim() || "Manual entry", amount: type === "in" ? val : -val, type, category: pro ? category : "General" }, ...transactions]);
    setLabel(""); setSub(""); setAmount(""); setType("in"); setCategory("General"); setShowAdd(false);
  };
  const removeTx = (id) => setTransactions(transactions.filter((t) => t.id !== id));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700 }}>Activity</div>
        <button onClick={() => setShowAdd(true)} style={{ background: accent, border: "none", borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Plus size={18} color={BLACK} />
        </button>
      </div>

      {showAdd && (
        <div style={{ background: SURFACE, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: WHITE }}>New transaction</div>
            <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={16} color={MUTED} /></button>
          </div>
          <input placeholder="Label (e.g. Coffee Shop)" value={label} onChange={(e) => setLabel(e.target.value)} style={{ width: "100%", background: SURFACE_2, border: "1px solid #2A2A2A", borderRadius: 10, padding: "10px 12px", color: WHITE, fontSize: 13, marginBottom: 8, outline: "none" }} />
          <input placeholder="Note (optional)" value={sub} onChange={(e) => setSub(e.target.value)} style={{ width: "100%", background: SURFACE_2, border: "1px solid #2A2A2A", borderRadius: 10, padding: "10px 12px", color: WHITE, fontSize: 13, marginBottom: 8, outline: "none" }} />
          <input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" style={{ width: "100%", background: SURFACE_2, border: "1px solid #2A2A2A", borderRadius: 10, padding: "10px 12px", color: WHITE, fontSize: 13, marginBottom: 8, outline: "none" }} />
          {pro ? (
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", background: SURFACE_2, border: "1px solid #2A2A2A", borderRadius: 10, padding: "10px 12px", color: WHITE, fontSize: 13, marginBottom: 10, outline: "none" }}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: MUTED, marginBottom: 10 }}>
              <Lock size={12} /> Categories are a Pro feature
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button onClick={() => setType("in")} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer", background: type === "in" ? accent : SURFACE_2, color: type === "in" ? BLACK : WHITE, fontWeight: 600, fontSize: 12.5 }}>Incoming</button>
            <button onClick={() => setType("out")} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer", background: type === "out" ? accent : SURFACE_2, color: type === "out" ? BLACK : WHITE, fontWeight: 600, fontSize: 12.5 }}>Outgoing</button>
          </div>
          <button onClick={addTx} style={{ width: "100%", background: accent, border: "none", borderRadius: 10, padding: "10px 0", color: BLACK, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Add</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {transactions.map((item) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: SURFACE, borderRadius: 14, padding: "13px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: item.type === "in" ? accent : SURFACE_2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.type === "in" ? <ArrowDownRight size={16} color={BLACK} /> : <ArrowUpRight size={16} color={WHITE} />}
              </div>
              <div>
                <div style={{ fontSize: 13.5, color: WHITE, fontWeight: 500 }}>{item.label}</div>
                <div style={{ fontSize: 11.5, color: MUTED }}>{item.sub}{pro && item.category ? ` · ${item.category}` : ""}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="num" style={{ fontSize: 13.5, color: item.type === "in" ? accent : WHITE, fontWeight: 700 }}>{item.type === "in" ? "+" : "-"}${fmt(item.amount)}</div>
              <button onClick={() => removeTx(item.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Trash2 size={14} color={MUTED} /></button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function SettingsView({ pro, setPro, theme, setTheme, accent, onReset }) {
  const [followed, setFollowed] = useState(false);

  return (
    <>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Settings</div>

      <div style={{ background: SURFACE, borderRadius: 16, padding: 18, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: WHITE }}>Pro Status</div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: pro ? accent : MUTED }}>{pro ? "ACTIVE" : "LOCKED"}</div>
        </div>

        {pro ? (
          <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5 }}>
            Pro unlocked — extra coins & stocks, custom accent colors, transaction categories, and a minimized demo badge.
          </div>
        ) : (
          <>
            <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5, marginBottom: 14 }}>
              Unlock Pro for free by following on Instagram, then confirm below.
            </div>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: SURFACE_2, border: "1px solid #2A2A2A", borderRadius: 10, padding: "12px 0", color: WHITE, fontWeight: 600, fontSize: 13, textDecoration: "none", marginBottom: 10 }}>
              <Instagram size={16} /> Follow @9vm4n
            </a>
            <button onClick={() => setFollowed(true)} disabled={followed}
              style={{ width: "100%", background: followed ? SURFACE_2 : accent, border: "none", borderRadius: 10, padding: "10px 0", color: followed ? MUTED : BLACK, fontWeight: 700, fontSize: 13, cursor: followed ? "default" : "pointer", marginBottom: followed ? 10 : 0 }}>
              {followed ? "Confirmed ✓" : "I followed"}
            </button>
            {followed && (
              <button onClick={() => setPro(true)} style={{ width: "100%", background: accent, border: "none", borderRadius: 10, padding: "10px 0", color: BLACK, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Unlock Pro
              </button>
            )}
          </>
        )}
      </div>

      <div style={{ background: SURFACE, borderRadius: 16, padding: 18, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 12 }}>Accent Color</div>
        <div style={{ display: "flex", gap: 10 }}>
          {Object.entries(ACCENTS).map(([key, color]) => {
            const locked = key !== "green" && !pro;
            return (
              <button key={key} onClick={() => !locked && setTheme(key)} disabled={locked}
                style={{ position: "relative", width: 44, height: 44, borderRadius: "50%", background: color, border: theme === key ? `3px solid ${WHITE}` : "3px solid transparent", cursor: locked ? "default" : "pointer", opacity: locked ? 0.35 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {locked && <Lock size={14} color={BLACK} />}
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={onReset} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: SURFACE, border: "1px solid #2A2A2A", borderRadius: 12, padding: "12px 0", color: MUTED, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
        <RotateCcw size={15} /> Reset all data
      </button>
    </>
  );
}

export default function FinanceDashboard() {
  const saved = loadState();
  const [tab, setTab] = useState("home");
  const [username, setUsername] = useState(saved?.username ?? "Alex");
  const [balance, setBalance] = useState(saved?.balance ?? 128450.32);
  const [coins, setCoins] = useState(saved?.coins ?? [...FREE_COINS, ...PRO_COINS]);
  const [stocks, setStocks] = useState(saved?.stocks ?? [...FREE_STOCKS, ...PRO_STOCKS]);
  const [transactions, setTransactions] = useState(saved?.transactions ?? INITIAL_TX);
  const [pro, setPro] = useState(saved?.pro ?? false);
  const [theme, setTheme] = useState(saved?.theme ?? "green");
  const cardLast4 = useMemo(() => randomCardDigits(), []);
  const accent = ACCENTS[theme] || ACCENTS.green;

  useEffect(() => {
    saveState({ username, balance, coins, stocks, transactions, pro, theme });
  }, [username, balance, coins, stocks, transactions, pro, theme]);

  const handleReset = () => {
    if (!window.confirm("Reset all data? This clears your balance, holdings, and transactions.")) return;
    setUsername("Alex");
    setBalance(128450.32);
    setCoins([...FREE_COINS, ...PRO_COINS]);
    setStocks([...FREE_STOCKS, ...PRO_STOCKS]);
    setTransactions(INITIAL_TX);
    setPro(false);
    setTheme("green");
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: BLACK, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: WHITE, padding: "28px 18px 100px", boxSizing: "border-box" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .num { font-family: 'Space Grotesk', monospace; font-variant-numeric: tabular-nums; }
        .balance-input { font-family: 'Space Grotesk', monospace; font-variant-numeric: tabular-nums; background: transparent; border: none; outline: none; width: 100%; }
        button { font-family: inherit; }
        button:focus-visible, input:focus-visible { outline: 2px solid ${accent}; outline-offset: 2px; }
        input::placeholder { color: #6A6A6A; }
        select { appearance: none; }
      `}</style>

      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        {tab === "home" && <HomeView username={username} setUsername={setUsername} balance={balance} setBalance={setBalance} cardLast4={cardLast4} transactions={transactions} pro={pro} accent={accent} />}
        {tab === "crypto" && <CryptoView coins={coins} setCoins={setCoins} pro={pro} accent={accent} />}
        {tab === "trade" && <TradeView stocks={stocks} setStocks={setStocks} pro={pro} accent={accent} />}
        {tab === "tx" && <TxView transactions={transactions} setTransactions={setTransactions} pro={pro} accent={accent} />}
        {tab === "settings" && <SettingsView pro={pro} setPro={setPro} theme={theme} setTheme={setTheme} accent={accent} onReset={handleReset} />}

        <div style={{ textAlign: "center", marginTop: 26, fontSize: 9.5, color: "#4A4A4A", letterSpacing: "0.04em" }}>
          Simulated data for entertainment purposes
        </div>
      </div>

      <TabBar tab={tab} setTab={setTab} accent={accent} />
    </div>
  );
}
