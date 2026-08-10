// Action functions called from Component — must be exportable
import axios from "axios"

const getAllAuditsApi = 'http://localhost:8080/api/audits/all'
const getMyAuditsApi   = 'http://localhost:8080/api/audits/my'

// Prepare config header
const getConfig = () => ({
    headers: {
        'Authorization': "Bearer " + localStorage.getItem('token')
    }
})

export const getAllAudits = () => {
    // Action Fn must return a Fn having action object wrapped in dispatch
    return async (dispatch) => { // Thunk gives us dispatch
        // Call the GET ALL API
        const response = await axios.get(getAllAuditsApi, getConfig())
        // dispatch the action object
        let action = {
            type: 'GET_ALL_AUDITS',
            payload: response.data
        }
        dispatch(action)
    }
}

export const getMyAudits = () => {
    return async (dispatch) => {
        // Call the GET MY AUDITS API
        const response = await axios.get(getMyAuditsApi, getConfig())
        let action = {
            type: 'GET_MY_AUDITS',
            payload: response.data
        }
        dispatch(action)
    }
}