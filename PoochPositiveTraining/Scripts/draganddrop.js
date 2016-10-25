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
        var $form		 = $( this ),
            $input		 = $form.find( 'input[type="file"]' ),
            $label		 = $form.find( 'label' ),
            $errorMsg	 = $form.find( '.dropbox__error span' ),
            $restart	 = $form.find( '.dropbox__restart' ),
            droppedFiles = false,
            showFiles	 = function( files )
            {
                for (var i = 0, f; f = files[i]; i++) {

                    // Only process image files.
                    if (!f.type.match('image.*')) {
                        continue;
                    }

                    var reader = new FileReader();

                    // Closure to capture the file information.
                    reader.onload = (function (theFile) {
                        return function (e) {
                            // Render thumbnail.
                            var span = document.createElement('span');
                            span.innerHTML = ['<img class="dogThumbnail" src="', e.target.result,
                                              '" title="', escape(theFile.name), '"/>'].join('');
                            var oldspan = document.getElementById('span');
                            document.getElementById('list').replaceChild(span, oldspan);
                            span.id = 'span';
                        };
                    })(f);

                    // Read in the image file as a data URL.
                    reader.readAsDataURL(f);
                }
            };

        $input.on( 'change', function( e )
        {
            showFiles( e.target.files );
        });

        // drag&drop files if the feature is available
        if( isAdvancedUpload )
        {
            $form
            .addClass( 'has-advanced-upload' ) // letting the CSS part to know drag&drop is supported by the browser
            .on( 'drag dragstart dragend dragover dragenter dragleave drop', function( e )
            {
                // preventing the unwanted behaviours
                e.preventDefault();
                e.stopPropagation();
            })
            .on( 'dragover dragenter', function() //
            {
                $form.addClass( 'is-dragover' );
            })
            .on( 'dragleave dragend drop', function()
            {
                $form.removeClass( 'is-dragover' );
            })
            .on( 'drop', function( e )
            {
                droppedFiles = e.originalEvent.dataTransfer.files; // the files that were dropped
                showFiles( droppedFiles );
            });
        }

        // restart the form if has a state of error/success

        $restart.on( 'click', function( e )
        {
            e.preventDefault();
            $form.removeClass( 'is-error is-success' );
            $input.trigger( 'click' );
        });

        // Firefox focus bug fix for file input
        $input
        .on( 'focus', function(){ $input.addClass( 'has-focus' ); })
        .on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
    });

})( jQuery, window, document );
