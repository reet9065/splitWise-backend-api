const Expense = require('../Models/Expenses');
const User = require('../Models/UserSchema');
const Enteries = require('../Models/Enteries');

exports.createExpenses = async(email,expensesName,amount,splitType,description,participants)=>{
    try {
        const check = await Expense.find({expensesName,payerEmail:email});
        if(check.length>0){
            return {error:{message:"You have already created an expense with the same name"}}
        }

        const insertobj = {
            payerEmail:email,
            expensesName,
            totalAmount:amount,
            splitType,
            participants,
        }

        if(description){
            insertobj.description=description;
        }

        const newExpense = new Expense(insertobj);
        var result = await newExpense.save();
        const enteriesData = participants.map((item)=>{
            if(splitType == 'equal'){
                return {email:item.email, amount: amount/(participants.length + 1)}
            }else if(splitType == 'exact'){
                return {email:item.email, amount: item.amount};
            }else{
                
                return {email:item.email, amount: (amount/100)*(item.amount)*1};
            }
        })
        const enteri = new Enteries({
            enteries:{
                belongsTo:result._id,
                addedby:email,
                thisTimeTotal:amount,
                data:enteriesData
            }
        })
        const enteriResult = await enteri.save();
        result = await Expense.findByIdAndUpdate({_id:result._id},{$push:{upDateEnteries:enteriResult._id}},{new:true});
        
        return result;

    } catch (error) {
        console.log(error)
    }
};

exports.upDateExpenses = async(id,expensesName,amount,description,email,participants)=>{
    try {
        var check_id = await Expense.findOne({_id:id});
        console.log(check_id, id);
        if(!check_id){
            return {error:{message:"Expense not found"}}
        }

        if(check_id.splitType == 'exact'){
            console.log("step 1");
            
            if(!participants){
                return {error:{message:"You need to specifie participants Array usig exact amount"}}
            }
            console.log("step 2");

            if(check_id.participants.length == participants.length){
                console.log("step 3")
                participants.forEach((element) => {
                    console.log('cheking');
                    var persent = false
                    for(let i = 0; i < check_id.participants.length; i++){
                        if(element.email === check_id.participants[i].email){
                            persent = true;
                        }
                    }
                    if(!persent){
                        return {error:{message:"You need to specifie participants Array usig exact amount and exact participants"}}
                    }
                    console.log("exit cheking")
                });

                console.log("step 4")

                const updateobj = participants.map((item)=>{
                    console.log('maping')
                    return {email:item.email, amount: (item.amount)*1};

                })
                console.log("step 5")
                var updateParticipent = await Expense.findByIdAndUpdate(
                    {_id:id},
                    {participants:updateobj},
                    {new:true}
                    
                )
                check_id = updateParticipent;

                console.log('all good');

            }else{
                return {error:{message:"Participants can not be modified, You have to specify all participents"}}
            }
            

        }

        console.log(check_id)

        if(check_id.payerEmail === email || check_id.participants.some(participant => participant.email === email)){

            const enteriesData = check_id.participants.map((item)=>{
                if(check_id.splitType == 'equal'){
                    return {email:item.email, amount: amount/(check_id.participants.length + 1)}
                }else if(check_id.splitType == 'exact'){
                    return {email:item.email, amount: item.amount};
                }else{
                    return {email:item.email, amount: (amount/100)*item.amount};
                }
            })

            const enteris = new Enteries({
                enteries:{
                    belongsTo:id,
                    addedby:email,
                    thisTimeTotal:amount,
                    data:enteriesData
                }   
            })
            const enteriResult = await enteris.save();
            console.log()
            var sum = 0;
            for(let i =0; i< enteriResult.enteries.data.length; i++){
                sum += enteriResult.enteries.data[i].amount;
            }

            var updateobj = {
                $inc: { totalAmount: amount},
                $push: { upDateEnteries: enteriResult._id },
            }

            if (description) {
                updateFields.description = description;
            }
            
            if (expensesName) {
                updateFields.expensesName = expensesName;
            }



            var updateEx = await Expense.findByIdAndUpdate(
                { _id: id },
                updateobj,
                { new: true }
            );
                return updateEx;
        }
        return {error:{message:"You are not authorized to update this expense"}}


    } catch (error) {
        console.log(error);
    }
}


exports.getExpenses = async(id)=>{
    try {
        const result = await Expense.findOne({_id:id}).populate('upDateEnteries');
        if(!result){
            return {error:{message:"Expense not found"}};
        }
        return result;
    } catch (error) {
        console.log(error);
    }
}

exports.getExpensesList = async(email)=>{
    try {
    const userEmail = email;

    // Find expenses where the user is either the payer or a participant
    const expenses = await Expense.find({
      $or: [
        { payerEmail: userEmail },
        { 'participants.email': userEmail }
      ]
    });

    // Check if expenses are found
    if (expenses.length === 0) {
      return {error:{message:"No expenses found for the user."}}
      
    }

    // Format the response
    const formattedExpenses = expenses.map(expense => ({
      _id: expense._id,
      ownedBy: expense.payerEmail === userEmail ? 'you' : expense.payerEmail,
      expensesName: expense.expensesName,
      description: expense.description
    }));

    // Return formatted expenses list
    return formattedExpenses;
    } catch (error) {
        
    }
}