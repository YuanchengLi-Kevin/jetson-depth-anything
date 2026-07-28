---
tags:
  - evaluation
  - benchmarking
  - experiments
status: planning
---

# Evaluation Plan

## Experimental variables

### Runtime and precision

- PyTorch FP32
- PyTorch FP16
- ONNX Runtime, if supported and useful
- TensorRT FP16
- TensorRT INT8 as a stretch goal

### Input resolution

Begin with fixed, moderate resolutions such as:

- 448×448
- 518×518
- One lower-resolution performance setting
- One higher-resolution quality setting, if memory permits

### Device configuration

- Power mode
- Clock configuration
- Cooling condition
- Warm versus cold device state

## Metrics

### Performance

- Model inference time in milliseconds
- End-to-end camera latency in milliseconds
- Frames per second
- Preprocessing time
- Postprocessing time
- Visualization time

### Resource use

- GPU utilization
- CPU utilization
- RAM usage
- Power consumption
- Device temperature

### Depth quality

- Agreement between PyTorch and converted model outputs
- Accuracy on a selected depth dataset
- Error against measured distances or an RGB-D reference
- Temporal stability or frame-to-frame flicker
- Accuracy loss from FP16 or INT8

## Benchmark procedure

1. Fix the model, input resolution, camera source, and device power mode.
2. Warm up the model before measurement.
3. Run enough frames to obtain stable statistics.
4. Report the median and a tail-latency statistic, not only the mean.
5. Record inference time separately from end-to-end latency.
6. Monitor power and temperature throughout the run.
7. Repeat trials and retain raw data.
8. Change only one major variable at a time.

## Results table template

| Runtime | Precision | Resolution | Inference ms | End-to-end ms | FPS | RAM | Power | Temp |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| PyTorch | FP32 | TBD | | | | | | |
| PyTorch | FP16 | TBD | | | | | | |
| ONNX | FP16 | TBD | | | | | | |
| TensorRT | FP16 | TBD | | | | | | |
| TensorRT | INT8 | TBD | | | | | | |

## Depth-quality table template

| Runtime | Precision | Resolution | Accuracy metric | Temporal stability | Notes |
|---|---|---:|---:|---:|---|
| PyTorch | FP32 | TBD | | | Reference |
| PyTorch | FP16 | TBD | | | |
| TensorRT | FP16 | TBD | | | |
| TensorRT | INT8 | TBD | | | Stretch goal |

## Figures for the final report

- FPS versus input resolution
- End-to-end latency by pipeline stage
- Power versus FPS
- Temperature over time
- Depth quality versus inference speed
- Side-by-side qualitative depth maps

## Key interpretation

The fastest configuration is not automatically the best configuration. The final recommendation should balance responsiveness, depth quality, memory headroom, power, and thermal stability for the chosen application.

## Related notes

- [[Capstone Proposal]]
- [[Deployment Plan]]
- [[Risks and Limitations]]

