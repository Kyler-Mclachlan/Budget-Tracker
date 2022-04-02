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
  
    const budgetObjectStore = transaction.objectStore('new_object_store_PWA_Challenge');

    // add record to your store with add method.
    budgetObjectStore.add(record);
  }


  function uploadBudget() {
    // open a transaction on your pending db
    const transaction = db.transaction(['new_object_store_PWA_Challenge'], 'readwrite');
  
    // access your pending object store
    const budgetObjectStore = transaction.objectStore('new_object_store_PWA_Challenge');
  
    // get all records from store and set to a variable
    const getAll = budgetObjectStore.getAll();
  
    getAll.onsuccess = function() {
      // if there was data in indexedDb's store, let's send it to the api server
      if (getAll.result.length > 0) {
        fetch('/api/transaction', {
          method: 'POST',
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(serverResponse => {
            if (serverResponse.message) {
              throw new Error(serverResponse);
            }
  
            const transaction = db.transaction(['new_object_store_PWA_Challenge'], 'readwrite');
            const budgetObjectStore = transaction.objectStore('new_object_store_PWA_Challenge');
            // clear all items in your store
            budgetObjectStore.clear();
          })
          .catch(err => {
            // set reference to redirect back here
            console.log(err);
          });
      }
    };
  }
  
  // listen for app coming back online
  window.addEventListener('online', uploadBudget);
  