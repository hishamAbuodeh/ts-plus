let pageOption = 'docNum'
const docNumDiv = `<div class="demo-container"><div class="demo-flex-spacer"></div><div class="webflow-style-input"><input class="input-po" type="text" placeholder="Scan Barcode"></input><button id="poNumBtu" type="submit">send</button></div></div>`
const buttons  = `<div class="btuLoctaion"><botton id="print" class="btu"  style="display:none;"><p class="para">Print</p></botton><botton id="report" class="btu" style="margin-left: 30px;"><p class="para">Report</p></botton><botton id="submitOrder" class="btu" style="margin-left: 30px;"><p class="para">Submit</p></botton><botton id='close1' class="btu" style="margin-left: 30px;"><p class="para">close</p></botton><botton id='exit' class="btu" style="margin-left: 30px;"><p class="para">Exit</p></botton></div>`
let poNumber;
$(document).ready(() => {
    showDocNum() 
    $('.netError_accept2').on('click',()=>{
        hideModal("net-error2")
        const docNumValue = $('.input-po').val()
        if(docNumValue != ""){
            showTable(docNumValue)
        }else{
          alert('الرجاء ادخال رقم الطلبية')
        }
    });
    $(".confirm_btu").on("click", () => {
      hideModal("confirm");
      setTimeout(() => {
        tryToSubmit();
      }, 100);
    });
    $(".netError_accept3").on("click", () => {
      hideModal("net-error3");
      tryToSubmit();
  });
  $('#goBackBtu').on('click',()=>{
    if(pageOption == 'inputMode'){
      const data = `<div><a style="color: white;" href="/Transfer" id="goOpenTransfer">press</a></div>`
      goDirect('goOpenTransfer',data)
    }else{
      closeTable()
    }
  });
  $('#goHomeBtu').on('click',()=>{
      goToPage('goTransaction')
  });
})

const showDocNum = () => {
    pageOption = 'inputMode'
    document.getElementById('receiptDucNo').innerHTML = docNumDiv
    $('#poNumBtu').on('click',() => {
        const docNumValue = $('.input-po').val()
        if(docNumValue != ""){
            showTable(docNumValue)
        }else{
          alert('الرجاء ادخال رقم الطلبية')
        }
    })
}

const showTable = async (number) => {
    showModal('request') 
    $.post(`/Transfer/Sync/${number}`).then(msg => {
        if(msg == 'error'){
            setTimeout(() => {
                changeModalCont('net-error2','request');
            },1000)
        }else{
            setTimeout(() => {
                if(msg != 'not found'){
                    poNumber = number
                    createTable(msg)
                    hideModal('request');
                }else{
                    changeModalCont('notFound','request');
                    setTimeout(() => {
                        hideModal('notFound')
                    },1500)
                }
            },1000)
        }
    })
}

const closeTable = () => {
    const tableDiv = $('#receiptTable');
    const btuDiv = $('.otterDiv');
    try {
        document.getElementById("tbody").removeEventListener("click", tbodyFunc);
    } catch (err) {
        console.log(err);
    }
    tableDiv.empty();
    btuDiv.empty();
    showDocNum() 
}

const createTable = (table) => {
    pageOption = 'receiptTable'
    const poDiv = $('#receiptDucNo');
    const tableDiv = $('#receiptTable');
    const btuDiv = $('.otterDiv');
    poDiv.empty();
    tableDiv.html(table);
    $("#example").DataTable();
    btuDiv.html(buttons);
    try {
        document.getElementById("tbody").addEventListener("click", tbodyFunc);
    } catch (err) {
        console.log(err);
    }
    $("#submitOrder").on("click", () => {
      showModal("confirm")
    });
    $(".close_btu").on("click", () => {
      hideModal("confirm");
    });
    $("#report").on("click", (e) => {
    const txt = $("#report p")[0].innerHTML.trim();
    if (txt == "Report") {
        showReport();
    } else {
        showAllReports();
    }
    });
    $(".netError_denied3").on("click", () => {
        hideModal("net-error3");
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
        closeTable()
    });
}

const tbodyFunc = (e) => {
    const fullID = e.path[0].id;
    const arr = fullID.split("-");
    const id = arr[1];
    inputOrder(id);
}

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
      save(id, input, previousVal);
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

const edit = (id) => {
    const tr = $(`#tr${id}`);
    tr.removeClass("active-input");
    tr.removeClass("semi-active");
    tr.addClass("hide");
    tr.css("background-color", "");
  };

