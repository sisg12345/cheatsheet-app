/**
 * npmチートシートのデータ。
 *
 * 表示側（components）はこの構造だけを見るので、ここに書いた順序がそのまま
 * 目次とページの並び順になる。項目は必ず helpers.ts の item() で生成する。
 *
 *   item(id, label, syntax, description, note?, status?, keywords?)
 *
 * - id はシート内で一意。目次のアンカー（#id）とReactのkeyに使われる
 * - status は normal / info / warning / danger。省略時は normal
 * - 公開済みのパッケージを消す操作には danger、依存関係の不整合を隠したり
 *   大きな変更を自動で入れたりする操作には warning、推奨の操作には info を付ける。
 *   バッジの色が唯一の警告表示になるため、付け忘れると危険が伝わらない
 * - 対象は npm 12（latest。2026-07 リリース）。npm 11 から変わった点
 *   （依存関係の install スクリプトが既定で止まる、adduser の削除など）は note に書く。
 *   バージョンに依存する記述は GitHub のリリースノートと公式ドキュメントで確認済み（2026-09-19）
 * - keywords は検索用の別名。全角/半角・大文字小文字は normalizeSearch が吸収する
 * - 内容を直したら updatedAt も更新する
 * - セクション・項目を増減したら summary.ts の件数も直す（tests/unit/registry.test.ts が突き合わせる）
 */
import { item } from "../helpers";
import type { CheatSheetContent } from "../types";

