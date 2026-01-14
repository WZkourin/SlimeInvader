export default class GuiGameover
{
    constructor(context) 
    {
        this.context = context;

        //画像関係
        this.image = context.assets.get("dotStrings");


    }

    draw(ctx)
    {
        const showOffsetX = this.context.screen.baseWidth / 3;
        const showOffsetY = this.context.screen.baseHeight / 2;

        const stringCutSize = 44; //切り抜き時のスプライトサイズ
        const stringSize = stringCutSize / 3; //実際のスプライトサイズ

        //start文字列用の切り抜き場所
        let stringScoreRow = [];
        let stringScoreCol = [];

        //G:0, 6
        //A:0, 0
        //M:1, 4
        //E:0, 4

        //空白:0, 9

        //O:1, 6
        //V:2, 5
        //E:0, 4
        //R:2, 1

        stringScoreRow[0] = 0;
        stringScoreRow[1] = 0;
        stringScoreRow[2] = 1;
        stringScoreRow[3] = 0;
        stringScoreRow[4] = 0;
        stringScoreRow[5] = 1;
        stringScoreRow[6] = 2;
        stringScoreRow[7] = 0;
        stringScoreRow[8] = 2;

        stringScoreCol[0] = 6;
        stringScoreCol[1] = 0;
        stringScoreCol[2] = 4;
        stringScoreCol[3] = 4;
        stringScoreCol[4] = 9;
        stringScoreCol[5] = 6;
        stringScoreCol[6] = 5;
        stringScoreCol[7] = 4;
        stringScoreCol[8] = 1;

        //ゲームオーバー以外は描画しない
        if (this.context.sceneCurrent !== this.context.scenes.Gameover) { return; }

        for (let index = 0; index < stringScoreRow.length; index++) 
        {
            if (this.image)
            {
                // drawImage(
                // 画像,
                // 切り抜きX, 切り抜きY, 切り抜き幅, 切り抜き高さ,
                // 描画X, 描画Y, 描画幅, 描画高さ
                // )

                ctx.drawImage(this.image, 
                    stringScoreCol[index] * stringCutSize, stringScoreRow[index] * stringCutSize, stringCutSize, stringCutSize,
                showOffsetX + index * stringSize, showOffsetY, stringSize, stringSize);

            }
        }

    }




}


