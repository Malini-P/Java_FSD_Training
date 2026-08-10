// Define Initial State
const initialState = { assets: [], availableAssets: [] }

// Inject state and action in reducer and initialize state with initial value
export const assetReducer = (state = initialState, action) => {
    if (action.type === 'ASSET_GET_ALL') {
        return {
            ...state, //making a clone to replace earlier immutable state to new state
            assets: action.payload.data,         // paginated data array
            totalPages: action.payload.totalPages // total pages count
        }
    }
    if (action.type === 'ASSET_GET_AVAILABLE') {
        return {
            ...state,
            availableAssets: action.payload
        }
    }
    return state
}