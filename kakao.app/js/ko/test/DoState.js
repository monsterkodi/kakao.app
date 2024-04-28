var toExport = {}
var _k_

var cs, ds, es, is, os

import kstr from "../../kxk/kstr.js"

import DoState from "../editor/DoState.js"

toExport["DoState"] = function ()
{
    section("init", function ()
    {
        os = new DoState(['hello','world','!'])
        compare(os.lines(),['hello','world','!'])
        compare(os.numLines(),3)
    })
    section("delete", function ()
    {
        ds = new DoState(os.s)
        ds.deleteLine(1)
        compare(os.lines(),['hello','world','!'])
        compare(ds.lines(),['hello','!'])
        compare(ds.numLines(),2)
        ds.deleteLine(1)
        compare(os.lines(),['hello','world','!'])
        compare(ds.lines(),['hello'])
        compare(ds.numLines(),1)
        ds.deleteLine(0)
        compare(os.lines(),['hello','world','!'])
        compare(ds.lines(),[])
        compare(ds.numLines(),0)
        ds.deleteLine(0)
        compare(ds.lines(),[])
        compare(ds.numLines(),0)
    })
    section("delete fail", function ()
    {
        ds = new DoState(os.s)
        ds.deleteLine(-1)
        compare(ds.lines(),['hello','world'])
        ds.deleteLine(-2)
        compare(ds.lines(),['world'])
        ds.deleteLine(Infinity)
        compare(ds.lines(),['world'])
        ds.deleteLine(-5)
        compare(ds.lines(),['world'])
    })
    section("change", function ()
    {
        cs = new DoState(os.s)
        cs.changeLine(1,'test')
        compare(os.lines(),['hello','world','!'])
        compare(cs.lines(),['hello','test','!'])
        compare(cs.numLines(),3)
        cs.changeLine(0,'good')
        compare(os.lines(),['hello','world','!'])
        compare(cs.lines(),['good','test','!'])
        compare(cs.numLines(),3)
        cs.changeLine(2,'!!!')
        compare(os.lines(),['hello','world','!'])
        compare(cs.lines(),['good','test','!!!'])
        compare(cs.numLines(),3)
    })
    section("insert", function ()
    {
        cs = new DoState(os.s)
        cs.insertLine(1,'new')
        compare(os.lines(),['hello','world','!'])
        compare(cs.lines(),['hello','new','world','!'])
        compare(cs.numLines(),4)
        cs.insertLine(1,'brave')
        compare(cs.lines(),['hello','brave','new','world','!'])
        compare(cs.numLines(),5)
        cs.insertLine(0,'hi')
        compare(cs.lines(),['hi','hello','brave','new','world','!'])
        compare(cs.numLines(),6)
        cs.insertLine(-1,'>')
        compare(cs.lines(),['hi','hello','brave','new','world','>','!'])
        compare(cs.numLines(),7)
        cs.insertLine(Infinity,'<')
        compare(cs.lines(),['hi','hello','brave','new','world','>','!'])
        compare(cs.numLines(),7)
        cs.insertLine(7,'<')
        compare(cs.lines(),['hi','hello','brave','new','world','>','!','<'])
        compare(cs.numLines(),8)
    })
    section("append", function ()
    {
        cs = new DoState(os.s)
        cs.appendLine('howdy?')
        compare(os.lines(),['hello','world','!'])
        compare(cs.lines(),['hello','world','!','howdy?'])
        compare(cs.numLines(),4)
    })
    section("line", function ()
    {
        is = new DoState(os.s)
        compare(is.line(0),'hello')
        compare(is.line(1),'world')
        compare(is.line(2),'!')
        compare(is.line(3),undefined)
        compare(is.line(-1),undefined)
    })
    section("empty", function ()
    {
        es = new DoState([])
        compare(es.numLines(),0)
        compare(es.text(),'')
        compare(es.lines(),[])
        es = new DoState([''])
        compare(es.numLines(),1)
        compare(es.text(),'')
        compare(es.lines(),[''])
        es = new DoState()
        compare(es.numLines(),0)
        compare(es.text(),'')
        compare(es.lines(),[])
        es.insertLine(0,'!')
        compare(es.text(),'!')
        compare(es.numLines(),1)
        es.changeLine(0,'!!!')
        compare(es.text(),'!!!')
        compare(es.numLines(),1)
        es.changeLine(0,'!?!')
        compare(es.text(),'!?!')
        compare(es.numLines(),1)
    })
}
toExport["DoState"]._section_ = true
toExport._test_ = true
export default toExport
