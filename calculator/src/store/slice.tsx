import { createSlice } from "@reduxjs/toolkit"

export interface StartState {
    openCalculation:boolean
}

const initialState: StartState = {
    openCalculation:false
}

const startSlice = createSlice({
    name:"start",
    initialState,
    reducers: {
        openCalculation(state) {
            state.openCalculation = true
        },
        closeCalculation(state) {
            state.openCalculation = false
        }
    }
})

export const {openCalculation, closeCalculation} = startSlice.actions

export default startSlice.reducer