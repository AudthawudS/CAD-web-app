/// <reference path="../_reference.d.ts" />

class InputBox
{
    public static InputText(tilte: string, msg: string, doneCallback: (res: string) => void)
    {
        var options: ng.ui.bootstrap.IModalSettings = {
            templateUrl: '/Content/GetView?src=UI/InputNameBoxDialog',
            controller: 'inputNameBoxCntrl',
            size: "md",
            backdrop: "static",
            resolve:
            {
                Title: () => { return tilte; },
                Message: () => { return msg; }
            }
        };

        var modalService = UIUtility.GetModalService();

        var dlgRes = modalService.open(options).result;
        dlgRes.then((name: string) =>
        {
            doneCallback(name);
        });
    }

    public static InputNumber(tilte: string, msg: string, doneCallback: (res: number) => void)
    {
        var options: ng.ui.bootstrap.IModalSettings = {
            templateUrl: '/Content/GetView?src=UI/InputNumberBoxDialog',
            controller: 'inputNumberBoxCntrl',
            size: "md",
            backdrop: "static",
            resolve:
            {
                Title: () => { return tilte; },
                Message: () => { return msg; }
            }
        };

        var modalService = UIUtility.GetModalService();

        var dlgRes = modalService.open(options).result;
        dlgRes.then((val: number) =>
        {
            doneCallback(val);
        });
    }
}
