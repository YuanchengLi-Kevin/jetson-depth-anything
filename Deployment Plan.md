---
tags:
  - deployment
  - tensorrt
  - onnx
status: planning
---

# Deployment Plan

## Target pipeline

```text
USB/CSI camera
    → frame capture
    → resize and normalize
    → Depth Anything V2 Small inference
    → depth postprocessing
    → visualization or obstacle logic
    → display / ROS 2 output
```

Each stage should be timed separately so that faster model inference is not hidden by slow capture, preprocessing, or visualization.

## Phase 1 — Environment and baseline

- [ ] Install and record the JetPack software stack
- [ ] Configure active cooling and the intended power mode
- [ ] Clone or install the official Depth Anything V2 implementation
- [ ] Run inference on one image
- [ ] Run inference on recorded video
- [ ] Measure PyTorch FP32 inference
- [ ] Measure PyTorch FP16 inference

## Phase 2 — Live camera application

- [ ] Connect and validate the USB or CSI camera
- [ ] Implement frame capture
- [ ] Add model preprocessing
- [ ] Add depth-map postprocessing and visualization
- [ ] Measure end-to-end latency
- [ ] Add per-stage timing

## Phase 3 — ONNX export

- [ ] Export the Small model to ONNX
- [ ] Start with a fixed input shape
- [ ] Validate ONNX outputs against PyTorch
- [ ] Inspect unsupported or rewritten operators
- [ ] Benchmark ONNX inference if a suitable runtime is available

## Phase 4 — TensorRT FP16

- [ ] Build the engine directly on the Jetson
- [ ] Enable FP16
- [ ] Use a fixed shape for the initial engine
- [ ] Validate TensorRT output against PyTorch
- [ ] Integrate the engine into the camera pipeline
- [ ] Benchmark inference and end-to-end performance

## Phase 5 — Application demonstration

Primary option:

- Convert relative depth into near/middle/far regions.
- Detect whether a close region occupies a dangerous portion of the image.
- Produce a visual or audible obstacle warning.

Alternative options:

- Indoor navigation assistance
- Terrain or traversability visualization
- ROS 2 depth-image publishing
- Depth-aware object detection

## Stretch phase — INT8

- [ ] Select a representative calibration dataset
- [ ] Build an INT8 engine
- [ ] Quantify speed and memory changes
- [ ] Quantify loss of depth quality
- [ ] Decide whether INT8 is worthwhile

## Reproducibility artifacts

- Environment and package versions
- Export and engine-build commands
- Fixed test inputs
- Benchmark scripts and raw results
- Camera and power-mode configuration
- Notes on failed conversions and workarounds

## Related notes

- [[Model and Hardware]]
- [[Evaluation Plan]]
- [[Risks and Limitations]]

