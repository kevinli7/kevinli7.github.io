var main = function() {
  /* Push the body and the nav over by 285px over */
  $('.icon-menu').click(function() {
    var elem = document.getElementById("menu");
    var top = document.defaultView.getComputedStyle(elem, null).getPropertyValue("top");
    console.log(top);
    if (top != 0){
      $('.menu').animate({
        top: "0px"
      }, 100);
    } else {
      $('.menu').animate({
        top: "-66px"
      }, 100);
    }
  });
};

$(document).ready(main);