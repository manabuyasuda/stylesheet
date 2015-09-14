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

Vendorはnormalize.cssやBootstrapのような外部のライブラリやフレームワークです。スタイルの上書きはVendor-extensionレイヤーでそれぞれのファイルを作成しておこないます。[Sass Guidelines](http://sass-guidelin.es/#the-7-1-pattern)のVENDORS FOLDERのアイデアを取り入れています。

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

クラスで指定するようなグリッドシステムはobject/componentレイヤーで定義します。

### Object
プロジェクトにおけるビジュアルパターンをObjectと定義します。抽象度や詳細度、拡張性などによって3つのレイヤーに分けます。

#### Component
多くのプロジェクトで横断的に再利用のできるような、小さな単位のモジュールを定義します。

buttonオブジェクトのベーススタイルや横幅を制限するwrapperオブジェクト、mediaやgridなどのレイアウトパターンがこれに該当します。**OOCSSで言うところの構造の機能を担う**ため、固有の幅や色やボーダーなどはできるだけ含めないようにします。**見た目の部分はProjectレイヤーで指定します**。

モディファイアを定義して、（主に`padding`による）サイズ違いや、配置（`float`や`vertical-align`など）を変更できるようにしておきます。

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
.#{$media-ns}c-media__image {
    float: left;
    margin-right: $media-gutter;
    > img {
        display: block;
        max-width: none;
    }
}

.#{$media-ns}c-media__image--rev {
    float: right; // スタイルの上書き
    margin-right: 0; // スタイルのリセット
    margin-left: $media-gutter; // スタイルの追加
}
```

#### Project
プロジェクト固有のパターンで、例えば記事一覧やモーダルといったユーザーインターフェイスが該当します。Componentとしてはスタイル（色やボーダーなど）を多く持っている見た目を定義したオブジェクトと考えます。

Componentのモディファイアで定義するのが適切でない場合はProjectレイヤーでスタイルを追加・上書きすることを許容します。ただし、その場合は詳細度を強くさせないために、Componentのオブジェクトを親セレクタとせず、詳細度ではなくカスケーディング（同じ詳細なら後に記述した方が優先される）によってスタイルを適応させます。

```html
<div class="c-media p-related">
  <figure class="c-media__image p-related__image">
    <img>
  </figure>
  <div class="c-media__body p-related__body">
    <p></p>
  </div>
</div>
```

```scss
.#{$media-ns}c-media {
    @include clearfix;
}

.p-related {
    border: 1px solid #ddd;
    border-radius: 3px;
    background-color: #eee;
}
```

#### Utility
ComponentやProjectのオブジェクトのモディファイアで定義することが適切でない場合はUtilityレイヤーのオブジェクトを使用できます。`width`や`margin`といった単一のスタイルやClearfixのような任意の目的を持つヘルパークラスが定義されています。

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