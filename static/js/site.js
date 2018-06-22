$(document).ready(function () {
  var $window = $(window);
  var scrollTop = $window.scrollTop();
  var windowWidth = $window.width();
  var windowHeight = $window.height();
  var menuTopExtended = false;
  var menuTop = $('#menu-nav-top');
  var $block, $blockHeight, $blockTop;
  var contactSubmitForm = $('.contact-us_form-wrap');
  var fadingBlocks = $('.fade-on-scroll');
  var currLeftSlide = $('.work-operations_left-slider-top p.is-active');
  var nextLeftSlide = currLeftSlide.next();
  var currTopSlide = $('.work-operations_top-slider-top p.is-active');
  var nextTopSlide = currTopSlide.next();
  var newSliderElem = null;

  $.fn.slideFadeToggle  = function(speed) {
    return this.animate({opacity: 'toggle', height: 'toggle'}, speed);
  };

  // how we work slider
  if ($('.work-operations_left-slider-top').length > 0 ) {
    currLeftSlide = $('.work-operations_left-slider-top p.is-active');
    if (currLeftSlide.next().length > 0) { nextLeftSlide = currLeftSlide.next(); }
    else { nextLeftSlide = $('.work-operations_left-slider-top p:first-child'); }
    currLeftSlide.removeClass('is-active');
    nextLeftSlide.addClass('is-active');
    setTimeout(function() {
      newSliderElem = $('.work-operations_left-slider-top p.is-active').clone();
      newSliderElem = newSliderElem.removeClass('is-active').addClass('before-strikethrough');
      newSliderElem.appendTo('.work-operations_col2-top-slider');
    }, 1000);
    setTimeout(function() {
      $('.before-strikethrough').addClass('after-strikethrough');
    }, 1200);
    setTimeout(function() {
      $('.after-strikethrough').remove();
    }, 2500);
    setTimeout(function() {
      $('.work-operations_left-slider-top p.is-active').addClass('has-strikethrough');
    }, 2200);
    setTimeout(function() {
      $('.work-operations_left-slider-top p.is-active').removeClass('has-strikethrough');
    }, 5000);
    setInterval(function(){
      currLeftSlide = $('.work-operations_left-slider-top p.is-active');
      if (currLeftSlide.next().length > 0) { nextLeftSlide = currLeftSlide.next(); }
      else { nextLeftSlide = $('.work-operations_left-slider-top p:first-child'); }
      currLeftSlide.removeClass('is-active');
      nextLeftSlide.addClass('is-active');
      setTimeout(function() {
        newSliderElem = $('.work-operations_left-slider-top p.is-active').clone();
        newSliderElem = newSliderElem.removeClass('is-active').addClass('before-strikethrough');
        newSliderElem.appendTo('.work-operations_col2-top-slider');
      }, 1000);
      setTimeout(function() {
        $('.before-strikethrough').addClass('after-strikethrough');
      }, 1200);
      setTimeout(function() {
        $('.after-strikethrough').remove();
      }, 2500);
      setTimeout(function() {
        $('.work-operations_left-slider-top p.is-active').addClass('has-strikethrough');
      }, 2200);
      setTimeout(function() {
        $('.work-operations_left-slider-top p.is-active').removeClass('has-strikethrough');
      }, 5000);
    }, 6000);
  }

  if ($('.work-operations_top-slider-top').length > 0 ) {
    setInterval(function(){
      currTopSlide = $('.work-operations_top-slider-top p.is-active');
      if (currTopSlide.next().length > 0) { nextTopSlide = currTopSlide.next(); }
      else { nextTopSlide = $('.work-operations_top-slider-top p:first-child'); }
      currTopSlide.removeClass('is-active');
      nextTopSlide.addClass('is-active');
    }, 6000);
  }


  var setMenu = function() {
    if (windowWidth > 1200) {
      if (scrollTop > 410 && !menuTopExtended) {
        menuTopExtended = true;
        menuTop.fadeIn(400);
      } else if (scrollTop < 411 && menuTopExtended) {
        menuTopExtended = false;
        menuTop.fadeOut(400);
      }
    } else if (windowWidth > 749) {
      if (scrollTop > 150 && !menuTopExtended) {
        menuTopExtended = true;
        menuTop.fadeIn(400);
      } else if (scrollTop < 151 && menuTopExtended) {
        menuTopExtended = false;
        menuTop.fadeOut(400);
      }
    } else if (!menuTopExtended) {
      menuTopExtended = true;
      menuTop.fadeIn(400);
    }
  }

  var fadeBlocks = function() {
    windowWidth = $window.width();
    if (windowWidth > 749) {
      for (var i = 0; i < fadingBlocks.length; i++) {
        $block = $(fadingBlocks[i]);
        $blockHeight = $block.height();
        $blockTop = $block.offset().top;
        scrollTop = $window.scrollTop();
        windowHeight = $window.height();
        if (($blockTop - scrollTop) < (windowHeight - (150)) && !$block.hasClass('is-block-visible')) {
          $block.addClass('is-block-visible');
        }
      }
    }
  }

  $('#menu_list').hide();
  //toggle button text
  $('.menu_list-close').click(function () {
    $('.menu_list').fadeOut();
    $('body').removeClass('menu_no-scroll');
  });
  $('.menu_header-button').click(function () {
    $('.menu_list').fadeIn().css('display', 'table');
    $('body').addClass('menu_no-scroll');
  });

  //toggle list

  var parallax2 = function() {
    var scrolledHeight2 = window.pageYOffset;
    var selector = ".parallax2";
    for(var i = 0; i < document.querySelectorAll(selector).length; i++) {
      var el = document.querySelectorAll(selector)[i];
      var topOffset = el.getBoundingClientRect().top + document.documentElement.scrollTop;
      var limit = el.offsetTop + el.offsetHeight + 300;
      el.style.backgroundPositionY = ((scrolledHeight2) / 5) + "px";
    };
  }

  setMenu();
  fadeBlocks();
  // onscroll
  var scroll = function () {
    setMenu();
    fadeBlocks();
    // parallax
    var currTwoBackground = false;
    if (document.querySelectorAll(".parallax3").length > 0) currTwoBackground = true;
    var selector = ".parallax";
    if (currTwoBackground) selector = ".parallax3";
    var scrolledHeight = window.pageYOffset;
    for(var i = 0; i < document.querySelectorAll(selector).length; i++) {
      var el = document.querySelectorAll(selector)[i];
      var limit = el.offsetTop + el.offsetHeight;
      if (scrolledHeight > el.offsetTop && scrolledHeight <= limit) {
        if (currTwoBackground) {
          el.style.backgroundPositionY = ((scrolledHeight - el.offsetTop) / 1.7) + "px, 0px";
        } else {
          el.style.backgroundPositionY = ((scrolledHeight - el.offsetTop) / 1.7) + "px";
        }
      } else {
        el.style.backgroundPositionY = "0";
      }
    };
    parallax2();
  };
  var resize = function () {
    setMenu();
  };
  var raf = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame||
		function(callback, element ) {
			window.setTimeout( callback, 1000 / 60 );
		};
  var lastScrollTop = $window.scrollTop();
  var lastWidth = $window.width();

  if (raf) {
    loop();
  }

  function loop() {
    scrollTop = $window.scrollTop();
    windowWidth = $window.width();
    if (lastScrollTop === scrollTop && lastWidth === windowWidth) {
      raf(loop);
      return;
    } else if (lastScrollTop !== scrollTop) {
      lastScrollTop = scrollTop;

      // fire scroll function if scrolls vertically
      scroll();
      raf(loop);
    } else if (lastWidth !== windowWidth) {
      lastWidth = windowWidth;
      resize();
      raf(loop);
    }
  }

  // How we work toggle descriptions
  $('.work-areas_slider-col').click(function() {
    var $this = $(this);
    var areasBtns = $('.work-areas_slider-col');
    var areasDescriptions = $('.work-areas_slider-descriptions>p');
    areasBtns.removeClass('is-active');
    $this.addClass('is-active');
    areasDescriptions.removeClass('is-active');
    $(areasDescriptions[$('.work-areas_slider-col').index($this)]).addClass('is-active');
  });

  if ($('.js-work-operations-slider1').length > 0) {
    $('.js-work-operations-slider1').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: false,
      speed: 800,
      autoplay: true,
      autoplaySpeed: 2500,
      draggable: false,
    });
  }

  if ($('.js-work-operations-slider2').length > 0) {
    $('.js-work-operations-slider2').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      speed: 800,
      autoplay: true,
      autoplaySpeed: 2500,
    });
  }

  if ($('.home-articles_slider').length > 0) {
    $('.home-articles_slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      speed: 800,
      autoplay: true,
      autoplaySpeed: 2500,
    });
  }

  //contact us validation
  if (contactSubmitForm) {
    const x = document.forms['contactForm'];
    $('.contact-us_input, .contact-us_textarea').focus(function() {
      $('.contact-us_alert').html('');
    });
    contactSubmitForm.submit(function(evt) {
      evt.preventDefault();
      if ( x['formName'].value === "" ) {
        $('.contact-us_alert').html('Please enter name');
      } else if ( !(/^.+@.+\..+$/.test(x['formEmail'].value)) ) {
        $('.contact-us_alert').html('Please enter a valid email');
      } else if ( x['formContent'].value === '' ) {
        $('.contact-us_alert').html('Please enter message');
      } else {
        $(this).trigger('reset');
        window.location.replace('/thank-you-page.html');
        // $('.contact-us_alert').html('Message has been sent');
      }
      return false
    });
  }

  $('.blog_button-load').click(function(e) {
    if (e) e.preventDefault();
    $('.blog_loaded').slideFadeToggle(1000);
  });

  // about us modal
  $('.about_team-grid-wrap>a').click(function(e) {
    e.preventDefault();
    var screenHeight = $( window ).height();
    var screenWidth = $( window ).width();
    var elemHeight = $(e.target).height();
    var finalTopOffset = (screenHeight - elemHeight) / 2;
    if (screenWidth < 750) {
      finalTopOffset = 120;
    }
    var elemScrollTop = $(e.target).offset().top;
    console.log(screenHeight, elemHeight, finalTopOffset, elemScrollTop);
    $("html, body").stop().animate({ scrollTop: elemScrollTop - finalTopOffset }, 500, 'swing');
    $('.about_modal-outer-wrap[data-id="' + $(e.target).parent().data().id + '"], .about_modal-overlay').addClass('is-visible');
  });
  $('.about_modal-overlay, .js-about-hide-modal').click(function(e) {
    e.preventDefault();
    $('.about_modal-outer-wrap, .about_modal-overlay').removeClass('is-visible');
  });
  $('.about_modal-close-btn').click(function(e) {
    $('.about_modal-outer-wrap, .about_modal-overlay').removeClass('is-visible')
  })
});
