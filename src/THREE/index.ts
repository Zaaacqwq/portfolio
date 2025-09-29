import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FocusShader } from 'three/examples/jsm/shaders/FocusShader'

import Tween from '@tweenjs/tween.js'
import type { Group as TweenGroup } from '@tweenjs/tween.js'

import Stats from 'three/examples/jsm/libs/stats.module.js'
import { throttle } from 'lodash'

import g from '@/assets/images/gradient.png'
import { ParticleModelProps, TWEEN_POINT } from '@/declare/THREE'
import VerticesDuplicateRemove from '@/utils/VerticesDuplicateRemove.js'
import BuiltinShaderAttributeName from '@/constant/THREE/BuiltinShaderAttributeName'
import { addonsBasic } from '@/declare/THREE/addons'

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

function getRangeRandom(e: number, t: number) {
  return Math.random() * (t - e) + e
}

type THREE_POINT = THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>
interface addonsItem extends addonsBasic { }
interface ParticleSystemProps {
  CanvasWrapper: HTMLDivElement
  Models: ParticleModelProps[]
  /** addons，他应该是一个继承了 `addonsBasic` 类的对象，一般用来做氛围粒子 */
  addons?: addonsItem[]
  /** 粒子动画时间，默认 1500 */
  AnimateDuration?: number
  /** 所有模型加载完成的回调 */
  onModelsFinishedLoad?: (preformPoint: THREE_POINT, scene: THREE.Scene) => void
  /** 独立加载器，会被送入默认的加载器进行进度处理 */
  LoadingManager?: THREE.LoadingManager
}

class ParticleSystem {
  private readonly CanvasWrapper: HTMLDivElement
  private readonly modelList: Map<string, THREE.BufferGeometry>
  private _LOAD_COUNT_: number
  private readonly ModelPointer: number
  private maxParticlesCount: number
  private WIDTH: number
  private HEIGHT: number
  private readonly orbitControls?: OrbitControls
  private stats?: Stats
  /** 主要表演场景对象 */
  public scene?: THREE.Scene
  /** 主要相机对象 */
  public camera?: THREE.PerspectiveCamera
  /** 渲染器 */
  public renderer?: THREE.WebGLRenderer
  /** 效果器 */
  public composer?: EffectComposer
  /** 加载进度管理器 */
  public manager?: THREE.LoadingManager
  /** 粒子默认材质 */
  public PointMaterial?: THREE.PointsMaterial
  /** 表演粒子，即用于呈现模型的粒子载体对象 */
  public AnimateEffectParticle?: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>

  private readonly AnimateDuration: number
  private mouseV: number
  private mouseK: number
  private hadListenMouseMove?: boolean
  private MainParticleGroup?: TweenGroup
  private readonly defaultLoader: OBJLoader
  /** 表演粒子 tween 实例数组 */
  public readonly ParticleAnimeMap: TWEEN_POINT[]
  /** 模型数组 */
  public Models: Map<string, ParticleModelProps>
  /** 额外插件的数组 */
  public addons?: any[]
  // 函数相关
  /** 当所有模型加载完成时进行调用 */
  private readonly onModelsFinishedLoad?: (preformPoint: THREE_POINT, scene: THREE.Scene) => void

  /** 对象内置的更新函数，内部使用 `requestAnimationFrame`，每渲染新的一帧时进行调用 */
  public onRendering?: (t: number) => void
  public CurrentUseModelName?: string
  public LastUseModelName?: string

  /** 欢迎词相关 */
  private WelcomePoints?: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>
  private WelcomeBaseWidth = 1
  private _welcomeTransitioning = false
  private _welcomeLastT = 0
  private _welcomeStartMs = 0

  // ghost 相关
  private ghostScene?: THREE.Scene
  private ghostPass?: RenderPass


  // 序列播放状态
  private _welcomeTargets: Float32Array[] = []      // 目标点阵列表
  private _welcomeCount = 12000                      // 统一点数
  private _welcomeIdx = 0                            // 当前目标索引
  private _welcomeTimer?: any                        // 停留定时器
  private _welcomeTransMs = 900                      // 变形时间
  private _welcomeDwellMs = 2000                     // 停留时间
  private _welcomeLerp = { t: 0 }                    // 0→1 tween 标量
  private _welcomeFrom?: Float32Array                // 起始帧（拷贝）
  private _welcomeTo?: Float32Array                  // 目标帧
  private _welcomePlaying = false                    // 播放标记
  private _welcomePerDelays?: Float32Array
  private _welcomeMaxDist?: number

