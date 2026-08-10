import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const Login = () => {
  // which tab is active - ADMIN or EMPLOYEE
  const [activeRole, setActiveRole] = useState("EMPLOYEE");

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [errMsg, setErrMsg] = useState();

  const loginApi = "http://localhost:8080/api/auth/login";
  const profileApi = "http://localhost:8080/api/auth/profile";

  const navigate = useNavigate();

  // switching tab clears any previous error/fields, same as a fresh form
  const switchTab = (role) => {
    setActiveRole(role);
    setErrMsg(undefined);
    setUsername("");
    setPassword("");
  };

  const onLogin = async (e) => {
    e.preventDefault();
    // Prepare the header with basic auth
    const config = {
      headers: {
        Authorization: "Basic " + window.btoa(username + ":" + password),
      },
    };

    try {
      const response = await axios.post(loginApi, {}, config);
      console.log(response.data);
      let token = response.data.token;

      // Prepare the header
      const config_details = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      // Fetch user details to get profile
      const resp = await axios.get(profileApi, config_details);
      console.log(resp.data);
      let role = resp.data.role;

      //user must login from the tab matching their actual role
      if (role !== activeRole) {
        setErrMsg(
          "This account is registered as " + role +
          ". Please use the " + role + " tab to sign in."
        );
        return;
      }

      // Save token and username in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);

      switch (role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "EMPLOYEE":
          navigate("/employee");
          break;
        default:
          setErrMsg("Invalid credentials");
          break;
      }
    } catch (err) {
      setErrMsg("Invalid credentials");
    }
  };

  return (
    <div className="auth-shell">
      {/* Brand panel */}
      <div className="auth-brand-panel">
        <div className="auth-grid-deco"></div>

        <div className="auth-brand-mark">
          <div className="ams-logo">AMS</div>
          <div className="app-sidebar-brand-text">
            <strong>AMS Console</strong>
            <span>Asset Management System</span>
          </div>
        </div>

        <div className="auth-brand-copy">
          <h1>Manage every asset, request, and audit in one place.</h1>
          <p>
            Sign in to track allocations, review asset and service requests,
            and keep your organization's inventory under control.
          </p>
        </div>

        <div className="auth-stat-row">
          <div>
            <strong>01</strong>
            <span>Catalogue Assets</span>
          </div>
          <div>
            <strong>02</strong>
            <span>Route Requests</span>
          </div>
          <div>
            <strong>03</strong>
            <span>Audit & Allocate</span>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in with your AMS credentials to continue.</p>

          {/* Role Tabs */}
          <div className="auth-role-tabs">
            <button
              type="button"
              className={"auth-role-tab" + (activeRole === "EMPLOYEE" ? " active" : "")}
              onClick={() => switchTab("EMPLOYEE")}
            >
              <i className="bi bi-person"></i>
              Employee
            </button>
            <button
              type="button"
              className={"auth-role-tab" + (activeRole === "ADMIN" ? " active" : "")}
              onClick={() => switchTab("ADMIN")}
            >
              <i className="bi bi-shield-lock"></i>
              Admin
            </button>
          </div>

          <form onSubmit={(e) => onLogin(e)}>
            {errMsg !== undefined ? (
              <div className="alert alert-danger d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-circle"></i>
                {errMsg}
              </div>
            ) : (
              ""
            )}
            <div className="mb-3">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password || ""}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="submit"
                value={activeRole === "ADMIN" ? "Sign In as Admin" : "Sign In as Employee"}
                className="btn btn-primary w-100"
              />
            </div>
            <div className="text-center">
              <Link to="/forgot-password" className="small">Forgot Password?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;