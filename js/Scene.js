var Container = PIXI.Container;

function Scene(width, height)
{
    Container.call(this);

    this.interactive = true;
    this.interactiveChildren = false;

    var rederOptions = {
        backgroundColor: 0xFFFFFF,
        antialias: true
    };

    this.viewWidth = width || Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    this.viewHeight = height || Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    this.renderer = new PIXI.WebGLRenderer(this.viewWidth, this.viewHeight, rederOptions);

    this.on("mousedown", this.onTouchDown);
    this.on("mousemove", this.onTouchMove);
    this.on("mouseup", this.onTouchUp);

    this.update = this.update.bind(this);
    this._drawScene = this._drawScene.bind(this);

    this.touching = false;
    this.touches = [];

    this.pen = new Pen();
    this.layer = new Layer(this.renderer, this.viewWidth, this.viewHeight);
    this.addChild(this.layer);

    this.drawScene();
}

Scene.prototype = Object.create(Container.prototype);
Scene.prototype.constructor = Scene;

Object.defineProperties(Scene.prototype, {
   renderView : {
       get : function()
       {
           return this.renderer.view;
       }
   }
});

Scene.prototype.containsPoint = function(point) {
    return point.x >= 0 && point.x <= this.viewWidth &&
           point.y >= 0 && point.y <= this.viewHeight;
};

Scene.prototype.update = function() {
    if (this.touches.length == 0)
        return;

    var idxUp = -1;
    for (var i = 0; i < this.touches.length; ++i)
    {
        if (this.touches[i].type == "up")
        {
            idxUp = i;
            break;
        }
    }

    if (idxUp > -1)
        this.touches.splice(idxUp); // delete touches after touch up

    var renderData = this.calcRenderData(this.touches);
    this.pen.setRenderData(renderData);
    this.pen.update();

    if (idxUp > -1)
        this.touches = [];
    else if (this.touches.length > 1)
        this.touches.splice(0, this.touches.length - 1);
};

Scene.prototype.calcRenderData = function(touches)
{
    var renderData = [];
    if (touches.length == 1) {
        renderData.push({
            pos: touches[0].pos
        });
    }
    else
    {
        for (var i = 1; i < touches.length; ++i)
        {
            var start = touches[i - 1].pos;
            var end = touches[i].pos;
            var dx = end.x - start.x;
            var dy = end.y - start.y;
            var len = Math.sqrt(dx * dx + dy * dy);

            for (var k = 0; k < len; ++k)
            {
                var r = k / Math.floor(len);
                var x = start.x * (1 - r) + end.x * r;
                var y = start.y * (1 - r) + end.y * r;
                renderData.push({
                    pos: {x: x, y: y}
                })
            }
        }
    }
    return renderData;
};

Scene.prototype._drawScene = function() {
    this.update();
    this.layer.renderTexture.render(this.pen, null, false);
    this.renderer.render(this);
};

Scene.prototype.drawScene = function() {
    requestAnimationFrame(this._drawScene);
};

Scene.prototype.onTouch = function(type, touchData)
{
    var data = {
        pos: touchData.getLocalPosition(this),
        time: Date.now(),
        type: type
    }
    this.touches.push(data);
    this.drawScene();
}

Scene.prototype.onTouchDown = function(event) {
    this.touching = true;
    this.onTouch("down", event.data);
};

Scene.prototype.onTouchMove = function(event) {
    if (this.touching)
        this.onTouch("move", event.data);
};

Scene.prototype.onTouchUp = function(event) {
    if (this.touching)
    {
        this.touching = false;
        this.onTouch("up", event.data);
    }
};