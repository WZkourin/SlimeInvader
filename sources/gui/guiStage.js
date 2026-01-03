export default class GuiStage
{
    constructor(context) 
    {
        this.context = context;

        this.stage = 1;
        this.stageLimit = 99;

        //画像関係
        this.image = context.assets.get("dotStrings");

        //表示フラグ
        this.isCenterShow = false;

    }

    //ステージを進める
    advanceStage()
    {
        //最高ステージ以上はいかない
        if (this.stage < this.stageLimit) { this.stage++; }     
    }

    //ステージリセット
    resetStage()
    {
        this.stage = 1;
    }

    update()
    {
        if (this.context.isReady) { this.isCenterShow = true; }
        else { this.isCenterShow = false; }
    }

    draw(ctx)
    {
        const showOffsetX = this.context.screen.baseWidth / 1.85;
        const showOffsetY = 10;
        const showOffsetCenterX = this.context.screen.baseWidth / 2.5;
        const showOffsetCenterY = this.context.screen.baseHeight / 2;

        const stringCutSize = 44; //切り抜き時のスプライトサイズ
        const stringSize = stringCutSize / 3; //実際のスプライトサイズ

        //スコア文字列用の切り抜き場所
        let stringStageRow = [];
        let stringStageCol = [];

        //S:2, 2
        //T:2, 3
        //A:0, 0
        //G:0, 6
        //E:0, 4

        stringStageRow[0] = 2;
        stringStageRow[1] = 2;
        stringStageRow[2] = 0;
        stringStageRow[3] = 0;
        stringStageRow[4] = 0;

        stringStageCol[0] = 2;
        stringStageCol[1] = 3;
        stringStageCol[2] = 0;
        stringStageCol[3] = 6;
        stringStageCol[4] = 4;

        for (let index = 0; index < stringStageRow.length; index++) 
        {
            if (this.image)
            {
                // drawImage(
                // 画像,
                // 切り抜きX, 切り抜きY, 切り抜き幅, 切り抜き高さ,
                // 描画X, 描画Y, 描画幅, 描画高さ
                // )

                ctx.drawImage(this.image, 
                    stringStageCol[index] * stringCutSize, stringStageRow[index] * stringCutSize, stringCutSize, stringCutSize,
                showOffsetX + index * stringSize, showOffsetY, stringSize, stringSize);

                if (this.isCenterShow === false) { continue; }

                ctx.drawImage(this.image, 
                    stringStageCol[index] * stringCutSize, stringStageRow[index] * stringCutSize, stringCutSize, stringCutSize,
                showOffsetCenterX + index * stringSize, showOffsetCenterY, stringSize, stringSize);

            }
        }

        const stringNumRow = 4; //スコア数字用の切り抜き場所(行)
        const stringNumCol = 0;

        const stringNumOffsetX = showOffsetX + 80;
        const stringNumOffsetCenterX = showOffsetCenterX + 80;

        //スコア実パラメータを文字列化
        let stringNum = this.stage.toString();

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

                if (this.isCenterShow === false) { continue; }

                ctx.drawImage(this.image, 
                    num * stringCutSize, stringNumRow * stringCutSize, stringCutSize, stringCutSize,
                stringNumOffsetCenterX + index * stringSize, showOffsetCenterY, stringSize, stringSize);

            }
        }


    }

}

