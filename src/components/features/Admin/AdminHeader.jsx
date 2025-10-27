import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const AdminHeader = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role')
        setIsLoggedIn(false);
        toast.success("Logout berhasil");
        navigate("/", { replace: true });
    };

    return (
        <header className="admin-cat-header">
            <div className="maxw">
                <div className="hdr-row">
                    <Link to="/" className="logo-ans">
                        ANS
                    </Link>
                    <nav className="admin-nav">
                        <NavLink to="/admin/catalog" className="nav-item">
                            Katalog Admin
                        </NavLink>
                        <NavLink to="/admin/chat" className="nav-item">
                            Chat Admin
                        </NavLink>
                        <NavLink to="/admin/orders" className="nav-item">
                            Pemesanan
                        </NavLink>
                    </nav>
                    <div className="right">
                        <button className="logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;