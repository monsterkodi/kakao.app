var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var calculus, render, styl, subvars, variables

import kstr from "./kstr.js"
let unfillet = kstr.unfillet
let blockFillets = kstr.blockFillets

variables = {}

subvars = function (fillets)
{
    var fillet, value

    var list = _k_.list(fillets)
    for (var _23_15_ = 0; _23_15_ < list.length; _23_15_++)
    {
        fillet = list[_23_15_]
        if (value = variables[fillet.match])
        {
            fillet.match = value
        }
    }
    return fillets
}

calculus = function (fillets)
{
    var fillet, index, lhs, lhu, result, rhs, rhu, unit

    var list = _k_.list(fillets)
    for (index = 0; index < list.length; index++)
    {
        fillet = list[index]
        if (_k_.in(fillet.match,'*+-/'))
        {
            lhs = parseFloat(fillets[index - 1].match)
            rhs = parseFloat(fillets[index + 1].match)
            if (_k_.isNum(lhs) && _k_.isNum(rhs))
            {
                lhu = _k_.trim(fillets[index - 1].match.slice((`${lhs}`).length))
                rhu = _k_.trim(fillets[index + 1].match.slice((`${rhs}`).length))
                unit = (!_k_.empty(lhu) ? lhu : rhu)
                result = eval(`${lhs} ${fillet.match} ${rhs}`)
                result += unit
                fillets.splice(index - 1,3,{match:result})
                return calculus(fillets)
            }
        }
    }
    return fillets
}

render = function (block, text)
{
    var b, idt, varName, varValue

    if ((block.fillet[0] != null ? block.fillet[0].match : undefined) === '//')
    {
        return text
    }
    if ((block.fillet[1] != null ? block.fillet[1].match : undefined) === '=')
    {
        varName = (block.fillet[0] != null ? block.fillet[0].match : undefined)
        varValue = unfillet(calculus(subvars(block.fillet.slice(2))))
        variables[varName] = varValue
        return text
    }
    idt = _k_.rpad(block.indent)
    if (!_k_.empty(block.blocks))
    {
        text += '\n' + idt + unfillet(block.fillet)
        text += '\n' + idt + '{'
        var list = _k_.list(block.blocks)
        for (var _63_14_ = 0; _63_14_ < list.length; _63_14_++)
        {
            b = list[_63_14_]
            text += render(b,'')
        }
        text += '\n' + idt + '}\n'
    }
    else
    {
        text += '\n'
        text += idt + block.fillet[0].match + ': ' + unfillet(calculus(subvars(block.fillet.slice(1))))
        text += ';'
    }
    return text
}

styl = function (srcText)
{
    var block, blocks, lines, tgtText

    variables = {}
    tgtText = ''
    lines = srcText.split('\n')
    blocks = blockFillets(lines.map(function (line)
    {
        return kstr.fillet(line,'-')
    }))
    var list = _k_.list(blocks)
    for (var _87_14_ = 0; _87_14_ < list.length; _87_14_++)
    {
        block = list[_87_14_]
        tgtText = render(block,tgtText)
    }
    return tgtText
}
export default styl;