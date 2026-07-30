---
tags:
  - risks
  - limitations
  - depth-anything-v3
  - multi-view
  - 3d-reconstruction
status: planning
---

# Risks and Limitations

## DA3 Small geometry is relative

The primary checkpoint is the any-view DA3 Small model. According to the official [model table](https://github.com/ByteDance-Seed/Depth-Anything-3#-model-cards), it supports relative depth and camera-pose estimation but not metric depth.

> [!warning]
> Raw DA3 Small coordinates are arbitrary internal units, not guaranteed metres.

One independently measured 1.0 m reference segment supplies a global scale for target-final reporting. This cannot correct local shape error, nonlinear depth bias, pose drift, or registration error. The scale reference must be separate from the evaluation doorway.

## Window coherence is not global coherence

DA3 predicts coherent geometry inside a supplied window, but every new window can differ by scale, rotation, and translation. A poor Sim(3) estimate can duplicate surfaces, bend the room, create thick walls, or corrupt every later window. The authoritative alignment rules are in [[Window Alignment and Mapping]].

## Primary risks

| Risk | Likely effect | Mitigation |
|---|---|---|
| DA3 package or XFormers incompatibility | Installation or inference failure | Begin with [[Jetson Platform and Feasibility]] and record the exact stack |
| Multi-view activations exceed memory | Out-of-memory failure | Use the locked primary/fallback decision and one active inference |
| Official streaming configuration is too large | Schedule lost porting an unsuitable pipeline | Keep it optional; use small custom windows |
| Arbitrary model scale | Physically incorrect dimensions | Preserve raw output and apply the independent scale reference |
| Scale changes between windows | Expanding or shrinking map | Estimate and gate Sim(3); reject weak alignments |
| Incorrect extrinsic convention | Mirrored or divergent geometry | Validate world-to-camera inversion on one window |
| Predicted intrinsics fluctuate | Window shape and alignment variation | Log them per window and report variation |
| Too little motion | Degenerate pose or scale | Move slowly while maintaining useful parallax |
| Too much motion or little overlap | Too few correspondences | Select at approximately 2 Hz and retain two shared frames |
| Blur, low texture, or exposure change | Poor depth and pose | Lock exposure where possible and use a textured room |
| Reflective, transparent, or dynamic objects | Ghost geometry | Keep the primary scene controlled |
| Confidence filtering removes useful points | Sparse map | Visualize retained points and report density |
| Preprocessing changes between shared frames | Invalid same-pixel correspondences | Reuse identical frames, resolution, resize mode, and pixel grid |
| RANSAC accepts a bad transform | Persistent global corruption | Apply every gate in [[Window Alignment and Mapping]] |
| Rejected window advances state | Broken trajectory and map | Add neither points nor poses and retain the last accepted overlap |
| Drift across accepted windows | Misaligned distant views | Limit the map and keep loop closure as stretch work |
| Capture outruns inference | Stale results and queue growth | Bound the pending window and replace stale new candidates |
| Thermal throttling | Increasing latency | Use active cooling and the sustained-run protocol |
| Manual scale or doorway endpoints are inaccurate | Measurement bias | Use a rigid reference and document every endpoint |

## Official streaming limitation

The official [DA3-Streaming documentation](https://github.com/ByteDance-Seed/Depth-Anything-3/blob/main/da3_streaming/README.md) reports more than 11 GB for its published 30-frame KITTI configuration and substantially more for TUM RGB-D. Its speed results use an A100, not an Orin Nano. These results demonstrate long-sequence streaming on larger GPUs, not feasibility on this target.

## Pose and reconstruction limitation

DA3 camera poses are model predictions, not ground truth or a complete SLAM system. The primary pipeline has no required loop closure, relocalization, bundle adjustment, or pose graph. The output must be described as a bounded incremental local reconstruction.

## Validity threats

- One room does not demonstrate general indoor performance.
- Slow, high-overlap motion does not characterize rapid handheld movement.
- The fallback and primary configurations have different temporal behavior.
- No ground-truth trajectory means overlap residual is not absolute pose error.
- Both sides of overlap alignment come from DA3, so low residual can coexist with biased geometry.
- Manual scale-reference and doorway selection introduce measurement error.
- One reference length removes only global scale ambiguity.
- A 30-window cap does not demonstrate long-term global consistency.
- A 15-minute run does not prove indefinite stability.
- Average update rate can hide p95 stalls and rejected windows.
- One JetPack stack does not establish compatibility with other releases.

## Controls

1. Freeze the camera mode, checkpoint revision, resolution, resize mode, and precision before evaluation.
2. Keep development footage separate from the untouched evaluation sweep.
3. Preserve exact frame identifiers for overlap.
4. Log every inference and alignment failure.
5. Apply the same alignment gates to every evaluation window.
6. Save raw relative outputs before scale alignment.
7. Use a scale reference separate from the doorway.
8. Report p50 and p95 latency and update interval.
9. Log memory, point count, power, and temperature.
10. Report whether the primary or fallback configuration was required.

## Scope controls

- Use DA3 Small as the only required learned model.
- Complete one-window geometry before window registration.
- Complete two-window registration before recorded reconstruction.
- Complete recorded reconstruction before live integration.
- Use one small, mostly static room and slow, high-overlap motion.
- Enforce the approved window, memory, alignment, and map limits.
- Do not claim metric geometry before independent scaling.
- Do not add navigation, detection, or obstacle-warning logic.
- Treat TensorRT, C++/GGML, official DA3-Streaming, ray pose as primary, ICP, loop closure, pose graphs, metric/nested DA3, V2 baselines, TSDF, meshing, semantics, Gaussian splatting, and multi-room mapping as stretch work.

## Related notes

- [[Capstone Proposal]]
- [[System Architecture]]
- [[Jetson Platform and Feasibility]]
- [[Evaluation Plan]]
