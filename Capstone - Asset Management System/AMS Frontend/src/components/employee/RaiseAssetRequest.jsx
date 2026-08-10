import axios from "axios"
import { useEffect, useState } from "react"

const RaiseAssetRequest = () => {

    const getAvailableAssetsApi = "http://localhost:8080/api/assets/available"

    const [assets, setAssets] = useState([])
    const [assetId, setAssetId] = useState(0)
    const [reason, setReason] = useState("")
    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()
    const [errMsgReason, setErrMsgReason] = useState()

    const config_details = {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        }
    }

    useEffect(() => {
        const loadAvailableAssets = async () => {
            try {
                const response = await axios.get(getAvailableAssetsApi, config_details)
                setAssets(response.data)
            }
            catch (err) { }
        }
        loadAvailableAssets()
    }, [])

    const raiseRequest = async (e) => {
        e.preventDefault()
        const body = { reason }
        try {
            await axios.post(`http://localhost:8080/api/asset-requests/add/${assetId}`, body, config_details)
            setSuccessMsg("Asset request raised successfully")
            setErrMsg(undefined)
            setErrMsgReason(undefined)
            setReason("")
            setAssetId(0)
        }
        catch (err) {
            setErrMsg("Request failed: " + (err.response?.data?.message || ""))
            setErrMsgReason(err.response?.data?.reason || undefined)
            setSuccessMsg(undefined)
        }
    }

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-header">
                        Raise Asset Request
                    </div>
                    <div className="card-body">
                        <form onSubmit={(e) => raiseRequest(e)}>
                            {
                                successMsg !== undefined ?
                                    <div className="alert alert-primary mb-4">{successMsg}</div> : ""
                            }
                            {
                                errMsg !== undefined ?
                                    <div className="alert alert-danger mb-4">{errMsg}</div> : ""
                            }
                            <div className="mb-4">
                                <label>Select Asset: </label>
                                <select className="form-control"
                                    value={assetId}
                                    onChange={(e) => setAssetId(e.target.value)}>
                                    <option value={0}>--- Select Available Asset ---</option>
                                    {
                                        assets.map((asset, index) => (
                                            <option key={index} value={asset.assetId}>
                                                {asset.assetName} {asset.assetModel ? `(${asset.assetModel})` : ""} - {asset.categoryName}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="mb-4">
                                <label>Reason: </label>
                                {
                                    errMsgReason !== undefined ?
                                        <span style={{ color: 'red', fontSize: '11px' }}> {errMsgReason}</span> : ""
                                }
                                <textarea className="form-control" rows="3" required
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Describe why you need this asset...">
                                </textarea>
                            </div>
                            <div className="mb-4">
                                <input type="submit" className="btn btn-secondary" value="Raise Request" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RaiseAssetRequest