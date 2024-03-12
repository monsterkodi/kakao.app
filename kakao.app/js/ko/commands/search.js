// monsterkodi/kakao 0.1.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, first: function (o) {return o != null ? o.length ? o[0] : undefined : o}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var FileSearcher, Search

import klor from "../../klor/klor.js"

import post from "../../kxk/post.js"

import slash from "../../kxk/slash.js"

import matchr from "../../kxk/matchr.js"

import walker from "../tools/walker.js"

import syntax from "../editor/syntax.js"

import command from "../commandline/command.js"


Search = (function ()
{
    _k_.extend(Search, command)
    function Search (commandline)
    {
        this["onMetaClick"] = this["onMetaClick"].bind(this)
        this["searchInFile"] = this["searchInFile"].bind(this)
        Search.__super__.constructor.call(this,commandline)
        this.names = ['search','Search','/search/','/Search/']
    }

    Search.prototype["historyKey"] = function ()
    {
        return this.name
    }

    Search.prototype["execute"] = function (command)
    {
        var file, rngs, _48_41_

        if (!command.length)
        {
            return
        }
        switch (this.name)
        {
            case '/search/':
            case '/Search/':
                if (_k_.in(command,['^','$','.']))
                {
                    return
                }
                rngs = matchr.ranges(command,'  ')
                if (rngs.length === 2)
                {
                    return
                }
                break
        }

        command = Search.__super__.execute.call(this,command)
        file = ((_48_41_=window.editor.currentFile) != null ? _48_41_ : _k_.first(_.keys(post.get('indexer','files'))))
        if (!(file != null))
        {
            return
        }
        window.terminal.clear()
        this.startSearchInFiles({text:command,name:this.name,file:slash.path(file)})
        return {focus:'terminal',show:'terminal',text:command,select:true}
    }

    Search.prototype["startSearchInFiles"] = function (opt)
    {
        var dir, terminal

        terminal = window.terminal
        terminal.appendMeta({clss:'searchHeader',diss:syntax.dissForTextAndSyntax(`▸ Search for '${opt.text}':`,'ko')})
        terminal.appendMeta({clss:'spacer'})
        terminal.singleCursorAtPos([0,terminal.numLines() - 2])
        dir = slash.pkg(slash.dir(opt.file))
        dir = (dir != null ? dir : slash.dir(opt.file))
        this.walker = new walker({root:dir,maxDepth:12,maxFiles:5000,includeDirs:false,file:(function (f, stat)
        {
            return this.searchInFile(opt,slash.path(f))
        }).bind(this)})
        this.walker.cfg.ignore.push('js')
        this.walker.cfg.ignore.push('lib')
        this.walker.cfg.ignore.push('data')
        return this.walker.start()
    }

    Search.prototype["searchInFile"] = function (opt, file)
    {
        console.log('searchInFile not implemented!')
    }

    Search.prototype["onMetaClick"] = function (meta, event)
    {
        var command, file, href, split

        href = meta[2].href
        if (href.startsWith('>'))
        {
            split = href.split('>')
            if ((window.commandline.commands[split[1]] != null))
            {
                command = window.commandline.commands[split[1]]
                window.commandline.startCommand(split[1])
                window.commandline.setText(split[2])
                command.execute(split[2])
            }
        }
        else
        {
            file = href + ':' + window.terminal.posForEvent(event)[0]
            post.emit('openFiles',[file],{newTab:event.metaKey})
        }
        return 'unhandled'
    }

    return Search
})()


FileSearcher = (function ()
{
    function FileSearcher (command, opt, file)
    {
        var extn

        this.command = command
        this.opt = opt
        this.file = file
    
        this["end"] = this["end"].bind(this)
        FileSearcher.__super__.constructor.call(this)
        this.line = 0
        this.flags = ''
        this.patterns = ((function ()
        {
            switch (this.opt.name)
            {
                case 'search':
                    return [[new RegExp(_.escapeRegExp(this.opt.text),'i'),'found']]

                case 'Search':
                    return [[new RegExp(_.escapeRegExp(this.opt.text)),'found']]

                case '/search/':
                    this.flags = 'i'
                    return this.opt.text

                case '/Search/':
                    return this.opt.text

                default:
                    console.error(`commands/search FileSearcher -- unhandled '${this.opt.name}' command:`,this.command.name,'opt:',this.opt,'file:',this.file)
                    return [[new RegExp(_.escapeRegExp(this.opt.text),'i'),'found']]
            }

        }).bind(this))()
        this.found = []
        extn = slash.ext(this.file)
        if (_k_.in(extn,syntax.syntaxNames))
        {
            this.syntaxName = extn
        }
        else
        {
            this.syntaxName = null
        }
    }

    FileSearcher.prototype["write"] = function (chunk, encoding, cb)
    {
        var l, lines, rngs, _154_64_

        lines = chunk.split('\n')
        if (!(this.syntaxName != null))
        {
            this.syntaxName = syntax.shebang(lines[0])
        }
        var list = _k_.list(lines)
        for (var _155_14_ = 0; _155_14_ < list.length; _155_14_++)
        {
            l = list[_155_14_]
            this.line += 1
            rngs = matchr.ranges(this.patterns,l,this.flags)
            if (rngs.length)
            {
                this.found.push([this.line,l,rngs])
            }
        }
        return true
    }

    FileSearcher.prototype["end"] = function (chunk, encoding, cb)
    {
        var dss, f, fi, meta, regions, terminal

        if (this.found.length)
        {
            terminal = window.terminal
            meta = {diss:syntax.dissForTextAndSyntax(`${slash.tilde(this.file)}`,'ko'),href:this.file,clss:'gitInfoFile',click:this.command.onMetaClick,line:'◼'}
            terminal.appendMeta(meta)
            terminal.appendMeta({clss:'spacer'})
            for (var _178_23_ = fi = 0, _178_27_ = this.found.length; (_178_23_ <= _178_27_ ? fi < this.found.length : fi > this.found.length); (_178_23_ <= _178_27_ ? ++fi : --fi))
            {
                f = this.found[fi]
                regions = klor.dissect([f[1]],this.syntaxName)[0]
                dss = matchr.merge(regions,matchr.dissect(f[2]))
                meta = {diss:dss,href:`${this.file}:${f[0]}`,clss:'searchResult',click:this.command.onMetaClick}
                if (fi && this.found[fi - 1][0] !== f[0] - 1)
                {
                    terminal.appendMeta({clss:'spacer'})
                }
                terminal.appendMeta(meta)
                post.emit('search-result',meta)
            }
            terminal.appendMeta({clss:'spacer'})
            return terminal.scroll.cursorToTop()
        }
    }

    return FileSearcher
})()

export default Search;