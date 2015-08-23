var makeAShape = window.makeAShape || {};

makeAShape.ShapeController = Backbone.Router.extend({

  routes: 
  {
    "dates"   : "showDates",
    "start"   : "showStart",
    "colors"  : "showColors",
    "preview" : "showPreview",
    "note"    : "showNote",
    "finish"  : "showFinish",
    "back"    : "triggerBack",
    "*path"   : "showStart"
  },

  initialize: function()
  {
    //_.bind(this,"scrollTo", "updateBackgroundPos");

    this.dateSelector = new makeAShape.dateCreator(".date-selector");

    $(".page-nav a").click(this.scrollTo);
    $(".back-to-top").click(this.scrollTo);
  },

  scrollTo: function(e)
  {
    e.preventDefault();

    var href = $(this).attr("href");
    var pos_top = href == "#" ? 0 : $(href).position().top;
    $("body").animate({scrollTop: pos_top});
  },

  showNavView: function(el)
  {
    $(".nav-views").children().addClass("hidden");
    $(el, ".nav-views").removeClass("hidden");
  },

  showDates: function()
  {
    this.showNavView(".dates");
  },

  showStart: function()
  {
    this.showNavView(".start");
  },

  showNote: function()
  {
    this.showNavView(".note");

    $("textarea").focus();
  },

  showColors: function() 
  {
    this.controlData=this.dateSelector.getDates();
    this.renderColorSelectors();

    this.showNavView(".colors");
  },

  showPreview: function() 
  {
    this.showNavView(".preview");

    $("body").trigger("makeashape:clear");

    var sets = this.createColorData();
    var current = 0;

    for(key in this.controlData)
    {
      this.controlData[key].colors = sets[current];
      $("body").trigger("makeashape:addDates",[this.controlData[key]]);
      current++;
    }
  },

  showFinish: function()
  {
    $("body").trigger("makeashape:renderNote",$(".note-box").val());

    this.showNavView(".finish");
  },

  triggerBack: function()
  {
    window.history.back();
  },

  createColorData: function()
  {
    var sets = $(".color-set");

    var completeSets = [];

    for(var i=0;i<sets.length;i++)
    {
      var colors = [];
      var children = $(sets[i]).children();

      for(var j=0;j<children.length;j++)
      {
        if($(children[j]).data("color"))
        {
          colors.push($(children[j]).data("color"));
        }
      }

      completeSets.push(colors);
    }

    return completeSets;
  },

  renderColorSelectors: function()
  {
    $(".color-selector").html("");

    for(key in this.controlData)
    {
      var p = this.controlData[key].points;
      var html = "<div class='color-set'>";
      html += "<span class='date-title DINWeb left'>Date</span>";

      $(".color-selector").append(html);

      var sets = $(".color-set");

      for(var i=0;i<p.length;i++)
      {
        var itemView = new makeAShape.ColorPicker({number:p[i]});
        $(sets[sets.length-1]).append(itemView.render().el);
        itemView.initializeColorPicker();
      }

      $(".color-selector").append("</div>");
    }
  }

});
