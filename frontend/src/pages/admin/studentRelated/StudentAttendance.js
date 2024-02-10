import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

import {
    Box, InputLabel,
    MenuItem, Select,
    Typography, Stack,
    TextField, CircularProgress, FormControl
} from '@mui/material';
import { PurpleButton } from '../../../components/buttonStyles';
import Popup from '../../../components/Popup';

const StudentAttendance = ({ situation }) => {
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);
    const params = useParams()

    const [studentID, setStudentID] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        if (situation === "Student") {
            setStudentID(params.id);
            const stdID = params.id
            dispatch(getUserDetails(stdID, "Student"));
        }
        else if (situation === "Subject") {
            setStudentID(params.id);
            const stdID = params.id
            dispatch(getUserDetails(stdID, "Student"));
            // const { studentID, subjectID } = params
            // setStudentID(studentID);
            // dispatch(getUserDetails(studentID, "Student"));
            // setChosenSubName(subjectID);
        }
    }, [situation]);

    // useEffect(() => {
    //     if (userDetails && userDetails.sclassName && situation === "Student") {
    //         dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
    //     }
    // }, [dispatch, userDetails]);

    // const changeHandler = (event) => {
    //     const selectedSubject = subjectsList.find(
    //         (subject) => subject.subName === event.target.value
    //     );
    //     setSubjectName(selectedSubject.subName);
    //     setChosenSubName(selectedSubject._id);
    // }

    const fields = { status, date }

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(updateStudentFields(studentID, fields, "StudentAttendance"));
        let { incentiveEarned } = userDetails;
        console.log(userDetails);

        if (status === 'Present') {

            // Calculate the time difference in minutes
            const selectedDate = new Date(date);
            const tenAM = new Date(selectedDate);
            tenAM.setHours(10, 0, 0, 0);

            const timeDifferenceInMinutes = (selectedDate - tenAM) / (1000 * 60);

            // If the attendance is more than 30 minutes after 10 AM, deduct incentiveEarned
            if (timeDifferenceInMinutes > 30) {
                incentiveEarned = incentiveEarned - 100;
                console.log(incentiveEarned);
                // Dispatch an action to update the incentiveEarned field in the database
            }
            else if (timeDifferenceInMinutes > 30 && timeDifferenceInMinutes <= 300) {
                // If attendance is more than 30 mins but within 5 hours, deduct 500 rs
                incentiveEarned = incentiveEarned - 500;
            } else if (timeDifferenceInMinutes > 300 && timeDifferenceInMinutes <= 480) {
                // If attendance is between 5 hours and 8 hours, deduct 750 rs
                incentiveEarned = incentiveEarned - 750;
            } else if (timeDifferenceInMinutes > 480) {
                // If attendance is more than 8 hours, mark as absent
                // You may want to handle this case differently, like setting 'Absent' in the status field
                setStatus('Absent');
            }
            dispatch(updateStudentFields(studentID, { incentiveEarned: incentiveEarned }, "UpdateExamResult"));

        }
    }

    useEffect(() => {
        if (response) {
            setLoader(false)
            setShowPopup(true)
            setMessage(response)
        }
        else if (error) {
            setLoader(false)
            setShowPopup(true)
            setMessage("error")
        }
        else if (statestatus === "added") {
            setLoader(false)
            setShowPopup(true)
            setMessage("Done Successfully")
        }
    }, [response, statestatus, error])

    return (
        <>
            {loading
                ?
                <>
                    <div>Loading...</div>
                </>
                :
                <>
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
                            <Stack spacing={1} sx={{ mb: 3 }}>
                                <Typography variant="h4">
                                    Employee Name: {userDetails.name}
                                </Typography>
                                {/* {currentUser.teachSubject &&
                                    <Typography variant="h4">
                                        Subject Name: {currentUser.teachSubject?.subName}
                                    </Typography>
                                } */}
                            </Stack>
                            <form onSubmit={submitHandler}>
                                <Stack spacing={3}>
                                    {/* {
                                        situation === "Student" &&
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Select Subject</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={subjectName}
                                                label="Choose an option"
                                                onChange={changeHandler} required
                                            >
                                                {subjectsList ?
                                                    subjectsList.map((subject, index) => (
                                                        <MenuItem key={index} value={subject.subName}>
                                                            {subject.subName}
                                                        </MenuItem>
                                                    ))
                                                    :
                                                    <MenuItem value="Select Subject">
                                                        Add Subjects For Attendance
                                                    </MenuItem>
                                                }
                                            </Select>
                                        </FormControl>
                                    } */}
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Attendance Status</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={status}
                                            label="Choose an option"
                                            onChange={(event) => setStatus(event.target.value)}
                                            required
                                        >
                                            <MenuItem value="Present">Present</MenuItem>
                                            <MenuItem value="Absent">Absent</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        
                                        <TextField
                                            label="Select Date and Time"
                                            type="datetime-local"
                                            value={date}
                                            onChange={(event) => setDate(event.target.value)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </FormControl>
                                </Stack>

                                <PurpleButton
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 3 }}
                                    variant="contained"
                                    type="submit"
                                    disabled={loader}
                                >
                                    {loader ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                                </PurpleButton>
                            </form>
                        </Box>
                    </Box>
                    <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
                </>
            }
        </>
    )
}

export default StudentAttendance