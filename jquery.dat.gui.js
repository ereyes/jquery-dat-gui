// jQuery.datgui
(function($) {

    var methods = {
        init: function(options) {

            return this.each(function() {

                var $this = $(this),
                    data = $this.data('datgui');

                if (!data) {
                    if (!options.gui) gui = new dat.GUI();
                    if (options.name) gui = gui.addFolder(options.name);
                    $(this).data('datgui', {
                        target: $this,
                        datgui: gui,
                        toggle: {},
                        css: {},
                        controllers: {}
                    });
                    data = $this.data('datgui');

                    if (options.toggle) {
                        data.toggle = {};
                        $.each(options.toggle, function(name, state) {
                            data.toggle[name] = state;
                            $this.toggleClass(name, state);
                            data.controllers[name] = gui.add(data.toggle, name);
                            data.controllers[name].onChange(function(value) {
                                $this.toggleClass(name, value);
                            });
                        });
                    } //classes
                    if (options.css) {
                        data.css = {};

                        var propRe = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/;
                        $.each(options.css, function(name, value) {
                            data.css[name] = parseInt(value);
                            var elem = $this.get(0);
                            elem.style[name] = value; // + ((options.units[name])?options.units[name]:'');
                            if (options.range[name]) {
                                data.controllers[name] = gui.add(data.css, name, options.range[name][0], options.range[name][1]);
                            } else {
                                data.controllers[name] = gui.add(data.css, name);
                            }
                            data.controllers[name].onChange(function(value) {
                                elem.style[name] = value + elem.style[name].match(propRe)[2];
                            });

                            $.cssHooks[name] = {
                                get: function(elem, computed, extra) {
                                    return $.css(elem, name);
                                },
                                set: function(elem, value) {
                                    elem.style[name] = value + elem.style[name].match(propRe)[2];
                                    options.css[name] = parseInt(value);
                                    data.controllers[name].updateDisplay();
                                }
                            };
                        });
                    } //css
                    
                    if (options.data) {
                        data.data = {};

                        $.each(options.data, function(name, value) {
                            data.data[name] = value;
                            //var elem = $this.get(0);

                            // if (options.range[name]) {
                            //     data.controllers[name] = gui.add(data.data, name, options.range[name][0], options.range[name][1]);
                            // } else {
                                data.controllers[name] = gui.add(data.data, name, value);
                            // }
                            // data.controllers[name].onChange(function(value) {
                            //                                 elem.style[name] = value + elem.style[name].match(propRe)[2];
                            //                             });

                        });
                    } //data

                }
            });
        },
        destroy: function() {

            return this.each(function() {

                var $this = $(this),
                    data = $this.data('datgui');

                $(window).unbind('.datgui');
                data.datgui.remove();
                $this.removeData('datgui');

            })

        },
        update: function(content) {}
    };

    $.fn.datgui = function(method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.datgui');
        }

    };

})(jQuery);
