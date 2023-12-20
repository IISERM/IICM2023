import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  getDocs,
} from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const iicmTeams = collection(db, "iicmTeams");
const iicmEvents = collection(db, "iicmEvents");

// Timeline Stuff

const allEventData = async () => {
  const eventQuery = query(iicmEvents);
  const eventSnapshot = await getDocs(eventQuery);
  let eventData = [];
  let onlineEventData = [];
  eventSnapshot.forEach((doc) => {
    const perEventData = doc.data();
    const parsedDay = parseInt(perEventData.WhichDay.split(" ")[1]);
    perEventData.day = isNaN(parsedDay) ? "Online" : parsedDay;

    if ( typeof perEventData.day === 'number' ){
      eventData.push(perEventData);
    }
    else {
      onlineEventData.push(perEventData);
    }
    
  });
  eventData.sort((a, b) =>
    a.day === b.day ? a.Time.seconds - b.Time.seconds : a.day - b.day,
  );

  const allEventData = [...eventData, ...onlineEventData];

  return allEventData;
};

const populateTimeline = async () => {
  const eventData = await allEventData();
  const timelineContainer = document.querySelector(".timeline-content ul");

  eventData.forEach((event, index) => {
    const eventElement = document.createElement("li");
    eventElement.classList.add("event");

    const posterElement = document.createElement("img");
    posterElement.classList.add("event-poster");
    posterElement.src = event.Poster;

    const detailsElement = document.createElement("div");
    detailsElement.classList.add("event-details");
    detailsElement.innerHTML = `
            <h1>${event.Name}</h1>
            <p>${event.Description}</p>
        `;

    eventElement.appendChild(posterElement);
    eventElement.appendChild(detailsElement);

    if ( typeof event.day === 'number' && (index === 0 || event.day !== eventData[index - 1]?.day) ){
      const dayElement = document.createElement("li");
      dayElement.classList.add("day");
      const nbsp = "\u00A0";
      dayElement.textContent = `${nbsp}DAY ${event.day}`;
      timelineContainer.appendChild(dayElement);
    }
    else if ( event.day === 'Online' ){
      const dayElement = document.createElement("li");
      dayElement.classList.add("day");
      const nbsp = "\u00A0";
      dayElement.textContent = `Online Events`;
      timelineContainer.appendChild(dayElement);
    }

    timelineContainer.appendChild(eventElement);
  });
};

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
};

// Function to populate event dropdown
const populateEventDropdown = async () => {
  const eventDropdown = document.getElementById("event-dropdown");

  const preFilterEventData = await allEventData();

  //remove the first and last events
  preFilterEventData.shift();
  preFilterEventData.pop();

  const eventData = preFilterEventData.filter((event) => event.ResultsDeclared);
  eventData.unshift({ ID: "Overall", Name: "Overall" });

  eventData.forEach((event) => {
    const optionElement = document.createElement("option");
    optionElement.value = event.Name;
    optionElement.textContent = event.Name;
    eventDropdown.appendChild(optionElement);
  });
};

// Function to populate Podium
const populateOverallPodium = (container, teams) => {
  container.innerHTML = ""; // Clear existing content

  // Sort teams array to have the order 2nd, 1st, 3rd
  const sortedTeams = [teams[1], teams[0], teams[2]];

  sortedTeams.forEach((team, index) => {
    const podiumElement = document.createElement("div");
    podiumElement.classList.add("podium_insti");

    const rankElement = document.createElement("span");
    rankElement.classList.add(
      index === 0 ? "second" : index === 1 ? "first" : "third",
    );

    const logoElement = document.createElement("img");
    logoElement.classList.add("insti_logo");
    logoElement.src = team.Logo;
    logoElement.alt = team.Name;

    const medalElement = document.createElement("img");
    medalElement.src =
      index === 0
        ? "assets/elements/silver.png"
        : index === 1
          ? "assets/elements/gold.png"
          : "assets/elements/bronze.png";
    medalElement.style.height = "3.2rem";
    medalElement.style.marginTop = "1rem";

    const pointsElement = document.createElement("h3");
    pointsElement.textContent = `${team.Points}PTS`;

    const nameElement = document.createElement("h1");
    nameElement.textContent = team.Name;

    podiumElement.appendChild(rankElement);
    rankElement.appendChild(logoElement);
    podiumElement.appendChild(medalElement);
    podiumElement.appendChild(pointsElement);
    podiumElement.appendChild(nameElement);

    container.appendChild(podiumElement);
  });
};

