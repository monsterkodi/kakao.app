var toExport = {}
var _k_

import kermit from "../kxk/kermit.js"

toExport["kermit"] = function ()
{
    section("array", function ()
    {
        compare(kermit(`commit  ●commit
■files
    ●type ●path`,`commit id

M   modified/file
C   changed/file

commit other

M   modified/other
C   changed/other
`),[{commit:'id',files:[{type:'M',path:'modified/file'},{type:'C',path:'changed/file'}]},{commit:'other',files:[{type:'M',path:'modified/other'},{type:'C',path:'changed/other'}]}])
    })
    return
    section("array", function ()
    {
        compare(kermit(`commit  ●commit
■files
    ●type ●path`,`commit id

M   modified/file
C   changed/file
`),[{commit:'id',files:[{type:'M',path:'modified/file'},{type:'C',path:'changed/file'}]}])
    })
    section("simple", function ()
    {
        compare(kermit(`commit  ●commit
Author: ●author
●msg`,`commit  some commit
Author: some author

    some msg

commit      another     commit

Author: another         author
another msg
`),[{commit:'some commit',author:'some author',msg:'some msg'},{commit:'another commit',author:'another author',msg:'another msg'}])
    })
    section("array", function ()
    {
        compare(kermit(`commit  ●commit
Author: ●author
Date:   ●date
●msg
■files
    ●type ●path`,`commit 5255e93531d91abee2583fded9c13559f2445489
Author: monsterkodi <monsterkodi@gmx.net>
Date:   Thu Apr 4 00:15:12 2024 +0200

    misc

M   kakao.app/kode/ko/tools/Git.kode

commit 85cfa741ce4e17f142c06d02a857b6646a26d34a
Author: monsterkodi <monsterkodi@gmx.net>
Date:   Wed Apr 3 01:10:28 2024 +0200

    git status

M   modified/file
C   changed/file
`),[{commit:'5255e93531d91abee2583fded9c13559f2445489',author:'monsterkodi <monsterkodi@gmx.net>',date:'Thu Apr 4 00:15:12 2024 +0200',msg:'misc',files:[{type:'M',path:'kakao.app/kode/ko/tools/Git.kode'}]},{commit:'85cfa741ce4e17f142c06d02a857b6646a26d34a',author:'monsterkodi <monsterkodi@gmx.net>',date:'Wed Apr 3 01:10:28 2024 +0200',msg:'git status',files:[{type:'M',path:'modified/file'},{type:'C',path:'changed/file'}]}])
    })
}
toExport["kermit"]._section_ = true
toExport._test_ = true
export default toExport