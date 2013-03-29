/*!
 * jquery.thar - Automatic content anchors
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
 * @preserve jquery.thar | Copyright (C) 2013 Jukka Svahn | http://uproar-n-rattle.biz
 * Released under the MIT License
 */

/**
 * jquery.thar
 *
 * A content anchor links plugin for jQuery.
 *
 * @param   {Object}         options        Options
 * @param   {String}         options.prefix A prefix added to the generated links
 * @param   {String|Boolean} options.anchor The anchor link text
 * @return  {Object}         this
 * @author  Jukka Svahn
 * @package jquery.thar
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
	$.fn.thar = function (options)
	{
		options = $.extend({
			'prefix' : 'thar-',
			'anchor' : '&#167;'
		}, options);

		var occurrences = new Array();

		return this.each(function ()
		{
			var $this = $(this);

			if ($this.attr('id'))
			{
				var id = $this.attr('id');
			}
			else
			{
				var id = options.prefix + encodeURIComponent($this.text().replace(/\s/g, '-'))
					.replace(/[^a-z0-9\-]+/gi, '-')
					.replace(/^[0-9\-]|-$/, '')
					.replace(/-{2,}/, '-')
					.toLowerCase();

				var count = 0;

				if ($.inArray(id, occurrences) !== -1)
				{
					$.each(occurrences, function (key, value)
					{
						if (value === id)
						{
							count++;
						}
					});
	
					id += '_' + count;
				}
			}

			if (id === window.location.hash.substr(1))
			{
				$('html, body').animate({
					scrollTop : $this.offset().top
				}, 1000);

				$this.trigger('anchorload.thar', {
					'id' : id
				});
			}

			occurrences.push(id);

			$this.attr('id', id).trigger('anchorcreate.thar');

			if (options.anchor !== false)
			{
				$this
					.prepend(
						$('<a class="jquery-thar-anchor" />')
							.html(options.anchor)
							.attr('href', '#' + id)
							.on('click.thar', function (e)
							{
								e.preventDefault();
								$('html, body').animate({
									scrollTop : $this.offset().top
								}, 100);

								window.location.hash = '#' + id;
							})
					)
					.prepend(' ');
			}
		});
	};
}));