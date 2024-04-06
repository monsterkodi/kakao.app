var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}}

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let matchr = kxk.matchr

class Strings
{
    constructor (editor)
    {
        this.editor = editor
    
        this.onCursor = this.onCursor.bind(this)
        this.setupConfig = this.setupConfig.bind(this)
        this.editor.on('cursor',this.onCursor)
        this.editor.on('fileTypeChanged',this.setupConfig)
        this.setupConfig()
    }

    setupConfig ()
    {
        var a, p

        return this.config = (function () { var r_21_66_ = []; for (var p in this.editor.stringCharacters)  { var a = this.editor.stringCharacters[p];r_21_66_.push([new RegExp(kstr.escapeRegexp(p)),a])  } return r_21_66_ }).bind(this)()
    }

    onCursor ()
    {
        var h

        if (this.editor.numHighlights())
        {
            var list = _k_.list(this.editor.highlights())
            for (var _26_18_ = 0; _26_18_ < list.length; _26_18_++)
            {
                h = list[_26_18_]
                if (!(h[2] != null))
                {
                    return
                }
            }
        }
        if (this.highlightInside(this.editor.cursorPos()))
        {
            return
        }
        this.clear()
        return this.editor.renderHighlights()
    }

    highlightInside (pos)
    {
        var cp, i, li, line, lst, pair, pairs, rngs, stack, ths

        stack = []
        pairs = []
        pair = null
        var _39_17_ = pos; cp = _39_17_[0]; li = _39_17_[1]

        line = this.editor.line(li)
        rngs = matchr.ranges(this.config,line)
        if (!rngs.length)
        {
            return
        }
        for (var _43_18_ = i = 0, _43_22_ = rngs.length; (_43_18_ <= _43_22_ ? i < rngs.length : i > rngs.length); (_43_18_ <= _43_22_ ? ++i : --i))
        {
            ths = rngs[i]
            if (ths.start > 0 && line[ths.start - 1] === '\\')
            {
                if (ths.start - 1 <= 0 || line[ths.start - 2] !== '\\')
                {
                    continue
                }
            }
            if (lst = _k_.last(stack))
            {
                if ((lst.match === "'" && "'" === ths.match) && lst.start === ths.start - 1)
                {
                    stack.pop()
                    continue
                }
                if (lst.match === ths.match)
                {
                    pairs.push([stack.pop(),ths])
                    if (!(pair != null))
                    {
                        if ((_k_.last(pairs)[0].start <= cp && cp <= ths.start + 1))
                        {
                            pair = _k_.last(pairs)
                        }
                    }
                    continue
                }
            }
            if (stack.length > 1 && stack[stack.length - 2].match === ths.match)
            {
                stack.pop()
                pairs.push([stack.pop(),ths])
                if (!(pair != null))
                {
                    if ((_k_.last(pairs)[0].start <= cp && cp <= ths.start + 1))
                    {
                        pair = _k_.last(pairs)
                    }
                }
                continue
            }
            stack.push(ths)
        }
        if ((pair != null))
        {
            this.highlight(pair,li)
            return true
        }
    }

    highlight (pair, li)
    {
        var cls, opn

        this.clear()
        var _78_18_ = pair; opn = _78_18_[0]; cls = _78_18_[1]

        pair[0].clss = `stringmatch ${this.editor.stringCharacters[opn.match]}`
        pair[1].clss = `stringmatch ${this.editor.stringCharacters[cls.match]}`
        this.editor.addHighlight([li,[opn.start,opn.start + opn.match.length],pair[0]])
        this.editor.addHighlight([li,[cls.start,cls.start + cls.match.length],pair[1]])
        return this.editor.renderHighlights()
    }

    clear ()
    {
        return this.editor.setHighlights(this.editor.highlights().filter(function (h)
        {
            var _86_79_

            return !(h[2] != null ? (_86_79_=h[2].clss) != null ? _86_79_.startsWith('stringmatch') : undefined : undefined)
        }))
    }
}

export default Strings;