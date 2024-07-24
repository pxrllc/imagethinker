// drag.js
export const makeElementDraggable = (element) => {
  let isDragging = false;

  element.onmousedown = function(event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      element.style.left = pageX - shiftX + 'px';
      element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
      if (isDragging) {
        moveAt(event.pageX, event.pageY);
      }
    }

    function onMouseUp() {
      if (isDragging) {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    element.onmousemove = function() {
      isDragging = true;
    };
  };

  element.ondragstart = function() {
    return false;
  };
}
