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
                  {c.change >= 0 ? "+" : ""}{c.change}%
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: MUTED, borderTop: "1px solid #232323", paddingTop: 10 }}>
              <span>Holdings: <EditableNumber value={c.amount} onSave={(v) => update(c.id, "amount", v)} decimals={3} color={WHITE} fontSize={12} /></span>
              <span>Price: <EditableNumber value={c.price} onSave={(v) => update(c.id, "price", v)} prefix="$" color={WHITE} fontSize={12} /></span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function TradeView({ stocks, setStocks }) {
  const total = stocks.reduce((s, x) => s + x.shares * x.price, 0);
  const update = (id, field, value) => setStocks(stocks.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700 }}>Trade</div>
        <DemoBadge />
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, letterSpacing: "0.06em", marginBottom: 6 }}>PORTFOLIO VALUE</div>
        <div className="num" style={{ fontSize: 34, fontWeight: 700, color: GREEN }}>${fmt(total)}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {stocks.map((s) => (
          <div key={s.id} style={{ background: SURFACE, borderRadius: 16, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <AssetIcon letter={s.ticker[0]} color={s.color} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: WHITE }}>{s.name}</div>
                <div style={{ fontSize: 11.5, color: MUTED }}>{s.ticker}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="num" style={{ fontSize: 14, fontWeight: 700, color: WHITE }}>${fmt(s.shares * s.price)}</div>
                <div style={{ fontSize: 11.5, color: s.change >= 0 ? GREEN : MUTED, fontWeight: 600 }}>
                  {s.change >= 0 ? "+" : ""}{s.change}%
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: MUTED, borderTop: "1px solid #232323", paddingTop: 10 }}>
              <span>Shares: <EditableNumber value={s.shares} onSave={(v) => update(s.id, "shares", v)} decimals={0} color={WHITE} fontSize={12} /></span>
              <span>Price: <EditableNumber value={s.price} onSave={(v) => update(s.id, "price", v)} prefix="$" color={WHITE} fontSize={12} /></span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function TxView({ transactions, setTransactions }) {
  const [showAdd, setShowAdd] = useState(false);
  const [label, setLabel] = useState("");
  const [sub, setSub] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("in");

  const addTx = () => {
    if (!label.trim() || !amount) return;
    const val = Math.abs(parseFloat(amount)) || 0;
    setTransactions([
      { id: `t${Date.now()}`, label: label.trim(), sub: sub.trim() || "Manual entry", amount: type === "in" ? val : -val, type },
      ...transactions,
    ]);
    setLabel(""); setSub(""); setAmount(""); setType("in"); setShowAdd(false);
  };

  const removeTx = (id) => setTransactions(transactions.filter((t) => t.id !== id));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700 }}>Activity</div>
        <button onClick={() => setShowAdd(true)} style={{ background: GREEN, border: "none", borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label="Add transaction">
          <Plus size={18} color={BLACK} />
        </button>
      </div>

      {showAdd && (
        <div style={{ background: SURFACE, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: WHITE }}>New transaction</div>
            <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={16} color={MUTED} /></button>
          </div>
          <input placeholder="Label (e.g. Coffee Shop)" value={label} onChange={(e) => setLabel(e.target.value)}
            style={{ width: "100%", background: SURFACE_2, border: "1px solid #2A2A2A", borderRadius: 10, padding: "10px 12px", color: WHITE, fontSize: 13, marginBottom: 8, outline: "none" }} />
          <input placeholder="Note (optional)" value={sub} onChange={(e) => setSub(e.target.value)}
            style={{ width: "100%", background: SURFACE_2, border: "1px solid #2A2A2A", borderRadius: 10, padding: "10px 12px", color: WHITE, fontSize: 13, marginBottom: 8, outline: "none" }} />
          <input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal"
            style={{ width: "100%", background: SURFACE_2, border: "1px solid #2A2A2A", borderRadius: 10, padding: "10px 12px", color: WHITE, fontSize: 13, marginBottom: 10, outline: "none" }} />
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button onClick={() => setType("in")} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer", background: type === "in" ? GREEN : SURFACE_2, color: type === "in" ? BLACK : WHITE, fontWeight: 600, fontSize: 12.5 }}>Incoming</button>
            <button onClick={() => setType("out")} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer", background: type === "out" ? GREEN : SURFACE_2, color: type === "out" ? BLACK : WHITE, fontWeight: 600, fontSize: 12.5 }}>Outgoing</button>
          </div>
          <button onClick={addTx} style={{ width: "100%", background: GREEN, border: "none", borderRadius: 10, padding: "10px 0", color: BLACK, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Add</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {transactions.map((item) => (
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
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="num" style={{ fontSize: 13.5, color: item.type === "in" ? GREEN : WHITE, fontWeight: 700 }}>
                {item.type === "in" ? "+" : "-"}${fmt(item.amount)}
              </div>
              <button onClick={() => removeTx(item.id)} aria-label="Delete" style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                <Trash2 size={14} color={MUTED} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function FinanceDashboard() {
  const [tab, setTab] = useState("home");
  const [username, setUsername] = useState("Alex");
  const [balance, setBalance] = useState(128450.32);
  const [coins, setCoins] = useState(INITIAL_COINS);
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [transactions, setTransactions] = useState(INITIAL_TX);
  const cardLast4 = useMemo(() => randomCardDigits(), []);

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: BLACK, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: WHITE, padding: "28px 18px 100px", boxSizing: "border-box" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .num { font-family: 'Space Grotesk', monospace; font-variant-numeric: tabular-nums; }
        .balance-input { font-family: 'Space Grotesk', monospace; font-variant-numeric: tabular-nums; background: transparent; border: none; outline: none; color: ${GREEN}; width: 100%; }
        button { font-family: inherit; }
        button:focus-visible, input:focus-visible { outline: 2px solid ${GREEN}; outline-offset: 2px; }
        input::placeholder { color: #6A6A6A; }
      `}</style>

      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        {tab === "home" && (
          <HomeView username={username} setUsername={setUsername} balance={balance} setBalance={setBalance} cardLast4={cardLast4} transactions={transactions} />
        )}
        {tab === "crypto" && <CryptoView coins={coins} setCoins={setCoins} />}
        {tab === "trade" && <TradeView stocks={stocks} setStocks={setStocks} />}
        {tab === "tx" && <TxView transactions={transactions} setTransactions={setTransactions} />}

        <div style={{ textAlign: "center", marginTop: 26, fontSize: 9.5, color: "#4A4A4A", letterSpacing: "0.04em" }}>
          Simulated data for entertainment purposes
        </div>
      </div>

      <TabBar tab={tab} setTab={setTab} />
    </div>
  );
}
    
