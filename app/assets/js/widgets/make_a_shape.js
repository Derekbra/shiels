paper.install(window);
var makeAShape = window.makeAShape || {};


/////////////////////////////////////////////////////////////////////
// Initialization

makeAShape.ShapeCreator = function(width,height,paper)
{
  this.init(paper);

  this.paper = paper;
  this.width = width;
  this.height = height;
  this.dragging = false;
  this.currentScale = 1;
  this.currentPosition = {x:0,y:0};
  this.startingBounds = {};
  this.currentTextOffset;

  this.paths = [];

  var background = new Path.Rectangle(paper.view.bounds);
  background.fillColor = 'white';

  this.setupListeners();
};

/////////////////////////////////////////////////////////////////////
// Canvas Drawing

makeAShape.ShapeCreator.prototype.clearCanvas = function()
{
  if(this.paper.project.activeLayer.hasChildren()) 
  {
    this.paper.project.activeLayer.removeChildren();
  }

  this.currentTextOffset=null;
  this.paths = [];
};

// @param value = [[12,03,20,11],[14,12,19,88]]
makeAShape.ShapeCreator.prototype.addDates = function(value)
{
  this.reset();

  var p = new Path();
  var _this = this;
  var dates = [value.points];
  var colors = value.colors;

  this.eachDate(dates, function(index,date){
    _this.drawPoint(p,_this.coupleToArray(date[index]));
  });

  p.closed = true;
  p.style = { fillColor: "#333"};
  p.opacity = 0.7;
  this.paths.push(p);

  this.drawDuplicates(p,dates,colors);

  this.group = new Group(this.paths);
  this.currentPosition = this.group.position;

  this.renderDateText(dates);
  this.redraw();

  this.startingBounds = this.group.bounds;
};

makeAShape.ShapeCreator.prototype.drawDuplicates = function(path, value, colors)
{
  var _this = this;
  this.eachDate(value, function(index,date){
    var rotatePoint = _this.coupleToPoint(date[0]);
    var copy=path.clone();
    copy.opacity = 0.7;
    _this.paths.push(copy);
    copy.fillColor=colors[index];
    copy.rotate(-1*date[index], rotatePoint);
  });
};

makeAShape.ShapeCreator.prototype.drawPoint = function(p,value)
{
  p.add(this.coupleToPoint(value));
};

makeAShape.ShapeCreator.prototype.renderDateText = function(date)
{
  if(!this.currentTextOffset)
    this.currentTextOffset=$("#shapeCanvas").height()-15;

  this.currentTextOffset-=15;

  var d=date[0];

  var text = new PointText({
    point: [30, this.currentTextOffset],
    content: d[0]+"/"+d[1]+"/"+d[2]+d[3],
    fillColor: '#949494',
    fontSize: 12,
    fontWeight: "bold"
  });

  text.bringToFront();
};

makeAShape.ShapeCreator.prototype.renderNote = function(value)
{
  if(!this.currentTextOffset)
    this.currentTextOffset=$("#shapeCanvas").height()-15;

  var breakWord = this.wordWrap(value,40,"\n");
  var curOffset = this.currentTextOffset;

  curOffset-=(breakWord.numBreaks*15+30);

  if(this.note)
  {
    this.note.remove();
  }

  this.note = new PointText({
    point: [30, curOffset],
    content: breakWord.brokenString,
    fillColor: '#d1d1d1',
    fontSize: 12,
    fontWeight: "bold"
  });

  this.borderLine = new Path();
  this.borderLine.strokeColor = '#b4b3b4';
  this.borderLine.add(new Point(30, curOffset-15));
  this.borderLine.add(new Point(220, curOffset-15));

  this.note.bringToFront();

  this.redraw();
};

/////////////////////////////////////////////////////////////////////
// Implementation

makeAShape.ShapeCreator.prototype.setupListeners = function()
{
  _this = this;

  var offset = 10;

  // rotate and scale
  $("a.scale-up").click(function(e){
    _this.scaleGroup(e,0.1);
  });
  $("a.scale-down").click(function(e){
    _this.scaleGroup(e,-0.1);
  });
  $("a.rotate-clock").click(function(e){
    _this.rotateGroup(e,45);
  });
  $("a.rotate-anticlock").click(function(e){
    _this.rotateGroup(e,-45);
  });

  // move up/down/left/right
  $("a.move-up").click(function(e){
    _this.currentPosition.y-=offset;
    _this.moveGroup(e,_this.currentPosition);
  });
  $("a.move-down").click(function(e){
    _this.currentPosition.y+=offset;
    _this.moveGroup(e,_this.currentPosition);
  });
  $("a.move-left").click(function(e){
    _this.currentPosition.x-=offset;
    _this.moveGroup(e,_this.currentPosition);
  });
  $("a.move-right").click(function(e){
    _this.currentPosition.x+=offset;
    _this.moveGroup(e,_this.currentPosition);
  });

  // drawing listeners
  $("body").bind("makeashape:addDates",function(e,value){
    _this.addDates(value);
  });
  $("body").bind("makeashape:clear",function(e,value){
    _this.clearCanvas();
  });
  $("body").bind("makeashape:renderNote",function(e,value){
    _this.renderNote(value);
  });
  $("body").bind("makeashape:reset",function(e,value){
    _this.reset();
  });
};

