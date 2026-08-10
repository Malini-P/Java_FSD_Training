import axios from "axios"
import { useEffect, useState } from "react"
import AssetBarChart from "./AssetBarChart"
import AssetStatusProgress from "./AssetStatusProgress"
import StatCard from "./StatCard"

const AdminWidget = () => {

    const adminStatsApi = "http://localhost:8080/api/dashboard/admin-stats"

    const [stats, setStats] = useState(null)

    useEffect(() => {

        // Prepare the header
        const config_details = {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem('token')
            }
        }

        const getStats = async () => {
            try {
                const response = await axios.get(adminStatsApi, config_details)
                setStats(response.data)
            }
            catch (err) { }
        }
        getStats()

    }, [])

    return (
        <div>
            {/* Central Working Page */}
            <main>
                <div className="d-flex flex-column">
                    
                    {/* Welcome Banner */}
                    <div className="mb-4 p-4 rounded-3 text-white" style={{ background: 'linear-gradient(135deg, var(--ams-navy-900), var(--ams-blue))' }}>
                        <h3 className="fw-bold mb-1">Welcome {localStorage.getItem('username')} 👋</h3>
                        <p className="mb-0 opacity-75">Here's what's happening with your assets today.</p>
                    </div>

                    {/* using StatCard component with props */}
                    <div className="row row-cols-1 row-cols-md-3 g-3 w-100 mx-auto mb-4">

                        <div className="col-12 col-md-4">
                            <StatCard label="Total Users" count={stats ? stats.totalUsers : 0} icon="bi-people-fill" color="primary" />
                        </div>
                        <div className="col-12 col-md-4">
                            <StatCard label="Total Assets" count={stats ? stats.totalAssets : 0} icon="bi-box-seam-fill" color="success" />
                        </div>
                        <div className="col-12 col-md-4">
                            <StatCard label="Available" count={stats ? stats.availableAssets : 0} icon="bi-check-circle-fill" color="info" />
                        </div>
                        <div className="col-12 col-md-4">
                            <StatCard label="Allocated" count={stats ? stats.allocatedAssets : 0} icon="bi-laptop-fill" color="warning" />
                        </div>
                        <div className="col-12 col-md-4">
                            <StatCard label="Pending Requests" count={stats ? stats.pendingRequests : 0} icon="bi-clipboard2-check-fill" color="danger" />
                        </div>
                        <div className="col-12 col-md-4">
                            <StatCard label="Open Service Req." count={stats ? stats.openServiceRequests : 0} icon="bi-tools" color="secondary" />
                        </div>

                    </div>

                    {/* Data Summary Cards */}
                    <div className="row align-items-stretch g-4 w-100 mx-auto">

                        {/* Asset Status Summary - Bar Chart */}
                        <div className="col-12 col-md-6 d-flex">
                            <div className="data-box flex-grow-1 border shadow-sm rounded-3 p-4">
                                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                                    <h4 className="fs-6 fw-bold mb-0">Asset Status Summary</h4>
                                    <i className="bi bi-bar-chart-line text-muted"></i>
                                </div>
                                <div>
                                    {/* Prime React Bar Chart for Asset Status — pass stats from parent */}
                                    <AssetBarChart stats={stats} />
                                </div>
                            </div>
                        </div>

                        {/* Request Summary */}
                        <div className="col-12 col-md-6 d-flex">
                            <div className="data-box flex-grow-1 border shadow-sm rounded-3 p-4">
                                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                                    <h4 className="fs-6 fw-bold mb-0">Request Summary</h4>
                                    <i className="bi bi-bar-chart-line text-muted"></i>
                                </div>
                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fs-7 text-muted fw-medium">Total Asset Requests</span>
                                        <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-10 px-2 py-1">{stats ? stats.totalRequests : 0}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fs-7 text-muted fw-medium">Pending Asset Requests</span>
                                        <span className="badge badge-status-pending px-2 py-1">{stats ? stats.pendingRequests : 0}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fs-7 text-muted fw-medium">Total Service Requests</span>
                                        <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-10 px-2 py-1">{stats ? stats.totalServiceRequests : 0}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fs-7 text-muted fw-medium">Open Service Requests</span>
                                        <span className="badge badge-status-open px-2 py-1">{stats ? stats.openServiceRequests : 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AdminWidget