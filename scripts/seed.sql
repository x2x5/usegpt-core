INSERT OR IGNORE INTO categories (name, slug, icon, sort_order) VALUES ('写作', 'writing', '✍️', 1);
INSERT OR IGNORE INTO categories (name, slug, icon, sort_order) VALUES ('营销', 'marketing', '📢', 2);
INSERT OR IGNORE INTO categories (name, slug, icon, sort_order) VALUES ('学习', 'learning', '📚', 3);
INSERT OR IGNORE INTO categories (name, slug, icon, sort_order) VALUES ('编程', 'coding', '💻', 4);
INSERT OR IGNORE INTO categories (name, slug, icon, sort_order) VALUES ('商务', 'business', '💼', 5);
INSERT OR IGNORE INTO categories (name, slug, icon, sort_order) VALUES ('翻译', 'translation', '🌐', 6);
INSERT OR IGNORE INTO categories (name, slug, icon, sort_order) VALUES ('图片生成', 'image-gen', '🎨', 7);
INSERT OR IGNORE INTO categories (name, slug, icon, sort_order) VALUES ('视频脚本', 'video-script', '🎬', 8);
INSERT OR IGNORE INTO categories (name, slug, icon, sort_order) VALUES ('生活效率', 'productivity', '⚡', 9);
INSERT OR IGNORE INTO categories (name, slug, icon, sort_order) VALUES ('求职', 'job-search', '🎯', 10);
INSERT OR IGNORE INTO categories (name, slug, icon, sort_order) VALUES ('角色扮演', 'roleplay', '🎭', 11);
INSERT OR IGNORE INTO categories (name, slug, icon, sort_order) VALUES ('其他', 'other', '📦', 12);

