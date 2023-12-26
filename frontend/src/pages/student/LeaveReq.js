import { useEffect, useState } from 'react';
import { Box, CircularProgress, MenuItem, Stack, TextField, Typography } from '@mui/material';
import Popup from '../../components/Popup';
import { BlueButton } from '../../components/buttonStyles';
import { addStuff } from '../../redux/userRelated/userHandle';
import { useDispatch, useSelector } from 'react-redux';
import bg from '../../assets/bg3.jpeg';

const LeaveReq = () => {
    const [leaveType, setLeaveType] = useState("");
    const [date, setDate] = useState("");

    const dispatch = useDispatch()
    const { status, currentUser, error } = useSelector(state => state.user);

    const userId = currentUser._id
    const school = currentUser.school._id
    const address = "LeaveRequest"

    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        userId,
        date,
        leaveType,
        school
    };

    const submitHandler = (event) => {
        // console.log(user,"printing user");
        event.preventDefault()
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === "added") {
            setLoader(false)
            setShowPopup(true)
            setMessage("Done Successfully")
        }
        else if (error) {
            setLoader(false)
            setShowPopup(true)
            setMessage("Network Error")
        }
    }, [status, error])

    return (
        <div style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', minHeight: '100vh' }}>
            <Box
                sx={{
                    flex: '1 1 auto',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Box
                    sx={{
                        maxWidth: 550,
                        px: 3,
                        py: '100px',
                        width: '100%'
                    }}
                >
                    <div >
                        <Stack spacing={1} sx={{ mb: 3 }}>
                            <Typography variant="h4">Leave Request </Typography>
                        </Stack>
                        <form onSubmit={submitHandler}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Select Date"
                                    type="date"
                                    value={date}
                                    onChange={(event) => setDate(event.target.value)} required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Select Leave Type"
                                    select
                                    variant="outlined"
                                    value={leaveType}
                                    onChange={(event) => setLeaveType(event.target.value)}
                                    required
                                >
                                    <MenuItem value="Medical Leave">Medical Leave</MenuItem>
                                    <MenuItem value="Recreational Leave">Recreational Leave</MenuItem>
                                    <MenuItem value="Emergency Leave">Emergency Leave</MenuItem>
                                </TextField>
                            </Stack>
                            <BlueButton
                                fullWidth
                                size="large"
                                sx={{ mt: 3 }}
                                variant="contained"
                                type="submit"
                                disabled={loader}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Submit Request"}
                            </BlueButton>
                        </form>
                    </div>
                </Box>
            </Box>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};
export default LeaveReq;
