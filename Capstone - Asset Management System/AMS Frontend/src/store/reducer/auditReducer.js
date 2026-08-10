// Define Initial State
const initialState = {
    audits: [],
    myAudits: []
}

// Inject state and action in reducer
// Initialize state with initial value
export const auditReducer = (state = initialState, action) => {
    if (action.type === 'GET_ALL_AUDITS') {
        return {
            ...state,
            audits: action.payload
        }
    }
    if (action.type === 'GET_MY_AUDITS') {
        return {
            ...state,
            myAudits: action.payload
        }
    }
    return state
}