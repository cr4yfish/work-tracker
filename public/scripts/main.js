// GLOBAL VARS

    var _PLAY_MODE = false;
    const _URL = "http://localhost:30002/api";
    var updateTodayTimeHasToggled = false;
//


if(window.location.hash == "#play") {
    _PLAY_MODE = true;
    controlsLogic("play");
}


/// TIME STUFF

    function Timer(_fn_callback_ , _timer_freq_){
        let RESUME_CORRECTION_RATE = 2;

        let _timer_statusCode_;
        let _timer_clockRef_;

        let _time_ellapsed_;        // will store the total time ellapsed
        let _time_pause_;           // stores the time when timer is paused
        let _time_lastCycle_;       // stores the time of the last cycle

        let _isCorrectionCycle_;
    
        /**
         * execute in each clock cycle
         */
        const nextCycle = function(){
            // calculate deltaTime
            let _time_delta_        = new Date() - _time_lastCycle_;
            _time_lastCycle_    = new Date();
            _time_ellapsed_   += _time_delta_;

            // if its a correction cicle (caused by a pause,
            // destroy the temporary timeout and generate a definitive interval
            if( _isCorrectionCycle_ ){
                clearTimeout( _timer_clockRef_ );
                clearInterval( _timer_clockRef_ );
                _timer_clockRef_    = setInterval(  nextCycle , _timer_freq_  );
                _isCorrectionCycle_ = false;
            }
            // execute callback
            _fn_callback_.apply( timer, [ timer ] );
        };

        // initialize timer
        _time_ellapsed_     = 0;
        _time_lastCycle_     = new Date();
        _timer_statusCode_   = 1;
        _timer_clockRef_     = setInterval(  nextCycle , _timer_freq_  );


        // timer public API
        const timer = {
            get statusCode(){ return _timer_statusCode_ },
            get timestamp(){
                let abstime;
                if( _timer_statusCode_=== 1 ) abstime = _time_ellapsed_ + ( new Date() - _time_lastCycle_ );
                else if( _timer_statusCode_=== 2 ) abstime = _time_ellapsed_ + ( _time_pause_ - _time_lastCycle_ );
                return abstime || 0;
            },

            pause : function(){
                if( _timer_statusCode_ !== 1 ) return this;
                // stop timers
                clearTimeout( _timer_clockRef_ );
                clearInterval( _timer_clockRef_ );
                // set new status and store current time, it will be used on
                // resume to calculate how much time is left for next cycle
                // to be triggered
                _timer_statusCode_ = 2;
                _time_pause_       = new Date();
                return this;
            },

            resume: function(){
                if( _timer_statusCode_ !== 2 ) return this;
                _timer_statusCode_  = 1;
                _isCorrectionCycle_ = true;
                const delayEllapsedTime = _time_pause_ - _time_lastCycle_;
                _time_lastCycle_    = new Date( new Date() - (_time_pause_ - _time_lastCycle_) );

                _timer_clockRef_ = setTimeout(  nextCycle , _timer_freq_ - delayEllapsedTime - RESUME_CORRECTION_RATE);

                return this;
            } 
        };
        return timer;
    };

    let interval = Timer( x => incrementTime(x.timestamp) , 1000);
    interval.pause();


    function getPastTime() {
        var pastTime = document.getElementById("time").dataset.rawTime;

        if(pastTime == undefined) {
            pastTime = 0;
        } else {
            pastTime = parseInt(pastTime);
        }

        return pastTime;
    }

    function incrementTime(x) {
        const time = document.getElementById("time");
        const timeLabel = document.getElementById("timeLabel");

        let passedTime = getPastTime();

        if(_PLAY_MODE == true) {
            passedTime++
            time.dataset.rawTime = passedTime;
            // cache time
            localStorage.setItem("time", passedTime);
            updateTodayTime(false);
            updateTodayTimeHasToggled = true;
        }

        let seconds = secondsToHms(passedTime).seconds;
        let minutes = secondsToHms(passedTime).minutes;
        let hours = secondsToHms(passedTime).hours

        // fix 0's
        if(seconds < 10) {
            seconds = `0${seconds}`;
        }

        if(minutes < 10) {
            minutes = `0${minutes}`;
        }

        if(passedTime < 60) {
            time.textContent = `${ hours }:${ minutes }:${ seconds }`;
            timeLabel.textContent = "Seconds";
        } else if(passedTime < 3600) {
            time.textContent = `${ hours }:${ minutes }:${ seconds }`;
            timeLabel.textContent = "Minutes";
        } else {
            time.textContent = `${ hours }:${ minutes }:${ seconds }`;
            timeLabel.textContent = "Hours";
        }
    }



    function controlsLogic(state) {
        const control = document.querySelector("#controls .far");

        switch (state) {
            case "play":
                // current = PLAY
                interval.resume();
                _PLAY_MODE = true;
                control.setAttribute("class", "far fa-pause-circle");
                control.setAttribute("onclick", "controlsLogic('pause')");
    
                break;
            case "pause":
                // current = PAUSE
                interval.pause();
                _PLAY_MODE = false;
                control.setAttribute("onclick", "controlsLogic('play')");
                control.setAttribute("class", "far fa-play-circle");
                break;
        }
    }


    function updateTodayTime(x) {
        if(!updateTodayTimeHasToggled || x == true) {
            const url = `${_URL}/updateEntry`;

            const body = {
                date: cleanTimeString(getCurrentTimeString()),
                time: parseInt(document.getElementById("time").dataset.rawTime),
                _id: document.querySelector(".todaySliderGroup").getAttribute("id"),
            }
        
            const options = {
                method: "post",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json"
                }
            }
            console.log("Sending", body);
            fetch(url, options).then(function(response) {
                //console.log(response);
                console.log(response);
    
                // update slider
                console.log("Updating slider vals with", body.time)
                document.getElementById("todaySliderId").noUiSlider.set([null,(body.time/60/60)]);
            })
            .then(async function() {
                // call itself after 10sec for continuus backuping
                await sleep(10000);
                updateTodayTime(true);
            })
        }
    }
        