INSERT INTO skills (title, description, prompt_content, keywords, category_id, author_name, suitable_models, usage_instructions, example_input, example_output, variables, like_count, favorite_count, comment_count, copy_count, created_at) VALUES ('小红书爆款标题生成器', '根据产品卖点生成 20 个小红书风格标题，适合种草、探店、课程推广。', '你是一个资深小红书运营专家。请根据我提供的产品信息，生成 20 个小红书爆款标题。

要求：
1. 标题要有点击欲望
2. 不要夸张虚假
3. 每个标题不超过 25 字
4. 使用 emoji 增加吸引力
5. 输出为表格格式

产品信息：
{{产品信息}}', '["小红书","标题","营销","种草"]', 2, '小红书达人', '["ChatGPT","Claude","Gemini"]', '替换「产品信息」为你要推广的产品描述，即可生成 20 个标题。', '一款便携式咖啡杯，316不锈钢，保温12小时，售价89元', '1. ☕ 这杯子让我戒掉了星巴克！保温12h还只要89', '[{"name":"产品信息","placeholder":"请输入你的产品描述","label":"产品信息"}]', 128, 56, 24, 312, datetime('now', '-2 days'));

INSERT INTO skills (title, description, prompt_content, keywords, category_id, author_name, suitable_models, usage_instructions, example_input, example_output, variables, like_count, favorite_count, comment_count, copy_count, created_at) VALUES ('周报生成器', '根据本周工作内容，自动生成结构清晰、重点突出的周报。', '你是一个职场写作助手。请根据我提供的本周工作内容，生成一份专业的周报。

格式要求：
## 本周工作总结
- 列出完成的主要工作

## 关键成果
- 用数据量化成果

## 遇到的问题
- 简要说明问题和解决方案

## 下周计划
- 列出下周重点任务

本周工作内容：
{{工作内容}}', '["周报","职场","写作","汇报"]', 1, '职场效率王', '["ChatGPT","Claude"]', '将「工作内容」替换为你本周做的事情，越详细生成的周报越好。', '完成了用户登录模块开发，修复了3个bug，参加了2次需求评审', '## 本周工作总结\n- 完成用户登录模块开发并上线', '[{"name":"工作内容","placeholder":"描述你本周做了什么","label":"工作内容"}]', 256, 120, 45, 890, datetime('now', '-5 days'));

INSERT INTO skills (title, description, prompt_content, keywords, category_id, author_name, suitable_models, usage_instructions, example_input, example_output, variables, like_count, favorite_count, comment_count, copy_count, created_at) VALUES ('英语语法纠错助手', '检查英文文本的语法错误，并提供修改建议和解释。', 'You are an English grammar expert. Please check the following English text for grammar errors, spelling mistakes, and awkward phrasing.

For each error found:
1. Show the original text
2. Provide the corrected version
3. Explain why it was wrong

Text to check:
{{英文文本}}', '["英语","语法","翻译","学习"]', 6, 'English Pro', '["ChatGPT","Claude","Gemini"]', '粘贴你需要检查的英文文本即可。', 'He go to school yesterday and buyed a book.', '1. "go" → "went" (past tense required)\n2. "buyed" → "bought" (irregular verb)', '[{"name":"英文文本","placeholder":"Paste your English text here","label":"English Text"}]', 89, 45, 12, 234, datetime('now', '-1 days'));

INSERT INTO skills (title, description, prompt_content, keywords, category_id, author_name, suitable_models, usage_instructions, example_input, example_output, variables, like_count, favorite_count, comment_count, copy_count, created_at) VALUES ('Python 代码优化顾问', '分析 Python 代码，提供性能优化、可读性改进和最佳实践建议。', '你是一个资深 Python 开发者。请分析以下 Python 代码，提供优化建议：

1. 性能优化：找出可以提升性能的地方
2. 可读性改进：让代码更 Pythonic
3. 最佳实践：符合 PEP8 和社区惯例
4. 潜在 bug：指出可能的问题

代码：
{{Python代码}}', '["Python","代码优化","编程","性能"]', 4, 'Pythonista', '["ChatGPT","Claude"]', '粘贴你的 Python 代码，获取优化建议和改进版本。', 'def f(x):\n  return x*2', '## 优化建议\n1. 函数名 f 不够描述性\n2. 添加类型注解', '[{"name":"Python代码","placeholder":"Paste your Python code here","label":"Python Code"}]', 167, 89, 34, 456, datetime('now', '-3 days'));

INSERT INTO skills (title, description, prompt_content, keywords, category_id, author_name, suitable_models, usage_instructions, example_input, example_output, variables, like_count, favorite_count, comment_count, copy_count, created_at) VALUES ('Midjourney 提示词生成器', '根据中文描述，生成高质量的 Midjourney 英文提示词。', '你是一个 Midjourney 提示词专家。请根据我提供的中文描述，生成一个高质量的 Midjourney 提示词。

提示词结构：
1. 主体描述（英文）
2. 风格描述
3. 光线和氛围
4. 技术参数（--ar, --v, --q 等）

中文描述：
{{中文描述}}', '["Midjourney","AI绘画","提示词","图片生成"]', 7, 'AI画家', '["ChatGPT","Claude"]', '用中文描述你想要的画面，系统会生成 Midjourney 提示词。', '一只在星空下弹钢琴的猫，梦幻风格', 'A cat playing piano under a starry night sky, dreamy atmosphere --ar 16:9 --v 6', '[{"name":"中文描述","placeholder":"描述你想要的画面","label":"画面描述"}]', 342, 178, 67, 890, datetime('now', '-1 days'));

INSERT INTO skills (title, description, prompt_content, keywords, category_id, author_name, suitable_models, usage_instructions, example_input, example_output, variables, like_count, favorite_count, comment_count, copy_count, created_at) VALUES ('面试问题模拟器', '模拟面试场景，根据岗位生成常见面试问题和参考答案。', '你是一个资深HR和面试教练。请根据我申请的岗位，生成 10 个常见面试问题及参考答案。

每个问题包括：
1. 问题本身
2. 考察点
3. 参考回答框架
4. 注意事项

岗位信息：
{{岗位信息}}', '["面试","求职","HR","职业"]', 10, '求职导师', '["ChatGPT","Claude","Gemini"]', '填写你要面试的岗位信息，获取针对性的面试准备。', '前端开发工程师，3年经验，React方向', '## 问题1：请介绍你最复杂的React项目\n**考察点：** 技术深度、项目经验', '[{"name":"岗位信息","placeholder":"例如：前端开发工程师，3年经验","label":"岗位信息"}]', 198, 134, 56, 678, datetime('now', '-4 days'));

INSERT INTO skills (title, description, prompt_content, keywords, category_id, author_name, suitable_models, usage_instructions, example_input, example_output, variables, like_count, favorite_count, comment_count, copy_count, created_at) VALUES ('视频脚本生成器', '根据主题生成短视频脚本，包含开头钩子、内容结构和结尾引导。', '你是一个短视频内容策划专家。请根据我提供的主题，生成一个短视频脚本。

脚本格式：
## 开头钩子（前3秒）
- 吸引观众的话术

## 内容主体
- 分点讲述

## 结尾引导
- 总结 + 互动引导

视频时长：{{时长}}分钟
主题：{{主题}}', '["视频脚本","短视频","内容创作","抖音"]', 8, '短视频达人', '["ChatGPT","Claude"]', '填写主题和时长，获取完整的视频脚本。', '主题：如何3天学会Python，时长：2分钟', '## 开头钩子\n"3天学会Python？别急着划走！"', '[{"name":"主题","placeholder":"视频要讲什么","label":"主题"},{"name":"时长","placeholder":"视频时长（分钟）","label":"时长","defaultValue":"2"}]', 156, 78, 34, 456, datetime('now', '-6 days'));

INSERT INTO skills (title, description, prompt_content, keywords, category_id, author_name, suitable_models, usage_instructions, example_input, example_output, variables, like_count, favorite_count, comment_count, copy_count, created_at) VALUES ('英文邮件润色助手', '将中文邮件翻译成地道的商务英文邮件，保持专业语气。', '你是一个商务英语写作专家。请将以下中文邮件翻译成专业的英文邮件。

要求：
1. 使用正式但友好的商务语气
2. 符合英文邮件格式规范
3. 保持原意但更地道

中文邮件：
{{中文邮件}}', '["英文邮件","商务英语","翻译","职场"]', 6, '商务英语专家', '["ChatGPT","Claude","Gemini"]', '粘贴你的中文邮件内容，获取专业的英文版本。', '王总您好，附件是本周的项目进度报告，请查收。', 'Dear Mr. Wang,\n\nPlease find attached this week''s project progress report.', '[{"name":"中文邮件","placeholder":"粘贴你的中文邮件","label":"中文邮件"}]', 234, 145, 45, 567, datetime('now', '-2 days'));

INSERT INTO skills (title, description, prompt_content, keywords, category_id, author_name, suitable_models, usage_instructions, example_input, example_output, variables, like_count, favorite_count, comment_count, copy_count, created_at) VALUES ('产品需求文档助手', '根据产品想法，生成结构化的 PRD 文档框架。', '你是一个产品经理专家。请根据我的产品想法，生成一份结构化的 PRD 文档框架。

PRD 结构：
1. 产品概述
2. 目标用户
3. 核心功能
4. 用户故事
5. 功能优先级
6. 技术要求
7. 成功指标

产品想法：
{{产品想法}}', '["PRD","产品经理","需求文档","产品设计"]', 5, '产品老司机', '["ChatGPT","Claude"]', '描述你的产品想法，获取结构化的 PRD 框架。', '一个帮用户养成喝水习惯的App', '# 喝水助手 App PRD\n\n## 1. 产品概述\n一款帮助用户养成健康饮水习惯的移动应用', '[{"name":"产品想法","placeholder":"描述你的产品想法","label":"产品想法"}]', 189, 98, 34, 345, datetime('now', '-7 days'));

INSERT INTO skills (title, description, prompt_content, keywords, category_id, author_name, suitable_models, usage_instructions, example_input, example_output, variables, like_count, favorite_count, comment_count, copy_count, created_at) VALUES ('正则表达式生成器', '根据自然语言描述，生成对应的正则表达式并解释。', '你是一个正则表达式专家。请根据我的描述，生成对应的正则表达式。

输出格式：
1. 正则表达式
2. 逐部分解释
3. 匹配示例
4. 不匹配示例

描述：
{{正则描述}}', '["正则表达式","编程","regex","开发"]', 4, 'Regex Master', '["ChatGPT","Claude"]', '用自然语言描述你要匹配的模式，获取正则表达式。', '匹配中国大陆手机号码', '正则：^1[3-9]\\d{9}$\n\n解释：以1开头，第二位是3-9，后面9位数字', '[{"name":"正则描述","placeholder":"描述你要匹配的内容","label":"正则描述"}]', 278, 167, 56, 789, datetime('now', '-3 days'));

INSERT INTO skills (title, description, prompt_content, keywords, category_id, author_name, suitable_models, usage_instructions, example_input, example_output, variables, like_count, favorite_count, comment_count, copy_count, created_at) VALUES ('每日健身计划生成器', '根据个人情况生成每日健身计划，包含动作、组数和注意事项。', '你是一个专业健身教练。请根据我的个人信息，生成今日健身计划。

计划包括：
1. 热身（5-10分钟）
2. 主要训练（30-45分钟）
3. 拉伸放松（5-10分钟）

个人信息：
{{个人信息}}', '["健身","运动","计划","生活"]', 9, '健身教练', '["ChatGPT","Claude","Gemini"]', '填写你的健身目标和条件，获取个性化健身计划。', '男性，25岁，想增肌，有哑铃', '## 热身\n1. 开合跳 30秒\n\n## 主要训练\n1. 哑铃深蹲 4组x12次', '[{"name":"个人信息","placeholder":"年龄、性别、健身目标、可用器材","label":"个人信息"}]', 145, 89, 23, 234, datetime('now', '-1 days'));

INSERT INTO skills (title, description, prompt_content, keywords, category_id, author_name, suitable_models, usage_instructions, example_input, example_output, variables, like_count, favorite_count, comment_count, copy_count, created_at) VALUES ('SQL 查询生成器', '根据自然语言描述，生成 SQL 查询语句。', '你是一个 SQL 专家。请根据我的自然语言描述，生成对应的 SQL 查询语句。

数据库表结构：
{{表结构}}

查询需求：
{{查询需求}}', '["SQL","数据库","编程","查询"]', 4, 'DBA老手', '["ChatGPT","Claude"]', '提供表结构和查询需求，获取 SQL 语句。', '表：users(id, name, email)\n需求：查找最近7天注册的用户', 'SELECT COUNT(*) FROM users WHERE created_at >= datetime(''now'', ''-7 days'')', '[{"name":"表结构","placeholder":"描述你的数据库表结构","label":"表结构"},{"name":"查询需求","placeholder":"描述你想查询什么","label":"查询需求"}]', 198, 112, 45, 567, datetime('now', '-4 days'));

INSERT INTO skills (title, description, prompt_content, keywords, category_id, author_name, suitable_models, usage_instructions, example_input, example_output, variables, like_count, favorite_count, comment_count, copy_count, created_at) VALUES ('朋友圈文案生成器', '根据场景和心情，生成适合发朋友圈的文案。', '你是一个朋友圈文案高手。请根据我描述的场景和心情，生成 5 条朋友圈文案。

风格要求：
1. 简短有力，不超过 50 字
2. 有趣不油腻
3. 适当使用 emoji

场景和心情：
{{场景描述}}', '["朋友圈","文案","社交","生活"]', 1, '文案小能手', '["ChatGPT","Claude","Gemini"]', '描述你的场景和心情，获取朋友圈文案。', '周末去了海边，天气很好', '1. 🌊 海风一吹，烦恼全没\n2. 今日份的快乐，由大海赞助 🏖️', '[{"name":"场景描述","placeholder":"描述你的场景和心情","label":"场景描述"}]', 312, 189, 78, 901, datetime('now', '-1 days'));

INSERT INTO skills (title, description, prompt_content, keywords, category_id, author_name, suitable_models, usage_instructions, example_input, example_output, variables, like_count, favorite_count, comment_count, copy_count, created_at) VALUES ('代码审查助手', '对代码进行审查，找出潜在问题并提供改进建议。', '你是一个资深代码审查者。请审查以下代码，关注：

1. 安全性问题
2. 性能问题
3. 可维护性
4. 代码规范

代码语言：{{语言}}
代码：
{{代码}}', '["代码审查","Code Review","编程","质量"]', 4, '代码审查官', '["ChatGPT","Claude"]', '选择编程语言，粘贴代码，获取审查报告。', '语言：JavaScript\n代码：eval(userInput)', '## 🔴 严重问题\n1. eval() 存在代码注入风险', '[{"name":"语言","placeholder":"编程语言","label":"语言","defaultValue":"JavaScript"},{"name":"代码","placeholder":"粘贴你的代码","label":"代码"}]', 234, 134, 56, 456, datetime('now', '-5 days'));

INSERT INTO skills (title, description, prompt_content, keywords, category_id, author_name, suitable_models, usage_instructions, example_input, example_output, variables, like_count, favorite_count, comment_count, copy_count, created_at) VALUES ('角色扮演：苏格拉底', '扮演苏格拉底，用提问的方式引导你深入思考问题。', '你现在是古希腊哲学家苏格拉底。你的任务是通过提问来帮助我深入思考问题。

规则：
1. 不要直接给答案
2. 通过层层追问引导我思考
3. 每次回复只问 1-2 个问题

我想思考的问题是：
{{问题}}', '["角色扮演","哲学","思考","苏格拉底"]', 11, '哲学爱好者', '["ChatGPT","Claude"]', '提出你想深入思考的问题，苏格拉底会用提问引导你。', '什么是幸福？', '亲爱的朋友，你问什么是幸福。那么请告诉我，当你感到幸福的时候，那是一种什么样的感觉呢？', '[{"name":"问题","placeholder":"你想思考什么问题？","label":"问题"}]', 178, 89, 45, 234, datetime('now', '-8 days'));
