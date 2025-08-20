// main.js
// Event listener for search button
document.getElementById('searchBtn').addEventListener('click', async () => {
  const keyword = document.getElementById('keyword').value.trim();
  const resultsDiv = document.getElementById('results');

  // Validate input
  if (!keyword) {
    resultsDiv.innerHTML = '<p class="error">Please enter a keyword.</p>';
    return;
  }

  // Show loading state
  resultsDiv.innerHTML = '<p>Loading...</p>';

  try {
    // Make AJAX call to backend endpoint
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const products = await response.json();

    // Clear results and display products
    resultsDiv.innerHTML = '';
    if (products.length === 0) {
      resultsDiv.innerHTML = '<p>No products found.</p>';
    } else {
      products.forEach((product) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
          <img src="${product.imageUrl}" alt="${product.title}" />
          <div class="product-info">
            <h3>${product.title}</h3>
            <p>Rating: ${product.rating ? product.rating + ' stars' : 'N/A'}</p>
            <p>Reviews: ${product.reviews}</p>
          </div>
        `;
        resultsDiv.appendChild(productDiv);
      });
    }
  } catch (error) {
    // Handle errors gracefully
    resultsDiv.innerHTML = `<p class="error">Error: ${error.message}. Please try again.</p>`;
  }
});

