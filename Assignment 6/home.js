async function fetchProducts() {
  try {
    const response = await fetch('http://67.205.143.29:3000/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

function renderProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const productLink = document.createElement('a');
  productLink.href = `product.html?id=${product.id}`;
  productLink.style.textDecoration = 'none';
  productLink.style.color = 'inherit';

  const img = document.createElement('img');
  img.src = product.images[0];
  img.alt = product.name;

  const name = document.createElement('h3');
  name.textContent = product.name;
  name.style.marginBottom = "10px";

  const stars = document.createElement('div');
  stars.className = 'stars';

  for (let i = 0; i < 5; i++) {
    const star = document.createElement('div');
    const uniqueId = `star-gradient-${product.id}-${i}`;
    const percentage = Math.min(1, Math.max(0, product.ratingAverage - i)) * 100;

    star.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="25" height="25">
        <defs>
          <linearGradient id="${uniqueId}">
            <stop offset="${percentage}%" stop-color="rgb(222, 121, 38)"/>
            <stop offset="${percentage}%" stop-color="grey"/>
          </linearGradient>
        </defs>
        <path fill="url(#${uniqueId})" d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,12.118l11.547-1.2L16.026,0.6L20.388,10.918z"/>
      </svg>
    `;

    stars.appendChild(star);
  }

  const price = document.createElement('div');
  price.className = 'price';
  if (product.discount && product.discount > 0) {
    price.innerHTML = `<span class="original-price">$${product.price.toFixed(2)}</span> <span class="discounted-price">$${calculateDiscount(product.price, product.discount)}</span>`;
  } else {
    price.textContent = `$${product.price.toFixed(2)}`;
  }

  productLink.appendChild(img);
  productLink.appendChild(name);
  productLink.appendChild(stars);
  productLink.appendChild(price);

  card.appendChild(productLink);

  return card;
}

async function displayProducts() {
  const products = await fetchProducts();
  const container = document.getElementById('product-container');
  const itemCount = document.getElementById('item-count');

  itemCount.textContent = products.length;

  container.innerHTML = "";

  products.sort((a, b) => a.name.localeCompare(b.name)).forEach(product => {
    const card = renderProductCard(product);
    container.appendChild(card);
  });
}

function calculateDiscount(price, discount) {
  return (price * (1 - discount / 100)).toFixed(2);
}

displayProducts();