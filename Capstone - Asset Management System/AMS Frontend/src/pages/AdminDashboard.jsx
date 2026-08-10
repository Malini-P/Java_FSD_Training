import NavbarAdmin from "../components/NavbarAdmin"
import SidebarAdmin from "../components/admin/SidebarAdmin"
import { Outlet } from "react-router-dom"

const AdminDashboard = () => {

    return (
        <div className="app-shell d-flex">
            <SidebarAdmin />
            <div className="app-main">
                <NavbarAdmin />
                <div className="app-content">
                    {/*
                        <Route path="/admin" element={<AdminDashboard />}>
                            <Route path="" element={<AdminWidget />}></Route>
                            <Route path="categories" element={<ManageCategories />}></Route>
                            ...
                        </Route>
                    */}
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard