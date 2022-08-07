$(document).ready(() => {
    showModal('net-error4')
    $('.netError_denied4').on('click',()=>{
        hideModal("net-error4")
        const data = `<div><a style="color: white;" href="/Transfer" id="goOpenTransfer">press</a></div>`
        goDirect('goOpenTransfer',data)
    }); 
    $('.netError_accept4').on('click',()=>{
        goToPage("goChoose")
    }); 
})