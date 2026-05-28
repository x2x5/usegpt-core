import Database from 'better-sqlite3'

const db = new Database('./local.db')

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    prompt_content TEXT NOT NULL,
    keywords TEXT,
    category_id INTEGER,
    author_name TEXT DEFAULT 'Anonymous',
    author_avatar TEXT,
    suitable_models TEXT,
    usage_instructions TEXT,
    example_input TEXT,
    example_output TEXT,
    variables TEXT,
    like_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    copy_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'approved',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );
`)

// Seed categories
const insertCategory = db.prepare(
  'INSERT OR IGNORE INTO categories (name, slug, icon, sort_order) VALUES (?, ?, ?, ?)'
)

const categories = [
  ['写作', 'writing', '✍️', 1],
  ['营销', 'marketing', '📢', 2],
  ['学习', 'learning', '📚', 3],
  ['编程', 'coding', '💻', 4],
  ['商务', 'business', '💼', 5],
  ['翻译', 'translation', '🌐', 6],
  ['图片生成', 'image-gen', '🎨', 7],
  ['视频脚本', 'video-script', '🎬', 8],
  ['生活效率', 'productivity', '⚡', 9],
  ['求职', 'job-search', '🎯', 10],
  ['角色扮演', 'roleplay', '🎭', 11],
  ['其他', 'other', '📦', 12],
]

for (const [name, slug, icon, sortOrder] of categories) {
  insertCategory.run(name, slug, icon, sortOrder)
}

// Seed skills
const insertSkill = db.prepare(`
  INSERT INTO skills (title, description, prompt_content, keywords, category_id, author_name, suitable_models, usage_instructions, example_input, example_output, variables, like_count, favorite_count, comment_count, copy_count, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ?))
`)

const skills = [
  {
    title: '小红书爆款标题生成器',
    description: '根据产品卖点生成 20 个小红书风格标题，适合种草、探店、课程推广。',
    prompt: `你是一个资深小红书运营专家。请根据我提供的产品信息，生成 20 个小红书爆款标题。

要求：
1. 标题要有点击欲望
2. 不要夸张虚假
3. 每个标题不超过 25 字
4. 使用 emoji 增加吸引力
5. 输出为表格格式

产品信息：
{{产品信息}}`,
    keywords: ['小红书', '标题', '营销', '种草'],
    categoryId: 2,
    authorName: '小红书达人',
    models: ['ChatGPT', 'Claude', 'Gemini'],
    usage: '替换「产品信息」为你要推广的产品描述，即可生成 20 个标题。',
    exampleInput: '一款便携式咖啡杯，316不锈钢，保温12小时，售价89元',
    exampleOutput: '1. ☕ 这杯子让我戒掉了星巴克！保温12h还只要89\n2. 🏃‍♀️ 通勤党必入！这款咖啡杯太能打了...',
    variables: [{ name: '产品信息', placeholder: '请输入你的产品描述', label: '产品信息' }],
    likes: 128, favorites: 56, comments: 24, copies: 312, daysAgo: '-2 days',
  },
  {
    title: '周报生成器',
    description: '根据本周工作内容，自动生成结构清晰、重点突出的周报。',
    prompt: `你是一个职场写作助手。请根据我提供的本周工作内容，生成一份专业的周报。

格式要求：
## 本周工作总结
- 列出完成的主要工作（按重要性排序）

## 关键成果
- 用数据量化成果

## 遇到的问题
- 简要说明问题和解决方案

## 下周计划
- 列出下周重点任务

本周工作内容：
{{工作内容}}`,
    keywords: ['周报', '职场', '写作', '汇报'],
    categoryId: 1,
    authorName: '职场效率王',
    models: ['ChatGPT', 'Claude'],
    usage: '将「工作内容」替换为你本周做的事情，越详细生成的周报越好。',
    exampleInput: '完成了用户登录模块开发，修复了3个bug，参加了2次需求评审',
    exampleOutput: '## 本周工作总结\n- 完成用户登录模块开发并上线\n- 修复3个线上bug...',
    variables: [{ name: '工作内容', placeholder: '描述你本周做了什么', label: '工作内容' }],
    likes: 256, favorites: 120, comments: 45, copies: 890, daysAgo: '-5 days',
  },
  {
    title: '英语语法纠错助手',
    description: '检查英文文本的语法错误，并提供修改建议和解释。',
    prompt: `You are an English grammar expert. Please check the following English text for grammar errors, spelling mistakes, and awkward phrasing.

