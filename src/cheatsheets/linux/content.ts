/**
 * Linux コマンドチートシートのデータ。
 *
 * 表示側（components）はこの構造だけを見るので、ここに書いた順序がそのまま
 * 目次とページの並び順になる。項目は必ず helpers.ts の item() で生成する。
 *
 *   item(id, label, syntax, description, note?, status?, keywords?)
 *
 * - id はシート内で一意。目次のアンカー（#id）とReactのkeyに使われる
 * - status は normal / info / warning / danger。省略時は normal
 * - ファイルを戻せない形で消す・上書きする操作（rm -rf、find -delete、rsync --delete）には必ず danger、
 *   権限を広げすぎる・強制終了するなど注意が要る操作には warning を付ける。
 *   バッジの色が唯一の警告表示になるため、付け忘れると危険が伝わらない
 * - 範囲は日常的に使うコマンド。シェルの文法（変数・条件分岐・リダイレクトなど）は Bash シートに任せる。
 *   パッケージ管理は Debian / Ubuntu（apt）と RHEL / Fedora（dnf）の両方を載せる
 * - <file> などの山括弧は置き換える値。例のサービス名は nginx にそろえる
 * - keywords は検索用の別名。全角/半角・大文字小文字は normalizeSearch が吸収する
 * - 内容を直したら updatedAt も更新する
 * - セクション・項目を増減したら summary.ts の件数も直す（tests/unit/registry.test.ts が突き合わせる）
 */
import { item } from "../helpers";
import type { CheatSheetContent } from "../types";

