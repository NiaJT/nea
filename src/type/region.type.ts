import type { IApiResponse } from "./auth.type";

export interface IRegion {
  id: number;
  name: string;
}

export type IRegionListResponse = IApiResponse<IRegion[]>;
