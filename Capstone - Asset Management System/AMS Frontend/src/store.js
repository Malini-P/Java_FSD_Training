import { configureStore } from "@reduxjs/toolkit";
import { auditReducer } from "./store/reducer/auditReducer";
import { userReducer } from "./store/reducer/userReducer";
import { assetReducer } from "./store/reducer/assetReducer";
import { categoryReducer } from "./store/reducer/categoryReducer";

export const store = configureStore({
    reducer: {
        auditState: auditReducer,
        userState: userReducer,
        assetState: assetReducer,
        categoryState: categoryReducer
    }
});