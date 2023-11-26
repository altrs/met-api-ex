// dom
let title = document.getElementById("title");
let artist = document.getElementById("artist");
let measurements = document.getElementById("measurements");

// p5
let paintingDetails; // Variable to store painting details

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent('canvas-container');
  
  // Call the async function to get painting details
  getPaintings().then(details => {
    paintingDetails = details;

    // Draw square based on measurements
    drawSquare();
  }).catch(error => {
    console.error(error);
  });
}

function draw() {
  // Nothing to do in the draw function for now
}

function drawSquare() {
  background(220);

  if (paintingDetails && paintingDetails.measurements && paintingDetails.measurements.length > 0) {
    const firstMeasurement = paintingDetails.measurements[0];

    if (firstMeasurement.elementMeasurements) {
      const width = firstMeasurement.elementMeasurements.Width;
      const height = firstMeasurement.elementMeasurements.Height;

      // Map the width and height to the canvas size
      const mappedWidth = map(width, 0, 100, 0, width); // Adjust the mapping based on your requirements
      const mappedHeight = map(height, 0, 100, 0, height); // Adjust the mapping based on your requirements

      // Draw the square using mapped dimensions
      rectMode(CENTER);
      fill(255, 0, 0); // Red color for the square
      rect(width / 2, height / 2, mappedWidth, mappedHeight);
    } else {
      console.log("Element measurements information not available");
    }
  } else {
    console.log("Measurements information not available");
  }
}

// met
async function getPaintings() {
  try {
    const response = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/search?medium=Paintings&q=paintings");
    const searchData = await response.json();

    // Check if the search was successful and has objectIDs
    if (searchData.objectIDs && searchData.objectIDs.length > 0) {
      // Generate a random index to get a random painting
      const randomIndex = Math.floor(Math.random() * searchData.objectIDs.length);
      const randomPaintingId = searchData.objectIDs[randomIndex];

      // Fetch details for the random painting
      const paintingDetailsResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomPaintingId}`);
      const paintingDetails = await paintingDetailsResponse.json();

      // Update measurements, title, and artist information in the DOM
      if (paintingDetails.measurements && paintingDetails.measurements.length > 0) {
        const firstMeasurement = paintingDetails.measurements[0];

        if (firstMeasurement.elementMeasurements) {
          const width = firstMeasurement.elementMeasurements.Width;
          const height = firstMeasurement.elementMeasurements.Height;
          measurements.textContent = `Measurements: Width: ${width}, Height: ${height}`;
        } else {
          measurements.textContent = "Measurements: Element measurements information not available";
        }
      } else {
        measurements.textContent = "Measurements: Information not available";
      }

      if (paintingDetails.artistDisplayName) {
        const artistName = paintingDetails.artistDisplayName;
        artist.textContent = `Artist: ${artistName}`;
      } else {
        artist.textContent = "Artist information not available";
      }

      if (paintingDetails.title) {
        const paintingTitle = paintingDetails.title;
        title.textContent = `Title: ${paintingTitle}`;
      } else {
        title.textContent = "Title information not available";
      }

      return paintingDetails;
    } else {
      console.log("No paintings found in the search result.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
