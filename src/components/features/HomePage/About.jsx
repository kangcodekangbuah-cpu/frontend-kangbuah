import "./About.css"

export default function About() {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <div className="about-content">
          <h2 className="about-title">TENTANG PERUSAHAAN</h2>
          <div className="about-grid">
            <div className="about-images">
              <div className="image-card">
                <img src="src\assets\fresh-watermelons-stacked-at-market.jpg" alt="Watermelons" />
              </div>
              <div className="image-card">
                <img src="src\assets\market.jpg" alt="Vegetable sorting" />
              </div>
            </div>
            <div className="about-text">
              <p className="about-description">
                CV Agro Niaga Sejahtera adalah perusahaan distribusi buah dan sayur segar yang berpusat di Pasar Induk
                Kramat Jati, Jakarta Timur.
              </p>
              <p className="about-description">
                Didirikan oleh generasi muda dari keluarga pedagang buah, kami membawa semangat baru untuk melayani
                kebutuhan pasar modern, khususnya segmen HORECA (Hotel, Restoran, Catering), Rumah Sakit, Pabrik, dan
                institusi lainnya.
              </p>
              <p className="about-description">
                Dengan akses langsung ke jaringan petani dan keluarga sebagai pedagang utama, kami memastikan produk
                yang kami distribusikan selalu dalam kondisi segar, berkualitas, dan kompetitif secara harga.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
