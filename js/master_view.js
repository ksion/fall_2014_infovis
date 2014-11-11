$(function() {
    $('.dot').click(function() {
        var mapView = $('.map');
        var dot = $(this).data('dot');
        var country = $(mapView).find("[data-circ='"+ dot + "']");
        
        alert($(country).data('circ'));

    });
});