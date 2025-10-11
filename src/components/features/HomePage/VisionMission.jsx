import "./VisionMission.css"

export default function VisionMission() {
  return (
    <section className="vision-mission" id="vision">
      <div className="vm-container">
        <h2 className="vm-title">VISI & MISI</h2>

        <div className="vision-section">
          <h3 className="vision-title">Visi:</h3>
          <p className="vision-text">
            Menjadi mitra terpercaya dalam rantai pasok buah dan sayur segar bagi industri kuliner dan layanan publik di
            Jabodetabek
          </p>
        </div>

        <div className="mission-section">
          <h3 className="mission-title">Misi:</h3>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <p>Menyediakan produk segar dan berkualitas secara konsisten</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">⚡</div>
              <p>Memberikan pelayanan cepat, responsive, dan professional</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">🤝</div>
              <p>Menjalin kemitraan jangka panjang yang saling menguntungkan</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">📱</div>
              <p>Memperluas jangkauan distribusi melalui teknologi dan media sosial</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
