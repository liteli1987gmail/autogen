# AutoGen 多智能体对话框架

AutoGen 提供了一个统一的多智能体对话框架，作为使用基础模型的高级抽象。它具有能力强、可定制和可对话的智能体，这些智能体整合了大型语言模型（LLM）、工具和人类通过自动化代理聊天。
通过自动化多个能力强的代理之间的聊天，可以轻松使它们集体自主执行任务，或者在人类反馈下执行任务，包括需要通过代码使用工具的任务。

该框架简化了复杂 LLM 工作流的编排、自动化和优化。它最大化了 LLM 模型的性能并克服了它们的弱点。它使基于多智能体对话的下一代 LLM 应用程序的构建变得轻而易举。

### 智能体

AutoGen 抽象并实现了旨在通过智能体间对话解决任务的可对话智能体。具体来说，AutoGen 中的智能体具有以下显著特点：

- 可对话：AutoGen 中的智能体是可对话的，这意味着任何智能体都可以发送和接收来自其他智能体的消息，以启动或继续对话。

- 可定制：AutoGen 中的智能体可以定制，以整合 LLM、人类、工具或它们的组合。

下图显示了 AutoGen 中内置的智能体。
![代理聊天示例](images/autogen_agents.png)

我们设计了一个通用的 `ConversableAgent` 类，用于能够通过消息交换相互对话以共同完成任务的智能体。一个智能体可以与其他智能体通信并执行动作。不同的智能体在接收消息后可以执行不同的动作。两个代表性的子类是 `AssistantAgent` 和 `UserProxyAgent`。

