#!/usr/bin/env bash
# Launch Pixel 5 AVD with best available GPU on Ubuntu NVIDIA hybrid setup.
# Automatically detects whether NVIDIA PRIME render offload is available and
# falls back to the emulator's own auto-detection if it is not.

EMULATOR="$HOME/Android/Sdk/emulator/emulator"
AVD_NAME="Pixel_6_Pro"

if [ ! -f "$EMULATOR" ]; then
  echo "[emulator] ERROR: Emulator binary not found at $EMULATOR"
  exit 1
fi

# Detect whether the NVIDIA discrete GPU is active and the ICD is present.
NVIDIA_ICD="/usr/share/vulkan/icd.d/nvidia_icd.json"
NVIDIA_AVAILABLE=false

if command -v nvidia-smi &>/dev/null && nvidia-smi &>/dev/null; then
  if [ -f "$NVIDIA_ICD" ]; then
    NVIDIA_AVAILABLE=true
  fi
fi

if [ "$NVIDIA_AVAILABLE" = true ]; then
  echo "[emulator] NVIDIA GPU detected — enabling PRIME render offload."

  # PRIME render offload: redirect GL/Vulkan calls to the discrete NVIDIA GPU.
  export __NV_PRIME_RENDER_OFFLOAD=1
  export __NV_PRIME_RENDER_OFFLOAD_PROVIDER=NVIDIA-G0
  export __GLX_VENDOR_LIBRARY_NAME=nvidia
  export VK_ICD_FILENAMES="$NVIDIA_ICD"

  GPU_FLAG="-gpu host"
else
  echo "[emulator] NVIDIA PRIME not available — letting the emulator choose GPU mode."
  GPU_FLAG="-gpu auto"
fi

echo "[emulator] Starting $AVD_NAME..."

# shellcheck disable=SC2086
exec "$EMULATOR" \
  -avd "$AVD_NAME" \
  $GPU_FLAG \
  -memory 4096 \
  -no-boot-anim \
  "$@"
