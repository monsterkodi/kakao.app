// monsterkodi/kakao 0.1.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}}

import dom from "../../../kxk/dom.js"
let stopEvent = dom.stopEvent

import kstr from "../../../kxk/kstr.js"

export default {actions:{insertOrDeleteTab:{combos:['tab','shift+tab']}},insertOrDeleteTab:function (key, info)
{
    stopEvent((info != null ? info.event : undefined))
    switch (info.combo)
    {
        case 'tab':
            return this.insertTab()

        case 'shift+tab':
            return this.deleteTab()

    }

},insertTab:function ()
{
    var c, il, n, newCursors

    if (this.numSelections())
    {
        return this.indent()
    }
    else
    {
        this.do.start()
        newCursors = this.do.cursors()
        il = this.indentString.length
        var list = _k_.list(newCursors)
        for (var _33_18_ = 0; _33_18_ < list.length; _33_18_++)
        {
            c = list[_33_18_]
            n = 4 - (c[0] % il)
            this.do.change(c[1],kstr.splice(this.do.line(c[1]),c[0],0,_k_.lpad(n)))
            cursorDelta(c,n)
        }
        this.do.setCursors(newCursors)
        return this.do.end()
    }
},deleteTab:function ()
{
    var c, n, newCursors, t

    if (this.numSelections())
    {
        return this.deIndent()
    }
    else
    {
        this.do.start()
        newCursors = this.do.cursors()
        var list = _k_.list(newCursors)
        for (var _47_18_ = 0; _47_18_ < list.length; _47_18_++)
        {
            c = list[_47_18_]
            if (c[0])
            {
                n = (c[0] % this.indentString.length) || this.indentString.length
                t = this.do.textInRange([c[1],[c[0] - n,c[0]]])
                if (t.trim().length === 0)
                {
                    this.do.change(c[1],kstr.splice(this.do.line(c[1]),c[0] - n,n))
                    cursorDelta(c,-n)
                }
            }
        }
        this.do.setCursors(newCursors)
        return this.do.end()
    }
}}