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
    const container = workSpace;
    let offsetX, offsetY;
    // let isDragging = false;
    G.style.position = "absolute";

        G.addEventListener("mousedown", (e)=>{
            if(isResizing)return;
            if(isCurving)return;
            isDragging = true;

            const rect = G.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

                
            activeElement = G;
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                G.style.cursor = "grabbing";
    })

    document.addEventListener("mousemove", (e)=>{
        if(isDragging && activeElement){
            const bounds = workSpace.getBoundingClientRect();
            activeElement.style.left = (e.clientX - bounds.left - offsetX) + "px";
            activeElement.style.top = (e.clientY - bounds.top - offsetY) + "px";
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


    function makeAdjustable (H) {
        let offsetRight, offsetBottom, offsetX, offsetY;
        const container = workSpace;

        H.addEventListener("mousedown", (e)=>{
            if(isDragging)return;
            if(isCurving)return;
            const rect = H.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            offsetRight = rect.right - e.clientX;
            offsetBottom = rect.bottom - e.clientY;
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            let startX = e.clientX;
            let startY = e.clientY;
            let startWidth = rect.width;
            let startHeight = rect.height;
            let startTop = rect.top - containerRect.top;
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
                        let newHeight = (startHeight - (e.clientY - startY));
                        H.style.height = ( newHeight) + "px";
                        H.style.top = (startTop + (e.clientY - startY)) + "px";
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
function makeCurvable(J) {
  const container = workSpace;
  let curveHandler = null;

  J.addEventListener("mousedown", (e) => {
    if (isDragging || isResizing) return;

    const rect = J.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const offsetRight = rect.right - e.clientX;
    const offsetBottom = rect.bottom - e.clientY;

    const tol = 10;
    const nearCorner =
      (offsetX < tol && offsetY < tol) ||
      (offsetX < tol && offsetBottom < tol) ||
      (offsetRight < tol && offsetY < tol) ||
      (offsetRight < tol && offsetBottom < tol);

    if (!nearCorner) return;

    isCurving = true;
    J.style.cursor = "crosshair";
    const startX = e.clientX;
    const startY = e.clientY;
    const startRadius = parseInt(window.getComputedStyle(J).borderRadius) || 0;

    curveHandler = (ev) => {
      const distance = Math.max(
        Math.abs(ev.clientX - startX),
        Math.abs(ev.clientY - startY)
      );
      J.style.borderRadius = (startRadius + distance) + "px";
    };

    document.addEventListener("mousemove", curveHandler);
    document.addEventListener("mouseup", function stop() {
      document.removeEventListener("mousemove", curveHandler);
      document.removeEventListener("mouseup", stop);
      isCurving = false;
      J.style.cursor = "default";
    });
  });
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


