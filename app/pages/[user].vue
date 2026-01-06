<script setup lang="ts">

definePageMeta({
  middleware: 'auth'
})

const { session } = useUserSession();
const login = useRoute().params.user as string;
const isMyProfile = computed(() => (session.value?.user as any)?.login === login);

const fetchUser = () => useRequestFetch()(`/api/users/${login}`) as Promise<User>;
const fetchHabits = () => useRequestFetch()(`/api/users/${login}/habits`) as Promise<Habit[]>;
const fetchMyHabits = () => useRequestFetch()('/api/habits') as Promise<Habit[]>;

const { data: user } = useQuery({ key: ['user'], query: fetchUser });
const { data: habits } = useQuery({ key: ['habits'], query: fetchHabits });
const { data: myHabits } = useQuery({
  key: ['my_habits'],
  query: fetchMyHabits,
  enabled: isMyProfile.value,
});

const emptyHabits = computed(() => habits.value?.length === 0);
const emptyMyHabits = computed(() => myHabits.value?.length === 0);
const pageTitle = computed(() => (user.value?.login && user.value?.name ? `${user.value.name} (@${user.value.login}) · Habits and Todos` : 'Page Not Found · Habit'));

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  ogSiteName: pageTitle,
});

type Priority = 'lowest' | 'low' | 'medium' | 'high' | 'highest';
type TimeEstimate = '15m' | '30m' | '1h' | '2h' | '3h' | '4h' | '5h' | '6h' | '7h' | '8h' | '9h' | '10h';
type Status = 'todo' | 'in_progress' | 'done';

type Task = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  estimate: TimeEstimate;
  status: Status;
  parentId?: string;
};

const rawData = ref<Task[]>([
  {
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    priority: 'medium',
    estimate: '1h',
    status: 'todo',
  },
  {
    id: '1.1',
    title: 'Sub Task 1',
    description: 'Sub Task Description 1',
    priority: 'low',
    estimate: '15m',
    status: 'todo',
    parentId: '1',
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Description 2',
    priority: 'medium',
    estimate: '1h',
    status: 'todo',
  },
]);

const expandedRows = ref<Set<string>>(new Set());

const getDepth = (task: Task, allTasks: Task[]): number => {
  if (!task.parentId) return 0;
  const parent = allTasks.find(t => t.id === task.parentId);
  return parent ? getDepth(parent, allTasks) + 1 : 0;
};

const hasSubTasks = (taskId: string): boolean => {
  return rawData.value.some(task => task.parentId === taskId);
};

const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'lowest':
      return 'text-green-500';
    case 'low':
      return 'text-blue-500';
    case 'medium':
      return 'text-green-500';
    case 'high':
      return 'text-yellow-500';
    case 'highest':
      return 'text-red-500';
  }
  return 'text-gray-500';
};

const data = computed(() => {
  const filtered = rawData.value.filter(task => {
    if (task.parentId) {
      return expandedRows.value.has(task.parentId);
    }
    return true;
  });

  const sorted: (Task & { depth: number })[] = [];
  const processed = new Set<string>();

  for (const task of filtered) {
    if (processed.has(task.id)) continue;

    if (!task.parentId) {
      sorted.push({ ...task, depth: 0 });
      processed.add(task.id);

      const subtasks = filtered.filter(t => t.parentId === task.id);
      for (const subtask of subtasks) {
        sorted.push({ ...subtask, depth: getDepth(subtask, rawData.value) });
        processed.add(subtask.id);
      }
    }
  }

  return sorted;
});

const toggleTaskStatus = (task: Task) => {
  task.status = task.status === 'done' ? 'todo' : 'done';
};

const toggleExpand = (taskId: string) => {
  if (expandedRows.value.has(taskId)) {
    expandedRows.value.delete(taskId);
  } else {
    expandedRows.value.add(taskId);
  }
};

const columns = [
  {
    key: 'expand',
    label: '#',
  },
  {
    key: 'status',
    label: '',
  },
  {
    key: 'title',
    label: 'Title',
  },
  {
    key: 'description',
    label: 'Description',
  },
  {
    key: 'priority',
    label: 'Priority',
  },
  {
    key: 'estimate',
    label: 'Estimate',
  },
];

const groupedColumns = computed(() => [
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'title',
    label: 'Title',
  },
]);

</script>

<template>
  <div class="container mx-auto p-6">
    <UTable :rows="data" :columns="columns" :grouped-columns="groupedColumns">
      <template #expand-data="{ row }">
        <div class="flex items-center">
          <span class="inline-block" :style="{ width: `calc(${row.depth * 1.5}rem)` }" />
          <UButton v-if="hasSubTasks(row.id)" variant="ghost" color="primary" size="xs" square
            :icon="expandedRows.has(row.id) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
            @click="toggleExpand(row.id)" />
        </div>
      </template>
      <template #status-data="{ row }">
        <UCheckbox :model-value="row.status === 'done'" @update:model-value="toggleTaskStatus(row)" />
      </template>
      <template #priority-data="{ row }">
        <UBadge :class="getPriorityColor(row.priority)">{{ row.priority }}</UBadge>
      </template>
    </UTable>
  </div>
</template>
