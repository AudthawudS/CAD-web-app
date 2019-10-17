/// <reference path="../_reference.d.ts" />
var HelpBox = /** @class */ (function () {
    function HelpBox() {
    }
    HelpBox.ShowHelp = function (text, succesCallback) {
        var modalService = UIUtility.GetModalService();
        if (!text) {
            return;
        }
        var options = {
            templateUrl: '/Content/GetView?src=Home/HelpBox',
            controller: 'helpBoxCntrl',
            size: "md",
            resolve: {
                HelpBoxText: function () { return text; }
            }
        };
        var dlgRes = modalService.open(options).result;
        dlgRes.then(function () {
            if (succesCallback) {
                succesCallback();
            }
        });
    };
    return HelpBox;
}());
