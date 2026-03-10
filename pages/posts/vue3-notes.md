---
title: Vue 3 核心概念与实践笔记
date: 2026-03-09
tags:
  - Vue 3
  - 前端开发
  - Composition API
  - TypeScript
categories:
  - 前端技术
---

# Vue 3 核心概念与实践笔记

Vue 3 作为现代化的前端框架，带来了许多激动人心的改进。本文记录了我学习 Vue 3 过程中的核心概念和实践经验。

## Vue 3 的主要变化

### 1. Composition API

这是 Vue 3 最重要的变化，彻底改变了组件逻辑的组织方式。

**Options API (Vue 2)** - 逻辑分散在不同的 options 中：
```javascript
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() { this.count++ }
  },
  computed: {
    double() { return this.count * 2 }
  }
}
```

**Composition API (Vue 3)** - 逻辑按功能组织在一起：
```javascript
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const double = computed(() => count.value * 2)
    
    function increment() {
      count.value++
    }
    
    return { count, double, increment }
  }
}
```

**优势**：
- 更好的逻辑复用（自定义组合式函数）
- 更灵活的逻辑组织
- 更好的 TypeScript 支持

### 2. 更好的 TypeScript 支持

Vue 3 完全使用 TypeScript 重写，提供了完整的类型定义。

```typescript
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    // count 自动推断为 Ref<number>
    const count = ref(0)
    
    // 明确指定类型
    const title = ref<string>('Vue 3 Notes')
    
    // 响应式对象
    const state = reactive({
      name: 'Vue',
      version: 3
    })
    
    return { count, title, state }
  }
})
```

### 3. 性能优化

- **更小的包体积** - Tree-shaking 支持更好
- **更快的渲染** - 基于 Proxy 的响应式系统
- **更好的内存管理** - 组件实例更轻量

## 核心 API 详解

### ref 和 reactive

`ref` 用于基本类型，`reactive` 用于对象：

```javascript
import { ref, reactive } from 'vue'

// 基本类型使用 ref
const count = ref(0)
console.log(count.value) // 访问值

// 对象使用 reactive
const user = reactive({
  name: 'Alice',
  age: 25
})
console.log(user.name) // 直接访问属性
```

### computed 计算属性

```javascript
import { ref, computed } from 'vue'

const price = ref(100)
const quantity = ref(2)

// 计算总价
const total = computed(() => price.value * quantity.value)

// 带 setter 的计算属性
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue) {
    const [first, last] = newValue.split(' ')
    firstName.value = first
    lastName.value = last
  }
})
```

### watch 和 watchEffect

```javascript
import { ref, watch, watchEffect } from 'vue'

const count = ref(0)
const double = ref(0)

// watch 明确指定要监听的数据源
watch(count, (newValue, oldValue) => {
  console.log(`count changed from ${oldValue} to ${newValue}`)
  double.value = newValue * 2
})

// watchEffect 自动追踪依赖
watchEffect(() => {
  console.log(`count is ${count.value}`)
  // 这里会自动追踪 count.value
})
```

## 组合式函数实践

这是 Composition API 最强大的特性之一。

### 示例：鼠标位置跟踪

```javascript
// useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }
  
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
  
  return { x, y }
}

// 在组件中使用
import { useMouse } from './useMouse'

export default {
  setup() {
    const { x, y } = useMouse()
    return { x, y }
  }
}
```

### 示例：数据获取

```javascript
// useFetch.js
import { ref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  
  async function fetchData() {
    loading.value = true
    try {
      const response = await fetch(url)
      data.value = await response.json()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  
  watchEffect(() => {
    fetchData()
  })
  
  return { data, error, loading, refetch: fetchData }
}
```

## Vue 3 与 TypeScript 深度集成

### 定义 Props 类型

```typescript
import { defineComponent, PropType } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export default defineComponent({
  props: {
    // 基本类型
    title: {
      type: String,
      required: true
    },
    // 使用 PropType 定义复杂类型
    user: {
      type: Object as PropType<User>,
      required: true
    },
    // 数组类型
    tags: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  },
  setup(props) {
    // props 有完整的类型推断
    console.log(props.title.toUpperCase())
    console.log(props.user.name)
    
    return {}
  }
})
```

### 定义 Emits 类型

```typescript
export default defineComponent({
  emits: {
    // 无参数事件
    'close': null,
    // 带参数事件
    'update:title': (title: string) => {
      // 验证参数
      return title.length > 0
    },
    // 多个参数
    'submit': (payload: { email: string, password: string }) => {
      return payload.email.includes('@')
    }
  },
  setup(props, { emit }) {
    function handleSubmit() {
      emit('submit', { email: 'test@example.com', password: '123456' })
    }
    
    return { handleSubmit }
  }
})
```

## 实战：TodoList 应用

