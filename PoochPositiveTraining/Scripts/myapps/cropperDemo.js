$(function () {
    'use strict';

    var editImage = function () {
        var $image = $('#image');
        var $container = $image.parent();
        var options = {
            aspectRatio: 3 / 4,
            preview: '.img-preview',
            background: false,
            modal: false,
        };

        // Cropper
        $image.cropper(options);
        $container.removeClass('hidden');
    }

    $('input[type="file"]').on('change', editImage);

    $('#done').on('click', function() {
        var result;

        result = $image.cropper("getCroppedCanvas", { width: 150, height: 200 });

        $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);
    });
});
