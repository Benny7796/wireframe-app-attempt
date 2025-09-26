document.addEventListener("DOMContentLoaded", ()=>{
const element = document.getElementById("Element");
const styleSpec = document.getElementById("Style");
const Add = document.getElementById("Add");
const body = document.getElementById("bdy");
const defaultColor = document.querySelectorAll(".defaultColor");
const defaultElement = document.querySelectorAll(".defaultElement");
const workSpace = document.querySelector(".workSpace");
let activeElement = null;
let isResizing = false;
let isDragging = false;
let isCurving = false;
let selectedElement = null;
let color;

Add.addEventListener("click", ()=>{
    const whatElement = element.value;
    const whatStyle = styleSpec.value;
    const Create = document.createElement(whatElement);
    Create.style.cssText = whatStyle;
    workSpace.appendChild(Create);

    makeCurvable(Create);
    makeAdjustable(Create);
    makeDraggable(Create);
    makeSelectable(Create);
    
    element.value = "";
    styleSpec.value = "";
});

defaultElement.forEach((btn) =>{
    btn.addEventListener("click", ()=>{
        let newElement  = btn.textContent;
        newElement = document.createElement(newElement);    
        workSpace.appendChild(newElement);
        makeCurvable(newElement);
        makeAdjustable(newElement);
        makeDraggable(newElement);
        makeSelectable(newElement);

    });
});

defaultColor.forEach((btn) =>{
    btn.addEventListener("click", ()=>{
         color = btn.textContent;
        if(selectedElement){
            selectedElement.style.backgroundColor = color;
        }
    });
});

function makeDraggable (G){ 
    let offsetX, offsetY;
    // let isDragging = false;
    G.style.position = "absolute";

        G.addEventListener("mousedown", (e)=>{
            if(isResizing)return;
            if(isCurving)return;
            isDragging = true;

            activeElement = G;
                offsetX = e.clientX - G.offsetLeft;
                offsetY = e.clientY - G.offsetTop;
                G.style.cursor = "grabbing";
    })

    document.addEventListener("mousemove", (e)=>{
        if(isDragging && activeElement){
            activeElement.style.left = (e.clientX - offsetX) + "px";
            activeElement.style.top = (e.clientY - offsetY) + "px";
        }
    })

    document.addEventListener("mouseup", ()=>{
        if(isDragging){
        isDragging = false;}
        if(activeElement){
        activeElement.style.cursor = "grab";
            activeElement = null;}
        })
        }


        //trying to adjust the width and height of an already created object
        //  by clicking and adjusting manually
    function makeAdjustable (H) {
        let offsetRight, offsetBottom, offsetX, offsetY;
        

        H.addEventListener("mousedown", (e)=>{
            if(isDragging)return;
            if(isCurving)return;
            offsetRight = H.offsetWidth - (e.clientX - H.offsetLeft);
            offsetBottom = H.offsetHeight - (e.clientY - H.offsetTop)
            offsetX = e.clientX - H.offsetLeft;
            offsetY = e.clientY - H.offsetTop;

            let startX = e.clientX;
            let startY = e.clientY;
            let startWidth = H.offsetWidth;
            let startHeight = H.offsetHeight;
            let resizeHandler;
           
            if( offsetX < 10 ){
                isResizing = true;
                H.style.cursor = "ew-resize"
                resizeHandler = (e) => {
                        let newWidth = (e.clientX - startX);
                        H.style.left = (newWidth + startX) + "px";
                        H.style.width = (startWidth - newWidth) + "px";
                        }
                    document.addEventListener("mousemove", resizeHandler)
            }
            else if(  offsetRight < 10 ){
                isResizing = true;
                H.style.cursor = "ew-resize"
                resizeHandler = (e) => {
                        let newWidth = (e.clientX - startX);
                        H.style.width = (startWidth + newWidth) + "px";
                        }
                    document.addEventListener("mousemove", resizeHandler)
            }
            else if (offsetBottom < 10){
                isResizing = true;
                H.style.cursor = "ns-resize"
                resizeHandler = (e) => {
                        let newHeight = (e.clientY - startY);
                        H.style.height = (startHeight + newHeight) + "px";
                        }
                     document.addEventListener("mousemove", resizeHandler)
            }
            else if (offsetY < 10 ){
                isResizing = true;
                H.style.cursor = "ns-resize"
                resizeHandler = (e) => {
                        let newHeight = (e.clientY - startY);
                        H.style.height = (startHeight - newHeight) + "px";
                        H.style.top = (startY+ newHeight) + "px";
                        }
                     document.addEventListener("mousemove", resizeHandler)
            }



            if(offsetY < 10 || offsetBottom < 10){
                H.style.cursor = "ns-resize"
            }
            else if(offsetRight < 10 || offsetX < 10){
                H.style.cursor = "ew-resize"
            }

            document.addEventListener("mouseup", function stopresize(){
                document.removeEventListener("mousemove", resizeHandler);
                document.removeEventListener("mouseup", stopresize);
                isResizing = false
                H.style.cursor = "default";
            })
        })
    }

    //attempting to add border radius by dragging the edges 
function makeCurvable (J){
    let offsetX, offsetY, offsetBottom, offsetRight;
    let isCurvingActive = false;
    let curveHandler, mouseupHandler;
    J.addEventListener("mousedown", (e)=>{
        if (isDragging) return;
        if (isResizing) return;
        if (isCurvingActive) return;
        let horix = e.clientX;
        let verty = e.clientY;

        offsetRight = J.offsetWidth - (e.clientX - J.offsetLeft);
        offsetBottom = J.offsetHeight - (e.clientY - J.offsetTop)
        offsetX = e.clientX - J.offsetLeft;
        offsetY = e.clientY - J.offsetTop;

        if((offsetX < 10 && offsetY < 10) ||        // top-left
            (offsetX < 10 && offsetBottom < 10) ||   // bottom-left
            (offsetRight < 10 && offsetY < 10) ||    // top-right
            (offsetRight < 10 && offsetBottom < 10)){
                isCurving = true;
                isCurvingActive = true;
                J.style.cursor = "crosshair";
                curveHandler = function(e){
                    let distance = Math.max(Math.abs(e.clientX - horix),
                        Math.abs(e.clientY-verty));
                    J.style.borderRadius = (distance) + "px";
                };
                mouseupHandler = function removeFunctions(){
                    document.removeEventListener("mousemove", curveHandler);
                    document.removeEventListener("mouseup", mouseupHandler);
                    isCurving = false;
                    isCurvingActive = false;
                    J.style.cursor ="default";
                };
                document.addEventListener("mousemove", curveHandler);
                document.addEventListener("mouseup", mouseupHandler);
        }
    })
}

function makeSelectable(E) {
    E.addEventListener("click", function(e) {
        e.stopPropagation(); // Prevent body click from deselecting
        if (selectedElement) {
            selectedElement.style.outline = "";
        }
        selectedElement = E;
        E.style.outline = "2px solid #007bff";
        styleSpec.value = E.getAttribute("style") || "";
    });
}

// Prevent styleSpec click from deselecting the selected element
styleSpec.addEventListener("click", function(e) {
    e.stopPropagation();
});

// Deselect on body click
body.addEventListener("click", function() {
    if (selectedElement) {
        selectedElement.style.outline = "";
        selectedElement = null;
        styleSpec.value = "";
    }
});

// Add an 'Apply Style' button if not present
let applyBtn = document.getElementById("Apply");
if (!applyBtn) {
    applyBtn = document.createElement("button");
    applyBtn.id = "Apply";
    applyBtn.textContent = "Apply Style";
    styleSpec.parentNode.insertBefore(applyBtn, styleSpec.nextSibling);
}

applyBtn.addEventListener("click", function() {
    if (selectedElement) {
        selectedElement.style.cssText = styleSpec.value;
    }
});

// Live update style as you type
styleSpec.addEventListener("input", function() {
    if (selectedElement) {
        selectedElement.style.cssText = styleSpec.value;
    }
});

})


