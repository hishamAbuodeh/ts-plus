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
        tableHeader = ["Item Code","Item Name","Barcode","Ordered","Unit"]
      else{
        tableHeader = ["Item Code","Item Name","Barcode","Delivered","Unit"]
      }
      tableBody.push(tableHeader)
      results.results.forEach(rec => {
        const row = [rec.ItemCode,{text:rec.ItemName, style:'arabic'},rec.CodeBars,rec.Order,rec.BuyUnitMsr]
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
            {text: `${results.from}`, style: 'arabic'}
          ]},
          {text: `With Code No. ${results.results[0].WarehouseFrom}`, style: 'subHeader'},
          {text: [
            {text: `To Warehouse: `, style: 'subHeader'},
            {text: `${results.to}`, style: 'arabic'}
          ]},
          {text: `With Code No. ${results.results[0].WarehouseTo}`, style: 'subHeader'},
          {qr: `Order Code: ${results.results[0].GenCode}`, style: 'subHeader'},
          {
            style: 'tableStyle',
            table: {
              body: tableBody
            }
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
            margin: [0, 0, 0, 10]
          },
          tableStyle: {
            margin: [0, 20, 0, 0]
          },
          arabic:{
            font: 'DroidKufi',
            alignment: 'right',
          }
        }
      }
      pdfMake.createPdf(docDefinition).print();
    })
  }