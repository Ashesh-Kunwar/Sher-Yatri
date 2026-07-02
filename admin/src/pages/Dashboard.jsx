import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api";

const STATUS_COLORS = {
  inquiry: "#f0a500",
  contacted: "#1c5fa8",
  confirmed: "#1e7d3a",
  completed: "#0d5c2e",
  cancelled: "#b13434",
};

const STATUS_ORDER = ["inquiry", "contacted", "confirmed", "completed", "cancelled"];

function BarChart({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return <p className="muted">No booking data yet.</p>;
  }

  const entries = STATUS_ORDER.filter((s) => data[s] !== undefined).map((s) => ({ status: s, count: data[s] }));
  const max = Math.max(...entries.map((e) => e.count), 1);
  const barWidth = 48;
  const gap = 24;
  const chartHeight = 160;
  const totalWidth = entries.length * (barWidth + gap);

  return (
    <div style={{ overflowX: "auto" }}>
      <svg width={totalWidth} height={chartHeight + 40} style={{ display: "block" }}>
        {entries.map((entry, i) => {
          const barHeight = Math.max((entry.count / max) * chartHeight, 4);
          const x = i * (barWidth + gap);
          const y = chartHeight - barHeight;
          const color = STATUS_COLORS[entry.status] || "#888";
          return (
            <g key={entry.status}>
              <rect x={x} y={y} width={barWidth} height={barHeight} fill={color} rx={4} />
              <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize={13} fill="#333" fontWeight="bold">
                {entry.count}
              </text>
              <text x={x + barWidth / 2} y={chartHeight + 18} textAnchor="middle" fontSize={11} fill="#666" style={{ textTransform: "capitalize" }}>
                {entry.status}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getDashboardSummary().then(setSummary).catch((err) => setError(err.message));
  }, []);

  const totalBookings = summary
    ? Object.values(summary.bookingsByStatus || {}).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <Layout>
      <h1>Dashboard</h1>
      {error && <div className="error-box">{error}</div>}
      {!summary && !error && <p>Loading...</p>}
      {summary && (
        <>
          <div className="card-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card">
              <div className="stat-value">{summary.activeTours}</div>
              <div className="stat-label">Active Tours</div>
              <div className="stat-sub">of {summary.totalTours} total</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{summary.totalCustomers}</div>
              <div className="stat-label">Customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{totalBookings}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card highlight">
              <div className="stat-value">NPR {summary.totalRevenue?.toLocaleString()}</div>
              <div className="stat-label">Revenue Collected</div>
            </div>
          </div>

          <div className="chart-card">
            <h3 style={{ marginTop: 0, marginBottom: 20 }}>Bookings by Status</h3>
            <BarChart data={summary.bookingsByStatus} />
            <div className="chart-legend">
              {STATUS_ORDER.filter((s) => summary.bookingsByStatus?.[s] !== undefined).map((s) => (
                <div key={s} className="legend-item">
                  <span className="legend-dot" style={{ background: STATUS_COLORS[s] }} />
                  <span style={{ textTransform: "capitalize" }}>{s}</span>
                  <strong>{summary.bookingsByStatus[s]}</strong>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

