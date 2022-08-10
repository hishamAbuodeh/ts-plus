$(document).ready(() => {
    $('#selectBtu').on('click',() => {
        const value = $('#select-0').val()
        if(value != ""){
            showReport("request",value)
        }else{
            alert('الرجاء اختيار كود الطلبية')
        }
    })
    $('#inputBtu').on('click',() => {
        const value = $('#input-0').val()
        if(value != ""){
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
      $.get(`/Transfer/Print/Report/${page}/${genCode}`).then((results) => {
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
          });
        }
      });
    }, 100);
  };