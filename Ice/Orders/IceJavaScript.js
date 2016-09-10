var TotalPrice = 0;
Cookies.set('Body', "");

$(document).on("pagecreate", "#index", function (event) {
    InitPopups();

    //Ice cream popup ddls
    $("#puIceCream").on("popupafteropen", function (event) {
        var NumofFlavorsSelected;
        if ($("#ddlSizeIC option").length < 2) {
            WebServiceURL = "IceWS.asmx";
            $.support.cors = true;
            $.ajax({
                url: WebServiceURL + "/GetSizes",
                dataType: "json",
                type: "post",
                data: "{ }",
                contentType: "application/json; charset=utf-8",
                error: function (err) {
                    alert("error: " + JSON.stringify(err));
                },
                success: function (data) {
                    var size = data["d"].length;
                    for (var i = 0 ; i < size; i++) {
                        $("#ddlSizeIC").append("<option>" + ((String)(data["d"][i].value)) + "</option>");
                    }
                }
            });
        }
        if ($("#ddlNumFlavorsIC option").length < 2) {
            WebServiceURL = "IceWS.asmx";
            $.support.cors = true;
            $.ajax({
                url: WebServiceURL + "/GetNumofFlavors",
                dataType: "json",
                type: "post",
                data: "{ }",
                contentType: "application/json; charset=utf-8",
                error: function (err) {
                    alert("error: " + JSON.stringify(err));
                },
                success: function (data) {
                    var size = data["d"].length;
                    for (var i = 0 ; i < size; i++) {
                        $("#ddlNumFlavorsIC").append("<option>" + ((String)(data["d"][i].value)) + "</option>");
                    }
                }
            });    
        }
        $("#ddlNumFlavorsIC").on("change", function () {
            NumofFlavorsSelected = parseInt($("#ddlNumFlavorsIC option:selected").text());
            var diff, NumofHiddenDDLs = $("#ddlFlavorContainerIC").children().filter("[class=hide]");
            var ContainerSize = $("#ddlFlavorContainerIC").children().length;
            var NumofShownDDLs = ContainerSize-NumofHiddenDDLs.length;

            if (NumofFlavorsSelected < NumofShownDDLs) {
                diff = 1;
            }
            else {
                diff = 2;
            }
            if (diff == 1) {
                for (var i = NumofShownDDLs - NumofFlavorsSelected ; i > 0; i--) {
                    $($("#ddlFlavorContainerIC").children()[NumofShownDDLs - i]).addClass("hide");
                }
            }
            if (diff == 2) {
                for (i = 0; i < NumofFlavorsSelected; i++) {
                    $($("#ddlFlavorContainerIC").children()[i]).removeClass("hide");
                }
            }
        });
        
        if ($("#ddlFlavorsIC1 option").length < 2) {
            WebServiceURL = "IceWS.asmx";
            $.support.cors = true;
            $.ajax({
                url: WebServiceURL + "/GetFlavors",
                dataType: "json",
                type: "post",
                data: "{ }",
                contentType: "application/json; charset=utf-8",
                error: function (err) {
                    alert("error: " + JSON.stringify(err));
                },
                success: function (data) {
                    var size = data["d"].length;
                    for (var i = 0 ; i < size; i++) {
                        $("#ddlFlavorContainerIC select").append("<option>" + ((String)(data["d"][i].value)) + "</option>");
                    }   
                }
            });
        }

        if ($("#ddlAddOnsIC option").length < 2) {
            WebServiceURL = "IceWS.asmx";
            $.support.cors = true;
            $.ajax({
                url: WebServiceURL + "/GetAddOns",
                dataType: "json",
                type: "post",
                data: "{ }",
                contentType: "application/json; charset=utf-8",
                error: function (err) {
                    alert("error: " + JSON.stringify(err));
                },
                success: function (data) {
                    var size = data["d"].length;
                    for (var i = 0 ; i < size; i++) {
                        $("#ddlAddOnsIC").append("<option>" + ((String)(data["d"][i].value)) + "</option>");
                    }
                }
            });
        }
    });

    //Milkshake popup ddls
    $("#puMilkshake").on("popupafteropen", function (event) {
        if ($("#ddlFlavorsMS1 option").length < 2) {
            WebServiceURL = "IceWS.asmx";
            $.support.cors = true;
            $.ajax({
                url: WebServiceURL + "/GetFlavors",
                dataType: "json",
                type: "post",
                data: "{ }",
                contentType: "application/json; charset=utf-8",
                error: function (err) {
                    alert("error: " + JSON.stringify(err));
                },
                success: function (data) {
                    var size = data["d"].length;
                    for (var i = 0 ; i < size; i++) {
                        $("#ddlFlavorContainerMS select").append("<option>" + ((String)(data["d"][i].value)) + "</option>");
                    }
                }
            });
        }
        if ($("#ddlAddOnsMS option").length < 2) {
            WebServiceURL = "IceWS.asmx";
            $.support.cors = true;
            $.ajax({
                url: WebServiceURL + "/GetAddOns",
                dataType: "json",
                type: "post",
                data: "{ }",
                contentType: "application/json; charset=utf-8",
                error: function (err) {
                    alert("error: " + JSON.stringify(err));
                },
                success: function (data) {
                    var size = data["d"].length;
                    for (var i = 0 ; i < size; i++) {
                        $("#ddlAddOnsMS").append("<option>" + ((String)(data["d"][i].value)) + "</option>");
                    }
                }
            });
        }
    });

    //FrozenYogurt popup ddls
    $("#puFrozenYogurt").on("popupafteropen", function (event) {
        if ($("#ddlSizeFY option").length < 2) {
            WebServiceURL = "IceWS.asmx";
            $.support.cors = true;
            $.ajax({
                url: WebServiceURL + "/GetSizes",
                dataType: "json",
                type: "post",
                data: "{ }",
                contentType: "application/json; charset=utf-8",
                error: function (err) {
                    alert("error: " + JSON.stringify(err));
                },
                success: function (data) {
                    var size = data["d"].length;
                    for (var i = 0 ; i < size; i++) {
                        $("#ddlSizeFY").append("<option>" + ((String)(data["d"][i].value)) + "</option>");
                    }
                }
            });
        }

        if ($("#ddlFlavorsFY1 option").length < 2) {
            WebServiceURL = "IceWS.asmx";
            $.support.cors = true;
            $.ajax({
                url: WebServiceURL + "/GetFlavors",
                dataType: "json",
                type: "post",
                data: "{ }",
                contentType: "application/json; charset=utf-8",
                error: function (err) {
                    alert("error: " + JSON.stringify(err));
                },
                success: function (data) {
                    var size = data["d"].length;
                    for (var i = 0 ; i < size; i++) {
                        $("#ddlFlavorContainerFY select").append("<option>" + ((String)(data["d"][i].value)) + "</option>");
                    }
                }
            });
        }
        if ($("#ddlAddOnsFY option").length < 2) {
            WebServiceURL = "IceWS.asmx";
            $.support.cors = true;
            $.ajax({
                url: WebServiceURL + "/GetAddOns",
                dataType: "json",
                type: "post",
                data: "{ }",
                contentType: "application/json; charset=utf-8",
                error: function (err) {
                    alert("error: " + JSON.stringify(err));
                },
                success: function (data) {
                    var size = data["d"].length;
                    for (var i = 0 ; i < size; i++) {
                        $("#ddlAddOnsFY").append("<option>" + ((String)(data["d"][i].value)) + "</option>");
                    }
                }
            });
        }
    });
    refreshPopups();
});
function InitPopups() {
    $("#ddlSelectProduct").on("change", function () {
        var val = ($('option:selected', this).val());
        switch (val) {
            case "IceCream": { // icecream case
                $("#puIceCream").popup("open");
                break;
            }
            case "Milkshake": { //milkshake case
                $("#puMilkshake").popup("open");
                break;
            }
            case "FrozenYogurt": {//frozen yogurt case
                $("#puFrozenYogurt").popup("open");
                break;
            }
            default: {}
        }
    });
}

