var Container = PIXI.Container;

function Pen()
{
    Container.call(this);
}

Pen.prototype = Object.create(Container.prototype);
Pen.prototype.constructor = Pen;