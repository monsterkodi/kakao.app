var toExport = {}
var _k_

var near, scoot

import scooter from "../scooter.js"

near = scooter.near

scoot = function (s)
{
    return Number.parseFloat(scooter(s))
}
toExport["scooter"] = function ()
{
    section("add", function ()
    {
        compare(scoot('1+1'),2)
        compare(scoot('0+0'),0)
        compare(scoot('+2'),2)
        compare(scoot('-3'),-3)
    })
    section("multiply", function ()
    {
        compare(scoot('9*9'),81)
        compare(scoot('9*-3'),-27)
        compare(scoot('-2*-2'),4)
        compare(scoot('3*3*3'),27)
        compare(scooter('1/0'),'∞')
        compare(scoot('1/0'),NaN)
        compare(scoot('0/0'),NaN)
        compare(scoot('1/Infinity'),0)
    })
    section("pow", function ()
    {
        compare(scoot('2^2'),4)
        compare(scoot('2^-2'),0.25)
        return
        compare(scoot('2^0.5'),Math.sqrt(2))
        compare(scoot('2^2^2'),16)
        compare(scoot('2^3^4'),Math.pow(2,Math.pow(3,4)))
        compare(scoot('2^(3^4)'),Math.pow(2,Math.pow(3,4)))
        compare(scoot('(2^3)^4'),4096)
    })
    section("constants", function ()
    {
        compare(scoot('PI'),Math.PI)
        compare(scoot('E'),Math.E)
        compare(scoot('PHI'),(1 + Math.sqrt(5)) / 2)
    })
    section("trigonometry", function ()
    {
        compare(scoot('cos(PI)'),-1)
        compare(scoot('sin(PI/2)'),1)
        compare(scoot('cos(sin(PI))'),1)
    })
    section("logarithm", function ()
    {
        compare(scoot('log(E)'),1)
        compare(scooter('log(0)'),'-∞')
        compare(scoot('log(-1)'),NaN)
        compare(scoot('log(10)'),Math.log(10))
    })
    section("deg rad", function ()
    {
        compare(scoot('rad(180)'),Math.PI)
        compare(scoot('deg(PI)'),180)
        compare(scoot('deg(rad(E))'),Math.E)
        compare(scoot('rad(deg(E))'),Math.E)
    })
    section("sqrt", function ()
    {
        compare(scoot('sqrt(9)'),3)
        compare(scoot('sqrt(8+1)'),3)
        compare(scoot('sqrt(E^2)'),Math.E)
        compare(near(scoot('sqrt(E)^2'),Math.E),true)
    })
    section("unicode", function ()
    {
        compare(scoot('∡(π)'),180)
        compare(scoot('√(9)'),3)
        compare(scoot('π'),Math.PI)
        compare(scoot('𝒆'),Math.E)
        compare(scooter('∞'),'∞')
        compare(scoot('∞'),NaN)
        compare(scoot('ϕ'),(1 + Math.sqrt(5)) / 2)
        section("degree", function ()
        {
            compare(scoot('180°'),Math.PI)
            compare(scoot('(90+90)°'),Math.PI)
            compare(scoot('(2*90)°'),Math.PI)
            compare(scoot('2*90°'),Math.PI)
            compare(scoot('90°+90°'),Math.PI)
            compare(scoot('60°+60°+60°'),Math.PI)
            compare(scoot('360°/2'),Math.PI)
            compare(scoot('(360/2)°'),Math.PI)
            compare(scoot('cos(0°)'),1)
            compare(scoot('cos(180°)'),-1)
            compare(scoot('sin(0°)'),0)
            compare(near(scoot('sin(180°)'),0),true)
        })
    })
    section("bigint", function ()
    {
        compare(scooter('2^3^4'),'2417851639229258349412352')
        compare(scooter('3*2^3^4'),'1072139461476102233493626136964173172062641806115278289878646784')
        compare(scooter('4*2^3^4'),'14134776518227074636666380005943348126619871175004951664972849610340958208')
    })
    section("smallfloat", function ()
    {
        compare(scooter('1/(2^3^4)'),'0.000000000000000000000000414')
    })
    section("precision", function ()
    {
        compare(scooter('cos(PI/2)'),'0.0000000000000000612')
        compare(scooter('cos(PI/2)',17),'0.00000000000000006')
        compare(scooter('cos(PI/2)',16),'0.0000000000000001')
        compare(scooter('cos(PI/2)',15),'0')
    })
}
toExport["scooter"]._section_ = true
toExport._test_ = true
export default toExport