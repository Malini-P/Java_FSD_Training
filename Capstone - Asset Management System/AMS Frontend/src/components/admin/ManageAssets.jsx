import axios from "axios"
import { useEffect, useState, useRef } from "react"

const ManageAssets = () => {

    const getAllAssetsApi = "http://localhost:8080/api/assets/all"
    const getAllCategoriesApi = "http://localhost:8080/api/categories/all"

    const [assets, setAssets] = useState([])
    const [categories, setCategories] = useState([])

    // Add Asset form states
    const [assetName, setAssetName] = useState("")
    const [assetModel, setAssetModel] = useState("")
    const [serialNumber, setSerialNumber] = useState("")
    const [assetStatus, setAssetStatus] = useState("AVAILABLE")
    const [categoryId, setCategoryId] = useState(0)
    const [manufacturingDate, setManufacturingDate] = useState("")
    const [expiryDate, setExpiryDate] = useState("")
    const [assetValue, setAssetValue] = useState("")
    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()
    const [addImageFile, setAddImageFile] = useState(null)
    const addImageInputRef = useRef(null)

    // Edit state
    const [editId, setEditId] = useState(null)
    const [editAssetName, setEditAssetName] = useState("")
    const [editAssetModel, setEditAssetModel] = useState("")
    const [editSerialNumber, setEditSerialNumber] = useState("")
    const [editAssetStatus, setEditAssetStatus] = useState("AVAILABLE")
    const [editCategoryId, setEditCategoryId] = useState(0)
    const [editManufacturingDate, setEditManufacturingDate] = useState("")
    const [editExpiryDate, setEditExpiryDate] = useState("")
    const [editAssetValue, setEditAssetValue] = useState("")
    const [editSuccessMsg, setEditSuccessMsg] = useState()
    const [editErrMsg, setEditErrMsg] = useState()
    const [uploadingAssetId, setUploadingAssetId] = useState(null)
    const [imgErrMsg, setImgErrMsg] = useState()

    // Pagination states
    const [currentPage, setCurrentPage] = useState(0)
    const [size] = useState(5)
    const [totalPages, setTotalPages] = useState(0)
    const [arry, setArry] = useState([])

    const [refreshKey, setRefreshKey] = useState(0)

    // Filter, Sort, Search states
    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState("")
    const [filterCategory, setFilterCategory] = useState("")
    const [sortField, setSortField] = useState("")
    const [sortDir, setSortDir] = useState("asc")

    let count = 0

    const config_details = {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        }
    }

   useEffect(() => {
        const getAllAssets = async () => {
            try {
                const response = await axios.get(getAllAssetsApi + `?page=0&size=1000`, config_details)
                setAssets(response.data.data)
            }
            catch (err) { }
        }
        getAllAssets()
    }, [refreshKey])

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

    const filtered = assets.filter(a => {
        const matchSearch = a.assetName?.toLowerCase().includes(search.toLowerCase()) ||
            a.assetModel?.toLowerCase().includes(search.toLowerCase()) ||
            a.serialNumber?.toLowerCase().includes(search.toLowerCase())
        const matchStatus = filterStatus === "" || a.assetStatus === filterStatus
        const matchCategory = filterCategory === "" || a.categoryName === filterCategory
        return matchSearch && matchStatus && matchCategory
    })

    const sorted = [...filtered].sort((a, b) => {
        if (!sortField) return 0
        const valA = (a[sortField] || "").toString().toLowerCase()
        const valB = (b[sortField] || "").toString().toLowerCase()
        return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA)
    })
    
    const computedTotalPages = Math.max(1, Math.ceil(sorted.length / size))
    const pageItems = sorted.slice(currentPage * size, currentPage * size + size)

    const handleSort = (field) => {
        if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc")
        else { setSortField(field); setSortDir("asc") }
    }

    const sortIcon = (field) => {
        if (sortField !== field) return <i className="bi bi-arrow-down-up text-muted ms-1" style={{ fontSize: '11px' }}></i>
        return sortDir === "asc"
            ? <i className="bi bi-sort-alpha-down text-primary ms-1" style={{ fontSize: '11px' }}></i>
            : <i className="bi bi-sort-alpha-up text-primary ms-1" style={{ fontSize: '11px' }}></i>
    }

    const addAsset = async (e) => {
        e.preventDefault()
        const body = {
            assetName, assetModel, serialNumber, assetStatus,
            manufacturingDate: manufacturingDate ? manufacturingDate + "T00:00:00Z" : null,
            expiryDate: expiryDate ? expiryDate + "T00:00:00Z" : null,
            assetValue: assetValue || null
        }
        try {
            const response = await axios.post(`http://localhost:8080/api/assets/add/${categoryId}`, body, config_details)
            if (addImageFile) {
                const formData = new FormData()
                formData.append('file', addImageFile)
                await axios.post(`http://localhost:8080/api/assets/${response.data.assetId}/upload-image`, formData, config_details)
            }
            setSuccessMsg("Asset added successfully")
            setErrMsg(undefined)
            setAssetName(""); setAssetModel(""); setSerialNumber("")
            setAssetStatus("AVAILABLE"); setCategoryId(0)
            setManufacturingDate(""); setExpiryDate(""); setAssetValue("")
            setAddImageFile(null)

            if (addImageInputRef.current) addImageInputRef.current.value = ""

            if (currentPage === 0) {
                setRefreshKey(k => k + 1)
            } else {
                setCurrentPage(0)
            }
        }
        catch (err) {
            setErrMsg("Failed to add asset: " + (err.response?.data?.message || ""))
            setSuccessMsg(undefined)
        }
    }

    const openEdit = (asset) => {
        setEditId(asset.assetId)
        setEditAssetName(asset.assetName)
        setEditAssetModel(asset.assetModel || "")
        setEditSerialNumber(asset.serialNumber || "")
        setEditAssetStatus(asset.assetStatus)
        setEditCategoryId(asset.categoryId)
        setEditManufacturingDate(asset.manufacturingDate ? asset.manufacturingDate.substring(0, 10) : "")
        setEditExpiryDate(asset.expiryDate ? asset.expiryDate.substring(0, 10) : "")
        setEditAssetValue(asset.assetValue || "")
        setEditSuccessMsg(undefined)
        setEditErrMsg(undefined)
    }

    const saveEdit = async (e) => {
        e.preventDefault()
        const body = {
            assetName: editAssetName,
            assetModel: editAssetModel,
            serialNumber: editSerialNumber,
            assetStatus: editAssetStatus,
            manufacturingDate: editManufacturingDate ? editManufacturingDate + "T00:00:00Z" : null,
            expiryDate: editExpiryDate ? editExpiryDate + "T00:00:00Z" : null,
            assetValue: editAssetValue || null
        }
        try {
            const response = await axios.put(`http://localhost:8080/api/assets/update/${editId}/${editCategoryId}`, body, config_details)
            setEditSuccessMsg("Asset updated successfully")
            setEditErrMsg(undefined)
            let tempArry = [...assets].map(a => a.assetId === editId ? response.data : a)
            setAssets([...tempArry])
        }
        catch (err) {
            setEditErrMsg("Update failed: " + (err.response?.data?.message || ""))
            setEditSuccessMsg(undefined)
        }
    }

    const handleImageUpload = async (assetId, file) => {
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    setUploadingAssetId(assetId)
    setImgErrMsg(undefined)
    try {
        const response = await axios.post(`http://localhost:8080/api/assets/${assetId}/upload-image`, formData, config_details)
        
        setAssets(prev => prev.map(a =>
            a.assetId === assetId ? { ...a, imagePath: response.data } : a
        ))
    }
    catch (err) {
        setImgErrMsg("Image upload failed: " + (err.response?.data?.message || ""))
    }
    finally {
        setUploadingAssetId(null)
    }
}


