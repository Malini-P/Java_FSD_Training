import NavbarEmployee from "../components/NavbarEmployee"
import SidebarEmployee from "../components/employee/SidebarEmployee"
import { Outlet } from "react-router-dom"

const EmployeeDashboard = () => {

    return (
        <div className="app-shell d-flex">
            <SidebarEmployee />
            <div className="app-main">
                <NavbarEmployee />
                <div className="app-content">
                    {/*
                        <Route path="/employee" element={<EmployeeDashboard />}>
                            <Route path="" element={<EmployeeWidget />}></Route>
                            <Route path="my-allocations" element={<MyAllocations />}></Route>
                            ...
                        </Route>
                    */}
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default EmployeeDashboard