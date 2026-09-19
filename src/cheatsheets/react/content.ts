/**
 * Reactチートシートのデータ。
 *
 * 表示側（components）はこの構造だけを見るので、ここに書いた順序がそのまま
 * 目次とページの並び順になる。項目は必ず helpers.ts の item() で生成する。
 *
 *   item(id, label, syntax, description, note?, status?, keywords?)
 *
 * - id はシート内で一意。目次のアンカー（#id）とReactのkeyに使われる
 * - status は normal / info / warning / danger。省略時は normal
 * - XSS につながる書き方には danger、無限ループや再描画されないなどの落とし穴には warning、
 *   推奨の書き方には info を付ける。バッジの色が唯一の警告表示になるため、付け忘れると危険が伝わらない
 * - 範囲は React 本体（react / react-dom）だけ。ルーターや状態管理ライブラリ、フレームワーク固有の
 *   機能（Server Components など）は扱わない。例は JSX で書き、型付けは最後のセクションにまとめる
 * - 対象は React 19.3（2026-09-09）。19 以降に入った機能は、使えるバージョンを note に書く。
 *   バージョンに依存する記述は react.dev のリリース記事で確認済み（2026-09-18）
 * - keywords は検索用の別名。全角/半角・大文字小文字は normalizeSearch が吸収する
 * - 内容を直したら updatedAt も更新する
 */
import { item } from "../helpers";
import type { CheatSheet } from "../types";

