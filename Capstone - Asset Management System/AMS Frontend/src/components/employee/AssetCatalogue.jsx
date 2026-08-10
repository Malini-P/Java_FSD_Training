import axios from "axios"
import { useEffect, useState } from "react"


const AssetCatalogue = () => {

    const getAllAssetsApi = "http://localhost:8080/api/assets/all"
    const getAllCategoriesApi = "http://localhost:8080/api/categories/all"

    const [assets, setAssets] = useState([])
    const [categories, setCategories] = useState([])

    // Pagination — same state pattern as ManageAssets
    const [currentPage, setCurrentPage] = useState(0)
    const [size] = useState(9)   
    const [totalPages, setTotalPages] = useState(0)
    const [arry, setArry] = useState([])

    // Search + Filter — reused from ManageAssets pattern
    const [search, setSearch] = useState("")
    const [filterCategory, setFilterCategory] = useState("")
    const [filterStatus, setFilterStatus] = useState("AVAILABLE") 

    // Asset Details modal state
    const [selectedAsset, setSelectedAsset] = useState(null)

    // Raise Request state
    const [requestReason, setRequestReason] = useState("")
    const [requestSuccessMsg, setRequestSuccessMsg] = useState()
    const [requestErrMsg, setRequestErrMsg] = useState()

    let count = 0

    const config_details = {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        }
    }

    useEffect(() => {
        const loadAssets = async () => {
            try {
                const response = await axios.get(getAllAssetsApi + `?page=${currentPage}&size=${size}`, config_details)
                setAssets(response.data.data)
                setTotalPages(response.data.totalPages)
                setArry(Array.from({ length: response.data.totalPages }))
            }
            catch (err) { }
        }
        loadAssets()
    }, [currentPage])

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await axios.get(getAllCategoriesApi, config_details)
                setCategories(response.data)
            }
            catch (err) { }
        }
        loadCategories()
    }, [])

    // Search + Filter logic — same as ManageAssets
    const filtered = assets.filter(a => {
        const matchSearch = a.assetName?.toLowerCase().includes(search.toLowerCase()) ||
            a.assetModel?.toLowerCase().includes(search.toLowerCase()) ||
            a.serialNumber?.toLowerCase().includes(search.toLowerCase())
        const matchCategory = filterCategory === "" || a.categoryName === filterCategory
        const matchStatus = filterStatus === "" || a.assetStatus === filterStatus
        return matchSearch && matchCategory && matchStatus
    })

    const openDetails = async (asset) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/assets/get-one/${asset.assetId}`, config_details)
            setSelectedAsset(response.data)
            setRequestReason("")
            setRequestSuccessMsg(undefined)
            setRequestErrMsg(undefined)
            // trigger Bootstrap modal
            const modal = new window.bootstrap.Modal(document.getElementById('assetDetailsModal'))
            modal.show()
        }
        catch (err) { }
    }

    // Raise Asset Request from within the modal
    const raiseRequest = async () => {
        if (!selectedAsset) return
        const body = { reason: requestReason }
        try {
            await axios.post(`http://localhost:8080/api/asset-requests/add/${selectedAsset.assetId}`, body, config_details)
            setRequestSuccessMsg("Request raised successfully! Admin will review it shortly.")
            setRequestErrMsg(undefined)
        }
        catch (err) {
            setRequestErrMsg("Failed: " + (err.response?.data?.message || ""))
            setRequestSuccessMsg(undefined)
        }
    }

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'AVAILABLE': return 'badge-status-available'
            case 'ALLOCATED': return 'badge-status-allocated'
            case 'UNDER_SERVICE': return 'badge-status-under_service'
            default: return 'bg-secondary'
        }
    }

    const getCategoryIcon = (categoryName) => {
        const name = (categoryName || "").toLowerCase()
        if (name.includes('laptop') || name.includes('computer')) return 'bi-laptop'
        if (name.includes('phone') || name.includes('mobile')) return 'bi-phone'
        if (name.includes('printer')) return 'bi-printer'
        if (name.includes('monitor') || name.includes('screen')) return 'bi-display'
        if (name.includes('furniture') || name.includes('chair')) return 'bi-house'
        if (name.includes('car') || name.includes('vehicle')) return 'bi-car-front'
        return 'bi-box-seam'
    }

    const uniqueCategories = [...new Set(assets.map(a => a.categoryName).filter(Boolean))]

    return (
        <div className="row">
            <div className="col-lg-12">

                {/* Search + Filter Bar*/}
                <div className="card mb-4">
                    <div className="card-body py-3">
                        <div className="d-flex align-items-center gap-3 flex-wrap">
                            <div className="position-relative" style={{ flex: 1, minWidth: 200 }}>
                                <i className="bi bi-search position-absolute top-50 translate-middle-y ms-2 text-muted"></i>
                                <input type="text" className="form-control ps-4" style={{ fontSize: '0.87rem' }}
                                    placeholder="   Search by name, model, serial..."
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(0) }} />
                            </div>
                            <select className="form-select" style={{ maxWidth: 180, fontSize: '0.87rem' }}
                                value={filterCategory}
                                onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(0) }}>
                                <option value="">All Categories</option>
                                {uniqueCategories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                            </select>
                            <select className="form-select" style={{ maxWidth: 170, fontSize: '0.87rem' }}
                                value={filterStatus}
                                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(0) }}>
                                <option value="AVAILABLE">Available Only</option>
                                <option value="">All Statuses</option>
                                <option value="ALLOCATED">Allocated</option>
                                <option value="UNDER_SERVICE">Under Service</option>
                            </select>
                            <span className="text-muted" style={{ fontSize: '0.83rem' }}>
                                {filtered.length} asset{filtered.length !== 1 ? 's' : ''} found
                            </span>
                        </div>
                    </div>
                </div>

                {/* Asset Cards Grid  */}
                <div className="row g-3 mb-4">
                    {filtered.map((asset) => (
                        <div key={asset.assetId} className="col-md-6 col-lg-4">
                            <div className="card h-100 border shadow-sm"
                                style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                                onClick={() => openDetails(asset)}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>

                                {/* Asset Image — displayed at top of card if imagePath exists */}
                                {asset.imagePath ? (
                                    <img
                                        src={`/images/${asset.imagePath}`}
                                        alt={asset.assetName}
                                        style={{ width: '100%', height: 160, objectFit: 'contain', backgroundColor: '#f8f9fa', borderRadius: '4px 4px 0 0', padding: '8px' }}
                                    />
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center bg-light"
                                        style={{ height: 100, borderRadius: '4px 4px 0 0' }}>
                                        <i className={`bi ${getCategoryIcon(asset.categoryName)} text-secondary`}
                                            style={{ fontSize: '2.5rem' }}></i>
                                    </div>
                                )}

                                <div className="card-body">
                                    {/* Asset Icon + Status */}
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div className="bg-light rounded-2 p-2 d-flex align-items-center justify-content-center"
                                            style={{ width: 44, height: 44 }}>
                                            <i className={`bi ${getCategoryIcon(asset.categoryName)} text-secondary fs-5`}></i>
                                        </div>
                                        <span className={`badge ${getStatusBadgeClass(asset.assetStatus)} px-2 py-1`}
                                            style={{ fontSize: '0.75rem' }}>
                                            {asset.assetStatus}
                                        </span>
                                    </div>

                                    {/* Asset Info — props pattern: data via asset object */}
                                    <h6 className="fw-bold text-dark mb-1">{asset.assetName}</h6>
                                    <p className="text-muted mb-1" style={{ fontSize: '0.82rem' }}>
                                        {asset.assetModel || "—"}
                                    </p>
                                    <p className="text-muted mb-2" style={{ fontSize: '0.78rem' }}>
                                        <i className="bi bi-tag me-1"></i>{asset.categoryName}
                                    </p>
                                    {asset.assetValue &&
                                        <p className="text-dark mb-0" style={{ fontSize: '0.82rem' }}>
                                            <i className="bi bi-currency-rupee me-1"></i>
                                            {Number(asset.assetValue).toLocaleString('en-IN')}
                                        </p>
                                    }
                                </div>
                                <div className="card-footer bg-transparent border-top-0 pt-0 pb-3 px-3">
                                    <button className="btn btn-sm btn-outline-secondary w-100"
                                        onClick={(e) => { e.stopPropagation(); openDetails(asset) }}>
                                        <i className="bi bi-eye me-1"></i>View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 &&
                        <div className="col-12">
                            <div className="text-center text-muted py-5">
                                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                No assets found matching your search
                            </div>
                        </div>
                    }
                </div>

                {/* Pagination — reused from ManageAssets */}
                {totalPages > 1 &&
                    <nav aria-label="Page navigation">
                        <ul className="pagination justify-content-center">
                            <li className="page-item">
                                <button className="page-link" disabled={currentPage === 0}
                                    onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                            </li>
                            {arry.map((_, index) => (
                                <li className="page-item" key={index}>
                                    <button className="page-link" onClick={() => setCurrentPage(index)}>
                                        {count = count + 1}
                                    </button>
                                </li>
                            ))}
                            <li className="page-item">
                                <button className="page-link" disabled={currentPage === (totalPages - 1)}
                                    onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                            </li>
                        </ul>
                    </nav>
                }

            </div>

            {/* Asset Details Modal  */}
            <div className="modal fade" id="assetDetailsModal" tabIndex="-1"
                aria-labelledby="assetDetailsModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold" id="assetDetailsModalLabel">
                                <i className="bi bi-box-seam me-2"></i>Asset Details
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            {selectedAsset && (
                                <div>
                                    {/* Asset Image in Modal — shown at top if imagePath exists */}
                                    {selectedAsset.imagePath && (
                                        <div className="text-center mb-3">
                                            <img
                                                src={`/images/${selectedAsset.imagePath}`}
                                                alt={selectedAsset.assetName}
                                                style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain', borderRadius: 8, border: '1px solid #dee2e6' }}
                                            />
                                        </div>
                                    )}

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <table className="table table-borderless table-sm mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td className="text-muted fw-semibold" style={{ width: '40%' }}>Asset Name</td>
                                                        <td className="fw-bold">{selectedAsset.assetName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-muted fw-semibold">Model</td>
                                                        <td>{selectedAsset.assetModel || "—"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-muted fw-semibold">Serial No.</td>
                                                        <td>{selectedAsset.serialNumber || "—"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-muted fw-semibold">Category</td>
                                                        <td>{selectedAsset.categoryName}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-md-6">
                                            <table className="table table-borderless table-sm mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td className="text-muted fw-semibold" style={{ width: '45%' }}>Status</td>
                                                        <td>
                                                            <span className={`badge ${getStatusBadgeClass(selectedAsset.assetStatus)} px-2 py-1`}>
                                                                {selectedAsset.assetStatus}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-muted fw-semibold">Asset Value</td>
                                                        <td>{selectedAsset.assetValue ? `₹${Number(selectedAsset.assetValue).toLocaleString('en-IN')}` : "—"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-muted fw-semibold">Mfg. Date</td>
                                                        <td>{selectedAsset.manufacturingDate ? new Date(selectedAsset.manufacturingDate).toLocaleDateString("en-GB") : "—"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-muted fw-semibold">Expiry Date</td>
                                                        <td>{selectedAsset.expiryDate ? new Date(selectedAsset.expiryDate).toLocaleDateString("en-GB") : "—"}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Raise Request section — only if AVAILABLE */}
                                    {selectedAsset.assetStatus === 'AVAILABLE' && (
                                        <div className="border-top pt-3">
                                            <h6 className="fw-semibold mb-2">
                                                <i className="bi bi-clipboard2-plus me-1 text-success"></i>
                                                Request This Asset
                                            </h6>
                                            {requestSuccessMsg &&
                                                <div className="alert alert-primary py-2">{requestSuccessMsg}</div>}
                                            {requestErrMsg &&
                                                <div className="alert alert-danger py-2">{requestErrMsg}</div>}
                                            <div className="mb-2">
                                                <label className="form-label small">Reason for Request:</label>
                                                <input type="text" className="form-control form-control-sm"
                                                    placeholder="Enter reason..."
                                                    value={requestReason}
                                                    onChange={(e) => setRequestReason(e.target.value)} />
                                            </div>
                                            <button className="btn btn-success btn-sm"
                                                onClick={raiseRequest}
                                                disabled={!!requestSuccessMsg}>
                                                <i className="bi bi-send me-1"></i>Raise Request
                                            </button>
                                        </div>
                                    )}

                                    {selectedAsset.assetStatus !== 'AVAILABLE' && (
                                        <div className="border-top pt-3">
                                            <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                                                <i className="bi bi-info-circle me-1"></i>
                                                This asset is currently <strong>{selectedAsset.assetStatus}</strong> and cannot be requested.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary btn-sm"
                                data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AssetCatalogue