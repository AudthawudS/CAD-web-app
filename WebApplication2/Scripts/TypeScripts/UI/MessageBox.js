/// <reference path="../_reference.d.ts" />
var MessageBox = /** @class */ (function () {
    function MessageBox() {
    }
    MessageBox.ShowMessage = function (msg) {
        this.Show("Message", msg);
    };
    MessageBox.ShowError = function (msg) {
        this.Show("Error", msg);
    };
    MessageBox.Show = function (title, msg) {
        var options = {
            templateUrl: '/Content/GetView?src=UI/ModalDialog',
            controller: 'messageBoxCntrl',
            size: "md",
            backdrop: "static",
            resolve: {
                Title: function () { return title; },
                Message: function () { return msg; }
            }
        };
        var modalService = UIUtility.GetModalService();
        modalService.open(options);
    };
    return MessageBox;
}());