export const linuxContent: CheatSheetContent = {
  id: "linux-reference",
  updatedAt: "2026-09-20",
  sources: [
    { label: "man ページ（man7.org）", url: "https://man7.org/linux/man-pages/" },
    { label: "GNU Coreutils マニュアル", url: "https://www.gnu.org/software/coreutils/manual/" },
  ],
  sections: [
    // 今いる場所の確認と移動。
    {
      id: "navigation",
      title: "移動・一覧",
      description: "今いるディレクトリの確認と移動、ファイルの一覧。",
      items: [
        item("pwd", "今いる場所", "pwd", "今いるディレクトリのパスを表示する。"),
        item("cd", "移動", "cd /var/log", "指定したディレクトリへ移動する。"),
        item(
          "cd-shortcuts",
          "よく使う移動先",
          "cd ~ / cd .. / cd -",
          "ホーム、1つ上、直前にいたディレクトリへ移動する。",
        ),
        item(
          "ls-la",
          "詳しい一覧",
          "ls -la",
          "隠しファイルも含めて、権限・所有者・サイズ・更新日時を一覧する。",
          undefined,
          "info",
        ),
        item(
          "ls-lh",
          "サイズを読みやすく",
          "ls -lh",
          "ファイルサイズを K・M・G の単位で表示する。",
        ),
        item("ls-lt", "新しい順", "ls -lt", "更新日時の新しい順に並べる。逆順は -ltr。"),
        item(
          "tree",
          "階層を表示",
          "tree -L 2",
          "ディレクトリの階層を、指定した深さまで木の形で表示する。",
          "入っていない環境では、パッケージの追加が必要。",
        ),
      ],
    },
    // 作成・コピー・移動・削除。rm は戻せないので danger。
    {
      id: "files",
      title: "ファイル操作",
      description: "作成・コピー・移動・削除とリンク。削除はゴミ箱を通らない。",
      items: [
        item(
          "mkdir-p",
          "ディレクトリを作る",
          "mkdir -p src/components/ui",
          "途中の階層もまとめて作る。すでにあってもエラーにならない。",
        ),
        item(
          "touch",
          "空のファイルを作る",
          "touch notes.txt",
          "空のファイルを作る。あれば更新日時だけを変える。",
        ),
        item("cp", "コピー", "cp config.yml config.yml.bak", "ファイルをコピーする。"),
        item(
          "cp-r",
          "ディレクトリごとコピー",
          "cp -a src/ backup/",
          "中身ごとコピーする。-a は権限や更新日時も保ったままにする。",
          "コピー先に同じ名前があると上書きされる。-i を付けると確認する。",
        ),
        item(
          "mv",
          "移動・名前変更",
          "mv draft.md post.md",
          "ファイルを移動する。同じ場所なら名前の変更になる。",
          "移動先に同じ名前があると上書きされる。-i を付けると確認する。",
        ),
        item(
          "rm",
          "ファイルを削除",
          "rm old.log",
          "ファイルを削除する。",
          "ゴミ箱を通らず、戻せない。-i を付けると1つずつ確認する。",
          "warning",
        ),
        item(
          "rm-rf",
          "ディレクトリごと削除",
          "rm -rf build/",
          "ディレクトリを中身ごと、確認なしで削除する。",
          '戻せない。変数を使うときは空でないことを確かめる（rm -rf "$DIR/" が / になる事故がある）。',
          "danger",
        ),
        item(
          "ln-s",
          "シンボリックリンク",
          "ln -s /opt/app/current app",
          "別の場所を指すリンク（ショートカット）を作る。",
        ),
      ],
    },
    // 中身を見る。ログの追跡は tail -f。
    {
      id: "view",
      title: "中身を見る",
      description: "ファイルの中身の表示と、行数・種類・差分の確認。",
      items: [
        item("cat", "全部表示", "cat README.md", "ファイルの中身を全部表示する。"),
        item(
          "less",
          "ページごとに表示",
          "less app.log",
          "長いファイルを1画面ずつ表示する。",
          "/ で検索、n で次、q で終了。",
          "info",
        ),
        item("head", "先頭を表示", "head -n 20 app.log", "先頭から指定した行数を表示する。"),
        item("tail", "末尾を表示", "tail -n 50 app.log", "末尾から指定した行数を表示する。"),
        item(
          "tail-f",
          "追記を追いかける",
          "tail -f /var/log/nginx/access.log",
          "ファイルに追記される内容を、リアルタイムで表示し続ける。",
          "Ctrl+C で終了する。",
          "info",
        ),
        item(
          "wc-l",
          "行数を数える",
          "wc -l users.csv",
          "行数を数える。-w で単語数、-c でバイト数。",
        ),
        item("file", "ファイルの種類", "file image.png", "中身からファイルの種類を判定する。"),
        item("diff", "差分を表示", "diff -u old.conf new.conf", "2つのファイルの違いを表示する。"),
      ],
    },
    // ファイルと文字列の検索。find -delete は戻せない。
    {
      id: "search",
      title: "検索",
      description: "ファイルを名前や条件で探し、中身を文字列で探す。",
      items: [
        item(
          "find-name",
          "名前で探す",
          'find . -name "*.log"',
          "今の場所より下から、名前が一致するファイルを探す。",
        ),
        item(
          "find-mtime",
          "更新日時で探す",
          "find . -type f -mtime -7",
          "7日以内に更新されたファイルを探す。",
          "+7 にすると7日より前。",
        ),
        item(
          "find-size",
          "サイズで探す",
          "find / -type f -size +100M 2>/dev/null",
          "100MB を超えるファイルを探す。",
        ),
        item(
          "find-delete",
          "見つけて削除",
          'find /tmp -name "*.tmp" -mtime +30 -delete',
          "条件に合うファイルを見つけて、そのまま削除する。",
          "戻せない。まず -delete を付けずに実行して、一覧を確かめる。",
          "danger",
        ),
        item(
          "grep-rn",
          "中身を検索",
          'grep -rn "TODO" src/',
          "ディレクトリの中のファイルを検索し、ファイル名と行番号を表示する。",
          undefined,
          "info",
        ),
        item(
          "grep-options",
          "grep のよく使うオプション",
          'grep -i "error" app.log / grep -v "debug" app.log',
          "-i で大文字小文字を区別せず、-v で一致しない行を表示する。",
          "-E で拡張正規表現、-c で件数、-l でファイル名だけを表示する。",
        ),
        item("which", "コマンドの場所", "which node", "コマンドの実体がどこにあるかを表示する。"),
      ],
    },
    // パイプでつないで使うテキスト処理。sed -i は元のファイルを書き換える。
    {
      id: "text",
      title: "テキスト処理",
      description: "並べ替え・集計・切り出し・置換。パイプでつないで使う。",
      items: [
        item(
          "sort-uniq",
          "並べ替えて数える",
          "sort access.log | uniq -c | sort -nr | head",
          "同じ行が何回出てくるかを数え、多い順に並べる。",
          "uniq は隣り合う重複しかまとめないので、先に sort する。",
          "info",
        ),
        item(
          "sort-n",
          "数値で並べ替え",
          "sort -n numbers.txt",
          "数値として並べ替える。-r で逆順、-h で 1K・2M などの単位付き。",
        ),
        item(
          "cut",
          "列を切り出す",
          "cut -d, -f1,3 users.csv",
          "区切り文字で分けて、指定した列だけを取り出す。",
        ),
        item(
          "awk-print",
          "列を取り出す（awk）",
          "awk '{print $1, $9}' access.log",
          "空白で区切った列を取り出して表示する。",
          "-F, で区切り文字を指定できる。",
        ),
        item(
          "sed-replace",
          "置換して表示",
          "sed 's/http:/https:/g' links.txt",
          "文字列を置換した結果を表示する。元のファイルは変わらない。",
        ),
        item(
          "sed-i",
          "ファイルを直接書き換え",
          "sed -i.bak 's/localhost/0.0.0.0/g' config.ini",
          "置換した結果でファイルを上書きする。",
          "-i.bak のように付けると、元のファイルを .bak として残す。macOS の sed は書き方が違う。",
          "warning",
        ),
        item(
          "tr",
          "文字を置き換え",
          "tr 'a-z' 'A-Z' < name.txt",
          "文字を1文字ずつ置き換える（ここでは大文字にする）。",
        ),
        item(
          "xargs",
          "結果を引数にして実行",
          'find . -name "*.log" -print0 | xargs -0 gzip',
          "前のコマンドの出力を、次のコマンドの引数にして実行する。",
          "-print0 と -0 を組み合わせると、空白を含むファイル名でも安全。",
        ),
        item(
          "tee",
          "表示しながら保存",
          "npm run build 2>&1 | tee build.log",
          "出力を画面に表示しつつ、ファイルにも書き出す。",
          "-a を付けると追記になる。",
        ),
      ],
    },
    // 権限と所有者。777 や -R は影響が大きい。
    {
      id: "permissions",
      title: "権限・所有者",
      description: "読み・書き・実行の権限と、所有者の変更。",
      items: [
        item(
          "permission-format",
          "権限の見方",
          "-rwxr-xr-- 1 alice dev",
          "左から種類、所有者・グループ・その他の順に r（読み）w（書き）x（実行）を表す。",
          "数値では r=4、w=2、x=1 の合計（rwx は 7、r-x は 5）。",
        ),
        item(
          "chmod-x",
          "実行できるようにする",
          "chmod +x deploy.sh",
          "スクリプトに実行権限を付ける。",
        ),
        item(
          "chmod-numeric",
          "数値で権限を指定",
          "chmod 644 config.yml",
          "所有者は読み書き、ほかは読むだけにする（ディレクトリは 755 が一般的）。",
        ),
        item(
          "chmod-777",
          "誰でも書き込める権限",
          "chmod 777 uploads/",
          "すべてのユーザーに読み・書き・実行を許可する。",
          "誰でも中身を書き換えられる。原因がわからないまま権限の問題を回避するために使わない。",
          "danger",
        ),
        item(
          "chmod-recursive",
          "まとめて変更",
          "chmod -R u+rwX,go-w app/",
          "ディレクトリの中身すべての権限をまとめて変える。",
          "対象を間違えると広い範囲に影響する。大文字の X は、ディレクトリと元から実行できるファイルにだけ実行権限を付ける。",
          "warning",
        ),
        item(
          "chown",
          "所有者を変える",
          "sudo chown -R www-data:www-data /var/www",
          "ファイルの所有者とグループを変える。-R で中身も含める。",
        ),
        item(
          "sudo",
          "管理者として実行",
          "sudo systemctl restart nginx",
          "コマンドを root の権限で実行する。",
          "sudo -i で root のシェルに入れるが、作業が終わったらすぐ抜ける。",
          "warning",
        ),
      ],
    },
    // 動いているプロセスの確認と停止、バックグラウンド実行。
    {
      id: "processes",
      title: "プロセス",
      description: "動いているプロセスの確認・停止と、バックグラウンドでの実行。",
      items: [
        item(
          "ps-aux",
          "プロセス一覧",
          "ps aux | grep node",
          "動いているプロセスを一覧し、名前で絞り込む。",
        ),
        item(
          "top",
          "リソースを監視",
          "top",
          "CPU やメモリを多く使っているプロセスをリアルタイムで表示する。",
          "htop が入っていれば、そちらのほうが見やすい。q で終了。",
        ),
        item(
          "kill",
          "プロセスを止める",
          "kill 12345",
          "プロセス ID を指定して、終了を依頼する（SIGTERM）。",
          undefined,
          "info",
        ),
        item(
          "kill-9",
          "強制終了",
          "kill -9 12345",
          "終了処理をさせずに、プロセスを即座に止める（SIGKILL）。",
          "保存中のデータが壊れることがある。まず通常の kill を試す。",
          "warning",
        ),
        item(
          "pkill",
          "名前で止める",
          "pkill -f 'node server.js'",
          "コマンドラインに一致するプロセスを止める。",
        ),
        item(
          "background",
          "バックグラウンドで実行",
          "npm run build &",
          "末尾に & を付けて、終了を待たずにプロンプトへ戻る。",
          "jobs で一覧し、fg で前面に戻す。Ctrl+Z で一時停止し、bg で裏で再開する。",
        ),
        item(
          "nohup",
          "ログアウトしても続ける",
          "nohup ./long-task.sh > task.log 2>&1 &",
          "端末を閉じても止まらないように実行する。",
          "長く動かすものは systemd のサービスにするほうが管理しやすい。",
        ),
      ],
    },
    // システムの状態とディスクの使用量。
    {
      id: "system",
      title: "システム情報・ディスク",
      description: "OS・メモリ・ディスクの状態と、容量を使っている場所。",
      items: [
        item(
          "os-release",
          "OS の種類",
          "cat /etc/os-release",
          "ディストリビューションの名前とバージョンを表示する。",
        ),
        item("uname", "カーネル", "uname -a", "カーネルのバージョンやアーキテクチャを表示する。"),
        item("uptime", "稼働時間と負荷", "uptime", "起動してからの時間と、平均の負荷を表示する。"),
        item("free", "メモリ", "free -h", "メモリとスワップの使用量を表示する。"),
        item(
          "df",
          "ディスクの空き",
          "df -h",
          "ファイルシステムごとの使用量と空きを表示する。",
          "空きがあるのに書き込めないときは df -i を見る。小さいファイルが大量にあると、容量より先に inode を使い切る。",
          "info",
        ),
        item(
          "du",
          "何が容量を使っているか",
          "du -sh * | sort -h",
          "今の場所にあるものの容量を、小さい順に並べる。",
        ),
        item(
          "lsblk",
          "ディスクとパーティション",
          "lsblk",
          "ディスクとパーティションの構成を表示する。",
        ),
        item(
          "whoami",
          "自分のユーザー",
          "whoami / id",
          "今のユーザー名と、所属するグループを表示する。",
        ),
      ],
    },
    // 疎通確認・HTTP・待ち受けポート・リモート接続。rsync --delete は戻せない。
    {
      id: "network",
      title: "ネットワーク・リモート",
      description: "疎通や待ち受けの確認、HTTP リクエスト、リモートへの接続と転送。",
      items: [
        item(
          "ip-a",
          "IP アドレス",
          "ip a",
          "ネットワークインターフェースと IP アドレスを表示する。",
        ),
        item("ping", "疎通確認", "ping -c 4 example.com", "相手に届くかを4回だけ確かめる。"),
        item(
          "curl-head",
          "HTTP のヘッダーを見る",
          "curl -I https://example.com",
          "レスポンスのステータスとヘッダーだけを表示する。",
        ),
        item(
          "curl-post",
          "JSON を送る",
          'curl -X POST -H "Content-Type: application/json" -d \'{"name":"alice"}\' https://api.example.com/users',
          "メソッド・ヘッダー・本文を指定してリクエストを送る。",
          "-o file で保存、-L でリダイレクトをたどる。",
        ),
        item(
          "ss",
          "待ち受けているポート",
          "sudo ss -tulpn",
          "待ち受けている TCP / UDP のポートと、そのプロセスを表示する。",
          "ポートが使用中のときの確認に使う。",
          "info",
        ),
        item("dig", "DNS を引く", "dig example.com +short", "ドメイン名から IP アドレスを調べる。"),
        item(
          "ssh",
          "リモートに接続",
          "ssh -i ~/.ssh/id_ed25519 alice@203.0.113.10",
          "鍵を指定してリモートのサーバーに接続する。",
        ),
        item(
          "scp",
          "ファイルを転送",
          "scp ./app.tar.gz alice@server:/tmp/",
          "SSH を使ってファイルをコピーする。",
        ),
        item(
          "rsync",
          "差分だけを同期",
          "rsync -avz ./dist/ alice@server:/var/www/app/",
          "変わったファイルだけを転送する。",
          "送る側の末尾の / の有無で、中身を送るかディレクトリごと送るかが変わる。",
        ),
        item(
          "rsync-delete",
          "送る側に無いものを消す",
          "rsync -avz --delete ./dist/ alice@server:/var/www/app/",
          "送る側に無いファイルを、受ける側から削除して完全に一致させる。",
          "指定を間違えると受ける側のファイルが消える。先に --dry-run で確かめる。",
          "danger",
        ),
      ],
    },
    // 圧縮と展開。
    {
      id: "archives",
      title: "圧縮・展開",
      description: "tar と zip でまとめる・展開する。",
      items: [
        item(
          "tar-create",
          "tar.gz にまとめる",
          "tar -czf backup.tar.gz ./data",
          "ディレクトリを gzip で圧縮して1つにまとめる。",
        ),
        item(
          "tar-extract",
          "tar.gz を展開",
          "tar -xzf backup.tar.gz -C /tmp/restore",
          "指定したディレクトリに展開する。",
        ),
        item(
          "tar-list",
          "中身を確認",
          "tar -tzf backup.tar.gz",
          "展開せずに、中身の一覧を表示する。",
        ),
        item(
          "zip",
          "zip にまとめる",
          "zip -r site.zip ./public",
          "ディレクトリを zip にまとめる。",
        ),
        item("unzip", "zip を展開", "unzip site.zip -d ./site", "指定したディレクトリに展開する。"),
      ],
    },
    // パッケージの追加・更新・削除。apt と dnf を並べる。
    {
      id: "packages",
      title: "パッケージ管理",
      description: "Debian / Ubuntu は apt、RHEL / Fedora は dnf。",
      items: [
        item(
          "apt-update",
          "一覧を更新して最新にする（apt）",
          "sudo apt update && sudo apt upgrade",
          "パッケージの一覧を取り直してから、入っているものを更新する。",
          undefined,
          "info",
        ),
        item(
          "apt-install",
          "インストール（apt）",
          "sudo apt install nginx",
          "パッケージをインストールする。",
        ),
        item(
          "apt-remove",
          "削除（apt）",
          "sudo apt remove nginx",
          "パッケージを削除する。",
          "設定ファイルも消すなら purge。使われなくなった依存関係は autoremove で消す。",
        ),
        item("apt-search", "探す（apt）", "apt search nginx", "名前や説明からパッケージを探す。"),
        item(
          "dnf-install",
          "インストール（dnf）",
          "sudo dnf install nginx",
          "パッケージをインストールする。",
        ),
        item(
          "dnf-upgrade",
          "更新（dnf）",
          "sudo dnf upgrade",
          "入っているパッケージを最新にする。",
        ),
      ],
    },
    // systemd のサービスとログ。
    {
      id: "services",
      title: "サービス・ログ（systemd）",
      description: "サービスの起動・停止・自動起動と、ログの確認。",
      items: [
        item(
          "systemctl-status",
          "状態を見る",
          "systemctl status nginx",
          "動いているか、直近のログとあわせて表示する。",
        ),
        item(
          "systemctl-restart",
          "起動・停止・再起動",
          "sudo systemctl start nginx / stop / restart",
          "サービスを起動・停止・再起動する。",
          "設定を読み直すだけなら reload（対応しているサービスのみ）。",
        ),
        item(
          "systemctl-enable",
          "自動起動にする",
          "sudo systemctl enable --now nginx",
          "OS の起動時に自動で起動するようにし、今すぐ起動もする。",
        ),
        item(
          "daemon-reload",
          "unit ファイルの変更を反映",
          "sudo systemctl daemon-reload",
          "サービスの定義ファイル（.service）を書き換えたあと、systemd に読み直させる。",
          "これをしないと、restart しても古い定義のまま起動する。変更後に警告が出るが、見逃しやすい。",
          "warning",
          ["systemd", "unit", "service"],
        ),
        item(
          "crontab",
          "定期的に実行する",
          "crontab -e\n# 分 時 日 月 曜日\n0 3 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1",
          "決まった時刻にコマンドを実行する設定を編集する。crontab -l で一覧する。",
          "cron の PATH は対話シェルと違うので、コマンドは絶対パスで書く。出力を捨てるとエラーに気付けないため、ログに残す。systemd timer でも同じことができ、journalctl でログを追える。",
          "info",
          ["cron", "定期実行", "スケジュール"],
        ),
        item(
          "systemctl-list",
          "サービス一覧",
          "systemctl list-units --type=service --state=running",
          "動いているサービスを一覧する。",
        ),
        item(
          "journalctl-follow",
          "ログを追いかける",
          "journalctl -u nginx -f",
          "サービスのログを、追記されるたびに表示する。",
          undefined,
          "info",
        ),
        item(
          "journalctl-since",
          "期間を絞ってログを見る",
          'journalctl -u nginx --since "1 hour ago"',
          "指定した時刻より後のログだけを表示する。",
          "-p err でエラー以上に絞れる。",
        ),
      ],
    },
    // ユーザーと環境変数。
    {
      id: "users-env",
      title: "ユーザー・環境変数",
      description: "ユーザーとグループの管理、環境変数の確認。",
      items: [
        item(
          "useradd",
          "ユーザーを作る",
          "sudo useradd -m -s /bin/bash alice",
          "ホームディレクトリ付きでユーザーを作る。",
        ),
        item("passwd", "パスワードを設定", "sudo passwd alice", "ユーザーのパスワードを設定する。"),
        item(
          "usermod-group",
          "グループに追加",
          "sudo usermod -aG docker alice",
          "既存のグループの所属を残したまま、グループに追加する。",
          "-a を付け忘れると、ほかのグループから外れる。反映にはログインし直す。",
          "warning",
        ),
        item("env", "環境変数の一覧", "env | sort", "今のシェルの環境変数を一覧する。"),
        item(
          "echo-path",
          "PATH を確認",
          "echo $PATH",
          "コマンドを探しに行くディレクトリの一覧を表示する。",
        ),
      ],
    },
  ],
};
