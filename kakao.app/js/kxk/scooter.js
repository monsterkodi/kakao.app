var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var build, deg, descience, pow, scooter

import pepe from "./pepe.js"
import kstr from "./kstr.js"

import kode from "../kode/kode.js"


descience = function (str)
{
    if (_k_.in('e+',str))
    {
        str = BigInt(Number.parseFloat(str)).toString()
    }
    return str
}

pow = function (str)
{
    var splt

    splt = str.split('^')
    if (splt.length > 1)
    {
        str = `pow(${splt[0]}, ${pow(splt.slice(1).join('^'))})`
    }
    return str
}

deg = function (str)
{
    var i, pre, splt, val

    splt = str.split('°')
    if (splt.length > 1)
    {
        val = splt[0]
        if (val[0] === '(' && val.slice(-1)[0] === ')')
        {
            str = `rad${val}` + deg(splt.slice(1).join('°'))
        }
        else
        {
            for (var _38_21_ = i = val.length - 1, _38_35_ = 0; (_38_21_ <= _38_35_ ? i <= 0 : i >= 0); (_38_21_ <= _38_35_ ? ++i : --i))
            {
                if (!(_k_.in(val[i],'0.123456789')))
                {
                    pre = val.slice(0, typeof i === 'number' ? i+1 : Infinity)
                    val = val.slice(i + 1)
                    break
                }
            }
            pre = (pre != null ? pre : '')
            str = pre + `rad(${val})` + deg(splt.slice(1).join('°'))
        }
    }
    return str
}

build = function (str)
{
    var dep, pep

    pep = pepe(str)
    if (pep.length > 1 || !(_k_.isStr(pep[0])))
    {
        dep = pepe.depepe(pep,build)
        str = dep
    }
    str = pow(str)
    str = deg(str)
    return str
}

scooter = function (str)
{
    var b, k, ost, r, val

    ost = str
    str = str.replace(/log\(/g,'Math.log(')
    str = str.replace(/∡/,'deg')
    str = str.replace(/√/g,'sqrt')
    str = str.replace(/π/g,'PI')
    str = str.replace(/ϕ/g,'PHI')
    str = str.replace(/𝒆/g,'E')
    str = str.replace(/∞/g,'Infinity')
    b = `{PI, E, sqrt, pow, cos, sin, tan, acos, asin, atan} = Math
rad = d -> PI*d/180.0
deg = r -> r*180.0/PI
PHI = (1+sqrt(5))/2
`
    b += '(' + build(str) + ')'
    k = new kode
    r = k.eval(b)
    val = kstr(r)
    val = _k_.trim(val,' \n')
    val = val.replace(/Infinity/g,'∞')
    val = val.replace(/NaN/g,'')
    val = descience(val)
    return val
}

scooter.near = function (a, b)
{
    return Math.abs(a - b) < 0.000000000000001
}
export default scooter;