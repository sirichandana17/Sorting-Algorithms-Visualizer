let array = [];
const size = 15;
const delay = 250;
let isSorting = false;

const container = document.getElementById("array");
const messageBox = document.getElementById("message");

/* ---------- UTIL ---------- */
function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

function showMessage(msg, color="#dc2626"){
    messageBox.style.color = color;
    messageBox.innerText = msg;
}

function clearMessage(){ messageBox.innerText = ""; }

function isSorted(){
    for(let i=1;i<array.length;i++){
        if(array[i] < array[i-1]) return false;
    }
    return true;
}

/* ---------- RENDER ---------- */
function renderArray(){
    container.innerHTML="";
    array.forEach(v=>{
        const bar=document.createElement("div");
        bar.className="bar";
        bar.style.height=v*3+"px";
        bar.innerHTML=`<span>${v}</span>`;
        container.appendChild(bar);
    });
}

/* ---------- INPUT ---------- */
function generateArray(){
    if(isSorting) return showMessage("Sorting in progress...");
    clearMessage();
    array=[];
    for(let i=0;i<size;i++) array.push(Math.floor(Math.random()*90)+10);
    renderArray();
}

function useCustomArray(){
    if(isSorting) return showMessage("Sorting in progress...");
    const input=document.getElementById("customArray").value;
    if(!input) return showMessage("Enter an array");
    array=input.split(",").map(n=>parseInt(n.trim())).filter(n=>!isNaN(n));
    if(!array.length) return showMessage("Invalid array");
    clearMessage();
    renderArray();
}

/* ---------- CONFETTI FROM BARS ---------- */
function launchConfetti(){
    const c=document.getElementById("confetti-container");
    c.innerHTML="";
    const bars=document.querySelectorAll(".bar");
    const colors=["#ff4d4d","#4dff4d","#4d4dff","#ffd24d","#ff66ff","#22c55e"];

    bars.forEach(bar=>{
        const r=bar.getBoundingClientRect();
        for(let i=0;i<8;i++){
            const f=document.createElement("div");
            f.className="confetti";
            f.style.left=r.left+r.width/2+"px";
            f.style.top=r.top+"px";
            f.style.width=f.style.height=(Math.random()*6+6)+"px";
            f.style.backgroundColor=colors[Math.floor(Math.random()*colors.length)];
            f.style.setProperty("--x",(Math.random()*400-200)+"px");
            f.style.setProperty("--y",-(Math.random()*300+150)+"px");
            c.appendChild(f);
        }
    });
    setTimeout(()=>c.innerHTML="",4000);
}

/* ---------- GUARD ---------- */
function canSort(){
    if(isSorting) return showMessage("Sorting in progress...");
    if(isSorted()) return showMessage("Array already sorted","#16a34a");
    clearMessage();
    return true;
}

/* ---------- UPDATE ---------- */
function updateBars(b,i,j){
    b[i].style.height=array[i]*3+"px";
    b[j].style.height=array[j]*3+"px";
    b[i].children[0].innerText=array[i];
    b[j].children[0].innerText=array[j];
}

/* ---------- BUBBLE ---------- */
async function bubbleSort(){
    if(!canSort()) return;
    isSorting=true;
    const b=document.querySelectorAll(".bar");

    for(let i=0;i<array.length;i++){
        for(let j=0;j<array.length-i-1;j++){
            b[j].classList.add("active");
            b[j+1].classList.add("active");

            if(array[j]>array[j+1]){
                [array[j],array[j+1]]=[array[j+1],array[j]];
                updateBars(b,j,j+1);
            }
            await sleep(delay);
            b[j].classList.remove("active");
            b[j+1].classList.remove("active");
        }
        b[array.length-i-1].classList.add("sorted");
    }
    isSorting=false;
    launchConfetti();
}

