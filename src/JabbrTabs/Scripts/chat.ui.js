(function ($, window, document) {
    "use strict";

    var $document = $(document),
        templates = null,
        $tabs = null,
        $window = $(window),
        $ui = null;

    function AddRoom(roomName) {
        var $tabsDropdown = $tabs.last();
        var viewModel = null;

        viewModel = {
            id: 1,
            name: roomName,
            closed: 'closed'
        };
        var tmp = templates.tab.render(viewModel);

        $tabsDropdown.append(tmp);

        ui.updateTabOverflow();
    }

    function UpdateTabOverflow() {
        var lastOffsetLeft = 0,
            sliceIndex = -1,
            $roomTabs = null,
            $tabsList = $tabs.first(),
            $tabsDropdown = $tabs.last(),
            overflowedRoomTabs = null,
            $tabsDropdownButton = $('#tabs-dropdown-rooms');

        // move all (non-dragsort) tabs to the first list
        $tabs.last().find('li:not(.placeholder)').each(function () {
            $(this).css('visibility', 'hidden').detach().appendTo($tabsList);
        });

        $roomTabs = $tabsList.find('li:not(.placeholder)');

        // if width of first tab is greater than the tab area, move them all to the list
        if ($roomTabs.length > 0 && $roomTabs.width() > $tabsList.width()) {
            sliceIndex = 0;
        } else {
            // find overflow and move it all to the dropdown list ul
            $roomTabs.each(function (idx) {
                if (sliceIndex !== -1) {
                    return;
                }

                var thisOffsetLeft = $(this).offset().left;
                if (thisOffsetLeft <= lastOffsetLeft) {
                    sliceIndex = idx;
                    return;
                }

                lastOffsetLeft = thisOffsetLeft;
            });
        }

        // move all elements from here to the dropdown list
        if (sliceIndex !== -1) {
            $tabsDropdownButton.fadeIn('slow');
            overflowedRoomTabs = $roomTabs.slice(sliceIndex);
            for (var i = overflowedRoomTabs.length - 1; i >= 0; i--) {
                $(overflowedRoomTabs[i]).prependTo($tabsDropdown);
            }
        } else {
            $tabsDropdownButton.fadeOut('slow').parent().removeClass('open');
        }

        $roomTabs.each(function () { $(this).css('visibility', 'visible'); });

        return;
    }

    var ui = {
        initialize: function () {
            $ui = $(this);
            templates = {
                tab: $("#new-tab-template")
            };
            $tabs = $('#tabs, #tabs-dropdown');
            ui.updateTabOverflow();
            $window.resize(function () {
                ui.updateTabOverflow();
            });
            $window.focus(function () {
                ui.updateTabOverflow();
            });

            $document.on('click', ".close", function (e) {
                $(this).closest("li").remove();

                $ui.trigger("RemoveRoom");
                e.preventDefault();
                return false;
            });
        },
        addRoom: AddRoom,
        updateTabOverflow: UpdateTabOverflow
    };

    function RemoveRoom() {
        console.log("remove room");
    }

    $.chat = $.chat || {};
    $.chat.ui = ui;

})(jQuery, window, window.document)
