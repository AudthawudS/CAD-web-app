/// <reference path="../_reference.d.ts" />

class Convert
{
    MessageBox: JQuery;

    constructor()
    {
        var convert = this;

        this.MessageBox = $("#convertMsgBox");

        $("#convertRun").click(function ()
        {
            $("#convertRun").prop('disabled', true);
            convert.Run();
        });
    }

    Run()
    {
        var convert = this;

        var outFormat = $("#convert-outformat").val();
        if (!outFormat || outFormat == "")
        {
            convert.MessageBox.html("Output format not selected");
            return;
        }

        convert.StartAnimateLoading();

        $.post(
            "/Convert?format=" + outFormat,
            "",
            function (data, textStatus)
            {
                convert.StopAnimateLoading();

                if (!data)
                {
                    convert.MessageBox.html("Convert failed");
                    return;
                }

                if (!data.success)
                {
                    if (data.message)
                    {
                        convert.MessageBox.html("Convert failed:" + data.message + data.stackTrace);
                    }
                    else
                    {
                        convert.MessageBox.html("Convert failed");
                    }
                    return;
                }
                convert.MessageBox.html("Convert success");

                window.location.href = "/Convert/Download";
            });
    }

    StartAnimateLoading()
    {
        this.MessageBox.html("Convert. Please wait....");
        $("#convertRun").prop('disabled', true);
        $("#convertRun .spinning").removeClass("hide");
    }


    StopAnimateLoading()
    {
        $("#convertRun").prop('disabled', false);
        $("#convertRun .spinning").addClass("hide");
        this.MessageBox.html("");
    }
}

$(document).ready(function ()
{
    // Create convert instance
    var convert = new Convert();
});