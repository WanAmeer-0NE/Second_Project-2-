// 1. Grab the empty container from the HTML
const teamContainer = document.getElementById("teamContainer");

// 2. Fetch the data from the JSON file
fetch('about.json')
  .then(response => response.json())
  .then(data => {
    // 3. Loop through each team member and build their card
    data.forEach(member => {
      
      const card = document.createElement("div");
      card.className = "portfolio-container";
      
      // Inject the data into the HTML structure
      card.innerHTML = `
        <img src = "${member.image}" alt = "${member.name}" class = "profile-pic">
        <div class = "portfolio-details">
          <h3>${member.name}</h3>
          <p><strong>Matric:</strong> ${member.matric}</p>
          <p><strong>Email:</strong> ${member.email}</p>
          <p><strong>Phone:</strong> ${member.phone}</p>
        </div>
      `;
      
      // Add the card to the container on the page
      teamContainer.appendChild(card);
    });
  })
  .catch(error => console.error("Error loading team data:", error));