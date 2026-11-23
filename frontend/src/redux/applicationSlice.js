import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name:'application',
    initialState:{
        applicants:null,
    },
    reducers:{
        setAllApplicants:(state,action) => {
            state.applicants = action.payload;
        },
        updateApplicantStatus:(state,action) => {
            const { applicationId, status, interviewDate, recruiterNote } = action.payload;
            if (state.applicants?.applications) {
                state.applicants.applications = state.applicants.applications.map((application) =>
                    application._id === applicationId
                        ? { ...application, status, interviewDate, recruiterNote }
                        : application
                );
            }
        }
    }
});
export const {setAllApplicants, updateApplicantStatus} = applicationSlice.actions;
export default applicationSlice.reducer;