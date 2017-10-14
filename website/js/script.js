$(function() {
  $('a.page-scroll', this).each(function(e) {
        var url = $(this).attr('href').replace(/^\s/, '').replace(/\s$/, '');
        var parts = url.split("#", 2);
        var anchors = $("#" + parts[1] + ", a[name='" + parts[1] + "']");
        if (anchors.length > 0) {
            $(this).click(function(evt) {
                evt.preventDefault();
                $('html, body')
                .animate({
                    scrollTop: $(anchors.get(0)).offset().top
                }, {
                    duration: 1500,
                    specialEasing: {
                        scrollTop: 'easeOutQuint'
                    }
                });
            });
        }
    });

});