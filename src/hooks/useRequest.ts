import { useRequest as originUseRequest } from 'ahooks';
import type { Options } from 'ahooks/lib/useRequest/src/types';
import type { ResponseStructure } from '@/utils/request';

function useRequest<TData, TParams extends any[]>(
  service: (...args: TParams) => Promise<ResponseStructure<TData>>,
  options?: Options<TData, TParams>,
) {
  const newService = (...args: TParams) => service(...args).then((data) => data.data);
  return originUseRequest(newService, options);
}

export default useRequest;
