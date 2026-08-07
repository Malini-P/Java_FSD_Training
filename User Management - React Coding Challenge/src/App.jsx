import { Routes, Route, NavLink } from "react-router-dom";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import Character from "./components/Character";

const App = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
                <span className="navbar-brand">User Management Dashboard</span>
                <div className="navbar-nav">
                    <NavLink to="/users" className="nav-link">User List</NavLink>
                    <NavLink to="/add-user" className="nav-link">Add User</NavLink>
                    <NavLink to="/characters" className="nav-link"> Characters</NavLink>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<UserList />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/add-user" element={<AddUser />} />
                <Route path="/characters" element={<Character />} />
            </Routes>
        </>
    );
};

export default App;