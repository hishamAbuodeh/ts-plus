require("dotenv").config();
const hana = require("@sap/hana-client");
const file = require("./readAndWriteFiles");

// enviroment variables
const HANA_HOST = process.env.HANA_HOST;
const HANA_USER = process.env.HANA_USER;
const HANA_PASSWORD = process.env.HANA_PASSWORD;

const hanaConfig = {
  serverNode: `${HANA_HOST}:30015`,
  uid: HANA_USER,
  pwd: HANA_PASSWORD,
  sslValidateCertificate: "false",
};

const connection = hana.createConnection();

const getItems = async (whs) => {
  const procedureStatment = `CALL "RAYHAN_2022"."SP_DIPS_StockReq" ('${whs}')`;
  return execute(procedureStatment);
};

const getItemsTransfer = async (whs) => {
  const procedureStatment = `CALL "RAYHAN_2022"."SP_DIPS_StockReq" ('${whs}')`
  const results = await execute(procedureStatment)
  const str = await warehouseMatch(whs)
  if(str != 'error'){
    return results.map(item => {
      item.Warehouses = str;
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
      connection.exec(`Select * from "RAYHAN_NEW"."WHS_REP"`, (err, result) => {
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
    const status = await file.addMatchingFile(data);
    if (status != "file error") {
      return listStr;
    } else {
      return "error";
    }
  }else{
    return "error";
  }  
};

const getPOitems = async (whs,number) => { 
  const procedureStatment = `CALL "RAYHAN_2022"."SP_DIPS_PurchaseOrder"  ('${whs}','${number}')`;
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
  getPOitems
};
