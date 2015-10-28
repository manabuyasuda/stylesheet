# stylesheet

FLOCSSをベースにしたオブジェクト指向のスタイルシートです。以下のような特徴があります。

* [FLOCSS](https://github.com/hiloki/flocss)をベースにしたディレクトリ構成。
* OOCSSをベースにしたマルチクラス設計。
* [MindBEMding](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)と[BEMIT](http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)をベースにした命名規則。
* レスポンシブ対応のグリッドシステム。
* Vertical Rhythmを使用した余白管理。

## ディレクトリ構成
FLOCSSの構成にいくつかのレイヤーを足した以下のような構成になっています。

1. Foundation
    1. Function
    2. Variable
    3. Mixin
    4. Vendor
    5. Vendor-extension
    6. Base
1. Layout
2. Object
    1. Component
    2. Project
    3. Utility

後ろのレイヤーになるほど具体的で詳細度が高く、カスケーディングにおいて強くする必要があります。そのため、レイヤーの順番を変更してはいけません。

### Foundation
FunctionとVariable、MixinにはSassの機能である関数と変数を定義しています。多くの関数や変数を定義する場合は機能ごとにファイルを分割します。特定のmixinやレイヤーでのみ使用する変数や関数は、その特定のファイル内で定義します。

```scss
$base-font-color: #333 !default;
$heading-font-color: null !default;
$base-background-color: #fff !default;
$base-link-color: #2b70ba !default;
$visited-link-color: null !default;
$hover-link-color: lighten($base-link-color, 15%) !default;
```

```scss
@mixin media-query($breakpoint) {
    @if map-has-key($breakpoints, $breakpoint) {
        @media #{unquote(map-get($breakpoints, $breakpoint))} {
            @content;
        }
    }
    @else {
        @warn "Unfortunately, no value could be retrieved from `#{$breakpoint}`. "
        + "Available breakpoints are: #{map-keys($breakpoints)}.";
    }
}
```

Vendorはnormalize.cssやBootstrapのような外部のライブラリやフレームワークです。スタイルの上書きはVendor-extensionレイヤーでそれぞれのファイルを作成しておこないます。これは[Sass Guidelines](http://sass-guidelin.es/#the-7-1-pattern)のVENDORS FOLDERのアイデアを取り入れています。

Baseにはプロジェクトにおける、基本的なベーススタイルを定義します。要素セレクタや属性セレクタなど、詳細度はできるかぎり低く保っておきます。

```scss
html {
    box-sizing: border-box;
}

*,
*:before,
*:after {
    box-sizing: inherit;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: $heading-font-family;
    font-weight: $heading-font-weight;
    color: $heading-font-color;
}
```

### Layout
ページを構成するヘッダーやフッター、メインコンテンツ部分などのコンテナブロックのスタイルを定義します。目安としてはワイヤーフレームに書かれるような大きな単位のブロックです。

ページ内で唯一の要素となるのでIDセレクタを使用することができます。IDセレクタはこのレイヤーでのみ指定することができます。

```scss
#page-header {}
#page-content {}
```

指定するスタイルは最小限度に止め、IDセレクタを親にしたセレクタは指定を禁止します。

クラスで指定するようなグリッドシステムはobject/componentレイヤーで定義します。

### Object
プロジェクトにおけるビジュアルパターンをObjectと定義します。抽象度や詳細度、拡張性などによって3つのレイヤーに分けます。

#### Component
多くのプロジェクトで横断的に再利用のできるような、小さな単位のモジュールを定義します。

buttonオブジェクトのベーススタイルや横幅を制限するwrapperオブジェクト、mediaやgridなどのレイアウトパターンがこれに該当します。**OOCSSで言うところの構造の機能を担う**ため、固有の幅や色やボーダーなどはできるだけ含めないようにします。**見た目の部分はProjectレイヤーで指定します**。

モディファイアを定義して、（主に`padding`による）サイズ違いや、配置（`float`や`vertical-align`など）を変更できるようにしておきます。これにはスタイルの重複や肥大化、似たような見た目のデザインをなるべく防ぐという目的もあります。

```html
<div class="c-media">
  <figure class="c-media__image c-media__image--rev">
    <img>
  </figure>
  <div class="c-media__body">
    <p></p>
  </div>
</div>
```

```scss
.c-media__image {
    float: left;
    margin-right: $media-gutter;
    > img {
        display: block;
        max-width: none;
    }
}

