const playersTableBody = document.getElementById("playersTableBody");
const playerForm = document.getElementById("playerForm");
const formMessage = document.getElementById("formMessage");
const playerMessage = document.getElementById("playerMessage");
const totalPlayers = document.getElementById("totalPlayers");

// Load all players for the webpage.
// This route includes Harsha when he is added through POST.
async function loadPlayers() {
    try {
        const response = await fetch("/api/all-players");

        if (!response.ok) {
            throw new Error("Unable to load players.");
        }

        const players = await response.json();

        playersTableBody.innerHTML = "";

        if (players.length === 0) {
            playersTableBody.innerHTML = `
                <tr>
                    <td colspan="5">No players registered.</td>
                </tr>
            `;
        } else {
            players.forEach(player => {
                const row = document.createElement("tr");

                const idCell = document.createElement("td");
                idCell.textContent = player.id;

                const nameCell = document.createElement("td");
                nameCell.textContent = player.name;

                const sportCell = document.createElement("td");
                sportCell.textContent = player.sport;

                const ageCell = document.createElement("td");
                ageCell.textContent = player.age;

                const actionCell = document.createElement("td");
                const deleteButton = document.createElement("button");

                deleteButton.textContent = "Delete";
                deleteButton.className = "delete-button";
                deleteButton.type = "button";

                deleteButton.addEventListener("click", () => {
                    deletePlayer(player.id);
                });

                actionCell.appendChild(deleteButton);

                row.appendChild(idCell);
                row.appendChild(nameCell);
                row.appendChild(sportCell);
                row.appendChild(ageCell);
                row.appendChild(actionCell);

                playersTableBody.appendChild(row);
            });
        }

        totalPlayers.textContent = players.length;
        playerMessage.textContent = "";

    } catch (error) {
        playersTableBody.innerHTML = `
            <tr>
                <td colspan="5">Unable to load players. Check the server.</td>
            </tr>
        `;

        playerMessage.textContent = error.message;
    }
}

// Add a player through POST.
playerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    formMessage.textContent = "";

    const name = document.getElementById("playerName").value.trim();
    const sport = document.getElementById("playerSport").value;
    const age = document.getElementById("playerAge").value;

    if (!name || !sport || !age) {
        formMessage.textContent = "Please fill in all fields.";
        return;
    }

    try {
        const response = await fetch("/api/players", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                sport: sport,
                age: Number(age)
            })
        });

        const result = await response.json();

        if (!response.ok) {
            formMessage.textContent = result.message || "Unable to add player.";
            return;
        }

        formMessage.textContent = result.message;
        playerForm.reset();

        // Refresh the webpage so the new player appears immediately.
        await loadPlayers();

    } catch (error) {
        formMessage.textContent = "Could not connect to the server.";
    }
});

// Delete a player through DELETE.
async function deletePlayer(id) {
    const confirmed = confirm("Are you sure you want to delete this player?");

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`/api/players/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            playerMessage.textContent = result.message || "Unable to delete player.";
            return;
        }

        playerMessage.textContent = result.message;
        await loadPlayers();

    } catch (error) {
        playerMessage.textContent = "Could not connect to the server.";
    }
}

// Load the player list when the webpage opens.
loadPlayers();
