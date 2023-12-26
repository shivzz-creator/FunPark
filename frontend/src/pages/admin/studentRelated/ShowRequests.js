import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Paper, Box, Checkbox
} from '@mui/material';
import { getAllLeaveRequests } from '../../../redux/leaveRelated/leavehandle'; // Assume you have a similar action for leave requests
import TableTemplate from '../../../components/TableTemplate';
import bg from "../../../assets/bg3.jpeg";
import {updateLeaveStatus} from "../../../redux/leaveRelated/leavehandle"


const ShowRequests = () => {
    // console.log("jfjjf");
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const dispatch = useDispatch();
    const { leaveRequestsList, loading, error, response } = useSelector((state) => state.leave); // Adjust the state path accordingly
    const { currentUser } = useSelector(state => state.user);
    console.log(leaveRequestsList);

    useEffect(() => {
        dispatch(getAllLeaveRequests(currentUser._id, "Leave")); // Adjust the action accordingly
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const leaveColumns = [
        { id: 'user', label: 'User', minWidth: 170 },
        { id: 'date', label: 'Date', minWidth: 170 },
        { id: 'leaveType', label: 'Leave Type', minWidth: 100 },
        { id: 'reqstatus', label: 'Status', minWidth: 100 },
        // { id: 'actions', label: 'Actions', minWidth: 100 }, // New column for actions
    ];

    const leaveRows = leaveRequestsList && leaveRequestsList.length > 0 && leaveRequestsList.map((leaveRequest) => {
        return {
            user: leaveRequest.userId.name,
            date: leaveRequest.date,
            leaveType: leaveRequest.leaveType,
            reqstatus: leaveRequest.reqstatus,
            id: leaveRequest._id,
        };
    });

    const updateStatus = (id, newStatus) => 
    {
        dispatch(updateLeaveStatus(id, {newStatus},'updateleave')) .then(() => {
              // Reload the page when the save is successful
              window.location.reload();
          });;
    };

    const LeaveButtonHaver = ({ row }) => {
        return (
            <>
                <Checkbox {...label} />
                <button onClick={() => updateStatus(row.id, 'accepted')}>
                    Accept
                </button>
                <button onClick={() => updateStatus(row.id, 'rejected')}>
                    Reject
                </button>
            </>
        );
    };

    return (
        <>
            {loading ?
                <div>Loading...</div>
                :
                <>
                    {response ?
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                            No Leave Requests Right Now
                        </Box>
                        :
                        <Paper sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            backgroundImage: `url(${bg})`,
                            backgroundSize: 'cover',
                            minHeight: '100vh'
                        }}>
                            {Array.isArray(leaveRequestsList) && leaveRequestsList.length > 0 &&
                                <TableTemplate buttonHaver={LeaveButtonHaver} columns={leaveColumns} rows={leaveRows} />
                            }
                        </Paper>
                    }
                </>
            }
        </>
    );
};

export default ShowRequests;
