---
tags:
  - risks
  - limitations
  - depth-estimation
  - 3d-reconstruction
status: planning
---

# Risks and Limitations

## Metric depth is predicted, not measured

The project uses the separately fine-tuned indoor metric checkpoint from the [Depth Anything V2 metric-depth implementation](https://github.com/DepthAnything/Depth-Anything-V2/tree/main/metric_depth). Its output is expressed in metres, but it remains a learned monocular prediction and may be biased by scene content, camera intrinsics, field of view, lighting, or domain shift.

> [!warning]
> The reconstruction is not survey-grade and must not be presented as guaranteed physical ground truth.

Metric claims will be limited to the measured-distance and room-geometry protocols in [[Evaluation Plan]].

## Error accumulation

A plausible single depth map does not guarantee a consistent reconstruction. The system combines several error sources:

```text
camera calibration
    → depth scale and shape
    → frame-to-frame pose
    → keyframe selection
    → TSDF fusion
    → accumulated geometry
```

Bias or temporal changes in predicted depth can distort RGB-D odometry. Pose errors then misalign later frames, causing duplicated walls, thick surfaces, bending, holes, ghost geometry, or scale drift.

## Primary risks

| Risk | Likely effect | Mitigation |
|---|---|---|
| Incorrect intrinsics or distortion | Warped scale and failed alignment | Calibrate the final camera mode; require reprojection error below 0.5 px |
| Intrinsics not scaled after resize | Systematic projection and tracking error | Scale `fx`, `fy`, `cx`, and `cy` with image dimensions |
| Metric-depth domain shift | Incorrect room scale or object geometry | Validate 0.5-4.0 m distances and measured room dimensions |
| Temporal depth inconsistency | Noisy poses and thick fused surfaces | Move slowly, require overlap, filter depth, and fuse keyframes |
| Low-texture surfaces | Odometry failure | Test separately; increase overlap and use geometric constraints |
| Reflective or transparent objects | False depth and ghost geometry | Document failure regions and exclude them from headline plane fits |
| Dynamic objects | Moving geometry fused into the static map | Use a controlled room and avoid people during primary trials |
| Motion blur or exposure changes | Tracking loss | Lock exposure when possible and use slow trajectories |
| Incorrect coordinate convention | Mirrored or inverted point cloud | Validate axes and known dimensions before fusion |
| Failed pose fused as identity | Severe map corruption | Log failures and never integrate rejected frames |
| Accumulated odometry drift | Misaligned loop and duplicated structures | Bound the map, report closure error, keep loop closure as stretch work |
| Open3D ARM64 CPU performance | Low tracking or fusion rate | Decouple stages, drop stale frames, reduce resolution, fuse keyframes only |
| Open3D CUDA build complexity | Schedule delay | Use the supported CPU wheel first; treat CUDA build as optional |
| Shared 8 GB memory pressure | OOM or degraded performance | Use Small model, bounded queues, 300-keyframe limit, and memory logging |
| Thermal throttling | Performance decay during long runs | Use active cooling and log the 15-minute sustained test |
| TensorRT output differences | Geometry degradation | Compare raw depth and reconstructed geometry with PyTorch |
| TensorRT engine incompatibility | Engine fails after stack change | Build on target and record exact versions; see [NVIDIA compatibility guidance](https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/engine-compatibility.html) |

## Open3D tracking limitation

The primary implementation uses Open3D RGB-D odometry and a bounded local map. Open3D notes that its dense reconstruction tracking is not fully optimized for accuracy and does not include relocalization in the standard pipeline. The system should therefore be described as local reconstruction rather than full SLAM.

If pose success remains below 80% after calibration, alignment, overlap, and Open3D parameter checks, the planned fallback is ORB-SLAM3 in RGB-D mode. [ORB-SLAM3](https://arxiv.org/abs/2007.11898) supports RGB-D SLAM and map reuse, but its integration is additional work and loop closure remains a stretch goal.

## Validity threats

- Measuring only visually clean regions would understate reconstruction error.
- Tuning and evaluating on the same sequence would overstate tracking reliability.
- Comparing different camera motions across configurations would confound runtime and quality.
- Manual point-cloud measurements can introduce endpoint-selection error.
- A single room does not demonstrate general indoor performance.
- Three repeated trajectories do not characterize all handheld motion.
- Surface-completeness scoring is project-defined and partly subjective.
- PyTorch FP32 is a conversion reference, not physical ground truth.
- Short tests can hide memory growth and thermal throttling.
- Average FPS can hide tail latency and dropped frames.

## Controls

1. Freeze camera calibration and capture settings before comparative experiments.
2. Use the same recorded sequence for controlled configuration comparisons.
3. Separate development sequences from final evaluation sequences.
4. Change one experimental variable at a time.
5. Retain failed frames, tracking status, raw timings, and telemetry.
6. Annotate measurement regions and publish the measurement procedure.
7. Report median and p95 latency, not only averages.
8. Run a 15-minute sustained test.
9. Keep the stress sequence separate from normal-condition headline results.

## Scope controls

- Complete per-frame metric point clouds before odometry.
- Complete reproducible offline fusion before live fusion.
- Use one small indoor room and at most 300 keyframes.
- Keep 2 cm TSDF voxels and 518×518 TensorRT FP16 as the default.
- Do not add navigation, object detection, or obstacle-warning logic.
- Treat CUDA Open3D, ORB-SLAM3 loop closure, RGB-D reference scans, and multi-room mapping as stretch work.

## Related notes

- [[Evaluation Plan]]
- [[Deployment Plan]]
- [[Model and Hardware]]
