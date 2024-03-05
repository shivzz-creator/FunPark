const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const sclass = require('../models/sclassSchema.js');
const Leave = require('../models/LeaveSchema.js');
const InventoryItem = require('../models/inventorySchema.js');


const { findByIdAndUpdate } = require('../models/adminSchema.js');
const mongoose = require('mongoose');
const studentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const existingStudent = await Student.findOne({
            rollNum: req.body.rollNum,
            school: req.body.adminID,
            sclassName: req.body.sclassName,
        });

        if (existingStudent) {
            res.send({ message: 'Roll Number already exists' });
        }
        else {
            const student = new Student({
                ...req.body,
                school: req.body.adminID,
                password: hashedPass
            });

            let result = await student.save();

            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const studentLogIn = async (req, res) => {
    try {
        let student = await Student.findOne({ rollNum: req.body.rollNum, name: req.body.studentName });
        if (student) {
            const validated = await bcrypt.compare(req.body.password, student.password);
            if (validated) {
                student = await student.populate("school", "schoolName")
                student = await student.populate("sclassName", "sclassName")
                student.password = undefined;
                student.examResult = undefined;
                student.attendance = undefined;
                res.send(student);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Employee not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudents = async (req, res) => {
    try {
        let students = await Student.find({ school: req.params.id }).populate("sclassName", "sclassName");
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No Employees found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentDetail = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
        // .populate("examResult.subName", "subName")
        // .populate("attendance.subName", "subName sessions");
        if (student) {
            student.password = undefined;
            res.send(student);
        }
        else {
            res.send({ message: "No Employee found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteStudent = async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudents = async (req, res) => {
    try {
        const result = await Student.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No employee found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudentsByClass = async (req, res) => {
    try {
        const result = await Student.deleteMany({ sclassName: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No employee found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            res.body.password = await bcrypt.hash(res.body.password, salt)
        }
        let result = await Student.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })

        result.password = undefined;
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}


const updateExamResult = async (req, res) => {
    // console.log(req);
    const { incentiveEarned } = req.body;

    try {

        const student = await Student.findById(req.params.id);
        // console.log(Number(incentiveEarned));
        if (!student) {
            return res.send({ message: 'employee not found' });
        }

        // const existingResult = student.incentiveEarned.find(
        //     (result) => result.subName.toString() === subName
        // );
        student.incentiveEarned = Number(incentiveEarned);
        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const studentAttendance = async (req, res) => {
    const { status, date } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Employee not found' });
        }

        // Split the incoming date string
        const [year, month, day, hour, minute] = date.split(/[-T:]/);

        // Construct a Date object using Date.UTC
        const incomingDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

        // Check for existing attendance
        const existingAttendance = student.attendance.find((a) =>
            a.date.toISOString() === incomingDate.toISOString()
        );

        if (existingAttendance) {// Update existing attendance status
            existingAttendance.status = status;
        } else {
            // Add new attendance record with the date as a Date object
            student.attendance.push({ date: incomingDate, status });
        }

        // Save the student document
        const result = await student.save();

        // Convert dates to Indian Standard Time (IST) before sending the response
        const attendanceInIST = result.attendance.map((a) => ({
            date: a.date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
            status: a.status,
        }));

        return res.send({ attendance: attendanceInIST });
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;

    try {
        const result = await Student.updateMany(
            { 'attendance.subName': subName },
            { $pull: { attendance: { subName } } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendance = async (req, res) => {
    const schoolId = req.params.id

    try {
        const result = await Student.updateMany(
            { school: schoolId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeStudentAttendanceBySubject = async (req, res) => {
    const studentId = req.params.id;
    const subName = req.body.subId

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $pull: { attendance: { subName: subName } } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeStudentAttendance = async (req, res) => {
    const studentId = req.params.id;

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateZone = async (req, res) => {
    const studentId = req.params.id;
    try {
        // const validSclassName = new mongoose.Types.ObjectId(req.body.sclassName);
        const zone = await sclass.findOne({ sclassName: req.body.sclassName });
        const result = await Student.findByIdAndUpdate(studentId, { sclassName: zone._id }, { new: true });
        // console.log(zone);
        return res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const LeaveRequestList = async (req, res) => {
    try {
        // console.log("iii");
        let complains = await Leave.find({ school: req.params.id }).populate("userId", "name");
        // console.log(complains);
        if (complains.length > 0) {
            res.send(complains)
        } else {
            res.send({ message: "No Leave Requests found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
const ShowUserRequestList = async (req, res) => {
    const userId = req.params.id;
    // console.log(userId);
    try {
        // Find leave statuses for the given userId
        const leaveStatuses = await Leave.find({ userId });
        // console.log(leaveStatuses, "leaveStatuses");
        res.status(200).json(leaveStatuses);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const LeaveRequest = async (req, res) => {
    try {
        const leaveSchema = await Leave.findOne();

        if (!leaveSchema) {
            const newLeaveSchema = new Leave(req.body);
            const savedLeaveSchema = await newLeaveSchema.save();
            return res.status(200).json(savedLeaveSchema);
        }
        else {
            const newLeaveObject = new Leave(req.body);

            // Save the new document to the database
            const savedLeaveObject = await newLeaveObject.save();

            return res.status(201).json(savedLeaveObject);
        }


    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

//Inventory
const addInventoryItem = async (req, res) => {
    try {
        const inventory = new InventoryItem(req.body);
        const result = await inventory.save();
        res.send(result);
    } catch (err) {
        console.error("Error saving inventory item:", err);
        res.status(500).json({ error: "Error saving inventory item" });
    }
};


const updateReqStatus = async (req, res) => {
    const leaveId = req.params.id;
    try {
        const { newStatus } = req.body;

        // Validate the new status to ensure it is a valid option (e.g., 'accepted' or 'rejected')
        const validStatusOptions = ['accepted', 'rejected'];
        if (!validStatusOptions.includes(newStatus)) {
            return res.status(400).json({ error: 'Invalid status option' });
        }

        const result = await Leave.findByIdAndUpdate(leaveId, { reqstatus: newStatus }, { new: true });

        return res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
    updateZone,
    LeaveRequest,
    LeaveRequestList,
    updateReqStatus,
    ShowUserRequestList,
    addInventoryItem
};