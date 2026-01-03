let array = [];
const size = 15;
const delay = 250; // ORIGINAL SPEED
const container = document.getElementById("array");

/* ---------- Utility ---------- */
function sleep(ms){
    return new Promise(res => setTimeout(res, ms));
}

/* ---------- Render Array ---------- */
function renderArray(){
    container.innerHTML = "";
    array.forEach(val => {
        let bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = val * 3 + "px";

        let label = document.createElement("span");
        label.innerText = val;

        bar.appendChild(label);
        container.appendChild(bar);
    });
}

/* ---------- Generate Random ---------- */
function generateArray(){
    array = [];
    for(let i=0;i<size;i++){
        array.push(Math.floor(Math.random()*90)+10);
    }
    renderArray();
}

/* ---------- Custom Array ---------- */
function useCustomArray(){
    let input = document.getElementById("customArray").value;
    if(!input) return alert("Enter numbers");

    array = input.split(",")
        .map(n => parseInt(n.trim()))
        .filter(n => !isNaN(n));

    if(array.length === 0) return alert("Invalid array");
    renderArray();
}

/* ---------- Update Bars ---------- */
function updateBars(bars,i,j){
    bars[i].style.height = array[i]*3+"px";
    bars[j].style.height = array[j]*3+"px";
    bars[i].children[0].innerText = array[i];
    bars[j].children[0].innerText = array[j];
}

/* ---------- CONFETTI EXPLOSION FROM BARS ---------- */
function launchConfetti(){
    const container = document.getElementById("confetti-container");
    container.innerHTML = "";

    const bars = document.querySelectorAll(".bar");
    const colors = ["#ff4d4d","#4dff4d","#4d4dff","#ffd24d","#ff66ff","#22c55e"];

    bars.forEach(bar => {
        const rect = bar.getBoundingClientRect();

        for(let i=0;i<8;i++){
            const c = document.createElement("div");
            c.className = "confetti";

            c.style.left = rect.left + rect.width/2 + "px";
            c.style.top = rect.top + "px";

            const size = Math.random()*6 + 6;
            c.style.width = size + "px";
            c.style.height = size + "px";

            c.style.backgroundColor =
                colors[Math.floor(Math.random()*colors.length)];

            c.style.setProperty("--x",
                (Math.random()*400 - 200) + "px");
            c.style.setProperty("--y",
                -(Math.random()*300 + 150) + "px");

            container.appendChild(c);
        }
    });

    setTimeout(() => container.innerHTML="", 4000);
}

/* ---------- Bubble Sort ---------- */
async function bubbleSort(){
    let bars = document.querySelectorAll(".bar");
    for(let i=0;i<array.length;i++){
        for(let j=0;j<array.length-i-1;j++){
            bars[j].classList.add("active");
            bars[j+1].classList.add("active");

            if(array[j] > array[j+1]){
                [array[j],array[j+1]]=[array[j+1],array[j]];
                updateBars(bars,j,j+1);
            }

            await sleep(delay);
            bars[j].classList.remove("active");
            bars[j+1].classList.remove("active");
        }
        bars[array.length-i-1].classList.add("sorted");
    }
    launchConfetti();
}

/* ---------- Selection Sort ---------- */
async function selectionSort(){
    let bars=document.querySelectorAll(".bar");
    for(let i=0;i<array.length;i++){
        let min=i;
        bars[min].classList.add("active");

        for(let j=i+1;j<array.length;j++){
            bars[j].classList.add("active");
            await sleep(delay);
            if(array[j]<array[min]){
                bars[min].classList.remove("active");
                min=j;
                bars[min].classList.add("active");
            }
            bars[j].classList.remove("active");
        }

        [array[i],array[min]]=[array[min],array[i]];
        updateBars(bars,i,min);
        bars[min].classList.remove("active");
        bars[i].classList.add("sorted");
    }
    launchConfetti();
}

/* ---------- Insertion Sort ---------- */
async function insertionSort(){
    let bars=document.querySelectorAll(".bar");
    for(let i=1;i<array.length;i++){
        let key=array[i];
        let j=i-1;
        bars[i].classList.add("active");

        while(j>=0 && array[j]>key){
            array[j+1]=array[j];
            updateBars(bars,j+1,j);
            j--;
            await sleep(delay);
        }

        array[j+1]=key;
        bars[j+1].style.height=key*3+"px";
        bars[j+1].children[0].innerText=key;
        bars.forEach(b=>b.classList.remove("active"));
    }
    bars.forEach(b=>b.classList.add("sorted"));
    launchConfetti();
}

/* ---------- Merge Sort ---------- */
async function mergeSortStart(){
    await mergeSort(0,array.length-1);
    document.querySelectorAll(".bar").forEach(b=>b.classList.add("sorted"));
    launchConfetti();
}

async function mergeSort(l,r){
    if(l>=r) return;
    let m=Math.floor((l+r)/2);
    await mergeSort(l,m);
    await mergeSort(m+1,r);
    await merge(l,m,r);
}

async function merge(l,m,r){
    let bars=document.querySelectorAll(".bar");
    let left=array.slice(l,m+1);
    let right=array.slice(m+1,r+1);
    let i=0,j=0,k=l;

    while(i<left.length && j<right.length){
        bars[k].classList.add("active");
        array[k]=left[i]<=right[j]?left[i++]:right[j++];
        bars[k].style.height=array[k]*3+"px";
        bars[k].children[0].innerText=array[k];
        await sleep(delay);
        bars[k].classList.remove("active");
        k++;
    }

    while(i<left.length){
        bars[k].classList.add("active");
        array[k]=left[i++];
        bars[k].style.height=array[k]*3+"px";
        bars[k].children[0].innerText=array[k];
        await sleep(delay);
        bars[k].classList.remove("active");
        k++;
    }

    while(j<right.length){
        bars[k].classList.add("active");
        array[k]=right[j++];
        bars[k].style.height=array[k]*3+"px";
        bars[k].children[0].innerText=array[k];
        await sleep(delay);
        bars[k].classList.remove("active");
        k++;
    }
}

/* ---------- Quick Sort ---------- */
async function quickSortStart(){
    await quickSort(0,array.length-1);
    document.querySelectorAll(".bar").forEach(b=>b.classList.add("sorted"));
    launchConfetti();
}

async function quickSort(l,r){
    if(l<r){
        let p=await partition(l,r);
        await quickSort(l,p-1);
        await quickSort(p+1,r);
    }
}

async function partition(l,r){
    let bars=document.querySelectorAll(".bar");
    let pivot=array[r];
    let i=l-1;

    for(let j=l;j<r;j++){
        bars[j].classList.add("active");
        await sleep(delay);
        if(array[j]<pivot){
            i++;
            [array[i],array[j]]=[array[j],array[i]];
            updateBars(bars,i,j);
        }
        bars[j].classList.remove("active");
    }

    [array[i+1],array[r]]=[array[r],array[i+1]];
    updateBars(bars,i+1,r);
    return i+1;
}

/* ---------- Init ---------- */
generateArray();
