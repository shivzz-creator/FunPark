const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNum: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sclassName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    role: {
        type: String,
        default: "Student"
    },
    dateOfJoining: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
        // You can define other properties like required, default values, etc. as needed.
    },
    insurancePolicyNumber: {
        type: String,
        required: true
        // You can define other properties like required, default values, etc. as needed.
    },
    bloodGroup: {
        type: String,
        required: true
        // You can define other properties like required, default values, etc. as needed.
    },
    incentiveEarned: {
        type: Number,
        required: true,
        default: 0
        // You can define other properties like required, default values, etc. as needed.
    },
    stars: {
        type: String,
        // required: true
        // You can define other properties like required, default values, etc. as needed.
    },
    rating: {
        type: String,
        // required: true
        // You can define other properties like required, default values, etc. as needed.
    },
    examResult: [
        {
            subName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'subject',
            },
            marksObtained: {
                type: Number,
                default: 0
            }
        }
    ],
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Present', 'Absent'],
            required: true
        },
        // subName: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'subject',
        //     required: true
        // }
    }],

});

module.exports = mongoose.model("student", studentSchema);