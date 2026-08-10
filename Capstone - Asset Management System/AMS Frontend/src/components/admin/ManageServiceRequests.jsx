import axios from "axios"
import { useEffect, useState } from "react"

const ManageServiceRequests = () => {

    const getAllServiceRequestsApi = "http://localhost:8080/api/service-requests/all"

    const [serviceRequests, setServiceRequests] = useState([])
    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()

    const config_details = {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        }
    }

    const loadServiceRequests = async () => {
        try {
            const response = await axios.get(getAllServiceRequestsApi, config_details)
            setServiceRequests(response.data)
        }
        catch (err) { }
    }

    useEffect(() => {
        loadServiceRequests()
    }, [])

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.put(
                `http://localhost:8080/api/service-requests/${id}/update-status?serviceStatus=${newStatus}`,
                {},
                config_details
            )
            setSuccessMsg(`Status updated to ${newStatus}`)
            setErrMsg(undefined)
            loadServiceRequests()
        }
        catch (err) {
            setErrMsg("Status update failed: " + (err.response?.data?.message || ""))
            setSuccessMsg(undefined)
        }
    }

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'OPEN': return 'badge-status-open'
            case 'IN_PROGRESS': return 'badge-status-inprogress'
            case 'RESOLVED': return 'badge-status-resolved'
            default: return 'bg-secondary'
        }
    }

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-header">
                        All Service Requests
                    </div>
                    <div className="card-body">
                        {
                            successMsg !== undefined ?
                                <div className="alert alert-primary mb-4">{successMsg}</div> : ""
                        }
                        {
                            errMsg !== undefined ?
                                <div className="alert alert-danger mb-4">{errMsg}</div> : ""
                        }
                        <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Request ID</th>
                                    <th>Employee</th>
                                    <th>Asset</th>
                                    <th>Issue Description</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    serviceRequests.map((req, index) => (
                                        <tr key={req.serviceRequestId}>
                                            <td>{index + 1}</td>
                                            <td>{req.serviceRequestId}</td>
                                            <td>{req.employeeUsername}</td>
                                            <td>{req.assetName}</td>
                                            <td>{req.issueDescription}</td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(req.serviceStatus)} px-2 py-1`}>
                                                    {req.serviceStatus}
                                                </span>
                                            </td>
                                            <td>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "-"}</td>
                                            <td>
                                                {
                                                    req.serviceStatus !== 'RESOLVED' ?
                                                        <div className="d-flex gap-1 flex-wrap">
                                                            {
                                                                req.serviceStatus === 'OPEN' ?
                                                                    <button className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => updateStatus(req.serviceRequestId, 'IN_PROGRESS')}>
                                                                        <i className="bi bi-arrow-clockwise me-1"></i>In Progress
                                                                    </button> : ""
                                                            }
                                                            <button className="btn btn-sm btn-outline-success"
                                                                onClick={() => updateStatus(req.serviceRequestId, 'RESOLVED')}>
                                                                <i className="bi bi-check-lg me-1"></i>Resolve
                                                            </button>
                                                        </div> :
                                                        <span className="text-muted fs-7">Resolved</span>
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                                {
                                    serviceRequests.length === 0 ?
                                        <tr><td colSpan="8" className="text-center text-muted">No service requests found</td></tr> : ""
                                }
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageServiceRequests