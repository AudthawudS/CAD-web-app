/// <reference path="../_reference.d.ts" />

class LicenseClass
{
    public IsLicenseValid: boolean;

    constructor()
    {
        this.IsLicenseValid = false;


        $("#btn-service-sign-out").click(function ()
        {
            License.SignOut();
        });

        this.StartUpdateState();
    }

    private SignOut()
    {
        $.post("/Login/SignOut",
            function (data)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                window.location.href = "/"
            });
    }

    private StartUpdateState()
    {
        var self = this;

        $.getJSON("Timer/GetState",
            function (data)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                $("#service-left-time").html(data.LeftMinutes);
                
                self.IsLicenseValid = data.IsLicenseValid;

                setTimeout(function ()
                {
                    self.StartUpdateState();
                }, 20000);
            });
    }

}


var License: LicenseClass;

$(document).ready(function ()
{
    License = new LicenseClass();
});