For each error found:
1. Show the original text
2. Provide the corrected version
3. Explain why it was wrong

Then provide the fully corrected text at the end.

Text to check:
{{英文文本}}`,
    keywords: ['英语', '语法', '翻译', '学习'],
    categoryId: 6,
    authorName: 'English Pro',
    models: ['ChatGPT', 'Claude', 'Gemini'],
    usage: '粘贴你需要检查的英文文本即可。',
    exampleInput: 'He go to school yesterday and buyed a book.',
    exampleOutput: '1. "go" → "went" (past tense required)\n2. "buyed" → "bought" (irregular verb)...',
    variables: [{ name: '英文文本', placeholder: 'Paste your English text here', label: 'English Text' }],
    likes: 89, favorites: 45, comments: 12, copies: 234, daysAgo: '-1 days',
  },
  {
    title: 'Python 代码优化顾问',
    description: '分析 Python 代码，提供性能优化、可读性改进和最佳实践建议。',
    prompt: `你是一个资深 Python 开发者。请分析以下 Python 代码，提供优化建议：

1. 性能优化：找出可以提升性能的地方
2. 可读性改进：让代码更 Pythonic
3. 最佳实践：符合 PEP8 和社区惯例
4. 潜在 bug：指出可能的问题

请逐条说明，并给出优化后的完整代码。

代码：
{{Python代码}}`,
    keywords: ['Python', '代码优化', '编程', '性能'],
    categoryId: 4,
    authorName: 'Pythonista',
    models: ['ChatGPT', 'Claude'],
    usage: '粘贴你的 Python 代码，获取优化建议和改进版本。',
    exampleInput: 'def f(x):\n  return x*2',
    exampleOutput: '## 优化建议\n1. 函数名 `f` 不够描述性，建议改为 `double_value`\n2. 添加类型注解...',
    variables: [{ name: 'Python代码', placeholder: 'Paste your Python code here', label: 'Python Code' }],
    likes: 167, favorites: 89, comments: 34, copies: 456, daysAgo: '-3 days',
  },
  {
    title: 'Midjourney 提示词生成器',
    description: '根据中文描述，生成高质量的 Midjourney 英文提示词。',
    prompt: `你是一个 Midjourney 提示词专家。请根据我提供的中文描述，生成一个高质量的 Midjourney 提示词。

提示词结构：
1. 主体描述（英文）
2. 风格描述
3. 光线和氛围
4. 技术参数（--ar, --v, --q 等）

要求：
- 使用英文
- 包含适当的风格关键词
- 添加合适的参数

中文描述：
{{中文描述}}`,
    keywords: ['Midjourney', 'AI绘画', '提示词', '图片生成'],
    categoryId: 7,
    authorName: 'AI画家',
    models: ['ChatGPT', 'Claude'],
    usage: '用中文描述你想要的画面，系统会生成 Midjourney 提示词。',
    exampleInput: '一只在星空下弹钢琴的猫，梦幻风格',
    exampleOutput: 'A cat playing piano under a starry night sky, dreamy atmosphere, soft moonlight, ethereal glow, fantasy art style --ar 16:9 --v 6 --q 2',
    variables: [{ name: '中文描述', placeholder: '描述你想要的画面', label: '画面描述' }],
    likes: 342, favorites: 178, comments: 67, copies: 890, daysAgo: '-1 days',
  },
  {
    title: '面试问题模拟器',
    description: '模拟面试场景，根据岗位生成常见面试问题和参考答案。',
    prompt: `你是一个资深HR和面试教练。请根据我申请的岗位，生成 10 个常见面试问题及参考答案。

每个问题包括：
1. 问题本身
2. 考察点
3. 参考回答框架
4. 注意事项

