if (!jQuery.queryString) {
    jQuery.queryString = function (query) {
        var search = window.location.search + '';
        if (search.charAt(0) != '?') {
            return undefined;
        }
        else {
            search = search.replace('?', '').split('&');
            for (var i = 0; i < search.length; i++) {
                if (search[i].split('=')[0] == query) {
                    return decodeURI(search[i].split('=')[1]);
                }
            }
            return undefined;
        }
    };
}

