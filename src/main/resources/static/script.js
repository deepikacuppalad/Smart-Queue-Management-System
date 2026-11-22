
// Automatically detects laptop or mobile address
const API = `${window.location.origin}/api`;

// ===================================
// 1. NAVIGATION
// ===================================

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageId);

    if (!selectedPage) return;

    selectedPage.style.display = "block";
    selectedPage.classList.add("active");

    if (pageId === "token") loadDepartments();
    if (pageId === "status") loadQueue();
    if (pageId === "admin") loadDashboard();
    if (pageId === "display") loadLiveDisplay();
}


// ===================================
// 2. CUSTOMER REGISTRATION
// ===================================

document.getElementById("customerForm")
.addEventListener("submit", async function(event) {

    event.preventDefault();

    const customer = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value
    };

    try {

        const response = await fetch(`${API}/customers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customer)
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const data = await response.json();

        document.getElementById("registerMessage").innerHTML =
            `Customer registered successfully! Your Customer ID is <b>${data.id}</b>`;

        document.getElementById("customerForm").reset();

        document.getElementById("customerId").value = data.id;

    } catch (error) {

        document.getElementById("registerMessage").textContent =
            "Registration failed: " + error.message;
    }
});


// ===================================
// 3. LOAD DEPARTMENTS
// ===================================

async function loadDepartments() {

    try {

        const response = await fetch(`${API}/departments/active`);

        if (!response.ok) {
            throw new Error("Unable to load departments");
        }

        const departments = await response.json();

        const dropdown = document.getElementById("department");

        dropdown.innerHTML =
            '<option value="">Select Department</option>';

        departments.forEach(department => {

            const option = document.createElement("option");

            option.value = department.id;
            option.textContent = department.departmentName;

            dropdown.appendChild(option);
        });

    } catch (error) {

        alert(error.message);
    }
}


// ===================================
// 4. GENERATE TOKEN + QR CODE
// ===================================

async function generateToken() {

    const customerId =
        document.getElementById("customerId").value;

    const departmentId =
        document.getElementById("department").value;

    if (!customerId || !departmentId) {
        alert("Please enter Customer ID and select a department.");
        return;
    }

    try {

        const response = await fetch(
            `${API}/tokens/generate?customerId=${encodeURIComponent(customerId)}&departmentId=${encodeURIComponent(departmentId)}`,
            { method: "POST" }
        );

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const token = await response.json();

        document.getElementById("tokenResult").innerHTML = `
            <h3>Token Generated Successfully!</h3>
            <h1>${token.tokenNumber}</h1>
            <p>Customer: ${token.customer.name}</p>
            <p>Department: ${token.department.departmentName}</p>
            <p>Status: ${token.status}</p>
        `;

        generateTokenQR(token);

        if (typeof loadDashboard === "function") {
            loadDashboard();
        }

    } catch (error) {

        alert("Token generation failed: " + error.message);
    }
}


// ===================================
// 5. GENERATE QR CODE
// ===================================

function generateTokenQR(token) {

    const qrContainer = document.getElementById("qrcode");

    qrContainer.innerHTML = "";

    if (typeof QRCode === "undefined") {
        qrContainer.innerHTML =
            "<p>QR Code library could not load. Check your internet connection.</p>";
        return;
    }

    const qrData = `
SMART QUEUE MANAGEMENT SYSTEM

Token Number: ${token.tokenNumber}
Customer Name: ${token.customer.name}
Department: ${token.department.departmentName}
Status: ${token.status}
Customer ID: ${token.customer.id}
`;

    new QRCode(qrContainer, {
        text: qrData,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}


// ===================================
// 6. CUSTOMER QUEUE STATUS
// ===================================

async function loadQueue() {

    try {

        const response = await fetch(`${API}/tokens/waiting`);

        if (!response.ok) {
            throw new Error("Unable to load queue");
        }

        const tokens = await response.json();

        const queueList = document.getElementById("queueList");

        if (tokens.length === 0) {
            queueList.innerHTML = "<p>No customers are waiting.</p>";
            return;
        }

        queueList.innerHTML = tokens.map(token => `

            <div class="queue-card">

                <h3>${token.tokenNumber}</h3>

                <p>Customer: ${token.customer.name}</p>

                <p>Department: ${token.department.departmentName}</p>

                <p>Status: ${token.status}</p>

            </div>

        `).join("");

    } catch (error) {

        document.getElementById("queueList").textContent =
            error.message;
    }
}


// ===================================
// 7. LIVE CUSTOMER DISPLAY
// ===================================

async function loadLiveDisplay() {

    try {

        const response = await fetch(`${API}/tokens`);

        if (!response.ok) {
            throw new Error("Unable to load serving tokens");
        }

        const tokens = await response.json();

        const servingTokens = tokens.filter(
            token => token.status === "SERVING"
        );

        const display = document.getElementById("servingDisplay");
        const list = document.getElementById("servingList");

        if (servingTokens.length === 0) {

            display.innerHTML = `
                <h2>NOW SERVING</h2>
                <h1>---</h1>
                <p>Waiting for the next customer...</p>
            `;

            list.innerHTML = "";

        } else {

            const currentToken = servingTokens[0];

            display.innerHTML = `
                <h2>NOW SERVING</h2>

                <h1>${currentToken.tokenNumber}</h1>

                <h3>${currentToken.customer.name}</h3>

                <p>Department:
                    ${currentToken.department.departmentName}
                </p>

                <h3 style="color:#34d399;">PLEASE PROCEED</h3>
            `;

            list.innerHTML = servingTokens.slice(1).map(token => `
                <div class="serving-card">

                    <h3>Also Serving</h3>

                    <h2>${token.tokenNumber}</h2>

                    <p>${token.customer.name}</p>

                    <p>${token.department.departmentName}</p>

                </div>
            `).join("");
        }

        document.getElementById("displayLastUpdated").textContent =
            "Last updated: " + new Date().toLocaleTimeString();

    } catch (error) {

        document.getElementById("servingDisplay").innerHTML =
            `<h2>${error.message}</h2>`;
    }
}


// ===================================
// 8. AUTOMATIC LIVE DISPLAY REFRESH
// ===================================

setInterval(() => {

    const displayPage = document.getElementById("display");

    if (displayPage && displayPage.style.display !== "none") {
        loadLiveDisplay();
    }

}, 3000);


// ===================================
// 9. SHOW HOME PAGE INITIALLY
// ===================================

function initializeApp() {
    showPage("home");
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
} else {
    initializeApp();
}


// ===================================
// 10. TRACK TOKEN
// ===================================

async function trackToken() {

    const tokenNumber = document
        .getElementById("trackTokenNumber")
        .value.trim().toUpperCase();

    const result = document.getElementById("trackResult");

    if (!tokenNumber) {
        result.innerHTML = "<p>Please enter your token number.</p>";
        return;
    }

    result.innerHTML = "<p>Searching for token...</p>";

    try {

        const response = await fetch(`${API}/tokens`);

        if (!response.ok) {
            throw new Error("Unable to fetch tokens");
        }

        const tokens = await response.json();

        const token = tokens.find(
            t => String(t.tokenNumber).toUpperCase() === tokenNumber
        );

        if (!token) {
            result.innerHTML = "<p>Token not found.</p>";
            return;
        }

        const waitingTokens = tokens
            .filter(t =>
                t.department?.id === token.department?.id &&
                t.status === "WAITING"
            )
            .sort((a, b) =>
                new Date(a.createdAt) - new Date(b.createdAt)
            );

        let position = 0;
        let customersAhead = 0;
        let waitingTime = 0;

        if (token.status === "WAITING") {

            position = waitingTokens.findIndex(
                t => t.id === token.id
            ) + 1;

            customersAhead = Math.max(position - 1, 0);

            waitingTime = customersAhead * 10;
        }

        let queueInformation = "";

        if (token.status === "WAITING") {

            queueInformation = `
                <h3>Queue Information</h3>

                <p><strong>Queue Position:</strong> ${position}</p>

                <p><strong>Customers Ahead:</strong> ${customersAhead}</p>

                <h3>Estimated Waiting Time</h3>

                <h2>${waitingTime} minutes</h2>
            `;

        } else if (token.status === "SERVING") {

            queueInformation = `
                <h3>Your turn now!</h3>
                <h2>Please proceed to the counter.</h2>
            `;

        } else {

            queueInformation = `
                <h3>Queue Information</h3>
                <p>Waiting time is not applicable.</p>
            `;
        }

        result.innerHTML = `
            <div class="queue-card">

                <h2>Your Token Details</h2>

                <h1>${token.tokenNumber}</h1>

                <p><strong>Customer:</strong>
                    ${token.customer?.name || "N/A"}
                </p>

                <p><strong>Department:</strong>
                    ${token.department?.departmentName || "N/A"}
                </p>

                <p><strong>Status:</strong>
                    ${token.status}
                </p>

                <p><strong>Customer ID:</strong>
                    ${token.customer?.id || "N/A"}
                </p>

                <hr>

                ${queueInformation}

                <p><small>Estimate based on 10 minutes per customer ahead. Actual waiting time may vary.</small></p>

            </div>
        `;

    } catch (error) {

        console.error(error);

        result.innerHTML =
            "<p>Unable to track token. Please try again.</p>";
    }
}


// ===================================
// 11. SOUND NOTIFICATION
// ===================================

function playNotificationSound() {

    try {

        const audioContext = new (
            window.AudioContext || window.webkitAudioContext
        )();

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = "sine";
        oscillator.frequency.value = 800;

        gainNode.gain.setValueAtTime(
            0.3,
            audioContext.currentTime
        );

        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.5
        );

        oscillator.start();

        oscillator.stop(audioContext.currentTime + 0.5);

    } catch (error) {

        console.error("Sound notification error:", error);
    }
}
