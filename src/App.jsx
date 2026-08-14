import React, { useState, useMemo } from "react";
import {
  Eye, EyeOff, Pencil, Check, ArrowUpRight, ArrowDownRight, Plus, Send,
  Download, Wifi, Home, Coins, TrendingUp, List, Trash2, X,
} from "lucide-react";

const GREEN = "#00D964";
const BLACK = "#000000";
const SURFACE = "#141414";
const SURFACE_2 = "#1C1C1C";
const MUTED = "#8A8A8A";
const WHITE = "#F5F5F5";

function randomCardDigits() {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
}

function fmt(n) {
  return Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ---- fictional, non-brand assets ----
const INITIAL_COINS = [
  { id: "c1", name: "NovaCoin", symbol: "NVC", color: "#00D964", amount: 4.812, price: 2140.55, change: 3.2 },
  { id: "c2", name: "PulseChain", symbol: "PLS", color: "#7C8CFF", amount: 1250, price: 0.84, change: -1.4 },
  { id: "c3", name: "Ember", symbol: "EMB", color: "#FF8A4C", amount: 18.4, price: 96.2, change: 5.7 },
];

const INITIAL_STOCKS = [
  { id: "s1", name: "Solstice Corp", ticker: "SOLC", color: "#00D964", shares: 42, price: 188.3, change: 1.8 },
  { id: "s2", name: "Vantage Robotics", ticker: "VNTG", color: "#4CC9FF", shares: 15, price: 412.9, change: -0.6 },
  { id: "s3", name: "Cobalt Materials", ticker: "COBL", color: "#C9A876", shares: 60, price: 74.15, change: 2.1 },
];

const INITIAL_TX = [
  { id: "t1", label: "Design Studio LLC", sub: "Incoming transfer", amount: 4200, type: "in" },
  { id: "t2", label: "Riverside Market", sub: "Groceries", amount: -86.4, type: "out" },
  { id: "t3", label: "Interest Payout", sub: "Savings vault", amount: 312.18, type: "in" },
  { id: "t4", label: "Skyline Utilities", sub: "Electric & water", amount: -142.75, type: "out" },
];

function AssetIcon({ letter, color, size = 36 }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", background: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
        fontSize: size * 0.42, color: BLACK, flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
}

function EditableNumber({ value, onSave, prefix = "", decimals = 2, fontSize = 14, color = WHITE }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value.toFixed(decimals));

  if (editing) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const parsed = parseFloat(draft);
              onSave(!isNaN(parsed) ? parsed : value);
              setEditing(false);
            }
          }}
          onBlur={() => {
            const parsed = parseFloat(draft);
            onSave(!isNaN(parsed) ? parsed : value);
            setEditing(false);
          }}
          inputMode="decimal"
          className="num"
          style={{
            width: 90, fontSize, color, background: SURFACE_2, border: `1px solid ${GREEN}`,
            borderRadius: 6, padding: "2px 6px", outline: "none",
          }}
        />
      </span>
    );
  }
  return (
    <span
      onClick={() => { setDraft(value.toFixed(decimals)); setEditing(true); }}
      className="num"
      style={{ fontSize, color, cursor: "pointer", borderBottom: "1px dashed #333" }}
    >
      {prefix}{fmt(value)}
    </span>
  );
}

function TabBar({ tab, setTab }) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "crypto", label: "Crypto", icon: Coins },
    { id: "trade", label: "Trade", icon: TrendingUp },
    { id: "tx", label: "Activity", icon: List },
  ];
  return (
    <div
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, background: "#0A0A0A",
        borderTop: "1px solid #1E1E1E", display: "flex", justifyContent: "space-around",
        padding: "10px 0 18px", zIndex: 10,
      }}
    >
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: "none", border: "none", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 4, color: active ? GREEN : MUTED, cursor: "pointer",
              fontSize: 10.5, fontWeight: 600,
            }}
          >
            <Icon size={20} color={active ? GREEN : MUTED} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function DemoBadge() {
  return (
    <div
      style={{
        display: "inline-flex", alignItems: "center", gap: 5, background: SURFACE,
        border: `1px solid #2A2A2A`, borderRadius: 20, padding: "4px 10px",
        fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: "0.06em",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN }} />
      DEMO MODE
    </div>
  );
}

