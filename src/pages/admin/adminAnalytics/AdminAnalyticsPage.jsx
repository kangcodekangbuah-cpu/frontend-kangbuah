// AdminAnalyticsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  Legend,
  Brush,
} from "recharts";
import { format, parseISO, getDate, getMonth, getYear } from "date-fns";
import "./AdminAnalyticsPage.css";
import AdminHeader from "../../../components/features/Admin/AdminHeader";

const GREEN = "#2ecc71";
const CATEGORY_COLORS = ["#10B981", "#F59E0B", "#EF4444", "#6366F1", "#FBBF24"];

function currencyIDR(v) {
  if (v == null) return "Rp 0";
  return "Rp " + Number(v).toLocaleString("id-ID", { maximumFractionDigits: 0 });
}

export default function AdminAnalyticsPage({ fetchOrdersFromApi }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let data = [];
        if (typeof fetchOrdersFromApi === "function") {
          const res = await fetchOrdersFromApi();
          data = Array.isArray(res) ? res : res?.data || [];
        } else {
          const stored = localStorage.getItem("orders");
          data = stored ? JSON.parse(stored) : [];
        }
        const normalized = data.map((o) => ({
          ...o,
          createdAt: o.createdAt || o.order_date || o.created_at || new Date().toISOString(),
          total: Number(o.total || o.total_price || o.amount || 0),
        }));
        setOrders(normalized);
      } catch (err) {
        console.error("Gagal load orders", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchOrdersFromApi]);

  const yearOptions = useMemo(() => {
    const years = new Set(orders.map((o) => getYear(parseISO(o.createdAt))));
    return Array.from(years).sort((a, b) => b - a);
  }, [orders]);

  const dailySeries = useMemo(() => {
    const daysMap = {};
    orders.forEach((o) => {
      const d = parseISO(o.createdAt);
      const y = getYear(d);
      const m = getMonth(d) + 1;
      if (y === Number(yearFilter) && m === Number(monthFilter)) {
        const day = getDate(d);
        daysMap[day] = (daysMap[day] || 0) + Number(o.total || 0);
      }
    });
    const lastDay = new Date(yearFilter, monthFilter, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => ({
      date: String(i + 1),
      revenue: daysMap[i + 1] || 0,
    }));
  }, [orders, yearFilter, monthFilter]);

  const summary = useMemo(() => {
    const totalRevenueAll = orders.reduce((s, o) => s + Number(o.total || 0), 0);
    const todayStr = format(new Date(), "yyyy-MM-dd");
    const revenueToday = orders
      .filter((o) => format(parseISO(o.createdAt), "yyyy-MM-dd") === todayStr)
      .reduce((s, o) => s + Number(o.total || 0), 0);

    const productSet = new Set();
    orders.forEach((o) => {
      (o.order_details || o.items || []).forEach((it) => {
        const pid = it.product?.id || it.id || it.product_id || `${it.name}`;
        productSet.add(String(pid));
      });
    });

    const custSet = new Set();
    orders.forEach((o) => {
      const u =
        o.user?.username ||
        o.user?.email ||
        o.billing_email ||
        o.delivery_pic_name;
      if (u) custSet.add(String(u));
    });

    return {
      totalRevenueAll,
      revenueToday,
      totalProducts: productSet.size,
      totalCustomers: custSet.size,
    };
  }, [orders]);

  const pieData = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      (o.order_details || o.items || []).forEach((it) => {
        const cat = it.product?.category || it.category || "Lainnya";
        const qty = Number(it.quantity || it.qty || 1);
        counts[cat] = (counts[cat] || 0) + qty;
      });
    });
    const total = Object.values(counts).reduce((s, v) => s + v, 0);
    return Object.entries(counts).map(([k, v]) => ({
      name: k,
      value: v,
      percent: total ? (v / total) * 100 : 0,
    }));
  }, [orders]);

  const topCustomers = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const key =
        o.user?.username || o.user?.email || o.billing_email || "Unknown";
      map[key] = map[key] || { name: key, orders: 0, total: 0 };
      map[key].orders += 1;
      map[key].total += Number(o.total || 0);
    });
    return Object.values(map).sort((a, b) => b.orders - a.orders).slice(0, 5);
  }, [orders]);

  if (loading) {
    return (
      <div>
        <AdminHeader />
        <div className="admin-analytics-page">
          <div className="container">
            <h2>Analytics Overview</h2>
            <p>Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ✅ Tambahkan Header di bagian paling atas */}
      <AdminHeader />

      <div className="admin-analytics-page">
        <div className="container">
          <div className="page-title">
            <h1>Analytics Overview</h1>
            <p className="subtitle">Detail Transaksi</p>
          </div>

          {/* Ringkasan angka */}
          <div className="summary-cards">
            <div className="card">
              <small>Total Pemasukan</small>
              <h3>{currencyIDR(summary.totalRevenueAll)}</h3>
              <div className="muted">{orders.length} Pesanan</div>
            </div>

            <div className="card">
              <small>Revenue Hari ini</small>
              <h3 style={{ color: "#27ae60" }}>
                {currencyIDR(summary.revenueToday)}
              </h3>
              <div className="muted">
                {
                  orders.filter(
                    (o) =>
                      format(parseISO(o.createdAt), "yyyy-MM-dd") ===
                      format(new Date(), "yyyy-MM-dd")
                  ).length
                }{" "}
                Pesanan
              </div>
            </div>

            <div className="card">
              <small>Total Produk</small>
              <h3>{summary.totalProducts}</h3>
              <div className="muted">Dari semua kategori</div>
            </div>

            <div className="card">
              <small>Total Customer</small>
              <h3>{summary.totalCustomers}</h3>
              <div className="muted">customers</div>
            </div>
          </div>

          {/* Chart */}
          <div className="charts-grid">
            <div className="large-card">
              <div className="card-header">
                <h3>Total Pemasukan</h3>
                <div className="filters">
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(Number(e.target.value))}
                  >
                    {yearOptions.length === 0 ? (
                      <option value={new Date().getFullYear()}>
                        {new Date().getFullYear()}
                      </option>
                    ) : (
                      yearOptions.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))
                    )}
                  </select>
                  <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(Number(e.target.value))}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {format(new Date(2000, m - 1, 1), "LLLL")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="chart-area">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={dailySeries}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={GREEN}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor={GREEN}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      tickFormatter={(v) =>
                        v ? `${(v / 1000).toFixed(0)}k` : "0"
                      }
                    />
                    <Tooltip formatter={(value) => currencyIDR(value)} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={GREEN}
                      fill="url(#colorRev)"
                      strokeWidth={2}
                    />
                    <Brush
                      dataKey="date"
                      height={30}
                      stroke={GREEN}
                      travellerWidth={10}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="small-card">
              <h3>Pembelian Per Kategori</h3>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      label={(entry) =>
                        `${entry.name}: ${entry.percent.toFixed(1)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="card full-width top-customers">
            <h3>Top Customers</h3>
            <table className="top-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Jumlah Pesanan</th>
                  <th>Total Pembelian</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="3">Belum ada data</td>
                  </tr>
                ) : (
                  topCustomers.map((c, i) => (
                    <tr key={c.name}>
                      <td className="cust-name">
                        <span
                          className="dot"
                          style={{
                            background:
                              CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                          }}
                        />
                        {c.name}
                      </td>
                      <td>{c.orders}</td>
                      <td>{currencyIDR(c.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