- `AssistantAgent` 被设计为充当 AI 助手，通常使用 LLM，但不需要人类输入或代码执行。它可以为用户编写 Python 代码（在 Python 代码块中），当接收到消息时（通常是需要解决的任务描述）。在底层，Python 代码由 LLM（例如，GPT-4）编写。它还可以接收执行结果并建议更正或错误修复。通过传递新的系统消息，可以改变其行为。LLM [推理](#enhanced-inference) 配置可以通过 `llm_config` 进行配置。

- `UserProxyAgent` 在概念上是人类的代理智能体，默认情况下在每个交互轮次征求人类输入作为智能体的回复，并且也有执行代码和调用函数的能力。当 `UserProxyAgent` 检测到接收到的消息中有可执行的代码块且没有提供人类用户输入时，它会自动触发代码执行。可以通过将 `code_execution_config` 参数设置为 False 来禁用代码执行。默认情况下，LLM 基于响应是禁用的。可以通过将 `llm_config` 设置为对应于 [推理](/docs/Use-Cases/enhanced_inference) 配置的字典来启用。当 `llm_config` 设置为字典时，`UserProxyAgent` 可以在不执行代码的情况下使用 LLM 生成回复。

`ConversableAgent` 的自动回复能力允许更加自主的多智能体通信，同时保留了人类干预的可能性。
人们还可以通过使用 `register_reply()` 方法注册回复函数来轻松扩展它。

在以下代码中，我们创建了一个名为 "assistant" 的 `AssistantAgent` 来充当助手，以及一个名为 "user_proxy" 的 `UserProxyAgent` 来充当人类用户的代理。我们稍后将使用这两个智能体来解决一个任务。

```python
from autogen import AssistantAgent, UserProxyAgent

# 创建一个名为 "assistant" 的 AssistantAgent 实例
assistant = AssistantAgent(name="assistant")

# 创建一个名为 "user_proxy" 的 UserProxyAgent 实例
user_proxy = UserProxyAgent(name="user_proxy")
```

## 多智能体对话

### 一个基本的两智能体对话示例

一旦参与的智能体被正确构建，就可以通过以下代码显示的初始化步骤开始一个多智能体对话会话：

```python
# 助手接收到来自用户的消息，其中包含任务描述
user_proxy.initiate_chat(
    assistant,
    message="""今天是什么日期？今年哪家大科技股票的年初至今涨幅最大？涨幅是多少？""",
)
```

初始化步骤之后，对话可以自动进行。下面是一个视觉插图，展示了 user_proxy 和 assistant 如何自主协作解决上述任务：
![代理聊天示例](images/agent_example.png)

1. 助手接收到来自 user_proxy 的消息，其中包含任务描述。
2. 然后助手尝试编写 Python 代码来解决任务，并将响应发送给 user_proxy。
3. 一旦 user_proxy 从助手那里收到响应，它会尝试通过征求人类输入或准备自动生成的回复来回复。如果没有提供人类输入，user_proxy 将执行代码并使用结果作为自动回复。
4. 然后助手为 user_proxy 生成进一步的响应。然后 user_proxy 可以决定是否终止对话。如果不是，就重复步骤 3 和 4。

### 支持多样化的对话模式

#### 具有不同自主水平

和人类参与模式的对话

一方面，可以在初始化步骤后实现完全自主的对话。另一方面，AutoGen 可用于通过配置人类参与水平和模式（例如，将 `human_input_mode` 设置为 `ALWAYS`）来实现人在循环中的问题解决，因为在许多应用中都期望和/或需要人类参与。

#### 静态和动态对话

通过采用以对话为驱动的控制，结合编程语言和自然语言，AutoGen 本质上允许动态对话。动态对话允许代理拓扑根据不同输入问题实例下的实际对话流程而变化，而静态对话的流程总是遵循预定义的拓扑。在复杂应用中，交互模式无法预先确定，动态对话模式非常有用。AutoGen 提供了两种实现动态对话的通用方法：

- 注册自动回复。通过可插拔的自动回复功能，可以选择根据当前消息和上下文的内容与其他智能体进行对话。在这个代码示例中，我们在群聊管理器中注册了一个自动回复功能，让 LLM 决定谁将是群聊设置中的下一个发言者。

- 基于 LLM 的函数调用。在这种方法中，LLM 根据每次推理调用中的对话状态决定是否调用特定函数。
  通过在被调用的函数中向其他代理发送消息，LLM 可以驱动动态多智能体对话。在 [多用户数学问题解决场景](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_two_users.ipynb) 中，可以找到展示这种类型动态对话的工作系统，其中学生助手会自动求助于专家使用函数调用。

### 使用 AutoGen 实现的多样化应用

下图显示了使用 AutoGen 构建的六个应用示例。
![应用](images/app.png)

1. **代码生成、执行和调试**

   - 使用代码生成、执行和调试的自动任务解决 - [查看笔记本](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_auto_feedback_from_code_execution.ipynb)
   - 自动代码生成、执行、调试和人类反馈 - [查看笔记本](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_human_feedback.ipynb)
   - 使用检索增强代理的自动代码生成和问答 - [查看笔记本](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_RetrieveChat.ipynb)

2. **多智能体协作（> 3 智能体）**

   - 使用 GPT-4 + 多个人类用户的自动任务解决 - [查看笔记本](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_two_users.ipynb)
   - 通过群聊解决自动任务（有 3 个群成员代理和 1 个管理代理） - [查看笔记本](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_groupchat.ipynb)
   - 通过群聊自动数据可视化（有 3 个群成员代理和 1 个管理代理） - [查看笔记本](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_groupchat_vis.ipynb)
   - 通过群聊自动解决复杂任务（有 6 个群成员代理和 1 个管理代理） - [查看笔记本](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_groupchat_research.ipynb)
   - 使用编码和规划代理的自动任务解决 - [查看笔记本](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_planning.ipynb)

3. **应用程序**

   - 由 GPT-4 代理自动进行的国际象棋游戏和闲聊 - [查看笔记本](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_chess.ipynb)
   - 从新数据中自动持续学习 - [查看笔记本](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_stream.ipynb)
   - [OptiGuide](https://github.com/microsoft/optiguide) - 供应链优化的编码、工具使用、安全保障和问题回答

4. **工具使用**

   - **网络搜索**：解决需要网络信息的任务 - [查看笔记本](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_web_info.ipynb)
   - 使用提供的工具作为函数 - [查看笔记本](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_function_call.ipynb)
   - 使用 Langchain 提供的工具作为函数解决任务 - [查看笔记本](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_function_call.ipynb)
   - **RAG**：带检索增强生成的群聊（有 5 个群成员代理和 1 个管理代理） - [查看笔记本](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_groupchat_RAG.ipynb)
   - 深入指南到 OpenAI 实用函数 - [查看笔记本](https://github.com/microsoft/autogen/blob/main/notebook/oai_openai_utils.ipynb)

5. **代理教学与学习**
   - 通过自动化聊天教授代理新技能并复用 - [查看笔记本](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_teaching.ipynb)
   - 教授代理新事实、用户偏好以及超越编码的技能 - [查看笔记本](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_teachability.ipynb)

## 进一步阅读

_对这个包背后的研究感兴趣吗？请查阅以下论文。_

- [AutoGen: 通过多代理会话框架启用下一代 LLM 应用](https://arxiv.org/abs/2308.08155)。青云吴、Gagan Bansal、Jieyu Zhang、Yiran Wu、Shaokun Zhang、Erkang Zhu、Beibin Li、Li Jiang、Xiaoyun Zhang 和 Chi Wang。ArXiv 2023。

- [使用 GPT-4 解决挑战性数学问题的实证研究](https://arxiv.org/abs/2306.01337)。Yiran Wu、Feiran Jia、Shaokun Zhang、Hangyu Li、Erkang Zhu、Yue Wang、Yin Tat Lee、Richard Peng、Qingyun Wu、Chi Wang。ArXiv 预印本 arXiv: 2306.01337（2023）。