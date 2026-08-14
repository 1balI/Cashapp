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
  const greeting =
