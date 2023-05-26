importScripts('https://www.gstatic.com/firebasejs/8.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.20.0/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyDMd_e1WG0BtSy4aTvRYNdIXYoGdb89sAE",
    authDomain: "analystpro-e54fc.firebaseapp.com",
    projectId: "analystpro-e54fc",
    storageBucket: "analystpro-e54fc.appspot.com",
    messagingSenderId: "643885768376",
    appId: "1:643885768376:web:b6521cf51f7b25c0079e4d",
    measurementId: "G-5TJ8C0XVDV"
});

const messaging = firebase.messaging();