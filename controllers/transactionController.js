const functions = require('../utils/functions')

const transactionPage = (req,res) => {
    if(req.session.loggedin)
    {
        data = {
            username : req.session.username,
            whsCode : req.session.whsCode,
        }
        res.render('transaction',{data})
    }else{
        res.redirect('/Login')
    }
}

const checkConditions = (req,res) => {
    if(req.session.loggedin)
    {
        const open = req.session.open
        const allowed = req.session.allowed == "0" ? false : true;
        const status = open? open : allowed
        res.send({
            counting:req.session.countingAvailable,
            open:status
        })
    }else{
        res.redirect('/Login')
    }
}

const syncData = async (req,res) => {
    const {page} = req.params
    let from = null;
    if(req.session.loggedin)
    {
        const whs = req.session.whsCode
        if(page == "goTransfer"){
            from = req.session.from
        }
        const msg = await functions.getAndSaveData(whs,page,from)
        if(msg == 'done'){
            res.send('done')
        }else{
            res.send('error')
        }
    }else{
        res.redirect('/Login')
    }
}

module.exports = {
    transactionPage,
    syncData,
    checkConditions
}