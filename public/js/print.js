let currentPage;
let currentGenCode;
$(document).ready(() => {
    $('#selectBtu').on('click',() => {
        const value = $('#select-0').val()
        if(value != ""){
            currentPage = "request"
            currentGenCode = value
            showReport("request",value)
        }else{
            alert('الرجاء اختيار كود الطلبية')
        }
    })
    $('#inputBtu').on('click',() => {
        const value = $('#input-0').val()
        if(value != ""){
            currentPage = "deliver"
            currentGenCode = value
            showReport("deliver",value)
        }else{
            alert('الرجاء مسح باركود الطلبية')
        }
    })
    $('#goBackBtu').on('click',()=>{
        const data = `<div><a style="color: white;" href="/Transfer" id="goOpenTransfer">press</a></div>`
        goDirect('goOpenTransfer',data)
    });
    $('#goHomeBtu').on('click',()=>{
        goToPage('goTransaction')
    });  
})

const showReport = (page,genCode) => {
    setTimeout(() => {
      $.get(`/Transfer/Print/Report/${page}/${genCode}/table`).then((results) => {
        if (results == "noData") {
          showModal('notFound')
          setTimeout(() => {
            hideModal('notFound')
          },1500)
        } else {
          $("#reportDiv").html(results);
          $(document).ready(() => {
            $("#close").on("click", (e) => {
              $("#reportDiv").empty();
            });
            $('#print').on('click',()=>{
              getDataAndPrint(currentPage,currentGenCode)
            }); 
          });
        }
      });
    }, 100);
  };

  const getDataAndPrint = (page,genCode) => {
    $.get(`/Transfer/Print/Report/${page}/${genCode}/data`).then((results) => {
      const tableBody = []
      let tableHeader;
      let currentDate = new Date(Date.now())
      currentDate = convertUTCDateToLocalDate(currentDate)
      let date = new Date(currentDate).toISOString().split('T')[0]
      const time = new Date(currentDate).toISOString().split('T')[1].split('.')[0]
      if(page == "request")
        tableHeader = [{text:"No.",style:"margins"},{text:"Item Code",style:"margins"},{text:"Item Name",style:"margins"},{text:"Barcode",style:"margins"},{text:"Ordered",style:"margins"},{text:"Unit",style:"margins"}]
      else{
        tableHeader = [{text:"No.",style:"margins"},{text:"Item Code",style:"margins"},{text:"Item Name",style:"margins"},{text:"Barcode",style:"margins"},{text:"Delivered",style:"margins"},{text:"Unit",style:"margins"}]
      }
      tableBody.push(tableHeader)
      results.results.forEach(rec => {
        const row = [{text:rec.no,style:"margins"},{text:rec.ItemCode,style:"margins"},{text:flip(rec.ItemName), style:'arabicAndMargins'},{text:rec.CodeBars,style:"margins"},{text:rec.Order,style:"margins"},{text:rec.BuyUnitMsr,style:"margins"}]
        tableBody.push(row)
      })
      pdfMake.fonts = {
        DroidKufi: {
            normal: 'DroidKufi-Regular.ttf',
            bold: 'DroidKufi-Regular.ttf',
            italics: 'DroidKufi-Regular.ttf',
            bolditalics: 'DroidKufi-Regular.ttf'
        },
        Roboto: {
          normal: 'Roboto-Italic.ttf',
          bold: 'Roboto-Medium.ttf',
          italics: 'Roboto-MediumItalic.ttf',
          bolditalics: 'Roboto-Regular.ttf'
        }
      }
      let docDefinition = {
        content: [
          {columns: [
            {
              image: 'logo',
              width: 100,
              height: 80,
            },
            {text: flip("شركة مخازن الريحان"), style: 'arabic3Header'},
            {
              height:40,
              width:100,
              image: 'barcode',
              style:"sub7Header"
            },
          ]},
          {text: 'Transfer Order', style: 'header'},
          {columns: [
            {text: `Date: ${date}`, style: 'sub6Header'},
            {text: `${results.results[0].GenCode}`, style: 'genCodeHeader'}
          ]},
          {text: '_______________________________________________________________________________________________', style: 'sub4Header'},
          {columns: [
            {width:110,text: `From Warehouse: `, style: 'subHeader'},
            {width:50,text: [
              {text: `(${results.results[0].WarehouseFrom})`, style: 'sub2Header'},
            ], style: 'subHeader'},
            {text: [
              {text: `${flip(results.from)}`, style: 'arabic2Header'},
            ], style: 'sub3Header'},
          ]},
          {columns: [
            {width:110,text: `To Warehouse: `, style: 'subHeader'},
            {width:50,text: [
              {text: `(${results.results[0].WarehouseTo})`, style: 'sub2Header'},
            ], style: 'subHeader'}, 
            {text: [
              {text: `${flip(results.to)}`, style: 'arabic2Header'},
            ], style: 'sub3Header'},
          ]},
          {
            style: 'tableStyle',
            table: {
              body: tableBody
            }
          },
          {columns: [
            {
              text: "Delivered Person", style: 'subHeader'
            },
            {
              text: "Received Person", style: 'subHeader'
            },
            {
              text: "Branch Manager", style: 'subHeader'
            }
          ],style:"footerStyle"},
        ],
        footer:function(currentPage, pageCount) { 
          return currentPage.toString() + ' of ' + pageCount;     
        },
        styles: {
          header: {
            font: 'Roboto',
            alignment: 'center',
            fontSize: 22,
            bold: true,
            margin: [0, -38, 0, 20]
          },
          subHeader: {
            font: 'Roboto',
            bold: true,
          },
          sub2Header: {
            font: 'Roboto',
            bold: true,
          },
          sub3Header: {
            font: 'Roboto',
            bold: true,
            margin: [0, -6, 0, 0],
          },
          sub4Header: {
            font: 'Roboto',
            bold: true,
            margin: [0, -10, 0, 20]
          },
          sub5Header: {
            font: 'Roboto',
            alignment: 'right',
            bold: true,
          },
          sub6Header: {
            font: 'Roboto',
            alignment: 'left',
            bold: true,
          },
          sub7Header: {
            alignment: 'right',
          },
          arabic2Header:{
            font: 'DroidKufi',
            alignment: 'left',
          },
          arabic3Header:{
            font: 'DroidKufi',
            alignment: 'left',
            margin: [0, 5, 0, 0]
          },
          genCodeHeader:{
            color: '#FF1E00',
            font: 'Roboto',
            bold: true,
            alignment: 'right',
          },
          tableStyle: {
            margin: [0, 20, 0, 30]
          },
          arabicHeader:{
            margin: [0, 5, 0, 0],
            font: 'DroidKufi',
            alignment: 'left',
          },
          arabic:{
            font: 'DroidKufi',
            alignment: 'right',
          },
          margins:{
            margin: [10, 0, 10, 0],
          },
          arabicAndMargins:{
            margin: [10, 0, 10, 0],
            font: 'DroidKufi',
            alignment: 'right',
          },
          footerStyle:{
            alignment: 'center',
          }
        },
        images: {
          logo:'http://localhost:3111/img/logo.jpg',
          barcode:`${results.results[0].GenCode}`
        }
      }
      const fetches = [];
      fetches.push(fetchImage(docDefinition.images.logo).then(data => { docDefinition.images.logo = data; }));
      fetches.push(textToBase64Barcode(docDefinition.images.barcode).then(data => { docDefinition.images.barcode = data; }));
      Promise.all(fetches).then(() => {
        pdfMake.createPdf(docDefinition).print();
      });
    })
  }

  const flip = (str) => {
    const arr = str.split(" ")
    let flippedStr = ""
    for(let i = arr.length - 1; i >= 0; i--){
      if(typeof arr[i] == "string"){
        flippedStr = flippedStr + arr[i]
        if(i > 0){
          flippedStr += " "
        }
      }
    }
    return flippedStr
  }

  function convertUTCDateToLocalDate(date) {
    let newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    let offset = date.getTimezoneOffset() / 60;
    let hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;   
}

function fetchImage (uri) {
  return new Promise(function (resolve, reject) {
    const image = new window.Image();
    image.onload = function () {
      let canvas = document.createElement('canvas');
      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;
      canvas.getContext('2d').drawImage(this, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = function (params) {
      reject(new Error('Cannot fetch image ' + uri + '.'));
    };
    image.src = uri;
  });
}

function textToBase64Barcode(text){
  return new Promise((resolve,reject) => {
    let canvas = document.createElement("canvas");
    JsBarcode(canvas, text, {format: "CODE39"});
    resolve(canvas.toDataURL("image/png"))
  })
}