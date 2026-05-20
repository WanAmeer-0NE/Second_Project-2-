// 1. Create an empty array to hold the data once it loads
let animals = [];

// Carousel tracking variables
let currentImageArray = [];
let currentImageIndex = 0;
let currentAnimalName = "";

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

  // 🌟 NEW: Initialize carousel data
  currentAnimalName = animal.name;
  currentImageIndex = 0; // Always start at the first picture

  // Safety check: If the JSON uses an array ("images"), use it. 
  // If it still uses a single string ("image"), convert it to a 1-item array.
  if (Array.isArray(animal.image)) {
    currentImageArray = animal.image;
  } else if (animal.image) {
    currentImageArray = [animal.image];
  } else {
    currentImageArray = []; // Fallback if no images exist
  }

  // Load the first image into the UI using our new function!
  updateCarouselDisplay();

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

// ==========================================
// 🌟 NEW CAROUSEL LOGIC FUNCTIONS 
// ==========================================

// Updates the image source and hides/shows arrows if needed
function updateCarouselDisplay() {
  const detailImg = document.getElementById("detailImage");
  const prevBtn = document.getElementById("prevImageBtn");
  const nextBtn = document.getElementById("nextImageBtn");

  if (currentImageArray.length > 0) {
    detailImg.src = currentImageArray[currentImageIndex];
    // Dynamic OKU accessibility tag counting the images
    detailImg.alt = `Photograph ${currentImageIndex + 1} of ${currentImageArray.length} for ${currentAnimalName}`;
  }

  // Hide the navigation arrows if the animal only has 1 picture
  if (currentImageArray.length <= 1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  } else {
    prevBtn.style.display = "flex";
    nextBtn.style.display = "flex";
  }
}

// Handles the math for clicking Next (+1) or Previous (-1)
function changeImage(direction) {
  currentImageIndex += direction;

  // If we go past the last image, loop back to the first one
  if (currentImageIndex >= currentImageArray.length) {
    currentImageIndex = 0;
  } 
  // If we go backwards past the first image, loop to the last one
  else if (currentImageIndex < 0) {
    currentImageIndex = currentImageArray.length - 1;
  }

  updateCarouselDisplay();
}

// Attach event listeners to all control input elements
searchInput.addEventListener("input", filterAnimals);
categoryFilter.addEventListener("change", filterAnimals);
dietFilter.addEventListener("change", filterAnimals);
habitatFilter.addEventListener("change", filterAnimals);
sortOrder.addEventListener("change", filterAnimals);