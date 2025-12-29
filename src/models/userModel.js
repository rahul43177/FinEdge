const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name : {
        type : String , 
        required : true 
    } , 
    email : {
        type : String , 
        required : true , 
        lowercase : true , 
        unique : true , 
        trim : true , 
        validate : {
            validator : function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            }  , 
            message : "Email not valid"
        } 
    } , 
    password : {
        type : String , 
        required : true , 
        minlength : 6 
    } , 
    monthlyBudget : {
        type : Number , 
        default : 0 
    } , 
    savingTarget : {
        type : Number , 
        default : 0 
    } 
}, {timestamps : true});


userSchema.pre('save' , async function() {
    try {
        if(!this.isModified('password')) {
            return ; 
        }

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password , salt);
    } catch(error) {
        throw(error);
    }
})

userSchema.methods.comparePassword = async function(userPassword) {
    try {
        return await bcrypt.compare(userPassword, this.password); 
    } catch(error) {
        throw error; 
    }
}

module.exports = mongoose.model('User' , userSchema);