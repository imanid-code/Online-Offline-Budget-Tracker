let db;

//in order to create db you must request to open a db instance
//name and version
const request = indexedDB.open("budget", 1);

//either create or use existing table 
request.onupgradeneeded = function(event) {
    //
    const db = event.target.result;
    //createObjectStore = table 
    //Auto-increment allows a unique number to be generated automatically when a new record is inserted into a table.
    db.createObjectStore("transaction", { autoIncrement: true})
};

//when request is successful will return new db
request.onsuccess = function(event) {
    db = event.target.result;
//Returns the online status of the browser
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function(event) {
    console.error(event.target.errorCode);
};

function saveRecord(record) {
    //obj and type of interaction
    const transaction = db.transaction(["transaction"], "readwrite");
    //creates table called transaction
    const store = transaction.objectStore("transaction");
    //add record to table
   store.add(record);
}
function checkDatabase(){
    //obj and type of interaction
    const transaction = db.transaction(["transaction"], "readwrite");
    //creates table called transaction
    const store = transaction.objectStore("transaction");
 //gets all data from the store
 const getAll = store.getAll();
    //once getAll is successfull it will run the function
    getAll.onsuccess = function(){
        if(getAll.result.length > 0){
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["transaction"], "readwrite");
                const store = transaction.objectStore("transaction");
                //clears transation table 
                store.clear();
            });
        }
    };
}

window.addEventListener("online", checkDatabase)