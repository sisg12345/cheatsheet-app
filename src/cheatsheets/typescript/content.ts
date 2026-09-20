/**
 * TypeScriptチートシートのデータ。
 *
 * 表示側（components）はこの構造だけを見るので、ここに書いた順序がそのまま
 * 目次とページの並び順になる。項目は必ず helpers.ts の item() で生成する。
 *
 *   item(id, label, syntax, description, note?, status?, keywords?)
 *
 * - id はシート内で一意。目次のアンカー（#id）とReactのkeyに使われる
 * - status は normal / info / warning / danger。省略時は normal
 * - 型チェックを黙らせる書き方（any、as、!、@ts-ignore など）には warning、
 *   型を完全に偽る二重アサーション（as unknown as）には danger を付ける。
 *   バッジの色が唯一の警告表示になるため、付け忘れると危険が伝わらない
 * - 対象は TypeScript 6.0 / 7.0。6.0 で tsconfig の既定値が変わり、6.0 で非推奨になった設定は
 *   7.0 で削除された。バージョンに依存する記述は公式のリリースノートで確認済み（2026-09-18）
 * - 比較的新しい機能は、使えるようになったバージョンを note に書く
 * - keywords は検索用の別名。全角/半角・大文字小文字は normalizeSearch が吸収する
 * - 内容を直したら updatedAt も更新する
 * - セクション・項目を増減したら summary.ts の件数も直す（tests/unit/registry.test.ts が突き合わせる）
 */
import { item } from "../helpers";
import type { CheatSheetContent } from "../types";

