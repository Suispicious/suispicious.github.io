import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useQueryClient } from "@tanstack/react-query";

export function useGame(id) {
    const queryKey = [];
    const queryClient = useQueryClient();
    const invalidate = async () => {
        await queryClient.invalidateQueries({ queryKey });
    };

    const response = useSuiClientQuery(id, 
        {
            id,
            options: { showType: true, showContent: true },
        }, {});

    return [undefined, invalidate];
}
