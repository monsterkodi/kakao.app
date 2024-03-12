// monsterkodi/kakao 0.1.0

var _k_

var $, fileInfo, imageInfo, moment, pbytes

import dom from "../../kxk/dom.js"

import elem from "../../kxk/elem.js"

import slash from "../../kxk/slash.js"

import lib_ko from "../../../lib/lib_ko.js"

moment = lib_ko.moment
pbytes = lib_ko.pbytes

$ = dom.$

import File from '../tools/file.js'

imageInfo = function (file)
{
    var cnt, img

    img = elem('img',{class:'browserImage',src:slash.fileUrl(file)})
    cnt = elem({class:'browserImageContainer',child:img})
    cnt.addEventListener('dblclick',function ()
    {
        return open(file)
    })
    img.onload = function ()
    {
        var age, br, height, html, info, num, range, size, stat, width, x

        img = $('.browserImage')
        br = img.getBoundingClientRect()
        x = img.clientX
        width = parseInt(br.right - br.left - 2)
        height = parseInt(br.bottom - br.top - 2)
        img.style.opacity = '1'
        img.style.maxWidth = '100%'
        stat = slash.fileExists(file)
        size = pbytes(stat.size).split(' ')
        age = moment().to(moment(stat.mtime),true)
        var _45_21_ = age.split(' '); num = _45_21_[0]; range = _45_21_[1]

        if (num[0] === 'a')
        {
            num = '1'
        }
        html = `<tr><th colspan=2>${width}<span class='punct'>x</span>${height}</th></tr>`
        html += `<tr><th>${size[0]}</th><td>${size[1]}</td></tr>`
        html += `<tr><th>${num}</th><td>${range}</td></tr>`
        info = elem({class:'browserFileInfo',children:[elem('div',{class:`fileInfoFile ${slash.ext(file)}`,html:File.span(file)}),elem('table',{class:"fileInfoData",html:html})]})
        cnt = $('.browserImageContainer')
        return cnt.appendChild(info)
    }
    return cnt
}

fileInfo = function (file)
{
    var age, info, num, range, size, stat, t

    stat = slash.fileExists(file)
    size = pbytes(stat.size).split(' ')
    t = moment(stat.mtime)
    age = moment().to(t,true)
    var _75_17_ = age.split(' '); num = _75_17_[0]; range = _75_17_[1]

    if (num[0] === 'a')
    {
        num = '1'
    }
    if (range === 'few')
    {
        num = moment().diff(t,'seconds')
        range = 'seconds'
    }
    info = elem({class:'browserFileInfo',children:[elem('div',{class:`fileInfoIcon ${slash.ext(file)} ${File.iconClassName(file)}`}),elem('div',{class:`fileInfoFile ${slash.ext(file)}`,html:File.span(file)}),elem('table',{class:"fileInfoData",html:`<tr><th>${size[0]}</th><td>${size[1]}</td></tr><tr><th>${num}</th><td>${range}</td></tr>`})]})
    return info
}
export default {file:fileInfo,image:imageInfo}