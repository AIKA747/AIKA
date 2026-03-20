/**
 * GameResult
 */
export interface GameResult {
  /**
   * 图片，图片url
   */
  cover: string;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 创建人id
   */
  creator?: number;
  /**
   * 数据版本，每更新一次+1
   */
  dataVersion: number;
  /**
   * 是否删除：0否，1是
   */
  deleted: boolean;
  /**
   * 描述，建议使用markdown语法
   */
  description: string;
  gameId: number;
  /**
   * id，主键id
   */
  id: string;
  /**
   * 摘要
   */
  summary: string;
  /**
   * 更新时间
   */
  updatedAt: Date;
  /**
   * 更新人
   */
  updater?: number;
}
