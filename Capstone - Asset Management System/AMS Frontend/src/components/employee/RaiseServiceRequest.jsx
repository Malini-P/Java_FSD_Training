import axios from "axios";
import { useEffect, useState } from "react";

const RaiseServiceRequest = () => {
  const myAllocationsApi = "http://localhost:8080/api/asset-allocations/my";

  const [allocations, setAllocations] = useState([]);
  const [assetId, setAssetId] = useState(0);
  const [issueDescription, setIssueDescription] = useState("");
  const [issueType, setIssueType] = useState("MALFUNCTION");
  const [successMsg, setSuccessMsg] = useState();
  const [errMsg, setErrMsg] = useState();
  const [errMsgIssue, setErrMsgIssue] = useState();

  const config_details = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  useEffect(() => {
    const loadMyAllocations = async () => {
      try {
        const response = await axios.get(myAllocationsApi, config_details);
        // Only show active (not returned) allocations
        setAllocations(response.data.filter((a) => !a.returned));
      } catch (err) {}
    };
    loadMyAllocations();
  }, []);

  const raiseServiceRequest = async (e) => {
    e.preventDefault();
    const body = { issueDescription, issueType };
    try {
      await axios.post(
        `http://localhost:8080/api/service-requests/add/${assetId}`,
        body,
        config_details,
      );
      setSuccessMsg("Service request raised successfully");
      setErrMsg(undefined);
      setErrMsgIssue(undefined);
      setIssueDescription("");
      setIssueType("MALFUNCTION");
      setAssetId(0);
    } catch (err) {
      setErrMsg("Request failed: " + (err.response?.data?.message || ""));
      setErrMsgIssue(err.response?.data?.issueDescription || undefined);
      setSuccessMsg(undefined);
    }
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">Raise Service Request</div>
          <div className="card-body">
            <form onSubmit={(e) => raiseServiceRequest(e)}>
              {successMsg !== undefined ? (
                <div className="alert alert-primary mb-4">{successMsg}</div>
              ) : (
                ""
              )}
              {errMsg !== undefined ? (
                <div className="alert alert-danger mb-4">{errMsg}</div>
              ) : (
                ""
              )}
              <div className="mb-4">
                <label>Select Allocated Asset: </label>
                <select
                  className="form-control"
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                >
                  <option value={0}>--- Select Your Asset ---</option>
                  {allocations.map((alloc, index) => (
                    <option key={index} value={alloc.assetId}>
                      {alloc.assetName}{" "}
                      {alloc.assetModel ? `(${alloc.assetModel})` : ""}
                    </option>
                  ))}
                </select>
                {allocations.length === 0 ? (
                  <small className="text-muted">
                    You have no active asset allocations.
                  </small>
                ) : (
                  ""
                )}
              </div>
              <div className="mb-4">
                <label>Issue Description: </label>
                {errMsgIssue !== undefined ? (
                  <span style={{ color: "red", fontSize: "11px" }}>
                    {" "}
                    {errMsgIssue}
                  </span>
                ) : (
                  ""
                )}
                <textarea
                  className="form-control"
                  rows="3"
                  required
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Describe the issue with your asset..."
                ></textarea>
              </div>
              <div className="mb-4">
                <label>Issue Type: </label>
                <select
                  className="form-control"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                >
                  <option value="MALFUNCTION">MALFUNCTION</option>
                  <option value="REPAIR">REPAIR</option>
                </select>
              </div>
              <div className="mb-4">
                <input
                  type="submit"
                  className="btn btn-secondary"
                  value="Raise Service Request"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaiseServiceRequest;