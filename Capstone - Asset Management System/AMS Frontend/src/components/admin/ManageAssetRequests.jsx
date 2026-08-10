import axios from "axios"
import { useEffect, useState } from "react"

const ManageAssetRequests = () => {

    const getAllRequestsApi = "http://localhost:8080/api/asset-requests/all"

    const [requests, setRequests] = useState([])
    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()

    const config_details = {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        }
    }

    const loadRequests = async () => {
        try {
            const response = await axios.get(getAllRequestsApi, config_details)
            setRequests(response.data)
        }
        catch (err) { }
    }

    useEffect(() => {
        loadRequests()
    }, [])

    const approveRequest = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/asset-requests/${id}/approve`, {}, config_details)
            setSuccessMsg("Request approved successfully")
            setErrMsg(undefined)
            loadRequests()
        }
        catch (err) {
            setErrMsg("Approval failed: " + (err.response?.data?.message || ""))
            setSuccessMsg(undefined)
        }
    }

    const rejectRequest = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/asset-requests/${id}/reject`, {}, config_details)
            setSuccessMsg("Request rejected")
            setErrMsg(undefined)
            loadRequests()
        }
        catch (err) {
            setErrMsg("Rejection failed: " + (err.response?.data?.message || ""))
            setSuccessMsg(undefined)
        }
    }

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'PENDING': return 'badge-status-pending'
            case 'APPROVED': return 'badge-status-approved'
            case 'REJECTED': return 'badge-status-rejected'
            default: return 'bg-secondary'
        }
    }

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-header">
                        All Asset Requests
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
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    requests.map((req, index) => (
                                        <tr key={req.requestId}>
                                            <td>{index + 1}</td>
                                            <td>{req.requestId}</td>
                                            <td>{req.employeeUsername}</td>
                                            <td>{req.assetName}</td>
                                            <td>{req.reason}</td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(req.requestStatus)} px-2 py-1`}>
                                                    {req.requestStatus}
                                                </span>
                                            </td>
                                            <td>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "-"}</td>
                                            <td>
                                                {
                                                    req.requestStatus === 'PENDING' ?
                                                        <div className="d-flex gap-1">
                                                            <button className="btn btn-sm btn-outline-success"
                                                                onClick={() => approveRequest(req.requestId)}>
                                                                <i className="bi bi-check-lg me-1"></i>Approve
                                                            </button>
                                                            <button className="btn btn-sm btn-outline-danger"
                                                                onClick={() => rejectRequest(req.requestId)}>
                                                                <i className="bi bi-x-lg me-1"></i>Reject
                                                            </button>
                                                        </div> :
                                                        <span className="text-muted fs-7">No action</span>
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                                {
                                    requests.length === 0 ?
                                        <tr><td colSpan="8" className="text-center text-muted">No asset requests found</td></tr> : ""
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

export default ManageAssetRequests