// Based on the excellent article by Osvaldas Valutis
// https://css-tricks.com/drag-and-drop-file-uploading/

'use strict';

;( function( $, window, document, undefined )
{
    // feature detection for drag&drop upload

    var isAdvancedUpload = function()
    {
        var div = document.createElement( 'div' );
        return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) && 'FormData' in window && 'FileReader' in window;
    }();

    // attach the effect to every dropbox on the page
    $( '.dropbox' ).each( function()
    {
        var $dropbox = $(this),
            $input		 = $dropbox.find( 'input[type="file"]' ),
            droppedFiles = false,
            showFiles	 = function( files )
            {
                if (files.length == 0) {
                    var html = '<img src="/images/thumbnails/DogNoImage.png" class="thumbnail" />';
                    var img = $(html)[0];
                    $dropbox.find('.thumbnail').replaceWith(img);
                }
                else
                {
                    var f = files[0];

                    // ignore file if not an image
                    if (f.type.match('image.*')) {
                        var reader = new FileReader();

                        reader.onload = (function (theFile) {
                            return function (e) {
                                var html = ['<img class="thumbnail" src="', e.target.result,
                                                    '" title="', escape(theFile.name), '"/>'].join('');
                                var img = $(html)[0];
                                $dropbox.find('.thumbnail').replaceWith(img);
                            };
                        })(f);

                        reader.readAsDataURL(f);
                    }
                }
            };

        $input.on( 'change', function( e )
        {
            showFiles(e.target.files);
        });

        // drag&drop files if the feature is available
        if( isAdvancedUpload )
        {
            $dropbox
            .addClass( 'has-advanced-upload' ) // letting the CSS part to know drag&drop is supported by the browser
            .on( 'drag dragstart dragend dragover dragenter dragleave drop', function( e )
            {
                // preventing the unwanted behaviours
                e.preventDefault();
                e.stopPropagation();
            })
            .on( 'dragover dragenter', function() //
            {
                $dropbox.addClass( 'is-dragover' );
            })
            .on( 'dragleave dragend drop', function()
            {
                $dropbox.removeClass( 'is-dragover' );
            })
            .on( 'drop', function( e )
            {
                $input.prop("files", e.originalEvent.dataTransfer.files)
            });
        }

        // Firefox focus bug fix for file input
        $input
        .on( 'focus', function(){ $input.addClass( 'has-focus' ); })
        .on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
    });

})( jQuery, window, document );
