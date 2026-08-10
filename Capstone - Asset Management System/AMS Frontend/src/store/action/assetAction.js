// Action functions will be called from Component so make them exportable

import axios from "axios"

// Prepare the header
const config = () => ({
    headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
})

const getAllApi       = 'http://localhost:8080/api/assets/all'
const getAvailableApi = 'http://localhost:8080/api/assets/available'

export const getAllAssets = (page = 0, size = 7) => {
    // action Fn must return a Fn having action object wrapped in dispatch
    return async (dispatch) => { // Thunk gives us dispatch
        const response = await axios.get(`${getAllApi}?page=${page}&size=${size}`, config())
        let action = { type: 'ASSET_GET_ALL', payload: response.data }
        dispatch(action)
    }
}

export const getAvailableAssets = () => {
    return async (dispatch) => {
        const response = await axios.get(getAvailableApi, config())
        let action = { type: 'ASSET_GET_AVAILABLE', payload: response.data }
        dispatch(action)
    }
}