cordova.define("cordova.plugins.DozeOptimize.DozeOptimize", function(require, exports, module) {
var exec = require('cordova/exec');

exports.RequestOptimizations = function(success, error) {
    exec(success, error, "DozeOptimize", "RequestOptimizations", []);
};

exports.IsIgnoringBatteryOptimizations = function(success, error) {
    exec(success, error, "DozeOptimize", "IsIgnoringBatteryOptimizations", []);
};

});
