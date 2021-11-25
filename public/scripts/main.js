
// light sliders
function makeSliders(set) {
    let sliders = document.querySelectorAll(".slider");

    sliders.forEach(function(slider) {

        const timeVal = slider.previousElementSibling.querySelector("span").dataset.time/60;
        
        noUiSlider.create(slider, {
            start: [0, timeVal],
            connect: true,
            behaviour: "drag",
            range: {
                'min': 0,
                'max': 20
            }
        });

        // update WeekSlider on change of others
        slider.noUiSlider.on('end', function(values, handle) {
            updateWeekSlider();
            updateSliderVals(slider, values);
        });

        // initial set
        updateSliderVals(slider, [0,timeVal])
    })
}



function controlsLogic(state) {
    const control = document.querySelector("#controls .fas");

    switch (state) {
        case "play":

            control.setAttribute("class", "fas fa-play");
            control.setAttribute("onclick", "controlsLogic('pause')");
            break;
        case "pause":
            control.setAttribute("onclick", "controlsLogic('play')");
            control.setAttribute("class", "fas fa-pause");
            break;
    }
}


const _URL = "http://localhost:30002/api";

function makeSliderGroup(date, perc) {

    const parent = document.getElementById("sliderGroups");

    const sliderGroup = document.createElement("div");
        sliderGroup.classList.add("sliderGroup");
        sliderGroup.setAttribute("id", date);
    parent.appendChild(sliderGroup);

    const sliderGroupMeta = document.createElement("div");
        sliderGroupMeta.classList.add("sliderGroupMeta");
    sliderGroup.appendChild(sliderGroupMeta);

        const h2 = document.createElement("h2");

        if(date != "Today") {
            const diff = getDateDifferenceFromTodayInDays(date);
            if(diff > 1 && diff < 8) {
                // previous 6 days (exluding today)
                sliderGroup.classList.add("previousWeekSliderGroup");
            } else {
                sliderGroup.classList.add("earlierSliderGroup");
            }
            date = convertTimeStringToDate(date);
        } else {
            sliderGroup.classList.add("todaySliderGroup");
        }

            h2.textContent = date;
        sliderGroupMeta.appendChild(h2);

        const percSpan = document.createElement("span");
            percSpan.textContent = perc;
            percSpan.dataset.time = perc;
        sliderGroupMeta.appendChild(percSpan);
    
    const slider = document.createElement("div");
        slider.classList.add("slider");
    sliderGroup.appendChild(slider);
}


function getData() {
    const url = `${_URL}/getData`;

    clearOldData()
    .then(function () {
        fetch(url).then(res => res.json())
        .then(function(data) {
            console.log("Return data:", data);
    
            data.forEach(function (item) {
                
                // if date is today, set as today
                if(convertTimeStringToDate(item.date) == convertTimeStringToDate(getCurrentTimeString())) {
                    makeSliderGroup("Today", item.time);
                }
                else {
                    makeSliderGroup(item.date, item.time);
                }
                
                // then get next 6, a little smaller 'cause last week
                // then get all the rest and make it small 'cause just logs
            })
        })
    
        .then(function (foo) {
            makeSliders();
        })
    
        .then(function(bar) {
            updateWeekSlider()
        })

    })
}


function updateWeekSlider() {
    let allSliders = Array.from(document.querySelectorAll(".slider"));
    // remove weekSlider
    const prevWeekVal = allSliders.shift();

    let sliderValsArray = [];
    allSliders.forEach(function(slider) {
        sliderValsArray.push(parseFloat(slider.noUiSlider.get()[1]));
    })

    const reducer = (preV, current) => preV + current;

    let val = sliderValsArray.reduce(reducer);

    var noUIConnect = document.querySelector("#weekSlider .noUi-connect").style.background;
    var noUiTarget = document.querySelector("#weekSlider .noUi-target").style.borderColor;
    
    if(val == 20) {
        noUIConnect = "var(--light-green)";
        noUiTarget = "var(--light-green)";
    } else if(val > 20) {
        noUIConnect = "var(--purple)";
        noUiTarget = "var(--purple)";
    } else {
        noUIConnect = "var(--btn-red)";
        noUiTarget = "var(--btn-red)";
    }
    
    document.querySelector("#weekSlider .slider").noUiSlider.set([0, val]);
    if(val < 1) {
        document.querySelector("#weekSlider #weekSliderPerc").textContent = "Not worked this week yet";
    } else {
        document.querySelector("#weekSlider #weekSliderPerc").textContent = `${val.toFixed(1)} Hours`;
    }
    
}

function updateSliderVals(slider, values) {
    values = parseFloat(values[1]);
    if(slider.previousSibling.nodeName != "#text") {
        // update numbers on the side
        let numberEle = slider.previousSibling.querySelector("span");
        const numberVal = values.toFixed(1);
        let variant = "Hours";
        if(numberVal == 1.0) {
            variant = "Hour";
        }
        if(numberVal <= 0.1) {
            numberEle.textContent = "Not worked on this day yet";
        } else {
            numberEle.textContent = `${numberVal} ${variant}`;
        }
    }
}

function clearOldData() {
    return new Promise((resolve, reject) => {
        const sliders = document.querySelectorAll(".sliderGroup");
        if(sliders.length > 1) {
            try {
                for(i = sliders.length; i >= 0; i--) {
                    if(sliders[i].getAttribute("id") != "weekSlider") {
                        sliders[i].remove();
                    }
                }
                resolve();
            }
            catch (e) {
                console.log("Couldnt remove old data! Error:", e);
            }
        } else {
            // no sliders present
            resolve();
        }

    })

}

function fillInFooData(number) {
    const url = `${_URL}/saveData`;

    const body = {
        date: getPreviousDay(getCurrentTimeString(), number),
        time: Math.floor(Math.random()*100)+30,
    }

    const options = {
        method: "post",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    }

    fetch(url, options).then(function(response) {
        console.log(response);
    })


}


///////////// Date stuff
function getWeekDay0Index(number) {
    weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return weekDays[number];
}

function getCurrentWeekDay() {
    return getWeekDay0Index(new Date().getDay()-1);
}

function getCurrentTimeString() {
    return new Date().getTime();
}

function convertTimeStringToDate(str) {
    var date = new Date(str);
    return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
}

function getPreviousDay(str, rev) {
    for(i = 0; i < rev; i++) {
        str -= getOneDayInMs();
    }
    return str;
}

function getDateDifferenceFromTodayInDays(str) {
    let today = getCurrentTimeString();

    return Math.floor((today % str) / getOneDayInMs());
}

function getOneDayInMs() {
    return 86400000;
}