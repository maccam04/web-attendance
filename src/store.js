import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Initialize Firebase, copied from cloud console
var firebaseConfig = {
  apiKey: "AIzaSyCxQMc0A3NgahpI1gP9J6dT6fhVj_dClig",
  authDomain: "virtualattendance-9bf44.firebaseapp.com",
  databaseURL: "https://virtualattendance-9bf44.firebaseio.com",
  projectId: "virtualattendance-9bf44",
  storageBucket: "virtualattendance-9bf44.appspot.com",
  messagingSenderId: "793352634157",
  appId: "1:793352634157:web:9ac7aecb652a983ed31da4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// the shared state object that any vue component
// can get access to
export const store = {
  currentUser: null,
};

export const firebaseInstance = {
   firebase
}

// When a user logs in or out, save that in the store
firebase.auth().onAuthStateChanged((user) => {

  store.currentUser = user;
});


export const rooms = {
    roomList: []
}

const roomsCollection = firebase.firestore()
      .collection('Rooms')

      roomsCollection.get()
      .then(snapshot => {
        const roomsData = [];

          snapshot.forEach(doc => {
            roomsData.push(doc)
          })

          rooms.roomList = roomsData;
      });






