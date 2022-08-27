const functions = require('../utils/functions')

// rendering pages controllers
const loginPage = (req,res) => {
    req.session.loggedin = false
    res.render('login')
}

// logic controller
const validate = async (req,res) => {
    const {username,password} = req.body;
    const user = await functions.getUser(username,password)
    if(user == undefined){
        res.send({msg: 'error'})
    }
    else if(user.length != 0){
        req.session.loggedin = true
        req.session.username = user[0].Username
        const whsCode = await functions.getWhs(username)
        if(whsCode){
            let message = {
                msg : 'validate'
            }
            req.session.whsCode = whsCode[0].WhsCode
            req.session.open = functions.checkOpenDays(whsCode[0].OpenDays)
            req.session.supplierName = whsCode[0].SupplierName
            req.session.supplierEmail = whsCode[0].SupplierEmail
            req.session.supervisorName = whsCode[0].SupervisorName
            req.session.supervisorEmail = whsCode[0].SupervisorEmail
            req.session.allCounting = whsCode[0].CountingAvailable
            req.session.countingAvailable = await functions.getCountingAvailable(whsCode[0].CountingAvailable,message,whsCode[0].WhsCode,user[0].Username)
            req.session.warehouseName = whsCode[0].WarehouseName
            req.session.allowed = whsCode[0].Allowed
            req.session.employeeNO = whsCode[0].EmployeeNO
            req.session.managerEmail = whsCode[0].ManagerEmail
            res.send(message)
        }else{
            res.send({msg: 'error'})
        }
    }else if (user.length == 0){
        res.send({msg : 'not validate'})
    }
}

const logOut = (req,res) => {
    req.session.loggedin = false
    req.session.username = undefined
    req.session.whsCode = undefined
    req.session.open = undefined
    req.session.supplierName = undefined
    req.session.supplierEmail = undefined
    req.session.supervisorName = undefined
    req.session.supervisorEmail = undefined
    req.session.countingAvailable = undefined
    req.session.warehouseName = undefined
    req.session.allowed = undefined
    res.render('routing')
}

const routing = (req,res) => {
    if(req.session.loggedin)
    {
        res.render('routing')
    }
}

module.exports = {
    loginPage,
    validate,
    logOut,
    routing
}