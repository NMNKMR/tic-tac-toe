import { initializeApp } from "firebase/app";
import { getDatabase, ref} from "firebase/database";
import { fbConfig } from "../conf/env.config";

const firebaseConfig = {
  apiKey: fbConfig.apiKey,
  authDomain: fbConfig.authDomain,
  databaseURL: fbConfig.databaseURL,
  projectId: fbConfig.projectId,
  storageBucket: fbConfig.storageBucket,
  messagingSenderId: fbConfig.messagingSenderId,
  appId: fbConfig.appId,
  measurementId: fbConfig.measurementId,
};

const getGameRef = (path="")=> {
  return ref(database, "games/" + path);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export {getGameRef, app};