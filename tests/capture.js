(function (modules, root, factory) {
  if (typeof define === "function" && define.amd) {
    define(modules, factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory.apply(root, modules.map(require));
  } else {
    root["mu-jquery-capture/tests/jquery.event.add"] = factory.apply(root, modules.map(function (m) {
      return this[m] || root[m.replace(/^\.{2}/, "mu-jquery-capture")];
    }, {
        "jquery": root.jQuery,
        "qunit": root.QUnit
      }));
  }
})([
  "qunit",
  "jquery",
  "../capture"
], this, function (QUnit, $, capture) {
  var root = this;

  QUnit.module("mu-jquery-capture/capture");

  QUnit.test("noop", function (assert) {
    assert.expect(2);

    var $element = $("<div>")
      .on("test", capture.call($, function () {
        assert.ok(true, "handler called");
      }));

    assert.deepEqual($element.triggerHandler("test"), [], "empty array returned");
  });

  QUnit.module("mu-jquery-capture/capture#triggerHandler");

  QUnit.test("captures non-false and undefined values", function (assert) {
    assert.expect(1);

    var number = 0;
    var boolean = true;
    var string = "s";
    var object = {};
    var array = [];

    var $element = $("<div>")
      .on("test", capture.call($, function () {
        return number;
      }))
      .on("test", capture.call($, function () {
        return boolean;
      }))
      .on("test", capture.call($, function () {
        return string;
      }))
      .on("test", capture.call($, function () {
        return object;
      }))
      .on("test", capture.call($, function () {
        return [array];
      }));

    assert.deepEqual($element.triggerHandler("test"), [number, boolean, string, object, array], "result matches");
  });

  QUnit.test("skips false, undefined and empty array values", function (assert) {
    assert.expect(1);

    var $element = $("<div>")
      .on("test", capture.call($, function () {
        return "one"
      }))
      .on("test", capture.call($, function () {
        return undefined;
      }))
      .on("test", capture.call($, function () {
        return false;
      }))
      .on("test", capture.call($, function () {
        return [];
      }))
      .on("test", capture.call($, function () {
        return "two";
      }));

    assert.deepEqual($element.triggerHandler("test"), ["one", "two"], "result matches");
  });

  QUnit.test("flattens array values before capture", function (assert) {
    assert.expect(1);

    var $element = $("<div>")
      .on("test", capture.call($, function () {
        return "one";
      }))
      .on("test", capture.call($, function () {
        return ["two", "three"];
      }))
      .on("test", capture.call($, function () {
        return "four";
      }));

    assert.deepEqual($element.triggerHandler("test"), ["one", "two", "three", "four"], "result matches");
  });

  QUnit.test("$event.stopImmediatePropagation() stops capture", function (assert) {
    assert.expect(1);

    var $element = $("<div>")
      .on("test", capture.call($, function () {
        return "one"
      }))
      .on("test", capture.call($, function ($event) {
        $event.stopImmediatePropagation();
      }))
      .on("test", capture.call($, function () {
        return "two";
      }));

    assert.deepEqual($element.triggerHandler("test"), ["one"], "result matches");
  });

  QUnit.module("mu-jquery-capture/capture#trigger");

  QUnit.test("captures values in $event.result", function (assert) {
    assert.expect(1);

    var $element = $("<div>")
      .on("test", capture.call($, function () {
        return "one";
      }))
      .on("test", capture.call($, function () {
        return "two";
      }))
      .on("test", function ($event) {
        assert.deepEqual($event.result, ["one", "two"], "result matches");
      });

    $element.trigger("test");
  });

  QUnit.test("bubbles to parent", function (assert) {
    assert.expect(1);

    var $element = $("<div>")
      .on("test", capture.call($, function () {
        return "parent";
      }))
      .on("test", function ($event) {
        assert.deepEqual($event.result, ["child", "parent"], "result matches");
      });

    var $child = $("<div>")
      .on("test", capture.call($, function () {
        return "child";
      }))
      .appendTo($element);

    $child.trigger("test");
  });

  QUnit.test("return false prevents bubble", function (assert) {
    assert.expect(1);

    var $element = $("<div>")
      .on("test", capture.call($, function () {
        assert.notOk(true, "handler should not be called");
      }));

    var $child = $("<div>")
      .on("test", capture.call($, function () {
        return "one";
      }))
      .on("test", capture.call($, function () {
        return false;
      }))
      .on("test", function ($event) {
        assert.deepEqual($event.result, ["one"], "result matches");
      })
      .appendTo($element)
      .trigger("test");
  });
});