  // 新编写的物体添加核心
  constructor(options: ParticleSystemProps) {
    const { AnimateDuration, onModelsFinishedLoad, LoadingManager } = options
    this.CanvasWrapper = options.CanvasWrapper
    this.addons = options.addons != null ? options.addons : []
    this.Models = new Map<string, ParticleModelProps>()
    for (const i of options.Models) {
      this.Models.set(i.name, i)
    }
    this.AnimateDuration = typeof AnimateDuration === 'number' ? AnimateDuration : 1500
    this.onModelsFinishedLoad = onModelsFinishedLoad
    this.manager = LoadingManager
    this.defaultLoader = new OBJLoader(this.manager)
    /** 粒子Map */
    this.ParticleAnimeMap = []
    /* 宽高 */
    this.HEIGHT = window.innerHeight
    this.WIDTH = window.innerWidth
    /** 模型列表  */
    this.modelList = new Map()
    /** 已加载的模型数量统计 */
    this._LOAD_COUNT_ = 0
    /** 模型指针 */
    this.ModelPointer = 0
    /** 载入模型中粒子的最大数量 */
    this.maxParticlesCount = 0
    // 创建场景
    this.createScene()
    // 性能监控插件
    // this.initStats()
    // 载入模型
    this._addModels()
    // 效果器
    this.createEffect()
    // 轨道控制插件（鼠标拖拽视角、缩放等）
    this.orbitControls = new OrbitControls(this.camera!, this.renderer!.domElement)
    this.mouseK = 0
    this.mouseV = 0
    this.orbitControls.enabled = false
    this.orbitControls.enableRotate = false
    this.orbitControls.enableZoom   = false
    this.orbitControls.enablePan    = false
    // 循环更新渲染场景
    this.update(0)
  }

  private createScene() {
    // 创建场景
    this.scene = new THREE.Scene()
    // 在场景中添加雾的效果，参数分别代表‘雾的颜色’、‘开始雾化的视线距离’、刚好雾化至看不见的视线距离’
    this.scene.fog = new THREE.FogExp2(328972, 5e-4)
    // 创建相机
    const fieldOfView = 100
    const aspectRatio = this.WIDTH / this.HEIGHT
    const nearPlane = 1
    const farPlane = 5e4

    this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane)

