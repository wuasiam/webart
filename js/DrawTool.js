var Container = PIXI.Container;

function DrawTool() 
{
    Container.call(this);
}

DrawTool.prototype = Object.create(Container.prototype);
DrawTool.prototype.constructor = DrawTool;