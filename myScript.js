$(document).ready(function() {
    $('#menu').hide();
    $('#menu__exit').click(function() {
        $('#menu').hide();
    });
    $('#menu-button').click(function() {
        $('#menu').show();
    });
    $('#form').hide();
    $('#form__exit').click(function() {
        $('#form').hide();
    });
    $('#promotions__button').click(function() {
        $('#form').show();
    });
});