const loadData = async () => {
    const urlInput = document.getElementById("json-url");
    const container = document.getElementById("card-container");
    const jsonUrl = urlInput.value || "https://haxtheweb.org/site.json"; // Fallback to default URL if input is empty

    if (!jsonUrl) {
        alert("Please enter a valid JSON URL.");
        return;
    }

    try {
        const response = await fetch(jsonUrl);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Loaded Data:", data); // Debugging: log the full data

        container.innerHTML = ""; // Clear previous cards

        // Check and handle the 'site' data section
        if (data.site) {
            console.log("Site Data:", data.site); // Debugging: log site data
            const siteData = data.site;
            const siteCard = createCard(
                siteData.name || "Untitled Site",
                siteData.logo || "https://via.placeholder.com/150",
                `Language: ${siteData.lang || "Unknown"}<br>Version: ${siteData.version || "Unknown"}`,
                siteData // Send siteData to metadata
            );
            container.appendChild(siteCard);
        } else {
            console.warn("No site data found."); // Debugging: warn if no site data
        }

        // Check and handle the 'theme' data section
        if (data.theme) {
            console.log("Theme Data:", data.theme); // Debugging: log theme data
            const themeData = data.theme;
            const themeCard = createCard(
                themeData.name || "Untitled Theme",
                themeData.thumbnail || "https://via.placeholder.com/150",
                `Theme Element: ${themeData.element || "Unknown"}`,
                themeData.variables // Send themeData.variables to metadata
            );
            container.appendChild(themeCard);
        } else {
            console.warn("No theme data found."); // Debugging: warn if no theme data
        }

        // Check and handle the 'pages' data section if available
        if (data.pages && Array.isArray(data.pages)) {
            console.log("Pages Data:", data.pages); // Debugging: log pages data
            data.pages.forEach((page, index) => {
                if (page) {
                    const pageCard = createCard(
                        page.title || `Untitled Page ${index + 1}`,
                        page.thumbnail || "https://via.placeholder.com/150",
                        page.description || "No description available.",
                        page.metadata || {} // Send metadata to card function
                    );
                    container.appendChild(pageCard);
                }
            });
        } else {
            console.warn("No pages data found or pages is not an array."); // Debugging: warn if no pages data
        }

        // Handle other sections like settings or tags if available
        if (data.settings) {
            console.log("Settings Data:", data.settings); // Debugging: log settings data
            const settingsCard = createCard(
                "Settings",
                "https://via.placeholder.com/150",
                `Pathauto: ${data.settings.pathauto ? "Enabled" : "Disabled"}`,
                data.settings
            );
            container.appendChild(settingsCard);
        }

        if (data.tags) {
            console.log("Tags Data:", data.tags); // Debugging: log tags data
            const tagsCard = createCard(
                "Tags",
                "https://via.placeholder.com/150",
                `Tags: ${data.tags || "No tags available"}`,
                {}
            );
            container.appendChild(tagsCard);
        }

    } catch (error) {
        console.error("Failed to load data:", error);
        alert(`Failed to load data: ${error.message}`);
    }
};

// Helper function to create cards
const createCard = (title, imageUrl, description, metadata) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <img src="${imageUrl}" alt="${title}" />
        <h3>${title}</h3>
        <p>${description}</p>
        <p>Created: ${metadata?.created ? new Date(metadata.created * 1000).toLocaleDateString() : "Unknown"}</p>
        <p>Last Updated: ${metadata?.updated ? new Date(metadata.updated * 1000).toLocaleDateString() : "Unknown"}</p>
    `;

    return card;
};

// Attach the event listener to the button
document.getElementById("load-data").addEventListener("click", loadData);
