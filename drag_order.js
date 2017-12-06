window.onload = init();

function init() {
    /*These event listeners will be lost when swapped if not re-attached.
    fixSwappedElem will re-attach the event listeners the elements marked
    with the class "swap".*/
    var list = document.getElementsByClassName("drag-order");
    attachDragOrderEvents(list);
}

function attachDragOrderEvents (elemList)
{
    for (i = 0; i < elemList.length; i++) {
        elemList.item(i).setAttribute("draggable", "true");
        elemList.item(i).addEventListener("drag", function (event) { });
        elemList.item(i).addEventListener("dragstart", dragStarted);
        elemList.item(i).addEventListener("dragend", dragEnded);
        elemList.item(i).addEventListener("dragover", draggingOver);
        elemList.item(i).addEventListener("drop", dropped);
    }
}

function fixSwappedElems() {
    var list = document.querySelectorAll(".drag-order.swap")
    attachDragOrderEvents(list)
    //Remove swap class from the respective dragorder elements
    for (i = 0; i < list.length; i++) {
        list.item(i).classList.remove("swap");
    }
}

var dragged = null;

function dragStarted(event) {
    if (event.target.classList.contains("drag-order")) {
        event.target.classList.add("drag-order-started");
        event.target.classList.add("swap"); //Mark the element being swapped.
        event.dataTransfer.setData("text", event.target.outerHTML);
        dragged = event.target;
    }
}

function dragEnded(event) {
    if (event.target.classList.contains("drag-order")) {
        event.target.classList.remove("drag-order-started");
        event.target.classList.remove("swap");
    }
}

/*dragover and drop events target usually target child elements instead. The functions 
dragover and drop will then check parent class instead. Keeping the non child event
in case it can be targeted.*/
function isChildOfDragOrder(elem) {
    return elem.parentElement.classList.contains("drag-order");
}

/*Show that elements can be dragged into drag-over class elements or child of, only when dragged is set.
Shows other draggable elements cannot be dragged in.*/
function draggingOver(event) {
    if (dragged !== null) 
    {
        if (event.target.classList.contains("drag-order")) {
            event.preventDefault();
        }
        else if (isChildOfDragOrder(event.target)) {
            event.preventDefault();
        }
    }
}

//Allow the drop event on drag-order elements that have drag-order class or are children, and when dragged is set.
function dropped(event) {
    if (dragged !== null)
    {
        if (event.target.classList.contains("drag-order")) {
            event.preventDefault();
            event.stopPropagation();
            event.target.parentElement.classList.add("swap");
            dragged.outerHTML = event.target.outerHTML;
            event.target.outerHTML = event.dataTransfer.getData("text");
            fixSwappedElems();
        }
        else if (isChildOfDragOrder(event.target)) {
            event.preventDefault();
            event.stopPropagation();
            if (event.target.parentElement.outerHTML != dragged.outerHTML) {
                event.target.parentElement.classList.add("swap");
                dragged.outerHTML = event.target.parentElement.outerHTML;
                event.target.parentElement.outerHTML = event.dataTransfer.getData("text");
                fixSwappedElems();
            }
        }
        dragged = null; //dragged is no longer set.
    }
    
}
