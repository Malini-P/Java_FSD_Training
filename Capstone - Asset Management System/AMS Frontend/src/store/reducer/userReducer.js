// Define Initial State
const initialState = {
    users: []
}

// Inject state and action in reducer
// Initialize state with initial value
export const userReducer = (state = initialState, action) => {
    if (action.type === 'GET_ALL_USERS') {
        return {
            ...state,
            users: action.payload
        }
    }
    if (action.type === 'USER_DELETE') {
        return {
            ...state,
            // filter() removes deleted user from local state — no re-fetch needed
            users: state.users.filter(u => u.id !== action.payload)
        }
    }
    return state
}

/**
 * action structure:
 * action = { type: '', payload: '' }
 *
 * ...state  => clone existing state (immutable pattern)
 * users: action.payload => replace users array with API response
 *
 * USER_DELETE uses .filter() to remove from local state
 * instead of calling GET ALL again from server
 */