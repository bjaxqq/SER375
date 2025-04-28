document.addEventListener('DOMContentLoaded', function() {
  const API_URL = 'http://localhost:3000';
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
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
      window.location.href = 'profile.html';
  }
  
  loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      loginError.style.display = 'none';
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      const submitButton = loginForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Logging in...';
      submitButton.disabled = true;
      
      fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Invalid username or password');
          }
          return response.json();
      })
      .then(data => {
          localStorage.setItem('authToken', data.token);
          
          window.location.href = 'profile.html';
      })
      .catch(error => {
          console.error('Login error:', error);
          loginError.textContent = error.message;
          loginError.style.display = 'block';
  
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
      });
  });
});