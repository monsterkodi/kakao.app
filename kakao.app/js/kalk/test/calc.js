var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var l, list, t

import symbol from "../symbol.js"
import calc from "../calc.js"

toExport["calc"] = function ()
{
    section("calc", function ()
    {
        list = [['2^2^2','16'],['2^(3^4)','2417851639229258349412352'],['2^3^4','2417851639229258349412352'],['(2^3)^4','4096'],['9*-3','-27'],['180°','3.141592653589793'],['√(9)','3'],['√(8+1','3'],['log(E','1'],['cos(π','-1'],['sin(π/2','1'],['cos(sin(π','1'],['1/0','∞'],['1/(∞','0'],['0/0','']]
        var list1 = _k_.list(list)
        for (var _32_14_ = 0; _32_14_ < list1.length; _32_14_++)
        {
            l = list1[_32_14_]
            compare(calc.calc(l[0]),l[1])
        }
    })
    section("equals", function ()
    {
        list = [['2^2','=','4'],['2^4','=','16'],['2^2^2','=','16']]
        var list2 = _k_.list(list)
        for (var _42_14_ = 0; _42_14_ < list2.length; _42_14_++)
        {
            l = list2[_42_14_]
            compare(calc.textKey(l[0],l[1]),l[2])
        }
    })
    section("replace", function ()
    {
        list = [['2^0','1'],['2^0','2'],['∞','3']]
        var list3 = _k_.list(list)
        for (var _52_14_ = 0; _52_14_ < list3.length; _52_14_++)
        {
            l = list3[_52_14_]
            compare(calc.textKey(l[0],l[1]),l[0].substr(0,l[0].length - 1) + l[1])
        }
    })
    section("block", function ()
    {
        list = [[['0','0°',symbol.euler,'π'],'0'],[['1°',symbol.euler,'π'],'1'],[['2°',symbol.euler,'π'],'π'],[['3°',symbol.euler,'π'],symbol.euler],[['','4^'],'^'],[['','5.','5°','5.5'],'.'],[['','6.','6/'],'/'],[['','7.','7*'],'*'],[['8°','8.',symbol.euler,'π'],'°'],[['9.'],'√'],[['','(','2+2','((2+2)*3)'],')']]
        var list4 = _k_.list(list)
        for (var _76_14_ = 0; _76_14_ < list4.length; _76_14_++)
        {
            l = list4[_76_14_]
            var list5 = _k_.list(l[0])
            for (var _77_18_ = 0; _77_18_ < list5.length; _77_18_++)
            {
                t = list5[_77_18_]
                compare(calc.textKey(t,l[1]),t)
            }
        }
    })
}
toExport["calc"]._section_ = true
toExport._test_ = true
export default toExport
