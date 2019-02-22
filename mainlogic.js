//-------------------------------------------------Required Modules-------------------------------------------------->
const fs = require('fs');
const { convertCSVToArray } = require('convert-csv-to-array');
const converter = require('convert-csv-to-array');

//-------------------------------------------------Globals Variables-------------------------------------------------->
let testRange;
let testRangeRow;
let conflict;
let conflictRangeRow;
let conflictCount = 0;
let conflictDuration;
let reportArr = [];
let invalidEntryRow;
let invalidEntryReportArr = [];

const data = fs.readFile('ranges.csv', "utf8", (err, data) => {

    if (err) throw err;

//readfile is including \r at the end of every new line of the csv. That breaks things. 
//Thus check for \r before passing data to the convert-csv-to-array module   
    let newData = data.replace(/\r/g, "");
    let newIntervals = convertCSVToArray(newData, {
        type: 'object',
        separator: ',',
      });

    checkForInvalidEntry(newIntervals);
// console.log(new Date(newIntervals[1].stime).getTime());
// console.log(new Date(newIntervals[2].stime).getTime());
//Check each range in the array against each other to see if there are any conflicts.
//return and array that only includes ranges that were found to have conflict with another range it was tested against.
    let results = newIntervals.map((range, index) => {
        for (let i = 1; i < newIntervals.length; i++){
            if (new Date(range.stime).getTime() < new Date(newIntervals[i].etime).getTime() && new Date(range.stime).getTime() > new Date(newIntervals[i].stime).getTime()){
                conflictCount++;
                testRange = `${newIntervals[i].stime} to ${newIntervals[i].etime}`;
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
  });

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

  let checkForInvalidEntry = (arr) => {
      for (let i = 1; i < arr.length; i++){
        if ((new Date(arr[i].stime).getTime() === NaN) || (new Date(arr[i].etime).getTime() === NaN)){
            invalidEntryRow = i + 1;
            invalidEntryReportArr.push({
                invalidEntryRow: invalidEntryRow,
            });
            reportInvalidEntryResults(invalidEntryReportArr);
        } else {
            return false;
        }
      }
    }

  let reportInvalidEntryResults = (arr) => {
    console.log("");  
    console.log(`Looks like you've got invalid entries in the following rows:`);
    console.log(`Reminder, here are supported formats:`);
    console.log(`MM/DD/YYYY HH:MM AM/PM TZ`);
    console.log(`MM/DD/YY HH:MM AM/PM`);
    console.log("");
      for (let i = 0; i < arr.length; i++) {
        console.log(`${arr[i].invalidEntryRow}`);
        console.log("");
      }
  }




