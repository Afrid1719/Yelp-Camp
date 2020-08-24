$('#edit_comment').on('click',function(){
    $('#comment_body').removeAttr('disabled');
    $(this).toggleClass('d-none');
    $('#delete_comment').toggleClass('d-none');
    $('#save_comment').toggleClass('d-none');
    $('#cancel_comment').toggleClass('d-none');
});

$('#save_comment').on('click', function(){
    $('#comment_form').submit();
});

$('#cancel_comment').on('click',function(){
    $('#comment_body').attr('disabled', 'disabled');
    $(this).toggleClass('d-none');
    $('#save_comment').toggleClass('d-none');
    $('#delete_comment').toggleClass('d-none');
    $('#edit_comment').toggleClass('d-none');
});