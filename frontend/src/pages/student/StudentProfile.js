import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Card, CardContent, Typography, Grid, Box, Avatar, Container, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
// import QRCode from 'qrcode.react';
// import { useParams, useNavigate } from 'react-router-dom';

import StarRating from './StarRating';
import './starRating.css';
import './EmployeeProfile.css';
import QRCode from 'qrcode.react';


const EmployeeProfile = () => {
  const { userDetails, currentUser, response, error } = useSelector((state) => state.user);
  let attendancePercentage;
  // let groupedAttendance=[];
  if (userDetails.attendance) {
    const totalDays = userDetails.attendance.length;
    const presentDays = userDetails.attendance.filter((entry) => entry.status === "Present").length;

    attendancePercentage = (presentDays / totalDays) * 100;

  }

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }
  // const totalDays = userDetails.attendance.length;

  // // Step 2: Count the number of "Present" days
  // const presentDays = userDetails.attendance.filter((entry) => entry.status === "Present").length;

  // // Step 3: Calculate the attendance percentage
  // const attendancePercentage = (presentDays / totalDays) * 100;

  // console.log(`Attendance Percentage: ${attendancePercentage}%`);
  const qrCodeData = {
    name: currentUser.name,
    rollNum: currentUser.rollNum,
    bloodGroup: currentUser.bloodGroup,
    address: currentUser.address,
    dateOfJoining: currentUser.dateOfJoining,
    insurancePolicyNumber: currentUser.insurancePolicyNumber,
    redirectLink:"www.google.com"
  };
  const qrCodeString = JSON.stringify(qrCodeData);

  console.log(qrCodeString);
  return (
    <Container maxWidth="md" style={{ background: '#f0f2f5', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar alt="Employee Avatar" src={currentUser.profilePicture || 'default-avatar.jpg'} sx={{ width: 150, height: 150, backgroundColor: '#fff', border: '2px solid #4db5ff', borderRadius: '50%' }} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" component="h2" style={{ textAlign: 'center', fontSize: '24px', marginBottom: '10px', fontWeight: 'bold' }}>
            {currentUser.name} 🌟
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" component="p" style={{ textAlign: 'center', fontSize: '16px', color: '#333', fontWeight: 'bold' }}>
            <span role="img" aria-label="Employee ID">Employee 🆔</span> {currentUser.rollNum}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" component="p" style={{ textAlign: 'center', fontSize: '16px', color: '#333' }}>
            <span style={{ fontWeight: 'bold' }}>Blood Group:</span> {currentUser.bloodGroup} 💉
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" component="p" style={{ textAlign: 'center', fontSize: '16px', color: '#333' }}>
            <span style={{ fontWeight: 'bold' }}>Address:</span> {currentUser.address} 🏠
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" component="p" style={{ textAlign: 'center', fontSize: '16px', color: '#333' }}>
            <span style={{ fontWeight: 'bold' }}>Date of Joining:</span> {currentUser.dateOfJoining} 📅
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" component="p" style={{ textAlign: 'center', fontSize: '16px', color: '#333' }}>
            <span style={{ fontWeight: 'bold' }}>Insurance Policy Number:</span> {currentUser.insurancePolicyNumber} 💉
          </Typography>
        </Grid>
      </Grid>

      <Card style={{ margin: '20px 0', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
            Highlighted Leader Board Ranking 🏆
          </Typography>
          {/* Add your code for leader board ranking here */}
        </CardContent>
      </Card>

      <Card style={{ margin: '20px 0', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom style={ {fontWeight: 'bold'} }>
            Ratings in Stars ⭐
          </Typography>
          <StarRating rating={currentUser.starRating} />
        </CardContent>
      </Card>

      <Card style={{ margin: '20px 0', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
            Attendance  Details 📊
          </Typography>
          {attendancePercentage}{"%"}
        </CardContent>
      </Card>
      <Card style={{ margin: '20px 0', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
            Incentives earned so far
          </Typography>
          {userDetails.incentiveEarned}{" Rs"}
        </CardContent>
      </Card>
      <Card style={{ margin: '20px 0', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
            QR Code
          </Typography>
          {/* Display the QR code */}
          <QRCode value={qrCodeString} />
        </CardContent>
      </Card>
    </Container>
  );
}

export default EmployeeProfile;
