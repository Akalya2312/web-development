let attendeeCount = 1;
let registeredEmails = new Set();

document.addEventListener("DOMContentLoaded", function () {
    updateCosts();
});

function addAttendee() {
    const addButton = document.querySelector("button[onclick='addAttendee()']");
     

    attendeeCount++;
    const attendeesDiv = document.getElementById("attendees");
    const newAttendee = document.createElement("div");
    newAttendee.classList.add("attendee");
    newAttendee.innerHTML = `
        <h3>Attendee ${attendeeCount}</h3>
        <label>Name: <input type="text" name="name" required></label>
        <label>Email: <input type="email" name="email" required onblur="validateEmail(this)"></label>
        <label>Age: <input type="number" name="age" required onblur="validateAge(this)"></label>

        <label>Session Selection:</label>
        <div class="sessions">
            <label><input type="checkbox" name="session" value="session1" data-time="10:00-12.00pm" data-cost="50" onchange="checkConflicts(this)"> Session 1 - 10:00-12.00pm($50)</label>
            <label><input type="checkbox" name="session" value="session2" data-time="10:00-12.00pm" data-cost="40" onchange="checkConflicts(this)"> Session 2 - 10:00-12.00pm ($40)</label>
            <label><input type="checkbox" name="session" value="session3" data-time="12:00-1.00pm" data-cost="60" data-min-age="18" onchange="checkConflicts(this)"> Session 3 (18+ Only) - 12:00-1.00 PM ($60)</label>
        </div>

        <label>Special Requirements:
            <textarea name="specialReq"></textarea>
        </label>
        <label>Registration Cost: <span class="cost">$0</span></label>
    `;
    attendeesDiv.appendChild(newAttendee);
}
function confirmAttendee(button) {
    const attendeeDiv = button.closest(".attendee");
    const name = attendeeDiv.querySelector('input[name="name"]').value.trim();
    const email = attendeeDiv.querySelector('input[name="email"]').value.trim();
    const age = attendeeDiv.querySelector('input[name="age"]').value.trim();
    const sessions = Array.from(attendeeDiv.querySelectorAll('input[name="session"]:checked'))
                          .map(s => s.value)
                          .join(", ");

    if (!name || !email || !age || sessions.length === 0) {
        alert("Please fill in all required fields and select at least one session.");
        return;
    }

    if (!confirm(`Confirm registration for:\nName: ${name}\nEmail: ${email}\nAge: ${age}\nSessions: ${sessions}`)) {
        return;
    }

    
    const addButton = document.querySelector("button[onclick='addAttendee()']");
    addButton.disabled = false; // Enable adding another attendee
}


function validateEmail(emailInput) {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        alert("Invalid email address");
        emailInput.value = "";
        return;
    }
    
    if (registeredEmails.has(email)) {
        alert("This email is already registered.");
        emailInput.value = "";
        return;
    }
    
    registeredEmails.add(email);
}

function validateAge(ageInput) {
    const age = parseInt(ageInput.value.trim(), 10);
    if ( age <= 0) {
        alert("Please enter a valid age");
        ageInput.value = "";
        return;
    }
}

function checkConflicts(checkbox) {
    const parent = checkbox.closest(".attendee");
    const ageInput = parent.querySelector("input[name='age']");
    const age = parseInt(ageInput.value, 10);
    const minAge = parseInt(checkbox.getAttribute("data-min-age"), 10);
    
    if (minAge && (!age || age < minAge)) {
        alert("You must be at least " + minAge + " years old to attend this session.");
        checkbox.checked = false;
        return;
    }
    
    const checkboxes = parent.querySelectorAll("input[name='session']");
    checkboxes.forEach(cb => {
        if (cb !== checkbox && cb.checked && cb.getAttribute("data-time") === checkbox.getAttribute("data-time")) {
            alert("You cannot select overlapping sessions.");
            checkbox.checked = false;
        }
    });
    updateCosts();
}

function updateCosts() {
    document.querySelectorAll(".attendee").forEach(attendee => {
        let totalCost = 0;
        attendee.querySelectorAll("input[name='session']:checked").forEach(session => {
            totalCost += parseInt(session.getAttribute("data-cost"), 10);
        });
        attendee.querySelector(".cost").textContent = `$${totalCost}`;
    });
}

function submitForm() {
    let attendees = document.querySelectorAll(".attendee");
    if (attendees.length === 0) {
        alert("Please add at least one attendee.");
        return;
    }

    let latestAttendee = attendees[attendees.length - 1]; // Get the most recently added attendee

    let name = latestAttendee.querySelector('[name="name"]').value.trim();
    let email = latestAttendee.querySelector('[name="email"]').value.trim();
    let age = latestAttendee.querySelector('[name="age"]').value.trim();
    let selectedSessions = Array.from(latestAttendee.querySelectorAll('input[name="session"]:checked'))
                               .map(s => s.value)
                               .join(", ");

    if (!name || !email || !age || selectedSessions.length === 0) {
        alert("Please fill in all required fields for the latest attendee.");
        return;
    }

    let confirmationMessage = `Confirm Registration:\n\n`;
    confirmationMessage += `Name: ${name}\n`;
    confirmationMessage += `Email: ${email}\n`;
    confirmationMessage += `Age: ${age}\n`;
    confirmationMessage += `Sessions: ${selectedSessions}\n`;

    if (confirm(confirmationMessage)) {
        alert("Registration Successful!");
    }
}

