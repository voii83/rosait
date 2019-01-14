$(document).ready(function () {
    $('body').on('click', '.btn-start', function(){
        setTimeout( function () {
            $('.wrapper-btn-start').hide();
            $('.wrapper-slider').show();
        }, 5000);
    });
});
