export default class BackgroundFlash 
{
    constructor(context) 
    {
        this.context = context;

        //点滅表示のためのsin波用パラメータ
        this.y = 0.0;
        this.offset = 1.0; //基準位置
        this.waveHeight = 0.1; //振幅
        this.frequency = 5.0; //周波数
        this.omega = 2.0 * Math.PI * this.frequency; //角周波数
        this.waveDuration = 0.0; //経過時間
        this.wavePeriod = 1.0 / this.frequency; //1周期
        this.isShow = false; //表示フラグ

        //画像関係
        this.image = context.assets.get("backgroundFlash");
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

    //背景を退ける(アセット削除じゃないよ)
    removeFlash()
    {
        if (this.isShow) { this.isShow = false; }
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
        if (this.image)
        {
            // drawImage(
            // 画像,
            // 切り抜きX, 切り抜きY, 切り抜き幅, 切り抜き高さ,
            // 描画X, 描画Y, 描画幅, 描画高さ
            // )

            if (this.isShow === false) { return; }

            ctx.drawImage(this.image, 0, 0, this.context.screen.baseWidth, this.context.screen.baseHeight);

        }

    }

}



