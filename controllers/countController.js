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
    const { value } = req.params
    try{
        const data = await prisma.findCountsList(value)
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
    const { value } = req.params
    try{
        let records = await prisma.getCountRequest(value)
        functions.submitCountToSQL(records)
        .then(() => {
            // res.send('done')
            const start = async () => {
                let counts = parseInt(req.session.allCounting) - 1
                let avaCounts = parseInt(req.session.countingAvailable) - 1
                req.session.reload(function(err) {
                    req.session.allCounting = counts.toString()
                    req.session.countingAvailable = avaCounts
                    res.send('done')
                })
                await functions.updateCountNo(req.session.username,counts)
                .then(() => {
                    console.log('counting availble edited')
                })
                .catch(() => {
                    console.log('counting did not availble edited')
                })
                const mappedRecords = records.map((rec) => {
                    return {
                        CountingName:rec.CountingName,
                        CountingDate:rec.CountingDate,
                        ItemCode:rec.ItemCode,
                        ItemName:rec.ItemName,
                        BuyUnitMsr:rec.BuyUnitMsr,
                        WhsCode:rec.WhsCode,
                        CodeBars:rec.CodeBars,
                        Qnty:rec.Qnty,
                        Note:rec.Note,
                    }
                })
                await prisma.createAllcountHis(mappedRecords)
            }
            start()
        })
        .catch(() => {
            res.send('error')
        })
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