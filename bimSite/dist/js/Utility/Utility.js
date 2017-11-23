function Guid(g) {

    var arr = new Array(); //存放32位数值的数组
    if (typeof (g) === "string") { //如果构造函数的参数为字符串

        InitByString(arr, g);
    }
    else {

        InitByOther(arr);
    }

    //返回一个值，该值指示 Guid 的两个实例是否表示同一个值。
    this.Equals = function (o) {

        if (o && o.IsGuid) {
            return this.ToString() === o.ToString();
        }
        else {
            return false;
        }
    }

    //Guid对象的标记
    this.IsGuid = function () { }

    //返回 Guid 类的此实例值的 String 表示形式。
    this.ToString = function (format) {

        if (typeof (format) === "string") {
            if (format === "N" || format === "D" || format === "B" || format === "P") {
                return ToStringWithFormat(arr, format);
            }
            else {
                return ToStringWithFormat(arr, "D");
            }
        }
        else {
            return ToStringWithFormat(arr, "D");
        }
    }

    //由字符串加载
    function InitByString(arr, g) {

        g = g.replace(/\{|\(|\)|\}|-/g, "");
        g = g.toLowerCase();
        if (g.length !== 32 || g.search(/[^0-9,a-f]/i) !== -1) {
            InitByOther(arr);
        }
        else {
            for (var i = 0; i < g.length; i++) {
                arr.push(g[i]);
            }
        }
    }

    //由其他类型加载
    function InitByOther(arr) {

        var i = 32;
        while (i--) {
            arr.push("0");
        }
    }

    /*
    根据所提供的格式说明符，返回此 Guid 实例值的 String 表示形式。
    N  32 位： xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    D  由连字符分隔的 32 位数字 xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    B  括在大括号中、由连字符分隔的 32 位数字：{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}
    P  括在圆括号中、由连字符分隔的 32 位数字：(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    */
    function ToStringWithFormat(arr, format) {
        var str = "";
        switch (format) {
            case "N":
                return arr.toString().replace(/,/g, "");
            case "D":
                str = arr.slice(0, 8) + "-" + arr.slice(8, 12) + "-" + arr.slice(12, 16) + "-" + arr.slice(16, 20) + "-" + arr.slice(20, 32);
                str = str.replace(/,/g, "");
                return str;
            case "B":
                str = ToStringWithFormat(arr, "D");
                str = "{" + str + "}";
                return str;
            case "P":
                str = ToStringWithFormat(arr, "D");
                str = "(" + str + ")";
                return str;
            default:
                return new Guid();
        }
    }
}

//Guid 类的默认实例，其值保证均为零。
Guid.Empty = new Guid();

//初始化 Guid 类的一个新实例。
Guid.NewGuid = function () {

    var g = "";
    var i = 32;

    while (i--) {
        g += Math.floor(Math.random() * 16.0).toString(16);
    }

    return new Guid(g);
}


//调用api
function callAPI(module, action, paramObj) {
    var apiUrl = bimConfig.getAPIUrl(module, action);
}

function callAjax(url, method, paramObj, successCallback, fasleCallback, canncelCallback) {

}


var bimConfig = new Object();
var bimAPIClient = new Object();

(function () {
    bimConfig.APIDomainUrl = "http://www.shqhbim.com/bimAPI/api/";
    //bimConfig.APIDomainUrl = "http://localhost:13280/api/";

    bimConfig.getAPIUrl = function (module, action) {
        return bimConfig + module + "/" + action;
    }

})();

var bimCookie = {
    set: function (key, val, time) {//设置cookie方法
        var date = new Date(); //获取当前时间
        var expiresDays = time;  //将date设置为n天以后的时间

        if (!expiresDays) {
            expiresDays = 1;
        }

        date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000); //格式化为cookie识别的时间
        var cookieContent = key + "=" + val + ";expires=" + date.toGMTString();
        document.cookie = key + "=" + val + ";expires=" + date.toGMTString();  //设置cookie
    },
    get: function (key) {//获取cookie方法
        /*获取cookie参数*/
        var getCookie = document.cookie.replace(/[ ]/g, "");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
        var arrCookie = getCookie.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        var tips;  //声明变量tips
        for (var i = 0; i < arrCookie.length; i++) {   //使用for循环查找cookie中的tips变量
            var arr = arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
            if (key === arr[0]) {  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                tips = arr[1];   //将cookie的值赋给变量tips
                break;   //终止for循环遍历
            }
        }

        return tips;
    },
    delete: function (key) { //删除cookie方法
        var date = new Date(); //获取当前时间
        date.setTime(date.getTime() - 10000); //将date设置为过去的时间
        document.cookie = key + "=v; expires =" + date.toGMTString();//设置cookie
    }
}
