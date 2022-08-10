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
                const page = 'goRequest'
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
    $('.check_allow').on('click',()=>{
        changeModalCont("waiting","sendEmail")
        setTimeout(() => {
            checkStaus()
        },300)
    });
    $('#goBackBtu').on('click',()=>{
        goToPage('goTransaction')
    });
    $('#goHomeBtu').on('click',()=>{
        goToPage('goTransaction')
    });  
})

const sendRequestEmail = () => {
    $.get("/Request/AllowRequest").then((msg) => {
        if(msg != 'error'){
            changeModalCont("success","waiting")
            setTimeout(() => {
                hideModal("success")
            },1000)
        }else{
            changeModalCont("sendEmail","waiting")
            alert("لا يوجد اتصال بالانترنت. الرجاء المحاولة مرة اخرى");
        }
    })
}

const checkStaus = () => {
    $.get("/Request/CheckAllow").then((msg) => {
        console.log(msg)
        if(msg == 'allowed'){
            hideModal("waiting")
            const page = 'goRequest'
            showPage(page)
        }else if(msg == 'notAllowed'){
            changeModalCont("notAllowed","waiting")
            setTimeout(() => {
                hideModal("notAllowed")
            },2000)
        }else if(msg == 'error'){
            changeModalCont("sendEmail","waiting")
            alert("لا يوجد اتصال بالانترنت. الرجاء المحاولة مرة اخرى");
        }
    })
}