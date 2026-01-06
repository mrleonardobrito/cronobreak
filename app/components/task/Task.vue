<script setup lang="ts">
    interface Props {
        title?: string;
        content?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        title: 'Task',
        content: 'Content'
    });

    const checked = ref<boolean>(false);
    const isOpen = ref<boolean>(false);
    const isSelected = ref<boolean>(false);

    const toggleContent = () => {
        isOpen.value = !isOpen.value;
    };

    const selectTask = () => {
        isSelected.value = true;
    };
</script>

<template>
    <UAccordion v-model="isOpen">
        <UButton 
            variant="ghost" 
            @dblclick.stop="toggleContent"
            @click.stop="selectTask"
            :class="{ 'bg-green-100 dark:bg-green-900': isSelected }"
            class="w-full flex items-center justify-between"
        >
            <div class="flex items-center gap-4">
                <UCheckbox v-model="checked" />
                <h3 class="text-lg font-semibold">{{ props.title }}</h3>
            </div>
            <UButton icon="i-heroicons-pencil-square" variant="ghost" size="sm" />
        </UButton>

        <template #content>
            <div class="p-4">{{ props.content }}</div>
        </template>
    </UAccordion>
</template>