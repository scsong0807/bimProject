var oViewer;
var _views3D;
var _views2D;
var _loadedDocument;
function launchViewer(urn, viewDivId) {
    var options = {
        env: 'AutodeskProduction',
        getAccessToken: getAccessToken
    };
    var documentId = 'urn:' + urn;
    oViewer = new Autodesk.Viewing.Private.GuiViewer3D($("#" + viewDivId)[0], {}); // With toolbar
    ///////////////////
    ////online²Ù×÷
    ////////////////////
    Autodesk.Viewing.Initializer(options, function () {
        Autodesk.Viewing.Document.load(documentId, function (document) {
            _loadedDocument = document;
            _views3D = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), { 'type': 'geometry', 'role': '3d' }, true);
            _views2D = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), { 'type': 'geometry', 'role': '2d' }, true);

            oViewer.initialize();
            if (_views3D.length > 0) {
                loadView(_views3D[0]);
            }
            else if (_views2D.length > 0) {
                loadView(_views2D[0]);
            }
            else {
                assert("ERROR: Can't find any Views in the current model!");
            }
        });
        //oViewer.loadModel(documentId);
        //oViewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, onViewerItemSelected);
    });
}
function loadView(viewObj) {
    var path = _loadedDocument.getViewablePath(viewObj);
    console.log("Loading view URN: " + path);
    oViewer.load(path, _loadedDocument.getPropertyDbPath(), loadViewSuccessFunc, loadViewErrorFunc);
}
function loadViewSuccessFunc() {
    console.log("Loaded viewer successfully with given asset...");
}

function loadViewErrorFunc() {
    console.log("ERROR: could not load asset into viewer...");
}

function getAccessToken() {
    var token = '';
    jQuery.ajax({
        url: 'http://118.178.92.178:3000/api/forge/oauth/token',
        success: function (res) {
            token = res;
        },
        async: false // this request must be synchronous for the Forge Viewer
    });
    if (token != '') console.log('2 legged token: ' + token); // debug
    return token;
}