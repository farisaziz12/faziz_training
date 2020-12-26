import firebase from "firebase/app";
import "firebase/auth";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
};

class Auth {
  constructor(config) {
    if (!firebase.apps.length) {
      this.app = firebase.initializeApp(config);
      this.auth = firebase.auth();
    }
  }

  login(email, password) {
    return new Promise((resolve, reject) => {
      this.auth
        .signInWithEmailAndPassword(email, password)
        .then(() => resolve(this.auth.currentUser))
        .catch((error) => reject(error.message));
    });
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");

    return new Promise((resolve, reject) => {
      this.auth
        .signInWithPopup(provider)
        .then((resp) => resolve(resp.user))
        .catch((error) => reject(error.message));
    });
  }

  signUp(email, password, passwordConfirm) {
    if (email && password === passwordConfirm) {
      return new Promise((resolve, reject) => {
        this.auth
          .createUserWithEmailAndPassword(email, password)
          .then(() => {
            /*
              Sends verification email using firebase
              if sign up is successful
            */
            this.auth.currentUser.sendEmailVerification();
            resolve(this.auth.currentUser);
          })
          .catch((error) => reject(error.message));
      });
    } else {
      throw new Error("Passwords do not match");
    }
  }

  signOut() {
    return new Promise((resolve, reject) => {
      this.auth
        .signOut()
        .then(() => {
          // Sign-out successful
          resolve({
            success: true,
          });
        })
        .catch((error) => reject(error.message));
    });
  }

  getCurrentUser() {
    return new Promise((resolve, reject) => {
      if (this.auth) {
        this.auth.onAuthStateChanged((currentUser) => {
          if (currentUser) {
            //  If user is logged in firebase returns current user data
            resolve(currentUser);
          } else {
            // If no user is signed in currentUser is null
            reject("No user logged in");
          }
        });
      } else {
        reject("No user logged in");
      }
    });
  }
}

export const auth = new Auth(config);
