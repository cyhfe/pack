(function (modules) {
  function require(id) {
    const [fn, mapping] = modules[id];

    function localRequire(name) {
      return require(mapping[name]);
    }

    const module = { exports: {} };

    fn(localRequire, module, module.exports);

    return module.exports;
  }

  require(0);
})({
  0: [
    function (require, module, exports) {
      import message from "./message.js";
      console.log(message);
    },
    { "./message.js": 1 },
  ],
  1: [
    function (require, module, exports) {
      import { name } from "./name.js";
      export default `hello ${name}!`;
    },
    { "./name.js": 2 },
  ],
  2: [
    function (require, module, exports) {
      export const name = "world";
    },
    {},
  ],
});
