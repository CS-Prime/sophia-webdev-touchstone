/**
 * @fileoverview Functions for Product category filter system
 * @author Cameron Simpson
 */

function productFilter() {
    const filterButtons = document.querySelectorAll(".product-filter button");
    const filterCategories = document.querySelectorAll(".product-category");
    const currentState = { selectedCategory: "all" };
    const storageKey = "productCategoryFilter";
    const savedState = sessionStorage.getItem(storageKey);

    if (savedState) {
        const parsedState = JSON.parse(savedState);
        currentState.selectedCategory = parsedState.selectedCategory;
    }

    function applyFilter() {
        filterCategories.forEach(function (category) {
            const categoryName = category.dataset.category;

            if (
                currentState.selectedCategory === "all" ||
                currentState.selectedCategory === categoryName
            ) {
                category.hidden = false;
            } else {
                category.hidden = true;
            }
        });

        filterButtons.forEach(function (button) {
            const isActive = button.dataset.filter === currentState.selectedCategory;

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", isActive.toString());
        });
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedCategory = button.dataset.filter;

            currentState.selectedCategory = selectedCategory;
            sessionStorage.setItem(storageKey, JSON.stringify(currentState));
            applyFilter();
        });
    });

    applyFilter();
}

productFilter();