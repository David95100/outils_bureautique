// Fonction pour ajouter une tâche
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    if (taskInput.value.trim() === '') {
        alert('Veuillez entrer une tâche.');
        return;
    }

    const li = document.createElement('li');
    li.appendChild(document.createTextNode(taskInput.value));
    li.onclick = function() {
        confirmAndDeleteTask(this);
    };

    taskList.appendChild(li);
    taskInput.value = '';
}

// Fonction pour cocher/décocher une tâche
function toggleTask(task) {
    task.classList.toggle('checked');
}

// Fonction pour confirmer la suppression avant de supprimer une tâche
function confirmAndDeleteTask(task) {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?');
    if (confirmation) {
        task.remove();
    }
}

// Ajouter la possibilité de supprimer une tâche en cliquant dessus
const taskList = document.getElementById('taskList');
taskList.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
        confirmAndDeleteTask(ev.target);
    }
});


document.addEventListener("DOMContentLoaded", function () {
    renderCalendar();
});

function renderCalendar() {
    const calendarContainer = document.getElementById("calendar");

    const today = new Date();
    const currentMonth = today.getMonth();
    const daysInMonth = new Date(today.getFullYear(), currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), currentMonth, 1).getDay();

    const daysOfWeek = [ "L", "M", "M", "J", "V", "S","D"];

    // Création de l'en-tête du calendrier
    const headerRow = document.createElement("div");
    headerRow.classList.add("day");
    daysOfWeek.forEach(day => {
        const dayCell = document.createElement("div");
        dayCell.textContent = day;
        headerRow.appendChild(dayCell);
    });
    calendarContainer.appendChild(headerRow);

    // Ajout des jours du mois au calendrier
    for (let i = 0; i < daysInMonth + firstDayOfMonth; i++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("day");

        if (i >= firstDayOfMonth) {
            const dayNumber = i - firstDayOfMonth + 1;
            dayCell.textContent = dayNumber;

            if (today.getDate() === dayNumber && today.getMonth() === currentMonth) {
                dayCell.classList.add("current-month");
            }

            dayCell.addEventListener("click", () => showEvents(dayNumber));
            dayCell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                addEvent(dayCell, dayNumber);
            });
        }

        calendarContainer.appendChild(dayCell);
    }
}

function showEvents(day) {
    const eventsContainer = document.querySelector(".events");
    eventsContainer.innerHTML = "";

    const events = getEventsForDay(day);

    if (events.length > 0) {
        events.forEach(event => {
            const eventElement = document.createElement("div");
            eventElement.classList.add("event");
            eventElement.textContent = event;
            eventsContainer.appendChild(eventElement);
        });
    } else {
        const noEventsElement = document.createElement("div");
        noEventsElement.textContent = "Clique droit pour ajouter un évènement";
        eventsContainer.appendChild(noEventsElement);
    }
}

function getEventsForDay(day) {
    const events = {
        5: ["Réunion", "Déjeuner avec un ami"],
        15: ["Conférence"],
        20: ["Rendez-vous chez le médecin", "Dîner en famille"],
    };

    return events[day] || [];
}

function addEvent(dayCell, day) {
    const eventName = prompt(`Ajouter un événement pour le ${day}/${new Date().getMonth() + 1}`);

    if (eventName) {
        const eventElement = document.createElement("div");
        eventElement.classList.add("event");
        eventElement.textContent = eventName;

        let dayEventsContainer = dayCell.querySelector(".day-events");
        if (!dayEventsContainer) {
            dayEventsContainer = document.createElement("div");
            dayEventsContainer.classList.add("day-events");
            dayCell.appendChild(dayEventsContainer);
        }
        dayEventsContainer.appendChild(eventElement);
    }
}
  
//calculatrice: 
function appendToDisplay(value) {
    document.getElementById('display').value += value;
}

function clearDisplay() {
    document.getElementById('display').value = '';
}

function calculateResult() {
    const displayValue = document.getElementById('display').value;
    try {
        const result = eval(displayValue);
        document.getElementById('display').value = result;
    } catch (error) {
        document.getElementById('display').value = 'Error';
    }
}


//dictionnaire:
function search() {
    let word = document.getElementById('text').value;
    let resultat = document.getElementById('resultat');
    

    if (word.length !== 0) {
        let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                try {
                    let definition = data[0].meanings[0].definitions[0].definition;
                    resultat.innerHTML = `<p class='res'><span>Définition :<br></span><br>${definition}</p>`;
                } catch (err) {
                    resultat.innerHTML = "<p class='res'>Aucune définition trouvée !</p>";
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                resultat.innerHTML = "<p class='res'>Erreur lors de la recherche.</p>";
            });
    } else {
        resultat.innerHTML = "<p class='res'>Veuillez remplir ce champ !</p>";
    }
}

const currentTime = document.querySelector("h2"),
content = document.querySelector(".content"),
selectMenu = document.querySelectorAll("select"),
setAlarmBtn = document.getElementById("button");

let alarmTime, isAlarmSet,
ringtone = new Audio("assets/music/ringtone.mp3");

for (let i = 12; i > 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[0].firstElementChild.insertAdjacentHTML("afterend", option);
}

for (let i = 59; i >= 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[1].firstElementChild.insertAdjacentHTML("afterend", option);
}

for (let i = 2; i > 0; i--) {
    let ampm = i == 1 ? "AM" : "PM";
    let option = `<option value="${ampm}">${ampm}</option>`;
    selectMenu[2].firstElementChild.insertAdjacentHTML("afterend", option);
}

setInterval(() => {
    let date = new Date(),
    h = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds(),
    ampm = "AM";
    if(h >= 12) {
        h = h - 12;
        ampm = "PM";
    }
    h = h == 0 ? h = 12 : h;
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    currentTime.innerText = `${h}:${m}:${s} ${ampm}`;

    if (alarmTime === `${h}:${m} ${ampm}`) {
        ringtone.play();
        ringtone.loop = true;
    }
});

function setAlarm() {
    if (isAlarmSet) {
        alarmTime = "";
        ringtone.pause();
        content.classList.remove("disable");
        setAlarmBtn.innerText = "Set Alarm";
        return isAlarmSet = false;
    }

    let time = `${selectMenu[0].value}:${selectMenu[1].value} ${selectMenu[2].value}`;
    if (time.includes("Hour") || time.includes("Minute") || time.includes("AM/PM")) {
        return alert("SVP, choisissez un temps correct pour l'alarme");
    }
    alarmTime = time;
    isAlarmSet = true;
    content.classList.add("disable");
    setAlarmBtn.innerText = "Clear Alarm";
}

setAlarmBtn.addEventListener("click", setAlarm);