.c-media__image--rev {
    float: right; // スタイルの上書き
    margin-right: 0; // スタイルのリセット
    margin-left: $media-gutter; // スタイルの追加
}
```

#### Project
プロジェクト固有のパターンで、例えば記事一覧やモーダルといったユーザーインターフェイス（言葉、見た目、動きによってユーザーと対話をおこなうために使用するもの）が該当します。Componentとしてはスタイル（色やボーダーなど）を多く持っている見た目を定義したオブジェクトと考えます。

Componentのモディファイアで定義するのが適切でない場合はProjectレイヤーでスタイルを追加・上書きすることを許容します。ただし、その場合は詳細度を不必要に強くさせないために、Componentのオブジェクトを親セレクタとせず、詳細度ではなくカスケーディング（同じ詳細なら後に記述した方が優先される）によってスタイルを適応させます。

```html
<ol class="c-rank p-pagination">
  <li class="c-rank__item p-pagination__item">
    <a href="#" class="c-rank__link p-pagination__link p-pagination__link--prev">Prev</a>
  </li>
  <li class="c-rank__item p-pagination__item">
    <a href="#" class="c-rank__link p-pagination__link">1</a>
  </li>
  <li class="c-rank__item p-pagination__item">
    <a href="#" class="c-rank__link p-pagination__link">2</a>
  </li>
  <li class="c-rank__item p-pagination__item">
    <a href="#" class="c-rank__link p-pagination__link">3</a>
  </li>
  <li class="c-rank__item p-pagination__item">
    <a href="#" class="c-rank__link p-pagination__link p-pagination__link--next">Next</a>
  </li>
</ol>
```

```scss
// Componentレイヤー
.c-rank {
    margin: 0;
    padding: 0;
    font-size: 0;
    list-style-type: none;
}

.c-rank__item {
    display: inline-block;
    padding: $rank-space-y $rank-space-x;
    font-size: 1rem;
}

.c-rank__link {
    display: inline-block;
    margin: (-$rank-space-y) (-$rank-space-x);
    padding: $rank-space-y $rank-space-x;
}

// Projectレイヤー
.p-pagination {
    line-height: 1;
    text-align: center;
}

.p-pagination__link {
    display: inline-block;
    padding: $pagination-padding-y $pagination-padding-x;
}

.p-pagination__link--prev:before {
    content: "\003C" "\00A0";
}

.p-pagination__link--next:after {
    content: "\00A0" "\003E";
}
```

基本的にはマルチクラスを想定していますが、@extendを使用したシングルクラスの設計にすることもできます。

```scss
.p-pagination {
    @extend .c-stack;
    line-height: 1;
    text-align: center;
}

.p-pagination__link {
    @extend .c-stack__link;
    display: inline-block;
    padding: $pagination-padding-y $pagination-padding-x;
}
```

コンパイルするとこのようになります。

```css
.c-stack,
.p-pagination {
    margin: 0;
    padding: 0;
    list-style-type: none;
}

.c-stack__link,
.p-pagination__link {
    display: block;
    margin: -1em 0;
    padding: 1em 0;
}
```

@extendを使用する注意点として、ComponentレイヤーからProjectレイヤーへの継承、同一ファイル内での継承のみが許容されます。また、シングルクラスとして設計する場合は混乱を避けるため、マルチクラスと併用しないようにします。

#### Utility
ComponentのモディファイアやProjectのオブジェクトで定義することが適切でない場合はUtilityレイヤーのオブジェクトを使用できます。`width`や`padding`といった単一のスタイルやClearfixのような任意の目的を持つヘルパークラスが定義されています。

例えばgridオブジェクトを使用したグリッドシステムなどに使用します。`u-8/12@md`がUtilityレイヤーのオブジェクトです。

```scss
<div class="c-wrapper">
  <div class="c-grid c-grid--gutter-medium">
    <div class="c-grid__item u-8/12@md"></div>
    <div class="c-grid__item u-4/12@md"></div>
  </div>
