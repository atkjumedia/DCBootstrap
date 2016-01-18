var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.getElementById( 'gobutton').addEventListener('click', this.navigate);
		document.getElementById( 'seturlbutton').addEventListener('click', this.setUrl);
		document.getElementById( 'syncbutton').addEventListener('click', this.sync);

		document.getElementById( 'newDocumentCid').addEventListener('click', this.newDocumentCid);
		document.getElementById( 'saveDocument').addEventListener('click', this.saveDocument);
		document.getElementById( 'getLastSync').addEventListener('click', this.getLastSync);
		document.getElementById( 'deleteDocument').addEventListener('click', this.deleteDocument);
		document.getElementById( 'getContentRootUri').addEventListener('click', this.getContentRootUri);
		document.getElementById( 'searchDocuments').addEventListener('click', this.searchDocuments);
		document.getElementById( 'getDocumentCount').addEventListener('click', this.getDocumentCount);
		document.getElementById( 'multipleUploadTest').addEventListener('click', this.multipleUploadTest);

		document.getElementById( 'saveForUpload').addEventListener('click', this.saveForUpload);
		document.getElementById( 'qbe1').addEventListener('click', function() { app.qbe(1);});
		document.getElementById( 'qbe2').addEventListener('click', function() { app.qbe(2);});
		document.getElementById( 'qbe3').addEventListener('click', function() { app.qbe(3);});
		document.getElementById( 'qbe4').addEventListener('click', function() { app.qbe(4);});
		
		
		},
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		cordova.plugins.DCSync.on('sync_completed', app.synccompleted);
		cordova.plugins.DCSync.on('sync_failed', app.syncfail);
		cordova.plugins.DCSync.on('sync_progress', app.syncprogress);
		cordova.plugins.DCSync.getSyncOptions().then(function(s) {
			document.getElementById('url').value = s.url;
		});
		navigator.splashscreen.hide();
		app.checkStartPage();
    },

	syncprogress: function(pro) {
		document.getElementById('syncprogress').innerHTML= pro.percent + "Sync %...";
	},
	synccompleted: function(pro) {
		document.getElementById('syncprogress').innerHTML= "Sync complete";
		app.checkStartPage();
	},
	syncfail: function(pro) {
		document.getElementById('syncprogress').innerHTML= "Sync failed" + JSON.stringify(pro);
	},

	setUrl: function() {
		var url = document.getElementById('url').value;
		var interval = document.getElementById('interval').value *1;
		cordova.plugins.DCSync.setSyncOptions({url:url,username:'anonymous', password:'8FN23!3BNCLFA4$GNHIAKDFFNA2abx0938//', interval: interval})
		.then(app.log);
	},
	sync: function() {
		app.clear();
		document.getElementById('syncprogress').innerHTML= "Starting sync";
		cordova.plugins.DCSync.performSync()
		.fail(app.failure);
	},

	navigate: function() {
		app.clear();
		var url = document.getElementById('startpage').innerHTML + "?assets=" + encodeURI(cordova.file.applicationDirectory);
		window.location=url;
	},
	
	clear: function() {
		document.getElementById('result').innerHTML = "";
		document.getElementById('error').innerHTML= "";
	},
	
	log: function(data) {
		document.getElementById('result').innerHTML= "complete: <br/>" + (!!data ? JSON.stringify(data) : "");
	},
	failure: function(data) {
		document.getElementById('error').innerHTML= (!!data ? JSON.stringify(data) : "");
	},
	
	checkStartPage: function() {
		var ele = document.getElementById('startpage');
		cordova.plugins.DCSync.searchDocuments( {}, {path:"co2tl_app/index.html"}).then( function(data) {
				if( data && data.length>0 && data[0].files && data[0].files.length>0 ) {
					cordova.plugins.DCSync.getContentRootUri().then( function(uri) {
						window.resolveLocalFileSystemURL(uri, function(entry) {
    							ele.innerHTML = entry.toURL() +  data[0].files[0];
    							document.getElementById('gobutton').style="";
						});

					}).fail(app.failure);
				}
				else {
					ele.innerHTML = "No Startpage synced yet";
					document.getElementById('gobutton').style="display:none";
				}
		}).fail(app.failure);
	},
	
	newDocumentCid: function() {
		app.clear();
		cordova.plugins.DCSync.newDocumentCid().then(app.log, app.failure);
	},

	getLastSync: function() {
		app.clear();
		cordova.plugins.DCSync.getLastSync().then(app.log, app.failure);
	},

	getContentRootUri: function() {
		app.clear();
		cordova.plugins.DCSync.getContentRootUri().then(app.log, app.failure);
	},

	saveDocument: function() {
		app.clear();
		cordova.plugins.DCSync.saveDocument('TESTCID-DFIF_DFDF','TESTS/PATH1', { testkey:'testvalue'}, null, true).then(app.log, app.failure);
	},
	searchDocuments: function() {
		app.clear();
		cordova.plugins.DCSync.searchDocuments({}, {path:document.getElementById('search').value}).then(app.log, app.failure);
	},
	getDocumentCount: function() {
		app.clear();
		cordova.plugins.DCSync.getDocumentCount(document.getElementById('search').value).then(app.log, app.failure);
	},
	deleteDocument: function() {
		app.clear();
		cordova.plugins.DCSync.deleteDocument('TESTCID-DFIF_DFDF').then(app.log, app.failure);
	},

	setSyncOptions: function() {
		app.clear();
		cordova.plugins.DCSync.setSyncOptions({url:'https://media.kju.at/datacollector', username:'anonymous', password:'none', interval: 1440}).then(app.log, app.failure);
	},

	setSyncOptions: function() {
		app.clear();
		cordova.plugins.DCSync.setSyncOptions({url:'http://10.0.2.2:49341/DC', username:'anonymous', password:'YTI2Y2UxYzgxZTBiN2U4OWZmZjU1OWJmYmU4ZTEwN2E2MzFhNGFlMmFkYzlhMWMxYmE1YWYyOGNiYWMyZWI4ZA==', interval: 1440}).then(app.log, app.failure);
	},
	
	saveForUpload: function() {
		app.clear();
		cordova.plugins.DCSync.saveDocument('TESTCID-UPLOADDOC','TESTS/UPLOAD', { testkey:'testvalue'}, ["co2tl_app/index.html"], false).then(app.log, app.failure);
	},
	multipleUploadTest: function() {
		app.clear();
		cordova.plugins.DCSync.searchDocuments({}, {path:"TESTS/UPLOADM", exactMatch:true}).then(function(data) {
			if( data.length==0 ) {
				cordova.plugins.DCSync.saveDocument('TESTCID-UPLOADMDOC','TESTS/UPLOADM', { counter:0}, ["co2tl_app/index.html"], false)
				.then(app.log, app.failure);
			}
			else {
				data[0].document.counter ++;
				cordova.plugins.DCSync.saveDocument('TESTCID-UPLOADMDOC','TESTS/UPLOADM', data[0].document, ["co2tl_app/index.html"], false)
				.then(app.log, app.failure);
			}
		}, app.failure);

		
	},

	qbe: function(index) {
		app.clear();
		var qbex = {};
		switch(index) {
			case 1: qbex = {NbDoors:3};
				break;
			case 2: qbex = {Brand:{Code:"15"}}
				break;
			case 3: 
			case 4:
				qbex = {Brand:{Code:15}}
				break;
		}
		cordova.plugins.DCSync.searchDocuments(qbex, {path:"CO2TL/Vehicles"}).then(app.log, app.failure);
	}
	
}

	

app.initialize();