function HomeView({ username, setUsername, balance, setBalance, cardLast4, transactions }) {
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(username);
  const [editingBal, setEditingBal] = useState(false);
  const [balDraft, setBalDraft] = useState(balance.toFixed(2));
  const [hidden, setHidden] = useState(false);

  const commitName = () => {
    const trimmed = nameDraft.trim();
    setUsername(trimmed.length ? trimmed : username);
    setEditingName(false);
  };
  const commitBal = () => {
    const parsed = parseFloat(balDraft.replace(/,/g, ""));
    if (!isNaN(parsed) && parsed >= 0) setBalance(parsed);
    else setBalDraft(balance.toFixed(2));
    setEditingBal(false);
  };

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
              <input
                autoFocus value={nameDraft} onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && commitName()}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: WHITE,
                  background: "transparent", border: "none", borderBottom: `2px solid ${GREEN}`,
                  outline: "none", width: 120, padding: "0 0 2px",
                }}
              />
              <button onClick={commitName} aria-label="Save name" style={{ background: GREEN, border: "none", borderRadius: 10, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Check size={14} color={BLACK} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700 }}>Hello, {username}</div>
              <button onClick={() => { setNameDraft(username); setEditingName(true); }} aria-label="Edit name" style={{ background: SURFACE, border: "none", borderRadius: 8, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Pencil size={11} color={GREEN} />
              </button>
            </div>
          )}
        </div>
        <DemoBadge />
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 12, color: MUTED, letterSpacing: "0.06em", fontWeight: 600 }}>TOTAL BALANCE</div>
          <button onClick={() => setHidden((h) => !h)} aria-label={hidden ? "Show balance" : "Hide balance"} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", display: "flex", padding: 4 }}>
            {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {editingBal ? (
            <>
              <span className="num" style={{ fontSize: 40, fontWeight: 700, color: GREEN }}>$</span>
              <input
                autoFocus value={balDraft} onChange={(e) => setBalDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && commitBal()}
                inputMode="decimal" className="num balance-input" style={{ fontSize: 40, fontWeight: 700 }}
              />
              <button onClick={commitBal} aria-label="Save balance" style={{ background: GREEN, border: "none", borderRadius: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                <Check size={16} color={BLACK} />
              </button>
            </>
          ) : (
            <>
              <div className="num" style={{ fontSize: 40, fontWeight: 700, color: GREEN, lineHeight: 1 }}>
                {hidden ? "$ ••••••" : `$${formatted}`}
              </div>
              <button onClick={() => { setBalDraft(balance.toFixed(2)); setEditingBal(true); }} aria-label="Edit balance" style={{ background: SURFACE, border: "none", borderRadius: 10, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                <Pencil size={13} color={GREEN} />
              </button>
            </>
          )}
        </div>
        <div style={{ fontSize: 13, color: GREEN, marginTop: 8, fontWeight: 600 }}>+ 2.4% this month</div>
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
        <div className="num" style={{ marginTop: 26, fontSize: 20, letterSpacing: "0.14em", color: WHITE, fontWeight: 500 }}>
          •••• •••• •••• {cardLast4}
        </div>
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
            <span style={{ color: BLACK, background: GREEN, width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{a.icon}</span>
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
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: item.type === "in" ? GREEN : SURFACE_2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {item.type === "in" ? <ArrowDownRight size={16} color={BLACK} /> : <ArrowUpRight size={16} color={WHITE} />}
                </div>
                <div>
                  <div style={{ fontSize: 13.5, color: WHITE, fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: 11.5, color: MUTED }}>{item.sub}</div>
                </div>
              </div>
              <div className="num" style={{ fontSize: 13.5, color: item.type === "in" ? GREEN : WHITE, fontWeight: 700 }}>
                {item.type === "in" ? "+" : "-"}${fmt(item.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function CryptoView({ coins, setCoins }) {
  const total = coins.reduce((s, c) => s + c.amount * c.price, 0);
  const update = (id, field, value) => setCoins(coins.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700 }}>Crypto</div>
        <DemoBadge />
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 6 }}>PORTFOLIO VALUE</div>
        <div className="num" style={{ fontSize: 34, fontWeight: 700, color: GREEN }}>${fmt(total)}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {coins.map((c) => (
          <div key={c.id} style={{ background: SURFACE, borderRadius: 16, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <AssetIcon letter={c.symbol[0]} color={c.color} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: WHITE }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color: MUTED }}>{c.symbol}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="num" style={{ fontSize: 14, fontWeight: 700, color: WHITE }}>${fmt(c.amount * c.price)}</div>
                <div style={{ fontSize: 11.5, color: c.change >= 0 ? GREEN : MUTED, fontWeight: 600 }}>
