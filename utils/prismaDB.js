const file = require('./readAndWriteFiles')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createRecords = async (recordSet,page) => {
    return new Promise((resolve,reject) => {
        const genCode = file.getGenCode(recordSet[0].WhsCode,'./postNumber.txt')
        resolve(genCode)
    }).then(genCode => {
        const generateRecords = async () => {
            const previousRecords = await findOrderList()
            if(previousRecords.length > 0 && previousRecords[0].GenCode != genCode){
                return completeTransfer(previousRecords,recordSet,page)
            }else{
                return deleteAndcreate(recordSet,genCode,page)
            }
        }
        try{
            return generateRecords()   
        }catch(err){
            resolve()
        }
    })
}

const createReturnRecords = async (recordSet) => {
    return new Promise((resolve,reject) => {
        const mappedRecords = recordSet.map((rec,index) => {
            return {
                id: index,
                ItemCode: rec.ItemCode!= null? rec.ItemCode : undefined,
                ItemName: rec.ItemName!= null? rec.ItemName : undefined,
                CodeBars: rec.CodeBars!= null? rec.CodeBars : undefined,
                WhsCode: rec.WhsCode!= null? rec.WhsCode : undefined,
                BuyUnitMsr: rec.BuyUnitMsr!= null? rec.BuyUnitMsr : 'piece',
            }
        })
        const start = async () => {
            const msg = await deleteAllInReturn()
            if(msg == 'deleted'){
                resolve(mappedRecords)
            }else{
                reject()
            }
        }
        start()
    }).then((mappedRecords) => {
        return saveAllinReturn(mappedRecords)
    })
}

const deleteAllInReturn = async () => {
    return new Promise((resolve,reject) => {
        prisma.returnItems.deleteMany()
        .catch((e) => {
            console.log(e)
            reject()
        })
        .finally(async () => {
            await prisma.$disconnect()
            resolve()
        })
    }).then(() => {
        return 'deleted'
    }).catch(() => {
        return 'error'
    })
}

const saveAllinReturn = async (mappedRecords) => {
    return new Promise((resolve,reject) => {
        prisma.returnItems.createMany({
            data:mappedRecords,
            skipDuplicates:true
        })
        .catch((e) => {
            console.log(e)
            reject()
        })
        .finally(async () => {
            await prisma.$disconnect()
            resolve()
        })
    }).then(() => {
        return 'done'
    })
}

const deleteAndcreate = async (recordSet,genCode,page) => {
    return new Promise((resolve,reject) => {
        const isExist = recordsExist(genCode)
        if(isExist){
            deleteAll(genCode)
            .catch((e) => {
                console.log(e)
                reject()
            })
            .finally(async () => {
                await prisma.$disconnect()
                resolve()
            })
        }else{
            resolve()
        }
    }).then(() => {
        return createAll(recordSet,genCode,'requestItems',page)
    }).catch(err => {
        reject()
    })
}

const createAll = async (recordSet,genCode,model,page) => {
    if(page == "goRequest"){
        await file.addLabel("Suggestion")
    }
    return new Promise((resolve,reject) => {
        const length = recordSet.length
        const arr = []
        let index = 0;
        recordSet.forEach(rec => {
            const createNew = async () => {
                try{
                    let err;
                    if(model == 'requestItems'){
                        index += 1;
                        err = await createReq(rec,genCode,arr,index,page)
                    }else if(model == 'historical'){
                        err = await createHes(rec,arr)
                    }
                    if(err){
                        reject()
                    }
                }catch(err){
                    reject()
                }
                const msg = 'done'
                if(arr.length == length){
                    resolve(msg);
                }
            }
            createNew()
        })
    })
}

