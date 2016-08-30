/// <reference path="yepJs.js" />
ajaxLoaderManager = { showLoadDiv: showLoadingDiv, removeLoadDiv: removeLoadingDiv };
const _emptyUser = JSON.stringify({ Email: "", First: "", Last: "", Address: "",Password:"",City:"", _token: "" });
if (Cookies.getJSON("_user") == undefined || Cookies.getJSON("_user") == "null") {

    _user = JSON.parse(_emptyUser);
    Cookies.set("_user", _user);

} else {
  _user = Cookies.getJSON("_user");
}



var _markers = [];
var map;

var defualtErr = function (xhr, errorType, exception) {
  alert("xhr: " + xhr + " errorType:" + errorType + " exception: " + exception);
};

function validateUser(user) {
  if (user.Email != "" && user._token != "") {
    return true;
  }
  return false;
}

$(document).on("pagecreate", "#branches", function () {
    doAjax("GetYepBranches",'', function (data) {
        var list = JSON.parse(data.d);
        //init map
        var long = list.Table[0].Longitude;
        var lat = list.Table[0].Latitude;
        var loc = new google.maps.LatLng(lat, long);
        var $branchesSelect = $('#select-branches');
        var myOptions = {
          zoom: 15,
          center: loc
        };
        map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
        google.maps.event.trigger(map, 'resize');
        map.setZoom(map.getZoom());
        //add branches to select
        for (var i = 0 ; i < list.Table.length; i++) {
          $('<option>').val(list.Table[i].BranchName).text(list.Table[i].BranchName).attr({ Telephone: list.Table[i].Telephone, Manager: list.Table[i].Manager, Weekend: list.Table[i].Weekend, WeekendOpenHours: list.Table[i].WeekendOpenHours, MidWeekOpenHours: list.Table[i].MidWeekOpenHours, MidWeek: list.Table[i].MidWeek, Kosher: list.Table[i].Kosher, Address: list.Table[i].Address, BranchName: list.Table[i].BranchName, Latitude: list.Table[i].Latitude, Longitude: list.Table[i].Longitude }).appendTo($branchesSelect);
            //add markers to map
            _markers.push(new google.maps.Marker({
              position: new google.maps.LatLng(list.Table[i].Latitude, list.Table[i].Longitude),
              map: map,
              title: list.Table[i].Address
            }));
          }

          $branchesSelect.on('change', function () {
            var $selectedItem = $(this).find(":selected");
            map.setCenter(new google.maps.LatLng($selectedItem.attr('Latitude'), $selectedItem.attr('Longitude')));
            $('#txtSelectedBranche').text($selectedItem.attr("branchname") + ": ");
            $('#txtSelectedBranchName').text($selectedItem.attr("branchname"));
            $('#txtSelectedAddress').text($selectedItem.attr("address"));
            $("#iconSelectedKosher").text("");
            if ($selectedItem.attr("kosher").toLowerCase() == "true") {
              $('<span style="margin:0px;margin-left:5px;background-color:#66FF8F;" class="ui-btn ui-shadow ui-corner-all ui-icon-check ui-btn-icon-notext"></span>').appendTo($("#iconSelectedKosher"))
            }
            else {
              $('<span style="margin:0px;margin-left:5px;background-color:pink;" class="ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext"></span>').appendTo($("#iconSelectedKosher"))
            }
            $("#txtMidWeek").text($selectedItem.attr('midweek')).addClass('color-text-gray');
            $('#txtMidWeekOpenHours').text($selectedItem.attr('midweekopenhours')).addClass('color-text-gray');
            $("#txtWeekend").text($selectedItem.attr('weekend')).addClass('color-text-gray');
            $('#txtWeekendOpenHours').text($selectedItem.attr('weekendopenhours')).addClass('color-text-gray');
            $('#txtManager').text($selectedItem.attr('manager')).addClass('color-text-gray');
            $('#txtTelephone').text($selectedItem.attr('telephone')).addClass('color-text-gray');
          });
          $branchesSelect.val($branchesSelect.children().first().attr('value')).change();
        }
        , defualtErr);
}); //this function handle branches page

