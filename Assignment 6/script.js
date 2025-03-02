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

  const img = document.createElement('img');
  img.src = product.images[0];
  img.alt = product.name;
  img.addEventListener('mouseenter', () => img.style.transform = 'scale(1.05)');
  img.addEventListener('mouseleave', () => img.style.transform = 'scale(1)');
  img.addEventListener('mousedown', () => img.style.transform = 'scale(0.95)');
  img.addEventListener('mouseup', () => img.style.transform = 'scale(1.05)');

  const productLink = document.createElement('a');
  productLink.href = `product.html?id=${product.id}`;
  productLink.appendChild(img);

  const name = document.createElement('h3');
  name.textContent = product.name;
  name.addEventListener('mouseenter', () => name.style.color = 'gold');
  name.addEventListener('mouseleave', () => name.style.color = 'black');

  const stars = document.createElement('div');
  stars.className = 'stars';
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('img');
    star.src = 'images/Star.svg';
    star.className = 'star-svg';
    star.style.fill = i < product.rating ? 'gold' : 'grey';
    stars.appendChild(star);
  }

  const price = document.createElement('div');
  price.className = 'price';
  if (product.discount) {
    price.innerHTML = `<span class="original-price">$${product.price.toFixed(2)}</span> <span class="discounted-price">$${calculateDiscount(product.price, product.discount)}</span>`;
  } else {
    price.textContent = `$${product.price.toFixed(2)}`;
  }

  card.appendChild(productLink);
  card.appendChild(name);
  card.appendChild(stars);
  card.appendChild(price);

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