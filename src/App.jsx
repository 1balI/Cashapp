import React, { useState, useMemo } from "react";
import { Eye, EyeOff, Pencil, Check, ArrowUpRight, ArrowDownRight, Plus, Send, Download, Wifi } from "lucide-react";

const GREEN = "#00D964";
const BLACK = "#000000";
const SURFACE = "#141414";
const SURFACE_2 = "#1C1C1C";
const MUTED = "#8A8A8A";
const WHITE = "#F5F5F5";

function randomCardDigits() {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function FinanceDashboard() {
  const [username, setUsername] = useState("Alex");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("Alex");

  const [balance, setBalance] = useState(128450.32);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(balance.toFixed(2));
  const [hidden, setHidden] = useState(false);

  const cardLast4 = useMemo(() => randomCardDigits(), []);

  const commitName = () => {
    const trimmed = nameDraft.trim();
    setUsername(trimmed.length ? trimmed : username);
    setEditingName(false);
  };

  const commitEdit = () => {
    const parsed = parseFloat(draft.replace(/,/g, ""));
    if (!isNaN(parsed) && parsed >= 0) {
      setBalance(parsed);
    } else {
      setDraft(balance.toFixed(2));
    }
    setEditing(false);
  };

  const formatted = balance.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const activity = [
    { label: "Design Studio LLC", sub: "Incoming transfer", amount: 4200, type: "in" },
    { label: "Riverside Market", sub: "Groceries", amount: -86.4, type: "out" },
    { label: "Interest Payout", sub: "Savings vault", amount: 312.18, type: "in" },
    { label: "Skyline Utilities", sub: "Electric & water", amount: -142.75, type: "out" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: BLACK,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: WHITE,
        padding: "28px 18px 60px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .num { font-family: 'Space Grotesk', monospace; font-variant-numeric: tabular-nums; }
        .balance-input {
          font-family: 'Space Grotesk', monospace;
          font-variant-numeric: tabular-nums;
          background: transparent;
          border: none;
          outline: none;
          color: ${GREEN};
          width: 100%;
        }
        .fade-up { animation: fadeUp .45s ease both; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(8px);} to {opacity:1; transform:none;} }
        button { font-family: inherit; }
        button:focus-visible, input:focus-visible {
          outline: 2px solid ${GREEN};
          outline-offset: 2px;
        }
        .action-btn { transition: background 0.15s ease; }
        .action-btn:active { background: #262626 !important; }
      `}</style>

      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        {/* Greeting */}
        <div className="fade-up" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 4, fontWeight: 500 }}>
            {greeting}
          </div>
          {editingName ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                }}
              >
                Hello,
              </span>
              <input
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && commitName()}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: WHITE,
                  background: "transparent",
                  border: "none",
                  borderBottom: `2px solid ${GREEN}`,
                  outline: "none",
                  width: 140,
                  padding: "0 0 2px",
                }}
              />
              <button
                onClick={commitName}
                aria-label="Save name"
                style={{
                  background: GREEN,
                  border: "none",
                  borderRadius: 10,
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <Check size={15} color={BLACK} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                }}
              >
                Hello, {username}
              </div>
              <button
                onClick={() => {
                  setNameDraft(username);
                  setEditingName(true);
                }}
                aria-label="Edit name"
                className="action-btn"
                style={{
                  background: SURFACE,
                  border: "none",
                  borderRadius: 8,
                  width: 26,
                  height: 26,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <Pencil size={12} color={GREEN} />
              </button>
            </div>
          )}
        </div>

        {/* Balance - hero */}
        <div className="fade-up" style={{ marginBottom: 22 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <div style={{ fontSize: 12, color: MUTED, letterSpacing: "0.06em", fontWeight: 600 }}>
              TOTAL BALANCE
            </div>
            <button
              onClick={() => setHidden((h) => !h)}
              aria-label={hidden ? "Show balance" : "Hide balance"}
              style={{
                background: "none",
                border: "none",
                color: MUTED,
                cursor: "pointer",
                display: "flex",
                padding: 4,
              }}
            >
              {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {editing ? (
              <>
                <span
                  className="num"
                  style={{ fontSize: 44, fontWeight: 700, color: GREEN }}
                >
                  $
                </span>
                <input
                  className="balance-input"
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                  style={{ fontSize: 44, fontWeight: 700 }}
                  inputMode="decimal"
                />
                <button
                  onClick={commitEdit}
                  aria-label="Save balance"
                  style={{
                    background: GREEN,
                    border: "none",
                    borderRadius: 12,
                    width: 38,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <Check size={18} color={BLACK} />
                </button>
              </>
            ) : (
              <>
                <div
                  className="num"
                  style={{ fontSize: 44, fontWeight: 700, color: GREEN, lineHeight: 1 }}
                >
                  {hidden ? "$ ••••••" : `$${formatted}`}
                </div>
                <button
                  onClick={() => {
                    setDraft(balance.toFixed(2));
                    setEditing(true);
                  }}
                  aria-label="Edit balance"
                  className="action-btn"
                  style={{
                    background: SURFACE,
                    border: "none",
                    borderRadius: 10,
                    width: 34,
                    height: 34,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <Pencil size={14} color={GREEN} />
                </button>
              </>
            )}
          </div>
          <div style={{ fontSize: 13, color: GREEN, marginTop: 8, fontWeight: 600 }}>
            + 2.4% this month
          </div>
        </div>

        {/* Card */}
        <div
          className="fade-up"
          style={{
            position: "relative",
            borderRadius: 20,
            padding: 24,
            height: 190,
            background: SURFACE,
            border: `1px solid #262626`,
            overflow: "hidden",
            marginBottom: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            {/* EMV chip */}
            <div
              style={{
                width: 44,
                height: 34,
                borderRadius: 7,
                background: "#C7C1A8",
                position: "relative",
                overflow: "hidden",
                border: "1px solid #8F8A73",
              }}
            >
              {/* contact pad segments */}
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "#8F8A73" }} />
              <div style={{ position: "absolute", top: "33%", left: 0, right: 0, height: 1, background: "#8F8A73" }} />
              <div style={{ position: "absolute", top: "66%", left: 0, right: 0, height: 1, background: "#8F8A73" }} />
              <div style={{ position: "absolute", left: "22%", top: 0, bottom: 0, width: 1, background: "#8F8A73" }} />
              <div style={{ position: "absolute", left: "78%", top: 0, bottom: 0, width: 1, background: "#8F8A73" }} />
              <div
                style={{
                  position: "absolute",
                  left: "30%",
                  right: "30%",
                  top: "22%",
                  bottom: "22%",
                  border: "1px solid #8F8A73",
                  borderRadius: 3,
                }}
              />
            </div>

            {/* NFC / contactless symbol */}
            <Wifi size={20} color={MUTED} style={{ transform: "rotate(90deg)" }} />
          </div>

          <div
            className="num"
            style={{
              marginTop: 26,
              fontSize: 20,
              letterSpacing: "0.14em",
              color: WHITE,
              fontWeight: 500,
            }}
          >
            •••• •••• •••• {cardLast4}
          </div>

          <div
            style={{
              marginTop: 22,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div>
              <div style={{ fontSize: 10, color: MUTED, marginBottom: 3, fontWeight: 600 }}>
                CARD HOLDER
              </div>
              <div style={{ fontSize: 13, color: WHITE, fontWeight: 500 }}>
                {username.toUpperCase()}
              </div>
            </div>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                fontStyle: "italic",
                color: WHITE,
                letterSpacing: "-0.01em",
              }}
            >
              VISA
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div
          className="fade-up"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            marginBottom: 26,
          }}
        >
          {[
            { label: "Add funds", icon: <Plus size={18} /> },
            { label: "Send", icon: <Send size={17} /> },
            { label: "Request", icon: <Download size={17} /> },
          ].map((a) => (
            <button
              key={a.label}
              className="action-btn"
              style={{
                background: SURFACE,
                border: "none",
                borderRadius: 16,
                padding: "16px 8px",
                color: WHITE,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  color: BLACK,
                  background: GREEN,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {a.icon}
              </span>
              {a.label}
            </button>
          ))}
        </div>

        {/* Activity */}
        <div className="fade-up">
          <div
            style={{
              fontSize: 12,
              color: MUTED,
              letterSpacing: "0.06em",
              marginBottom: 12,
              fontWeight: 600,
            }}
          >
            RECENT ACTIVITY
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {activity.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: SURFACE,
                  borderRadius: 14,
                  padding: "13px 14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: item.type === "in" ? GREEN : SURFACE_2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.type === "in" ? (
                      <ArrowDownRight size={16} color={BLACK} />
                    ) : (
                      <ArrowUpRight size={16} color={WHITE} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, color: WHITE, fontWeight: 500 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 11.5, color: MUTED }}>{item.sub}</div>
                  </div>
                </div>
                <div
                  className="num"
                  style={{
                    fontSize: 13.5,
                    color: item.type === "in" ? GREEN : WHITE,
                    fontWeight: 700,
                  }}
                >
                  {item.type === "in" ? "+" : "-"}$
                  {Math.abs(item.amount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 26,
            fontSize: 9.5,
            color: "#4A4A4A",
            letterSpacing: "0.04em",
          }}
        >
          Simulated data for entertainment purposes
        </div>
      </div>
    </div>
  );
}
