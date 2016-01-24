var Container = PIXI.Container;
var Graphics = PIXI.Graphics;

function Pen()
{
    Container.call(this);

    this.color = 0x000000;
    this.opacity = 1;
    this.renderData = null;
    this.graphics = new Graphics();
}

Pen.prototype = Object.create(Container.prototype);
Pen.prototype.constructor = Pen;

Pen.prototype.setRenderData = function(data)
{
    this.renderData = data;
}

Pen.prototype.update = function()
{
    this.graphics.clear();

    this.graphics.lineStyle(2, this.color, this.opacity);

    if (this.renderData && this.renderData.length > 0)
    {
        this.renderData.forEach(function (data, idx) {
            this.graphics.drawCircle(data.pos.x, data.pos.y, 5);
        }, this);
    }

    this.renderData = [];
}

Pen.prototype._renderWebGL = function (renderer)
{
    this.graphics.renderWebGL(renderer);
}