function refreshPopups() {
    $("#puIceCream").on("popupafterclose", function (event) {
        $('#puIceCream select.reset').find('option:first').prop('selected', 'selected');
        $('#puIceCream select.reset').selectmenu("refresh", true);
    });
    $("#puMilkshake").on("popupafterclose", function (event) {
        $('#puMilkshake select.reset').find('option:first').prop('selected', 'selected');
        $('#puMilkshake select.reset').selectmenu("refresh", true);
    });
    $("#puIceCream").on("popupafterclose", function (event) {
        $('#puFrozenYogurt select.reset').find('option:first').prop('selected', 'selected');
        $('#puFrozenYogurt select.reset').selectmenu("refresh", true);
    });
}

function calcProductPrice(Size) {
    if (Size == "[]") {
        Cookies.set('Price', '40'); // milkshake only
        return;
    }
    WebServiceURL = "IceWS.asmx";
    $.support.cors = true;
    $.ajax({
        url: WebServiceURL + "/GetSizesPrices",
        dataType: "json",
        type: "post",
        data: "{ }",
        contentType: "application/json; charset=utf-8",
        error: function (err) {
            alert("error: " + JSON.stringify(err));
        },
        success: function (data) {
            var size = data.d.length;
            for (var i = 0; i < size; i += 2) {
                if (data.d[i].value == Size)
                {
                    Cookies.set('Price', data.d[i + 1].value);
                }       
            }
        }
    });
}


