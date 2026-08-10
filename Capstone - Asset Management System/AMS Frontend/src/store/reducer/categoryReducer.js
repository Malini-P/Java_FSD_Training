// Define Initial State
const initialState = { categories: [] }

// Inject state and action in reducer and initialize state with initial value
export const categoryReducer = (state = initialState, action) => {
    if (action.type === 'CATEGORY_GET_ALL') {
        return {
            ...state, //making a clone to replace earlier immutable state to new state
            categories: action.payload // attach data(payload) to categories in store
        }
    }
    return state
}