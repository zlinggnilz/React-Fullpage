const eventHandle = {
  getEvent: function(event) {
    return event || window.event;
  },
  addEvent: function(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler);
    } else {
      element['on' + type] = handler;
    }
  },
  removeEvent: function(element, type, handler) {
    if (element.removeEventListener) element.removeEventListener(type, handler, false);
    else if (element.deattachEvent) {
      element.deattachEvent('on' + type, handler);
    } else {
      element['on' + type] = null;
    }
  },
  getWheelDelta: function(event) {
    return event.wheelDelta ? event.wheelDelta : -event.detail * 40;
  }
};

export default eventHandle;
