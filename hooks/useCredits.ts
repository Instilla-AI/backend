import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';

interface CreditsData {
  credits: number;
  totalUsed: number;
}

export function useCredits() {
  const { data: session } = useSession();

  return useQuery<CreditsData>({
    queryKey: ['credits', session?.user?.id],
    queryFn: async () => {
      const response = await fetch('/api/credits');
      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }
      return response.json();
    },
    enabled: !!session?.user,
  });
}

export function useAddCredits() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (amount: number) => {
      const response = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) {
        throw new Error('Failed to add credits');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits', session?.user?.id] });
    },
  });
}
