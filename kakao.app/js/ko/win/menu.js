var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isArr: function (o) {return Array.isArray(o)}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var getMenu, menu

import slash from "../../kxk/slash.js"

import syntax from "../editor/syntax.js"

import transform from "../editor/actions/transform.js"

import macro from "../commands/macro.js"


getMenu = function (template, name)
{
    var item

    var list = _k_.list(template)
    for (var _19_13_ = 0; _19_13_ < list.length; _19_13_++)
    {
        item = list[_19_13_]
        if (item.text === name)
        {
            return item
        }
    }
}

menu = function (template)
{
    var actionFile, actionFiles, actions, combo, commandMenu, editMenu, EditMenu, item, k, key, macro, MacroMenu, menuName, submenu, transform, transformList, transformMenu, TransformMenu, transformSubmenu, v, value, _44_38_, _54_33_, _55_44_, _57_43_, _58_39_

    if (_k_.isArr(template))
    {
        template = _k_.clone(template)
    }
    else
    {
        console.log('no array?',typeof(template),template)
        template = []
    }
    actionFiles = filelist(slash.join(__dirname,'../editor/actions'))
    submenu = {Misc:[]}
    EditMenu = []
    var list = _k_.list(actionFiles)
    for (var _35_19_ = 0; _35_19_ < list.length; _35_19_++)
    {
        actionFile = list[_35_19_]
        if (!(_k_.in(slash.ext(actionFile),['js','mjs','coffee','kode'])))
        {
            continue
        }
        actions = require(actionFile)
        for (key in actions)
        {
            value = actions[key]
            menuName = 'Misc'
            if (key === 'actions')
            {
                if ((value['menu'] != null))
                {
                    menuName = value['menu']
                    submenu[menuName] = ((_44_38_=submenu[menuName]) != null ? _44_38_ : [])
                }
                for (k in value)
                {
                    v = value[k]
                    if (v.name && v.combo)
                    {
                        combo = v.combo
                        if (os.platform() !== 'darwin' && v.accel)
                        {
                            combo = v.accel
                        }
                        item = {text:v.name,accel:combo}
                        if ((v.menu != null))
                        {
                            submenu[v.menu] = ((_55_44_=submenu[v.menu]) != null ? _55_44_ : [])
                        }
                        if (v.separator)
                        {
                            submenu[((_57_43_=v.menu) != null ? _57_43_ : menuName)].push({text:''})
                        }
                        submenu[((_58_39_=v.menu) != null ? _58_39_ : menuName)].push(item)
                    }
                }
            }
        }
    }
    for (key in submenu)
    {
        menu = submenu[key]
        EditMenu.push({text:key,menu:menu})
    }
    editMenu = getMenu(template,'Edit')
    editMenu.menu = editMenu.menu.concat(EditMenu)
    MacroMenu = [{text:'Macro',combo:'command+m',accel:'ctrl+m',command:'macro'}]
    var list1 = _k_.list(Macro.macroNames)
    for (var _67_14_ = 0; _67_14_ < list1.length; _67_14_++)
    {
        macro = list1[_67_14_]
        MacroMenu.push({text:macro,actarg:macro,action:'doMacro'})
    }
    commandMenu = getMenu(template,'Command')
    commandMenu.menu = commandMenu.menu.concat({text:'Macro',menu:MacroMenu})
    TransformMenu = []
    for (transformMenu in transform.Transform.transformMenus)
    {
        transformList = transform.Transform.transformMenus[transformMenu]
        transformSubmenu = []
        var list2 = _k_.list(transformList)
        for (var _79_22_ = 0; _79_22_ < list2.length; _79_22_++)
        {
            transform = list2[_79_22_]
            transformSubmenu.push({text:transform,actarg:transform,action:'doTransform'})
        }
        TransformMenu.push({text:transformMenu,menu:transformSubmenu})
    }
    editMenu.menu = editMenu.menu.concat({text:'Transform',menu:TransformMenu})
    return template
}
export default menu;