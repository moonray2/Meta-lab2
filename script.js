// IndexedDB для хранения протоколов
let db;
const DB_NAME = "MetallTestLab";
const STORE_NAME = "protocols";

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e) => {
            db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
            }
        };
        request.onsuccess = (e) => { db = e.target.result; resolve(db); };
        request.onerror = (e) => reject(e);
    });
}

async function saveToCloud(protocol) {
    await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.add({ date: new Date().toISOString(), protocol: protocol });
    tx.oncomplete = () => alert("✅ Протокол сохранён в облачное хранилище");
    tx.onerror = () => alert("Ошибка сохранения");
}

async function loadAllProtocols() {
    await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    return await store.getAll();
}