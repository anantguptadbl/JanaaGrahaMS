package com.jobr3255.headsetbuttons;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnKeyListener;


public class HeadsetButtonsListener extends CordovaPlugin implements OnKeyListener {

	private static final String LOG= "HeadsetButtons";
	private CallbackContext buttonCallbackContext;



	/**
	* 	Constructor of the HeadsetButtonsListener class
	*/
	public HeadsetButtonsListener(){
		buttonCallbackContext= null;
	}


	/**
	* 	Method which executes the Javascript request
	*
	*	@param		action: String object with the action to execute
	*	@param		args: JSONArray object with the arguments of the request
	*	@param		callbackContext: CallbackContext object for call back into Javascript
	*
	*	@return		"boolean" which indicates if the action is valid (true) or not (false)
	*/
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

		// Check the action
		if( action.equals("start") ){
			Log.d(LOG, "Start called");
			// Check if the plugin is listening the volume button events
			if( this.buttonCallbackContext != null ){

				callbackContext.error("Volume buttons listener already running");
				return true;
			}

			// Get the reference to the callbacks and start the listening process
			this.buttonCallbackContext= callbackContext;
			this.webView.getView().setOnKeyListener(this);

			// Don't return any result now
			PluginResult pluginResult= new PluginResult(PluginResult.Status.NO_RESULT);
			pluginResult.setKeepCallback(true);
			this.buttonCallbackContext.sendPluginResult(pluginResult);
			return true;
		}
		else if( action.equals("stop") ){
			Log.d(LOG, "Stop called");
			// Erase the callbacks reference and stop the listening process
			sendSignal(new JSONObject(), false); // release status callback in Javascript side
			this.buttonCallbackContext= null;
			this.webView.getView().setOnKeyListener(null);
			callbackContext.success();
			return true;
		}

		return false;
	}


	/**
	* 	Overwritten method for Android application lifecycle. It stops the key events listening process
	*/
	public void onDestroy(){

		// Stop the listening process
		this.webView.getView().setOnKeyListener(null);
	}


	/**
	* 	Overwritten method for Android application lifecycle. It stops the key events listening process
	*/
	public void onReset(){

		// Stop the listening process
		this.webView.getView().setOnKeyListener(null);
	}


	/**
	* 	Overwritten method to receive the Android key events
	*
	*	@param		view: View object who emit the signal (CordovaWebView)
	*	@param		keyCode: int with the identifier of the pressed key
	*	@param		keyEvent: KeyEvent object with the information of the event
	*
	*	@return		"boolean" which indicates if the listener has consumed the event (true) or not (false) [Always false to allow that the event spreading]
	*/
	public boolean onKey(View view, int keyCode, KeyEvent keyEvent) {
		// Check if the event is equal to KEY_DOWN
		if( keyEvent.getAction() == KeyEvent.ACTION_DOWN )
		{
			// Check what button has been pressed
			if( keyCode == KeyEvent.KEYCODE_VOLUME_UP ){

				// Create a new JSONObject with the information and send it
				JSONObject info= new JSONObject();
				try{
					info.put("signal", new String("volume-up"));
					sendSignal(info, true);
					return true;
				}
				catch(JSONException ex){
					Log.e(LOG, ex.getMessage());
				}
			}
			else if( keyCode == KeyEvent.KEYCODE_VOLUME_DOWN  ){
				// Create a new JSONObject with the information and send it
				JSONObject info= new JSONObject();
				try{
					info.put("signal", new String("volume-down"));
					sendSignal(info, true);
					return true;
				}
				catch(JSONException ex){
					Log.e(LOG, ex.getMessage());
				}
			}
			else if( keyCode == KeyEvent.KEYCODE_HEADSETHOOK  ){
				// Create a new JSONObject with the information and send it
				JSONObject info= new JSONObject();
				try{
					info.put("signal", new String("headset-hook"));
					sendSignal(info, true);
					return true;
				}
				catch(JSONException ex){
					Log.e(LOG, ex.getMessage());
				}
			}else{
				Log.d(LOG, "Unmapped key received: "+keyCode);
			}
		}

		return false;
	}


	/**
	* 	Method which sends back a new PluginResult to Javascript
	*
	*	@param		info: JSONObject object with the information to send back
	*	@param		keepCallback: boolean which indicates if there will be more results
	*/
	private void sendSignal(JSONObject info, boolean keepCallback)
	{
		if( this.buttonCallbackContext != null ){
			PluginResult result= new PluginResult(PluginResult.Status.OK, info);
			result.setKeepCallback(keepCallback);
			this.buttonCallbackContext.sendPluginResult(result);
		}
	}
}
