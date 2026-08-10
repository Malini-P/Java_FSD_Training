import { NavLink } from "react-router-dom"

const SidebarEmployee = () => {

    const username = localStorage.getItem('username')

    const navItem = ({ isActive }) =>
        `ams-nav-link${isActive ? " active" : ""}`

    return (
        <aside className="app-sidebar">
            <div className="app-sidebar-brand">
                <div className="ams-logo">AMS</div>
                <div className="app-sidebar-brand-text">
                    <strong>AMS Console</strong>
                    <span>Employee</span>
                </div>
            </div>

            <nav className="app-sidebar-nav">
                <p className="app-sidebar-section-label">Overview</p>
                <NavLink to="/employee" end className={navItem}>
                    <i className="bi bi-grid-1x2-fill"></i> Dashboard
                </NavLink>
                <NavLink to="/employee/asset-catalogue" className={navItem}>
                    <i className="bi bi-collection-fill"></i> Asset Catalogue
                </NavLink>

                <p className="app-sidebar-section-label">My Assets</p>
                <NavLink to="/employee/my-allocations" className={navItem}>
                    <i className="bi bi-laptop"></i> My Allocations
                </NavLink>
                <NavLink to="/employee/pending-audits" className={navItem}>
                    <i className="bi bi-search"></i> Pending Audits
                </NavLink>

                <p className="app-sidebar-section-label">Asset Requests</p>
                <NavLink to="/employee/my-asset-requests" className={navItem}>
                    <i className="bi bi-clipboard2-check"></i> My Requests
                </NavLink>
                <NavLink to="/employee/raise-asset-request" className={navItem}>
                    <i className="bi bi-clipboard2-plus"></i> Raise Request
                </NavLink>

                <p className="app-sidebar-section-label">Service Requests</p>
                <NavLink to="/employee/my-service-requests" className={navItem}>
                    <i className="bi bi-tools"></i> My Service Requests
                </NavLink>
                <NavLink to="/employee/raise-service-request" className={navItem}>
                    <i className="bi bi-wrench-adjustable"></i> Raise Service
                </NavLink>
            </nav>

            <div className="app-sidebar-footer">
                <div className="profile-row d-flex align-items-center gap-2">
                    <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold position-relative flex-shrink-0">
                        {username ? username.substring(0, 2).toUpperCase() : 'EM'}
                        <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-2 border-white rounded-circle"></span>
                    </div>
                    <div className="profile-row-info flex-grow-1 min-w-0">
                        <div className="profile-row-name text-truncate">{username || 'Employee'}</div>
                        <div className="profile-row-sub">AMS System</div>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default SidebarEmployee