
function loadSetup(){
    let s = localStorage.getItem('carSetup');
    if(!s) return;
    s = JSON.parse(s);
    for(let key in s){
        if(document.getElementById(key)){
            document.getElementById(key).value = s[key];
        }
    }
    updateSetup();
}

function updateSetup(){
    fw_val.textContent = frontWing.value;
    rw_val.textContent = rearWing.value;
    rhf_val.textContent = rideHeightFront.value;
    rhr_val.textContent = rideHeightRear.value;
    tpf_val.textContent = tirePressFront.value;
    tpr_val.textContent = tirePressRear.value;
}

function saveSetup(){
    let s = {
        frontWing: frontWing.value,
        rearWing: rearWing.value,
        rideHeightFront: rideHeightFront.value,
        rideHeightRear: rideHeightRear.value,
        tirePressFront: tirePressFront.value,
        tirePressRear: tirePressRear.value
    };
    localStorage.setItem('carSetup', JSON.stringify(s));
    alert("Setup salvo!");
}

window.onload = loadSetup;
