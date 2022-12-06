require("dotenv").config();
const hana = require("@sap/hana-client");
const file = require("./readAndWriteFiles");

// enviroment variables
const HANA_HOST = process.env.HANA_HOST;
const HANA_USER = process.env.HANA_USER;
const HANA_PASSWORD = process.env.HANA_PASSWORD;
const HANA_DATABASE = process.env.HANA_DATABASE;
const HANA_STOCK_REQUEST_PROCEDURE = process.env.HANA_STOCK_REQUEST_PROCEDURE;
const HANA_STOCK_TRANSFER_PROCEDURE = process.env.HANA_STOCK_TRANSFER_PROCEDURE;
const HANA_WHS_PROCEDURE = process.env.HANA_WHS_PROCEDURE;
const HANA_OPEN_PO_NUMS = process.env.HANA_OPEN_PO_NUMS;
const HANA_PO_PROCEDURE = process.env.HANA_PO_PROCEDURE;
const HANA_REQUEST_RECEIPT_PROCEDURE = process.env.HANA_REQUEST_RECEIPT_PROCEDURE;
const HANA_PROMOTION_REQUEST_PROCEDURE = process.env.HANA_PROMOTION_REQUEST_PROCEDURE;

const hanaConfig = {
  serverNode: `${HANA_HOST}:30015`,
  uid: HANA_USER,
  pwd: HANA_PASSWORD,
  sslValidateCertificate: "false",
};

const connection = hana.createConnection();

const getItems = async (whs) => {
  const procedureStatment = `CALL "${HANA_DATABASE}"."${HANA_STOCK_REQUEST_PROCEDURE}" ('${whs}')`;
  return execute(procedureStatment);
};

const getRequestReceipt = async (genCode) => {
  const procedureStatment = `CALL "${HANA_DATABASE}"."${HANA_REQUEST_RECEIPT_PROCEDURE}" ('${genCode}')`;
  return execute(procedureStatment);
};

const getItemsTransfer = async (whs,from) => {
  const procedureStatment = `CALL "${HANA_DATABASE}"."${HANA_STOCK_TRANSFER_PROCEDURE}" ('${whs}','${from}')`
  const results = await execute(procedureStatment)
  if(results.length > 0){
    return results.map(item => {
      item.Warehouses = from;
      return item
    })
  }else{
    return
  }
};

const warehouseMatch = async (whs) => {
  const results = await new Promise((resolve,reject) => {
    connection.connect(hanaConfig,(err) => {
      if (err){
        console.log(err)
        reject()
      };
      connection.exec(`Select * from "${HANA_DATABASE}"."${HANA_WHS_PROCEDURE}"`, (err, result) => {
          resolve(result)
          connection.disconnect();
      });
    });
  })
  if(results){
    let listStr = ''
    const list = []
    results.forEach(item => {
      if(whs != item.WhsCode){
        listStr += item.WhsCode + ","
        list.push([item.WhsCode,item.WhsName])
      }
    })
    const data = {
      "group":list
    }
    const status = await file.addMatchingFile(data,whs);
    if (status != "file error") {
      return listStr;
    } else {
      return "error";
    }
  }else{
    return "error";
  }  
};

const getPoNums = async (whs) => { 
  const procedureStatment = `CALL "${HANA_DATABASE}"."${HANA_OPEN_PO_NUMS}"  ('${whs}')`;
  return execute(procedureStatment);
};

const getPOitems = async (whs,number) => { 
  const procedureStatment = `CALL "${HANA_DATABASE}"."${HANA_PO_PROCEDURE}"  ('${whs}','${number}')`;
  return execute(procedureStatment);
};

const getPromotionItems = async (whs) => {
  const procedureStatment = `CALL "${HANA_DATABASE}"."${HANA_PROMOTION_REQUEST_PROCEDURE}" ('${whs}')`;
  return execute(procedureStatment);
};

const execute = async (procdure) => {
  return new Promise((resolve, reject) => {
    try {
      connection.connect(hanaConfig, (err) => {
        if (err) {
          console.log(err);
          reject();
        } else {
          const statment = connection.prepare(procdure);
          statment.execute(function (err, results) {
            if (err) {
              console.log(err);
              reject();
            }
            connection.disconnect();
            resolve(results);
          });
        }
      });
    } catch (err) {
      reject();
    }
  });
};

module.exports = {
  getItems,
  warehouseMatch,
  getItemsTransfer,
  getPOitems,
  getRequestReceipt,
  getPoNums,
  getPromotionItems
};
