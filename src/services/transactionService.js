const dayjs = require("dayjs");
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const Transactions = require("../models/transactionModel")

async function createTransaction(userId , transactionData) {
    const {type , category , amount , description } = transactionData ; 

    if(!type || !category || !amount ) {
        const error = new Error("Please enter all the fields!");
        error.statusCode = 400;
        throw error; 
    }

    const newTransactionData = {
        userId , 
        type , 
        category , 
        amount , 
        description 
    }

    //date handling
    let date = transactionData.date; 
    if(date) {
        //parsing whatever is coming in the postman
        const formattedDate = dayjs(date , "DD-MM-YYYY")
        newTransactionData.date = formattedDate.toDate(); 
    }

    const createNewTransaction = await Transactions.create(newTransactionData);

    // Format date back to DD-MM-YYYY for response
    const response = {
        ...createNewTransaction.toObject(),
        date: dayjs(createNewTransaction.date).format("DD-MM-YYYY")
    };

    return response; 
}


module.exports = {
    createTransaction
}
