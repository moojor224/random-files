
'use strict';
/*globals Promise */

var JSZipUtils = {};

// taken from jQuery
function createStandardXHR() {
    try {
        return new window.XMLHttpRequest();
    } catch( e ) {}
}

function createActiveXHR() {
    try {
        return new window.ActiveXObject("Microsoft.XMLHTTP");
    } catch( e ) {}
}

// Create the request object
var createXHR = (typeof window !== "undefined" && window.ActiveXObject) ?
    /* Microsoft failed to properly
     * implement the XMLHttpRequest in IE7 (can't request local files),
     * so we use the ActiveXObject when it is available
     * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
     * we need a fallback.
     */
    function() {
    return createStandardXHR() || createActiveXHR();
} :
    // For all other browsers, use the standard XMLHttpRequest object
    createStandardXHR;


/**
 * @param  {string} path    The path to the resource to GET.
 * @param  {function|{callback: function, progress: function}} options
 * @return {Promise|undefined} If no callback is passed then a promise is returned
 */
JSZipUtils.getBinaryContent = function (path, options) {
    var promise, resolve, reject;
    var callback;

    if (!options) {
        options = {};
    }

    // backward compatible callback
    if (typeof options === "function") {
        callback = options;
        options = {};
    } else if (typeof options.callback === 'function') {
        // callback inside options object
        callback = options.callback;
    }

    if (!callback && typeof Promise !== "undefined") {
        promise = new Promise(function (_resolve, _reject) {
            resolve = _resolve;
            reject = _reject;
        });
    } else {
        resolve = function (data) { callback(null, data); };
        reject = function (err) { callback(err, null); };
    }

    /*
     * Here is the tricky part : getting the data.
     * In firefox/chrome/opera/... setting the mimeType to 'text/plain; charset=x-user-defined'
     * is enough, the result is in the standard xhr.responseText.
     * cf https://developer.mozilla.org/En/XMLHttpRequest/Using_XMLHttpRequest#Receiving_binary_data_in_older_browsers
     * In IE <= 9, we must use (the IE only) attribute responseBody
     * (for binary data, its content is different from responseText).
     * In IE 10, the 'charset=x-user-defined' trick doesn't work, only the
     * responseType will work :
     * http://msdn.microsoft.com/en-us/library/ie/hh673569%28v=vs.85%29.aspx#Binary_Object_upload_and_download
     *
     * I'd like to use jQuery to avoid this XHR madness, but it doesn't support
     * the responseType attribute : http://bugs.jquery.com/ticket/11461
     */
    try {
        GM_xmlhttpRequest({
            url: path,
            method: "GET",
            responseType: "arraybuffer",
            overrideMimeType: "text/plain; charset=x-user-defined",
            onload: function(data){
                try {
                    resolve(data.response || data.responseText);
                } catch(err) {
                    reject(new Error(err));
                }
            },
            onprogress: function(e) {
                if(!options.progress) {return;}
                options.progress({
                    path: path,
                    originalEvent: e,
                    percent: e.loaded / e.total * 100,
                    loaded: e.loaded,
                    total: e.total
                });
            }
        });

    } catch (e) {
        reject(new Error(e), null);
    }
    return promise;
};