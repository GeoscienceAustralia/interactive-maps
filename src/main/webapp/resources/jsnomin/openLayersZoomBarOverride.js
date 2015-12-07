OpenLayers.Control.PanZoom = OpenLayers.Class(OpenLayers.Control, {slideFactor: 50, slideRatio: null, buttons: null, position: null, initialize: function(a) {
        this.position = new OpenLayers.Pixel(OpenLayers.Control.PanZoom.X, OpenLayers.Control.PanZoom.Y);
        OpenLayers.Control.prototype.initialize.apply(this, arguments)
    }, destroy: function() {
        this.map && this.map.events.unregister("buttonclick", this, this.onButtonClick);
        this.removeButtons();
        this.position = this.buttons = null;
        OpenLayers.Control.prototype.destroy.apply(this, arguments)
    },
    setMap: function(a) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
        this.map.events.register("buttonclick", this, this.onButtonClick)
    }, draw: function(a) {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        a = this.position;
        this.buttons = [];
        var b = {w: 18, h: 18}, c = new OpenLayers.Pixel(a.x + b.w / 2, a.y);
        this._addButton("panup", "north-mini.png", c, b);
        a.y = c.y + b.h;
        this._addButton("panleft", "west-mini.png", a, b);
        this._addButton("panright", "east-mini.png", a.add(b.w, 0), b);
        this._addButton("pandown", "south-mini.png",
                c.add(0, 2 * b.h), b);
        this._addButton("zoomin", "zoom-plus-mini.png", c.add(0, 3 * b.h + 5), b);
        this._addButton("zoomworld", "zoom-world-mini.png", c.add(0, 4 * b.h + 5), b);
        this._addButton("zoomout", "zoom-minus-mini.png", c.add(0, 5 * b.h + 5), b);
        return this.div
    }, _addButton: function(a, b, c, d) {
        b = OpenLayers.Util.getImageLocation(b);
        c = OpenLayers.Util.createAlphaImageDivOverride(this.id + "_" + a, c, d, b, "absolute");
        c.style.cursor = "pointer";
        this.div.appendChild(c);
        c.action = a;
        c.className = "olButton";
        this.buttons.push(c);
        return c
    }, _removeButton: function(a) {
        this.div.removeChild(a);
        OpenLayers.Util.removeItem(this.buttons, a)
    }, removeButtons: function() {
        for (var a = this.buttons.length - 1; 0 <= a; --a)
            this._removeButton(this.buttons[a])
    }, onButtonClick: function(a) {
        switch (a.buttonElement.action) {
            case "panup":
                this.map.pan(0, -this.getSlideFactor("h"));
                break;
            case "pandown":
                this.map.pan(0, this.getSlideFactor("h"));
                break;
            case "panleft":
                this.map.pan(-this.getSlideFactor("w"), 0);
                break;
            case "panright":
                this.map.pan(this.getSlideFactor("w"), 0);
                break;
            case "zoomin":
                this.map.zoomIn();
                break;
            case "zoomout":
                this.map.zoomOut();
                break;
            case "zoomworld":
                this.map.zoomToMaxExtent()
            }
    }, getSlideFactor: function(a) {
        return this.slideRatio ? this.map.getSize()[a] * this.slideRatio : this.slideFactor
    }, CLASS_NAME: "OpenLayers.Control.PanZoom"});
