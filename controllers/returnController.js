const prisma = require('../utils/prismaDB');
const functions = require('../utils/functions');
const file = require('../utils/readAndWriteFiles')

const returnPage = async (req,res) => {
    if(req.session.loggedin)
    {
        prisma.getDataAllInReturn(req.session.whsCode).then(results => {
            const start = async () => {
                const data = {
                    results,
                    username : req.session.username,
                    whsCode : req.session.whsCode,
                }
                res.render('return',{data})
            }
            start()
        }).catch(err => {
            res.render('error')
        });
    }else{
        res.redirect('/Login')
    }
}

const saveValue = async (req,res) => {
    try{
        const {id,value,type} = req.params
        prisma.updateReturn(id,value,type)
        .then(() => {
            res.send('done')
        }).catch(() => {
            res.send('error')
        })
    }catch(err){
        res.send('error')
    }
}

const submit = async (req,res) =>{
    const {note} = req.params
    try{
        let records = await prisma.findReturnList()
        const genCode = await file.getGenCode(req.session.whsCode,'./refNumber.txt')
        if(records.length > 0){
            functions.sendReturnItems(records,req.session.username,note,genCode)
            .then(() => {
                res.send('done')
                const start = async() => {
                    const no = await file.getPostNo('./refNumber.txt')
                    file.updateGenCode(no,'./refNumber.txt')
                    const transfer = async () => {
                        records = await prisma.findReturnList()
                        prisma.transferToReturnHes(records,genCode)
                    }
                    transfer()
                }
                start()
            })
            .catch(err => {
                res.send('error')
            })
        }else{
            res.send('no data sent')
        }
    }catch(err){
        res.send('error')
    }
}

const report = async (req,res) => {
    try{
        let records = await prisma.findReturnList()
        res.render('partials/retReport',{results:records})
    }catch(err){
        res.send('error')
    }
}

const allReport = async (req,res) => {
    try{
        let genCode = await file.previousGetGenCode(req.session.whsCode,'./refNumber.txt')
        let records = await prisma.findAllSentReturn(genCode)
        res.render('partials/retReport',{results:records})
    }catch(err){
        res.send('error')
    }
}

module.exports = {
    returnPage,
    saveValue,
    submit,
    report,
    allReport
}