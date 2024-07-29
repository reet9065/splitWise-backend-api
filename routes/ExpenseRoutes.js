const result = require('dotenv').config();
const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../Services/Token');
const {createExpenses,upDateExpenses,getExpenses,getExpensesList} = require('../Controler/CreateExpenses');


router.post('/create',authenticateToken, async(req,res)=>{
  try {
    // Extracting paramiters from req body;
    const{expensesName,amount,splitType,description,participants} = req.body;
    const{email} = req.user;

    if(!expensesName||!splitType||!participants || participants.length < 0){
      return res.status(400).json({error:{message:"Please make sure all the feilds arre filled properly"}});
    }
    const result = await createExpenses(email,expensesName,amount*1,splitType,description,participants);
    if(result.error){
      return res.status(400).json(result.error);

    }
    return res.status(200).json(result);
    
  } catch (error) {
    console.log(error);;
  }
})

router.post('/update',authenticateToken, async(req,res)=>{
  try {
    const{id} = req.query;
    const {email} = req.user
    const{expensesName,amount,description,participants} = req.body;
    console.log("i am in the route")
    const result = await upDateExpenses(id,expensesName,amount*1,description,email,participants);
    if(result.error){
      return res.status(400).json(result.error);

    }
    return res.status(200).json(result);
    
  } catch (error) {
    
  }
})

router.get('/expenseslist',authenticateToken,async(req,res)=>{

  try {
    const {id}= req.query;
    const {email}=req.user;

    if(id){
      const result = await getExpenses(id);
      if(result.error){
        return res.status(400).json(result.error);
      }
      return res.status(200).json(result);
    }else{
      const result = await getExpensesList(email);
      if(result.error){
        return res.status(400).json(result.error);
      }
      return res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
  }

})

  

module.exports = router;