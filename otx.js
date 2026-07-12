/* ========================= */
/* ELEMENT */
/* ========================= */

const otpInputs =
document.querySelectorAll(".otp-box");

const otpContainer =
document.querySelector(".otp-container");

const errorBox =
document.querySelector(".error-box");

const loadingBox =
document.getElementById("loadingBox");

const alertTitle =
document.querySelector(".alert-title");

const alertDesc =
document.querySelector(".alert-desc");

const phoneNumber =
document.querySelector(".phone-number");

const resendBtn =
document.querySelector(".resend-btn");

const timerText =
document.querySelector(".timer");


/* ========================= */
/* VARIABLE */
/* ========================= */

let alertTimer = null;
let countdown = null;
let time = 60;
let isProcessing = false;


/* ========================= */
/* ALERT */
/* ========================= */

function showTempAlert(
    title,
    desc,
    color = "red"
) {

    if (
        !errorBox ||
        !alertTitle ||
        !alertDesc
    ) {
        return;
    }

    clearTimeout(alertTimer);

    alertTitle.textContent = title;
    alertDesc.textContent = desc;
    alertTitle.style.color = color;

    errorBox.style.display = "block";

    requestAnimationFrame(() => {
        errorBox.classList.add("show");
    });

    alertTimer = setTimeout(() => {

        errorBox.classList.remove("show");

        setTimeout(() => {
            errorBox.style.display = "none";
        }, 300);

    }, 3000);

}


function hideAlert() {

    if (!errorBox) {
        return;
    }

    clearTimeout(alertTimer);

    errorBox.classList.remove("show");
    errorBox.style.display = "none";

}


/* ========================= */
/* LOADING */
/* ========================= */

function showLoading() {

    if (loadingBox) {
        loadingBox.style.display = "flex";
    }

}


function hideLoading() {

    if (loadingBox) {
        loadingBox.style.display = "none";
    }

}


/* ========================= */
/* RESET OTP */
/* ========================= */

function resetOTP() {

    otpInputs.forEach(input => {

        input.value = "";
        input.disabled = false;

    });

    if (otpInputs.length > 0) {
        otpInputs[0].focus();
    }

}


/* ========================= */
/* AMBIL NILAI OTP */
/* ========================= */

function getOTPValue() {

    let otp = "";

    otpInputs.forEach(input => {
        otp += input.value;
    });

    return otp;

}


/* ========================= */
/* SHAKE */
/* ========================= */

function shakeOTP() {

    if (!otpContainer) {
        return;
    }

    otpContainer.classList.remove("shake");

    void otpContainer.offsetWidth;

    otpContainer.classList.add("shake");

    if ("vibrate" in navigator) {
        navigator.vibrate(250);
    }

    setTimeout(() => {

        otpContainer.classList.remove("shake");

    }, 350);

}


/* ========================= */
/* FADE IN */
/* ========================= */

window.addEventListener("load", () => {

    document.body.classList.add("fade-in");

});


/* ========================= */
/* RESET SAAT HALAMAN KEMBALI */
/* ========================= */

window.addEventListener("pageshow", () => {

    isProcessing = false;

    hideLoading();
    hideAlert();

    otpInputs.forEach(input => {
        input.disabled = false;
    });

});


/* ========================= */
/* NOMOR OTOMATIS */
/* ========================= */

const savedNumber =
localStorage.getItem("nmrx");

if (savedNumber && phoneNumber) {

    phoneNumber.textContent =
    savedNumber;

}


/* ========================= */
/* KONDISI AWAL */
/* ========================= */

hideLoading();
hideAlert();


/* ========================= */
/* FOKUS OTP */
/* ========================= */

if (otpContainer) {

    otpContainer.addEventListener(
        "click",
        () => {

            if (isProcessing) {
                return;
            }

            for (
                let index = 0;
                index < otpInputs.length;
                index++
            ) {

                if (
                    otpInputs[index].value === ""
                ) {

                    otpInputs[index].focus();
                    return;

                }

            }

            if (otpInputs.length > 0) {

                otpInputs[
                    otpInputs.length - 1
                ].focus();

            }

        }
    );

}


/* ========================= */
/* INPUT OTP */
/* ========================= */

otpInputs.forEach((input, index) => {

    input.setAttribute(
        "inputmode",
        "numeric"
    );

    input.setAttribute(
        "maxlength",
        "1"
    );

    input.addEventListener(
        "input",
        () => {

            if (isProcessing) {
                return;
            }

            input.value =
            input.value
            .replace(/\D/g, "")
            .slice(0, 1);

            hideAlert();

            if (
                input.value.length === 1 &&
                index < otpInputs.length - 1
            ) {

                otpInputs[index + 1]
                .focus();

            }

            checkOTP();

        }
    );


    input.addEventListener(
        "keydown",
        event => {

            if (isProcessing) {
                return;
            }

            if (
                event.key === "Backspace" &&
                input.value === "" &&
                index > 0
            ) {

                otpInputs[index - 1]
                .focus();

            }

        }
    );


    input.addEventListener(
        "paste",
        event => {

            event.preventDefault();

            if (isProcessing) {
                return;
            }

            const pastedOTP =
            event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, otpInputs.length);

            if (!pastedOTP) {
                return;
            }

            otpInputs.forEach(
                (otpInput, otpIndex) => {

                    otpInput.value =
                    pastedOTP[otpIndex] || "";

                }
            );

            checkOTP();

        }
    );

});


/* ========================= */
/* CHECK OTP */
/* SIMULASI SELALU GAGAL */
/* ========================= */

function checkOTP() {

    const otp =
    getOTPValue();

    if (
        otp.length !== otpInputs.length ||
        isProcessing
    ) {
        return;
    }

    isProcessing = true;

    otpInputs.forEach(input => {
        input.disabled = true;
    });

    hideAlert();
    showLoading();

    setTimeout(() => {

        hideLoading();

        shakeOTP();

        showTempAlert(
            "Kode OTP Salah atau Kadaluarsa",
            "Pastikan Kode yang kamu masukan benar dan tidak kadaluarsa",
            "red"
        );

        resetOTP();

        isProcessing = false;

    }, 2000);

}


/* ========================= */
/* TIMER */
/* ========================= */

function startTimer() {

    if (!resendBtn || !timerText) {
        return;
    }

    clearInterval(countdown);

    time = 60;

    resendBtn.disabled = true;

    resendBtn.classList
    .remove("active");

    timerText.textContent =
    "00:60";

    countdown = setInterval(() => {

        time--;

        const seconds =
        String(time)
        .padStart(2, "0");

        timerText.textContent =
        `00:${seconds}`;

        if (time <= 0) {

            clearInterval(countdown);

            timerText.textContent =
            "00:00";

            resendBtn.disabled =
            false;

            resendBtn.classList
            .add("active");

        }

    }, 1000);

}


/* ========================= */
/* KIRIM ULANG */
/* ========================= */

if (resendBtn) {

    resendBtn.addEventListener(
        "click",
        () => {

            if (
                resendBtn.disabled ||
                isProcessing
            ) {
                return;
            }

            resetOTP();

            showTempAlert(
                "Kode Dikirim Ulang",
                "Silakan periksa kode OTP terbaru.",
                "blue"
            );

            startTimer();

        }
    );

}


/* ========================= */
/* MULAI TIMER */
/* ========================= */

startTimer();
