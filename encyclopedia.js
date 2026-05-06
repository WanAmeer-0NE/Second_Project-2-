// 1. Create an empty array to hold the data once it loads
let animals = [];

// 2. Fetch the data from the JSON file
fetch('animal.json')
  .then(response => response.json()) // Convert the response to JSON
  .then(data => {
    animals = data; // Save the loaded data to our array
    displayAnimals(animals); // Display the animals ONLY AFTER they finish loading
  })
  .catch(error => console.error("Error loading animal data:", error));

const container = document.getElementById("animalContainer");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");
const dietFilter = document.getElementById("dietFilter");
const habitatFilter = document.getElementById("habitatFilter");

function displayAnimals(list) {
  container.innerHTML = ""; // Clear previous results
  list.forEach(animal => {
    const card = document.createElement("div");// Create a card for each animal
    card.className = "card";
    card.innerHTML = `
      <h3>${animal.name}</h3>
      <p>${animal.category}</p>
    `;
    
    card.onclick = () => showDetails(animal);// Show the details when the card is clicked
    container.appendChild(card);// Add the card to the container
  });
}

function showDetails(animal) {// Populate the details box with the animal's information
  document.getElementById("detailName").innerText = animal.name;
  document.getElementById("detailCategory").innerText = animal.category;
  document.getElementById("detailHabitat").innerText = animal.habitat;
  document.getElementById("detailDiet").innerText = animal.diet;

  document.getElementById("detailImage").src = animal.image;
  document.getElementById("detailFact").innerText = animal.fact;

  document.getElementById("detailsBox").style.display = "flex";
}

function closeDetails() {
  document.getElementById("detailsBox").style.display = "none";
}

function filterAnimals() {
  const searchValue = searchInput.value.toLowerCase();
  const categoryValue = categoryFilter.value;

// 1. Get the current values of the new dropdowns
  const dietValue = dietFilter.value;
  const habitatValue = habitatFilter.value;

  const filtered = animals.filter(animal => {
    const matchName = animal.name.toLowerCase().startsWith(searchValue);
    const matchCategory = categoryValue === "all" || animal.category === categoryValue;
    
    // 2. Check if the animal matches the selected diet and habitat
    const matchDiet = dietValue === "all" || animal.diet === dietValue;
    const matchHabitat = habitatValue === "all" || animal.habitat === habitatValue;

    // 3. ONLY return the animal if it matches ALL the active filters
    return matchName && matchCategory && matchDiet && matchHabitat;
  });

  displayAnimals(filtered);
}

searchInput.addEventListener("input", filterAnimals);
categoryFilter.addEventListener("change", filterAnimals);
dietFilter.addEventListener("change", filterAnimals);
habitatFilter.addEventListener("change", filterAnimals);