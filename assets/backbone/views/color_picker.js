var makeAShape = window.makeAShape || {};

makeAShape.ColorPicker = Backbone.View.extend({

  tagName: "div",

  className: "color-container left",

  initialize: function(options)
  {
    _.bindAll(this, "onColorSelected");
    this.number = options.number;
  },

  render: function()
  {
    var html = "<span class='date-num DINWeb'>"+this.number+"</span>";
    html += "<input/>";

    $(this.el).html(html);
    $(this.el).attr("data-color","#333");

    return this;
  },

  initializeColorPicker: function()
  {
    $('input', this.el).spectrum({
      color: '#333',
      hide: this.onColorSelected,
      showInput: false,
      showPaletteOnly: false,
      showPalette: true,
      palette: [
          ['#FF4040', '#FF7373', '#BF3030', '#BF7130', '#A64B00'],
          ['#FF9640', '#1D7373', '#006363', '#33CCCC', '#55CCCC']
      ]
    });
  },

  onColorSelected: function(color)
  {
    $(this.el).attr("data-color",color.toHexString());
  }

});
