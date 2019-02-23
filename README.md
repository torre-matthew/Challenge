# Challenge

This program runs entirely on the command line. It will analyze time ranges provided in .csv file format and report back if there are time conflicts or input errors. It's build using the latest version of Node.js.

#### Running the Program
1. Install the latest version of Node.js on your machine. Instructions [here](https://nodejs.org/en/download/)
2. Once node is installed open the uvChallengeTM folder in your terminal.
    * Node modules and package.json files are included in this folder. This program requires two npm packages [inquirer](https://www.npmjs.com/package/inquirer#input---type-input) and [convert csv to array](https://www.npmjs.com/package/convert-csv-to-array)
3. run the command "node mainlogic.js"
4. Once prompted for file name, type ranges.csv. The program will run against this sample set of data. 
5. You can add your own .csv file to this directory or reuse the ranges.csv that's provided. Just provide the name of your .csv file when prompted.

##### Formating Your CSV
* Column A identifies the start time and header should always be "stime"
* Column B identifies the end time and header should always be "etime"
* Add as many time ranges as you'd like to analyze.
* Supported Formatting for time ranges:
    * MM/DD/YYYY HH:MM AM/PM TZ
    * MM/DD/YY HH:MM AM/PM TZ
    * MM/DD/YYYY HH:MM AM/PM
    * MM/DD/YY HH:MM AM/PM
    * Note: not following these formatting requirments will result in errors when you run the progra against your .csv. Rest assured though, the program will tell you what lines to double check. 


#### Test Cases:
1. Create time ranges that don't satisfy the formatting requirements (ex text, whole numbers, etc). Verify that the program reports the following:
    1. Row in which invalid input was detected with the actual inputs that need review.
        * Known Bug: simply inputing ":/" will not be caught by the invalid input checker function.
2. Provide a .csv with overlaps in the same timezone. Verify the the program reports:
    1. Number of conflicts.
    2. Line of .csv that are in conflict with time ranges.
    3. The correct amount of time that is overlapping.
3. Input time range where the starting time is an actual later time than the end time.
    1. Program will correct this for you.
4. Provide time ranges that conflict despite being different timezones. Verify that the program reports:
    1. Number of conflicts.
    2. Line of .csv that are in conflict with time ranges.
    3. The correct amount of time that is overlapping.
4. Known Bug: Input time range where the start time and end time are in two separate timezones.
