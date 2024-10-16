var Weed

import * as three from 'three'
import geom from "./lib/geom.js"


Weed = (function ()
{
    function Weed (scene)
    {
        var cylinder

        this.scene = scene
    
        this.count = 1000
        cylinder = geom.cylinder({length:4,radius:0.5,sgmt:6,material:'flatwhite'})
        this.dummy = new three.Object3D()
        this.color = new three.Color()
        this.pos = new three.Vector3()
        this.norm = new three.Vector3()
        this.rot = new three.Quaternion()
        this.scale = new three.Vector3()
        this.mesh = new three.InstancedMesh(cylinder.geometry,cylinder.material,this.count)
        this.mesh.instanceMatrix.setUsage(three.StaticDrawUsage)
        this.mesh.castShadow = true
        this.scene.scene.add(this.mesh)
    }

    Weed.prototype["spawn"] = function ()
    {
        var color, i

        i = 0
        while (i < this.count)
        {
            this.scene.sampler.sample(this.pos,this.norm)
            this.pos.multiplyScalar(50)
            if (this.pos.length() < 40)
            {
                continue
            }
            this.dummy.position.copy(this.pos)
            this.pos.normalize()
            if (this.norm.dot(this.pos) < 0.7)
            {
                continue
            }
            this.norm.multiplyScalar(-1)
            this.norm.add(this.dummy.position)
            color = this.scene.mc.getColor(parseInt(this.dummy.position.x + this.scene.resolution / 2),parseInt(this.dummy.position.y + this.scene.resolution / 2),parseInt(this.dummy.position.z + this.scene.resolution / 2))
            if (Math.random() < color[0] * 50 + color[2] * 50)
            {
                this.dummy.lookAt(this.norm)
                this.dummy.scale.set(1,1,color[0] * 150)
                this.dummy.updateMatrix()
                this.mesh.setMatrixAt(i,this.dummy.matrix)
                this.color.set(color[0] * 5,color[1] * 5,color[2] * 5)
                this.mesh.setColorAt(i,this.color)
                i++
            }
        }
        this.mesh.instanceMatrix.needsUpdate = true
        return this.mesh.instanceColor.needsUpdate = true
    }

    Weed.prototype["update"] = function (deltaSec, tickInfo)
    {
        var color, f, i

        for (var _a_ = i = 0, _b_ = this.count; (_a_ <= _b_ ? i < this.count : i > this.count); (_a_ <= _b_ ? ++i : --i))
        {
            this.mesh.getMatrixAt(i,this.dummy.matrix)
            this.dummy.matrix.decompose(this.pos,this.rot,this.scale)
            color = this.scene.mc.getColor(parseInt(this.pos.x + this.scene.resolution / 2),parseInt(this.pos.y + this.scene.resolution / 2),parseInt(this.pos.z + this.scene.resolution / 2))
            this.color.set(color[0],color[1],color[2])
            f = (Math.sin(tickInfo.time / (2000 - (color[0] + color[2]) * 900)) + 1.2) * 2
            this.color.multiplyScalar(f)
            this.mesh.setColorAt(i,this.color)
            this.scale.set(1,1,color[0] * (50 + (f - 2.4) * 10))
            this.dummy.matrix.compose(this.pos,this.rot,this.scale)
            this.mesh.setMatrixAt(i,this.dummy.matrix)
        }
        this.mesh.instanceMatrix.needsUpdate = true
        return this.mesh.instanceColor.needsUpdate = true
    }

    return Weed
})()

export default Weed;