//


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function toggleSidebar(state) {
    let sidebar = document.getElementById("sidebar");
    if(state == "close") {
        //toggleOpacityLayer("close");
        sidebar.style.width = "0";
        await sleep(1000);
        sidebar.style.display = "none";
    } else if (state == "open") {
        //toggleOpacityLayer("open");
        sidebar.style.display = "block";
        await sleep(50);
        sidebar.style.width = "15rem";
        //document.getElementById("opacityLayer").setAttribute("onclick", "toggleSidebar('close')")
    }
}

function updateRange(timeVal) {
    let range = 20;

    if(timeVal < 15 && timeVal > 5) {
        range = 15; 
    } else if(timeVal < 10 && timeVal > 4) {
        range = 10;
    } else if(timeVal < 4) {
        range = 4;
    }

    return range;
}


// light sliders
function makeSliders(set) {
    let sliders = document.querySelectorAll(".slider");

    sliders.forEach(function(slider) {

        const timeVal = slider.previousElementSibling.querySelector("span").dataset.time/60;

        noUiSlider.create(slider, {
            start: [0, timeVal/60/60],
            connect: true,
            behaviour: "drag",
            range: {
                'min': 0,
                'max': updateRange(timeVal)
            }
        });

        // update WeekSlider on change of others
        slider.noUiSlider.on('end', function(values, handle) {
            updateWeekSlider();
            updateSliderVals(slider, values);

            slider.noUiSlider.updateOptions({
                range: {
                    'min': 0,
                    'max': updateRange(values[1]),
                }
            })
        });

        // initial set
        updateSliderVals(slider, [0,timeVal/60/60])
    })
}



function makeSliderGroup(date, perc, id) {

    const parent = document.getElementById("sliderGroups");

    const sliderGroup = document.createElement("div");
        sliderGroup.classList.add("sliderGroup");
        sliderGroup.setAttribute("id", id);
    parent.appendChild(sliderGroup);

    const sliderGroupMeta = document.createElement("div");
        sliderGroupMeta.classList.add("sliderGroupMeta");
    sliderGroup.appendChild(sliderGroupMeta);

    const slider = document.createElement("div");
    slider.classList.add("slider");
    sliderGroup.appendChild(slider);

    const h2 = document.createElement("h2");
    sliderGroupMeta.appendChild(h2);

    if(date != "Today") {
        const diff = getDateDifferenceFromTodayInDays(date);
        
        // find out if day is before last monday 
        // if so, then make it previousWeekSliderGroup
        const currentWeekDay = new Date().getDay()-1;

        //console.log(`=== Current ===\nCurrentWeekDay: ${currentWeekDay}\nDiff: ${diff}\nDate: ${date}\n=======`);

        if(currentWeekDay != 0 && diff <= currentWeekDay) {
            // if currentWeekDay != 0 -> today isnt monday, there can be previous days in the week
            // if diff <= currentWeekDay -> difference in days is smaller than span to last monday,
            // which means that diff cannot be earlier if true
            sliderGroup.classList.add("previousWeekSliderGroup");

            // set title after weekDay
            h2.textContent = getWeekDay(date);

        } else {
            date = convertTimeStringToDate(date);
            h2.textContent = date;
            sliderGroup.classList.add("earlierSliderGroup");
        }
        
    } else {
        h2.textContent = "Today";
        sliderGroup.classList.add("todaySliderGroup");
        slider.setAttribute("id", "todaySliderId");
    }


    const percSpan = document.createElement("span");
    percSpan.textContent = perc;
    percSpan.dataset.time = perc;
    sliderGroupMeta.appendChild(percSpan);
    
 
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
                    makeSliderGroup("Today", item.time, item._id);
                }
                else {
                    makeSliderGroup(item.date, item.time, item._id);
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
        document.querySelector("#weekSlider #weekSliderPerc").textContent = "Not worked this week.";
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
            numberEle.textContent = "Not worked on this day.";
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
        //console.log(response);
        return response;
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

function getWeekDay(str) {
    return getWeekDay0Index(new Date(str).getDay()-1);
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
    
    const today = cleanTimeString(getCurrentTimeString());
    const differentDay = cleanTimeString(str);

    let diff = Math.round((today % differentDay) / getOneDayInMs());

    //console.log(`Today: ${today} ${new Date(today)} \nDiff Day: ${differentDay} ${new Date(differentDay)}\nDelta from norm: ${today - differentDay}`);
    return diff;
}

// returns normalized timestrings -> 0h 0min 0sec
function cleanTimeString(str) {
    var date = new Date(str);

    let hours = date.getHours() * 3600000;
    let minutes = date.getMinutes() * 60000;
    let seconds = date.getSeconds() * 1000;

    str = str - (hours+minutes+seconds) + 1000;
    //console.log(new Date(str));
    return str;
}

function getOneDayInMs() {
    return 86400000;
}

function secondsToHms(secs)
{
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    var obj = {
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
    return obj;
}