export const reactCheatSheet: CheatSheet = {
  id: "react-reference",
  slug: "react",
  title: "React.js チートシート",
  name: "React.js",
  description:
    "JSX、props、state、Effect、ref、フォーム、Context、Suspense、メモ化、TypeScript での型付けまでをまとめたReactリファレンス。",
  eyebrow: "UI library",
  accent: "#149eca",
  keywords: ["react", "jsx", "hooks", "フック", "コンポーネント", "usestate"],
  updatedAt: "2026-09-18",
  sources: [
    { label: "React リファレンス", url: "https://react.dev/reference/react" },
    { label: "React 学習ガイド", url: "https://react.dev/learn" },
  ],
  sections: [
    // 始め方。Create React App は非推奨になったので、Vite から始める形だけを載せる。
    {
      id: "setup",
      title: "はじめる",
      description: "プロジェクトを作り、アプリを HTML の要素に描画する。",
      items: [
        item(
          "create-vite",
          "プロジェクトを作る",
          "npm create vite@latest my-app -- --template react-ts",
          "Vite で React と TypeScript のプロジェクトを作る。",
          "Create React App は 2025年に非推奨になった。フレームワークを使うなら Next.js や React Router を選ぶ。",
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
          "create-root",
          "アプリを描画する",
          'createRoot(document.getElementById("root")).render(<App />);',
          "HTML の要素を React の描画先にして、最上位のコンポーネントを描画する。",
          "react-dom/client から import する。",
        ),
        item(
          "strict-mode",
          "StrictMode",
          "<StrictMode><App /></StrictMode>",
          "開発時だけ、描画や Effect を余分に実行して、副作用の書き漏れを見つけやすくする。",
          "本番のビルドには影響しない。",
          "info",
        ),
      ],
    },
    // JSX の書き方。リストの key と、HTML を直接入れる危険な書き方を含める。
    {
      id: "jsx",
      title: "JSX",
      description: "JavaScript の中に HTML に似た書き方で画面を書く。",
      items: [
        item(
          "component",
          "コンポーネント",
          "function Greeting() { return <h1>こんにちは</h1>; }",
          "JSX を返す関数がコンポーネントになる。",
          "名前は大文字で始める（小文字は HTML のタグとして扱われる）。",
        ),
        item(
          "jsx-expression",
          "式を埋め込む",
          "<p>{user.name}</p>",
          "波括弧の中に JavaScript の式を書く。",
        ),
        item(
          "class-style",
          "クラスとスタイル",
          '<div className="card" style={{ backgroundColor: "white" }}>',
          "class は className、style はオブジェクトで指定する。",
          "style のプロパティ名はキャメルケースで書く。",
        ),
        item(
          "conditional-and",
          "条件で表示する",
          "{isLoggedIn && <LogoutButton />}",
          "条件が真のときだけ要素を表示する。",
          "左辺が 0 だと 0 がそのまま表示される。count > 0 && … のように真偽値にする。",
        ),
        item(
          "conditional-ternary",
          "条件で切り替える",
          "{isLoading ? <Spinner /> : <List />}",
          "条件に応じて、表示する要素を切り替える。",
        ),
        item(
          "list-key",
          "リストを表示する",
          "{items.map((item) => <li key={item.id}>{item.name}</li>)}",
          "配列から要素を並べ、それぞれに key を付ける。",
          "key は兄弟の中で一意な値にする。配列の index を使うと、並べ替えや削除で状態が取り違えられる。",
          "info",
        ),
        item(
          "fragment",
          "フラグメント",
          "<>…</>",
          "余分な要素を増やさずに、複数の要素をまとめて返す。",
          "key を付けるときは <Fragment key={id}> と書く。",
        ),
        item(
          "dangerously-set-inner-html",
          "HTML を直接挿入",
          "<div dangerouslySetInnerHTML={{ __html: html }} />",
          "文字列を HTML として解釈して挿入する。",
          "信頼できない文字列を渡すと XSS になる。サニタイズしてから使う。",
          "danger",
          ["xss", "innerhtml"],
        ),
      ],
    },
    // props の受け渡し。React 19 から ref を普通の props として受け取れる。
    {
      id: "props",
      title: "props",
      description: "親から子へ値を渡す。子は受け取った props を書き換えない。",
      items: [
        item(
          "props-destructure",
          "props を受け取る",
          "function Avatar({ src, size = 48 }) { … }",
          "親から渡された値を分割代入で取り出す。既定値も書ける。",
        ),
        item(
          "props-pass",
          "props を渡す",
          '<Avatar src={user.photo} size={64} alt="" />',
          "属性のように書いて値を渡す。文字列以外は波括弧で囲む。",
        ),
        item(
          "children",
          "children",
          'function Card({ children }) { return <div className="card">{children}</div>; }',
          "開始タグと終了タグの間に書いた内容を、children で受け取る。",
        ),
        item(
          "spread-props",
          "まとめて渡す",
          "<Button {...buttonProps} />",
          "オブジェクトのプロパティを、まとめて props として渡す。",
          "何が渡るか追いにくくなるので、必要なものだけを渡すほうがよい。",
        ),
        item(
          "ref-as-prop",
          "ref を受け取る",
          "function TextInput({ ref, ...props }) { return <input ref={ref} {...props} />; }",
          "ref を通常の props として受け取り、中の要素に渡す。",
          "React 19 以降。forwardRef は不要になった。",
        ),
        item(
          "props-readonly",
          "props は書き換えない",
          undefined,
          "受け取った props は読み取り専用として扱う。変えたい値は state にする。",
          undefined,
          "info",
        ),
      ],
    },
    // state。直接書き換えても再描画されない点を、オブジェクト・配列の更新の note で示す。
    {
      id: "state",
      title: "state",
      description: "コンポーネントが覚えておく値。更新すると再描画される。",
      items: [
        item(
          "use-state",
          "state を作る",
          "const [count, setCount] = useState(0);",
          "値と、それを更新する関数の組を作る。",
          undefined,
          "info",
        ),
        item(
          "set-state",
          "state を更新する",
          "setCount(count + 1);",
          "新しい値を渡して、再描画を予約する。",
          "更新は次の描画で反映される。直後に count を読んでも、まだ古い値のまま。",
        ),
        item(
          "updater-function",
          "直前の値から更新する",
          "setCount((prev) => prev + 1);",
          "直前の値を受け取る関数を渡して更新する。",
          "同じイベントの中で何度も更新するときは、この形にする。",
        ),
        item(
          "update-object",
          "オブジェクトを更新する",
          'setUser({ ...user, name: "Ann" });',
          "コピーして一部を書き換えた、新しいオブジェクトを渡す。",
          "user.name = … と直接書き換えても再描画されない。",
          "warning",
        ),
        item(
          "update-array",
          "配列を更新する",
          "setItems([...items, newItem]); / setItems(items.filter((item) => item.id !== id));",
          "追加も削除も、新しい配列を作って渡す。",
          "push や splice で元の配列を書き換えない。",
          "warning",
        ),
        item(
          "lazy-initial-state",
          "初期値を1回だけ計算",
          "const [todos, setTodos] = useState(() => loadTodos());",
          "関数を渡すと、初期値の計算を最初の描画でだけ行う。",
        ),
        item(
          "lift-state",
          "state を親に持ち上げる",
          "<SearchBox value={query} onChange={setQuery} />",
          "複数の子で共有する値は共通の親の state にし、props で渡す。",
        ),
        item(
          "use-reducer",
          "更新のロジックをまとめる",
          "const [state, dispatch] = useReducer(reducer, initialState);",
          "state の更新方法を reducer 関数にまとめ、dispatch でアクションを送る。",
          'dispatch({ type: "added", text }) のように、何が起きたかを渡す。',
        ),
      ],
    },
    // Effect。外部との同期だけに使い、計算で済むものは Effect にしない。
    {
      id: "effects",
      title: "Effect",
      description: "描画のあとに、React の外のもの（通信・タイマー・DOM）と同期する。",
      items: [
        item(
          "use-effect",
          "Effect を書く",
          "useEffect(() => { … }, [roomId]);",
          "描画のあとに、外部と同期する処理を実行する。",
          "依存配列の値が変わったときだけ、再実行される。",
        ),
        item(
          "effect-cleanup",
          "片付け",
          "useEffect(() => { const id = setInterval(tick, 1000); return () => clearInterval(id); }, []);",
          "戻り値の関数で、購読やタイマーを片付ける。",
          "開発時の StrictMode では、片付けの確認のため Effect が1回余分に実行される。",
          "info",
        ),
        item(
          "effect-once",
          "最初に1回だけ",
          "useEffect(() => { … }, []);",
          "依存配列を空にすると、表示されたときに1回だけ実行する。",
        ),
        item(
          "effect-no-deps",
          "依存配列を省く",
          "useEffect(() => { … });",
          "描画のたびに毎回実行される。",
          "中で state を更新すると、無限ループになりやすい。",
          "warning",
        ),
        item(
          "no-effect-needed",
          "Effect が要らない場面",
          'const fullName = firstName + " " + lastName;',
          "props や state から計算できる値は、Effect と state を使わずに描画中に計算する。",
          undefined,
          "info",
        ),
        item(
          "fetch-in-effect",
          "Effect でデータを取得",
          "useEffect(() => { let ignore = false; fetchUser(id).then((user) => { if (!ignore) setUser(user); }); return () => { ignore = true; }; }, [id]);",
          "古いリクエストの結果で上書きしないよう、片付けでフラグを立てる。",
          "実際のアプリでは、データ取得ライブラリやフレームワークの仕組みを使うことが多い。",
        ),
        item(
          "use-effect-event",
          "Effect から呼ぶイベント関数",
          "const onConnected = useEffectEvent(() => { showToast(theme); });",
          "最新の props や state を読むが、Effect の再実行のきっかけにはしない関数を作る。",
          "依存配列には入れない。React 19.2 以降。",
        ),
        item(
          "use-layout-effect",
          "画面に出す前に実行",
          "useLayoutEffect(() => { … }, []);",
          "描画結果を画面に反映する前に実行する。要素の大きさの測定などに使う。",
          "描画を止めるので、必要なときだけ使う。",
        ),
      ],
    },
    // ref。描画に使わない値の保持と、DOM の操作。
    {
      id: "refs",
      title: "ref",
      description: "再描画せずに値を保持したり、DOM 要素を直接操作したりする。",
      items: [
        item(
          "use-ref-dom",
          "DOM 要素を参照する",
          "const inputRef = useRef(null);\n<input ref={inputRef} />",
          "ref 属性に渡すと、current に DOM 要素が入る。",
        ),
        item(
          "ref-focus",
          "DOM を操作する",
          "inputRef.current.focus();",
          "イベントハンドラーや Effect の中で、DOM 要素を操作する。",
          "描画中に current を読み書きしない。",
        ),
        item(
          "use-ref-value",
          "描画に使わない値を保持",
          "const timerRef = useRef(null);",
          "再描画しても値が残り、書き換えても再描画されない入れ物を作る。",
          "タイマーの ID などを入れる。",
        ),
        item(
          "ref-callback-cleanup",
          "ref コールバックの片付け",
          "<div ref={(node) => { observer.observe(node); return () => observer.unobserve(node); }} />",
          "ref に関数を渡し、要素が外れるときの片付けを返す。",
          "React 19 以降。",
        ),
        item(
          "fragment-ref",
          "Fragment の ref",
          "<Fragment ref={fragmentRef}>…</Fragment>",
          "Fragment の中の要素をまとめて扱う ref を得る。",
          "focus() や observeUsing() などが使える。React 19.3 以降。",
        ),
      ],
    },
    // イベント処理。関数を呼び出して渡してしまう誤りを note で示す。
    {
      id: "events",
      title: "イベント",
      description: "クリックや入力などの操作に反応する。",
      items: [
        item(
          "on-click",
          "クリックに反応",
          "<button onClick={handleClick}>保存</button>",
          "イベントハンドラーには関数そのものを渡す。",
          "onClick={handleClick()} と書くと、描画のたびに呼ばれてしまう。",
        ),
        item(
          "handler-with-args",
          "引数を渡す",
          "<button onClick={() => remove(item.id)}>削除</button>",
          "引数を渡すときは、アロー関数で包む。",
        ),
        item(
          "event-object",
          "イベントオブジェクト",
          "function handleChange(e) { setText(e.target.value); }",
          "ハンドラーの引数で、イベントの情報を受け取る。",
        ),
        item(
          "prevent-default",
          "既定の動作を止める",
          "e.preventDefault();",
          "フォームの送信などの既定の動作を止める。",
        ),
        item(
          "stop-propagation",
          "親への伝わりを止める",
          "e.stopPropagation();",
          "親要素へイベントが伝わるのを止める。",
        ),
        item(
          "handler-prop",
          "ハンドラーを props で渡す",
          "<Toolbar onSave={handleSave} />",
          "子から親へ操作を伝えるため、関数を props で渡す。",
          "受け取る側の props 名は on で始める。",
        ),
      ],
    },
    // フォーム。React 19 の form action と、関連するフックを後半にまとめる。
    {
      id: "forms",
      title: "フォーム",
      description: "入力値を state で持つ方法と、React 19 の form action。",
      items: [
        item(
          "controlled-input",
          "制御された入力欄",
          "<input value={text} onChange={(e) => setText(e.target.value)} />",
          "入力値を state で持ち、変更のたびに更新する。",
          undefined,
          "info",
        ),
        item(
          "checkbox",
          "チェックボックス",
          '<input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />',
          "チェックの状態は checked と e.target.checked で扱う。",
        ),
        item(
          "select",
          "セレクトボックス",
          "<select value={size} onChange={(e) => setSize(e.target.value)}>…</select>",
          "選択中の値を value で指定する。",
        ),
        item(
          "uncontrolled-input",
          "非制御の入力欄",
          '<input name="email" defaultValue="" />',
          "初期値だけを渡し、入力中の値は DOM に持たせる。",
          "値は送信時に FormData などで読む。",
        ),
        item(
          "form-action",
          "form action",
          '<form action={async (formData) => { await save(formData.get("title")); }}>',
          "送信時に FormData を受け取る関数を action に渡す。",
          "React 19 以降。送信が終わると、非制御の入力欄はリセットされる。",
        ),
        item(
          "use-action-state",
          "送信の結果と状態",
          "const [state, formAction, isPending] = useActionState(saveAction, null);",
          "action の結果と、送信中かどうかを受け取る。",
          "React 19 以降。",
        ),
        item(
          "use-form-status",
          "親のフォームの送信状態",
          "const { pending } = useFormStatus();",
          "form の中の子コンポーネントから、送信中かどうかを読む。",
          "react-dom から import する。React 19 以降。",
        ),
        item(
          "use-optimistic",
          "楽観的な更新",
          "const [optimisticItems, addOptimistic] = useOptimistic(items, (state, item) => [...state, item]);",
          "送信の完了を待たずに、画面を先に更新しておく。",
          "失敗すると元の値に戻る。React 19 以降。",
        ),
      ],
    },
    // Context。props のバケツリレーを避けて深い子へ値を渡す。
    {
      id: "context",
      title: "Context",
      description: "間のコンポーネントを経由せずに、深い子へ値を渡す。",
      items: [
        item(
          "create-context",
          "Context を作る",
          'const ThemeContext = createContext("light");',
          "値を渡すための入れ物を作る。引数は提供元が無いときの既定値。",
        ),
        item(
          "provide-context",
          "値を提供する",
          '<ThemeContext value="dark">…</ThemeContext>',
          "中のすべての子孫に値を提供する。",
          "React 19 以降。以前は <ThemeContext.Provider value=…> と書いた。",
        ),
        item(
          "use-context",
          "値を読む",
          "const theme = useContext(ThemeContext);",
          "一番近い提供元の値を読む。",
        ),
        item(
          "use-context-with-use",
          "use で読む",
          "const theme = use(ThemeContext);",
          "use でも Context を読める。if の中でも呼べる。",
          "React 19 以降。",
        ),
      ],
    },
    // 描画を速くする手段。React Compiler があれば手書きのメモ化はほぼ要らない。
    {
      id: "performance",
      title: "パフォーマンス",
      description: "不要な再計算・再描画を減らし、重い更新で操作が詰まらないようにする。",
      items: [
        item(
          "use-memo",
          "計算結果を使い回す",
          "const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);",
          "重い計算の結果を、依存が変わるまで使い回す。",
          "React Compiler（2025年10月に 1.0）を使うと自動でメモ化されるので、手書きはほぼ要らなくなる。",
        ),
        item(
          "use-callback",
          "関数を使い回す",
          "const handleSubmit = useCallback((data) => { … }, [productId]);",
          "依存が変わるまで、同じ関数を使い回す。",
          "memo した子に関数を渡すときに使う。",
        ),
        item(
          "memo",
          "再描画を省く",
          "const Row = memo(function Row({ item }) { … });",
          "props が変わらなければ、再描画を省く。",
        ),
        item(
          "lazy",
          "コンポーネントを遅延読み込み",
          'const Chart = lazy(() => import("./Chart.jsx"));',
          "初めて描画するときに、コンポーネントのコードを読み込む。",
          "Suspense で囲んで、読み込み中の表示を用意する。",
        ),
        item(
          "use-transition",
          "急がない更新にする",
          "const [isPending, startTransition] = useTransition();",
          "startTransition で囲んだ更新を後回しにし、入力などへの反応を優先させる。",
        ),
        item(
          "use-deferred-value",
          "値の更新を遅らせる",
          "const deferredQuery = useDeferredValue(query);",
          "重い再描画に使う値だけを遅らせて、入力欄が詰まらないようにする。",
        ),
        item(
          "activity",
          "非表示でも状態を保つ",
          '<Activity mode={isVisible ? "visible" : "hidden"}>…</Activity>',
          "中身を隠しても state を保ち、裏で描画しておく。",
          "hidden の間は Effect が片付けられる。React 19.2 以降。",
        ),
        item(
          "view-transition",
          "画面の変化をアニメーション",
          "<ViewTransition>…</ViewTransition>",
          "中身の追加・削除・変化に、ブラウザの View Transition でアニメーションを付ける。",
          "startTransition の中で起きた更新だけがアニメーションする。React 19.3 以降。",
        ),
      ],
    },
    // 読み込み待ちとエラー。Error Boundary は組み込みのコンポーネントが無い点を note で補う。
    {
      id: "suspense",
      title: "Suspense・エラー・その他",
      description: "読み込み中とエラーの表示、別の場所への描画、ID の生成。",
      items: [
        item(
          "suspense",
          "読み込み中の表示",
          "<Suspense fallback={<Spinner />}>…</Suspense>",
          "中の読み込みが終わるまで、fallback を表示する。",
        ),
        item(
          "use-promise",
          "Promise の結果を読む",
          "const comments = use(commentsPromise);",
          "Promise の結果を読む。解決するまでは、一番近い Suspense が fallback を表示する。",
          "描画のたびに新しい Promise を作らず、外で作ったものを受け取る。React 19 以降。",
        ),
        item(
          "error-boundary",
          "エラーの表示を切り替える",
          "<ErrorBoundary fallback={<p>エラーが発生しました</p>}>…</ErrorBoundary>",
          "子の描画中に起きたエラーを捕まえて、代わりの表示を出す。",
          "React に組み込みの部品は無い。クラスコンポーネントで作るか、react-error-boundary などを使う。",
        ),
        item(
          "create-portal",
          "別の場所に描画する",
          "createPortal(<Modal />, document.body)",
          "コンポーネントの一部を、別の DOM 要素の中に描画する。",
          "react-dom から import する。モーダルやツールチップに使う。",
        ),
        item(
          "use-id",
          "一意な ID を作る",
          "const id = useId();",
          "サーバーとクライアントで一致する一意な ID を作る。label と input の関連付けに使う。",
          "リストの key には使わない。",
          "info",
        ),
      ],
    },
    // フックのルールとカスタムフック。
    {
      id: "hooks",
      title: "フックのルール・カスタムフック",
      description: "フックを呼べる場所の決まりと、ロジックを再利用する方法。",
      items: [
        item(
          "rules-of-hooks",
          "フックのルール",
          undefined,
          "フックはコンポーネントかカスタムフックの最上位で呼ぶ。条件分岐・ループ・早期 return の後では呼ばない。",
          "use だけは例外で、if の中でも呼べる。eslint-plugin-react-hooks で違反を検出できる。",
          "warning",
        ),
        item(
          "custom-hook",
          "カスタムフック",
          "function useOnlineStatus() { const [isOnline, setIsOnline] = useState(true); … return isOnline; }",
          "use で始まる関数に、フックを使ったロジックをまとめて再利用する。",
          "呼び出すたびに独立した state になり、state そのものは共有されない。",
          "info",
        ),
        item(
          "use-sync-external-store",
          "外部の値を購読する",
          "const isOnline = useSyncExternalStore(subscribe, getSnapshot);",
          "ブラウザの API や外部のストアの値を購読し、変わったら再描画する。",
        ),
      ],
    },
    // TypeScript での型付け。props・state・ref・イベントの4つを押さえれば大半は足りる。
    {
      id: "typescript",
      title: "TypeScript での型付け",
      description: "props・state・ref・イベントに型を付ける。",
      items: [
        item(
          "props-type",
          "props の型",
          "type ButtonProps = { label: string; onClick?: () => void };\nfunction Button({ label, onClick }: ButtonProps) { … }",
          "props の型を定義して、引数に付ける。",
        ),
        item(
          "children-type",
          "children の型",
          "children: ReactNode;",
          "描画できるものなら何でも受け付ける型で、children を受け取る。",
          'import type { ReactNode } from "react" で読み込む。',
        ),
        item(
          "use-state-type",
          "state の型",
          "const [user, setUser] = useState<User | null>(null);",
          "初期値から推論できない型は、型引数で指定する。",
        ),
        item(
          "use-ref-type",
          "DOM の ref の型",
          "const inputRef = useRef<HTMLInputElement>(null);",
          "要素の型を指定し、null で初期化する。",
        ),
        item(
          "event-type",
          "イベントの型",
          "function handleChange(e: ChangeEvent<HTMLInputElement>) { … }",
          "React が用意しているイベントの型を使う。",
          "インラインで書いたハンドラーは、型が推論されるので書かなくてよい。",
        ),
        item(
          "component-props",
          "要素の props の型を流用",
          'type InputProps = ComponentProps<"input">;',
          "HTML 要素やコンポーネントが受け取る props の型を取り出す。",
          "既存の要素を包むコンポーネントを作るときに使う。",
        ),
      ],
    },
  ],
};
