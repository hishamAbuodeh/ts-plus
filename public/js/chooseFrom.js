$(document).ready(() => {
    $('.btu').on('click',() => {
        const value = $('#select-0').val()
        if(value != ""){
            $.post(`/Transfer/Choose/${value}`).then((msg) => {
                if(msg == 'done'){
                    page = 'goTransfer'
                    showPage(page)
                }else{
                    alert("IT خطأ داخلي الرجاء المحاولة مرة اخرى او طلب المساعدة من قسم"); 
                }
            })
        }else{
            alert('الرجاء اختيار مستودع')
        }
    })
})