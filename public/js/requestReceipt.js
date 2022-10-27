let page = "receipt";
let note= ""
let genCode;
$(function () {
  $(document).ready(function () {
    $("#example").DataTable();
    genCode = $('title')[0].id
    try {
      document.getElementById("tbody").addEventListener("click", (e) => {
        const fullID = e.path[0].id;
        const arr = fullID.split("-");
        const id = arr[1];
        inputOrder(id);
      });
    } catch (err) {
      console.log(err);
    }
    $("#submitOrder").on("click", () => {
      showModal('notes')
    });
    $(".closeAdd_btu").on("click", () => {
      hideModal("notes");
    });
    $(".add_btu").on("click", () => {
      hideModal("notes");
      let text = document.getElementById('textArea').value
      if(text == ""){
        note = "لايوجد"
      }else{
        note = text
      }
      document.getElementById('textArea').value = ""
      tryToSubmit();
    });
    $("#report").on("click", (e) => {
      const txt = $("#report p")[0].innerHTML.trim();
      if (txt == "Report") {
        showReport();
      } else {
        showAllReports();
      }
    });
    $(".netError_denied").on("click", () => {
      hideModal("net-error");
    });
    $(".netError_accept").on("click", () => {
      hideModal("net-error");
      tryToSubmit();
    });
  });
  $("#exit").on("click", (e) => {
    const txt = $("#exit p")[0].innerHTML.trim();
    if (txt == "Exit") {
      showTransaction();
    } else {
      logOut();
    }
  });
  $("#close1").on("click", (e) => {
    showGenCodes()
  });
  $('#goBackBtu').on('click',()=>{
    showGenCodes()
  });
  $('#goHomeBtu').on('click',()=>{
    goToPage('goTransaction')
  }); 
});

const edit = (id) => {
  const tr = $(`#tr-${id}`);
  tr.removeClass("active-input");
  tr.removeClass("semi-active");
  tr.addClass("hide");
  tr.css("background-color", "");
};

const save = (id, input, previousVal,lastValue) => {
  const tr = $(`#tr-${id}`);
  let value = input.val();
  if((lastValue == value) && (value != "")){
    tr.addClass("active-input");
    tr.removeClass("hide");
    tr.css("background-color", "green");
  }else if (value == "") {
    if (previousVal) {
      setOrderValueZero(id);
    }
    input.val("");
  } else if (value.toString()[0] == "-") {
    if (previousVal) {
      setOrderValueZero(id);
    }
    input.val("");
    alert("ينبغي تحديد كمية الطلب قبل الحفظ");
  } else {
    value = trim(value);
    const check = checkValue(value,id)
    if(check){
      const diffValue = calculateDiff(value,id);
      if (value != 0) {
        $.post(`/Order/Receipt/${id}/${value}/${diffValue}`).then((msg) => {
          if (msg == "error") {
            alert(
              "IT خطأ داخلي الرجاء المحاولة مرة اخرى او طلب المساعدة من قسم"
            );
            input.val("");
          } else {
            $(`#diff-${id}`)[0].innerHTML = diffValue
            tr.addClass("active-input");
            tr.removeClass("hide");
            tr.css("background-color", "green");
          }
        });
      } else {
        if (previousVal) {
          setOrderValueZero(id);
        }
        input.val("");
      }
    }else{
      if (previousVal) {
        setOrderValueZero(id);
      }
      input.val("");
      const qty = $(`#qty-${id}`)[0].innerHTML
      alert(`الكمية يجب ان تكون بين 0 - ${qty}`);
    }
  }
  return;
};

const trim = (value) => {
  const str = value.toString();
  const arr = str.split(".");
  let leftStr = arr[0];
  leftStr = parseInt(leftStr);
  leftStr = leftStr.toString();
  let newStr = arr[1] ? `${leftStr}.${arr[1]}` : `${leftStr}`;
  return parseFloat(newStr);
};

const checkValue = (value,id) => {
  const qty = $(`#qty-${id}`)[0].innerHTML
  if(value <= qty && value >= 0){
    return true
  }else{
    return
  }
}

const calculateDiff = (value,id) => {
  const qty = $(`#qty-${id}`)[0].innerHTML
  return qty - value
}

const setOrderValueZero = async (id) => {
  const qty = $(`#qty-${id}`)[0].innerHTML
  $(`#diff-${id}`)[0].innerHTML = qty
  $.post(`/Order/Receipt/${id}/0/${qty}`).then((msg) => {
    if (msg == "error") {
      alert("IT خطأ داخلي الرجاء المحاولة مرة اخرى او طلب المساعدة من قسم");
    }
  });
};

