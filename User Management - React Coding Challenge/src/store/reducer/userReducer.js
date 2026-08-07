const initialState = {
    users: []
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_USERS":
            return { ...state, users: action.payload };
        case "DELETE_USER":
            return { ...state, users: state.users.filter((u) => u.id !== action.payload) };
        case "ADD_USER":
            return { ...state, users: [...state.users, action.payload] };
        default:
            return state;
    }
}