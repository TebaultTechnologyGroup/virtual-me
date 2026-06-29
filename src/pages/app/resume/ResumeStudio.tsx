import type {
  ResumePhase,
  ResumeRow,
  ResumeConfigParams,
  FromValue,
} from "./types";
import type { ApplicationRecord } from "../applications/types";

interface ResumeStudioProps {
  from: FromValue;
  roleId: string; // This is the target role Id
  application: ApplicationRecord | null; // this is the application Id
}

export default function ResumeStudio({
  from,
  roleId,
  application,
}: ResumeStudioProps) {
  console.log(from, roleId, application);
  return <div> Resume Studio</div>;
}
