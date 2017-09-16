/**
 * Created by ufeimiya on 16-4-20.
 */
$(function () {
    document.addEventListener("mousewheel",function(e){
        if(document.body.scrollTop>0){
            $('.navbar-wrapper').addClass('navbar-wrapper-scroll');
        }
        else{
            $('.navbar-wrapper').removeClass('navbar-wrapper-scroll');
        }
    });

    $('.return-header').bind("click",function(){
        document.body.scrollTop=0;
        $('.navbar-wrapper').removeClass('navbar-wrapper-scroll');
    })
});