const populateEventPodium = (container, teams, event) => {
  container.innerHTML = ""; // Clear existing content

  // Sort teams array to have the order 2nd, 1st, 3rd
  const sortedTeams = [teams[1], teams[0], teams[2]];

  const eventPoints = [event.Point2, event.Point1, event.Point3];

  sortedTeams.forEach((team, index) => {
    const podiumElement = document.createElement("div");
    podiumElement.classList.add("podium_insti");

    const rankElement = document.createElement("span");
    rankElement.classList.add(
      index === 0 ? "second" : index === 1 ? "first" : "third",
    );

    const logoElement = document.createElement("img");
    logoElement.classList.add("insti_logo");
    logoElement.src = team.Logo;
    logoElement.alt = team.Name;

    const medalElement = document.createElement("img");
    medalElement.src =
      index === 0
        ? "assets/elements/silver.png"
        : index === 1
          ? "assets/elements/gold.png"
          : "assets/elements/bronze.png";
    medalElement.style.height = "3.2rem";
    medalElement.style.marginTop = "1rem";

    const pointsElement = document.createElement("h3");
    pointsElement.textContent = `${eventPoints[index]}PTS`;

    const nameElement = document.createElement("h1");
    nameElement.textContent = team.Name;

    podiumElement.appendChild(rankElement);
    rankElement.appendChild(logoElement);
    podiumElement.appendChild(medalElement);
    podiumElement.appendChild(pointsElement);
    podiumElement.appendChild(nameElement);

    container.appendChild(podiumElement);
  });
};

const populateOthers = (container, teams) => {
  container.innerHTML = ""; // Clear existing content

  teams.slice(3).forEach((team) => {
    const teamElement = document.createElement("div");
    teamElement.classList.add("team");

    const circleElement = document.createElement("span");
    circleElement.classList.add("other-team-circle");

    const logoElement = document.createElement("img");
    logoElement.classList.add("other-team-logo");
    logoElement.src = team.Logo;
    logoElement.alt = team.Name;

    const nameElement = document.createElement("h3");
    nameElement.textContent = team.Name;

    const pointsElement = document.createElement("h4");
    pointsElement.textContent = `POINTS: ${team.Points}`;

    teamElement.appendChild(circleElement);
    circleElement.appendChild(logoElement);
    teamElement.appendChild(nameElement);
    teamElement.appendChild(pointsElement);

    container.appendChild(teamElement);
  });
};

// Function to populate Leaderboard
const populateLeaderboard = async (selectedEvent) => {
  const teamData = await allTeamData();
  const podiumContainer = document.querySelector(".podium");

  if (selectedEvent === "Overall") {
    populateOverallPodium(podiumContainer, teamData);
    const othersContainer = document.querySelector(".others .teams");
    populateOthers(othersContainer, teamData);
    const othersContainerParent = document.querySelector(".others");
    othersContainerParent.style.display = "block";
    return;
  }

  const eventData = await allEventData();
  const event = eventData.find((event) => event.Name === selectedEvent);
  const firstTeam = teamData.find((team) => team.Name === event.First);
  const secondTeam = teamData.find((team) => team.Name === event.Second);
  const thirdTeam = teamData.find((team) => team.Name === event.Third);

  populateEventPodium(
    podiumContainer,
    [firstTeam, secondTeam, thirdTeam],
    event,
  );
  const othersContainer = document.querySelector(".others");
  // remove the others container permanently
  othersContainer.style.display = "none";
};

//Populate DOM
document.addEventListener("DOMContentLoaded", () => {
  populateTimeline();
  populateEventDropdown();
  populateLeaderboard("Overall");

  const eventDropdown = document.getElementById("event-dropdown");
  eventDropdown.addEventListener("change", (event) => {
    const selectedEventID = event.target.value;
    populateLeaderboard(selectedEventID);
  });
});
