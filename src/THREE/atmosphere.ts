import * as THREE from 'three'
import g from '@/assets/images/gradient.png'
import { addonsBasic } from '../declare/THREE/addons'

export interface AtmosphereParticleProps {
  longestDistance: number
  /** 粒子壳层内半径（默认 0.3 * longestDistance）。相机应位于壳层中空处，视野内密度才均匀 */
  innerDistance?: number
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
  private readonly renderUpdate?: (Point: THREE.Points, speed?: number) => void
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

    // 在球壳内做体积均匀采样：相机放在球心（中空处）时，任意视线穿过的壳层厚度相同，
    // 因此整屏（含四角）粒子密度一致，且旋转时保持不变——不会出现“中间密、边缘疏”。
    const rOuter = longestDistance
    const rInner = options.innerDistance ?? longestDistance * 0.3
    const vertices = []
    for (let i = 0; i < this.particleSum; i++) {
      // 单位球面上的均匀方向
      const cosPhi = getRangeRandom(-1, 1)
      const sinPhi = Math.sqrt(1 - cosPhi * cosPhi)
      const theta = getRangeRandom(0, Math.PI * 2)
      // 体积均匀的半径（r ∝ cbrt，避免全部堆在外壳）
      const r = Math.cbrt(rInner ** 3 + (rOuter ** 3 - rInner ** 3) * Math.random())
      vertices.push(
        r * sinPhi * Math.cos(theta),
        r * sinPhi * Math.sin(theta),
        r * cosPhi,
      )
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

    // 帧率归一化：以 60fps 为基准，把“每帧步进”换算成“按真实时间步进”，
    // 这样高刷新率显示器上转速不再翻倍。封顶 4 帧，避免切后台回来时一次跳太多。
    const frameScale = Math.min(dt / (1000 / 60), 4)
    const speed = this._speed * frameScale

    // 实际旋转
    if (this.renderUpdate) {
      // 支持外部自定义旋转：把（已按时间归一化的）速度传给你
      this.renderUpdate(this.Geometry!, speed)
    } else {
      // 内置一个简单旋转（如果你没传 renderUpdate）
      const r = this.Geometry.rotation
      if (this.axis === 'x') r.x -= speed
      else if (this.axis === 'y') r.y += speed
      else r.z += speed * 0.5
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
