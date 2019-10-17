/// <reference path="./_reference.d.ts" />

class LoginPage
{
    constructor()
    {
        var self = this;

        $("#btn-login-submit").click(function ()
        {
            self.SignIn();
        });
    }

    private SignIn()
    {
        $("#btn-login-submit").prop("disabled", true);
        var email = $("#inputEmail").val();
        var pswd = $("#inputPassword").val();

        if (email == "")
        {
            MessageBox.ShowError("Email is empty");
            return;
        }
        if (pswd == "")
        {
            MessageBox.ShowError("Email is empty");
            return;
        }
        $.post("/Login/SignIn?email=" + email + "&password=" + pswd,
            function (data)
            {
                $("#btn-login-submit").prop("disabled", false);

                if (!data.success)
                {
                    alert(data.message);
                    return;
                }

                window.location.href = "/"
            });
    }
}

$(document).ready(function ()
{
    $.ajaxSetup({ cache: false });

    var loginInst = new LoginPage();
});


var AngularApp = angular.module('feamvc', ['ngSanitize', 'ui.bootstrap'])
    .controller('messageBoxCntrl', MessageBoxController);
