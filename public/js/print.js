import pdfMake from "../../node_modules/pdfmake/build/pdfmake";
import pdfFonts from "../../node_modules/pdfmake/build/vfs_fonts";
pdfMake.addVirtualFileSystem(pdfFonts);
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
    console.log(page,genCode)
    $.get(`/Transfer/Print/Report/${page}/${genCode}/data`).then((results) => {
      console.log(results)
      let docDefinition = {
        content: [
          'First paragraph',
          'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
        ]
        
      }
      pdfMake.createPdf(docDefinition).open();
    })
  }