var isArray = Array.isArray
var _toString = Object.prototype.toString
function isRegExp(v) {
    return _toString.call(v) === '[object RegExp]'
}
function matches(pattern, name) {
      if (isArray(pattern)) {
          return pattern.indexOf(name) > -1;
      }
      else if (typeof pattern === 'string') {
          return pattern.split(',').indexOf(name) > -1;
      }
      else if (isRegExp(pattern)) {
          return pattern.test(name);
      }
      /* istanbul ignore next */
      return false;
  }
function isAsyncPlaceholder(node) {
  // @ts-expect-error not really boolean type
  return node.isComment && node.asyncFactory;
}

function getFirstComponentChild(children) {
  if (isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c;
      }
    }
  }
}
function isDef(v) {
  return v !== undefined && v !== null;
}
function isTrue(v) {
  return v === true;
}
function isFalse(v) {
  return v === false;
}
function remove$2(arr, item) {
  var len = arr.length;
  if (len) {
    // fast path for the only / last item
    if (item === arr[len - 1]) {
      arr.length = len - 1;
      return;
    }
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

function pruneCache(keepAliveInstance, filter) {
    const cache = keepAliveInstance.cache
    const keys = keepAliveInstance.keys
    const _vnode = keepAliveInstance._vnode
    for (var key in cache) {
        var entry = cache[key]
        if (entry) {
            var name_1 = entry.name
            if (name_1 && !filter(name_1)) {
                pruneCacheEntry(cache, key, keys, _vnode)
            }
        }
    }
}
function pruneCacheEntry(cache, key, keys, current) {
  var entry = cache[key];
  if (entry && (!current || entry.tag !== current.tag)) {
    // @ts-expect-error can be undefined
    entry.componentInstance.$destroy()
  }
  cache[key] = null;
  remove$2(keys, key);
}
function _getComponentName(opts) {
  return opts && (getComponentName(opts.Ctor.options) || opts.tag);
}
function getComponentName(options) {
  return options.name || options.__name || options._componentTag;
}
export default {
  name: 'pm-keep-alive',
  abstract: true,
  props: {
    include: Object,
    exclude: Object,
    cacheKeys: Object,
    autoClear: {
      type: Boolean,
      default: false,
    },
    max: [String, Number],
  },
  methods: {
    cacheVNode() {
      var cache = this.cache,
        keys = this.keys,
        vnodeToCache = this.vnodeToCache,
        keyToCache = this.keyToCache;
      if (vnodeToCache) {
        var tag = vnodeToCache.tag,
          componentInstance = vnodeToCache.componentInstance,
          componentOptions = vnodeToCache.componentOptions;
        cache[keyToCache] = {
          name: _getComponentName(componentOptions),
          tag: tag,
          componentInstance: componentInstance,
        };
        keys.push(keyToCache);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
        this.vnodeToCache = null;
      }
    },
  },
  created() {
    this.cache = Object.create(null);
    this.keys = [];
  },
  destroyed() {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },
  mounted() {
    var _this = this
    this.cacheVNode()
    this.$watch("include", (val) => {
      pruneCache(this, (name)=> {
        return matches(val, name);
      });
    });
    this.$watch("exclude",  (val) =>{
      pruneCache(this,  (name)=> {
        return !matches(val, name);
      });
    });
    if (this.autoClear) {
      this.$watch("cacheKeys", (cacheKeys) => {
        Object.keys(this.cache).forEach((key)=> {
          if (!cacheKeys.includes(key)) {
            pruneCacheEntry(this.cache, key, this.keys);
          }
        });
      });
    }
  },
  updated () {
    this.cacheVNode();
  },
  render() {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name_2 = _getComponentName(componentOptions);
      var _a = this,
        include = _a.include,
        exclude = _a.exclude,
        cacheKeys = _a.cacheKeys,
        autoClear = _a.autoClear;
      if (
        // not included
        (include && (!name_2 || !matches(include, name_2))) ||
        // excluded
        (exclude && name_2 && matches(exclude, name_2))
      ) {
        return vnode;
      }
      var _b = this,
        cache = _b.cache,
        keys = _b.keys;
      var key =
        vnode.key == null
          ? // same constructor may get registered as different local components
            // so cid alone is not enough (#3269)
            componentOptions.Ctor.cid +
            (componentOptions.tag ? "::".concat(componentOptions.tag) : "")
          : vnode.key;
      if (!autoClear || cacheKeys.includes(key)) {
        if (cache[key]) {
          vnode.componentInstance = cache[key].componentInstance;
          // make current key freshest
          remove$2(keys, key);
          keys.push(key);
        } else {
          // delay setting the cache until update
          this.vnodeToCache = vnode;
          this.keyToCache = key;
        }
      }
      // @ts-expect-error can vnode.data can be undefined
      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0]);
  },
};