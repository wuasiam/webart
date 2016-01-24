var Container = PIXI.Container;
var RenderTexture = PIXI.RenderTexture;
var Sprite = PIXI.Sprite;

function Layer(renderer, width, height)
{
    Container.call(this);

    this.renderTexture = new RenderTexture(renderer, width, height);
    this.sprite = new Sprite(this.renderTexture);

    this.addChild(this.sprite);
}

Layer.prototype = Object.create(Container.prototype);
Layer.prototype.constructor = Layer;