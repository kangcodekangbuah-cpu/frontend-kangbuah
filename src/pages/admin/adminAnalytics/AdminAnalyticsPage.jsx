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
  BarChart, Bar
} from "recharts";
import "./AdminAnalyticsPage.css";
import AdminHeader from "../../../components/features/Admin/AdminHeader";
import apiClient from "../../../services/api";

const GREEN = "#2ecc71";
const CATEGORY_COLORS = [
  "#60A5FA", // biru muda
  "#34D399", // hijau toska
  "#FBBF24", // kuning lembut
  "#F87171", // merah salmon
  "#A78BFA", // ungu lembut
  "#38BDF8", // cyan
  "#F472B6"  // pink lembut
];

function currencyIDR(v) {
  if (v == null) return "Rp 0";
  return "Rp " + Number(v).toLocaleString("id-ID", { maximumFractionDigits: 0 });
}

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState({});
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topProducts, setTopProducts] = useState([]);
  const [statusDist, setStatusDist] = useState([]);
  const [customerDistribution, setCustomerDistribution] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [summaryRes, trendRes, categoryRes, topCustRes, topProdRes, statusDistRes, ordersRes] = await Promise.all([
          apiClient.get("/reports/summary"),
          apiClient.get("/reports/trend"),
          apiClient.get("/reports/category-distribution"),
          apiClient.get("/reports/top-customers"),
          apiClient.get("/reports/top-products"),
          apiClient.get("/reports/status-distribution"),
          apiClient.get("/reports/orders"),
        ]);

        // Pastikan semua ambil dari field .data.data
        setSummary(summaryRes.data.data || {});
        setTrendData(trendRes.data.data || []);
        setCategoryData(categoryRes.data.data || []);
        setTopCustomers(topCustRes.data.data || []);
        setTopProducts(topProdRes.data.data || []);
        setStatusDist(statusDistRes.data.data || []);
        // hitung total order per kota
        const orders = ordersRes.data.data || [];
        const cityCount = {};
        for (const order of orders) {
          const city = order.delivery_city || "Tidak diketahui";
          cityCount[city] = (cityCount[city] || 0) + 1;
        }

        const formatted = Object.entries(cityCount).map(([city, total_orders]) => ({
          city,
          total_orders,
        }));

        setCustomerDistribution(formatted);

        // Ambil jumlah total produk dari panjang array categoryData
        const totalProducts = (categoryRes.data.data || []).length;

        // Masukkan ke summary agar bisa ditampilkan di card
        setSummary(prev => ({ ...prev, total_products: totalProducts }));
      } catch (err) {
        console.error("Gagal memuat data analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
              <small>Total Pesanan</small>
              <h3>{summary.total_orders}</h3>
              <div className="muted">Pesanan</div>
            </div>

            <div className="card">
              <small>Total Pemasukan</small>
              <h3 style={{ color: "#27ae60" }}>{currencyIDR(summary.total_revenue)}</h3>
              <div className="muted">Seluruh transaksi</div>
            </div>

            <div className="card">
                <small>Jenis Produk</small>
                <h3>{summary.total_products ?? 0}</h3>
                <div className="muted">Dari semua kategori</div>
            </div>
            
            <div className="card">
              <small>Total Customer</small>
              <h3>{summary.total_customers}</h3>
              <div className="muted">Customers</div>
            </div>
          </div>

          {/* Chart penjualan */}
          <div className="charts-grid">
            <div className="large-card">
              <h3>Tren Penjualan</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={GREEN} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis
                    tickFormatter={(v) => (v ? `${(v / 1000).toFixed(0)}k` : "0")}
                  />
                  <Tooltip formatter={(v) => currencyIDR(v)} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={GREEN}
                    fill="url(#colorRev)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* <div className="small-card">
              <h3>Distribusi Kategori</h3>
              <div style={{ width: "100%", height: 300 }}>
                {Array.isArray(categoryData) && categoryData.length > 0 ? (
                  <ResponsiveContainer>
                    <PieChart>
                      {(() => {
                        // Urutkan dari total_sold terbesar
                        const sortedData = [...categoryData].sort(
                          (a, b) => b.total_sold - a.total_sold
                        );

                        // 5 kategori teratas
                        const top5 = sortedData.slice(0, 5);

                        // sisanya jadi "Lainnya"
                        const othersTotal = sortedData
                          .slice(5)
                          .reduce((acc, curr) => acc + curr.total_sold, 0);

                        const finalData =
                          othersTotal > 0
                            ? [...top5, { category: "Lainnya", total_sold: othersTotal }]
                            : top5;

                        return (
                          <Pie
                            data={finalData.map((c) => ({
                              name: c.category,
                              value: c.total_sold,
                            }))}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                          >
                            {finalData.map((_, i) => (
                              <Cell
                                key={i}
                                fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                              />
                            ))}
                          </Pie>
                        );
                      })()}
                      <Tooltip
                        formatter={(value, name) => [`${value} produk`, name]}
                        contentStyle={{ fontSize: "13px" }}
                      />
                      <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{
                          fontSize: "13px",
                          lineHeight: "20px",
                          maxHeight: "230px",
                          overflowY: "auto",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="muted">Belum ada data kategori</p>
                )}
              </div>
            </div> */}
            <div className="small-card">
              <h3>Top Products</h3>
              <div style={{ width: "100%", height: 300 }}>
                {topProducts.length > 0 ? (
                  <ResponsiveContainer>
                    <BarChart data={topProducts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="product_name" />
                      <YAxis />
                      <Tooltip formatter={(v) => `${v} terjual`} />
                      <Bar dataKey="total_sold" radius={[6, 6, 0, 0]}>
                        {topProducts.map((_, i) => (
                          <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="muted">Belum ada data produk</p>
                )}
              </div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="large-card">
              <h3>Distribusi Pesanan per Kota</h3>
              {customerDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={customerDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city" />
                    <YAxis />
                    <Tooltip formatter={(v) => `${v} pesanan`} />
                    <Bar dataKey="total_orders" fill="#88d8ecff" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="muted">Belum ada data pesanan per kota</p>
              )}
            </div>
            
            <div className="small-card">
              <h3>Status Pesanan</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusDist.map((s) => ({ name: s.status, value: s.count }))}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={30}
                    outerRadius={90}
                    label={false} 
                  >
                    {statusDist.map((_, i) => (
                      <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v} pesanan`} />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{
                      fontSize: "10px",
                      lineHeight: "17px",
                      paddingLeft: "10px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>


          {/* Top Customers */}
          <div className="card full-width top-customers">
            <h3>Top Customers</h3>
            <table className="top-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Total Pembelian</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="2">Belum ada data</td>
                  </tr>
                ) : (
                  topCustomers.map((c, i) => (
                    <tr key={i}>
                      <td className="cust-name">
                        <span
                          className="dot"
                          style={{
                            background:
                              CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                          }}
                        />
                        {c.customer}
                      </td>
                      <td>{currencyIDR(c.total_spent)}</td>
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
