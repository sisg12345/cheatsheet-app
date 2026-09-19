/**
 * Bashチートシートのデータ。
 *
 * 表示側（components）はこの構造だけを見るので、ここに書いた順序がそのまま
 * 目次とページの並び順になる。項目は必ず helpers.ts の item() で生成する。
 *
 *   item(id, label, syntax, description, note?, status?, keywords?)
 *
 * - id はシート内で一意。目次のアンカー（#id）とReactのkeyに使われる
 * - status は normal / info / warning / danger。省略時は normal
 * - ファイルを上書きして中身を失う書き方には warning、推奨の書き方には info を付ける。
 *   バッジの色が唯一の警告表示になるため、付け忘れると危険が伝わらない
 * - 範囲はシェルの文法（スクリプト）と対話操作。個々のコマンドは Linux シートに任せる
 * - 対象は Bash 5 系。[[ ]] や配列など、sh（POSIX シェル）では使えない書き方も含む
 * - keywords は検索用の別名。全角/半角・大文字小文字は normalizeSearch が吸収する
 * - 内容を直したら updatedAt も更新する
 */
import { item } from "../helpers";
import type { CheatSheet } from "../types";

export const bashCheatSheet: CheatSheet = {
  id: "bash-reference",
  slug: "bash",
  title: "Bash チートシート",
  name: "Bash",
  description:
    "スクリプトの基本、変数と展開、条件分岐、繰り返し、関数、配列、リダイレクト、エラー処理、対話操作のショートカットまでをまとめたBashリファレンス。",
  eyebrow: "Shell",
  accent: "#7cb82f",
  keywords: ["bash", "shell", "シェル", "シェルスクリプト", "sh", "script"],
  updatedAt: "2026-09-19",
  sources: [
    { label: "GNU Bash リファレンスマニュアル", url: "https://www.gnu.org/software/bash/manual/" },
    { label: "ShellCheck", url: "https://www.shellcheck.net/" },
  ],
  sections: [
    // スクリプトの書き始めと実行、終了ステータス。set -euo pipefail を推奨として示す。
    {
      id: "basics",
      title: "スクリプトの基本",
      description: "書き始めの決まりごとと、実行・入出力・終了ステータス。",
      items: [
        item(
          "shebang",
          "シバン",
          "#!/usr/bin/env bash",
          "1行目に書き、このスクリプトを bash で実行させる。",
        ),
        item(
          "strict-mode",
          "エラーで止める設定",
          "set -euo pipefail",
          "失敗したコマンド・未定義の変数・パイプの途中の失敗で、スクリプトを止める。",
          "-e は if の条件の中など、止まらない場面もある。過信せずに戻り値を確かめる。",
          "info",
        ),
        item(
          "run-script",
          "スクリプトを実行",
          "chmod +x deploy.sh && ./deploy.sh",
          "実行権限を付けて実行する。bash deploy.sh でも実行できる。",
        ),
        item(
          "printf",
          "書式を指定して出力",
          'printf "%s: %d件\\n" "$name" "$count"',
          "書式を指定して出力する。echo より振る舞いが環境によって変わりにくい。",
        ),
        item(
          "read",
          "入力を受け取る",
          'read -rp "名前: " name',
          "プロンプトを表示して、入力を変数に入れる。",
          "-r でバックスラッシュをそのまま扱う。-s でパスワードのように表示しない。",
        ),
        item(
          "exit-status",
          "終了ステータス",
          "echo $?",
          "直前のコマンドの終了ステータスを表示する。0 が成功、それ以外が失敗。",
        ),
        item("exit", "終了する", "exit 1", "指定した終了ステータスでスクリプトを終える。"),
      ],
    },
    // 変数と展開。引用符で囲むことを最初に示す。
    {
      id: "variables",
      title: "変数・展開",
      description: "変数の代入と、値の加工・既定値・コマンドの結果の埋め込み。",
      items: [
        item(
          "assign",
          "代入",
          'name="Alice"',
          "変数に値を入れる。",
          "= の前後に空白を入れない（空白があるとコマンドとして解釈される）。",
        ),
        item(
          "quote-variables",
          "変数は二重引用符で囲む",
          'echo "$name"',
          "変数を使うときは二重引用符で囲む。",
          "囲まないと空白で分割され、* などがファイル名に展開される。",
          "info",
        ),
        item(
          "single-quotes",
          "展開させない",
          "echo '$HOME は展開されない'",
          "単一引用符の中は、変数もエスケープも展開されない。",
        ),
        item(
          "command-substitution",
          "コマンドの結果を使う",
          "today=$(date +%F)",
          "コマンドの出力を変数に入れる。",
        ),
        item("arithmetic", "計算", "count=$((count + 1))", "整数の計算をする。"),
        item(
          "default-value",
          "既定値",
          'echo "${name:-guest}"',
          "変数が未設定か空なら、既定値を使う。",
          ":= にすると、既定値を変数にも代入する。",
        ),
        item(
          "required-value",
          "必須の変数",
          ': "${API_KEY:?API_KEY を設定してください}"',
          "変数が未設定か空なら、メッセージを出して終了する。",
        ),
        item("length", "文字数", "${#name}", "変数の値の文字数。"),
        item(
          "trim-pattern",
          "前後を取り除く",
          '"${file%.txt}" / "${path##*/}"',
          "% は末尾、## は先頭から、パターンに一致する部分を取り除く（拡張子やディレクトリを外す）。",
          "# と % は最短一致、## と %% は最長一致。",
        ),
        item(
          "replace",
          "置換",
          '"${text//old/new}"',
          "一致する部分をすべて置き換える。/ が1つなら最初の1つだけ。",
        ),
        item(
          "export",
          "環境変数にする",
          'export PATH="$HOME/bin:$PATH"',
          "子のプロセスにも引き継がれる環境変数にする。",
        ),
        item(
          "special-params",
          "引数を受け取る",
          '"$1" "$2" / "$@" / $#',
          "1番目・2番目の引数、すべての引数、引数の数。",
          '"$@" と引用符で囲むと、空白を含む引数も1つずつ正しく渡せる。',
        ),
      ],
    },
    // 条件分岐。文字列・数値・ファイルの判定と、&& / || の短い書き方。
    {
      id: "conditions",
      title: "条件分岐",
      description: "[[ ]] と (( )) で判定し、if や case で分岐する。",
      items: [
        item(
          "if",
          "if 文",
          'if [[ -f "$file" ]]; then\n  echo "あります"\nelif [[ -d "$file" ]]; then\n  echo "ディレクトリです"\nelse\n  echo "ありません"\nfi',
          "条件ごとに処理を分ける。",
          "[[ ]] は Bash の条件式。空白を必ず入れる。",
        ),
        item(
          "string-test",
          "文字列の判定",
          '[[ "$a" == "$b" ]] / [[ -z "$s" ]] / [[ -n "$s" ]]',
          "等しいか、空か、空でないかを判定する。",
          "== の右側を引用符で囲まないとパターン（* など）として扱われる。",
        ),
        item(
          "number-test",
          "数値の比較",
          "(( count > 10 ))",
          "(( )) の中では、> や == で数値を比較できる。",
          "[[ ]] の中では -gt / -lt / -eq を使う。",
        ),
        item(
          "file-test",
          "ファイルの判定",
          '[[ -f "$f" ]] / [[ -d "$d" ]] / [[ -e "$p" ]]',
          "ファイルか、ディレクトリか、存在するかを判定する。",
          "-r 読める、-w 書ける、-x 実行できる、-s 空でない。",
        ),
        item(
          "regex-test",
          "正規表現で判定",
          "[[ $email =~ ^[^@]+@[^@]+$ ]]",
          "正規表現に一致するかを判定する。",
          "一致した部分は BASH_REMATCH 配列に入る。",
        ),
        item(
          "and-or",
          "成功・失敗で続ける",
          'mkdir -p dist && cp -r src/* dist/ || echo "失敗しました"',
          "&& は前が成功したとき、|| は前が失敗したときに次を実行する。",
        ),
        item(
          "case",
          "case 文",
          'case "$1" in\n  start) start_app ;;\n  stop) stop_app ;;\n  *) echo "使い方: $0 start|stop" ;;\nesac',
          "値のパターンごとに処理を分ける。",
        ),
      ],
    },
    // 繰り返し。ファイルを1行ずつ読む while read は定番の形。
    {
      id: "loops",
      title: "繰り返し",
      description: "リスト・範囲・条件で繰り返し、ファイルを1行ずつ読む。",
      items: [
        item(
          "for-list",
          "リストを繰り返す",
          'for file in *.txt; do\n  echo "$file"\ndone',
          "ファイル名などのリストを順に処理する。",
        ),
        item(
          "for-range",
          "範囲を繰り返す",
          'for i in {1..5}; do echo "$i"; done',
          "1 から 5 までの数で繰り返す。",
        ),
        item(
          "for-c-style",
          "回数を数えて繰り返す",
          'for ((i = 0; i < 10; i++)); do echo "$i"; done',
          "C 言語と同じ形で、カウンターを使って繰り返す。",
        ),
        item(
          "while-read",
          "ファイルを1行ずつ読む",
          'while IFS= read -r line; do\n  echo "$line"\ndone < users.txt',
          "ファイルの内容を1行ずつ変数に入れて処理する。",
          "IFS= と -r で、行頭の空白やバックスラッシュをそのまま読む。",
          "info",
        ),
        item(
          "while-loop",
          "条件が続くあいだ繰り返す",
          "while ! curl -fs http://localhost:3000 > /dev/null; do sleep 1; done",
          "条件が真のあいだ繰り返す（ここではサーバーが応答するまで待つ）。",
          "break で抜け、continue で次の周回へ進む。",
        ),
      ],
    },
    // 関数。値は echo で返し、return は終了ステータスだけ。
    {
      id: "functions",
      title: "関数",
      description: "処理に名前を付けてまとめる。",
      items: [
        item(
          "define-function",
          "関数を定義",
          'greet() {\n  local name="$1"\n  echo "Hello, $name"\n}',
          "関数を定義する。引数は $1、$2… で受け取る。",
        ),
        item(
          "call-function",
          "関数を呼ぶ",
          'greet "Alice"',
          "コマンドと同じように、引数を並べて呼ぶ。",
        ),
        item(
          "local",
          "関数内だけの変数",
          "local count=0",
          "関数の中だけで使う変数にする。",
          "付けないと、関数の外の同じ名前の変数を書き換えてしまう。",
          "info",
        ),
        item(
          "return-value",
          "値を返す",
          "result=$(get_version)",
          "関数の中で echo した内容を $(...) で受け取る。",
          "return は終了ステータス（0〜255）を返すだけで、文字列は返せない。",
        ),
      ],
    },
    // 配列と連想配列。"${arr[@]}" と引用符で囲む。
    {
      id: "arrays",
      title: "配列・連想配列",
      description: "複数の値をまとめて扱う。",
      items: [
        item(
          "array-define",
          "配列を作る",
          'fruits=("apple" "banana" "cherry")',
          "空白で区切って値を並べる。",
        ),
        item(
          "array-element",
          "要素を取り出す",
          '"${fruits[0]}"',
          "0 から数えた位置の要素を取り出す。",
        ),
        item(
          "array-all",
          "すべての要素",
          'for fruit in "${fruits[@]}"; do echo "$fruit"; done',
          "すべての要素を1つずつ取り出す。",
          '"${fruits[@]}" と引用符で囲むと、空白を含む要素も分割されない。',
        ),
        item("array-length", "要素の数", '"${#fruits[@]}"', "配列の要素の数。"),
        item("array-append", "要素を追加", 'fruits+=("durian")', "末尾に要素を追加する。"),
        item(
          "assoc-array",
          "連想配列",
          'declare -A ports=([web]=80 [db]=5432)\necho "${ports[web]}"',
          "文字列をキーにした配列を作る。",
          '"${!ports[@]}" でキーの一覧を取り出せる。',
        ),
      ],
    },
    // リダイレクトとパイプ。> は既存の中身を消すので warning。
    {
      id: "redirects",
      title: "リダイレクト・パイプ",
      description: "入出力の行き先を変え、コマンドをつなぐ。",
      items: [
        item(
          "redirect-out",
          "ファイルに書く（上書き）",
          "npm test > result.txt",
          "標準出力をファイルに書き込む。",
          "既存の中身は消える。set -o noclobber で上書きを防げる。",
          "warning",
        ),
        item(
          "redirect-append",
          "ファイルに追記",
          'echo "done" >> result.txt',
          "標準出力をファイルの末尾に追記する。",
        ),
        item(
          "redirect-err",
          "エラー出力をファイルに",
          "npm run build 2> error.log",
          "標準エラー出力だけをファイルに書く。",
        ),
        item(
          "redirect-both",
          "両方をまとめる",
          "npm run build > build.log 2>&1",
          "標準出力と標準エラー出力を、同じファイルに書く。",
          "順番が大事で、2>&1 を先に書くとエラーは画面に出たままになる。",
        ),
        item("dev-null", "出力を捨てる", "command > /dev/null 2>&1", "出力をすべて捨てる。"),
        item(
          "pipe",
          "パイプ",
          "cat access.log | grep 404 | wc -l",
          "前のコマンドの出力を、次のコマンドの入力にする。",
        ),
        item(
          "heredoc",
          "ヒアドキュメント",
          "cat <<EOF > config.txt\nhost=$HOST\nport=8080\nEOF",
          "複数行の文字列をコマンドの入力にする。",
          "<<'EOF' と引用符で囲むと、中の変数を展開しない。",
        ),
        item(
          "process-substitution",
          "コマンドの結果をファイルとして渡す",
          "diff <(sort a.txt) <(sort b.txt)",
          "コマンドの出力を、ファイルのように別のコマンドに渡す。",
        ),
      ],
    },
    // エラー処理とデバッグ。trap で後片付けを必ず実行する。
    {
      id: "errors-debug",
      title: "エラー処理・デバッグ",
      description: "終了時の後片付け、一時ファイル、実行内容の表示、静的解析。",
      items: [
        item(
          "trap-exit",
          "終了時に後片付け",
          "trap 'rm -f \"$tmp\"' EXIT",
          "スクリプトが終わるとき（エラーで止まったときも含む）に実行する処理を登録する。",
          undefined,
          "info",
        ),
        item(
          "mktemp",
          "一時ファイルを作る",
          "tmp=$(mktemp)",
          "重ならない名前の一時ファイルを作る。-d でディレクトリ。",
        ),
        item(
          "set-x",
          "実行したコマンドを表示",
          "bash -x deploy.sh",
          "変数を展開した後のコマンドを1行ずつ表示しながら実行する。",
          "スクリプトの中では set -x で有効に、set +x で無効にする。",
        ),
        item(
          "shellcheck",
          "よくある誤りを検出",
          "shellcheck deploy.sh",
          "引用符の付け忘れなど、スクリプトのよくある誤りを検出する。",
          "別途インストールが必要。",
          "info",
        ),
      ],
    },
    // 対話で使うショートカットと履歴。
    {
      id: "interactive",
      title: "対話操作・ショートカット",
      description: "コマンドラインの編集と、履歴の再利用。",
      items: [
        item("ctrl-a-e", "行頭・行末へ", "Ctrl+A / Ctrl+E", "カーソルを行頭・行末へ移動する。"),
        item(
          "ctrl-u-k",
          "カーソルの前・後ろを消す",
          "Ctrl+U / Ctrl+K",
          "カーソルより前・後ろをまとめて消す。",
        ),
        item("ctrl-w", "1語消す", "Ctrl+W", "カーソルの前の1語を消す。"),
        item(
          "ctrl-r",
          "履歴を検索",
          "Ctrl+R",
          "入力した文字を含む過去のコマンドを検索する。続けて押すとさらに前を探す。",
          undefined,
          "info",
        ),
        item("ctrl-l", "画面を消す", "Ctrl+L", "画面を消去する（clear と同じ）。"),
        item(
          "ctrl-c-d",
          "中断・終了",
          "Ctrl+C / Ctrl+D",
          "実行中のコマンドを中断する／入力を終えてシェルを抜ける。",
        ),
        item(
          "bang-bang",
          "直前のコマンドを再実行",
          "sudo !!",
          "!! は直前のコマンドに置き換わる。sudo を付け忘れたときに使う。",
        ),
        item(
          "bang-dollar",
          "直前の最後の引数",
          "cd !$",
          "!$ は直前のコマンドの最後の引数に置き換わる。",
        ),
        item("history", "履歴の一覧", "history | tail -20", "実行したコマンドの履歴を表示する。"),
        item(
          "alias",
          "別名を付ける",
          "alias ll='ls -la'",
          "よく使うコマンドに短い名前を付ける。",
          "残すには ~/.bashrc に書き、source ~/.bashrc で読み直す。",
        ),
      ],
    },
  ],
};
