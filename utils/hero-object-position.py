#!/usr/bin/env python3
"""
A script returning the desired css calc cunction for the object-position property for the hero shot.
That function is made so the hero shot crops nicely on all screen ratios,
so the desired part of it is always in the spotlight.
For the simplicity sake (and bc it works on our hero shot), the vertical object position is 50%
"""

from __future__ import annotations
from dataclasses import dataclass

@dataclass
class Rectangle:
    w: int
    parent: Rectangle = None
    x: int = 0

    def __post_init__(self):
        if self.parent is None:
            self.parent = self

    def obj_pos(self):
        if self.w == self.parent.w:
            return 0.5
        return self.x / (self.parent.w - self.w)

    def provided_width_ratio(self):
        return self.w / self.parent.w

shot = Rectangle(2560)
subshots = [
    Rectangle(648, shot, 779), # phone screen sized sliver
    Rectangle(1126, shot, 777), # ppl
    Rectangle(1450, shot, 456), # most meaningful stuff (no cat)
    Rectangle(1704, shot, 450), # meaningful stuff
    shot, # full
]

def pct(x: float) -> str:
    return f"{x * 100:.3f}%"

def main():
    # for i in subshots:
    #     print(i.x, "\t", i.x + i.w)

    prev_pos = subshots[0].obj_pos()
    prev_ratio = subshots[0].provided_width_ratio()
    parts = ["", pct(prev_pos)]
    for r in subshots[1:]:
        next_pos = r.obj_pos()
        next_ratio = r.provided_width_ratio()
        k = (next_pos - prev_pos) / (next_ratio - prev_ratio)
        k_str = f"+ {pct(k)}" if k >= 0 else f"- {pct(-k)}"
        ratio_str = f"clamp(0, calc(var(--visible-img-part) - {prev_ratio:.3f}), {next_ratio - prev_ratio:.3f})"
        parts.append(f"{k_str} * {ratio_str}")
        # print(prev_pos, next_pos, prev_ratio, next_ratio)
        # print(prev_pos, parts[-1])
        prev_pos = next_pos
        prev_ratio = next_ratio
    formula = (
        "      --visible-img-part: calc(1cqi / 1cqh / var(--hero-img-aspect-ratio));\n"
        "      object-position: calc(" + "\n        ".join(parts) + "\n      );\n"
    )
    print(formula)

if __name__ == "__main__":
    main()
