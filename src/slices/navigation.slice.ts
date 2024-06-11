// import { createSlice } from "@reduxjs/toolkit";

// export interface SidebarState {
//   open: boolean;
// }

// const initialState: SidebarState = {
//   open: false,
// };

// export const SidebarSlice = createSlice({
//   name: "Sidebar",
//   initialState,
//   reducers: {
//     toggle: (state) => {
//       // Redux Toolkit allows us to write "mutating" logic in reducers. It
//       // doesn't actually mutate the state because it uses the Immer library,
//       // which detects changes to a "draft state" and produces a brand new
//       // immutable state based off those changes
//       state.open = !state.open;
//     },
//     close: (state) => {
//       state.open = false;
//     },

//     // incrementByAmount: (state, action: PayloadAction<number>) => {
//     //   state.value += action.payload;
//     // },
//   },
// });

// // Action creators are generated for each case reducer function
// export const { toggle, close } = SidebarSlice.actions;

// export default SidebarSlice.reducer;
