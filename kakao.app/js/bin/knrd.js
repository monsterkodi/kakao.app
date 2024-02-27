// monsterkodi/kode 0.256.0

var _k_ = {profile: function (id) {_k_.hrtime ??= {}; _k_.hrtime[id] = process.hrtime.bigint()}, profilend: function (id) { var b = process.hrtime.bigint()-_k_.hrtime[id]; let f=1000n; for (let u of ['ns','μs','ms','s']) { if (u=='s' || b<f) { return console.log(id+' '+(1000n*b/f)+' '+u); } f*=1000n; }}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.r4=_k_.k.F256(_k_.k.r(4));_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g2=_k_.k.F256(_k_.k.g(2));_k_.g3=_k_.k.F256(_k_.k.g(3));_k_.g5=_k_.k.F256(_k_.k.g(5));_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.c3=_k_.k.F256(_k_.k.c(3));_k_.c5=_k_.k.F256(_k_.k.c(5));_k_.m3=_k_.k.F256(_k_.k.m(3));_k_.m4=_k_.k.F256(_k_.k.m(4));_k_.y5=_k_.k.F256(_k_.k.y(5))

var dirname, knrd

import Kode from './kode/kompile.js'
import slash from '../lib/kxk/slash.js'
import kolor from '../lib/kxk/kolor.js'
import dirlist from '../lib/kxk/dirlist.js'
import { pug , stylus } from '../../bin/min.mjs'
import fs from 'fs/promises'
import path from 'path'
kolor.globalize()
dirname = path.dirname(import.meta.url.slice(7))

knrd = async function (files = [], opt = {})
{
    var compText, cssDir, cssFile, file, jsDir, jsFile, kode, kodeDir, kodeFile, kodeText, list, origText, pugDir, srcFile, srcText, stylFile, stylText, tgtFile, tgtText, transpiled, _26_23_, _27_19_

    opt.rerunWhenDirty = ((_26_23_=opt.rerunWhenDirty) != null ? _26_23_ : true)
    opt.logVerbose = ((_27_19_=opt.logVerbose) != null ? _27_19_ : false)
    _k_.profile('🔨')
    kode = new Kode
    kodeDir = slash.resolve(import.meta.dirname + '/../../kode')
    pugDir = slash.resolve(import.meta.dirname + '/../../pug')
    jsDir = slash.resolve(import.meta.dirname + '/../../js')
    cssDir = slash.resolve(import.meta.dirname + '/../../js/css')
    if (_k_.empty(files))
    {
        list = await dirlist(kodeDir)
        list = list.concat(await dirlist(pugDir))
        list = list.filter(function (item)
        {
            return item.type === 'file'
        })
        files = list.map(function (item)
        {
            return item.path
        })
    }
    console.log('🔨 ',files.length)
    transpiled = 0
    var list1 = _k_.list(files)
    for (var _47_13_ = 0; _47_13_ < list1.length; _47_13_++)
    {
        file = list1[_47_13_]
        switch (slash.ext(file))
        {
            case 'kode':
                kodeFile = file
                jsFile = slash.swapExt(kodeFile.replace(kodeDir,jsDir),'js')
                kodeText = await fs.readFile(kodeFile,{encoding:'utf8'})
                origText = await fs.readFile(jsFile,{encoding:'utf8'})
                compText = kode.compile(kodeText)
                if (_k_.empty(compText))
                {
                    console.log(_k_.y5('✘ '),_k_.r5(err),_k_.r4('transpiles to empty!'))
                }
                else
                {
                    if (origText !== compText)
                    {
                        transpiled++
                        console.log(_k_.b5('▶ '),_k_.g5(slash.tilde(kodeFile)))
                        await slash.write(jsFile,compText)
                        console.log(_k_.b5('✔ '),_k_.g5(slash.tilde(jsFile)))
                    }
                    else if (opt.logVerbose)
                    {
                        console.log(_k_.g2('✔ '),_k_.g3(slash.tilde(kodeFile)))
                    }
                }
                break
            case 'styl':
                stylFile = file
                cssFile = slash.swapExt(stylFile.replace(pugDir,cssDir),'css')
                stylText = await fs.readFile(stylFile,{encoding:'utf8'})
                origText = await fs.readFile(cssFile,{encoding:'utf8'})
                compText = stylus(stylText)
                if (_k_.empty(compText))
                {
                    console.log(_k_.y5('✘ '),_k_.r5(err),_k_.r4('transpiles to empty!'))
                }
                else
                {
                    if (origText !== compText)
                    {
                        transpiled++
                        console.log(_k_.c3('▶ '),_k_.c5(slash.tilde(stylFile)))
                        await slash.write(cssFile,compText)
                        console.log(_k_.b5('✔ '),_k_.g5(slash.tilde(cssFile)))
                    }
                    else if (opt.logVerbose)
                    {
                        console.log(_k_.g2('✔ '),_k_.c3(slash.tilde(stylFile)))
                    }
                }
                null
                break
            case 'pug':
                srcFile = file
                tgtFile = slash.swapExt(srcFile.replace(pugDir,jsDir),'html')
                srcText = await fs.readFile(srcFile,{encoding:'utf8'})
                tgtText = await fs.readFile(tgtFile,{encoding:'utf8'})
                compText = pug(srcText)
                if (_k_.empty(compText))
                {
                    console.log(_k_.y5('✘ '),_k_.r5(srcFile),_k_.r4('transpiles to empty!'))
                }
                else
                {
                    if (tgtText !== compText)
                    {
                        transpiled++
                        console.log(_k_.m3('▶ '),_k_.m4(slash.tilde(srcFile)))
                        await slash.write(tgtFile,compText)
                        console.log(_k_.b5('✔ '),_k_.g5(slash.tilde(tgtFile)))
                    }
                    else if (opt.logVerbose)
                    {
                        console.log(_k_.g2('✔ '),_k_.m3(slash.tilde(srcFile)))
                    }
                }
                null
                break
        }

    }
    if (opt.rerunWhenDirty && transpiled)
    {
        _k_.profilend('🔨')
        return knrd(files,{rerunWhenDirty:false})
    }
    else
    {
        _k_.profilend('🔨')
        return process.exit(0)
    }
}
export default knrd;