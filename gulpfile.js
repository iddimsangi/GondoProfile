const gulp = require("gulp");
const fileinclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("node-sass"));
const sassGlob = require("gulp-sass-glob");
const rename = require("gulp-rename");
const fs = require("fs");

// Paths
const paths = {
  html: {
    src: ["./src/*.html", "./src/**/*.html"],
    dest: "./dist/",
  },
  sass: {
    src: ["./scss/*.scss", "./scss/**/*.scss", "!**/_*/**"],
    dest: "./dist/css/",
  },
};

// File include task
gulp.task("fileinclude", function () {
  return gulp
    .src(paths.html.src)
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest(paths.html.dest));
});

// Sass compilation
gulp.task("sass", function () {
  return gulp
    .src(paths.sass.src)
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(gulp.dest(paths.sass.dest));
});

// Default task
gulp.task("default", gulp.series("fileinclude", "sass"));
