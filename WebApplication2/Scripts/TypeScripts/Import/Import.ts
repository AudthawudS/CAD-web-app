/// <reference path="../_reference.d.ts" />
/// <reference path="../typings/uploader/ajaxUploder.d.ts" />
/// <reference path="../License/License.ts" />
/// <reference path="../Meshing/MeshingHelp.ts" />

class ImportController {
    public static $inject = [
        '$scope'
    ];

    public static Instance: ImportController;

    public FileName: string;

    private _btn: HTMLElement;
    private _btnMesh: HTMLElement;

    private _btnConvertToJson: HTMLElement;


    private _btnGeo: HTMLElement;

    private _progressBar: HTMLElement;

    private _progressOuter: HTMLElement;

    private _progressBarMeshing: JQuery;

    private _progressOuterMeshing: JQuery;

    private _progressTextMeshing: JQuery;

    private _allowCancelMeshing: boolean;

    private _isCanceledMeshing: boolean;

    private _scope: ng.IScope;

    private MeshingSize: number;

    private ProximityMeshSize: number;

    private IsLoading: boolean;

    private IsModelLoaded: boolean;

    private IsPreviewReady: boolean;

    private PreviewSrc: string;

    private Options: MeshingImproveOptions;

    constructor($scope: ng.IScope) {
        var self = this;
        self._scope = $scope;
        (<any>$scope).vm = this;

        if (ImportController.Instance) {
            throw new Error("ImportController double init");
        }
        ImportController.Instance = this;

        self.FileName = "";

        self._allowCancelMeshing = false;
        self._isCanceledMeshing = false;

        self.Clear();


        self._btnConvertToJson = document.getElementById('uploadToConvertToJson');

        self._btn = document.getElementById('uploadBtn');
        self._btnMesh = document.getElementById('uploadBtnMesh');
        self._btnGeo = document.getElementById('uploadBtnGeo');
        self._progressBar = document.getElementById('progressBar');
        self._progressOuter = document.getElementById('progressOuter');

        self._progressBarMeshing = $("#meshing-progress-bar");
        self._progressOuterMeshing = $("#meshing-progress-outer");
        self._progressTextMeshing = $("#meshing-progress-text");

        var uploader = new ss.SimpleUpload({
            button: self._btn,
            url: '/Import',
            name: 'uploadfile',
            hoverClass: 'hover',
            focusClass: 'focus',
            responseType: 'json',
            startXHR: function () {
                self._progressOuter.style.display = 'block'; // make progress bar visible
                this.setProgressBar(self._progressBar);
            },
            onSubmit: function () {
                self._btn.innerHTML = 'Uploading...'; // change button text to "Uploading..."
            },
            onComplete: function (filename, response) {
                self.CompleteImport(filename, response);
            },
            onError: function () {
                self._progressOuter.style.display = 'none';
                MessageBox.ShowError("Unable to upload file");
            }
        });

        //GEo
        var uploadergeo = new ss.SimpleUpload({
            button: self._btnGeo,
            url: '/Import',
            name: 'uploadfile',
            hoverClass: 'hover',
            focusClass: 'focus',
            responseType: 'json',
            startXHR: function () {
                self._progressOuter.style.display = 'block'; // make progress bar visible
                this.setProgressBar(self._progressBar);
            },
            onSubmit: function () {
                self._btn.innerHTML = 'Uploading...'; // change button text to "Uploading..."
            },
            onComplete: function (filename, response) {

                self.CompleteImportGeo(filename, response);
                //self.CompleteImportMesh(filename, response);
            },
            onError: function () {
                self._progressOuter.style.display = 'none';
                MessageBox.ShowError("Unable to upload file");
            }
        });

        //


        //Mesh
        var uploadermesh = new ss.SimpleUpload({
            button: self._btnMesh,
            url: '/Import',
            name: 'uploadfile',
            hoverClass: 'hover',
            focusClass: 'focus',
            responseType: 'json',
            startXHR: function () {
                self._progressOuter.style.display = 'block'; // make progress bar visible
                this.setProgressBar(self._progressBar);
            },
            onSubmit: function () {
                self._btn.innerHTML = 'Uploading...'; // change button text to "Uploading..."
            },
            onComplete: function (filename, response) {
                self.CompleteImportMesh(filename, response);
            },
            onError: function () {
                self._progressOuter.style.display = 'none';
                MessageBox.ShowError("Unable to upload file");
            }
        });


        //Mesh
        var uploaderToConvertToJson = new ss.SimpleUpload({
            button: self._btnConvertToJson,
            url: '/Import',
            name: 'uploadfile',
            hoverClass: 'hover',
            focusClass: 'focus',
            responseType: 'json',
            startXHR: function () {
                self._progressOuter.style.display = 'block'; // make progress bar visible
                this.setProgressBar(self._progressBar);
            },
            onSubmit: function () {
                self._btn.innerHTML = 'Uploading...'; // change button text to "Uploading..."
            },
            onComplete: function (filename, response) {

                self.CompleteConvertToJson(filename, response);
            },
            onError: function () {
                self._progressOuter.style.display = 'none';
                MessageBox.ShowError("Unable to upload file");
            }
        });



        // Hadlers of uploader
        //
        $(".id-ajaxuploader-div-uploadfile").click(function () {
            self.MeshingSize = 10;
            self.ProximityMeshSize = 0;
            UIUtility.ApplyScopeChanges(self._scope);
        });
        $(".id-ajaxuploader-div-uploadfile").click(function (evt) {
            if (!License.IsLicenseValid) {
                MessageBox.ShowError("License Not Valid");
                evt.preventDefault();
                evt.stopPropagation();
                return;
            }
        });


        $(document).keyup(function (evt: JQueryKeyEventObject) {
            if (evt.keyCode == 27) {
                // Escape
                self.CancelMeshing();
            }
        });
    }

