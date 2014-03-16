function Area(wrapper) {
  this.wrapper = wrapper;
}

Area.prototype.getHeight = function() {
  return this.wrapper.height();
};

Area.prototype.getWidth = function() {
  return this.wrapper.width();
};

Area.prototype.getElement = function() {
  return this.wrapper.get(0);
};