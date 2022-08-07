let isOpened;
$(document).ready(() => {
    const currentPage = $('title')[0].text
    if(currentPage == "service"){
        $.get('/Transaction/Check')
        .then((msg) => {
            isOpened = msg.open
        })
        .fail(() => {
            alert("خطأ داخلي الرجاء");
            setTimeout(() => {
                location.reload();
            },1000)
        })
    }
    $('#transferRequest').on('click',() => {
        goToPage("goChoose")
    })
    $('#transferShow').on('click',() => {
        
    })
    $('#print').on('click',() => {
       
    })
    $('#requestOrder').on('click',() => {
        if(isOpened){
            page = 'goRequest'
            showPage(page)
        }else{
            console.log(isOpened)
        }
    })
    $('#requestReceipt').on('click',() => {
        goToPage('goRequestReceipt')
    })
})