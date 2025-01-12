const gulp = require("gulp");
const fileinclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("node-sass"));
const sassGlob = require("gulp-sass-glob");
const rename = require("gulp-rename");
const through2 = require("through2");
const connect = require("gulp-connect");
const fs = require("fs");

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
    .src(["./src/*.html", "./src/**/*.html", "!./src/index.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
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

// Default task
gulp.task(
  "default",
  gulp.series("backup-index", "fileinclude", "sass", "restore-index")
);
