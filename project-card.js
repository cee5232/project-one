document.addEventListener('DOMContentLoaded', () => {
    const loadButton = document.getElementById('load-data');
    const jsonUrlInput = document.getElementById('json-url');
    const cardContainer = document.getElementById('card-container');
  
    loadButton.addEventListener('click', async () => {
      const jsonUrl = jsonUrlInput.value.trim();
      if (!jsonUrl) {
        alert('Please enter a valid JSON URL.');
        return;
      }
  
      try {
        const response = await fetch(jsonUrl);
        if (!response.ok) throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        const jsonData = await response.json();
  
        // Clear previous cards
        cardContainer.innerHTML = '';
  
        // Display site metadata
        const site = jsonData.metadata?.site || {};
        const siteCard = document.createElement('div');
        siteCard.className = 'card';
        siteCard.innerHTML = `
          <h3>${site.name || 'No Site Name'}</h3>
          <p>Description: ${site.description || 'No Description'}</p>
          <p>Created: ${site.created ? new Date(site.created * 1000).toLocaleDateString() : 'Unknown'}</p>
          <p>Last Updated: ${site.updated ? new Date(site.updated * 1000).toLocaleDateString() : 'Unknown'}</p>
        `;
        cardContainer.appendChild(siteCard);
  
        // Render each page item
        jsonData.items?.forEach(item => {
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `
            <h3>${item.title || 'No Title'}</h3>
            <p>${item.description || 'No Description'}</p>
            <p>Last Updated: ${item.metadata.updated ? new Date(item.metadata.updated * 1000).toLocaleDateString() : 'Unknown'}</p>
            <a href="${item.location || '#'}" target="_blank">View Page</a>
          `;
          cardContainer.appendChild(card);
        });
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to load data. Please check the URL and try again.');
      }
    });
  });
  