### CSCI2340 VM test Information

connect our VM by CSVPN(OpenVPN)

use ssh csci2340 to connect our VM server

then `git clone https://github.com/ibiyemisi64/SENSE.git`



## For iqsinv2

use command `cd SENSE` 

`cd iqsignv2`

Install dependencies: `npm install`

Run the project with network host by `npm run dev -- --host`

You will get a uri, for example,you will get the uri "A" (not the localhost one)

Download test.py, and open it.

copy the uri "A" into the test.py in ip_address. Like ip_address="A"

Then run test.py


## For alds

**first step**

Install flutter in our vm by `git clone -b main https://github.com/flutter/flutter.git.`

Check the PATH by `echo $PATH`.

If the flutter PATH shows ~/development/flutter/bin

Use `export PATH="~/flutter/bin:$PATH"` to change it correctly. (tips use `flutter doctor` to flutter command work or not)

Then `cd SENSE`, 

`cd flutter`, 

`cd alds`.

Use `flutter run` to run the alds part.

You will get a uri at the bottom, it looks like http://127.0.0.1:9101?uri=http://127.0.0.1:33879/tSKGdVdGwKQ=/

**second step**

Open a new vm window, connect to our vm server. (do not close the first vm server window)

`cd SENSEN`

`cd docs`

`cd VM reachable test`

`vi test.py`(make sure you get install python in vm server before)

Copy and and paste the uri from first step into the ip_address.

Quit and save the editing page.

Then run `python test.py`











