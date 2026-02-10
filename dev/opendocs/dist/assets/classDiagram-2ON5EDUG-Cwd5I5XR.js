import { s as styles_default, c as classRenderer_v3_unified_default, a as classDiagram_default, C as ClassDB } from "./chunk-B4BG7PRW-DZMZ09Kh.js";
import { _ as __name } from "./index-DC98Pfdd.js";
import "./chunk-FMBD7UC4-B1W7I1EZ.js";
import "./chunk-55IACEB6-DDaeyECq.js";
import "./chunk-QN33PNHL-DRhKTVDy.js";
var diagram = {
  parser: classDiagram_default,
  get db() {
    return new ClassDB();
  },
  renderer: classRenderer_v3_unified_default,
  styles: styles_default,
  init: /* @__PURE__ */ __name((cnf) => {
    if (!cnf.class) {
      cnf.class = {};
    }
    cnf.class.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }, "init")
};
export {
  diagram
};
