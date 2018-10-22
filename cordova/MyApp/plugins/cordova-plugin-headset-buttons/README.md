# cordova-plugin-headset-buttons

This plugin allows the remapping of the headset buttons. This plugin will also remap the volume buttons on the device itself as well as the headset buttons.

##### Supported platforms
* Android

### Installing

Install from npm

```
npm i cordova-plugin-headset-buttons
```

Install from github

```
npm i https://github.com/jobr3255/cordova-plugin-headset-buttons.git
```

## Adding to cordova project

```
cordova plugin add cordova-plugin-headset-buttons
```

## Using the plugin

Invoke any of the functions through HeadsetButtons.

To get a response from HeadsetButtons you must set a callback before doing anything.

```
HeadsetButtons.subscribe(myCallbackFunction);

function myCallbackFunction(info){
	console.log("Button pressed: " + info.signal);
}
```

You can start and stop the listener whenever you want.

```
HeadsetButtons.start();
HeadsetButtons.stop();
```

## Acknowledgments

* This plugin was built from cordova-plugin-volume-buttons by manueldeveloper
