import { useNavigate, useLocation } from "react-router-dom"

const pageTitles = {
    "/admin": ["Dashboard", "Overview of system activity"],
    "/admin/categories": ["Categories", "Organize assets by category"],
    "/admin/assets": ["Assets", "Track and manage company assets"],
    "/admin/users": ["Users", "Manage employee and admin accounts"],
    "/admin/asset-requests": ["Asset Requests", "Review pending asset requests"],
    "/admin/allocations": ["Allocations", "View asset allocation history"],
    "/admin/service-requests": ["Service Requests", "Resolve employee service tickets"],
    "/admin/audits": ["Audits", "Track asset audit cycles"],
}

const NavbarAdmin = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const logout = () => {
        localStorage.clear()
        navigate("/login")
    }

    const username = localStorage.getItem('username')
    const [title, subtitle] = pageTitles[location.pathname] || ["Dashboard", "Overview of system activity"]

    return (
        <header className="app-topbar">
            <div>
                <p className="app-topbar-title">
                    {title}
                    <small>{subtitle}</small>
                </p>
            </div>

            <div className="d-flex align-items-center gap-3">
                <div className="app-topbar-user">
                    <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 38, height: 38, fontSize: '0.85rem' }}>
                        AD
                    </div>
                    <div className="d-none d-md-block">
                        <div className="app-topbar-user-name">{username}</div>
                        <div className="app-topbar-user-role">Administrator</div>
                    </div>
                    <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => logout()} title="Logout">
                        <i className="bi bi-box-arrow-right"></i>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default NavbarAdmin