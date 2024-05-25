import kakao from "../kakao.js"

import kxk from "../kxk.js"
let win = kxk.win
let elem = kxk.elem
let $ = kxk.$

kakao.init(function ()
{
    return new win({onWindowWillShow:function ()
    {
        var frame, icon

        frame = {x:-300,y:0,w:400,h:40}
        kakao('window.setFrame',frame,true)
        icon = kakao.bundle.img('menu_kakao.png')
        document.body.appendChild(elem('img',{src:icon,width:'22px',height:'22px'}))
        return requestAnimationFrame(function ()
        {
            return kakao('status.icon',{x:0,y:-8,w:22,h:38})
        })
    }})
})