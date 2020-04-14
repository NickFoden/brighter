'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Create a client
 */
var createClient = function (params) {
    if (!params || !params.apiKey || !params.apiUrl) {
        throw new Error("apiKey && apiUrl required in createClient");
    }
    var isDev = process.env.NODE_ENV === "development";
    var key = "start";
    var API_KEY = params.apiKey;
    var brighter = function (event) {
        if (!event.time) {
            event.time = Date.now();
        }
        var windowObj = {};
        if (typeof window !== "undefined") {
            windowObj["href"] = window.location.href;
            windowObj["pathname"] = window.location.pathname;
            windowObj["navigatorUserAgent"] = window.navigator.userAgent;
        }
        var THE_URL = params.apiUrl + "/" + key + "/" + API_KEY;
        return new Promise(function (resolve, reject) {
            fetch(THE_URL, {
                method: "POST",
                body: JSON.stringify({ event: event, windowObj: windowObj }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(function (data) { return data.json(); })
                .then(function (result) {
                var status = result.status;
                switch (status) {
                    case "created":
                        key = result.key;
                        break;
                    case "saved":
                        if (isDev) {
                            console.log("added new event");
                            console.dir(result);
                        }
                        break;
                    case "error":
                        if (isDev) {
                            console.log("error");
                            console.dir(result);
                        }
                        break;
                    default:
                        if (isDev) {
                            console.dir(result);
                        }
                        break;
                }
                resolve(result);
            })["catch"](function (err) { return reject(err); });
        });
    };
    return brighter;
};

exports.createClient = createClient;
//# sourceMappingURL=index.js.map
