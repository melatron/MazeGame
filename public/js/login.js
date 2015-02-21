/**
 * Created by Antony on 1/18/2015.
 */
/**
 * Created by Antony on 1/17/2015.
 */
$(function(){
    $('#register', '#container').off('click').on('click', function(){
        var emailField = $('#email'),
            passwordField = $('#password');

        console.log('REGISTER WITH: ', emailField.val(), passwordField.val());

        $.ajax({
            url:'http://localhost:1337/register',
            type: 'post',
            dataType: 'json',
            data: {
                email: emailField.val(),
                password:  passwordField.val()
            },
            success:function(result){
                console.log(result);
            }});
    });

    $('#login', '#container').off('click').on('click', function(){
        var emailField = $('#email'),
            passwordField = $('#password');

        $.ajax({
            url:'http://localhost:1337/login',
            type: 'post',
            data: {
                email: emailField.val(),
                password:  passwordField.val()
            },
            success:function(result){
                $('body').html(result);
            }});

        console.log('LOGIN WITH: ', emailField.val(), passwordField.val());
    });
});