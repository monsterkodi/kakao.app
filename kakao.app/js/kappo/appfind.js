var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var activateApp, activeApp, activeWin, allKeys, appName, apps, findApps, getActiveApp, scripts

import kxk from "../kxk.js"
let post = kxk.post
let slash = kxk.slash
let walkdir = kxk.walkdir

apps = {}
allKeys = []
scripts = {sleep:{exec:"pmset sleepnow",img:`${_k_.dir()}/../scripts/sleep.png`},shutdown:{exec:"osascript -e 'tell app \"System Events\" to shut down'",img:`${_k_.dir()}/../scripts/shutdown.png`},restart:{exec:"osascript -e 'tell app \"System Events\" to restart'",img:`${_k_.dir()}/../scripts/restart.png`}}
post.on('runScript',function (name)
{
    return scripts[name].cb()
})
post.on('hideWin',function ()
{
    return (win != null ? win.hide() : undefined)
})
post.on('cancel',function ()
{
    return activateApp()
})
post.on('findApps',function ()
{
    return findApps()
})

findApps = async function ()
{
    var appFolder, appFolders, root, walk

    console.log('findApps')
    apps = {}
    apps['Finder'] = "/System/Library/CoreServices/Finder.app"
    appFolders = ["/Applications","/Applications/Utilities","/System/Applications","/System/Applications/Utilities","~/s"]
    var list = _k_.list(appFolders)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        appFolder = list[_a_]
        console.log('scanning appFolder',appFolder)
        root = slash.untilde(appFolder)
        walk = await walkdir({root:root,dir:function (p)
        {
            var e

            e = slash.ext(p)
            if (e === 'app')
            {
                apps[slash.name(p)] = p
                return false
            }
            return true
        }})
        console.log('apps',apps)
    }
    allKeys = Object.keys(apps).concat(Object.keys(scripts))
    allKeys.sort(function (a, b)
    {
        return a.toLowerCase().localeCompare(b.toLowerCase())
    })
    return post.emit('appsFound')
}
appName = null
activeApp = null
activeWin = null

getActiveApp = function ()
{
    var top, wxw, _91_20_

    if (slash.win())
    {
        wxw = require('wxw')
        top = wxw('info','top')[0]
        if (((top != null ? top.path : undefined) != null))
        {
            appName = activeApp = slash.base(top.path)
        }
    }
    else
    {
        activeApp = childp.execSync(`${_k_.dir()}/../bin/appswitch -P`,{encoding:'utf8'})
    }
    klog('getActiveApp appName',appName,'-> activeApp',activeApp)
    if ((win != null))
    {
        if ((appName != null))
        {
            klog('getActiveApp post.currentApp',appName)
            post.toWins('currentApp',appName)
        }
        else
        {
            klog('getActiveApp clearSearch',appName)
            post.toWins('clearSearch')
        }
        return post.toWins('fade')
    }
    else
    {
        return createWindow()
    }
}

activateApp = function ()
{
    console.log('activeApp')
}
export default {findApps:findApps,getActiveApp:getActiveApp,activateApp:activateApp,activateApp:activateApp}