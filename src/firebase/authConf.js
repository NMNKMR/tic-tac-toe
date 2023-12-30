import { app } from "./databaseConf"
import {getAuth, signInAnonymously} from 'firebase/auth'

const auth = getAuth(app);

signInAnonymously(auth)
.then((userCredential) => {
    // const user = userCredential.user;
    // console.log('Anonymous user signed in:', user.uid);
})
.catch((error) => {
    console.error('Error signing in anonymously:', error.message);
});

export default auth;