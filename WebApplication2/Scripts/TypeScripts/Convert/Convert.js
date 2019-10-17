/// <reference path="../_reference.d.ts" />
var Convert = /** @class */ (function () {
    function Convert() {
        var convert = this;
        this.MessageBox = $("#convertMsgBox");
        $("#convertRun").click(function () {
            $("#convertRun").prop('disabled', true);
            convert.Run();
        });
    }
    Convert.prototype.Run = function () {
        var convert = this;
        var outFormat = $("#convert-outformat").val();
        if (!outFormat || outFormat == "") {
            convert.MessageBox.html("Output format not selected");
            return;
        }
        convert.StartAnimateLoading();
        $.post("/Convert?format=" + outFormat, "", function (data, textStatus) {
            convert.StopAnimateLoading();
            if (!data) {
                convert.MessageBox.html("Convert failed");
                return;
            }
            if (!data.success) {
                if (data.message) {
                    convert.MessageBox.html("Convert failed:" + data.message + data.stackTrace);
                }
                else {
                    convert.MessageBox.html("Convert failed");
                }
                return;
            }
            convert.MessageBox.html("Convert success");
            window.location.href = "/Convert/Download";
        });
    };
    Convert.prototype.StartAnimateLoading = function () {
        this.MessageBox.html("Convert. Please wait....");
        $("#convertRun").prop('disabled', true);
        $("#convertRun .spinning").removeClass("hide");
    };
    Convert.prototype.StopAnimateLoading = function () {
        $("#convertRun").prop('disabled', false);
        $("#convertRun .spinning").addClass("hide");
        this.MessageBox.html("");
    };
    return Convert;
}());
$(document).ready(function () {
    // Create convert instance
    var convert = new Convert();
});