岗位信息：
{{岗位信息}}`,
    keywords: ['面试', '求职', 'HR', '职业'],
    categoryId: 10,
    authorName: '求职导师',
    models: ['ChatGPT', 'Claude', 'Gemini'],
    usage: '填写你要面试的岗位信息，获取针对性的面试准备。',
    exampleInput: '前端开发工程师，3年经验，React方向',
    exampleOutput: '## 问题1：请介绍一下你最复杂的React项目\n**考察点：** 技术深度、项目经验、表达能力\n**回答框架：** STAR法则...',
    variables: [{ name: '岗位信息', placeholder: '例如：前端开发工程师，3年经验', label: '岗位信息' }],
    likes: 198, favorites: 134, comments: 56, copies: 678, daysAgo: '-4 days',
  },
  {
    title: '视频脚本生成器',
    description: '根据主题生成短视频脚本，包含开头钩子、内容结构和结尾引导。',
    prompt: `你是一个短视频内容策划专家。请根据我提供的主题，生成一个短视频脚本。

脚本格式：
## 开头钩子（前3秒）
- 吸引观众的话术

## 内容主体
- 分点讲述，每点15-20秒

## 结尾引导
- 总结 + 互动引导

视频时长：{{时长}}分钟
主题：{{主题}}`,
    keywords: ['视频脚本', '短视频', '内容创作', '抖音'],
    categoryId: 8,
    authorName: '短视频达人',
    models: ['ChatGPT', 'Claude'],
    usage: '填写主题和时长，获取完整的视频脚本。',
    exampleInput: '主题：如何3天学会Python，时长：2分钟',
    exampleOutput: '## 开头钩子\n"3天学会Python？别急着划走，我来告诉你怎么做！"\n\n## 内容主体\n1. 第一天：环境搭建和基础语法...',
    variables: [
      { name: '主题', placeholder: '视频要讲什么', label: '主题' },
      { name: '时长', placeholder: '视频时长（分钟）', label: '时长', defaultValue: '2' },
    ],
    likes: 156, favorites: 78, comments: 34, copies: 456, daysAgo: '-6 days',
  },
  {
    title: '英文邮件润色助手',
    description: '将中文邮件翻译成地道的商务英文邮件，保持专业语气。',
    prompt: `你是一个商务英语写作专家。请将以下中文邮件翻译成专业的英文邮件。

要求：
1. 使用正式但友好的商务语气
2. 符合英文邮件格式规范
3. 保持原意但更地道
4. 如有不确定的地方，提供多个版本

中文邮件：
{{中文邮件}}`,
    keywords: ['英文邮件', '商务英语', '翻译', '职场'],
    categoryId: 6,
    authorName: '商务英语专家',
    models: ['ChatGPT', 'Claude', 'Gemini'],
    usage: '粘贴你的中文邮件内容，获取专业的英文版本。',
    exampleInput: '王总您好，附件是本周的项目进度报告，请查收。如有问题请随时联系我。',
    exampleOutput: 'Dear Mr. Wang,\n\nPlease find attached this week\'s project progress report for your review. Should you have any questions, please don\'t hesitate to reach out.\n\nBest regards,',
    variables: [{ name: '中文邮件', placeholder: '粘贴你的中文邮件', label: '中文邮件' }],
    likes: 234, favorites: 145, comments: 45, copies: 567, daysAgo: '-2 days',
  },
  {
    title: '产品需求文档助手',
    description: '根据产品想法，生成结构化的 PRD 文档框架。',
    prompt: `你是一个产品经理专家。请根据我的产品想法，生成一份结构化的 PRD 文档框架。

PRD 结构：
1. 产品概述
2. 目标用户
3. 核心功能
4. 用户故事
5. 功能优先级
6. 技术要求
7. 成功指标

产品想法：
{{产品想法}}`,
    keywords: ['PRD', '产品经理', '需求文档', '产品设计'],
    categoryId: 5,
    authorName: '产品老司机',
    models: ['ChatGPT', 'Claude'],
    usage: '描述你的产品想法，获取结构化的 PRD 框架。',
    exampleInput: '一个帮用户养成喝水习惯的App，每天提醒喝水并记录饮水量',
    exampleOutput: '# 喝水助手 App PRD\n\n## 1. 产品概述\n一款帮助用户养成健康饮水习惯的移动应用...\n\n## 2. 目标用户\n- 忙碌的上班族\n- 健身爱好者...',
    variables: [{ name: '产品想法', placeholder: '描述你的产品想法', label: '产品想法' }],
    likes: 189, favorites: 98, comments: 34, copies: 345, daysAgo: '-7 days',
  },
  {
    title: '正则表达式生成器',
    description: '根据自然语言描述，生成对应的正则表达式并解释。',
    prompt: `你是一个正则表达式专家。请根据我的描述，生成对应的正则表达式。

