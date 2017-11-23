

function intiPage(pageName) {

    //checkLogin();

    window.pageName = pageName || "";

    var moduleID = jQuery.queryString('moduleID');
    switch (moduleID) {
        case '1':
            currentPage = '质量';
            moduleName = 'zhiliang';
            break;
        case '2':
            currentPage = '安全';
            moduleName = 'anquan';
            break;
        case '3':
            currentPage = '进度';
            moduleName = 'jindu';
            break;
        case '4':
            currentPage = '材料';
            moduleName = 'cailiao';
            break;
        default:
            currentPage = '质量';
            moduleName = 'zhiliang';
            moduleID = 1;
            break;
    }

    $('.in').removeClass('in');
    $('.active').removeClass('active');

    $('.nav-second-level').each(function (index, element) {
    //$('#side-menu li').each(function (index, element) {

        var childrenLi = $(element).children();

        $(childrenLi).each(function( i, el){
            var subUL = $(el).find('.nav-third-level');
            if (subUL) {
                $(el).hover(
                   function (e) {
                       //in
                       console.log(111);

                       subUL.attr('style', '');

                       $('.nav-third-level').removeClass('in');
                       subUL.addClass('in');

                       //if (window.selectedLI) {                 
                       //    $(window.selectedLI).addClass('in');
                       //}

                       e.stopPropagation();    //这
                   }, function (e) {
                       //out
                       console.log(222);

                       subUL.removeClass('in');
                       e.stopPropagation();    //这
                   }
                );
            }

            $(el).bind('click', function () {
                window.selectedLI = el;
            });
        });        
    });
 
    var moduleItem = $('#li_' + moduleID);
    var ul = moduleItem.find('ul');
    ul.addClass('in');

    if (document.location.href.indexOf('video') >= 0) {
        $(ul.children()[2]).find('a').addClass('active');
    }
    else if (document.location.href.indexOf('files') >= 0) {
        $(ul.children()[1]).find('a').addClass('active');
    }
    else if (document.location.href.indexOf('models') >= 0) {
        $(ul.children()[0]).find('a').addClass('active');
    }

    $('#li_loginout').bind('click', function (event) {

        console.log(' click loginout ');
        loginout();
    });

    if (!window.userInfo) {
        var jsonStr = bimCookie.get('userInfo');
        if (jsonStr) {
            window.userInfo = JSON.parse(jsonStr);
        }
    }
 
    setPageFunction();
    GetPageRole();
}

function setPageFunction() {
    if (window.userInfo) {
        if (window.userInfo.UserRole && window.userInfo.UserRole.ModuleList) {
            var module = undefined;
            for (var i = 0; i < window.userInfo.UserRole.ModuleList.length; i++) {
                if (moduleName.toLowerCase() === window.userInfo.UserRole.ModuleList[i].Module.toLowerCase()) {
                    module = window.userInfo.UserRole.ModuleList[i];
                    break;
                }
            }

            if (module && module.PageList) {
                for (var i = 0; i < module.PageList.length; i++) {
                    if (window.pageName.toLowerCase() === module.PageList[i].Page.toLowerCase()) {
                        window.userInfo.CanAdd = module.PageList[i].FunctionList[0].CanAdd;
                        window.userInfo.CanUpdate = module.PageList[i].FunctionList[0].CanUpdate;
                        window.userInfo.CanDelete = module.PageList[i].FunctionList[0].CanDelete;
                        break;
                    }
                }
            }
            else {
                window.userInfo.CanAdd = true;
                window.userInfo.CanUpdate = false;
                window.userInfo.CanDelete = false;
            }
        }
    }
}

function checkLogin() {

    var jsonStr = bimCookie.get('userInfo');
    if (!jsonStr) {
        document.location.href = "login.html";
    }

    $.ajax({
        url: bimConfig.APIDomainUrl + 'video/CheckLogin',
        type: 'POST', //GET
        async: true,    //或false,是否异步
        data: {
            ticket: bimCookie.get('ticket')
        },
        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        beforeSend: function (xhr) {
            console.log(xhr)
            console.log('发送前')
        },
        success: function (data, textStatus, jqXHR) {
            if (data) {

                var obj = JSON.parse(data);
                if (obj && !obj.Result) {
                    //document.location.href = "login.html";

                    console.log('loginOut');
                }
            }
        },
        error: function (xhr, textStatus) {
            console.log('错误')
            console.log(xhr)
            console.log(textStatus)
        },
        complete: function () {
            console.log('结束')
        }
    });
}

function loginout() {
    $.ajax({
        url: bimConfig.APIDomainUrl + 'video/Loginout',
        type: 'POST', //GET
        async: true,    //或false,是否异步
        data: {
            ticket: bimCookie.get('ticket')
        },
        timeout: 15000,    //超时时间
        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        beforeSend: function (xhr) {
            console.log(xhr)
            console.log('发送前')
        },
        success: function (data, textStatus, jqXHR) {
            if (data) {

                var obj = JSON.parse(data);
                if (obj && obj.Result) {
                    document.location.href = "login.html";
                }
            }
        },
        error: function (xhr, textStatus) {
            console.log('错误')
            console.log(xhr)
            console.log(textStatus)
        },
        complete: function () {
            console.log('结束')
        }
    });
}

function GetPageRole() {

    var pageID = jQuery.queryString('pageID');
    var jsonStr = bimCookie.get('userInfo');
    var userInfo = undefined;
   
    if (jsonStr) {
        
        var userInfo = JSON.parse(jsonStr);
        if (!userInfo.UserRole[pageID]) {
            $.ajax({
                url: bimConfig.APIDomainUrl + 'video/CheckPageRole',
                type: 'POST', //GET
                async: true,    //或false,是否异步
                data: {
                    userID: userInfo.UserID,
                    pageID: pageID
                },
                dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text      
                success: function (data, textStatus, jqXHR) {
                    if (data) {

                        var obj = JSON.parse(data);
                        if (obj && obj.PageID > 0) {
                            //document.location.href = "login.html";

                            userInfo.UserRole[obj.PageID] = obj;
                            bimCookie.set("userInfo", JSON.stringify(userInfo));
                        }
                    }
                },
                error: function (xhr, textStatus) {
                    console.log('错误')
                    console.log(xhr)
                    console.log(textStatus)
                },
                complete: function () {
                    console.log('结束')
                }
            });
        }      
    }

    return null;
}