makeAShape.ShapeCreator.prototype.reset = function()
{
  if(this.group!=null)
  {
    this.currentScale=1;
    this.group.bounds=this.startingBounds;
    this.group.rotate(360);
    this.redraw();
  }
};

/////////////////////////////////////////////////////////////////////
// Helper methods

makeAShape.ShapeCreator.prototype.wordWrap = function(str, width, brk, cut) 
{
    brk = brk || '\n';
    width = width || 75;
    cut = cut || false;
 
    if (!str) { return str; }
 
    var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
    
    var strResp = str.match( RegExp(regex, 'g') ).join( brk );
    var breakMatch = strResp.match(/[^\n]*\n[^\n]*/gi);
    var numBreaks = 0;

    if(breakMatch)
    {
      numBreaks = breakMatch.length;
    }

    return {brokenString:strResp,numBreaks:numBreaks};
};

makeAShape.ShapeCreator.prototype.coupleToArray = function(value)
{
    var res = [];
    var digits = (""+value).split("");

    for(i=0;i<digits.length;i++)
    {
      res.push(+digits[i]);
    }

    return res;
};

makeAShape.ShapeCreator.prototype.coupleToPoint = function(value)
{
  var halfPoint = new Point((this.width/10)/2,(this.height/10)/2);
  return new Point((value[0]*(this.width/10))+halfPoint.x,(value[1]*(this.height/10))+halfPoint.y);
};

makeAShape.ShapeCreator.prototype.eachDate = function(value,callback)
{
  for(i=0;i<value.length;i++)
  {
    var res = value[i];

    for(j=0;j<res.length;j++)
    {
      callback(j,res);
    }
  }
};

makeAShape.ShapeCreator.prototype.scaleGroup = function(e, value)
{
  e.preventDefault();

  this.group.bounds.width=this.startingBounds.width;
  this.group.bounds.height=this.startingBounds.height;

  this.currentScale+=(value);

  if(this.currentScale>2)
  {
    this.currentScale=2;
  }
  if(this.currentScale<0.6)
  {
    this.currentScale=0.6;
  }

  this.group.bounds.width*=this.currentScale;
  this.group.bounds.height*=this.currentScale;

  this.redraw();
};

makeAShape.ShapeCreator.prototype.rotateGroup = function(e, value)
{
  e.preventDefault();

  this.group.rotate(value);

  this.redraw();
};

makeAShape.ShapeCreator.prototype.moveGroup = function(e, p)
{
  e.preventDefault();

  var w = $("#shapeCanvas").width();
  var h = $("#shapeCanvas").height();

  var clamped = new Point(Math.max(0,Math.min(p.x,w)),
                          Math.max(0,Math.min(p.y,h)));

  this.group.position = clamped;
  this.currentPosition = this.group.position;

  this.redraw();
};

makeAShape.ShapeCreator.prototype.redraw = function()
{
  this.paper.view.draw(true);
};

makeAShape.ShapeCreator.prototype.scaleAndReturnSVG = function(svgSrc, newWidth, newHeight)
{
  var viewBox = "0 0 " + $("canvas").width() + " " + $("canvas").height();
  var res = svgSrc;

  res.setAttribute("viewBox", viewBox);
  res.setAttribute("width", newWidth);
  res.setAttribute("height", newHeight);

  return svgSrc;
};

/////////////////////////////////////////////////////////////////////
// Debug methods

makeAShape.ShapeCreator.prototype.drawGrid = function()
{
  var rowHeight = this.height / 10;
  var colWidth = this.width / 10;

  for(i=0;i<10;i++) 
  {
    var rows = new Path();
    rows.strokeColor = '#999';
    rows.opacity=0.2;
    rows.add(new Point(0, rowHeight * i));
    rows.add(new Point(this.width, rowHeight * i));
  }

  for(j=0;j<10;j++)
  {
    var cols = new Path();
    cols.strokeColor = '#999';
    cols.opacity=0.2;
    cols.add(new Point(colWidth * j, 0));
    cols.add(new Point(colWidth * j, this.height));
  }
};

/////////////////////////////////////////////////////////////////////
// Paper initialization

makeAShape.ShapeCreator.prototype.init = function(paper)
{
  paper.inject(
  {
    myRotationApply: function(item, angle)
    {
        item.rotate(angle);
        item.my_rotation += angle;
        
        // Keep the rotation between 0-360
        if(item.my_rotation >= 360)
        {
            item.my_rotation -= 360;
        }
        
        if(item.my_rotation < 0)
        {
            item.my_rotation += 360;
        }
    },
    injectCustomRotation: function(item)
    {
      item.inject(
      {
          myRotate: function(angle)
          {
              paper.myRotationApply(this, angle);
          },
          my_rotation: 0
      });
    }
  });

  paper.inject(
  {
    myScaleApply: function(item, value)
    {
      item.my_scale = value;
      item.scale(value);
    },
    injectCustomScale: function(item)
    {
      item.inject(
      {
          myScale: function(value)
          {
              paper.myScaleApply(this,value);
          },
          my_scale: 1
      });
    }
  });

  paper.injectCustomRotation(paper.Group);
  paper.injectCustomScale(paper.Group);
};
