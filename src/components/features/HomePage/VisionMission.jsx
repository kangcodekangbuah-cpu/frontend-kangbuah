"use client"
import { Sprout, Zap, Handshake, Globe, Leaf } from "lucide-react"
import "./VisionMission.css"

export default function VisionMission() {
  const missionData = [
    {
      id: 1,
      title: "Produk Berkualitas",
      description: "Menyediakan produk segar dan berkualitas secara konsisten",
      icon: Sprout,
      position: "top-left",
    },
    {
      id: 2,
      title: "Pelayanan Responsif",
      description: "Memberikan pelayanan cepat, responsive, dan professional",
      icon: Zap,
      position: "top-right",
    },
    {
      id: 3,
      title: "Jangkauan Luas",
      description: "Memperluas jangkauan distribusi melalui teknologi dan media sosial",
      icon: Globe,
      position: "bottom-left",
    },
    {
      id: 4,
      title: "Kemitraan Strategis",
      description: "Menjalin kemitraan jangka panjang yang saling menguntungkan",
      icon: Handshake,
      position: "bottom-right",
    },
  ]

  return (
    <section className="vision-mission-section" id="vision">
      <div className="vision-mission-decorative">
        <div className="vision-mission-decorative-top"></div>
        <div className="vision-mission-decorative-bottom"></div>
      </div>

      <div className="vision-mission-wrapper">
        {/* Vision Section */}
        <div className="vision-section">
          <h3 className="vision-section-title">Visi Kami</h3>
          <p className="vision-section-text">
            Menjadi mitra terpercaya dalam rantai pasok buah dan sayur segar bagi industri kuliner dan layanan publik di
            Jabodetabek
          </p>
        </div>

        {/* Large background text with cards overlay */}
        <div className="vision-mission-container">
          {/* Large "Visi & Misi" text in background */}
          <div className="vision-mission-background-text">
            <h2>Visi & Misi</h2>
          </div>

          {/* Mission cards grid */}
          <div className="vision-mission-grid">
            {missionData.map((item) => {
              const IconComponent = item.icon
              return (
                <div key={item.id} className={`vision-mission-card-wrapper ${item.position}`}>
                  <div className="mission-card-inner">
                    {/* Icon container */}
                    <div className="mission-icon-container">
                      <IconComponent className="mission-icon" />
                    </div>

                    {/* Title */}
                    <h4 className="mission-title">{item.title}</h4>

                    {/* Description */}
                    <p className="mission-description">{item.description}</p>

                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}