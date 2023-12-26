const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
        userId: {
        type: mongoose.Schema.Types.ObjectId,
            ref: 'student',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        leaveType: {
            type: String,
            required: true
        },
        reqstatus:{
            type:String,
            default:"Pending"
        }, 
        school: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'admin',
            required: true,
        }
});

module.exports = mongoose.model("LeaveSchema", LeaveSchema);