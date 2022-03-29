// creates a variable to hold db connections
let db;
// establishs a connection to IndexedDB database called 'PAW_Challenge' and set it to version 1
const request = indexedDB.open('PAW_Challenge', 1);

// this event will fire  if the database version changes 
request.onupgradeneeded = function(event) {
    // saves a reference to the database 
    const db = event.target.result;
    // create an object store (table) called `new_object_store_PWA_Challenge`
    db.createObjectStore('new_object_store_PWA_Challenge', { autoIncrement: true });
  };

// upon a successful 
request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
        saveRecord();
    }
  };
  
  request.onerror = function(event) {
    console.log(event.target.errorCode);
  };


function saveRecord(record) {
    // open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['new_object_store_PWA_Challenge'], 'readwrite');
  
    // access the object store for `new_pizza`
    const pizzaObjectStore = transaction.objectStore('new_object_store_PWA_Challenge');
  
    // add record to your store with add method
    pizzaObjectStore.add(record);
  }