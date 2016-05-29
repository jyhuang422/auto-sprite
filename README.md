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
```javascript
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

この時、以下のmixin lessコード使って、background-positionとbackground-sizeを計算します
* mixin
```LESS
.custom-sprite(@item, @width) {
  @name: e(extract(@item, 10));
  @icon-width-unit: unit(@width);
  .@{name} {
    @y: "@{name}-offset-y";
    @x: "@{name}-offset-x";
    @orig-width: "@{name}-width";
    background-size: unit((@icon-width-unit) * unit(@icon-download-total-width) / unit(@@orig-width) , px) auto;
    background-position: unit( round(unit(@@x) * @icon-width-unit / unit(@@orig-width)), px) unit( round(unit(@@y) * @icon-width-unit / unit(@@orig-width)), px);
  }
}
.custom-sprites(@spritesheet-sprites, @width) {
  .loop_sprite(@list-count) when (@list-count > 0) {
    .loop_sprite((@list-count - 1));
    @item: extract(@spritesheet-sprites, @list-count);
    .custom-sprite(@item, @width);
  }
  .loop_sprite(length(@spritesheet-sprites));
}
```

* mixinを使って、iconの様式を調整しあす
```less
@icon-width: 30px;

[class^="icon-"] {
  display: inline-block;
  text-align: center;
  background-color: #ddd;
  width: @icon-width;
  height: @icon-width;
  background-image: url(@spritesheet-image);
  background-repeat: no-repeat;
}

.custom-sprites(@spritesheet-sprites, @icon-width);
```
