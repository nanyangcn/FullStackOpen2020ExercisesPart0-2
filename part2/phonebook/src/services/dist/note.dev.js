"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var baseUrl = 'http://localhost:3001/persons'; // 'https://lit-beach-60745.herokuapp.com/api/persons'

var getAll = function getAll() {
  return _axios["default"].get(baseUrl).then(function (res) {
    return res.data;
  });
};

var create = function create(newObject) {
  return _axios["default"].post(baseUrl, newObject).then(function (res) {
    return res.data;
  });
};

var remove = function remove(id) {
  return _axios["default"]["delete"]("".concat(baseUrl, "/").concat(id)).then(function (res) {
    return res.data;
  });
};

var update = function update(id, newObject) {
  return _axios["default"].put("".concat(baseUrl, "/").concat(id), newObject).then(function (res) {
    return res.data;
  });
};

var _default = {
  getAll: getAll,
  create: create,
  remove: remove,
  update: update
};
exports["default"] = _default;