    private CancelMeshing() {
        var self = this;

        if (!self._allowCancelMeshing) {
            return;
        }

        self._isCanceledMeshing = true;

        $.post("/Meshing/CancelMeshing", function (data) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }

            self._allowCancelMeshing = false;
        });
    }

    public Clear() {
        var self = this;

        self.Options = new MeshingImproveOptions();
        self.MeshingSize = 10;
        self.ProximityMeshSize = 0;
        self.IsLoading = false;
        self.IsPreviewReady = false;
        self.IsModelLoaded = false;
        self.PreviewSrc = "";

        UIUtility.ApplyScopeChanges(self._scope);
    }

    public SetIsModelLoaded() {
        this.IsModelLoaded = true;
        UIUtility.ApplyScopeChanges(this._scope);
    }

    public UpdatePreview() {
        var self = this;

        self.IsLoading = true;
        self.IsPreviewReady = false;

        var progressToken = new ProgressToken();
        self._progressBarMeshing.css("width", "0%");
        self.StartMeshingProgress(progressToken);

        self._allowCancelMeshing = true;
        self._isCanceledMeshing = false;

        UIUtility.ApplyScopeChanges(self._scope);

        $.post(
            "/Meshing/GeneratePreview?meshSize=" + self.MeshingSize + "&proximitySize=" + self.ProximityMeshSize,
            JSON.stringify(self.Options),
            function (data, textStatus) {
                self._allowCancelMeshing = false;
                self.StopMeshingProgress(progressToken);
                if (self._isCanceledMeshing) {
                    self.IsLoading = false;
                    UIUtility.ApplyScopeChanges(self._scope);
                    return;
                }
                if (!ErrorHandler.CheckJsonRes(data)) {
                    self.IsLoading = false;
                    UIUtility.ApplyScopeChanges(self._scope);
                    return;
                }

                // animate get
                //var imgUrl = "/Meshing/GetPreviewImage?tmp=" + Number(new Date());
                //$.get(imgUrl, function ()
                //{

                //    self.IsLoading = false;
                //    self.IsPreviewReady = true;
                //    self.PreviewSrc = imgUrl;
                //    UIUtility.ApplyScopeChanges(self._scope);
                //});

                self.RunMeshingVolume();
                MaterialTabController.Instance.MaterialDatabase();
            })
            .fail(function () {
                self._allowCancelMeshing = false;
            });
    }


    public UpdatePreviewGeo() {
        var self = this;

        self.IsLoading = true;
        self.IsPreviewReady = false;

        var progressToken = new ProgressToken();
        self._progressBarMeshing.css("width", "0%");
        self.StartMeshingProgress(progressToken);

        self._allowCancelMeshing = true;
        self._isCanceledMeshing = true;//changed from false to true

        UIUtility.ApplyScopeChanges(self._scope);

        //$.post(
        //    "/Meshing/GeneratePreviewGeo?meshSize=" + self.MeshingSize + "&proximitySize=" + self.ProximityMeshSize,
        //    JSON.stringify(self.Options),
        //    function (data, textStatus)
        //    {
        //        self._allowCancelMeshing = false;
        //        self.StopMeshingProgress(progressToken);
        //        if (self._isCanceledMeshing)
        //        {
        //            self.IsLoading = false;
        //            UIUtility.ApplyScopeChanges(self._scope);
        //            return;
        //        }
        //        if (!ErrorHandler.CheckJsonRes(data))
        //        {
        //            self.IsLoading = false;
        //            UIUtility.ApplyScopeChanges(self._scope);
        //            return;
        //        }

        //        // animate get
        //        var imgUrl = "/Meshing/GetPreviewImage?tmp=" + Number(new Date());
        //        $.get(imgUrl, function ()
        //        {
        //            self.IsLoading = false;
        //            self.IsPreviewReady = true;
        //            self.PreviewSrc = imgUrl;
        //            UIUtility.ApplyScopeChanges(self._scope);
        //        });
        //    })
        //    .fail(function ()
        //    {
        //        self._allowCancelMeshing = false;
        //    });
    }
    public UpdatePreviewMesh() {
        var self = this;

        self.IsLoading = true;
        self.IsPreviewReady = false;

        var progressToken = new ProgressToken();
        self._progressBarMeshing.css("width", "0%");
        self.StartMeshingProgress(progressToken);

        self._allowCancelMeshing = true;
        self._isCanceledMeshing = false;

        UIUtility.ApplyScopeChanges(self._scope);

        $.post(
            "/Meshing/GeneratePreviewMesh?meshSize=" + self.MeshingSize + "&proximitySize=" + self.ProximityMeshSize,
            JSON.stringify(self.Options),
            function (data, textStatus) {
                self._allowCancelMeshing = false;
                self.StopMeshingProgress(progressToken);
                if (self._isCanceledMeshing) {
                    self.IsLoading = false;
                    UIUtility.ApplyScopeChanges(self._scope);
                    return;
                }
                if (!ErrorHandler.CheckJsonRes(data)) {
                    self.IsLoading = false;
                    UIUtility.ApplyScopeChanges(self._scope);
                    return;
                }

                self.RunMeshingVolume1();

            })
            .fail(function () {
                self._allowCancelMeshing = false;
            });
    }


    private Help(content: string) {
        MeshingHelp.Help(content);
    }

    private StartMeshingProgress(progressToken: ProgressToken) {
        var self = this;

        if (progressToken.IsDone) {
            self._progressOuterMeshing.hide();
            return;
        }

        $.getJSON("/Meshing/GetCurrentProgress", function (data) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }

            var msg: string = data.Message;
            var val = <number>data.ProgressVal;

            if (progressToken.IsDone) {
                self._progressOuterMeshing.hide();
                return;
            }

            if (val >= 0 && msg && msg != "") {
                self._progressOuterMeshing.show();
                self._progressTextMeshing.html(msg);
                self._progressBarMeshing.css("width", val.toString() + "%");
            }
            else {
                var cssWidth = self._progressBarMeshing.width();
                if (cssWidth == 0) {
                    self._progressOuterMeshing.show();
                    self._progressBarMeshing.css("width", "10%");
                    self._progressTextMeshing.html("Init");
                }
            }

            setTimeout(function () {
                self.StartMeshingProgress(progressToken)
            }, 500);
        });
    }

    private StopMeshingProgress(progressToken: ProgressToken) {
        var self = this;

        progressToken.Stop();
        self._progressOuterMeshing.hide();
    }

    private CompleteImport(filename: string, response) {
        var self = this;

        self.FileName = filename;

        $(self._btn).html("Auto Mesh");
        $(self._btn).prop('disabled', true);

        self._progressOuter.style.display = 'none'; // hide progress bar when upload is completed

        if (!response) {
            MessageBox.ShowError('Unable to upload file');
            return;
        }

        if (response.success === true) {
            $.post(
                "/Import/Convert",
                function (data, textStatus) {
                    if (!ErrorHandler.CheckJsonRes(data)) {
                        return;
                    }

                    // Enable buttons
                    self.IsModelLoaded = true;
                    self.UpdatePreview();
                });
        }
        else {
            if (response.message) {
                MessageBox.ShowError(response.message);
            }
            else {
                MessageBox.ShowError("An error occurred and the upload failed.");
            }
        }
    }
    //Geo
    private CompleteImportGeo(filename: string, response) {
        var self = this;

        self.FileName = filename;

        $(self._btn).html("Obj");
        $(self._btn).prop('disabled', true);

        self._progressOuter.style.display = 'none'; // hide progress bar when upload is completed

        if (!response) {
            MessageBox.ShowError('Unable to upload file');
            return;
        }

        //if (response.success === true) {


        //    //$.post(
        //    //    "/Import/CompleteImportGeo?filename=" + filename,
        //    //    function (data, textStatus) {
        //    //        if (!ErrorHandler.CheckJsonRes(data)) {
        //    //            return;
        //    //        }

        //    //        // Enable buttons
        //    //        self.IsModelLoaded = true;
        //    //        self.UpdatePreview();
        //    //    });
        //}

        if (response.success === true) {

            $.ajax({
                type: "POST",
                url: "/Meshing/MeshOBJ",
                data: { filename: filename },
                dataType: 'json',
                complete: function (result) {

                    if (result.responseText == "True") {

                        $.ajax({
                            type: "POST",
                            url: "/Import/RenderOBJ",

                            success: function (result) {
                               
                                $('#renderStl').html('<span>RenderOBJ</span>');


                            }
                        });

                    }
                }
            });
         

        }
        else {
            if (response.message) {
                MessageBox.ShowError(response.message);
            }
            else {
                MessageBox.ShowError("An error occurred and the upload failed.");
            }
        }
    }

    //Mesh
    private CompleteImportMesh(filename: string, response) {
        var self = this;
        
        self.FileName = filename;

        $(self._btn).html("STL");
        $(self._btn).prop('disabled', true);

        self._progressOuter.style.display = 'none'; // hide progress bar when upload is completed

        if (!response) {
            MessageBox.ShowError('Unable to upload file');
            return;
        }

        if (response.success === true) {
           
            $.ajax({
                type: "POST",
                url: "/Import/ImportSTL",
                data: { filename: filename },
                dataType: 'json',
                complete: function (result) {
                  
                    if (result.responseText == "True")
                    {
                       
                        $.ajax({
                            type: "POST",
                            url: "/Import/RenderSTL",
                          
                            success: function (result) {
                               
                                $('#renderStl').html(result);
                                
                            }
                        });

                    }

                    else {
                        alert('Please select valid assimp model');
                    }
                }
            });
            //$.post(
            //    "/Import/ImportSTL?filename=" + filename,
            //    function (data, textStatus) {
            //        debugger
            //        if (!ErrorHandler.CheckJsonRes(data)) {
            //            return;
            //        }

            //        // Enable buttons
            //        self.IsModelLoaded = true;

            //    });

            //self.IsModelLoaded = true;
            //self.UpdatePreviewMesh();

        }
        else {
            if (response.message) {
                MessageBox.ShowError(response.message);
            }
            else {
                MessageBox.ShowError("An error occurred and the upload failed.");
            }
        }
    }



    //3D
    private CompleteConvertToJson(fileArray: any, response) {
        var self = this;

        self.FileName = fileArray;

        $(self._btn).html("Mesh Later");
        $(self._btn).prop('disabled', true);

        self._progressOuter.style.display = 'none'; // hide progress bar when upload is completed

        if (!response) {
            MessageBox.ShowError('Unable to upload file');
            return;
        }

        if (response.success === true) {
            $.ajax({
                type: "POST",
                url: "/Import/ConvertToJson",

                data: { fileArray: fileArray },
                success: function (response) {
                    //if (response.success === true)
                    //{
                    //    $.ajax({
                    //        type: "POST",
                    //        url: "/Import/Render",
                           
                    //        success: function (response) {
                                
                    //        }
                    //    });
                    //}
                }
            });
            //$.post(
            //    "/Import/ConvertToJson?fileArray=" + fileArray,
            //    function (data, textStatus) {

            //        if (!ErrorHandler.CheckJsonRes(data)) {

            //            return;
            //        }

            //        // Enable buttons
            //        self.IsModelLoaded = true;



            //    });

            //$.post("/Import/ConvertToJson?fileArray=" + fileArray, function (data) {
            //    $(".result").html(data);
            //});

            // self.IsModelLoaded = true;
            // self.UpdatePreviewMesh();

        }
        else {
            if (response.message) {
                MessageBox.ShowError(response.message);
            }
            else {
                MessageBox.ShowError("An error occurred and the upload failed.");
            }
        }
    }




    private RunMeshingVolume() {
        var self = this;
        self.IsLoading = true;

        // Start progress
        var progressToken = new ProgressToken();
        self.StartMeshingProgress(progressToken);

        self._allowCancelMeshing = true;
        self._isCanceledMeshing = false;

        // Run meshing volume
        Meshing.Run(
            self.MeshingSize,
            self.ProximityMeshSize,
            self.Options,
            function (data) {
                self._allowCancelMeshing = false;

                self.IsLoading = false;
                self.StopMeshingProgress(progressToken);

                if (self._isCanceledMeshing) {
                    // prevent next handling
                    return false;
                }

                return true;
            });
    }
    private RunMeshingVolume1() {
        var self = this;
        self.IsLoading = true;

        // Start progress
        var progressToken = new ProgressToken();
        self.StartMeshingProgress(progressToken);

        self._allowCancelMeshing = true;
        self._isCanceledMeshing = false;

        // Run meshing volume
        Meshing.Run1(
            self.MeshingSize,
            self.ProximityMeshSize,
            self.Options,
            function (data) {
                self._allowCancelMeshing = false;

                self.IsLoading = false;
                self.StopMeshingProgress(progressToken);

                if (self._isCanceledMeshing) {
                    // prevent next handling
                    return false;
                }

                return true;
            });
    }

}



