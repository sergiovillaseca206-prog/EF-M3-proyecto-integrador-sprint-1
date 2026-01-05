const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const ingredient = input.value.trim();
    if (!ingredient) return;

    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    resultsContainer.innerHTML = "";

    if (!data.meals) {
        resultsContainer.innerHTML = `
            <div class="col-12 text-center">
                <p>No se encontraron recetas</p>
            </div>
        `;
        return;
    }

    data.meals.forEach(meal => {
        resultsContainer.innerHTML += `
            <div class="col-md-3">
                <div class="card h-100 shadow-sm">
                    <img src="${meal.strMealThumb}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${meal.strMeal}</h5>
                        <a href="#" class="btn btn-primary">Ver receta</a>
                    </div>
                </div>
            </div>
        `;
    });
});