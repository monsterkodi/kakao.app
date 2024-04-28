var _k_ = {isArr: function (o) {return Array.isArray(o)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var DoState

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let immutable = kxk.immutable


DoState = (function ()
{
    function DoState (stateOrLines = [])
    {
        if (immutable.isImmutable(stateOrLines))
        {
            this.s = stateOrLines
        }
        else if (_k_.isArr(stateOrLines))
        {
            this.s = this.stateForLines(stateOrLines)
        }
    }

    DoState.prototype["stateForLines"] = function (lineStrings)
    {
        var lines, mcy, numLines

        numLines = lineStrings.length
        mcy = _k_.min(0,numLines - 1)
        lines = this.dictFromLines(lineStrings)
        return immutable({lines:lines,numLines:numLines,cursors:[[0,mcy]],selections:[],highlights:[],main:0})
    }

    DoState.prototype["dictFromLines"] = function (lines)
    {
        var dict, index, line

        dict = {}
        var list = _k_.list(lines)
        for (index = 0; index < list.length; index++)
        {
            line = list[index]
            dict[index] = line
        }
        return dict
    }

    DoState.prototype["line"] = function (i)
    {
        return this.s.lines[i]
    }

    DoState.prototype["lines"] = function ()
    {
        var index, l, line

        l = []
        for (index in this.s.lines)
        {
            line = this.s.lines[index]
            l.push(line)
        }
        return l
    }

    DoState.prototype["changeLine"] = function (i, t)
    {
        return this.s = this.s.setIn(['lines',i],t)
    }

    DoState.prototype["insertLine"] = function (i, t)
    {
        var lines

        lines = this.lines()
        lines.splice(i,0,t)
        this.s = this.s.set('lines',this.dictFromLines(lines))
        return this.s = this.s.set('numLines',lines.length)
    }

    DoState.prototype["deleteLine"] = function (i)
    {
        var lines

        if (i > this.s.numLines - 1)
        {
            return
        }
        if (i < 0 && -i > this.s.numLines)
        {
            return
        }
        lines = this.lines()
        lines.splice(i,1)
        this.s = this.s.set('lines',this.dictFromLines(lines))
        return this.s = this.s.set('numLines',lines.length)
    }

    DoState.prototype["appendLine"] = function (t)
    {
        return this.insertLine(Infinity,t)
    }

    DoState.prototype["text"] = function (n = '\n')
    {
        return this.lines().join(n)
    }

    DoState.prototype["tabline"] = function (i)
    {
        return this.lines()[i]
    }

    DoState.prototype["cursors"] = function ()
    {
        return this.s.cursors.asMutable({deep:true})
    }

    DoState.prototype["highlights"] = function ()
    {
        return this.s.highlights.asMutable({deep:true})
    }

    DoState.prototype["selections"] = function ()
    {
        return this.s.selections.asMutable({deep:true})
    }

    DoState.prototype["main"] = function ()
    {
        return this.s.main
    }

    DoState.prototype["cursor"] = function (i)
    {
        return (this.s.cursors[i] != null ? this.s.cursors[i].asMutable({deep:true}) : undefined)
    }

    DoState.prototype["selection"] = function (i)
    {
        return (this.s.selections[i] != null ? this.s.selections[i].asMutable({deep:true}) : undefined)
    }

    DoState.prototype["highlight"] = function (i)
    {
        return (this.s.highlights[i] != null ? this.s.highlights[i].asMutable({deep:true}) : undefined)
    }

    DoState.prototype["numLines"] = function ()
    {
        return this.s.numLines
    }

    DoState.prototype["numCursors"] = function ()
    {
        return this.s.cursors.length
    }

    DoState.prototype["numSelections"] = function ()
    {
        return this.s.selections.length
    }

    DoState.prototype["numHighlights"] = function ()
    {
        return this.s.highlights.length
    }

    DoState.prototype["mainCursor"] = function ()
    {
        return this.s.cursors[this.s.main].asMutable({deep:true})
    }

    DoState.prototype["setSelections"] = function (s)
    {
        return this.s = this.s.set('selections',s)
    }

    DoState.prototype["setHighlights"] = function (h)
    {
        return this.s = this.s.set('highlights',h)
    }

    DoState.prototype["setCursors"] = function (c)
    {
        return this.s = this.s.set('cursors',c)
    }

    DoState.prototype["setMain"] = function (m)
    {
        return this.s = this.s.set('main',m)
    }

    DoState.prototype["addHighlight"] = function (h)
    {
        var m

        m = this.s.highlights.asMutable()
        m.push(h)
        return this.s = this.s.set('highlights',m)
    }

    return DoState
})()

export default DoState;