const express = require("express");

let appPromise;

async function loadApp() {
  if (!appPromise) {
    appPromise = import("./artifacts/api-server/src/app.js").then(
      (mod) => mod.default ?? mod,
    );
  }

  return appPromise;
}

module.exports = async function appHandler(req, res) {
  void express;
  const app = await loadApp();
  return app(req, res);
};
