/// <reference path="./_reference.d.ts" />
// Init angular
var AngularApp = angular.module('feamvc', ['ngSanitize', 'ui.bootstrap'])
    .controller('messageBoxCntrl', MessageBoxController)
    .controller('bcCntrl', BCToolController)
    .controller('bcTabCtrl', BCToolTabController)
    .controller('legendCntrl', LegendController)
    .controller('settingsCntrl', SettingsController)
    .controller('projectCntrl', ProjectController)
    .controller('vecInputCntrl', Vector3InputController)
    .controller('UIInteractive', UIInteractive)
    .controller('groupCtrl', TabGroups)
    .controller('setupsCtrl', TabSetUpsController)
    .controller('refpointCtrl', RefPointController)
    .controller('refpointtabCtrl', RefPointTabController)
    .controller('groupCondCtrl', GroupCondController)
    .controller('taskMgr', TaskManager)
    .controller('renderCntrl', RenderingController)
    .controller('toolMeasureCntrl', ToolMeasureController)
    .controller('confrimBoxCntrl', ConfirmBoxController)
    .controller('inputNameBoxCntrl', InputNameBoxController)
    .controller('inputNumberBoxCntrl', InputNumberBoxController)
    .controller('materialTabCntrl', MaterialTabController)
    .controller('materialDbCntrl', MaterialDatabaseController)
    .controller("editMaterialCntrl", MaterialEditController)
    .controller("meshingDialogCntrl", MeshingDialogController)
    .controller("helpBoxCntrl", HelpBoxController)
    .controller("importCntrl", ImportController)
    .controller("planeSelectToolbarCntrl", PlaneSelectToolbarController)
    .controller("selectGroupDialogCntrl", SelectGroupDialogController)
    .directive('compile', CompileDirective)
    .directive('htmlinner', HtmlInnerDirective);
var App = new AppClass();
$(document).ready(function () {
    $.ajaxSetup({ cache: false });
    // Enable default tool
    App.Layout.SetTool(new ToolPan());
    $("#id-main-container").removeClass("hide");
    ExternalCommands.ExecuteParams();
    // TEST
    //Project.Open("test");
    //App.Ribbon.GotoEditor();
});
