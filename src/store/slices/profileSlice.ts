import { createSlice } from '@reduxjs/toolkit';

// profileSlice is now minimized as most features were discontinued.
// Keeping the slice for potential future use or to avoid breaking store configuration.

interface ProfileState {
  // Add future state here
}

const initialState: ProfileState = {};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfile: (state) => {
      return initialState;
    },
  },
});

export const { resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