export const typescriptContent: CheatSheetContent = {
  id: "typescript-reference",
  updatedAt: "2026-09-18",
  sources: [
    {
      label: "TypeScript ハンドブック",
      url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    },
    { label: "TSConfig リファレンス", url: "https://www.typescriptlang.org/tsconfig/" },
  ],
  sections: [
    // 型の書き方の基本。推論に任せられるところは書かない、という方針も最初に示す。
    {
      id: "basics",
      title: "基本の型",
      description: "変数・引数・戻り値に型を付ける。推論できるところは書かなくてよい。",
      items: [
        item(
          "type-annotation",
          "型注釈",
          "let count: number = 0;",
          "名前の後ろに : 型 を書いて、型を指定する。",
        ),
        item(
          "inference",
          "型推論",
          "const total = price * quantity;",
          "代入した値から型が決まるので、多くの場合は型注釈が要らない。",
          undefined,
          "info",
        ),
        item(
          "primitives",
          "プリミティブ型",
          "string / number / boolean / bigint / symbol / null / undefined",
          "JavaScript のプリミティブ値に対応する型。",
          "String や Number（大文字）はラッパーオブジェクトの型なので使わない。",
        ),
        item(
          "array-type",
          "配列",
          "const ids: number[] = [1, 2, 3];",
          "要素の型の後ろに [] を付ける。",
          "Array<number> とも書ける。",
        ),
        item(
          "readonly-array",
          "変更できない配列",
          "function sum(values: readonly number[]) { … }",
          "push などで変更できない配列。引数に付けると、関数が中身を書き換えないことを示せる。",
        ),
        item(
          "tuple",
          "タプル",
          "const point: [x: number, y: number] = [10, 20];",
          "要素の数と、位置ごとの型が決まった配列。",
          "x や y の名前はエディターの表示用で、省略できる。",
        ),
        item(
          "object-type",
          "オブジェクトの型",
          "let user: { name: string; age?: number };",
          "プロパティごとに型を書く。? を付けたプロパティは省略できる。",
        ),
        item(
          "function-type",
          "関数の引数と戻り値",
          "function add(a: number, b: number): number { … }",
          "引数と戻り値に型を付ける。",
          "引数に型を書かないと暗黙の any になり、strict ではエラーになる。戻り値は推論される。",
        ),
      ],
    },
    // 特殊な型。any を避けて unknown を使う方針を warning / info の対比で示す。
    {
      id: "special-types",
      title: "any・unknown・never",
      description: "何でも入る型と、何も入らない型。分からない値は any ではなく unknown で受ける。",
      items: [
        item(
          "any",
          "any",
          "let data: any;",
          "型チェックを行わない型。どんな操作をしてもエラーにならない。",
          "any は代入先にも広がって検査を無効にする。分からない値には unknown を使う。",
          "warning",
        ),
        item(
          "unknown",
          "unknown",
          "const body: unknown = await res.json();",
          "何が入っているか分からない値の型。使う前に絞り込みが必要。",
          undefined,
          "info",
        ),
        item(
          "never",
          "never",
          "function fail(message: string): never { throw new Error(message); }",
          "決して値を返さないことを表す型。",
          "例外を投げるだけの関数や、分岐の網羅チェックに使う。",
        ),
        item(
          "void",
          "void",
          "function log(message: string): void { … }",
          "値を返さない関数の、戻り値の型。",
        ),
        item(
          "nullable",
          "null を許す型",
          "let selected: string | null = null;",
          "strict では、null や undefined は型に含めたときだけ代入できる。",
        ),
        item(
          "unknown-object",
          "中身が決まっていないオブジェクト",
          "Record<string, unknown>",
          "キーも値も決まっていないオブジェクトを表す。",
          "{} 型は null と undefined 以外の値なら何でも入るので、この用途には使わない。",
        ),
      ],
    },
    // 型に名前を付ける2つの方法。使い分けの目安を最後に置く。
    {
      id: "aliases",
      title: "type と interface",
      description:
        "型に名前を付けて再利用する。オブジェクトの形は interface でも type でも書ける。",
      items: [
        item(
          "type-alias",
          "型エイリアス",
          "type UserId = string;",
          "型に名前を付ける。ユニオンや関数型など、どんな型にも使える。",
        ),
        item(
          "interface",
          "interface",
          "interface User { id: UserId; name: string; }",
          "オブジェクトの形に名前を付ける。",
        ),
        item(
          "interface-extends",
          "interface の拡張",
          "interface Admin extends User { permissions: string[]; }",
          "既存の interface にプロパティを足した型を作る。",
        ),
        item(
          "intersection",
          "型の合成（交差型）",
          "type Admin = User & { permissions: string[] };",
          "& でつないだ型のプロパティをすべて持つ型を作る。",
        ),
        item(
          "optional-property",
          "省略できるプロパティ",
          "email?: string;",
          "省略できるプロパティ。読み出したときの型は string | undefined になる。",
        ),
        item(
          "readonly-property",
          "読み取り専用プロパティ",
          "readonly id: string;",
          "代入し直せないプロパティ。",
          "中身のオブジェクトまでは固定されない。",
        ),
        item(
          "index-signature",
          "インデックスシグネチャ",
          "interface Scores { [name: string]: number; }",
          "キーが決まっていないオブジェクトの、値の型を指定する。",
          "noUncheckedIndexedAccess を有効にすると、取り出した値が number | undefined になる。",
        ),
        item(
          "declaration-merging",
          "宣言のマージ",
          "interface Window { appVersion: string; }",
          "同じ名前の interface を書くと、1つの宣言にまとめられる。",
          "type は同じ名前で二度宣言できない。",
        ),
        item(
          "type-or-interface",
          "使い分け",
          undefined,
          "オブジェクトの形は interface、ユニオンや関数型などは type で書くのが一般的。",
          "どちらでもよい場面が多いので、プロジェクト内でそろえる。",
          "info",
        ),
      ],
    },
    // ユニオンとリテラル型。enum の代わりになる as const の書き方もここにまとめる。
    {
      id: "unions",
      title: "ユニオン・リテラル型",
      description: "決まった値の集まりはリテラル型のユニオンで表し、as const で値から型を作る。",
      items: [
        item(
          "union",
          "ユニオン型",
          "let id: string | number;",
          "いずれかの型の値を受け付ける。",
          "使う前に typeof などで絞り込む。",
        ),
        item(
          "literal-type",
          "リテラル型",
          'type Theme = "light" | "dark";',
          "決まった値だけを受け付ける型。",
        ),
        item(
          "const-literal",
          "const とリテラル型",
          'const mode = "dark";',
          'const で宣言すると、型は "dark" というリテラル型になる。',
          "let で宣言すると string に広がる。",
        ),
        item(
          "as-const",
          "as const",
          'const ROLES = ["admin", "editor"] as const;',
          "配列やオブジェクトを readonly にし、値をリテラル型のまま残す。",
          undefined,
          "info",
        ),
        item(
          "union-from-array",
          "配列からユニオン型を作る",
          "type Role = (typeof ROLES)[number];",
          "as const の配列の要素から、ユニオン型を作る。",
          '"admin" | "editor" になる。',
        ),
        item(
          "union-from-object",
          "オブジェクトの値からユニオン型を作る",
          "type Status = (typeof STATUS)[keyof typeof STATUS];",
          "as const のオブジェクトの値から、ユニオン型を作る。",
          "enum の代わりに使える。",
        ),
        item(
          "discriminated-union",
          "判別可能なユニオン",
          'type Shape = { kind: "circle"; radius: number } | { kind: "square"; size: number };',
          "共通のプロパティ（kind）の値で、どの型かを見分けられるユニオン。",
          undefined,
          "info",
        ),
        item(
          "enum",
          "enum",
          "enum Direction { Up, Down }",
          "名前の付いた定数の集まりを作る。",
          "実行時のコードが生成されるため、erasableSyntaxOnly や Node.js の型除去では使えない。as const とユニオン型で代わりが書ける。",
        ),
      ],
    },
    // 型の絞り込み。判別可能なユニオンと never による網羅チェックを続けて並べる。
    {
      id: "narrowing",
      title: "型の絞り込み",
      description: "条件分岐の中では、確かめた内容に合わせて型が絞り込まれる。",
      items: [
        item(
          "typeof-narrowing",
          "typeof で絞り込む",
          'if (typeof value === "string") { … }',
          "プリミティブ型を判定し、ブロックの中ではその型として扱う。",
        ),
        item(
          "truthiness-narrowing",
          "値の有無で絞り込む",
          "if (user) { … }",
          "null や undefined を除いた型として扱う。",
          '0 や "" も除外されるので、数値や文字列では != null を使う。',
        ),
        item(
          "null-narrowing",
          "null と undefined を除く",
          "if (value != null) { … }",
          "!= null は、null と undefined の両方を一度に除外する。",
        ),
        item(
          "in-narrowing",
          "in で絞り込む",
          'if ("email" in contact) { … }',
          "そのプロパティを持つ型だけに絞り込む。",
        ),
        item(
          "instanceof-narrowing",
          "instanceof で絞り込む",
          "if (error instanceof Error) { … }",
          "クラスのインスタンスかどうかで絞り込む。",
          "strict では catch の変数は unknown なので、使う前にこうして確かめる。",
        ),
        item(
          "switch-narrowing",
          "判別用のプロパティで分岐",
          'switch (shape.kind) { case "circle": … }',
          "case ごとに、その kind を持つ型へ絞り込まれる。",
        ),
        item(
          "exhaustive-check",
          "網羅チェック",
          "const unreachable: never = shape;",
          "switch の default に置き、case の追加漏れをコンパイルエラーにする。",
          undefined,
          "info",
        ),
        item(
          "type-predicate",
          "型ガード関数",
          "function isUser(value: unknown): value is User { … }",
          "true を返したとき、引数をその型として扱わせる関数。",
          "判定の中身は検証されないので、正しく書く責任は自分にある。",
        ),
        item(
          "assertion-function",
          "アサーション関数",
          "function assert(condition: unknown, message: string): asserts condition { … }",
          "条件を満たさなければ例外を投げ、以降は条件が成り立つものとして扱う。",
        ),
        item(
          "inferred-predicate",
          "filter での絞り込み",
          "const names = values.filter((value) => value !== undefined);",
          "コールバックから絞り込みが推論され、結果の型から undefined が消える。",
          "TypeScript 5.5 以降。",
        ),
      ],
    },
    // 関数の型付け。オーバーロードは最後の手段として注記する。
    {
      id: "functions",
      title: "関数",
      description: "引数・戻り値・コールバックの型の書き方。",
      items: [
        item(
          "optional-param",
          "省略できる引数",
          "function greet(name?: string) { … }",
          "省略できる引数。型は string | undefined になる。",
          "必須の引数より後ろに置く。",
        ),
        item(
          "default-param",
          "デフォルト引数",
          "function paginate(page = 1) { … }",
          "既定値から型が推論され、省略もできる。",
        ),
        item(
          "rest-param",
          "残余引数",
          "function sum(...values: number[]): number { … }",
          "残りの引数を配列の型で受け取る。",
        ),
        item(
          "function-type-alias",
          "関数の型",
          "type Handler = (event: MouseEvent) => void;",
          "コールバックなどに渡す関数の型を定義する。",
          "戻り値が void の関数型には、値を返す関数も渡せる（戻り値は無視される）。",
        ),
        item(
          "destructured-param",
          "分割代入した引数の型",
          "function render({ title, count = 0 }: Props) { … }",
          "分割代入のパターン全体の後ろに、型を書く。",
        ),
        item(
          "async-return",
          "async 関数の戻り値",
          "async function loadUser(id: string): Promise<User> { … }",
          "async 関数の戻り値は Promise<型> で書く。",
        ),
        item(
          "overload",
          "オーバーロード",
          "function parse(value: string): number;\nfunction parse(value: number): string;\nfunction parse(value: string | number) { … }",
          "引数の型によって戻り値の型が変わる関数を定義する。",
          "最後の実装のシグネチャは外から呼べない。ユニオンやジェネリクスで足りるならそちらを使う。",
        ),
      ],
    },
    // ジェネリクス。制約（extends）と keyof の組み合わせが実務で最もよく使う形。
    {
      id: "generics",
      title: "ジェネリクス",
      description: "型を引数のように受け取り、使うときに具体的な型を決める。",
      items: [
        item(
          "generic-function",
          "ジェネリック関数",
          "function first<T>(items: T[]): T | undefined { return items[0]; }",
          "型引数 T を受け取り、呼び出しごとに具体的な型が決まる。",
        ),
        item(
          "explicit-type-argument",
          "型引数を明示",
          "const value = first<string>([]);",
          "推論できないときは、型引数を指定して呼び出す。",
        ),
        item(
          "generic-constraint",
          "型引数の制約",
          "function getId<T extends { id: string }>(item: T) { return item.id; }",
          "型引数が満たすべき条件を extends で指定する。",
        ),
        item(
          "keyof-constraint",
          "キーを制約にする",
          "function prop<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }",
          "キーを実在するものに限り、値の型も正しく返す。",
          undefined,
          "info",
        ),
        item(
          "default-type-parameter",
          "型引数の既定値",
          "interface ApiResponse<T = unknown> { data: T; error?: string; }",
          "型引数を省略したときに使う型を指定する。",
        ),
        item(
          "generic-type-alias",
          "ジェネリックな型エイリアス",
          "type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };",
          "型引数を受け取る型を定義する。",
        ),
        item(
          "generic-class",
          "ジェネリッククラス",
          "class Store<T> { private items: T[] = []; add(item: T) { … } }",
          "扱う値の型をインスタンスごとに決めるクラスを定義する。",
        ),
        item(
          "const-type-parameter",
          "const 型引数",
          "function tuple<const T extends readonly unknown[]>(values: T): T { return values; }",
          "引数を、as const を付けたときと同じリテラル型で推論する。",
          "TypeScript 5.0 以降。",
        ),
        item(
          "no-infer",
          "推論に使わせない",
          "function fill<T>(value: T, fallback: NoInfer<T>) { … }",
          "NoInfer を付けた引数からは、型引数を推論させない。",
          "TypeScript 5.4 以降。",
        ),
      ],
    },
    // 組み込みのユーティリティ型。既存の型から派生させ、同じ定義を書き直さない。
    {
      id: "utility-types",
      title: "ユーティリティ型",
      description: "既存の型から新しい型を作る組み込みの型。定義を書き直さずに済む。",
      items: [
        item(
          "partial",
          "すべて省略可能に",
          "Partial<User>",
          "すべてのプロパティを省略可能にする。",
          "更新用のパラメーターなど、一部だけを渡す場面で使う。",
        ),
        item("required", "すべて必須に", "Required<User>", "すべてのプロパティを必須にする。"),
        item(
          "readonly",
          "すべて読み取り専用に",
          "Readonly<User>",
          "すべてのプロパティを readonly にする。",
        ),
        item(
          "pick",
          "一部のプロパティだけ残す",
          'Pick<User, "id" | "name">',
          "指定したプロパティだけを持つ型を作る。",
        ),
        item(
          "omit",
          "一部のプロパティを除く",
          'Omit<User, "password">',
          "指定したプロパティを取り除いた型を作る。",
          "存在しないキーを指定してもエラーにならない。",
        ),
        item(
          "record",
          "キーと値の型からオブジェクトを作る",
          "Record<Role, string[]>",
          "キーの型と値の型から、オブジェクトの型を作る。",
        ),
        item(
          "exclude",
          "ユニオンから取り除く",
          'Exclude<Status, "deleted">',
          "ユニオン型から、指定した型を取り除く。",
        ),
        item(
          "extract",
          "ユニオンから取り出す",
          'Extract<Status, "active" | "pending">',
          "ユニオン型から、指定した型に当てはまるものだけを残す。",
        ),
        item(
          "non-nullable",
          "null と undefined を除く",
          "NonNullable<string | null | undefined>",
          "型から null と undefined を取り除く。",
        ),
        item(
          "return-type",
          "戻り値の型を取り出す",
          "ReturnType<typeof createUser>",
          "関数の戻り値の型を取り出す。",
          "関数の型を渡すので、値の関数には typeof を付ける。",
        ),
        item(
          "parameters",
          "引数の型を取り出す",
          "Parameters<typeof createUser>",
          "関数の引数の型を、タプルで取り出す。",
        ),
        item(
          "awaited",
          "Promise の中身の型",
          "Awaited<ReturnType<typeof fetchUser>>",
          "Promise を外した、解決後の値の型を取り出す。",
        ),
      ],
    },
    // 型を組み立てる演算子。keyof / typeof / インデックスアクセスを組み合わせて値から型を作る。
    {
      id: "type-operators",
      title: "型操作",
      description: "keyof・typeof・マップ型・条件型で、既存の型や値から型を組み立てる。",
      items: [
        item(
          "keyof",
          "キーのユニオン",
          "type UserKey = keyof User;",
          "オブジェクト型のキーを、ユニオン型で取り出す。",
        ),
        item(
          "typeof-type",
          "値から型を作る",
          "type Config = typeof defaultConfig;",
          "変数の値から型を作る。",
          "型の位置に書く typeof は TypeScript の機能で、実行時の typeof とは別物。",
        ),
        item(
          "indexed-access",
          "プロパティの型を取り出す",
          'type UserName = User["name"];',
          "オブジェクト型から、指定したプロパティの型を取り出す。",
        ),
        item(
          "element-type",
          "配列の要素の型",
          "type Item = (typeof items)[number];",
          "配列の要素の型を取り出す。",
        ),
        item(
          "mapped-type",
          "マップ型",
          "type Flags<T> = { [K in keyof T]: boolean };",
          "既存の型のキーを使って、新しいオブジェクト型を作る。",
        ),
        item(
          "mapping-modifiers",
          "修飾子を外す・付ける",
          "type Mutable<T> = { -readonly [K in keyof T]: T[K] };",
          "- で readonly や ? を外し、+ で付ける。",
        ),
        item(
          "key-remapping",
          "キー名を変える",
          "type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };",
          "マップ型の中で as を使い、キーの名前を変えた型を作る。",
        ),
        item(
          "conditional-type",
          "条件型",
          "type IsArray<T> = T extends unknown[] ? true : false;",
          "型が条件に当てはまるかどうかで、型を切り替える。",
          "ユニオンを渡すと要素ごとに分配される。[T] extends [unknown[]] と書くと分配しない。",
        ),
        item(
          "infer",
          "型の一部を取り出す",
          "type ElementOf<T> = T extends (infer U)[] ? U : never;",
          "条件型の中で infer を使い、型の一部に名前を付けて取り出す。",
        ),
        item(
          "template-literal-type",
          "テンプレートリテラル型",
          'type EventName = `on${Capitalize<"click" | "focus">}`;',
          "文字列リテラル型を組み立てる。",
          '"onClick" | "onFocus" になる。',
        ),
      ],
    },
    // 型チェックを通すための逃げ道。安全な順（satisfies、@ts-expect-error）と危険な順を並べる。
    {
      id: "assertions",
      title: "型アサーション・エラーの抑制",
      description: "コンパイラーより自分の判断を優先させる書き方。使うほど型の保証が弱くなる。",
      items: [
        item(
          "satisfies",
          "satisfies で型を確かめる",
          'const routes = { home: "/", about: "/about" } satisfies Record<string, string>;',
          "型に合っているかを確かめつつ、推論された細かい型をそのまま残す。",
          "as と違い、合っていなければエラーになる。",
          "info",
        ),
        item(
          "as-assertion",
          "型アサーション",
          'const input = document.querySelector("#name") as HTMLInputElement;',
          "値の型を、開発者の判断で指定する。",
          "実際の値が違っていてもエラーにならない。確かめられるなら絞り込みを使う。",
          "warning",
        ),
        item(
          "non-null-assertion",
          "非 null アサーション",
          'const root = document.getElementById("root")!;',
          "末尾の ! で、null や undefined ではないものとして扱う。",
          "実際に null だった場合は実行時にエラーになる。",
          "warning",
        ),
        item(
          "double-assertion",
          "二重アサーション",
          "const user = data as unknown as User;",
          "unknown を経由して、互換性のない型へ無理やり変える。",
          "型チェックを完全にすり抜ける。外部から来たデータは、スキーマなどで実際に検証する。",
          "danger",
        ),
        item(
          "definite-assignment",
          "代入済みとみなす",
          "let value!: number;",
          "後で必ず代入することを伝え、未代入のエラーを抑える。",
          "代入し忘れても型エラーにならない。",
          "warning",
        ),
        item(
          "ts-expect-error",
          "エラーを想定して抑える",
          "// @ts-expect-error テストのため、不正な値を渡す",
          "次の行の型エラーを抑える。エラーが無くなると、このコメント自体がエラーになる。",
          "理由を書き添える。",
          "info",
        ),
        item(
          "ts-ignore",
          "エラーを無視する",
          "// @ts-ignore",
          "次の行の型エラーを、無条件に無視する。",
          "原因が直っても気付けない。使うなら @ts-expect-error にする。",
          "warning",
        ),
      ],
    },
    // クラスの型付け。パラメータープロパティは型除去で使えない点を注記する。
    {
      id: "classes",
      title: "クラス",
      description: "プロパティの型、アクセス修飾子、interface の実装、抽象クラス。",
      items: [
        item(
          "class-property",
          "プロパティの型",
          "class User { name: string; constructor(name: string) { this.name = name; } }",
          "プロパティの型を宣言し、constructor で初期化する。",
          "strict では、初期化していないプロパティはエラーになる。",
        ),
        item(
          "access-modifiers",
          "アクセス修飾子",
          "private token: string; / protected log() { … } / public name: string;",
          "private はクラスの中だけ、protected はサブクラスからも参照できる。public は既定。",
          "型チェックだけの制限で、実行時には見えてしまう。実行時にも隠すなら #token を使う。",
        ),
        item(
          "class-readonly",
          "読み取り専用",
          "readonly id: string;",
          "constructor の中でだけ代入できるプロパティ。",
        ),
        item(
          "parameter-properties",
          "パラメータープロパティ",
          "constructor(private readonly repository: UserRepository) {}",
          "引数に修飾子を付けて、同名のプロパティの宣言と代入を省略する。",
          "実行時のコードが生成されるため、erasableSyntaxOnly や Node.js の型除去では使えない。",
        ),
        item(
          "implements",
          "interface を実装",
          "class FileStore implements Store { … }",
          "クラスが interface の形を満たしているかを確かめる。",
        ),
        item(
          "abstract-class",
          "抽象クラス",
          "abstract class Shape { abstract area(): number; }",
          "直接 new できず、サブクラスに実装させるメソッドを定義する。",
        ),
        item(
          "override",
          "オーバーライドを明示",
          "override render(): void { … }",
          "親クラスのメソッドを上書きしていることを明示する。",
          "noImplicitOverride を有効にすると、override の付け忘れがエラーになる。",
        ),
      ],
    },
    // 型の import / export と型定義ファイル。verbatimModuleSyntax を前提に import type を推奨する。
    {
      id: "modules",
      title: "モジュール・型定義",
      description: "型の import / export と、.d.ts による型の宣言。",
      items: [
        item(
          "import-type",
          "型だけを import",
          'import type { User } from "./types";',
          "型としてだけ使うものを読み込む。変換後の JavaScript からは消える。",
          "verbatimModuleSyntax を有効にすると、型だけの import にはこの書き方が必須になる。",
          "info",
        ),
        item(
          "inline-type-import",
          "値と型をまとめて import",
          'import { type User, saveUser } from "./user";',
          "1つの import の中で、型だけのものに type を付ける。",
        ),
        item(
          "export-type",
          "型を再 export",
          'export type { User } from "./types";',
          "型だけを、別のファイルからそのまま公開する。",
        ),
        item(
          "declaration-file",
          "型定義ファイル（.d.ts）",
          "declare const APP_VERSION: string;",
          ".d.ts ファイルで、実装を持たない値や型を宣言する。",
          "ビルド時に埋め込まれる定数など、TypeScript が知らない値に型を付ける。",
        ),
        item(
          "declare-module",
          "ファイルの import に型を付ける",
          'declare module "*.svg" { const src: string; export default src; }',
          "画像などのファイルを import したときの型を宣言する。",
        ),
        item(
          "declare-global",
          "グローバルに型を足す",
          "declare global { interface Window { analytics: Analytics; } }",
          "window などのグローバルなオブジェクトに型を追加する。",
          "import / export の無いファイルでは使えないので、必要なら export {} を書き足す。",
        ),
        item(
          "module-augmentation",
          "ライブラリの型を拡張",
          'declare module "express" { interface Request { user?: User; } }',
          "既存のライブラリの型定義に、プロパティを追加する。",
        ),
        item(
          "types-package",
          "型定義パッケージを入れる",
          "npm install -D @types/node",
          "型定義を含まないライブラリの型を、@types パッケージから追加する。",
          'TypeScript 6.0 から tsconfig の types の既定値が [] になったので、"types": ["node"] も書く。',
        ),
      ],
    },
    // tsconfig の主な設定。6.0 で変わった既定値（strict・types など）を note で補う。
    {
      id: "tsconfig",
      title: "tsconfig.json",
      description: "コンパイラーの設定。6.0 で既定値が変わったものは明示しておくと確実。",
      items: [
        item(
          "tsconfig-example",
          "バンドラー向けの例",
          `{
  "compilerOptions": {
    "target": "es2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "skipLibCheck": true,
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}`,
          "Vite などのバンドラーがビルドし、TypeScript は型チェックだけを行う構成。",
        ),
        item(
          "strict",
          "厳格モード",
          '"strict": true',
          "null のチェックや暗黙の any の禁止など、厳しい検査をまとめて有効にする。",
          "TypeScript 6.0 から既定で true。",
          "info",
        ),
        item(
          "no-unchecked-indexed-access",
          "インデックスアクセスを検査",
          '"noUncheckedIndexedAccess": true',
          "配列やインデックスシグネチャから取り出した値を T | undefined として扱う。",
          "strict には含まれないので、別に指定する。",
          "info",
        ),
        item(
          "exact-optional-property-types",
          "省略可能と undefined を区別",
          '"exactOptionalPropertyTypes": true',
          "省略可能なプロパティに、undefined を明示的に代入することを禁止する。",
        ),
        item(
          "target",
          "出力する JavaScript の版",
          '"target": "es2022"',
          "変換後の JavaScript が使う文法の版を指定する。",
          "6.0 から既定は最新の ES。es5 は 7.0 で使えなくなった。",
        ),
        item(
          "module-bundler",
          "バンドラー向けの解決方法",
          '"module": "esnext", "moduleResolution": "bundler"',
          "Vite などのバンドラーで読み込む前提で、import を解決する。",
          "node / node10 と classic は 7.0 で使えなくなった。",
        ),
        item(
          "module-nodenext",
          "Node.js 向けの解決方法",
          '"module": "nodenext"',
          "Node.js で実行する前提で、package.json の type に合わせて import を解決する。",
          "相対パスの import には拡張子まで書く。",
        ),
        item(
          "types-option",
          "読み込む型定義",
          '"types": ["node"]',
          "自動で読み込む @types パッケージを指定する。",
          "6.0 から既定値が [] になり、書かないと @types/node なども読み込まれない。",
          "warning",
        ),
        item(
          "paths",
          "import の別名",
          '"paths": { "@/*": ["./src/*"] }',
          "import のパスに別名を付ける。",
          "baseUrl は 6.0 で非推奨、7.0 で削除された。バンドラー側にも同じ別名の設定が要る。",
        ),
        item(
          "no-emit",
          "型チェックだけ行う",
          '"noEmit": true',
          "JavaScript を出力せず、型チェックだけを行う。",
          "変換をバンドラーや Node.js に任せる構成で使う。",
        ),
        item(
          "verbatim-module-syntax",
          "import type を必須に",
          '"verbatimModuleSyntax": true',
          "型だけの import に import type を書くことを必須にする。",
          "変換ツールが、型の import を安全に取り除けるようになる。",
        ),
        item(
          "erasable-syntax-only",
          "消すだけで動く構文に限る",
          '"erasableSyntaxOnly": true',
          "enum やパラメータープロパティなど、型を消すだけでは JavaScript にならない構文を禁止する。",
          "Node.js で .ts を直接実行するときに有効にする。TypeScript 5.8 以降。",
        ),
        item(
          "extends-config",
          "設定を引き継ぐ",
          '"extends": "./tsconfig.base.json"',
          "共通の設定を、別の tsconfig から引き継ぐ。",
          "最終的な設定は tsc --showConfig で確かめられる。",
        ),
      ],
    },
    // コンパイラーの使い方。7.0 でネイティブ版になったが、コマンド名は tsc のまま。
    {
      id: "tsc",
      title: "tsc・実行",
      description: "型チェックとビルドのコマンド、.ts ファイルの直接実行。",
      items: [
        item(
          "install",
          "インストール",
          "npm install -D typescript",
          "プロジェクトに TypeScript を追加する。",
          "7.0 から Go で書き直されたネイティブ版になったが、コマンド名は tsc のまま。",
        ),
        item("tsc-init", "設定ファイルを作る", "npx tsc --init", "tsconfig.json のひな形を作る。"),
        item(
          "tsc-no-emit",
          "型チェックだけ実行",
          "npx tsc --noEmit",
          "JavaScript を出力せずに、型エラーだけを確かめる。",
          "CI やコミット前の確認に使う。",
          "info",
        ),
        item(
          "tsc-watch",
          "変更を監視して再チェック",
          "npx tsc --noEmit --watch",
          "ファイルの変更を監視し、そのたびに型チェックをやり直す。",
        ),
        item(
          "tsc-project",
          "設定ファイルを指定",
          "npx tsc -p tsconfig.app.json",
          "使う tsconfig を指定して実行する。",
        ),
        item(
          "tsc-build",
          "プロジェクト参照をビルド",
          "npx tsc -b",
          "tsconfig の references をたどり、依存する順にまとめてビルドする。",
          "変更の無いプロジェクトは飛ばされる。",
        ),
        item(
          "tsc-show-config",
          "最終的な設定を表示",
          "npx tsc --showConfig",
          "extends などを反映した、実際に使われる設定を表示する。",
        ),
        item(
          "emit-declarations",
          "型定義だけを出力",
          "npx tsc --declaration --emitDeclarationOnly",
          "ライブラリの公開用に、.d.ts ファイルだけを出力する。",
        ),
        item(
          "node-type-stripping",
          "Node.js で直接実行",
          "node src/main.ts",
          "Node.js が型注釈を取り除いて、.ts ファイルをそのまま実行する。",
          "Node.js 22.18 / 23.6 以降。型チェックは行わず、enum などは使えない。",
        ),
      ],
    },
  ],
};
