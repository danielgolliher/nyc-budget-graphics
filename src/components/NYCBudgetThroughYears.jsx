import { useState, useCallback, useRef } from "react";
import html2canvas from "html2canvas";
import ShareMenu from "./ShareMenu";
import {
  ComposedChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

/* ─── RAW DATA from user's Google Sheet (exact figures) ─── */
const rawData = [
  { fy: 2002, raw: 39698060747, mayor: "Giuliani", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc7_02b.pdf", sourceLabel: "OMB FY02 Adopted" },
  { fy: 2003, raw: 42342693648, mayor: "Bloomberg", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc7_02b.pdf", sourceLabel: "OMB FY02 Adopted" },
  { fy: 2004, raw: 43658214665, mayor: "Bloomberg", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc7_04.pdf", sourceLabel: "OMB FY04 Adopted" },
  { fy: 2005, raw: 47209537582, mayor: "Bloomberg", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc7_04.pdf", sourceLabel: "OMB FY04 Adopted" },
  { fy: 2006, raw: 50187618768, mayor: "Bloomberg", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc7_06.pdf", sourceLabel: "OMB FY06 Adopted" },
  { fy: 2007, raw: 52940235260, mayor: "Bloomberg", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc7_06.pdf", sourceLabel: "OMB FY06 Adopted" },
  { fy: 2008, raw: 58964853062, mayor: "Bloomberg", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc6_08.pdf", sourceLabel: "OMB FY08 Adopted" },
  { fy: 2009, raw: 59169332665, mayor: "Bloomberg", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc6_08.pdf", sourceLabel: "OMB FY08 Adopted" },
  { fy: 2010, raw: 59479863786, mayor: "Bloomberg", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc6_10.pdf", sourceLabel: "OMB FY10 Adopted" },
  { fy: 2011, raw: 63077044552, mayor: "Bloomberg", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc6_10.pdf", sourceLabel: "OMB FY10 Adopted" },
  { fy: 2012, raw: 65910705998, mayor: "Bloomberg", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc6_12.pdf", sourceLabel: "OMB FY12 Adopted" },
  { fy: 2013, raw: 68501044477, mayor: "Bloomberg", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc6_12.pdf", sourceLabel: "OMB FY12 Adopted" },
  { fy: 2014, raw: 69916832926, mayor: "Bloomberg", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc6_14.pdf", sourceLabel: "OMB FY14 Adopted" },
  { fy: 2015, raw: 75026906545, mayor: "de Blasio", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc6_14.pdf", sourceLabel: "OMB FY14 Adopted" },
  { fy: 2016, raw: 78528034085, mayor: "de Blasio", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc6_16.pdf", sourceLabel: "OMB FY16 Adopted" },
  { fy: 2017, raw: 82115790244, mayor: "de Blasio", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc6_16.pdf", sourceLabel: "OMB FY16 Adopted" },
  { fy: 2018, raw: 85238681837, mayor: "de Blasio", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc6_18.pdf", sourceLabel: "OMB FY18 Adopted" },
  { fy: 2019, raw: 89158064224, mayor: "de Blasio", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc6_18.pdf", sourceLabel: "OMB FY18 Adopted" },
  { fy: 2020, raw: 92771874627, mayor: "de Blasio", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc6_20.pdf", sourceLabel: "OMB FY20 Adopted" },
  { fy: 2021, raw: 88191953188, mayor: "de Blasio", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc6_20.pdf", sourceLabel: "OMB FY20 Adopted" },
  { fy: 2022, raw: 98723402321, mayor: "de Blasio", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc6_22.pdf", sourceLabel: "OMB FY22 Adopted" },
  { fy: 2023, raw: 101123813371, mayor: "Adams", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc6_22.pdf", sourceLabel: "OMB FY22 Adopted" },
  { fy: 2024, raw: 107114535200, mayor: "Adams", source: "https://www.nyc.gov/assets/omb/downloads/pdf/erc6-23.pdf", sourceLabel: "OMB FY23 Adopted" },
  { fy: 2025, raw: 112431582240, mayor: "Adams", source: "https://www.nyc.gov/assets/omb/downloads/pdf/adopt25/erc6-25.pdf", sourceLabel: "OMB FY25 Adopted" },
  { fy: 2026, raw: 115907309727, mayor: "Adams", source: "https://www.nyc.gov/assets/omb/downloads/pdf/adopt25/erc6-25.pdf", sourceLabel: "OMB FY25 Adopted" },
];

/* ─── INFLATION DATA (NYC Metro CPI-U, BLS Series CUURS12ASA0) ─── */
const inflationData = {
  2002: 2.18, 2003: 2.91, 2004: 3.29, 2005: 3.67, 2006: 4.04,
  2007: 3.12, 2008: 3.38, 2009: 2.28, 2010: 1.12, 2011: 1.91,
  2012: 2.78, 2013: 1.75, 2014: 1.55, 2015: 0.48, 2016: 0.58,
  2017: 1.76, 2018: 1.78, 2019: 1.77, 2020: 1.77, 2021: 2.06,
  2022: 5.05, 2023: 5.29, 2024: 3.43, 2025: 3.90,
};

const allBudgetData = rawData.map((d, i, arr) => {
  const budget = d.raw / 1e9; // convert to billions
  const prevRaw = i > 0 ? arr[i - 1].raw : null;
  const pctChange = prevRaw !== null ? parseFloat((((d.raw - prevRaw) / prevRaw) * 100).toFixed(1)) : null;
  const dollarChange = prevRaw !== null ? ((d.raw - prevRaw) / 1e9).toFixed(2) : null;
  const inflationPct = inflationData[d.fy] ?? null;
  return { ...d, budget, pctChange, dollarChange, inflationPct };
});

const mayorColors = {
  Giuliani: "#6B7280",
  Bloomberg: "#2563EB",
  "de Blasio": "#059669",
  Adams: "#D97706",
};

const mayorTerms = [
  { name: "Giuliani", start: 2002, end: 2002 },
  { name: "Bloomberg", start: 2003, end: 2014 },
  { name: "de Blasio", start: 2015, end: 2022 },
  { name: "Adams", start: 2023, end: 2026 },
];

const allFYs = allBudgetData.map((d) => d.fy);
const mono = "'JetBrains Mono', monospace";
const serif = "'Playfair Display', Georgia, serif";

const fmtSign = (val, suffix = "%") => {
  const n = parseFloat(val);
  if (isNaN(n)) return "\u2014";
  const sign = n > 0 ? "+" : n < 0 ? "\u2212" : "";
  return `${sign}${Math.abs(n)}${suffix}`;
};
const fmtBillions = (raw) => `$${(raw / 1e9).toFixed(2)}B`;
const fmtSignDollar = (val) => {
  const n = parseFloat(val);
  if (isNaN(n)) return "\u2014";
  const sign = n > 0 ? "+" : n < 0 ? "\u2212" : "";
  return `${sign}$${Math.abs(n).toFixed(2)}B`;
};

/* ─── Detail Panel ─── */
const DetailPanel = ({ data, label, locked, onUnlock }) => {
  if (!data) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontFamily: mono, fontSize: "11px", color: "#475569", minHeight: "48px" }}>
        {label === "budget" ? "Hover over the chart to see details \u2022 Click to freeze" : "Hover over a bar to see details \u2022 Click to freeze"}
      </div>
    );
  }
  const d = data;
  const isUp = d.pctChange !== null && d.pctChange >= 0;

  const lockIndicator = locked ? (
    <span onClick={(e) => { e.stopPropagation(); onUnlock(); }}
      style={{ fontFamily: mono, fontSize: "10px", color: "#475569", cursor: "pointer", padding: "2px 8px", borderRadius: "4px", border: "1px solid #334155", marginLeft: "auto", userSelect: "none", flexShrink: 0 }}
      title="Click to unfreeze">
      &#128274; Frozen &mdash; click to unfreeze
    </span>
  ) : (
    <span style={{ fontFamily: mono, fontSize: "10px", color: "#334155", marginLeft: "auto", flexShrink: 0 }}>click to freeze</span>
  );

  const sourceBtn = (
    <a href={d.source} target="_blank" rel="noopener noreferrer"
      style={{ fontFamily: mono, fontSize: "11px", color: "#60A5FA", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "6px", border: "1px solid rgba(96,165,250,0.2)", background: "rgba(96,165,250,0.06)", transition: "background 0.15s", flexShrink: 0 }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(96,165,250,0.14)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(96,165,250,0.06)")}
      onClick={(e) => e.stopPropagation()}>
      &#128279; {d.sourceLabel} <span style={{ opacity: 0.5 }}>&#8599;</span>
    </a>
  );

  if (label === "pct") {
    if (d.pctChange === null) return null;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "20px", height: "100%", flexWrap: "wrap", minHeight: "48px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <span style={{ fontFamily: mono, fontSize: "11px", color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>FY {d.fy} <span style={{ color: "#536178", fontWeight: 400, fontSize: "10px", letterSpacing: "0.04em" }}>(Passed {d.fy - 1})</span> vs FY {d.fy - 1} <span style={{ color: "#536178", fontWeight: 400, fontSize: "10px", letterSpacing: "0.04em" }}>(Passed {d.fy - 2})</span></span>
            <span style={{ fontFamily: mono, fontSize: "10px", color: mayorColors[d.mayor], background: `${mayorColors[d.mayor]}18`, padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>{d.mayor}</span>
          </div>
          <span style={{ fontFamily: serif, fontSize: "26px", fontWeight: 700, color: !isUp ? "#F87171" : "#34D399" }}>
            {fmtSign(d.pctChange)}
          </span>
        </div>
        <div style={{ fontFamily: mono, fontSize: "12px", color: "#94A3B8", lineHeight: 1.8 }}>
          <span style={{ color: "#64748B" }}>{fmtBillions(d.raw - parseFloat(d.dollarChange) * 1e9)}</span>
          <span style={{ color: "#475569", margin: "0 6px" }}>&rarr;</span>
          <span style={{ color: "#CBD5E1" }}>{fmtBillions(d.raw)}</span>
          <span style={{ color: "#475569", marginLeft: "8px" }}>({fmtSignDollar(d.dollarChange)})</span>
        </div>
        {sourceBtn}
        {lockIndicator}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px", height: "100%", flexWrap: "wrap", minHeight: "48px" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <span style={{ fontFamily: mono, fontSize: "11px", color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>FY {d.fy} <span style={{ color: "#536178", fontWeight: 400, fontSize: "10px", letterSpacing: "0.04em" }}>(Passed {d.fy - 1})</span></span>
          <span style={{ fontFamily: mono, fontSize: "10px", color: mayorColors[d.mayor], background: `${mayorColors[d.mayor]}18`, padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>{d.mayor}</span>
        </div>
        <span style={{ fontFamily: serif, fontSize: "26px", color: "#F8FAFC", fontWeight: 700 }}>{fmtBillions(d.raw)}</span>
      </div>
      {d.pctChange !== null && (
        <div style={{ fontFamily: mono, fontSize: "13px", fontWeight: 700, color: !isUp ? "#F87171" : "#34D399" }}>
          {isUp ? "\u25B2" : "\u25BC"} {fmtSign(d.pctChange)}
          <span style={{ fontFamily: mono, fontSize: "11px", color: "#64748B", fontWeight: 400, marginLeft: "6px" }}>
            ({fmtSignDollar(d.dollarChange)})
          </span>
        </div>
      )}
      {sourceBtn}
      {lockIndicator}
    </div>
  );
};

const NoTooltip = () => null;

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  if (!cx || !cy) return null;
  return <circle cx={cx} cy={cy} r={3.5} fill={mayorColors[payload.mayor] || "#94A3B8"} stroke="#0F172A" strokeWidth={1.5} style={{ cursor: "pointer" }} />;
};

const ActiveDot = (props) => {
  const { cx, cy, payload } = props;
  if (!cx || !cy) return null;
  const color = mayorColors[payload.mayor] || "#94A3B8";
  return (
    <g style={{ cursor: "pointer" }}>
      <circle cx={cx} cy={cy} r={14} fill={color} opacity={0.15} />
      <circle cx={cx} cy={cy} r={8} fill={color} opacity={0.3} />
      <circle cx={cx} cy={cy} r={5} fill={color} stroke="#F8FAFC" strokeWidth={2} />
    </g>
  );
};

const FYSelect = ({ value, onChange, options, label }) => (
  <div>
    <label style={{ fontFamily: mono, fontSize: "9px", color: "#64748B", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>{label}</label>
    <select value={value} onChange={(e) => onChange(parseInt(e.target.value))}
      style={{ fontFamily: mono, fontSize: "11px", fontWeight: 600, color: "#F8FAFC", background: "#1E293B", border: "1px solid #334155", borderRadius: "6px", padding: "6px 24px 6px 8px", cursor: "pointer", appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394A3B8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center", outline: "none", transition: "border-color 0.15s", maxWidth: "100%" }}
      onFocus={(e) => (e.target.style.borderColor = "#60A5FA")}
      onBlur={(e) => (e.target.style.borderColor = "#334155")}>
      {options.map((fy) => (<option key={fy} value={fy}>FY {fy} (P. {fy - 1})</option>))}
    </select>
  </div>
);

/* ─── Main ─── */
export default function NYCBudgetChart() {
  const [startFY, setStartFY] = useState(2002);
  const [endFY, setEndFY] = useState(2026);
  const [selectedMayor, setSelectedMayor] = useState(null);
  const [hoveredBudget, setHoveredBudget] = useState(null);
  const [hoveredPct, setHoveredPct] = useState(null);
  const [lockedBudget, setLockedBudget] = useState(null);
  const [lockedPct, setLockedPct] = useState(null);
  const [showInflation, setShowInflation] = useState(false);

  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const headerRef = useRef(null);

  const handleMayorSelect = (mayorName) => {
    if (mayorName === null || mayorName === selectedMayor) {
      setSelectedMayor(null);
      setStartFY(2002);
      setEndFY(2026);
    } else {
      setSelectedMayor(mayorName);
      const term = mayorTerms.find((m) => m.name === mayorName);
      if (term) { setStartFY(term.start); setEndFY(term.end); }
    }
    setLockedBudget(null);
    setLockedPct(null);
  };

  const displayBudget = lockedBudget || hoveredBudget;
  const displayPct = lockedPct || hoveredPct;

  const startData = allBudgetData.find((d) => d.fy === startFY);
  const endData = allBudgetData.find((d) => d.fy === endFY);
  const span = endFY - startFY;

  const totalGrowthNum = startData && endData ? ((endData.raw - startData.raw) / startData.raw) * 100 : 0;
  const dollarGrowthNum = startData && endData ? (endData.raw - startData.raw) / 1e9 : 0;

  const rangeData = allBudgetData.filter((d) => d.fy > startFY && d.fy <= endFY && d.pctChange !== null);
  const avgGrowthNum = rangeData.length > 0 ? rangeData.reduce((s, d) => s + d.pctChange, 0) / rangeData.length : 0;

  const inflationRange = allBudgetData.filter((d) => d.fy > startFY && d.fy <= endFY && d.inflationPct != null);
  const avgInflationNum = inflationRange.length > 0 ? inflationRange.reduce((s, d) => s + d.inflationPct, 0) / inflationRange.length : 0;

  const budgetData = allBudgetData.filter((d) => d.fy >= startFY && d.fy <= endFY);
  const pctData = budgetData.filter((d) => d.pctChange !== null);

  const startOptions = allFYs.filter((fy) => fy < endFY);
  const endOptions = allFYs.filter((fy) => fy > startFY);

  const handleBudgetHover = useCallback((state) => {
    if (state && state.activePayload && state.activePayload.length) setHoveredBudget(state.activePayload[0].payload);
  }, []);
  const handleBudgetClick = useCallback((state) => {
    if (state && state.activePayload && state.activePayload.length) setLockedBudget(state.activePayload[0].payload);
  }, []);
  const handlePctHover = useCallback((state) => {
    if (state && state.activePayload && state.activePayload.length) setHoveredPct(state.activePayload[0].payload);
  }, []);
  const handlePctClick = useCallback((state) => {
    if (state && state.activePayload && state.activePayload.length) setLockedPct(state.activePayload[0].payload);
  }, []);

  const budgetBillions = budgetData.map((d) => d.budget);
  const yMin = Math.floor((Math.min(...budgetBillions) - 5) / 10) * 10;
  const yMax = Math.ceil((Math.max(...budgetBillions) + 5) / 10) * 10;
  const yTicks = [];
  for (let t = yMin; t <= yMax; t += 20) yTicks.push(t);

  const pctVals = pctData.map((d) => d.pctChange);
  const pctMin = Math.min(...pctVals, 0);
  const pctMax = Math.max(...pctVals, 5);

  const chartColor = selectedMayor ? mayorColors[selectedMayor] : "#D97706";

  const pageUrl = window.location.href;

  const createCompositeDownload = useCallback(async (chartRef, chartId, lockedData) => {
    if (!chartRef.current || !headerRef.current) return;
    try {
      // Capture current select values before cloning (cloneNode doesn't preserve selectedIndex)
      const origSelects = headerRef.current.querySelectorAll("select");
      const selectValues = Array.from(origSelects).map((sel) => ({
        index: sel.selectedIndex,
        text: sel.options[sel.selectedIndex]?.text || sel.value,
      }));

      // Clone header and prepend to chart card
      const headerClone = headerRef.current.cloneNode(true);
      headerClone.style.marginBottom = "24px";

      // Replace <select> elements with plain text spans showing current values
      const clonedSelects = headerClone.querySelectorAll("select");
      clonedSelects.forEach((sel, i) => {
        const span = document.createElement("span");
        span.textContent = selectValues[i]?.text || sel.value;
        span.style.cssText = window.getComputedStyle(origSelects[i]).cssText;
        span.style.display = "inline-block";
        span.style.appearance = "none";
        span.style.webkitAppearance = "none";
        span.style.color = "#F8FAFC";
        sel.parentNode.replaceChild(span, sel);
      });

      chartRef.current.insertBefore(headerClone, chartRef.current.firstChild);

      // Hide empty detail panel if no locked data
      const detailPanel = chartRef.current.querySelector("[data-detail-panel]");
      if (detailPanel && !lockedData) detailPanel.style.display = "none";

      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#0F172A",
        scale: 2,
        useCORS: true,
        ignoreElements: (el) => el.classList.contains("share-menu-controls"),
      });

      // Restore DOM
      chartRef.current.removeChild(headerClone);
      if (detailPanel && !lockedData) detailPanel.style.display = "";

      // Add credit bar
      const creditH = 40;
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height + creditH * 2;
      const ctx = finalCanvas.getContext("2d");
      ctx.drawImage(canvas, 0, 0);
      ctx.fillStyle = "#BE5343";
      ctx.fillRect(0, canvas.height, finalCanvas.width, creditH * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `${13 * 2}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        `Source: Maximum New York | maximumnewyork.com | ${pageUrl}`,
        finalCanvas.width / 2,
        canvas.height + creditH,
      );

      const link = document.createElement("a");
      link.download = `${chartId}.png`;
      link.href = finalCanvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  }, [pageUrl]);

  const handleDownloadChart1 = useCallback(() => {
    createCompositeDownload(chart1Ref, "nyc-total-budget-2002-2026", lockedBudget);
  }, [createCompositeDownload, lockedBudget]);

  const handleDownloadChart2 = useCallback(() => {
    createCompositeDownload(chart2Ref, "nyc-budget-yoy-change-2002-2026", lockedPct);
  }, [createCompositeDownload, lockedPct]);

  return (
    <div style={{ background: "linear-gradient(145deg, #0B1120 0%, #111827 50%, #0F172A 100%)", minHeight: "100vh", padding: "40px 24px", fontFamily: "'Segoe UI', system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.04) 1px, transparent 0)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header + Controls (captured for downloads) */}
        <div ref={headerRef}>
        <div style={{ marginBottom: "36px" }}>
          <div style={{ fontFamily: mono, fontSize: "11px", color: "#D97706", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px", fontWeight: 600 }}>
            Interactive Model | NYC&rsquo;s Budget from FY 2002 through 2026
          </div>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(28px, 4vw, 42px)", color: "#F8FAFC", fontWeight: 700, lineHeight: 1.15, margin: "0 0 8px 0" }}>
            NYC&rsquo;s Budget from FY 2002 through 2026
          </h1>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.25)", borderRadius: "8px", padding: "8px 16px", marginBottom: "12px" }}>
            <span style={{ fontFamily: mono, fontSize: "12px", color: "#E2E8F0" }}>Brought to you by{" "}
              <a href="https://maximumnewyork.com" target="_blank" rel="noopener noreferrer" style={{ color: "#D97706", textDecoration: "none", fontWeight: 600, borderBottom: "1px solid rgba(217,119,6,0.4)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = "#D97706")}
                onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = "rgba(217,119,6,0.4)")}>
                Maximum New York
              </a>
            </span>
          </div>
          <p style={{ fontSize: "15px", color: "#64748B", margin: 0, lineHeight: 1.5, maxWidth: "650px" }}>
            Total adopted expense budget by fiscal year, FY2002 (passed 2001) through FY2026 (passed 2025). Adjust the range below, hover for details, and click any data point to freeze the panel so you can click the source link.
          </p>
        </div>

        {/* Mayor Filters */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: mono, fontSize: "10px", color: "#536178", letterSpacing: "0.08em", textTransform: "uppercase", marginRight: "4px" }}>Filter by Mayor</span>
          {[
            { key: null, label: "All" },
            ...mayorTerms.filter((m) => m.name !== "Giuliani").map((m) => ({ key: m.name, label: m.name })),
          ].map((btn) => {
            const isActive = btn.key === selectedMayor;
            const color = btn.key ? mayorColors[btn.key] : "#94A3B8";
            return (
              <button key={btn.label} onClick={() => btn.key ? handleMayorSelect(btn.key) : handleMayorSelect(null)}
                style={{
                  fontFamily: mono, fontSize: "11px", fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#F8FAFC" : "#94A3B8",
                  background: isActive ? `${color}25` : "rgba(30,41,59,0.4)",
                  border: `1px solid ${isActive ? `${color}60` : "rgba(51,65,85,0.5)"}`,
                  borderRadius: "8px", padding: "7px 16px", cursor: "pointer",
                  transition: "all 0.2s", outline: "none",
                  boxShadow: isActive ? `0 0 12px ${color}20` : "none",
                }}>
                {btn.key && <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: color, marginRight: 7, verticalAlign: "middle", opacity: isActive ? 1 : 0.5 }} />}
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px", flexWrap: "wrap", alignItems: "stretch" }}>
          <div style={{ background: "rgba(30,41,59,0.5)", border: "1px solid rgba(51,65,85,0.5)", borderRadius: "10px", padding: "14px 18px", flex: "1 1 150px", minWidth: "150px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <FYSelect value={startFY} onChange={(v) => { setStartFY(v); setSelectedMayor(null); setLockedBudget(null); setLockedPct(null); }} options={startOptions} label="Start" />
            <div style={{ fontFamily: serif, fontSize: "22px", fontWeight: 700, color: "#94A3B8", lineHeight: 1.2 }}>{startData ? fmtBillions(startData.raw) : "\u2014"}</div>
          </div>
          <div style={{ background: "rgba(30,41,59,0.5)", border: "1px solid rgba(51,65,85,0.5)", borderRadius: "10px", padding: "14px 18px", flex: "1 1 150px", minWidth: "150px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <FYSelect value={endFY} onChange={(v) => { setEndFY(v); setSelectedMayor(null); setLockedBudget(null); setLockedPct(null); }} options={endOptions} label="End" />
            <div style={{ fontFamily: serif, fontSize: "22px", fontWeight: 700, color: chartColor, lineHeight: 1.2 }}>{endData ? fmtBillions(endData.raw) : "\u2014"}</div>
          </div>
          <div style={{ background: "rgba(30,41,59,0.5)", border: `1px solid ${selectedMayor ? `${mayorColors[selectedMayor]}40` : "rgba(51,65,85,0.5)"}`, borderRadius: "10px", padding: "14px 18px", flex: "1 1 150px", minWidth: "150px", display: "flex", flexDirection: "column", justifyContent: "center", transition: "border-color 0.2s" }}>
            <div style={{ fontFamily: mono, fontSize: "9px", color: selectedMayor ? mayorColors[selectedMayor] : "#64748B", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px", transition: "color 0.2s" }}>{selectedMayor ? `${selectedMayor} ` : ""}{span}-Year Growth</div>
            <div style={{ fontFamily: serif, fontSize: "22px", fontWeight: 700, color: totalGrowthNum >= 0 ? "#34D399" : "#F87171", lineHeight: 1.2 }}>{fmtSign(totalGrowthNum.toFixed(0))}</div>
            <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>{fmtSignDollar(dollarGrowthNum.toFixed(2))} total</div>
          </div>
          <div style={{ background: "rgba(30,41,59,0.5)", border: `1px solid ${selectedMayor ? `${mayorColors[selectedMayor]}40` : "rgba(51,65,85,0.5)"}`, borderRadius: "10px", padding: "14px 18px", flex: "1 1 150px", minWidth: "150px", display: "flex", flexDirection: "column", justifyContent: "center", transition: "border-color 0.2s" }}>
            <div style={{ fontFamily: mono, fontSize: "9px", color: selectedMayor ? mayorColors[selectedMayor] : "#64748B", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px", transition: "color 0.2s" }}>Avg Annual Increase</div>
            <div style={{ fontFamily: serif, fontSize: "22px", fontWeight: 700, color: avgGrowthNum >= 0 ? "#60A5FA" : "#F87171", lineHeight: 1.2 }}>{fmtSign(avgGrowthNum.toFixed(1))}</div>
            <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>Mean YoY change</div>
          </div>
          {showInflation && (
            <div style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.25)", borderRadius: "10px", padding: "14px 18px", flex: "1 1 150px", minWidth: "150px", display: "flex", flexDirection: "column", justifyContent: "center", transition: "all 0.3s" }}>
              <div style={{ fontFamily: mono, fontSize: "9px", color: "#38BDF8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Avg Inflation Rate</div>
              <div style={{ fontFamily: serif, fontSize: "22px", fontWeight: 700, color: "#38BDF8", lineHeight: 1.2 }}>{fmtSign(avgInflationNum.toFixed(1))}</div>
              <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>CPI-U, NYC Metro</div>
            </div>
          )}
        </div>
        </div>

        {/* ═══ CHART 1: Total Adopted Budget ═══ */}
        <div ref={chart1Ref} style={{ position: "relative", background: "rgba(15,23,42,0.4)", border: "1px solid rgba(51,65,85,0.4)", borderRadius: "14px", padding: "24px", marginBottom: "40px" }}>
          <ShareMenu chartRef={chart1Ref} chartId="nyc-total-budget-2002-2026" title="NYC Total Adopted Budget FY2002–2026" dark onDownload={handleDownloadChart1} />
          <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "0 0 6px 0", flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: serif, fontSize: "20px", color: "#E2E8F0", fontWeight: 600, margin: 0 }}>Total Adopted Budget</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto", position: "relative" }}>
              {!showInflation && (
                <div style={{ position: "absolute", right: "100%", marginRight: "12px", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px", animation: "inflationPulse 2s ease-in-out infinite", pointerEvents: "none" }}>
                  <span style={{ fontFamily: mono, fontSize: "11px", fontWeight: 600, color: "#38BDF8", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", borderRadius: "6px", padding: "4px 10px" }}>Overlay FY inflation rates!</span>
                  <span style={{ color: "#38BDF8", fontSize: "14px" }}>&rarr;</span>
                </div>
              )}
              <style>{`@keyframes inflationPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
              <span style={{ fontFamily: mono, fontSize: "10px", color: showInflation ? "#38BDF8" : "#536178", letterSpacing: "0.08em", textTransform: "uppercase", transition: "color 0.2s", userSelect: "none" }}>Show Inflation</span>
              <button onClick={() => setShowInflation(!showInflation)} aria-label="Toggle inflation overlay"
                style={{ width: "38px", height: "22px", borderRadius: "11px", background: showInflation ? "#38BDF8" : "#334155", border: "1px solid " + (showInflation ? "#38BDF8" : "#475569"), cursor: "pointer", position: "relative", transition: "all 0.2s", padding: 0, flexShrink: 0 }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#F8FAFC", position: "absolute", top: "2px", left: showInflation ? "18px" : "2px", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
              </button>
            </div>
          </div>
          <div data-detail-panel style={{ background: lockedBudget ? "rgba(15,23,42,0.95)" : "rgba(15,23,42,0.8)", border: `1px solid ${lockedBudget ? "rgba(96,165,250,0.3)" : "rgba(51,65,85,0.4)"}`, borderRadius: "10px", padding: "12px 18px", marginBottom: "6px", minHeight: "58px", transition: "border-color 0.2s, background 0.2s" }}>
            <DetailPanel data={displayBudget} label="budget" locked={!!lockedBudget} onUnlock={() => setLockedBudget(null)} />
          </div>
          <div style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(51,65,85,0.4)", borderRadius: "14px", padding: "24px 12px 16px 0", cursor: "crosshair" }}
            onMouseLeave={() => { if (!lockedBudget) setHoveredBudget(null); }}>
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart data={budgetData} margin={{ top: 16, right: showInflation ? 48 : 24, left: 16, bottom: 8 }} onMouseMove={lockedBudget ? undefined : handleBudgetHover} onClick={handleBudgetClick}>
                <defs>
                  <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColor} stopOpacity={0.25} />
                    <stop offset="50%" stopColor={chartColor} stopOpacity={0.08} />
                    <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(51,65,85,0.3)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="fy" stroke="#334155" tick={{ fill: "#64748B", fontSize: 11, fontFamily: mono }} tickLine={false} axisLine={{ stroke: "#334155" }} tickFormatter={(v) => `'${String(v).slice(2)}`} interval={Math.max(1, Math.floor(budgetData.length / 14))} />
                <YAxis yAxisId="left" stroke="#334155" tick={{ fill: "#64748B", fontSize: 11, fontFamily: mono }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}B`} domain={[yMin, yMax]} ticks={yTicks} />
                {showInflation && (
                  <YAxis yAxisId="right" orientation="right" stroke="#334155" tick={{ fill: "#38BDF8", fontSize: 11, fontFamily: mono }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 7]} ticks={[0, 1, 2, 3, 4, 5, 6, 7]} />
                )}
                <Tooltip content={<NoTooltip />} cursor={{ stroke: "#475569", strokeWidth: 1, strokeDasharray: "4 4" }} />
                {[{ x: 2003, label: "Bloomberg" }, { x: 2015, label: "de Blasio" }, { x: 2023, label: "Adams" }]
                  .filter((r) => r.x >= startFY && r.x <= endFY)
                  .map((ref) => (
                    <ReferenceLine key={ref.x} x={ref.x} yAxisId="left" stroke="rgba(148,163,184,0.15)" strokeDasharray="6 4" label={{ value: ref.label, position: "top", fill: "#475569", fontSize: 10, fontFamily: mono }} />
                  ))}
                {showInflation && (
                  <Bar yAxisId="right" dataKey="inflationPct" fill="#38BDF8" fillOpacity={0.18} radius={[3, 3, 0, 0]} maxBarSize={24} isAnimationActive={false} />
                )}
                <Area yAxisId="left" type="monotone" dataKey="budget" stroke={chartColor} strokeWidth={2.5} fill="url(#budgetGradient)" dot={<CustomDot />} activeDot={<ActiveDot />} />
              </ComposedChart>
            </ResponsiveContainer>
            {showInflation && (
              <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "10px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: mono, fontSize: "10px", color: "#64748B" }}>
                  <div style={{ width: 16, height: 3, background: chartColor, borderRadius: "2px" }} />
                  Adopted budget (left axis)
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: mono, fontSize: "10px", color: "#64748B" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "2px", background: "#38BDF8", opacity: 0.3 }} />
                  CPI inflation rate (right axis)
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(51,65,85,0.3)", fontSize: "11px", color: "#475569", lineHeight: 1.6, fontFamily: mono }}>
            <strong style={{ color: "#64748B" }}>Sources:</strong> NYC Mayor&rsquo;s Office of Management &amp; Budget (OMB) Expense, Revenue, Contract Budget reports. All source PDFs linked per data point via the detail panel above the chart. Figures represent total adopted expense budget including all funds (city, state, and federal). FY = Fiscal Year (July 1 &ndash; June 30). Click any data point to freeze the panel and access the source link.
            <span> | <strong style={{ color: "#38BDF8" }}>Inflation:</strong> U.S. Bureau of Labor Statistics, CPI-U All Items, NYC Metro Area (1982-84=100), not seasonally adjusted. FY2026 data not yet available. <a href="/data/nyc_fy_inflation_data.csv" download style={{ color: "#38BDF8", textDecoration: "none", borderBottom: "1px solid rgba(56,189,248,0.3)" }}>Download inflation data (CSV)</a></span>
          </div>
        </div>

        {/* ═══ CHART 2: Year-over-Year Change ═══ */}
        <div ref={chart2Ref} style={{ position: "relative", background: "rgba(15,23,42,0.4)", border: "1px solid rgba(51,65,85,0.4)", borderRadius: "14px", padding: "24px" }}>
          <ShareMenu chartRef={chart2Ref} chartId="nyc-budget-yoy-change-2002-2026" title="NYC Budget Year-over-Year Change FY2002–2026" dark onDownload={handleDownloadChart2} />
          <h2 style={{ fontFamily: serif, fontSize: "20px", color: "#E2E8F0", fontWeight: 600, margin: "0 0 4px 0" }}>Year-over-Year Change</h2>
          <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 6px 0" }}>Percentage increase (or decrease) from the prior fiscal year&rsquo;s adopted expense budget</p>
          <div data-detail-panel style={{ background: lockedPct ? "rgba(15,23,42,0.95)" : "rgba(15,23,42,0.8)", border: `1px solid ${lockedPct ? "rgba(96,165,250,0.3)" : "rgba(51,65,85,0.4)"}`, borderRadius: "10px", padding: "12px 18px", marginBottom: "6px", minHeight: "58px", transition: "border-color 0.2s, background 0.2s" }}>
            <DetailPanel data={displayPct} label="pct" locked={!!lockedPct} onUnlock={() => setLockedPct(null)} />
          </div>
          <div style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(51,65,85,0.4)", borderRadius: "14px", padding: "24px 12px 16px 0", cursor: "crosshair" }}
            onMouseLeave={() => { if (!lockedPct) setHoveredPct(null); }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pctData} margin={{ top: 16, right: 24, left: 16, bottom: 8 }} onMouseMove={lockedPct ? undefined : handlePctHover} onClick={handlePctClick}>
                <CartesianGrid stroke="rgba(51,65,85,0.3)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="fy" stroke="#334155" tick={{ fill: "#64748B", fontSize: 11, fontFamily: mono }} tickLine={false} axisLine={{ stroke: "#334155" }} tickFormatter={(v) => `'${String(v).slice(2)}`} interval={Math.max(1, Math.floor(pctData.length / 14))} />
                <YAxis stroke="#334155" tick={{ fill: "#64748B", fontSize: 11, fontFamily: mono }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[Math.floor(pctMin) - 1, Math.ceil(pctMax) + 1]} />
                <Tooltip content={<NoTooltip />} cursor={{ fill: "rgba(148,163,184,0.06)" }} />
                <ReferenceLine y={parseFloat(avgGrowthNum.toFixed(1))} stroke="#60A5FA" strokeDasharray="6 3" strokeWidth={1.5} label={{ value: `Avg ${fmtSign(avgGrowthNum.toFixed(1))}`, position: "right", fill: "#60A5FA", fontSize: 10, fontFamily: mono }} />
                <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
                {[{ x: 2003 }, { x: 2015 }, { x: 2023 }]
                  .filter((r) => r.x > startFY && r.x <= endFY)
                  .map((ref) => (
                    <ReferenceLine key={ref.x} x={ref.x} stroke="rgba(148,163,184,0.12)" strokeDasharray="6 4" />
                  ))}
                <Bar dataKey="pctChange" radius={[4, 4, 0, 0]} maxBarSize={28}>
                  {pctData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.pctChange < 0 ? "#F87171" : entry.pctChange > 7 ? "#34D399" : entry.pctChange > 4 ? "#D97706" : "#64748B"} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "8px", flexWrap: "wrap" }}>
              {[
                { color: "#F87171", label: "Decrease" },
                { color: "#64748B", label: "0\u20134%" },
                { color: "#D97706", label: "4\u20137%" },
                { color: "#34D399", label: "> 7%" },
                { color: "#60A5FA", label: "Average", dashed: true },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: mono, fontSize: "10px", color: "#64748B" }}>
                  {l.dashed ? (<div style={{ width: 16, height: 0, borderTop: `2px dashed ${l.color}` }} />) : (<div style={{ width: 10, height: 10, borderRadius: "2px", background: l.color, opacity: 0.8 }} />)}
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(51,65,85,0.3)", fontSize: "11px", color: "#475569", lineHeight: 1.6, fontFamily: mono }}>
            <strong style={{ color: "#64748B" }}>Sources:</strong> NYC Mayor&rsquo;s Office of Management &amp; Budget (OMB) Expense, Revenue, Contract Budget reports. All source PDFs linked per data point via the detail panel above the chart. Figures represent total adopted expense budget including all funds (city, state, and federal). FY = Fiscal Year (July 1 &ndash; June 30). Click any data point to freeze the panel and access the source link.
          </div>
        </div>
      </div>
    </div>
  );
}
