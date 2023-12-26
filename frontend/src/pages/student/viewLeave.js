import React, { useEffect, useState } from 'react';
import { Button, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { showLeaveStatus } from '../../redux/leaveRelated/leavehandle';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import bg from '../../assets/bg3.jpeg';

const ViewLeave = () => {
    const dispatch = useDispatch();

    const [groupedLeaveRequests, setGroupedLeaveRequests] = useState([]);
    const { leaveRequestsList, loading, error, response } = useSelector((state) => state.leave);

    const { userDetails, currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        if (leaveRequestsList) {
            const sortedLeaveRequests = [...leaveRequestsList].sort((a, b) => new Date(a.date) - new Date(b.date));
            setGroupedLeaveRequests(sortedLeaveRequests);
        }
    }, [leaveRequestsList]);
    useEffect(() => {
        dispatch(showLeaveStatus(currentUser._id, "Show"));
    }, [dispatch, currentUser._id]);
    // console.log(userDetails);
    const handleExportToExcel = () => {
        if (groupedLeaveRequests.length === 0) {
            alert('No data to export.');
            return;
        }

        // Prepare data for export
        const dataForExport = [['Date', 'Leave Type', 'Status']];
        groupedLeaveRequests.forEach((leaveRequest) => {
            dataForExport.push([formatDate(leaveRequest.date), leaveRequest.leaveType, leaveRequest.reqstatus]);
        });

        // Create a new workbook
        const ws = XLSX.utils.aoa_to_sheet(dataForExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'LeaveRequestsData');

        // Save the workbook to an Excel file
        const excelFileName = `${currentUser.name}_LeaveRequestsData.xlsx`;
        XLSX.writeFile(wb, excelFileName);
    };

    return (
        <div style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>Leave Request Status</h1>
            <div style={{ margin: '20px', textAlign: 'center' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Date</th>
                            <th style={tableHeaderStyle}>Leave Type</th>
                            <th style={tableHeaderStyle}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {console.log(groupedLeaveRequests)} */}
                        {groupedLeaveRequests.map((leaveRequest, index) => (
                            <tr key={index} style={tableRowStyle}>
                                <td style={tableCellStyle}>
                                    <span style={dateStyle}>{formatDate(leaveRequest.date)}</span>
                                </td>
                                <td style={tableCellStyle}>
                                    <span>{leaveRequest.leaveType}</span>
                                </td>
                                <td style={tableCellStyle}>
                                    <span style={getStatusCellStyle(leaveRequest.reqstatus)}>{leaveRequest.reqstatus}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Button variant="contained" color="primary" onClick={handleExportToExcel}>
                    Export to Excel
                </Button>
            </div>
        </div>
    );
};

const tableHeaderStyle = {
    background: '#f2f2f2',
    padding: '10px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
};

const tableRowStyle = {
    borderBottom: '1px solid #ddd',
};

const tableCellStyle = {
    padding: '10px',
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
};

const dateStyle = {
    display: 'block',
    fontWeight: 'bold',
    textAlign: 'left',
};

const getStatusCellStyle = (status) => ({
    ...tableCellStyle,
    color: status === 'accepted' ? 'green' : status === 'Pending' ? 'orange' : 'red',
    fontWeight: 'bold',
});

export default ViewLeave;
