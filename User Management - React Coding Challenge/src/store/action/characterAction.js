import axios from "axios";

export const getAllData = (page) => {  //gets page num
    return async (dispatch) => {
        const response = await axios.get(`https://rickandmortyapi.com/api/character/?page=${page + 1}`);  //current page is 0 api is 1
        let action = {
            type: "GET_ALL",
            payload: response.data  //carries data from api to reducer
        }
        dispatch(action); //action to reducer 
    }

}

//action - dispatch - reducer