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
      if(page == "request")
        tableHeader = [{text:"Item Code",style:"margins"},{text:"Item Name",style:"margins"},{text:"Barcode",style:"margins"},{text:"Ordered",style:"margins"},{text:"Unit",style:"margins"}]
      else{
        tableHeader = [{text:"Item Code",style:"margins"},{text:"Item Name",style:"margins"},{text:"Barcode",style:"margins"},{text:"Delivered",style:"margins"},{text:"Unit",style:"margins"}]
      }
      tableBody.push(tableHeader)
      results.results.forEach(rec => {
        const row = [{text:rec.ItemCode,style:"margins"},{text:flip(rec.ItemName), style:'arabicAndMargins'},{text:rec.CodeBars,style:"margins"},{text:rec.Order,style:"margins"},{text:rec.BuyUnitMsr,style:"margins"}]
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
          {text: 'Transfer Order', style: 'header'},
          {text: [
            {text: `From Warehouse: `, style: 'subHeader'},
            {text: `${flip(results.from)}`, style: 'arabicHeader'}
          ]},
          {text: `With Code No. ${results.results[0].WarehouseFrom}`, style: 'subHeader'},
          {text: [
            {text: `To Warehouse: `, style: 'subHeader'},
            {text: `${flip(results.to)}`, style: 'arabicHeader'}
          ]},
          {text: `With Code No. ${results.results[0].WarehouseTo}`, style: 'subHeader'},
          {text: [
            {text: `Order Code: `, style: 'subHeader'},
            {text: `${results.results[0].GenCode}`, style: 'genCodeHeader'}
          ]},
          {text: `Date:       /         /`, style: 'subHeader'},
          {
            style: 'tableStyle',
            table: {
              body: tableBody
            }
          },
          {
            columns: [
              {
                text: "Delivered Person", style: 'subHeader'
              },
              {
                text: "Received Person", style: 'subHeader'
              },
              {
                text: "Branch Manager", style: 'subHeader'
              }
            ]
          },
        ],
        styles: {
          header: {
            font: 'Roboto',
            alignment: 'center',
            fontSize: 22,
            bold: true,
            margin: [0, 0, 0, 30]
          },
          subHeader: {
            font: 'Roboto',
            bold: true,
            margin: [0, 10, 0, 10]
          },
          genCodeHeader:{
            color: '#FF1E00',
            font: 'Roboto',
            bold: true,
            fontSize: 16,
            margin: [0, 10, 0, 10]
          },
          tableStyle: {
            margin: [0, 20, 0, 30]
          },
          arabicHeader:{
            margin: [0, 0, 0, 10],
            font: 'DroidKufi',
            alignment: 'right',
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
        }
      }
      pdfMake.createPdf(docDefinition).print();
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