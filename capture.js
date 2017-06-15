(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root["mu-jquery-capture/capture"] = factory();
  }
})(this, function () {
  return function ($, fn) {
    function proxy($event) {
      var $result = $event.result;
      var ret = fn.apply(this, arguments);

      if (ret === false) {
        $event.preventDefault();
        $event.stopPropagation();
        ret = undefined;
      }

      return ret === undefined ? $result || [] : ($result || Array.prototype).concat(ret);
    }

    proxy.guid = fn.guid = fn.guid || $.guid++;

    return proxy;
  }
});
