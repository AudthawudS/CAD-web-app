/// <reference path="../_reference.d.ts" />
var LicenseClass = /** @class */ (function () {
    function LicenseClass() {
        this.IsLicenseValid = false;
        $("#btn-service-sign-out").click(function () {
            License.SignOut();
        });
        this.StartUpdateState();
    }
    LicenseClass.prototype.SignOut = function () {
        $.post("/Login/SignOut", function (data) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            window.location.href = "/";
        });
    };
    LicenseClass.prototype.StartUpdateState = function () {
        var self = this;
        $.getJSON("Timer/GetState", function (data) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            $("#service-left-time").html(data.LeftMinutes);
            self.IsLicenseValid = data.IsLicenseValid;
            setTimeout(function () {
                self.StartUpdateState();
            }, 20000);
        });
    };
    return LicenseClass;
}());
var License;
$(document).ready(function () {
    License = new LicenseClass();
});
