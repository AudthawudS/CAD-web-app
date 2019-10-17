/// <reference path="../_reference.d.ts" />

class HelpBox
{
    public static ShowHelp(text: string, succesCallback?: () => void)
    {
        var modalService = UIUtility.GetModalService();
        if (!text)
        {
            return;
        }
        var options: ng.ui.bootstrap.IModalSettings = {
            templateUrl: '/Content/GetView?src=Home/HelpBox',
            controller: 'helpBoxCntrl',
            size: "md",
            resolve:
            {
                HelpBoxText: () => { return text; }
            }
        };
        var dlgRes = modalService.open(options).result;
        dlgRes.then(() =>
        {
            if (succesCallback)
            {
                succesCallback();
            }
        });
    }
}