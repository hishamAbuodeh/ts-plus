const prisma = require('../utils/prismaDB');
const functions = require('../utils/functions');
const file = require('../utils/readAndWriteFiles')
const hana = require('../utils/hana')

const requestPage = async (req,res) => {
    if(req.session.loggedin)
    {
        prisma.getDataLocal(req.session.whsCode).then(results => {
            const start = async () => {
                const value = await file.getlabel()
                const data = {
                    results,
                    username : req.session.username,
                    whsCode : req.session.whsCode,
                    value
                }
                res.render('request',{data})
            }
            start()
        }).catch(err => {
            res.render('error')
        });
    }else{
        res.redirect('/Login')
    }
}

const requestService = async (req,res) => {
    if(req.session.loggedin)
    {
        res.render('partials/chooseService',{page:"request"})
    }else{
        res.redirect('/Login')
    }
}

const transferService = async (req,res) => {
    if(req.session.loggedin)
    {
        res.render('partials/chooseService',{page:"transfer"})
    }else{
        res.redirect('/Login')
    }
}

const chooseFrom = async (req,res) => {
    if(req.session.loggedin)
    {
        hana.warehouseMatch(req.session.whsCode)
        .then((str) => {
            if(str){
                const start = async() => {
                    const arr = functions.configWarehouses(str)
                    let match = await file.getMatchingFile()
                    match = functions.codeToName(match)
                    const data = {
                        results:arr,
                        match 
                    }
                    res.render('partials/whsFrom',{data})
                }
                start()
            }else{
                res.render('partials/error')
            }
        }).catch(err => {
            res.render('partials/error')
        });
    }else{
        res.redirect('/Login')
    }
}

const saveChoose = async(req,res) => {
    const {from} = req.params
    if(req.session.loggedin)
    {
        req.session.from = from
        res.send('done')
    }else{
        res.redirect('/Login')
    }
}

const transferPage = async (req,res) => {
    if(req.session.loggedin)
    {
        prisma.getDataLocal(req.session.whsCode).then(results => {
            const start = async() => {
                const data = {
                    results,
                    username : req.session.username,
                    whsCode : req.session.whsCode,
                    from : req.session.from
                }
                res.render('transfer',{data})
            }
            start()
        }).catch(err => {
            res.render('error')
        });
    }else{
        res.redirect('/Login')
    }
}

const saveOrderValue = async (req,res) => {
    try{
        const {id,value} = req.params
        prisma.update(id,value)
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
    const {page,note} = req.params
    try{
        let records
        if(page == 'request'){
            records = await prisma.findOrderList()
        }else if(page == 'transfer'){
            records = await prisma.findOrderListTransfer()
        }
        if(records.length > 0){
            functions.sendRequestOrder(records,req.session.username,page,note)
            .then(() => {
                res.send('done')
                const start = async() => {
                    const no = await file.getPostNo('./postNumber.txt')
                    file.updateGenCode(no,'./postNumber.txt')
                    const transfer = async () => {
                        records = await prisma.findOrderList()
                        prisma.transferToHes(records,req.session.whsCode)
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
    const {page} = req.params
    try{
        if(page == 'request'){
            let records = await prisma.findOrderList()
            res.render('partials/report',{results:records})
        }else if(page == 'transfer'){
            let records = await prisma.findOrderListTransfer()
            res.render('partials/report',{results:records})
        }
    }catch(err){
        res.send('error')
    }
}

const allReport = async (req,res) => {
    try{
        let genCode = await file.previousGetGenCode(req.session.whsCode,'./postNumber.txt')
        let records = await prisma.findAllSent(genCode)
        res.render('partials/report',{results:records})
    }catch(err){
        res.send('error')
    }
}

const changeFrom = async(req,res) => {
    try{
        let {value} = req.query
        if(value){
            let match = await file.getMatchingFile()
            match = functions.nameToCode(match)
            value = match[value]
        }else{
            value = null
        }
        prisma.updateFrom(value)
        .then(() => {
            res.send('done')
        }).catch(() => {
            res.send('error')
        })
    }catch(err){
        res.send('error')
    }

}

const createSuggest = async (req,res) => {
    const rows = await prisma.findAllRequest()
    const length = rows.length
    const arr = []
    rows.forEach(rec => {
        const min = rec.MinStock
        const onHand = rec.OnHand
        const order = rec.Order
        const id = rec.id
        const convFac = rec.ConvFactor
        const suggQty = rec.SuggQty
        if((order == 0) && ((min - onHand) > 0)){
            let value = suggQty
            if(value > 0){
                if(suggQty % convFac == 0){
                    value = suggQty
                }else{
                    value = parseFloat(suggQty) + (parseFloat(convFac) - parseFloat(suggQty % convFac))
                }
                new Promise((resolve,reject) => {
                    prisma.updateSuggest(id,value,true)
                    .then(() => {
                        resolve('done')
                    }).catch(() => {
                        reject()
                    })
                }).then(() => {
                    arr.push('added')
                    if(arr.length == length){
                        res.send('done')
                    }
                }).catch(() => {
                    arr.push('added')
                    if(arr.length == length){
                        res.send('error')
                    }
                })
            }else{
                arr.push('added')
                if(arr.length == length){
                    res.send('done')
                }
            }
        }else{
            arr.push('added')
            if(arr.length == length){
                res.send('done')
            }
        }
    })
}

const removeSuggest = async (req,res) => {
    const rows = await prisma.findAllRequest()
    const length = rows.length
    const arr = []
    rows.forEach(rec => {
        const suggest = rec.Suggest
        const id = rec.id
        if(suggest){
            new Promise((resolve,reject) => {
                prisma.updateSuggest(id,0,false)
                .then(() => {
                    resolve('done')
                }).catch(() => {
                    reject()
                })
            }).then(() => {
                arr.push('added')
                if(arr.length == length){
                    res.send('done')
                }
            }).catch(() => {
                arr.push('added')
                if(arr.length == length){
                    res.send('error')
                }
            })
        }else{
            arr.push('added')
            if(arr.length == length){
                res.send('done')
            }
        }
    })
}

const label = async(req,res) => {
    const { value } = req.params
    file.addLabel(value)
    res.send('done')
}

module.exports = {
    requestPage,
    saveOrderValue,
    submit,
    report,
    allReport,
    transferPage,
    changeFrom,
    createSuggest,
    removeSuggest,
    label,
    chooseFrom,
    saveChoose,
    transferService,
    requestService
}