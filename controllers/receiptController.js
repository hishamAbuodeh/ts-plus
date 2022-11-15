const functions = require('../utils/functions');
const hana = require('../utils/hana');
const prisma = require('../utils/prismaDB');
const file = require('../utils/readAndWriteFiles')

const receiptPage = async (req,res) => {
    if(req.session.loggedin)
    {
        res.render('receipt')
    }else{
        res.redirect('/Login')
    }
}

const getPoNoums = async(req,res) => {
    const whs = req.session.whsCode
    hana.getPoNums(whs)
    .then(results => {
        res.send(results)
    })
    .catch(() => {
        res.send('error')
    })
}

const sync = async (req,res) => {
    if(req.session.loggedin)
    {
        const {number} = req.params
        new Promise((resolve,reject) => {
            const results = hana.getPOitems(req.session.whsCode,number)
            resolve(results)
        }).then((results) => {
            if(results.length > 0){
                const start = async () => {
                    const data = await functions.syncPOData(results,req.session.whsCode)
                    res.render('partials/recTable',{data})
                }
                start()
            }else{
                res.send('not found')
            }
        }).catch(() => {
            res.send('error')
        })
    }else{
        res.redirect('/Login')
    }
}

const saveQuantity = async (req,res) => {   
    try{
        const {id,quantity} = req.params
        prisma.updatePOs(id,quantity)
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
        const records = await prisma.findPOreceivedList(req.session.whsCode)
        res.render('partials/recReport',{results:records})
    }catch(err){
        res.send('error')
    }
}

const allReport = async (req,res) => {
    try{
        const {number,begin,end} = req.params
        let records = await prisma.findAllHisPOs(number,begin,end,req.session.whsCode)
        records = records.map(rec => {
            if(parseInt(rec.Order) == 0){
                rec.Order = 'مرتجع'
            }
            return rec
        })
        res.render('partials/recReport',{results:records})
    }catch(err){
        res.send('error')
    }
}

const submit = async (req,res) =>{
    try{
        let records = await prisma.findAllPOs(req.session.whsCode)
        const no = await file.getPostNo(`./${req.session.whsCode}/POreceiving.txt`)
        const genCode = await file.getGenCode(req.session.whsCode,`./${req.session.whsCode}/POreceiving.txt`,req.session.employeeNO)
        functions.sendPOtoSQL(records,req.session.username,genCode)
        .then(() => {
            res.send('done')
            prisma.transferToReceHis(records,genCode,req.session.whsCode)
            file.updateGenCode(no,`./${req.session.whsCode}/POreceiving.txt`)
        })
        .catch(err => {
            res.send('error')
        })
    }catch(err){
        res.send('error')
    }
}

module.exports = {
    receiptPage,
    sync,
    saveQuantity,
    report,
    submit,
    allReport,
    getPoNoums
}