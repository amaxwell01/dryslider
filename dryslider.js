(function(window, document, $, undefine) {

    var defaultSettings = {
    };

    var userSettings;

    // Safety net for browsers that don't support Array.isArray()
    if(!Array.isArray) {
        Array.isArray = function (vArg) {
            return Object.prototype.toString.call(vArg) === "[object Array]";
        };
    }

    var dryslider = {

        create: function( args ) {
            var self = this;
            var newValues = '';
            var listItems;

            if ( args ) {
                userSettings = args;
            }

            if ( userSettings.name ) {
                userSettings.element = $('[data-name="' + userSettings.name + '"]');
                userSettings.element.attr('id', (userSettings.name + '_container') );
                userSettings.element.addClass( 'dryslider_container' );

                // Default to a horizontal orientation if non is provided
                if ( userSettings.orientation ) {
                    userSettings.element.addClass( 'dryslider_' + userSettings.orientation );
                } else {
                    userSettings.element.addClass( 'dryslider_horizontal' );
                }
            }

            // Divide and place the markers onto the slider
            if ( userSettings.values && Array.isArray(userSettings.values) ) {
                userSettings.element.attr('data-count', userSettings.values.length);
            } else {
                console.log( 'Please include some initial values' );
            }

            // create the button and slider elements based of the userSettings
            if ( userSettings.range ) {
                newValues += '<div class="dryslider_range"></div>';
            }

            if ( userSettings.markers && Array.isArray(userSettings.markers)) {
                newValues += self.createMarkers( userSettings.markers );
            }

            userSettings.element.append( newValues );

            self.enableSelection( userSettings.name );
        },

        createMarkers: function( markers ) {
            var markerDOM = '';
            var itemValue;

            $.each(markers, function(key, value) {

                if ( value.startValue ) {
                    itemValue = value.startValue;
                } else {
                    itemValue = 0;
                }

                markerDOM += '<button class="dryslider_handle" data-value="' + itemValue + '"></div>';
            });

            return markerDOM;
        },


        // Disable the slider so that it can't be manipulated
        disable: function() {

        },

        enableSelection: function( name ) {
            var dryselectContainer = $('#' + name + '_container');
            var selectOptions = dryselectContainer.find('li');
            var selectOptionsCheckbox = dryselectContainer.find('li').find('input[type="checkbox"]');

            selectOptions.off('click');
            selectOptions.on('click', function() {
                var checked = $(this).find('input[type="checkbox"]').prop('checked');

                if ( checked ) {
                    $(this).removeClass('selected');
                    $(this).find('input[type="checkbox"]').prop('checked', false);
                } else {
                    $(this).addClass('selected');
                    $(this).find('input[type="checkbox"]').prop('checked', true);
                }
            });

            selectOptionsCheckbox.off('click');
            selectOptionsCheckbox.on('click', function() {
                var checked = $(this).prop('checked');

                if ( checked ) {
                    $(this).parents('li').removeClass('selected');
                    $(this).prop('checked', false);
                } else {
                    $(this).parents('li').addClass('selected');
                    $(this).prop('checked', true);
                }
            });
        },

        // Get the values, both selected and non-selected in an object
        get: function(args) {
            var dryselectContainer = $('#' + args.name + '_container');
            var selectOptions = dryselectContainer.find('li');
            var items = {
                selected: [],
                non_selected: [],
                all: []
            };
            var item;

            // Loop over all of the items, and store it into the items object
            $.each(selectOptions, function(key, value) {
                item = $(value);

                if ( item.hasClass('selected') ) {
                    items.all.push({
                        selected: true,
                        title: item.text(),
                        value: item.attr('data-value')
                    });
                    items.selected.push({
                        value: item.attr('data-value'),
                        title: item.text()
                    });
                } else {
                    items.all.push({
                        selected: false,
                        title: item.text(),
                        value: item.attr('data-value')
                    });
                    items.non_selected.push({
                        value: item.attr('data-value'),
                        title: item.text()
                    });
                }
            });

            return items;
        },

        select: function( args ) {
            var dryselectContainer = $('#' + args.name + '_container');
            var selectOptions = dryselectContainer.find('li');

            if ( args.values ) {
                if ( args.values === 'all' ) {
                    $.each(selectOptions, function(key, value) {
                        $(value).addClass('selected');
                        $(value).find('input[type="checkbox"]').prop('checked', true);
                    });
                }
                else
                if ( args.values === 'none' ) {
                    $.each(selectOptions, function(key, value) {
                        $(value).removeClass('selected');
                        $(value).find('input[type="checkbox"]').prop('checked', false);
                    });
                }
                else
                if ( Array.isArray(args.values) ) {
                    $.each(selectOptions, function(key, value) {
                        if ( $(value).attr('data-value') === args.values[key] ) {
                            $(value).addClass('selected');
                            $(value).find('input[type="checkbox"]').prop('checked', true);
                        }
                    });
                }
            } else {
                console.log( 'no values specified' );
            }
        },

        set: function(args) {
            var self = this;
            var dryselectContainer = $('#' + args.name + '_container');
            var selectOptions = dryselectContainer.find('li');
            var item;

            var updateListItem = function( itemValue, newItemTitle, newItemValue ) {

                // Loop over the items, and only change what's needed
                if ( itemValue && newItemTitle ) {
                    $.each(selectOptions, function(key, value) {
                        item = $(value);

                        if ( item.attr('data-value') === itemValue ) {

                            // Update the title value with the new title value
                            item.find('input[type="checkbox"]').attr( 'name', newItemTitle );
                            item.find('.title').text( newItemTitle );

                            if ( newItemValue ) {
                                item.find('input[type="checkbox"]').val( newItemValue );
                                item.attr('data-value', newItemValue);
                            }
                        }
                    });
                }
            };

            if ( args.values && Array.isArray(args.values) ) {

                // Loop over the items, and only change what's needed
                $.each(args.values, function(key, value) {
                    updateListItem( value.value.toString(), value.title, value.newValue );
                });
            }
        }
    };

    window.dryslider = dryslider;
})(window, document, jQuery);