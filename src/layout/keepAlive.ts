import type { LocationAsRelativeRaw, RouteRecordName, Router } from 'vue-router'
import type { VNode } from 'vue'
import { useViewTagsStore } from '@/stores'

interface keepAliveCatchRaw {
  catchMap: Map<any, any>
  routeCatchKeyMap: Map<any, any>
  instance: any
}

const enum ShapeFlags {
  ELEMENT = 1,
  FUNCTIONAL_COMPONENT = 1 << 1,
  STATEFUL_COMPONENT = 1 << 2,
  TEXT_CHILDREN = 1 << 3,
  ARRAY_CHILDREN = 1 << 4,
  SLOTS_CHILDREN = 1 << 5,
  TELEPORT = 1 << 6,
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}

function resetShapeFlag(vnode: VNode) {
  // bitwise operations to remove keep alive flags
  vnode.shapeFlag &= ~ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
  vnode.shapeFlag &= ~ShapeFlags.COMPONENT_KEPT_ALIVE
}

export const keepAliveCatch: keepAliveCatchRaw = {
  catchMap: new Map(),
  routeCatchKeyMap: new Map(),
  instance: null
}

export function removeCatch(name: RouteRecordName): void {
  const { catchMap, routeCatchKeyMap, instance } = keepAliveCatch
  const key = routeCatchKeyMap.get(name)
  let cached = catchMap.get(key)

  if (!cached) return

  const {
    renderer: { um: _unmount }
  } = instance

  resetShapeFlag(cached)
  setTimeout(() => {
    _unmount(cached, instance, instance.suspense, true)
    routeCatchKeyMap.delete(name)
    cached = null
  }, 0)

  catchMap.delete(key)
}

export function addRouterMethods(router: Router) {
  router.reload = (option: LocationAsRelativeRaw) => {
    option.name && removeCatch(option.name)
    setTimeout(() => {
      router.push(option)
    }, 0)
  }
  router.close = (option: LocationAsRelativeRaw) => {
    const viewTagsStore = useViewTagsStore()
    removeCatch(viewTagsStore.getCurView!.name)
    // option.name && removeCatch(option.name)

    viewTagsStore.removeTag(viewTagsStore.getCurView as ViewTag, option)
  }
}
