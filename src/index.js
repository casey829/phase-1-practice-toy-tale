let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const toyCollection = document.getElementById("toy-collection");

  // Function to fetch Andy's Toys
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => {
          renderToy(toy);
        });
      })
      .catch(error => console.error("Error fetching toys:", error));
  }

  // Function to render Toy Info to the Card
  function renderToy(toy) {
    const card = document.createElement("div");
    card.className = "card";

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.className = "toy-avatar";

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;

    const button = document.createElement("button");
    button.textContent = "Like ❤️";
    button.className = "like-btn";
    button.id = toy.id;
    button.addEventListener("click", function() {
      increaseLikes(toy);
    });

    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(button);

    toyCollection.appendChild(card);
  }

  // Add a New Toy
  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;
    const likes = 0;
    const newToy = {
      name: name,
      image: image,
      likes: likes
    };
    addNewToy(newToy);
    event.target.reset();
  });

  function addNewToy(toy) {
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(toy)
    })
      .then(response => response.json())
      .then(newToy => {
        renderToy(newToy);
      })
      .catch(error => console.error("Error adding new toy:", error));
  }

  // Increase a Toy's Likes
  function increaseLikes(toy) {
    const newLikes = toy.likes + 1;
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
      .then(response => response.json())
      .then(updatedToy => {
        const toyCard = document.getElementById(updatedToy.id);
        const likeParagraph = toyCard.querySelector("p");
        likeParagraph.textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error("Error updating likes:", error));
  }

  // Fetch Andy's Toys on page load
  fetchToys();
});