// Campus Circle — beginner-friendly prototype
// All activity data lives in this array (no database yet).

const activities = [
  {
    id: 1,
    name: "Driving range session",
    description: "Casual afternoon at the campus driving range. Beginners welcome — bring your own clubs if you have them.",
    date: "2026-10-18",
    time: "15:00",
    location: "Campus Golf Range",
    category: "Sports",
    maxParticipants: 6,
    joined: 2
  },
  {
    id: 2,
    name: "Midterm study group",
    description: "Quiet group for reviewing intro CS notes. We will work through practice problems together.",
    date: "2026-10-14",
    time: "19:00",
    location: "Main Library, Room 204",
    category: "Study",
    maxParticipants: 8,
    joined: 5
  },
  {
    id: 3,
    name: "Sunday art session",
    description: "Sketch, paint, or doodle. No experience needed — just bring a notebook.",
    date: "2026-10-19",
    time: "13:30",
    location: "Student Union lounge",
    category: "Art",
    maxParticipants: 10,
    joined: 10
  }
];

const listEl = document.getElementById("activity-list");
const formEl = document.getElementById("activity-form");

// Turn a number like 15:00 into a friendlier 3:00 PM
function formatTime(time) {
  const [hourString, minute] = time.split(":");
  let hour = Number(hourString);
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${suffix}`;
}

function spotsLeft(activity) {
  return activity.maxParticipants - activity.joined;
}

// Build one card and add it to the page
function createCard(activity) {
  const remaining = spotsLeft(activity);
  const isFull = remaining <= 0;

  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <span class="category">${activity.category}</span>
    <h3>${activity.name}</h3>
    <p>${activity.description}</p>
    <p class="meta">${activity.date} · ${formatTime(activity.time)}</p>
    <p class="meta">${activity.location}</p>
    <p class="meta spots ${isFull ? "full-text" : ""}">
      ${isFull ? "No spots left" : `${remaining} spot${remaining === 1 ? "" : "s"} left`}
      (${activity.joined}/${activity.maxParticipants} joined)
    </p>
    <button class="btn btn-join" type="button" ${isFull ? "disabled" : ""}>
      ${isFull ? "Full" : "Join activity"}
    </button>
  `;

  const joinButton = card.querySelector(".btn-join");
  joinButton.addEventListener("click", function () {
    joinActivity(activity.id);
  });

  return card;
}

// Clear the grid, then draw every activity as a card
function renderActivities() {
  listEl.innerHTML = "";
  activities.forEach(function (activity) {
    listEl.appendChild(createCard(activity));
  });
}

function joinActivity(id) {
  const activity = activities.find(function (item) {
    return item.id === id;
  });

  if (!activity || spotsLeft(activity) <= 0) {
    return;
  }

  activity.joined += 1;
  renderActivities();
}

// When the form is submitted, add a new activity object and redraw the list
formEl.addEventListener("submit", function (event) {
  event.preventDefault(); // stay on this page instead of refreshing

  const data = new FormData(formEl);

  activities.push({
    id: Date.now(), // simple unique id
    name: data.get("name").trim(),
    description: data.get("description").trim(),
    date: data.get("date"),
    time: data.get("time"),
    location: data.get("location").trim(),
    category: data.get("category"),
    maxParticipants: Number(data.get("maxParticipants")),
    joined: 0
  });

  formEl.reset();
  renderActivities();
  document.getElementById("listings").scrollIntoView({ behavior: "smooth" });
});

renderActivities();
