Redd.Views.TrackPost = Backbone.View.extend({
  initialize: function() {
    console.log('in TrackPost view');
    this.trackpost_stats = new Redd.Views.TrackPostStats({
      model: this.model});
    this.trackpost_chart = new Redd.Views.TrackPostChart();
    this.model.on('sync', function() { console.log('trackpost sync');
      $('.loader').hide();
      this.trackpost_stats.render();
      var obj = this.model.attributes;
      this.collection.add({ups: obj.ups, downs: obj.downs, score: obj.score});
      Redd.Vent.trigger('trackpostSync');
      $('.submit-another').show();
    }, this);
  },
  el: '#trackpost',
  template: Redd.Templates('trackpost'),
  events: {
    'submit form': 'enterURL',
    'click .submit-another': 'addAnother'
  },
  render: function(){
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  enterURL: function(e) {
    $('.loader').fadeIn();
    $('.submit-another').hide();
    $('#trackpost form').slideUp('slow');
    if(this.model.urlSubmit) {
      this.trackpost_chart.render();
    }
    this.collection.reset();
    var url = $('#tracking-url').val();
    console.log('url submitted', url);
    this.model.urlSubmit = url;
    this.model.fetch();
    Redd.Vent.trigger('urlSubmitChange');
    $('#tracking-url').val('');
    return false;
  },

  addAnother: function(e) {
    e.preventDefault();
    $('#trackpost form').slideDown('slow');
  }
});
