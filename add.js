(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["./capture"], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./capture"));
  } else {
    root["mu-jquery-capture/add"] = factory(root["mu-jquery-capture/capture"]);
  }
})(this, function (capture) {
  return function ($) {
    var add = $.event.add;
    return function (elem, types, handler, data, selector) {
      return add.call(this, elem, types, handler.handler ? $.extend({}, handler, { handler: capture($, handler.handler) }) : capture($, handler), data, selector);
    }
  }
});
