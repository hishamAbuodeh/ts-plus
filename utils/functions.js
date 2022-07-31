require('dotenv').config();
const sql = require('./sql');
const hana = require('./hana');
const prisma = require('./prismaDB');

// enviroment variables
const USERS_TABLE = process.env.USERS_TABLE
const USERS_WHS_TABLE = process.env.USERS_WHS_TABLE

const toggleRequestButton = (requestDay,requestHour) => {
    const loggedDay = new Date().toLocaleString('en-us', {  weekday: 'long' });
    const loggedHour = new Date().getHours();
    let requestBtu = false
    if((loggedDay.toLowerCase() == requestDay.toLowerCase()) && (loggedHour < requestHour)){
        requestBtu = true
    }
    return requestBtu;
}

const getUser = async (username,password) => {
    try{
        const pool = await sql.getSQL();
        const user = await pool.request().query(`select * from ${USERS_TABLE} where Username = '${username}' and Password = '${password}'`)
        .then(result => {
            return result.recordset;
        })
        return user
    }catch(err){
        return
    }
}

const getWhs = async (username) => {
    try{
        const pool = await sql.getSQL();
        const whsCode = await pool.request().query(`select * from ${USERS_WHS_TABLE} where Username = '${username}'`)
        .then(result => {
            return result.recordset;
        })
        return whsCode
    }catch(err){
        return
    }
}

const getAndSaveData = async (whs,page) => {
    try{
        return new Promise((resolve,reject) => {
            let msg
            if(page == "goRequest"){
                msg = hana.getItems(whs).then(results => {
                    return prisma.createRecords(results,page)
                })
            }else if(page == "goTransfer"){
                msg = hana.getItemsTransfer(whs).then(results => {
                    return prisma.createRecords(results,page)
                })
            }else if(page == "goReturn"){
                msg = hana.getItems(whs).then(results => {
                    return prisma.createReturnRecords(results)
                })
            }
            resolve(msg)
        }).then((msg) => {
            return msg
        }).catch(err => {
            return
        })
    }catch(err){
        return
    } 
}

const sendRequestOrder = async (records,userName,page,note) => {
    return new Promise((resolve,reject) => {
        const start = async () => {
            try{
                const pool = await sql.getSQL()
                const length = records.length
                const arr = []
                records.forEach(rec => {
                    if(rec.Status == 'pending'){
                        startTransaction(pool,rec,userName,arr,length,page,note)
                        .then(() => {
                            resolve()
                        })
                        .catch((err) => {
                            reject()
                        })
                    }else{
                        arr.push('added')
                        if(arr.length == length){
                            resolve();
                        }
                    }
                })
                
            }catch(err){
                reject()
            }
        }
        start()
    })
}

const sendReturnItems = async (records,userName,note,genCode) => {
    return new Promise((resolve,reject) => {
        const start = async () => {
            try{
                const pool = await sql.getSQL()
                const length = records.length
                const arr = []
                records.forEach(rec => {
                    if(rec.Status == 'pending'){
                        startReturnTransaction(pool,rec,userName,arr,length,note,genCode)
                        .then(() => {
                            resolve()
                        })
                        .catch((err) => {
                            reject()
                        })
                    }else{
                        arr.push('added')
                        if(arr.length == length){
                            resolve();
                        }
                    }
                })
                
            }catch(err){
                reject()
            }
        }
        start()
    })
}

const startTransaction = async (pool,rec,userName,arr,length,page,note) => {
    const transaction = await sql.getTransaction(pool);
    return new Promise((resolve,reject) => {
        transaction.begin((err) => {
            if(err){
                console.log(err)
                reject()
            }
            let warehousefrom
            if(page == "transfer"){
                warehousefrom = rec.Warehousefrom
            }else{
                warehousefrom = rec.ListName == 'Consumable'? '104' : '102';
            }
            pool.request()
            .input("ItemCode",rec.ItemCode)
            .input("ItemName",rec.ItemName)
            .input("ListNum",rec.ListNum)
            .input("ListName",rec.ListName)
            .input("OnHand",rec.OnHand)
            .input("MinStock",rec.MinStock)
            .input("MaxStock",rec.MaxStock)
            .input("Price",rec.Price)
            .input("BuyUnitMsr",rec.BuyUnitMsr)
            .input("WhsCode",rec.WhsCode)
            .input("WhsName",rec.WhsName)
            .input("CodeBars",rec.CodeBars)
            .input("ConvFactor",rec.ConvFactor)
            .input("QtyOrders",rec.Order)
            .input("GenCode",rec.GenCode)
            .input("createdAt",rec.createdAt)
            .input("warehousefrom",warehousefrom)
            .input("UserName",userName)
            .input("Note",note)
            .execute("Sp_Add_StocktransferRequest",(err,result) => {
                if(err){
                    console.log('excute',err)
                    reject()
                }
                transaction.commit((err) => {
                    if(err){
                        console.log('transaction error : ',err)
                        reject()
                    }
                    console.log("Transaction committed.");
                    prisma.updateStatus(rec.id,arr)
                    .then(() => {
                        if(arr.length == length){
                            pool.close();
                            resolve();
                        }
                    })
                    .catch(err => {
                        reject()
                    })
                });
            })
        })
    })
}

