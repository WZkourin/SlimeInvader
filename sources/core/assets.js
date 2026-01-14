export default class Assets 
{
    images = {};

    loadImage(name, src) {
        return new Promise(resolve => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                this.images[name] = img;
                resolve();
            };
        });
    }

    async loadAll() 
    {
        await this.loadImage("reito", "assets/images/reito.png");
        await this.loadImage("slalin", "assets/images/slalin.png");
        await this.loadImage("thunder", "assets/images/thunder.png");
        await this.loadImage("fire", "assets/images/fire.png");
        await this.loadImage("dotStrings", "assets/images/dotStrings.png");
        await this.loadImage("explosion", "assets/images/explosion.png");
        await this.loadImage("backgroundFlash", "assets/images/backgroundFlash.png");
    }

    get(name) 
    {
        return this.images[name];
    }

}
