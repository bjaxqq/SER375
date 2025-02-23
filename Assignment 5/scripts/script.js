document.addEventListener("DOMContentLoaded", function () {
    const images = [
        "images/tree_kangaroo_2.jpg",
        "images/tree_kangaroo_3.jpeg",
        "images/tree_kangaroo_4.jpeg",
        "images/tree_kangaroo_5.jpeg",
        "images/tree_kangaroo_6.jpeg"
    ];
    let currentIndex = 0;
    
    const slideshowImage = document.querySelector(".slideshow-image");
    const imageCounter = document.getElementById("image-counter");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

    function updateImage() {
        slideshowImage.src = images[currentIndex];
        imageCounter.textContent = `${currentIndex + 1}/${images.length}`;
    }

    nextButton.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % images.length;
        updateImage();
    });

    prevButton.addEventListener("click", function () {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateImage();
    });

    slideshowImage.addEventListener("dblclick", function () {
        currentIndex = (currentIndex + 1) % images.length;
        updateImage();
    });

    updateImage();

    const today = new Date();
    const currentDateElement = document.getElementById("current-date");
    currentDateElement.textContent = today.toLocaleDateString();

    const events = [
        {
            name: "Exhibit at Museum",
            date: "1/18/2025",
            url: "https://www.example.com/exhibit-at-museum"
        },
        {
            name: "Lecture",
            date: "2/5/2025",
            url: "https://www.example.com/lecture"
        },
        {
            name: "Meet the Goodfellow's Tree Kangaroo",
            date: "3/8/2025",
            url: "https://www.example.com/meet-the-animal"
        }
    ];

    const pastEventsContainer = document.getElementById("past-events");
    const upcomingEventsContainer = document.getElementById("upcoming-events");
    const pastEventsHeading = document.getElementById("past-events-heading");
    const upcomingEventsHeading = document.getElementById("upcoming-events-heading");

    let hasPastEvents = false;
    let hasUpcomingEvents = false;

    events.forEach(event => {
        const eventDate = new Date(event.date);
        const eventCard = document.createElement("a");
        eventCard.className = "event-card";
        eventCard.href = event.url;
        eventCard.target = "_blank";
        eventCard.innerHTML = `
            <p>${event.name} - ${eventDate.toLocaleDateString()}</p>
        `;

        if (eventDate < today) {
            pastEventsContainer.appendChild(eventCard);
            hasPastEvents = true;
        } else {
            upcomingEventsContainer.appendChild(eventCard);
            hasUpcomingEvents = true;
        }
    });

    pastEventsHeading.style.display = hasPastEvents ? "block" : "none";
    upcomingEventsHeading.style.display = hasUpcomingEvents ? "block" : "none";
});