/* ---------- SELECTION ---------- */
async function selectionSort(){
    if(!canSort()) return;
    isSorting=true;
    const b=document.querySelectorAll(".bar");

    for(let i=0;i<array.length;i++){
        let min=i;
        b[min].classList.add("active");

        for(let j=i+1;j<array.length;j++){
            b[j].classList.add("active");
            await sleep(delay);
            if(array[j]<array[min]){
                b[min].classList.remove("active");
                min=j;
                b[min].classList.add("active");
            }
            b[j].classList.remove("active");
        }

        [array[i],array[min]]=[array[min],array[i]];
        updateBars(b,i,min);
        b[min].classList.remove("active");
        b[i].classList.add("sorted");
    }
    isSorting=false;
    launchConfetti();
}

/* ---------- INSERTION ---------- */
async function insertionSort(){
    if(!canSort()) return;
    isSorting=true;
    const b=document.querySelectorAll(".bar");

    for(let i=1;i<array.length;i++){
        let key=array[i], j=i-1;
        while(j>=0 && array[j]>key){
            array[j+1]=array[j];
            updateBars(b,j+1,j);
            j--;
            await sleep(delay);
        }
        array[j+1]=key;
        b[j+1].style.height=key*3+"px";
        b[j+1].children[0].innerText=key;
    }
    b.forEach(x=>x.classList.add("sorted"));
    isSorting=false;
    launchConfetti();
}

/* ---------- MERGE ---------- */
async function mergeSortStart(){
    if(!canSort()) return;
    isSorting=true;
    await mergeSort(0,array.length-1);
    document.querySelectorAll(".bar").forEach(b=>b.classList.add("sorted"));
    isSorting=false;
    launchConfetti();
}

async function mergeSort(l,r){
    if(l>=r) return;
    const m=Math.floor((l+r)/2);
    await mergeSort(l,m);
    await mergeSort(m+1,r);
    await merge(l,m,r);
}

async function merge(l,m,r){
    const b=document.querySelectorAll(".bar");
    const L=array.slice(l,m+1), R=array.slice(m+1,r+1);
    let i=0,j=0,k=l;

    while(i<L.length && j<R.length){
        b[k].classList.add("active");
        array[k]=L[i]<=R[j]?L[i++]:R[j++];
        b[k].style.height=array[k]*3+"px";
        b[k].children[0].innerText=array[k];
        await sleep(delay);
        b[k].classList.remove("active");
        k++;
    }
    while(i<L.length){
        b[k].classList.add("active");
        array[k]=L[i++];
        b[k].style.height=array[k]*3+"px";
        b[k].children[0].innerText=array[k];
        await sleep(delay);
        b[k].classList.remove("active");
        k++;
    }
    while(j<R.length){
        b[k].classList.add("active");
        array[k]=R[j++];
        b[k].style.height=array[k]*3+"px";
        b[k].children[0].innerText=array[k];
        await sleep(delay);
        b[k].classList.remove("active");
        k++;
    }
}

/* ---------- QUICK ---------- */
async function quickSortStart(){
    if(!canSort()) return;
    isSorting=true;
    await quickSort(0,array.length-1);
    document.querySelectorAll(".bar").forEach(b=>b.classList.add("sorted"));
    isSorting=false;
    launchConfetti();
}

async function quickSort(l,r){
    if(l<r){
        const p=await partition(l,r);
        await quickSort(l,p-1);
        await quickSort(p+1,r);
    }
}

async function partition(l,r){
    const b=document.querySelectorAll(".bar");
    const pivot=array[r];
    let i=l-1;

    for(let j=l;j<r;j++){
        b[j].classList.add("active");
        await sleep(delay);
        if(array[j]<pivot){
            i++;
            [array[i],array[j]]=[array[j],array[i]];
            updateBars(b,i,j);
        }
        b[j].classList.remove("active");
    }
    [array[i+1],array[r]]=[array[r],array[i+1]];
    updateBars(b,i+1,r);
    return i+1;
}

/* ---------- INIT ---------- */
generateArray();
