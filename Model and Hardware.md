---
tags:
  - hardware
  - model-selection
  - jetson
status: planning
---

# Model and Hardware

## Target hardware

The Jetson Orin Nano Super provides:

- Ampere GPU
- 1,024 CUDA cores
- 32 Tensor Cores
- 8 GB shared LPDDR5 memory
- 102 GB/s memory bandwidth
- 25 W performance mode
- TensorRT FP16 acceleration

> [!note]
> Record the exact JetPack and TensorRT versions used in the experiments. TensorRT engines should be built directly on the target Jetson because compatibility depends on the hardware and software stack.

## Model selection

| Model | Parameters | Assessment |
|---|---:|---|
| Depth Anything V2 Small | 24.8M | Primary choice for real-time or near-real-time edge deployment |
| Depth Anything V2 Base | 97.5M | Possible comparison model, but slower and more memory-intensive |
| Depth Anything V2 Large | 335.3M | Not a sensible primary target for an 8 GB Nano |
| Depth Anything V2 Giant | 1.3B | Out of scope for this device |

## Decision

Use **Depth Anything V2 Small** as the primary model.

Reasons:

- Best chance of real-time or near-real-time performance
- Lower memory pressure
- More room for camera buffers, preprocessing, visualization, and the operating system
- More practical optimization and benchmarking scope for a capstone

## Initial configuration

- **Model:** Depth Anything V2 Small
- **Precision:** begin with FP32, then FP16
- **Resolution:** begin with a fixed 518×518, 448×448, or comparable input
- **Power mode:** use 25 W/MAXN for primary performance benchmarks
- **Cooling:** active cooling
- **Storage:** NVMe SSD preferred over microSD

## Configuration record

| Component | Version or model |
|---|---|
| Jetson board | Jetson Orin Nano Super, 8 GB |
| JetPack | TBD |
| CUDA | TBD |
| cuDNN | TBD |
| TensorRT | TBD |
| Python | TBD |
| PyTorch | TBD |
| ONNX | TBD |
| Camera | TBD |
| Storage | TBD |

## Related notes

- [[Deployment Plan]]
- [[Evaluation Plan]]

