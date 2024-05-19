var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../kxk.js"
let matchr = kxk.matchr

class Color
{
    constructor ()
    {
        var cfg

        this.colorize = this.colorize.bind(this)
        cfg = {'0x':'hex','[abcdef]':'digit','=':'equals','e[-+]':'exponent','[\\.]':'dot','[\\(\\)]':'bracket','\\d+':'digit','°':'digit','i':'complex','(sin|cos|a?tan|exp|log|hex)':'function','NaN':'nan','[π∞ϕ]':'constant','[∡√^]':'op0','[*/]':'op1','[+-]':'op2'}
        cfg[symbol.euler] = 'constant'
        this.config = matchr.config(cfg)
    }

    colorize (text)
    {
        var clss, colorized, index, rng, rngs, _48_28_

        rngs = matchr.ranges(this.config,text)
        colorized = ''
        index = 0
        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            while (index < rng.start)
            {
                index += 1
                colorized += "&nbsp;"
            }
            if (index > rng.start)
            {
                continue
            }
            clss = ((_48_28_=rng.clss) != null ? _48_28_ : 'text')
            colorized += `<span class=\"${clss}\">${rng.match}</span>`
            index = rng.start + rng.match.length
        }
        while (index < text.length)
        {
            index += 1
            colorized += "&nbsp;"
        }
        return colorized
    }
}

export default (new Color()).colorize;