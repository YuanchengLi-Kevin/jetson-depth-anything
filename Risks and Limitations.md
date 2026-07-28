---
tags:
  - risks
  - limitations
  - depth-estimation
status: planning
---

# Risks and Limitations

## Relative depth is not physical distance

Depth Anything’s default output is generally **relative depth**. It can indicate that one region is closer than another, but its numerical output should not automatically be interpreted as metres.

> [!warning]
> Do not claim metric distance from the general model without a calibration or validation method.

Depth Anything V2 also has separately fine-tuned metric-depth models. Their accuracy still needs to be evaluated for the actual camera, scene type, and operating environment.

### Practical responses

- Frame the first demonstration as relative-depth obstacle detection.
- Divide depth into near, middle, and far regions.
- If metric depth is required, calibrate against known distances.
- Compare with a stereo or RGB-D camera.
- Evaluate a metric-depth checkpoint separately from the general model.

## Deployment risks

| Risk | Likely effect | Mitigation |
|---|---|---|
| Unsupported ONNX operators | Export or conversion failure | Test export early; simplify or replace unsupported operations |
| Dynamic-shape complexity | TensorRT build or runtime issues | Begin with one fixed input shape |
| ARM package incompatibility | Installation delays | Use JetPack-compatible packages and containers where appropriate |
| Preprocessing bottleneck | Low end-to-end FPS despite fast inference | Time every pipeline stage and optimize memory transfers |
| Visualization bottleneck | Misleading performance result | Benchmark with and without display |
| TensorRT output differences | Reduced depth quality | Compare outputs against the PyTorch reference |
| Memory pressure | Crashes or swapping | Use the Small model and moderate fixed resolutions |
| Thermal throttling | Performance decay during long runs | Use active cooling and log temperature over time |
| Engine incompatibility | Engine fails on another stack | Build the TensorRT engine on the target Jetson |
| Camera latency | Poor responsiveness | Measure capture latency separately and limit buffering |

## Scope risks

- Starting with a large model could consume time without improving the final demonstration.
- Pursuing INT8 before FP16 is stable could delay the core deliverable.
- Attempting metric depth, ROS 2, object detection, and navigation at once would dilute the evaluation.

## Scope controls

1. Make Small + TensorRT FP16 the core project.
2. Finish reproducible benchmarking before stretch goals.
3. Select one practical demonstration.
4. Treat INT8, ROS 2, and metric calibration as optional extensions.

## Validity threats

- A short benchmark may hide thermal throttling.
- Average FPS may hide high tail latency.
- Comparing different resolutions across runtimes would be unfair.
- Qualitative depth maps alone cannot establish accuracy.
- A single scene or lighting condition may not represent real use.
- Camera auto-exposure changes may affect temporal consistency.

## Related notes

- [[Evaluation Plan]]
- [[Deployment Plan]]
- [[Model and Hardware]]
