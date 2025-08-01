# 项目备份文件夹

## 📂 文件夹结构

```
backups/
├── types/           # 类型定义文件的历史版本
├── scripts/         # 脚本文件的历史版本
├── components/      # 组件文件的历史版本（待用）
├── docs/           # 文档文件的历史版本（待用）
└── configs/        # 配置文件的历史版本（待用）
```

## 🗂️ 当前备份文件

### types/ - 类型定义备份

| 文件名 | 原始路径 | 备份时间 | 说明 |
|--------|----------|----------|------|
| `Component_v1.ts` | `src/core/types/Component_old.ts` | 2025-08-01 | 旧版组件类型定义，包含简化的区域布局系统 |

**Component_v1.ts 特点**：

- 基于区域（Region）的布局系统
- 简化的响应式配置
- 支持 grid、flex、absolute、flow 布局类型
- 基础的组件实例类型定义

### scripts/ - 脚本文件备份

| 文件名 | 原始路径 | 备份时间 | 说明 |
|--------|----------|----------|------|
| `check-structure_v1.cjs` | `tools/scripts/check-structure-old.cjs` | 2025-08-01 | 旧版项目结构检查脚本，存在递归逻辑问题 |

**check-structure_v1.cjs 特点**：

- 递归目录检查逻辑
- 基础的文件结构验证
- 简单的报告格式
- 存在重复检查问题

## 📋 备份管理规范

### 文件命名规范

- **版本化命名**：`{原文件名}_v{版本号}.{扩展名}`
- **时间戳命名**：`{原文件名}_{YYYY-MM-DD}.{扩展名}`
- **功能标识**：`{原文件名}_{功能描述}.{扩展名}`

### 备份时机

1. **重大重构前**：在进行大规模代码重构之前
2. **版本发布前**：在发布新版本之前
3. **架构变更**：当核心架构发生重大变化时
4. **实验性修改**：在进行实验性功能开发前

### 清理策略

- **保留最近3个版本**的重要文件备份
- **定期清理**（每季度）超过6个月的备份文件
- **保留里程碑版本**的备份（如 v1.0、v2.0 等）

## 🔍 备份文件用途

### 版本对比

```bash
# 对比当前版本与备份版本的差异
diff src/core/types/Component.ts backups/types/Component_v1.ts
```

### 功能回滚

当新功能出现问题时，可以参考备份文件进行快速回滚或修复。

### 历史追踪

了解项目演进历史，学习设计决策的变化过程。

### 代码参考

从旧版本中提取有用的代码片段或设计思路。

## 🚨 注意事项

1. **不要修改备份文件**：备份文件应保持只读状态
2. **定期清理**：避免备份文件夹过度膨胀
3. **文档记录**：每次备份都应在此文档中记录原因和时间
4. **敏感信息**：确保备份文件中不包含敏感配置信息

## 📈 备份历史

### 2025-08-01

- **Component_v1.ts**：重构组件类型系统前的备份，从简单区域布局升级到复杂混入系统
- **check-structure_v1.cjs**：优化结构检查脚本前的备份，解决递归逻辑和性能问题

---

**维护者**：开发团队  
**最后更新**：2025年8月1日  
**版本**：1.0
