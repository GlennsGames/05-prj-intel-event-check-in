//Buttons/HTML Elements
const form = document.getElementById('checkInForm');
const attendeeName = document.getElementById('attendeeName');
const teamSelect = document.getElementById('teamSelect');
const attendeeCountValue = document.getElementById('attendeeCount');
const progressBar = document.getElementById('progressBar');
const celebration = document.getElementById('celebration');

//Variables
let attendeeCount = 0;
let teamCounts = { water: 0, zero: 0, power: 0 };

const teamLabels = {
    water: 'Team Water Wise',
    zero: 'Team Net Zero',
    power: 'Team Renewables',
};

const MAX_ATTENDEES = 50;
const STORAGE_KEY = 'eventCheckInState';

//Save current counts so they survive a page reload
function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ attendeeCount, teamCounts }));
}

//Find the team(s) with the most check-ins
function getWinningTeams() {
    const maxCount = Math.max(...Object.values(teamCounts));
    return Object.keys(teamCounts).filter((team) => teamCounts[team] === maxCount);
}

//Show which team won once max attendees is reached
function showCelebration() {
    const winners = getWinningTeams().map((team) => teamLabels[team]);
    const winnerText = winners.length > 1
        ? `${winners.join(' & ')} tie for the win`
        : `${winners[0]} wins`;

    celebration.textContent = `We've reached ${MAX_ATTENDEES} attendees! ${winnerText}!`;
    celebration.classList.add('celebration-message');
    celebration.style.display = "block";
}

//Restore counts and page state from localStorage on load
function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const parsed = JSON.parse(saved);
    attendeeCount = parsed.attendeeCount || 0;
    teamCounts = { ...teamCounts, ...parsed.teamCounts };

    const progress = Math.round((attendeeCount / MAX_ATTENDEES) * 100);
    progressBar.style.width = `${progress}%`;
    attendeeCountValue.textContent = attendeeCount;

    Object.keys(teamCounts).forEach((team) => {
        const teamCountElement = document.getElementById(`${team}Count`);
        if (teamCountElement) {
            teamCountElement.textContent = teamCounts[team];
        }
    });

    if (attendeeCount >= MAX_ATTENDEES) {
        showCelebration();
    }
}

loadState();

//Check in submission Form and update values
form.addEventListener('submit', function(event) {
    event.preventDefault();

    if (attendeeCount >= MAX_ATTENDEES) {
        alert(`Max attendees (${MAX_ATTENDEES}) reached! Check-in is closed.`);
        return;
    }

    const name = attendeeName.value.trim();
    const team = teamSelect.value;
    attendeeCount++;

    //update progress bar
    const progress = Math.round((attendeeCount / MAX_ATTENDEES) * 100);
    progressBar.style.width = `${progress}%`;
    console.log(`Progress: ${progress}%`);

    //update text content of the attendee count and team counts
    attendeeCountValue.textContent = attendeeCount;
    console.log(`Attendee added: ${name} (${team}) - TotalAttendees: ${attendeeCount}`);

    if (teamCounts[team] !== undefined) {
        teamCounts[team]++;
        const teamCountElement = document.getElementById(`${team}Count`);
        if (teamCountElement) {
            teamCountElement.textContent = teamCounts[team];
        }
    }

    const teamName = teamSelect.options[teamSelect.selectedIndex].text;
    console.log(`Team selected: ${teamName}`);
    const welcomeMessage = (`Welcome, ${name} to team ${teamName}!`);
    console.log(welcomeMessage);
    const greeting = document.getElementById('greeting');
    greeting.textContent = welcomeMessage;
    greeting.classList.toggle('success-message');
    greeting.style.display = "block";
    //form.reset();

   saveState();

    if (attendeeCount >= MAX_ATTENDEES) {
        showCelebration();
    }
});


    