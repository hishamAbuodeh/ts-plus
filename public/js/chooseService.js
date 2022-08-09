let isOpened;
$(document).ready(() => {
    $('#transferRequest').on('click',() => {
        goToPage("goChoose")
    })
    $('#transferShow').on('click',() => {
        const data = `<div><a style="color: white;" href="/Transfer/Delivery" id="goDelivery">press</a></div>`
        goDirect('goDelivery',data)
    })
    $('#print').on('click',() => {
        goToPage('goPrint')
    })
    $('#requestOrder').on('click',() => {
        $.get('/Transaction/Check')
        .then((msg) => {
            isOpened = msg.open
            if(isOpened){
                page = 'goRequest'
                showPage(page)
            }else{
                showModal('sendEmail')
            }
        })
        .fail(() => {
            alert("خطأ داخلي الرجاء المحاولة مرة اخرى");
        })
    })
    $('#requestReceipt').on('click',() => {
        goToPage('goRequestReceipt')
    })
    $('.request_close').on('click',()=>{
        hideModal("sendEmail")
    });
    $('.send_email').on('click',()=>{
        changeModalCont("waiting","sendEmail")
        setTimeout(() => {
            sendRequestEmail()
        },300)
    });
})

const sendRequestEmail = () => {
    $.get("/Request/AllowRequest").then((msg) => {
        console.log(msg)
        if(msg != 'error'){
            changeModalCont("success","waiting")
            setTimeout(() => {
                hideModal("success")
            },1000)
        }else{
            hideModal("waiting")
            alert("خطأ داخلي الرجاء المحاولة مرة اخرى");
        }
    })
}