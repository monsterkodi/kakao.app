var toExport = {}
var _k_

var bs, es, fs, is, ns, ss

import kstr from "../../kxk/kstr.js"

import EditorState from "../editor/EditorState.js"

toExport["EditorState"] = function ()
{
    section("init", function ()
    {
        is = new EditorState(['hello','world','!'])
        compare(is.lines(),['hello','world','!'])
        compare(is.numLines(),3)
    })
    section("delete", function ()
    {
        ns = is.deleteLine(1)
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hello','!'])
        compare(ns.numLines(),2)
        ss = ns.deleteLine(1)
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hello','!'])
        compare(ss.lines(),['hello'])
        compare(ss.numLines(),1)
        es = ss.deleteLine(0)
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hello','!'])
        compare(ss.lines(),['hello'])
        compare(es.lines(),[])
        compare(es.numLines(),0)
        es = es.deleteLine(0)
        compare(es.lines(),[])
        compare(es.numLines(),0)
        es = is.deleteLine(100)
        compare(es.lines(),['hello','world','!'])
    })
    section("change", function ()
    {
        ns = is.changeLine(1,'test')
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hello','test','!'])
        compare(ns.numLines(),3)
        fs = ns.changeLine(0,'good')
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hello','test','!'])
        compare(fs.lines(),['good','test','!'])
        compare(fs.numLines(),3)
        fs = fs.changeLine(2,'!!!')
        compare(is.lines(),['hello','world','!'])
        compare(fs.lines(),['good','test','!!!'])
        compare(fs.numLines(),3)
    })
    section("insert", function ()
    {
        ns = is.insertLine(1,'new')
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hello','new','world','!'])
        compare(ns.numLines(),4)
        bs = ns.insertLine(1,'brave')
        compare(bs.lines(),['hello','brave','new','world','!'])
        compare(bs.numLines(),5)
        ns = is.insertLine(0,'hi')
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hi','hello','world','!'])
        compare(ns.numLines(),4)
        ns = is.insertLine(2,'?')
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hello','world','?','!'])
        compare(ns.numLines(),4)
        ns = is.insertLine(-1,'>')
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['>','hello','world','!'])
        compare(ns.numLines(),4)
        ns = is.insertLine(Infinity,'<')
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hello','world','!','<'])
        compare(ns.numLines(),4)
    })
    section("append", function ()
    {
        ns = is.appendLine('howdy?')
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hello','world','!','howdy?'])
    })
    section("line", function ()
    {
        is = new EditorState(['hello','world','!'])
        compare(is.line(0),'hello')
        compare(is.line(1),'world')
        compare(is.line(2),'!')
        compare(is.line(3),undefined)
        compare(is.line(-1),undefined)
    })
    section("empty", function ()
    {
        es = new EditorState([])
        compare(es.numLines(),0)
        compare(es.text(),'')
        compare(es.lines(),[])
        es = new EditorState([''])
        compare(es.numLines(),1)
        compare(es.text(),'')
        compare(es.lines(),[''])
        es = new EditorState()
        compare(es.numLines(),0)
        compare(es.text(),'')
        compare(es.lines(),[])
        ns = es.insertLine(0,'!')
        compare(ns.text(),'!')
        compare(ns.numLines(),1)
        ns = ns.changeLine(0,'!!!')
        compare(ns.text(),'!!!')
        compare(ns.numLines(),1)
        ns = es.changeLine(0,'!?!')
        compare(ns.text(),'')
        compare(ns.numLines(),0)
    })
}
toExport["EditorState"]._section_ = true
toExport._test_ = true
export default toExport
