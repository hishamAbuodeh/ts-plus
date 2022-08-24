const functions = require('../utils/functions')
const prisma = require('../utils/prismaDB');

const countPage = async (req,res) => {
    if(req.session.loggedin)
    {   
        res.render('count')
        
    }else{
        res.redirect('/Login')
    }
}

const getNames = async (req,res) => {
    if(req.session.loggedin)
    {   
        try{
            const names = await prisma.getCountNames()
            res.send(names)
        }catch(err){
            res.send('error')
        }
    }else{
        res.redirect('/Login')
    }
}

const getRequest = async (req,res) => {
    const { value } = req.params
    if(req.session.loggedin)
    {   
        try{
            const data = await prisma.getCountRequest(value)
            res.render('partials/countTable',{data})
        }catch(err){
            res.send('error')
        }
    }else{
        res.redirect('/Login')
    }
}

const saveQuantity = async (req,res) => {   
    try{
        const {id,quantity} = req.params
        prisma.updateCounts(id,quantity)
        .then(() => {
            res.send('done')
        }).catch(() => {
            res.send('error')
        })
    }catch(err){
        res.send('error')
    }
}

const report = async (req,res) => {
    try{
        const data = await prisma.findCountsList()
        res.render('partials/countRep',{data})
    }catch(err){
        res.send('error')
    }
}

const allReport = async (req,res) => {
    const { value } = req.params
    try{
        const data = await prisma.getCountRequestHis(value)
        res.render('partials/countRep',{data})
    }catch(err){
        res.send('error')
    }
}

const submit = async (req,res) =>{
    try{
        // let records = await prisma.findAllPOs()
        // const no = await file.getPostNo('./POreceiving.txt')
        // const genCode = await file.getGenCode(req.session.whsCode,'./POreceiving.txt',req.session.employeeNO)
        // functions.sendPOtoSQL(records,req.session.username,genCode)
        // .then(() => {
        //     res.send('done')
        //     prisma.transferToReceHis(records,genCode)
        //     file.updateGenCode(no,'./POreceiving.txt')
        // })
        // .catch(err => {
        //     res.send('error')
        // })
        res.send('error')
    }catch(err){
        res.send('error')
    }
}

module.exports = {
    countPage,
    getNames,
    getRequest,
    saveQuantity,
    report,
    allReport,
    submit
}