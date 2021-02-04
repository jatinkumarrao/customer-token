const express=require('express')
require('./db/mongoose')
const UserRoute=require("./routers/user")
//const TaskRoute=require("./routers/task")
const app=express()

app.use(express.json())

app.use(UserRoute)
//app.use(TaskRoute)

module.exports=app