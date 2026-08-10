// Action functions called from Component — must be exportable
import axios from "axios"

const getAllUsersApi = 'http://localhost:8080/api/users/all'

// Prepare config header
const getConfig = () => ({
    headers: {
        'Authorization': "Bearer " + localStorage.getItem('token')
    }
})

export const getUsers = () => {
    // Action Fn must return a Fn having action object wrapped in dispatch
    return async (dispatch) => { // Thunk gives us dispatch
        // Call the GET ALL API
        const response = await axios.get(getAllUsersApi, getConfig())
        // dispatch the action object
        let action = {
            type: 'GET_ALL_USERS',
            payload: response.data
        }
        dispatch(action)
    }
}

export const removeUser = (userId) => {
    return (dispatch) => {
        // dispatch soft delete — removes from local state via filter()
        let action = {
            type: 'USER_DELETE',
            payload: userId
        }
        dispatch(action)
    }
}