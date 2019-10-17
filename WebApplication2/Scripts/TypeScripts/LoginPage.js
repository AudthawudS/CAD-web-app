/// <reference path="./_reference.d.ts" />
var LoginPage = /** @class */ (function () {
    function LoginPage() {
        var self = this;
        $("#btn-login-submit").click(function () {
            self.SignIn();
        });
    }
    LoginPage.prototype.SignIn = function () {
        $("#btn-login-submit").prop("disabled", true);
        var email = $("#inputEmail").val();
        var pswd = $("#inputPassword").val();
        if (email == "") {
            MessageBox.ShowError("Email is empty");
            return;
        }
        if (pswd == "") {
            MessageBox.ShowError("Email is empty");
            return;
        }
        $.post("/Login/SignIn?email=" + email + "&password=" + pswd, function (data) {
            $("#btn-login-submit").prop("disabled", false);
            if (!data.success) {
                alert(data.message);
                return;
            }
            window.location.href = "/";
        });
    };
    return LoginPage;
}());
$(document).ready(function () {
    $.ajaxSetup({ cache: false });
    var loginInst = new LoginPage();
});
var AngularApp = angular.module('feamvc', ['ngSanitize', 'ui.bootstrap'])
    .controller('messageBoxCntrl', MessageBoxController);
