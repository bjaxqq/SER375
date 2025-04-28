document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000"
  const loading = document.getElementById("animal-loading")
  let currentImageIndex = 1
  const errorMessage = document.getElementById("error-message")
  const animalContent = document.getElementById("animal-content")
  const loginLink = document.getElementById("login-link")
  const profileLink = document.getElementById("profile-link")
  const logoutLink = document.getElementById("logout-link")
  const adminControls = document.getElementById("admin-controls")
  const editAnimalBtn = document.getElementById("edit-animal-btn")
  const deleteAnimalBtn = document.getElementById("delete-animal-btn")
  const confirmModal = document.getElementById("confirm-modal")
  const confirmDeleteBtn = document.getElementById("confirm-delete")
  const cancelDeleteBtn = document.getElementById("cancel-delete")
  const editFormContainer = document.getElementById("edit-form-container")
  const editForm = document.getElementById("edit-animal-form")
  const cancelEdit = document.getElementById("cancel-edit")
  const editEventInputs = document.getElementById("edit-event-inputs")
  const addEditEvent = document.getElementById("add-edit-event")
  const navLogo = document.querySelector(".nav-logo")

  const darkModeToggle = document.getElementById("dark-mode-toggle")
  const darkModeIcon = document.querySelector(".dark-mode-icon")

  const isDarkMode = localStorage.getItem("darkMode") === "true"

  if (isDarkMode) {
    document.body.classList.add("dark-mode")
    updateDarkModeIcon(true)
    updateLogo(true)
  }

  darkModeToggle.addEventListener("click", () => {
    const isDarkModeEnabled = document.body.classList.toggle("dark-mode")
    localStorage.setItem("darkMode", isDarkModeEnabled)
    updateDarkModeIcon(isDarkModeEnabled)
    updateLogo(isDarkModeEnabled)
  })

  function updateDarkModeIcon(isDarkMode) {
    if (isDarkMode) {
      darkModeIcon.innerHTML =
        '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>'
    } else {
      darkModeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>'
    }
  }

  function updateLogo(isDarkMode) {
    if (navLogo) {
      navLogo.src = isDarkMode ? "images/nat-geo-logo-dark.png" : "images/nat-geo-logo-light.png"
    }
  }

  const urlParams = new URLSearchParams(window.location.search)
  const animalId = urlParams.get("id")

  if (!animalId) {
    loading.style.display = "none"
    errorMessage.style.display = "block"
    errorMessage.querySelector("p").textContent = "No animal ID provided."
    return
  }

  const token = localStorage.getItem("authToken")

  if (token) {
    loginLink.style.display = "none"
    profileLink.style.display = "inline"
    logoutLink.style.display = "inline"
    adminControls.style.display = "flex"
  }

  logoutLink.addEventListener("click", (e) => {
    e.preventDefault()
    localStorage.removeItem("authToken")
    window.location.href = "index.html"
  })

  let animalData = null

  fetch(`${API_URL}/animals/${animalId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch animal data")
      }
      return response.json()
    })
    .then((animal) => {
      animalData = animal

      document.title = `${animal.name} | National Geographic`
      document.getElementById("title").textContent = animal.name
      document.querySelector(".scientific-name").textContent = animal.sciName

      const titleImage = document.querySelector(".title-image")
      if (animal.images && animal.images.length > 0) {
        titleImage.src = animal.images[0]
        titleImage.alt = animal.name
      } else {
        titleImage.style.display = "none"
      }

      const descriptionContainer = document.getElementById("description-container")
      if (animal.description && animal.description.length > 0) {
        descriptionContainer.innerHTML = animal.description.map((para) => `<p>${para}</p>`).join("")
      } else {
        descriptionContainer.innerHTML = "<p>No description available.</p>"
      }

      const slideshowImage = document.querySelector(".slideshow-image")
      const imageCounter = document.getElementById("image-counter")
      const prevButton = document.getElementById("prev")
      const nextButton = document.getElementById("next")

      if (animal.images && animal.images.length > 0) {
        const slideshowImages = animal.images.slice(1)
        currentImageIndex = 0

        if (slideshowImages.length > 0) {
          slideshowImage.src = slideshowImages[currentImageIndex]
          slideshowImage.alt = `${animal.name} - Image ${currentImageIndex + 1}`
          imageCounter.textContent = `${currentImageIndex + 1}/${slideshowImages.length}`

          prevButton.addEventListener("click", () => {
            currentImageIndex = (currentImageIndex - 1 + slideshowImages.length) % slideshowImages.length
            updateSlideshow(slideshowImages)
          })

          nextButton.addEventListener("click", () => {
            currentImageIndex = (currentImageIndex + 1) % slideshowImages.length
            updateSlideshow(slideshowImages)
          })
        } else {
          document.querySelector(".slideshow-container").style.display = "none"
        }
      } else {
        document.querySelector(".slideshow-container").style.display = "none"
      }

      const videoIframe = document.querySelector(".video")
      if (animal.video) {
        videoIframe.src = animal.video
      } else {
        document.querySelector(".video-container").innerHTML = "<p>No video available.</p>"
      }

      const currentDate = new Date()
      document.getElementById("current-date").textContent = currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      const pastEvents = document.getElementById("past-events")
      const upcomingEvents = document.getElementById("upcoming-events")
      const pastEventsHeading = document.getElementById("past-events-heading")
      const upcomingEventsHeading = document.getElementById("upcoming-events-heading")

      if (animal.events && animal.events.length > 0) {
        let hasPastEvents = false
        let hasUpcomingEvents = false

        animal.events.forEach((event) => {
          const eventDate = new Date(event.date)
          const eventElement = document.createElement("div")
          eventElement.className = "event-card"

          const formattedDate = eventDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })

          eventElement.innerHTML = `
            <h4>${event.name}</h4>
            <p>${formattedDate}</p>
            <a href="${event.url}" target="_blank" class="event-link">Learn More</a>
          `

          if (eventDate < currentDate) {
            pastEvents.appendChild(eventElement)
            hasPastEvents = true
          } else {
            upcomingEvents.appendChild(eventElement)
            hasUpcomingEvents = true
          }
        })

        pastEventsHeading.style.display = hasPastEvents ? "block" : "none"
        upcomingEventsHeading.style.display = hasUpcomingEvents ? "block" : "none"
      } else {
        document.getElementById("events-container").innerHTML = "<p>No events available.</p>"
      }

      if (token) {
        populateEditForm(animal)
      }

      loading.style.display = "none"
      animalContent.style.display = "block"
    })
    .catch((error) => {
      console.error("Error fetching animal:", error)
      loading.style.display = "none"
      errorMessage.style.display = "block"
    })

  function updateSlideshow(slideshowImages) {
    const slideshowImage = document.querySelector(".slideshow-image")
    slideshowImage.src = slideshowImages[currentImageIndex]
    slideshowImage.alt = `${animalData.name} - Image ${currentImageIndex + 1}`
    document.getElementById("image-counter").textContent = `${currentImageIndex + 1}/${slideshowImages.length}`
  }

  function populateEditForm(animal) {
    document.getElementById("edit-name").value = animal.name || ""
    document.getElementById("edit-sciName").value = animal.sciName || ""

    const descriptionText = Array.isArray(animal.description) ? animal.description.join("\n") : animal.description || ""
    document.getElementById("edit-description").value = descriptionText

    const imagesText = Array.isArray(animal.images) ? animal.images.join("\n") : animal.images || ""
    document.getElementById("edit-images").value = imagesText

    document.getElementById("edit-video").value = animal.video || ""

    editEventInputs.innerHTML = ""

    if (animal.events && animal.events.length > 0) {
      animal.events.forEach((event) => {
        addEventInput(event)
      })
    } else {
      addEventInput()
    }
  }

  let eventCount = 0
  function addEventInput(event = null) {
    const eventDiv = document.createElement("div")
    eventDiv.className = "event-input"
    eventDiv.innerHTML = `
            <div class="form-group">
                <label for="edit-event-name-${eventCount}">Event Name</label>
                <input type="text" id="edit-event-name-${eventCount}" class="edit-event-name" value="${event ? event.name : ""}" required>
            </div>
            
            <div class="form-group">
                <label for="edit-event-date-${eventCount}">Event Date (MM/DD/YYYY)</label>
                <input type="text" id="edit-event-date-${eventCount}" class="edit-event-date" value="${event ? event.date : ""}" required>
            </div>
            
            <div class="form-group">
                <label for="edit-event-url-${eventCount}">Event URL</label>
                <input type="text" id="edit-event-url-${eventCount}" class="edit-event-url" value="${event ? event.url : ""}" required>
            </div>
            
            <button type="button" class="secondary-button remove-event">Remove Event</button>
        `

    editEventInputs.appendChild(eventDiv)

    const removeButton = eventDiv.querySelector(".remove-event")
    removeButton.addEventListener("click", () => {
      editEventInputs.removeChild(eventDiv)
    })

    eventCount++
  }

  if (addEditEvent) {
    addEditEvent.addEventListener("click", () => {
      addEventInput()
    })
  }

  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const submitButton = editForm.querySelector('button[type="submit"]')
      const originalButtonText = submitButton.textContent
      submitButton.textContent = "Saving..."
      submitButton.disabled = true

      const name = document.getElementById("edit-name").value
      const sciName = document.getElementById("edit-sciName").value
      const description = document
        .getElementById("edit-description")
        .value.split("\n")
        .filter((p) => p.trim() !== "")
      const images = document
        .getElementById("edit-images")
        .value.split("\n")
        .filter((url) => url.trim() !== "")
      const video = document.getElementById("edit-video").value

      const events = []
      const eventNameInputs = document.querySelectorAll(".edit-event-name")
      const eventDateInputs = document.querySelectorAll(".edit-event-date")
      const eventUrlInputs = document.querySelectorAll(".edit-event-url")

      for (let i = 0; i < eventNameInputs.length; i++) {
        if (eventNameInputs[i].value.trim() !== "") {
          events.push({
            name: eventNameInputs[i].value,
            date: eventDateInputs[i].value,
            url: eventUrlInputs[i].value,
          })
        }
      }

      const updatedAnimalData = {
        name,
        sciName,
        description,
        images,
        video,
        events,
      }

      fetch(`${API_URL}/animals/${animalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authToken: token,
        },
        body: JSON.stringify(updatedAnimalData),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.error || "Failed to update animal")
            })
          }
          return response.json()
        })
        .then((data) => {
          submitButton.textContent = originalButtonText
          submitButton.disabled = false

          alert("Animal updated successfully!")
          window.location.reload()
        })
        .catch((error) => {
          console.error("Error updating animal:", error)
          alert(`Error updating animal: ${error.message}`)

          submitButton.textContent = originalButtonText
          submitButton.disabled = false
        })
    })
  }

  if (cancelEdit) {
    cancelEdit.addEventListener("click", () => {
      editFormContainer.style.display = "none"
      animalContent.style.display = "block"
    })
  }

  if (editAnimalBtn) {
    editAnimalBtn.addEventListener("click", () => {
      animalContent.style.display = "none"
      editFormContainer.style.display = "block"
    })
  }

  if (deleteAnimalBtn) {
    deleteAnimalBtn.addEventListener("click", () => {
        confirmModal.style.display = "flex"
    })
  }

  if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener("click", () => {
          confirmModal.style.display = "none"
          deleteAnimalBtn.textContent = "Deleting..."
          deleteAnimalBtn.disabled = true
          
          fetch(`${API_URL}/animals/${animalId}`, {
              method: "DELETE",
              headers: {
                  "Content-Type": "application/json",
                  authToken: token
              }
          })
          .then(response => {
              if (!response.ok) {
                  return response.json().then(data => {
                      throw new Error(data.error || "Failed to delete animal")
                  })
              }
              return response.json()
          })
          .then(() => {
              alert("Animal deleted successfully!")
              window.location.href = "index.html"
          })
          .catch(error => {
              console.error("Error deleting animal:", error)
              alert(`Error deleting animal: ${error.message}`)
              deleteAnimalBtn.textContent = "Delete Animal"
              deleteAnimalBtn.disabled = false
          })
      })
  }

  if (cancelDeleteBtn) {
      cancelDeleteBtn.addEventListener("click", () => {
          confirmModal.style.display = "none"
      })
  }
})
