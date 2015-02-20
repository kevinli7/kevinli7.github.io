var main = function() {
  /* Push the body and the nav over by 285px over */
  $('.icon-menu').click(function() {
    var tog = 1;
      if (tog == 1){
        tog = 0;
        $('.menu').animate({
          top: "0px"
        }, 100);
        // $('body').animate({
        //   left: "285px"
        // }, 200);
      } else {
        tog = 1;
        $('.menu').animate({
          top: "-66px"
        }, 100);
      }
  });
};

$(document).ready(main);