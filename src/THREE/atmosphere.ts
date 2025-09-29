import * as THREE from 'three'
import g from '@/assets/images/gradient.png'
import { addonsBasic } from '../declare/THREE/addons'

export interface AtmosphereParticleProps {
  longestDistance: number
  particleSum: number
  renderUpdate?: (Point: THREE.Points, speed?: number) => void
  callback?: (Point: THREE.Points) => void
  onChangeModel?: (Point: THREE.Points) => void

  // ⬇️ 新增的可选项
  axis?: 'x' | 'y' | 'z'
  baseSpeed?: number               // 默认 0.002
  accel?: {                        // 切模型时：base → upTo → downTo
    upTo?: number                  // 默认 0.04
    upMs?: number                  // 默认 1500
    downTo?: number                // 默认 0.002
    downMs?: number                // 默认 1500
  }
}

const loader = new THREE.TextureLoader()
loader.crossOrigin = ''

const n = new THREE.PointsMaterial({
  size: 7,
  map: loader.load(g),
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  transparent: true
})

function getRangeRandom(e: number, t: number) {
  return Math.random() * (t - e) + e
}

class AtmosphereParticle extends addonsBasic {
  private readonly longestDistance: number
  private readonly particleSum: number
  private readonly renderUpdate?: (Point: THREE.Points) => void
  private readonly onChangeModel?: (Point: THREE.Points) => void
  private readonly callback?: (Point: THREE.Points) => void
  public Geometry?: THREE.Points

  private readonly axis: 'x' | 'y' | 'z'
  private _baseSpeed: number
  private _speed: number
  private _upTo: number
  private _downTo: number
  private _upMs: number
  private _downMs: number
  private _phase: 'idle' | 'up' | 'down' = 'idle'
  private _t = 0
  private _last = performance.now()

  constructor(options: AtmosphereParticleProps) {
    super()
    const { longestDistance, particleSum, renderUpdate, onChangeModel } = options
    this.longestDistance = longestDistance
    this.particleSum = particleSum
    this.renderUpdate = renderUpdate
    this.onChangeModel = onChangeModel

    this.axis      = options.axis ?? 'x'
    this._baseSpeed = options.baseSpeed ?? 0.002
    this._speed     = this._baseSpeed
    this._upTo      = options.accel?.upTo   ?? 0.04
    this._downTo    = options.accel?.downTo ?? 0.002
    this._upMs      = options.accel?.upMs   ?? 1500
    this._downMs    = options.accel?.downMs ?? 1500

    const vertices = []
    for (let i = 0; i < this.particleSum; i++) {
      const x = getRangeRandom(-1 * longestDistance, longestDistance)
      const y = getRangeRandom(-1 * longestDistance, longestDistance)
      const z = getRangeRandom(-1 * longestDistance, longestDistance)
      vertices.push(x, y, z)
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    this.Geometry = new THREE.Points(geometry, n)
    options.callback?.call(this, this.Geometry)
  }

  private _easeExpInOut(x: number) {
    return 1 - Math.cos((x * Math.PI) / 2)
  }

  update = () => {
    if (!this.Geometry) return
    const now = performance.now()
    const dt  = now - this._last
    this._last = now

    // 速度包络（up → down）
    if (this._phase !== 'idle') {
      const dur = this._phase === 'up' ? this._upMs : this._downMs
      this._t = Math.min(1, this._t + dt / Math.max(1, dur))
      const e = this._easeExpInOut(this._t)

      if (this._phase === 'up') {
        // base → upTo
        this._speed = this._baseSpeed + (this._upTo - this._baseSpeed) * e
        if (this._t >= 1) { this._phase = 'down'; this._t = 0; }
      } else {
        // upTo → downTo
        this._speed = this._upTo + (this._downTo - this._upTo) * e
        if (this._t >= 1) { this._phase = 'idle'; this._baseSpeed = this._downTo; }
      }
    }

    // 实际旋转
    if (this.renderUpdate) {
      // 支持外部自定义旋转：把速度传给你
      this.renderUpdate(this.Geometry, this._speed)
    } else {
      // 内置一个简单旋转（如果你没传 renderUpdate）
      const r = this.Geometry.rotation
      if (this.axis === 'x') r.x -= this._speed
      else if (this.axis === 'y') r.y += this._speed
      else r.z += this._speed * 0.5
    }
  }

  ChangeModel = () => {
    // 先让 onChangeModel 有机会做额外事（可选）
    this.onChangeModel?.call(this, this.Geometry!)
    // 再触发内置包络
    this._phase = 'up'
    this._t = 0
  }
}

export default AtmosphereParticle