const save = (id, input, previousVal) => {
    const tr = $(`#tr${id}`);
    let value = input.val();
    if (value == "") {
      if (previousVal) {
        setOrderValueZero(id);
      }
      input.val("");
    } else if (value.toString()[0] == "-") {
      if (previousVal) {
        setOrderValueZero(id);
      }
      input.val("");
      alert("يرجى ادخال قيمة صحيحة");
    } else {
      value = trim(value);
      const checked = check(value, id);
      if (checked) {
        const diffValue = 0
        if (value != 0) {
            $.post(`/Order/Receipt/${id}/${value}/${diffValue}`).then((msg) => {
                if (msg == "error") {
                  alert(
                    "IT خطأ داخلي الرجاء المحاولة مرة اخرى او طلب المساعدة من قسم"
                  );
                  input.val("");
                } else {
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
      } else {
        if (previousVal) {
          setOrderValueZero(id);
        }
        alert("(0 - Ordered) الكمية يجب ان تكون بين");
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

  const check = (value, id) => {
    const QtyRec = $(`#qty-${id}`);
    const maxValue = QtyRec[0].innerHTML;
    if (value <= maxValue) {
      return true;
    } else {
      return false;
    }
  };

const setOrderValueZero = async (id) => {
  const qty = 0
    $.post(`/Order/Receipt/${id}/0/${qty}`).then((msg) => {
      if (msg == "error") {
        alert("IT خطأ داخلي الرجاء المحاولة مرة اخرى او طلب المساعدة من قسم");
      }
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
      $.get(`/Order/Report/deliver`).then((results) => {
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

  const tryToSubmit = () => {
    $("body").attr("style", "height:100%");
    showModal("submit");
    $.post(`/Transfer/Deliver/Submit`).then((msg) => {
      if (msg == "done") {
        setTimeout(() => {
          hideModal("submit");
          $("#tbody").empty();
          $("body").attr("style", "height:100%");
          setTimeout(() => {
            showModal("success");
            setTimeout(() => {
              $("#exit p")[0].innerHTML = "Log out";
              $("#report p")[0].innerHTML = "Sent report";
              $("#print").attr('style','display:"";')
              $('#print').on('click',()=>{
                getDataAndPrint("transfer",poNumber)
              });
              hideModal("success");
            }, 1000);
          }, 500);
        }, 1000);
      } else if (msg == "error") {
        setTimeout(() => {
          changeModalCont("net-error3", "submit");
        }, 1000);
      } else if (msg == "no data sent") {
        changeModalCont("noData", "submit");
        setTimeout(() => {
          hideModal("noData");
        }, 1000);
      }
    });
  };

  const showAllReports = () => {
    let end= new Date().toISOString();
    $.get(`/Order/AllReports/deliver/${poNumber}`).then((results) => {
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

  const getDataAndPrint = (page,genCode) => {
    $.get(`/Transfer/Print/Report/${page}/${genCode}/data`).then((results) => {
      const tableBody = []
      let tableHeader;
      let currentDate = new Date(Date.now())
      currentDate = convertUTCDateToLocalDate(currentDate)
      let date = new Date(currentDate).toISOString().split('T')[0]
      const time = new Date(currentDate).toISOString().split('T')[1].split('.')[0]
      if(page == "request")
        tableHeader = [{text:"Item Code",style:"margins"},{text:"Item Name",style:"margins"},{text:"Barcode",style:"margins"},{text:"Ordered",style:"margins"},{text:"Unit",style:"margins"}]
      else{
        tableHeader = [{text:"Item Code",style:"margins"},{text:"Item Name",style:"margins"},{text:"Barcode",style:"margins"},{text:"Delivered",style:"margins"},{text:"Unit",style:"margins"}]
      }
      tableBody.push(tableHeader)
      results.results.forEach(rec => {
        const row = [{text:rec.ItemCode,style:"margins"},{text:flip(rec.ItemName), style:'arabicAndMargins'},{text:rec.CodeBars,style:"margins"},{text:rec.Order,style:"margins"},{text:rec.BuyUnitMsr,style:"margins"}]
        tableBody.push(row)
      })
      pdfMake.fonts = {
        DroidKufi: {
            normal: 'DroidKufi-Regular.ttf',
            bold: 'DroidKufi-Regular.ttf',
            italics: 'DroidKufi-Regular.ttf',
            bolditalics: 'DroidKufi-Regular.ttf'
        },
        Roboto: {
          normal: 'Roboto-Italic.ttf',
          bold: 'Roboto-Medium.ttf',
          italics: 'Roboto-MediumItalic.ttf',
          bolditalics: 'Roboto-Regular.ttf'
        }
      }
      let docDefinition = {
        content: [
          {columns: [
            {
              image: 'logo',
              width: 60,
              height: 40,
            },
            {text: flip("شركة مخازن الريحان"), style: 'arabic3Header'},
          ]},
          {text: 'Transfer Order', style: 'header'},
          {text: '_______________________________________________________________________________________________', style: 'sub4Header'},
          {columns: [
            {width:110,text: `From Warehouse: `, style: 'subHeader'},
            {width:70,text: [
              // {text: `Code: `, style: 'sub2Header'},
              {text: `${results.results[0].WarehouseFrom}`, style: 'sub2Header'},
            ], style: 'subHeader'}, 
            {text: [
              // {text: `Name: `, style: 'sub2Header'},
              {text: `${flip(results.from)}`, style: 'arabic2Header'},
            ], style: 'sub3Header'},
          ]},
          {columns: [
            {width:110,text: `To Warehouse: `, style: 'subHeader'},
            {width:70,text: [
              // {text: `Code: `, style: 'sub2Header'},
              {text: `${results.results[0].WarehouseTo}`, style: 'sub2Header'},
            ], style: 'subHeader'}, 
            {text: [
              // {text: `Name: `, style: 'sub2Header'},
              {text: `${flip(results.to)}`, style: 'arabic2Header'},
            ], style: 'sub3Header'},
          ]},
          {columns: [
            {text: [
              {text: `Order Code: `, style: 'sub2Header'},
              {text: `${results.results[0].GenCode}`, style: 'genCodeHeader'}
            ], style: 'subHeader'},
            {text: `Document Date: ${date}`, style: 'subHeader'},
            {text: `Time: ${time}`, style: 'subHeader'},
          ]},
          ,
          {text: `Received Date:             /               /`, style: 'subHeader'},  
          {
            style: 'tableStyle',
            table: {
              body: tableBody
            }
          },
          {
            columns: [
              {
                text: "Delivered Person", style: 'subHeader'
              },
              {
                text: "Received Person", style: 'subHeader'
              },
              {
                text: "Branch Manager", style: 'subHeader'
              }
            ]
          },
        ],
        styles: {
          header: {
            font: 'Roboto',
            alignment: 'center',
            fontSize: 22,
            bold: true,
            margin: [0, -38, 0, 10]
          },
          subHeader: {
            font: 'Roboto',
            bold: true,
            margin: [0, 10, 0, 10]
          },
          sub2Header: {
            font: 'Roboto',
            bold: true,
          },
          sub3Header: {
            font: 'Roboto',
            bold: true,
            margin: [0, 5, 0, 10]
          },
          sub4Header: {
            font: 'Roboto',
            bold: true,
            margin: [0, 0, 0, 20]
          },
          arabic2Header:{
            font: 'DroidKufi',
            alignment: 'left',
          },
          arabic3Header:{
            font: 'DroidKufi',
            alignment: 'left',
            margin: [0, 5, 0, 0]
          },
          genCodeHeader:{
            color: '#FF1E00',
            font: 'Roboto',
            bold: true,
          },
          tableStyle: {
            margin: [0, 20, 0, 30]
          },
          arabicHeader:{
            margin: [0, 5, 0, 0],
            font: 'DroidKufi',
            alignment: 'left',
          },
          arabic:{
            font: 'DroidKufi',
            alignment: 'right',
          },
          margins:{
            margin: [10, 0, 10, 0],
          },
          arabicAndMargins:{
            margin: [10, 0, 10, 0],
            font: 'DroidKufi',
            alignment: 'right',
          },
        },
        images: {
          logo:'http://localhost:3111/img/logo.jpg'
        }
      }
      const fetches = [];
      fetches.push(fetchImage(docDefinition.images.logo).then(data => { docDefinition.images.logo = data; }));
      Promise.all(fetches).then(() => {
        pdfMake.createPdf(docDefinition).print();
      });
    })
  }

  const flip = (str) => {
    const arr = str.split(" ")
    let flippedStr = ""
    for(let i = arr.length - 1; i >= 0; i--){
      if(typeof arr[i] == "string"){
        flippedStr = flippedStr + arr[i]
        if(i > 0){
          flippedStr += " "
        }
      }
    }
    return flippedStr
  }

  function convertUTCDateToLocalDate(date) {
    let newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    let offset = date.getTimezoneOffset() / 60;
    let hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;   
}

function fetchImage (uri) {
  return new Promise(function (resolve, reject) {
    const image = new window.Image();
    image.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;
      canvas.getContext('2d').drawImage(this, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = function (params) {
      reject(new Error('Cannot fetch image ' + uri + '.'));
    };
    image.src = uri;
  });
}