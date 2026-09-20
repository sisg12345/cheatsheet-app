/**
 * Claude Codeチートシートのデータ。
 *
 * 表示側（components）はこの構造だけを見るので、ここに書いた順序がそのまま
 * 目次とページの並び順になる。項目は必ず helpers.ts の item() で生成する。
 *
 *   item(id, label, syntax, description, note?, status?, keywords?)
 *
 * - id はシート内で一意。目次のアンカー（#id）とReactのkeyに使われる
 * - status は normal / info / warning / danger。省略時は normal
 * - 復元が難しい操作には danger、秘密情報や外部入力に関わる注意には warning を付ける。
 *   バッジの色が唯一の警告表示になるため、付け忘れると危険が伝わらない
 * - コマンドを持たない実践項目は syntax を undefined にする（コード欄は — になる）
 * - 複数行の設定例は syntax にそのまま書く。CodeBlock が改行を保ったまま表示・コピーする
 * - keywords は検索用の別名。全角/半角・大文字小文字は normalizeSearch が吸収する
 * - 内容は公式ドキュメント（2026-09-06確認）に基づく。Claude Code は更新が速いので、
 *   手元の claude --help と食い違ったら公式ドキュメントに合わせて直し、updatedAt も更新する
 * - セクション・項目を増減したら summary.ts の件数も直す（tests/unit/registry.test.ts が突き合わせる）
 */
import { item } from "../helpers";
import type { CheatSheetContent } from "../types";

