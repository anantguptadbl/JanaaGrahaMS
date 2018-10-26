=================================== JANAGRAHA Data collection App ====================

All majaor code changes are in www/js/index.js

To buid apk , from MyApp folder, run
	$ cordova build android

------------ files ------------------
janagraha.ipynb  #Kernel for data collected from above app.
data/mydata.txt #Data collected by hitesh on 25th oct 2018, while traveling to office. Not Labeled
data/mydata1.txt and data/myLabel1.txt # Data collected by hitesh on 25th oct 2018, while traveling back from office. Took different route. Labeled
data/mydata2.txt and data/myLabel2.txt # Data collected by hitesh on 26th oct 2018, while traveling to office. Labeled. <== Recommended
--------------------------------------

------------ running kernel -------------
1. Upload janagraha.ipynb to google drive.
2. Open with collabatory 
----------------------------------------

----------- Loading data into collab(Need to do every time you open notebook) ----------
Approach 1> Git clone this project.
Approach 2> wget the data folder only.
Approach 3> Upload data on google drive and mount gdrive.
Hint : you can use ! followed by the unix commmand to run various unix xommands on collab.
-----------------------------------------------------------------------------------------

Once you have loaded data, update the data paths accrordingly in the kernel.

Thats it!