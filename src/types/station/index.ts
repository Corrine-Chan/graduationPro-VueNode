interface RowType {
  name: string;
  id: string;
  city: string;
  fast: string;
  slow: string;
  status: number;
  now: string;
  fault: string;
  person: string;
  tel: string;
}

// 新增站点表单数据类型
interface StationFormData {
  name: string; // 站点名称
  region: string; // 站点地址
  longitude: number; // 经度
  latitude: number; // 纬度
  isActive: boolean; // 立即使用
  remarks: string; // 备注
}

// 新增站点API请求参数
interface CreateStationParams extends StationFormData {
  createTime?: string; // 创建时间
  operator?: string; // 操作员
}

export type { RowType, StationFormData, CreateStationParams };
