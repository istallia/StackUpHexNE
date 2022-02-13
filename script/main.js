/* --- タイトルシーンの作成 --- */
const main = param => {
    const scene = new g.Scene({
        game: g.game,
        assetIds: ["bgm-title", "title"]
    });
    scene.onLoad.add(() => {
        /* 各アセットオブジェクトを取得 */
        const bgmAsset        = scene.asset.getAudioById("bgm-title");
        const titleImageAsset = scene.asset.getImageById("title");
        /* BGMを再生(自動ループ) */
        const bgmPlayer = bgmAsset.play();
        bgmPlayer.changeVolume(0.5);
        /* 背景板を生成 */
        const background = new g.FilledRect({
            scene    : scene,
            x        : 0,
            y        : 0,
            width    : g.game.width,
            height   : g.game.height,
            cssColor : '#333'
        });
        scene.append(background);
        /* タイトル(背景)を生成 */
        const titleImage = new g.Sprite({
            scene  : scene,
            src    : titleImageAsset,
            x      : 0,
            y      : 0,
            width  : titleImageAsset.width,
            height : titleImageAsset.height
        });
        scene.append(titleImage);
    });
    g.game.pushScene(scene);
}
module.exports = main;
