---
sidebar_position: 1
---

# AutoGen 入门

<!-- ### 欢迎使用AutoGen，这是一个通过多代理对话框架实现下一代LLM应用的库！ -->

AutoGen 是一个框架，它使用可以相互对话以解决任务的多个代理来开发 LLM 应用。 AutoGen 代理是可定制的, 可对话的, 并且可以无缝地与人类参与。 它们可以以使用 LLM, 人类输入, 和工具的各种模式运行。

![AutoGen 概述](/img/autogen_agentchat.png)

### 主要特点

- AutoGen 通过最小的工作量，使基于 [多代理对话](https://microsoft.github.io/autogen/docs/Use-Cases/agent_chat) 构建下一代 LLM 应用变得简单。 它简化了复杂 LLM 工作流的编排, 自动化, 和优化。 它最大化了 LLM 模型的性能并克服了它们的缺点。
- 它支持 [多样化的对话模式](https://microsoft.github.io/autogen/docs/Use-Cases/agent_chat#supporting-diverse-conversation-patterns) 以适应复杂的工作流程。 开发人员可以使用定制和对话的方式使用 AutoGen 构建各种关于对话自主性, 代理数量, 和代理对话协作的对话模式。
- 它提供了一系列具有不同复杂性的工作系统。 这些系统涵盖了各种领域和复杂性的 [广泛应用](https://microsoft.github.io/autogen/docs/Use-Cases/agent_chat#diverse-applications-implemented-with-autogen)。 这展示了 AutoGen 如何轻松支持多样化的对话模式。
- AutoGen 提供了 [增强的 LLM 推理](https://microsoft.github.io/autogen/docs/Use-Cases/enhanced_inference#api-unification)。 它提供了 API 统一和缓存, 以及高级用法模式, 如错误处理, 多配置处理, 上下文编程, 等实用工具。

AutoGen 由 Microsoft, 比尔法尼亚州立大学和华盛顿大学的合作 [研究](/docs/Research) 支持。

### 快速入门

通过 pip 安装：`pip install pyautogen`。 在 [安装](/docs/Installation) 中找到更多选项。
对于 [代码执行](/docs/FAQ#code-execution), 我们强烈建议安装 python docker 包, 并使用 docker。

#### 多代理对话框架$AutoGen 通过通用的多代理对话框架实现下一代 LLM 应用。 它提供了可定制和对话的代理，这些代理集成了 LLM 工具和人类。
通过自动化多个有能力的代理之间的对话，可以轻松使它们共同执行任务，无论是自主执行还是通过人类反馈执行，包括需要通过代码使用工具的任务。 例如，你可以参考 [这个示例](https://github.com/microsoft/autogen/blob/main/test/twoagent.py)

```python
from autogen import AssistantAgent, UserProxyAgent, config_list_from_json

# 从环境变量或文件中加载LLM处理端点
# 参见https://microsoft.github.io/autogen/docs/FAQ#set-your-api-endpoints
# 和OAI_CONFIG_LIST_sample.json
config_list = config_list_from_json(env_or_file="OAI_CONFIG_LIST")
assistant = AssistantAgent("assistant", llm_config={"config_list": config_list})
user_proxy = UserProxyAgent("user_proxy", code_execution_config={"work_dir": "coding"})
user_proxy.initiate_chat(assistant, message="Plot a chart of NVDA and TESLA stock price change YTD.")
# 这将在两个代理之间启动一个自动化对话以解决任务
```

下图显示了AutoGen的一个示例对话流程。
![代理对话示例](/img/chat_example.png)

* [代码示例](/docs/Examples/AgentChat)。
* [文档](/docs/Use-Cases/agent_chat)。

#### 增强的LLM推理$AutoGen还有助于最大化昂贵的LLM（如ChatGPT和GPT-4）的效用。 它提供了增强的LLM推理，具有强大的功能，如调优,缓存,错误处理,模板化等。 例如，你可以成功指标和预算来优化LLM的生成。
```python
# 为openai<1执行调优
config, analysis = autogen.Completion.tune(
    data=tune_data,
    metric="success",
    mode="max",
    eval_func=eval_func,
    inference_budget=0.05,
    optimization_budget=3,
    num_samples=-1,
)
# 为测试实例执行推理
response = autogen.Completion.create(context=test_instance, **config)
```
* [代码示例](/docs/Examples/Inference)。
* [文档](/docs/Use-Cases/enhanced_inference)。

### 下一步怎么办？

* 了解[multi-agent conversation](/docs/Use-Cases/agent_chat)和[enhanced LLM inference](/docs/Use-Cases/enhanced_inference)的用例。
* 查找[代码示例](/docs/Examples/AgentChat)。
* 阅读[SDK](/docs/reference/agentchat/conversable_agent/)。
* 了解围绕AutoGen的[研究](/docs/Research)。
* [discord](https://github.com/orgs/microsoft/projects/989/views/3)
* 在[Discord](https://discord.gg/pAbnFJrkgZ)上交流。
* 在[Twitter](https://twitter.com/pyautogen)上关注。

如果你喜欢我们的项目,请在GitHub上给它一个[星星](https://github.com/microsoft/autogen/stargazers)。 如果你有兴趣贡献,请参考[贡献者指南](/docs/Contribute)。

<iframe src="https://ghbtns.com/github-btn.html?user=microsoft&amp;repo=autogen&amp;type=star&amp;count=true&amp;size=large" frameborder="0" scrolling="0" width="170" height="30" title="GitHub"></iframe>
