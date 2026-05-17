let videos = [];

fetch('video.json')
  .then(response => response.json())// Convert the response to JSON
  .then(data => {
    videos = data;
    displayVideos(videos);// Display the videos ONLY AFTER they finish loading
  })
  .catch(error => console.error("Error loading video data:", error));

// 2. Grab the HTML elements
const videoContainer = document.getElementById("videoContainer");
const videoSearch = document.getElementById("videoSearch");
const videoCategoryFilter = document.getElementById("videoCategoryFilter");

// 3. Function to display the videos on the screen
function displayVideos(list) {
  videoContainer.innerHTML = ""; // Clear the grid
  
  list.forEach(video => {
    // Create a new card for each video
    const card = document.createElement("div");
    card.className = "video-card";
    
    // Inject the YouTube iframe and titles
    card.innerHTML = `
      <iframe src = "${video.url}" title = "${video.title}" allowfullscreen></iframe>
      <h3>${video.title}</h3>
      <p class = "cat-label">Category: ${video.category}</p>
    `;
    
    videoContainer.appendChild(card);// Add the card to the container
  });
}

// 4. Function to filter the videos when you type or select a category
function filterVideos() {
  const searchValue = videoSearch.value.toLowerCase();
  const categoryValue = videoCategoryFilter.value;

  const filtered = videos.filter(video => {
    // Check if the title starts with the search value
    const matchName = video.title.toLowerCase().startsWith(searchValue);
    // Check if the category matches the dropdown
    const matchCategory = categoryValue === "all" || video.category === categoryValue;
    
    return matchName && matchCategory;
  });

  // Display only the filtered results
  displayVideos(filtered);
}

// 5. Tell the inputs to listen for typing and clicking
videoSearch.addEventListener("input", filterVideos);
videoCategoryFilter.addEventListener("change", filterVideos);