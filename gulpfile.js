var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var imagemin = require('gulp-imagemin');

var spritesmith = require('gulp.spritesmith');

gulp.task('default', ['sprite'], function() {
  // place code for your default task here
});

gulp.task('sprite', function () {
  // Generate our spritesheet
  var spriteData = gulp.src('icon/*.png').pipe(spritesmith({
    algorithm: 'binary-tree',
    imgName: 'sprite/demo_sprite.png',
    cssName: 'assets/less/demo_sprite.less'
  }));

  var cssStream = spriteData.css
    .pipe(gulp.dest(''));

  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest(''));

});