const startReturnTransaction = async (pool,rec,userName,arr,length,note,genCode) => {
    const transaction = await sql.getTransaction(pool);
    return new Promise((resolve,reject) => {
        transaction.begin((err) => {
            if(err){
                console.log(err)
                reject()
            }
            const po = rec.DocNum != 0 ? rec.DocNum.toString() : null
            pool.request()
            .input("Linenum",0)
            .input("ItemCode",rec.ItemCode)
            .input("Dscription",rec.ItemName)
            .input("CodeBars",rec.CodeBars)
            .input("WhsCode",rec.WhsCode)
            .input("CardName",null)
            .input("CardCode",null)
            .input("DocNum",genCode)
            .input("PurchaseNo",po)
            .input("UgpName",rec.BuyUnitMsr)
            .input("OpenQty",0)
            .input("RecQty",rec.Order)
            .input("userName",userName)
            .input("Note",note)
            .execute("SP_ReceivingReturnPO",(err,result) => {
                if(err){
                    console.log('excute',err)
                    reject()
                }
                transaction.commit((err) => {
                    if(err){
                        console.log('transaction error : ',err)
                        reject()
                    }
                    console.log("Transaction committed.");
                    prisma.updateReturnStatus(rec.id,arr)
                    .then(() => {
                        if(arr.length == length){
                            pool.close();
                            resolve();
                        }
                    })
                    .catch(err => {
                        reject()
                    })
                });
            })
        })
    })
}

const configWarehouses = (record) => {
    const whsSTR = record.Warehouses
    return whsSTR.split(',')
}

const codeToName = (list) => {
    const newList = JSON.parse(list)
    const group = newList.group
    let data = {}
    for(let i = 0; i < group.length; i++){
        const arr = group[i]
        data[arr[0]] = arr[1]
    }
    return data
}

const nameToCode = (list) => {
    const newList = JSON.parse(list)
    const group = newList.group
    let data = {}
    for(let i = 0; i < group.length; i++){
        const arr = group[i]
        data[arr[1]] = arr[0]
    }
    return data
}

const syncPOData = async (results) => {
    try{
        return new Promise((resolve,reject) => {
            const start = async () => {
                let skip = false
                const pervious = await prisma.getAllSavedPOs()
                if(pervious.length > 0){
                    if(pervious[0].DocNum == results[0].DocNum){
                        resolve(pervious)
                        skip = true
                    }
                }
                if(!skip){
                    const saved = await prisma.saveAndGetPOs(results)
                    if(saved){
                        resolve(saved)
                    }else{
                        reject()
                    }
                }
            }
            start()
        }).catch(err => {
            return 'error'
        })
    }catch(err){
        return 'error'
    } 
}

const sendPOtoSQL = async (records,userName) => {
    return new Promise((resolve,reject) => {
        const start = async () => {
            try{
                const pool = await sql.getSQL()
                const length = records.length
                const arr = []
                records.forEach(rec => {
                    if((rec.Status == 'pending') && (rec.Order > 0)){
                        startPOtransaction(pool,rec,userName,arr,length)
                        .then(() => {
                            resolve()
                        })
                        .catch((err) => {
                            reject()
                        })
                    }else{
                        arr.push('added')
                        if(arr.length == length){
                            resolve();
                        }
                    }
                })
                
            }catch(err){
                reject()
            }
        }
        start()
    })
}

const startPOtransaction = async (pool,rec,userName,arr,length) => {
    const transaction = await sql.getTransaction(pool);
    return new Promise((resolve,reject) => {
        transaction.begin((err) => {
            if(err){
                console.log(err)
                reject()
            }
            pool.request()
            .input("Linenum",rec.LineNum)
            .input("ItemCode",rec.ItemCode)
            .input("Dscription",rec.Dscription)
            .input("CodeBars",rec.CodeBars)
            .input("WhsCode",rec.WhsCode)
            .input("CardName",rec.CardName)
            .input("CardCode",rec.CardCode)
            .input("DocNum",rec.DocNum)
            .input("UgpName",rec.UgpName)
            .input("OpenQty",rec.OpenQty)
            .input("RecQty",rec.Order)
            .input("username",userName)
            .execute("SP_ReceivingPO",(err,result) => {
                if(err){
                    console.log('excute',err)
                    reject()
                }
                transaction.commit((err) => {
                    if(err){
                        console.log('transaction error : ',err)
                        reject()
                    }
                    console.log("Transaction committed.");
                    prisma.updatePOstatus(rec.id,arr)
                    .then(() => {
                        if(arr.length == length){
                            pool.close();
                            resolve();
                        }
                    })
                    .catch(err => {
                        reject()
                    })
                });
            })
        })
    })
}

module.exports = {
    toggleRequestButton,
    getUser,
    getWhs,
    getAndSaveData,
    sendRequestOrder,
    configWarehouses,
    codeToName,
    nameToCode,
    syncPOData,
    sendPOtoSQL,
    sendReturnItems,
}