var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var jsClass

import kxk from "../../kxk.js"
let elem = kxk.elem
let matchr = kxk.matchr
let events = kxk.events
let stopEvent = kxk.stopEvent
let pickBy = kxk.pickBy
let toPairs = kxk.toPairs
let $ = kxk.$

import req from "../tools/req.js"

jsClass = {RegExp:['test','compile','exec','toString'],String:['endsWith','startsWith','split','slice','substring','padEnd','padStart','indexOf','match','trim','trimEnd','trimStart']}
class AutoComplete extends events
{
    constructor (editor)
    {
        super()
    
        var c, specials

        this.editor = editor
    
        this.onLinesSet = this.onLinesSet.bind(this)
        this.onWillDeleteLine = this.onWillDeleteLine.bind(this)
        this.onLineChanged = this.onLineChanged.bind(this)
        this.onLineInserted = this.onLineInserted.bind(this)
        this.onLinesAppended = this.onLinesAppended.bind(this)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onWheel = this.onWheel.bind(this)
        this.close = this.close.bind(this)
        this.onEdit = this.onEdit.bind(this)
        this.wordinfo = {}
        this.mthdinfo = {}
        this.matchList = []
        this.clones = []
        this.cloned = []
        this.close()
        specials = "_-@#"
        this.especial = (function () { var r_31_34_ = []; var list = _k_.list(specials.split('')); for (var _31_34_ = 0; _31_34_ < list.length; _31_34_++)  { c = list[_31_34_];r_31_34_.push("\\" + c)  } return r_31_34_ }).bind(this)().join('')
        this.headerRegExp = new RegExp(`^[0${this.especial}]+$`)
        this.notSpecialRegExp = new RegExp(`[^${this.especial}]`)
        this.specialWordRegExp = new RegExp(`(\\s+|[\\w${this.especial}]+|[^\\s])`,'g')
        this.splitRegExp = new RegExp(`[^\\w\\d${this.especial}]+`,'g')
        this.methodRegExp = /([@]?\w+|@)\.(\w+)/
        this.moduleRegExp = /^\s*(\w+)\s*=\s*require\s+([\'\"][\.\/\w]+[\'\"])/
        this.newRegExp = /([@]?\w+)\s*=\s*new\s+(\w+)/
        this.baseRegExp = /\w\s+extends\s+(\w+)/
        this.editor.on('edit',this.onEdit)
        this.editor.on('linesSet',this.onLinesSet)
        this.editor.on('lineInserted',this.onLineInserted)
        this.editor.on('willDeleteLine',this.onWillDeleteLine)
        this.editor.on('lineChanged',this.onLineChanged)
        this.editor.on('linesAppended',this.onLinesAppended)
        this.editor.on('cursor',this.close)
        this.editor.on('blur',this.close)
    }

    parseModule (line)
    {
        var clss, key, match, _72_30_, _74_40_, _76_49_, _79_40_, _81_49_, _87_41_

        if (this.newRegExp.test(line))
        {
            match = line.match(this.newRegExp)
            try
            {
                clss = eval(match[2])
            }
            catch (err)
            {
                true
            }
            if (((clss != null ? clss.prototype : undefined) != null))
            {
                if (jsClass[match[2]])
                {
                    this.mthdinfo[match[1]] = ((_74_40_=this.mthdinfo[match[1]]) != null ? _74_40_ : {})
                    var list = _k_.list(jsClass[match[2]])
                    for (var _75_28_ = 0; _75_28_ < list.length; _75_28_++)
                    {
                        key = list[_75_28_]
                        this.mthdinfo[match[1]][key] = ((_76_49_=this.mthdinfo[match[1]][key]) != null ? _76_49_ : 1)
                    }
                }
            }
            else
            {
                if (this.mthdinfo[match[2]])
                {
                    this.mthdinfo[match[1]] = ((_79_40_=this.mthdinfo[match[1]]) != null ? _79_40_ : {})
                    var list1 = _k_.list(Object.keys(this.mthdinfo[match[2]]))
                    for (var _80_28_ = 0; _80_28_ < list1.length; _80_28_++)
                    {
                        key = list1[_80_28_]
                        this.mthdinfo[match[1]][key] = ((_81_49_=this.mthdinfo[match[1]][key]) != null ? _81_49_ : 1)
                    }
                }
            }
        }
        if (this.baseRegExp.test(line))
        {
            match = line.match(this.baseRegExp)
            if (this.mthdinfo[match[1]])
            {
                var list2 = _k_.list(Object.keys(this.mthdinfo[match[1]]))
                for (var _86_24_ = 0; _86_24_ < list2.length; _86_24_++)
                {
                    key = list2[_86_24_]
                    this.wordinfo[`@${key}`] = ((_87_41_=this.wordinfo[`@${key}`]) != null ? _87_41_ : {count:1})
                }
            }
        }
    }

    parseMethod (line)
    {
        var i, rgs, _100_44_, _101_60_

        if (!_k_.empty((rgs = matchr.ranges([this.methodRegExp,['obj','mth']],line))))
        {
            for (var _98_21_ = i = 0, _98_25_ = rgs.length - 1; (_98_21_ <= _98_25_ ? i < rgs.length - 1 : i > rgs.length - 1); (_98_21_ <= _98_25_ ? ++i : --i))
            {
                if (rgs[i].match && rgs[i + 1].match)
                {
                    this.mthdinfo[rgs[i].match] = ((_100_44_=this.mthdinfo[rgs[i].match]) != null ? _100_44_ : {})
                    this.mthdinfo[rgs[i].match][rgs[i + 1].match] = ((_101_60_=this.mthdinfo[rgs[i].match][rgs[i + 1].match]) != null ? _101_60_ : 0)
                    this.mthdinfo[rgs[i].match][rgs[i + 1].match] += 1
                }
                i++
            }
        }
    }

    completeMethod (info)
    {
        var lst, mcnt, mthds, obj

        lst = _k_.last(info.before.split(' '))
        obj = lst.slice(0,-1)
        if (!this.mthdinfo[obj])
        {
            return
        }
        mthds = Object.keys(this.mthdinfo[obj])
        mcnt = mthds.map((function (m)
        {
            return [m,this.mthdinfo[obj][m]]
        }).bind(this))
        mcnt.sort(function (a, b)
        {
            return a[1] !== b[1] && b[1] - a[1] || a[0].localeCompare(b[0])
        })
        this.firstMatch = mthds[0]
        return this.matchList = mthds.slice(1)
    }

    onEdit (info)
    {
        var d, m, matches, w, words, _135_28_, _157_41_

        this.close()
        this.word = _k_.last(info.before.split(this.splitRegExp))
        switch (info.action)
        {
            case 'delete':
                console.error('delete!!!!')
                if ((this.wordinfo[this.word] != null ? this.wordinfo[this.word].temp : undefined) && (this.wordinfo[this.word] != null ? this.wordinfo[this.word].count : undefined) <= 0)
                {
                    return delete this.wordinfo[this.word]
                }
                break
            case 'insert':
                if (!(this.word != null ? this.word.length : undefined))
                {
                    if (info.before.slice(-1)[0] === '.')
                    {
                        this.completeMethod(info)
                    }
                }
                else
                {
                    if (_k_.empty(this.wordinfo))
                    {
                        return
                    }
                    matches = pickBy(this.wordinfo,(function (w)
                    {
                        return w.startsWith(this.word) && w.length > this.word.length
                    }).bind(this))
                    matches = toPairs(matches)
                    var list = _k_.list(matches)
                    for (var _143_26_ = 0; _143_26_ < list.length; _143_26_++)
                    {
                        m = list[_143_26_]
                        d = this.editor.distanceOfWord(m[0])
                        m[1].distance = 100 - Math.min(d,100)
                    }
                    matches.sort(function (a, b)
                    {
                        return (b[1].distance + b[1].count + 1 / b[0].length) - (a[1].distance + a[1].count + 1 / a[0].length)
                    })
                    words = matches.map(function (m)
                    {
                        return m[0]
                    })
                    var list1 = _k_.list(words)
                    for (var _151_26_ = 0; _151_26_ < list1.length; _151_26_++)
                    {
                        w = list1[_151_26_]
                        if (!this.firstMatch)
                        {
                            this.firstMatch = w
                        }
                        else
                        {
                            this.matchList.push(w)
                        }
                    }
                }
                if (!(this.firstMatch != null))
                {
                    return
                }
                this.completion = this.firstMatch.slice(this.word.length)
                return this.open(info)

        }

    }

    open (info)
    {
        var c, ci, cr, cursor, index, inner, item, m, p, sibling, sp, spanInfo, wi, ws

        cursor = $('.main',this.editor.view)
        if (!(cursor != null))
        {
            console.error("AutoComplete.open --- no cursor?")
            return
        }
        this.span = elem('span',{class:'autocomplete-span'})
        this.span.textContent = this.completion
        this.span.style.opacity = 1
        this.span.style.background = "#44a"
        this.span.style.color = "#fff"
        cr = cursor.getBoundingClientRect()
        spanInfo = this.editor.lineSpanAtXY(cr.left,cr.top)
        if (!(spanInfo != null))
        {
            p = this.editor.posAtXY(cr.left,cr.top)
            ci = p[1] - this.editor.scroll.top
            return console.error(`no span for autocomplete? cursor topleft: ${parseInt(cr.left)} ${parseInt(cr.top)}`,info)
        }
        sp = spanInfo.span
        inner = sp.innerHTML
        this.clones.push(sp.cloneNode(true))
        this.clones.push(sp.cloneNode(true))
        this.cloned.push(sp)
        ws = this.word.slice(this.word.search(/\w/))
        wi = ws.length
        this.clones[0].innerHTML = inner.slice(0,spanInfo.offsetChar + 1)
        this.clones[1].innerHTML = inner.slice(spanInfo.offsetChar + 1)
        sibling = sp
        while (sibling = sibling.nextSibling)
        {
            this.clones.push(sibling.cloneNode(true))
            this.cloned.push(sibling)
        }
        sp.parentElement.appendChild(this.span)
        var list = _k_.list(this.cloned)
        for (var _209_14_ = 0; _209_14_ < list.length; _209_14_++)
        {
            c = list[_209_14_]
            c.style.display = 'none'
        }
        var list1 = _k_.list(this.clones)
        for (var _212_14_ = 0; _212_14_ < list1.length; _212_14_++)
        {
            c = list1[_212_14_]
            this.span.insertAdjacentElement('afterend',c)
        }
        this.moveClonesBy(this.completion.length)
        if (this.matchList.length)
        {
            this.list = elem({class:'autocomplete-list'})
            this.list.addEventListener('wheel',this.onWheel,{passive:true})
            this.list.addEventListener('mousedown',this.onMouseDown,{passive:true})
            index = 0
            var list2 = _k_.list(this.matchList)
            for (var _224_18_ = 0; _224_18_ < list2.length; _224_18_++)
            {
                m = list2[_224_18_]
                item = elem({class:'autocomplete-item',index:index++})
                item.textContent = m
                this.list.appendChild(item)
            }
            return cursor.appendChild(this.list)
        }
    }

    close ()
    {
        var c, _238_16_, _244_13_

        if ((this.list != null))
        {
            this.list.removeEventListener('wheel',this.onWheel)
            this.list.removeEventListener('click',this.onClick)
            this.list.remove()
            delete this.list
        }
        ;(this.span != null ? this.span.remove() : undefined)
        delete this.span
        this.selected = -1
        this.list = null
        this.span = null
        this.completion = null
        this.firstMatch = null
        var list = _k_.list(this.clones)
        for (var _253_14_ = 0; _253_14_ < list.length; _253_14_++)
        {
            c = list[_253_14_]
            c.remove()
        }
        var list1 = _k_.list(this.cloned)
        for (var _256_14_ = 0; _256_14_ < list1.length; _256_14_++)
        {
            c = list1[_256_14_]
            c.style.display = 'initial'
        }
        this.clones = []
        this.cloned = []
        this.matchList = []
        return this
    }

    onWheel (event)
    {
        this.list.scrollTop += event.deltaY
        return stopEvent(event)
    }

    onMouseDown (event)
    {
        var index

        index = elem.upAttr(event.target,'index')
        if (index)
        {
            this.select(index)
            this.onEnter()
        }
        return stopEvent(event)
    }

    onEnter ()
    {
        this.editor.pasteText(this.selectedCompletion())
        return this.close()
    }

    selectedCompletion ()
    {
        if (this.selected >= 0)
        {
            return this.matchList[this.selected].slice(this.word.length)
        }
        else
        {
            return this.completion
        }
    }

    navigate (delta)
    {
        if (!this.list)
        {
            return
        }
        return this.select(_k_.clamp(-1,this.matchList.length - 1,this.selected + delta))
    }

    select (index)
    {
        ;(this.list.children[this.selected] != null ? this.list.children[this.selected].classList.remove('selected') : undefined)
        this.selected = index
        if (this.selected >= 0)
        {
            ;(this.list.children[this.selected] != null ? this.list.children[this.selected].classList.add('selected') : undefined)
            ;(this.list.children[this.selected] != null ? this.list.children[this.selected].scrollIntoViewIfNeeded() : undefined)
        }
        this.span.innerHTML = this.selectedCompletion()
        this.moveClonesBy(this.span.innerHTML.length)
        if (this.selected < 0)
        {
            this.span.classList.remove('selected')
        }
        if (this.selected >= 0)
        {
            return this.span.classList.add('selected')
        }
    }

    prev ()
    {
        return this.navigate(-1)
    }

    next ()
    {
        return this.navigate(1)
    }

    last ()
    {
        return this.navigate(this.matchList.length - this.selected)
    }

    moveClonesBy (numChars)
    {
        var beforeLength, c, charOffset, ci, offset, spanOffset

        if (_k_.empty(this.clones))
        {
            return
        }
        beforeLength = this.clones[0].innerHTML.length
        for (var _325_19_ = ci = 1, _325_23_ = this.clones.length; (_325_19_ <= _325_23_ ? ci < this.clones.length : ci > this.clones.length); (_325_19_ <= _325_23_ ? ++ci : --ci))
        {
            c = this.clones[ci]
            offset = parseFloat(this.cloned[ci - 1].style.transform.split('translateX(')[1])
            charOffset = numChars
            if (ci === 1)
            {
                charOffset += beforeLength
            }
            c.style.transform = `translatex(${offset + this.editor.size.charWidth * charOffset}px)`
        }
        spanOffset = parseFloat(this.cloned[0].style.transform.split('translateX(')[1])
        spanOffset += this.editor.size.charWidth * beforeLength
        return this.span.style.transform = `translatex(${spanOffset}px)`
    }

    parseLinesDelayed (lines, opt)
    {
        var delay

        delay = (function (l, o)
        {
            return (function ()
            {
                return this.parseLines(l,o)
            }).bind(this)
        }).bind(this)
        if (lines.length > 1)
        {
            return setTimeout((delay(lines,opt)),200)
        }
    }

    parseLines (lines, opt)
    {
        var count, cursorWord, i, info, l, w, words, _355_27_, _380_37_, _381_35_, _382_36_

        this.close()
        if (!(lines != null))
        {
            return
        }
        cursorWord = this.cursorWord()
        var list = _k_.list(lines)
        for (var _354_14_ = 0; _354_14_ < list.length; _354_14_++)
        {
            l = list[_354_14_]
            if (!((l != null ? l.split : undefined) != null))
            {
                return console.error(`AutoComplete.parseLines -- line has no split? action: ${opt.action} line: ${l}`,lines)
            }
            if (l.length > 240)
            {
                continue
            }
            this.parseMethod(l)
            this.parseModule(l)
            words = l.split(this.splitRegExp)
            words = words.filter((function (w)
            {
                if (w === cursorWord)
                {
                    return false
                }
                if (this.word === w.slice(0,w.length - 1))
                {
                    return false
                }
                if (this.headerRegExp.test(w))
                {
                    return false
                }
                return true
            }).bind(this))
            var list1 = _k_.list(words)
            for (var _373_18_ = 0; _373_18_ < list1.length; _373_18_++)
            {
                w = list1[_373_18_]
                i = w.search(this.notSpecialRegExp)
                if (i > 0 && w[0] !== "#")
                {
                    w = w.slice(i)
                    if (!/^[\-]?[\d]+$/.test(w))
                    {
                        words.push(w)
                    }
                }
            }
            var list2 = _k_.list(words)
            for (var _379_18_ = 0; _379_18_ < list2.length; _379_18_++)
            {
                w = list2[_379_18_]
                info = ((_380_37_=this.wordinfo[w]) != null ? _380_37_ : {})
                count = ((_381_35_=info.count) != null ? _381_35_ : 0)
                count += ((_382_36_=(opt != null ? opt.count : undefined)) != null ? _382_36_ : 1)
                info.count = count
                if (opt.action === 'change')
                {
                    info.temp = true
                }
                this.wordinfo[w] = info
            }
        }
    }

    cursorWords ()
    {
        var after, befor, cp, cursr, words

        cp = this.editor.cursorPos()
        words = this.editor.wordRangesInLineAtIndex(cp[1],{regExp:this.specialWordRegExp})
        var _397_30_ = rangesSplitAtPosInRanges(cp,words); befor = _397_30_[0]; cursr = _397_30_[1]; after = _397_30_[2]

        return [this.editor.textsInRanges(befor),this.editor.textInRange(cursr),this.editor.textsInRanges(after)]
    }

    cursorWord ()
    {
        return this.cursorWords()[1]
    }

    onLinesAppended (lines)
    {
        return this.parseLines(lines,{action:'append'})
    }

    onLineInserted (li)
    {
        return this.parseLines([this.editor.line(li)],{action:'insert'})
    }

    onLineChanged (li)
    {
        return this.parseLines([this.editor.line(li)],{action:'change',count:0})
    }

    onWillDeleteLine (line)
    {
        return this.parseLines([line],{action:'delete',count:-1})
    }

    onLinesSet (lines)
    {
        if (lines.length)
        {
            return this.parseLinesDelayed(lines,{action:'set'})
        }
    }

    handleModKeyComboEvent (mod, key, combo, event)
    {
        var _422_39_, _427_16_

        if (!(this.span != null))
        {
            return 'unhandled'
        }
        switch (combo)
        {
            case 'enter':
                return this.onEnter()

        }

        if ((this.list != null))
        {
            switch (combo)
            {
                case 'down':
                    this.next()
                    return

                case 'up':
                    this.selected >= 0 ? this.prev() : this.last()
                    return

            }

        }
        this.close()
        return 'unhandled'
    }
}

export default AutoComplete;