// select products ddl
$(document).on("pageinit", "#index", function (event) {
    WebServiceURL = "IceWS.asmx";
    $.support.cors = true;
    $.ajax({
        url: WebServiceURL + "/GetProducts",
        dataType: "json",
        type: "POST",
        data: "{ }",
        contentType: "application/json; charset=utf-8",
        error: function (err) {
            alert("error: " + JSON.stringify(err));
        },
        success: function (data) {
            var size = data["d"].length;
            for (var i = 0 ; i < size; i++) {
                $("#ddlSelectProduct").append("<option value = " + ((String)(data["d"][i].value)) + ">" + ((String)(data["d"][i].value)) + "</option>");
            }
        }
    });
 });

function Cart(param) {
    var cProduct, cNumofFlavors, cSize, cFlavors = [], cAddons; // current product's attr
    switch (param) {
        case 'IC': {
            cProduct = "IceCream";
            cSize = $("#ddlSizeIC option:selected").text();
            cNumofFlavors = parseInt($("#ddlNumFlavorsIC option:selected").text());
            for (var i = 1 ; i <= cNumofFlavors; i++)
                cFlavors[i - 1] = $("#ddlFlavorsIC" + i.toString() + " :selected").text();
            cAddons = $("#ddlAddOnsIC :selected").text();
            break;
        }
        case 'MS': {
            cProduct = "Milkshake";
            cNumofFlavors = 2;
            cSize = "[]";
            for (var i = 1 ; i <= cNumofFlavors; i++)
                cFlavors[i - 1] = $("#ddlFlavorsMS" + i.toString() + " :selected").text();
            cAddons = $("#ddlAddOnsMS :selected").text();
            break;
        }
        case 'FY': {
            cProduct = "FrozenYogurt";
            cNumofFlavors = 4;
            cSize = $("#ddlSizeFY option:selected").text();
            for (var i = 1 ; i <= cNumofFlavors; i++)
                cFlavors[i - 1] = $("#ddlFlavorsFY" + i.toString() + " :selected").text();
            cAddons = $("#ddlAddOnsFY :selected").text();
            break;
        }
        default: { }
    }
    calcProductPrice(cSize);
    $("#puIceCream").popup("close");
    $("#puMilkshake").popup("close");
    $("#puFrozenYogurt").popup("close");
    cPrice = Cookies('Price');
    TotalPrice += parseInt(cPrice);
    var oldBody = Cookies('Body');
    Cookies.set('Body', oldBody + "Product: " + cProduct + ", NumOfFlavors: " + cNumofFlavors +
        ", Size: " + cSize + ", Flavors: " + cFlavors.toString() + ", Addons: " +
        cAddons + ", Price: " + cPrice + "#");
}


//add order to database
function add2db() {
    var Body = Cookies.get('Body');
    alert("This body will be added to DB:\n" + Body + TotalPrice);
    $.ajax({
        url: WebServiceURL + "/submitOrder",
        type: "POST",
        data: {
            "UserEmail": "sheker",
            "FirstName": "kol",
            "LastName": "shehu",
            "PhoneNumber": "012345678",
            "CreditCardNumber": "987654321",
            "DateTime": Date.now,
            "Address": "kfar kassem",
            "Body": tmp + TotalPrice
        },
        error: function (err) {
            alert("error: " + JSON.stringify(err));
        },
        success: function (data) {
            alert("successful");
        }

    });
}







