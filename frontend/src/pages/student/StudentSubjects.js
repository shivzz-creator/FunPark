import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList, updateSubjectDetails } from '../../redux/sclassRelated/sclassHandle';
import { BottomNavigation, BottomNavigationAction, Button, Card, CardContent, Container, Paper, Table, TableBody, TableHead, Typography } from '@mui/material';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import CustomBarChart from '../../components/CustomBarChart';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import zonebg from '../../assets/zonebg.jpg';


const StudentSubjects = () => {
    const dispatch = useDispatch();
    const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id])

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            setSubjectMarks(userDetails.examResult || []);
        }
    }, [userDetails])

    useEffect(() => {
        if (subjectMarks.length === 0) {
            dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
        }
    }, [subjectMarks, dispatch, currentUser.sclassName._id]);

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const [checkedActivities, setCheckedActivities] = useState([]);
    const handleToggleActivity = (activityId) => {
        if (checkedActivities.includes(activityId)) {
            setCheckedActivities(checkedActivities.filter((id) => id !== activityId));
        } else {
            setCheckedActivities([...checkedActivities, activityId]);
        }
    };

    const handleSaveChanges = () => {
        if (checkedActivities) {
            console.log("inside handlesave");
            checkedActivities.forEach(id => {
                dispatch(updateSubjectDetails(id, { isChecked: true }, "checkedActivities"));
            });
        }
        console.log("Saving changes:", checkedActivities);
    };

    const renderTableSection = () => {
        return (
            <Card sx={{ maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Subject Marks
                    </Typography>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell>Marks</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {subjectMarks.map((result, index) => {
                                if (!result.subName || !result.marksObtained) {
                                    return null;
                                }
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{result.subName.subName}</StyledTableCell>
                                        <StyledTableCell>{result.marksObtained}</StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        );
    };

    const renderChartSection = () => {
        return (
            <Card sx={{ maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
                <CardContent>
                    <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
                </CardContent>
            </Card>
        );
    };

    const renderClassDetailsSection = () => {
        return (
            <Card sx={{ maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom fontWeight={"bold"}>
                        Your Job for Today
                    </Typography>
                    <Typography variant="h4" gutterBottom fontWeight={"bold"} color={"green"} >
                        {userDetails.sclassName ? userDetails.sclassName.sclassName : "No Zone Alloted"}
                    </Typography>
                    <Typography variant="h7" gutterBottom>
                        Check all the requirements for the bellow activities assigned to you and if requirements are fullfilled tick the checkbox or else report a complain to park manager and leave checkbox empty.
                    </Typography>
                    {subjectsList &&
                        subjectsList.map((subject, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center' ,textAlign: "center", flex: 1 }}>
                                <input
                                    type="checkbox"
                                    checked={checkedActivities.includes(subject._id)}
                                    onChange={() => handleToggleActivity(subject._id)}
                                    style={{ width: '30px', height: '30px' }}
                                />
                                <Typography variant="subtitle1" style={{ marginLeft: '8px', fontSize:"30px" }}>
                                    {subject.subName} ({subject.subCode})
                                </Typography>
                            </div>
                        ))}
                    <Button variant="contained" color="primary" onClick={handleSaveChanges} style={{margin:"15px", padding:"10px"}}>
                        Update Activity Status
                    </Button>
                </CardContent>
            </Card>
        );
    };

    return (
        <div >
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div style={{ backgroundImage: `url(${zonebg})`, minHeight: '100vh', overflow: 'hidden', backgroundSize: 'cover'}}>
                    {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 ? (
                        <>
                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}
                            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                                <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                    <BottomNavigationAction
                                        label="Table"
                                        value="table"
                                        icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                    />
                                    <BottomNavigationAction
                                        label="Chart"
                                        value="chart"
                                        icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                    />
                                </BottomNavigation>
                            </Paper>
                        </>
                    ) : (
                        <>
                            {renderClassDetailsSection()}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentSubjects;
