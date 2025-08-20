// Import required modules
import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import cors from 'cors'; // Enable CORS for frontend requests

const app = express();
const port = 3000;

// Use CORS middleware to allow cross-origin requests from frontend
app.use(cors());

// Endpoint to scrape Amazon search results
// Endpoint to scrape Amazon search results
app.get('/api/scrape', async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  try {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer': 'https://www.amazon.com/',
      },
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const productElements = document.querySelectorAll('div.s-result-item[data-component-type="s-search-result"]');

    const products = [];

    productElements.forEach((el) => {
      // Extract title from aria-label on h2
      const titleEl = el.querySelector('h2');
      const title = titleEl ? titleEl.getAttribute('aria-label')?.trim() : null;

      // Find reviews block
      const reviewsBlock = el.querySelector('div[data-cy="reviews-block"]');

      // Extract rating from aria-label (e.g., "4.5 out of 5 stars")
      let rating = null;
      if (reviewsBlock) {
        const ratingEl = reviewsBlock.querySelector('a[aria-label*="out of"]');
        const ratingText = ratingEl ? ratingEl.getAttribute('aria-label') : null;
        if (ratingText) {
          const match = ratingText.match(/(\d+\.?\d*)/);
          rating = match ? parseFloat(match[0]) : null;
        }
      }

      // Extract number of reviews from aria-label (e.g., "1,234 ratings")
      let reviews = 0;
      if (reviewsBlock) {
        const reviewsEl = reviewsBlock.querySelector('a[aria-label*="ratings"]');
        const reviewsText = reviewsEl ? reviewsEl.getAttribute('aria-label')?.replace(/[^0-9]/g, '') : '0';
        reviews = parseInt(reviewsText, 10) || 0;
      }

      // Extract image URL
      const imageEl = el.querySelector('.s-image');
      const imageUrl = imageEl ? imageEl.getAttribute('src') : null;

      if (title && imageUrl) {
        products.push({
          title,
          rating,
          reviews,
          imageUrl,
        });
      }
    });

    if (products.length === 0) {
      // Log for debugging (check server console)
      console.log('No products extracted. Possible causes: Selector changes, CAPTCHA, or no results on page.');
      return res.json([]); // Return empty array gracefully
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to scrape data: ' + error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});