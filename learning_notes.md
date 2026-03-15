# GitHub学習メモ

作成日: 2026-03-15
プロジェクト: snake-game

---

## フェーズ1：基本操作

```bash
git init                          # フォルダをGit管理下に置く
git config user.name "katakaku"   # 名前を設定
git config user.email "..."       # メールを設定
git add ファイル名                 # ステージング（コミット対象に追加）
git commit -m "メッセージ"         # 変更を記録
git remote add origin URL         # GitHubリポジトリと紐付け
git push -u origin main           # GitHubに送信（初回は -u が必要）
```

**ポイント**: `add` → `commit` → `push` がGitの基本サイクル。

---

## フェーズ2：ブランチとPull Request

```bash
git checkout -b ブランチ名         # ブランチ作成＆移動
git push -u origin ブランチ名      # ブランチをGitHubに送る
git checkout main                  # mainに戻る
git pull origin main               # GitHubの変更をローカルに取得
git branch -d ブランチ名           # ブランチ削除（ローカル）
```

**ブランチの考え方**:
- `main` は常に安全な状態を保つ
- 新機能はブランチを切って開発する
- Pull Request でレビュー → マージ → ブランチ削除

---

## フェーズ3：バグ修正と履歴操作

```bash
git log --oneline                  # コミット履歴を一覧表示
git show コミットID                 # 特定コミットの変更内容を見る
git diff HEAD~1 HEAD               # 直前のコミットとの差分を見る
```

**diff の見方**:
- `-` 赤い行 → 削除された行
- `+` 緑の行 → 追加された行

**コミットメッセージの慣習**:
| プレフィックス | 意味 |
|---|---|
| `feat:` | 新機能 |
| `fix:` | バグ修正 |
| `docs:` | ドキュメント |
| `style:` | デザイン変更 |
| `refactor:` | 動作変更なしのコード整理 |

---

## A: GitHub Pages で公開

Settings → Pages → Deploy from a branch → main / (root) → Save

公開URL: `https://ユーザー名.github.io/リポジトリ名/`

---

## C: git stash（作業の一時退避）

```bash
git stash save "メモ"              # 変更を一時保存してクリーンな状態に
git stash list                     # 保存リストを確認
git stash pop                      # 最新のstashを復元して削除
git stash drop                     # 復元せず捨てる
```

**使う場面**: 作業中に別の緊急対応が必要になったとき。

---

## B: コンフリクト解消

同じファイルの同じ行を2つのブランチで別々に編集するとコンフリクトが発生する。

```
<<<<<<< HEAD
    現在のブランチの内容
=======
    マージしようとしたブランチの内容
>>>>>>> ブランチ名
```

**解消手順**:
1. ファイルを開いて `<<<<` `====` `>>>>` を探す
2. 残したい内容に手動で書き直す（印をすべて消す）
3. `git add ファイル名`
4. `git commit`

---

## 全体の流れ（チーム開発の標準スタイル）

```
1. git checkout -b feature/xxx   # ブランチを切る
2. コードを書く
3. git add / commit              # こまめにコミット
4. git push                      # GitHubに送る
5. Pull Request を作成
6. レビュー → Merge
7. git pull origin main          # ローカルに反映 ※補足参照
8. git branch -d feature/xxx     # ブランチ削除
```

> **補足 — なぜ `git pull` が必要か**
> GitHubでのマージはブラウザ上の操作であり、ローカルには自動で届かない。
> ローカルの `main` はマージ前の状態で止まっているため、`git pull` で差分を取り込む必要がある。
>
> ```
> GitHub側  main: A → B → C → [Merge]   ← マージ済み
> ローカル側 main: A → B → C             ← git pull するまでここで止まっている
> ```
>
> 次の作業をすぐ始めない場合は一時的にスキップしても動くが、
> 「マージしたら pull で同期する」を習慣にするとローカルとGitHubのズレによるトラブルを防げる。

---

## Claude Code の便利な使い方

- 自然言語でGit操作を依頼できる（「前のコミットとの差分を見て」など）
- `/commit` コマンドでコミットメッセージを自動生成
- コードの説明・バグ修正・機能追加をチャットで依頼できる
- ファイルを開いた状態で「このファイルを修正して」と言うと文脈を理解してくれる