    // 设置相机的位置
    this.camera.position.set(0, 0, 1e3)
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))

    // 坐标轴辅助器
    // const axesHelper = new THREE.AxesHelper(500)
    // this.scene.add(axesHelper)
    // addons 添加
    if (this.addons != null) {
      this.addons.forEach((val) => {
        this.scene?.add(val.Geometry)
      })
    }
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({
      // 在 css 中设置背景色透明显示渐变色
      alpha: true
      // 开启抗锯齿
      // antialias: true,
    })
    // 自动清理，解决 bloomPass 效果器冲突
    this.renderer.autoClear = false
    // 渲染背景颜色同雾化的颜色
    this.renderer.setClearColor(this.scene.fog.color)
    // 定义渲染器的尺寸；在这里它会填满整个屏幕
    this.renderer.setSize(this.WIDTH, this.HEIGHT)

    // 打开渲染器的阴影地图
    this.renderer.shadowMap.enabled = true
    // this.renderer.shadowMapSoft = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // 在 HTML 创建的容器中添加渲染器的 DOM 元素
    this.CanvasWrapper.appendChild(this.renderer.domElement)
    // 单独的 ghost 场景（专门渲染“复制的一层”，避免被 Bloom 处理）
    this.ghostScene = new THREE.Scene()
    // 可选：为了匹配整体雾感，复用同样的雾（也可以不加雾）
    this.ghostScene.fog = this.scene!.fog
    // 监听屏幕，缩放屏幕更新相机和渲染器的尺寸
    window.addEventListener('resize', this.handleWindowResize, false)
  }

  // 窗口大小变动时调用
  private readonly handleWindowResize = () => {
    // 更新渲染器的高度和宽度以及相机的纵横比
    this.HEIGHT = window.innerHeight
    this.WIDTH = window.innerWidth
    this.renderer?.setSize(this.WIDTH, this.HEIGHT)
    this.composer?.reset()
    if (this.camera != null) {
      this.camera.aspect = this.WIDTH / this.HEIGHT
      this.camera.updateProjectionMatrix()
    }
    if (this.WelcomePoints) {
      this.fitObjectToViewWidth(this.WelcomePoints, this.WelcomeBaseWidth, 0.3)
    }
  }

  // 性能监控
  private initStats() {
    this.stats = Stats()
    if (this.stats != null) {
      // 将性能监控屏区显示在左上角
      this.stats.domElement.style.position = 'absolute'
      this.stats.domElement.style.bottom = '0px'
      this.stats.domElement.style.top = '0px'
      this.stats.domElement.style.zIndex = '100'
      this.CanvasWrapper.appendChild(this.stats.domElement)
    }
  }

  // 效果器
  private createEffect() {
    this.composer = new EffectComposer(this.renderer!)
    const renderPass = new RenderPass(this.scene!, this.camera!)
    const bloomPass = new BloomPass(0.75)
    const filmPass = new FilmPass(0.5, 0.5, 1500, 0)
    const shaderPass = new ShaderPass(FocusShader)
    shaderPass.uniforms.screenWidth.value = window.innerWidth
    shaderPass.uniforms.screenHeight.value = window.innerHeight
    shaderPass.uniforms.sampleDistance.value = 0.4
    shaderPass.renderToScreen = true

    this.composer.addPass(renderPass)
    this.composer.addPass(bloomPass)

    // ★ 在 Bloom 之后插入 ghost 场景渲染，这样 ghost 不会被 Bloom 影响
    this.ghostPass = new RenderPass(this.ghostScene!, this.camera!)
    this.ghostPass.clear = false       // 叠加绘制，不清屏
    this.composer.addPass(this.ghostPass)

    this.composer.addPass(filmPass)
    this.composer.addPass(shaderPass)
  }

  // 添加模型
  private _addModels() {
    const TextureLoader = new THREE.TextureLoader()
    TextureLoader.crossOrigin = ''
    this.PointMaterial = new THREE.PointsMaterial({
      // 粒子大小
      size: 5,
      // false:粒子尺寸相同 ;true：取决于摄像头远近
      sizeAttenuation: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: TextureLoader.load(g)
    })
    // 读取预置列表
    this.Models.forEach((i) => {
      let finalGeometry: THREE.BufferGeometry
      let finalVertices = new Float32Array([])

      const finishLoad = () => {
        // 材质选择
        this.modelList.set(i.name, finalGeometry)
        // 回调
        i.onLoadComplete?.call(this, finalGeometry)
        this._LOAD_COUNT_++
        // 所有模型加载完后触发播放事件
        if (this._LOAD_COUNT_ === this.Models.size) this._finishLoadModal()
      }

      if (typeof i.path === 'string') {
        if (i.loader != null) {
          const { loaderInstance, load } = i.loader
          loaderInstance.load(i.path, (args) => {
            finalGeometry = load(args)
            finishLoad()
          })
        } else {
          this.defaultLoader.load(i.path, (group) => {
            for (const j of group.children) {
              // @ts-expect-error 不知道是什么原因导致 ts 判断出错
              const arr = j.geometry.attributes.position.array
              finalVertices = new Float32Array([...finalVertices, ...arr])
            }
            if (!(i.NeedRemoveDuplicateParticle === false)) finalVertices = VerticesDuplicateRemove(finalVertices)

            finalGeometry = new THREE.BufferGeometry()
            // 粒子去重
            finalGeometry.setAttribute('position', new THREE.BufferAttribute(finalVertices, 3))
            i.geometry = finalGeometry
            finishLoad()
          })
        }
      } else if (i.geometry instanceof THREE.BufferGeometry) {
        finalGeometry = i.geometry
        finishLoad()
      }
    })
  }

  // 完成模型加载
  private _finishLoadModal() {
    // 获得最大的粒子数量
    let maxParticlesCount = 0

    this.modelList.forEach((val) => {
      maxParticlesCount = Math.max(maxParticlesCount, val.attributes.position.count)
    })

    this.maxParticlesCount = maxParticlesCount
    // 基于最大点构建一个动画载体
    const vertices = []
    const randMaxLength = 1500
    this.MainParticleGroup = new Tween.Group()
    for (let i = 0; i < maxParticlesCount; i++) {
      const x = getRangeRandom(-1 * randMaxLength, randMaxLength)
      const y = getRangeRandom(-1 * randMaxLength, randMaxLength)
      const z = getRangeRandom(-1 * randMaxLength, randMaxLength)
      vertices.push(x, y, z)

      const p: TWEEN_POINT = {
        x,
        y,
        z,
        isPlaying: true
      }
      p.tweenctx = new Tween.Tween(p, this.MainParticleGroup)
        .easing(Tween.Easing.Exponential.In)
        // 处理内部私有变量
        .onComplete((o) => {
          // @ts-expect-error
          o.tweenctx!._valuesStart.x = o.x
          // @ts-expect-error
          o.tweenctx!._valuesStart.y = o.y
          // @ts-expect-error
          o.tweenctx!._valuesStart.z = o.z
          o.isPlaying = false
        })
        .onStart((o) => {
          // @ts-expect-error
          o.tweenctx!._valuesStart.x = o.x
          // @ts-expect-error
          o.tweenctx!._valuesStart.y = o.y
          // @ts-expect-error
          o.tweenctx!._valuesStart.z = o.z
          o.isPlaying = true
        })
      this.ParticleAnimeMap[i] = p
    }
    const AnimateEffectGeometry = new THREE.BufferGeometry()
    AnimateEffectGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3, false))
    this.AnimateEffectParticle = new THREE.Points(AnimateEffectGeometry, this.PointMaterial)
    this.scene?.add(this.AnimateEffectParticle)

    // 开始监听鼠标移动事件
    // 钩子
    this.onModelsFinishedLoad?.call(this, this.AnimateEffectParticle, this.scene!)
  }

  // 使物体宽度适应屏幕
  private fitObjectToViewWidth(obj: THREE.Object3D, baseWidth: number, occupy = 0.3) {
    if (!this.camera || !obj) return
    const dist = Math.abs((this.camera.position.z) - (obj.position.z || 0))
    const frustumH = 2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5)) * dist
    const frustumW = frustumH * this.camera.aspect
    const targetW = frustumW * occupy
    const s = targetW / baseWidth
    obj.scale.setScalar(s)
  }


  /**
   * 修改模型
   * @param {string} name 模型名字
   * @param {number?} time 动画时间长度，默认 `1500ms`
   */
  ChangeModel(name: string, time: number = this.AnimateDuration) {
    const item = this.modelList.get(name)
    if (item == null) {
      console.warn('未找到指定名字的模型，改变操作已终止！传入的名字：' + name.toString())
      return
    }
    const itemHook = this.Models.get(name)
    if (this.CurrentUseModelName !== undefined) this.LastUseModelName = this.CurrentUseModelName
    this.CurrentUseModelName = name

    // ★ 先生成“换出”的 ghost（让旧形态淡出）
    this._spawnGhostAndFadeOut(Math.max(600, time * 0.6))

    /** 模型切换开始钩子 */
    itemHook!.onEnterStart?.call(this, this.AnimateEffectParticle!)
    const targetModel = item.getAttribute('position')
    const sourceModel = this.AnimateEffectParticle!.geometry.getAttribute('position')

    const TimerId = setTimeout(() => {
      itemHook!.onEnterEnd?.call(this, this.AnimateEffectParticle!)
    }, time * 2)

    // ★ 预取目标位置为 Float32Array，方便读
    const tgtArr = targetModel.array as Float32Array

    // ★ 计算距离范围（用于延迟映射）
    let maxDist = 1e-6
    for (let i = 0; i < this.maxParticlesCount; i++) {
      const cur = i % targetModel.count
      const dx = sourceModel.getX(i) - tgtArr[cur * 3]
      const dy = sourceModel.getY(i) - tgtArr[cur * 3 + 1]
      const dz = sourceModel.getZ(i) - tgtArr[cur * 3 + 2]
      const d = Math.sqrt(dx*dx + dy*dy + dz*dz)
      if (d > maxDist) maxDist = d
    }

    // 停止当前所有动画并重新设定
    for (let i = 0; i < this.maxParticlesCount; i++) {
      const p = this.ParticleAnimeMap[i]
      p.isPlaying = true
      const cur = i % targetModel.count

      // 同步起点（防“跳变”）
      p.x = sourceModel.getX(i)
      p.y = sourceModel.getY(i)
      p.z = sourceModel.getZ(i)

      // ★ 距离驱动延迟：越远延迟越长，再加一点随机噪声
      const dx = p.x - tgtArr[cur * 3]
      const dy = p.y - tgtArr[cur * 3 + 1]
      const dz = p.z - tgtArr[cur * 3 + 2]
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
      const dist01 = maxDist > 0 ? (dist / maxDist) : 0
      const delay = (time * 0.5) * dist01 + (time * 0.2) * Math.random()

      p.tweenctx!.stop()
        .to(
          { x: tgtArr[cur * 3], y: tgtArr[cur * 3 + 1], z: tgtArr[cur * 3 + 2] },
          time
        )
        // ★ 柔和缓动：InOut 带来更自然的起/止
        .easing(Tween.Easing.Exponential.InOut)
        .delay(delay)
        .onUpdate((o) => {
          sourceModel.setXYZ(i, o.x, o.y, o.z)
          sourceModel.needsUpdate = true
        })
        .onStop(() => {
          clearTimeout(TimerId)
        })
        .onComplete((o) => {
          // 保持你原有的“值回写 & 标记”逻辑
          // @ts-expect-error
          o.tweenctx!._valuesStart.x = o.x
          // @ts-expect-error
          o.tweenctx!._valuesStart.y = o.y
          // @ts-expect-error
          o.tweenctx!._valuesStart.z = o.z
          p.isPlaying = false
        })
        .start()
    }

    // 触发 addons 钩子
    // this.addons?.forEach((val) => {
    //   val.ChangeModel?.call(this)
    // })

    this.addons?.forEach((val) => {
  // 兼容两种命名
      if (typeof val.onChangeModel === 'function') val.onChangeModel.call(this)
      else if (typeof val.ChangeModel === 'function') val.ChangeModel.call(this)
    })
  }

  /** 显示欢迎词
   * @param {string} text 欢迎词内容，默认 'WELCOME'
   */
  public async ShowWelcomeText(text = 'WELCOME') {
    if (this.WelcomePoints) return

    const font = await new Promise<any>((resolve, reject) => {
      new FontLoader().load('/fonts/helvetiker.json', resolve, undefined, reject)
    })

    const textGeo = new TextGeometry(text, {
      font,
      size: 160,
      height: 30,
      curveSegments: 8,
      bevelEnabled: true,
      bevelThickness: 4,
      bevelSize: 2,
      bevelSegments: 2,
    })
    textGeo.center()

    const tempMesh = new THREE.Mesh(textGeo, new THREE.MeshBasicMaterial())
    const sampler = new MeshSurfaceSampler(tempMesh).build()

    const COUNT = 12000
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)

    const v = new THREE.Vector3()
    const c = new THREE.Color()
    for (let i = 0; i < COUNT; i++) {
      sampler.sample(v)
      v.z += (Math.random() - 0.5) * 12
      positions[i * 3 + 0] = v.x
      positions[i * 3 + 1] = v.y
      positions[i * 3 + 2] = v.z
      c.setHSL(0.62 + Math.random() * 0.03, 0.45, 0.7 + Math.random() * 0.1)
      colors[i * 3 + 0] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this._welcomeTargets[0]), 3))
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

    const box = new THREE.Box3().setFromBufferAttribute(
      geo.getAttribute('position') as THREE.BufferAttribute
    )
    this.WelcomeBaseWidth = box.max.x - box.min.x

    const mat = new THREE.PointsMaterial({
      size: 1.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    this.WelcomePoints = new THREE.Points(geo, mat)
    this.WelcomePoints.position.set(0, 0, 0) // 主场景原点
    this.scene?.add(this.WelcomePoints)

    // 初次自适配：让字占视口 ~72% 宽
    this.fitObjectToViewWidth(this.WelcomePoints, this.WelcomeBaseWidth, 0.3)
  }

  public HideWelcomeText() {
    if (!this.WelcomePoints || !this.scene) return
    this.scene.remove(this.WelcomePoints)
    this.WelcomePoints.geometry.dispose()
    this.WelcomePoints.material.dispose()
    this.WelcomePoints = undefined
  }

  /** 平滑淡出欢迎文字（上移 + 渐隐 + 轻微缩小 + 余影），结束后移除 */
  public async ExitWelcome(opts?: { duration?: number; up?: number; scale?: number }) {
    if (!this.WelcomePoints) return;
    const dur   = opts?.duration ?? 800;   // 动画时长
    const up    = opts?.up ?? 80;          // 上移距离（像素/世界坐标）
    const sMul  = opts?.scale ?? 0.90;     // 轻微缩小到的比例

    // 停掉文字序列，防止过程中切帧
    this.StopWelcomeSequence();

    // 生成“余影”更丝滑
    this._spawnWelcomeGhostAndFadeOut(Math.max(500, dur * 0.7));

    const pts = this.WelcomePoints!;
    const mat = pts.material as THREE.PointsMaterial;

    // 起始状态快照
    const start = {
      y: pts.position.y,
      o: mat.opacity,
      s: pts.scale.x,
    };
    const end = { y: start.y + up, o: 0.0, s: start.s * sMul };

    // 用已有的 Tween 组，不卡帧
    await new Promise<void>((resolve) => {
      const state = { t: 0 };
      new Tween.Tween(state, this.MainParticleGroup)
        .to({ t: 1 }, dur)
        .easing(Tween.Easing.Quadratic.InOut)
        .onUpdate(() => {
          const k = state.t;
          // 线性插值（位置/缩放），透明度也随之下降
          pts.position.y = start.y + (end.y - start.y) * k;
          const ss = start.s + (end.s - start.s) * k;
          pts.scale.setScalar(ss);
          mat.opacity = start.o + (end.o - start.o) * k;
          mat.needsUpdate = true;
        })
        .onComplete(() => {
          // 完成后彻底移除与释放
          this.HideWelcomeText();
          resolve();
        })
        .start();
    });
  }

  
  private async _buildTextTarget(
    text: string,
    count: number,
    opts?: { size?: number; height?: number; lineHeight?: number }
  ): Promise<Float32Array> {
    const font = await new Promise<any>((resolve, reject) => {
      new FontLoader().load('/fonts/helvetiker.json', resolve, undefined, reject)
    })

    const size = opts?.size ?? 160
    const height = opts?.height ?? 30
    const lineHeight = opts?.lineHeight ?? (size * 1.2)

    // 支持 \n：逐行做 TextGeometry，然后 Y 方向堆叠
    const lines = text.split('\n')
    const geos: THREE.BufferGeometry[] = []
    lines.forEach((line, idx) => {
      const g = new TextGeometry(line, {
        font, size, height, curveSegments: 8,
        bevelEnabled: true, bevelThickness: 4, bevelSize: 2, bevelSegments: 2,
      })
      g.center()
      g.translate(0, -(idx * lineHeight), 0) // 向下堆叠
      geos.push(g)
    })

    const merged = mergeGeometries(geos, false)!
    const tempMesh = new THREE.Mesh(merged, new THREE.MeshBasicMaterial())
    const sampler = new MeshSurfaceSampler(tempMesh).build()

    const positions = new Float32Array(count * 3)
    const v = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      sampler.sample(v)
      v.z += (Math.random() - 0.5) * 12
      positions[i * 3 + 0] = v.x
      positions[i * 3 + 1] = v.y
      positions[i * 3 + 2] = v.z
    }

    // 原始宽度：用于初次自适配（只需从第一次 target 拿）
    if (!this.WelcomePoints) {
      const box = new THREE.Box3().setFromBufferAttribute(new THREE.BufferAttribute(positions, 3))
      this.WelcomeBaseWidth = box.max.x - box.min.x
    }

    geos.forEach(g => g.dispose())
    merged.dispose()
    return positions
  }

