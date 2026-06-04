export default class GuiTitleLogo 
{
    constructor(context) 
    {
        this.context = context;

        this.drawX = 50;
        this.drawY = 200;

        //画像関係
        this.image = context.assets.get("titleLogo");
    }

    draw(ctx)
    {
        //タイトル以外は描画しない
        if (this.context.sceneCurrent !== this.context.scenes.title) { return; }

        if (this.image)
        {
            // drawImage(
            // 画像,
            // 切り抜きX, 切り抜きY, 切り抜き幅, 切り抜き高さ,
            // 描画X, 描画Y, 描画幅, 描画高さ
            // )

            ctx.drawImage(this.image, this.drawX, this.drawY);
        }

    }
}














