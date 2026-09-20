/**
 * Dockerチートシートのデータ。
 *
 * 表示側（components）はこの構造だけを見るので、ここに書いた順序がそのまま
 * 目次とページの並び順になる。項目は必ず helpers.ts の item() で生成する。
 *
 *   item(id, label, syntax, description, note?, status?, keywords?)
 *
 * - id はシート内で一意。目次のアンカー（#id）とReactのkeyに使われる
 * - status は normal / info / warning / danger。省略時は normal
 * - コンテナやボリュームのデータを戻せない形で消す操作（rm -f、volume rm、down -v、
 *   prune の一部）と、ホストの権限を渡す設定には必ず danger を付ける。
 *   バッジの色が唯一の警告表示になるため、付け忘れると危険が伝わらない
 * - 公開範囲や秘密情報の扱いなど、事故につながりやすい操作には warning を付ける
 * - コマンドは Docker Engine の CLI と Compose V2（docker compose）の書き方で統一する。
 *   例の名前は、コンテナ web、ネットワーク app-net、ボリューム db-data にそろえる
 * - prune の削除対象や Docker Desktop 専用の機能など、変わりやすい記述は
 *   公式ドキュメントで確認済み（2026-09-16）。直すときも公式ドキュメントに合わせる
 * - keywords は検索用の別名。全角/半角・大文字小文字は normalizeSearch が吸収する
 * - 内容を直したら updatedAt も更新する
 * - セクション・項目を増減したら summary.ts の件数も直す（tests/unit/registry.test.ts が突き合わせる）
 */
import { item } from "../helpers";
import type { CheatSheetContent } from "../types";

