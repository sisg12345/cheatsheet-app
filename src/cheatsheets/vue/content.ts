/**
 * Vueチートシートのデータ。
 *
 * 表示側（components）はこの構造だけを見るので、ここに書いた順序がそのまま
 * 目次とページの並び順になる。項目は必ず helpers.ts の item() で生成する。
 *
 *   item(id, label, syntax, description, note?, status?, keywords?)
 *
 * - id はシート内で一意。目次のアンカー（#id）とReactのkeyに使われる
 * - status は normal / info / warning / danger。省略時は normal
 * - XSS につながる書き方には danger、反応性が失われるなどの落とし穴には warning、
 *   推奨の書き方には info を付ける。バッジの色が唯一の警告表示になるため、付け忘れると危険が伝わらない
 * - 範囲は Vue 本体だけで、Composition API と <script setup> の書き方にそろえる。
 *   Vue Router や Pinia などのライブラリは扱わない
 * - 対象は Vue 3.5（3.6 は 2026-09-18 時点で RC）。3.4 以降に入った機能は、使えるバージョンを
 *   note に書く。バージョンに依存する記述は公式ブログと GitHub のリリースで確認済み（2026-09-18）
 * - keywords は検索用の別名。全角/半角・大文字小文字は normalizeSearch が吸収する
 * - 内容を直したら updatedAt も更新する
 */
import { item } from "../helpers";
import type { CheatSheet } from "../types";