输出格式：
1. 正则表达式
2. 逐部分解释
3. 匹配示例
4. 不匹配示例
5. 常见编程语言的使用代码

描述：
{{正则描述}}`,
    keywords: ['正则表达式', '编程', 'regex', '开发'],
    categoryId: 4,
    authorName: 'Regex Master',
    models: ['ChatGPT', 'Claude'],
    usage: '用自然语言描述你要匹配的模式，获取正则表达式。',
    exampleInput: '匹配中国大陆手机号码',
    exampleOutput: '正则：`^1[3-9]\\d{9}$`\n\n解释：\n- `^1` 以1开头\n- `[3-9]` 第二位是3-9\n- `\\d{9}` 后面9位数字...',
    variables: [{ name: '正则描述', placeholder: '描述你要匹配的内容', label: '正则描述' }],
    likes: 278, favorites: 167, comments: 56, copies: 789, daysAgo: '-3 days',
  },
  {
    title: '每日健身计划生成器',
    description: '根据个人情况生成每日健身计划，包含动作、组数和注意事项。',
    prompt: `你是一个专业健身教练。请根据我的个人信息，生成今日健身计划。

计划包括：
1. 热身（5-10分钟）
2. 主要训练（30-45分钟）
3. 拉伸放松（5-10分钟）

每个动作包含：
- 动作名称
- 组数和次数
- 注意事项

个人信息：
{{个人信息}}`,
    keywords: ['健身', '运动', '计划', '生活'],
    categoryId: 9,
    authorName: '健身教练',
    models: ['ChatGPT', 'Claude', 'Gemini'],
    usage: '填写你的健身目标和条件，获取个性化健身计划。',
    exampleInput: '男性，25岁，想增肌，有哑铃和瑜伽垫，在家锻炼',
    exampleOutput: '## 热身\n1. 开合跳 30秒\n2. 手臂环绕 20次\n\n## 主要训练\n1. 哑铃深蹲 4组x12次\n   - 注意：膝盖不要超过脚尖...',
    variables: [{ name: '个人信息', placeholder: '年龄、性别、健身目标、可用器材', label: '个人信息' }],
    likes: 145, favorites: 89, comments: 23, copies: 234, daysAgo: '-1 days',
  },
  {
    title: 'SQL 查询生成器',
    description: '根据自然语言描述，生成 SQL 查询语句。',
    prompt: `你是一个 SQL 专家。请根据我的自然语言描述，生成对应的 SQL 查询语句。

要求：
1. 使用标准 SQL 语法
2. 添加注释说明
3. 考虑性能优化
4. 如果涉及多表，使用 JOIN

数据库表结构：
{{表结构}}

