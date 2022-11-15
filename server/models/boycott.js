const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boycottSchema = new Schema({
    // ID:{
    //     type: String,
    //     required: true
    // },
    title:{
        type: String,
        required: true
    },
    resume:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    photos : {
        type : String,
        required : true
    },
    likes:{
        type: Number, default: 0
    },
    usersLiked : {
        type: [String]
    }       
});

module.exports = mongoose.model('Boycott', boycottSchema);