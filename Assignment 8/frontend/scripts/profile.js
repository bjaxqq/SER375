document.addEventListener('DOMContentLoaded', function() {
  const API_URL = 'http://localhost:3000';
  const profileLoading = document.getElementById('profile-loading');
  const profileContent = document.getElementById('profile-content');
  const errorMessage = document.getElementById('error-message');
  const userName = document.getElementById('user-name');
  const userAnimals = document.getElementById('user-animals');
  const logoutLink = document.getElementById('logout-link');
  const profileAvatar = document.getElementById('profile-avatar');
  const animalsCount = document.getElementById('animals-count');
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
  if (!token) {
      window.location.href = 'login.html';
      return;
  }
  
  logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('authToken');
      window.location.href = 'index.html';
  });
  
  fetch(`${API_URL}/user`, {
      headers: {
          'authToken': token
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to fetch profile');
      }
      return response.json();
  })
  .then(user => {
      userName.textContent = user.name;
      
      const initials = user.name.split(' ').map(name => name[0]).join('');
      profileAvatar.textContent = initials;
      
      const count = user.animals ? user.animals.length : 0;
      animalsCount.textContent = count;
      
      if (user.animals && user.animals.length > 0) {
          userAnimals.innerHTML = '';
          
          fetch(`${API_URL}/animals`)
              .then(response => response.json())
              .then(allAnimals => {
                  user.animals.forEach(userAnimal => {
                      const fullAnimal = allAnimals.find(a => a.id === userAnimal.id);
                      const animalImage = fullAnimal && fullAnimal.images && fullAnimal.images.length > 0 
                          ? fullAnimal.images[0] 
                          : 'https://via.placeholder.com/60x60?text=No+Image';
                      
                      const animalLink = document.createElement('a');
                      animalLink.href = `animal.html?id=${userAnimal.id}`;
                      animalLink.innerHTML = `
                          <img src="${animalImage}" alt="${userAnimal.name}" class="animal-list-image">
                          <div class="animal-list-info">
                              <h4>${userAnimal.name}</h4>
                              <p>ID: ${userAnimal.id}</p>
                          </div>
                      `;
                      userAnimals.appendChild(animalLink);
                  });
              })
              .catch(error => {
                  console.error('Error fetching all animals:', error);
              });
      } else {
          userAnimals.innerHTML = `
              <div style="text-align: center; padding: 30px 0;">
                  <p>You haven't created any animals yet.</p>
                  <a href="admin.html" class="submit-button" style="display: inline-block; margin-top: 15px;">Create Your First Animal</a>
              </div>
          `;
      }
      
      profileLoading.style.display = 'none';
      profileContent.style.display = 'block';
  })
  .catch(error => {
      console.error('Error fetching profile:', error);
      profileLoading.style.display = 'none';
      errorMessage.style.display = 'block';
  });
});