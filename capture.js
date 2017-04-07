(function (modules, root, factory) {
  if (typeof define === "function" && define.amd) {
    define(modules, factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory.apply(root, modules.map(require));
  } else {
    root["mu-jquery-capture/capture"] = factory.apply(root, modules.map(function (m) {
      return root[m];
    }));
  }
})([], this, function () {
  return function (fn) {
    function proxy($event) {
      var $result = $event.result;
      var ret = fn.apply(this, arguments);

      if (ret !== undefined) {
        if (ret === false) {
          $event.preventDefault();
          if (($event.isTrigger & 1) === 1) {
            $event.stopPropagation();
          }
          ret = undefined;
        }
      }

      return ret === undefined ? $result || [] : ($result || Array.prototype).concat(ret);
    }

    proxy.guid = fn.guid = fn.guid || this.guid++;

    return proxy;
  }
});
