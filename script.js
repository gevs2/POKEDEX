const pokedex = document.getElementById("pokedex");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalTypes = document.getElementById("modalTypes");
const modalHP = document.getElementById("modalHP");
const modalHeight = document.getElementById("modalHeight");
const modalWeight = document.getElementById("modalWeight");
const modalAbilities = document.getElementById("modalAbilities");
const modalStats = document.getElementById("modalStats");
const search = document.getElementById("search");

let allPokemon = [];

async function fetchPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return res.json();
}

async function loadPokedex() {
  const ids = Array.from({ length: 150 }, (_, i) => i + 1)
    .sort(() => 0.5 - Math.random())
    .slice(0, 40);
  for (const id of ids) {
    const p = await fetchPokemon(id);
    allPokemon.push(p);
    displayCard(p);
  }
}

function displayCard(p) {
  const card = document.createElement("div");
  card.classList.add("card");
  const types = p.types
    .map((t) => <span class="type">${t.type.name}</span>)
    .join("");
  const hp = p.stats[0].base_stat;

  card.innerHTML = `
    <img src="${p.sprites.front_default}" alt="${p.name}" />
    <h3>${p.name}</h3>
    ${types}
    <p><strong>HP:</strong> ${hp}</p>
    <div class="hp-bar"><div class="hp-fill" style="width:${Math.min(
      hp,
      100
    )}%"></div></div>
  `;
  card.onclick = () => showModal(p);
  pokedex.appendChild(card);
}

function showModal(p) {
  modal.style.display = "flex";
  modalImg.src =
    p.sprites.other["official-artwork"].front_default ||
    p.sprites.front_default;
  modalName.textContent = p.name;
  modalTypes.innerHTML = p.types
    .map((t) => <span class="type">${t.type.name}</span>)
    .join("");
  modalHP.textContent = p.stats[0].base_stat;
  modalHeight.textContent = (p.height / 10).toFixed(1);
  modalWeight.textContent = (p.weight / 10).toFixed(1);
  modalAbilities.textContent = p.abilities
    .map((a) => a.ability.name)
    .join(", ");
  modalStats.innerHTML = p.stats
    .map(
      (stat) => `
    <p>${stat.stat.name.toUpperCase()}: ${stat.base_stat}</p>
    <div class="stat-bar"><div class="stat-fill" style="width:${Math.min(
      stat.base_stat,
      100
    )}%"></div></div>
  `
    )
    .join("");
}

function closeModal() {
  modal.style.display = "none";
}

search.addEventListener("input", () => {
  const val = search.value.toLowerCase();
  pokedex.innerHTML = "";
  allPokemon.filter((p) => p.name.includes(val)).forEach(displayCard);
});

loadPokedex();