export const dockerContent: CheatSheetContent = {
  id: "docker-reference",
  updatedAt: "2026-09-20",
  sources: [
    { label: "Docker CLI リファレンス", url: "https://docs.docker.com/reference/cli/docker/" },
    { label: "Dockerfile リファレンス", url: "https://docs.docker.com/reference/dockerfile/" },
    {
      label: "Compose ファイルリファレンス",
      url: "https://docs.docker.com/reference/compose-file/",
    },
  ],
  sections: [
    // 動作確認と、ログイン・接続先の切り替え。
    {
      id: "basics",
      title: "基本・確認",
      description: "環境の確認、レジストリへのログイン、接続先の切り替え。",
      items: [
        item(
          "version",
          "バージョン確認",
          "docker version",
          "クライアントとエンジン（Server）のバージョンを表示する。",
          "Server が表示されなければ、Docker デーモンが起動していない。",
        ),
        item(
          "info",
          "環境の詳細",
          "docker info",
          "コンテナ数、ストレージドライバー、使えるリソースなどを表示する。",
        ),
        item("help", "ヘルプ", "docker <command> --help", "コマンドごとのオプションを表示する。"),
        item(
          "login",
          "レジストリにログイン",
          "docker login ghcr.io",
          "イメージの push / pull に使うレジストリへ認証する。",
          "レジストリを省くと Docker Hub。ログアウトは docker logout。",
        ),
        item(
          "context",
          "接続先を切り替え",
          "docker context ls / docker context use <name>",
          "操作する Docker エンジンを一覧表示・切り替えする。",
        ),
        item(
          "system-df",
          "ディスク使用量",
          "docker system df",
          "イメージ・コンテナ・ボリューム・ビルドキャッシュの使用量を表示する。",
          "-v を付けると項目ごとの内訳も表示する。",
        ),
        item(
          "init",
          "ひな形を作る",
          "docker init",
          "Dockerfile・compose.yaml・.dockerignore などを対話形式で生成する。",
          "Docker Desktop に含まれるコマンド。",
        ),
      ],
    },
    // docker run のオプション。公開範囲（-p）は事故になりやすいので warning を付ける。
    {
      id: "run",
      title: "コンテナの起動",
      description: "docker run はイメージからコンテナを作り、そのまま起動する。",
      items: [
        item(
          "run",
          "コンテナを起動",
          "docker run hello-world",
          "イメージからコンテナを作成して起動する。",
          "ローカルにイメージが無ければ、自動で pull する。",
        ),
        item(
          "run-detached",
          "バックグラウンドで起動",
          "docker run -d --name web -p 8080:80 nginx",
          "名前を付けてバックグラウンドで起動し、ホストの 8080 番をコンテナの 80 番へつなぐ。",
          undefined,
          "info",
        ),
        item(
          "publish-localhost",
          "自分のPCからだけ接続させる",
          "docker run -d -p 127.0.0.1:8080:80 nginx",
          "ホスト側の IP を指定して、ローカルからの接続だけを受け付ける。",
          "IP を省くと全インターフェイスで公開され、UFW などで塞いだポートでも外から届く。",
          "warning",
        ),
        item(
          "run-interactive",
          "対話シェルで使い捨て",
          "docker run -it --rm ubuntu bash",
          "端末をつないで起動し、終了したらコンテナを自動で削除する。",
        ),
        item(
          "run-env",
          "環境変数を渡す",
          "docker run -e NODE_ENV=production --env-file .env app",
          "環境変数を1つずつ、またはファイルからまとめて渡す。",
          "渡した値は docker inspect で見えるので、秘密情報の扱いに注意する。",
        ),
        item(
          "run-mount-workdir",
          "手元のコードで実行",
          'docker run --rm -v "$(pwd)":/app -w /app node:22-alpine npm test',
          "カレントディレクトリをマウントし、作業ディレクトリを指定してコマンドを実行する。",
        ),
        item(
          "run-restart",
          "自動で再起動",
          "docker run -d --restart unless-stopped app",
          "異常終了や Docker の再起動のあとに、自動で起動し直す。",
          "手動で停止したコンテナは起動し直さない。",
        ),
        item(
          "run-network",
          "ネットワークを指定",
          "docker run -d --network app-net --name api app",
          "指定したネットワークに参加させて起動する。",
        ),
        item(
          "run-entrypoint",
          "エントリーポイントを差し替え",
          "docker run --rm -it --entrypoint sh app",
          "イメージ既定の起動コマンドを使わず、シェルで入る。",
          "起動してすぐ終了するイメージの中を調べるときに使う。",
        ),
        item(
          "run-user",
          "実行ユーザーを指定",
          "docker run --user 1000:1000 app",
          "UID:GID を指定してプロセスを実行する。",
          "マウントしたファイルの所有者をホストと合わせたいときに使う。",
        ),
        item(
          "run-platform",
          "CPU アーキテクチャを指定",
          "docker run --platform linux/amd64 app",
          "amd64 / arm64 など、どのアーキテクチャのイメージを使うかを明示して起動する。",
          "ホストと異なるアーキテクチャはエミュレーションで動くため遅くなる。",
        ),
        item(
          "run-resources",
          "リソースを制限",
          "docker run --memory 512m --cpus 1.5 app",
          "使えるメモリと CPU の量に上限を設ける。",
        ),
      ],
    },
    // 起動後の確認と操作。rm -f はデータを戻せないので danger、kill は warning。
    {
      id: "containers",
      title: "コンテナの操作",
      description: "コンテナの状態を確認し、ログやシェルで中を調べる。",
      items: [
        item(
          "ps",
          "コンテナ一覧",
          "docker ps",
          "実行中のコンテナを表示する。",
          "停止中も含めるなら docker ps -a。",
        ),
        item(
          "stop-start",
          "停止・起動・再起動",
          "docker stop web / docker start web / docker restart web",
          "コンテナを止める・起動する・再起動する。",
          "stop は SIGTERM を送り、既定で10秒待ってから強制終了する。",
        ),
        item(
          "logs",
          "ログを見る",
          "docker logs -f --tail 100 web",
          "直近100行を表示し、そのあとのログを追いかける。",
          "時刻を付けるなら -t。",
        ),
        item(
          "exec",
          "中でコマンドを実行",
          "docker exec -it web sh",
          "実行中のコンテナでシェルを開く。",
          "bash が入っていないイメージでは sh を使う。",
          "info",
        ),
        item(
          "rm",
          "コンテナを削除",
          "docker rm web",
          "停止したコンテナを削除する。",
          "ボリューム以外に書き込んだデータも一緒に消える。",
        ),
        item(
          "rm-force",
          "実行中でも強制削除",
          "docker rm -f web",
          "実行中のコンテナを強制終了して削除する。",
          "コンテナ内の、ボリュームに置いていないデータは戻せない。",
          "danger",
        ),
        item(
          "kill",
          "即座に停止",
          "docker kill web",
          "SIGKILL を送り、終了処理を待たずに止める。",
          "書き込み途中のデータが壊れることがある。まず docker stop を使う。",
          "warning",
        ),
        item(
          "cp",
          "ファイルをコピー",
          "docker cp web:/app/logs/app.log ./app.log",
          "コンテナとホストの間でファイルをコピーする。",
          "ホストからコンテナへは docker cp ./config.json web:/app/。",
        ),
        item(
          "inspect",
          "詳細を JSON で見る",
          "docker inspect web",
          "設定・状態・マウント・ネットワークなどの詳細を表示する。",
        ),
        item(
          "inspect-format",
          "必要な値だけ取り出す",
          "docker inspect -f '{{.State.Status}}' web",
          "Go テンプレートで、必要な項目だけを表示する。",
          "{{json .Mounts}} のように json を付けると、入れ子の値も読みやすい。",
        ),
        item(
          "stats",
          "リソース使用量",
          "docker stats",
          "コンテナごとの CPU・メモリ・ネットワーク使用量をリアルタイムで表示する。",
          "一度だけ表示するなら --no-stream。",
        ),
        item("top", "プロセス一覧", "docker top web", "コンテナ内で動いているプロセスを表示する。"),
        item(
          "port",
          "公開ポートを確認",
          "docker port web",
          "コンテナのポートが、ホストのどこに公開されているかを表示する。",
        ),
      ],
    },
    // イメージの取得・命名・共有。タグは中身が変わりうるので、固定するならダイジェスト。
    {
      id: "images",
      title: "イメージ・配布",
      description: "イメージの取得、タグ付け、レジストリへの公開、削除。",
      items: [
        item(
          "pull",
          "イメージを取得",
          "docker pull node:22-alpine",
          "レジストリからイメージをダウンロードする。",
          "タグを省くと latest になる。",
        ),
        item(
          "image-ls",
          "イメージ一覧",
          "docker image ls",
          "ローカルにあるイメージを表示する。",
          "docker images でも同じ。",
        ),
        item(
          "tag",
          "タグを付ける",
          "docker tag app:latest ghcr.io/example/app:1.2.0",
          "既存のイメージに、別の名前とタグを付ける。",
          "レジストリへ push するときは、レジストリ名を含む名前にする。",
        ),
        item(
          "push",
          "イメージを公開",
          "docker push ghcr.io/example/app:1.2.0",
          "イメージをレジストリへアップロードする。",
          "事前に docker login しておく。",
        ),
        item(
          "rmi",
          "イメージを削除",
          "docker image rm app:old",
          "ローカルのイメージを削除する。",
          "コンテナが使っているイメージは削除できない。docker rmi でも同じ。",
        ),
        item(
          "history",
          "レイヤーを確認",
          "docker history app:1.2.0",
          "レイヤーごとのサイズと、作成した命令を表示する。",
          "イメージが大きくなった原因を探すときに使う。",
        ),
        item(
          "image-inspect",
          "イメージの詳細",
          "docker image inspect app:1.2.0",
          "環境変数・起動コマンド・アーキテクチャなどを表示する。",
        ),
        item(
          "save-load",
          "ファイルで受け渡す",
          "docker save -o app.tar app:1.2.0 / docker load -i app.tar",
          "レジストリを使わずに、イメージを tar ファイルへ書き出す・読み込む。",
        ),
        item(
          "pull-digest",
          "ダイジェストで固定",
          "docker pull node:22-alpine@sha256:<digest>",
          "タグではなくダイジェストを指定して、中身が変わらないイメージを取得する。",
          "同じタグでも、中身は更新されることがある。",
          "info",
        ),
      ],
    },
    // Dockerfile の命令。キャッシュが効く順序と、秘密情報を残さない書き方が要点。
    {
      id: "dockerfile",
      title: "Dockerfile",
      description: "イメージの作り方を書くファイル。変更の少ない命令ほど上に置く。",
      items: [
        item(
          "syntax-directive",
          "構文バージョンを指定",
          "# syntax=docker/dockerfile:1",
          "先頭に書いて、使う Dockerfile 構文のバージョンを指定する。",
          "RUN --mount などの BuildKit の機能を使うときに書く。",
        ),
        item(
          "from",
          "ベースイメージ",
          "FROM node:22-alpine",
          "元にするイメージを指定する。",
          "latest ではなくバージョンを指定すると、ビルド結果が変わりにくい。",
          "info",
        ),
        item(
          "workdir",
          "作業ディレクトリ",
          "WORKDIR /app",
          "以降の命令と、コンテナ起動時の作業ディレクトリを設定する。",
          "ディレクトリが無ければ作られる。",
        ),
        item(
          "copy",
          "ファイルをコピー",
          "COPY package.json package-lock.json ./",
          "ビルドコンテキストのファイルを、イメージへコピーする。",
          "URL からの取得や tar の展開が要るとき以外は、ADD ではなく COPY を使う。",
        ),
        item(
          "run-instruction",
          "コマンドを実行",
          "RUN npm ci",
          "ビルド時にコマンドを実行し、結果をレイヤーとして残す。",
          "依存関係のファイルだけを先に COPY して RUN すると、コードを変えてもキャッシュが効く。",
        ),
        item(
          "env",
          "環境変数",
          "ENV NODE_ENV=production",
          "ビルド中とコンテナ実行時の両方で使う環境変数を設定する。",
        ),
        item(
          "arg",
          "ビルド引数",
          "ARG APP_VERSION",
          "docker build --build-arg で受け取る、ビルド時だけの変数。",
          "値は docker history で見えるので、秘密情報を渡さない。",
          "warning",
        ),
        item(
          "expose",
          "使うポートを記載",
          "EXPOSE 3000",
          "コンテナが待ち受けるポートを記載する。",
          "これだけではホストに公開されない。公開は docker run -p で行う。",
        ),
        item(
          "cmd",
          "起動コマンド",
          'CMD ["npm", "run", "start"]',
          "コンテナ起動時に実行する、既定のコマンド。",
          "JSON 配列（exec 形式）で書くと、停止のシグナルがアプリに届く。",
          "info",
        ),
        item(
          "entrypoint",
          "エントリーポイント",
          'ENTRYPOINT ["docker-entrypoint.sh"]',
          "コンテナで必ず実行するコマンドを指定する。",
          "CMD はこのコマンドの引数になり、docker run に渡した引数で差し替えられる。",
        ),
        item(
          "user",
          "実行ユーザー",
          "USER node",
          "以降の命令とコンテナ内のプロセスを、root 以外のユーザーで実行する。",
          undefined,
          "info",
        ),
        item(
          "healthcheck",
          "ヘルスチェック",
          "HEALTHCHECK --interval=30s CMD wget -q -O - http://127.0.0.1:3000/ || exit 1",
          "定期的にコマンドを実行し、コンテナが正常に動いているかを判定する。",
          "結果は docker ps の STATUS に healthy / unhealthy と表示される。",
        ),
        item(
          "cache-mount",
          "キャッシュマウント",
          "RUN --mount=type=cache,target=/root/.npm npm ci",
          "パッケージのダウンロードキャッシュを、ビルドをまたいで再利用する。",
          "キャッシュはイメージには含まれない。",
        ),
        item(
          "secret-mount",
          "秘密情報をマウント",
          "RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci",
          "ビルド中だけ秘密情報のファイルをマウントする。イメージには残らない。",
          "値は docker build --secret で渡す。",
          "info",
        ),
        item(
          "multi-stage",
          "マルチステージビルド",
          `FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html`,
          "ビルド用と実行用のステージを分け、成果物だけを最終イメージに入れる。",
          "開発用のツールやソースを含まないので、イメージが小さく安全になる。",
          "info",
        ),
        item(
          "dockerignore",
          ".dockerignore",
          "node_modules\ndist\n.git\n.env",
          "ビルドコンテキストから除外するファイルを書く。",
          ".env などの秘密情報がイメージに入るのを防ぎ、ビルドも速くなる。",
        ),
      ],
    },
    // docker build のオプション。
    {
      id: "build",
      title: "ビルド",
      description: "Dockerfile からイメージを作る。キャッシュと引数の渡し方を押さえる。",
      items: [
        item(
          "build",
          "イメージをビルド",
          "docker build -t app:1.0 .",
          "カレントディレクトリの Dockerfile からイメージを作り、名前とタグを付ける。",
          "最後の . はビルドコンテキスト（COPY できる範囲）。",
        ),
        item(
          "build-file",
          "Dockerfile を指定",
          "docker build -f docker/Dockerfile.prod -t app:prod .",
          "別の場所・名前の Dockerfile を使ってビルドする。",
        ),
        item(
          "build-target",
          "途中のステージまでビルド",
          "docker build --target build -t app:build .",
          "マルチステージのうち、指定したステージまでをビルドする。",
        ),
        item(
          "build-arg",
          "ビルド引数を渡す",
          "docker build --build-arg APP_VERSION=1.2.0 -t app:1.2.0 .",
          "Dockerfile の ARG に値を渡す。",
        ),
        item(
          "no-cache",
          "キャッシュを使わない",
          "docker build --no-cache -t app .",
          "すべての命令を、キャッシュを使わずに実行し直す。",
          "時間がかかるので、キャッシュが原因と疑われるときに使う。",
        ),
        item(
          "progress-plain",
          "ログを省略せずに表示",
          "docker build --progress=plain .",
          "各命令の出力をすべて表示する。",
          "RUN が失敗した原因を調べるときに使う。",
        ),
        item(
          "build-secret",
          "秘密情報を渡す",
          "docker build --secret id=npmrc,src=$HOME/.npmrc -t app .",
          "Dockerfile の RUN --mount=type=secret にファイルを渡す。",
          "ARG や ENV と違い、イメージの履歴に残らない。",
          "info",
        ),
        item(
          "buildx-multi-platform",
          "複数アーキテクチャ向けにビルド",
          "docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/example/app:1.2.0 --push .",
          "amd64 と arm64 のイメージをまとめて作り、レジストリへ push する。",
          "Docker Desktop なら標準で使える。Engine では containerd イメージストアか docker-container ドライバーが必要。",
        ),
      ],
    },
    // データの置き場所。-v と --mount の違い（ホスト側が無いとき）を note に残す。
    {
      id: "volumes",
      title: "ボリューム・マウント",
      description: "コンテナを消しても残したいデータは、ボリュームかバインドマウントに置く。",
      items: [
        item(
          "named-volume",
          "名前付きボリューム",
          "docker run -d -e POSTGRES_PASSWORD=example -v db-data:/var/lib/postgresql/data postgres:16",
          "Docker が管理する領域にデータを永続化する。",
          "コンテナを削除してもボリュームは残る。",
          "info",
        ),
        item(
          "bind-mount",
          "バインドマウント",
          'docker run -v "$(pwd)":/app app',
          "ホストのディレクトリを、コンテナにマウントする。",
          "ホスト側のパスが無いと、ディレクトリとして自動で作られる。",
        ),
        item(
          "mount-flag",
          "--mount で明示的に書く",
          'docker run --mount type=bind,src="$(pwd)",dst=/app app',
          "マウントの種類と場所を、キーと値で明示する。",
          "-v と違い、ホスト側のパスが無いとエラーになる。",
        ),
        item(
          "read-only-mount",
          "読み取り専用でマウント",
          'docker run -v "$(pwd)/config":/etc/app:ro app',
          "末尾に :ro を付けて、コンテナから書き込めないようにする。",
        ),
        item(
          "volume-manage",
          "ボリュームの作成・一覧・詳細",
          "docker volume create db-data / docker volume ls / docker volume inspect db-data",
          "ボリュームを作成・一覧表示・詳細表示する。",
          "inspect の Mountpoint で保存場所を確認できる。",
        ),
        item(
          "volume-rm",
          "ボリュームを削除",
          "docker volume rm db-data",
          "ボリュームを、中のデータごと削除する。",
          "削除したデータは戻せない。",
          "danger",
        ),
        item(
          "volume-backup",
          "ボリュームをバックアップ",
          'docker run --rm -v db-data:/data -v "$(pwd)":/backup alpine tar czf /backup/db-data.tgz -C /data .',
          "一時的なコンテナで、ボリュームの中身を tar に固めてホストへ保存する。",
          "DB は停止してから取るか、DB 付属のダンプ機能を使う。",
          "info",
        ),
        item(
          "tmpfs",
          "メモリ上の一時領域",
          "docker run --tmpfs /tmp app",
          "コンテナの停止で消える一時ディレクトリを、メモリ上に作る。",
        ),
      ],
    },
    // コンテナ同士・ホストとの接続。既定の bridge では名前解決できない点が要点。
    {
      id: "network",
      title: "ネットワーク",
      description: "コンテナ同士はユーザー定義ネットワークに入れ、コンテナ名で接続する。",
      items: [
        item("network-ls", "ネットワーク一覧", "docker network ls", "ネットワークを一覧表示する。"),
        item(
          "network-create",
          "ネットワークを作成",
          "docker network create app-net",
          "コンテナ同士をつなぐブリッジネットワークを作る。",
        ),
        item(
          "network-join",
          "ネットワークに参加して起動",
          "docker run -d --network app-net --name db -e POSTGRES_PASSWORD=example postgres:16",
          "作成したネットワークに、コンテナを参加させて起動する。",
        ),
        item(
          "container-dns",
          "コンテナ名で接続",
          "postgres://postgres:example@db:5432/postgres",
          "同じユーザー定義ネットワークの中では、コンテナ名をホスト名として使える。",
          "既定の bridge ネットワークでは、名前で接続できない。",
          "info",
        ),
        item(
          "network-connect",
          "後からつなぐ・外す",
          "docker network connect app-net web / docker network disconnect app-net web",
          "起動中のコンテナを、ネットワークに追加・削除する。",
        ),
        item(
          "network-inspect",
          "ネットワークの詳細",
          "docker network inspect app-net",
          "サブネットと、参加しているコンテナを表示する。",
        ),
        item(
          "host-docker-internal",
          "コンテナからホストへ接続",
          "http://host.docker.internal:3000",
          "ホストで動いているサービスに、コンテナから接続する。",
          "Docker Desktop ではそのまま使える。Linux では docker run に --add-host=host.docker.internal:host-gateway を付ける。",
        ),
        item(
          "network-rm",
          "ネットワークを削除",
          "docker network rm app-net",
          "ネットワークを削除する。",
          "参加しているコンテナがあると削除できない。",
        ),
      ],
    },
    // 複数サービスの一括操作。down -v はボリュームのデータを消すので danger。
    {
      id: "compose",
      title: "Docker Compose",
      description: "compose.yaml に書いた複数のサービスを、まとめて起動・停止する。",
      items: [
        item(
          "compose-example",
          "compose.yaml の例",
          `services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:example@db:5432/postgres
    depends_on:
      - db
  db:
    image: postgres:16
    environment:
      - POSTGRES_PASSWORD=example
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:`,
          "アプリと DB の2つのサービスを定義し、DB のデータを名前付きボリュームに残す。",
          "サービス名（db）がそのままホスト名になる。パスワードは開発用の例。",
        ),
        item(
          "compose-up",
          "まとめて起動",
          "docker compose up -d",
          "定義したサービスを、バックグラウンドでまとめて起動する。",
          "ネットワークやボリュームも、必要に応じて作られる。",
          "info",
        ),
        item(
          "compose-up-build",
          "ビルドしてから起動",
          "docker compose up -d --build",
          "イメージをビルドし直してから起動する。",
          "Dockerfile やソースを変更したときに使う。",
        ),
        item(
          "compose-depends-healthy",
          "依存先が受付可能になるまで待つ",
          `depends_on:
  db:
    condition: service_healthy`,
          "依存するサービスのヘルスチェックが healthy になってから起動する。",
          "素の depends_on はコンテナが起動しただけで次へ進むため、DB がまだ接続を受け付けず、アプリが起動直後に落ちる。待たせる側（db）に HEALTHCHECK が要る。docker compose up --wait を使うと、コマンド自体も healthy になるまで戻らない。",
          "info",
          ["depends_on", "healthcheck", "起動順"],
        ),
        item(
          "compose-down",
          "停止して片付け",
          "docker compose down",
          "コンテナを停止して、コンテナとネットワークを削除する。",
          "ボリュームとイメージは残る。",
        ),
        item(
          "compose-down-volumes",
          "ボリュームも削除",
          "docker compose down -v",
          "コンテナとネットワークに加えて、ボリュームも削除する。",
          "compose.yaml で定義した名前付きボリュームも消え、DB のデータは戻せない。",
          "danger",
        ),
        item(
          "compose-ps",
          "状態を確認",
          "docker compose ps",
          "このプロジェクトのコンテナの状態を表示する。",
        ),
        item(
          "compose-logs",
          "ログを見る",
          "docker compose logs -f app",
          "サービスのログを追いかける。",
          "サービス名を省くと、全サービスのログをまとめて表示する。",
        ),
        item(
          "compose-exec",
          "中でコマンドを実行",
          "docker compose exec app sh",
          "起動中のサービスのコンテナで、シェルを開く。",
        ),
        item(
          "compose-run",
          "一回だけ実行",
          "docker compose run --rm app npm test",
          "新しいコンテナで一回限りのコマンドを実行し、終了後に削除する。",
        ),
        item(
          "compose-restart",
          "再起動・停止",
          "docker compose restart app / docker compose stop app",
          "サービスを再起動する・コンテナを残したまま停止する。",
          "restart では compose.yaml の変更は反映されない。反映するには up -d を使う。",
        ),
        item(
          "compose-build-pull",
          "ビルド・取得だけ行う",
          "docker compose build / docker compose pull",
          "起動はせずに、イメージのビルド・取得だけを行う。",
        ),
        item(
          "compose-config",
          "最終的な設定を確認",
          "docker compose config",
          "変数の展開やファイルの重ね合わせを反映した設定を表示する。",
          "YAML の誤りや、変数の設定漏れを見つけるときに使う。",
          "info",
        ),
        item(
          "compose-profile",
          "プロファイルで切り替え",
          "docker compose --profile production up -d",
          "profiles を指定したサービスを、明示したときだけ起動する。",
        ),
        item(
          "compose-override",
          "設定ファイルを重ねる",
          "docker compose -f compose.yaml -f compose.prod.yaml up -d",
          "後に指定したファイルの内容で設定を上書きして起動する。",
          "-f を省くと、compose.override.yaml があれば自動で重ねられる。",
        ),
        item(
          "compose-variables",
          "変数と既定値",
          'image: "ghcr.io/example/app:${TAG:-latest}"',
          "環境変数や .env の値を埋め込み、未設定なら既定値を使う。",
        ),
        item(
          "compose-watch",
          "変更を自動で反映",
          "docker compose watch",
          "ファイルの変更を検知して、コンテナへの同期や再ビルドを自動で行う。",
          "compose.yaml の develop.watch に、対象の path と action（sync / rebuild / sync+restart）を書く。",
        ),
      ],
    },
    // prune の削除範囲。ボリュームを消すもの（volume prune、-a --volumes）は danger。
    {
      id: "cleanup",
      title: "後片付け",
      description: "prune は使われていないものをまとめて消す。何が消えるかを確かめてから実行する。",
      items: [
        item(
          "container-prune",
          "停止中のコンテナを削除",
          "docker container prune",
          "停止しているコンテナをすべて削除する。",
          "コンテナの中に書き込んだデータも消える。",
          "warning",
        ),
        item(
          "image-prune",
          "タグの無いイメージを削除",
          "docker image prune",
          "どのタグにも属さない（dangling）イメージを削除する。",
        ),
        item(
          "image-prune-all",
          "未使用のイメージを全削除",
          "docker image prune -a",
          "コンテナから使われていないイメージを、すべて削除する。",
          "次に使うときは pull やビルドのやり直しが必要になる。",
          "warning",
        ),
        item(
          "prune-filter",
          "古いものだけ削除",
          'docker image prune -a --filter "until=168h"',
          "指定した時間より前に作られたものだけを削除する。",
          "168h は7日。",
          "info",
        ),
        item(
          "volume-prune",
          "未使用のボリュームを削除",
          "docker volume prune",
          "どのコンテナからも使われていない匿名ボリュームを削除する。",
          "-a を付けると名前付きボリュームも削除され、データは戻せない。",
          "danger",
        ),
        item(
          "builder-prune",
          "ビルドキャッシュを削除",
          "docker builder prune",
          "ビルドキャッシュを削除してディスクを空ける。",
          "次のビルドはキャッシュが無いぶん時間がかかる。",
        ),
        item(
          "log-rotation",
          "ログの肥大を防ぐ",
          "docker run --log-opt max-size=10m --log-opt max-file=3 app",
          "既定の json-file ドライバーのログを、大きさと世代数で回す。",
          "既定では上限が無く、長く動かすコンテナのログがディスクを埋める。docker system df には出てこないので気付きにくい。全体に効かせるなら daemon.json の log-opts、Compose なら services 配下の logging に書く。",
          "warning",
          ["ログ", "ディスク", "log-opt"],
        ),
        item(
          "system-prune",
          "まとめて削除",
          "docker system prune",
          "停止中のコンテナ、未使用のネットワーク、dangling イメージ、ビルドキャッシュを削除する。",
          "ボリュームは削除されない。",
          "warning",
        ),
        item(
          "system-prune-all",
          "未使用のものを徹底的に削除",
          "docker system prune -a --volumes",
          "未使用のイメージすべてと、匿名ボリュームまで含めて削除する。",
          "消したイメージやデータは戻せない。名前付きボリュームは docker volume prune -a で削除する。",
          "danger",
        ),
      ],
    },
    // 権限を絞る設定と、権限を渡してしまう設定（--privileged、docker.sock）。
    {
      id: "security",
      title: "セキュリティ",
      description: "必要最小限の権限で動かし、秘密情報をイメージに残さない。",
      items: [
        item(
          "non-root-user",
          "root 以外で実行",
          "USER node",
          "Dockerfile で、コンテナの実行ユーザーを root 以外にする。",
          "脆弱性を突かれたときの被害を小さくできる。",
          "info",
        ),
        item(
          "check-image-secrets",
          "秘密情報が残っていないか確認",
          "docker history --no-trunc app:1.2.0",
          "各レイヤーの命令を省略せずに表示し、ENV や ARG に秘密情報が無いか確かめる。",
          "秘密情報は、ビルド時なら --secret、実行時なら環境変数や Compose の secrets で渡す。",
          "warning",
        ),
        item(
          "read-only-rootfs",
          "ファイルシステムを読み取り専用に",
          "docker run --read-only --tmpfs /tmp app",
          "ルートファイルシステムへの書き込みを禁止し、必要な書き込み先だけを tmpfs で用意する。",
        ),
        item(
          "cap-drop",
          "Linux の権限を削る",
          "docker run --cap-drop ALL --cap-add NET_BIND_SERVICE app",
          "capability をすべて外し、必要なものだけを戻す。",
        ),
        item(
          "no-new-privileges",
          "権限の昇格を防ぐ",
          "docker run --security-opt no-new-privileges app",
          "setuid などで、プロセスが権限を増やせないようにする。",
        ),
        item(
          "privileged",
          "特権モード",
          "docker run --privileged app",
          "ホストのデバイスへのアクセスを含む、ほぼすべての権限をコンテナに与える。",
          "コンテナの隔離がほぼ無くなる。必要な権限だけを --cap-add で与える。",
          "danger",
        ),
        item(
          "docker-sock",
          "Docker ソケットのマウント",
          "-v /var/run/docker.sock:/var/run/docker.sock",
          "コンテナから、ホストの Docker を操作できるようにする。",
          "ホストの root 権限を渡すのと同じ。信頼できるイメージ以外には使わない。",
          "danger",
        ),
        item(
          "scout-cves",
          "脆弱性をスキャン",
          "docker scout cves app:1.2.0",
          "イメージに含まれるパッケージの、既知の脆弱性を一覧表示する。",
          "Docker Desktop に同梱。Engine だけの環境では別途インストールする。",
        ),
      ],
    },
    // 症状から引く。label は症状、syntax は最初に試すコマンド。
    {
      id: "trouble",
      title: "トラブル対応",
      description: "まずログと状態を見て、どこで失敗しているかを切り分ける。",
      items: [
        item(
          "exits-immediately",
          "起動してすぐ終了する",
          "docker logs web",
          "終了したコンテナにもログは残るので、まず原因を確認する。",
          "docker ps -a の STATUS に終了コードが表示される。",
        ),
        item(
          "port-in-use",
          "ポートが使用中",
          "docker ps --filter publish=8080",
          "そのポートを公開しているコンテナを探す。",
          "見つからなければ、Docker 以外のプロセスが使っていないかホスト側で確認する。",
        ),
        item(
          "debug-shell",
          "イメージの中を調べる",
          "docker run --rm -it --entrypoint sh app",
          "起動コマンドを使わずにシェルで入り、ファイルや設定を確認する。",
        ),
        item(
          "health-status",
          "ヘルスチェックの結果",
          "docker inspect -f '{{json .State.Health}}' web",
          "ヘルスチェックの状態と、直近の実行結果を表示する。",
        ),
        item(
          "events",
          "イベントを監視",
          "docker events",
          "コンテナの起動・終了・再起動などをリアルタイムで表示する。",
          "再起動を繰り返しているときの確認に使う。",
        ),
        item(
          "disk-full",
          "ディスクが足りない",
          "docker system df",
          "何が容量を使っているかを確認してから、prune で片付ける。",
        ),
        item(
          "stale-build",
          "変更がビルドに反映されない",
          "docker build --no-cache -t app .",
          "キャッシュを使わずにビルドし直す。",
          ".dockerignore で必要なファイルを除外していないかも確認する。",
        ),
        item(
          "compose-config-check",
          "Compose の設定がおかしい",
          "docker compose config",
          "展開後の設定を表示し、変数や上書きの結果を確認する。",
        ),
        item(
          "permission-denied",
          "権限エラー（Linux）",
          "sudo usermod -aG docker $USER",
          "ユーザーを docker グループに追加し、sudo なしで docker を使えるようにする。",
          "反映にはログインし直す。docker グループは root と同等の権限を持つ。",
          "warning",
        ),
        item(
          "exec-format-error",
          "exec format error",
          "docker run --platform linux/amd64 app",
          "イメージとホストの CPU アーキテクチャが合っていないので、プラットフォームを指定する。",
          "自分でビルドするなら、buildx で対象のアーキテクチャ向けにビルドする。",
        ),
      ],
    },
  ],
};
