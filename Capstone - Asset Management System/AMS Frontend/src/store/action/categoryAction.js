// Action functions will be called from Component so make them exportable

import axios from "axios"

// Prepare the header
const config = () => ({
    headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
})

const getAllApi = 'http://localhost:8080/api/categories/all'

export const getAllCategories = () => {
    // action Fn must return a Fn having action object wrapped in dispatch
    return async (dispatch) => { // Thunk gives us dispatch
        const response = await axios.get(getAllApi, config())
        let action = { type: 'CATEGORY_GET_ALL', payload: response.data }
        dispatch(action)
    }
}