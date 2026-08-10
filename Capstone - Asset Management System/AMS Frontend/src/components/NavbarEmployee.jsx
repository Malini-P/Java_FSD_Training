import { useNavigate, useLocation } from "react-router-dom"

const pageTitles = {
    "/employee": ["Dashboard", "Your assets and requests at a glance"],
    "/employee/asset-catalogue": ["Asset Catalogue", "Browse assets available to request"],
    "/employee/my-allocations": ["My Allocations", "Assets currently assigned to you"],
    "/employee/my-asset-requests": ["My Requests", "Track your asset requests"],
    "/employee/raise-asset-request": ["Raise Request", "Request a new asset"],
    "/employee/my-service-requests": ["Service Requests", "Track your service tickets"],
    "/employee/raise-service-request": ["Raise Service", "Report an issue with an asset"],
    "/employee/pending-audits": ["Pending Audits", "Confirm assets pending audit"],
}

const NavbarEmployee = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const logout = () => {
        localStorage.clear()
        navigate("/login")
    }

    const username = localStorage.getItem('username')
    const [title, subtitle] = pageTitles[location.pathname] || ["Dashboard", "Your assets and requests at a glance"]

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
                        {username ? username.substring(0, 2).toUpperCase() : 'EM'}
                    </div>
                    <div className="d-none d-md-block">
                        <div className="app-topbar-user-name">{username}</div>
                        <div className="app-topbar-user-role">Employee</div>
                    </div>
                    <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => logout()} title="Logout">
                        <i className="bi bi-box-arrow-right"></i>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default NavbarEmployee