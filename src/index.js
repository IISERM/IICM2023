// src/index.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore/lite';
import { firebaseConfig } from './firebaseConfig';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const iicmTeams = collection(db, 'iicmTeams');
const iicmEvents = collection(db, 'iicmEvents');

const allEventData = async () => {
    const eventQuery = query(iicmEvents);
    const eventSnapshot = await getDocs(eventQuery);
    let eventData = [];
    eventSnapshot.forEach((doc) => {
        eventData.push(doc.data());
    });
    return eventData;
}

const allTeamData = async () => {
    const teamQuery = query(iicmTeams);
    const teamSnapshot = await getDocs(teamQuery);
    let teamData = [];
    teamSnapshot.forEach((doc) => {
        teamData.push(doc.data());
    });
    return teamData;
}

console.log(await allTeamData());
console.log(await allEventData());