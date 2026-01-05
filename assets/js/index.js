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
                        <a href="#" class="btn btn-primary mt-auto">
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
                          onclick="mostrarIngrediente('${strMeal}')"
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
async function mostrarIngrediente(nombreComida) {
    const modalBody = document.getElementById("modalBody");

    modalBody.innerHTML = "<p>Cargando ingrediente...</p>";

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${nombreComida}`);
        const data = await response.json();
        if (!data) {
            modalBody.innerHTML = "<p>Plato no encontrado.</p>";
        } else {
            const meal = data.meals[0];

            // Construir lista de ingredientes dinámicamente
            let ingredientsHTML = "";
            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];

                if (ingredient && ingredient.trim() !== "") {
                    ingredientsHTML += `<li>${measure || ""} ${ingredient}</li>`;
                }
            }

            modalBody.innerHTML = `
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-5">
        <img src="${meal.strMealThumb}" 
             alt="${meal.strMeal}" 
             class="img-fluid rounded mb-3">
        <p><strong>Categoría:</strong> ${meal.strCategory}</p>
        <p><strong>Origen:</strong> ${meal.strArea}</p>
        <p><strong>Etiquetas:</strong> ${meal.strTags || "N/A"}</p>
        <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger btn-sm">
          Ver en YouTube
        </a>
      </div>

      <div class="col-md-7">
        <h4>${meal.strMeal}</h4>

        <h6 class="mt-3">Ingredientes</h6>
        <ul>
          ${ingredientsHTML}
        </ul>

        <h6 class="mt-3">Instrucciones</h6>
        <p style="white-space: pre-line;">
          ${meal.strInstructions}
        </p>
      </div>
    </div>
  </div>
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