 
//  Graph Chart

 const chart = document.querySelector("#chart").getContext("2d");

 new Chart(chart, {
    type: "line",
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"
            , "August", "September", "October", "November", "December"],
            datasets: [
                {
                    label: "BTC",
                    data: [66548, 54345, 95453, 87665, 75432, 78665, 57335, 65457, 68743, 85332, 76523, 85445],
                    borderColor: "green",
                    borderWidth: 2,
                    fill: true,   
                    backgroundColor: "rgba(106, 255, 0, 0.17)", 
                    tension: 0.1, 
                    pointRadius: 3,
                    pointstyle: "rect" 
                },
                {
                    label: "ETH",
                    data: [49374, 53537, 69631, 65095, 67816, 66684, 63572, 59936, 58895, 71004, 67313, 78116],
                    borderColor: "blue",
                    borderWidth: 2,
                    fill: true,   
                    backgroundColor: "rgba(13, 16, 203, 0.47)", 
                    tension: 0.1, 
                    pointRadius: 3,
                },
                {
                    label: "EUR",
                    data: [59374, 65537, 49631, 59095, 61816, 55684, 57572, 50936, 58895, 80004, 61313, 68116],
                    borderColor: "red",
                    borderWidth: 1.5,
                    fill: true,   
                    backgroundColor: "rgba(255, 0, 0, 0.4)", 
                    tension: 0.1, 
                    pointRadius: 3,
                

                }
                    
                // add any number of chats
            ]
    },
    options: {
        responsive: true,
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

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme")
    if(document.body.classList.contains("dark-theme")){
        themeBtn.innerHTML = '<i class="uil uil-sun"></i>'

        localStorage.setItem("currentTheme", "dark-theme")
    } else {
        themeBtn.innerHTML = '<i class="uil uil-moon"></i>'

        localStorage.setItem("currentTheme", " ")

    }
})

document.body.className =localStorage.getItem("currentTheme")
if(document.body.classList.contains("dark-theme")){
    themeBtn.innerHTML = '<i class="uil uil-sun"></i>'

    localStorage.setItem("currentTheme", "dark-theme")
} else {
    themeBtn.innerHTML = '<i class="uil uil-moon"></i>'

    localStorage.setItem("currentTheme", " ")

}

// Visitor Counter 

const visitorCountEl = document.querySelector("#visitor-count");

if (visitorCountEl) {
    let visits = parseInt(localStorage.getItem("ninarVisitCount") || "0", 10);
    visits += 1;
    localStorage.setItem("ninarVisitCount", visits);
    visitorCountEl.textContent = visits.toLocaleString();
}





