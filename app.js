var main = function() {
  /* Push the body and the nav over by 285px over */
  $('.icon-menu').click(function() {
    var tog = true;
      if (tog){
        tog = false;
        $('.menu').animate({
          top: "0px"
        }, 100);
        // $('body').animate({
        //   left: "285px"
        // }, 200);
      } else {
        tog = true;
        $('.menu').animate({
          top: "-66px"
        }, 100);
      }
  });
};

$(document).ready(main);