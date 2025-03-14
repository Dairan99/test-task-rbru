import { configureStore } from "@reduxjs/toolkit";
import startReducer from "./slice"


const store = configureStore({
    reducer: {
        start:startReducer,
    },
})

export default store