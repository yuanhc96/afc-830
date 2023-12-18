<template>
  <div class="pm-tree-node">
      <div>
        <slot name="label"/>
      </div>
      <div class="text-right mr-5 more" style="flex-grow: 1">
        <slot name="more"/>
      </div>
  </div>
</template>