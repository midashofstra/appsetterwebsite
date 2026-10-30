import {
  faCalendarCheck,
  faComments,
  faDatabase,
  faLightbulb,
  faPaperPlane,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type HowItWorksFlowStepDef = {
  icon: IconDefinition;
  /** i18n key index — labels live in dict.channels.flowSteps */
};

/** Fixed order: Leads → First contact → Conversation → Meeting → CRM → Learn */
export const HOW_IT_WORKS_FLOW_STEP_ICONS: HowItWorksFlowStepDef[] = [
  { icon: faUsers },
  { icon: faPaperPlane },
  { icon: faComments },
  { icon: faCalendarCheck },
  { icon: faDatabase },
  { icon: faLightbulb },
];
