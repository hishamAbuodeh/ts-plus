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
        if(username != "admin"){
            const whsCode = await functions.getWhs(username)
            if(whsCode){
                req.session.whsCode = whsCode[0].WhsCode
                res.send({msg : 'validate'})
            }else{
                res.send({msg: 'error'})
            }
        }else{
            res.send({msg : 'validate'})
        }
    }else if (user.length == 0){
        res.send({msg : 'not validate'})
    }
}

const logOut = (req,res) => {
    req.session.loggedin = false
    req.session.username = undefined
    req.session.whsCode = undefined
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