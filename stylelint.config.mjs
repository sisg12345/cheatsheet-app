/**
 * Stylelint の設定。standard をベースに、この構成では機能しないルールだけ無効化している。
 */
const config = {
  extends: ["stylelint-config-standard"],
  rules: {
    // CSS Modules のクラス名は camelCase（tsx から styles.itemTitle で参照する）なので、
    // kebab-case を要求する既定のパターンは外す。
    "selector-class-pattern": null,
    // --sheet-accent のようにコンポーネント側で定義する変数があるため、命名規則は課さない。
    "custom-property-pattern": null,
    // 状態クラス（:hover や .compact）を後ろにまとめて書く方針と衝突するため無効化。
    "no-descending-specificity": null,
    // visuallyHidden で使う clip は非推奨扱いだが、対応範囲の広さから今も使っている。
    "property-no-deprecated": null,
  },
};

export default config;
