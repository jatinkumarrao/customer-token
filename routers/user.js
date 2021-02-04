
const express=require('express')
const User=require('../models/user')
const multer=require('multer')
const router=new express.Router()
const auth=require("../middleware/auth")

router.get("/users/me",auth,async(req,res)=>{
    res.send(req.user)
})
router.post("/users/logout",auth,async(req,res)=>{
    try{
        console.log(req.user.token)
        req.user.token=undefined;
        await req.user.save()
        res.send()
     }
    catch(e){
        console.log(e)
     res.status(500).send()
    }   
})
router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.customer_code,req.body.password)
        const token=await user.generateAuthToken()
       // res.status(200).send({user:user.getPublicProfile(),token})
       res.status(200).send({user ,token})
    }
    catch(e){
       // console.log("error",e)
    res.status(400).send(e.message)
    }
})

router.post('/users',async(req,res)=>{
    const user=new User(req.body)
    try{
        
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({user,token})
    }
    catch(e){
       res.status(400).send(e)
    }
   
    })
router.get('/users',async(req,res)=>{
    try{
     const users=  await User.find({ })
     res.send(users)
    }
    catch(e){
        res.status(500).send(e)
    }
   
})
router.get('/users/:id',async(req,res)=>{
  const _id=req.params.id
  try{
        const user= await User.findById(_id)    
        if(!user){
        return res.status(404).send("not found")    
        }
        res.send(user)
    }
  catch(e){
    res.status(500).send()
  }
})

router.delete("/users/me",auth,async(req,res)=>{
 
 try{
    await req.user.remove()
     res.status(200).send(req.user)
 }
 catch(e){
    res.status(500).send(e)
 }
})
module.exports=router