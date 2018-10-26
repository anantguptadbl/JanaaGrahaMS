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
				console.log("writing to file");
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
			console.log("Recording GPS");
			row.push(position.coords.latitude);
			row.push(",");
			row.push(position.coords.longitude);
			row.push(",");
			row.push(position.coords.altitude);
			row.push(",");
			row.push(position.coords.accuracy);
			row.push(",");
			row.push(position.coords.altitudeAccuracy);
			row.push(",");
			row.push(position.coords.heading);
			row.push(",");
			row.push(position.coords.speed);
			row.push(",");
			row.push(position.timestamp);
			row.push("\n");
			console.log(row);
			dataObj = new Blob(row, { type: 'text/plain' });
			writeFile(fileEntryData,dataObj);
			row = [];
		};

		function onError(error) {
		    row.push(error.code);
		    row.push(error.message);
			console.log(row);
		    row = [];
		}


		function recordMotionEvent(event) {
			row.push(event.acceleration.x);
			row.push(",");
			row.push(event.acceleration.y);
			row.push(",");
			row.push(event.acceleration.z);
			row.push(",");
			row.push(event.accelerationIncludingGravity.x);
			row.push(",");
			row.push(event.accelerationIncludingGravity.y);
			row.push(",");
			row.push(event.accelerationIncludingGravity.z);
			row.push(",");
			row.push(event.rotationRate.alpha);
			row.push(",");
			row.push(event.rotationRate.beta);
			row.push(",");
			row.push(event.rotationRate.gamma);
			row.push(",");
			var options = { enableHighAccuracy: true };
			navigator.geolocation.getCurrentPosition(recordGpsEvent,onError, options);
			console.log("Removing motion event");
			window.removeEventListener("devicemotion",recordMotionEvent, true);
		}

		window.setInterval(function(){
			console.log("GPS Loop");
			if(row.length == 0){
				window.addEventListener("devicemotion",recordMotionEvent, true);
			}
		}, 3000);

                var recordGpsEventLabel = function(position) {
                		console.log("getting gps data for label");
                        rowLabel.push(position.coords.latitude);
                        rowLabel.push(",");
                        rowLabel.push(position.coords.longitude);
                        rowLabel.push(",");
                        rowLabel.push(position.coords.altitude);
                        rowLabel.push(",");
                        rowLabel.push(position.coords.accuracy);
                        rowLabel.push(",");
                        rowLabel.push(position.coords.altitudeAccuracy);
                        rowLabel.push(",");
                        rowLabel.push(position.coords.heading);
                        rowLabel.push(",");
                        rowLabel.push(position.coords.speed);
                        rowLabel.push(",");
                        rowLabel.push(position.timestamp);
                        rowLabel.push("\n");
                        console.log(rowLabel);
                        dataObj = new Blob(rowLabel, { type: 'text/plain' });
                        writeFile(fileEntryLabel,dataObj);
                        rowLabel = [];
                };

		function recordLabel(info){
			if(rowLabel.length == 0){
				console.log("Marking Label");
				navigator.notification.beep(1);
				var options = { enableHighAccuracy: true };
	                        navigator.geolocation.getCurrentPosition(recordGpsEventLabel,onError, options);
			}
		}
		HeadsetButtons.subscribe(recordLabel);

		HeadsetButtons.start();

		window.plugins.insomnia.keepAwake();

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