export const claudeCodeContent: CheatSheetContent = {
  id: "claude-code-reference",
  updatedAt: "2026-09-16",
  sources: [
    { label: "Claude Code公式ドキュメント", url: "https://code.claude.com/docs/en/overview" },
  ],
  sections: [
    // 導入から認証・診断まで。最初に一度だけ行う操作を並べる。
    {
      id: "start",
      title: "はじめる",
      description: "インストール、認証、基本診断。",
      items: [
        item(
          "install",
          "インストール",
          "curl -fsSL https://claude.ai/install.sh | bash",
          "macOS / Linux / WSL向けの推奨ネイティブインストーラー。",
          undefined,
          "info",
          ["setup", "quickstart"],
        ),
        item(
          "launch-in-project",
          "プロジェクトで起動",
          "cd /path/to/project\nclaude",
          "プロジェクトのディレクトリへ移動してから起動する。",
        ),
        item(
          "auth-login",
          "サインイン",
          "claude auth login",
          "Anthropicアカウントで認証する。",
          undefined,
          undefined,
          ["ログイン"],
        ),
        item(
          "auth-login-console",
          "API課金で認証",
          "claude auth login --console",
          "Consoleアカウントを使う。",
        ),
        item(
          "auth-status",
          "認証状態",
          "claude auth status",
          "認証状態をJSONで表示する。",
          "--text を付けると人向けの表示になる。",
        ),
        item("update", "更新", "claude update", "最新バージョンへ更新する。"),
        item(
          "install-stable",
          "安定版を再導入",
          "claude install stable",
          "ネイティブ版を再インストールする。",
        ),
        item("doctor", "診断", "claude doctor", "インストールと設定を読み取り専用で検査する。"),
        item(
          "cli-help",
          "ヘルプ",
          "claude --help",
          "手元のバージョンで利用できる全オプションを表示する。",
          undefined,
          undefined,
          ["version"],
        ),
      ],
    },
    // 起動のしかた。対話・単発・再開の3系統を並べる。
    {
      id: "cli",
      title: "CLIの基本",
      description: "対話セッション、単発実行、会話の再開。",
      items: [
        item(
          "interactive-session",
          "対話セッション",
          "claude",
          "現在のディレクトリで開始する。",
          undefined,
          undefined,
          ["起動"],
        ),
        item(
          "initial-prompt",
          "最初の依頼付き",
          'claude "このリポジトリを説明して"',
          "初期プロンプトを渡して開始する。",
        ),
        item(
          "print-mode",
          "単発実行",
          'claude -p "テスト失敗を要約して"',
          "結果を出力して終了する。",
          "スクリプト向け。",
          undefined,
          ["print", "headless", "非対話"],
        ),
        item(
          "pipe-stdin",
          "標準入力を解析",
          'npm test 2>&1 | claude -p "原因を分析して"',
          "ログや差分をパイプで渡す。",
          undefined,
          undefined,
          ["pipe", "stdin"],
        ),
        item(
          "continue",
          "直近を継続",
          "claude -c",
          "現在のディレクトリの直近の会話を続ける。",
          undefined,
          undefined,
          ["continue"],
        ),
        item(
          "resume-session",
          "指定会話を再開",
          'claude -r "<session>"',
          "セッションIDまたは名前で再開する。",
          undefined,
          undefined,
          ["resume"],
        ),
        item(
          "resume-picker",
          "会話を選択",
          "claude --resume",
          "対話的にセッションを選んで再開する。",
        ),
        item(
          "add-dir",
          "別ディレクトリ追加",
          "claude --add-dir ../shared",
          "追加の作業ディレクトリへアクセスする。",
        ),
      ],
    },
    // 起動時に付けるフラグ。そのセッションだけに効く。
    {
      id: "flags",
      title: "主要フラグ",
      description: "セッション単位で挙動を制御する。",
      items: [
        item("model-flag", "モデル指定", "--model <model>", "そのセッションのモデルを選ぶ。"),
        item(
          "effort-flag",
          "思考量指定",
          "--effort low|medium|high|max",
          "対応モデルで推論努力を調整する。",
        ),
        item(
          "permission-mode-flag",
          "権限モード",
          "--permission-mode plan",
          "まず読み取りと計画に限定する。",
        ),
        item(
          "allowed-tools-flag",
          "ツールを許可",
          '--allowedTools "Read" "Bash(npm test *)"',
          "使える操作を事前に許可する。",
        ),
        item(
          "disallowed-tools-flag",
          "ツールを拒否",
          '--disallowedTools "Bash(git push *)"',
          "危険・不要な操作を制限する。",
        ),
        item(
          "output-format-flag",
          "出力形式",
          "--output-format text|json|stream-json",
          "-p で機械処理しやすくする。",
        ),
        item("json-schema-flag", "JSON Schema", "--json-schema '{...}'", "構造化出力を検証する。"),
        item(
          "append-system-prompt-flag",
          "追加指示",
          '--append-system-prompt "..."',
          "既定の指示を保ったまま追記する。",
          undefined,
          undefined,
          ["system prompt"],
        ),
        item(
          "max-budget-flag",
          "予算上限",
          "--max-budget-usd 2.00",
          "-p 実行のAPI費用を制限する。",
        ),
        item("verbose-debug-flag", "詳細ログ", "--verbose / --debug", "調査時のみ有効化する。"),
      ],
    },
    // セッション中に入力するスラッシュコマンド。label は用途、description は使いどころ。
    {
      id: "interactive",
      title: "よく使う対話コマンド",
      description: "Claude Code内で入力するスラッシュコマンド。",
      items: [
        item("slash-help", "利用可能なコマンドを確認", "/help", "バージョン差も手元で確認する。"),
        item("slash-clear", "会話履歴をクリア", "/clear", "別タスクへ切り替えるときに使う。"),
        item(
          "slash-compact",
          "会話を要約してコンテキストを節約",
          "/compact [指示]",
          "長いセッションを続けるときに使う。",
        ),
        item(
          "slash-context",
          "コンテキスト使用状況を可視化",
          "/context",
          "CLAUDE.mdなどの読み込みを確認する。",
        ),
        item("slash-cost", "トークンとコストを表示", "/cost", "API利用量を確認する。"),
        item("slash-model", "モデルを表示・変更", "/model", "速度と能力を切り替える。"),
        item("slash-effort", "推論努力を変更", "/effort", "タスクの難度に合わせる。"),
        item("slash-permissions", "権限ルールを確認・変更", "/permissions", "許可範囲を見直す。"),
        item(
          "slash-status",
          "バージョン、設定元、接続を確認",
          "/status",
          "設定が効かないときに使う。",
        ),
        item("slash-config", "設定画面を開く", "/config", "テーマや表示、既定値を変更する。"),
        item("slash-init", "CLAUDE.mdのひな形を生成", "/init", "プロジェクト導入時に使う。"),
        item("slash-mcp", "MCP接続状態を確認", "/mcp", "認証・接続のトラブル時に使う。"),
        item("slash-hooks", "Hook設定を閲覧", "/hooks", "イベントと実行内容を確認する。"),
        item("slash-doctor", "対話型の環境診断", "/doctor", "問題の確認と修正に使う。"),
      ],
    },
    // 依頼文の型。syntax に依頼例をそのまま置き、コピーして使えるようにする。
    {
      id: "prompt",
      title: "プロンプトの型",
      description: "対象・制約・完了条件を具体的にする。",
      items: [
        item(
          "prompt-elements",
          "依頼の4要素",
          "対象 → 目的 → 制約 → 検証",
          "どの機能・ファイルで何を達成するか、触らない範囲・方針、テスト・完了条件まで伝える。",
          undefined,
          "info",
          ["書き方"],
        ),
        item(
          "prompt-investigate",
          "調査",
          "認証処理の流れを追い、主要ファイルとデータフローを説明して。変更はしない",
          "読み取り専用であることを明示する。",
        ),
        item(
          "prompt-implement",
          "実装",
          "#123を実装。既存パターンに従い、関連テストを追加して実行して",
          "Issue・規約・検証を含める。",
          undefined,
          undefined,
          ["implement"],
        ),
        item(
          "prompt-bugfix",
          "バグ修正",
          "この失敗を再現し、根本原因を説明してから最小修正。回帰テストも追加",
          "再現→原因→修正→検証の順に進める。",
          undefined,
          undefined,
          ["bug", "debug"],
        ),
        item(
          "prompt-refactor",
          "リファクタ",
          "外部仕様を変えずに重複を除去。公開APIと既存テストは維持",
          "不変条件を指定する。",
          undefined,
          undefined,
          ["refactor"],
        ),
        item(
          "prompt-review",
          "レビュー",
          "mainとの差分をレビュー。バグ・セキュリティ・テスト不足を重要度順に、ファイル位置付きで",
          "観点と出力形式を指定する。",
          undefined,
          undefined,
          ["review"],
        ),
        item(
          "prompt-plan",
          "計画",
          "まず関連コードを調査し、変更ファイルとリスクを含む計画を提示。承認まで編集しない",
          "大きい変更は計画を先に立てる。",
          undefined,
          undefined,
          ["plan"],
        ),
      ],
    },
    // 渡す情報を絞る操作。/context で確認し、/compact と /clear で整理する。
    {
      id: "context",
      title: "コンテキスト管理",
      description: "必要な情報だけを渡し、長い作業を安定させる。",
      items: [
        item(
          "file-mention",
          "ファイル参照",
          "@src/auth/session.ts を説明して",
          "@ で対象を明示する。",
          undefined,
          undefined,
          ["mention", "メンション"],
        ),
        item(
          "multi-mention",
          "複数対象",
          "@src/api/ と @tests/api/ を比較して",
          "関係する範囲を限定する。",
        ),
        item(
          "pipe-diff",
          "差分を渡す",
          'git diff | claude -p "レビューして"',
          "必要な差分だけを単発で解析する。",
        ),
        item(
          "context-usage",
          "使用量確認",
          "/context",
          "何がコンテキストを占めているか確認する。",
          undefined,
          undefined,
          ["tokens", "トークン"],
        ),
        item(
          "compact-with-focus",
          "要約継続",
          "/compact 実装判断と未完了項目を優先",
          "残したい情報を指示して要約する。",
        ),
        item("context-clear", "新しい作業", "/clear", "無関係な履歴を持ち越さない。"),
      ],
    },
    // プロジェクト指示のファイル。置き場所ごとに効く範囲が違う。
    {
      id: "memory",
      title: "CLAUDE.md",
      description: "毎回伝えたいプロジェクト指示をバージョン管理する。",
      items: [
        item(
          "memory-example",
          "CLAUDE.mdの例",
          `# Project guide

## Commands
- Install: npm ci
- Check: npm run lint && npm test
- Build: npm run build

## Conventions
- TypeScript strict modeを維持する
- UIはCSS Modulesを使う
- 既存の公開APIを変更する前に相談する
- 修正には回帰テストを追加する

## Architecture
- 機能ロジックは src/features/ に置く
- APIレスポンスは境界で検証する`,
          "ビルド・テスト・規約・アーキテクチャ判断など、リポジトリ利用者に共通する内容を書く。",
        ),
        item("memory-init", "ひな形生成", "/init", "コードベースを解析して提案する。"),
        item("memory-context", "読込確認", "/context", "Memory files欄を確認する。"),
        item("memory-user", "ユーザー共通", "~/.claude/CLAUDE.md", "個人の全プロジェクト向け。"),
        item(
          "memory-project",
          "共有プロジェクト",
          "./CLAUDE.md",
          "Gitで共有するチーム規約。",
          "./.claude/CLAUDE.md に置いてもよい。",
          undefined,
          ["memory", "メモリ"],
        ),
        item(
          "memory-import",
          "分割・参照",
          "@path/to/instructions.md",
          "CLAUDE.mdから別ファイルをインポートする。",
          undefined,
          undefined,
          ["import"],
        ),
      ],
    },
    // 権限と設定ファイル。共有（コミットする）と個人（しない）を分けて置く。
    {
      id: "permissions",
      title: "権限と設定",
      description: "最小権限で、共有設定と個人設定を分離する。",
      items: [
        item(
          "settings-example",
          "権限設定の例",
          `{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": ["Bash(npm run lint)", "Bash(npm test *)"],
    "ask": ["Bash(git push *)"],
    "deny": ["Read(./.env)", "Read(./.env.*)"]
  }
}`,
          "許可・確認・拒否する操作をsettings.jsonに書く。",
        ),
        item(
          "settings-user",
          "ユーザー",
          "~/.claude/settings.json",
          "自分の全プロジェクトに効く。",
        ),
        item(
          "settings-project",
          "プロジェクト共有",
          ".claude/settings.json",
          "Gitで共有するチーム設定。",
        ),
        item(
          "settings-local",
          "プロジェクト個人",
          ".claude/settings.local.json",
          "コミットしない個人設定。",
        ),
        item(
          "settings-flag",
          "一時設定",
          `claude --settings '{"model":"..."}'`,
          "そのセッションだけ上書きする。",
        ),
        item("settings-status", "設定確認", "/status", "読み込んだ設定元を確認する。"),
        item(
          "permission-rules",
          "権限ルール",
          "allow / ask / deny",
          "許可・確認・拒否の3種類で操作を制御する。",
          "denyを最優先で設計する。",
          "warning",
        ),
        item(
          "secrets",
          "秘密情報を書かない",
          '"deny": ["Read(./.env)", "Read(./.env.*)"]',
          "APIキーや秘密情報をCLAUDE.md、プロンプト、共有設定へ書かない。",
          ".env などは必要に応じて読み取り拒否にする。",
          "warning",
          ["secrets", "apiキー", "security"],
        ),
      ],
    },
    // 外部ツールの接続。取得した外部コンテンツは信頼境界の外にあることを最後に明示する。
    {
      id: "mcp",
      title: "MCP",
      description: "外部ツールやデータソースを接続する。",
      items: [
        item(
          "mcp-add-http",
          "HTTPサーバー追加",
          "claude mcp add --transport http <name> <url>",
          "リモート接続の推奨方式。",
          undefined,
          "info",
          ["remote", "server"],
        ),
        item(
          "mcp-add-stdio",
          "stdio追加",
          "claude mcp add --transport stdio <name> -- <command> [args]",
          "-- 以降がサーバーを起動するコマンドになる。",
        ),
        item(
          "mcp-add-project",
          "プロジェクト共有",
          "claude mcp add --scope project ...",
          ".mcp.json に保存する。",
        ),
        item("mcp-list", "一覧", "claude mcp list", "設定と接続状態を確認する。"),
        item("mcp-get", "詳細", "claude mcp get <name>", "対象サーバーの設定を確認する。"),
        item(
          "mcp-login",
          "OAuth認証",
          "claude mcp login <name>",
          "対応するリモートサーバーにログインする。",
        ),
        item("mcp-remove", "削除", "claude mcp remove <name>", "必要なら --scope も指定する。"),
        item("mcp-session", "セッション内確認", "/mcp", "接続、認証、利用可能なツールを確認する。"),
        item(
          "mcp-trust",
          "信頼できるサーバーだけを接続",
          undefined,
          "外部コンテンツを取得するMCPはプロンプトインジェクションの入口になり得る。",
          "接続するサーバーの権限も絞る。",
          "warning",
          ["security", "prompt injection"],
        ),
      ],
    },
    // 手順（Skills）・役割（Subagents）・配布単位（Plugins）の順に並べる。
    {
      id: "extend",
      title: "Skills・Subagents・Plugins",
      description: "繰り返す手順と専門タスクを再利用する。",
      items: [
        item(
          "skill-project",
          "プロジェクトSkill",
          ".claude/skills/<name>/SKILL.md",
          "チームで共有する手順・ワークフロー。",
          undefined,
          undefined,
          ["skills"],
        ),
        item(
          "skill-user",
          "個人Skill",
          "~/.claude/skills/<name>/SKILL.md",
          "全プロジェクトで使う個人の手順。",
        ),
        item(
          "skill-run",
          "Skill実行",
          "/<skill-name> [args]",
          "必要なときだけ詳細な指示を読み込む。",
        ),
        item(
          "agent-project",
          "プロジェクトSubagent",
          ".claude/agents/<name>.md",
          "専門の役割、モデル、ツールを定義する。",
          undefined,
          undefined,
          ["subagents"],
        ),
        item(
          "agent-user",
          "個人Subagent",
          "~/.claude/agents/<name>.md",
          "全プロジェクトで利用する。",
        ),
        item("agents-list", "Agent一覧", "/agents", "利用できるAgentを確認する。"),
        item("plugin-manage", "Plugin管理", "/plugin", "対話型の管理画面を開く。"),
        item(
          "plugin-install",
          "Plugin導入",
          "claude plugin install <plugin>@<marketplace>",
          "Skill・Hook・MCPなどをまとめて追加する。",
          undefined,
          undefined,
          ["plugins"],
        ),
      ],
    },
    // 毎回必ず実行したい処理をイベントに結び付ける。label はタイミング、syntax はイベント名。
    {
      id: "hooks",
      title: "Hooks",
      description: "決定的に実行したい検査・整形・通知を自動化する。",
      items: [
        item(
          "hooks-example",
          "編集後に整形する例",
          `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "npm run format" }
        ]
      }
    ]
  }
}`,
          "EditかWriteが成功した後に npm run format を実行する。",
          undefined,
          undefined,
          ["formatter", "settings.json"],
        ),
        item(
          "hook-pre-tool-use",
          "ツール実行前",
          "PreToolUse",
          "危険なコマンドの拒否や入力の検査に使う。",
        ),
        item("hook-post-tool-use", "ツール成功後", "PostToolUse", "Format、Lint、監査ログに使う。"),
        item("hook-notification", "通知発生時", "Notification", "入力待ちをOSで通知する。"),
        item("hook-stop", "Claudeが応答を終えるとき", "Stop", "完了条件を検査する。"),
        item(
          "hook-session-start",
          "セッション開始・再開時",
          "SessionStart",
          "環境情報や動的なコンテキストを渡す。",
        ),
        item("hooks-check", "設定確認", "/hooks", "イベント、matcher、出所を閲覧する。"),
      ],
    },
    // 非対話モード（-p）をスクリプトやCIに組み込む。ツールと費用を絞るのが前提。
    {
      id: "automation",
      title: "自動化・CI",
      description: "非対話モードを安全にスクリプトへ組み込む。",
      items: [
        item(
          "ci-review-example",
          "差分をJSONでレビュー",
          `git diff origin/main...HEAD | claude -p \\
  "重大なバグとセキュリティ問題だけをレビュー" \\
  --output-format json \\
  --allowedTools "Read" "Grep" "Glob" \\
  --max-budget-usd 1.00`,
          "ツールを読み取り系に限り、費用の上限を付けて実行する。",
          undefined,
          undefined,
          ["ci", "github actions", "headless"],
        ),
        item(
          "auto-text",
          "テキスト出力",
          'claude -p "..."',
          "最小の単発実行。",
          undefined,
          undefined,
          ["script"],
        ),
        item(
          "auto-json",
          "JSON出力",
          "--output-format json",
          "メタデータを含む単一のJSONを出力する。",
        ),
        item(
          "auto-stream",
          "ストリーム",
          "--output-format stream-json",
          "イベントを逐次処理する。",
        ),
        item("auto-schema", "構造を固定", "--json-schema '{...}'", "後続の処理へ安全に渡す。"),
        item(
          "auto-tools",
          "ツール制限",
          '--allowedTools "Read" "Grep"',
          "読み取り専用であることを明示する。",
          undefined,
          "info",
        ),
        item("auto-budget", "費用制限", "--max-budget-usd <amount>", "API利用の上限を設定する。"),
      ],
    },
    // 実行前に境界を決め、完了後に確かめる。コマンドを持たない実践項目が中心。
    {
      id: "safety",
      title: "安全運用",
      description: "実行前の境界と、完了後の確認。",
      items: [
        item(
          "work-scope",
          "作業範囲",
          undefined,
          "対象ディレクトリと触らない領域を明示する。",
          "意図しない変更を防ぐ。",
        ),
        item(
          "destructive-ops",
          "破壊操作",
          undefined,
          "rm、force push、DB変更は都度確認する。",
          "復元が難しい。",
          "danger",
          ["destructive"],
        ),
        item(
          "protect-secrets",
          "秘密情報",
          undefined,
          ".env や鍵を permissions.deny で保護する。",
          "プロンプトやログへの流出を抑える。",
        ),
        item(
          "external-data",
          "外部データ",
          undefined,
          "MCP・Webの内容を命令ではなくデータとして扱う。",
          "プロンプトインジェクション対策。",
          undefined,
          ["prompt injection"],
        ),
        item(
          "diff-check",
          "差分確認",
          "git diff --check && git diff",
          "不要な変更と空白エラーを確認する。",
        ),
        item(
          "verification",
          "検証",
          undefined,
          "lint、型チェック、テスト、ビルドを実行する。",
          "「実装した」と「動く」を分けない。",
        ),
        item(
          "commit-policy",
          "コミット",
          undefined,
          "明示的に依頼した場合だけ作成・pushする。",
          "共有履歴の変更はユーザーが判断する。",
        ),
      ],
    },
    // 症状から引く。label は症状、syntax は最初に試すコマンド、description は確認点。
    {
      id: "trouble",
      title: "トラブル対応",
      description: "まず状態を観測し、問題の層を切り分ける。",
      items: [
        item(
          "trouble-not-found",
          "コマンドがない",
          "claude doctor",
          "PATH、導入方式、バージョンを確認する。",
          undefined,
          undefined,
          ["command not found"],
        ),
        item(
          "trouble-auth",
          "認証できない",
          "claude auth status --text",
          "アカウント、SSO、ネットワークを確認する。",
          undefined,
          undefined,
          ["login", "ログイン"],
        ),
        item(
          "trouble-settings",
          "設定が効かない",
          "/status",
          "設定元、優先順位、JSONのエラーを確認する。",
        ),
        item(
          "trouble-mcp",
          "MCP接続失敗",
          "claude mcp get <name>",
          "URL、transport、環境変数、認証を確認する。",
        ),
        item(
          "trouble-context",
          "文脈を見失う",
          "/context → /compact",
          "大きいログや不要な履歴がないか確認する。",
        ),
        item(
          "trouble-slow",
          "挙動が重い",
          undefined,
          "対象範囲を絞り、新しいセッションで再現する。",
          "巨大ファイル、探索範囲、MCPを確認する。",
          undefined,
          ["high cpu", "hang"],
        ),
        item(
          "trouble-debug",
          "詳細調査",
          "claude --debug",
          "詳細なログを出して原因を調べる。",
          "秘密情報を含むログの共有に注意する。",
          "warning",
        ),
        item(
          "trouble-version",
          "仕様差",
          "claude --help",
          "手元の版と最新の公式ドキュメントを比較する。",
        ),
      ],
    },
  ],
};