const deleteAsset = async (assetId) => {
        if (!window.confirm("Are you sure you want to delete this asset?")) return
        try {
            await axios.delete(`http://localhost:8080/api/assets/delete/${assetId}`, config_details)
            setRefreshKey(k => k + 1)
        }
        catch (err) {
            if (err.response?.status === 500 || err.response?.data?.message?.includes("constraint")) {
                alert("This asset cannot be deleted because it has existing requests/allocations linked to it. Please resolve those first.")
            } else {
                alert("Failed to delete: " + (err.response?.data?.message || "Unknown error"))
            }
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

    const uniqueCategories = [...new Set(assets.map(a => a.categoryName).filter(Boolean))]

    return (
        <div className="row">
            <div className="col-lg-12">

                {/* Add Asset Card */}
                <div className="card mb-4">
                    <div className="card-header">
                        Add Asset
                    </div>
                    <div className="card-body">
                        <form onSubmit={(e) => addAsset(e)}>
                            {successMsg !== undefined ? <div className="alert alert-primary mb-4">{successMsg}</div> : ""}
                            {errMsg !== undefined ? <div className="alert alert-danger mb-4">{errMsg}</div> : ""}
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <label>Asset Name: </label>
                                    <input type="text" className="form-control" required
                                        value={assetName}
                                        onChange={(e) => setAssetName(e.target.value)} />
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label>Asset Model: </label>
                                    <input type="text" className="form-control"
                                        value={assetModel}
                                        onChange={(e) => setAssetModel(e.target.value)} />
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label>Serial Number: </label>
                                    <input type="text" className="form-control"
                                        value={serialNumber}
                                        onChange={(e) => setSerialNumber(e.target.value)} />
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label>Asset Status: </label>
                                    <select className="form-control"
                                        value={assetStatus}
                                        onChange={(e) => setAssetStatus(e.target.value)}>
                                        <option value="AVAILABLE">AVAILABLE</option>
                                        <option value="ALLOCATED">ALLOCATED</option>
                                        <option value="UNDER_SERVICE">UNDER_SERVICE</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label>Category: </label>
                                    <select className="form-control"
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}>
                                        <option value={0}>--- Select Category ---</option>
                                        {categories.map((cat, index) => (
                                            <option key={index} value={cat.id}>{cat.categoryName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label>Manufacturing Date: </label>
                                    <input type="date" className="form-control"
                                        value={manufacturingDate}
                                        onChange={(e) => setManufacturingDate(e.target.value)} />
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label>Expiry Date: </label>
                                    <input type="date" className="form-control"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)} />
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label>Asset Value (₹): </label>
                                    <input type="number" className="form-control" step="0.01" min="0"
                                        value={assetValue}
                                        onChange={(e) => setAssetValue(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-md-6 mb-4">
                                <label>Asset Image (optional): </label>
                                <input type="file" className="form-control"
                                    accept="image/png, image/jpeg, image/jpg"
                                    ref={addImageInputRef}
                                    onChange={(e) => setAddImageFile(e.target.files[0])} />
                            </div>
                            <div className="mb-4">
                                <input type="submit" className="btn btn-secondary" value="Add Asset" />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Edit Asset Card */}
                {editId !== null ?
                    <div className="card mb-4">
                        <div className="card-header">
                            Edit Asset (ID: {editId})
                        </div>
                        <div className="card-body">
                            <form onSubmit={(e) => saveEdit(e)}>
                                {editSuccessMsg !== undefined ? <div className="alert alert-primary mb-4">{editSuccessMsg}</div> : ""}
                                {editErrMsg !== undefined ? <div className="alert alert-danger mb-4">{editErrMsg}</div> : ""}
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <label>Asset Name: </label>
                                        <input type="text" className="form-control" required
                                            value={editAssetName}
                                            onChange={(e) => setEditAssetName(e.target.value)} />
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label>Asset Model: </label>
                                        <input type="text" className="form-control"
                                            value={editAssetModel}
                                            onChange={(e) => setEditAssetModel(e.target.value)} />
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label>Serial Number: </label>
                                        <input type="text" className="form-control"
                                            value={editSerialNumber}
                                            onChange={(e) => setEditSerialNumber(e.target.value)} />
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label>Asset Status: </label>
                                        <select className="form-control"
                                            value={editAssetStatus}
                                            onChange={(e) => setEditAssetStatus(e.target.value)}>
                                            <option value="AVAILABLE">AVAILABLE</option>
                                            <option value="ALLOCATED">ALLOCATED</option>
                                            <option value="UNDER_SERVICE">UNDER_SERVICE</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label>Category: </label>
                                        <select className="form-control"
                                            value={editCategoryId}
                                            onChange={(e) => setEditCategoryId(e.target.value)}>
                                            <option value={0}>--- Select Category ---</option>
                                            {categories.map((cat, index) => (
                                                <option key={index} value={cat.id}>{cat.categoryName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label>Manufacturing Date: </label>
                                        <input type="date" className="form-control"
                                            value={editManufacturingDate}
                                            onChange={(e) => setEditManufacturingDate(e.target.value)} />
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label>Expiry Date: </label>
                                        <input type="date" className="form-control"
                                            value={editExpiryDate}
                                            onChange={(e) => setEditExpiryDate(e.target.value)} />
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label>Asset Value (₹): </label>
                                        <input type="number" className="form-control" step="0.01" min="0"
                                            value={editAssetValue}
                                            onChange={(e) => setEditAssetValue(e.target.value)} />
                                    </div>
                                </div>
                                <div className="mb-4 d-flex gap-2">
                                    <input type="submit" className="btn btn-primary" value="Save Changes" />
                                    <button type="button" className="btn btn-outline-secondary"
                                        onClick={() => setEditId(null)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div> : ""}

                {/* All Assets Table */}
                <div className="card">
                    <div className="card-header ">
                        <span>All Assets</span>
                    </div>
                    <div className="card-body">

                        {/* Filter, Sort, Search Options */}
                        <div className="d-flex align-items-center gap-3 flex-wrap mb-3 p-2 bg-light rounded-3">
                            <input type="text" className="form-control" style={{ maxWidth: 220, fontSize: '0.83rem' }}
                                placeholder="Search name / model / serial..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(0) }} />
                            <select className="form-select" style={{ maxWidth: 170, fontSize: '0.83rem' }}
                                value={filterStatus}
                                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(0) }}>
                                <option value="">All Statuses</option>
                                <option value="AVAILABLE">AVAILABLE</option>
                                <option value="ALLOCATED">ALLOCATED</option>
                                <option value="UNDER_SERVICE">UNDER_SERVICE</option>
                            </select>
                            <select className="form-select" style={{ maxWidth: 170, fontSize: '0.83rem' }}
                                value={filterCategory}
                                onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(0) }}>
                                <option value="">All Categories</option>
                                {uniqueCategories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                            </select>
                            <span className="text-muted" style={{ fontSize: '0.83rem' }}></span>
                        </div>

                        {imgErrMsg && <div className="alert alert-danger mb-3">{imgErrMsg}</div>}

                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Image</th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('assetName')}>Asset Name {sortIcon('assetName')}</th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('assetModel')}>Model {sortIcon('assetModel')}</th>
                                        <th>Serial Number</th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('assetStatus')}>Status {sortIcon('assetStatus')}</th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('categoryName')}>Category {sortIcon('categoryName')}</th>
                                        <th>Mfg. Date</th>
                                        <th>Expiry Date</th>
                                        <th>Value (₹)</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                       {pageItems.map((asset, index) => (
                                        <tr key={asset.assetId}>
                                            <td>{currentPage * size + index + 1}</td>
                                            <td className="text-center">
                                                {asset.imagePath ? (
                                                    <img
                                                        src={`/images/${asset.imagePath}`}
                                                        alt={asset.assetName}
                                                        style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 4 }}
                                                    />
                                                ) : (
                                                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>No image</span>
                                                )}
                                                <div className="mt-1">
                                                    <label className="btn btn-sm btn-outline-secondary mb-0" style={{ fontSize: '0.7rem' }}>
                                                        {uploadingAssetId === asset.assetId ? 'Uploading...' : 'Upload'}
                                                        <input
                                                            type="file"
                                                            accept="image/png, image/jpeg, image/jpg"
                                                            hidden
                                                            disabled={uploadingAssetId === asset.assetId}
                                                            onChange={(e) => handleImageUpload(asset.assetId, e.target.files[0])}
                                                        />
                                                    </label>
                                                </div>
                                            </td>
                                            <td>{asset.assetName}</td>
                                            <td>{asset.assetModel || "-"}</td>
                                            <td>{asset.serialNumber || "-"}</td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(asset.assetStatus)} px-2 py-1`}>
                                                    {asset.assetStatus}
                                                </span>
                                            </td>
                                            <td>{asset.categoryName}</td>
                                            <td>{asset.manufacturingDate ? new Date(asset.manufacturingDate).toLocaleDateString("en-GB") : "-"}</td>
                                            <td>{asset.expiryDate ? new Date(asset.expiryDate).toLocaleDateString("en-GB") : "-"}</td>
                                            <td>{asset.assetValue ? `₹${asset.assetValue}` : "-"}</td>
                                            <td>
                                                <div className="d-flex gap-1">
                                                    <button className="btn btn-sm btn-outline-primary"
                                                        onClick={() => openEdit(asset)}>
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger"
                                                        onClick={() => deleteAsset(asset.assetId)}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {sorted.length === 0 ?
                                        <tr><td colSpan="11" className="text-center text-muted">No assets found</td></tr> : ""}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <nav aria-label="Page navigation">
                            <ul className="pagination justify-content-center">
                                <li className="page-item">
                                    <button className="page-link" disabled={currentPage === 0}
                                        onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                                </li>
                                {Array.from({ length: computedTotalPages }).map((_, index) => (
                                    <li className={`page-item ${currentPage === index ? 'active' : ''}`} key={index}>
                                        <button className="page-link" onClick={() => setCurrentPage(index)}>
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className="page-item">
                                    <button className="page-link" disabled={currentPage === (computedTotalPages - 1)}
                                        onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                                </li>
                            </ul>
                        </nav>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default ManageAssets