# AutoGen 安装

## 设置 AutoGen 虚拟环境

当不使用 docker 容器时，我们建议使用虚拟环境来安装 AutoGen。这将确保 AutoGen 的依赖与你系统的其余部分隔离开来。

### 选项 1：venv

你可以使用以下命令创建一个虚拟环境：


```bash
python3 -m venv pyautogen
source pyautogen/bin/activate
```

以下命令将停用当前的 venv 环境：

```bash
deactivate
```

### 选项 2：conda

另一种选择是使用 Conda。Conda 在解决依赖冲突方面比 pip 更好。你可以按照 [此文档](https://docs.conda.io/projects/conda/en/stable/user-guide/install/index.html) 安装 Conda，然后使用以下命令创建一个虚拟环境：

```bash

conda create -n pyautogen python=3.10  # 推荐使用Python 3.10，因为它稳定且不太旧
conda activate pyautogen
```


以下命令将停用当前的 conda 环境：

```bash
conda deactivate
```

你现在可以在刚刚创建的虚拟环境中安装 AutoGen 了。

## Python

AutoGen 要求**Python 版本 >= 3.8 且 < 3.12**。可以通过 pip 安装它：
```bash

pip install pyautogen
```
`pyautogen<0.2` 需要 `openai<1`。从 pyautogen v0.2 开始，需要 `openai>=1`。

or conda:
```
conda install pyautogen -c conda-forge
```

### 迁移指南至 v0.2

openai v1 是该库的一次全面重写，有许多重大变化。例如，处理需要实例化一个客户端，而不是使用全局类方法。因此，`pyautogen<0.2` 的用户需要进行一些更改。

- `api_base` -> `base_url`，`request_timeout` -> `timeout` 在 `llm_config` 和 `config_list` 中。`max_retry_period` 和 `retry_wait_time` 已弃用。每个客户端可以设置 `max_retries`。
- MathChat 和 TeachableAgent 在未来的版本中将不再支持，直到经过测试。
- 处理参数调优和处理日志记录功能目前在 `OpenAIWrapper` 中不可用。日志记录将在未来的版本中添加。可以通过 [`flaml.tune`](https://microsoft.github.io/FLAML/docs/Use-Cases/Tune-User-Defined-Function) 进行参数调优。
- `use_cache` 已从 `OpenAIWrapper.create()` 的 kwarg 中移除，因为它由 `seed`：int | None 自动决定。

### 可选依赖
* docker

为了获得最佳的用户体验和无缝的代码执行，我们强烈建议在 AutoGen 中使用 Docker。Docker 是一个容器化平台，简化了代码的配置和执行。在 docker 容器中开发，例如 GitHub Codespace，也使开发变得更加方便。

当在 docker 容器之外运行 AutoGen 并使用 docker 进行代码执行时，你还需要安装 python 包 `docker`：
```bash

pip install docker
```

* blendsearch

`pyautogen<0.2` 提供了一种经济高效的超参数优化技术 [EcoOptiGen](https://arxiv.org/abs/2303.04673) 用于调整大型语言模型。请使用 [blendsearch] 选项进行安装。

```bash

pip install "pyautogen[blendsearch]<0.2"
```

示例笔记本：$[为代码生成进行优化](https://github.com/microsoft/autogen/blob/main/notebook/oai_completion.ipynb),
[为数学进行优化](https://github.com/microsoft/autogen/blob/main/notebook/oai_chatgpt_gpt4.ipynb)

* retrievechat

`pyautogen<0.2` 支持检索增强生成任务，例如问答和代码生成。请使用 [retrievechat] 选项进行安装。

```bash

pip install "pyautogen[retrievechat]<0.2"
```

示例笔记本：[使用检索增强代码生成和问答](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_RetrieveChat.ipynb),
[使用检索增强生成进行群聊（5 个群成员代理和 1 个管理员代理）](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_groupchat_RAG.ipynb)

* mathchat

`pyautogen<0.2` 提供了一个用于解决数学问题的可扩展性实现。请使用 [mathchat] 选项进行安装。
```bash

pip install "pyautogen[mathchat]<0.2"```

示例笔记本：$[使用 MathChat 解决数学问题](https://github.com/microsoft/autogen/blob/main/notebook/agentchat_MathChat.ipynb)

