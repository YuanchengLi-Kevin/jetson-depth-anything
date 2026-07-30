---
tags:
  - jetson
  - hardware
  - feasibility
  - deployment
  - depth-anything-v3
status: planning
---

# Jetson Platform and Feasibility

## Target hardware

The [Jetson Orin Nano Super Developer Kit](https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost/) provides:

- NVIDIA Ampere GPU with 1,024 CUDA cores and 32 Tensor Cores
- 8 GB of 128-bit LPDDR5 shared memory
- 102 GB/s memory bandwidth
- 7 W, 15 W, and 25 W module power modes
- Up to 17 FP16 TFLOPS in the Super configuration

Use active cooling and 25 W mode. CPU and GPU share the same 8 GB, so the feasibility gate limits observed usage to 7.0 GB and reserves at least 1 GB for capture, point clouds, visualization, and operating-system services.

## Software constraint

The official [DA3 installation](https://github.com/ByteDance-Seed/Depth-Anything-3#-quick-start) requires PyTorch 2 or newer and lists XFormers. Jetson ARM64, JetPack, CUDA, PyTorch, and attention-backend compatibility must be demonstrated rather than assumed.

Install only the basic point-cloud path:

- Official Depth Anything 3 repository
- DA3 Small checkpoint
- PyTorch, torchvision, and a supported attention implementation
- OpenCV
- NumPy/SciPy or equivalent alignment tools
- CPU Open3D

Do not require `gsplat`, Gradio, DA3 Giant, or the large official streaming stack.

## Feasibility procedure

1. Load DA3 Small once and retain it on the GPU.
2. Warm up with one 2-frame FP16 window at 336 px.
3. Run five 4-frame FP16 windows at 336 px.
4. Record completion, latency, peak unified memory, and unsupported operators.

Use this decision:

1. Lock **4 frames, 2-frame overlap, 336 px** if all five windows complete below 7.0 GB.
2. Otherwise test **3 frames, 2-frame overlap, 280 px** using the same five-window and 7.0 GB rule.
3. If both fail, stop live implementation and document DA3 Small as infeasible on the available stack.

Do not test larger configurations after the primary passes.

## Software roles

- **Depth Anything 3:** window-local relative depth, confidence, intrinsics, and camera poses
- **PyTorch/CUDA:** FP16 inference
- **OpenCV:** calibration, capture, undistortion, and image diagnostics
- **NumPy/SciPy or equivalent:** RANSAC Sim(3) and Umeyama refinement
- **Open3D CPU:** point-cloud filtering, downsampling, display, and PLY I/O
- **`tegrastats`:** memory, processor, power, and temperature telemetry

## Software and hardware record

| Component | Version or model |
|---|---|
| Jetson board | Jetson Orin Nano Super, 8 GB |
| JetPack | TBD |
| Jetson Linux | TBD |
| CUDA | TBD |
| cuDNN | TBD |
| Python | TBD |
| PyTorch | TBD |
| torchvision | TBD |
| XFormers or fallback attention | TBD |
| Depth Anything 3 commit | TBD |
| DA3 Small checkpoint revision | TBD |
| OpenCV | TBD |
| Open3D | TBD |
| Camera | TBD |
| Capture mode | TBD |
| Storage | TBD |
| Cooling | Active |

## Official streaming context

The official [DA3-Streaming documentation](https://github.com/ByteDance-Seed/Depth-Anything-3/blob/main/da3_streaming/README.md) reports published memory above 11 GB even for its 30-frame KITTI configuration. Its speed results use an A100. The project borrows overlapping windows but does not treat that configuration as evidence of Orin Nano feasibility.

## Optional optimization

Only after the PyTorch pipeline succeeds:

- Test `use_ray_pose=True` under the same memory and update-rate limits
- Investigate TensorRT or C++/GGML deployment
- Investigate a reduced DA3-Streaming configuration
- Keep ICP, loop closure, and pose-graph optimization as stretch work

## Related notes

- [[DA3 Model and Outputs]]
- [[Deployment Roadmap]]
- [[Test Protocols]]
- [[Risks and Limitations]]