export const npmContent: CheatSheetContent = {
  id: "npm-reference",
  updatedAt: "2026-09-19",
  sources: [
    { label: "npm CLI ドキュメント", url: "https://docs.npmjs.com/cli/" },
    { label: "npm CLI リリースノート", url: "https://github.com/npm/cli/releases" },
  ],
  sections: [
    // package.json の作成と、npm 自体の確認。
    {
      id: "basics",
      title: "はじめる・確認",
      description: "package.json を作り、npm の設定と環境を確認する。",
      items: [
        item(
          "npm-init",
          "package.json を作る",
          "npm init -y",
          "質問を省いて、既定値で package.json を作る。",
          "npm 12 から license の既定値は空になった。",
        ),
        item(
          "npm-version-check",
          "バージョン確認",
          "npm -v",
          "npm のバージョンを表示する。Node.js は node -v。",
        ),
        item("npm-help", "ヘルプ", "npm install -h", "コマンドの使い方を表示する。"),
        item(
          "npm-config",
          "設定を確認",
          "npm config list / npm config get registry",
          "今の設定と、パッケージを取得するレジストリを確認する。",
          "設定はプロジェクトの .npmrc や ~/.npmrc に書く。",
        ),
        item(
          "npm-pkg",
          "package.json を書き換える",
          'npm pkg set scripts.lint="eslint ."',
          "package.json の値をコマンドで設定する。get で読み、delete で消す。",
        ),
        item(
          "npm-doctor",
          "環境を診断",
          "npm doctor",
          "レジストリへの接続やキャッシュなど、npm の環境を検査する。",
        ),
      ],
    },
    // 依存関係の追加・削除・更新。CI では npm ci を使う。
    {
      id: "install",
      title: "インストール・更新",
      description: "依存関係の追加・削除・更新と、lock ファイルどおりの再現。",
      items: [
        item(
          "npm-install",
          "すべて入れる",
          "npm install",
          "package.json と lock ファイルに書かれた依存関係をすべて入れる。npm i と略せる。",
        ),
        item(
          "install-package",
          "追加する",
          "npm install react",
          "パッケージを dependencies に追加する。",
        ),
        item(
          "install-dev",
          "開発用に追加",
          "npm install -D vitest",
          "テストやビルドだけで使うパッケージを devDependencies に追加する。",
        ),
        item(
          "install-version",
          "バージョンを指定",
          "npm install react@19.2.0",
          "バージョンやタグ（@latest、@next）を指定して入れる。",
          "-E（--save-exact）を付けると、^ を付けずに固定の番号で記録する。",
        ),
        item(
          "npm-ci",
          "lock ファイルどおりに入れ直す",
          "npm ci",
          "node_modules を消してから、lock ファイルどおりに入れる。CI での再現に使う。",
          "package.json と lock ファイルが食い違っているとエラーになる。",
          "info",
        ),
        item(
          "uninstall",
          "削除",
          "npm uninstall lodash",
          "パッケージを削除し、package.json からも消す。",
        ),
        item(
          "outdated",
          "古いものを一覧",
          "npm outdated",
          "今のバージョン、範囲内で入れられる最新、公開されている最新を一覧する。",
        ),
        item(
          "update",
          "範囲内で更新",
          "npm update",
          "package.json のバージョン範囲の中で、最新に更新する。",
          "メジャーバージョンを上げるには、npm install pkg@latest で入れ直す。",
        ),
        item(
          "install-global",
          "グローバルに入れる",
          "npm install -g npm@latest",
          "どのディレクトリからでも使えるように、コマンドとして入れる。",
          "プロジェクトで使うツールは、グローバルではなく開発用の依存関係に入れる。",
        ),
        item(
          "legacy-peer-deps",
          "peer の衝突を無視",
          "npm install --legacy-peer-deps",
          "peerDependencies の衝突を無視してインストールする。",
          "依存関係の不整合を隠すだけなので、一時的な回避にとどめる。",
          "warning",
        ),
      ],
    },
    // package.json の scripts の実行。
    {
      id: "scripts",
      title: "スクリプト",
      description: "package.json の scripts に書いたコマンドを実行する。",
      items: [
        item(
          "run-script",
          "スクリプトを実行",
          "npm run build",
          "scripts に書いたコマンドを実行する。",
        ),
        item("run-list", "スクリプトの一覧", "npm run", "実行できるスクリプトを一覧する。"),
        item(
          "run-shortcuts",
          "短く書けるスクリプト",
          "npm test / npm start",
          "test と start は run を省いて実行できる。",
        ),
        item(
          "run-args",
          "引数を渡す",
          "npm run dev -- --port 3000",
          "-- の後ろに書いた引数を、スクリプトのコマンドにそのまま渡す。",
        ),
        item(
          "pre-post-scripts",
          "前後に自動で実行",
          '"prebuild": "npm run clean", "postbuild": "npm run size"',
          "pre と post を付けた名前のスクリプトは、本体の前後に自動で実行される。",
        ),
        item(
          "if-present",
          "あるときだけ実行",
          "npm run lint --if-present",
          "スクリプトが無くてもエラーにしない。",
        ),
      ],
    },
    // パッケージのコマンドを実行する。
    {
      id: "npx",
      title: "npx・exec",
      description: "パッケージのコマンドを、グローバルに入れずに実行する。",
      items: [
        item(
          "npx-remote",
          "一時的に取得して実行",
          "npx create-vite@latest my-app",
          "パッケージを取得して、そのコマンドを実行する。グローバルには残らない。",
          "初めて取得するパッケージは、実行してよいか確認が出る。",
        ),
        item(
          "npx-local",
          "プロジェクトのコマンドを実行",
          "npx eslint .",
          "node_modules/.bin にあるコマンドを実行する。",
          undefined,
          "info",
        ),
        item(
          "npm-exec",
          "npm exec",
          "npm exec -- eslint .",
          "npx と同じ動きを npm のコマンドとして書く。",
        ),
      ],
    },
    // バージョンの範囲の書き方（semver）とバージョンの上げ方。
    {
      id: "versions",
      title: "バージョン指定（semver）",
      description: "メジャー.マイナー.パッチの番号と、許可する範囲の書き方。",
      items: [
        item(
          "caret",
          "^（キャレット）",
          '"react": "^19.2.0"',
          "メジャーを固定し、マイナーとパッチの更新を許す（19.x.x）。npm install の既定。",
          "0.x のときはマイナーまで固定される（^0.3.0 は 0.3.x）。",
        ),
        item("tilde", "~（チルダ）", '"vite": "~8.1.0"', "パッチの更新だけを許す（8.1.x）。"),
        item("exact", "固定", '"typescript": "5.9.3"', "そのバージョンだけを使う。"),
        item("range", "範囲", '"node-fetch": ">=3.0.0 <4.0.0"', "比較の記号で範囲を書く。"),
        item(
          "latest-range",
          "常に最新",
          '"lodash": "*"',
          "どのバージョンでもよい、という指定。",
          "インストールのたびに大きな変更が入りうる。",
          "warning",
        ),
        item(
          "npm-version",
          "自分のバージョンを上げる",
          "npm version patch",
          "package.json のバージョンを上げ、Git のコミットとタグを作る（minor / major も指定できる）。",
        ),
        item(
          "npm-view",
          "公開されているバージョン",
          "npm view react versions",
          "パッケージの公開済みのバージョンを一覧する。version で最新だけを表示する。",
          "npm 12 から、--json を付けると結果は常に配列になる。",
        ),
      ],
    },
    // lock ファイル・脆弱性・install スクリプトの許可（npm 12）。
    {
      id: "security",
      title: "lock ファイル・セキュリティ",
      description: "依存関係の固定、脆弱性の確認、install スクリプトの許可。",
      items: [
        item(
          "lockfile",
          "lock ファイルをコミット",
          "package-lock.json",
          "実際に入ったバージョンを記録する。Git にコミットして、全員が同じものを使う。",
          undefined,
          "info",
        ),
        item("audit", "脆弱性を確認", "npm audit", "依存関係の既知の脆弱性を一覧する。"),
        item(
          "audit-fix",
          "脆弱性を直す",
          "npm audit fix",
          "バージョンの範囲の中で、直せるものを更新する。",
        ),
        item(
          "audit-fix-force",
          "範囲を超えて直す",
          "npm audit fix --force",
          "メジャーバージョンを上げてでも脆弱性を直す。",
          "互換性の無い変更が入ることがある。直したあとにテストを実行する。",
          "warning",
        ),
        item(
          "install-scripts-ls",
          "install スクリプトの確認",
          "npm install-scripts ls",
          "install スクリプトを持っていて、まだ許可するか決めていないパッケージを一覧する。",
          "npm 12 から、依存関係の install スクリプトは許可したものしか実行されない。",
          "info",
        ),
        item(
          "install-scripts-approve",
          "install スクリプトを許可",
          "npm install-scripts approve sharp",
          "パッケージの install スクリプトを許可し、package.json の allowScripts に記録する。",
          "既定ではバージョンまで固定して記録する。許可したあと npm rebuild で実行する。",
        ),
        item(
          "install-scripts-deny",
          "install スクリプトを拒否",
          "npm install-scripts deny telemetry-pkg",
          "install スクリプトを実行しないことを allowScripts に明示する。",
        ),
        item(
          "npm-explain",
          "なぜ入っているか",
          "npm explain semver",
          "パッケージがどの依存関係から入っているかを表示する（npm why でも同じ）。",
        ),
        item(
          "npm-ls",
          "依存関係のツリー",
          "npm ls react",
          "入っているバージョンと、依存関係のツリーの中の位置を表示する。",
        ),
        item(
          "overrides",
          "依存関係の依存を固定",
          '"overrides": { "semver": "7.7.2" }',
          "package.json で、間接的に入る依存関係のバージョンを上書きする。",
          "脆弱性のある古い版を避けたいときに使う。",
        ),
      ],
    },
    // モノレポで複数のパッケージをまとめて管理する。
    {
      id: "workspaces",
      title: "ワークスペース",
      description: "1つのリポジトリで、複数のパッケージをまとめて管理する。",
      items: [
        item(
          "workspaces-field",
          "ワークスペースを定義",
          '"workspaces": ["packages/*"]',
          "ルートの package.json に、含めるパッケージの場所を書く。",
          "npm install で、それぞれの依存関係がまとめて入る。",
        ),
        item(
          "install-workspace",
          "特定のパッケージに追加",
          "npm install lodash -w packages/web",
          "指定したワークスペースの依存関係に追加する。",
        ),
        item(
          "run-workspace",
          "特定のパッケージで実行",
          "npm run build -w packages/web",
          "指定したワークスペースのスクリプトを実行する。",
        ),
        item(
          "run-workspaces",
          "すべてのパッケージで実行",
          "npm run test --workspaces --if-present",
          "すべてのワークスペースで、スクリプトを順に実行する。",
        ),
      ],
    },
    // パッケージの公開とアカウント。unpublish は取り返しがつかない。
    {
      id: "publish",
      title: "公開",
      description: "パッケージをレジストリに公開する。",
      items: [
        item(
          "npm-login",
          "ログイン",
          "npm login",
          "レジストリにログインする。",
          "npm 12 で adduser は無くなった。アカウントの作成は npm の Web サイトで行う。",
        ),
        item(
          "npm-whoami",
          "ログイン中のユーザー",
          "npm whoami",
          "ログインしているユーザー名を表示する。",
        ),
        item(
          "files-field",
          "公開するファイル",
          '"files": ["dist"]',
          "package.json で、公開に含めるファイルを限定する。",
        ),
        item(
          "pack-dry-run",
          "公開される中身を確認",
          "npm pack --dry-run",
          "公開したときに含まれるファイルを、実際には作らずに一覧する。",
          ".env などの秘密情報が含まれていないかを確かめる。",
          "info",
        ),
        item(
          "npm-publish",
          "公開",
          "npm publish",
          "パッケージをレジストリに公開する。",
          "スコープ付き（@team/pkg）を公開で出すときは --access public を付ける。",
        ),
        item(
          "npm-deprecate",
          "非推奨にする",
          'npm deprecate my-pkg@1.0.0 "2.x を使ってください"',
          "インストール時に警告を出して、別のバージョンへ誘導する。",
        ),
        item(
          "npm-unpublish",
          "公開を取り消す",
          "npm unpublish my-pkg@1.0.0",
          "公開したバージョンをレジストリから削除する。",
          "使っている人のインストールが壊れる。同じ番号は二度と使えない。多くの場合は deprecate を使う。",
          "danger",
        ),
      ],
    },
    // うまく入らないときの確認。
    {
      id: "troubleshooting",
      title: "トラブル対応",
      description: "インストールがおかしいときの確認と、キャッシュの整理。",
      items: [
        item(
          "cache-verify",
          "キャッシュを検査",
          "npm cache verify",
          "キャッシュの整合性を確かめ、不要なデータを消す。",
        ),
        item(
          "reinstall",
          "入れ直す",
          "rm -rf node_modules && npm install",
          "node_modules を消して、lock ファイルどおりに入れ直す。",
          "package-lock.json まで消すと、入るバージョンが変わる。消すのは原因がわかっているときだけ。",
        ),
        item(
          "unknown-config",
          "設定やフラグの誤り",
          "npm config list",
          "設定の名前やフラグの綴りを確かめる。",
          "npm 12 から、知らない設定・フラグや略したフラグは警告ではなくエラーになる。",
        ),
        item(
          "rebuild",
          "ネイティブモジュールを作り直す",
          "npm rebuild",
          "Node.js を入れ替えたあとなどに、パッケージをビルドし直す。",
          "npm 12 では、許可した install スクリプトもこれで実行する。",
        ),
      ],
    },
  ],
};