$(document).one('pagebeforecreate', function () {
  var panel = buildMenu();
  var popup = buildPopup();
  $.mobile.pageContainer.prepend(panel);
  $.mobile.pageContainer.prepend(popup);
  $("#signIn").popup().enhanceWithin();
  $("#signIn #btnLogin").on("tap", sendLogin);
  $("#menu").panel().enhanceWithin();
    sliderStart('#myorders');// init slider
    sliderStart('#index');// init slider
    sliderStart('#branches');// init slider


}); //this function is dynamiclly define the panel menu 

$(document).on("pageshow", "#index", function (event) {
    $('#index' + ' .menuLink').attr('href', '#menu'); // bind menu button
    setMenu("index", _user); // init menu
}); //init index page

$(document).on("pageshow", "#branches", function (event) {
    $('#Branches' + ' .menuLink').attr('href', '#menu');// bind menu button
    setMenu('branches', _user); // init menu
}); // init branches page

$(document).on("pageshow", "#myorders", function (event) {
  if (!validateUser(_user)) {
    $.mobile.changePage('#index');
  }
  else {
        $('#myorders' + ' .menuLink').attr('href', '#menu');// bind menu button
        setMenu('myorders', _user); // init menu
        fillUserOrders(_user);//fill data
        $("#myOrdersListCollapsible").collapsibleset("refresh"); // refresh collapsible
      }
}); // init myorders page


function buildPopup() {

  var string;
  string = $('<div>').attr({ 'data-role': 'popup', 'data-history': 'false', id: 'signIn', 'class': "ui-corner-all", 'data-position-to': 'window', 'data-transition': "turn" })
  .html(
    $('<div>').attr({ class: 'myPop' })
    .html($('<h3>').text('Please sign in'))
    .append(
      $('<label>').attr({ for: "txtLoginUserName", class: "ui-hidden-accessible" }).text('User Name: ')
      )
    .append(
      $('<div>').append($('<input>').attr({ type: "text", name: "txtLoginUserName", id: "txtLoginUserName", placeholder: 'username', 'data-theme': "a" })).append($('<p>').text('* User Name is required.').attr({id:'errUsername',class:"errLogIn"}).hide())
      )
    .append(
      $('<label>').attr({ for: "txtUserPassword", class: "ui-hidden-accessible" }).text('Password: ')
      )
    .append(
      $('<div>').append($('<input>').attr({ type: "password", name: "txtLoginPassword", id: "txtLoginPassword", placeholder: "password", 'data-theme': "a" })).append($('<p>').text('* Password is required.').attr({id:'errPassword',class:"errLogIn"}).hide())
      )
    .append(
      $('<div>').attr({class:'loginDiv'}).html(
        $('<a>').attr({ id: "btnLogin", class: "ui-btn Mybtn" }).text('Sign In')
        )
        .append(
            $('<label>').attr({ for: "txtUserPassword", class: "ui-hidden-accessible" }).text('Password: ')
            )
        .append(
            $('<div>').append($('<input>').attr({ type: "password", name: "txtLoginPassword", id: "txtLoginPassword", placeholder: "password", 'data-theme': "a" })).append($('<p>').text('* Password is required.').attr({id:'errPassword',class:"errLogIn"}).hide())
            )
        .append(
            $('<a>').attr({ id: "btnLogin", class: "ui-btn Mybtn" }).text('Sing In')
            ).append(buildSingUpForm())
            )).prop('outerHTML');
   
    //string = '<div data-role="popup" data-history="false" id="signIn" class="ui-corner-all" data-position-to="window" data-transition="turn">' +
    //   '' +
    //       ' <div class="myPop">' +
    //           ' <h3>Please sign in</h3>' +
    //           ' <label for="txtLoginUserName" class="ui-hidden-accessible">Username:</label>' +
    //            '<input type="text" name="txtLoginUserName" id="txtLoginUserName" value="" placeholder="username" data-theme="a" />' +
    //            '<label for="txtUserPassword" class="ui-hidden-accessible">Password:</label>' +
    //            '<input type="password" name="txtLoginPassword" id="txtLoginPassword" value="" placeholder="password" data-theme="a" />' +
    //            '<a id="btnLogin"class="ui-btn Mybtn">Sign in</a>' +
    //        '</div>' +
    //    '' +
    //'</div>';


    return string;
} //this function return popup as string

