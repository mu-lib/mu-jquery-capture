(function (modules, root, factory) {
  if (typeof define === "function" && define.amd) {
    define(modules, factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory.apply(root, modules.map(require));
  } else {
    root["mu-jquery-capture/add"] = factory.apply(root, modules.map(function (m) {
      return root[m.replace(/^\./, "mu-jquery-capture")];
    }));
  }
})(["./capture"], this, function (capture) {
  return function ($) {
    var add = $.event.add;
    return function (elem, types, handler, data, selector) {
      return add.call(this, elem, types, capture($, handler), data, selector);
    }
  }
});
