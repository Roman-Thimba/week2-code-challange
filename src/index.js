document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("guest-form");
  const nameInput = document.getElementById("guest-name");
  const categoryInput = document.getElementById("guest-category");
  const guestList = document.getElementById("guest-list");
  const filterCategory = document.getElementById("filter-category");
  const searchBar = document.getElementById("search-bar");
  const sortButton = document.getElementById("sort-button");

  let guests = [];
  let sortAsc = true;

  // Add a new guest
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const category = categoryInput.value;

    if (!name || guests.length >= 10) {
      if (guests.length >= 10) alert("Guest limit reached (10)");
      return;
    }

    // Create a guest object
    const guest = {
      name,
      category,
      time: new Date().toLocaleTimeString(),
      attending: true,
    };

    guests.push(guest);
    nameInput.value = "";
    renderGuests();
  });

  // Render all guests (filtered, searched, and sorted)
  function renderGuests() {
    guestList.innerHTML = "";

    let filtered = guests.filter((guest) => {
      const matchesCategory =
        filterCategory.value === "All" ||
        guest.category === filterCategory.value;
      const matchesSearch = guest.name
        .toLowerCase()
        .includes(searchBar.value.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (!sortAsc) {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    filtered.forEach((guest, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${guest.name}</strong>
        <span class="tag ${guest.category.toLowerCase()}">${guest.category}</span><br/>
        <small>Added: ${guest.time}</small>
        <div class="buttons">
          <button class="rsvp">${guest.attending ? "Attending" : "Not Attending"}</button>
          <button class="edit">Edit</button>
          <button class="remove">Remove</button>
        </div>
      `;

      // RSVP toggle
      li.querySelector(".rsvp").addEventListener("click", () => {
        guest.attending = !guest.attending;
        renderGuests();
      });

      // Edit guest name
      li.querySelector(".edit").addEventListener("click", () => {
        const newName = prompt("Edit guest name:", guest.name);
        if (newName) {
          guest.name = newName.trim();
          renderGuests();
        }
      });

      // Remove guest
      li.querySelector(".remove").addEventListener("click", () => {
        guests.splice(index, 1);
        renderGuests();
      });

      guestList.appendChild(li);
    });
  }

  // Event: Filter by category
  filterCategory.addEventListener("change", renderGuests);

  // Event: Search by name
  searchBar.addEventListener("input", renderGuests);

  // Event: Sort A–Z toggle
  sortButton.addEventListener("click", (e) => {
    e.preventDefault();
    sortAsc = !sortAsc;
    sortButton.textContent = sortAsc ? "Sort A–Z" : "Sort Z–A";
    renderGuests();
  });
});