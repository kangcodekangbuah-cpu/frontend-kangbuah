import { Link } from "react-router-dom";

const AdminHeader = ({ onLogout }) => {
  return (
    <header className="admin-cat-header">
      <div className="maxw">
        <div className="hdr-row">
          <Link to="/" className="logo-ans">
            ANS
          </Link>
          <nav className="admin-nav">
            <Link to="/admin/catalog" className="nav-item active">
              Katalog Admin
            </Link>
            <Link to="/admin/chat" className="nav-item">
              Chat Admin
            </Link>
          </nav>
          <div className="right">
            <button className="logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;