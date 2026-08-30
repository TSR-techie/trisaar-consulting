import Hero from "../modules/hero/hero.js";
import Publication from "../modules/publication/publication.js";
import ExecutiveSummary from "../modules/executive-summary/executiveSummary.js";
import Challenge from "../modules/challenge/challenge.js";
import Solution from "../modules/solution/solution.js";
import Impact from "../modules/impact/impact.js";
import Cta from "../modules/cta/cta.js";

export const ComponentRegistry = {
    hero: Hero,
    publication: Publication,
    executiveSummary: ExecutiveSummary,
    challenge: Challenge,
    solution: Solution,
    impact: Impact,
    cta: Cta
};
