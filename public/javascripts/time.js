// here needs to find out, how to put concrete day's date, when the winning is created, below only shows today's date each day

const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${day}.${month}.${year}.`;
console.log(currentDate); // "17-6-2022"

document.getElementById("time").innerHTML = `Izveidots: ${currentDate}`;