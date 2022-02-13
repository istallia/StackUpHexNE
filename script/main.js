/* --- 設定項目の記憶を宣言 --- */
let configOrder = 0;
let configSize  = 5;



/* --- 最初にJoinしたプレイヤーを配信者とする --- */
let streamerPlayerId = null;
g.game.onJoin.add(event => {
    if (!streamerPlayerId) streamerPlayerId = event.player.id;
});



/* --- タイトルシーンの作成 --- */
const main = param => {
    const scene = new g.Scene({
        game: g.game,
        assetIds: [
            'bgm-title', 'title', 'font-corpround', 'font-corpround_glyphs',
            'button-left', 'button-right', 'button-start',
            'selection-streamer', 'selection-listener', 'selection-size5', 'selection-size7', 'selection-size9'
        ]
    });
    scene.onLoad.add(() => {
        /* 各アセットオブジェクトを取得 */
        const bgmAsset               = scene.asset.getAudioById('bgm-title');
        const titleImageAsset        = scene.asset.getImageById('title');
        const buttonLeftAsset        = scene.asset.getImageById('button-left');
        const buttonRightAsset       = scene.asset.getImageById('button-right');
        const buttonStartAsset       = scene.asset.getImageById('button-start');
        const selectionStreamerAsset = scene.asset.getImageById('selection-streamer');
        const selectionListenerAsset = scene.asset.getImageById('selection-listener');
        const selectionSize5Asset    = scene.asset.getImageById('selection-size5');
        const selectionSize7Asset    = scene.asset.getImageById('selection-size7');
        const selectionSize9Asset    = scene.asset.getImageById('selection-size9');
        /* フォントを取得 */
        const systemFont = new g.DynamicFont({
            game       : g.game,
            fontFamily : 'sans-serif',
            size       : 36
        });
        const corproundFontAsset      = scene.asset.getImageById('font-corpround');
        const corproundGlyphInfoAsset = scene.asset.getTextById('font-corpround_glyphs');
        const corproundGlyphInfo      = JSON.parse(corproundGlyphInfoAsset.data);
        const corproundFont           = new g.BitmapFont({
            src       : corproundFontAsset,
            glyphInfo : corproundGlyphInfo
        });
        /* 各カーソル位置を宣言 */
        let cursorOrder = 0;
        let cursorSize  = 0;
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

        /* 先攻後攻の左右ボタンを追加 */
        const menuX      = g.game.width * 3 / 4;
        const menuWidth  = selectionStreamerAsset.width;
        const menuY      = 256;
        const menuHeight = 104;
        const buttonOrderLeft = new g.Sprite({
            scene   : scene,
            src     : buttonLeftAsset,
            x       : menuX - (menuWidth + buttonLeftAsset.width) / 2,
            y       : menuY,
            width   : buttonLeftAsset.width,
            height  : buttonLeftAsset.height,
            anchorX : 0.5,
            anchorY : 0.5,
            local   : true
        });
        const buttonOrderRight = new g.Sprite({
            scene   : scene,
            src     : buttonRightAsset,
            x       : menuX + (menuWidth + buttonRightAsset.width) / 2,
            y       : menuY,
            width   : buttonRightAsset.width,
            height  : buttonRightAsset.height,
            anchorX : 0.5,
            anchorY : 0.5,
            local   : true
        });
        scene.append(buttonOrderLeft);
        scene.append(buttonOrderRight);
        /* 先攻後攻の項目を追加 */
        const orderSelections = [
            new g.Sprite({
                scene   : scene,
                src     : selectionStreamerAsset,
                x       : menuX,
                y       : menuY,
                width   : selectionStreamerAsset.width,
                height  : selectionStreamerAsset.height,
                anchorX : 0.5,
                anchorY : 0.5
            }),
            new g.Sprite({
                scene   : scene,
                src     : selectionListenerAsset,
                x       : menuX,
                y       : menuY,
                width   : selectionListenerAsset.width,
                height  : selectionListenerAsset.height,
                anchorX : 0.5,
                anchorY : 0.5,
                opacity : 0
            })
        ];
        scene.append(orderSelections[0]);
        scene.append(orderSelections[1]);

        /* サイズ設定の左右ボタンを追加 */
        const buttonSizeLeft = new g.Sprite({
            scene   : scene,
            src     : buttonLeftAsset,
            x       : menuX - (menuWidth + buttonLeftAsset.width) / 2,
            y       : menuY + menuHeight,
            width   : buttonLeftAsset.width,
            height  : buttonLeftAsset.height,
            anchorX : 0.5,
            anchorY : 0.5,
            local   : true
        });
        const buttonSizeRight = new g.Sprite({
            scene   : scene,
            src     : buttonRightAsset,
            x       : menuX + (menuWidth + buttonRightAsset.width) / 2,
            y       : menuY + menuHeight,
            width   : buttonRightAsset.width,
            height  : buttonRightAsset.height,
            anchorX : 0.5,
            anchorY : 0.5,
            local   : true
        });
        scene.append(buttonSizeLeft);
        scene.append(buttonSizeRight);
        /* サイズ設定の項目を追加 */
        const sizeSelections = [
            new g.Sprite({
                scene   : scene,
                src     : selectionSize5Asset,
                x       : menuX,
                y       : menuY + menuHeight,
                width   : selectionSize5Asset.width,
                height  : selectionSize5Asset.height,
                anchorX : 0.5,
                anchorY : 0.5
            }),
            new g.Sprite({
                scene   : scene,
                src     : selectionSize7Asset,
                x       : menuX,
                y       : menuY + menuHeight,
                width   : selectionSize7Asset.width,
                height  : selectionSize7Asset.height,
                anchorX : 0.5,
                anchorY : 0.5,
                opacity : 0
            }),
            new g.Sprite({
                scene   : scene,
                src     : selectionSize9Asset,
                x       : menuX,
                y       : menuY + menuHeight,
                width   : selectionSize9Asset.width,
                height  : selectionSize9Asset.height,
                anchorX : 0.5,
                anchorY : 0.5,
                opacity : 0
            })
        ];
        scene.append(sizeSelections[0]);
        scene.append(sizeSelections[1]);
        scene.append(sizeSelections[2]);

        /* 現在の参加人数を表示 */
        const messagePlayerCount = 'ただいまの参加者: {count}人';
        const labelPlayerCount   = new g.Label({
            scene     : scene,
            font      : corproundFont,
            text      : messagePlayerCount.replace('{count}', String(0)),
            fontSize  : 36,
            textColor : 'white',
            x         : menuX,
            y         : menuY + menuHeight * 2,
            anchorX   : 0.5,
            anchorY   : 0.5
        });
        scene.append(labelPlayerCount);

        /* 開始ボタンを表示 */
        const buttonStart = new g.Sprite({
            scene   : scene,
            src     : buttonStartAsset,
            x       : menuX,
            y       : menuY + menuHeight * 3,
            width   : buttonStartAsset.width,
            height  : buttonStartAsset.height,
            anchorX : 0.5,
            anchorY : 0.5
        });
        scene.append(buttonStart);
    });
    g.game.pushScene(scene);
}
module.exports = main;
