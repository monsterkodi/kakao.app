var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var $, Browse

import dom from "../../kxk/dom.js"

import post from "../../kxk/post.js"

import slash from "../../kxk/slash.js"

import command from "../commandline/command.js"

import filebrowser from "../browser/filebrowser.js"

$ = dom.$


Browse = (function ()
{
    _k_.extend(Browse, command)
    function Browse (commandline)
    {
        this["onBrowserItemActivated"] = this["onBrowserItemActivated"].bind(this)
        this["listClick"] = this["listClick"].bind(this)
        this["changedCallback"] = this["changedCallback"].bind(this)
        this["completeCallback"] = this["completeCallback"].bind(this)
        this["onFile"] = this["onFile"].bind(this)
        Browse.__super__.constructor.call(this,commandline)
        this.cmdID = 0
        this.browser = new filebrowser($('browser'))
        console.log('Browser.browser',this.browser)
        this.commands = Object.create(null)
        this.names = ['browse','Browse','shelf']
        post.on('file',this.onFile)
        this.browser.on('itemActivated',this.onBrowserItemActivated)
        this.syntaxName = 'browser'
    }

    Browse.prototype["onFile"] = function (file)
    {
        if (this.isActive() && this.getText() !== slash.tilde(file))
        {
            return this.setText(slash.tilde(file))
        }
    }

    Browse.prototype["clear"] = function ()
    {
        if (this.browser.cleanUp())
        {
            return
        }
        return Browse.__super__.clear.call(this)
    }

    Browse.prototype["start"] = function (action)
    {
        var name, _58_40_

        this.browser.start()
        if (action !== 'shelf')
        {
            if ((window.editor.currentFile != null) && slash.isFile(window.editor.currentFile))
            {
                this.setText(slash.tilde(window.editor.currentFile))
                this.browser.navigateToFile(window.editor.currentFile)
            }
            else
            {
                post.emit('filebrowser','loadItem',{file:'~',type:'dir'})
            }
            this.browser.focus({force:true})
        }
        name = action
        if (action === 'shelf')
        {
            name = 'browse'
        }
        Browse.__super__.start.call(this,name)
        return {select:true,do:this.name === 'Browse' && 'half browser' || 'quart browser',focus:action === 'shelf' && 'shelf' || null}
    }

    Browse.prototype["completeCallback"] = function (files)
    {
        var items, matches, text

        if (!_k_.empty(this.getText().trim()))
        {
            text = slash.path(this.getText().trim())
            matches = files.filter(function (f)
            {
                return f.file.startsWith(text)
            })
            if (!_k_.empty(matches))
            {
                this.setText(slash.tilde(matches[0].file))
            }
            if (matches.length > 1)
            {
                items = matches.map(function (m)
                {
                    var item

                    item = Object.create(null)
                    switch (m.type)
                    {
                        case 'file':
                            item.line = ' '
                            item.clss = 'file'
                            break
                        case 'dir':
                            item.line = '▸'
                            item.clss = 'directory'
                            break
                    }

                    item.text = slash.file(m.file)
                    item.file = m.file
                    return item
                })
                this.showItems(items)
                this.select(0)
                return
            }
        }
        return this.hideList()
    }

    Browse.prototype["complete"] = function ()
    {
        var text

        text = this.getText().trim()
        console.log('complete not implemented!',text)
    }

    Browse.prototype["onTabCompletion"] = function ()
    {
        this.complete()
        return true
    }

    Browse.prototype["commonPrefix"] = function (strA, strB)
    {
        var i, prefix

        prefix = ''
        for (var _147_18_ = i = 0, _147_22_ = Math.min(strA.length,strB.length); (_147_18_ <= _147_22_ ? i < Math.min(strA.length,strB.length) : i > Math.min(strA.length,strB.length)); (_147_18_ <= _147_22_ ? ++i : --i))
        {
            if (strA[i] !== strB[i])
            {
                break
            }
            prefix += strA[i]
        }
        return prefix
    }

    Browse.prototype["clearBrokenPartForFiles"] = function (files)
    {
        var brokenPath, file, l, longestMatch, prefix

        brokenPath = slash.path(this.getText())
        longestMatch = ''
        var list = _k_.list(files)
        for (var _157_17_ = 0; _157_17_ < list.length; _157_17_++)
        {
            file = list[_157_17_]
            file = file.file
            prefix = this.commonPrefix(file,brokenPath)
            if (prefix.length > longestMatch.length)
            {
                longestMatch = prefix
            }
        }
        l = this.getText().length
        if (!_k_.empty(longestMatch))
        {
            this.setText(slash.tilde(longestMatch))
            return this.complete()
        }
    }

    Browse.prototype["changedCallback"] = function (files)
    {
        var items, l, matches, path, s, text

        if (_k_.empty(this.getText().trim()))
        {
            this.hideList()
            return
        }
        path = slash.path(this.getText().trim())
        matches = files.filter(function (f)
        {
            return f.file.startsWith(path)
        })
        if (_k_.empty(matches))
        {
            this.clearBrokenPartForFiles(files)
            return
        }
        s = slash.tilde(path).length
        text = slash.tilde(slash.tilde(matches[0].file))
        this.setText(text)
        l = text.length
        this.commandline.selectSingleRange([0,[s,l]],{before:true})
        if (matches.length < 2)
        {
            return this.hideList()
        }
        else
        {
            items = matches.map(function (m)
            {
                var item

                item = Object.create(null)
                switch (m.type)
                {
                    case 'file':
                        item.line = ' '
                        item.clss = 'file'
                        break
                    case 'dir':
                        item.line = '▸'
                        item.clss = 'directory'
                        break
                }

                item.text = slash.file(m.file)
                item.file = m.file
                return item
            })
            return this.showItems(items)
        }
    }

    Browse.prototype["changed"] = function (command)
    {
        var text, _218_19_

        console.log('browse.changed',command)
        text = this.getText().trim()
        if (!text.endsWith('/'))
        {
            ;(this.walker != null ? this.walker.end() : undefined)
            return this.walker = null
        }
        else
        {
            return this.hideList()
        }
    }

    Browse.prototype["handleModKeyComboEvent"] = function (mod, key, combo, event)
    {
        var focusBrowser, _234_74_

        switch (combo)
        {
            case 'backspace':
                if (commandline.mainCursor()[0] === (commandline.selection(0) != null ? commandline.selection(0)[1][0] : undefined))
                {
                    commandline.do.start()
                    commandline.deleteSelection()
                    commandline.deleteBackward()
                    commandline.do.end()
                    return
                }
                break
            case 'enter':
                this.execute(this.getText())
                focusBrowser = (function ()
                {
                    return this.browser.focus({force:true})
                }).bind(this)
                setTimeout(focusBrowser,100)
                return

        }

        return 'unhandled'
    }

    Browse.prototype["listClick"] = function (index)
    {
        var file

        file = (this.commandList.items[index] != null ? this.commandList.items[index].file : undefined)
        if ((file != null))
        {
            file = slash.tilde(file)
        }
        file = (file != null ? file : this.commandList.line(index))
        this.selected = index
        return this.execute(file)
    }

    Browse.prototype["select"] = function (i)
    {
        var l, s, text, _269_42_, _275_20_, _276_20_

        this.selected = _k_.clamp(-1,(this.commandList != null ? this.commandList.numLines() : undefined) - 1,i)
        if (this.selected < 0)
        {
            this.hideList()
            return
        }
        ;(this.commandList != null ? this.commandList.selectSingleRange(this.commandList.rangeForLineAtIndex(this.selected)) : undefined)
        ;(this.commandList != null ? this.commandList.do.cursors([[0,this.selected]]) : undefined)
        text = slash.tilde(this.commandList.items[this.selected].file)
        this.setText(text)
        s = slash.file(text).length
        l = text.length
        return this.commandline.selectSingleRange([0,[l - s,l]])
    }

    Browse.prototype["selectListItem"] = function (dir)
    {
        var _286_34_

        if (!(this.commandList != null))
        {
            return
        }
        switch (dir)
        {
            case 'up':
                return this.select(this.selected - 1)

            case 'down':
                return this.select(this.selected + 1)

        }

    }

    Browse.prototype["cancel"] = function ()
    {
        this.hideList()
        return {focus:this.receiver,show:'editor'}
    }

    Browse.prototype["execute"] = function (command)
    {
        var cmd

        if (!(command != null))
        {
            return console.error("no command?")
        }
        this.hideList()
        this.cmdID += 1
        cmd = command.trim()
        if (cmd.length)
        {
            if (slash.dirExists(slash.removeLinePos(cmd)))
            {
                this.browser.loadItem({file:cmd,type:'dir'})
                this.commandline.setText(cmd)
                return
            }
            else if (slash.fileExists(slash.removeLinePos(cmd)))
            {
                this.commandline.setText(cmd)
                post.emit('jumpToFile',{file:cmd})
                return
            }
        }
        console.error('browse.execute -- unhandled',cmd)
    }

    Browse.prototype["onBrowserItemActivated"] = function (item)
    {
        var pth, _333_32_, _333_56_, _340_64_, _340_72_, _342_61_, _342_69_

        if (!this.isActive())
        {
            ;((_333_32_=this.commandline.command) != null ? typeof (_333_56_=_333_32_.onBrowserItemActivated) === "function" ? _333_56_(item) : undefined : undefined)
            return
        }
        if (item.file)
        {
            pth = slash.tilde(item.file)
            if (item.type === 'dir')
            {
                pth += '/'
                if (item.name === '..' && ((_340_64_=this.browser.activeColumn()) != null ? (_340_72_=_340_64_.parent) != null ? _340_72_.file : undefined : undefined))
                {
                    pth = slash.tilde(((_342_61_=this.browser.activeColumn()) != null ? (_342_69_=_342_61_.parent) != null ? _342_69_.file : undefined : undefined))
                }
            }
            return this.commandline.setText(pth)
        }
    }

    return Browse
})()

export default Browse;