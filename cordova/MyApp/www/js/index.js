/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
		window.addEventListener("compassneedscalibration",function(event) {
			  // ask user to wave device in a figure-eight motion
			  event.preventDefault();
		}, true);

		cordova.plugins.backgroundMode.enable();
		cordova.plugins.backgroundMode.overrideBackButton();
		cordova.plugins.backgroundMode.setDefaults({
    			title = "MS Janagrah Data Collection"
			text = "Data is being collected ...",
		});
		cordova.plugins.backgroundMode.on('activate', function() {
			cordova.plugins.backgroundMode.disableWebViewOptimizations();
		});

		var row = [];
		var rowLabel = [];
		var fileEntryData = null;
		var fileEntryLabel = null;

		function writeFile(fileEntry,dataObj) {
			fileEntry.createWriter(function (fileWriter) {
				fileWriter.onwriteend = function() {
				    console.log("Successful file write...");
				};

				fileWriter.onerror = function (e) {
				    console.log("Failed file read: " + e.toString());
				};
			    try {
			        fileWriter.seek(fileWriter.length);
			    }
			    catch (e) {
			        console.log("file doesn't exist!");
			    }
				fileWriter.write(dataObj);
			});
		}

		function createFile(dirEntry, fileName, isData) {
			dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {
				if(isData == 1){fileEntryData = fileEntry;}
				else{fileEntryLabel = fileEntry;}
				console.log('file created/get');
			}, onError);
		}

		window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dirEntry) {
			console.log('file system open: ' + dirEntry.name);
			createFile(dirEntry, "mydata.txt",1);
			createFile(dirEntry, "myLabel.txt",0);
		}, onError);


		var recordGpsEvent = function(position) {
			row.push(Math.round(position.coords.latitude));
			row.push(",");
			row.push(Math.round(position.coords.longitude));
			row.push(",");
			row.push(Math.round(position.coords.altitude));
			row.push(",");
			row.push(Math.round(position.coords.accuracy));
			row.push(",");
			row.push(Math.round(position.coords.altitudeAccuracy));
			row.push(",");
			row.push(Math.round(position.coords.heading));
			row.push(",");
			row.push(Math.round(position.coords.speed));
			row.push(",");
			row.push(Math.round(position.timestamp));
			row.push("\n");
			console.log(row);
			dataObj = new Blob(row, { type: 'text/plain' });
			writeFile(fileEntryData,dataObj);
			row = [];
		};

		function onError(error) {
		    row.push(Math.round(error.code));
		    row.push(Math.round(error.message));
			console.log(row);
		    row = [];
		}


		function recordMotionEvent(event) {
			row.push(Math.round(event.acceleration.x));
			row.push(",");
			row.push(Math.round(event.acceleration.y));
			row.push(",");
			row.push(Math.round(event.acceleration.z));
			row.push(",");
			row.push(Math.round(event.accelerationIncludingGravity.x));
			row.push(",");
			row.push(Math.round(event.accelerationIncludingGravity.y));
			row.push(",");
			row.push(Math.round(event.accelerationIncludingGravity.z));
			row.push(",");
			row.push(Math.round(event.rotationRate.alpha));
			row.push(",");
			row.push(Math.round(event.rotationRate.beta));
			row.push(",");
			row.push(Math.round(event.rotationRate.gamma));
			row.push(",");
			var options = { enableHighAccuracy: true };
			navigator.geolocation.getCurrentPosition(recordGpsEvent,onError, options);
			console.log("Removing motion event");
			window.removeEventListener("devicemotion",recordMotionEvent, true);
		}

		window.setInterval(function(){
			if(row.length == 0){
				window.addEventListener("devicemotion",recordMotionEvent, true);
			}
		}, 3000);

                var recordGpsEventLabel = function(position) {
                        rowLabel.push(Math.round(position.coords.latitude));
                        rowLabel.push(",");
                        rowLabel.push(Math.round(position.coords.longitude));
                        rowLabel.push(",");
                        rowLabel.push(Math.round(position.coords.altitude));
                        rowLabel.push(",");
                        rowLabel.push(Math.round(position.coords.accuracy));
                        rowLabel.push(",");
                        rowLabel.push(Math.round(position.coords.altitudeAccuracy));
                        rowLabel.push(",");
                        rowLabel.push(Math.round(position.coords.heading));
                        rowLabel.push(",");
                        rowLabel.push(Math.round(position.coords.speed));
                        rowLabel.push(",");
                        rowLabel.push(Math.round(position.timestamp));
                        rowLabel.push("\n");
                        console.log(rowLabel);
                        dataObj = new Blob(rowLabel, { type: 'text/plain' });
                        writeFile(fileEntryLabel,dataObj);
                        rowLabel = [];
                };

		function recordLabel(info){
			if(rowLabel.length == 0){
				console.log("Marking Label");
				var options = { enableHighAccuracy: true };
	                        navigator.geolocation.getCurrentPosition(recordGpsEventLabel,onError, options);
			}
		}
		HeadsetButtons.subscribe(recordLabel);

    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
