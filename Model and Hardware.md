---
tags:
  - hardware
  - model-selection
  - jetson
  - 3d-reconstruction
status: planning
---

# Model and Hardware

## Target hardware

The [Jetson Orin Nano Super Developer Kit](https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/) provides:

- NVIDIA Ampere GPU with 1,024 CUDA cores and 32 Tensor Cores
- 8 GB of 128-bit LPDDR5 shared memory
- 102 GB/s memory bandwidth
- 7 W, 15 W, and 25 W module power modes
- Up to 17 FP16 TFLOPS in the Super configuration

The primary experiments will use active cooling and 25 W mode. A focused efficiency comparison will repeat the default reconstruction in 15 W mode.

## Depth model selection

The [Depth Anything V2 repository](https://github.com/DepthAnything/Depth-Anything-V2) provides relative-depth models at several scales. The separate [metric-depth implementation](https://github.com/DepthAnything/Depth-Anything-V2/tree/main/metric_depth) provides Small, Base, and Large checkpoints fine-tuned for indoor or outdoor depth.

| Model | Parameters | Assessment for this project |
|---|---:|---|
| Metric Depth Anything V2 Small | 24.8M | Primary model; best fit for an 8 GB device and live reconstruction |
| Metric Depth Anything V2 Base | 97.5M | Possible quality comparison, but not required |
| Metric Depth Anything V2 Large | 335.3M | Too costly for the primary live pipeline |

## Locked model configuration

- **Checkpoint:** Depth Anything V2 Small, indoor metric model
- **Training domain:** Hypersim indoor scenes
- **Checkpoint maximum depth:** 20 m
- **Pipeline depth range:** 0.3-8.0 m
- **Reference runtime:** PyTorch FP32
- **Development runtime:** PyTorch FP16
- **Target runtime:** TensorRT FP16
- **Primary input size:** 518×518
- **Performance alternative:** 392×392
- **Batch size:** 1

Raw floating-point depth in metres must be retained for projection, tracking, fusion, and evaluation. Color-mapped depth is for visualization only.

## Camera requirements

The selected USB or CSI RGB camera must:

- Operate reliably at a fixed resolution supported by the Jetson
- Allow focus and exposure to be locked where the hardware permits
- Be rigidly mounted during calibration
- Use the same image mode for calibration, data collection, and live reconstruction
- Provide timestamps or allow host timestamps to be recorded consistently

Calibration will use OpenCV's pinhole camera model and an accurately measured checkerboard. The saved calibration record must contain:

- Image width and height
- Camera matrix: `fx`, `fy`, `cx`, and `cy`
- Distortion coefficients
- Checkerboard dimensions and square size
- Per-image and mean reprojection error
- Date, camera identifier, focus setting, and capture mode

The mean reprojection error must be below 0.5 pixels. Frames will be undistorted before depth prediction, odometry, and back-projection. Intrinsics must be scaled whenever processing resolution changes.

## Point-cloud and fusion configuration

- **Projection model:** calibrated pinhole camera
- **Live TSDF voxel size:** 0.02 m
- **Comparison voxel size:** 0.04 m
- **TSDF truncation distance:** 0.08 m
- **Maximum fused keyframes:** 300
- **Primary scene:** one small indoor room
- **Displayed point-cloud refresh:** 1-2 Hz

For a pixel `(u, v)` with valid predicted depth `Z`, back-project using:

```text
X = (u - cx) × Z / fx
Y = (v - cy) × Z / fy
Z = predicted metric depth
```

Invalid, non-finite, and out-of-range depths must be rejected before point-cloud creation.

## Open3D on Jetson

[Open3D ARM64 support](https://www.open3d.org/docs/0.18.0/arm.html) includes standard Jetson-compatible wheels and GUI support when full OpenGL is available. The ARM64 pip wheel does not include CUDA support. Therefore:

- CPU Open3D is the baseline for odometry, TSDF fusion, extraction, and visualization.
- TensorRT uses the Jetson GPU for depth inference.
- A CUDA-enabled Open3D source build is optional only after the CPU pipeline is correct.
- CPU/GPU memory use must be logged because the board has 8 GB of shared memory.

## Software and hardware record

| Component | Version or model |
|---|---|
| Jetson board | Jetson Orin Nano Super, 8 GB |
| JetPack | TBD |
| Jetson Linux | TBD |
| CUDA | TBD |
| cuDNN | TBD |
| TensorRT | TBD |
| Python | TBD |
| PyTorch | TBD |
| ONNX | TBD |
| OpenCV | TBD |
| Open3D | TBD |
| Camera | TBD |
| Capture mode | TBD |
| Storage | TBD |
| Cooling | Active |

TensorRT engines will be built on the target Jetson. By default, serialized engines depend on the platform, device type, and TensorRT environment, as described in NVIDIA's [engine compatibility documentation](https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/engine-compatibility.html).

## Related notes

- [[Deployment Plan]]
- [[Evaluation Plan]]
- [[Risks and Limitations]]
