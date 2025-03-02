async function fetchProduct(productId) {
  try {
    const response = await fetch(`http://67.205.143.29:3000/products/${productId}`);
    if (!response.ok) {
      if (response.status === 404) {
        window.location.href = 'index.html';
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
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('seller-name').textContent = `Sold by: ${product.seller}`;
  document.getElementById('average-rating').textContent = product.rating;
  document.getElementById('total-ratings').textContent = `(${product.totalRatings} Ratings)`;
  document.getElementById('product-description').textContent = product.description;

  const priceElement = document.getElementById('original-price');
  const discountedPriceElement = document.getElementById('discounted-price');

  if (product.discount) {
    priceElement.innerHTML = `<span class="strikethrough">$${product.price.toFixed(2)}</span>`;
    discountedPriceElement.textContent = `$${calculateDiscount(product.price, product.discount)}`;
  } else {
    priceElement.textContent = `$${product.price.toFixed(2)}`;
    discountedPriceElement.textContent = '';
  }

  renderStars(product.rating);
  renderImageSelector(product.images);
}

function renderStars(rating) {
  const starsContainer = document.querySelector('.stars');
  starsContainer.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('img');
    star.src = 'images/Star.svg';
    star.className = 'star-svg';
    star.style.fill = i < rating ? 'gold' : 'grey';
    starsContainer.appendChild(star);
  }
}

function renderImageSelector(images) {
  const mainImage = document.getElementById('main-image');
  const thumbnailContainer = document.querySelector('.thumbnail-container');

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
    thumbnailContainer.appendChild(thumbnail);
  });

  thumbnailContainer.querySelector('.thumbnail').classList.add('selected');
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
  window.location.href = 'index.html';
}