import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { CircularProgress } from '@mui/material';

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { sclassesList } = useSelector((state) => state.sclass);

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [className, setClassName] = useState('');
    const [sclassName, setSclassName] = useState('');
    const [dateOfJoining, setDateOfJoining] = useState('');
    const [address, setAddress] = useState('');
    const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');

    const adminID = currentUser._id;
    const role = "Student";
    const attendance = [];

    useEffect(() => {
        if (situation === "Class") {
            setSclassName(params.id);
        }
    }, [params.id, situation]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    const changeHandler = (event) => {
        if (event.target.value === 'Select Class') {
            setClassName('Select Class');
            setSclassName('');
        } else {
            const selectedClass = sclassesList.find(
                (classItem) => classItem.sclassName === event.target.value
            );
            setClassName(selectedClass.sclassName);
            setSclassName(selectedClass._id);
        }
    };

    const fields = {
        name,
        rollNum,
        password,
        sclassName,
        adminID,
        role,
        attendance,
        dateOfJoining,
        address,
        insurancePolicyNumber,
        bloodGroup,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        if (sclassName === "") {
            setMessage("Please select a Zone");
            setShowPopup(true);
        } else {
            setLoader(true);
            dispatch(registerUser(fields, role));
        }
    };

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl());
            navigate(-1);
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <>
            <div className="register">
                <form className="registerForm" onSubmit={submitHandler}>
                    <span className="registerTitle">Add Employee</span>
                    <label>Name</label>
                    <input
                        className="registerInput"
                        type="text"
                        placeholder="Enter student's name..."
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        autoComplete="name"
                        required
                    />

                    {
                        situation === "Student" &&
                        <>
                            <label>Zone</label>
                            <select
                                className="registerInput"
                                value={className}
                                onChange={changeHandler}
                                required
                            >
                                <option value='Select Class'>Select Zone</option>
                                {sclassesList.map((classItem, index) => (
                                    <option key={index} value={classItem.sclassName}>
                                        {classItem.sclassName}
                                    </option>
                                ))}
                            </select>
                        </>
                    }

                    <label>Employee ID</label>
                    <input
                        className="registerInput"
                        type="number"
                        placeholder="Enter Employee's ID"
                        value={rollNum}
                        onChange={(event) => setRollNum(event.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        className="registerInput"
                        type="password"
                        placeholder="Enter Employee's password..."
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        required
                    />

                    <label>Date of Joining</label>
                    <input
                        className="registerInput"
                        type="date"
                        value={dateOfJoining}
                        onChange={(event) => setDateOfJoining(event.target.value)}
                        required
                    />

                    <label>Address</label>
                    <input
                        className="registerInput"
                        type="text"
                        placeholder="Enter Employee's address..."
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                    />

                    <label>Insurance Policy Number</label>
                    <input
                        className="registerInput"
                        type="text"
                        placeholder="Enter insurance policy number..."
                        value={insurancePolicyNumber}
                        onChange={(event) => setInsurancePolicyNumber(event.target.value)}
                    />

                    <label>Blood Group</label>
                    <input
                        className="registerInput"
                        type="text"
                        placeholder="Enter Employee's blood group..."
                        value={bloodGroup}
                        onChange={(event) => setBloodGroup(event.target.value)}
                    />

                    <button className="registerButton" type="submit" disabled={loader}>
                        {loader ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Add'
                        )}
                    </button>
                </form>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    )
}

export default AddStudent;
