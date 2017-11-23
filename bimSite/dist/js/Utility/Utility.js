function Guid(g) {

    var arr = new Array(); //���32λ��ֵ������
    if (typeof (g) === "string") { //������캯���Ĳ���Ϊ�ַ���

        InitByString(arr, g);
    }
    else {

        InitByOther(arr);
    }

    //����һ��ֵ����ֵָʾ Guid ������ʵ���Ƿ��ʾͬһ��ֵ��
    this.Equals = function (o) {

        if (o && o.IsGuid) {
            return this.ToString() === o.ToString();
        }
        else {
            return false;
        }
    }

    //Guid����ı��
    this.IsGuid = function () { }

    //���� Guid ��Ĵ�ʵ��ֵ�� String ��ʾ��ʽ��
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

    //���ַ�������
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

    //���������ͼ���
    function InitByOther(arr) {

        var i = 32;
        while (i--) {
            arr.push("0");
        }
    }

    /*
    �������ṩ�ĸ�ʽ˵���������ش� Guid ʵ��ֵ�� String ��ʾ��ʽ��
    N  32 λ�� xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    D  �����ַ��ָ��� 32 λ���� xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    B  ���ڴ������С������ַ��ָ��� 32 λ���֣�{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}
    P  ����Բ�����С������ַ��ָ��� 32 λ���֣�(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
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

//Guid ���Ĭ��ʵ������ֵ��֤��Ϊ�㡣
Guid.Empty = new Guid();

//��ʼ�� Guid ���һ����ʵ����
Guid.NewGuid = function () {

    var g = "";
    var i = 32;

    while (i--) {
        g += Math.floor(Math.random() * 16.0).toString(16);
    }

    return new Guid(g);
}


//����api
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
    set: function (key, val, time) {//����cookie����
        var date = new Date(); //��ȡ��ǰʱ��
        var expiresDays = time;  //��date����Ϊn���Ժ��ʱ��

        if (!expiresDays) {
            expiresDays = 1;
        }

        date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000); //��ʽ��Ϊcookieʶ���ʱ��
        var cookieContent = key + "=" + val + ";expires=" + date.toGMTString();
        document.cookie = key + "=" + val + ";expires=" + date.toGMTString();  //����cookie
    },
    get: function (key) {//��ȡcookie����
        /*��ȡcookie����*/
        var getCookie = document.cookie.replace(/[ ]/g, "");  //��ȡcookie�����ҽ���õ�cookie��ʽ����ȥ���ո��ַ�
        var arrCookie = getCookie.split(";")  //����õ�cookie��"�ֺ�"Ϊ��ʶ ��cookie���浽arrCookie��������
        var tips;  //��������tips
        for (var i = 0; i < arrCookie.length; i++) {   //ʹ��forѭ������cookie�е�tips����
            var arr = arrCookie[i].split("=");   //������cookie��"�Ⱥ�"Ϊ��ʶ��������cookie����Ϊarr����
            if (key === arr[0]) {  //ƥ��������ƣ�����arr[0]��ָ��cookie���ƣ������������Ϊtips��ִ���ж�����еĸ�ֵ����
                tips = arr[1];   //��cookie��ֵ��������tips
                break;   //��ֹforѭ������
            }
        }

        return tips;
    },
    delete: function (key) { //ɾ��cookie����
        var date = new Date(); //��ȡ��ǰʱ��
        date.setTime(date.getTime() - 10000); //��date����Ϊ��ȥ��ʱ��
        document.cookie = key + "=v; expires =" + date.toGMTString();//����cookie
    }
}
