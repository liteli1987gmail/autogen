# AutoGen 常见问题

## 设置你的 API 端点

有多种方法可以构建 LLM 处理的配置，包括在 `oai` 实用工具中:

- `get_config_list`: 从提供的 API 密钥生成用于 API 调用的配置，主要是从提供的 API 密钥生成的。
- `config_list_openai_aoai`: 使用 Azure OpenAI 和 OpenAI 端点构建配置列表，从环境变量或本地文件中获取 API 密钥。
- `config_list_from_json`: 从 JSON 结构中加载配置，可以从环境变量或本地 JSON 文件中加载，可以根据给定的条件过滤配置。
- `config_list_from_models`: 根据提供的模型列表创建配置，有助于针对特定模型而无需手动指定每个配置。
- `config_list_from_dotenv`: 从 `.env` 文件构建配置列表，提供了一种从单个文件中管理多个 API 配置和密钥的方式。

我们建议你查看此 [notebook](https://github.com/microsoft/autogen/blob/main/notebook/oai_openai_utils.ipynb) 以获取配置模型端点的完整代码示例。

### 在代理中使用构建的配置列表

确保在 LLM-based 代理的 `llm_config` 中包含 "config_list"。例如:
```python
assistant = autogen.AssistantAgent(
    name="assistant",
    llm_config={"config_list": config_list}
)
```

`llm_config` 在 LLM 处理的 [`create`](/docs/reference/oai/client#create) 函数中使用。当未提供 `llm_config` 时，代理将依赖于其他 openai 设置，例如 `openai.api_key` 或环境变量 `OPENAI_API_KEY`，这在你希望使用单个端点时也可以工作。你还可以通过以下方式明确指定:
```python
assistant = autogen.AssistantAgent(name="assistant", llm_config={"api_key": ...})
```

### 我可以使用非 OpenAI 模型吗?

是的。请参考 https://microsoft.github.io/autogen/blog/2023/07/14/Local-LLMs 以获取示例。

## 处理速率限制错误和超时错误

你可以通过设置 `max_retries` 来处理速率限制错误。你可以通过设置 `timeout` 来处理超时错误。它们都可以在代理的 `llm_config` 中指定，将在 LLM 处理的 OpenAI 客户端中使用。如果在 `config_list` 中设置了它们，则可以为不同的客户端设置不同的值。

- `max_retries` (int): 对于单个客户端，允许重试请求的总次数。
- `timeout` (int): 单个客户端的超时时间（以秒为单位）。

有关更多信息，请参考 [文档](/docs/Use-Cases/enhanced_inference#runtime-error)。

## 如何继续已完成的对话

当你调用 `initiate_chat` 时，默认情况下会重新开始对话。你可以使用 `send` 或 `initiate_chat(clear_history=False)` 来继续对话。

## 我们如何决定为每个代理使用哪个 LLM？可以使用多少个代理？我们如何决定组中有多少个代理？

每个代理都可以进行自定义。你可以使用 LLMs、工具或人类来操作每个代理。如果你为代理使用 LLM，则使用最适合其角色的 LLM。代理的数量没有限制，但从小数量（如 2、3）开始。LLM 能力越强，所需角色越少。

默认的用户代理代理不使用 LLM。如果你想在 UserProxyAgent 中使用 LLM，则可以模拟用户的行为。默认的助理代理指示同时使用代码和语言功能。它不是必须进行编码，这取决于任务。你可以自定义系统消息。因此，如果你想将其用于编码，请使用适当的代码模板。

## 为什么代码不保存为文件？

如果你正在为代码代理进行自定义消息处理，包含以下内容:
`如果你希望用户在执行之前将代码保存到文件中，请在代码块中的第一行中添加 # filename: <filename>。`
此行在 `AssistantAgent` 的默认系统消息中。
如果建议的代码中没有出现 `# filename`，请考虑在 `initiate_chat` 的初始用户消息中添加明确的指示，例如 "将代码保存到硬盘"。
默认情况下，`AssistantAgent` 不会保存所有代码，因为有些情况下，只需要完成任务而不保存代码。

## 代码执行

我们强烈建议使用 Docker 执行代码。有两种使用 Docker 的方式:

1. 在 Docker 容器中运行 autogen。例如，在 GitHub codespace 中进行开发时，autogen 在 Docker 容器中运行。
2. 在 Docker 之外运行 autogen，并同时使用 Docker 容器执行代码。对于此选项，请确保已安装 Python 包 `docker`。当未安装 `docker` 并且在 `code_execution_config` 中省略了 `use_docker` 时，代码将在本地执行（此行为可能会在将来修改）。

### 启用 Python 3 Docker 镜像

你可能希望覆盖用于代码执行的默认 Docker 镜像。为此，请将 `use_docker` 属性的值设置为镜像的名称。例如:
```python
user_proxy = autogen.UserProxyAgent(
    name="agent",
    human_input_mode="TERMINATE",
    max_consecutive_auto_reply=10,
    code_execution_config={"work_dir": "_output", "use_docker": "python:3"},
    llm_config=llm_config,
    system_message=""""Reply TERMINATE if the task has been solved at full satisfaction.
Otherwise, reply CONTINUE, or the reason why the task is not solved yet."""
)
```

如果你在运行 `pip install` 时遇到问题或出现类似于 `Error while fetching server API version: ('Connection aborted.', FileNotFoundError(2, 'No such file or directory')` 的错误，你可以选择 **'python: 3'** 作为镜像，如上面的代码示例所示，这应该可以解决问题。

### 使用 `gpt-3.5-turbo` 时，代理继续不停谢

使用 `gpt-3.5-turbo` 时，你可能经常遇到代理进入“感激循环”的情况，这意味着当它们完成任务时，它们将开始在连续的回合中互相致谢和赞赏。这是 `gpt-3.5-turbo` 特性的限制，与 `gpt-4` 相比，后者在记住指令方面没有问题。这可能会阻碍你尝试使用更便利的模型测试自己的实例体验。解决方法是向提示中添加额外的终止通知。这是对 LLM 的“小提示”，提醒它们在任务完成时停止对话。你可以通过将以下字符串附加到用户输入字符串来实现:
```python
prompt = "Some user query"

termination_notice = (
    'Do not show appreciation in your responses, say only what is necessary. '
    'if "Thank you" or "You're welcome" are said in the conversation, then say TERMINATE '
    'to indicate the conversation is finished and this is your last message.'
)

prompt += termination_notice
```

**注意**: 这种解决方法在大约 90% 的情况下都能解决问题，但有时 LLM 仍会忘记终止对话。

## 由于 sqlite3 的旧版本，ChromaDB 在 codespaces 中失败

（来自 [issue #251](https://github.com/microsoft/autogen/issues/251)）

在 codespaces 中，使用 ChromaDB（如检索）的示例代码会因为 sqlite3 的要求而失败。
```
>>> import chromadb
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/home/vscode/.local/lib/python3.10/site-packages/chromadb/__init__.py", line 69, in <module>
    raise RuntimeError(
RuntimeError: Your system has an unsupported version of sqlite3. Chroma requires sqlite3 >= 3.35.0.
Please visit https://docs.trychroma.com/troubleshooting#sqlite to learn how to upgrade.
```

解决方法:
1. `pip install pysqlite3-binary`
2. `mkdir /home/vscode/.local/lib/python3.10/site-packages/google/colab`

说明:
根据 [此 gist](https://gist.github.com/defulmere/8b9695e415a44271061cc8e272f3c300?permalink_comment_id=4711478#gistcomment-4711478),（链接到官方的 [chromadb 文档](https://docs.trychroma.com/troubleshooting#sqlite)），添加此文件夹将触发 chromadb 使用 pysqlite3 而不是默认的 sqlite3。
