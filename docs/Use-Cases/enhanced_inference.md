# AutoGen 增强推理

`autogen.OpenAIWrapper` 为 `openai>=1` 提供了增强的大型语言模型（LLM）推理功能。
`autogen.Completion` 是 `openai.Completion` 和 `openai.ChatCompletion` 的替代品，用于使用 `openai<1` 进行增强的 LLM 推理。
使用 `autogen` 进行推理有许多好处：性能调优、API 统一、缓存、错误处理、多配置推理、结果过滤、模板化等。

## 调优推理参数（针对 openai < 1）

*笔记本示例链接：*
* [针对代码生成优化](https://github.com/microsoft/autogen/blob/main/notebook/oai_completion.ipynb)
* [针对数学优化](https://github.com/microsoft/autogen/blob/main/notebook/oai_chatgpt_gpt4.ipynb)

### 优化选择

使用基础模型进行文本生成的成本通常以输入和输出中的令牌数量来衡量。从使用基础模型的应用程序构建者的角度来看，用例是在推理预算约束下（例如，通过解决编码问题所需的平均美元成本来衡量）最大化生成文本的效用。这可以通过优化推理的超参数来实现，这些超参数可以显著影响生成文本的效用和成本。

可调节的超参数包括：
1. model - 这是一个必需的输入，指定要使用的模型 ID。
1. prompt/messages - 模型的输入提示/消息，为文本生成任务提供上下文。
1. max_tokens - 在输出中生成的最大令牌（单词或单词片段）数量。
1. temperature - 一个介于 0 和 1 之间的值，控制生成文本的随机性。较高的温度将产生更随机和多样的文本，而较低的温度将产生更可预测的文本。
1. top_p - 一个介于 0 和 1 之间的值，控制每次令牌生成的采样概率质量。较低的 top_p 值将使基于最可能的令牌生成文本的可能性更大，而较高的值将允许模型探索更广泛的可能令牌范围。
1. n - 为给定提示生成的响应数量。生成多个响应可以提供更多样化和潜在更有用的输出，但也会增加请求的成本。
1. stop - 一个字符串列表，当在生成的文本中遇到时，将导致生成停止。这可以用来控制输出的长度或有效性。
1. presence_penalty, frequency_penalty - 控制生成文本中某些词或短语的出现和频率相对重要性的值。
1. best_of - 为给定提示生成的响应数量，服务器端在选择“最佳”（每个令牌的对数概率最高的）响应时。

文本生成的成本和效用与这些超参数的联合效应交织在一起。
这些超参数之间也存在复杂的相互作用。例如，不建议同时更改温度和 top_p，因为它们都控制生成文本的随机性，同时更改可能会产生冲突的效果；n 和 best_of 很少一起调整，因为如果应用程序可以处理多个输出，服务器端的过滤会导致不必要的信息损失；n 和 max_tokens 都会影响生成的总令牌数量，进而影响请求的成本。
这些相互作用和权衡使得手动确定给定文本生成任务的最佳超参数设置变得困难。

*选择是否重要？查看这篇 [博客文章](/blog/2023/04/21/LLM-tuning-math) 找到关于 gpt-3.5-turbo 和 gpt-4 的示例调优结果。*

使用 AutoGen，可以根据以下信息进行调优：
1. 验证数据。
1. 评估函数。
1. 要优化的指标。
1. 搜索空间。
1. 预算：推理和优化分别。

### 验证数据

收集多样化的实例集合。它们可以存储在一个字典的可迭代集合中。例如，每个实例字典可以包含“问题”作为键和数学问题描述字符串作为值；以及“解决方案”作为键和解决方案字符串作为值。

### 评估函数

评估函数应该接受一个响应列表，并且对应于每个验证数据实例中的键的其他关键字参数作为输入，并输出一个度量字典。例如，

```python
def eval_math_responses(responses: List[str], solution: str, **args) -> Dict:
    # 从响应列表中选择一个响应
    answer = voted_answer(responses)
    # 检查答案是否正确
    return {"success": is_equivalent(answer, solution)}
```

`autogen.code_utils` 和 `autogen.math_utils` 提供了一些代码生成和数学问题解决的示例评估函数。

### 要优化的指标

通常要优化的指标是对所有调优数据实例的聚合度量。例如，用户可以指定“成功”作为度量和“最大”作为优化模式。默认情况下，聚合函数是取平均值。如果需要，用户可以提供自定义的聚合函数。

### 搜索空间

用户可以指定每个超参数的（可选）搜索范围。

1. model。要么是一个常量字符串，要么是由 `flaml.tune.choice` 指定的多个

选择。
1. prompt/messages。提示是一个字符串或字符串列表，消息是字典列表或列表列表，模板化的提示/消息。
每个提示/消息模板将与每个数据实例格式化。例如，提示模板可以是：
"{problem} Solve the problem carefully. Simplify your answer as much as possible. Put the final answer in \\boxed{{}}."
并且 `{problem}` 将被每个数据实例的“问题”字段替换。
1. max_tokens, n, best_of。它们可以是常量，或者由 `flaml.tune.randint`, `flaml.tune.qrandint`, `flaml.tune.lograndint` 或 `flaml.qlograndint` 指定。默认情况下，max_tokens 在 [50, 1000) 中搜索；n 在 [1, 100) 中搜索；best_of 固定为 1。
1. stop。它可以是一个字符串或字符串列表，或者是字符串列表的列表或 None。默认为 None。
1. temperature 或 top_p。其中一个可以被指定为常量或通过 `flaml.tune.uniform` 或 `flaml.tune.loguniform` 等指定。
请不要同时提供两者。默认情况下，每个配置将在 [0, 1] 中均匀选择温度或 top_p。
1. presence_penalty, frequency_penalty。它们可以是常量或由 `flaml.tune.uniform` 等指定。默认情况下不进行调整。

### 预算

可以指定推理预算和优化预算。
推理预算指的是每个数据实例的平均推理成本。
优化预算指的是调优过程中允许的总预算。两者都以美元计量，并遵循每 1000 个令牌的价格。

### 执行调优

现在，你可以使用 `autogen.Completion.tune` 进行调优。例如，

```python
import autogen

config, analysis = autogen.Completion.tune(
    data=tune_data,
    metric="success",
    mode="max",
    eval_func=eval_func,
    inference_budget=0.05,
    optimization_budget=3,
    num_samples=-1,
)
```

`num_samples` 是要采样的配置数量。-1 表示无限制（直到优化预算耗尽）。
返回的 `config` 包含优化后的配置，`analysis` 包含一个 ExperimentAnalysis 对象，用于所有尝试过的配置和结果。

调优后的配置可以用来执行推理。

### 执行推理

使用调优后的配置，可以执行推理以生成文本。例如，

```python
import autogen

# 使用优化后的配置生成文本
response = autogen.Completion.create(
    model=config["model"],
    prompt=config["prompt"],
    max_tokens=config["max_tokens"],
    temperature=config["temperature"],
    top_p=config["top_p"],
    n=config["n"],
    stop=config["stop"],
    presence_penalty=config["presence_penalty"],
    frequency_penalty=config["frequency_penalty"],
    best_of=config["best_of"],
)
```

在这个例子中，`config` 字典包含了调优过程中确定的最佳超参数值。这些值被用来设置 `autogen.Completion.create` 方法的参数，从而生成文本。

### 分析结果

`analysis` 对象提供了对调优过程的深入了解。可以使用它来检查不同配置的性能，找出最佳和最差的表现配置，以及它们的特定超参数值。例如，

```python
# 获取所有尝试过的配置和它们的性能
df = analysis.dataframe()

# 找出表现最好的配置
best_config = df[df["success"] == df["success"].max()]

# 找出表现最差的配置
worst_config = df[df["success"] == df["success"].min()]

# 分析不同超参数对成功率的影响
import matplotlib.pyplot as plt

plt.plot(df["temperature"], df["success"], 'o', label='Temperature vs Success')
plt.plot(df["top_p"], df["success"], 'x', label='Top P vs Success')
plt.legend()
plt.show()
```

这些代码片段提供了如何使用 `autogen` 库进行调优和推理的基本框架。它们可以根据具体的应用场景和需求进行调整和扩展。

### 总结

AutoGen 提供了一个强大的工具集，用于优化大型语言模型的推理过程。通过精细调整超参数，可以在保持成本效率的同时最大化模型的性能。调优和推理的集成方法使得从数据收集到模型部署的整个流程更加流畅和高效。