
const mapElement = document.getElementById("map");

if (mapElement && typeof mapboxgl !== "undefined") {
    const token = mapElement.dataset.token;
    const lng = Number(mapElement.dataset.lng);
    const lat = Number(mapElement.dataset.lat);
    const location = mapElement.dataset.location;

    if (
        token &&
        Number.isFinite(lng) &&
        Number.isFinite(lat)
    ) {
        mapboxgl.accessToken = token;

        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v12",
            center: [lng, lat],
            zoom: 9
        });

        map.addControl(new mapboxgl.NavigationControl());

        // Create popup
        const popupContent = document.createElement("div");
        popupContent.className = "wander-map-popup";

        const label = document.createElement("span");
        label.className = "wander-popup-label";
        label.textContent = "YOUR STAY LOCATION";

        const heading = document.createElement("h4");
        heading.className = "wander-popup-title";
        heading.textContent = "Your next adventure starts here!";

        const address = document.createElement("p");
        address.className = "wander-popup-address";
        address.textContent = "📍 " + (location || "Explore this destination");

        const footer = document.createElement("p");
        footer.className = "wander-popup-footer";
        footer.textContent = "Explore the neighborhood and discover what's nearby.";

        popupContent.append(label, heading, address, footer);

        // Popup on marker click
        const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            maxWidth: "280px",
            className: "wander-popup"
        }).setDOMContent(popupContent);

        // Red location marker
        new mapboxgl.Marker({
            color: "#fe424d"
        })
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map);
    }
}
