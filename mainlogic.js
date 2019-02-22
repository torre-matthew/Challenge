//-------------------------------------------------Required Modules-------------------------------------------------->
const fs = require('fs');
const { convertCSVToArray } = require('convert-csv-to-array');
const converter = require('convert-csv-to-array');
let inquirer = require("inquirer");

//-------------------------------------------------Globals Variables-------------------------------------------------->
let testRange;
let testRangeRow;
let conflict;
let conflictRangeRow;
let conflictCount = 0;
let conflictDuration;
let reportArr = [];
let invalidEntry;
let invalidEntryRow;
let invalidEntryReportArr = [];


//This function will prompt the user for the name of the csv file that contains the data they want to run through the program
//don't forget to inlcude ".csv" to the file name. The file should be saved in the save directory as this one.
let promptForFileName = () => {

    inquirer.prompt([
        {
            name: "csvName",
            type: "input",
            message: "What is the name of your .csv file?"
        }
  ]).then(answers => {

    let data = fs.readFile(answers.csvName, "utf8", (err, data) => {

        if (err) throw err;
    
    //readfile is including \r at the end of every new line of the csv. That breaks things. 
    //Thus check for \r before passing data to the convert-csv-to-array module   
        let newData = data.replace(/\r/g, "");
        let newIntervals = convertCSVToArray(newData, {
            type: 'object',
            separator: ',',
          });

          checkForInvalidEntry(newIntervals);
          if (invalidEntryReportArr.length === 0){
            checkForConflicts(newIntervals);
          } else {
            reportInvalidEntryResults(invalidEntryReportArr);
          }
    });
      
  });

}

//This function is reponsible for parsing through the array that stores the conflicts (reportArr) and displaying the results to the user.
//it takes two params, an array that contains data to report to the user, and a number.
  let reportResults = (arr, conflictCount) => {
    console.log("");  
    console.log(`You've got ${conflictCount} conflict(s)`);
    console.log("");
      for (let i = 0; i < arr.length; i++) {
        console.log(`${arr[i].conflictDuration} minute conflict`);   
        console.log(`Row ${arr[i].testRangeRow}: ${arr[i].testRange}`);
        console.log(`Row ${arr[i].conflictRangeRow}: ${arr[i].conflict}`);
        console.log("");
      }
  }

//If inputs don't meet the format requirements on any line of the provided csv, return an array with data that can be reported back to the user
//with information for them to correct
let checkForInvalidEntry = (arr) => {
      for (let i = 1; i < arr.length; i++){
        if ((!String(arr[i].stime).includes("/") || !String(arr[i].etime).includes("/")) || (!String(arr[i].stime).includes(":") || !String(arr[i].etime).includes(":"))){
            invalidEntry = `${arr[i].stime} and/or ${arr[i].etime}`
            invalidEntryRow = i + 1;
            invalidEntryReportArr.push({
                invalidEntry: invalidEntry,
                invalidEntryRow: invalidEntryRow
            });    
        } 
    }
  return invalidEntryReportArr;       
}

//Check each range in the array against each other to see if there are any conflicts.
//return and array that only includes ranges that were found to have conflict with another range it was tested against.

let checkForConflicts = (arr) => {
    let results = arr.map((range, index) => {
        for (let i = 1; i < arr.length; i++){
            if (new Date(range.stime).getTime() < new Date(arr[i].etime).getTime() && new Date(range.stime).getTime() > new Date(arr[i].stime).getTime()){
                conflictCount++;
                testRange = `${arr[i].stime} to ${arr[i].etime}`;
                testRangeRow = i + 1;
                conflict = `${range.stime} to ${range.etime}`; 
                conflictRangeRow = index + 1;
                conflictDuration = `${(new Date(range.etime).getTime() - new Date(range.stime).getTime())/60000}` 
                reportArr.push({
                    testRange: testRange,
                    testRangeRow: testRangeRow,
                    conflict: conflict,
                    conflictRangeRow: conflictRangeRow,
                    conflictDuration: conflictDuration
                });
            }
        }
    });

    reportResults(reportArr, conflictCount);
}


// This function just displays the contents of the invalidEntryReportArr to give the user insight into where errors are in their .csv.
  let reportInvalidEntryResults = (arr) => {
    console.log("");  
    console.log(`Looks like you've got invalid entries.`);
    console.log("");
    console.log(`As a reminder, here are supported formats for inputing time and date ranges`);
    console.log("");
    console.log(`MM/DD/YYYY HH:MM AM/PM TZ`);
    console.log(`MM/DD/YY HH:MM AM/PM TZ`);
    console.log(`MM/DD/YYYY HH:MM AM/PM`);
    console.log(`MM/DD/YY HH:MM AM/PM`);
    console.log("");
    console.log(`Also, double check that the header for your columns in your .csv are "stime" and "etime"`);
    console.log("");
    console.log(`Double check that these inputs meet formating requirements`);
    console.log("");

    arr.forEach(entry => {
        console.log(`Row ${entry.invalidEntryRow}: ${entry.invalidEntry}`);
        console.log("");
    });
  }

// when program is first run, prompt user to enter a .csv file.
promptForFileName();

