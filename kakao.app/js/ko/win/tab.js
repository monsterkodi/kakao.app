var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import elem from "../../kxk/elem.js"

import post from "../../kxk/post.js"

import slash from "../../kxk/slash.js"

import tooltip from "../../kxk/tooltip.js"

import File from "../tools/File.js"

import Render from "../editor/Render.js"

import Syntax from "../editor/Syntax.js"

class Tab
{
    constructor (tabs, file)
    {
        this.tabs = tabs
        this.file = file
    
        this.togglePinned = this.togglePinned.bind(this)
        this.dirty = false
        this.pinned = false
        this.div = elem({class:'tab app-drag-region',text:''})
        this.tabs.div.appendChild(this.div)
        this.update()
    }

    foreignChanges (lineChanges)
    {
        var _37_17_

        this.foreign = ((_37_17_=this.foreign) != null ? _37_17_ : [])
        this.foreign.push(lineChanges)
        return this.update()
    }

    reload ()
    {
        delete this.state
        this.dirty = false
        return this.update()
    }

    saveChanges ()
    {
        var change, changes, _57_23_

        if (this.state)
        {
            if ((this.foreign != null ? this.foreign.length : undefined))
            {
                var list = _k_.list(this.foreign)
                for (var _58_28_ = 0; _58_28_ < list.length; _58_28_++)
                {
                    changes = list[_58_28_]
                    var list1 = _k_.list(changes)
                    for (var _59_31_ = 0; _59_31_ < list1.length; _59_31_++)
                    {
                        change = list1[_59_31_]
                        switch (change.change)
                        {
                            case 'changed':
                                this.state.state = this.state.state.changeLine(change.doIndex,change.after)
                                break
                            case 'inserted':
                                this.state.state = this.state.state.insertLine(change.doIndex,change.after)
                                break
                            case 'deleted':
                                this.state.state = this.state.state.deleteLine(change.doIndex)
                                break
                        }

                    }
                }
            }
            if (this.state.state)
            {
                return File.save(this.state.file,this.state.state.text(),(function (file)
                {
                    if (!file)
                    {
                        return console.error(`tab.saveChanges failed ${err}`)
                    }
                    return this.revert()
                }).bind(this))
            }
            else
            {
                console.error('tab.saveChanges -- nothing to save?')
            }
        }
        else
        {
            return post.emit('saveChanges')
        }
    }

    setFile (newFile)
    {
        if (!slash.samePath(this.file,newFile))
        {
            this.file = slash.path(newFile)
            return this.update()
        }
    }

    storeState ()
    {
        if (window.editor.currentFile)
        {
            return this.state = window.editor.do.tabState()
        }
    }

    update ()
    {
        var diss, file, html, name, sep, _143_16_

        this.div.innerHTML = ''
        this.div.classList.toggle('dirty',this.dirty)
        sep = '●'
        if (window.editor.newlineCharacters === '\r\n')
        {
            sep = '■'
        }
        this.div.appendChild(elem('span',{class:'dot',text:sep}))
        sep = "<span class='dot'>►</span>"
        this.pkgDiv = elem('span',{class:'pkg',html:this.pkg && (this.pkg + sep) || ''})
        this.div.appendChild(this.pkgDiv)
        file = this.file
        diss = Syntax.dissForTextAndSyntax(slash.file(file),'ko')
        if (!prefs.get('tabs|extension'))
        {
            if (!_k_.empty(slash.ext(file)))
            {
                diss.pop()
                diss.pop()
            }
        }
        name = elem('span',{class:'name',html:Render.line(diss,{charWidth:0})})
        this.div.appendChild(name)
        html = ''
        if (this.pinned)
        {
            html = `<svg width="100%" height="100%" viewBox="0 0 30 30" fill="transparent">
    <circle cx="15" cy="12" r="4" />
    <line x1="15" y1="16"  x2="15"  y2="22" stroke-linecap="round"></line>
</svg>`
        }
        else if (this.tmpTab)
        {
            html = `<svg width="100%" height="100%" viewBox="0 0 30 30">
    <circle cx="15" cy="9"  r="2" />
    <circle cx="15" cy="15" r="2" />
    <circle cx="15" cy="21" r="2" />
</svg>`
        }
        this.div.appendChild(elem({class:'tabstate',html:html,click:this.togglePinned}))
        if ((this.file != null))
        {
            diss = Syntax.dissForTextAndSyntax(slash.tilde(this.file),'ko')
            html = Render.line(diss,{charWidth:0})
            this.tooltip = new tooltip({elem:name,html:html,x:0})
        }
        if (this.dirty)
        {
            this.div.appendChild(elem('span',{class:'dot',text:'●'}))
        }
        return this
    }

    index ()
    {
        return this.tabs.tabs.indexOf(this)
    }

    prev ()
    {
        if (this.index() > 0)
        {
            return this.tabs.tab(this.index() - 1)
        }
    }

    next ()
    {
        if (this.index() < this.tabs.numTabs() - 1)
        {
            return this.tabs.tab(this.index() + 1)
        }
    }

    nextOrPrev ()
    {
        var _154_27_

        return ((_154_27_=this.next()) != null ? _154_27_ : this.prev())
    }

    close ()
    {
        var _164_16_

        post.emit('unwatch',this.file)
        if (this.dirty)
        {
            this.saveChanges()
        }
        this.div.remove()
        ;(this.tooltip != null ? this.tooltip.del() : undefined)
        post.emit('tabClosed',this.file)
        return this
    }

    hidePkg ()
    {
        if (this.pkgDiv)
        {
            return this.pkgDiv.style.display = 'none'
        }
    }

    showPkg ()
    {
        if (this.pkgDiv)
        {
            return this.pkgDiv.style.display = 'initial'
        }
    }

    setDirty (dirty)
    {
        if (this.dirty !== dirty)
        {
            this.dirty = dirty
            if (this.dirty)
            {
                delete this.tmpTab
            }
            this.update()
        }
        return this
    }

    togglePinned ()
    {
        this.pinned = !this.pinned
        delete this.tmpTab
        this.update()
        return this
    }

    revert ()
    {
        delete this.foreign
        delete this.state
        this.dirty = false
        this.update()
        this.tabs.update()
        return this
    }

    activate ()
    {
        post.emit('jumpToFile',this.file)
        return this
    }

    finishActivation ()
    {
        var changes, _226_19_

        this.setActive()
        if (!_k_.empty(this.state))
        {
            window.editor.do.setTabState(this.state)
            delete this.state
        }
        if ((this.foreign != null ? this.foreign.length : undefined))
        {
            var list = _k_.list(this.foreign)
            for (var _227_24_ = 0; _227_24_ < list.length; _227_24_++)
            {
                changes = list[_227_24_]
                window.editor.do.foreignChanges(changes)
            }
            delete this.foreign
        }
        this.tabs.update()
        return this
    }

    isActive ()
    {
        return this.div.classList.contains('active')
    }

    setActive ()
    {
        if (!this.isActive())
        {
            this.div.classList.add('active')
        }
        return this
    }

    clearActive ()
    {
        this.div.classList.remove('active')
        return this
    }
}

export default Tab;