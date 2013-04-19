/*!
 * thar - Automatic content anchors
 * https://github.com/gocom/jquery.thar
 *
 * Copyright (C) 2013 Jukka Svahn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * thar
 *
 * A content anchor links plugin for jQuery.
 *
 * @param   {Object}         options        Options
 * @param   {String}         options.prefix A prefix added to the generated links
 * @param   {String|Boolean} options.anchor The anchor link text
 * @return  {Object}         this
 * @author  Jukka Svahn
 * @package thar
 */

;(function (factory)
{
	if (typeof define === 'function' && define.amd)
	{
		define(['jquery'], factory);
	}
	else
	{
		factory(jQuery);
	}
}(function ($)
{
	var hash = window.location.hash.substr(1), occurrences = {'' : 0}, methods =
	{
		scrollTo : function ()
		{
			var $this = $(this), id = $this.attr('id');

			$('html, body').animate({
				scrollTop : $this.offset().top
			}, 1000, 'swing', function ()
			{
				if (id)
				{
					window.location.hash = '#' + id;
				}
			});
		}
	};

	$.fn.thar = function (options)
	{
		options = $.extend({
			'prefix' : '',
			'anchor' : '&#167;'
		}, options);

		var ul = $('<ul />');

		return this.each(function ()
		{
			var _this = this, $this = $(this), id = '', anchor, content;

			if ($this.hasClass('jquery-thar'))
			{
				return;
			}

			content = $this.text();

			if ($this.attr('id'))
			{
				id = $this.attr('id');
			}
			else
			{
				id = options.prefix + encodeURIComponent(content.replace(/\s/g, '-'))
					.replace(/[^A-Z0-9\-]/gi, '-')
					.substr(0, 255)
					.replace(/^[\d\-]|-$/g, '')
					.replace(/-{2,}/g, '-')
					.toLowerCase();

				if ($.type(occurrences[id]) !== 'undefined')
				{
					occurrences[id]++;
					id += '_' + occurrences[id];
				}
				else
				{
					occurrences[id] = 1;
				}
			}

			$this.attr('id', id).addClass('jquery-thar').trigger('anchorcreate.thar');

			if (id === hash)
			{
				methods.scrollTo.apply(this);

				$this.trigger('anchorload.thar', {
					'id' : id
				});

				hash = false;
			}

			ul.append(
				$('<li />')
					.addClass('jquery-thar-to-' + id)
					.html(
						$('<a />')
							.attr('href', '#' + id)
							.text(content)
							.on('click.thar', function (e)
							{
								e.preventDefault();
								methods.scrollTo.apply(_this);
							})
					)
			);

			if (options.anchor !== false)
			{
				anchor = $('<a class="jquery-thar-anchor" />')
					.attr('href', '#' + id)
					.on('click.thar', function (e)
					{
						e.preventDefault();
						methods.scrollTo.apply(_this);
					});

				if (options.anchor === true)
				{
					$this.wrapInner(anchor);
				}
				else
				{
					$this.prepend(anchor.html(options.anchor)).prepend(' ');
				}
			}
		})
		.extend({
			tharResults :
			{
				'ul' : ul
			}
		});
	};
}));