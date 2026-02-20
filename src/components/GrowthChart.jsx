import { useState, useMemo, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const COLORS = [
  "#E63946", "#457B9D", "#2A9D8F", "#E9C46A", "#F4A261",
  "#6A4C93", "#1982C4", "#8AC926", "#FF595E", "#264653",
  "#D62828", "#023E8A", "#606C38", "#BC6C25", "#5F0F40",
];

const formatWealth = (val) => {
  if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
  if (val >= 100) return val.toFixed(0);
  if (val >= 10) return val.toFixed(1);
  return val.toFixed(3);
};

const Popover = ({ children, inTooltip = false, content }) => {
  const [show, setShow] = useState(false);

  return (
    <span
      style={{ position: "relative", display: "inline-block", cursor: "pointer" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow((s) => !s)}
    >
      {children}
      {show && (
        <span
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: inTooltip ? "#1a1a2e" : "rgba(15, 15, 20, 0.97)",
            border: "1px solid rgba(138,201,38,0.3)",
            borderRadius: 6,
            padding: "8px 12px",
            whiteSpace: "nowrap",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "rgba(255,255,255,0.85)",
            zIndex: 1000,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            pointerEvents: "none",
            lineHeight: 1.6,
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
};

const ValuePopover = ({ value, startValue, rate, years, inTooltip = false, children }) => (
  <Popover inTooltip={inTooltip} content={
    <>
      <span style={{ color: "rgba(255,255,255,0.45)", display: "block", fontSize: 9, letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>
        Compound growth formula
      </span>
      <span style={{ color: "#fff" }}>
        {formatWealth(startValue)} × (1 + {(rate / 100).toFixed(4)})^{years}
      </span>
      <br />
      <span style={{ color: value >= startValue ? "#8AC926" : "#E63946", fontWeight: 700 }}>
        = {formatWealth(value)}
      </span>
    </>
  }>
    {children}
  </Popover>
);

const PercentPopover = ({ value, startValue, inTooltip = false, children }) => {
  const growthPct = startValue > 0 ? ((value - startValue) / startValue) * 100 : 0;
  return (
    <Popover inTooltip={inTooltip} content={
      <>
        <span style={{ color: "rgba(255,255,255,0.45)", display: "block", fontSize: 9, letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>
          Percentage growth from base
        </span>
        <span style={{ color: "#fff" }}>
          ({formatWealth(value)} − {formatWealth(startValue)}) / {formatWealth(startValue)} × 100
        </span>
        <br />
        <span style={{ color: "#8AC926", fontWeight: 700 }}>
          = {growthPct >= 0 ? "+" : ""}{growthPct.toFixed(1)}%
        </span>
      </>
    }>
      {children}
    </Popover>
  );
};

const PercentBadge = ({ value, startValue, fontSize = 13, inTooltip = false }) => {
  const growthPct = startValue > 0 ? ((value - startValue) / startValue) * 100 : 0;

  return (
    <PercentPopover value={value} startValue={startValue} inTooltip={inTooltip}>
      <span
        style={{
          color: "#8AC926",
          fontSize,
          fontWeight: 700,
          borderBottom: "1px dashed rgba(138,201,38,0.4)",
          paddingBottom: 1,
        }}
      >
        {growthPct >= 0 ? "+" : ""}{growthPct.toFixed(1)}%
      </span>
    </PercentPopover>
  );
};

const makeCustomTooltip = (startValue, lines, years) => ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(15, 15, 20, 0.95)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 6,
        padding: "10px 14px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 6, fontSize: 11, letterSpacing: 1 }}>
        YEAR {label}
      </div>
      {payload.map((p, i) => {
        const lineId = p.dataKey?.replace("line_", "");
        const line = lines.find((l) => String(l.id) === lineId);
        const rate = line ? line.rate : 0;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
            <span style={{ color: "rgba(255,255,255,0.65)" }}>{p.name}:</span>
            <ValuePopover value={p.value} startValue={startValue} rate={rate} years={label} inTooltip={true}>
              <span style={{ color: "#fff", fontWeight: 600, borderBottom: "1px dashed rgba(255,255,255,0.2)", paddingBottom: 1 }}>{formatWealth(p.value)}</span>
            </ValuePopover>
            <PercentBadge value={p.value} startValue={startValue} fontSize={12} inTooltip={true} />
          </div>
        );
      })}
    </div>
  );
};

export default function GrowthChart() {
  const [lines, setLines] = useState([
    { id: 1, rate: 0, label: "0% growth" },
    { id: 2, rate: 1, label: "1% growth" },
    { id: 3, rate: 5, label: "5% growth" },
  ]);
  const [nextId, setNextId] = useState(4);
  const [years, setYears] = useState(10);
  const [startValue, setStartValue] = useState(1);
  const [editingLabel, setEditingLabel] = useState(null);

  const data = useMemo(() => {
    const points = [];
    for (let y = 0; y <= years; y++) {
      const point = { year: y };
      lines.forEach((line) => {
        point[`line_${line.id}`] = startValue * Math.pow(1 + line.rate / 100, y);
      });
      points.push(point);
    }
    return points;
  }, [lines, years, startValue]);

  const yMax = useMemo(() => {
    let max = startValue;
    lines.forEach((line) => {
      const endVal = startValue * Math.pow(1 + line.rate / 100, years);
      if (endVal > max) max = endVal;
    });
    const rounded = Math.ceil(max * 1.15);
    return Math.max(rounded, startValue + 1);
  }, [lines, years, startValue]);

  const addLine = useCallback(() => {
    const newRate = 3;
    setLines((prev) => [
      ...prev,
      { id: nextId, rate: newRate, label: `${newRate}% growth` },
    ]);
    setNextId((n) => n + 1);
  }, [nextId]);

  const removeLine = useCallback((id) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateRate = useCallback((id, newRate) => {
    const rate = parseFloat(newRate);
    if (isNaN(rate)) return;
    setLines((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, rate, label: l.label === `${l.rate}% growth` ? `${rate}% growth` : l.label } : l
      )
    );
  }, []);

  const updateLabel = useCallback((id, newLabel) => {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, label: newLabel } : l))
    );
  }, []);

  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 4,
    color: "#fff",
    padding: "6px 8px",
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div
      style={{
        color: "#fff",
        fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 3,
              color: "#E63946",
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: 8,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Interactive Model | <a href="https://maximumnewyork.com" target="_blank" rel="noopener noreferrer" style={{ color: "#E63946", textDecoration: "none" }}>Maximum New York</a>
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 300,
              margin: 0,
              letterSpacing: -0.5,
              lineHeight: 1.2,
              color: "rgba(255,255,255,0.95)",
            }}
          >
            The Power of More Economic Growth
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.45)",
              marginTop: 8,
              lineHeight: 1.5,
              maxWidth: 540,
            }}
          >
            Small differences in annual growth rates produce dramatically different outcomes over time.
            Add, remove, or adjust growth scenarios below.
          </p>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
              marginTop: 12,
              lineHeight: 1.5,
              padding: "8px 12px",
              background: "rgba(230,57,70,0.08)",
              border: "1px solid rgba(230,57,70,0.2)",
              borderRadius: 6,
              display: "inline-block",
            }}
          >
            Created to accompany the Maximum New York post <a href="https://www.maximumnewyork.com/p/economic-growth-is-the-best" target="_blank" rel="noopener noreferrer" style={{ color: "#E63946", textDecoration: "none", fontStyle: "italic", borderBottom: "1px solid rgba(230,57,70,0.4)" }}>Economic Growth is the Best</a>
          </p>
        </div>

        {/* Controls Row */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 24,
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: 10,
                letterSpacing: 1.5,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                marginBottom: 6,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Time Horizon
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="range"
                min={5}
                max={50}
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value))}
                style={{
                  width: 100,
                  accentColor: "#E63946",
                  cursor: "pointer",
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.7)",
                  minWidth: 55,
                }}
              >
                {years} yrs
              </span>
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 10,
                letterSpacing: 1.5,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                marginBottom: 6,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Starting Value
            </label>
            <input
              type="number"
              value={startValue}
              min={0.1}
              step={0.5}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (!isNaN(v) && v > 0) setStartValue(v);
              }}
              style={{ ...inputStyle, width: 70 }}
            />
          </div>

          <button
            onClick={addLine}
            style={{
              background: "#E63946",
              border: "none",
              borderRadius: 4,
              color: "#fff",
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'IBM Plex Sans', sans-serif",
              transition: "all 0.2s",
              letterSpacing: 0.3,
            }}
            onMouseEnter={(e) => (e.target.style.background = "#c62f3b")}
            onMouseLeave={(e) => (e.target.style.background = "#E63946")}
          >
            + Add Scenario
          </button>
        </div>

        {/* Chart */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            padding: "24px 12px 12px 0",
            marginBottom: 24,
          }}
        >
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={data} margin={{ top: 8, right: 24, left: 12, bottom: 8 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="year"
                stroke="rgba(255,255,255,0.25)"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
                axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                tickLine={false}
                label={{
                  value: "Years",
                  position: "insideBottom",
                  offset: -2,
                  style: {
                    fill: "rgba(255,255,255,0.3)",
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: 1,
                  },
                }}
              />
              <YAxis
                domain={[0, yMax]}
                stroke="rgba(255,255,255,0.25)"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
                axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                tickLine={false}
                tickFormatter={formatWealth}
                label={{
                  value: "Total Wealth",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  style: {
                    fill: "rgba(255,255,255,0.3)",
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: 1,
                  },
                }}
              />
              <Tooltip content={makeCustomTooltip(startValue, lines, years)} />
              <ReferenceLine
                y={startValue}
                stroke="rgba(255,255,255,0.1)"
                strokeDasharray="6 4"
              />
              {lines.map((line, i) => (
                <Line
                  key={line.id}
                  type="monotone"
                  dataKey={`line_${line.id}`}
                  name={line.label}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: COLORS[i % COLORS.length] }}
                  animationDuration={600}
                  animationEasing="ease-out"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Line Controls */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: 1.5,
              color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 4,
            }}
          >
            Growth Scenarios
          </div>
          {lines.map((line, i) => {
            const color = COLORS[i % COLORS.length];
            const endVal = startValue * Math.pow(1 + line.rate / 100, years);
            const multiplier = endVal / startValue;
            return (
              <div
                key={line.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 6,
                  borderLeft: `3px solid ${color}`,
                  flexWrap: "wrap",
                }}
              >
                {/* Color dot */}
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: color,
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${color}44`,
                  }}
                />

                {/* Label */}
                {editingLabel === line.id ? (
                  <input
                    type="text"
                    value={line.label}
                    onChange={(e) => updateLabel(line.id, e.target.value)}
                    onBlur={() => setEditingLabel(null)}
                    onKeyDown={(e) => e.key === "Enter" && setEditingLabel(null)}
                    autoFocus
                    style={{
                      ...inputStyle,
                      width: 130,
                      fontSize: 13,
                    }}
                  />
                ) : (
                  <span
                    onClick={() => setEditingLabel(line.id)}
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.8)",
                      cursor: "pointer",
                      minWidth: 100,
                      fontWeight: 500,
                      borderBottom: "1px dashed rgba(255,255,255,0.2)",
                      paddingBottom: 1,
                    }}
                    title="Click to rename"
                  >
                    {line.label}
                  </span>
                )}

                {/* Rate Input */}
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <input
                    type="number"
                    value={line.rate}
                    step={0.5}
                    onChange={(e) => updateRate(line.id, e.target.value)}
                    style={{ ...inputStyle, width: 65, textAlign: "right" }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.4)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    %/yr
                  </span>
                </div>

                {/* End Value */}
                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                    →
                  </span>
                  <ValuePopover value={endVal} startValue={startValue} rate={line.rate} years={years}>
                    <span style={{ fontSize: 14, color, fontWeight: 600, borderBottom: "1px dashed rgba(255,255,255,0.2)", paddingBottom: 1 }}>
                      {formatWealth(endVal)}
                    </span>
                  </ValuePopover>
                  <PercentBadge value={endVal} startValue={startValue} fontSize={13} />
                  <span
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    ({multiplier.toFixed(1)}×)
                  </span>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeLine(line.id)}
                  style={{
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 4,
                    color: "rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    padding: "2px 8px",
                    fontSize: 16,
                    lineHeight: 1,
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#E63946";
                    e.target.style.borderColor = "#E63946";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "rgba(255,255,255,0.3)";
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                  title="Remove scenario"
                >
                  ×
                </button>
              </div>
            );
          })}

          {lines.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 32,
                color: "rgba(255,255,255,0.3)",
                fontSize: 14,
              }}
            >
              No scenarios yet. Click "Add Scenario" to begin.
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div
          style={{
            marginTop: 32,
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            fontSize: 11,
            color: "rgba(255,255,255,0.25)",
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 1.6,
          }}
        >
          Formula: Value = Start × (1 + rate)^years &nbsp;·&nbsp; Compound annual growth
          <br />
          Brought to you by <a href="https://linkedin.com/in/danielgolliher" target="_blank" rel="noopener noreferrer" style={{ color: "#E63946", textDecoration: "none", borderBottom: "1px solid rgba(230,57,70,0.3)" }}>Daniel Golliher</a> and <a href="https://maximumnewyork.com" target="_blank" rel="noopener noreferrer" style={{ color: "#E63946", textDecoration: "none", borderBottom: "1px solid rgba(230,57,70,0.3)" }}>Maximum New York</a>
        </div>
      </div>
    </div>
  );
}
