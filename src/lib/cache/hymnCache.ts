import type { icoHymn } from "$lib/songbook/types";

const DB_NAME = "hymnCache";
const STORE_NAME = "recentHymns";
const MAX_RECENT = 5;

export async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "number" });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
  });
}

export async function addRecentHymn(hymn: icoHymn) {
  const db = await initDB() as IDBDatabase;
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  // Add timestamp to hymn
  const hymnWithTimestamp = {
    ...hymn,
    timestamp: Date.now(),
  };

  // Add new hymn
  await store.put(hymnWithTimestamp);

  // Get all hymns and remove oldest if we're over the limit
  const count = await store.count();
  if (count > MAX_RECENT) {
    const index = store.index("timestamp");
    const oldest = await index.getAllKeys(undefined, 1);
    if (oldest.length > 0) {
      await store.delete(oldest[0]);
    }
  }

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(undefined);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getRecentHymns(): Promise<icoHymn[]> {
  const db = await initDB() as IDBDatabase;
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const index = store.index("timestamp");

  return new Promise((resolve, reject) => {
    const request = index.getAll(undefined, MAX_RECENT);
    request.onsuccess = () => {
      const hymns = request.result;
      // Sort by most recent first
      hymns.sort((a, b) => b.timestamp - a.timestamp);
      resolve(hymns);
    };
    request.onerror = () => reject(request.error);
  });
}
