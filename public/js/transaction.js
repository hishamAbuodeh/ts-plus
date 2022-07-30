let page = ""

const goToPage = (page) => {
    $.get('/Routing').then(data => {
      $('#body').html(data)
      $(document).ready(function() {
          setTimeout(() => {
              document.getElementById(`${page}`).click();
          },1000)
      })
    });
  }

$(document).ready(function() {
    $('#request').on('click',()=>{
        page = 'goRequest'
        showPage(page)
    })
    $('#receipt').on('click',()=>{
        goToPage('goReceipt')
    })
    $('#transfer').on('click',()=>{
        page = 'goTransfer'
        showPage(page)
    })
    $('#return').on('click',()=>{
        page = 'goReturn'
        showPage(page)
    });
    $('.netError_denied').on('click',()=>{
        hideModal("net-error")
    });
    $('.netError_denied2').on('click',()=>{
        hideModal("net-error2")
    });
    $('.netError_accept').on('click',()=>{
        hideModal("net-error")
        showPage(page)
    });  
})

const showPage = async (page) => {
    showModal('request') 
    $.post(`/Transaction/Sync/${page}`).then(msg => {
        if(msg == 'error'){
            setTimeout(() => {
                changeModalCont('net-error','request');
            },1000)
        }else if(msg == 'done'){
            setTimeout(() => {
                hideModal('request');
                goToPage(page);
            },1000)
        }
    })
}

const showModal = (type) => {
    $('#demo-modal').removeClass('modal');
    $('#demo-modal').addClass('modal-v');
    switch(type){
        case "request":
            $('.modal_syncData_container').attr('style','display:flex;');
            break;
        case "net-error":
            $('.modal_netError_container').attr('style','display:flex;');
            break;
        case "soon":
            $('.modal_soon_container').attr('style','display:flex;');
            break;
        case "net-error2":
            $('.modal_netError_container2').attr('style','display:flex;');
            break;
        case "notFound":
            $('.modal_noPOs_container').attr('style','display:flex;');
            break;
        case "submit":
            $(".modal_sendDataBack_container").attr("style", "display:flex;");
            break;
        case "net-error3":
            $('.modal_netError_container3').attr('style','display:flex;');
            break;
        case "success":
            $(".modal_success_container").attr("style", "display:flex;");
            break;
        case "confirm":
            $(".modal_confirm_container").attr("style", "display:flex;");
            break;
        default:
            break;
    }
}

const hideModal = (type) => {
    $('#demo-modal').removeClass('modal-v');
    $('#demo-modal').addClass('modal');
    switch(type){
        case "request":
            $('.modal_syncData_container').attr('style','display:none;');
            break;
        case "net-error":
            $('.modal_netError_container').attr('style','display:none;');
            break;
        case "soon":
            $('.modal_soon_container').attr('style','display:none;');
            break;
        case "net-error2":
            $('.modal_netError_container2').attr('style','display:none;');
            break;
        case "notFound":
            $('.modal_noPOs_container').attr('style','display:none;');
            break;
        case "submit":
            $(".modal_sendDataBack_container").attr("style", "display:none;");
            break;
        case "net-error3":
            $('.modal_netError_container3').attr('style','display:none;');
            break;
        case "success":
            $(".modal_success_container").attr("style", "display:none;");
            break;
        case "confirm":
            $(".modal_confirm_container").attr("style", "display:none;");
            break;
        default:
            break;
    }
}

const changeModalCont = (newContent,oldConten) => {
    hideModal(oldConten);
    showModal(newContent)
}