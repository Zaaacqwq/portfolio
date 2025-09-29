import * as React from 'react'
import Styles from './index.module.scss'

import ParticleSystem from '@/THREE'
import { useEffect, useRef } from 'react'
import AtmosphereParticle from '@/THREE/atmosphere'
import { ParticleModelProps } from '@/declare/THREE'

import Tween from '@tweenjs/tween.js'
import GetFlatGeometry from '@/utils/GetFlatGeometry'
import { BufferGeometry, Float32BufferAttribute } from 'three'
import VerticesDuplicateRemove from '@/utils/VerticesDuplicateRemove'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

import OverlayText from './OverlayText'

// ------- 4 个内容页与模型映射（不含 welcome）-------
const PAGES = [
  { key: 'about',      label: 'ABOUT ME',   model: 'ball'  as const },
  { key: 'projects',   label: 'PROJECTS',   model: 'cone'  as const },
  { key: 'experience', label: 'EXPERIENCE', model: 'cube'  as const },
  { key: 'contact',    label: 'CONTACT',    model: 'wave'  as const },
] as readonly { key: 'about'|'projects'|'experience'|'contact'; label: string; model: 'ball'|'cone'|'cube'|'wave' }[]
const clamp = (i: number) => Math.max(0, Math.min(i, PAGES.length - 1))

type PageIndex = -1 | 0 | 1 | 2 | 3 // -1 = Welcome（一次性）

