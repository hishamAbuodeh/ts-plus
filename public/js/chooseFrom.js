let genCodeValue;
$(document).ready(() => {
    const currentPage = $('title')[0].text
    $('.btu').on('click',() => {
        const value = $('#select-0').val()
        if(value != ""){
            if(currentPage == "From"){
                $.post(`/Transfer/Choose/${value}`).then((msg) => {
                    if(msg == 'done'){
                        page = 'goTransfer'
                        showPage(page)
                    }else{
                        alert("IT خطأ داخلي الرجاء المحاولة مرة اخرى او طلب المساعدة من قسم"); 
                    }
                })
            }else if(currentPage == "Receipt"){
                genCodeValue = value
                checkGenCode(value)
            }
        }else{
            if(currentPage == "From"){
                alert('الرجاء اختيار مستودع')
            }else if(currentPage == "Receipt"){
                alert('الرجاء اختيار كود الطلبية')
            }  
        }
    })
    $('.netError_denied5').on('click',()=>{
        hideModal("net-error5")
    });
    $('.netError_accept5').on('click',()=>{
        hideModal("net-error5")
        checkGenCode(genCodeValue)
    });
    $('#goBackBtu').on('click',()=>{
        if(currentPage == "From"){
            const data = `<div><a style="color: white;" href="/Transfer" id="goOpenTransfer">press</a></div>`
            goDirect('goOpenTransfer',data)
        }else{
            const data = `<div><a style="color: white;" href="/Request" id="goOpenRequest">press</a></div>`
            goDirect('goOpenRequest',data)
        }
    });
    $('#goHomeBtu').on('click',()=>{
        goToPage('goTransaction')
    });    
})

const checkGenCode = (value) => {
    showModal('request')
    $.post(`/Request/check/${value}`).then((msg) => {
        if(msg == 'open'){
            setTimeout(() => {
                hideModal('request')
                goToGenCode(value)
            },1000)
        }else if(msg == 'close'){
            setTimeout(() => {
                hideModal('request')
                alert("لا يمكن الاستلام - الطلبية قيد التجهيز"); 
            },1000)      
        }else if(msg == 'error'){
            setTimeout(() => {
                changeModalCont('net-error5','request'); 
            },1000) 
        }
    })
}

const goToGenCode = (value) => {
    $.post(`/Request/${value}`).then((msg) => {
        if(msg == 'done'){
            goToPage('goReqReceiptTable')
        }else{
            alert("IT خطأ داخلي الرجاء المحاولة مرة اخرى او طلب المساعدة من قسم"); 
        }
    })
}