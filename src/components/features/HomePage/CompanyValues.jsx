import "./CompanyValues.css"
import { MessageCircle, Star, Handshake, Zap, Target, Users } from "lucide-react"

export default function CompanyValues() {
  const values = [
    {
      id: "01",
      title: "Integritas",
      description: "Menjunjung tinggi kejujuran dan transparansi dalam setiap transaksi",
      icon: MessageCircle,
      bgColor: "#FFF0E6",
      accentColor: "#FF8A65",
    },
    {
      id: "02",
      title: "Kualitas",
      description: "Produk kami dipilih langsung oleh ahli yang telah berpengalaman 20 tahun di pasar induk",
      icon: Star,
      bgColor: "#E3F2FD",
      accentColor: "#5C6BC0",
    },
    {
      id: "03",
      title: "Kemitraan",
      description: "Percaya hubungan jangka panjang adalah kunci keberhasilan bersama",
      icon: Handshake,
      bgColor: "#F3E5F5",
      accentColor: "#9575CD",
    },
    {
      id: "04",
      title: "Inovasi",
      description: "Selalu mencari cara baru untuk meningkatkan layanan dan produk kami",
      icon: Zap,
      bgColor: "#FFF0E6",
      accentColor: "#FF8A65",
    },
    {
      id: "05",
      title: "Dedikasi",
      description: "Komitmen penuh terhadap kesuksesan dan kepuasan pelanggan",
      icon: Target,
      bgColor: "#E3F2FD",
      accentColor: "#5C6BC0",
    },
    {
      id: "06",
      title: "Kolaborasi",
      description: "Bekerja sama dengan tim internal dan eksternal untuk mencapai tujuan bersama",
      icon: Users,
      bgColor: "#F3E5F5",
      accentColor: "#9575CD",
    },
  ]

  return (
    <section className="company-values">
      <div className="company-values-background-text">
        <h2>Nilai-Nilai Perusahaan</h2>
      </div>

      <div className="values-background">
        <svg className="dashed-lines" viewBox="0 0 1200 1400" preserveAspectRatio="none">
          {/* Line from Card 1 (150, 30) to Card 2 (1050, 180) */}
          <path d="M 150 30 Q 600 80 1050 180" stroke="#d0d0d0" strokeWidth="2" strokeDasharray="8,5" fill="none" />

          {/* Line from Card 2 (1050, 180) to Card 4 (1020, 480) */}
          <path d="M 1050 180 Q 1100 330 1020 480" stroke="#d0d0d0" strokeWidth="2" strokeDasharray="8,5" fill="none" />

          {/* Line from Card 4 (1020, 480) to Card 6 (1010, 930) */}
          <path d="M 1020 480 Q 1050 700 1010 930" stroke="#d0d0d0" strokeWidth="2" strokeDasharray="8,5" fill="none" />

          {/* Line from Card 6 (1010, 930) to Card 5 (210, 830) */}
          <path d="M 1010 930 Q 600 950 210 830" stroke="#d0d0d0" strokeWidth="2" strokeDasharray="8,5" fill="none" />

          {/* Line from Card 5 (210, 830) to Card 3 (180, 410) */}
          <path d="M 210 830 Q 150 620 180 410" stroke="#d0d0d0" strokeWidth="2" strokeDasharray="8,5" fill="none" />

          {/* Line from Card 3 (180, 410) to Card 1 (150, 30) */}
          <path d="M 180 410 Q 150 220 150 30" stroke="#d0d0d0" strokeWidth="2" strokeDasharray="8,5" fill="none" />
        </svg>
      </div>

      <div className="values-container">
        <div className="values-grid">
          {values.map((value, index) => {
            const Icon = value.icon
            const positionClass = `card-${index + 1}`

            return (
              <div key={value.id} className={`value-card ${positionClass}`} style={{ backgroundColor: value.bgColor }}>
                <div className="value-sphere" style={{ backgroundColor: value.accentColor }}>
                  <Icon size={32} color="white" strokeWidth={2} />
                </div>

                <div className="value-number">{value.id}</div>

                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}