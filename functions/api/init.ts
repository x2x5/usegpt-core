import type { Env } from '../env'

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  github_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  prompt_content TEXT NOT NULL,
  keywords TEXT,
  category_id INTEGER,
  user_id INTEGER REFERENCES users(id),
  suitable_models TEXT,
  usage_instructions TEXT,
  example_input TEXT,
  example_output TEXT,
  variables TEXT,
  like_count INTEGER DEFAULT 0,
  dislike_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  copy_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS reactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  skill_id INTEGER NOT NULL REFERENCES skills(id),
  type TEXT NOT NULL CHECK(type IN ('like', 'dislike')),
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  skill_id INTEGER NOT NULL REFERENCES skills(id),
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
`

const SEED_CATEGORIES = [
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

const SEED_SKILLS = [
  {
    title: '小红书爆款标题生成器',
    description: '根据产品卖点生成 20 个小红书风格标题，适合种草、探店、课程推广。',
    prompt: '你是一个资深小红书运营专家。请根据我提供的产品信息，生成 20 个小红书爆款标题。\n\n要求：\n1. 标题要有点击欲望\n2. 不要夸张虚假\n3. 每个标题不超过 25 字\n4. 使用 emoji 增加吸引力\n5. 输出为表格格式\n\n产品信息：\n{{产品信息}}',
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
    prompt: '你是一个职场写作助手。请根据我提供的本周工作内容，生成一份专业的周报。\n\n格式要求：\n## 本周工作总结\n- 列出完成的主要工作\n\n## 关键成果\n- 用数据量化成果\n\n## 遇到的问题\n- 简要说明问题和解决方案\n\n## 下周计划\n- 列出下周重点任务\n\n本周工作内容：\n{{工作内容}}',
    keywords: ['周报', '职场', '写作', '汇报'],
    categoryId: 1,
    authorName: '职场效率王',
    models: ['ChatGPT', 'Claude'],
    usage: '将「工作内容」替换为你本周做的事情。',
    exampleInput: '完成了用户登录模块开发，修复了3个bug',
    exampleOutput: '## 本周工作总结\n- 完成用户登录模块开发并上线',
    variables: [{ name: '工作内容', placeholder: '描述你本周做了什么', label: '工作内容' }],
    likes: 256, favorites: 120, comments: 45, copies: 890, daysAgo: '-5 days',
  },
  {
    title: 'Midjourney 提示词生成器',
    description: '根据中文描述，生成高质量的 Midjourney 英文提示词。',
    prompt: '你是一个 Midjourney 提示词专家。请根据我提供的中文描述，生成一个高质量的 Midjourney 提示词。\n\n提示词结构：\n1. 主体描述（英文）\n2. 风格描述\n3. 光线和氛围\n4. 技术参数\n\n中文描述：\n{{中文描述}}',
    keywords: ['Midjourney', 'AI绘画', '提示词', '图片生成'],
    categoryId: 7,
    authorName: 'AI画家',
    models: ['ChatGPT', 'Claude'],
    usage: '用中文描述你想要的画面，系统会生成 Midjourney 提示词。',
    exampleInput: '一只在星空下弹钢琴的猫，梦幻风格',
    exampleOutput: 'A cat playing piano under a starry night sky, dreamy atmosphere --ar 16:9 --v 6',
    variables: [{ name: '中文描述', placeholder: '描述你想要的画面', label: '画面描述' }],
    likes: 342, favorites: 178, comments: 67, copies: 890, daysAgo: '-1 days',
  },
  {
    title: 'Python 代码优化顾问',
    description: '分析 Python 代码，提供性能优化、可读性改进和最佳实践建议。',
    prompt: '你是一个资深 Python 开发者。请分析以下 Python 代码，提供优化建议：\n\n1. 性能优化\n2. 可读性改进\n3. 最佳实践\n4. 潜在 bug\n\n代码：\n{{Python代码}}',
    keywords: ['Python', '代码优化', '编程', '性能'],
    categoryId: 4,
    authorName: 'Pythonista',
    models: ['ChatGPT', 'Claude'],
    usage: '粘贴你的 Python 代码，获取优化建议。',
    exampleInput: 'def f(x):\n  return x*2',
    exampleOutput: '## 优化建议\n1. 函数名 f 不够描述性\n2. 添加类型注解',
    variables: [{ name: 'Python代码', placeholder: 'Paste your Python code here', label: 'Python Code' }],
    likes: 167, favorites: 89, comments: 34, copies: 456, daysAgo: '-3 days',
  },
  {
    title: '英语语法纠错助手',
    description: '检查英文文本的语法错误，并提供修改建议和解释。',
    prompt: 'You are an English grammar expert. Please check the following English text for grammar errors.\n\nText to check:\n{{英文文本}}',
    keywords: ['英语', '语法', '翻译', '学习'],
    categoryId: 6,
    authorName: 'English Pro',
    models: ['ChatGPT', 'Claude', 'Gemini'],
    usage: '粘贴你需要检查的英文文本即可。',
    exampleInput: 'He go to school yesterday and buyed a book.',
    exampleOutput: '1. "go" → "went"\n2. "buyed" → "bought"',
    variables: [{ name: '英文文本', placeholder: 'Paste your English text here', label: 'English Text' }],
    likes: 89, favorites: 45, comments: 12, copies: 234, daysAgo: '-1 days',
  },
  {
    title: '正则表达式生成器',
    description: '根据自然语言描述，生成对应的正则表达式并解释。',
    prompt: '你是一个正则表达式专家。请根据我的描述，生成对应的正则表达式。\n\n描述：\n{{正则描述}}',
    keywords: ['正则表达式', '编程', 'regex', '开发'],
    categoryId: 4,
    authorName: 'Regex Master',
    models: ['ChatGPT', 'Claude'],
    usage: '用自然语言描述你要匹配的模式。',
    exampleInput: '匹配中国大陆手机号码',
    exampleOutput: '正则：^1[3-9]\\d{9}$',
    variables: [{ name: '正则描述', placeholder: '描述你要匹配的内容', label: '正则描述' }],
    likes: 278, favorites: 167, comments: 56, copies: 789, daysAgo: '-3 days',
  },
  {
    title: '朋友圈文案生成器',
    description: '根据场景和心情，生成适合发朋友圈的文案。',
    prompt: '你是一个朋友圈文案高手。请根据我描述的场景和心情，生成 5 条朋友圈文案。\n\n场景和心情：\n{{场景描述}}',
    keywords: ['朋友圈', '文案', '社交', '生活'],
    categoryId: 1,
    authorName: '文案小能手',
    models: ['ChatGPT', 'Claude', 'Gemini'],
    usage: '描述你的场景和心情，获取朋友圈文案。',
    exampleInput: '周末去了海边，天气很好',
    exampleOutput: '1. 🌊 海风一吹，烦恼全没\n2. 今日份的快乐，由大海赞助 🏖️',
    variables: [{ name: '场景描述', placeholder: '描述你的场景和心情', label: '场景描述' }],
    likes: 312, favorites: 189, comments: 78, copies: 901, daysAgo: '-1 days',
  },
  {
    title: '面试问题模拟器',
    description: '模拟面试场景，根据岗位生成常见面试问题和参考答案。',
    prompt: '你是一个资深HR和面试教练。请根据我申请的岗位，生成 10 个常见面试问题及参考答案。\n\n岗位信息：\n{{岗位信息}}',
    keywords: ['面试', '求职', 'HR', '职业'],
    categoryId: 10,
    authorName: '求职导师',
    models: ['ChatGPT', 'Claude', 'Gemini'],
    usage: '填写你要面试的岗位信息。',
    exampleInput: '前端开发工程师，3年经验',
    exampleOutput: '## 问题1：请介绍你最复杂的React项目',
    variables: [{ name: '岗位信息', placeholder: '例如：前端开发工程师，3年经验', label: '岗位信息' }],
    likes: 198, favorites: 134, comments: 56, copies: 678, daysAgo: '-4 days',
  },
  {
    title: '视频脚本生成器',
    description: '根据主题生成短视频脚本，包含开头钩子、内容结构和结尾引导。',
    prompt: '你是一个短视频内容策划专家。请根据我提供的主题，生成一个短视频脚本。\n\n主题：{{主题}}\n时长：{{时长}}分钟',
    keywords: ['视频脚本', '短视频', '内容创作', '抖音'],
    categoryId: 8,
    authorName: '短视频达人',
    models: ['ChatGPT', 'Claude'],
    usage: '填写主题和时长。',
    exampleInput: '主题：如何3天学会Python',
    exampleOutput: '## 开头钩子\n"3天学会Python？别急着划走！"',
    variables: [{ name: '主题', placeholder: '视频要讲什么', label: '主题' }, { name: '时长', placeholder: '分钟', label: '时长', defaultValue: '2' }],
    likes: 156, favorites: 78, comments: 34, copies: 456, daysAgo: '-6 days',
  },
  {
    title: '英文邮件润色助手',
    description: '将中文邮件翻译成地道的商务英文邮件。',
    prompt: '你是一个商务英语写作专家。请将以下中文邮件翻译成专业的英文邮件。\n\n中文邮件：\n{{中文邮件}}',
    keywords: ['英文邮件', '商务英语', '翻译', '职场'],
    categoryId: 6,
    authorName: '商务英语专家',
    models: ['ChatGPT', 'Claude', 'Gemini'],
    usage: '粘贴你的中文邮件内容。',
    exampleInput: '王总您好，附件是本周的项目进度报告。',
    exampleOutput: 'Dear Mr. Wang,\n\nPlease find attached this week\'s project progress report.',
    variables: [{ name: '中文邮件', placeholder: '粘贴你的中文邮件', label: '中文邮件' }],
    likes: 234, favorites: 145, comments: 45, copies: 567, daysAgo: '-2 days',
  },
  {
    title: 'SQL 查询生成器',
    description: '根据自然语言描述，生成 SQL 查询语句。',
    prompt: '你是一个 SQL 专家。请根据我的描述，生成 SQL 查询语句。\n\n表结构：{{表结构}}\n查询需求：{{查询需求}}',
    keywords: ['SQL', '数据库', '编程', '查询'],
    categoryId: 4,
    authorName: 'DBA老手',
    models: ['ChatGPT', 'Claude'],
    usage: '提供表结构和查询需求。',
    exampleInput: '表：users(id, name, email)\n需求：查找最近7天注册的用户',
    exampleOutput: 'SELECT COUNT(*) FROM users WHERE created_at >= datetime(\'now\', \'-7 days\')',
    variables: [{ name: '表结构', placeholder: '描述表结构', label: '表结构' }, { name: '查询需求', placeholder: '描述查询需求', label: '查询需求' }],
    likes: 198, favorites: 112, comments: 45, copies: 567, daysAgo: '-4 days',
  },
  {
    title: '产品需求文档助手',
    description: '根据产品想法，生成结构化的 PRD 文档框架。',
    prompt: '你是一个产品经理专家。请根据我的产品想法，生成一份 PRD 文档框架。\n\n产品想法：\n{{产品想法}}',
    keywords: ['PRD', '产品经理', '需求文档', '产品设计'],
    categoryId: 5,
    authorName: '产品老司机',
    models: ['ChatGPT', 'Claude'],
    usage: '描述你的产品想法。',
    exampleInput: '一个帮用户养成喝水习惯的App',
    exampleOutput: '# 喝水助手 App PRD\n\n## 1. 产品概述\n一款帮助用户养成健康饮水习惯的移动应用',
    variables: [{ name: '产品想法', placeholder: '描述你的产品想法', label: '产品想法' }],
    likes: 189, favorites: 98, comments: 34, copies: 345, daysAgo: '-7 days',
  },
  {
    title: '每日健身计划生成器',
    description: '根据个人情况生成每日健身计划。',
    prompt: '你是一个专业健身教练。请根据我的个人信息，生成今日健身计划。\n\n个人信息：\n{{个人信息}}',
    keywords: ['健身', '运动', '计划', '生活'],
    categoryId: 9,
    authorName: '健身教练',
    models: ['ChatGPT', 'Claude', 'Gemini'],
    usage: '填写你的健身目标和条件。',
    exampleInput: '男性，25岁，想增肌，有哑铃',
    exampleOutput: '## 热身\n1. 开合跳 30秒\n\n## 主要训练\n1. 哑铃深蹲 4组x12次',
    variables: [{ name: '个人信息', placeholder: '年龄、性别、健身目标', label: '个人信息' }],
    likes: 145, favorites: 89, comments: 23, copies: 234, daysAgo: '-1 days',
  },
  {
    title: '代码审查助手',
    description: '对代码进行审查，找出潜在问题并提供改进建议。',
    prompt: '你是一个资深代码审查者。请审查以下代码。\n\n代码语言：{{语言}}\n代码：\n{{代码}}',
    keywords: ['代码审查', 'Code Review', '编程', '质量'],
    categoryId: 4,
    authorName: '代码审查官',
    models: ['ChatGPT', 'Claude'],
    usage: '选择编程语言，粘贴代码。',
    exampleInput: '语言：JavaScript\n代码：eval(userInput)',
    exampleOutput: '## 🔴 严重问题\n1. eval() 存在代码注入风险',
    variables: [{ name: '语言', placeholder: '编程语言', label: '语言', defaultValue: 'JavaScript' }, { name: '代码', placeholder: '粘贴你的代码', label: '代码' }],
    likes: 234, favorites: 134, comments: 56, copies: 456, daysAgo: '-5 days',
  },
  {
    title: '角色扮演：苏格拉底',
    description: '扮演苏格拉底，用提问的方式引导你深入思考问题。',
    prompt: '你现在是古希腊哲学家苏格拉底。你的任务是通过提问来帮助我深入思考问题。\n\n规则：\n1. 不要直接给答案\n2. 通过层层追问引导我思考\n\n我想思考的问题是：\n{{问题}}',
    keywords: ['角色扮演', '哲学', '思考', '苏格拉底'],
    categoryId: 11,
    authorName: '哲学爱好者',
    models: ['ChatGPT', 'Claude'],
    usage: '提出你想深入思考的问题。',
    exampleInput: '什么是幸福？',
    exampleOutput: '亲爱的朋友，你问什么是幸福。那么请告诉我，当你感到幸福的时候，那是一种什么样的感觉呢？',
    variables: [{ name: '问题', placeholder: '你想思考什么问题？', label: '问题' }],
    likes: 178, favorites: 89, comments: 45, copies: 234, daysAgo: '-8 days',
  },
]

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env } = context

  try {
    // Create schema
    const stmts = SCHEMA_SQL.split(';').filter(s => s.trim())
    for (const sql of stmts) {
      if (sql.trim()) {
        await env.DB.prepare(sql).run()
      }
    }

    // Seed categories
    for (const [name, slug, icon, sortOrder] of SEED_CATEGORIES) {
      await env.DB.prepare(
        'INSERT OR IGNORE INTO categories (name, slug, icon, sort_order) VALUES (?, ?, ?, ?)'
      ).bind(name, slug, icon, sortOrder).run()
    }

    // Seed skills
    for (const s of SEED_SKILLS) {
      await env.DB.prepare(
        `INSERT INTO skills (title, description, prompt_content, keywords, category_id, author_name, suitable_models, usage_instructions, example_input, example_output, variables, like_count, favorite_count, comment_count, copy_count, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ?))`
      ).bind(
        s.title, s.description, s.prompt,
        JSON.stringify(s.keywords), s.categoryId, s.authorName,
        JSON.stringify(s.models), s.usage, s.exampleInput, s.exampleOutput,
        JSON.stringify(s.variables), s.likes, s.favorites, s.comments, s.copies,
        s.daysAgo
      ).run()
    }

    return Response.json({ success: true, message: `Seeded ${SEED_CATEGORIES.length} categories and ${SEED_SKILLS.length} skills.` })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}
