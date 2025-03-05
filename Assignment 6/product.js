async function fetchProduct(productId) {
  try {
    const response = await fetch(`http://67.205.143.29:3000/products/${productId}`);
    if (!response.ok) {
      if (response.status === 404) {
        window.location.href = 'home.html';
      }
      throw new Error('Failed to fetch product');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

function renderProductDetails(product) {
  document.title = product.name;
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('seller-name').textContent = product.sellerName;
  document.getElementById('average-rating').textContent = product.ratingAverage.toFixed(1);
  document.getElementById('total-ratings').textContent = `(${product.numberOfRatings} Ratings)`;
  document.getElementById('product-description').textContent = product.description;

  const priceElement = document.getElementById('original-price');
  const discountedPriceElement = document.getElementById('discounted-price');

  if (product.discount && product.discount > 0) {
    priceElement.innerHTML = `<span class="strikethrough">$${product.price.toFixed(2)}</span>`;
    discountedPriceElement.textContent = `$${calculateDiscount(product.price, product.discount)}`;
  } else {
    priceElement.textContent = `$${product.price.toFixed(2)}`;
    discountedPriceElement.textContent = '';
  }

  renderStars(product.ratingAverage);
  renderImageSelector(product.images);
}

function renderStars(ratingAverage) {
  const starsContainer = document.querySelector('.stars');
  starsContainer.innerHTML = '';
  
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('div');
    star.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20">
        <defs>
          <linearGradient id="star-gradient-${i}">
            <stop offset="${Math.min(1, Math.max(0, ratingAverage - i)) * 100}%" stop-color="rgb(222, 121, 38)"/>
            <stop offset="${Math.min(1, Math.max(0, ratingAverage - i)) * 100}%" stop-color="grey"/>
          </linearGradient>
        </defs>
        <path fill="url(#star-gradient-${i})" d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,12.118l11.547-1.2L16.026,0.6L20.388,10.918z"/>
      </svg>
    `;
    starsContainer.appendChild(star);
  }
}

function renderImageSelector(images) {
  const mainImage = document.getElementById('main-image');
  const thumbnailContainer = document.querySelector('.thumbnail-container');

  thumbnailContainer.innerHTML = '';

  mainImage.src = images[0];

  images.forEach((image, index) => {
    const thumbnail = document.createElement('img');
    thumbnail.src = image;
    thumbnail.className = 'thumbnail';
    thumbnail.addEventListener('mouseover', () => {
      mainImage.src = image;

      thumbnailContainer.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('selected'));

      thumbnail.classList.add('selected');
    });

    if (index === 0) {
      thumbnail.classList.add('selected');
    }

    thumbnailContainer.appendChild(thumbnail);
  });
}

function calculateDiscount(price, discount) {
  return (price * (1 - discount / 100)).toFixed(2);
}

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

if (productId) {
  fetchProduct(productId).then(product => {
    if (product) {
      renderProductDetails(product);
    }
  });
} else {
  window.location.href = 'home.html';
}