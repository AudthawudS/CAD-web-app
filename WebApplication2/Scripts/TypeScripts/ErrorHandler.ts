/// <reference path="./_reference.d.ts" />

class ErrorHandlerClass
{
    CheckJsonRes(data: any) : boolean
    {
        if (!data)
        {
            MessageBox.ShowError("Operation failed");
            return false;
        }

        if (data.success == undefined)
        {
            // data not contains success field
            return true;
        }

        if (!data.success)
        {
            if (data.message)
            {
                MessageBox.ShowError(data.message + data.stackTrace);
            }
            else
            {
                MessageBox.ShowError("Operation failed");
            }
            return false;
        }
        return true;
    }
} 

var ErrorHandler: ErrorHandlerClass = new ErrorHandlerClass();


