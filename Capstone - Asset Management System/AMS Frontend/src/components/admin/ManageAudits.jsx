import axios from "axios"
import { useEffect, useState } from "react"

const ManageAudits = () => {

    const getAllAuditsApi = "http://localhost:8080/api/audits/all"
    const sendAuditAllApi = "http://localhost:8080/api/audits/send-all"

    const [audits, setAudits] = useState([])
    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()
    const [filterStatus, setFilterStatus] = useState("")
    const [search, setSearch] = useState("")

    const config_details = {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')}
    }

    const loadAudits = async () => {
        try {
            const response = await axios.get(getAllAuditsApi, config_details)
            setAudits(response.data)
        }
        catch (err) { }
    }

    useEffect(() => {
        loadAudits()
    }, [])

    // Admin: send audit to all employees with active allocations
    const sendAuditToAll = async () => {
        if (!window.confirm("Send audit request to all employees with active allocations?")) return
        try {
            const response = await axios.post(sendAuditAllApi, {}, config_details)
            setSuccessMsg("Audit requests sent successfully")
            setErrMsg(undefined)
            loadAudits()
        }
        catch (err) {
            setErrMsg("Failed: " + (err.response?.data?.message || err.message))
            setSuccessMsg(undefined)
        }
    }

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-warning bg-opacity-10 text-warning border border-warning'
            case 'VERIFIED': return 'bg-success bg-opacity-10 text-success border border-success'
            case 'REJECTED': return 'bg-danger bg-opacity-10 text-danger border border-danger'
            default: return 'bg-secondary'
        }
    }

    const filtered = audits.filter(a => {
        const matchSearch = a.assetName?.toLowerCase().includes(search.toLowerCase()) ||
            a.employeeUsername?.toLowerCase().includes(search.toLowerCase())
        const matchStatus = filterStatus === "" || a.status === filterStatus
        return matchSearch && matchStatus
    })

    return (
        <div className="row">
            <div className="col-lg-12">

                {/* Header Action Card */}
<div className="card mb-4">
    <div className="card-header d-flex align-items-center">
        <span className="fw-semibold">
            Asset Audit Management
        </span>

        <div className="ms-auto">
            <button
                className="btn btn-secondary btn-sm"
                onClick={sendAuditToAll}
            >
                <i className="bi bi-send me-1"></i>
                Send Audit to All Employees
            </button>
        </div>
    </div>

    <div className="card-body">
        {successMsg !== undefined ?
            <div className="alert alert-primary">{successMsg}</div> : ""}

        {errMsg !== undefined ?
            <div className="alert alert-danger">{errMsg}</div> : ""}

        <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
            <i className="bi bi-info-circle me-1"></i>
            Clicking "Send Audit" creates a PENDING audit record for every employee
            who currently has an active asset allocation.
        </p>
    </div>
</div>
                {/* Audit Status Table */}
                <div className="card">
                    <div className="card-header">
                        All Audit Records
                    </div>
                    <div className="card-body">

                        {/* Search + Filter */}
                        <div className="d-flex align-items-center gap-3 flex-wrap mb-3 p-2 bg-light rounded-3">
                            <input type="text" className="form-control" style={{ maxWidth: 220, fontSize: '0.83rem' }}
                                placeholder="Search asset / employee..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)} />
                            <select className="form-select" style={{ maxWidth: 170, fontSize: '0.83rem' }}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="">All Statuses</option>
                                <option value="PENDING">PENDING</option>
                                <option value="VERIFIED">VERIFIED</option>
                                <option value="REJECTED">REJECTED</option>
                            </select>
                        </div>

                        <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Audit ID</th>
                                    <th>Asset Name</th>
                                    <th>Asset Model</th>
                                    <th>Employee</th>
                                    <th>Status</th>
                                    <th>Sent At</th>
                                    <th>Verified At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((audit, index) => (
                                    <tr key={audit.id}>
                                        <td>{index + 1}</td>
                                        <td>{audit.id}</td>
                                        <td>{audit.assetName}</td>
                                        <td>{audit.assetModel || "-"}</td>
                                        <td>{audit.employeeUsername}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadgeClass(audit.status)} px-2 py-1`}>
                                                {audit.status}
                                            </span>
                                        </td>
                                        <td>{audit.sentAt ? new Date(audit.sentAt).toLocaleDateString() : "-"}</td>
                                        <td>{audit.verifiedAt ? new Date(audit.verifiedAt).toLocaleDateString() : "-"}</td>
                                    </tr>
                                ))}
                                {filtered.length === 0 ?
                                    <tr><td colSpan="8" className="text-center text-muted">No audit records found</td></tr> : ""}
                            </tbody>
                        </table>
                        </div>

                        {/* Audit Summary Stats */}
                        <div className="d-flex gap-3 mt-3 flex-wrap">
                            <span className="badge bg-warning bg-opacity-10 text-warning border border-warning px-3 py-2">
                                Pending: {audits.filter(a => a.status === 'PENDING').length}
                            </span>
                            <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2">
                                Verified: {audits.filter(a => a.status === 'VERIFIED').length}
                            </span>
                            <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-3 py-2">
                                Rejected: {audits.filter(a => a.status === 'REJECTED').length}
                            </span>
                            <span className="badge bg-secondary bg-opacity-10 text-secondary border px-3 py-2">
                                Total: {audits.length}
                            </span>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default ManageAudits