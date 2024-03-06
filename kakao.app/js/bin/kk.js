// monsterkodi/kode 0.256.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.w4=_k_.k.F256(_k_.k.w(4))

var args, childp

import os from "../kxk/os.js"

import karg from "../kxk/karg.js"

import slash from "../kxk/slash.js"

import knrd from "./knrd.js"

import build from "./build.js"

import process from "process"

import child_process from "child_process"

import path from "path"

import fs from 'fs/promises'
childp = child_process
args = karg(`kk
    options                                  **
    info       show build status             = false
    knrd       transpile kode, styl, pug     = false
    build      build application executable  = false
    rebuild    rebuild all targets           = false -R
    test       run tests                     = false
    run        run application executable    = false
    clean      remove transpilated files     = false 
    verbose    log more                      = false
    quiet      log nothing                   = false
    debug      log debug                     = false`)
class kk
{
    static async run ()
    {
        var sleep

        sleep = async function (ms)
        {
            await new Promise((function (r)
            {
                return setTimeout(r,ms)
            }).bind(this))
            return true
        }
        while (!os.loaded)
        {
            await sleep(150)
        }
        if (!(args.info || args.test || args.knrd || args.build || args.run || args.clean || args.rebuild))
        {
            args.info = true
            args.knrd = true
            args.build = true
            args.test = true
            args.run = true
        }
        if (args.info)
        {
            await kk.info()
        }
        if (args.knrd)
        {
            await knrd(args.options)
            delete args.options
        }
        if (args.build)
        {
            await kk.build()
        }
        if (args.test)
        {
            await kk.test()
        }
        if (args.run)
        {
            await kk.spawn()
        }
        if (args.clean)
        {
            await kk.clean()
        }
        if (args.rebuild)
        {
            await kk.rebuild()
        }
        if (!_k_.empty(args.options))
        {
            console.log('leftover options',args.options)
        }
    }

    static async build ()
    {
        console.log('🛠')
        return build()
    }

    static async rebuild ()
    {
        await knrd()
        await kk.build()
        return kk.spawn()
    }

    static spawn ()
    {
        var cmd, opt

        console.log('🚀')
        cmd = slash.path(import.meta.dirname,'../../Contents/MacOS/kakao')
        opt = {shell:true,detached:true}
        return childp.spawn(cmd,[],opt)
    }

    static async info ()
    {
        console.log(_k_.w4('○● info'))
    }

    static async test ()
    {
        var cmd, opt

        cmd = "node js/test/test.js"
        opt = {shell:true,cwd:kk.appPath()}
        return new Promise(function (resolve, reject)
        {
            return childp.exec(cmd,opt,function (err, stdout, stderr)
            {
                if (err)
                {
                    console.error('ERROR',err)
                    return reject(err)
                }
                else
                {
                    if (!_k_.empty(stdout))
                    {
                        console.log(stdout)
                    }
                    return resolve()
                }
            })
        })
    }

    static appPath ()
    {
        return slash.path(import.meta.dirname,'../../')
    }

    static appName ()
    {
        return slash.name(kk.appPath())
    }

    static async clean ()
    {
        var appExe, jsDir

        jsDir = slash.path(import.meta.dirname,'../../js')
        appExe = slash.path(import.meta.dirname,'../../Contents/MacOS/kakao')
        await fs.rm(jsDir,{recursive:true,force:true})
        return await fs.unlink(appExe)
    }
}

global['kk'] = kk
export default kk.run;