const completeTransfer = async (previousRecords,recordSet,genCode,page) => {
    return new Promise((resolve,reject) => {
        previousRecords.forEach(rec => {
            const start = async () =>{
        
                if(rec.Status == "sent"){
                    await saveInHostrical(rec)
                    .catch((e) => {
                        console.log(e)
                        reject()
                    })
                    .finally(async () => {
                        await prisma.$disconnect()
                    })
                }
            }
            start()
        })
        resolve()
    }).then(async () => {
        return new Promise((resolve,reject) => {
            const start = async () => {
                const preGenCode = await file.previousGetGenCode(recordSet[0].WhsCode,'./postNumber.txt')
                deleteAll(preGenCode)
                .catch((e) => {
                    console.log(e)
                    reject()
                })
                .finally(async () => {
                    await prisma.$disconnect()
                    resolve()
                })
            }
            start()
        }).then(() => {
            return createAll(recordSet,genCode,'requestItems',page)
        })
    })
}

const recordsExist = async (genCode) => {
    const records = await findAll(genCode)
    if(records?.length > 0){
        return true
    }else{
        return false
    }
}

const findAll = async(genCode) => {
    const records = await prisma.requestItems.findMany({
        orderBy: [
            {
              MaxStock: 'desc',
            }
        ],
        where:{
            GenCode : genCode
        }
    })
    if(records.length > 0){
        return records
    }else{
        return
    }
}

const findAllSent = async(genCode) => {
    const records = await prisma.rquestOrderhistory.findMany({
        where: {
            GenCode : genCode
        }
    })
    if(records.length > 0){
        return records
    }else{
        return
    }
}

const findAllSentReturn = async(genCode) => {
    const records = await prisma.returnhistory.findMany({
        where: {
            genCode : genCode
        }
    })
    if(records.length > 0){
        return records
    }else{
        return
    }
}

