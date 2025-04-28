document.addEventListener('DOMContentLoaded', function() {
  const API_URL = 'http://localhost:3000';
  const createForm = document.getElementById('create-animal-form');
  const createSuccess = document.getElementById('create-success');
  const createError = document.getElementById('create-error');
  const addEventButton = document.getElementById('add-event');
  const eventInputs = document.getElementById('event-inputs');
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
  if (!token) {
      window.location.href = 'login.html';
  }
  
  logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('authToken');
      window.location.href = 'index.html';
  });
  
  let eventCount = 1;
  addEventButton.addEventListener('click', function() {
      const eventDiv = document.createElement('div');
      eventDiv.className = 'event-input';
      eventDiv.innerHTML = `
          <div class="form-group">
              <label for="event-name-${eventCount}">Event Name</label>
              <input type="text" id="event-name-${eventCount}" class="event-name" placeholder="e.g., Wildlife Photography Exhibition" required>
          </div>
          
          <div class="form-group">
              <label for="event-date-${eventCount}">Event Date (MM/DD/YYYY)</label>
              <input type="text" id="event-date-${eventCount}" class="event-date" placeholder="MM/DD/YYYY" required>
          </div>
          
          <div class="form-group">
              <label for="event-url-${eventCount}">Event URL</label>
              <input type="text" id="event-url-${eventCount}" class="event-url" placeholder="https://example.com/event" required>
          </div>
          
          <button type="button" class="secondary-button remove-event" style="margin-top: 10px;">Remove Event</button>
      `;
      eventInputs.appendChild(eventDiv);
      
      const removeButton = eventDiv.querySelector('.remove-event');
      removeButton.addEventListener('click', function() {
          eventInputs.removeChild(eventDiv);
      });
      
      eventCount++;
  });
  
  createForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitButton = createForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Creating...';
      submitButton.disabled = true;
      
      createSuccess.style.display = 'none';
      createError.style.display = 'none';
      
      const name = document.getElementById('name').value;
      const sciName = document.getElementById('sciName').value;
      const description = document.getElementById('description').value.split('\n').filter(p => p.trim() !== '');
      const images = document.getElementById('images').value.split('\n').filter(url => url.trim() !== '');
      const video = document.getElementById('video').value;
      
      const events = [];
      const eventNameInputs = document.querySelectorAll('.event-name');
      const eventDateInputs = document.querySelectorAll('.event-date');
      const eventUrlInputs = document.querySelectorAll('.event-url');
      
      for (let i = 0; i < eventNameInputs.length; i++) {
          events.push({
              name: eventNameInputs[i].value,
              date: eventDateInputs[i].value,
              url: eventUrlInputs[i].value
          });
      }
      
      const animalData = {
          name,
          sciName,
          description,
          images,
          video,
          events
      };
      
      fetch(`${API_URL}/animals`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'authToken': token
          },
          body: JSON.stringify(animalData)
      })
      .then(response => {
          if (!response.ok) {
              return response.json().then(data => {
                  throw new Error(data.error || 'Failed to create animal');
              });
          }
          return response.json();
      })
      .then(data => {
          createSuccess.style.display = 'block';
          createForm.reset();
          
          while (eventInputs.children.length > 1) {
              eventInputs.removeChild(eventInputs.lastChild);
          }
          eventCount = 1;
          
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
          
          setTimeout(() => {
              window.location.href = `animal.html?id=${data.id}`;
          }, 2000);
      })
      .catch(error => {
          console.error('Error creating animal:', error);
          createError.textContent = error.message || 'Error creating animal. Please try again.';
          createError.style.display = 'block';
          
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
          
          createError.scrollIntoView({ behavior: 'smooth' });
      });
  });
});