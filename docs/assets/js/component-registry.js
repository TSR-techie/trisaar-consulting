import Hero from "../modules/hero/hero.js";
import Publication from "../modules/publication/publication.js";
import ExecutiveSummary from "../modules/executive-summary/executiveSummary.js";
import Challenge from "../modules/challenge/challenge.js";
import Approach from "../modules/approach/approach.js";
import Outcomes from "../modules/outcomes/outcomes.js";
import Cta from "../modules/cta/cta.js";

export const ComponentRegistry = {
    hero: Hero,
    publication: Publication,
    executiveSummary: ExecutiveSummary,
    challenge: Challenge,
    approach: Approach,
    outcomes: Outcomes,
    cta: Cta
};
