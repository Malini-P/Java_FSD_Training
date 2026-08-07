import { configureStore } from "@reduxjs/toolkit";
import { characterReducer } from "./store/reducer/characterReducer";
import { userReducer } from "./store/reducer/userReducer";

export const store = configureStore({
    reducer: {
        characters: characterReducer,
        users: userReducer,
    }
})