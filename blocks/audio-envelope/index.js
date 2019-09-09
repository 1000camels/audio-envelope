( function( wp ) {
	/**
	 * Registers a new block provided a unique name and an object defining its behavior.
	 * @see https://github.com/WordPress/gutenberg/tree/master/blocks#api
	 */
	var registerBlockType = wp.blocks.registerBlockType;
	/**
	 * Returns a new element of given type. Element is an abstraction layer atop React.
	 * @see https://github.com/WordPress/gutenberg/tree/master/element#element
	 */
	var el = wp.element.createElement;
	/**
	 * Retrieves the translation of text.
	 * @see https://github.com/WordPress/gutenberg/tree/master/i18n#api
	 */
	var __ = wp.i18n.__;


	const { InnerBlocks, RichText, BlockControls } = wp.editor;

	const TEMPLATE = [
		['core/heading', { className: 'ae-title', placeholder: 'Audio Title' }],
		['core/paragraph', { className: 'ae-description', placeholder: 'Enter description...' }],
		['core/audio', { className: 'ae-audio' }]
	];

	const AUDIO_TEMPLATE = [
		['core/audio', { className: 'ae-audio' }]
	];

	/**
	 * Every block starts by registering a new block type definition.
	 * @see https://wordpress.org/gutenberg/handbook/block-api/
	 */
	registerBlockType( 'audio-envelope/audio-envelope', {
		/**
		 * This is the display title for your block, which can be translated with `i18n` functions.
		 * The block inserter will show this name.
		 */
		title: __( 'Audio Envelope' ),

		/**
		 * Blocks are grouped into categories to help users browse and discover them.
		 * The categories provided by core are `common`, `embed`, `formatting`, `layout` and `widgets`.
		 */
		category: 'widgets',

		icon: 'video-alt3',

		/**
		 * Optional block extended support features.
		 */
		supports: {
			// Removes support for an HTML mode.
			html: true,
		},

		/**
		 * All the magic happens with attributes!
		 */
		attributes: {
			title: {
				type: 'string',
	            source: 'html',
	            selector: 'h2'
			},
			description: {
				type: 'array',
				source: 'children',
				selector: 'div.ae-description',
				default: [],
			},
		},

		/**
		 * Edit
		 */
		edit: ( props ) => {      
			var attributes = props.attributes;
			var focus = props.focus;
	        
	        return (
	        	el( 'div', { className: 'ae-block' },
		        	el(
		        		RichText, { 
		        			className: 'ae-title',
		        			tagName: 'h2',
		        			placeholder: __( 'Add a title' ),
							keepPlaceholderOnFocus: true,
							focus: focus,
             				onFocus: props.setFocus,
							value: attributes.title,
							onChange: function (newTitle) {
								props.setAttributes({ title: newTitle })
							}
		        		}
		        	),
		        	el( 
		        		RichText, {
		                    tagName: 'div',
		                    className: 'ae-description',
		                    multiline: 'p',
		                    placeholder: __( 'Write a description...' ),
	      					value: attributes.description,
							onChange: function (newDescription) {
								props.setAttributes({ description: newDescription })
							}
		                }
	                ),
		        	el(
			        	InnerBlocks, {
			        		template: AUDIO_TEMPLATE,
			            	templateLock: "all"
			        	}
		        	)
		        )
	        )
	    },

		/**
		 * Save
		 */
	    save: ( props ) => {
	        const {
	            className,
	            attributes: {
	                title,
	                description
	            },
	        } = props;

	    	return ( 
	        	el('div', { className: 'ae-block' },
	 				el( RichText.Content, {
	        			className: 'ae-title',
	        			tagName: 'h2',
	            		value: title
	          		}),
	 				el( 'div',  { className: 'ae-description' }, description ),
	 				el( InnerBlocks.Content )
	 			)
	        );

      		// return (
      		// 	<div className="ae-block">
      		// 		<RichText.Content className="ae-title" tagName="h2" value={ attributes.content } />
      		// 		<RichText.Content className="ae-description "tagName="div" value={ attributes.description } />
      		// 		<InnerBlocks />
      		// 	</div>
      		// );
	    },

	} );
} )(
	window.wp
);
