// 1. Create an empty array to hold the data once it loads
let animals = [];

// 2. Fetch the data from the JSON file
fetch('animal.json')
  .then(response => response.json()) 
  .then(data => {
    animals = data; 
    displayAnimals(animals); 
  })
  .catch(error => console.error("Error loading animal data:", error));

// Grab all the control elements from the HTML
const container = document.getElementById("animalContainer");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");
const dietFilter = document.getElementById("dietFilter");
const habitatFilter = document.getElementById("habitatFilter");
const sortOrder = document.getElementById("sortOrder"); 

function displayAnimals(list) {
  container.innerHTML = ""; // Clear previous results
  
  // 🌟 FEATURE 1: Handles invalid or empty search input gracefully (No Results State)
  if (list.length === 0) {
    container.innerHTML = `
      <div class="no-results-message" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #7f8c8d;">
        <h3>No matching animals found 🐾</h3>
        <p>Try adjusting your search query or removing some filters!</p>
      </div>
    `;
    return; // Stop the function here
  }

  // 🌟 FEATURE 2: Build the dynamic cards with Accessibility Tooltips
  list.forEach(animal => {
    const card = document.createElement("div");
    card.className = "card";
    
    // Dynamic Accessibility Hover Hint
    card.title = `Click to view detailed information about the ${animal.name}`;
    
    card.innerHTML = `
      <h3>${animal.name}</h3>
      <p>${animal.category}</p>
    `;
    
    // Wire up the pop-up modal click event
    card.onclick = () => showDetails(animal);
    container.appendChild(card);
  });
}

function showDetails(animal) {
  document.getElementById("detailName").innerText = animal.name;
  document.getElementById("detailCategory").innerText = animal.category;
  document.getElementById("detailHabitat").innerText = animal.habitat;
  document.getElementById("detailDiet").innerText = animal.diet;
  document.getElementById("detailFact").innerText = animal.fact;

  // 🌟 FEATURE 3: Meaningful dynamic image alternate descriptive text tags (OKU)
  const detailImg = document.getElementById("detailImage");
  detailImg.src = animal.image;
  detailImg.alt = `A photograph showing a ${animal.name} in its natural habitat environment.`;

  document.getElementById("detailsBox").style.display = "flex";
}

function closeDetails() {
  document.getElementById("detailsBox").style.display = "none";
}

function filterAnimals() {
  const searchValue = searchInput.value.toLowerCase();
  const categoryValue = categoryFilter.value;
  const dietValue = dietFilter.value;
  const habitatValue = habitatFilter.value;
  const sortValue = sortOrder.value; 

  // Process data filter layers matching active dropdown selectors
  let filtered = animals.filter(animal => {
    const matchName = animal.name.toLowerCase().startsWith(searchValue);
    const matchCategory = categoryValue === "all" || animal.category === categoryValue;
    const matchDiet = dietValue === "all" || animal.diet === dietValue;
    const matchHabitat = habitatValue === "all" || animal.habitat === habitatValue;

    return matchName && matchCategory && matchDiet && matchHabitat;
  });

  // 🌟 FEATURE 4: Sort elements alphabetically (A-Z or Z-A)
  if (sortValue === "asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === "desc") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }

  // Display only the processed records
  displayAnimals(filtered);
}

// Attach event listeners to all control input elements
searchInput.addEventListener("input", filterAnimals);
categoryFilter.addEventListener("change", filterAnimals);
dietFilter.addEventListener("change", filterAnimals);
habitatFilter.addEventListener("change", filterAnimals);
sortOrder.addEventListener("change", filterAnimals);