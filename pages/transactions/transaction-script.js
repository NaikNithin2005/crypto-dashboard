 
//  Graph Chart

 const chart = document.querySelector("#chart").getContext("2d");

 new Chart(chart, {
    type: "line",
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"
            , "August", "September", "October", "November", "December"],
            datasets: [
                {
                    label: "Expenses",
                    data: [59374, 53537, 55631, 50095, 57816, 46684, 50572, 49936, 52895, 61004, 57313, 48116],
                    borderColor: "green",
                    borderWidth: 1,
                    fill: true,   
                    backgroundColor: "rgba(115, 255, 0, 0.15)", 
                    tension: 0.4, 
                    pointRadius: 0, 
                }
                // add any number of chats
            ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }

 })

 // Graph Chart 1

  const chart1 = document.querySelector("#chart1").getContext("2d");

 new Chart(chart1, {
    type: "bar",
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"
            , "August", "September", "October", "November", "December"],
            datasets: [
                {
                    label: "Expenses",
                    data: [59374, 53537, 55631, 50095, 57816, 46684, 50572, 49936, 52895, 61004, 57313, 48116],
                    borderColor: "purple",
                    borderWidth: 1,
                    fill: true,   
                    backgroundColor: "rgba(34, 0, 255, 0.15)", 
                    tension: 0.4, 
                    pointRadius: 0, 
                }
                // add any number of chats
            ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }

 })


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







