/* */ 
"format cjs";
import dice from "./dice";
import slice from "./slice";

export default function(parent, x0, y0, x1, y1) {
  (parent.depth & 1 ? slice : dice)(parent, x0, y0, x1, y1);
}
