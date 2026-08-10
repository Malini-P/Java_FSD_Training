import axios from "axios"
import { useEffect, useState } from "react"
import StatCard from "../admin/StatCard"

const EmployeeWidget = () => {

    const employeeStatsApi = "http://localhost:8080/api/dashboard/employee-stats"
    const myAllocationsApi = "http://localhost:8080/api/asset-allocations/my"
    const myAssetRequestsApi = "http://localhost:8080/api/asset-requests/my"
    const myServiceRequestsApi = "http://localhost:8080/api/service-requests/my"

    const [stats, setStats] = useState(null)
    const [activity, setActivity] = useState([])
    const [loadingActivity, setLoadingActivity] = useState(true)

    const config_details = {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        }
    }

    useEffect(() => {

        const getStats = async () => {
            try {
                const response = await axios.get(employeeStatsApi, config_details)
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

                {/* Welcome Banner */}
                <div className="mb-4 p-4 rounded-3 text-white" style={{ background: 'linear-gradient(135deg, var(--ams-navy-900), var(--ams-blue))' }}>
                    <h3 className="fw-bold mb-1">Welcome {localStorage.getItem('username')} 👋</h3>
                    <p className="mb-0 opacity-75">Here's a quick look at your assets and requests.</p>
                </div>

                <div className="row row-cols-1 row-cols-md-2 g-3 w-100 mx-auto mb-3">

                </div>
                <div className="row row-cols-1 row-cols-md-2 g-3 w-100 mx-auto mb-3">

                    <div className="col-12 col-md-6">
                        <StatCard label="My Allocated Assets" count={stats ? stats.myAllocatedAssets : 0} icon="bi-laptop-fill" color="primary" />
                    </div>
                    <div className="col-12 col-md-6">
                        <StatCard label="Pending Requests" count={stats ? stats.myPendingRequests : 0} icon="bi-clipboard2-check-fill" color="warning" />
                    </div>
                    <div className="col-12 col-md-6">
                        <StatCard label="Open Service Req." count={stats ? stats.myOpenServiceRequests : 0} icon="bi-tools" color="danger" />
                    </div>
                    <div className="col-12 col-md-6">
                        <StatCard label="Resolved Service Req." count={stats ? stats.myResolvedServiceRequests : 0} icon="bi-check2-circle" color="success" />
                    </div>

                </div>

            </main>
        </div>
    )
}

export default EmployeeWidget