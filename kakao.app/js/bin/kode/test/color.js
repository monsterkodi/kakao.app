var toExport = {}
// monsterkodi/kode 0.256.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var c, kc, ke, l, n, s

import utils from './utils.js'
kc = utils.kc
ke = utils.ke

toExport["color"] = function ()
{
    compare(kc("R1 'Red' + g1 ' green'"),"_k_.R1('Red' + _k_.g1(' green'))")
    for (c = 8; c >= 1; c--)
    {
        s = ''
        var list = _k_.list('RGBCMYW')
        for (var _19_14_ = 0; _19_14_ < list.length; _19_14_++)
        {
            n = list[_19_14_]
            l = n.toLowerCase()
            s += ke(`${n}${l}${c}(' ${n}${l}${c} ')`)
        }
        console.log(s)
    }
}
toExport["color"]._section_ = true
toExport._test_ = true
export default toExport
