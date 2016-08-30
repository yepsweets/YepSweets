

$(document).on("pagecreate", "#index", function (event) {
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
            default: {

            }
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
        //add FY order to db
        $("#Add2CartFY").click(function () {
            var size = $("#ddlSizeFY :selected").text();
            var FlavorsArray = [];
            for (var i = 1 ; i <= 4; i++) {
                FlavorsArray[i - 1] = $("#ddlFlavorsFY" + i.toString() + " :selected").text();
            }
            var addOn = $("#ddlAddOnsFY :selected").text();
            $.ajax({
                url: WebServiceURL + "/submitOrder",
                type: "POST",
                data: {
                    "UserEmail": _user.UserEmail,
                    "FirstName": _user.FirstName,
                    "LastName": _user.LastName,
                    "PhoneNumber": _user.PhoneNumber,
                    "CreditCardNumber": _user.CreditCardNumber,
                    "DateTime": Date.now,
                    "Address": _user.Address,
                    "Body": "Product:FrozenYogurt,Size:"+size.toString()+",Flavors:" + FlavorsArray.toString() + ",Addons:" + addOn.toString()
                },
                error: function (err) {
                    alert("error: " + JSON.stringify(err));
                },
                success: function (data) {
                    alert("successful");
                }

            });
        });
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
        //add MS order to db
        $("#Add2CartMS").click(function () {
            var FlavorsArray = [];
            for (var i = 1 ; i <= 2; i++) {
                FlavorsArray[i - 1] = $("#ddlFlavorsMS" + i.toString() + " :selected").text();
            }
            var addOn = $("#ddlAddOnsMS :selected").text();
            $.ajax({
                url: WebServiceURL + "/submitOrder",
                type: "POST",
                data: {
                    "UserEmail": _user.UserEmail,
                    "FirstName": _user.FirstName,
                    "LastName": _user.LastName,
                    "PhoneNumber": _user.PhoneNumber,
                    "CreditCardNumber": _user.CreditCardNumber,
                    "DateTime": Date.now,
                    "Address": _user.Address,
                    "Body": "Product:Milkshake,Flavors:" + FlavorsArray.toString() + ",Addons:" + addOn.toString()
                },
                error: function (err) {
                    alert("error: " + JSON.stringify(err));
                },
                success: function (data) {
                    alert("successful");
                }

            });
        });
    });


    //Ice cream popup ddls
    $("#puIceCream").on("popupafteropen", function (event) {
        var NumofFlavorsSelected;
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
        //add IC order to db
        $("#Add2CartIC").click(function () {
            var FlavorsArray = [];
            var numFlavors = $("#ddlNumFlavorsIC :selected").text();
            for (var i = 1 ; i <= numFlavors; i++) {
                 FlavorsArray[i-1] = $("#ddlFlavorsIC" + i.toString()+ " :selected").text();
            }
            var addOn = $("#ddlAddOnsIC :selected").text();
            $.ajax({
                url: WebServiceURL + "/submitOrder",
                type: "POST",
                data: {
                    "UserEmail": _user.UserEmail,
                    "FirstName": _user.FirstName,
                    "LastName": _user.LastName,
                    "PhoneNumber": _user.PhoneNumber,
                    "CreditCardNumber": _user.CreditCardNumber,
                    "DateTime": Date.now,
                    "Address": _user.Address,
                    "Body": "Product:IceCream,NumberofFlavors:"+numFlavors.toString()+",Flavors:"+FlavorsArray.toString()+",Addons:"+addOn.toString()
                },
                error: function (err) {
                    alert("error: " + JSON.stringify(err));
                },
                success: function (data) {
                    alert("successful");
                }

            });
        });
    });

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
});


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







