import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotices } from '../redux/noticeRelated/noticeHandle';
import { Paper } from '@mui/material';
import TableViewTemplate, { StyledTableCell } from './TableViewTemplate';
import notice from "../assets/notice.jpeg";
import bg from "../assets/bg3.jpeg";

const SeeNotice = () => {
    const dispatch = useDispatch();

    const { currentUser, currentRole } = useSelector(state => state.user);
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);

    useEffect(() => {
        if (currentRole === "Admin") {
            dispatch(getAllNotices(currentUser._id, "Notice"));
        }
        else {
            dispatch(getAllNotices(currentUser.school._id, "Notice"));
        }
    }, [dispatch]);

    if (error) {
        console.log(error);
    }

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 170 },
    ];

    const noticeRows = noticesList.map((notice) => {
        const date = new Date(notice.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
        return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            id: notice._id,
        };
    });

    const tableViewTemplateStyle = {
        backgroundColor: 'green', // Change this to the desired color
    };

    return (
        <div style={{
            marginTop: '5px', marginRight: '20px'
            }}>
            {loading ? (
                <div style={{ fontSize: '20px' }}>Loading...</div>
            ) : response ? (
                <div style={{ fontSize: '20px' }}>No Notices to Show Right Now</div>
            ) : (
                <>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={notice} style={{ width: '75px', height: '75px', marginRight: '20px' }} alt="Notice" />
                        <h3 style={{ fontSize: '40px', marginBottom: '20px', textAlign: "center" }}>NOTICE BOARD</h3>
                        <img src={notice} style={{ width: '75px', height: '75px', marginLeft: '20px' }} alt="Notice" />
                    </div>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        {Array.isArray(noticesList) && noticesList.length > 0 && (
                            <TableViewTemplate
                                columns={noticeColumns}
                                rows={noticeRows}
                                style={tableViewTemplateStyle}
                            />
                        )}
                    </Paper>
                </>
            )}
        </div>
    );
}

export default SeeNotice;
