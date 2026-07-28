---
tags:
  - capstone
  - proposal
  - edge-ai
status: draft
---

# Capstone Proposal

## Working title

**Optimizing Depth Anything V2 for Real-Time Monocular Depth Estimation on the Jetson Orin Nano Super**

## Project summary

This project will deploy Depth Anything V2 Small on a Jetson Orin Nano Super for live monocular depth estimation. It will compare an unoptimized PyTorch implementation with an edge-optimized TensorRT FP16 implementation and quantify the trade-offs among speed, latency, resource use, power consumption, and depth quality.

The final system will accept video from a USB or CSI camera, generate stable depth maps, and use them in a simple obstacle-warning or navigation demonstration.

## Motivation

Monocular depth estimation can add spatial awareness to systems that have only a conventional RGB camera. Running it at the edge avoids dependence on cloud connectivity and can reduce latency, but it introduces strict constraints on compute, memory, power, and thermal performance.

The project is therefore not merely about running one image through a pretrained model. Its central engineering problem is adapting and evaluating a transformer-based vision model on a resource-constrained embedded platform.

## Research question

> How effectively can Depth Anything V2 be optimized for real-time monocular depth estimation on a resource-constrained edge platform?

## Objectives

1. Deploy Depth Anything V2 Small on the Jetson Orin Nano Super.
2. Establish PyTorch FP32 and FP16 performance baselines.
3. Export and optimize the model using ONNX and TensorRT FP16.
4. Build a live camera pipeline with independently timed stages.
5. Measure performance, resource use, power, thermals, and depth quality.
6. Demonstrate a practical use of the resulting depth stream.
7. Explain the accuracy–speed trade-offs introduced by optimization.

## Scope

### Minimum viable result

- Live camera input on the Jetson
- Stable depth-map output from Depth Anything V2 Small
- PyTorch FP32/FP16 baseline
- TensorRT FP16 deployment
- Reproducible benchmark results

### Strong final result

- Obstacle-warning or navigation demonstration
- Accuracy validation against measured distances or an RGB-D sensor
- Performance graphs across input resolutions and power modes
- Analysis of accuracy versus throughput, latency, power, and temperature

### Stretch goals

- TensorRT INT8 quantization
- ROS 2 depth-image publishing
- Depth-aware object detection
- Comparison with stereo or RGB-D depth
- Approximate metric depth using calibration

## Expected contribution

The project will produce a reproducible deployment workflow and a measured account of how well Depth Anything V2 Small performs on the Jetson Orin Nano Super. The contribution lies in optimization, systems integration, and evaluation rather than in training a new foundation model.

## Success criteria

- The system processes a live camera stream without exhausting device memory.
- TensorRT FP16 improves inference performance over the PyTorch baseline.
- Benchmarks report both model inference time and end-to-end latency.
- Depth quality before and after conversion is compared quantitatively or through a controlled validation protocol.
- The final demonstration connects the depth output to a practical task.

## Related notes

- [[Model and Hardware]]
- [[Deployment Plan]]
- [[Evaluation Plan]]
- [[Risks and Limitations]]

