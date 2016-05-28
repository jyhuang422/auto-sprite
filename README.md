# auto-sprite
use gulp plugin creating sprite and less. Also use less to adjust size and position

例のICONのリソース
---
https://icons8.com/web-app/category/all/Very-Basic

使い方説明
---
### gulp
> 主なプラグインは [gulp.spritesmith](https://github.com/twolfson/gulp.spritesmith)。
> 重要なのはimgName, cssName二つのプロパティの相対パスです。
> これはgulp.spritesmithから生成されるLessファイルでのSprite画像のパスに影響します。

例えば、以下のディレクトリ構造

* main
  * assets
    * less
      * demo_sprite.less
  * sprite
    * demo_sprite.png

別のケースを比較します

| imgName         | cssName           | sprite url  |
|:---------------:|:-----------------:|:-----------:|
| demo_sprite.png | demo_sprite.less  | demo_sprite.png |
| sprite/demo_sprite.png | less/demo_sprite.less  | ../../sprite/demo_sprite.png |


gulpのコード
```gulp
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
```

lessのコード
```Less
/* default function in gulp produced less file.
.sprites(@spritesheet-sprites);
*/
```

以上はcssのbackground-sizeが使わないの場合です
しかし、適当なサイズの画像を調整するため、時々background-sizeの設定をします。
そうすれば、gulp.spritesmithから生成されたLessの変数も調整必要があります。
> つまり、background-sizeを使う時、関数.sprites(@spritesheet-sprites)を使用できません

この時、以下のLessコード使います
```LESS
/* decide the width of icon */ 
@icon_width: 30px;

/* calculate the correct position when resizing the original sprite */
@icon_width_unit: unit(@icon_width);
.loop_sprite(@list_count) when (@list_count > 0) {
  .loop_sprite((@list_count - 1));
  @item: extract(@spritesheet-sprites, @list_count);
  @name: e(extract(@item, 10));
  a.@{name} {
    @y: "@{name}-offset-y";
    @x: "@{name}-offset-x";
    @orig_width: "@{name}-width";
    background-size: unit((@icon_width_unit) * unit(@icon-download-total-width) / unit(@@orig_width) , px) auto;
    background-position: unit( round(unit(@@x) * @icon_width_unit / unit(@@orig_width)), px) unit( round(unit(@@y) * @icon_width_unit / unit(@@orig_width)), px);
  }
}

.loop_sprite(length(@spritesheet-sprites));
```
