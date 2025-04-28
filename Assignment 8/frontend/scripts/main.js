document.addEventListener('DOMContentLoaded', function() {
  const API_URL = 'http://localhost:3000';
  const animalsContainer = document.getElementById('animals-container');
  const loginLink = document.getElementById('login-link');
  const profileLink = document.getElementById('profile-link');
  const logoutLink = document.getElementById('logout-link');
  const navLogo = document.querySelector('.nav-logo');
  
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const darkModeIcon = document.querySelector('.dark-mode-icon');
  
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  
  if (isDarkMode) {
      document.body.classList.add('dark-mode');
      updateDarkModeIcon(true);
      updateLogo(true);
  }
  
  darkModeToggle.addEventListener('click', function() {
      const isDarkModeEnabled = document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', isDarkModeEnabled);
      updateDarkModeIcon(isDarkModeEnabled);
      updateLogo(isDarkModeEnabled);
  });
  
  function updateDarkModeIcon(isDarkMode) {
      if (isDarkMode) {
          darkModeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
      } else {
          darkModeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
      }
  }
  
  function updateLogo(isDarkMode) {
      if (navLogo) {
          navLogo.src = isDarkMode ? 'images/nat-geo-logo-dark.png' : 'images/nat-geo-logo-light.png';
      }
  }

  const token = localStorage.getItem('authToken');
  if (token) {
      loginLink.style.display = 'none';
      profileLink.style.display = 'inline';
      logoutLink.style.display = 'inline';
  }

  logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('authToken');
      window.location.href = 'index.html';
  });

  fetch(`${API_URL}/animals`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(animals => {
          animalsContainer.innerHTML = '';
          
          if (animals.length === 0) {
              animalsContainer.innerHTML = '<p>No animals found.</p>';
              return;
          }
          
          animals.forEach(animal => {
              const card = document.createElement('a');
              card.href = `animal.html?id=${animal.id}`;
              card.className = 'animal-card';
              
              const imageUrl = animal.images && animal.images.length > 0 
                  ? animal.images[0] 
                  : 'https://via.placeholder.com/300x200?text=No+Image';
              
              card.innerHTML = `
                  <img src="${imageUrl}" alt="${animal.name}">
                  <div class="animal-card-content">
                      <h3>${animal.name}</h3>
                      <p>${animal.sciName}</p>
                  </div>
              `;
              
              animalsContainer.appendChild(card);
          });
      })
      .catch(error => {
          console.error('Error fetching animals:', error);
          animalsContainer.innerHTML = `
              <div class="error-message">
                  <p>Failed to load animals. Please try again later.</p>
              </div>
          `;
      });
});