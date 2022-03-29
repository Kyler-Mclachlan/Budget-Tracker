// creates a variable to hold db connections
let db;
// establishs a connection to IndexedDB database called 'PAW_Challenge' and set it to version 1
const request = indexedDB.open('PAW_Challenge', 1);