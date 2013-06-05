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
            var $this = $(this), id = $this.attr('id'), content, occurrences = 1;

            if (!id)
            {
                content = $this.text();

                id = encodeURIComponent(content.replace(/\s/g, '-'))
                    .replace(/[^A-Z0-9\-]/gi, '-')
                    .substr(0, 255)
                    .replace(/^[\d\-]|-$/g, '')
                    .replace(/-{2,}/g, '-')
                    .toLowerCase();

                uniqueID = id;

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
     * Renders content anchor links.
     *
     * @param    {Object}         options                   Options
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

        var ul = $('<ul />');

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