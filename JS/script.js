const track = document.querySelector("[data-track]");
const dotsContainer = document.querySelector("[data-dots]");
const feedback = document.querySelector("#form-feedback");
const form = document.querySelector("#character-form");
const carousel = document.querySelector("[data-carousel]");
const tabs = document.querySelectorAll(".tab");
const tabTriggers = document.querySelectorAll("[data-tab-target]");
const panels = document.querySelectorAll(".panel");

const fallbackCharacters = [
  {
    name: "Seraphine dos Ventos",
    universe: "Zephyria",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    story:
      "Comandante da guarda aérea de Zephyria, Seraphine patrulha os céus e inspira novas gerações de protetores do reino."
  },
  {
    name: "Kael Tempes",
    universe: "Zephyria",
    image:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=1200&q=80",
    story:
      "Exilado do Clã Nimbus, Kael dominou as correntes de ar e hoje protege as fronteiras entre as ilhas suspensas de Zephyria."
  },
  {
    name: "Elyra Aurora",
    universe: "Zephyria",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
    story:
      "Portadora da Chama Solar, Elyra reuniu cidades rivais para derrotar a Névoa Eterna e restaurar a paz no reino."
  }
];

let characters = [];
let currentIndex = 0;

function setActiveTab(tabId) {
  tabs.forEach((tab) => {
    tab.classList.toggle("tab--active", tab.dataset.tab === tabId);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("panel--active", panel.id === tabId);
  });
}

function createCard(character) {
  const card = document.createElement("article");
  card.className = "character-card";
  card.innerHTML = `
    <img src="${character.image}" alt="Imagem de ${character.name}" loading="lazy" />
    <div class="character-info">
      <h3>${character.name}</h3>
      <span class="tag">${character.universe}</span>
      <p>${character.story}</p>
    </div>
  `;
  return card;
}

function createDot(index) {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.ariaLabel = `Ir para personagem ${index + 1}`;
  dot.addEventListener("click", () => goTo(index));
  return dot;
}

function updateCarouselPosition() {
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  [...dotsContainer.children].forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
}

function goTo(index) {
  if (!characters.length) {
    return;
  }

  currentIndex = (index + characters.length) % characters.length;
  updateCarouselPosition();
}

function renderCarousel() {
  track.innerHTML = "";
  dotsContainer.innerHTML = "";

  characters.forEach((character, index) => {
    track.appendChild(createCard(character));
    dotsContainer.appendChild(createDot(index));
  });

  if (currentIndex >= characters.length) {
    currentIndex = 0;
  }

  updateCarouselPosition();
}

async function fetchCharacters() {
  try {
    const response = await fetch("/api/characters");
    if (!response.ok) {
      throw new Error("Falha ao buscar API");
    }

    const data = await response.json();
    characters = data.length ? data : [...fallbackCharacters];
  } catch {
    characters = [...fallbackCharacters];
    feedback.textContent = "Sem conexão com API, usando lista local de exemplo.";
    feedback.style.color = "#8d6a00";
  }

  renderCarousel();
}

carousel.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const isNext = button.dataset.action === "next";
  goTo(isNext ? currentIndex + 1 : currentIndex - 1);
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveTab(tab.dataset.tab));
});

tabTriggers.forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.tabTarget));
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const newCharacter = {
    name: formData.get("name").toString().trim(),
    universe: formData.get("universe").toString().trim(),
    image: formData.get("image").toString().trim(),
    story: formData.get("story").toString().trim()
  };

  if (Object.values(newCharacter).some((value) => !value)) {
    feedback.textContent = "Preencha todos os campos para salvar.";
    feedback.style.color = "#a63838";
    return;
  }

  try {
    const response = await fetch("/api/characters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCharacter)
    });

    if (!response.ok) {
      throw new Error("Falha ao salvar personagem");
    }

    const created = await response.json();
    characters.push(created);
    currentIndex = characters.length - 1;
    renderCarousel();
    form.reset();
    setActiveTab("hall");

    feedback.textContent = `Lenda "${created.name}" adicionada com sucesso!`;
    feedback.style.color = "#227a42";
  } catch {
    feedback.textContent = "Não foi possível salvar agora. Tente novamente.";
    feedback.style.color = "#a63838";
  }
});

fetchCharacters();