OpenLayers.Control.PanZoom.X = 4;
OpenLayers.Control.PanZoom.Y = 4;
OpenLayers.Control.PanZoomBar = OpenLayers.Class(OpenLayers.Control.PanZoom, {zoomStopWidth: 18, zoomStopHeight: 11, slider: null, sliderEvents: null, zoombarDiv: null, zoomWorldIcon: !1, panIcons: !0, forceFixedZoomLevel: !1, mouseDragStart: null, deltaY: null, zoomStart: null, destroy: function() {
   this._removeZoomBar();
   this.map.events.un({changebaselayer: this.redraw, updatesize: this.redraw, scope: this});
   OpenLayers.Control.PanZoom.prototype.destroy.apply(this, arguments);
   delete this.mouseDragStart;
   delete this.zoomStart
}, setMap: function(a) {
   OpenLayers.Control.PanZoom.prototype.setMap.apply(this,
           arguments);
   this.map.events.on({changebaselayer: this.redraw, updatesize: this.redraw, scope: this})
}, redraw: function() {
   null != this.div && (this.removeButtons(), this._removeZoomBar());
   this.draw()
}, draw: function(a) {
   OpenLayers.Control.prototype.draw.apply(this, arguments);
   a = this.position.clone();
   this.buttons = [];
   var b = {w: 18, h: 18};
   if (this.panIcons) {
       var c = new OpenLayers.Pixel(a.x + b.w / 2, a.y), d = b.w;
       this.zoomWorldIcon && (c = new OpenLayers.Pixel(a.x + b.w, a.y));
       this._addButton("panup", "north-mini.png", c, b);
       a.y = c.y + b.h;
       this._addButton("panleft", "west-mini.png", a, b);
       this.zoomWorldIcon && (this._addButton("zoomworld", "zoom-world-mini.png", a.add(b.w, 0), b), d *= 2);
       this._addButton("panright", "east-mini.png", a.add(d, 0), b);
       this._addButton("pandown", "south-mini.png", c.add(0, 2 * b.h), b);
       this._addButton("zoomin", "zoom-plus-mini.png", c.add(0, 3 * b.h + 5), b);
       c = this._addZoomBar(c.add(0, 4 * b.h + 5));
       this._addButton("zoomout", "zoom-minus-mini.png", c, b)
   } else
       this._addButton("zoomin", "zoom-plus-mini.png", a, b), c = this._addZoomBar(a.add(0, b.h)),
               this._addButton("zoomout", "zoom-minus-mini.png", c, b), this.zoomWorldIcon && (c = c.add(0, b.h + 3), this._addButton("zoomworld", "zoom-world-mini.png", c, b));
   return this.div
}, _addZoomBar: function(a) {
   var b = OpenLayers.Util.getImageLocation("slider.png"), c = this.id + "_" + this.map.id, d = this.map.getMinZoom(), e = this.map.getNumZoomLevels() - 1 - this.map.getZoom(), e = OpenLayers.Util.createAlphaImageDivOverride(c, a.add(-1, e * this.zoomStopHeight), {w: 20, h: 9}, b, "absolute");
   e.style.cursor = "move";
   this.slider = e;
   this.sliderEvents = new OpenLayers.Events(this,
           e, null, !0, {includeXY: !0});
   this.sliderEvents.on({touchstart: this.zoomBarDown, touchmove: this.zoomBarDrag, touchend: this.zoomBarUp, mousedown: this.zoomBarDown, mousemove: this.zoomBarDrag, mouseup: this.zoomBarUp});
   var f = {w: this.zoomStopWidth, h: this.zoomStopHeight * (this.map.getNumZoomLevels() - d)}, b = OpenLayers.Util.getImageLocation("zoombar.png"), c = null;
   OpenLayers.Util.alphaHack() ? (c = this.id + "_" + this.map.id, c = OpenLayers.Util.createAlphaImageDivOverride(c, a, {w: f.w, h: this.zoomStopHeight}, b, "absolute", null, "crop"), c.style.height =
           f.h + "px") : c = OpenLayers.Util.createDiv("OpenLayers_Control_PanZoomBar_Zoombar" + this.map.id, a, f, b);
   c.style.cursor = "pointer";
   c.className = "olButton";
   this.zoombarDiv = c;
   this.div.appendChild(c);
   this.startTop = parseInt(c.style.top);
   this.div.appendChild(e);
   this.map.events.register("zoomend", this, this.moveZoomBar);
   return a = a.add(0, this.zoomStopHeight * (this.map.getNumZoomLevels() - d))
}, _removeZoomBar: function() {
   this.sliderEvents.un({touchstart: this.zoomBarDown, touchmove: this.zoomBarDrag, touchend: this.zoomBarUp,
       mousedown: this.zoomBarDown, mousemove: this.zoomBarDrag, mouseup: this.zoomBarUp});
   this.sliderEvents.destroy();
   this.div.removeChild(this.zoombarDiv);
   this.zoombarDiv = null;
   this.div.removeChild(this.slider);
   this.slider = null;
   this.map.events.unregister("zoomend", this, this.moveZoomBar)
}, onButtonClick: function(a) {
   OpenLayers.Control.PanZoom.prototype.onButtonClick.apply(this, arguments);
   if (a.buttonElement === this.zoombarDiv) {
       var b = a.buttonXY.y / this.zoomStopHeight;
       if (this.forceFixedZoomLevel || !this.map.fractionalZoom)
           b =
                   Math.floor(b);
       b = this.map.getNumZoomLevels() - 1 - b;
       b = Math.min(Math.max(b, 0), this.map.getNumZoomLevels() - 1);
       this.map.zoomTo(b)
   }
}, passEventToSlider: function(a) {
   this.sliderEvents.handleBrowserEvent(a)
}, zoomBarDown: function(a) {
   if (OpenLayers.Event.isLeftClick(a) || OpenLayers.Event.isSingleTouch(a))
       this.map.events.on({touchmove: this.passEventToSlider, mousemove: this.passEventToSlider, mouseup: this.passEventToSlider, scope: this}), this.mouseDragStart = a.xy.clone(), this.zoomStart = a.xy.clone(), this.div.style.cursor =
               "move", this.zoombarDiv.offsets = null, OpenLayers.Event.stop(a)
}, zoomBarDrag: function(a) {
   if (null != this.mouseDragStart) {
       var b = this.mouseDragStart.y - a.xy.y, c = OpenLayers.Util.pagePosition(this.zoombarDiv);
       0 < a.clientY - c[1] && a.clientY - c[1] < parseInt(this.zoombarDiv.style.height) - 2 && (b = parseInt(this.slider.style.top) - b, this.slider.style.top = b + "px", this.mouseDragStart = a.xy.clone());
       this.deltaY = this.zoomStart.y - a.xy.y;
       OpenLayers.Event.stop(a)
   }
}, zoomBarUp: function(a) {
   if ((OpenLayers.Event.isLeftClick(a) || "touchend" ===
           a.type) && this.mouseDragStart) {
       this.div.style.cursor = "";
       this.map.events.un({touchmove: this.passEventToSlider, mouseup: this.passEventToSlider, mousemove: this.passEventToSlider, scope: this});
       var b = this.map.zoom;
       !this.forceFixedZoomLevel && this.map.fractionalZoom ? (b += this.deltaY / this.zoomStopHeight, b = Math.min(Math.max(b, 0), this.map.getNumZoomLevels() - 1)) : (b += this.deltaY / this.zoomStopHeight, b = Math.max(Math.round(b), 0));
       this.map.zoomTo(b);
       this.zoomStart = this.mouseDragStart = null;
       this.deltaY = 0;
       OpenLayers.Event.stop(a)
   }
},
moveZoomBar: function() {
   var a = (this.map.getNumZoomLevels() - 1 - this.map.getZoom()) * this.zoomStopHeight + this.startTop + 1;
   this.slider.style.top = a + "px"
}, CLASS_NAME: "OpenLayers.Control.PanZoomBar"});

// MODIFIED to replace the zoom icons of OpenLayers, originally I had added a class
// and then overridden the img in CSS but due to browser compatibility this was easier.
OpenLayers.Util.createAlphaImageDivOverride = function(a, b, c, d, e, f, g, h, k) {
   var l = OpenLayers.Util.createDiv();
   k = OpenLayers.Util.createImage(null, null, null, "../img/zoom-plus-mini.png", null, null, null, k);

   if (d.indexOf("zoom-plus-mini") != -1) {
      d = "resources/img/zoom-plus-mini.png";
   } else if  (d.indexOf("zoom-minus-mini") != -1) {
      d = "resources/img/zoom-minus-mini.png";
   } else if  (d.indexOf("slider") != -1) {
      d = "resources/img/slider.png";
   }
   k.className = "olAlphaImg";

   l.appendChild(k);
   OpenLayers.Util.modifyAlphaImageDiv(l, a, b, c, d, e, f, g, h);
   return l
};