const findOrderList = async() => {
    return await prisma.requestItems.findMany({
        where:{
            Order : {
                not : 0.000000
            }
        }
    }).catch((e) => {
        console.log(e)
        return
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
}

const findReturnList = async() => {
    return await prisma.returnItems.findMany({
        where:{
            Order : {
                not : 0.000000
            }
        }
    }).catch((e) => {
        console.log(e)
        return
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
}

const findAllRequest = async() => {
    return await prisma.requestItems.findMany()
    .catch((e) => {
        console.log(e)
        return
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
}

const findPOreceivedList = async() => {
    return await prisma.receiptItems.findMany({
        where:{
            Order : {
                not : 0.000000
            }
        }
    }).catch((e) => {
        console.log(e)
        return
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
}

const findAllPOs = async() => {
    return await prisma.receiptItems.findMany()
    .catch((e) => {
        console.log(e)
        return
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
}

const findAllHisPOs = async(number,begin,end) => {
    return await prisma.receipthistory.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        where : {
            DocNum : parseInt(number),
            createdAt : {
                lte: end,
                gte: begin
            }
        }
    })
    .catch((e) => {
        console.log(e)
        return
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
}

const findOrderListTransfer = async() => {
    return await prisma.requestItems.findMany({
        where:{
            Order : {
                not : 0.000000
            },
            Warehousefrom : {
                not : '102'
            }
        }
    }).catch((e) => {
        console.log(e)
        return
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
}

const deleteAll = async (genCode) => {
    await prisma.requestItems.deleteMany({
        where:{
            GenCode : genCode
        }
    })
}

const createReq = async (rec,genCode,arr,index,page) => {
    return createNewRequestRecord(rec,genCode,index,page)
    .catch((e) => {
        console.log(e)
        return e
    })
    .finally(async () => {
        await prisma.$disconnect()
        arr.push('added')
    })
}

const createHes = async (rec,arr) => {
    if(rec.Status == "sent"){
        return saveInHostrical(rec)
        .catch((e) => {
            console.log(e)
            reject(e)
        })
        .finally(async () => {
            await prisma.$disconnect()
            arr.push('added')
        })
    }else{
        arr.push('added')
    }
}

const update = async (id,value) => {
    return new Promise((resolve,reject) => {
        updateExistRecord(id,value,false)
        .catch((e) => {
            console.log(e)
            reject()
        })
        .finally(async () => {
            await prisma.$disconnect()
            resolve()
        })
    })
}

const updateReturn= async (id,value,type) => {
    return new Promise((resolve,reject) => {
        updateRetExistRecord(id,value,type)
        .catch((e) => {
            console.log(e)
            reject()
        })
        .finally(async () => {
            await prisma.$disconnect()
            resolve()
        })
    })
}

const updateRetExistRecord = async (recordID,value,type) => {
    if(type == 'input'){
        await prisma.returnItems.update({
            where:{
                id : parseInt(recordID)
            },
            data : {
                Order: value != null? parseFloat(value) : 0,
            }
        })
    }else{
        await prisma.returnItems.update({
            where:{
                id : parseInt(recordID)
            },
            data : {
                DocNum: value != null? parseInt(value) : 0,
            }
        })
    }
}

const updateSuggest = async (id,value,bool) => {
    return new Promise((resolve,reject) => {
        updateExistRecord(id,value,bool)
        .catch((e) => {
            console.log(e)
            reject()
        })
        .finally(async () => {
            await prisma.$disconnect()
            resolve()
        })
    })
}

const updatePOs = async (id,value) => {
    return new Promise((resolve,reject) => {
        updatePOrecord(id,value)
        .catch((e) => {
            console.log(e)
            reject()
        })
        .finally(async () => {
            await prisma.$disconnect()
            resolve()
        })
    })
}

const saveInHostrical = async (rec) => {
    await prisma.rquestOrderhistory.create({
        data : {
          ItemCode: rec.ItemCode,
          ItemName: rec.ItemName,
          ListNum: rec.ListNum,
          ListName: rec.ListName,
          OnHand: rec.OnHand,
          MinStock: rec.MinStock,
          MaxStock: rec.MaxStock,
          Price: rec.Price,
          BuyUnitMsr: rec.BuyUnitMsr,
          WhsCode: rec.WhsCode,
          WhsName: rec.WhsName,
          CodeBars: rec.CodeBars,
          ConvFactor: rec.ConvFactor,
          Order: rec.Order,
          Warehousefrom: rec.Warehousefrom,
          Status: 'approved',
          GenCode: rec.GenCode
        }
    })
}

const createNewRequestRecord = async (record,genCode,id,page) => { 
  try{
    await prisma.requestItems.create({
        data : {
          id: id,
          ItemCode: record.ItemCode != null? record.ItemCode : undefined,
          ItemName: record.ItemName != null? record.ItemName : undefined,
          ListNum: record.ListNum != null? record.ListNum : undefined,
          ListName: record.ListName != null? record.ListName : undefined,
          OnHand: record.OnHand != null? record.OnHand : undefined,
          MinStock: record.MinStock != null? record.MinStock : undefined,
          MaxStock: record.MaxStock != null? record.MaxStock : undefined,
          Price: record.Price != null? record.Price : undefined,
          BuyUnitMsr: record.BuyUnitMsr != null? record.BuyUnitMsr : undefined,
          WhsCode: record.WhsCode != null? record.WhsCode : undefined,
          WhsName: record.WhsName != null? record.WhsName : undefined,
          CodeBars: record.CodeBars != null? record.CodeBars : undefined,
          ConvFactor: record.ConvFactor != null? record.ConvFactor : undefined,
          Warehousefrom: page == "goTransfer" ? "102" : (record.ListName == 'Consumable'? '104' : '102'),
          Warehouses: page == "goTransfer" ? record.Warehouses : undefined,
          GenCode: genCode
        }
    })
  }catch(err){
  }
}

const updateExistRecord = async (recordID,value,bool) => {
    await prisma.requestItems.update({
        where:{
            id : parseInt(recordID)
        },
        data : {
            Order: value != null? parseFloat(value) : 0,
            Suggest: bool
        }
    })
}

const updatePOrecord = async (recordID,value) => {
    await prisma.receiptItems.update({
        where:{
            id : parseInt(recordID)
        },
        data : {
            Order: value != null? parseFloat(value) : 0,
        }
    })
}

const updateRecordFrom = async (value) => {
    await prisma.requestItems.updateMany({
        data : {
            Warehousefrom: value != null? value : "102",
        }
    })
}

const updateRecordStatus = async (recordID) => {
    await prisma.requestItems.update({
        where:{
            id : parseInt(recordID)
        },
        data : {
            Status: "sent",
        }
    })
}

const updateRetRecordStatus = async (recordID) => {
    await prisma.returnItems.update({
        where:{
            id : parseInt(recordID)
        },
        data : {
            Status: "sent",
        }
    })
}

const updatePOrecStatus = async (recordID,status) => {
    await prisma.receiptItems.update({
        where:{
            id : parseInt(recordID)
        },
        data : {
            Status : status,
        }
    })
}

const updateStatus = async (id,arr) => {
    return new Promise((resolve,reject) => {
        updateRecordStatus(id)
        .catch((e) => {
            console.log(e)
            reject()
        })
        .finally(async () => {
            await prisma.$disconnect()
            arr.push('added')
            resolve()
        })
    })
}

const updateReturnStatus = async (id,arr) => {
    return new Promise((resolve,reject) => {
        updateRetRecordStatus(id)
        .catch((e) => {
            console.log(e)
            reject()
        })
        .finally(async () => {
            await prisma.$disconnect()
            arr.push('added')
            resolve()
        })
    })
}

const updatePOstatus = async (id,arr) => {
    return new Promise((resolve,reject) => {
        updatePOrecStatus(id,"sent")
        .catch((e) => {
            console.log(e)
            reject()
        })
        .finally(async () => {
            await prisma.$disconnect()
            arr.push('added')
            resolve()
        })
    })
}

const getDataLocal = async (whs) =>{
    return new Promise((resolve,reject) => {
        try{
            const genCode = file.getGenCode(whs,'./postNumber.txt')
            const results = findAll(genCode)
                            .catch((e) => {
                                console.log(e)
                                reject()
                            })
                            .finally(async () => {
                                await prisma.$disconnect()
                            })
            resolve(results)
        }catch(err){
            reject();
        }
    })
}

const getDataAllInReturn = async () =>{
    return new Promise((resolve,reject) => {
        try{
            const results = findInReturn()
                            .catch((e) => {
                                console.log(e)
                                reject()
                            })
                            .finally(async () => {
                                await prisma.$disconnect()
                            })
            resolve(results)
        }catch(err){
            reject();
        }
    })
}

const findInReturn = async () => {
    const records = await prisma.returnItems.findMany()
    if(records.length > 0){
        return records
    }else{
        return
    }
}

const transferToHes = async (records,whs) => {
    createAll(records,null,'historical').then(() => {
        const start = async () => {
            const genCode = await file.previousGetGenCode(whs,'./postNumber.txt')
            deleteAll(genCode)
            .catch((e) => {
                console.log(e)
            })
            .finally(async () => {
                await prisma.$disconnect()
            })
        }
        start()
    })
}

const transferToReturnHes = async (records,genCode) => {
    await deleteAllInReturn()
    const mappedRecords = records.map((rec,index) => {
        return {
            ItemCode: rec.ItemCode,
            ItemName: rec.ItemName,
            CodeBars: rec.CodeBars,
            WhsCode: rec.WhsCode,
            DocNum: rec.DocNum,
            Status: rec.Status,
            BuyUnitMsr: rec.BuyUnitMsr,
            Order: rec.Order,
            genCode
        }
    })
    prisma.returnhistory.createMany({
        data:mappedRecords,
        skipDuplicates:true
    })
    .catch((e) => {
        console.log(e)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
}

const updateFrom = async (value) => {
    return new Promise((resolve,reject) => {
        updateRecordFrom(value)
        .catch((e) => {
            console.log(e)
            reject()
        })
        .finally(async () => {
            await prisma.$disconnect()
            resolve()
        })
    })
}

const saveAndGetPOs = async (results) => {
    return new Promise((resolve,reject) => {
        deleteAllPo()
        .catch((e) => {
            console.log(e)
            reject()
        })
        .finally(async () => {
            await prisma.$disconnect()
            resolve()
        })
    }).then(() => {
        return saveAllPo(results)
    })
}

const deleteAllPo = async () => {
    await prisma.receiptItems.deleteMany()
}

const saveAllPo = async (results) => {
    const length = results.length
    const arr = []
    let index = 0;
    return new Promise((resolve,reject) => {
        results.forEach(rec => {
            const createNew = async () => {
                try{
                    index += 1;
                    const err = await createPOreq(rec,arr,index)
                    if(err){
                        reject()
                    }
                }catch(err){
                    reject()
                }
                const msg = 'done'
                if(arr.length == length){
                    resolve(msg);
                }
            }
            createNew()
        })
    }).then((msg) => {
        return getAllSavedPOs()
    })
}

const createPOreq = async (rec,arr,index) => {
    return createNewPORecord(rec,index)
    .catch((e) => {
        console.log(e)
        return e
    })
    .finally(async () => {
        await prisma.$disconnect()
        arr.push('added')
    })
}

const getAllSavedPOs = async () => {
    return getAllPOs()
    .catch((e) => {
        console.log(e)
        return
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
}

const createNewPORecord = async (record,id) => {
    try{
        await prisma.receiptItems.create({
            data : {
              id: id,
              ItemCode: record.ItemCode != null? record.ItemCode : undefined,
              LineNum: record.LineNum != null? record.LineNum : undefined,
              Dscription: record.Dscription != null? record.Dscription : undefined,
              CodeBars: record.CodeBars != null? record.CodeBars : undefined,
              WhsCode: record.WhsCode != null? record.WhsCode : undefined,
              CardName: record.CardName != null? record.CardName : undefined,
              CardCode: record.CardCode != null? record.CardCode : undefined,
              DocNum: record.DocNum != null? parseInt(record.DocNum) : undefined,
              UgpName: record.UgpName != null? record.UgpName : undefined,
              Order: 0,
              OpenQty: record.OpenQty != null? record.OpenQty : undefined,
            }
        })
      }catch(err){
      }
}

const getAllPOs = async () => {
    return await prisma.receiptItems.findMany()
}

const transferToReceHis = async (records) => {
    new Promise((resolve,reject) => {
        let length = records.length
        const arr = []
        records.forEach((rec) => {
            if(rec.Status != 'received'){
                new Promise((resolve,reject) => {
                    createPOhisRecord(rec)
                    .catch((e) => {
                        console.log(e)
                        resolve()
                    })
                    .finally(async () => {
                        await prisma.$disconnect()
                        resolve()
                    })
                }).then(() => {
                    updatePOrecStatus(rec.id,"received")
                    .catch((e) => {
                        console.log(e)
                        arr.push('updated')
                        if(arr.length == length){
                            resolve()
                        }
                    })
                    .finally(async () => {
                        await prisma.$disconnect()
                        arr.push('updated')
                        if(arr.length == length){
                            resolve()
                        }
                    })
                })
            }else{
                arr.push('updated')
                if(arr.length == length){
                    resolve()
                }
            }
        })
    }).then(() => {
        deleteAllPo()
        .catch((e) => {
            console.log(e)
        })
        .finally(async () => {
            await prisma.$disconnect()
        })
    })
}

const createPOhisRecord = async (record) => {
    try{
        await prisma.receipthistory.create({
            data : {
              ItemCode: record.ItemCode,
              LineNum: record.LineNum,
              Dscription: record.Dscription,
              CodeBars: record.CodeBars,
              WhsCode: record.WhsCode,
              CardName: record.CardName,
              CardCode: record.CardCode,
              DocNum: record.DocNum,
              UgpName: record.UgpName,
              Order: record.Order,
              OpenQty: record.OpenQty,
            }
        })
      }catch(err){
      }
}

module.exports = {
    createRecords,
    getDataLocal,
    update,
    findOrderList,
    transferToHes,
    updateStatus,
    findAllSent,
    updateFrom,
    findOrderListTransfer,
    saveAndGetPOs,
    updatePOs,
    findPOreceivedList,
    getAllSavedPOs,
    findAllPOs,
    updatePOstatus,
    transferToReceHis,
    findAllHisPOs,
    findAllRequest,
    updateSuggest,
    createReturnRecords,
    getDataAllInReturn,
    updateReturn,
    findReturnList,
    updateReturnStatus,
    transferToReturnHes,
    findAllSentReturn
}