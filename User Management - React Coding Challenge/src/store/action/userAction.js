import axios from "axios";

export const fetchUsers = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get("https://jsonplaceholder.typicode.com/users");
            const addedUsers = JSON.parse(localStorage.getItem("addedUsers")) || [];
            dispatch({
                type: "GET_USERS",
                payload: [...response.data, ...addedUsers]
            });
        } catch (err) {
            console.log(err);
        }
    }
}

export const deleteUser = (id) => {
    return async (dispatch, getState) => {
        try {
            await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
            const currentUsers = getState().users.users;
            const filteredUsers = currentUsers.filter((user) => user.id !== id);
            localStorage.setItem(
                "addedUsers",
                JSON.stringify(filteredUsers.filter((user) => user.id > 10))
            );
            dispatch({ type: "DELETE_USER", payload: id });
        } catch (err) {
            console.log(err);
        }
    }
}

export const addUser = (body) => {
    return async (dispatch) => {
        try {
            const resp = await axios.post("https://jsonplaceholder.typicode.com/users", body);
            console.log(resp.data);
            const storedUsers = JSON.parse(localStorage.getItem("addedUsers")) || [];
            storedUsers.push(body);
            localStorage.setItem("addedUsers", JSON.stringify(storedUsers));
            dispatch({ type: "ADD_USER", payload: body });
        } catch (err) {
            console.log(err);
        }
    }
}