public async PlayWelcomeSequence(
  texts: string[],
  options?: {
    count?: number;
    pointSize?: number;
    occupy?: number;
    transitionMs?: number;
    dwellMs?: number;
  }
) {
  if (this._welcomePlaying) return
  this._welcomePlaying = true

  this._welcomeCount   = options?.count ?? this._welcomeCount
  this._welcomeTransMs = options?.transitionMs ?? this._welcomeTransMs
  this._welcomeDwellMs = options?.dwellMs ?? this._welcomeDwellMs

  // 预构建所有目标
  this._welcomeTargets = []
  for (const t of texts) {
    const arr = await this._buildTextTarget(t, this._welcomeCount)
    this._welcomeTargets.push(arr)
  }
  if (this._welcomeTargets.length === 0) return

  // 创建/复用 Points
  if (!this.WelcomePoints) {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(this._welcomeTargets[0]), 3) // ✅ 确保是 Float32Array
    )
    const mat = new THREE.PointsMaterial({
      size: options?.pointSize ?? 1,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    this.WelcomePoints = new THREE.Points(geo, mat)
    this.scene?.add(this.WelcomePoints)
    this.fitObjectToViewWidth(this.WelcomePoints, this.WelcomeBaseWidth, options?.occupy ?? 0.30)
  } else {
    // 若已存在，先把当前位置设置成第一个目标
    const pos = this.WelcomePoints.geometry.getAttribute('position') as THREE.BufferAttribute
    const tgt = this._welcomeTargets[0]
    const n = Math.min(pos.array.length, tgt.length)
    for (let i = 0; i < n; i++) pos.array[i] = tgt[i]
    pos.needsUpdate = true
  }

  if (this._welcomeTransitioning) {
    const tL = this._welcomeLerp.t
    // 连续两帧 >= 0.999，避免抖动/重复触发
    if (tL >= 0.999 && this._welcomeLastT >= 0.999) {
      this._welcomeTransitioning = false
      this._armDwellThenGoNext()
      console.log('[Welcome] transition fallback complete, arm dwell')
    }
    this._welcomeLastT = tL
  }

  // 初始化为第 0 段，然后安排 “停留→切下一段”
  this._welcomeIdx  = 0
  this._welcomeFrom = undefined
  this._welcomeTo   = undefined
  this._welcomeLerp.t = 1

  // 先停留 dwell，再开始第一个切换（到 index=1）
  this._armDwellThenGoNext()
  
  // 调试：挂到 window 便于手动切下一段/查看状态
  // @ts-expect-error
  window.welcomeDebug = {
    next: () => this._startTransitionTo((this._welcomeIdx + 1) % this._welcomeTargets.length),
    stop: () => this.StopWelcomeSequence(),
    play: () => this._armDwellThenGoNext(),
    status: () => ({
      idx: this._welcomeIdx,
      playing: this._welcomePlaying,
      dwellMs: this._welcomeDwellMs,
      transMs: this._welcomeTransMs,
      targets: this._welcomeTargets.length,
    }),
  }
  console.log('[Welcome] sequence started', (window as any).welcomeDebug.status())

  }

  private _armDwellThenGoNext() {
    if (!this._welcomePlaying) return
    if (this._welcomeTargets.length <= 1) return
    if (this._welcomeTimer) window.clearTimeout(this._welcomeTimer)
    console.log('[Welcome] dwell for', this._welcomeDwellMs, 'ms at idx', this._welcomeIdx)
    this._welcomeTimer = window.setTimeout(() => {
      const next = (this._welcomeIdx + 1) % this._welcomeTargets.length
      this._startTransitionTo(next)
    }, this._welcomeDwellMs)
  }

  private _startTransitionTo(nextIndex: number) {
    if (!this.WelcomePoints || !this._welcomePlaying) return

    // ★ 先生成换出的 ghost
    this._spawnWelcomeGhostAndFadeOut(Math.max(500, this._welcomeTransMs * 0.6))

    const posAttr = this.WelcomePoints.geometry.getAttribute('position') as THREE.BufferAttribute

    // 起始=当前 positions 的拷贝；目标=下一个 target
    this._welcomeFrom = new Float32Array(posAttr.array) // 一定要拷贝
    this._welcomeTo   = this._welcomeTargets[nextIndex]
    this._welcomeIdx  = nextIndex

    // ★ 计算“距离驱动延迟”
    const a = this._welcomeFrom, b = this._welcomeTo
    const n = Math.min(a.length, b.length)
    let maxDist = 1e-6
    if (!this._welcomePerDelays || this._welcomePerDelays.length !== n/3) {
      this._welcomePerDelays = new Float32Array(n/3)
    }
    for (let i = 0; i < n; i += 3) {
      const dx = a[i]   - b[i]
      const dy = a[i+1] - b[i+1]
      const dz = a[i+2] - b[i+2]
      const d = Math.hypot(dx, dy, dz)
      if (d > maxDist) maxDist = d
    }
    this._welcomeMaxDist = maxDist

    // 将总过渡时长拆出“延迟配额”和“实际位移配额”
    // 例：最多 50% 用于延迟（越远延迟越久），其余用于真正插值
    const delayQuota = this._welcomeTransMs * 0.5
    for (let vi = 0, pi = 0; vi < n; vi += 3, ++pi) {
      const dx = a[vi]   - b[vi]
      const dy = a[vi+1] - b[vi+1]
      const dz = a[vi+2] - b[vi+2]
      const d = Math.hypot(dx, dy, dz)
      const dist01 = maxDist > 0 ? d / maxDist : 0
      const jitter = Math.random() * 0.2 // 20% 抖动噪声
      this._welcomePerDelays[pi] = delayQuota * (0.8 * dist01 + jitter * (1.0 - dist01))
    }

    // 手写时间轴
    this._welcomeStartMs = performance.now()
    this._welcomeTransitioning = true

    console.log('[Welcome] transition to idx', nextIndex)
  }

  // 创建一个“余影”并做淡出动画；动画完自动从场景移除与释放
  private _spawnGhostAndFadeOut(duration = 900) {
    if (!this.AnimateEffectParticle || !this.scene || !this.PointMaterial) return

    // 1) 克隆几何体快照（避免主几何随后被更新）
    const snap = new THREE.BufferGeometry()
    const srcPos = this.AnimateEffectParticle.geometry.getAttribute('position') as THREE.BufferAttribute
    snap.setAttribute('position', new THREE.BufferAttribute(new Float32Array(srcPos.array), 3))

    // 2) 克隆材质：初始稍亮些、稍大些，立刻看得出“在换出”
    const ghostMat = this.PointMaterial.clone()
    ghostMat.blending = THREE.NormalBlending
    ghostMat.premultipliedAlpha = true
    ghostMat.depthWrite = false
    ghostMat.toneMapped = false
    ghostMat.opacity = Math.min(this.PointMaterial.opacity, 0.22)
    ghostMat.size = this.PointMaterial.size
    // 如果你的点贴图本身很亮，再整体压一下颜色
    if (ghostMat.color) ghostMat.color.multiplyScalar(0.55)

    // 3) 生成 ghost Points
    const ghost = new THREE.Points(snap, ghostMat)
    // 与主粒子一致的位置/旋转/缩放（通常都是 0，但稳妥起见）
    ghost.position.copy(this.AnimateEffectParticle.position)
    ghost.rotation.copy(this.AnimateEffectParticle.rotation)
    ghost.scale.copy(this.AnimateEffectParticle.scale);
    (this.ghostScene ?? this.scene)?.add(ghost)

    // 4) 两条补间：透明度到 0、尺寸稍微变大，营造拖尾消散
    const g1 = { o: ghostMat.opacity, s: ghostMat.size }
    new Tween.Tween(g1, this.MainParticleGroup)
      .to({ o: 0.0, s: ghostMat.size * 1.25 }, duration)
      .easing(Tween.Easing.Quadratic.Out)
      .onUpdate(() => {
        ghostMat.opacity = g1.o
        ghostMat.size = g1.s
        ghostMat.needsUpdate = true
      })
      .onComplete(() => {
        // 回收
        this.scene?.remove(ghost)
        ghost.geometry.dispose()
        ghostMat.dispose()
      })
      .start()
    }

  // 为欢迎词 Points 生成一个淡出余影（ghost）
  private _spawnWelcomeGhostAndFadeOut(duration = 700) {
    if (!this.WelcomePoints || !this.scene) return
    const srcPos = this.WelcomePoints.geometry.getAttribute('position') as THREE.BufferAttribute

    // 1) 快照几何
    const snap = new THREE.BufferGeometry()
    snap.setAttribute('position', new THREE.BufferAttribute(new Float32Array(srcPos.array), 3))

    // 2) 克隆材质（稍亮/稍大，容易看出“换出”）
    const baseMat = this.WelcomePoints.material as THREE.PointsMaterial
    const ghostMat = baseMat.clone()
    ghostMat.blending = THREE.NormalBlending
    ghostMat.premultipliedAlpha = true
    ghostMat.depthWrite = false
    ghostMat.toneMapped = false
    ghostMat.opacity = Math.min(baseMat.opacity, 0.22)
    ghostMat.size = baseMat.size
    if (ghostMat.color) ghostMat.color.multiplyScalar(0.55)


    // 3) ghost Points
    const ghost = new THREE.Points(snap, ghostMat)
    ghost.position.copy(this.WelcomePoints.position)
    ghost.rotation.copy(this.WelcomePoints.rotation)
    ghost.scale.copy(this.WelcomePoints.scale);
    (this.ghostScene ?? this.scene)?.add(ghost)

    // 4) 透明度到 0 + 尺寸轻微变大后回收
    const state = { o: ghostMat.opacity, s: ghostMat.size }
    new Tween.Tween(state, this.MainParticleGroup)
      .to({ o: 0.0, s: ghostMat.size * 1.2 }, duration)
      .easing(Tween.Easing.Quadratic.Out)
      .onUpdate(() => {
        ghostMat.opacity = state.o
        ghostMat.size = state.s
        ghostMat.needsUpdate = true
      })
      .onComplete(() => {
        (this.ghostScene ?? this.scene)?.remove(ghost)
        ghost.geometry.dispose()
        ghostMat.dispose()
      })
      .start()
  }

  private _easeInOutExpo(x: number) {
    if (x <= 0) return 0
    if (x >= 1) return 1
    return x < 0.5
      ? Math.pow(2, 20 * x - 10) / 2
      : (2 - Math.pow(2, -20 * x + 10)) / 2
  }

  public StopWelcomeSequence() {
    this._welcomePlaying = false
    if (this._welcomeTimer) window.clearTimeout(this._welcomeTimer)
  }


  /**
   * 开始监听鼠标移动的钩子
   *
   * 一般在入场动画结束后调用
   */
  ListenMouseMove() {
    if (this.hadListenMouseMove !== true) {
      window.addEventListener('mousemove', this.rotateScene)
      this.hadListenMouseMove = true
    }
  }

  /**
   * 取消监听鼠标移动的钩子
   */
  StopListenMouseMove() {
    if (this.hadListenMouseMove === true) {
      window.removeEventListener('mousemove', this.rotateScene)
      this.hadListenMouseMove = false
    }
  }

  /**
   * 场景归中到水平位置
   *
   * @param immediately 立即归中
   */
  AlignCameraCenter(immediately = false) {
    if (immediately && this.scene != null) {
      this.scene.rotation.x = 0
      this.scene.rotation.y = 0
      this.mouseV = 0
      this.mouseK = 0
      return
    }
    const e = new MouseEvent('click', {
      clientX: this.WIDTH / 2,
      clientY: this.HEIGHT / 2
    })
    this.rotateScene(e)
  }

  /**
 * 数组粒子去重方法
 * @param arr 待去重的数组
 * @returns {Float32Array}
 */
  VerticesDuplicateRemove(arr: Float32Array) {
    const set = new Set<string>(); let t = []
    for (let i = 0; i < arr.length; i++) {
      t.push(arr[i])
      if (i % 3 === 2) {
        set.add(t.join(','))
        t = []
      }
    }
    const res: number[] = []
    set.forEach((val) => {
      res.push(...val.split(',').map((val) => Number(val)))
    })
    return new Float32Array(res)
  }

  // 监听鼠标移动旋转场景
  private readonly rotateScene = throttle((e: MouseEvent) => {
    this.mouseV = 3e-4 * (e.clientX - this.WIDTH / 2)
    this.mouseK = 1e-4 * (e.clientY - this.HEIGHT / 2)
  }, 100)

  // 更新场景旋转
  private _updateRotation() {
    if (this.scene != null) {
      this.scene.rotation.y += (this.mouseV - this.scene.rotation.y) / 50
      this.scene.rotation.x += (this.mouseK - this.scene.rotation.x) / 50
    }
  }

  // 循环更新渲染
  private update(t: number) {
    // 动画插件
    Tween.update(t)
    // 更新自己的动画组
    this.MainParticleGroup?.update(t)
    // 外置的渲染函数
    this.onRendering?.call(this, t)
    // 性能监测插件
    this.stats?.update()
    // 场景旋转检测
    this._updateRotation()
    // 模型 update 钩子更新
    this.Models.forEach((val) => {
      if (val.name === this.CurrentUseModelName && val.onAnimationFrameUpdate != null) {
        if (val.onAnimationFrameUpdate(this.AnimateEffectParticle!, this.ParticleAnimeMap, val.geometry!) === true) {
          for (const i of BuiltinShaderAttributeName) {
            const p = this.AnimateEffectParticle?.geometry?.getAttribute(i)
            if (p != null) {
              p.needsUpdate = true
            }
          }
        }
      }
    })

  // —— 欢迎字：手写时间轴推进（逐点延迟 + 柔和缓动） —— //
  if (this.WelcomePoints && this._welcomePlaying && this._welcomeFrom && this._welcomeTo) {
    const now = performance.now()
    const dt  = now - this._welcomeStartMs
    const pos = this.WelcomePoints.geometry.getAttribute('position') as THREE.BufferAttribute
    const a = this._welcomeFrom, b = this._welcomeTo
    const n = Math.min(pos.array.length, a.length, b.length)

    // 过渡有效区间总长：扣掉“最大延迟”
    const maxDelay = this._welcomePerDelays
      ? this._welcomePerDelays.reduce((m, v) => v > m ? v : m, 0)
      : 0
    const moveWindow = Math.max(1, this._welcomeTransMs - maxDelay)

    // 逐点计算“生效 t_i”，再做 Expo.InOut 缓动
    if (this._welcomePerDelays) {
      for (let vi = 0, pi = 0; vi < n; vi += 3, ++pi) {
        const dly = this._welcomePerDelays[pi]
        const raw = (dt - dly) / moveWindow
        const ti = Math.min(1, Math.max(0, raw))
        const e  = this._easeInOutExpo(ti)
        pos.array[vi]     = a[vi]     + (b[vi]     - a[vi])     * e
        pos.array[vi + 1] = a[vi + 1] + (b[vi + 1] - a[vi + 1]) * e
        pos.array[vi + 2] = a[vi + 2] + (b[vi + 2] - a[vi + 2]) * e
      }
    } else {
      // 兼容：没有延迟数据就用全局缓动
      const tL = Math.min(1, dt / this._welcomeTransMs)
      const e  = this._easeInOutExpo(tL)
      for (let i = 0; i < n; i++) {
        pos.array[i] = a[i] + (b[i] - a[i]) * e
      }
    }

    pos.needsUpdate = true

    // 判定完成（全局判定：时间超过总时长即可）
    if (this._welcomeTransitioning && dt >= this._welcomeTransMs) {
      this._welcomeTransitioning = false
      this._armDwellThenGoNext()
      console.log('[Welcome] transition finished, arm dwell for', this._welcomeDwellMs, 'ms at idx', this._welcomeIdx)
    }
  }

    // addons 执行更新
    this.addons?.forEach((val) => {
      val.update()
    })
    // 渲染器执行渲染
    // this.renderer.render(this.scene, this.camera);
    // 效果器执行渲染，如果不需要效果器请使用上方的渲染模式
    this.composer?.render()
    // 循环调用
    requestAnimationFrame((t) => {
      this.update(t)
    })
  }
}

export default ParticleSystem
