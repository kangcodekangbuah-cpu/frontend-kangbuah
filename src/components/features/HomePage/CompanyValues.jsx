import "./CompanyValues.css"

export default function CompanyValues() {
  return (
    <section className="company-values" id="values">
      <div className="values-container">
        <h2 className="values-title">NILAI-NILAI PERUSAHAAN</h2>

        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">
              <div className="icon-chat">💬</div>
            </div>
            <h3 className="value-name">Integritas</h3>
            <p className="value-description">Menjunjung tinggi kejujuran dan transparansi dalam setiap transaksi</p>
          </div>

          <div className="value-card">
            <div className="value-icon">
              <div className="icon-quality">⭐</div>
            </div>
            <h3 className="value-name">Kualitas</h3>
            <p className="value-description">
              Produk kami dipilih langsung oleh ahli yang telah berpengalaman 20 tahun di pasar induk
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">
              <div className="icon-partnership">🤝</div>
            </div>
            <h3 className="value-name">Kemitraan</h3>
            <p className="value-description">Percaya hubungan jangka panjang adalah kunci keberhasilan bersama</p>
          </div>
        </div>

        <div className="company-footer">
          <p>CV AGRO NIAGA SEJAHTERA</p>
        </div>
      </div>
    </section>
  )
}
