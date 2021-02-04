const app=require('./app')

// const User=require('./models/user')
// const Task=require('./models/task')

const port=3000


app.listen(port,()=>{
    console.log("Server is up on port" +port)
})