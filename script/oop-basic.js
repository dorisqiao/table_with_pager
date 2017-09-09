/**
 * Created by doris on 2017/9/1.
 */

var doris = window.doris || {};

doris.basic = doris.basic || {};
doris.ajax = doris.ajax || {};

// define Interface constructor.
doris.basic.Interface = function(name, methods) {
    if(arguments.length != 2) {
        throw new Error("Interface constructor called with " + arguments.length +
            "arguments, but expected exactly 2.");
    }
    this.name = name;
    this.methods = [];
    for(var i = 0, len = methods.length; i < len; i++) {
        if(typeof methods[i] !== 'string') {
            throw new Error("Interface constructor expects method names to be "
                + "passed in as a string.");
        }
        this.methods.push(methods[i]);
    }
};

// Static function to ensure an obj implements all the methods in the interface.
doris.basic.ensureImplements = function(object) {
    if (arguments.length < 2) {
        throw new Error("Function Interface.ensureImplements called with " +
            arguments.length + "arguments, but expected at least 2.");
    }
    for (var i = 1, len = arguments.length; i < len; i++) {
        var interface = arguments[i];
        if (interface.constructor !== Interface) {
            throw new Error("Function Interface.ensureImplements expects arguments"
                + "two and above to be instances of Interface.");
        }
        for (var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
            var method = interface.methods[j];
            if (!object[method] || typeof object[method] !== 'function') {
                throw new Error("Function Interface.ensureImplements: object "
                    + "does not implement the " + interface.name
                    + " interface. Method " + method + " was not found.");
            }
        }
    }
};

// Static function for classical inheritance.
doris.basic.extend = function (subClass, superClass) {
    var F = function() {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    subClass.superclass = superClass.prototype;
    if(superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
};

// Static function for prototypal inheritance.
doris.basic.clone = function (object) {
    function F() {}
    F.prototype = object;
    return new F;
};

// Static function for xhrObj.
doris.ajax.createXhrObject = function(){
    var methods = [
        function() { return new XMLHttpRequest(); },
        function() { return new ActiveXObject('Msxml2.XMLHTTP'); },
        function() { return new ActiveXObject('Microsoft.XMLHTTP'); }
    ];
    for(var i = 0, len = methods.length; i < len; i++) {
        try {
            methods[i]();
        }
        catch(e) {
            continue;
        }
        // If reach this point, method[i] worked.
        doris.ajax.createXhrObject = methods[i]; // Memoize the method.
        return methods[i]();
    }
    // If reach this point, none of the methods worked.
    throw new Error('createXhrObject: Could not create an XHR object.');
};

// Static function for Ajax request.
doris.ajax.request = function(method, url, callbackObj, postVars) {
    var xhr = this.createXhrObject();
    xhr.onreadystatechange = function() {
        if(xhr.readyState !== 4) return;
        (xhr.status === 200) ?
            callbackObj.success(xhr.responseText, xhr.responseXML) :
            callbackObj.failure(xhr.status);
    };
    xhr.open(method, url, true);
    if(method !== 'POST') postVars = null;
    xhr.send(postVars);
};





