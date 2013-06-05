/*
 * thar - Automatic content anchors link plugin for jQuery
 * https://github.com/gocom/thar
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
 * @name jQuery
 * @class
 */

/**
 * @name fn
 * @class
 * @memberOf jQuery
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
    var hash = window.location.hash.substr(1), methods = {};

    /**
     * Sets an anchor ID from the element text contents.
     *
     * @return   {Object}         this
     * @method   setAnchorID
     * @memberof jQuery.fn.thar
     */

    methods.setAnchorID = function ()
    {
        return this.each(function ()
        {
            var $this = $(this), id = $this.attr('id'), occurrences = 1, uniqueID;

            if (!id)
            {
                uniqueID = id = encodeURIComponent($this.text().replace(/\s/g, '-'))
                    .replace(/[^A-Z0-9\-]/gi, '-')
                    .substr(0, 255)
                    .replace(/^[\d\-]|-$/g, '')
                    .replace(/-{2,}/g, '-')
                    .toLowerCase() || 'thar';

                while (1)
                {
                    if (!document.getElementById(uniqueID))
                    {
                        $this.attr('id', uniqueID);
                        return;
                    }

                    uniqueID = id + '-' + (occurrences++);
                }
            }
        });
    };

    /**
     * Scrolls to the selected element.
     *
     * @return   {Object}         this
     * @method   scrollTo
     * @memberof jQuery.fn.thar
     */

    methods.scrollTo = function ()
    {
        var $this = $(this).eq(0), id = $this.attr('id');

        $('html, body').animate({
            scrollTop : $this.offset().top
        }, 1000, 'swing', function ()
        {
            if (id)
            {
                window.location.hash = '#' + id;
            }
        });

        return this;
    };

    /**
     * Gets a contents listing.
     *
     * This method can be used to generate menus and
     * content tables based on headings.
     *
     * The content listing is added to the target element
     * specified with the <code>target</code> option. If
     * the target is left to its default <code>NULL</code>,
     * the list is added before the first heading.
     *
     * @param    {Object}       [options={}]          Options 
     * @param    {Object|null}  [options.target=null] The target where the list is added to, takes an jQuery object
     * @return   {Object}       this
     * @method   getContentList
     * @memberof jQuery.fn.thar
     * @example
     * $('h2, h3, h4, h5, h6').thar('getContentList', {
     *  'target' : $('nav#contents')
     * });
     */

    methods.getContentList = function (options)
    {
        options = $.extend({
            target : null
        }, options);

        var previousLevel = 0, contents = '', baseLevel = this.get(0).nodeName.substr(1, 1);

        this.filter('h1, h2, h3, h4, h5, h6').each(function ()
        {
            var $this = $(this), level = this.nodeName.substr(1, 1);

            if (level > baseLevel || !$this.attr('id'))
            {
                return;
            }

            if (!previousLevel)
            {
                contents += '<li>';
            }
            else if (level == previousLevel)
            {
                contents += '</li><li>';
            }
            else if (level > previousLevel)
            {
                contents += new Array(level - previousLevel + 1).join('<ul><li>');
            }
            else if (level < previousLevel)
            {
                contents += new Array(level - previousLevel + 1).join('</li></ul>') + '</li><li>';
            }

            previousLevel = level;
            contents += $('<div />').html($('<a />').text($this.clone().find('.jquery-thar-anchor').remove().end().text()).attr('href', '#' + $this.attr('id'))).html();
        });

        if (contents)
        {
            contents = '<ul>' + contents + new Array(previousLevel - baseLevel + 1).join('</li></ul>') + '</li></ul>';

            if (!options.target)
            {
                this.eq(0).before(contents);
            }
            else
            {
                options.target.html(contents);
            }
        }

        return this;
    };

    /**
     * Renders content anchor links.
     *
     * @param    {Object}         [options={}]              Options
     * @param    {String}         [options.prefix='']       A prefix added to the generated links
     * @param    {String|Boolean} [options.anchor=&gt;#167] The anchor link text
     * @return   {Object}         this
     * @method   init
     * @memberof jQuery.fn.thar
     */

    methods.init = function (options)
    {
        options = $.extend({
            'anchor' : '&#167;'
        }, options);

        return this.thar('setAnchorID').each(function ()
        {
            var _this = this, $this = $(this), id = $this.attr('id'), anchor, content = $this.text();

            if ($this.hasClass('jquery-thar'))
            {
                return;
            }

            $this.addClass('jquery-thar').trigger('anchorcreate.thar');

            if (id === hash)
            {
                methods.scrollTo.apply(this);

                $this.trigger('anchorload.thar', {
                    'id' : id
                });

                hash = false;
            }

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
        });
    };

    /**
     * Renders content anchor links.
     *
     * @param    {String}  [method=init] The called method
     * @param    {Object}  [options={}]  Options passed to the method
     * @class    thar
     * @memberof jQuery.fn
     */

    $.fn.thar = function (method, options)
    {
        if ($.type(method) !== 'string' || $.type(methods[method]) !== 'function')
        {
            options = method;
            method = 'init';
        }

        return methods[method].call(this, options);
    };
}));