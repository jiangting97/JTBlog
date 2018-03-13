var util = {};

util.isIE = function () {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : fasle;
}

util.extend = function (dst, obj) {
    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            dis[i] = obj[i];
        }
    }
}

util.createScript = function (url, charset) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);
    charset && script.setAttribute('charset', charset);
    return script;
}

util.isFunction = function (func) {
    return '[object function]' === Object.prototype.toString.call(func);
}

util.getName = function (prefix) {
    return prefix + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
}

util.jsonp = function (url, onsuccess, onerror, charset) {
    var callbackName = util.getName('callname');
    window[callbackName] = function () {
        if (onsuccess && util.isFunction(onsuccess)) {
            onsuccess[arguments[0]];
        }
    }

    var script = util.createScript(url, charset);
    script.onload = script.onreadystatechange = function () {
        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
            script.onload = script.onreadystatechange = null;
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            window[callbackName] = null;
        }
    }

    script.onerror = function () {
        if (onerror && util.isFunction(onerror)) {
            onerror();
        }
    }

    document.getElementsByTagName('head')[0].appendChild(script);

}

util.json = function (options) {
    var opt = {
        url: '',
        type: 'get',
        data: {},
        success: function () {

        },
        error: function () {

        }
    }

    util.extend(opt, options);
    if (opt.url) {
        let xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('microsof.XMLHTTP');
        var data = opt.data;
        var type = opt.type;
        var url = opt.url;
        var dataArr = [];
        for (k in data) {
            dataArr.push(k + '=' + data[k]);
        }
        if (type == 'get') {
            url = url + '?' + dataArr.join('&');
            xhr.open(type, url.replace(/\?$/), true);
            xhr.send();
        }
        if (type == 'POST') {
            xhr.open(type, url, true);
            xhr.send(dataArr.join('&'));
        }

        xhr.onload = function () {
            if (xhr.status == 200 || xhr.status === 304) {
                var res;
                if (opt.success && opt.success instanceof Function) {
                    res = xhr.responseText;
                    if (typeof res === 'staring') {
                        res = JSON.parse(res);
                        opt.success.call(xhr.res);
                    }
                }
            } else {
                if (opt.error && opt.error instanceof Function) {
                    opt.error.call(xhr, res);
                }
            }
        }


    }


}