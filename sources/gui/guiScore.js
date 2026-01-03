

export default class GuiScore 
{
    constructor(context) 
    {
        this.context = context;

        this.score = 0;
        this.scoreLimit = 99999999;

        //画像関係
        this.image = context.assets.get("dotStrings");


    }

    //スコアを増やす
    addScore(value)
    {
        //最高スコア以上は増やさない
        if (this.score < this.scoreLimit) { this.score += value; }    
    }

    //スコアリセット
    resetScore()
    {
        this.score = 0;
    }

    update()
    {
    }

    draw(ctx)
    {
        const showOffsetX = 10;
        const showOffsetY = 10;

        const stringCutSize = 44; //切り抜き時のスプライトサイズ
        const stringSize = stringCutSize / 3; //実際のスプライトサイズ

        //スコア文字列用の切り抜き場所
        let stringScoreRow = [];
        let stringScoreCol = [];

        //S:2, 2
        //C:0, 2
        //O:1, 6
        //R:2, 1
        //E:0, 4

        stringScoreRow[0] = 2;
        stringScoreRow[1] = 0;
        stringScoreRow[2] = 1;
        stringScoreRow[3] = 2;
        stringScoreRow[4] = 0;

        stringScoreCol[0] = 2;
        stringScoreCol[1] = 2;
        stringScoreCol[2] = 6;
        stringScoreCol[3] = 1;
        stringScoreCol[4] = 4;

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

        const stringNumRow = 4; //スコア数字用の切り抜き場所(行)
        const stringNumCol = 0;

        const stringNumOffsetX = showOffsetX + 80;

        //スコア実パラメータを文字列化
        let stringNum = this.score.toString();

        //1桁ずつ表示
        for (let index = 0; index < stringNum.length; index++) 
        {
            //1桁分を抽出...?(JS勉強部分)
            const num = Number(stringNum[index]);

            if (this.image)
            {
                ctx.drawImage(this.image, 
                    num * stringCutSize, stringNumRow * stringCutSize, stringCutSize, stringCutSize,
                stringNumOffsetX + index * stringSize, showOffsetY, stringSize, stringSize);

            }
        }
    }


}














