import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore/lite';
import { firebaseConfig } from './firebaseConfig';

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const iicmTeams = collection(db, 'iicmTeams');
const iicmEvents = collection(db, 'iicmEvents');


// Timeline Stuff

const allEventData = async () => {
    const eventQuery = query(iicmEvents);
    const eventSnapshot = await getDocs(eventQuery);
    let eventData = [];
    eventSnapshot.forEach((doc) => {
        const perEventData = doc.data();
        perEventData.day = parseInt(perEventData.WhichDay.split(" ")[1]);
        eventData.push(perEventData);
    });

    eventData.sort((a, b) => a.day === b.day ? a.Time.seconds - b.Time.seconds : a.day - b.day);

    return eventData;
}

const populateTimeline = async () => {
    const eventData = await allEventData();
    const timelineContainer = document.querySelector('.timeline-content ul');

    eventData.forEach((event, index) => {
        const eventElement = document.createElement('li');
        eventElement.classList.add('event');

        const posterElement = document.createElement('img');
        posterElement.classList.add('event-poster');
        posterElement.src = event.Poster;

        const detailsElement = document.createElement('div');
        detailsElement.classList.add('event-details');
        detailsElement.innerHTML = `
            <h1>${event.Name}</h1>
            <p>${event.Description}</p>
        `;

        eventElement.appendChild(posterElement);
        eventElement.appendChild(detailsElement);

        if (index === 0 || event.day !== eventData[index - 1]?.day) {
            const dayElement = document.createElement('li');
            dayElement.classList.add('day');
            dayElement.textContent = `DAY ${event.day}`;
            timelineContainer.appendChild(dayElement);
        }

        timelineContainer.appendChild(eventElement);
    });
}


// Leaderboard Stuff

const allTeamData = async () => {
    const teamQuery = query(iicmTeams);
    const teamSnapshot = await getDocs(teamQuery);
    let teamData = [];
    teamSnapshot.forEach((doc) => {
        teamData.push(doc.data());
    });
    teamData.sort((a, b) => b.Points - a.Points);
    return teamData;
}

const populateLeaderboard = async () => {

    const teamData = await allTeamData();


};

//Populate DOM
document.addEventListener('DOMContentLoaded', () => {
    populateTimeline();
});