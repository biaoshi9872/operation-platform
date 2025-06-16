<template>
    <div class="container">
        <!--第一级--->
        <div class="header">
            <div class="item1">一级</div>
            <div class="item2">二级</div>
            <div class="item3">功能</div>
        </div>
        <div class="content">
            <div class="content_item" v-for="(item, index) in data.treeList" :key="index">
                <div>
                    {{ item.name }}
                </div>
                <div class="content_item_child1">
                    <div v-for="(child, index) in item.children" :key="index">
                        {{ child.name }}
                    </div>
                </div>
                <div class="">
                    <div v-for="(child, index) in item.children" :key="index">
                        <div class="content_item_three">
                            <div v-for="(child1, index) in child.children">
                                {{ child1.name }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