export const vueCheatSheet: CheatSheet = {
  id: "vue-reference",
  slug: "vue",
  title: "Vue.js チートシート",
  name: "Vue.js",
  description:
    "テンプレート構文、ディレクティブ、ref と reactive、computed と watch、props と emit、スロットまでをまとめたVue 3リファレンス。",
  eyebrow: "UI framework",
  accent: "#42b883",
  keywords: ["vue", "vue.js", "vue3", "composition api", "script setup", "リアクティブ"],
  updatedAt: "2026-09-18",
  sources: [
    { label: "Vue.js ガイド", url: "https://ja.vuejs.org/guide/introduction.html" },
    { label: "Vue.js API リファレンス", url: "https://ja.vuejs.org/api/" },
  ],
  sections: [
    // 始め方と、単一ファイルコンポーネント（SFC）の形。
    {
      id: "setup",
      title: "はじめる",
      description: "プロジェクトを作り、.vue ファイルでコンポーネントを書く。",
      items: [
        item(
          "create-vue",
          "プロジェクトを作る",
          "npm create vue@latest",
          "公式のひな形（Vite ベース）でプロジェクトを作る。TypeScript などの有無は対話形式で選ぶ。",
          undefined,
          "info",
          ["vite", "setup"],
        ),
        item(
          "dev-server",
          "開発サーバーを起動",
          "npm run dev",
          "変更がすぐ画面に反映される開発サーバーを起動する。",
        ),
        item(
          "create-app",
          "アプリをマウント",
          'createApp(App).mount("#app");',
          "アプリを作り、HTML の要素に描画する。",
        ),
        item(
          "sfc",
          "単一ファイルコンポーネント",
          `<script setup>
import { ref } from "vue";
const count = ref(0);
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>

<style scoped>
button { font-weight: bold; }
</style>`,
          "1つの .vue ファイルに、ロジック・テンプレート・スタイルをまとめる。",
          "<script setup> で宣言した変数や import は、そのままテンプレートで使える。",
          "info",
        ),
        item(
          "script-setup-ts",
          "TypeScript で書く",
          '<script setup lang="ts">',
          "lang に ts を指定すると、TypeScript で書ける。",
        ),
        item(
          "style-scoped",
          "スタイルを閉じ込める",
          "<style scoped>",
          "スタイルを、このコンポーネントの要素だけに効かせる。",
        ),
      ],
    },
    // テンプレートの基本。v-html は XSS の入口になるので danger。
    {
      id: "template",
      title: "テンプレート構文",
      description: "HTML にデータを埋め込み、属性やクラスに値を結び付ける。",
      items: [
        item(
          "interpolation",
          "テキストを表示",
          "{{ user.name }}",
          "データをテキストとして埋め込む。",
          "HTML としては解釈されないので安全。",
        ),
        item(
          "template-expression",
          "式を書く",
          '{{ ok ? "はい" : "いいえ" }}',
          "二重波括弧の中には、1つの式を書ける。",
          "if や代入などの文は書けない。",
        ),
        item(
          "v-bind",
          "属性に値を結び付ける",
          '<img :src="imageUrl" :alt="title">',
          "属性に式の値を結び付ける。: は v-bind の省略形。",
        ),
        item(
          "v-bind-same-name",
          "同じ名前なら値を省略",
          "<img :src :alt>",
          "属性と同じ名前の変数を渡すときは、値を省略できる。",
          "Vue 3.4 以降。",
        ),
        item(
          "class-binding",
          "クラスを切り替える",
          "<div :class=\"{ active: isActive, 'has-error': hasError }\">",
          "値が真のクラスだけを付ける。",
          '配列で :class="[baseClass, sizeClass]" とも書ける。',
        ),
        item(
          "style-binding",
          "スタイルを結び付ける",
          "<div :style=\"{ color: textColor, fontSize: size + 'px' }\">",
          "オブジェクトでインラインスタイルを指定する。",
        ),
        item(
          "v-bind-object",
          "属性をまとめて渡す",
          '<input v-bind="inputAttrs">',
          "オブジェクトのプロパティを、まとめて属性として渡す。",
        ),
        item(
          "v-html",
          "HTML を直接挿入",
          '<div v-html="rawHtml"></div>',
          "文字列を HTML として解釈して挿入する。",
          "信頼できない文字列を渡すと XSS になる。サニタイズしてから使う。",
          "danger",
          ["xss", "innerhtml"],
        ),
      ],
    },
    // 条件分岐と繰り返し。v-if と v-for を同じ要素に書かない点を warning で示す。
    {
      id: "directives",
      title: "条件・繰り返し",
      description: "v-if / v-show で表示を切り替え、v-for で繰り返す。",
      items: [
        item(
          "v-if",
          "条件で表示",
          "<p v-if=\"status === 'ok'\">完了</p>\n<p v-else-if=\"status === 'error'\">失敗</p>\n<p v-else>処理中</p>",
          "条件に合う要素だけを描画する。",
        ),
        item(
          "v-show",
          "表示・非表示を切り替え",
          '<div v-show="isOpen">…</div>',
          "要素は残したまま、CSS の display で表示を切り替える。",
          "頻繁に切り替えるなら v-show、条件が変わりにくいなら v-if。",
        ),
        item(
          "v-for",
          "配列を繰り返す",
          '<li v-for="item in items" :key="item.id">{{ item.name }}</li>',
          "配列の要素ごとに描画する。",
          "key には一意な値を指定する。",
          "info",
        ),
        item(
          "v-for-index",
          "インデックス付きで繰り返す",
          '<li v-for="(item, index) in items" :key="item.id">',
          "要素と、その位置を同時に受け取る。",
        ),
        item(
          "v-for-object",
          "オブジェクトを繰り返す",
          '<li v-for="(value, key) in user" :key="key">',
          "オブジェクトの値とキーを順に受け取る。",
        ),
        item(
          "v-for-range",
          "回数を指定して繰り返す",
          '<span v-for="n in 5" :key="n">{{ n }}</span>',
          "1 から 5 までの数で繰り返す。",
        ),
        item(
          "v-if-with-v-for",
          "v-if と v-for を分ける",
          '<template v-for="item in items" :key="item.id"><li v-if="item.visible">…</li></template>',
          "絞り込みながら繰り返すときは、template で要素を分けるか、computed で先に絞り込む。",
          "同じ要素に書くと v-if が先に評価され、item を参照できない。",
          "warning",
        ),
        item(
          "template-wrapper",
          "複数の要素をまとめる",
          '<template v-if="loggedIn">…</template>',
          "要素を増やさずに、複数の要素をまとめて切り替える。",
        ),
      ],
    },
    // イベントとフォーム入力。修飾子で preventDefault などを短く書ける。
    {
      id: "events-forms",
      title: "イベント・フォーム",
      description: "v-on でイベントに反応し、v-model で入力欄と値を結び付ける。",
      items: [
        item(
          "v-on",
          "イベントに反応",
          '<button @click="increment">+1</button>',
          "イベントに関数を結び付ける。@ は v-on の省略形。",
        ),
        item(
          "v-on-inline",
          "引数を渡して呼ぶ",
          '<button @click="remove(item.id)">削除</button>',
          "テンプレートの中で、引数を付けて呼び出す。",
        ),
        item(
          "event-object",
          "イベントオブジェクト",
          '<input @input="onInput($event)">',
          "インラインで呼ぶときは、イベントオブジェクトを $event で渡す。",
        ),
        item(
          "event-modifiers",
          "イベント修飾子",
          '<form @submit.prevent="save">',
          "修飾子で preventDefault などを書く。",
          ".stop / .once / .self なども使える。",
        ),
        item(
          "key-modifiers",
          "キー修飾子",
          '<input @keyup.enter="submit">',
          "特定のキーが押されたときだけ反応する。",
        ),
        item(
          "v-model",
          "入力欄と結び付ける",
          '<input v-model="message">',
          "入力欄と変数を双方向に結び付ける。",
          undefined,
          "info",
        ),
        item(
          "v-model-checkbox",
          "チェックボックス",
          '<input type="checkbox" v-model="agreed">',
          "チェックの状態を真偽値で結び付ける。",
          "配列に v-model すると、選ばれた value の一覧になる。",
        ),
        item(
          "v-model-select",
          "セレクトボックス",
          '<select v-model="selected"><option value="a">A</option></select>',
          "選択中の option の value を結び付ける。",
        ),
        item(
          "v-model-modifiers",
          "v-model の修飾子",
          '<input v-model.trim="name"> / <input v-model.number="age">',
          "前後の空白を取り除く／数値に変換する。",
          ".lazy を付けると、入力のたびではなく change イベントで同期する。",
        ),
      ],
    },
    // リアクティビティ。基本は ref。reactive は分割代入で反応性を失う点を warning で示す。
    {
      id: "reactivity",
      title: "ref・reactive",
      description: "値をリアクティブにして、変わったら画面を更新させる。基本は ref を使う。",
      items: [
        item(
          "ref",
          "ref を作る",
          "const count = ref(0);",
          "値をリアクティブにする。script の中では .value で読み書きする。",
          "テンプレートでは .value を付けずに使える。",
          "info",
        ),
        item(
          "ref-update",
          "ref を更新",
          "count.value++;",
          "値を書き換えると、使っている画面が更新される。",
        ),
        item(
          "reactive",
          "reactive を作る",
          "const state = reactive({ count: 0, items: [] });",
          "オブジェクト全体をリアクティブにする。.value は要らない。",
          "変数ごと置き換えると反応性が切れる。",
        ),
        item(
          "reactive-destructure",
          "reactive を分割代入する",
          "const { count, items } = toRefs(state);",
          "toRefs で各プロパティを ref にしてから分割代入する。",
          "そのまま const { count } = state と分割代入すると、ただの値になり反応しない。",
          "warning",
        ),
        item(
          "shallow-ref",
          "中身までは追跡しない ref",
          "const rows = shallowRef([]);",
          ".value の置き換えだけを検知し、中身の変更は追跡しない。",
          "大きなデータを扱うときの負荷を減らせる。",
        ),
        item(
          "next-tick",
          "DOM の更新を待つ",
          "await nextTick();",
          "状態の変更が DOM に反映されるのを待つ。",
        ),
        item(
          "options-api-mapping",
          "Options API との対応",
          undefined,
          "data は ref / reactive、computed は computed()、methods は普通の関数、watch は watch() に対応する。",
          "Options API もそのまま使える。1つのコンポーネントの中では、どちらかにそろえる。",
          "info",
        ),
      ],
    },
    // 算出プロパティと監視。props の監視はゲッターで渡す点を note で示す。
    {
      id: "computed-watch",
      title: "computed・watch",
      description: "値から値を計算し、変化に合わせて処理を実行する。",
      items: [
        item(
          "computed",
          "算出プロパティ",
          "const total = computed(() => items.value.reduce((sum, item) => sum + item.price, 0));",
          "他の値から計算される値を作る。依存が変わるまで結果を使い回す。",
          "中で状態を書き換えるなどの副作用を起こさない。",
          "info",
        ),
        item(
          "writable-computed",
          "書き込める computed",
          "const fullName = computed({ get: () => …, set: (value) => { … } });",
          "get と set を渡すと、代入もできる computed になる。",
        ),
        item(
          "watch",
          "値の変化を監視",
          "watch(query, async (newQuery) => { … });",
          "ref などの変化を監視して、処理を実行する。",
        ),
        item(
          "watch-getter",
          "プロパティを監視",
          "watch(() => props.id, (id) => { … });",
          "props やオブジェクトのプロパティは、ゲッター関数で監視する。",
          "props.id をそのまま渡すと、その時点の値になり監視できない。",
          "warning",
        ),
        item(
          "watch-options",
          "watch のオプション",
          "watch(source, callback, { immediate: true, deep: true });",
          "immediate で最初にも実行し、deep で入れ子の変更も検知する。",
        ),
        item(
          "watch-effect",
          "使った値を自動で監視",
          "watchEffect(() => { console.log(count.value); });",
          "中で読んだリアクティブな値を自動で追跡し、変わるたびに実行する。",
        ),
        item(
          "on-watcher-cleanup",
          "watch の片付け",
          "watch(id, (newId) => { const controller = new AbortController(); fetch(`/api/users/${newId}`, { signal: controller.signal }); onWatcherCleanup(() => controller.abort()); });",
          "次に実行される前や止まるときに呼ばれる、片付けの処理を登録する。",
          "古いリクエストの中断などに使う。Vue 3.5 以降。",
        ),
        item(
          "stop-watch",
          "監視を止める",
          "const stop = watch(source, callback);\nstop();",
          "watch の戻り値を呼ぶと監視を止める。",
          "コンポーネントの中で作った watch は、取り除かれるときに自動で止まる。",
        ),
      ],
    },
    // ライフサイクルと、テンプレートの要素への参照・ID の生成。
    {
      id: "lifecycle",
      title: "ライフサイクル・テンプレート参照",
      description: "表示・削除のタイミングで処理を実行し、テンプレートの要素を参照する。",
      items: [
        item(
          "on-mounted",
          "表示されたあと",
          "onMounted(() => { … });",
          "コンポーネントが DOM に追加されたあとに実行する。",
          "DOM を使う初期化はここで行う。",
        ),
        item(
          "on-unmounted",
          "取り除かれたあと",
          "onUnmounted(() => { clearInterval(timer); });",
          "コンポーネントが取り除かれたあとに実行する。タイマーや購読を片付ける。",
        ),
        item(
          "other-lifecycle",
          "その他のフック",
          "onBeforeMount / onBeforeUpdate / onUpdated / onBeforeUnmount",
          "表示の前、更新の前後、取り除かれる前に実行する。",
        ),
        item(
          "on-error-captured",
          "子孫のエラーを捕まえる",
          "onErrorCaptured((error) => { … return false; });",
          "子孫のコンポーネントで起きたエラーを受け取る。",
          "false を返すと、それより上へは伝わらない。",
        ),
        item(
          "use-template-ref",
          "要素を参照する",
          'const input = useTemplateRef("input");\n// <input ref="input">',
          "テンプレートの ref 属性の名前で、要素やコンポーネントを参照する。",
          "Vue 3.5 以降。以前は同じ名前の ref() を用意して参照した。",
        ),
        item(
          "use-id",
          "一意な ID を作る",
          "const id = useId();",
          "サーバーとクライアントで一致する一意な ID を作る。label と入力欄の関連付けに使う。",
          "Vue 3.5 以降。",
        ),
      ],
    },
    // 子コンポーネントと props。props は読み取り専用で、変えるときは親へ伝える。
    {
      id: "components",
      title: "コンポーネント・props",
      description: "子コンポーネントを使い、親から props で値を渡す。",
      items: [
        item(
          "import-component",
          "コンポーネントを使う",
          'import TodoItem from "./TodoItem.vue";',
          "<script setup> では、import するだけでテンプレートで使える。",
        ),
        item(
          "define-props",
          "props を宣言",
          "const props = defineProps({ title: String, count: { type: Number, default: 0 } });",
          "親から受け取る props と、その型・既定値を宣言する。",
          undefined,
          "info",
        ),
        item(
          "define-props-ts",
          "型で props を宣言",
          "const { title, count = 0 } = defineProps<{ title: string; count?: number }>();",
          "TypeScript の型で宣言し、分割代入で既定値を付ける。",
          "分割代入しても反応性は保たれる（Vue 3.5 以降）。監視するときは watch(() => count, …) と書く。",
        ),
        item(
          "pass-props",
          "props を渡す",
          '<TodoItem :title="todo.title" :count="3" />',
          "子に値を渡す。文字列以外は : を付けて式として渡す。",
        ),
        item(
          "props-readonly",
          "props は書き換えない",
          undefined,
          "props は読み取り専用。変えたいときは親にイベントで伝えるか、初期値としてローカルの ref にコピーする。",
          undefined,
          "info",
        ),
        item(
          "attrs-fallthrough",
          "属性の引き継ぎ",
          '<MyButton class="large" />',
          "props として宣言していない属性は、子のルート要素にそのまま引き継がれる。",
          "引き継がせないなら defineOptions({ inheritAttrs: false }) を書く。",
        ),
        item(
          "dynamic-component",
          "表示するコンポーネントを切り替え",
          '<component :is="currentView" />',
          ":is に渡したコンポーネントを表示する。",
        ),
        item(
          "keep-alive",
          "切り替えても状態を保つ",
          '<KeepAlive><component :is="currentTab" /></KeepAlive>',
          "表示を切り替えても、コンポーネントを破棄せずに状態を保つ。",
        ),
      ],
    },
    // 子から親への通知と、コンポーネントの v-model（defineModel）。
    {
      id: "emits-model",
      title: "emit・v-model",
      description: "子から親へイベントで伝え、defineModel で双方向に結び付ける。",
      items: [
        item(
          "define-emits",
          "イベントを宣言",
          'const emit = defineEmits(["change", "delete"]);',
          "子から親へ送るイベントを宣言する。",
        ),
        item("emit", "イベントを送る", 'emit("change", newValue);', "親にイベントと値を送る。"),
        item(
          "listen-emit",
          "子のイベントを受け取る",
          '<TodoItem @delete="removeTodo(todo.id)" />',
          "親の側で、@ でイベントを受け取る。",
        ),
        item(
          "define-emits-ts",
          "型でイベントを宣言",
          "const emit = defineEmits<{ change: [id: number] }>();",
          "イベント名と引数の型を宣言する。",
        ),
        item(
          "define-model",
          "v-model を受け取る",
          "const model = defineModel();",
          "親の v-model と双方向に結び付いた ref を作る。書き換えると親の値も変わる。",
          "Vue 3.4 以降。",
          "info",
        ),
        item(
          "component-v-model",
          "コンポーネントに v-model",
          '<SearchInput v-model="keyword" />',
          "子の defineModel と、親の変数を結び付ける。",
        ),
        item(
          "named-v-model",
          "名前付きの v-model",
          'const title = defineModel("title");\n// <BookForm v-model:title="bookTitle" />',
          "名前を付けて、1つのコンポーネントで複数の v-model を受け取る。",
        ),
      ],
    },
    // スロット。子のデータを使って親が中身を描くスコープ付きスロットまで。
    {
      id: "slots",
      title: "スロット",
      description: "親から子へ、テンプレートの一部を差し込む。",
      items: [
        item(
          "default-slot",
          "スロット",
          "<slot />",
          "親がタグの間に書いた内容を、この場所に表示する。",
        ),
        item(
          "slot-fallback",
          "既定の内容",
          "<slot>送信</slot>",
          "親が何も渡さなかったときに表示する内容を書く。",
        ),
        item(
          "named-slot",
          "名前付きスロット",
          '<slot name="header" />\n<template #header>…</template>',
          "名前を付けて、複数の場所に内容を差し込む。",
          "# は v-slot: の省略形。",
        ),
        item(
          "scoped-slot",
          "スコープ付きスロット",
          '<slot :item="item" />\n<template #default="{ item }">{{ item.name }}</template>',
          "子のデータを受け取って、親が中身を描画する。",
        ),
      ],
    },
    // コンポーネントの外へのロジックの切り出しと、深い子への値の受け渡し。
    {
      id: "composables",
      title: "provide / inject・コンポーザブル",
      description: "深い子へ値を渡し、状態を持つロジックを関数にまとめて再利用する。",
      items: [
        item(
          "provide",
          "値を提供",
          'provide("theme", theme);',
          "子孫のコンポーネントに値を提供する。",
        ),
        item(
          "inject",
          "値を受け取る",
          'const theme = inject("theme", "light");',
          "祖先が提供した値を受け取る。第2引数は、提供元が無いときの既定値。",
        ),
        item(
          "injection-key",
          "型付きのキー",
          "const ThemeKey: InjectionKey<Ref<string>> = Symbol();",
          "TypeScript では、InjectionKey で値の型を付けたキーを使う。",
        ),
        item(
          "composable",
          "コンポーザブル",
          "export function useMouse() { const x = ref(0); const y = ref(0); … return { x, y }; }",
          "use で始まる関数に、状態とロジックをまとめて再利用する。",
          "ref を返すと、使う側で分割代入しても反応性が保たれる。",
          "info",
        ),
      ],
    },
    // 組み込みコンポーネント。Suspense はまだ実験的な機能である点を note に書く。
    {
      id: "built-ins",
      title: "組み込みコンポーネント",
      description: "アニメーション、別の場所への描画、非同期のコンポーネント。",
      items: [
        item(
          "transition",
          "表示・非表示のアニメーション",
          '<Transition name="fade"><p v-if="show">…</p></Transition>',
          "要素が表示・非表示になるときに、CSS のアニメーションを付ける。",
          ".fade-enter-active や .fade-leave-to などのクラスを CSS で定義する。",
        ),
        item(
          "transition-group",
          "リストのアニメーション",
          '<TransitionGroup name="list" tag="ul">…</TransitionGroup>',
          "v-for の要素の追加・削除・並べ替えにアニメーションを付ける。",
        ),
        item(
          "teleport",
          "別の場所に描画",
          '<Teleport to="body"><Modal /></Teleport>',
          "中身を、指定した別の DOM 要素の中に描画する。モーダルなどに使う。",
          "Vue 3.5 から、defer を付けると同じ描画で作られた要素へも送れる。",
        ),
        item(
          "define-async-component",
          "遅延読み込み",
          'const AdminPanel = defineAsyncComponent(() => import("./AdminPanel.vue"));',
          "初めて使うときに読み込むコンポーネントを作る。",
        ),
        item(
          "suspense",
          "非同期の読み込みを待つ",
          "<Suspense><Dashboard /><template #fallback>読み込み中…</template></Suspense>",
          "中の非同期コンポーネントが準備できるまで、fallback を表示する。",
          "まだ実験的な機能で、仕様が変わることがある。",
        ),
      ],
    },
  ],
};
