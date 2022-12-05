const express = require('express');
const router = express.Router();

const User = require('../models/Users')
const History = require('../models/History')

//check phoneNUmber if exist
router.post('/checkNumber', async ( request, response )=> {
    User.findOne({
        phoneNumber: request.body.phoneNumber,

    }).then( result => {
        console.log(result)
        if (result === null ){
                response.send({ 
                    status: 'new request'
                });
            }else if (result.status === 'Safe now') {
                response.send({ 
                    status: 'new request'
                });
            }
            else  {
                response.send({ 
                    status: 'display status'
                });
            }
        
    })
})


//Register User
router.post('/NewKodisyon', async( request, response) => {
   
    User.findOne({
        phoneNumber: request.body.phoneNumber,

    }).then( result => {
        console.log(result)

        if (result === null) {
            const newUser = new User({
                ...request.body,
                    status: 'Waiting for a Responder',
                    statusDesc: 'Responder will call you in a few minutes!'
            });
            //add new user
            newUser.save().then( result => {
                response.send({ 
                    status: 'Request Sent'
                });
            });
            
        }else{
            //add to history first then update current users status and location
            const newHistory = new History({
                user: result._id,
                locationLongitude: result.locationLongitude,
                locationLatitude: result.locationLatitude
        
            });

            newHistory.save().then( result => {
                console.log(result.user)
                User.updateOne(
         
                    { phoneNumber: request.body.phoneNumber}, 
                    { $set: { 
                        locationLongitude: request.body.locationLongitude,
                        locationLatitude: request.body.locationLatitude,
                        status: 'Waiting for a Responder',
                        statusDesc: 'Responder will call you in a few minutes!'
                    } })
                .then( result => {
                    if( result.modifiedCount === 1 ){
                        response.send({ status: "Request sent" });
                    }
                });

            })

            
        }
        
        
    })

})



    // const newUser = new User(request.body);

    // newUser.save().then( result => {
    //     response.send({ 
    //         status: 'Kodinsyon sent'
    //     });
    // });





module.exports =  router;