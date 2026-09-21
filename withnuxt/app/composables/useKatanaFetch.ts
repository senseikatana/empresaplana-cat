import type { FetchOptions } from "ofetch";

interface UseKatanaFetchOptions<T> extends FetchOptions {
	key?: string;
	transform?: (data: unknown) => T;
}

export function useKatanaFetch<T = unknown>(
	url: string,
	options: UseKatanaFetchOptions<T> = {},
) {
	const { key, transform, ...fetchOptions } = options;

	return useFetch<T>(url, {
		key: key ?? url,
		...fetchOptions,
		$fetch: useNuxtApp().$api as typeof $fetch,
		transform: transform as any,
	});
}
