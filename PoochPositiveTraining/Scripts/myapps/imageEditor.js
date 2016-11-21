'use strict';

var editImage = function (imageData, options, callback) {
    var defaults = {
        aspectRatio: 3 / 4,
        preview: '.img-preview',
        container: '.cropper-container',
        background: false,
        modal: false
    };
    options = $.extend({}, defaults, options);

    // construct DOM elements inside the container
    var $container = $(options.container);
    alert('test2');
    $container.append('<img id="ie-image" src=""><img>');
    var $image = $container.find("#ie-image");

    // Cropper
    $image.cropper(options);
    $container.removeClass('hidden');
};

editImage(null, null, null);