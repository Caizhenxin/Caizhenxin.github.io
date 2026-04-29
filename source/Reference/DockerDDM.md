# 🐳 DockerHDDM 命令生成器

> 一键生成 Docker 命令，零基础使用 HDDM 做数据分析。

## 这是什么？

这是一个简单的网页工具：你输入 Windows 文件夹路径，它自动生成可直接复制粘贴到 CMD 运行的 Docker HDDM 命令。

专为 **新手小白** 设计——不需要记 Docker 命令，不需要懂 Linux 路径转换。

## 快速开始

### 1. 打开网页

双击 `index.html`，用浏览器打开即可。

### 2. 输入路径

在输入框中粘贴你的数据文件夹路径，例如：

```
D:\GitHub_programe\GitHub\Self-Repo\AI_Docker_User
```

支持多种输入格式（自动识别转换）：

| 你输入的格式 | 自动转换为 |
|---|---|
| `D:\my\data` | `/d/my/data` |
| `"D:\my\data"` | `/d/my/data` |
| `D:/my/data` | `/d/my/data` |
| `C:\Users\me\data` | `/c/Users/me/data` |
| `/d/my/data` | `/d/my/data`（无需转换） |

### 3. 调整选项（可选）

- **CPU 核心数**：默认 4 核，可根据电脑配置调整
- **端口**：默认 8888，如果被占用可改为 8787 等
- **镜像版本**：默认 latest（推荐）

### 4. 点击"生成命令"

复制生成的命令。

### 5. 在 CMD 中运行

以 **管理员身份** 打开 CMD，粘贴命令并回车：

```
docker run -it --rm --cpus=4 -v /d/GitHub_programe/GitHub/Self-Repo/AI_Docker_User:/home/jovyan/work -p 8888:8888 hcp4715/hddm jupyter notebook
```

### 6. 打开 Jupyter

运行后会输出类似：

```
http://127.0.0.1:8888/?token=xxxxxxxxxxxxx
```

复制这个链接到浏览器打开，在 Jupyter 中找到 **work** 文件夹即可开始分析。

---

## 前置条件

- 已安装 [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- 已拉取镜像：`docker pull hcp4715/hddm`（首次使用）

---

## 命令解释

| 参数 | 含义 |
|---|---|
| `docker run` | 启动容器 |
| `-it` | 交互模式，可看到运行日志 |
| `--rm` | 容器退出后自动删除 |
| `--cpus=4` | 使用 4 个 CPU 核心 |
| `-v 本地:容器` | 挂载文件夹 |
| `-p 8888:8888` | 端口映射 |
| `hcp4715/hddm` | Docker 镜像 |
| `jupyter notebook` | 启动 Jupyter |

---

## 常见问题

**Q: 端口被占用了怎么办？**

把端口改成其他数字，如 `8787`、`8889`。注意生成的 URL 中也要把 `8888` 改成对应端口。

**Q: 提示权限不足？**

请以管理员身份运行 CMD。

**Q: 数据在哪里？**

在 Jupyter 中进入 **work** 文件夹，里面的内容就是你的本地文件夹。

**Q: 用完怎么关闭？**

直接关闭 CMD 窗口即可。因为使用了 `--rm` 参数，容器会自动清理，不会占用空间。

---

## 引用

- Wiecki, T. V., Sofer, I., & Frank, M. J. (2013). HDDM: Hierarchical Bayesian estimation of the Drift-Diffusion Model in Python. *Frontiers in Neuroinformatics*, 7.
- Pan, W., Geng, H., Zhang, L., Fengler, A., Frank, M. J., Zhang, R.-Y., & Chuan-Peng, H. (2025). dockerHDDM: A User-Friendly Environment for Bayesian Hierarchical Drift-Diffusion Modeling. *Advances in Methods and Practices in Psychological Science*, 8(1).

Docker 镜像: [hcp4715/hddm](https://hub.docker.com/r/hcp4715/hddm)
