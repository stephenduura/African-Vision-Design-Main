---
name: Image background removal can silently no-op
description: remove_image_background_tool may report success while returning the original image; always visually verify output.
---

The `remove_image_background_tool` can report "Successfully removed background" yet return an image that is effectively the original (background intact). This happens on photos where the subject blends into the background — e.g. a person in a white shirt against a bright, busy indoor scene.

**Why:** the underlying service fails to segment low-contrast subject/background edges, and the failure is not surfaced as an error.

**How to apply:** after every background removal, open the output with the `read` tool (image preview) and confirm the background is actually transparent before wiring it into the app. If it failed, retrying the same photo usually fails again — ask the user for a clearer photo (plain background) or fall back to using the photo as-is / a solid-color card.
