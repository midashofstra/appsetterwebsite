import {
  faCalendarCheck,
  faComments,
  faDatabase,
  faLightbulb,
  faMagnifyingGlass,
  faPaperPlane,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type HowItWorksFlowStepDef = {
  icon: IconDefinition;
  /** Labels live in dict.channels.flowSteps (same order). */
};

/** Fixed order: Find → Add → Contact → Conversation → Book → Learn → CRM */
export const HOW_IT_WORKS_FLOW_STEP_ICONS: HowItWorksFlowStepDef[] = [
  { icon: faMagnifyingGlass },
  { icon: faUserPlus },
  { icon: faPaperPlane },
  { icon: faComments },
  { icon: faCalendarCheck },
  { icon: faLightbulb },
  { icon: faDatabase },
];

/* Legacy six-step icons (Leads → First contact → … → Learn):
import { faUsers } from "@fortawesome/free-solid-svg-icons";
export const HOW_IT_WORKS_FLOW_STEP_ICONS = [
  { icon: faUsers },
  { icon: faPaperPlane },
  { icon: faComments },
  { icon: faCalendarCheck },
  { icon: faDatabase },
  { icon: faLightbulb },
];
*/
