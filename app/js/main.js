$(document).ready(function () {
    let module = {
        selectors:  {
            'shadow': '.modul_window',
            'modul': '.modul_window .footer_forms',
            'modul_up': '#reserve_id',
            'modul_close': '.modul_close',
            'input_name': '#name_id_p',
            'input_email': '#email_id_p',
            'input_request': '#request_id_p',
            'button': '#send_id_p',
        },
    
        init: function(){
            let _this = this;
        
            $(_this.selectors.shadow).on("click", function(e){
                let t = e.target;
                if ($(t).first().hasClass('modul_window')){
                    _this.hide();
                }
            });
            $(_this.selectors.modul_close).on("click", function(){
                _this.hide();
            });
            $(_this.selectors.modul_up).on("click", function(){
                _this.show();
            });

            $(_this.selectors.button).on("click", function(){
                _this.ajax($(_this.selectors.input_name).val(), $(_this.selectors.input_email).val(), $(_this.selectors.input_request).val());
            });
        },
        hide: function(){
            let _this = this;
            $(_this.selectors.shadow).addClass("hide");
            $(_this.selectors.shadow).removeClass("show");
        },
        show: function(){
            let _this = this;
            $(_this.selectors.shadow).removeClass("hide");
            $(_this.selectors.shadow).addClass("show");
            
        },
        ajax: function(name, email, request){
            let _this = this;
    
            $.ajax({
                url: '/',
                method: 'post',
                dataType: 'json',
                data: {name: name, email: email, request: request},
                success: function(data){
                    console.log(data);
                    _this.hide();
                },
                error: function (jqXHR, exception){
                    console.log(jqXHR);
                    console.log(exception);
                    _this.hide();
                }
            });

            $(_this.selectors.input_name).val("");
            $(_this.selectors.input_email).val("");
            $(_this.selectors.input_request).val("");
        },
    };
    let mobileMenu = {
        selectors:  {
            'shadow': '.menu_window',
            'menu': '.menu',
            'menu_up': '.menu_mobile',
            'menu_close': '.menu_close',
        },
    
        init: function(){
            let _this = this;
        
            $(_this.selectors.shadow).on("click", function(e){
                let t = e.target;
                if ($(t).first().hasClass('menu_window')){
                    _this.hide();
                }
            });
            $(_this.selectors.menu_close).on("click", function(){
                _this.hide();
            });
            $(_this.selectors.menu_up).on("click", function(){
                _this.show();
            });
        },
        hide: function(){
            let _this = this;
            $(_this.selectors.shadow).fadeOut(300);
        },
        show: function(){
            let _this = this;
            $(_this.selectors.shadow).fadeIn(300);
            
        },
    };

    var main_2_mySwiper = new Swiper ('.main_2_swiper-container', {
        slidesPerView: 1,
    
        navigation: {
          nextEl: '.main_2_quote_arrow_next',
          prevEl: '.main_2_quote_arrow_prev',
        },
    })
    var main_4_mySwiper = new Swiper ('.main_4_swiper-container', {
        slidesPerView: 1,
    
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },

        lazyLoading: true,
    })

    module.init();
    mobileMenu.init();
});