function istAjaxValidateRequest(func, user) {
    var res = false;
    if (func == null || "" == func) {
        return false;
    }
    if (func == "GetYepBranches") {
        return true;
    }
    if (func == "returnSession" && user.Email != "" && user.Password != "") {
        return true;
    }
    if (validateUser(user)) {
        return true;
    }

    return false;
}

function doAjax(webService, _data, _function, _functionError) {
    if (istAjaxValidateRequest(_data.func, _data.user)) {
        _data.user = JSON.stringify(_data.user);
        _data = JSON.stringify(_data);
        var WebServiceURL = "IceWS.asmx";//"http://proj.ruppin.ac.il/cegroup3/prod/IceWS.asmx";//
        $.support.cors = true;
        $.ajax({
            url: WebServiceURL + '/' + webService,
            dataType: "json",
            type: "POST",
            data: _data,
            contentType: "application/json; charset=utf-8",
            error: _functionError,
            beforeSend: ajaxLoaderManager.showLoadDiv($('.ui-page-active')),
            success: function (data) { ajaxLoaderManager.removeLoadDiv($('.ui-page-active')); _function(data); }
        });
    }

}

function setMenu(pageId, _user) {
  if (_user != undefined && _user.Email != "" && _user._token != "") {
    logOnFillDisplay();
    $('#containerStatusBar').attr({ class: 'ui-grid-a' }).html($("<div>").attr({ class: 'ui-block-a', id: 'conUserName' })).append($('<div>').attr({ class: 'ui-block-b', id: "conStatus" }));
    $("#conUserName").html($('<a data-role="button" >').addClass(" ui-btn leftStatusBarBtn").text(_user.First).buttonMarkup());
    $("#conStatus").html($('<a data-role="button" id="btnLogOut">').addClass(" ui-btn rightStatusBarBtn").text('Log Out').buttonMarkup());
    $('#btnLogOut').on('tap', _LogOut);
  }
  else {
    $('#statusBar').parent().attr("style", "padding:0px;");
    $('#containerStatusBar').attr('class', 'ui-grid-solo').html($("<div>").attr({ class: 'ui-block-a', id: 'conStatus' }));
    $('#conStatus').html($("<a>").attr({ 'data-rel': 'popup', href: '#signIn', 'data-role': "button" }).addClass("ui-btn btnSignIn").text("Log In/Sign In").buttonMarkup());
  }
  $("#menu li").each(function () {
    var link = $(this).find("a");
    var liId = $(this).attr('id');
    if (liId != undefined && liId != "") {
      if (liId.toLowerCase() == pageId) {
        $(this).attr('data-role', 'list-divider');
        link.attr('class', 'ui-btn');
      }
      else {
        link.attr('href', '#' + liId.toLowerCase());
        $(this).removeAttr("data-role").removeAttr('class', '');
        link.attr('class', 'ui-btn ui-btn-icon-right ui-icon-carat-r');
      }
    }

    $("#menu li").each(function () {
        var currentLi = $(this);
        var link = currentLi.find("a");
        var liId = currentLi.attr('id');
        if (liId != undefined && liId != "") {
            if (liId.toLowerCase() == pageId) {
                currentLi.attr('data-role', 'list-divider');
                link.attr('class', 'ui-btn');
            }
            else {
                // if (!validateUser(_user) && !currentLi.hasClass('roleLi')) {
                link.attr('href', '#' + liId.toLowerCase());
                $(this).removeAttr("data-role").removeAttr('class', '');
                link.attr('class', 'ui-btn ui-btn-icon-right ui-icon-carat-r');
                // }
            }
        }
    });
    $("#menuList").listview("refresh");
    $("#statusBar").parent().attr("class", "no-margin"); //fix statusBar size

} // this function recive a pageId and init the menu by this page id.

function sendLogin() {
  var _func = "returnSession";
  _user.Email = $('#txtLoginUserName').val();
  _user.Password = $('#txtLoginPassword').val();
  if (validateLogIn(_user)) {
    doAjax("DoAjax", { "func": _func , "user": _user }, setSession, defualtErr);
  }
} //event when Login btn tapped.

function setSession(data) {
    data = JSON.parse(data.d);
    _user.Password = "";
    _user._token = data.Table[0].SessionID;
    _user.First = data.Table[0].FirstName;
    _user.Last = data.Table[0].LastName;
    _user.Address = data.Table[0].Address;
    _user.Email = data.Table[0].Email;
    Cookies.set("_user", _user, { expires: 1, path: '/' });
    //fillUserOrders(_user); <- Is this nessesery?
    $.mobile.changePage('#index', { reloadPage: true });

} //this function return at login = success.

function logOutRemoveDisplay() {
    $('#myOrdersListCollapsible').html(""); //init myorders page
    var removeList = $("#menuList [hasrole=roleLi]"); //delete all user role Li
    for (var i = 0 ; i < removeList.length ; i++) {
      removeList[i].hide();
    }
  }
  function logOnFillDisplay() {
    //TODO: open "CLOSED" section in menu, Fill user orders
    if ($('#menuList #MYORDERS').length == 0) {
      $("#menuList").append($('<li id="MYORDERS">').attr({class: 'roleLi'}).html($("<a>").attr({ href: "#myorders" }).addClass("ui-btn ui-btn-icon-right ui-icon-carat-r").text("My Orders")));
    }
    else{
      $('li [id=MYORDERS]').show();
    }
    //fillUserOrders(_userID,_token); ? is this belong here?
    //doAjax(getUserOrders)<- TODO: display orders section 
} // this function will bulid the dinamyc part of the app like: myorders,makeorder and futhure app.

function fillUserOrders(user) {
    //doAjax get orders and fill the data.
    var _func = "getUserOrders";
    if ($('#myOrdersListCollapsible').html().trim() == "") {
        doAjax('DoAjax', { func: _func, user: user },
            function (data) {
                data = JSON.parse(data.d);
                data = data.Table;
                var $ordersCollapsible = $('#myOrdersListCollapsible');
                $ordersCollapsible.html("");
                for (var i = 0 ; i < data.length ; i++) {
                    //var pText = 'Id: ' + data[i].Id + "<br/>" + "First Name: " + data[i].FirstName + ", Last Name:" + data[i].LastName + "<br/>" + "Telephone: " + data[i].PhoneNumber + ", Date & Time: " + data[i].DateTime + "<br/>" + data[i].Address;
                    var temp = $('<div>').attr({ class: 'ui-grid-a' });

                    $.each(data[i], function (i, n) {
                        temp.append($('<div>').attr({ class: 'ui-block-a' }).text(i + ':')).append($('<div>').attr('class', 'ui-block-b').text(n));
                    });
                    var hText = "Order Id. " + $('<span class="colored-text">').text(data[i].Id).prop('outerHTML') + $('<span class="data-spacer">').prop('outerHTML') + "Date: " + $('<span class="colored-text">').text(data[i].DateTime).prop('outerHTML');
                    $ordersCollapsible.append($("<div>").attr({ 'data-role': 'collapsible' }).html($("<h2>").html(hText)).append($("<div>").attr({ class: 'ui-grid-a' }).html(temp.prop('outerHTML'))));
                }
                $("#myOrdersListCollapsible").collapsibleset("refresh"); // refresh collapsible
            }, defualtErr);
    }
} //this function manage ths myorders page data.

function validateLogIn(user) {
  var res = true;
  if (user.Email == "" || user.Email == undefined) {
    $('#errUsername').show();   
    $('#txtLoginUserName').addClass('txtBoxErr'); 
    res = false;
  }
  else{
    $('#errUsername').hide();
    $('#txtLoginUserName').removeClass('txtBoxErr'); 

  }      
  if (user.Password == "" || user.Password == undefined){
    $('#errPassword').show();   
    $('#txtLoginPassword').addClass('txtBoxErr');     
    res = false;
  } 
  else{
    $('#errPassword').hide();       
    $('#txtLoginPassword').removeClass('txtBoxErr'); 

  }
  return res;
} //this function validate text box in Login page

function buildMenu() {
    //cheching vars        $('#statusBar').html($('<div id="containerStatusBar" class="ui-grid-a">'));
    var string = '';
    //prepering code
    string = $('<div>').attr({ 'data-role': 'panel', id: "menu", 'data-position': "right", 'data-display': "push" }).html(
      $('<ul>').attr({ 'data-role': "listview", id: "menuList" }).html(
        $('<li>').html($('<div>').attr({ id: 'statusBar' }).html($('<div>').attr({ id: 'containerStatusBar' }))).prop('outerHTML')).append(
        $('<li>').attr({ id: 'INDEX' }).html($('<a>').text('Home')).prop('outerHTML')).append(
        $('<li>').attr({ id: 'BRANCHES' }).html($('<a>').text('Branches')).prop('outerHTML'))).prop('outerHTML');
    return string;
}//this function return a menu as string

function sliderStart(pageIdWithHash) {
  var $thisPage = pageIdWithHash;
  $($thisPage + ' .mySlide > div:gt(0)').hide();

  setInterval(function () {
    var $firstDiv = $($thisPage + ' .mySlide > div:first');
    $firstDiv.fadeOut(1000);
    $firstDiv.next().fadeIn(1000, function () {
      $firstDiv.appendTo($thisPage + ' .mySlide');
    });
  }, 3000);
} // func recive page id and init its slider.

function _LogOut() {
    //restart app
    //Cookies.remove('_user');
    _user = JSON.parse(_emptyUser);
    Cookies.remove("_user");
    logOutRemoveDisplay();
    $.mobile.changePage('#index', { reloadPage: true });
} // this return app to wait login state

function showLoadingDiv(element) {
    element.append($("<div>").attr({ id: 'fadeLoadingDiv', class: 'fadeLoadingDiv' })).append($("<div>").attr({ id: 'modelLoadingDiv', class: 'modelLoadingDiv' }).append($('<img>').attr({ src: 'images/loading.gif' })));
}

function removeLoadingDiv(element) {
    element.find('#modelLoadingDiv').remove();
    element.find('#fadeLoadingDiv').remove();
}

function buildSingUpForm() {
    var string = $('<div>').attr({class:'ui-grid-a'}).append(
        $('<div>').attr({ class: "ui-block-a" }).html(buildBlock('UserName','text','true','User Name','signInBlock'))).
        append(
        $('<div>').attr({ class: 'ui-block-b' }).html(buildBlock('LastName', 'text', 'true', 'Last Name', 'signInBlock'))).
        append(
        $('<div>').attr({ class: "ui-block-a" }).html(buildBlock('Email', 'text', 'true', 'Email', 'signInBlock'))).
        append(
        $('<div>').attr({ class: 'ui-block-b' }).html(buildBlock('Password', 'text', 'true', 'Password', 'signInBlock'))).
        append(
        $('<div>').attr({ class: "ui-block-a" }).html(buildBlock('City', 'text', 'true', 'City', 'signInBlock'))).
        append(
        $('<div>').attr({ class: 'ui-block-b' }).html(buildBlock('Address', 'text', 'true', 'Address', 'signInBlock'))).
        //append($('<div class="ui-grid-solo">').html($('<div class="ui-block-a">').html(buildBlock('SignInBtn', 'button', 'false','', 'signInBlock')))).
        prop('outerHTML');
    return string;
}
function buildBlock(id, inputType, isMinified,label,_class) {
    var addLabel = "";
    if (label != '') {
        '<label  id="lbl' + id + '" for="blk' + id + '">' + label + '</label>';
    }
    return '<div class="'+_class+'">'+addLabel+'<input id=blk"'+id+'" name="blk'+id+'" type="'+inputType+'" data-mini="'+isMinified+'"></input></div>';

}