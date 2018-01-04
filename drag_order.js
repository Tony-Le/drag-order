function attachDragOrderEvents() {
    var elemList = document.querySelectorAll(".drag-order");
    for (var i = 0; i < elemList.length; i++) {
        elemList.item(i).setAttribute("draggable", "true");
        elemList.item(i).addEventListener("drag", function (event) { });
        elemList.item(i).addEventListener("dragstart", dragStarted);
        elemList.item(i).addEventListener("dragend", dragEnded);
        elemList.item(i).addEventListener("dragover", draggingOver);
        elemList.item(i).addEventListener("drop", dropped);
    }
}

function removeDragOrderEvents() {
    var elemList = document.querySelectorAll(".drag-order");
    for (var i = 0; i < elemList.length; i++) {
        elemList.item(i).setAttribute("draggable", "false");
        elemList.item(i).removeEventListener("drag", function (event) { });
        elemList.item(i).removeEventListener("dragstart", dragStarted);
        elemList.item(i).removeEventListener("dragend", dragEnded);
        elemList.item(i).removeEventListener("dragover", draggingOver);
        elemList.item(i).removeEventListener("drop", dropped);
    }
}
var dragged = null;

function dragStarted(event) {
    if (event.target.classList.contains("drag-order")) {
        event.target.classList.add("drag-order-started");
        dragged = event.target;
    }
}

function dragEnded(event) {
    if (event.target.classList.contains("drag-order")) {
        event.target.classList.remove("drag-order-started");
    }
}

/*Dragover and drop events target usually target child elements instead. The functions 
dragover and drop will then check parent class instead. Keeping the non child event
in case it can be targeted.*/
function isChildOfDragOrder(elem) {
    return elem.parentElement.classList.contains("drag-order");
}

/*Show that elements can be dragged into drag-over class elements or child of, only when dragged is set.*/
function draggingOver(event) {
    if (dragged !== null) {
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
    if (dragged !== null) {
        if (event.target.classList.contains("drag-order")) {
            event.preventDefault();
            event.stopPropagation();
            //Swap the elements
            var temp = document.createElement("div");
            dragged.parentNode.insertBefore(temp, dragged);
            event.target.parentNode.insertBefore(dragged, event.target);
            temp.parentNode.insertBefore(event.target, temp);
            temp.parentNode.removeChild(temp);
        }
            //drop event tends to fire over child elements instead
        else if (isChildOfDragOrder(event.target)) {
            event.preventDefault();
            event.stopPropagation();
            //Swap the elements
            var realTarget = event.target.parentElement;
            var temp = document.createElement("div");
            dragged.parentNode.insertBefore(temp, dragged);
            realTarget.parentNode.insertBefore(dragged, realTarget);
            temp.parentNode.insertBefore(realTarget, temp);
            temp.parentNode.removeChild(temp);
        }
        dragged = null; //dragged is no longer set.
    }

}
