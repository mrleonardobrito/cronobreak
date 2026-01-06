<script setup lang="ts">

const route = useRoute();
const toast = useToast();

const sidebarOpen = ref(false);

const links = [
  [
    {
      label: 'Home',
      icon: 'i-lucide-house',
      to: '/',
    },
  ],
];

const groups = computed(() => [
  {
    id: 'links',
    label: 'Go to',
    items: links.flat(),
  },
  {
    id: 'code',
    label: 'Code',
    items: [
      {
        id: 'source',
        label: 'View page source',
        icon: 'i-simple-icons-github',
        to: `https://github.com/nuxt-ui-templates/dashboard/blob/main/app/pages${route.path === '/' ? '/index' : route.path}.vue`,
        target: '_blank',
      },
    ],
  },
]);

onMounted(async () => {
  const cookie = useCookie('cookie-consent');
  if (cookie.value === 'accepted') {
    return;
  }

  toast.add({
    title: 'We use first-party cookies to enhance your experience on our website.',
    actions: [
      {
        label: 'Accept',
        color: 'gray',
        variant: 'outline',
        click: () => {
          cookie.value = 'accepted';
        },
      },
      {
        label: 'Opt out',
        color: 'gray',
        variant: 'ghost',
      },
    ],
  });
});
</script>

<template>
  <div class="min-h-screen min-w-screen bg-gray-50 dark:bg-gray-900 flex">
    <div class="flex-1 lg:ml-0">
      <div class="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <header class="sticky top-0 z-50 hidden lg:block py-4">
        </header>
        <main>
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.scrollable-card {
  scrollbar-width: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 250ms;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.button {
  box-shadow:
    inset 0.5px 0.5px 1px 0px rgba(255, 255, 255, 0.1),
    inset -0.5px -0.5px 1px 0px rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.2) 0px 3px 10px -5px;
  @apply flex items-center justify-center gap-2 rounded-full text-sm backdrop-blur-sm transition-all;
  &:active {
    @apply scale-95;
  }
}

* {
  scrollbar-color: #555 rgba(0, 0, 0, 0);
}
</style>
