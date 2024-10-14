
document.addEventListener('DOMContentLoaded', () => {

  
  // Wait until the DOM is fully loaded before executing the following code.
  // Fetch and display the movie list when the page loads.
  fetchMovieList();
});

function fetchMovieList() {
  // Make a GET request to fetch the list of films from the server.
  fetch('http://localhost:3000/films')
    .then(response => response.json()) // Convert the response to JSON format.
    .then(films => {
      const filmList = document.getElementById('films'); // Get the element that will hold the film list.
      filmList.innerHTML = ''; // Clear any existing film entries in the list.

      // Populate the movie list using a for...of loop to iterate over each film.
      for (const film of films) {
        const li = document.createElement('li'); // Create a new list item for each film.
        li.classList.add('item'); // Add a class for styling.
        li.dataset.id = film.id; // Store the film ID in a data attribute.

        // Create a wrapper div to hold the title and the delete button.
        const wrapper = document.createElement('div');
        wrapper.classList.add('film-wrapper'); // Add a class for styling the wrapper.

        // Create a span to display the film's title.
        const filmTitle = document.createElement('span');
        filmTitle.textContent = film.title; // Set the text content to the film's title.
        wrapper.appendChild(filmTitle); // Append the title span to the wrapper.

        // Attach a click event to the film title that displays detailed information about the film.
        filmTitle.addEventListener('click', () => displayMovieDetails(film));

        // Create and append the delete button for each film.
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete'; // Set the button text to "Delete".
        deleteButton.classList.add('delete-btn'); // Add a class for styling the button.
        deleteButton.style.color = 'red'; // Set the text color of the button to red.
        
        // Attach a click event to the delete button.
        deleteButton.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent the click event from bubbling up to the film title.
          deleteMovie(film.id, li); // Call the delete function, passing the film ID and the list item to remove.
        });
        wrapper.appendChild(deleteButton); // Append the delete button to the wrapper.

        li.appendChild(wrapper); // Append the wrapper (with title and button) to the list item.
        filmList.appendChild(li); // Append the list item to the film list.
      }

      // Display the first movie's details by default if the films array is not empty.
      if (films.length > 0) {
        displayMovieDetails(films[0]);
      }
    });
}


function displayMovieDetails(film) {
  // Update the UI with the details of the selected film.
  const available_tickets= film.capacity-film.tickets_sold
  document.getElementById('title').textContent = film.title; // Set the title of the film.
  document.getElementById('poster').src = film.poster; // Set the source of the poster image.
  document.getElementById('runtime').textContent = `runtime: ${film.runtime} minutes`; // Display the runtime.
  document.getElementById('showtime').textContent = `showtime: ${film.showtime}`; // Display the showtime.
  document.getElementById('film-info').textContent = film.description; // Set the film description.
  document.getElementById('ticket-num').textContent = `${available_tickets}`; // Show the number of available tickets.

  // Set the functionality of the buy ticket button.
  const buyButton = document.getElementById('buy-ticket');
  if (film.capacity - film.tickets_sold > 0) {
    buyButton.textContent = 'Buy Ticket'; // Set the button text for buying tickets.
    buyButton.classList.remove('sold-out'); // Remove the sold-out class if the film is available.
    buyButton.disabled = false; // Enable the buy button.

    // Assign a click event to the buy button to handle ticket purchasing.
    buyButton.onclick = () => buyTicket(film);
  } else {
    buyButton.textContent = 'Sold Out'; // Set button text to indicate sold out status.
    buyButton.classList.add('sold-out'); // Add a sold-out class for styling.
    buyButton.disabled = true; // Disable the buy button.
  }
  
}


function buyTicket(film) {
  // Check if there are tickets available for purchase.
  if (film.capacity - film.tickets_sold > 0) {
    film.tickets_sold += 1; // Increment the number of sold tickets.

    // Update the number of sold tickets on the server.
    fetch(`http://localhost:3000/films/${film.id}`, {
      method: 'PATCH', // Use PATCH to update the tickets sold.
      headers: { 'Content-Type': 'application/json' }, // Set the content type for the request.
      body: JSON.stringify({ tickets_sold: film.tickets_sold }) // Send the updated tickets sold data.
    })
      .then(response => response.json()) // Convert the response to JSON.
      .then(updatedFilm => {
        document.getElementById('ticket-num').textContent = updatedFilm.capacity - updatedFilm.tickets_sold; // Update the available tickets display.

        // Check if the movie is now sold out after the purchase.
        if (updatedFilm.capacity - updatedFilm.tickets_sold === 0) {
          document.getElementById('buy-ticket').textContent = 'Sold Out'; // Update the button text to "Sold Out".
          document.getElementById('buy-ticket').classList.add('sold-out'); // Add the sold-out class for styling.
          document.getElementById('buy-ticket').disabled = true; // Disable the buy button since it's sold out.
        }
      });
  }
}

// Function to delete a movie from the list.
function deleteMovie(filmId, li) {
  // Make a DELETE request to the server to remove the specified film.
  fetch(`http://localhost:3000/films/${filmId}`, {
    method: 'DELETE' // Specify that we want to delete the film.
  })
    .then(response => {
      if (response.ok) { // Check if the response was successful.
        li.remove(); // Remove the movie list item from the UI.
        alert('Movie deleted successfully'); // Optionally, notify the user that the movie was deleted.
      } else {
        alert('Failed to delete movie'); // Optionally, handle error if the deletion failed.
      }
    })
    .catch(error => {
      console.error('Error:', error); // Log any error that occurs during the fetch.
      alert('An error occurred while deleting the movie'); // Optionally, notify the user of an error.
    });
}




 