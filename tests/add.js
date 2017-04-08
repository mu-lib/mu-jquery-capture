(function (modules, root, factory) {
  if (typeof define === "function" && define.amd) {
    define(modules, factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory.apply(root, modules.map(require));
  } else {
    root["mu-jquery-capture/tests/add"] = factory.apply(root, modules.map(function (m) {
      return this[m] || root[m.replace(/^\.{2}/, "mu-jquery-capture")];
    }, {
        "jquery": root.jQuery,
        "qunit": root.QUnit
      }));
  }
})([
  "qunit",
  "jquery",
  "../add"
], this, function (QUnit, $, add) {
  var root = this;

  QUnit.module("mu-jquery-capture/add");

  QUnit.test("run by calling", function (assert) {
    var $event = $.event;
    var $add = add($);
    var $element = $("<div>");
    var element = $element.get(0);

    assert.expect(1);

    $add.call($event, element, "test", function () {
      return "one";
    });
    $add.call($event, element, "test", function () {
      return "two";
    });

    assert.deepEqual($element.triggerHandler("test"), ["one", "two"], "result matches");
  });

  QUnit.test("replace $.event.add", function (assert) {
    var $event = $.event;
    var $add = $event.add;
    var $element = $("<div>");

    assert.expect(1);

    $event.add = add($);

    $element
      .on("test", function () {
        return "one";
      })
      .on("test", function () {
        return "two";
      });

    assert.deepEqual($element.triggerHandler("test"), ["one", "two"], "result matches");

    $event.add = $add;
  });
});