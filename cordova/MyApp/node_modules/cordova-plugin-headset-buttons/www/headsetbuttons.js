var cordova= 	require('cordova'),
	exec= 		require('cordova/exec');

function handlers() {
	return headsetButtons.channels.buttonsListener.numHandlers;
}

var HeadsetButtons= function(){
	console.log("Headset buttons listener has been created");
	//buttonsListener:cordova.addWindowEventHandler('headsetbuttonslistener');
	this.subscribedCallback = null;
	this.channels={ buttonsListener:cordova.addWindowEventHandler('headsetbuttonslistener') };
};

/**
* 	Callback used when the user presses the headset button of the device
*
*	@param {Object} info	keys: signal ['headset-up' or 'headset-down' or 'headset-hook']
*/
HeadsetButtons.prototype.headsetButtonsListener= function(info){
	if(info){
		if(headsetButtons.subscribedCallback != null){
			headsetButtons.subscribedCallback(info);
		}
	}
};

HeadsetButtons.prototype.subscribedCallback = null;

HeadsetButtons.prototype.errorListener= function(e){
	console.log("Error initializing HeadsetButtons: " + e);
};

HeadsetButtons.prototype.subscribe= function(callback){
	console.log("Subscribing to callback");
	headsetButtons.subscribedCallback = callback;
};

HeadsetButtons.prototype.start= function(){
	console.log("Adding event listener for headset buttons");
	exec(headsetButtons.headsetButtonsListener, headsetButtons.errorListener, "HeadsetButtons", "start", []);
};

HeadsetButtons.prototype.stop= function(){
	console.log("Removing event listener for headset buttons");
	exec(null, null, "HeadsetButtons", "stop", []);
};

var headsetButtons= new HeadsetButtons();
module.exports= headsetButtons;
