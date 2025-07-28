// ===========================
// Base Types - 基础类型定义
// ===========================

/**
 * 基础实体接口 - 通用字段
 * 所有需要版本管理的实体都应继承此接口
 */
export interface BaseEntity {
    id: string                   // 唯一标识
    name: string                 // 名称
    description?: string         // 描述
    version: string              // 版本
}