/**
 * Vimチートシートのデータ。
 *
 * 表示側（components）はこの構造だけを見るので、ここに書いた順序がそのまま
 * 目次とページの並び順になる。項目は必ず helpers.ts の item() で生成する。
 *
 *   item(id, label, syntax, description, note?, status?, keywords?)
 *
 * - id はシート内で一意。目次のアンカー（#id）とReactのkeyに使われる
 * - status は normal / info / warning / danger。省略時は normal
 * - 未保存の変更を失う操作（! 付きの終了・再読込）には必ず danger を付ける。
 *   バッジの色が唯一の警告表示になるため、付け忘れると危険が伝わらない
 * - キーの表記は「Ctrl+w h」＝押して離してから次のキー、「→」＝順に操作、
 *   「／」「 / 」＝対になる操作の併記、{文字} ＝置き換える値
 * - keywords は検索用の別名。全角/半角・大文字小文字は normalizeSearch が吸収する
 * - 内容を直したら updatedAt も更新する
 */
import { item } from "../helpers";
import type { CheatSheet } from "../types";

export const vimCheatSheet: CheatSheet = {
  id: "vim-reference",
  slug: "vim",
  title: "Vim チートシート",
  shortTitle: "Vim",
  description:
    "モード切替、移動、編集、検索・置換、保存、分割、マクロまでをまとめたVimリファレンス。",
  eyebrow: "Text editor",
  accent: "#019833",
  keywords: ["vim", "vi", "エディタ", "モード", "置換", "マクロ"],
  updatedAt: "2026-09-16",
  sources: [
    {
      label: "Vimリファレンスマニュアル（quickref）",
      url: "https://vimhelp.org/quickref.txt.html",
    },
  ],
  sections: [
    // 最初に覚える最低限。入力して保存・終了するまでの流れと、キー表記の読み方を先頭に置く。
    {
      id: "basics",
      title: "まず覚える操作",
      description: "通常はノーマルモードから入力。: コマンドと検索は最後に Enter。",
      items: [
        item(
          "first-edit-flow",
          "入力して保存・終了",
          "Esc → i → 入力 → Esc → :wq → Enter",
          "入力を始めてから保存して終了するまでの基本の流れ。キーは順番に押す。",
          "保存せず終了するときは Esc → :q! → Enter。",
          "info",
        ),
        item(
          "key-notation",
          "キー表記の読み方",
          "Ctrl+w h",
          "Ctrl+wを押して離し、hを押す。大文字と小文字は別の操作になる。",
          "{文字}・{名前}は置き換える値で、波括弧は入力しない。",
          "info",
        ),
        item(
          "esc",
          "ノーマルモードへ戻る",
          "Esc",
          "入力中・選択中に迷ったら押す。",
          undefined,
          "info",
        ),
        item("insert", "カーソルの前で入力開始", "i", "挿入モードへ切り替える。"),
        item("write", "保存", ":w", "ファイル名が未設定なら :w ファイル名 で保存する。"),
        item(
          "quit",
          "現在のウィンドウを閉じる",
          ":q",
          "最後のウィンドウなら終了する。",
          "未保存の変更があると拒否される。",
        ),
        item("write-quit", "保存して閉じる", ":wq", "現在のファイルを書き込んで終了する。"),
        item(
          "quit-force",
          "未保存変更を保存せず閉じる",
          ":q!",
          "保存していない変更を捨てて閉じる。",
          "変更を失う可能性がある。",
          "danger",
        ),
        item("undo", "直前の変更を取り消す", "u", "ノーマルモードで使う。"),
        item("redo", "取り消した変更をやり直す", "Ctrl+r", "ノーマルモードで使う。"),
      ],
    },
    // 入力の始め方と、選択・コマンドラインへの切り替え。
    {
      id: "modes",
      title: "モード・入力開始",
      description: "入力する操作と、移動・編集する操作を切り替える。",
      items: [
        item("insert-append", "カーソルの前／後で入力", "i / a", "挿入モードに入る。"),
        item(
          "insert-line-edges",
          "行の最初の非空白／行末で入力",
          "I / A",
          "I は行頭の空白を除いた位置から入力する。",
        ),
        item("open-line", "下／上に新しい行を作って入力", "o / O", "ノーマルモードから使う。"),
        item("visual-char", "文字単位の選択", "v", "ビジュアルモードに入る。"),
        item("visual-line", "行単位の選択", "V", "ビジュアルラインモードに入る。"),
        item(
          "visual-block",
          "矩形選択",
          "Ctrl+v",
          "矩形のビジュアルモードに入る。",
          "端末にキーを奪われる場合がある。",
        ),
        item("replace-mode", "連続して上書き", "R", "置換モードに入る。Escで終了する。"),
        item("cmdline", "コマンドラインを開く", ":", "Exコマンドを入力してEnterで実行する。"),
      ],
    },
    // カーソル移動。数字を前に付けると反復できる点をセクション説明で先に伝える。
    {
      id: "motion",
      title: "カーソル移動",
      description: "数字を前に付けると反復。例：5j は5行下へ。",
      items: [
        item("hjkl", "左／下／上／右", "h / j / k / l", "矢印キーを使わずに移動する。"),
        item(
          "word-motion",
          "次の単語先頭／前の単語先頭／単語末尾",
          "w / b / e",
          "句読点なども単語の区切りになる。",
        ),
        item("blank-word-motion", "空白区切りで単語移動", "W / B / E", "記号を含む文字列に便利。"),
        item("line-edges", "行頭／最初の非空白／行末", "0 / ^ / $", "0は数字のゼロ。"),
        item("file-edges", "最初の行／最後の行", "gg / G", "25Gで25行目へ移動する。"),
        item("goto-line", "25行目へ移動", ":25", "Enterで確定する。"),
        item(
          "find-char",
          "行内で右／左の文字まで",
          "f{文字} / F{文字}",
          "例：f, で右にあるカンマへ移動する。",
        ),
        item(
          "till-char",
          "行内の右の文字の直前／左の文字の直後",
          "t{文字} / T{文字}",
          "対象の文字を含めたくないときに使う。",
        ),
        item(
          "repeat-find",
          "f・F・t・Tを同方向／逆方向に反復",
          "; / ,",
          "直前の行内検索を再利用する。",
        ),
        item("match-pair", "対応する括弧へ移動", "%", "()、[]、{}などの対応を行き来する。"),
        item("paragraph", "前／次の段落へ", "{ / }", "空行で区切ったまとまりを段落として扱う。"),
        item("display-line", "表示上の1行下／上", "gj / gk", "折り返された長い行に便利。"),
      ],
    },
    // 画面の見え方を変える操作。H / M / L は文書全体ではなく画面内の移動である点に注意。
    {
      id: "scroll",
      title: "画面スクロール",
      description: "カーソル移動と画面内の位置調整。",
      items: [
        item("half-page", "半画面下／上へ", "Ctrl+d / Ctrl+u", "スクロール量は設定で変わる。"),
        item("full-page", "1画面下／上へ", "Ctrl+f / Ctrl+b", "ページ単位で移動する。"),
        item(
          "scroll-line",
          "画面を1行下／上へ",
          "Ctrl+e / Ctrl+y",
          "カーソルは可能な限りその場に残る。",
        ),
        item(
          "reposition",
          "現在行を中央／上端／下端へ",
          "zz / zt / zb",
          "作業中の周辺を見やすくする。",
        ),
        item(
          "screen-lines",
          "画面の上／中央／下の行へ",
          "H / M / L",
          "文書全体の先頭・末尾ではない。",
        ),
      ],
    },
    // 「操作＋移動量」の組み合わせ。d・c・y の基本形と、貼り付け・反復をまとめる。
    {
      id: "edit",
      title: "削除・変更・コピー",
      description: "操作＋移動量。d は削除、c は変更、y はコピー。",
      items: [
        item(
          "delete-char",
          "カーソル位置／直前の1文字を削除",
          "x / X",
          "削除した内容はレジスタに入る。",
        ),
        item("delete-line", "1行／3行削除", "dd / 3dd", "行単位で切り取る。"),
        item("delete-to-eol", "カーソルから行末まで削除", "D / d$", "カーソルより行頭側は残る。"),
        item("change-line", "行を変更／行末まで変更", "cc / C", "削除してから挿入モードに入る。"),
        item(
          "delete-word",
          "次の単語先頭まで／単語末尾まで削除",
          "dw / de",
          "dwは末尾の空白を含むことがある。",
        ),
        item("yank-line", "1行／3行コピー", "yy / 3yy", "コピーはヤンクとも呼ぶ。"),
        item(
          "yank-motion",
          "次の単語先頭まで／行末までコピー",
          "yw / y$",
          "範囲は移動コマンドで指定する。",
        ),
        item("put", "後／前へ貼り付け", "p / P", "行単位の内容なら下／上の行に貼り付ける。"),
        item("replace-char", "1文字を置き換え", "r{文字}", "例：ra。挿入モードには入らない。"),
        item(
          "join",
          "次行と結合／空白を挿入せず結合",
          "J / gJ",
          "Jは必要に応じて区切りの空白を入れる。",
        ),
        item("toggle-case", "現在文字の大文字・小文字を反転", "~", "通常の設定での動作。"),
        item(
          "dot-repeat",
          "直前の変更を反復",
          ".",
          "同じ編集を次の位置でも繰り返す。",
          undefined,
          "info",
        ),
      ],
    },
    // i（内側）と a（周囲も含む）の対比が要点なので、同じ対象の ci( と da( を隣に置く。
    {
      id: "objects",
      title: "テキストオブジェクト",
      description: "i は内側、a は周囲も含む。d・c・yやビジュアル選択と組み合わせる。",
      items: [
        item("ciw", "単語だけを変更", "ciw", "単語内のどこにカーソルがあっても使える。"),
        item("daw", "単語と隣接する空白を削除", "daw", "周囲の空白の扱いは位置による。"),
        item("yi-quote", "二重引用符の内側をコピー", 'yi"', "引用符自体は含まない。"),
        item("ci-paren", "丸括弧の内側を変更", "ci(", "括弧自体は残す。"),
        item("da-paren", "丸括弧ごと削除", "da(", "区切りの括弧も含めて削除する。"),
        item("vi-brace", "波括弧の内側を選択", "vi{", "選択してから範囲を確認できる。"),
        item(
          "paragraph-object",
          "段落内を選択／段落と隣接空行を削除",
          "vip / dap",
          "文書やコードのブロック整理に使う。",
        ),
        item(
          "tag-object",
          "タグの内側を変更／タグごと削除",
          "cit / dat",
          "HTML/XMLなどの対応するタグが対象。",
        ),
      ],
    },
    // ビジュアルモードで選んだ範囲への操作。
    {
      id: "visual",
      title: "選択範囲の編集",
      description: "v・V・Ctrl+vで選択し、移動キーで範囲を伸ばす。",
      items: [
        item("visual-other-end", "選択範囲の反対側の端へ", "o", "ビジュアルモード中に使う。"),
        item(
          "visual-operators",
          "選択範囲を削除／コピー／変更",
          "d / y / c",
          "操作後はモードが切り替わる。",
        ),
        item("visual-indent", "選択行を右／左へインデント", "> / <", "再選択はgvで行う。"),
        item(
          "visual-autoindent",
          "選択行を自動インデント",
          "=",
          "言語設定やindentexprに依存する。",
        ),
        item("reselect", "直前の選択範囲を再選択", "gv", "選択後の追加編集に便利。"),
        item(
          "visual-case",
          "選択文字を大文字／小文字へ",
          "U / u",
          "ノーマルモードのuは取り消しになる。",
        ),
        item(
          "block-insert",
          "複数行の先頭に同じ文字を挿入",
          "Ctrl+v → I → 入力 → Esc",
          "矩形選択後にIで入力し、Escで他の行にも反映する。",
        ),
      ],
    },
    // 検索と、検索まわりの設定。
    {
      id: "search",
      title: "検索",
      description: "/ と ? のあとに検索文字列を入力してEnter。",
      items: [
        item("search-forward", "前方検索", "/{pattern}", "Vimの正規表現を使う。"),
        item("search-backward", "後方検索", "?{pattern}", "逆方向に検索を始める。"),
        item("search-next", "前回と同方向／逆方向へ", "n / N", "nが常に下方向とは限らない。"),
        item("search-word", "カーソル下の単語を前／後へ検索", "* / #", "単語全体として検索する。"),
        item(
          "nohlsearch",
          "検索ハイライトを一時解除",
          ":nohlsearch",
          "次に検索すると再び表示される。",
        ),
        item(
          "smartcase",
          "小文字検索は大文字小文字を無視",
          ":set ignorecase smartcase",
          "大文字を含む検索では区別する。",
        ),
        item(
          "hlsearch",
          "一致を強調し入力中にも検索",
          ":set hlsearch incsearch",
          "nohlsearch・noincsearchで設定を解除する。",
        ),
        item(
          "very-nomagic",
          "ほぼ文字どおりに検索",
          "/\\Vfoo.bar",
          "very nomagic。バックスラッシュには意味が残る。",
        ),
      ],
    },
    // 置換は範囲の指定を誤ると広く書き換わるため、確認付き（c）と件数確認（n）を並べておく。
    {
      id: "replace",
      title: "置換・行範囲",
      description: "置換前に範囲を確認。c フラグで一致ごとに確認する。",
      items: [
        item(
          "substitute",
          "現在行の最初の一致を置換",
          ":s/old/new/",
          "gdefaultがオフ（通常）の場合の動作。",
          "oldは正規表現。置換先の & は一致全体を表し、文字としての & は \\& と書く。",
        ),
        item(
          "substitute-line-all",
          "現在行のすべてを置換",
          ":s/old/new/g",
          "gフラグで行内の全一致が対象になる。",
        ),
        item(
          "substitute-confirm",
          "ファイル全体で確認付き置換",
          ":%s/old/new/gc",
          "yで置換、nでスキップ、qで中止する。",
          undefined,
          "info",
        ),
        item("substitute-range", "10〜20行で置換", ":10,20s/old/new/g", "範囲を行番号で指定する。"),
        item(
          "substitute-visual",
          "選択した行の範囲で置換",
          ":'<,'>s/old/new/g",
          "ビジュアル選択後に:を押すと範囲が自動入力される。",
          "選択した文字だけでなく、その行全体が対象。",
        ),
        item(
          "substitute-count",
          "全体の一致件数を確認",
          ":%s/old/new/gn",
          "nフラグは置換せず件数だけを表示する。",
        ),
        item(
          "substitute-delimiter",
          "区切り文字を#に変更",
          ":%s#old/path#new/path#g",
          "パス中の/をエスケープせずに書ける。",
        ),
        item(
          "substitute-word",
          "単語全体のoldを確認付き置換",
          ":%s/\\<old\\>/new/gc",
          "\\<と\\>は単語境界を表す。",
        ),
      ],
    },
    // 保存と終了。! 付きは未保存の変更を捨てるので danger。
    {
      id: "files",
      title: "ファイル・保存・終了",
      description: "! を付ける操作では未保存変更を失うことがある。",
      items: [
        item("write-as", "指定名へ書き出す", ":w {file}", "別名のファイルを作成する。"),
        item(
          "saveas",
          "別名で保存して編集対象も変更",
          ":saveas {file}",
          "以降の:wは新しいファイルへ書き込む。",
        ),
        item("write-all", "変更済みの全バッファを保存", ":wa", "すべてのファイルを書き込む。"),
        item("exit", "変更があれば保存して閉じる", ":x / ZZ", "ZZはノーマルモードで入力する。"),
        item("quit-all", "全ウィンドウを閉じて終了", ":qa", "未保存の変更があれば拒否される。"),
        item(
          "quit-all-force",
          "全体を保存せず強制終了",
          ":qa!",
          "すべてのウィンドウを保存せずに閉じる。",
          "未保存の変更を破棄するので注意。",
          "danger",
        ),
        item(
          "edit-file",
          "別ファイルを開く",
          ":e {file}",
          "未保存の変更がある場合は先に保存する。",
        ),
        item(
          "reload",
          "現在のファイルをディスクから再読込",
          ":e!",
          "ディスク上の内容で開き直す。",
          "未保存の変更を破棄する。",
          "danger",
        ),
        item(
          "read-file",
          "ファイルの内容を現在行の下へ挿入",
          ":r {file}",
          "編集中の文書へ取り込む。",
        ),
        item(
          "open-from-shell",
          "ターミナルからVimで開く",
          "vim {file}",
          "Vimの中ではなくシェルに入力する。",
        ),
      ],
    },
    // バッファ（編集内容）・ウィンドウ（表示領域）・タブ（ウィンドウの配置）の順に並べる。
    {
      id: "buffers",
      title: "バッファ・ウィンドウ・タブ",
      description: "バッファ＝編集内容、ウィンドウ＝表示領域、タブ＝ウィンドウの配置。",
      items: [
        item("buffer-list", "バッファ一覧", ":ls", "バッファ番号を確認する。"),
        item(
          "buffer-switch",
          "指定バッファへ切り替え",
          ":b {番号}",
          "番号の代わりに名前も使える。",
        ),
        item(
          "buffer-next-prev",
          "次／前のバッファ",
          ":bn / :bp",
          "未保存時の挙動はhiddenなどの設定に依存する。",
        ),
        item(
          "buffer-delete",
          "バッファを一覧から削除",
          ":bd",
          "ディスク上のファイルは削除しない。",
        ),
        item("split", "上下／左右に分割", ":split / :vsplit", "末尾にファイル名を指定できる。"),
        item(
          "window-move",
          "左／下／上／右のウィンドウへ",
          "Ctrl+w h / j / k / l",
          "Ctrl+wを押してから方向キーを押す。",
        ),
        item("window-next", "次のウィンドウへ", "Ctrl+w w", "分割した画面を巡回する。"),
        item(
          "window-equalize",
          "ウィンドウの大きさを均等にする",
          "Ctrl+w =",
          "大きさを自動で揃える。",
        ),
        item(
          "window-close",
          "現在の窓を閉じる／現在の窓だけ残す",
          ":close / :only",
          "未保存の内容があると拒否される場合がある。",
        ),
        item("tab-new", "新しいタブを作る", ":tabnew", "複数ウィンドウの配置を分けられる。"),
        item("tab-next-prev", "次／前のタブへ", "gt / gT", "ノーマルモードで使う。"),
        item("tab-close", "現在のタブを閉じる", ":tabclose", "タブ内のウィンドウも閉じる。"),
      ],
    },
    // コピー先の選択（レジスタ）、位置の記録（マーク）、編集の記録（マクロ）。
    {
      id: "registers",
      title: "レジスタ・マーク・マクロ",
      description: "コピー先を選び、繰り返す編集を記録する。",
      items: [
        item(
          "register-yank",
          "aレジスタに1行コピー",
          '"ayy',
          'レジスタ名が小文字なら上書き、"Ayyのように大文字なら追記。',
        ),
        item(
          "register-put",
          "aレジスタから貼り付け",
          '"ap',
          "名前付きレジスタの内容を再利用する。",
        ),
        item(
          "yank-register",
          "直前にヤンクした内容を貼り付け",
          '"0p',
          "その後の通常の削除では上書きされない。",
        ),
        item("blackhole", "レジスタへ残さず1行削除", '"_dd', "ブラックホールレジスタを使う。"),
        item(
          "clipboard",
          "システムへコピー／システムから貼り付け",
          '"+y / "+p',
          "+clipboard機能と、利用できる表示環境が必要。",
        ),
        item("register-list", "レジスタ一覧", ":registers", "各レジスタの内容を確認する。"),
        item(
          "set-mark",
          "現在位置にマークaを設定",
          "ma",
          "小文字のマークはそのバッファ内だけで有効。",
        ),
        item(
          "jump-mark",
          "マークaの正確な位置／行先頭側へ",
          "`a / 'a",
          "バッククォートとシングルクォートで移動先が違う。",
        ),
        item(
          "jumplist",
          "ジャンプ履歴を戻る／進む",
          "Ctrl+o / Ctrl+i",
          "大きな移動の前後を行き来する。",
        ),
        item(
          "record-macro",
          "aにマクロ記録、qで停止",
          "qa → 操作 → q",
          "ノーマルモードから記録を始める。",
        ),
        item("run-macro", "aマクロ実行／直前のマクロを再実行", "@a / @@", "10@aで10回実行する。"),
      ],
    },
    // インデント・整形・補完・折りたたみ。設定やファイルタイプで結果が変わるものが多い。
    {
      id: "format",
      title: "整形・補完・折りたたみ",
      description: "Vimの設定やファイルタイプに応じて利用。",
      items: [
        item("indent-line", "現在行を右／左にインデント", ">> / <<", "3>>なら3行が対象になる。"),
        item(
          "reindent",
          "現在行／全体のインデントを調整",
          "== / gg=G",
          "全体に実行したら差分を確認する。",
          undefined,
          "warning",
        ),
        item(
          "format-paragraph",
          "段落を整形・折り返す",
          "gqip",
          "textwidthやformatoptionsに依存する。",
        ),
        item(
          "complete-keyword",
          "次／前の補完候補",
          "Ctrl+n / Ctrl+p",
          "挿入モード中のキーワード補完。",
        ),
        item("complete-filename", "ファイル名補完", "Ctrl+x Ctrl+f", "挿入モードで使う。"),
        item(
          "fold-toggle",
          "折りたたみ切替／開く／閉じる",
          "za / zo / zc",
          "折りたたみが定義されている場合に使える。",
        ),
        item("fold-all", "すべて開く／すべて閉じる", "zR / zM", "foldmethodなどの設定に依存する。"),
      ],
    },
    // 設定の確認とヘルプ。プラグインなしの標準機能だけを扱う。
    {
      id: "help",
      title: "設定・ヘルプ・練習",
      description:
        "プラグインなしの標準機能が中心。Vim 8・9系を想定し、設定やキーマッピングで挙動が変わる。",
      items: [
        item(
          "line-numbers",
          "行番号と相対行番号を表示",
          ":set number relativenumber",
          "移動回数を数えやすくなる。",
        ),
        item(
          "indent-spaces",
          "空白インデントを2桁基準に設定",
          ":set expandtab shiftwidth=2 tabstop=2",
          "既存のタブ文字は自動で変換されない。",
        ),
        item(
          "paste-mode",
          "貼り付け用設定をオン／オフ",
          ":set paste / :set nopaste",
          "必要な環境でだけ使う。",
          "貼り付けが終わったら元に戻す。",
          "warning",
        ),
        item(
          "show-option",
          "設定値を確認",
          ":set {option}?",
          "例：:set tabstop? で現在値を表示する。",
        ),
        item(
          "verbose-option",
          "設定値と設定元を確認",
          ":verbose set {option}?",
          "設定が上書きされたときの調査に使う。",
        ),
        item(
          "help-topic",
          "ヘルプを開く",
          ":help {topic}",
          "例：:help ciw、:help :s のように調べる。",
        ),
        item("help-tags", "ヘルプのリンクへ／戻る", "Ctrl+] / Ctrl+t", "ヘルプ内のタグをたどる。"),
        item(
          "vimtutor",
          "対話型の基礎練習",
          "vimtutor",
          "ターミナルで実行する。",
          "別途インストールが必要な環境もある。",
        ),
      ],
    },
  ],
};