const tryToSubmit = () => {
  showModal("submit");
  $.post(`/Order/Submit/${page}/${note}`).then((msg) => {
    if (msg == "done") {
      note = ""
      setTimeout(() => {
        hideModal("submit");
        $("#tbody").empty();
        setTimeout(() => {
          showModal("success");
          setTimeout(() => {
            $("#exit p")[0].innerHTML = "Log out";
            $("#report p")[0].innerHTML = "Sent report";
            hideModal("success");
          }, 1000);
        }, 500);
      }, 1000);
    } else if (msg == "error") {
      setTimeout(() => {
        changeModalCont("net-error", "submit");
      }, 1000);
    } else if (msg == "no data sent") {
      changeModalCont("noData", "submit");
      setTimeout(() => {
        hideModal("noData");
      }, 1000);
    }
  });
};

const showModal = (type) => {
  $("#demo-modal").removeClass("modal");
  $("#demo-modal").addClass("modal-v");
  switch (type) {
    case "submit":
      $(".modal_sendDataBack_container").attr("style", "display:flex;");
      break;
    case "net-error":
      $(".modal_netError_container").attr("style", "display:flex;");
      break;
    case "success":
      $(".modal_success_container").attr("style", "display:flex;");
      break;
    case "noData":
      $(".modal_noData_container").attr("style", "display:flex;");
      break;
    case "waiting":
      $(".modal_waiting_container").attr("style", "display:flex;");
      break;
    case "notes":
      $(".modal_notes_container").attr("style", "display:flex;");
      break;
    default:
      break;
  }
};

const hideModal = (type) => {
  $("#demo-modal").removeClass("modal-v");
  $("#demo-modal").addClass("modal");
  switch (type) {
    case "submit":
      $(".modal_sendDataBack_container").attr("style", "display:none;");
      break;
    case "net-error":
      $(".modal_netError_container").attr("style", "display:none;");
      break;
    case "success":
      $(".modal_success_container").attr("style", "display:none;");
      break;
    case "noData":
      $(".modal_noData_container").attr("style", "display:none;");
      break;
    case "notes":
      $(".modal_notes_container").attr("style", "display:none;");
      break;
    default:
      break;
  }
};

const changeModalCont = (newContent, oldConten) => {
  hideModal(oldConten);
  showModal(newContent);
};

const showGenCodes = () => {
  $.get("/Routing").then((data) => {
    $("#body").html(data);
    $(document).ready(function () {
      document.getElementById("goRequestReceipt").click();
    });
  });
};

const showTransaction = () => {
  $.get("/Routing").then((data) => {
    $("#body").html(data);
    $(document).ready(function () {
      document.getElementById("goTransaction").click();
    });
  });
};

const logOut = () => {
  $.post("/LogOut").then((data) => {
    $("#body").html(data);
    $(document).ready(function () {
      document.getElementById("goLogin").click();
    });
  });
};

const showReport = () => {
  setTimeout(() => {
    $.get(`/Order/Report/${page}`).then((results) => {
      if (results == "error") {
        alert("IT خطأ داخلي الرجاء المحاولة مرة اخرى او طلب المساعدة من قسم");
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

const showAllReports = () => {
  $.get(`/Order/AllReports/${page}/${genCode}`).then((results) => {
    if (results == "error") {
      alert("IT خطأ داخلي الرجاء المحاولة مرة اخرى او طلب المساعدة من قسم");
    } else {
      $("#reportDiv").html(results);
      $(document).ready(() => {
        $("#close").on("click", (e) => {
          $("#reportDiv").empty();
        });
      });
    }
  });
};

const inputOrder = (id) => {
  $(`#input-${id}`).focus();
  const input = $(`#input-${id}`);
  const value = input.val();
  let previousVal = false;
  if (value > 0) {
    previousVal = true;
    edit(id);
  }
  $(`#input-${id}`).on("blur", () => {
    save(id, input, previousVal,value);
    input.off("blur");
    document.getElementById(`input-${id}`).removeEventListener('keydown',tabFunc)
  });
  const tabFunc = (e) => {
    if(e.key == 'Tab'){
        setTimeout(() => {
          const active = document.querySelector(":focus")
          active.click()
        },100)
    }
  }
  document.getElementById(`input-${id}`).addEventListener('keydown',tabFunc)
};