function IndexPage() {
  // ====== 触摸滑动切页（移动端） ======
  const touchStartYRef = React.useRef<number | null>(null);
  const TOUCH_STEP = 60;
  const onTouchStart = (e: TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartYRef.current == null) return;
    const dy = e.changedTouches[0].clientY - touchStartYRef.current;
    touchStartYRef.current = null;
    if (Math.abs(dy) < TOUCH_STEP || wheelLockRef.current) return;

    const dir = dy < 0 ? 1 : -1; // 上滑=下一页
    const cur = idxRef.current;

    if (cur === -1) {
      if (dir > 0) {
        setIndex(0);
        wheelLockRef.current = true;
        window.setTimeout(() => { wheelLockRef.current = false }, MORPH_LOCK_MS);
      }
      return;
    }

    const next = Math.max(0, Math.min(3, cur + dir)) as 0 | 1 | 2 | 3;
    if (next !== cur) {
      setIndex(next);
      wheelLockRef.current = true;
      window.setTimeout(() => { wheelLockRef.current = false }, MORPH_LOCK_MS);
    }
  };

  const wrapper = useRef<HTMLDivElement | null>(null)

  // 粒子系统持久引用
  const mainRef = React.useRef<ParticleSystem | null>(null)

  // 当前页索引的“唯一真源”
  const idxRef = React.useRef<PageIndex>(-1)
  const [pageIndex, setPageIndex] = React.useState<PageIndex>(-1)

  // ====== 移动端判定 ======
  const [isMobile, setIsMobile] = React.useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  );

  // 滚轮节流
  const wheelAccumRef = React.useRef<number>(0)
  const wheelLockRef  = React.useRef<boolean>(false)
  const WHEEL_STEP = 200
  const MORPH_LOCK_MS = 1000

  const [uiShow, setUiShow] = React.useState(false)

  // --------- Atmosphere / Tween：只创建一次 ---------
  const TurnBasicNum = { firefly: 0.002 }
  const base = 0.002
  const al = 2000

  const { Atomsphere1, Atomsphere2, Atomsphere3 } = React.useMemo(() => {
    const A1 = new AtmosphereParticle({
      longestDistance: al,
      particleSum: 500,
      axis: 'x',
      baseSpeed: base,
      accel: { upTo: 0.02, upMs: 1250, downTo: base, downMs: 500 },
      renderUpdate: (Point, speed = base) => { Point.rotation.x -= speed },
      callback: (Point) => { Point.position.z = -1 * al },
    })

    const A2 = new AtmosphereParticle({
      longestDistance: al,
      particleSum: 500,
      axis: 'y',
      baseSpeed: base,
      accel: { upTo: 0.02, upMs: 1250, downTo: base, downMs: 500 },
      renderUpdate: (Point, speed = base) => {
        Point.rotation.y += speed
        Point.position.y = -0.2 * al
        Point.position.z = -1 * al
      },
    })

    const A3 = new AtmosphereParticle({
      longestDistance: al,
      particleSum: 500,
      axis: 'z',
      baseSpeed: base / 2,
      accel: { upTo: 0.02, upMs: 1250, downTo: base / 2, downMs: 500 },
      renderUpdate: (Point, speed = base / 2) => {
        Point.rotation.z += speed
        Point.position.z = -1.2 * al
      },
    })

    return { Atomsphere1: A1, Atomsphere2: A2, Atomsphere3: A3 }
  }, [])

  // --------- 模型定义：只创建一次 ---------
  const scaleNum = 600
  let Q = 0

  const Models = React.useMemo<ParticleModelProps[]>(() => [
    {
      name: 'cube',
      path: new URL('../../THREE/models/examples/cube.fbx', import.meta.url).href,
      onLoadComplete(Geometry) {
        const s = 400
        Geometry.scale(s, s, s)
        Geometry.translate(-700, 0, -100)
      },
      loader: {
        loaderInstance: new FBXLoader(),
        load(group) {
          const g = new BufferGeometry()
          let arr = new Float32Array([])
          for (const i of group.children) {
            arr = new Float32Array([...arr, ...i.geometry.attributes.position.array])
          }
          g.setAttribute('position', new Float32BufferAttribute(VerticesDuplicateRemove(arr), 3))
          return g
        }
      }
    },
    {
      name: 'ball',
      path: new URL('../../THREE/models/examples/ball.obj', import.meta.url).href,
      onLoadComplete(Geometry) {
        Geometry.scale(scaleNum, scaleNum, scaleNum)
        Geometry.translate(-700, 0, -100)
      },
      onEnterStart() { console.log('ball enter start') },
      onEnterEnd() { console.log('ball enter end') }
    },
    {
      name: 'wave',
      geometry: GetFlatGeometry(),
      onAnimationFrameUpdate(PerfromPoint, TweenList) {
        const p = PerfromPoint.geometry.getAttribute('position')
        TweenList.forEach((val, i) => {
          if (val.isPlaying === false) {
            p.setY(i, Math.sin((i + 1 + Q) * 0.3) * 50 + Math.sin((i + Q) * 0.5) * 50 - 500)
          }
        })
        Q += 0.08
        return true
      }
    },
    {
      name: 'cone',
      path: new URL('../../THREE/models/examples/cone.obj', import.meta.url).href,
      onLoadComplete(Geometry) {
        Geometry.scale(scaleNum, scaleNum, scaleNum)
        Geometry.translate(800, 100, -300)
      }
    }
  ], []) // eslint-disable-line react-hooks/exhaustive-deps

  // 调试：window.changeModel
  // @ts-expect-error
  window.changeModel = (name: string) => {
    mainRef.current?.ChangeModel(name)
  }

  // 统一设置页：更新 ref + state + 模型（先淡出，再切页，再淡入）
  const setIndex = React.useCallback((v: PageIndex, opts?: { keepWelcome?: boolean }) => {
    const cur = idxRef.current

    if (v >= 0 && !opts?.keepWelcome) {
      mainRef.current?.StopWelcomeSequence?.()
      mainRef.current?.HideWelcomeText?.()
    }

    const curKey = cur >= 0 ? PAGES[clamp(cur)].key : null
    const fadeUnitsByPage: Record<Exclude<typeof curKey, null>, number> = {
      about: 5,
      projects: 6,
      experience: 9,
      contact: 4,
    } as const

    const BASE_MS = 800
    const STEP_MS = 120
    const EXIT_MS = curKey ? BASE_MS + (fadeUnitsByPage[curKey] - 1) * STEP_MS + 50 : 0

    if (cur >= 0 && v !== cur) {
      const target = PAGES[v].model
      mainRef.current?.ChangeModel?.(target)
      setUiShow(false)

      window.setTimeout(() => {
        idxRef.current = v
        setPageIndex(v)
        window.setTimeout(() => setUiShow(true), 20)
      }, Math.max(EXIT_MS, 900))
      return
    }

    idxRef.current = v
    setPageIndex(v)
    if (v >= 0) {
      const target = PAGES[v].model
      mainRef.current?.ChangeModel?.(target)
      setUiShow(false)
      window.setTimeout(() => setUiShow(true), 20)
    }
  }, [])

  // 侧栏点击：仅 0..3
  const gotoPage = React.useCallback((v: 0 | 1 | 2 | 3) => {
    setIndex(v)
  }, [setIndex])

  // 只在挂载时：创建粒子系统
  useEffect(() => {
    if (!mainRef.current && wrapper.current) {
      mainRef.current = new ParticleSystem({
        CanvasWrapper: wrapper.current,
        Models,
        addons: [Atomsphere1, Atomsphere2, Atomsphere3],
        onModelsFinishedLoad: async () => {
          mainRef.current?.ListenMouseMove()
          await mainRef.current?.PlayWelcomeSequence(
            [
              "W E L C O M E",
              "Z A C  C H E N",
              "P O R T F O L I O",
              "C E @ U W",
            ],
            isMobile
              ? { count: 2000, pointSize: 1.2, occupy: 0.45, transitionMs: 900,  dwellMs: 2400 }
              : { count: 10000, pointSize: 1.0, occupy: 0.30, transitionMs: 1000, dwellMs: 3000 }
          )
        }
      })
    }

    const goFromWelcomeTo0 = () => {
      if (wheelLockRef.current) return
      wheelLockRef.current = true

      mainRef.current?.ExitWelcome({ duration: 800, up: 80, scale: 0.90 })

      setTimeout(() => {
        setIndex(0, { keepWelcome: true })
      }, 500)

      setTimeout(() => { wheelLockRef.current = false }, MORPH_LOCK_MS)
    }

    const onWheel = (e: WheelEvent) => {
      wheelAccumRef.current += e.deltaY
      if (wheelLockRef.current) return
      if (Math.abs(wheelAccumRef.current) < WHEEL_STEP) return

      const dir = e.deltaY > 0 ? 1 : -1
      wheelAccumRef.current = 0

      const cur = idxRef.current

      if (cur === -1) {
        if (dir > 0) {
          goFromWelcomeTo0()
        }
        return
      }

      const next = Math.max(0, Math.min(3, cur + dir)) as 0 | 1 | 2 | 3
      if (next !== cur) {
        setIndex(next)
        wheelLockRef.current = true
        setTimeout(() => { wheelLockRef.current = false }, MORPH_LOCK_MS)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel as any)
      mainRef.current?.StopListenMouseMove()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 监听媒体查询和触摸事件（移动端）
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 768px)')
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener?.('change', onChange)

    if (mq.matches) {
      window.addEventListener('touchstart', onTouchStart as any, { passive: true })
      window.addEventListener('touchend', onTouchEnd as any, { passive: true })
    }

    return () => {
      mq.removeEventListener?.('change', onChange)
      window.removeEventListener('touchstart', onTouchStart as any)
      window.removeEventListener('touchend', onTouchEnd as any)
    }
  }, [])

  return (
    <div className={Styles.index_page}>
      {/* 主 three 画布容器 */}
      <div className={Styles.canvas_wrapper} ref={wrapper} />

      {/* 欢迎页覆盖层（只出现一次，不可回退） */}
      {pageIndex === -1 && (
        <div className={Styles.welcome_overlay}>
          <h1 className={Styles.hero_title}></h1>
          <p className={Styles.hero_hint}>Scroll to explore</p>
        </div>
      )}

      {/* 左侧侧栏 + 文字叠层：进入内容页后显示 */}
      {pageIndex >= 0 && (
        <>
          <OverlayText
            active={PAGES[pageIndex].key as "about" | "projects" | "experience" | "contact"}
            show={uiShow}
          />

          {/* 桌面侧栏 / 移动底部圆点 */}
          {!isMobile ? (
            <nav className={Styles.sidebar} data-show>
              <ul>
                {PAGES.map((p, i) => {
                  const active = i === pageIndex
                  return (
                    <li
                      key={p.key}
                      className={active ? Styles.active : ''}
                      onClick={() => gotoPage(i as 0 | 1 | 2 | 3)}
                    >
                      <span className={Styles.dot} />
                      <span className={Styles.label}>{p.label}</span>
                    </li>
                  )
                })}
              </ul>
            </nav>
          ) : (
            <nav className={Styles.mobile_nav} data-show>
              <ul>
                {PAGES.map((p, i) => {
                  const active = i === pageIndex
                  return (
                    <li
                      key={p.key}
                      className={active ? Styles.active : ''}
                      onClick={() => gotoPage(i as 0 | 1 | 2 | 3)}
                      aria-label={p.label}
                    >
                      <span className={Styles.dot} />
                    </li>
                  )
                })}
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  )
}

export default IndexPage
