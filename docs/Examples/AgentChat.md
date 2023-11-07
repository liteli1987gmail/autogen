# AutoGen 自动化多代理聊天

AutoGen 提供了由 LLM 工具或人类驱动的可对话代理，可以通过自动聊天集体执行任务。该框架允许通过多代理对话进行工具使用和人类参与。
请在此处找到有关此功能的文档 [/docs/Use-Cases/agent_chat]。

示例链接:


1. **代码生成、执行和测试**

   - 使用代码生成、执行和测试进行自动任务解决 - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_auto_feedback_from_code_execution.ipynb)
   - 使用自动代码生成、执行和测试和人类反馈 - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_human_feedback.ipynb)
   - 使用增强代理进行自动代码生成和问答 - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_RetrieveChat.ipynb)
   - 使用基于 Qdrant 的增强代理进行自动代码生成和问答 - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_qdrant_RetrieveChat.ipynb)

2. **多代理协作 (> 3 个代理)**

   - 使用 GPT-4 +多个用户进行自动任务解决 - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_two_users.ipynb)
   - 通过组聊自动解决任务（3 个组成员代理和 1 个管理代理） - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_groupchat.ipynb)
   - 通过组聊自动进行数据可视化（3 个组成员代理和 1 个管理代理） - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_groupchat_vis.ipynb)
   - 通过组聊自动解决复杂任务（6 个组成员代理和 1 个管理代理） - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_groupchat_research.ipynb)
   - 使用编码和规划进行自动任务解决 - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_planning.ipynb)

3. **应用场景**

   - 使用 GPT-4 进行自动国际象棋游戏和闲聊 - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_chess.ipynb)
   - 从新数据中进行自动持续学习 - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_stream.ipynb)
   - [OptiGuide](https://github.com/microsoft/optiguide) - 提供优化的代码工具和安全问答

4. **工具使用**

   - **网络搜索**: 解决需要网络信息的任务 - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_web_info.ipynb)
   - 将提供的工具用作函数调用 - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_function_call.ipynb)
   - 使用 Langchain 提供的工具作为函数解决任务 - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_function_call.ipynb)
   - **RAG**: 带有检索增强生成的组聊（5 个组成员代理和 1 个管理代理） - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_groupchat_RAG.ipynb)
   - 深入了解 OpenAI 实用函数 - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/oai_openai_utils.ipynb)

5. **代理教学和学习**
   - 通过自动化聊天教授代理新技能和重复使用 - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_teaching.ipynb)
   - 教授代理新事实、用户偏好和超越编码的技能 - [在线代码](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_teachability.ipynb)
