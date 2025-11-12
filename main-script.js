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