</div>
```

```scss
@media screen and (min-width: 768px) {
    .u-4\/12\@md {
        width: 33.33333% !important;
    }
    .u-5\/12\@md {
        width: 41.66667% !important;
    }
    .u-6\/12\@md {
        width: 50% !important;
    }
```

## 命名規則

## グリッドシステム
レスポンシブ対応のグリッドシステムが定義されています。`inline-block`を使用しているので`vertical-align`で縦位置を変更することもできます。

ベースになるスタイルとマークアップ例です。

```scss
.c-grid {
    display: block;
    margin: 0;
    padding: 0;
    /* カラム間の余白を除去する */
    font-size: 0;
    list-style-type: none;
}

.c-grid__item {
    display: inline-block;
    width: 100%;
    /* フォントサイズを戻す */
    font-size: 1rem;
    vertical-align: top;
}
```

```html
<div class="c-grid c-grid--gutter-medium">
  <div class="c-grid__item u-8/12@md"></div>
  <div class="c-grid__item u-4/12@md"></div>
</div>
```

デフォルトではガター（要素間の余白）は設定されていませんので、`c-grid`にmodifierで指定します。

```scss
.c-grid--gutter-medium {
    margin-left: - $grid-gutter;
    > .c-grid__item {
        padding-left: $grid-gutter;
    }
}

.c-grid--gutter-small {
    margin-left: - ($grid-gutter / 2);
    > .c-grid__item {
        padding-left: ($grid-gutter / 2);
    }
}

.c-grid--gutter-large {
    margin-left: - ($grid-gutter * 2);
    > .c-grid__item {
        padding-left: ($grid-gutter * 2);
    }
}
```

縦位置揃えのmodifierです。

```scss
.c-grid--middle {
    > .c-grid__item {
        vertical-align: middle;
    }
}

.c-grid--bottom {
    > .c-grid__item {
        vertical-align: bottom;
    }
}
```

1カラムレイアウトでセンタリングしたいときには`.c-grid--center`を、右寄せにしたいときには`.c-grid--right`を指定します。

```scss
.c-grid--center {
    text-align: center;
    > .c-grid__item {
        text-align: left;
    }
}

.c-grid--right {
    text-align: right;
    > .c-grid__item {
        text-align: left;
    }
}
```

2カラムレイアウトで左右のカラムを反転したいときは`c-grid--rev`を指定します。

```scss
.c-grid--rev {
    text-align: left;
    /* 文字表記を右から左に変更します。 */
    direction: rtl;
    > .c-grid__item {
        /* IE以外ではテキストが右寄せのままになってしまう */
        text-align: left;
        /* derectionプロパティを元に戻します。*/
        direction: ltr;
    }
}
```

`width`の指定は`object/utility/_width.scss`で@mixinによって定義されています。生成されるCSSはこのようになります。

```css
.u-11\/12 { width: 91.66667% !important; }
.u-12\/12 { width: 100% !important; }
@media screen and (min-width: 400px) {
    .u-1\/12\@sm { width: 8.33333% !important; }
    .u-2\/12\@sm { width: 16.66667% !important; }
```

スラッシュ`/`とアットマーク`@`をバックスラッシュ`\`でエスケープしてしますが、マークアップにはエスケープは必要ありません。`c-grid__item`はデフォルトで`width:100%;`が指定されています。

```html
/* 1カラム → 2カラム → 3カラム */
<div class="c-grid__item u-6/12@md u-4/12@lg"></div>
```

## Vertical Rhythm
余白の管理にはVertical Rhythmを採用しています（`padding`は`1em`をベースにしています）。mixinは2つ定義されています。

1つ目の@mixinの`font-size`は`font-size`と`line-height`を指定するためのものです。

```scss
// コンパイル前
.foo {
    @include font-size($base-font-sizes);
}

// コンパイル後
.foo {
    font-size: 14px;
    line-height: 1.715;
}
@media screen and (min-width: 1000px) {
    .foo {
        font-size: 16px;
        line-height: 1.75;
    }
}
```

2つ目の@mixinは要素間の余白を指定するものです。プロパティをその都度指定します。

```scss
// コンパイル前
.foo {
  @include vertical-rhythm(margin-top, 1);
  @include vertical-rhythm(margin-bottom, 1);
}

// コンパイル後
.foo {
  margin-top: 24px;
  margin-bottom: 24px;
}
@media screen and (min-width: 1000px) {
  .foo {
    margin-top: 28px;
  }
}
@media screen and (min-width: 1000px) {
  .foo {
    margin-bottom: 28px;
  }
}
```

### @mixin
@mixinは定義しておいた変数（マップ型）を呼び出して自動的にスタイルを生成します。

```scss
@mixin font-size($fs: $base-font-sizes) {
    // ブレイクポイントを定義したmapを代入します。
    $bp: $breakpoints;

    // 引数に渡したフォントサイズ用のmapのkeyとvalueを取得します。
    @each $name, $unit in $fs {
        // mapのkeyが"base"の場合はブレイクポイントを指定せず値を渡します。
        @if $name == "base" {
             font-size: nth($unit, 1);
             line-height: nth($unit, 3);
        } @else {
            // mapのkeyが"base"以外の場合はブレイクポイントを追加します。
            @if map-has-key($bp, $name) {
                // mapのkeyをブレイクポイントを定義したmapに渡してvalueを取得します。
                @media #{map-get($bp, $name)} {
                    font-size: nth($unit, 1);
                    line-height: nth($unit, 3);
                }
            }
        }
    }
}

@mixin vertical-rhythm($prop, $vr: 1, $important: false) {
    @if ($important == "important") {
        $important: unquote("!important");
    } @else {
        $important: null;
    }

    // ブレイクポイントを定義したmapを代入します。
    $bp: $breakpoints;

    // 引数に渡したフォントサイズ用のmapのkeyとvalueを取得します。
    @each $name, $unit in $base-font-sizes {
        // mapのkeyが"base"の場合はブレイクポイントを指定せず値を渡します。
        @if $name == "base" {
            #{$prop}: nth($unit, 2) * $vr $important;
        } @else {
            @if map-has-key($bp, $name) {
                // mapのkeyをブレイクポイントを定義したmapに渡してvalueを取得します。
                @media #{map-get($bp, $name)} {
                    #{$prop}: nth($unit, 2) * $vr $important;
                }
            }
        }
    }
}
```

マップは2つ定義されています。ブレイクポイント用とフォントサイズ用です。

ブレイクポイントのマップは`faundation/variable/_global.scss`で定義されています。

```scss
$breakpoints: (
    'sm': 'screen and (min-width: 400px)',
    'md': 'screen and (min-width: 768px)',
    'lg': 'screen and (min-width: 1000px)',
    'xl': 'screen and (min-width: 1200px)',
) !default;
```

フォントサイズのマップは`faundation/variable/_font-size.scss`で定義されています。

```scss
@function vr($fs, $lh) {

    // 小数点以下を3桁までに制限します。100に変更すると2桁に制限できます。
    $n: 1000;
    $vr: ceil(($lh / $fs) * $n) / $n;
    $rem: ceil(($lh / $fs) * $n) / $n * 1rem;

    @return ($fs, $lh, $vr, $rem);
}

