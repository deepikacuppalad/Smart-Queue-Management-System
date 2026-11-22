
const ADMIN_API = `${window.location.origin}/api`;

// ===================================
// 1. DISPLAY ADMIN MESSAGES
// ===================================

function showAdminMessage(message) {

    const element = document.getElementById("message");

    if (element) {
        element.textContent = message;
    }
}


// ===================================
// 2. LOAD DASHBOARD INFORMATION
// ===================================

async function loadDashboard() {

    try {

        const [customersResponse, tokensResponse, departmentsResponse] =
            await Promise.all([
                fetch(`${ADMIN_API}/customers`),
                fetch(`${ADMIN_API}/tokens`),
                fetch(`${ADMIN_API}/departments/active`)
            ]);

        if (!customersResponse.ok ||
            !tokensResponse.ok ||
            !departmentsResponse.ok) {

            throw new Error("Unable to fetch dashboard data.");

        }

        const customers = await customersResponse.json();
        const tokens = await tokensResponse.json();
        const departments = await departmentsResponse.json();


        // ===================================
        // 3. UPDATE DASHBOARD STATISTICS
        // ===================================

        document.getElementById("totalCustomers").textContent =
            customers.length;

        document.getElementById("totalTokens").textContent =
            tokens.length;

        document.getElementById("waitingTokens").textContent =
            tokens.filter(t => t.status === "WAITING").length;

        document.getElementById("servingTokens").textContent =
            tokens.filter(t => t.status === "SERVING").length;

        document.getElementById("completedTokens").textContent =
            tokens.filter(t => t.status === "COMPLETED").length;

        document.getElementById("cancelledTokens").textContent =
            tokens.filter(t => t.status === "CANCELLED").length;


        // ===================================
        // 4. LOAD DEPARTMENT DROPDOWN
        // ===================================

        const select = document.getElementById("departmentSelect");

        if (select) {

            const selectedValue = select.value;

            select.innerHTML =
                '<option value="">Select Department</option>';

            departments.forEach(department => {

                const option = document.createElement("option");

                option.value = department.id;
                option.textContent = department.departmentName;

                select.appendChild(option);

            });

            select.value = selectedValue;
        }


        // ===================================
        // 5. DISPLAY ALL QUEUE DETAILS
        // ===================================

        const table = document.querySelector("#queueTable tbody");

        if (table) {

            table.innerHTML = "";

            tokens.forEach(token => {

                const row = document.createElement("tr");

                row.innerHTML = `

                    <td>${token.id}</td>

                    <td>${token.tokenNumber}</td>

                    <td>${token.customer.name}</td>

                    <td>${token.department.departmentName}</td>

                    <td>
                        <span class="status ${token.status.toLowerCase()}">
                            ${token.status}
                        </span>
                    </td>

                    <td>

                        ${
                            token.status === "WAITING" ||
                            token.status === "SERVING"

                            ? `
                                <button onclick="updateTokenStatus(${token.id}, 'COMPLETED')">
                                    Complete
                                </button>

                                <button onclick="updateTokenStatus(${token.id}, 'CANCELLED')">
                                    Cancel
                                </button>
                              `

                            : "-"
                        }

                    </td>

                `;

                table.appendChild(row);

            });
        }

    } catch (error) {

        console.error("Dashboard error:", error);

        showAdminMessage(error.message);

    }

}


// ===================================
// 6. CALL NEXT CUSTOMER + SOUND
// ===================================

async function callNextCustomer() {

    const departmentId =
        document.getElementById("departmentSelect").value;

    if (!departmentId) {

        showAdminMessage("Please select a department.");

        return;

    }

    try {

        const response = await fetch(
            `${ADMIN_API}/tokens/call-next/${departmentId}`,
            {
                method: "PUT"
            }
        );

        if (!response.ok) {

            throw new Error("No waiting customers in this department.");

        }

        const token = await response.json();

        // Play notification sound after successful call
        if (typeof playNotificationSound === "function") {
            playNotificationSound();
        }

        showAdminMessage(
            `Now Serving: ${token.tokenNumber}`
        );

        await loadDashboard();

    } catch (error) {

        showAdminMessage(error.message);

    }

}


// ===================================
// 7. COMPLETE OR CANCEL TOKEN
// ===================================

async function updateTokenStatus(tokenId, status) {

    try {

        const response = await fetch(
            `${ADMIN_API}/tokens/${tokenId}/status?status=${status}`,
            {
                method: "PUT"
            }
        );

        if (!response.ok) {

            throw new Error("Unable to update token status.");

        }

        showAdminMessage(
            `Token successfully updated to ${status}.`
        );

        await loadDashboard();

    } catch (error) {

        showAdminMessage(error.message);

    }

}


// ===================================
// 8. INITIAL DASHBOARD LOAD
// ===================================

loadDashboard();


// ===================================
// 9. AUTOMATIC REFRESH EVERY 5 SECONDS
// ===================================

setInterval(() => {

    const adminPage = document.getElementById("admin");

    if (adminPage && adminPage.style.display !== "none") {

        loadDashboard();

    }

}, 5000);
