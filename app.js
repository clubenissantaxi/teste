const firebaseConfig = {
  apiKey: "AIzaSyBfBqOOcOmog_6V9ZUxc02PtVYv2Z64mEQ",
  authDomain: "autofaq-c0c21.firebaseapp.com",
  databaseURL: "https://autofaq-c0c21-default-rtdb.firebaseio.com",
  projectId: "autofaq-c0c21",
  storageBucket: "autofaq-c0c21.appspot.com",
  messagingSenderId: "174442660737",
  appId: "1:174442660737:web:2c2405b7bc3439c10a1e80"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
console.log("Firebase inicializado");

// Existing geolocation functions...
function calculateDistance(lat1, lon1, lat2, lon2) { /* ... */ }
function initializeMap(elementId, center = [-23.5505, -46.6333]) { /* ... */ }
function initializeDriver() { /* ... */ }
function initializePassenger() { /* ... */ }
