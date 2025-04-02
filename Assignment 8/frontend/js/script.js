document.addEventListener("DOMContentLoaded", async () => {
    // Load animals from API
    try {
        const response = await fetch('/api/animals');
        const animals = await response.json();
        displayAnimals(animals);
    } catch (error) {
        console.error('Error loading animals:', error);
    }

    // Slideshow and events code for individual animal pages
    if (document.querySelector('.slideshow-image')) {
        const animalName = document.title.replace("National Geographic - ", "");
        const images = [
            `images/${animalName.toLowerCase().replace(' ', '-')}/1.jpg`,
            `images/${animalName.toLowerCase().replace(' ', '-')}/2.jpg`,
            `images/${animalName.toLowerCase().replace(' ', '-')}/3.jpg`
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

        updateImage();

        // Date display
        const today = new Date();
        document.getElementById("current-date").textContent = today.toLocaleDateString();
    }
});

function displayAnimals(animals) {
    const container = document.getElementById('animal-grid');
    
    animals.forEach(animal => {
        const card = document.createElement('a');
        card.className = 'animal-card';
        card.href = `${animal.name.toLowerCase().replace(' ', '-')}.html`;
        
        card.innerHTML = `
            <img src="${animal.images[0]}" alt="${animal.name}">
            <h3>${animal.name}</h3>
            <p><i>${animal.sciName}</i></p>
        `;
        
        container.appendChild(card);
    });
}