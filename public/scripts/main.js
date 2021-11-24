
// light sliders
function makeSliders(set) {
    let sliders = document.querySelectorAll(".slider");

    sliders.forEach(function(slider) {
        console.log(slider.parentNode.getAttribute("id"));

        noUiSlider.create(slider, {
            start: [0, 100],
            step: 1,
            connect: true,
            behaviour: "drag",
            range: {
                'min': 0,
                'max': 100
            }
        });
    
    })
}

const _URL = "http://localhost:30002/api";

function makeSliderGroup(title, perc) {
    const parent = document.getElementById("sliderGroups");

    const sliderGroup = document.createElement("div");
        sliderGroup.classList.add("sliderGroup");
        sliderGroup.setAttribute("id", title);
    parent.appendChild(sliderGroup);

    const sliderGroupMeta = document.createElement("div");
        sliderGroupMeta.classList.add("sliderGroupMeta");
    sliderGroup.appendChild(sliderGroupMeta);

    const h2 = document.createElement("h2");
        h2.textContent = title;
    sliderGroupMeta.appendChild(h2);

    const percSpan = document.createElement("span");
        percSpan.textContent = perc;
        percSpan.setAttribute("id", `${perc}%`);
    sliderGroupMeta.appendChild(percSpan);
}

function getWeekDay(number) {
    weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return weekDays[number];
}

function getData() {
    const url = `${_URL}/getData`;

    fetch(url).then(res => res.json())
    .then(function(data) {
        console.log("Return data:", data);

        let count = 0;
        data.forEach(function (item) {
            
            // get first -> first is big, 'cause today
            if(count == 1) {
                makeSliderGroup("today", item.timeInHours);
            }
            else if(count > 1 && count < 7) {
                makeSliderGroup(getWeekDay(count), item.timeInHours);
            }
            else {
                makeSliderGroup(item.date, item.timeInHours);
            }
            
            count++;
            // then get next 6, a little smaller 'cause last week
            // then get all the rest and make it small 'cause just logs
        })
    })

    .then(function (foo) {
        makeSliders();
    })
}

getData();

// 1. get Data from Database
// 2. make sliderGroups for all available dates
// 3. construct sliders