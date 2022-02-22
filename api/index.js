// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require('express');



const apiRouter = express.Router();
apiRouter.use('/users',require('./users'))
// apiRouter.use('/activities',require('./activities'))





apiRouter.get('/health',async(req,res,next)=>{
    try {
        res.send({message:'all is well'})
    } catch (error) {
        throw error
    }
    
});



module.exports = apiRouter