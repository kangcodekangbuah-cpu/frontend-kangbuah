import "./Hero.css"

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-background">
        <div className="organic-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      <div className="hero-content">
        <div className="hero-logo">
          <span className="logo-a">A</span>
          <span className="logo-n">N</span>
          <span className="logo-s">S</span>
          <div className="logo-leaf">🍃</div>
        </div>
        <h1 className="hero-title">CV AGRO NIAGA SEJAHTERA</h1>
        <p className="hero-subtitle">Menyediakan kesegaran dari pasar ke meja anda</p>
        <div className="hero-social">
          <span>@kargbuahfresh</span>
          <span className="year">2025</span>
        </div>
      </div>
    </section>
  )
}
