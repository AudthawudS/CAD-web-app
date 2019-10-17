/// <reference path="../_reference.d.ts" />

class MessageBox
{
    public static ShowMessage(msg: string)
    {
        this.Show("Message", msg);       
    }

    public static ShowError(msg: string)
    {
        this.Show("Error", msg);
    }

    private static Show(title: string, msg: string)
    {
        var options: ng.ui.bootstrap.IModalSettings = {
            templateUrl: '/Content/GetView?src=UI/ModalDialog',
            controller: 'messageBoxCntrl',
            size: "md",
            backdrop: "static",
            resolve:
            {
                Title: () => { return title },
                Message: () => { return msg; }
            }
        };

        var modalService = UIUtility.GetModalService();
        modalService.open(options);
    }
} 
