let note = "";
$(function () {
  $(document).ready(function () {
    $("#example").DataTable();
    try {
      document.getElementById("tbody").addEventListener("click", (e) => {
        const fullID = e.path[0].id;
        const arr = fullID.split("-");
        const id = arr[1];
        if((arr[0] != 'tdinp') && (arr[0] != 'inputDUC')){
          inputOrder(id);
        }else{
          inputPO(id);
        }
      });
    } catch (err) {
      console.log(err);
    }
    $("#submitOrder").on("click", () => {
      showModal("notes");
    });
    $(".closeAdd_btu").on("click", () => {
      hideModal("notes");
    });
    $(".add_btu").on("click", () => {
      hideModal("notes");
      let text = document.getElementById("textArea").value;
      if (text == "") {
        note = "لايوجد";
      } else {
        note = text;
      }
      document.getElementById("textArea").value = "";
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
});

const edit = (id) => {
  const tr = $(`#tr-${id}`);
  tr.removeClass("active-input");
  tr.addClass("hide");
  tr.css("background-color", "");
};

const save = (id, input, previousVal, lastValue,type) => {
  const tr = $(`#tr-${id}`);
  let value = input.val();
  if (lastValue == value && value != "") {
    tr.addClass("active-input");
    tr.removeClass("hide");
    tr.css("background-color", "green");
  } else if (value == "") {
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
    if (value != 0) {
      $.post(`/Return/Save/${type}/${id}/${value}`).then((msg) => {
        if (msg == "error") {
          alert("IT خطأ داخلي الرجاء المحاولة مرة اخرى او طلب المساعدة من قسم");
          input.val("");
        } else {
          if(type == 'input'){
            tr.addClass("active-input");
            tr.removeClass("hide");
            tr.css("background-color", "green");
          }
        }
      });
    } else {
      if (previousVal) {
        setOrderValueZero(id);
      }
      input.val("");
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

const setOrderValueZero = async (id) => {
  $.post(`/Return/Save/${type}/${id}/0`).then((msg) => {
    if (msg == "error") {
      alert("IT خطأ داخلي الرجاء المحاولة مرة اخرى او طلب المساعدة من قسم");
    }
  });
};

const tryToSubmit = () => {
  $("body").attr("style", "height:100%");
  showModal("submit");
  $.post(`/Return/Submit/${note}`).then((msg) => {
    if (msg == "done") {
      note = "";
      setTimeout(() => {
        hideModal("submit");
        $("#tbody").empty();
        $("body").attr("style", "height:100%");
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
    $.get(`/Return/Report`).then((results) => {
      if (results == "error") {
        alert("IT خطأ داخلي الرجاء المحاولة مرة اخرى او طلب المساعدة من قسم");
      } else {
        console.log(results)
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
  $.get("/Return/AllReports").then((results) => {
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
    save(id, input, previousVal, value,'input');
    input.off("blur");
    document
      .getElementById(`input-${id}`)
      .removeEventListener("keydown", tabFunc);
  });
  const tabFunc = (e) => {
    if (e.key == "Tab") {
      setTimeout(() => {
        const active = document.querySelector(":focus");
        active.click();
      }, 100);
    }
  };
  document.getElementById(`input-${id}`).addEventListener("keydown", tabFunc);
};

const inputPO = (id) => {
  $(`#inputDUC-${id}`).focus();
  const input = $(`#inputDUC-${id}`);
  const value = input.val();
  let previousVal = false;
  $(`#inputDUC-${id}`).on("blur", () => {
    save(id, input, previousVal, value,'po');
    input.off("blur");
    document
      .getElementById(`inputDUC-${id}`)
      .removeEventListener("keydown", tabFunc);
  });
  const tabFunc = (e) => {
    if (e.key == "Tab") {
      setTimeout(() => {
        const active = document.querySelector(":focus");
        active.click();
      }, 100);
    }
  };
  document.getElementById(`inputDUC-${id}`).addEventListener("keydown", tabFunc);
};
