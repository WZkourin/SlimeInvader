export default class Screen 
{
    baseWidth  = 414;
    baseHeight = 900;
    canvas;
    ctx;

    init(canvas) 
    {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        canvas.width  = this.baseWidth;
        canvas.height = this.baseHeight;

        window.addEventListener("resize", () => this.resize());
        this.resize();
    }

    resize() 
    {
        const winW = window.innerWidth;
        const winH = window.innerHeight;

        const aspect = this.baseWidth / this.baseHeight;
        const winAspect = winW / winH;

        let viewW, viewH;
        if (winAspect > aspect) 
        {
            viewH = winH;
            viewW = viewH * aspect;
        } 
        else 
        {
            viewW = winW;
            viewH = viewW / aspect;
        }

        this.canvas.style.width  = viewW + "px";
        this.canvas.style.height = viewH + "px";
    }
}
