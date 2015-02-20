var main = function() {
  /* Push the body and the nav over by 285px over */
  $('.icon-menu').hover(function() {
     $('.menu').animate({
        top: "0px"
      }, 100);}, function() {
      $('.menu').animate({
        top: "-66px"
      }, 100);
     }
  )};


//   $('.icon-menu').click(function() {
//     var top = $('.menu').css( "top" );
//     console.log(top);
//     if (top != '0px'){
//       $('.menu').animate({
//         top: "0px"
//       }, 100);
//     } else {
//       $('.menu').animate({
//         top: "-66px"
//       }, 100);
//     }
//   });
// };

$(document).ready(main);