const mongoose= require("mongoose")
//const validator= require("validator")
const bcrypt=require("bcryptjs");
const validator = require("validator");
//const { required } = require("yargs");
const jwt =require("jsonwebtoken");
const autoIncrement = require("mongoose-auto-increment");
const userSchema =new mongoose.Schema({

    name:{
        type: String,
        required: true,
        minlength: 6,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        trim:true,
        required:true,
        minlength:6,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("password not equal to password")
            }
        }
    },
    customer_code:{
        type: Number,
        minlength:4,
        validate(value){
            if(value.length<0){
                throw new Error("customer code must be positive")
            }
        }
    },
    
    token:{
        type:String,
   }

},{
    timestamps:true
})
autoIncrement.initialize(mongoose.connection);

userSchema.plugin(autoIncrement.plugin, {
  model: "user", // collection or table name in which you want to apply auto increment
  field: "customer_code", // field of model which you want to auto increment
  startAt: 1101, // start your auto increment value from 1
  incrementBy: 1, // incremented by 1
});
userSchema.methods.toJSON = function(){
    const user = this
    const userObject =user.toObject()
    delete userObject.password
    delete userObject.token
    return userObject
}
userSchema.methods.generateAuthToken = async function(){
    const user=this
    const token= jwt.sign({_id:user._id.toString()},"thisismynewcourse")
    //user.tokens=user.token.concat({token})
    user.token=token
    await user.save()
    return token
}
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
      userSchema.statics.findByCredentials=async(customer_code,password)=>{
          const user=await User.findOne({customer_code})
          if(!user){
             throw new Error("Incorrect customer code")
          //  return callback(false,{message : 'Incorrect username'});
          }
          const isMatch= await bcrypt.compare(password, user.password)
          if(!isMatch){
         throw new Error("Incorrect Password")
            //return callback(false,{message : 'Incorrect Password'});
          }
          return(user);
      }

const User= mongoose.model('User',userSchema)

module.exports=User