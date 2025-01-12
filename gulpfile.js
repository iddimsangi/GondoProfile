const gulp = require("gulp");
const fileinclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("node-sass"));
const sassGlob = require("gulp-sass-glob");
const rename = require("gulp-rename");
const imageResize = require("gulp-image-resize");
const through2 = require("through2");
const connect = require("gulp-connect");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

let baseHref = "";
let blockPrefix = "landing";

// Backup `index.html` before build
gulp.task("backup-index", function (done) {
  if (fs.existsSync("./index.html")) {
    fs.copyFileSync("./index.html", "./index.backup.html");
  }
  done();
});

// Restore `index.html` after build
gulp.task("restore-index", function (done) {
  if (fs.existsSync("./index.backup.html")) {
    fs.renameSync("./index.backup.html", "./index.html");
  }
  done();
});

// File include task (excluding index.html)
gulp.task("fileinclude", function () {
  return gulp
    .src([
      "./src/*.html",
      "./src/**/*.html",
      "!./src/index.html",
      "!**/-*/**",
      "!**/_*/**",
    ]) // Exclude index.html
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(touch())
    .pipe(gulp.dest("./"));
});

// Optional task to process `index.template.html` into `index.html`
gulp.task("fileinclude-index", function () {
  return gulp
    .src("./src/index.template.html")
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(rename("index.html"))
    .pipe(touch())
    .pipe(gulp.dest("./"));
});

// Sass compilation
gulp.task("sass", function () {
  return gulp
    .src(["./scss/*.scss", "./scss/**/*.scss", "!**/_*/**"])
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(gulp.dest("./css"));
});

// Watch for changes
gulp.task("watch", function () {
  gulp.watch(["./src/*.html", "./src/**/*.html"], gulp.series("fileinclude"));
  gulp.watch(
    ["./scss/*.scss", "./scss/**/*.scss", "./scss/**/**/*.scss"],
    gulp.series("sass")
  );
});

// Build task
gulp.task(
  "build",
  gulp.series("backup-index", "fileinclude", "sass", "restore-index")
);

// Start a development server
gulp.task("start", function () {
  connect.server({
    root: ".",
    livereload: true,
    port: 8008,
  });
});

// Helper function to update file timestamps
const touch = () =>
  through2.obj(function (file, enc, cb) {
    if (file.stat) {
      file.stat.atime = file.stat.mtime = file.stat.ctime = new Date();
    }
    cb(null, file);
  });