$base-font-sizes: (
    "base": vr(14px, 24px),
    "lg": vr(16px, 28px),
) !default;

$h1-font-sizes: (
    "base": vr(26px, 24px * 2),
    "lg": vr(30px, 28px * 2),
) !default;

$h2-font-sizes: (
    "base": vr(22px, 24px),
    "lg": vr(26px, 28px),
) !default;
```

マップのkeyにはブレイクポイントのキーワードになる文字列を指定します。`"base"`は必ず含むようにします。

マップのvalueにはフォントサイズと行の高さをpxで指定します。`vr`関数を定義していて、フォントサイズと行の高さの順に渡すと、`フォントサイズ, 行の高さ, 行の高さ（単位なしの相対値）, 行の高さ（remの相対値）, `のようにリスト型で返されます。相対値は小数点以下3桁までに制限されます。

```scss
vr(14px, 24px) // => (14px, 24px, 1.714, 1.714rem)
```

同じkeyの行の高さは常に同じ、もしくは倍数になるように指定します。また、行の高さはフォントサイズより大きいように指定します（行間が狭くなりすぎるため）。

```scss
// OK
$base-font-sizes: (
    "base": vr(14px, 24px),
    "lg": vr(16px, 28px),
) !default;

$h1-font-sizes: (
    "base": vr(26px, 24px * 2),
    "lg": vr(30px, 28px * 2),
) !default;

// NG
$base-font-sizes: (
    "base": vr(14px, 24px),
    "lg": vr(16px, 28px),
) !default;

$h1-font-sizes: (
    "base": vr(26px, 28px), // 24pxに訂正が必要
    "lg": vr(28px, 28px), // 56(28 * 2)pxに訂正が必要
) !default;
```