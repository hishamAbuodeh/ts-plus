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
                $.post(`/Request/${value}`).then((msg) => {
                    if(msg == 'done'){
                        goToPage('goReqReceiptTable')
                    }else{
                        alert("IT خطأ داخلي الرجاء المحاولة مرة اخرى او طلب المساعدة من قسم"); 
                    }
                })
            }
        }else{
            if(currentPage == "From"){
                alert('الرجاء اختيار مستودع')
            }else if(currentPage == "Receipt"){
                alert('الرجاء اختيار كود الطلبية')
            }  
        }
    })
})