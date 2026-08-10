import { NavLink } from "react-router-dom"

const SidebarAdmin = () => {

    const navItem = ({ isActive }) =>
        `ams-nav-link${isActive ? " active" : ""}`

    return (
        <aside className="app-sidebar">
            <div className="app-sidebar-brand">
                <div className="ams-logo">AMS</div>
                <div className="app-sidebar-brand-text">
                    <strong>AMS Console</strong>
                    <span>Admin</span>
                </div>
            </div>

            <nav className="app-sidebar-nav">
                <p className="app-sidebar-section-label">Overview</p>
                <NavLink to="/admin" end className={navItem}>
                    <i className="bi bi-grid-1x2-fill"></i> Dashboard
                </NavLink>

                <p className="app-sidebar-section-label">Inventory</p>
                <NavLink to="/admin/assets" className={navItem}>
                    <i className="bi bi-box-seam-fill"></i> Assets
                </NavLink>
                <NavLink to="/admin/categories" className={navItem}>
                    <i className="bi bi-tags-fill"></i> Categories
                </NavLink>
                <NavLink to="/admin/allocations" className={navItem}>
                    <i className="bi bi-diagram-3-fill"></i> Allocations
                </NavLink>

                <p className="app-sidebar-section-label">Requests</p>
                <NavLink to="/admin/asset-requests" className={navItem}>
                    <i className="bi bi-clipboard2-check-fill"></i> Asset Requests
                </NavLink>
                <NavLink to="/admin/service-requests" className={navItem}>
                    <i className="bi bi-tools"></i> Service Requests
                </NavLink>
                <NavLink to="/admin/audits" className={navItem}>
                    <i className="bi bi-search"></i> Audits
                </NavLink>

                <p className="app-sidebar-section-label">Administration</p>
                <NavLink to="/admin/users" className={navItem}>
                    <i className="bi bi-people-fill"></i> Users
                </NavLink>
            </nav>

            <div className="app-sidebar-footer">
                <div className="profile-row d-flex align-items-center gap-2">
                    <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold position-relative flex-shrink-0">
                        AD
                        <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-2 border-white rounded-circle"></span>
                    </div>
                    <div className="profile-row-info flex-grow-1 min-w-0">
                        <div className="profile-row-name text-truncate">Administrator</div>
                        <div className="profile-row-sub">AMS System</div>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default SidebarAdmin