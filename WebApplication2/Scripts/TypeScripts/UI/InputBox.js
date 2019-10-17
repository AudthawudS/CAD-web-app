/// <reference path="../_reference.d.ts" />
var InputBox = /** @class */ (function () {
    function InputBox() {
    }
    InputBox.InputText = function (tilte, msg, doneCallback) {
        var options = {
            templateUrl: '/Content/GetView?src=UI/InputNameBoxDialog',
            controller: 'inputNameBoxCntrl',
            size: "md",
            backdrop: "static",
            resolve: {
                Title: function () { return tilte; },
                Message: function () { return msg; }
            }
        };
        var modalService = UIUtility.GetModalService();
        var dlgRes = modalService.open(options).result;
        dlgRes.then(function (name) {
            doneCallback(name);
        });
    };
    InputBox.InputNumber = function (tilte, msg, doneCallback) {
        var options = {
            templateUrl: '/Content/GetView?src=UI/InputNumberBoxDialog',
            controller: 'inputNumberBoxCntrl',
            size: "md",
            backdrop: "static",
            resolve: {
                Title: function () { return tilte; },
                Message: function () { return msg; }
            }
        };
        var modalService = UIUtility.GetModalService();
        var dlgRes = modalService.open(options).result;
        dlgRes.then(function (val) {
            doneCallback(val);
        });
    };
    return InputBox;
}());
