import "./About.css"

export default function About() {
  const benefits = [
    { title: "Vitamin C", color: "card-green" },
    { title: "Vitamin & Minerals", color: "card-orange", size: "large" },
    { title: "Energy", color: "card-pink" },
    { title: "Health Care", color: "card-lime", size: "large" },
    { title: "100% Natural", color: "card-dark-green" },
  ]

  const pills = [
    { text: "Organic", color: "pill-blue" },
    { text: "Fresh", color: "pill-green" },
    { text: "Natural", color: "pill-pink" },
  ]

  return (
    <section className="about" id="about">
      <div className="about-container">
        <div className="about-header">
          <h2 className="about-title">Tentang Kami</h2>
        </div>

        <div className="about-main">
          <div className="about-text-section">
            <h3 className="company-title">CV Agro Niaga Sejahtera</h3>
            <p className="company-description">
              CV Agro Niaga Sejahtera adalah perusahaan distribusi buah dan sayur segar yang berpusat di Pasar Induk
              Kramat Jati, Jakarta Timur. Didirikan oleh generasi muda dari keluarga pedagang buah, kami membawa
              semangat baru untuk melayani kebutuhan pasar modern, khususnya segmen HORECA, Rumah Sakit, dan Pabrik.
              Dengan akses langsung ke jaringan petani dan pengalaman 20 tahun di pasar induk, kami memastikan produk
              yang kami distribusikan selalu dalam kondisi segar, berkualitas, dan kompetitif secara harga.
            </p>
          </div>

          <div className="about-cards-section">
            {/* Decorative pills */}
            <div className="pills-container">
              {pills.map((pill, index) => (
                <div key={index} className={`pill ${pill.color}`}>
                  {pill.text}
                </div>
              ))}
            </div>

            {/* Benefit cards grid */}
            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`benefit-card ${benefit.color} ${benefit.size === "large" ? "card-large" : ""}`}
                >
                  <span className="card-text">{benefit.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
