import { watch } from 'vue';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { useDiagramStore } from '@/entities/diagram/model/useDiagramStore';

export async function initApp() {
  const authStore = useAuthStore();
  const diagramStore = useDiagramStore();

  await authStore.initAuth();

  watch(
    () => authStore.user,
    async (user) => {
      if (user) {
        await diagramStore.loadDiagrams();
      }
    },
    { immediate: true }
  );
}
