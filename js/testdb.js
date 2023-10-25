const list = [
    {nom:"pi", prenom: "ké", age:34},
    {nom:"ma", prenom: "ce", age:27},
    {nom:"pi", prenom: "lu", age:0}
];
const DB = new Promise((resolve, reject) => {
    const request = window.indexedDB.open("data", 1);
    /*request.onupgradeneeded = () => {
        console.log(request.result);
        request.result.createObjectStore("list", {autoIncrement:true});
    };*/
    request.onsuccess = () => {
        resolve(request);
    };
    request.onerror = e => reject(e);
});
const DB2 = DB.then(request => {
    request.result.createObjectStore("list", {autoIncrement:true});
    
    request.onsuccess = () => {
        console.log(request);
        resolve(request);
    };
    request.onerror = e => reject(e);
})
const migrate = list => {
    DB2.then(db => {
        console.log(db);
        const tx = db.transaction("list", "readwrite");
        const store = tx.objectStore("list");
        list.foreach(item => store.add(item));
    });
}

const getList = () => {
    DB2.then(db => {
        const request = db.transaction("list").objectStore("list").getAll();
        request.onsuccess = e => console.log(e.target.result);
    })
};

migrate(list);
//getList();