查询需求：
{{查询需求}}`,
    keywords: ['SQL', '数据库', '编程', '查询'],
    categoryId: 4,
    authorName: 'DBA老手',
    models: ['ChatGPT', 'Claude'],
    usage: '提供表结构和查询需求，获取 SQL 语句。',
    exampleInput: '表：users(id, name, email, created_at)\n需求：查找最近7天注册的用户数量',
    exampleOutput: '```sql\n-- 查找最近7天注册的用户数量\nSELECT COUNT(*) AS user_count\nFROM users\nWHERE created_at >= datetime(\'now\', \'-7 days\');\n```',
    variables: [
      { name: '表结构', placeholder: '描述你的数据库表结构', label: '表结构' },
      { name: '查询需求', placeholder: '描述你想查询什么', label: '查询需求' },
    ],
    likes: 198, favorites: 112, comments: 45, copies: 567, daysAgo: '-4 days',
  },
  {
    title: '朋友圈文案生成器',
    description: '根据场景和心情，生成适合发朋友圈的文案。',
    prompt: `你是一个朋友圈文案高手。请根据我描述的场景和心情，生成 5 条朋友圈文案。

风格要求：
1. 简短有力，不超过 50 字
2. 有趣不油腻
3. 适当使用 emoji
4. 符合当下流行语境

场景和心情：
{{场景描述}}`,
    keywords: ['朋友圈', '文案', '社交', '生活'],
    categoryId: 1,
    authorName: '文案小能手',
    models: ['ChatGPT', 'Claude', 'Gemini'],
    usage: '描述你的场景和心情，获取朋友圈文案。',
    exampleInput: '周末去了海边，天气很好，心情放松',
    exampleOutput: '1. 🌊 海风一吹，烦恼全没\n2. 今日份的快乐，由大海赞助 🏖️\n3. 周末正确打开方式：海边躺平 ☀️...',
    variables: [{ name: '场景描述', placeholder: '描述你的场景和心情', label: '场景描述' }],
    likes: 312, favorites: 189, comments: 78, copies: 901, daysAgo: '-1 days',
  },
  {
    title: '代码审查助手',
    description: '对代码进行审查，找出潜在问题并提供改进建议。',
    prompt: `你是一个资深代码审查者。请审查以下代码，关注：

1. 安全性问题
2. 性能问题
3. 可维护性
4. 代码规范
5. 潜在 bug

对每个问题：
- 指出具体位置
- 说明问题
- 提供修复建议

代码语言：{{语言}}
代码：
{{代码}}`,
    keywords: ['代码审查', 'Code Review', '编程', '质量'],
    categoryId: 4,
    authorName: '代码审查官',
    models: ['ChatGPT', 'Claude'],
    usage: '选择编程语言，粘贴代码，获取审查报告。',
    exampleInput: '语言：JavaScript\n代码：eval(userInput)',
    exampleOutput: '## 🔴 严重问题\n1. **安全漏洞：eval() 使用**\n   - 位置：第1行\n   - 问题：eval() 可执行任意代码，存在代码注入风险\n   - 修复：使用 JSON.parse() 或安全的替代方案...',
    variables: [
      { name: '语言', placeholder: '编程语言', label: '语言', defaultValue: 'JavaScript' },
      { name: '代码', placeholder: '粘贴你的代码', label: '代码' },
    ],
    likes: 234, favorites: 134, comments: 56, copies: 456, daysAgo: '-5 days',
  },
  {
    title: '角色扮演：苏格拉底',
    description: '扮演苏格拉底，用提问的方式引导你深入思考问题。',
    prompt: `你现在是古希腊哲学家苏格拉底。你的任务是通过提问来帮助我深入思考问题。

规则：
1. 不要直接给答案
2. 通过层层追问引导我思考
3. 每次回复只问 1-2 个问题
4. 使用苏格拉底式的反诘法
5. 语气温和但深刻

我想思考的问题是：
{{问题}}`,
    keywords: ['角色扮演', '哲学', '思考', '苏格拉底'],
    categoryId: 11,
    authorName: '哲学爱好者',
    models: ['ChatGPT', 'Claude'],
    usage: '提出你想深入思考的问题，苏格拉底会用提问引导你。',
    exampleInput: '什么是幸福？',
    exampleOutput: '亲爱的朋友，你问什么是幸福。那么请告诉我，当你感到幸福的时候，那是一种什么样的感觉呢？是内心的平静，还是某种激动？',
    variables: [{ name: '问题', placeholder: '你想思考什么问题？', label: '问题' }],
    likes: 178, favorites: 89, comments: 45, copies: 234, daysAgo: '-8 days',
  },
]

for (const s of skills) {
  insertSkill.run(
    s.title,
    s.description,
    s.prompt,
    JSON.stringify(s.keywords),
    s.categoryId,
    s.authorName,
    JSON.stringify(s.models),
    s.usage,
    s.exampleInput,
    s.exampleOutput,
    JSON.stringify(s.variables),
    s.likes,
    s.favorites,
    s.comments,
    s.copies,
    s.daysAgo,
  )
}

console.log(`Seeded ${categories.length} categories and ${skills.length} skills.`)
db.close()
