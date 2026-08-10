import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import PageNotFound from "./pages/PageNotFound";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManageAssets from "./components/admin/ManageAssets";
import ManageCategories from "./components/admin/ManageCategories";
import ManageUsers from "./components/admin/ManageUsers";
import ManageAssetRequests from "./components/admin/ManageAssetRequests";
import ManageAllocations from "./components/admin/ManageAllocations";
import ManageServiceRequests from "./components/admin/ManageServiceRequests";
import ManageAudits from "./components/admin/ManageAudits";        
import AdminWidget from "./components/admin/AdminWidget";
import MyAllocations from "./components/employee/MyAllocations";
import MyAssetRequests from "./components/employee/MyAssetRequests";
import MyServiceRequests from "./components/employee/MyServiceRequests";
import RaiseAssetRequest from "./components/employee/RaiseAssetRequest";
import RaiseServiceRequest from "./components/employee/RaiseServiceRequest";
import AssetCatalogue from "./components/employee/AssetCatalogue";  
import PendingAudits from "./components/employee/PendingAudits";    
import EmployeeWidget from "./components/employee/EmployeeWidget";
import ForgotPassword from "./components/ForgotPassword";

const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Auth />}></Route>
        <Route path="/login" element={<Auth />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="" element={<AdminWidget />}></Route>
          <Route path="categories" element={<ManageCategories />}></Route>
          <Route path="assets" element={<ManageAssets />}></Route>
          <Route path="users" element={<ManageUsers />}></Route>
          <Route path="asset-requests" element={<ManageAssetRequests />}></Route>
          <Route path="allocations" element={<ManageAllocations />}></Route>
          <Route path="service-requests" element={<ManageServiceRequests />}></Route>
          <Route path="audits" element={<ManageAudits />}></Route>          
        </Route>

        {/* Employee Routes */}
        <Route path="/employee" element={<EmployeeDashboard />}>
          <Route path="" element={<EmployeeWidget />}></Route>
          <Route path="my-allocations" element={<MyAllocations />}></Route>
          <Route path="my-asset-requests" element={<MyAssetRequests />}></Route>
          <Route path="raise-asset-request" element={<RaiseAssetRequest />}></Route>
          <Route path="my-service-requests" element={<MyServiceRequests />}></Route>
          <Route path="raise-service-request" element={<RaiseServiceRequest />}></Route>
          <Route path="asset-catalogue" element={<AssetCatalogue />}></Route> 
          <Route path="pending-audits" element={<PendingAudits />}></Route>   

        </Route>

        <Route path="*" element={<PageNotFound />}></Route>
      </Routes>
    </div>
  )

}

export default App;