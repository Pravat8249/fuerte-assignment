const exprsss = require('express');
const homeSchema = require('../models/homeSchema');
const Router = exprsss.Router();
const userSchema = require('../models/homeSchema');

const aws=require("aws-sdk")

aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile= async ( file) =>{
   return new Promise( function(resolve, reject) {
    // this function will upload file to aws and return the link
    let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws

    var uploadParams= {
        ACL: "public-read",
        Bucket: "classroom-training-bucket",  //HERE
        Key: "abc/" + file.originalname, //HERE 
        Body: file.buffer
    }


    s3.upload( uploadParams, function (err, data ){
        if(err) {
            return reject({"error": err})
        }
        return resolve(data.Location)
    })


   })
}

Router.get('/',(err,res)=>{
    res .render( 'register', {title:'FILL FORM',password:"",email:""})
});

Router.post('/register',async(req,res)=>{
try {
    const {
        name,
        number,
        email,
        password,
        cpassword,
        
    } =req.body;
    let image = req.files;
    let images = await uploadFile(image[0])
    requestBody.userImage=images
   if(password===cpassword){

    const userData = new homeSchema({
        name,
        number,
        email,
        password,
        images
     
    })
    userData.save(err=>{
        if(err){
            
            console.log('err')
        }
        else{
    res .render( 'register', {title:'Done',password:"",email:""})

        }
    })

    const useremail = await homeSchema.findOne({email:email});
    if(email === useremail.email){
    res .render( 'register', {title:'',password:"",email:"Email is Already Present Please chose different one"})
        
    }
    else{
        console.log('error')
    }
   }else{
    res .render( 'register', {title:'Error in code',password:"Password not matching",email:""})
   }
} catch (error) {
    res .render( 'register', {title:'Error in code',password:"",email:""})

}
})

//singn in
Router.post('/login',(req,res)=>{
    const
    {
        email,
        password
    }= req.body;
    homeSchema.findOne({email:email},(err,result)=>{
        if(email === result.email  && password === result.password){
            res.render('deshboard', {name:result.name});
        }
        else{
            console.log(err)
        }
    })
})

//------------------------------------Update User(only for Backend)--------------------------------
Router.put('/update', async function (req, res) {
    try {
        let userId = req.params.userId
    
        let data = req.body
    
        let image = req.files
        let getName = await userModel.findOne({ name: data.name })
        if (!isValidObjectId(userId))
            return res.status(400).send({ status: false, message: "The given userId is not a valid objectId" })

        if (Object.keys(data).length == 0 && file == undefined)
            return res.status(400).send({ status: false, message: "Please provide user detail(s) to be updated." })

        let err = isValid(data, image, getName)
        if (err)
            return res.status(400).send({ status: false, message: err })

        if (image.length > 0) {
            let uploadedFileURL = await uploadFile(image[0])
            data.userImage = uploadedFileURL
            console.log(uploadedFileURL)
        }
      

        let updateduser = await userModel.findOneAndUpdate({ _id: userId, isDeleted: false },data, { new: true })
        if (!updateduser)
            return res.status(404).send({ status: false, message: "user not found." })

        return res.status(200).send({ status: true, message: "user details updated successfully.", data: updateduser })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
})

module.exports= Router;