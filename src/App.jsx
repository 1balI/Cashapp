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
