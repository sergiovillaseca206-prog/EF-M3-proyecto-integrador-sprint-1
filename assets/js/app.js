const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const ingredient = input.value.trim();
    if (!ingredient) return;

    // Limpiar resultados anteriores
    resultsContainer.innerHTML = "";

    try {
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
        const response = await fetch(url);
        const data = await response.json();

        // Si no hay resultados
        if (!data.meals) {
            mostrarMensajeSinResultados();
            return;
        }

        // Renderizar recetas
        renderizarRecetas(data.meals);

    } catch (error) {
        console.error("Error al obtener recetas:", error);
        mostrarMensajeError();
    }
});
// ===============================
// Renderizado dinámico de recetas
// ===============================
function renderizarRecetas(meals) {
    meals.forEach(meal => {

        // Desestructuración (criterio HU-05)
        const { strMeal, strMealThumb } = meal;

        resultsContainer.innerHTML += `
            <div class="col-md-3">
                <div class="card h-100 shadow-sm">
                    <img src="${strMealThumb}" class="card-img-top" alt="${strMeal}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${strMeal}</h5>
                        <a
                        href="#"
                        class="btn btn-primary mt-auto"
                        onclick="mostrarIngrediente('${ingredient}', this)"
                        >
                        Ver receta
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
}
// ===============================
function renderizarRecetas(meals) {
    meals.forEach(meal => {

        const { strMeal, strMealThumb } = meal;

        resultsContainer.innerHTML += `
            <div class="col-md-3">
                <div class="card h-100 shadow-sm">
                    <img src="${strMealThumb}" class="card-img-top" alt="${strMeal}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${strMeal}</h5>
                        <button 
                         class="btn btn-primary mt-auto"
                          onclick="mostrarIngrediente('${input.value.trim()}')"
                            >
                             Ver receta
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}
// ===============================
// Mensajes de estado
// ===============================
function mostrarMensajeSinResultados() {
    resultsContainer.innerHTML = `
        <div class="col-12 text-center">
            <p class="fw-semibold">
                Lo sentimos, no se encontraron recetas. Intenta con otro ingrediente.
            </p>
        </div>
    `;
}

function mostrarMensajeError() {
    resultsContainer.innerHTML = `
        <div class="col-12 text-center">
            <p class="text-danger">
                Ocurrió un error al buscar las recetas. Intenta nuevamente.
            </p>
        </div>
    `;
}
// ===============================
async function verIngrediente() {
    try {
        const response = await fetch(
            "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
        );

        const data = await response.json();

        // EJEMPLO: buscamos Cardamom
        const ingrediente = data.meals.find(
            item => item.strIngredient === "Cardamom"
        );

        if (!ingrediente) {
            alert("Ingrediente no encontrado");
            return;
        }

        alert(`
ID: ${ingrediente.idIngredient}
Ingrediente: ${ingrediente.strIngredient}
Descripción: ${ingrediente.strDescription}
Tipo: ${ingrediente.strType}
        `);

    } catch (error) {
        console.error(error);
        alert("Error al obtener ingrediente");
    }
}
async function mostrarIngrediente(nombreIngrediente) {
    const modalBody = document.getElementById("modalBody");

    modalBody.innerHTML = "<p>Cargando ingrediente...</p>";

    try {
        const response = await fetch(
            "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
        );
        const data = await response.json();

        const ingrediente = data.meals.find(
            item => item.strIngredient.toLowerCase() === nombreIngrediente.toLowerCase()
        );

        if (!ingrediente) {
            modalBody.innerHTML = "<p>Ingrediente no encontrado.</p>";
        } else {
            modalBody.innerHTML = `
                <pre class="bg-light p-3 rounded">
"idIngredient": "${ingrediente.idIngredient}"
"strIngredient": "${ingrediente.strIngredient}"
"strDescription": ${ingrediente.strDescription}
"strType": ${ingrediente.strType}
                </pre>
            `;
        }

        const modal = new bootstrap.Modal(
            document.getElementById("ingredientModal")
        );
        modal.show();

    } catch (error) {
        console.error(error);
        modalBody.innerHTML = "<p>Error al cargar el ingrediente.</p>";
    }
}
let ultimoBoton = null;

async function mostrarIngrediente(nombreIngrediente, boton) {
    ultimoBoton = boton;

    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = "<p>Cargando ingrediente...</p>";

    const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
    );
    const data = await response.json();

    const ingrediente = data.meals.find(
        i => i.strIngredient.toLowerCase() === nombreIngrediente.toLowerCase()
    );

    modalBody.innerHTML = ingrediente
        ? `<pre>${JSON.stringify(ingrediente, null, 2)}</pre>`
        : "<p>Ingrediente no encontrado</p>";

    const modalEl = document.getElementById("ingredientModal");
    const modal = new bootstrap.Modal(modalEl);

    modalEl.addEventListener("hidden.bs.modal", () => {
        ultimoBoton?.focus();
    }, { once: true });

    modal.show();
}
