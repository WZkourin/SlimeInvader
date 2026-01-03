export default class GuiStart 
{
    constructor(context) 
    {
        this.context = context;

        //点滅表示のためのsin波用パラメータ
        this.y = 0.0;
        this.offset = 1.0; //基準位置
        this.waveHeight = 1.0; //振幅
        this.frequency = 1.0; //周波数
        this.omega = 2.0 * Math.PI * this.frequency; //角周波数
        this.waveDuration = 0.0; //経過時間
        this.wavePeriod = 1.0 / this.frequency; //1周期
        this.isShow = false; //表示フラグ

        //画像関係
        this.image = context.assets.get("dotStrings");


    }

    //sin波を計算
    calcSinWave()
    {
        const deltaTime = this.context.time.delta;
        this.waveDuration += 1.0 * deltaTime;

        //数学の公式表示そのままでは動かないので注意
        this.y = this.waveHeight * Math.sin(this.omega * this.waveDuration) + this.offset;

        //数値が大きくなりすぎないよう、1周期したら引いてリセット
        if (this.waveDuration >= this.wavePeriod)
        {
            this.waveDuration -= this.wavePeriod;
        }
    }

    update()
    {
        this.calcSinWave();

        //波上を辿るY座標が0より大きければ表示
        if (this.y < 1.0) {this.isShow = true}
        else {this.isShow = false;}
    }

    draw(ctx)
    {
        const showOffsetX = this.context.screen.baseWidth / 3.25;
        const showOffsetY = this.context.screen.baseHeight / 2;

        const stringCutSize = 44; //切り抜き時のスプライトサイズ
        const stringSize = stringCutSize / 3; //実際のスプライトサイズ

        //start文字列用の切り抜き場所
        let stringStartRow = [];
        let stringStartCol = [];

        //P:1, 7
        //R:2, 1
        //E:0, 4
        //S:2, 2
        //S:2, 2

        //空白:0, 9

        //S:2, 2
        //T:2, 3
        //A:0, 0
        //R:2, 1
        //T:2, 3

        stringStartRow[0] = 1;
        stringStartRow[1] = 2;
        stringStartRow[2] = 0;
        stringStartRow[3] = 2;
        stringStartRow[4] = 2;
        stringStartRow[5] = 0;
        stringStartRow[6] = 2;
        stringStartRow[7] = 2;
        stringStartRow[8] = 0;
        stringStartRow[9] = 2;
        stringStartRow[10] = 2;

        stringStartCol[0] = 7;
        stringStartCol[1] = 1;
        stringStartCol[2] = 4;
        stringStartCol[3] = 2;
        stringStartCol[4] = 2;
        stringStartCol[5] = 9;
        stringStartCol[6] = 2;
        stringStartCol[7] = 3;
        stringStartCol[8] = 0;
        stringStartCol[9] = 1;
        stringStartCol[10] = 3;

        //タイトル以外は描画しない
        if (this.context.sceneCurrent !== this.context.scenes.title) { return; }

        if (this.isShow === false) { return; }

        for (let index = 0; index < stringStartRow.length; index++) 
        {
            if (this.image)
            {
                // drawImage(
                // 画像,
                // 切り抜きX, 切り抜きY, 切り抜き幅, 切り抜き高さ,
                // 描画X, 描画Y, 描画幅, 描画高さ
                // )

                ctx.drawImage(this.image, 
                    stringStartCol[index] * stringCutSize, stringStartRow[index] * stringCutSize, stringCutSize, stringCutSize,
                showOffsetX + index * stringSize, showOffsetY, stringSize, stringSize);

            }
        }

    }




}


