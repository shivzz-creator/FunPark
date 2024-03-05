import React, { useEffect, useState } from 'react'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Box, Button, Collapse, Paper, Table, TableBody, TableHead, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import { saveAs } from 'file-saver';
import CustomBarChart from '../../components/CustomBarChart'
import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import * as XLSX from 'xlsx';
import bg from '../../assets/bg3.jpeg';

const ViewStdAttendance = () => {
    const dispatch = useDispatch();

    const [openStates, setOpenStates] = useState({});
    const [groupedAttendance, setgroupedAttendance] = useState([]);
    
    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);
    useEffect(() => {
        if (userDetails.attendance) {
            const sortedAttendance = [...userDetails.attendance].sort((a, b) => new Date(a.date) - new Date(b.date));
            setgroupedAttendance(sortedAttendance);
        }

    }, [userDetails])


    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id])


    const handleExportToExcel = () => {

        if (groupedAttendance.length === 0) {
            alert('No data to export.');
            return;
        }

        // Prepare data for export
        const dataForExport = [['Date', 'Status']];
        groupedAttendance.forEach((entry) => {
            dataForExport.push([formatDate(entry.date), entry.status]);
        });

        // Create a new workbook
        const ws = XLSX.utils.aoa_to_sheet(dataForExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance Data');

        // Save the workbook to an Excel file
        const excelFileName = `${currentUser.name} AttendanceData.xlsx`;
        XLSX.writeFile(wb, excelFileName);
    };

    // if (response) { console.log(response) }
    // else if (error) { console.log(error) }
    // Step 1: Calculate the total number of days
    let attendancePercentage;
    // let groupedAttendance=[];
    if (userDetails.attendance) {
        const totalDays = userDetails.attendance.length;
        const presentDays = userDetails.attendance.filter((entry) => entry.status === "Present").length;

        attendancePercentage = (presentDays / totalDays) * 100;

        console.log(`Attendance Percentage: ${attendancePercentage}%`);

    }


    return (
        <div style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>Attendance Percentage :-)  {attendancePercentage.toFixed(2)}%</h1>
            <div style={{ margin: '20px', textAlign: 'center'}}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Date</th>
                            <th style={tableHeaderStyle}>Status</th>
                            {/* Add more table headers for additional properties */}
                        </tr>
                    </thead>
                    <tbody>
                        {groupedAttendance.map((value, ind) => (
                            <tr key={ind} style={tableRowStyle}>
                                <td style={tableCellStyle}>
                                    <span style={dateStyle}>{formatDate(value.date)}</span>
                                </td>
                                <td style={tableCellStyle}>
                                    <span style={getStatusCellStyle(value.status)}>{value.status}</span>
                                </td>
                                {/* Add more table cells for additional properties */}
                            </tr>
                        ))}
                    </tbody>
                    <Button variant="contained" color="primary" onClick={handleExportToExcel}>
                        Export to Excel
                    </Button>
                </table>
            </div>


        </div>
    )
}
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
    display: 'block', // To place each date on a new line
    fontWeight: 'bold', // Optional: Make the date bold
    textAlign: 'left',
};
const getStatusCellStyle = (status) => ({
    ...tableCellStyle,
    color: status === 'Present' ? 'green' : 'red',
    fontWeight: 'bold',
});

const statusStyle = {
    textAlign: 'left',
    display: 'block', // To place each status on a new line
    // You can add more styles as needed
};
export default ViewStdAttendance