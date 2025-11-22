//Sidebar Menu

const Sidebar = document.querySelector(".sidebar")
const closeSidebarbtn = document.querySelector(".sidebar_close-btn")
const openSidebarbtn = document.querySelector(".nav_menu-btn")

openSidebarbtn.addEventListener("click", () => {
   Sidebar.style.display = "flex";
})

closeSidebarbtn.addEventListener("click", () => {
   Sidebar.style.display = "none";
})


// Theme Toggel

const themeBtn = document.querySelector(".nav_theme-btn");

// Load saved theme
const savedTheme = localStorage.getItem("currentTheme");

// Apply saved theme (if exists)
if (savedTheme === "dark-theme") {
    document.body.classList.add("dark-theme");
    themeBtn.innerHTML = '<i class="uil uil-sun"></i>';
} else {
    themeBtn.innerHTML = '<i class="uil uil-moon"></i>';
}

// Toggle on click
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {
        themeBtn.innerHTML = '<i class="uil uil-sun"></i>';
        localStorage.setItem("currentTheme", "dark-theme");
    } else {
        themeBtn.innerHTML = '<i class="uil uil-moon"></i>';
        localStorage.setItem("currentTheme", "light-theme");
    }
});
