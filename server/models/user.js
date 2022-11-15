const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        nickname:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
              ]
        },
        password:{
            type:String,
            required:true
        },
        roles: {
            type: [{
                type: String,
                enum: ['user', 'admin']
            }],
            default: ['user']
        },
        
    },
    {timestamps: true}
);

module.exports = mongoose.model('User', userSchema);