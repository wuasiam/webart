var Container = PIXI.Container,
    RenderTarget = PIXI.RenderTarget;

function Layer() 
{
    Container.call(this);
    
    this.renderTarget = new RenderTarget();
}

Layer.prototype = Object.create(Container.prototype);
Layer.prototype.constructor = Layer;