```vue
<template>
  <div class="todo-app">
    <h1>Vue 3 Todo List</h1>
    
    <form @submit.prevent="addTodo">
      <input 
        v-model="newTodo" 
        placeholder="What needs to be done?"
        @keyup.enter="addTodo"
      />
      <button type="submit">Add</button>
    </form>
    
    <ul>
      <li v-for="todo in filteredTodos" :key="todo.id">
        <input 
          type="checkbox" 
          v-model="todo.completed"
        />
        <span :class="{ completed: todo.completed }">
          {{ todo.text }}
        </span>
        <button @click="removeTodo(todo.id)">×</button>
      </li>
    </ul>
    
    <div class="filters">
      <button 
        @click="filter = 'all'"
        :class="{ active: filter === 'all' }"
      >
        All ({{ todos.length }})
      </button>
      <button 
        @click="filter = 'active'"
        :class="{ active: filter === 'active' }"
      >
        Active ({{ activeTodos.length }})
      </button>
      <button 
        @click="filter = 'completed'"
        :class="{ active: filter === 'completed' }"
      >
        Completed ({{ completedTodos.length }})
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default defineComponent({
  name: 'TodoApp',
  
  setup() {
    const todos = ref<Todo[]>([
      { id: 1, text: 'Learn Vue 3', completed: true },
      { id: 2, text: 'Build a blog', completed: false },
      { id: 3, text: 'Write documentation', completed: false }
    ])
    
    const newTodo = ref('')
    const filter = ref<'all' | 'active' | 'completed'>('all')
    
    // 计算属性
    const activeTodos = computed(() => 
      todos.value.filter(todo => !todo.completed)
    )
    
    const completedTodos = computed(() => 
      todos.value.filter(todo => todo.completed)
    )
    
    const filteredTodos = computed(() => {
      switch (filter.value) {
        case 'active': return activeTodos.value
        case 'completed': return completedTodos.value
        default: return todos.value
      }
    })
    
    // 方法
    function addTodo() {
      if (!newTodo.value.trim()) return
      
      todos.value.push({
        id: Date.now(),
        text: newTodo.value,
        completed: false
      })
      
      newTodo.value = ''
    }
    
    function removeTodo(id: number) {
      todos.value = todos.value.filter(todo => todo.id !== id)
    }
    
    return {
      todos,
      newTodo,
      filter,
      activeTodos,
      completedTodos,
      filteredTodos,
      addTodo,
      removeTodo
    }
  }
})
</script>

<style scoped>
.todo-app {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.completed {
  text-decoration: line-through;
  color: #888;
}

.filters button.active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
```

## 常见问题与解决方案

### 1. 响应式数据丢失

```javascript
// 错误：直接解构会失去响应性
const { x, y } = useMouse()

// 正确：使用 toRefs 保持响应性
import { toRefs } from 'vue'
const mouse = useMouse()
const { x, y } = toRefs(mouse)
```

### 2. 异步组件加载

```javascript
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
)

// 带加载状态
const AsyncComponentWithLoading = defineAsyncComponent({
  loader: () => import('./HeavyComponent.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200, // 延迟显示 loading
  timeout: 3000 // 超时时间
})
```

### 3. 自定义指令

```javascript
// 全局指令
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

// 局部指令
export default {
  directives: {
    highlight: {
      mounted(el, binding) {
        el.style.backgroundColor = binding.value || 'yellow'
      },
      updated(el, binding) {
        el.style.backgroundColor = binding.value || 'yellow'
      }
    }
  }
}
```

## 学习资源推荐

### 官方资源
- [Vue 3 官方文档](https://v3.vuejs.org/) - 最权威的学习资料
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/) - 从 Vue 2 迁移指南
- [Vue 3 Composition API RFC](https://composition-api.vuejs.org/) - 设计理念详解

### 实践项目
- [Vue 3 TodoMVC](https://github.com/vuejs/vue-todomvc) - 经典 Todo 应用实现
- [Vue 3 + TypeScript 示例](https://github.com/vuejs/vue-next-webpack-preview) - 配置示例
- [Vue 3 组件库](https://github.com/antfu/vueuse) - VueUse 工具库

### 社区资源
- [Vue Mastery](https://www.vuemastery.com/) - 视频课程
- [Vue School](https://vueschool.io/) - 互动教程
- [Vue.js Developers](https://vuejsdevelopers.com/) - 博客文章

## 总结

Vue 3 不仅仅是 Vue 2 的升级版，更是前端开发理念的革新。Composition API 的引入让代码组织更加灵活，TypeScript 的深度集成提升了开发体验，性能优化让应用更加高效。

学习建议：
1. **循序渐进** - 先掌握 Options API，再学习 Composition API
2. **实践为王** - 多写代码，少看理论
3. **善用工具** - VS Code + Volar 插件提供完美支持
4. **关注社区** - Vue 3 生态正在快速发展

> "Any application that can be written in JavaScript, will eventually be written in JavaScript." - Jeff Atwood

期待看到更多基于 Vue 3 的优秀应用诞生！

---

**下一步学习计划**：
- [ ] 深入学习 Vue Router 4
- [ ] 掌握 Pinia 状态管理
- [ ] 探索 Vite 高级配置
- [ ] 学习服务端渲染 (SSR)