 
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
                    data: [29374, 33537, 49631, 59095, 57816, 36684, 33572, 39936, 48895, 61004, 57313, 48116],
                    borderColor: "red",
                    borderWidth: 2,
                },
                {
                    label: "ETH",
                    data: [46548, 54345, 95453, 87665, 75432, 78665, 57335, 45457, 68743, 85332, 76523, 85445],
                    borderColor: "blue",
                    borderWidth: 2,
                },
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





